import { describe, it, expect } from 'vitest';
import type { Candle, MarketStructure } from '@/types/domain';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { atr } from '@/compute/indicators/atr';
import { lastNonNull } from '@/compute/indicators/helpers';
import { detectLiquiditySweepReaction } from './liquidity-sweep-reaction';
import { beginGateTrace, endGateTrace } from './gate-trace';

// Этап 4 (решение владельца D7=2): у бара смещения убрана жёсткая граница
// «тело ≥ 1 ATR». Доминирование тела в диапазоне бара (≥0.6) осталось.

function candle(time: number, open: number, close: number, high: number, low: number, volume = 100): Candle {
  return { time, open, high, low, close, volume };
}

const EMPTY_SMART_MONEY: SmartMoneyResult = {
  orderBlocks: [], fvgs: [], inversionFvgs: [], breakerBlocks: [], rejectionBlocks: [], bosEvents: [],
};
const UP: MarketStructure = {
  trend: 'up', bos: true, bosDirection: 'up', choch: false, swingHigh: null, swingLow: null, provisional: false,
};

function warmup(count = 30): Candle[] {
  return Array.from({ length: count }, (_, i) => {
    const bull = i % 2 === 0;
    return candle(i, bull ? 99.9 : 100.1, bull ? 100.1 : 99.9, 100.6, 99.4, 100);
  });
}

// Свип-бар как в strategies.test.ts, затем бар смещения с телом bodyInAtr × ATR
// (ATR пересчитывается по ряду вместе с самим баром смещения), доминирующим в
// своём диапазоне (тень 5% с каждой стороны).
function withDisplacement(bodyInAtr: number, bodyShareOfRange = 0.9): Candle[] {
  const base = [...warmup(), candle(30, 99.5, 99.6, 100.5, 97.6, 260)];
  let body = 1;
  for (let k = 0; k < 6; k++) {
    const range = body / bodyShareOfRange;
    const wick = (range - body) / 2;
    const c = [...base, candle(31, 100.5, 100.5 + body, 100.5 + body + wick, 100.5 - wick + 0.0001, 300)];
    body = bodyInAtr * lastNonNull(atr(c, 14))!;
  }
  const range = body / bodyShareOfRange;
  const wick = (range - body) / 2;
  return [...base, candle(31, 100.5, 100.5 + body, 100.5 + body + wick, 100.5 - wick + 0.0001, 300)];
}

function trace(c: Candle[]): { counts: Map<string, number>; result: ReturnType<typeof detectLiquiditySweepReaction> } {
  beginGateTrace();
  const result = detectLiquiditySweepReaction(c, UP, 'london', EMPTY_SMART_MONEY);
  return { counts: endGateTrace(), result };
}

describe('Этап 4: гейт тела бара смещения без жёсткого порога в ATR', () => {
  it('тело ≈0.9 ATR при доминировании в баре проходит гейт 05-body (раньше резалось <1 ATR)', () => {
    const c = withDisplacement(0.9);
    const bodyInAtr = Math.abs(c[31].close - c[31].open) / lastNonNull(atr(c, 14))!;
    expect(bodyInAtr).toBeLessThan(1);
    expect(bodyInAtr).toBeGreaterThan(0.8);
    const { counts } = trace(c);
    expect(counts.get('liquidity-sweep-reaction:04-no-retake')).toBe(1);
    expect(counts.get('liquidity-sweep-reaction:05-body')).toBe(1);
  });

  it('тело, не доминирующее в диапазоне бара (<0.6), по-прежнему режется на 05-body', () => {
    const c = withDisplacement(0.9, 0.5);
    const { counts, result } = trace(c);
    expect(counts.get('liquidity-sweep-reaction:04-no-retake')).toBe(1);
    expect(counts.get('liquidity-sweep-reaction:05-body')).toBeUndefined();
    expect(result).toBeNull();
  });

  it('очень слабое тело (≈0.3 ATR) проходит 05-body, но не набирает confidence 0.70', () => {
    const c = withDisplacement(0.3);
    const { counts, result } = trace(c);
    expect(counts.get('liquidity-sweep-reaction:05-body')).toBe(1);
    expect(counts.get('liquidity-sweep-reaction:07-confidence')).toBeUndefined();
    expect(result).toBeNull();
  });

  it('контроль: сильное смещение (как в strategies.test.ts) по-прежнему даёт сигнал', () => {
    const c = [...warmup(), candle(30, 99.5, 99.6, 100.5, 97.6, 260), candle(31, 100.5, 103.5, 103.7, 100.4, 300)];
    expect(trace(c).result).not.toBeNull();
  });
});
