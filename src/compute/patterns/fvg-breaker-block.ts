import type { Candle, PatternResult, IndicatorSnapshot } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { rsi as calcRsi } from '@/compute/indicators/rsi';
import { vwapLast, vwapSessionPeriod } from '@/compute/indicators/vwap';
import { lastNonNull, volumeRatio } from '@/compute/indicators/helpers';
import { nextCandleConfirmation, intervalSeconds } from './pattern-context';
import {
  pickFreshUnbrokenFvgs,
  zoneAlreadyTriggered,
  vwapSideOk,
  rsiConfirmOk,
  ema50AlignedOk,
  atrNotSpiking,
  wickRatio,
  scoreFvgSignal,
  FVG_SCORE_MAX,
  FVG_SCORE_MIN_ENTRY,
  strengthForFvgScore,
} from './fvg-strategies-shared';

const MAX_AGE_BARS = 15;
const MIN_HISTORY = 30;
const MIN_WICK_RATIO = 0.35;

// Strategy B — "FVG + Breaker Block" (Усиленная), doc §3:
//   - Price broke a key level (approximated here by hasBOSConfluence — the
//     FVG formed within BOS_CONFLUENCE_LOOKBACK_BARS of a same-direction
//     structural break, see smart-money.ts).
//   - A FVG formed in the breakout direction.
//   - On return to the FVG, a Breaker Block forms: a candle with a long
//     wick piercing the zone while its body stays outside it.
//   Signal: break of that wick in the direction of the original impulse —
//   modeled with the same next-candle confirmation logic used by the
//   engulfing/piercing-line pattern detectors (pattern-context.ts).
export function detectFvgBreakerBlock(
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
): PatternResult | null {
  if (candles.length < MIN_HISTORY) return null;

  const last = candles[candles.length - 1];
  const patternCandle = candles[candles.length - 2];
  const intervalSec = intervalSeconds(candles);

  // Аудит FVG 2026-10-04: при двойном совпадении (buy и sell) раньше всегда
  // побеждал buy (первый в цикле) — теперь выбирается сигнал с большей
  // confidence. Внутри направления перебираются ВСЕ свежие зоны (ближняя
  // первой), а не только последняя; одна зона — один сигнал.
  let best: PatternResult | null = null;
  const patternIdx = candles.length - 2;

  for (const wantType of ['bullish', 'bearish'] as const) {
    const direction: 'buy' | 'sell' = wantType === 'bullish' ? 'buy' : 'sell';

    const candidates = pickFreshUnbrokenFvgs(smartMoney.fvgs, wantType, patternCandle.time, intervalSec, MAX_AGE_BARS)
      .filter((f) => f.hasBOSConfluence);

    for (let k = candidates.length - 1; k >= 0; k--) {
      const fvg = candidates[k];

      // Геометрия breaker-свечи: фитиль вошёл в зону, ТЕЛО (и open, и close)
      // целиком снаружи неё на стороне исходного импульса, доминирующий фитиль.
      // Раньше проверялся только close — open мог лежать внутри зоны.
      const geometry = (c: Candle): boolean => {
        if (!(c.low <= fvg.top && c.high >= fvg.bottom)) return false;
        const bodyOutside = direction === 'buy'
          ? Math.min(c.open, c.close) >= fvg.top
          : Math.max(c.open, c.close) <= fvg.bottom;
        if (!bodyOutside) return false;
        return wickRatio(c, direction === 'buy' ? 'lower' : 'upper') >= MIN_WICK_RATIO;
      };
      if (!geometry(patternCandle)) continue;
      if (zoneAlreadyTriggered(candles, fvg.time, patternIdx, geometry)) continue;

      const wr = wickRatio(patternCandle, direction === 'buy' ? 'lower' : 'upper');

      const confirmation = nextCandleConfirmation(patternCandle, last, direction);
      if (!confirmation.confirmed) continue;

      const atrValue = snapshot?.atr ?? null;
      const rsiFast = lastNonNull(calcRsi(candles.map((c) => c.close), 7));
      const vwapValue = vwapLast(candles, vwapSessionPeriod(candles)).value;
      const ema50Value = snapshot?.emaSlow ?? null;
      const volRatio = volumeRatio(candles, candles.length - 1, 20);

      const score = scoreFvgSignal({
        emaAligned: ema50AlignedOk(direction, last.close, ema50Value),
        vwapAligned: vwapSideOk(direction, last.close, vwapValue),
        rsiConfirmed: rsiConfirmOk(direction, rsiFast),
        volumeConfirmed: volRatio > 1.5,
        // This strategy's own defining confluence is a dominant breaker wick.
        confluenceBonus: wr >= 0.6,
        atrNormal: atrNotSpiking(last, atrValue),
        sessionBoosted: session === 'london' || session === 'newyork' || session === 'overlap',
      });
      if (score < FVG_SCORE_MIN_ENTRY) continue;

      const confidence = Math.max(0, Math.min(1, (score / FVG_SCORE_MAX) * confirmation.multiplier));
      if (!best || confidence > best.confidence) {
        best = {
          name: 'fvg-breaker-block',
          direction,
          confidence,
          strength: strengthForFvgScore(confidence),
          time: last.time,
          volumeConfirmed: volRatio > 1.5,
          confirmedByNextCandle: true,
        };
      }
      break;
    }
  }

  return best;
}
