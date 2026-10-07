import type { Signal, SignalOutcome } from '@/types/domain';

export interface SpreadAdjustedOutcome {
  outcome: SignalOutcome;
  spreadCostR: number;
}

// Правило тайм-аута (решение владельца, 2026-10): тайм-аут — ТОЛЬКО точное
// равенство цены открытия свечи входа и цены закрытия свечи экспирации
// (см. outcome-scheduler.ts::resolveOutcome и useDemoAccountStore.ts::
// resolveTrade). Раньше здесь победа с движением <= спред переразмечалась
// в 'timeout' — теперь исход передаётся как есть: любое ненулевое движение
// в нужную сторону это win, в обратную — loss. Спред учитывается только в
// spreadCostR (справочная метрика), но не меняет исход.
//
// Функция сохранена (а не удалена), чтобы не менять вызывающий код в
// tick-store/outcomes.ts.
export function applySpreadToOutcome(
  outcome: SignalOutcome,
  signal: Signal,
  spread: number,
  expiryClosePrice: number,
): SpreadAdjustedOutcome {
  const move = Math.abs(expiryClosePrice - signal.entryPrice);
  const spreadCostR = move > 0 ? spread / move : 0;
  return { outcome, spreadCostR };
}
