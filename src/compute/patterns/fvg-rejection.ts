import type { Candle, PatternResult, IndicatorSnapshot } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { rsi as calcRsi } from '@/compute/indicators/rsi';
import { vwapLast, vwapSessionPeriod } from '@/compute/indicators/vwap';
import { lastNonNull, volumeRatio, hasReliableVolume } from '@/compute/indicators/helpers';
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
const MIN_WICK_RATIO = 0.5;
const MAX_BODY_TO_RANGE = 0.4;
const MIN_TOUCH_VOLUME_RATIO = 1.2; // doc §3D: "Объём на касании выше среднего"

// Strategy D — "FVG Rejection" (Отбой от границы), doc §3:
//   - Price touches the FVG's boundary (not deep inside — a rejection
//     happens at the edge).
//   - A Pin-bar/Doji forms: dominant wick, small body.
//   - Volume on the touch is above average.
//   Entry: on the close of the confirming candle.
export function detectFvgRejection(
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
): PatternResult | null {
  if (candles.length < MIN_HISTORY) return null;

  const last = candles[candles.length - 1];
  const patternCandle = candles[candles.length - 2];
  const patternIdx = candles.length - 2;
  const intervalSec = intervalSeconds(candles);

  // Аудит FVG 2026-10-04: выбор направления по большей confidence (а не
  // «buy первым»), перебор всех свежих зон, одна зона — один сигнал.
  let best: PatternResult | null = null;

  for (const wantType of ['bullish', 'bearish'] as const) {
    const direction: 'buy' | 'sell' = wantType === 'bullish' ? 'buy' : 'sell';

    const candidates = pickFreshUnbrokenFvgs(smartMoney.fvgs, wantType, patternCandle.time, intervalSec, MAX_AGE_BARS);

    for (let k = candidates.length - 1; k >= 0; k--) {
      const fvg = candidates[k];

      // Геометрия отбоя (без объёма и подтверждения): касание границы зоны
      // и форма пин-бара/доджи. Тот же предикат определяет «зона уже
      // отработана более ранним отбоем».
      const geometry = (c: Candle): boolean => {
        const boundary = direction === 'buy' ? fvg.top : fvg.bottom;
        const touched = direction === 'buy'
          ? c.low <= boundary && c.low >= fvg.bottom
          : c.high >= boundary && c.high <= fvg.top;
        if (!touched) return false;
        const rng = c.high - c.low || 1e-9;
        const bd = Math.abs(c.close - c.open);
        return wickRatio(c, direction === 'buy' ? 'lower' : 'upper') >= MIN_WICK_RATIO && bd / rng <= MAX_BODY_TO_RANGE;
      };
      if (!geometry(patternCandle)) continue;
      if (zoneAlreadyTriggered(candles, fvg.time, patternIdx, geometry)) continue;

      // BUGFIX (сверка 2026-09-21): раньше это был безусловный `volumeRatio()
      // < MIN_TOUCH_VOLUME_RATIO(1.2)` жёсткий гейт. На Deriv/форекс-фидах
      // (volume ≡ 0 в окне) volumeRatio() возвращает нейтральную заглушку 1,
      // а 1 < 1.2 всегда истинно — fvg-rejection не мог сработать НИ РАЗУ.
      // hasReliableVolume() отличает «объёма в окне нет» от «объём есть и
      // ниже требуемого»: гейт применяется только когда есть на что
      // опереться (volumeConfirmed = false иначе, честно).
      const volumeReliable = hasReliableVolume(candles, patternIdx, 20);
      const touchVolRatio = volumeReliable ? volumeRatio(candles, patternIdx, 20) : null;
      if (volumeReliable && touchVolRatio! < MIN_TOUCH_VOLUME_RATIO) continue;

      const confirmation = nextCandleConfirmation(patternCandle, last, direction);
      if (!confirmation.confirmed) continue;

      const atrValue = snapshot?.atr ?? null;
      const rsiFast = lastNonNull(calcRsi(candles.map((c) => c.close), 7));
      const vwapValue = vwapLast(candles, vwapSessionPeriod(candles)).value;
      const ema50Value = snapshot?.emaSlow ?? null;
      const volumeConfirmed = volumeReliable ? touchVolRatio! >= 1.5 : false;

      const score = scoreFvgSignal({
        emaAligned: ema50AlignedOk(direction, last.close, ema50Value),
        vwapAligned: vwapSideOk(direction, last.close, vwapValue),
        rsiConfirmed: rsiConfirmOk(direction, rsiFast),
        volumeConfirmed,
        confluenceBonus: fvg.hasOBConfluence || fvg.hasBOSConfluence,
        atrNormal: atrNotSpiking(last, atrValue),
        sessionBoosted: session === 'london' || session === 'newyork' || session === 'overlap',
      });
      if (score < FVG_SCORE_MIN_ENTRY) continue;

      const confidence = Math.max(0, Math.min(1, (score / FVG_SCORE_MAX) * confirmation.multiplier));
      if (!best || confidence > best.confidence) {
        best = {
          name: 'fvg-rejection',
          direction,
          confidence,
          strength: strengthForFvgScore(confidence),
          time: last.time,
          // Честное значение: на волюм-less фидах volumeReliable=false.
          volumeConfirmed,
          confirmedByNextCandle: true,
        };
      }
      break;
    }
  }

  return best;
}
