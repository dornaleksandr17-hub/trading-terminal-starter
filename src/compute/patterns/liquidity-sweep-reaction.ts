import type { Candle, PatternResult, SignalStrength, MarketStructure } from '@/types/domain';
import { detectLiquiditySweep } from './liquidity-sweep';
import { lastNonNull, volumeRatio, hasReliableVolume } from '@/compute/indicators/helpers';
import { atr } from '@/compute/indicators/atr';
import type { SessionRegime } from '@/compute/session-regime';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { gateStage, withGateDetector } from './gate-trace';
import { nearestOppositeZonePrice, bosAlignsWithDirection, chochAlignsWithDirection } from './pattern-context';

function strengthForConfidence(confidence: number): SignalStrength {
  if (confidence >= 0.75) return 'strong';
  if (confidence >= 0.5) return 'moderate';
  return 'weak';
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

const ENTRY_THRESHOLD = 0.70;
const SWEEP_LOOKBACK = 20;

// Same recentHigh/recentLow window detectLiquiditySweep() uses internally,
// re-derived here (ending exclusive at `sweepIdx`) purely to sanity-check
// that an intermediate bar between the sweep and the displacement bar
// didn't re-invalidate the swept level (retest-and-fail).
function sweptLevel(candles: Candle[], sweepIdx: number, direction: 'buy' | 'sell'): number | null {
  const start = sweepIdx - SWEEP_LOOKBACK;
  if (start < 0) return null;
  const slice = candles.slice(start, sweepIdx);
  if (slice.length === 0) return null;
  return direction === 'buy'
    ? Math.min(...slice.map((c) => c.low))
    : Math.max(...slice.map((c) => c.high));
}

interface SweepFind {
  sweepIdx: number;
  sweepResult: PatternResult;
}

function findSweep(
  candles: Candle[],
  structure: MarketStructure,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
  atrPeriod: number,
  // F17: пробрасывается во внутренний detectLiquiditySweep, иначе стадия свипа
  // для крипты получала ×0.6 в азиатские часы, а одиночный liquidity-sweep — нет.
  sessionAgnostic?: boolean,
): SweepFind | null {
  // Try sweep 1 bar back (bar N-1 relative to the current last bar N).
  const oneBarBack = candles.slice(0, -1);
  const sweep1 = withGateDetector('liquidity-sweep-inner', () =>
    detectLiquiditySweep(oneBarBack, structure, session, smartMoney, 20, atrPeriod, sessionAgnostic),
  );
  if (sweep1) {
    return { sweepIdx: candles.length - 2, sweepResult: sweep1 };
  }

  // Try sweep 2 bars back — displacement is allowed within 1–2 bars per
  // the strategy document. The intermediate bar (candles.length - 2) must
  // not have re-invalidated (closed back through) the swept level.
  if (candles.length < 3) return null;
  const twoBarsBack = candles.slice(0, -2);
  const sweep2 = withGateDetector('liquidity-sweep-inner', () =>
    detectLiquiditySweep(twoBarsBack, structure, session, smartMoney, 20, atrPeriod, sessionAgnostic),
  );
  if (!sweep2) return null;

  const sweepIdx = candles.length - 3;
  const intermediate = candles[candles.length - 2];
  const level = sweptLevel(candles, sweepIdx, sweep2.direction);
  if (level !== null) {
    const reinvalidated = sweep2.direction === 'buy' ? intermediate.close < level : intermediate.close > level;
    if (reinvalidated) return null;
  }

  // F19: промежуточный бар не должен повторно уходить за экстремум свип-бара
  // (buy — ниже его low, sell — выше его high): иначе это новый, более глубокий
  // прокол, а не удержание уровня после свипа. Проверка по закрытию выше
  // (reinvalidated) этого не ловит — уход тенью при закрытии внутри проходил.
  const sweepBar2 = candles[sweepIdx];
  const reTookExtreme = sweep2.direction === 'buy'
    ? intermediate.low < sweepBar2.low
    : intermediate.high > sweepBar2.high;
  if (reTookExtreme) return null;

  return { sweepIdx, sweepResult: sweep2 };
}

// Liquidity sweep reaction: sweep followed by a displacement/confirmation
// candle (within 1–2 bars) in the reversal direction, with volume and
// structural (MSS/CHoCH) confirmation — see
// bolt-prompt-8-strategies-replacement.md Phase 1.2.
export function detectLiquiditySweepReaction(
  candles: Candle[],
  structure: MarketStructure,
  session: SessionRegime,
  smartMoney: SmartMoneyResult,
  atrPeriod: number = 14,
  // F17: см. PatternContext.sessionAgnostic в pattern-context.ts.
  sessionAgnostic?: boolean,
): PatternResult | null {
  gateStage('liquidity-sweep-reaction', '00-evaluated');
  if (candles.length < 22) return null;

  const found = findSweep(candles, structure, session, smartMoney, atrPeriod, sessionAgnostic);
  if (!found) return null;
  gateStage('liquidity-sweep-reaction', '01-sweep-found');
  const { sweepIdx, sweepResult } = found;
  const sweepBar = candles[sweepIdx];
  const direction = sweepResult.direction;

  const last = candles[candles.length - 1];
  const lastIdx = candles.length - 1;

  const atrArr = atr(candles, atrPeriod);
  const atrValue = lastNonNull(atrArr);
  if (atrValue === null || atrValue <= 0) return null;

  const body = Math.abs(last.close - last.open);
  const range = last.high - last.low || 1e-9;

  // Displacement must break beyond the sweep bar's extreme in the direction
  // of the reversal, with a body dominating the bar's own range.
  const brokeExtreme = direction === 'buy' ? last.close > sweepBar.high : last.close < sweepBar.low;
  if (!brokeExtreme) return null;
  gateStage('liquidity-sweep-reaction', '02-broke-extreme');
  // F19: бар смещения обязан идти в сторону разворота (buy — бычья свеча,
  // sell — медвежья): раньше хватало закрытия за экстремум свип-бара, и
  // медвежья свеча с гэпом вверх засчитывалась как бычье смещение.
  const displacementInDirection = direction === 'buy' ? last.close > last.open : last.close < last.open;
  if (!displacementInDirection) return null;
  gateStage('liquidity-sweep-reaction', '03-displacement-direction');
  // F19: и не должен уходить за экстремум свип-бара (buy — ниже его low, sell —
  // выше его high): это повторный, более глубокий прокол, а не реакция.
  const reTookExtreme = direction === 'buy' ? last.low < sweepBar.low : last.high > sweepBar.high;
  if (reTookExtreme) return null;
  gateStage('liquidity-sweep-reaction', '04-no-retake');
  // Этап 4 (решение владельца D7=2): убрана жёсткая нижняя граница тела бара
  // смещения «≥1 ATR» (на Binance она была главным отсевом после доминирования
  // тела: 68→14 на ETH). Число-замена не вводится: слабое тело по-прежнему
  // снижает confidence через displacementConfidence = body/ATR/2 и режется
  // ENTRY_THRESHOLD (0.70). Доминирование тела в диапазоне бара (≥0.6) не менялось.
  if (body < range * 0.6) return null;
  gateStage('liquidity-sweep-reaction', '05-body');

  // Volume tiering (audit finding #1) — same "not a hard gate on Forex"
  // logic as detectLiquiditySweep(): <1.5x is a hard block only when volume
  // is actually reliable; 1.5x-2.0x is allowed but penalized; >=2.0x is full
  // weight. When no real volume signal exists in the window (the normal case
  // for most spot-Forex REST feeds), the multiplier stays neutral (1.0) —
  // neither penalized nor boosted — and the detector relies entirely on the
  // structural conditions already checked above (displacement body, extreme
  // break, sweep depth, trend/reversal context).
  const volumeReliable = hasReliableVolume(candles, lastIdx, 20);
  const volRatio = volumeReliable ? volumeRatio(candles, lastIdx, 20) : null;
  if (volumeReliable && volRatio! < 1.5) return null;
  gateStage('liquidity-sweep-reaction', '06-volume');
  const volumeMultiplier = volumeReliable ? (volRatio! < 2.0 ? 0.7 : 1.0) : 1.0;

  // MSS/CHoCH confirmation in the direction of the reversal. BOS здесь НЕ
  // усиливает confidence (аудит findings #2/#5: один и тот же structure.bos уже
  // учтён с весом 2.0 в components.bos в direction-prediction.ts) — это только
  // условие снятия штрафа ×0.75 ниже.
  // BUGFIX (F15, аудит 2026-10-02): раньше structure.bos и structure.choch
  // читались без направления, хотя комментарий обещал «в направлении разворота»:
  // медвежий слом подтверждал бычью реакцию так же, как бычий. Теперь
  // подтверждает только слом в сторону сделки: BOS — bosAlignsWithDirection
  // (up→buy, down→sell; BOS в range без поля направления не подтверждает,
  // решение D2), CHoCH — chochAlignsWithDirection (down→buy, up→sell).
  const structureConfirmed =
    bosAlignsWithDirection(structure, direction) || chochAlignsWithDirection(structure, direction);

  const displacementConfidence = clamp01((body / atrValue) / 2.0);
  let confidence = (sweepResult.confidence + displacementConfidence) / 2;

  if (body >= atrValue * 1.5 && volumeReliable && volRatio! >= 2.5) confidence *= 1.3;
  if (!structureConfirmed) confidence *= 0.75;

  // BUGFIX (F16, аудит 2026-10-02): сессионный множитель (×0.6 / sessionBoost)
  // и OB/FVG-конфлюэнс уже входят в sweepResult.confidence (см.
  // detectLiquiditySweep) — раньше reaction умножала на них второй раз
  // (sessionBoost(session) и 1 + obFvgConfluenceBonus), то есть одно и то же
  // условие считалось дважды. Теперь они применяются один раз, внутри свипа.
  confidence *= volumeMultiplier;

  confidence = clamp01(confidence);
  if (confidence < ENTRY_THRESHOLD) return null;
  gateStage('liquidity-sweep-reaction', '07-confidence');

  // Structural SL/TP inputs (audit finding #6) — computed here (not in
  // signal-builder.ts) because smartMoney is already in scope, sparing the
  // decision layer from needing its own copy of the OB/FVG zone list just to
  // find a take-profit target. See computeLiquiditySweepTradeLevels in
  // trade-levels.ts for how these are consumed.
  const oppositeZonePrice = nearestOppositeZonePrice(smartMoney, last.close, direction);

  return {
    name: 'liquidity-sweep-reaction',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: last.time,
    // Honest volume confirmation (audit finding #1/#3) — previously a
    // hardcoded `true` regardless of actual volume, which fed
    // applyConfidenceHierarchy()'s +0.1 bonus in patterns/index.ts to every
    // surviving signal identically, whether volRatio was 1.5 or 4.0.
    volumeConfirmed: volumeReliable ? volRatio! >= 2.0 : false,
    sweepLow: sweepBar.low,
    sweepHigh: sweepBar.high,
    oppositeZonePrice,
    setupType: sweepResult.setupType,
  };
}
