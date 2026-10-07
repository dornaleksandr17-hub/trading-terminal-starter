import { describe, expect, it } from 'vitest';
import { resolveBinaryOutcome } from './horizon-audit';

// Правило тайм-аута (решение владельца, 2026-10): тай (0) — ТОЛЬКО при точном
// равенстве цены открытия свечи входа и цены закрытия свечи экспирации.
// Любое другое значение — win/loss по направлению; спред исход не меняет
// (раньше движение <= спред резолвилось как тай).
describe('resolveBinaryOutcome — тай только при open === close', () => {
  it('tiny move (внутри бывшей зоны спреда) — это win для buy, а не тай', () => {
    expect(resolveBinaryOutcome(1.1000, 1.10005, 'buy')).toBe(1);
  });

  it('tiny move против направления — это loss, а не тай', () => {
    expect(resolveBinaryOutcome(1.1000, 1.09995, 'buy')).toBe(-1);
    expect(resolveBinaryOutcome(1.1000, 1.10005, 'sell')).toBe(-1);
  });

  it('точное равенство цен — тай (0) для обоих направлений', () => {
    expect(resolveBinaryOutcome(1.1000, 1.1000, 'buy')).toBe(0);
    expect(resolveBinaryOutcome(1.1000, 1.1000, 'sell')).toBe(0);
  });

  it('buy: рост — win, падение — loss', () => {
    expect(resolveBinaryOutcome(1.1000, 1.1010, 'buy')).toBe(1);
    expect(resolveBinaryOutcome(1.1000, 1.0990, 'buy')).toBe(-1);
  });

  it('sell зеркален: падение — win, рост — loss', () => {
    expect(resolveBinaryOutcome(1.1000, 1.0990, 'sell')).toBe(1);
    expect(resolveBinaryOutcome(1.1000, 1.1010, 'sell')).toBe(-1);
  });
});
