import { describe, it, expect } from 'vitest';
import type { Candle } from '@/types/domain';
import {
  detectRisingThreeMethods,
  detectFallingThreeMethods,
  type ContinuationContext,
} from '@/compute/patterns/continuation';
import { detectMacdDecelerationContinuation } from '@/compute/patterns/macd-deceleration-continuation';
import { beginGateTrace, endGateTrace } from '@/compute/patterns/gate-trace';
import { beginDiagnosticTrace, endDiagnosticTrace } from '@/compute/patterns/diagnostic-trace';

// Диагностика воронки (реальный прогон EURUSD 2026-09-28):
//  - falling-three-methods: 03-candle1=1327 -> 04-consolidation=1, а КАКОЕ из
//    трёх условий гейта 04 убивает кандидатов, воронка не показывала;
//  - rising-three-methods вообще не имел gate(), воронки не существовало;
//  - macd: за 05-decay стоят три разных выхода, между 07 и 08 — ещё два
//    (новостной ATR-фильтр, Фибо 78.6%) помимо порога confidence.
// Тесты фиксируют, что новые счётчики (а) присутствуют и (б) сходятся по
// балансу с соседними гейтами (сумма отсевов = разница гейтов), т.е. не врут,
// и (в) не меняют результат детекторов.

const BASE = 1.1;
const mirror = (x: number) => 2 * BASE - x;

function bar(t: number, open: number, close: number, wickUp = 0.00002, wickDn = 0.00002): Candle {
  return {
    time: 1_700_000_000 + t * 60,
    open,
    close,
    high: Math.max(open, close) + wickUp,
    low: Math.min(open, close) - wickDn,
    volume: 0,
  };
}

type Scenario = 'ok-then-bullish-candle5' | 'body-too-big-c3' | 'range-breach-c4';

/** Падающий вариант: 22 медвежьих свечи (тело 0.0002), импульс, 3 малых, свеча 5. */
function buildFalling(scenario: Scenario): Candle[] {
  const out: Candle[] = [];
  let p = BASE;
  let t = 0;
  for (let i = 0; i < 22; i++) {
    out.push(bar(t++, p, p - 0.0002));
    p -= 0.0002;
  }
  // Свеча 1: тело 0.0010, верхней тени нет, close у самого low.
  const first: Candle = {
    time: 1_700_000_000 + t++ * 60,
    open: p,
    close: p - 0.0010,
    high: p,
    low: p - 0.0010 - 0.00005,
    volume: 0,
  };
  out.push(first);
  // Консолидация — внутри диапазона свечи 1 (у неё нижняя тень всего 0.00005,
  // поэтому стартуем заметно выше close, чтобы малые свечи не вышли за low).
  let q = first.close + 0.0003;
  for (let k = 0; k < 3; k++) {
    let body = 0.00005;
    if (scenario === 'body-too-big-c3' && k === 1) body = 0.0001; // > 0.4 * avgBody20 (0.00008)
    const c = bar(t++, q, q - body, 0.00001, 0.00001);
    if (scenario === 'range-breach-c4' && k === 2) c.high = first.high + 0.0001; // пробой high свечи 1
    out.push(c);
    q -= body;
  }
  // Свеча 5. В ok-сценарии — бычья, чтобы кандидат отсеялся на 05-candle5 и
  // не дошёл до soft-filters (они требуют полного ctx).
  out.push(scenario === 'ok-then-bullish-candle5' ? bar(t++, q, q + 0.0010) : bar(t++, q, q - 0.0012));
  return out;
}

function mirrored(candles: Candle[]): Candle[] {
  return candles.map((c) => ({
    ...c,
    open: mirror(c.open),
    close: mirror(c.close),
    high: mirror(c.low),
    low: mirror(c.high),
  }));
}

