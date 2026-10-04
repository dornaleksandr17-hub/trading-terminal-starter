import type { Candle, PatternResult, SignalStrength, IndicatorSnapshot, MarketStructure } from '@/types/domain';
import type { SessionRegime } from '@/compute/session-regime';
import { isHighLiquiditySession } from '@/compute/session-regime';
import { isAsiaOrClosed } from './pattern-context';
import { gate } from './gate-trace';
import { diagCount } from './diagnostic-trace';

function strengthForConfidence(confidence: number): SignalStrength {
  if (confidence >= 0.75) return 'strong';
  if (confidence >= 0.5) return 'moderate';
  return 'weak';
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

const ENTRY_THRESHOLD = 0.65;

// Stage 2 (F01/F03/F05): значения на баре ВЫХОДА за полосу (prev) и на баре
// перед ним. Считаются вызывающим по полным рядам индикаторов. Если не
// передан (тесты, старые вызовы) — прежнее поведение: RSI и полосы последнего
// бара, проверка «первого выхода» пропускается.
export interface MeanReversionExitContext {
  rsi: number | null;
  upper: number | null;
  lower: number | null;
  prev2Close: number | null;
  prev2Upper: number | null;
  prev2Lower: number | null;
}
const ADX_HARD_BLOCK = 25;

// Mean reversion: close beyond BB + RSI(7) in extreme zone (>75/<25) + first
// reversal bar — see bolt-prompt-8-strategies-replacement.md Phase 3.1
// ("СТРАТЕГИЯ «ВОЗВРАТ К СРЕДНЕМУ»"). `htfStructure` is the HTF-approximated
// structure (computeStructure(candles, ~60), computed once by the caller —
// this detector no longer recomputes structure internally with a different
// lookback than the rest of the pipeline).
export function detectMeanReversion(
  candles: Candle[],
  snapshot: IndicatorSnapshot,
  rsiShort: number | null,
  session?: SessionRegime,
  htfStructure?: MarketStructure,
  // D1: см. PatternContext.sessionAgnostic в pattern-context.ts.
  sessionAgnostic?: boolean,
  exit?: MeanReversionExitContext,
): PatternResult | null {
  if (candles.length < 5) return null;
  gate('mean-reversion:00-evaluated');
  if (snapshot.bollingerUpper === null || snapshot.bollingerLower === null) return null;
  if (snapshot.bollingerMiddle === null) return null;
  if (snapshot.atr === null || snapshot.atr <= 0) return null;
  gate('mean-reversion:01-indicators');

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const atrValue = snapshot.atr;

  // ПРИОРИТЕТ №1 — BOS-блокировка: если HTF-структура подтверждает тренд
  // в ТОМ ЖЕ направлении, что и исходный пробой BB (prev — бар выхода за
  // полосу), это уже не флэт-истощение, а продолжение тренда — mean
  // reversion полностью подавляется (×0), без исключений.
  // ВАЖНО: сравнение ведётся по prev.close (бар выхода), а не по last.close
  // (бар возврата) — last.close по определению паттерна уже вернулся внутрь
  // полос, поэтому сравнение entryPrice=last.close с границами BB здесь
  // почти никогда не сработало бы.
  if (htfStructure?.bos) {
    if (htfStructure.trend === 'up' && prev.close > snapshot.bollingerUpper) return null;
    if (htfStructure.trend === 'down' && prev.close < snapshot.bollingerLower) return null;
  }

  gate('mean-reversion:02-no-bos-block');

  // Вторая линия обороны: сильный тренд по ADX запрещает вход в принципе,
  // даже если HTF BOS ещё не зафиксирован (более раннее предупреждение).
  if (snapshot.adx !== null && snapshot.adx > ADX_HARD_BLOCK) return null;
  gate('mean-reversion:03-adx');

  const prevRange = prev.high - prev.low || 1e-9;
  const lastRange = last.high - last.low || 1e-9;
  const prevBody = Math.abs(prev.close - prev.open);
  const lastBody = Math.abs(last.close - last.open);

  // Геометрия баров: выходной бар должен быть решительным (не доджи), бар
  // возврата — ещё более решительным, оба — не мельче типичного бара по ATR.
  if (prevBody < prevRange * 0.4) return null;
  if (lastBody < lastRange * 0.5) return null;
  if (prevRange < atrValue) return null;
  if (lastRange < atrValue * 0.8) return null;
  gate('mean-reversion:04-bar-geometry');

  const idealFlat = snapshot.adx !== null && snapshot.adx < 15;

  function finalizeConfidence(base: number, direction: 'buy' | 'sell'): PatternResult | null {
    let confidence = base;
    if (idealFlat) confidence *= 1.3;
    if (session && isHighLiquiditySession(session)) confidence *= 1.2;
    if (session && isAsiaOrClosed(session, sessionAgnostic)) confidence *= 0.6;
    if (lastBody < lastRange * 0.3) confidence *= 0.7;

    confidence = clamp01(confidence);

    // D3 п.7 (продолжение) — только измерение, поведение не меняется:
    // почему 27/27 кандидатов, прошедших band-exit+RSI (gate 05), не
    // доходят до gate 06 ни разу. Разбивка по бакетам base/confidence и по
    // тому, совпал ли idealFlat (ADX<15, главный буст ×1.3) с самим
    // событием пробоя полос — гипотеза: событие пробоя+RSI-экстремума
    // структурно антикоррелирует с "плоским" ADX<15, поэтому основной
    // буст confidence почти никогда не применяется одновременно с
    // триггером паттерна.
    diagCount(`mean-reversion:06pre-idealFlat-${idealFlat}`);
    diagCount(`mean-reversion:06pre-base-${(Math.floor(base * 10) / 10).toFixed(1)}`);
    diagCount(`mean-reversion:06pre-confidence-${(Math.floor(confidence * 10) / 10).toFixed(1)}`);

    if (confidence < ENTRY_THRESHOLD) return null;
    gate('mean-reversion:06-confidence');

    return {
      name: 'mean-reversion',
      direction,
      confidence,
      strength: strengthForConfidence(confidence),
      time: last.time,
    };
  }

  // F01: RSI(7) на баре выхода (prev), а не на баре возврата. F05: полоса,
  // с которой сравнивается закрытие prev, — полоса бара выхода; возврат
  // проверяется по полосе последнего бара.
  const rsiExit = exit ? exit.rsi : rsiShort;
  const lowerExit = exit?.lower ?? snapshot.bollingerLower;
  const upperExit = exit?.upper ?? snapshot.bollingerUpper;

  // Bullish mean reversion: close was below lower BB, now reverses back inside
  if (prev.close < lowerExit && last.close > snapshot.bollingerLower) {
    diagCount('mean-reversion:05a-band-exit-only-buy');
    // F03: первый выход — закрытие перед баром выхода было внутри полосы
    // (иначе «хождение по полосе» — сигнал продолжения, не истощения).
    const firstExit = exit?.prev2Close == null || exit.prev2Lower == null || exit.prev2Close >= exit.prev2Lower;
    // F04: фейд только если HTF-тренд не против сделки (buy — не при HTF down).
    const htfOk = htfStructure?.trend !== 'down';
    if (!firstExit) diagCount('mean-reversion:05c-band-walk-blocked-buy');
    if (!htfOk) diagCount('mean-reversion:05d-htf-against-buy');
    // F06: свеча возврата для buy обязана быть бычьей.
    if (firstExit && htfOk && last.close > last.open && rsiExit !== null && rsiExit < 25) {
      gate('mean-reversion:05-band-exit-rsi');
      diagCount('mean-reversion:05b-band-exit-and-rsi-buy');
      const depthBeyondBB = lowerExit - prev.close;
      const exitStrength = clamp01((depthBeyondBB / atrValue) / 2.0);
      const returnStrength = clamp01((lastBody / atrValue) / 1.5);
      const base = exitStrength * 0.5 + returnStrength * 0.5;
      const result = finalizeConfidence(base, 'buy');
      if (result) return result;
    }
  }

  // Bearish mean reversion: close was above upper BB, now reverses back inside
  if (prev.close > upperExit && last.close < snapshot.bollingerUpper) {
    diagCount('mean-reversion:05a-band-exit-only-sell');
    const firstExit = exit?.prev2Close == null || exit.prev2Upper == null || exit.prev2Close <= exit.prev2Upper;
    const htfOk = htfStructure?.trend !== 'up';
    if (!firstExit) diagCount('mean-reversion:05c-band-walk-blocked-sell');
    if (!htfOk) diagCount('mean-reversion:05d-htf-against-sell');
    // F06: зеркально — свеча возврата для sell обязана быть медвежьей.
    if (firstExit && htfOk && last.close < last.open && rsiExit !== null && rsiExit > 75) {
      gate('mean-reversion:05-band-exit-rsi');
      diagCount('mean-reversion:05b-band-exit-and-rsi-sell');
      const depthBeyondBB = prev.close - upperExit;
      const exitStrength = clamp01((depthBeyondBB / atrValue) / 2.0);
      const returnStrength = clamp01((lastBody / atrValue) / 1.5);
      const base = exitStrength * 0.5 + returnStrength * 0.5;
      const result = finalizeConfidence(base, 'sell');
      if (result) return result;
    }
  }

  return null;
}
