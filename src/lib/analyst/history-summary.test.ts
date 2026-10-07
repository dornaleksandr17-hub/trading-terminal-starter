import { describe, it, expect } from 'vitest';
import type { Signal } from '@/types/domain';
import { summarizeSignalHistory, DEFAULT_BREAKEVEN_PCT } from './history-summary';

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

describe('summarizeSignalHistory', () => {
  it('винрейт = wins/(wins+losses), timeout и pending исключены', () => {
    const s = summarizeSignalHistory([
      sig({ outcome: 'win' }), sig({ outcome: 'loss' }), sig({ outcome: 'timeout' }), sig({ outcome: 'pending' }),
    ]);
    expect(s.decided).toBe(2);
    expect(s.winRatePct).toBe(50);
    expect(s.timeouts).toBe(1);
    expect(s.pending).toBe(1);
  });

  it('пустая история не падает и не выдумывает чисел', () => {
    const s = summarizeSignalHistory([]);
    expect(s.winRatePct).toBeNull();
    expect(s.byPattern).toEqual([]);
  });

  it('группирует по сессии и паттерну, безубыточность 55.56%', () => {
    const s = summarizeSignalHistory([
      sig({ outcome: 'win' }),
      sig({ outcome: 'loss', pattern: null, marketContext: { regime: 'range', structure: { trend: 'up', bos: false, choch: false } as Signal['marketContext']['structure'], session: 'tokyo' } }),
    ]);
    expect(s.bySession.map((g) => g.key).sort()).toEqual(['london', 'tokyo']);
    expect(s.byPattern.find((g) => g.key === 'без паттерна')?.decided).toBe(1);
    expect(DEFAULT_BREAKEVEN_PCT).toBe(55.6);
  });
});
