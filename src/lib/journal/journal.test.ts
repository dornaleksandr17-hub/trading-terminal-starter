import { describe, it, expect } from 'vitest';
import type { Signal } from '@/types/domain';
import { comparePeriod, hypothesisSignals, judge, stats, type Hypothesis } from './journal';

function sig(p: Partial<Signal>): Signal {
  return {
    id: Math.random().toString(36), symbolId: 'EURUSD', direction: 'buy', strength: 'moderate', score: 1,
    calibratedProbability: 0.55, entryPrice: 1, reason: '', indicators: {} as Signal['indicators'],
    pattern: 'fvg-return', time: 1_780_000_000, timeframe: '1m', outcome: 'win', frozenAt: null,
    isRevised: false, isPreClose: false, revisionNote: null, barsToResolve: 1, spread: null,
    spreadSource: null, recommendedExpiry: 60, featureVector: [], factors: [], rejectedPatterns: [],
    engineConfigSnapshot: {} as Signal['engineConfigSnapshot'], chartContext: {} as Signal['chartContext'],
    marketContext: { regime: 'trend', structure: { trend: 'up', bos: false, choch: false } as Signal['marketContext']['structure'], session: 'london' },
    ...p,
  };
}

describe('журнал форвард-тестов', () => {
  it('учитывает только сигналы после фиксации гипотезы и по её условиям', () => {
    const h: Hypothesis = { id: 'x', title: '', text: '', startAt: 1_780_000_000_000, conditions: { pattern: 'fvg-return' }, minTrades: 2 };
    const list = [
      sig({ time: 1_779_999_999 }), // до фиксации
      sig({ time: 1_780_000_100, pattern: 'inside-bar' }), // другой паттерн
      sig({ time: 1_780_000_200 }),
      sig({ time: 1_780_000_300, outcome: 'loss' }),
    ];
    const st = stats(hypothesisSignals(h, list));
    expect(st.decided).toBe(2);
    expect(st.winRatePct).toBe(50);
  });

  it('вердикт не выдаётся до минимума сделок', () => {
    expect(judge(stats([sig({})]), 10)).toBe('insufficient');
    expect(judge(stats(Array.from({ length: 20 }, (_, i) => sig({ outcome: i % 2 ? 'win' : 'loss' }))), 10)).toBe('fail');
  });

  it('фильтр по периоду и минимальному числу сделок', () => {
    const list = [
      sig({ time: 100 }), sig({ time: 200, outcome: 'loss' }), sig({ time: 300, pattern: 'inside-bar' }), sig({ time: 5000 }),
    ];
    const rows = comparePeriod(list, { fromMs: 0, toMs: 1_000_000, minTrades: 2, groupBy: 'pattern' });
    expect(rows.map((r) => r.key)).toEqual(['fvg-return']);
    expect(rows[0].decided).toBe(2);
  });
});
