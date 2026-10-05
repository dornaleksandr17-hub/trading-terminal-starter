import { describe, it, expect } from 'vitest';
import { evaluateSlice, enumerateSlices, applyHolm, scanPattern, adxBucket, type ScanOccurrence, type ScanParams } from './condition-scan-core';
import { computeFoldBoundaries, assignFoldIndex } from './horizon-partitioning';

function makeOccs(n: number, seed = 1): ScanOccurrence[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out: ScanOccurrence[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      patternName: 'harmonic-pattern',
      setupType: null,
      direction: rnd() < 0.5 ? 'buy' : 'sell',
      symbolId: 'BTCUSDT',
      barIndex: i * 100,
      time: i * 6000,
      entryPrice: 1,
      confidence: 0.7,
      partition: 'train',
      fold: 0,
      outcomes: new Map([[5, rnd() < 0.55 ? 1 : -1], [10, rnd() < 0.5 ? 1 : -1]]),
      features: { adx: rnd() < 0.5 ? '<20' : '>=25', session: rnd() < 0.5 ? 'london' : 'tokyo' },
    });
  }
  return out;
}

function params(occs: ScanOccurrence[]): ScanParams {
  const fb = computeFoldBoundaries(occs[0].time, occs[occs.length - 1].time, 8);
  assignFoldIndex(occs, fb);
  return { foldBoundaries: fb, purgeSeconds: 1800, minTrainDecided: 30, selectMinAcc: 0.5, minTestDecided: 200, alpha: 0.05, breakevenRate: 100 / 180, targetLow: 0.53, targetHigh: 0.56 };
}

describe('condition-scan', () => {
  it('бакеты фиксированы', () => {
    expect(adxBucket(19.9)).toBe('<20');
    expect(adxBucket(25)).toBe('>=25');
    expect(adxBucket(null)).toBe('n/a');
  });

  it('детерминизм и не более 2 признаков в срезе', () => {
    const a = makeOccs(2000);
    const p = params(a);
    const r1 = scanPattern('harmonic-pattern', a, ['adx', 'session'], [5, 10], p);
    const b = makeOccs(2000);
    const r2 = scanPattern('harmonic-pattern', b, ['adx', 'session'], [5, 10], params(b));
    expect(r1).toEqual(r2);
    expect(enumerateSlices(a, ['adx', 'session']).every((s) => s.conds.length <= 2)).toBe(true);
  });

  it('нет утечки test в отбор: исходы последнего fold не меняют отбор и expiry предыдущих', () => {
    const a = makeOccs(2000);
    const p = params(a);
    const base = evaluateSlice('h', { conds: [] }, a, [5, 10], p);
    const flipped = a.map((o) => (o.fold === 7 ? { ...o, outcomes: new Map([[5, -1], [10, -1]]) } : o));
    const after = evaluateSlice('h', { conds: [] }, flipped, [5, 10], p);
    expect(after.foldsSelected).toBe(base.foldsSelected);
    expect(after.foldsEvaluated).toBe(base.foldsEvaluated);
  });

  it('семейство Holm = все срезы с p-value', () => {
    const a = makeOccs(3000);
    const res = scanPattern('h', a, ['adx', 'session'], [5, 10], params(a));
    const size = applyHolm(res, 0.05);
    expect(size).toBe(res.filter((r) => r.pValue !== null).length);
    expect(res.filter((r) => r.pValue === null).every((r) => r.holmSignificant === null)).toBe(true);
  });

  it('вход не мутируется (occurrences идентичны до и после скана)', () => {
    const a = makeOccs(500);
    const p = params(a);
    const snap = JSON.stringify(a.map((o) => ({ ...o, outcomes: [...o.outcomes] })));
    scanPattern('h', a, ['adx', 'session'], [5, 10], p);
    expect(JSON.stringify(a.map((o) => ({ ...o, outcomes: [...o.outcomes] })))).toBe(snap);
  });
});

describe('condition-scan: HTF-класс', () => {
  it('классы совпадают с htfClassOf(htfAlignment) детекторов', async () => {
    const { htfAlignment } = await import('@/compute/patterns/pattern-context');
    const { htfClassOf } = await import('@/compute/patterns/diagnostic-trace');
    const base = { trend: 'up', bos: true, choch: false } as unknown as Parameters<typeof htfAlignment>[0];
    expect(htfClassOf(htfAlignment(base, 'buy'))).toBe('1.00-bos');
    expect(htfClassOf(htfAlignment({ ...base, trend: 'range', bos: false }, 'buy'))).toBe('0.40-range');
    expect(htfClassOf(htfAlignment({ ...base, trend: 'down', bos: false, choch: true }, 'buy'))).toBe('0.75-choch');
  });
});
