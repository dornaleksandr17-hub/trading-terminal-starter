import { describe, it, expect } from 'vitest';
import {
  aggregateUngated,
  dedupeRecords,
  formatUngatedReport,
  type UngatedRecord,
} from './ungated-diag';

function rec(p: Partial<UngatedRecord> & { barIndex: number; o: Array<[number, number]> }): UngatedRecord {
  return {
    patternName: p.patternName ?? 'tweezer-bottom',
    direction: p.direction ?? 'buy',
    symbolId: p.symbolId ?? 'BTCUSDT',
    barIndex: p.barIndex,
    htfClass: p.htfClass ?? '0.40-range',
    confidence: p.confidence ?? 0.4,
    passedGate: p.passedGate ?? false,
    outcomes: new Map(p.o),
  };
}

describe('ungated-diag: дедупликация и агрегация', () => {
  it('dedupeRecords оставляет наблюдения дальше gap баров, отдельно по символу и направлению', () => {
    const recs = [
      rec({ barIndex: 10, o: [[1, 1]] }),
      rec({ barIndex: 11, o: [[1, 1]] }),
      rec({ barIndex: 12, o: [[1, 1]] }),
      rec({ barIndex: 11, symbolId: 'ETHUSDT', o: [[1, 1]] }),
      rec({ barIndex: 11, direction: 'sell', o: [[1, 1]] }),
    ];
    const kept = dedupeRecords(recs, 1);
    // BTC buy: 10, 12 (11 слишком близко к 10); ETH buy: 11; BTC sell: 11
    expect(kept.map((r) => `${r.symbolId}|${r.direction}|${r.barIndex}`).sort()).toEqual([
      'BTCUSDT|buy|10',
      'BTCUSDT|buy|12',
      'BTCUSDT|sell|11',
      'ETHUSDT|buy|11',
    ]);
  });

  it('aggregateUngated: точность, тай исключён, срезы по HTF-классу и по гейту', () => {
    const recs: UngatedRecord[] = [];
    // range, не прошли гейт: 40 решённых с шагом 10 баров → 30 побед, 10 проигрышей
    for (let i = 0; i < 40; i++) recs.push(rec({ barIndex: i * 10, o: [[2, i < 30 ? 1 : -1]] }));
    // range, тай не считается
    recs.push(rec({ barIndex: 1000, o: [[2, 0]] }));
    // bos, прошли гейт: 2 наблюдения
    recs.push(rec({ barIndex: 0, htfClass: '1.00-bos', passedGate: true, o: [[2, 1]] }));
    recs.push(rec({ barIndex: 50, htfClass: '1.00-bos', passedGate: true, o: [[2, -1]] }));

    const rows = aggregateUngated(recs, { 'tweezer-bottom': [2] });
    const all = rows.find((r) => r.htfClass === 'all' && r.subset === 'all')!;
    expect(all.candidates).toBe(43);
    const range = rows.find((r) => r.htfClass === '0.40-range' && r.subset === 'all')!;
    expect(range.candidates).toBe(41);
    expect(range.cells[0].decided).toBe(40);
    expect(range.cells[0].wins).toBe(30);
    expect(range.cells[0].accuracy).toBeCloseTo(0.75, 10);
    expect(range.cells[0].wilsonLower).toBeGreaterThan(0.55);
    expect(rows.find((r) => r.htfClass === '0.40-range' && r.subset === 'passed-gate')).toBeUndefined();
    const bosPassed = rows.find((r) => r.htfClass === '1.00-bos' && r.subset === 'passed-gate')!;
    expect(bosPassed.candidates).toBe(2);
  });

  it('formatUngatedReport: маркер † при Wilson выше безубыточности и «—» при малой выборке', () => {
    const recs: UngatedRecord[] = [];
    for (let i = 0; i < 40; i++) recs.push(rec({ barIndex: i * 10, o: [[2, i < 30 ? 1 : -1]] }));
    recs.push(rec({ barIndex: 0, htfClass: '1.00-bos', o: [[2, 1]] }));
    const md = formatUngatedReport(aggregateUngated(recs, { 'tweezer-bottom': [2] }), {
      symbols: ['BTCUSDT'], timeframe: '1m', from: '2026-03-01', to: '2026-09-17', breakevenRate: 0.5556,
    });
    expect(md).toContain('Только исследование');
    expect(md).toContain('## tweezer-bottom');
    expect(md).toMatch(/75\.0% \(n=40, W [\d.]+\) †/);
    expect(md).toContain('— (n=1)');
  });
});
