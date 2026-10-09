import { describe, expect, it } from 'vitest';
import { comparisonCsv, hypothesesCsv, outcomesCsv, toCsv } from '@/lib/journal/export';
import type { Signal } from '@/types/domain';

const sig = (over: Partial<Signal>): Signal => ({
  id: 's1', symbolId: 'EURUSD', timeframe: '1m', direction: 'buy',
  pattern: 'harmonic-pattern', time: 1_700_000_000, outcome: 'win',
  strength: 'strong', probability: 0.6,
  marketContext: { session: 'london' },
  ...over,
} as unknown as Signal);

describe('toCsv', () => {
  it('экранирует разделители, кавычки и переводы строк; добавляет BOM', () => {
    const csv = toCsv(['a', 'b'], [['x;y', 'сказал "привет"\nпока'], [null, 5]]);
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain('"x;y"');
    expect(csv).toContain('"сказал ""привет""\nпока"');
    expect(csv).toContain(';5');
  });
});

describe('outcomesCsv', () => {
  it('пишет исходы сигналов построчно, сортирует по времени', () => {
    const csv = outcomesCsv([sig({ id: 'b', time: 2 }), sig({ id: 'a', time: 1, outcome: 'loss' })]);
    const lines = csv.split('\r\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain('исход');
    expect(lines[1]).toContain('loss');
    expect(lines[2]).toContain('win');
  });
});

describe('hypothesesCsv', () => {
  it('считает форвард-статистику только по сигналам после записи', () => {
    const h = {
      id: 'h1', title: 'Тест', text: 'Тест', startAt: 2000, minTrades: 1,
      conditions: { pattern: 'harmonic-pattern' },
    };
    const signals = [sig({ time: 1, outcome: 'win' }), sig({ time: 3, outcome: 'win' }), sig({ time: 4, outcome: 'loss' })];
    const csv = hypothesesCsv([h], signals);
    // 2 решённых исхода после startAt, винрейт 50%
    expect(csv).toContain('h1');
    expect(csv).toMatch(/;2;1;0;50\.00;/);
  });
});

describe('comparisonCsv', () => {
  it('пишет строки сравнения с бэктест-ссылкой', () => {
    const csv = comparisonCsv([{ key: 'p · 1m', decided: 10, wins: 6, timeouts: 1, winRatePct: 60, wilsonLowerPct: 40 }]);
    expect(csv).toContain('p · 1m');
    expect(csv).toContain('60.00');
  });
});
