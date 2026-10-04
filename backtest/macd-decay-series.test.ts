import { describe, it, expect } from 'vitest';
import type { Candle } from '@/types/domain';
import { detectMacdDecelerationContinuation } from '@/compute/patterns/macd-deceleration-continuation';
import { beginGateTrace, endGateTrace } from '@/compute/patterns/gate-trace';

// Регрессия: "старая серия" гистограммы MACD включала нарастающую фазу
// одноцветного забега (от пересечения нуля до пика), а проверка затухания
// требовала |h[i]| <= 0.9*|h[i-1]| по ВСЕЙ серии. Нарастающий участок
// гарантированно проваливал её, поэтому гейт 05-decay не проходил никогда
// (реальный прогон: 04-old-series=8321, 05-decay=0; синтетика: 12132 -> 0).
// Затухать должен хвост от пика, а не весь забег.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function syntheticCandles(n: number): Candle[] {
  const r = rng(7);
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

describe('macd-deceleration-continuation: гейт затухания достижим', () => {
  it('на случайном блуждании часть кандидатов проходит 04-old-series И 05-decay', { timeout: 60000 }, () => {
    const all = syntheticCandles(30000);
    beginGateTrace();
    for (let end = 120; end <= all.length; end += 1) {
      detectMacdDecelerationContinuation(all.slice(end - 120, end));
    }
    const funnel = endGateTrace();
    const g04 = funnel.get('macd-deceleration-continuation:04-old-series') ?? 0;
    const g05 = funnel.get('macd-deceleration-continuation:05-decay') ?? 0;
    expect(g04).toBeGreaterThan(0);
    expect(g05).toBeGreaterThan(0); // на старом коде: 0
    expect(g05).toBeLessThanOrEqual(g04);
  });
});
