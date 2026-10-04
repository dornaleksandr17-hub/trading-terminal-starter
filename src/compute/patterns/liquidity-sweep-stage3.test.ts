import { describe, it, expect } from 'vitest';
import type { Candle, MarketStructure } from '@/types/domain';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { detectLiquiditySweep } from './liquidity-sweep';
import { beginGateTrace, endGateTrace } from './gate-trace';
import { atr } from '@/compute/indicators/atr';
import { lastNonNull } from '@/compute/indicators/helpers';

// Этап 3 fix-plan-liquidity-meanreversion.md: F12 (отказ от прокола) и
// F13 (тренд-окно без свип-бара). Проверяются счётчиками воронки, чтобы тесты
// не зависели от порога confidence и не были «пустыми».

function candle(time: number, open: number, close: number, high: number, low: number, volume = 100): Candle {
  return { time, open, high, low, close, volume };
}

const WARMUP_LOW = 99.4;
const WARMUP_HIGH = 100.6;

// bullishAt: индексы баров разминки, которые должны быть бычьими; остальные — медвежьи.
function warmup(count: number, bullishAt: (i: number) => boolean): Candle[] {
  return Array.from({ length: count }, (_, i) => {
    const bull = bullishAt(i);
    return candle(i, bull ? 99.9 : 100.1, bull ? 100.1 : 99.9, WARMUP_HIGH, WARMUP_LOW, 100);
  });
}

function mirror(candles: Candle[]): Candle[] {
  return candles.map((c) => ({
    time: c.time, open: 200 - c.open, close: 200 - c.close,
    high: 200 - c.low, low: 200 - c.high, volume: c.volume,
  }));
}

const EMPTY_SMART_MONEY: SmartMoneyResult = {
  orderBlocks: [], fvgs: [], inversionFvgs: [], breakerBlocks: [], rejectionBlocks: [], bosEvents: [],
};
const RANGE: MarketStructure = {
  trend: 'range', bos: false, choch: false, swingHigh: null, swingLow: null, provisional: false,
};

function trace(candles: Candle[]): Map<string, number> {
  beginGateTrace();
  detectLiquiditySweep(candles, RANGE, 'london', EMPTY_SMART_MONEY);
  return endGateTrace();
}

describe('F12: отказ от прокола (закрытие в возвратной половине бара)', () => {
  const base = warmup(30, (i) => i % 2 === 0);

  it('buy: закрытие у самого экстремума прокола (ниже середины бара) отсекается', () => {
    // low 98.4 < recentLow 99.4, close 99.45 > 99.4 (геометрия свипа ок),
    // но середина бара 99.5 > close — закрытие прижато к низу прокола.
    const c = [...base, candle(30, 98.6, 99.45, 100.6, 98.4, 260)];
    const t = trace(c);
    expect(t.get('liquidity-sweep:02-sweep-geometry')).toBe(1);
    expect(t.get('liquidity-sweep:02b-rejection')).toBeUndefined();
  });

  it('buy: закрытие в верхней половине бара проходит гейт отказа', () => {
    const c = [...base, candle(30, 99.5, 99.6, 100.5, 97.6, 260)];
    const t = trace(c);
    expect(t.get('liquidity-sweep:02-sweep-geometry')).toBe(1);
    expect(t.get('liquidity-sweep:02b-rejection')).toBe(1);
  });

  it('sell (зеркало): закрытие у экстремума прокола отсекается, возвратное проходит', () => {
    const bad = mirror([...base, candle(30, 98.6, 99.45, 100.6, 98.4, 260)]);
    const tBad = trace(bad);
    expect(tBad.get('liquidity-sweep:02-sweep-geometry')).toBe(1);
    expect(tBad.get('liquidity-sweep:02b-rejection')).toBeUndefined();

    const good = mirror([...base, candle(30, 99.5, 99.6, 100.5, 97.6, 260)]);
    const tGood = trace(good);
    expect(tGood.get('liquidity-sweep:02b-rejection')).toBe(1);
  });
});

describe('F13: окно «5 из 7» не включает свип-бар', () => {
  const sweepBar = candle(30, 99.5, 99.6, 100.5, 97.6, 260); // бычий свип-бар

  it('4 бычьих из 7 предыдущих баров + бычий свип-бар больше НЕ дают «тренд»', () => {
    // Бары 23..29: бычьи 24, 25, 27, 29 (4 из 7). Раньше окно было 24..29 + свип-бар
    // = 5 из 7 и проходило; теперь окно 23..29 = 4 из 7 → контекст не выполнен.
    const bull = new Set([24, 25, 27, 29]);
    const c = [...warmup(30, (i) => bull.has(i)), sweepBar];
    const t = trace(c);
    expect(t.get('liquidity-sweep:02b-rejection')).toBe(1);
    expect(t.get('liquidity-sweep:03-context')).toBeUndefined();
  });

  it('5 бычьих из 7 предыдущих баров по-прежнему проходят контекст', () => {
    const bull = new Set([23, 24, 25, 27, 29]);
    const c = [...warmup(30, (i) => bull.has(i)), sweepBar];
    const t = trace(c);
    expect(t.get('liquidity-sweep:03-context')).toBe(1);
  });
});

// F08: бывшие нижние границы глубины (0.3 / 0.5 ATR) убраны как недостижимые.
// Тест закрепляет инвариант: ни при каком из максимальных множителей
// (overlap 1.15, trend=up без штрафов) прокол мельче ≈0.77 ATR сигнала не даёт.
// Если формула confidence или ENTRY_THRESHOLD изменятся, тест покажет,
// что нижней границы глубины больше нет, и её придётся вернуть явно.
describe('F08: нижняя граница глубины задаётся confidence, а не мёртвыми константами', () => {
  const UP: MarketStructure = { ...RANGE, trend: 'up', bos: true, bosDirection: 'up' };
  const base = warmup(30, (i) => i % 2 === 0);

  function depthInAtr(c: Candle[]): number {
    const a = lastNonNull(atr(c, 14))!;
    return (WARMUP_LOW - c[c.length - 1].low) / a;
  }

  it('прокол мельче 0.77 ATR не даёт сигнала даже в overlap при максимальном контексте', () => {
    for (const low of [99.3, 99.2, 99.0, 98.8, 98.6]) {
      const c = [...base, candle(30, 99.5, 99.7, 100.5, low, 260)];
      const d = depthInAtr(c);
      expect(d).toBeLessThan(0.77);
      expect(detectLiquiditySweep(c, UP, 'overlap', EMPTY_SMART_MONEY)).toBeNull();
    }
  });

  it('контроль (тест не пустой): глубокий прокол в тех же условиях даёт сигнал', () => {
    const c = [...base, candle(30, 99.5, 99.6, 100.5, 97.6, 260)];
    expect(depthInAtr(c)).toBeGreaterThan(0.77);
    expect(detectLiquiditySweep(c, UP, 'overlap', EMPTY_SMART_MONEY)).not.toBeNull();
  });
});
