import { describe, expect, it } from 'vitest';
import { resolveBinaryOutcome } from './horizon-audit';

// BUGFIX (Фаза 3, "модель спреда для бинарного контракта"): раньше исход
// определялся сравнением close entry/expiry напрямую — тай засчитывался
// ТОЛЬКО при точном равенстве цен, чего на реальных котировках почти
// никогда не бывает. Живой/демо-путь (src/decision/apply-spread.ts::
// applySpreadToOutcome) считает тай при move <= spread. Этот тест
// воспроизводит расхождение: движение внутри спреда должно резолвиться
// как тай (0), а не как решённая победа/поражение.
describe('resolveBinaryOutcome — spread tie-zone (Фаза 3)', () => {
  it('move smaller than spread resolves as tie, not a decided win', () => {
    // buy, close вырос на 0.00005 при spread=0.00008 (EURUSD-подобный) —
    // движение не перекрывает спред: по факту реального выигрыша нет.
    expect(resolveBinaryOutcome(1.1000, 1.10005, 'buy', 0.00008)).toBe(0);
  });

  it('move exactly equal to spread resolves as tie (boundary, inclusive)', () => {
    expect(resolveBinaryOutcome(1.1000, 1.10008, 'buy', 0.00008)).toBe(0);
  });

  it('move larger than spread resolves as a decided win for buy', () => {
    expect(resolveBinaryOutcome(1.1000, 1.1010, 'buy', 0.00008)).toBe(1);
  });

  it('move larger than spread resolves as a decided loss for buy (price fell)', () => {
    expect(resolveBinaryOutcome(1.1000, 1.0990, 'buy', 0.00008)).toBe(-1);
  });

  it('sell direction is mirrored: price falling beyond spread is a win', () => {
    expect(resolveBinaryOutcome(1.1000, 1.0990, 'sell', 0.00008)).toBe(1);
    expect(resolveBinaryOutcome(1.1000, 1.1010, 'sell', 0.00008)).toBe(-1);
  });

  it('zero spread (symbol not in the static table) falls back to old exact-equality behaviour', () => {
    expect(resolveBinaryOutcome(1.1000, 1.1000, 'buy', 0)).toBe(0);
    expect(resolveBinaryOutcome(1.1000, 1.10001, 'buy', 0)).toBe(1);
  });
});
