import { describe, it, expect } from 'vitest';
import type { MarketStructure } from '@/types/domain';
import { ALL_FEATURES } from '@/types/domain';
import { detectAllPatterns } from '@/compute/patterns';
import { beginDiagnosticTrace, endDiagnosticTrace } from '@/compute/patterns/diagnostic-trace';
import { generateRandomWalk } from '../../../backtest/synthetic/random-walk';

// D3-измерение (2026-09-29): базовая частота классов HTF-множителя на каждом
// баре, независимо от паттернов. Поведение detectAllPatterns не меняется.

const struct = (over: Partial<MarketStructure>): MarketStructure => ({
  trend: 'up', bos: false, choch: false, swingHigh: 1.11, swingLow: 1.09, provisional: false, ...over,
});

const candles = generateRandomWalk({ bars: 1500, seed: 7, noiseFraction: 0.1 });
const FEATURES = [...ALL_FEATURES];

function run(override?: MarketStructure) {
  beginDiagnosticTrace();
  const result = detectAllPatterns(candles, FEATURES, undefined, undefined, undefined, 14, undefined, undefined, override);
  return { result, counts: endDiagnosticTrace() };
}

describe('htf-baseline: счётчики классов HTF-множителя на каждом баре', () => {
  it('BOS вверх: buy -> 1.00-bos, sell -> other; флаг bos посчитан', () => {
    const { counts } = run(struct({ trend: 'up', bos: true }));
    expect(counts.get('htf-baseline:bars')).toBe(1);
    expect(counts.get('htf-baseline:buy-1.00-bos')).toBe(1);
    expect(counts.get('htf-baseline:sell-other')).toBe(1);
    expect(counts.get('htf-baseline:trend-up')).toBe(1);
    expect(counts.get('htf-baseline:flag-bos')).toBe(1);
    expect(counts.get('htf-baseline:flag-choch')).toBeUndefined();
  });

  it('диапазон: обе стороны -> 0.40-range', () => {
    const { counts } = run(struct({ trend: 'range' }));
    expect(counts.get('htf-baseline:buy-0.40-range')).toBe(1);
    expect(counts.get('htf-baseline:sell-0.40-range')).toBe(1);
    expect(counts.get('htf-baseline:trend-range')).toBe(1);
  });

  it('без переопределения структуры: по одному классу на сторону на вызов', () => {
    const { counts } = run();
    const sum = (prefix: string) => [...counts].filter(([k]) => k.startsWith(prefix)).reduce((a, [, v]) => a + v, 0);
    expect(counts.get('htf-baseline:bars')).toBe(1);
    expect(sum('htf-baseline:buy-')).toBe(1);
    expect(sum('htf-baseline:sell-')).toBe(1);
    expect(sum('htf-baseline:trend-')).toBe(1);
  });

  it('трассировка не меняет результат детекторов', () => {
    const plain = detectAllPatterns(candles, FEATURES);
    const { result } = run();
    expect(JSON.stringify(result)).toBe(JSON.stringify(plain));
  });

  it('вне трассировки счётчики не копятся', () => {
    detectAllPatterns(candles, FEATURES);
    beginDiagnosticTrace();
    expect(endDiagnosticTrace().size).toBe(0);
  });
});