function ctxOf(candles: Candle[]): ContinuationContext {
  return {
    candles,
    structure: {} as unknown as ContinuationContext['structure'],
    session: 'london',
    smartMoney: {} as unknown as ContinuationContext['smartMoney'],
    indicators: undefined,
    sessionAgnostic: true,
  };
}

function trace(fn: () => void): { gates: Map<string, number>; diag: Map<string, number> } {
  beginGateTrace();
  beginDiagnosticTrace();
  fn();
  return { gates: endGateTrace(), diag: endDiagnosticTrace() };
}

const N = { falling: 'falling-three-methods', rising: 'rising-three-methods' } as const;

describe.each([
  ['falling', (c: Candle[]) => detectFallingThreeMethods(ctxOf(c)), (c: Candle[]) => c],
  ['rising', (c: Candle[]) => detectRisingThreeMethods(ctxOf(c)), mirrored],
] as const)('%s-three-methods: гейт 04-consolidation разложен по причинам', (dir, detect, adapt) => {
  const name = N[dir];

  it('ok-сценарий: кандидат проходит 00..04, падает на 05, счётчиков отсева нет', () => {
    const candles = adapt(buildFalling('ok-then-bullish-candle5'));
    const { gates, diag } = trace(() => detect(candles));
    for (const g of ['00-evaluated', '01-trend', '02-session', '03-candle1', '04-consolidation']) {
      expect(gates.get(`${name}:${g}`), g).toBe(1); // для rising раньше gate() не было вообще
    }
    expect(gates.get(`${name}:05-candle5`) ?? 0).toBe(0);
    expect([...diag.keys()].filter((k) => k.startsWith(`${name}:04-fail`))).toEqual([]);
  });

  it('тело свечи 3 больше 0.4 x среднего: считается body-vs-avg на свече 3', () => {
    const candles = adapt(buildFalling('body-too-big-c3'));
    const { gates, diag } = trace(() => detect(candles));
    expect(gates.get(`${name}:03-candle1`)).toBe(1);
    expect(gates.get(`${name}:04-consolidation`) ?? 0).toBe(0);
    expect(diag.get(`${name}:04-fail-body-vs-avg`)).toBe(1);
    expect(diag.get(`${name}:04-fail-at-candle-3`)).toBe(1);
    expect(diag.get(`${name}:04-fail-range-breach`) ?? 0).toBe(0);
  });

  it('пробой high свечи 1 свечой 4: считается range-breach на свече 4', () => {
    const candles = adapt(buildFalling('range-breach-c4'));
    const { gates, diag } = trace(() => detect(candles));
    expect(gates.get(`${name}:03-candle1`)).toBe(1);
    expect(gates.get(`${name}:04-consolidation`) ?? 0).toBe(0);
    expect(diag.get(`${name}:04-fail-range-breach`)).toBe(1);
    expect(diag.get(`${name}:04-fail-at-candle-4`)).toBe(1);
    expect(diag.get(`${name}:04-fail-body-vs-avg`) ?? 0).toBe(0);
  });

  it('баланс: отсев на 04 = сумма причин = сумма позиций свечи', () => {
    let gate03 = 0;
    let gate04 = 0;
    let reasons = 0;
    let positions = 0;
    for (const s of ['ok-then-bullish-candle5', 'body-too-big-c3', 'range-breach-c4'] as Scenario[]) {
      const candles = adapt(buildFalling(s));
      const { gates, diag } = trace(() => detect(candles));
      gate03 += gates.get(`${name}:03-candle1`) ?? 0;
      gate04 += gates.get(`${name}:04-consolidation`) ?? 0;
      for (const [k, v] of diag) {
        if (/:04-fail-(body-vs-avg|body-vs-body1|range-breach)$/.test(k)) reasons += v;
        if (/:04-fail-at-candle-\d$/.test(k)) positions += v;
      }
    }
    expect(gate03 - gate04).toBe(2);
    expect(reasons).toBe(2);
    expect(positions).toBe(2);
  });

  it('диагностика не меняет результат детектора', () => {
    for (const s of ['ok-then-bullish-candle5', 'body-too-big-c3', 'range-breach-c4'] as Scenario[]) {
      const candles = adapt(buildFalling(s));
      const plain = detect(candles);
      let traced: unknown = 'unset';
      trace(() => {
        traced = detect(candles);
      });
      expect(JSON.stringify(traced)).toBe(JSON.stringify(plain));
    }
  });
});

