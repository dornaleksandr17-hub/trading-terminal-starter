import type { PatternResult, SignalStrength, SignalDirection } from '@/types/domain';
import { gate } from './gate-trace';
import { diagCount, isDiagnosticTraceActive, htfClassOf } from './diagnostic-trace';
import { isUngatedDiagActive, ungatedCandidate } from './ungated-diag';
import { clamp01, averageVolume, hasReliableVolume } from '@/compute/indicators/helpers';
import type { PatternContext } from './pattern-context';
import {
  sessionBoost,
  htfAlignment,
  volumeFactor,
  isAsiaOrClosed,
  nextCandleConfirmation,
  hasPrecedingBullish,
  hasPrecedingBearish,
  atrFactor,
  penetrationFactor,
  tweezerVolumeFactor,
} from './pattern-context';

const ENGULFING_THRESHOLD = 1.0;

function strengthForConfidence(confidence: number): SignalStrength {
  if (confidence >= 0.75) return 'strong';
  if (confidence >= 0.5) return 'moderate';
  return 'weak';
}

// ─────────────────────────────────────────────────────────────────────────
// Bullish / Bearish Engulfing — context-aware (HTF approximation, session,
// volume, ATR, optional next-candle confirmation).
// prevCandle = candles[index-1], curCandle = candles[index] (the engulfing
// candle itself), confirmCandle = candles[index+1] (optional 3rd-candle
// confirmation per the methodology — not mandatory, only a multiplier).
// ─────────────────────────────────────────────────────────────────────────

export function detectBullishEngulfing(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (prevCandle.close >= prevCandle.open) return null;
  if (curCandle.close <= curCandle.open) return null;
  if (curBody < prevBody * ENGULFING_THRESHOLD) return null;
  if (!(curCandle.open <= prevCandle.close && curCandle.close >= prevCandle.open)) return null;

  const direction: SignalDirection = 'buy';

  // Обязателен предшествующий противотрендовый (медвежий) импульс.
  if (!hasPrecedingBearish(candles, index - 1, 5) && structure.trend !== 'down') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  // BUGFIX (сверка 2026-09-20): раньше `avgVol > 0 ? … : 0` + жёсткий гейт
  // `volumeRatio < 1.0 → return null` делали детектор структурно мёртвым на
  // Deriv/форекс-фидах (volume ≡ 0 → avgVol = 0 → ratio = 0 → всегда null).
  // hasReliableVolume() отличает «объёма в окне нет вообще» от «объём есть и
  // низкий»: гейт применяется только при реальном объёме (пороги не менялись);
  // без объёма фильтр пропускается, множитель нейтрален (ratio = 1, как в
  // остальных детекторах), volumeConfirmed = false. Образец — impulse-breakout.ts.
  const volumeReliable = hasReliableVolume(candles, index, 20);
  const avgVol = averageVolume(candles, 20, index);
  const volumeRatio = volumeReliable ? (avgVol > 0 ? curCandle.volume / avgVol : 0) : 1;
  if (volumeReliable && volumeRatio < 1.0) return null;

  const atrValue = indicators?.atr ?? null;
  const curRange = curCandle.high - curCandle.low;
  if (atrValue != null && curRange < 0.8 * atrValue) return null;

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (conf.contradicted) return null;

  const upperWick = curCandle.high - Math.max(curCandle.open, curCandle.close);
  const lowerWick = Math.min(curCandle.open, curCandle.close) - curCandle.low;
  const shortWicks = curBody > 0 && (upperWick + lowerWick) < 0.15 * curBody;
  const fullWickEngulf = curCandle.high >= prevCandle.high && curCandle.low <= prevCandle.low;

  const bodyRatio = Math.min(3, curBody / (prevBody || 1e-9));
  const base = clamp01(
    Math.min(0.30, bodyRatio * 0.10) +
    (fullWickEngulf ? 0.10 : 0) +
    (shortWicks ? 0.10 : 0),
  );

  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volumeFactor(volumeRatio)
    * conf.multiplier
    * atrFactor(curRange, atrValue),
  );

  if (confidence < 0.55) return null;

  return {
    name: 'bullish-engulfing',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    volumeConfirmed: volumeReliable && volumeRatio >= 1.5,
    confirmedByNextCandle: conf.confirmed,
  };
}

