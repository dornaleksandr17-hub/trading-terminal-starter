/**
 * Диагностическая «воронка» гейтов детекторов — ТОЛЬКО для аудита.
 *
 * Проблема, которую решает: отчёт horizon-audit говорит «недостаточно
 * данных» / «нет срабатываний» у десятков детекторов, но не говорит, ГДЕ
 * именно детектор отсеивает кандидатов (геометрия? контекст тренда? сессия?
 * RSI? подтверждение следующей свечой? порог confidence?). Без этого
 * «ослабить гейт» — гадание, а каждая правка порога на тех же данных —
 * подгонка (см. docs/audit/WALK_FORWARD_PROTOCOL.md).
 *
 * Как устроено. Детектор вызывает `gate('имя:NN-этап')` сразу ПОСЛЕ каждой
 * проверки, которую кандидат прошёл. Вне трассировки `sink === null`, и вызов
 * — одна проверка на null (нулевые побочные эффекты, поведение детекторов
 * не меняется). Внутри `beginGateTrace()/endGateTrace()` считается, сколько
 * баров дошло до каждого этапа: разница соседних счётчиков — число отсеянных
 * на этом гейте. Первый этап (`…:00-evaluated`) = сколько раз детектор
 * вообще вызывался.
 *
 * Сейчас инструментированы: hammer, inverted-hammer, hanging-man,
 * shooting-star (single.ts), mean-reversion, tweezer-bottom/top (double.ts),
 * abandoned-baby-bottom/top (triple.ts), falling-three-methods
 * (continuation.ts), macd-deceleration-continuation, liquidity-sweep и
 * liquidity-sweep-reaction (внутренние вызовы свипа из реакции — отдельная группа
 * liquidity-sweep-inner, на бар приходится до двух таких вызовов). Остальные детекторы в
 * воронке НЕ участвуют — добавляйте `gate()` по тому же образцу.
 */
let sink: Map<string, number> | null = null;

export function beginGateTrace(): void {
  sink = new Map();
}

/** Завершает трассировку и возвращает счётчики (пустую карту, если трассировка не начиналась). */
export function endGateTrace(): Map<string, number> {
  const result = sink ?? new Map<string, number>();
  sink = null;
  return result;
}

export function isGateTraceActive(): boolean {
  return sink !== null;
}

export function gate(name: string): void {
  if (sink !== null) sink.set(name, (sink.get(name) ?? 0) + 1);
}

// Подмена имени детектора в gate-именах на время вызова. Нужна, когда один
// детектор вызывает другой внутри себя (liquidity-sweep-reaction → liquidity-sweep):
// без неё внутренние вызовы свипа смешались бы со standalone-свипом в одной группе.
let detectorOverride: string | null = null;

export function withGateDetector<T>(detector: string, fn: () => T): T {
  const prev = detectorOverride;
  detectorOverride = detector;
  try {
    return fn();
  } finally {
    detectorOverride = prev;
  }
}

/** gate() с именем детектора, которое можно подменить через withGateDetector. */
export function gateStage(detector: string, stage: string): void {
  if (sink !== null) gate(`${detectorOverride ?? detector}:${stage}`);
}
