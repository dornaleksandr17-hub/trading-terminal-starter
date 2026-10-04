import type { Candle, IndicatorSnapshot, PatternResult, SignalDirection } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import { rsi as calcRsi } from '@/compute/indicators/rsi';
import { vwapLast, vwapSessionPeriod } from '@/compute/indicators/vwap';
import { lastNonNull, volumeRatio } from '@/compute/indicators/helpers';
import {
  vwapSideOk,
  rsiConfirmOk,
  ema50AlignedOk,
  atrNotSpiking,
  scoreFvgSignal,
  FVG_SCORE_MAX,
  FVG_SCORE_MIN_ENTRY,
  strengthForFvgScore,
} from './fvg-strategies-shared';

// Общий «хвост» трёх новых M1-входов на FVG (fvg-htf-mss, fvg-sweep-return,
// fvg-inversion-retest): тот же скоринг и тот же порог FVG_SCORE_MIN_ENTRY,
// что у четырёх исходных FVG-стратегий — веса и порог НЕ менялись, меняется
// только условие входа (геометрия), см. docs/changelog/CHANGES_APPLIED_FVG_M1_ENTRY_IDEAS.md.
export function buildFvgEntryResult(
  name: 'fvg-htf-mss' | 'fvg-sweep-return' | 'fvg-inversion-retest',
  direction: SignalDirection,
  candles: Candle[],
  snapshot: IndicatorSnapshot | undefined,
  session: SessionRegime,
  confluenceBonus: boolean,
): PatternResult | null {
  const last = candles[candles.length - 1];
  const rsiFast = lastNonNull(calcRsi(candles.map((c) => c.close), 7));
  const vwapValue = vwapLast(candles, vwapSessionPeriod(candles)).value;
  const volRatio = volumeRatio(candles, candles.length - 1, 20);
  const volumeConfirmed = volRatio > 1.5;

  const score = scoreFvgSignal({
    emaAligned: ema50AlignedOk(direction, last.close, snapshot?.emaSlow ?? null),
    vwapAligned: vwapSideOk(direction, last.close, vwapValue),
    rsiConfirmed: rsiConfirmOk(direction, rsiFast),
    volumeConfirmed,
    confluenceBonus,
    atrNormal: atrNotSpiking(last, snapshot?.atr ?? null),
    sessionBoosted: session === 'london' || session === 'newyork' || session === 'overlap',
  });
  if (score < FVG_SCORE_MIN_ENTRY) return null;

  const confidence = Math.max(0, Math.min(1, score / FVG_SCORE_MAX));
  return {
    name,
    direction,
    confidence,
    strength: strengthForFvgScore(confidence),
    time: last.time,
    volumeConfirmed,
  };
}

/** Выбор лучшего из двух направлений (buy/sell) по confidence. */
export function betterOf(a: PatternResult | null, b: PatternResult | null): PatternResult | null {
  if (!a) return b;
  if (!b) return a;
  return b.confidence > a.confidence ? b : a;
}