export function detectBearishEngulfing(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (prevCandle.close <= prevCandle.open) return null;
  if (curCandle.close >= curCandle.open) return null;
  if (curBody < prevBody * ENGULFING_THRESHOLD) return null;
  if (!(curCandle.open >= prevCandle.close && curCandle.close <= prevCandle.open)) return null;

  const direction: SignalDirection = 'sell';

  // Обязателен предшествующий противотрендовый (бычий) импульс.
  if (!hasPrecedingBullish(candles, index - 1, 5) && structure.trend !== 'up') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  // BUGFIX (сверка 2026-09-20): раньше `avgVol > 0 ? … : 0` + жёсткий гейт
  // `volumeRatio < 1.0 → return null` делали детектор структурно мёртвым на
  // Deriv/форекс-фидах (volume ≡ 0 → avgVol = 0 → ratio = 0 → всегда null).
  // hasReliableVolume() отличает «объёма в окне нет вообще» от «объём есть и
  // низкий»: гейт применяется только при реальном объёме (пороги не менялись);
  // без объёма фильтр пропускается, множитель нейтрален (ratio = 1, как в
  // остальных детекторах), volumeConfirmed = false. Образец — impulse-breakout.ts.
  const volumeReliable = hasReliableVolume(candles, index, 20);
  const avgVol = averageVolume(candles, 20, index);
  const volumeRatio = volumeReliable ? (avgVol > 0 ? curCandle.volume / avgVol : 0) : 1;
  if (volumeReliable && volumeRatio < 1.0) return null;

  const atrValue = indicators?.atr ?? null;
  const curRange = curCandle.high - curCandle.low;
  if (atrValue != null && curRange < 0.8 * atrValue) return null;

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (conf.contradicted) return null;

  const upperWick = curCandle.high - Math.max(curCandle.open, curCandle.close);
  const lowerWick = Math.min(curCandle.open, curCandle.close) - curCandle.low;
  const shortWicks = curBody > 0 && (upperWick + lowerWick) < 0.15 * curBody;
  const fullWickEngulf = curCandle.high >= prevCandle.high && curCandle.low <= prevCandle.low;

  const bodyRatio = Math.min(3, curBody / (prevBody || 1e-9));
  const base = clamp01(
    Math.min(0.30, bodyRatio * 0.10) +
    (fullWickEngulf ? 0.10 : 0) +
    (shortWicks ? 0.10 : 0),
  );

  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volumeFactor(volumeRatio)
    * conf.multiplier
    * atrFactor(curRange, atrValue),
  );

  if (confidence < 0.55) return null;

  return {
    name: 'bearish-engulfing',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    volumeConfirmed: volumeReliable && volumeRatio >= 1.5,
    confirmedByNextCandle: conf.confirmed,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Bullish / Bearish Harami — context-aware (BUGFIX аудит 2026-09-12: раньше
// был явно помечен "UNCHANGED (out of scope for this refactor)" и принимал
// только (prev, cur) — без единой проверки тренда, сессии, объёма или
// подтверждения, в отличие от каждого другого двухсвечного паттерна в этом
// файле. Harami — САМЫЙ слабый классический разворотный паттерн (второе
// тело — это не поглощение, а лишь сжатие/нерешительность внутри тела
// первой свечи), поэтому по методичке он требует минимум того же уровня
// строгости, что Tweezer: обязательный предшествующий контр-трендовый
// импульс, запрет Азии/закрытого рынка, классический объёмный признак
// самого паттерна (падение объёма на 2-й свече относительно 1-й —
// признак истощения, а не силы) и ОБЯЗАТЕЛЬНОЕ подтверждение 3-й свечой
// ("золотое правило" — без него паттерн остаётся просто предупреждением,
// не сигналом на вход). Без этих фильтров детектор ранее давал "buy"/"sell"
// на любом сжатии тела независимо от контекста — прямой источник ложных
// сигналов, дополнительно усиленный принудительным полом confidence 0.5 в
// PATTERN_CONFIDENCE_HIERARCHY (см. index.ts).
// ─────────────────────────────────────────────────────────────────────────

export function detectBullishHarami(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (prevCandle.close >= prevCandle.open) return null;
  if (curCandle.close <= curCandle.open) return null;
  if (curBody >= prevBody) return null;
  if (!(curCandle.open >= prevCandle.close && curCandle.close <= prevCandle.open)) return null;

  const direction: SignalDirection = 'buy';

  // Мать-свеча должна быть реальным импульсом, а не шумом.
  const atrValue = indicators?.atr ?? null;
  if (atrValue != null && prevBody < 0.5 * atrValue) return null;

  if (!hasPrecedingBearish(candles, index - 1, 5) && structure.trend !== 'down') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  // Классический объёмный признак Harami: 2-я свеча ДОЛЖНА показывать
  // падение объёма относительно 1-й (истощение продавцов/нерешительность),
  // а не агрессивную активность — иначе это уже не Harami, а начало
  // поглощения. Если объём 2-й свечи выше, чем у 1-й — инвалидатор.
  const volRatio = prevCandle.volume > 0 ? curCandle.volume / prevCandle.volume : 1;
  if (volRatio > 1.0) return null;
  const volFactor = volRatio < 0.5 ? 1.15 : volRatio < 0.8 ? 1.05 : 0.95;

  // Обязательное подтверждение — золотое правило: сам по себе Harami это
  // предупреждение о нерешительности, а не сигнал на вход.
  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (!conf.confirmed || conf.contradicted) return null;

  const base = clamp01(0.30 + (1 - curBody / prevBody) * 0.20);
  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volFactor
    * conf.multiplier,
  );

  if (isUngatedDiagActive()) ungatedCandidate('bullish-harami', 'buy', confidence, 0.45, htfAlignment(htfStructure, direction));
  if (confidence < 0.45) return null;

  return {
    name: 'bullish-harami',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    confirmedByNextCandle: true,
  };
}

export function detectBearishHarami(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (prevCandle.close <= prevCandle.open) return null;
  if (curCandle.close >= curCandle.open) return null;
  if (curBody >= prevBody) return null;
  if (!(curCandle.open <= prevCandle.close && curCandle.close >= prevCandle.open)) return null;

  const direction: SignalDirection = 'sell';

  const atrValue = indicators?.atr ?? null;
  if (atrValue != null && prevBody < 0.5 * atrValue) return null;

  if (!hasPrecedingBullish(candles, index - 1, 5) && structure.trend !== 'up') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  const volRatio = prevCandle.volume > 0 ? curCandle.volume / prevCandle.volume : 1;
  if (volRatio > 1.0) return null;
  const volFactor = volRatio < 0.5 ? 1.15 : volRatio < 0.8 ? 1.05 : 0.95;

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (!conf.confirmed || conf.contradicted) return null;

  const base = clamp01(0.30 + (1 - curBody / prevBody) * 0.20);
  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volFactor
    * conf.multiplier,
  );

  if (isUngatedDiagActive()) ungatedCandidate('bearish-harami', 'sell', confidence, 0.45, htfAlignment(htfStructure, direction));
  if (confidence < 0.45) return null;

  return {
    name: 'bearish-harami',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    confirmedByNextCandle: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Piercing Line / Dark Cloud Cover — context-aware. Strict 50% penetration
// rule preserved. Confirmation is optional (multiplier only, not a gate),
// except an explicit contradiction from the confirming candle cancels it.
// ─────────────────────────────────────────────────────────────────────────

export function detectPiercingLine(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  if (prevCandle.close >= prevCandle.open) return null;
  if (curCandle.close <= curCandle.open) return null;
  if (curCandle.open >= prevCandle.low) return null;
  const midpoint = (prevCandle.open + prevCandle.close) / 2;
  if (curCandle.close <= midpoint) return null;
  if (curCandle.close >= prevCandle.open) return null;

  const direction: SignalDirection = 'buy';
  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const atrValue = indicators?.atr ?? null;
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (atrValue != null && (prevBody < 0.5 * atrValue || curBody < 0.5 * atrValue)) return null;

  if (!hasPrecedingBearish(candles, index - 1, 5) && structure.trend !== 'down') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  // BUGFIX (сверка 2026-09-20): раньше `avgVol > 0 ? … : 0` + жёсткий гейт
  // `volumeRatio < 1.3 → return null` делали детектор структурно мёртвым на
  // Deriv/форекс-фидах (volume ≡ 0 → avgVol = 0 → ratio = 0 → всегда null).
  // hasReliableVolume() отличает «объёма в окне нет вообще» от «объём есть и
  // низкий»: гейт применяется только при реальном объёме (пороги не менялись);
  // без объёма фильтр пропускается, множитель нейтрален (ratio = 1, как в
  // остальных детекторах), volumeConfirmed = false. Образец — impulse-breakout.ts.
  const volumeReliable = hasReliableVolume(candles, index, 20);
  const avgVol = averageVolume(candles, 20, index);
  const volumeRatio = volumeReliable ? (avgVol > 0 ? curCandle.volume / avgVol : 0) : 1;
  if (volumeReliable && volumeRatio < 1.3) return null;

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (conf.contradicted) return null;

  const prevBodyBottom = Math.min(prevCandle.open, prevCandle.close);
  const penetrationRatio = prevBody > 0 ? (curCandle.close - prevBodyBottom) / prevBody : 0;

  const base = 0.50;
  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volumeFactor(volumeRatio)
    * penetrationFactor(penetrationRatio)
    * conf.multiplier,
  );

  if (confidence < 0.5) return null;

  return {
    name: 'piercing-line',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    volumeConfirmed: volumeReliable && volumeRatio >= 1.5,
    confirmedByNextCandle: conf.confirmed,
  };
}

export function detectDarkCloudCover(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;

  if (prevCandle.close <= prevCandle.open) return null;
  if (curCandle.close >= curCandle.open) return null;
  if (curCandle.open <= prevCandle.high) return null;
  const midpoint = (prevCandle.open + prevCandle.close) / 2;
  if (curCandle.close >= midpoint) return null;
  if (curCandle.close <= prevCandle.open) return null;

  const direction: SignalDirection = 'sell';
  const prevBody = Math.abs(prevCandle.close - prevCandle.open);
  const atrValue = indicators?.atr ?? null;
  const curBody = Math.abs(curCandle.close - curCandle.open);
  if (atrValue != null && (prevBody < 0.5 * atrValue || curBody < 0.5 * atrValue)) return null;

  if (!hasPrecedingBullish(candles, index - 1, 5) && structure.trend !== 'up') return null;
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;

  // BUGFIX (сверка 2026-09-20): раньше `avgVol > 0 ? … : 0` + жёсткий гейт
  // `volumeRatio < 1.3 → return null` делали детектор структурно мёртвым на
  // Deriv/форекс-фидах (volume ≡ 0 → avgVol = 0 → ratio = 0 → всегда null).
  // hasReliableVolume() отличает «объёма в окне нет вообще» от «объём есть и
  // низкий»: гейт применяется только при реальном объёме (пороги не менялись);
  // без объёма фильтр пропускается, множитель нейтрален (ratio = 1, как в
  // остальных детекторах), volumeConfirmed = false. Образец — impulse-breakout.ts.
  const volumeReliable = hasReliableVolume(candles, index, 20);
  const avgVol = averageVolume(candles, 20, index);
  const volumeRatio = volumeReliable ? (avgVol > 0 ? curCandle.volume / avgVol : 0) : 1;
  if (volumeReliable && volumeRatio < 1.3) return null;

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (conf.contradicted) return null;

  const prevBodyTop = Math.max(prevCandle.open, prevCandle.close);
  const penetrationRatio = prevBody > 0 ? (prevBodyTop - curCandle.close) / prevBody : 0;

  const base = 0.50;
  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * volumeFactor(volumeRatio)
    * penetrationFactor(penetrationRatio)
    * conf.multiplier,
  );

  if (confidence < 0.5) return null;

  return {
    name: 'dark-cloud-cover',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    volumeConfirmed: volumeReliable && volumeRatio >= 1.5,
    confirmedByNextCandle: conf.confirmed,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Tweezer Bottom / Tweezer Top — context-aware. Per the methodology's
// explicit "golden rule" ("never enter without 3rd-candle confirmation —
// on its own, the pattern is only a warning"), confirmation is MANDATORY
// here (same treatment as Hanging Man / Inverted Hammer): no confirmation
// means no signal at all, not just a lower confidence.
// ─────────────────────────────────────────────────────────────────────────

const TWEEZER_TOLERANCE = 0.001;

// D3-измерение (только диагностика, поведение детекторов НЕ меняется).
// Воронка показала: 32155 (bottom) / 32764 (top) кандидатов проходят
// gate 06-confirmation, и НИ ОДИН не проходит confidence >= 0.5. Что именно
// душит confidence — HTF-класс, RSI-корзина, объём (на Deriv volume ≡ 0, и
// tweezerVolumeFactor тогда константа 0.90) — воронка не различает.
// Счётчики пишутся ТОЛЬКО внутри диагностической трассировки
// (isDiagnosticTraceActive) и в отдельный канал diagCount, поэтому ни лишней
// работы вне аудита, ни влияния на gate-воронку нет. Имена без символа '|'
// (он ломает markdown-таблицу formatDiagnosticFunnel).
const TWEEZER_CONFIDENCE_THRESHOLD = 0.5;

function tweezerRsiBucket(rsi: number | null, side: 'buy' | 'sell'): string {
  if (rsi == null) return 'na';
  if (side === 'buy') return rsi < 30 ? 'lt30' : rsi <= 35 ? '30-35' : '35-50';
  return rsi > 70 ? 'gt70' : rsi >= 65 ? '65-70' : '50-65';
}

function tenthBucket(v: number): string {
  return (Math.floor(v * 10) / 10).toFixed(1);
}

function diagTweezerPreConfidence(
  name: 'tweezer-bottom' | 'tweezer-top',
  side: 'buy' | 'sell',
  p: {
    htfMultiplier: number;
    rsi: number | null;
    confirmMultiplier: number;
    volumeReliable: boolean;
    volumeFactor: number;
    confidence: number;
  },
): void {
  const htf = htfClassOf(p.htfMultiplier);
  const rsiB = tweezerRsiBucket(p.rsi, side);
  // Контрфактическая confidence с нейтральным объёмом (множитель 1.0) —
  // ровно то, что даёт остальным детекторам hasReliableVolume()=false.
  // volumeFactor >= 0.75 всегда, деление безопасно; при confidence < 1
  // (максимум формулы ≈ 0.73) клэмп не искажает результат.
  const neutral = clamp01(p.confidence / p.volumeFactor);
  diagCount(`${name}:07pre-htf-${htf}`);
  diagCount(`${name}:07pre-rsi-${rsiB}`);
  diagCount(`${name}:07pre-joint-htf${htf}+rsi-${rsiB}`);
  diagCount(`${name}:07pre-confirm-${p.confirmMultiplier >= 1.2 ? 'strong' : 'weak'}`);
  diagCount(`${name}:07pre-volume-${p.volumeReliable ? 'real' : 'none'}`);
  diagCount(`${name}:07pre-confidence-${tenthBucket(p.confidence)}`);
  diagCount(`${name}:07pre-confidence-volneutral-${tenthBucket(neutral)}`);
  diagCount(`${name}:07pre-passes-actual-${p.confidence >= TWEEZER_CONFIDENCE_THRESHOLD}`);
  diagCount(`${name}:07pre-passes-volneutral-${neutral >= TWEEZER_CONFIDENCE_THRESHOLD}`);
}

export function detectTweezerBottom(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;
  gate('tweezer-bottom:00-evaluated');

  const tolerance = Math.max(prevCandle.low, curCandle.low) * TWEEZER_TOLERANCE;
  if (Math.abs(prevCandle.low - curCandle.low) > tolerance) return null;
  gate('tweezer-bottom:01-twin-extreme');
  if (curCandle.close <= curCandle.open) return null;
  gate('tweezer-bottom:02-body-direction');

  const direction: SignalDirection = 'buy';

  if (!hasPrecedingBearish(candles, index - 1, 5) && structure.trend !== 'down') return null;
  gate('tweezer-bottom:03-trend-context');
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;
  gate('tweezer-bottom:04-session');

  const rsi = indicators?.rsi ?? null;
  if (rsi != null && rsi > 50) return null;
  gate('tweezer-bottom:05-rsi');

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (!conf.confirmed) return null; // обязательное подтверждение — золотое правило методички
  gate('tweezer-bottom:06-confirmation');

  const base = 0.40;
  const rsiFactor = rsi == null ? 1.0
    : rsi < 30 ? 1.10
    : rsi <= 35 ? 1.00
    : rsi <= 50 ? 0.85
    : 0.70;

  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * tweezerVolumeFactor(curCandle.volume, prevCandle.volume)
    * conf.multiplier
    * rsiFactor,
  );

  if (isDiagnosticTraceActive()) {
    diagTweezerPreConfidence('tweezer-bottom', 'buy', {
      htfMultiplier: htfAlignment(htfStructure, direction),
      rsi,
      confirmMultiplier: conf.multiplier,
      volumeReliable: hasReliableVolume(candles, index, 20),
      volumeFactor: tweezerVolumeFactor(curCandle.volume, prevCandle.volume),
      confidence,
    });
  }

  if (isUngatedDiagActive()) ungatedCandidate('tweezer-bottom', 'buy', confidence, TWEEZER_CONFIDENCE_THRESHOLD, htfAlignment(htfStructure, direction));
  if (confidence < 0.5) return null;
  gate('tweezer-bottom:07-confidence');

  return {
    name: 'tweezer-bottom',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    confirmedByNextCandle: true,
  };
}

export function detectTweezerTop(ctx: PatternContext): PatternResult | null {
  const { candles, index, structure, htfStructure, session, indicators } = ctx;
  const prevCandle = candles[index - 1];
  const curCandle = candles[index];
  const confirmCandle = candles[index + 1];
  if (!prevCandle || !curCandle || !confirmCandle) return null;
  gate('tweezer-top:00-evaluated');

  const tolerance = Math.max(prevCandle.high, curCandle.high) * TWEEZER_TOLERANCE;
  if (Math.abs(prevCandle.high - curCandle.high) > tolerance) return null;
  gate('tweezer-top:01-twin-extreme');
  if (curCandle.close >= curCandle.open) return null;
  gate('tweezer-top:02-body-direction');

  const direction: SignalDirection = 'sell';

  if (!hasPrecedingBullish(candles, index - 1, 5) && structure.trend !== 'up') return null;
  gate('tweezer-top:03-trend-context');
  if (isAsiaOrClosed(session, ctx.sessionAgnostic)) return null;
  gate('tweezer-top:04-session');

  const rsi = indicators?.rsi ?? null;
  if (rsi != null && rsi < 50) return null;
  gate('tweezer-top:05-rsi');

  const conf = nextCandleConfirmation(curCandle, confirmCandle, direction);
  if (!conf.confirmed) return null; // обязательное подтверждение — золотое правило методички
  gate('tweezer-top:06-confirmation');

  const base = 0.40;
  const rsiFactor = rsi == null ? 1.0
    : rsi > 70 ? 1.10
    : rsi >= 65 ? 1.00
    : rsi >= 50 ? 0.85
    : 0.70;

  const confidence = clamp01(
    base
    * htfAlignment(htfStructure, direction)
    * sessionBoost(session)
    * tweezerVolumeFactor(curCandle.volume, prevCandle.volume)
    * conf.multiplier
    * rsiFactor,
  );

  if (isDiagnosticTraceActive()) {
    diagTweezerPreConfidence('tweezer-top', 'sell', {
      htfMultiplier: htfAlignment(htfStructure, direction),
      rsi,
      confirmMultiplier: conf.multiplier,
      volumeReliable: hasReliableVolume(candles, index, 20),
      volumeFactor: tweezerVolumeFactor(curCandle.volume, prevCandle.volume),
      confidence,
    });
  }

  if (isUngatedDiagActive()) ungatedCandidate('tweezer-top', 'sell', confidence, TWEEZER_CONFIDENCE_THRESHOLD, htfAlignment(htfStructure, direction));
  if (confidence < 0.5) return null;
  gate('tweezer-top:07-confidence');

  return {
    name: 'tweezer-top',
    direction,
    confidence,
    strength: strengthForConfidence(confidence),
    time: confirmCandle.time,
    confirmedByNextCandle: true,
  };
}