// ── MACD ────────────────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function walk(n: number, seed: number): Candle[] {
  const r = rng(seed);
  let p = 1.1;
  const out: Candle[] = [];
  for (let i = 0; i < n; i++) {
    const open = p;
    p += (r() - 0.5) * 0.0004;
    const close = p;
    const wick = r() * 0.0001;
    out.push({
      time: 1_700_000_000 + i * 60,
      open,
      close,
      high: Math.max(open, close) + wick,
      low: Math.min(open, close) - wick,
      volume: 0,
    });
  }
  return out;
}

const M = 'macd-deceleration-continuation';

function sumDiag(diag: Map<string, number>, re: RegExp): number {
  let s = 0;
  for (const [k, v] of diag) if (re.test(k)) s += v;
  return s;
}

describe('macd-deceleration-continuation: диагностика гейтов 05 и 08', () => {
  const all = walk(12000, 7);
  let cached: { gates: Map<string, number>; diag: Map<string, number>; results: string } | null = null;
  const run = (): { gates: Map<string, number>; diag: Map<string, number>; results: string } => {
    if (cached) return cached;
    const results: unknown[] = [];
    const { gates, diag } = trace(() => {
      for (let end = 120; end <= all.length; end++) {
        results.push(detectMacdDecelerationContinuation(all.slice(end - 120, end)));
      }
    });
    cached = { gates, diag, results: JSON.stringify(results) };
    return cached;
  };

  it('баланс 04 -> 05: отсев = chain + flip + last; распределение длины серии = число прошедших 04', { timeout: 60000 }, () => {
    const { gates, diag } = run();
    const g04 = gates.get(`${M}:04-old-series`) ?? 0;
    const g05 = gates.get(`${M}:05-decay`) ?? 0;
    expect(g04).toBeGreaterThan(0);
    const fails =
      sumDiag(diag, new RegExp(`^${M}:05-fail-chain-step-`)) +
      (diag.get(`${M}:05-fail-flip-not-below-old-last`) ?? 0) +
      (diag.get(`${M}:05-fail-last-not-below-flip`) ?? 0);
    expect(fails).toBeGreaterThan(0);
    expect(g04 - g05).toBe(fails);
    expect(sumDiag(diag, new RegExp(`^${M}:04-series-len-`))).toBe(g04);
  });

  it('баланс 07 -> 08: отсев = ATR + Фибо + confidence; корзины confidence = прошли + провалили порог', { timeout: 60000 }, () => {
    const { gates, diag } = run();
    const g07 = gates.get(`${M}:07-rsi-adx`) ?? 0;
    const g08 = gates.get(`${M}:08-confidence`) ?? 0;
    const atr = diag.get(`${M}:08pre-fail-news-atr`) ?? 0;
    const fib = diag.get(`${M}:08pre-fail-fib-786`) ?? 0;
    const conf = diag.get(`${M}:08pre-fail-confidence`) ?? 0;
    expect(g07 - g08).toBe(atr + fib + conf);
    expect(sumDiag(diag, new RegExp(`^${M}:08pre-confidence-`))).toBe(g08 + conf);
  });

  it('диагностика не меняет результаты детектора', { timeout: 120000 }, () => {
    const withTrace = run().results;
    const results: unknown[] = [];
    for (let end = 120; end <= all.length; end++) {
      results.push(detectMacdDecelerationContinuation(all.slice(end - 120, end)));
    }
    expect(withTrace).toBe(JSON.stringify(results));
  });
});
