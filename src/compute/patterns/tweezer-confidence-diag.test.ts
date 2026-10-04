import { describe, it, expect } from 'vitest';
import type { Candle, MarketStructure, IndicatorSnapshot } from '@/types/domain';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import type { PatternContext } from '@/compute/patterns/pattern-context';
import { detectTweezerBottom, detectTweezerTop } from '@/compute/patterns/double';
import { beginDiagnosticTrace, endDiagnosticTrace } from '@/compute/patterns/diagnostic-trace';

// D3-измерение (2026-09-29). Реальный прогон horizon-audit (4 форекс-пары,
// 781244 бара): tweezer-bottom/top — 32155/32764 кандидатов проходят
// 06-confirmation и 0 проходят confidence >= 0.5. У Deriv volume ≡ 0, поэтому
// tweezerVolumeFactor всегда даёт 0.90, и «идеальный» tweezer получает
// 0.40 × 1.0 × 1.05 × 0.90 × 1.25 = 0.4725 < 0.5. Эти тесты фиксируют, что
// (а) диагностические счётчики это показывают, (б) сам детектор не изменился.
// Поведение детекторов ЭТИМ файлом не меняется — только измерение.

const UP: MarketStructure = { trend: 'up', bos: true, choch: false, swingHigh: 110, swingLow: 95, provisional: false };
const DOWN: MarketStructure = { trend: 'down', bos: true, choch: false, swingHigh: 110, swingLow: 95, provisional: false };

const EMPTY_SMART_MONEY: SmartMoneyResult = {
  orderBlocks: [], fvgs: [], inversionFvgs: [], breakerBlocks: [], rejectionBlocks: [], bosEvents: [],
};

const NO_INDICATORS: IndicatorSnapshot = {
  rsi: null, emaFast: null, emaSlow: null,
  macd: null, macdSignal: null, macdHistogram: null,
  atr: null, bollingerUpper: null, bollingerMiddle: null, bollingerLower: null,
  vwap: null, vwapIsProxyVolume: false,
  volumeProfilePoc: null, volumeProfilePocIsProxyVolume: false,
  meanReversionRsi: null, impulseVelocity: null, adx: null,
};

function c(t: number, open: number, close: number, high: number, low: number, volume: number): Candle {
  return { time: t * 60, open, close, high, low, volume };
}

/** Фикстура tweezer-bottom из patterns.test.ts; volumes: [фон, prev, cur, confirm]. */
function bottomCandles(v: { base: number; prev: number; cur: number; confirm: number }): Candle[] {
  return [
    c(0, 110, 108, 110.5, 107.5, v.base),
    c(1, 108, 106, 108.5, 105.5, v.base),
    c(2, 106, 104, 106.5, 103.5, v.base),
    c(3, 104, 102, 104.5, 101.5, v.base),
    c(4, 102, 100, 102.5, 99.5, v.base),
    c(5, 98, 96, 98.5, 95, v.prev),
    c(6, 95.5, 97, 97.5, 95, v.cur), // совпадающий low = 95
    c(7, 97, 99, 99.5, 96.5, v.confirm), // close выше верха тела cur (97) — сильное подтверждение
  ];
}

/** Фикстура tweezer-top из patterns.test.ts. */
function topCandles(v: { base: number; prev: number; cur: number; confirm: number }): Candle[] {
  return [
    c(0, 90, 92, 92.5, 89.5, v.base),
    c(1, 92, 94, 94.5, 91.5, v.base),
    c(2, 94, 96, 96.5, 93.5, v.base),
    c(3, 96, 98, 98.5, 95.5, v.base),
    c(4, 98, 100, 100.5, 97.5, v.base),
    c(5, 106, 109, 110, 105.5, v.prev),
    c(6, 109.5, 107, 110, 106.5, v.cur), // совпадающий high = 110
    c(7, 107, 105, 107.5, 104.5, v.confirm), // close ниже низа тела cur (107)
  ];
}

function ctxOf(candles: Candle[], structure: MarketStructure, rsi: number | null = null): PatternContext {
  return {
    candles,
    index: candles.length - 2,
    structure,
    htfStructure: structure,
    session: 'london',
    smartMoney: EMPTY_SMART_MONEY,
    indicators: { ...NO_INDICATORS, rsi },
  };
}

const NO_VOLUME = { base: 0, prev: 0, cur: 0, confirm: 0 }; // реальность Deriv/форекс
const REAL_VOLUME = { base: 100, prev: 100, cur: 140, confirm: 100 }; // ratio 1.4 → множитель 1.15

function traced<T>(fn: () => T): { result: T; counts: Map<string, number> } {
  beginDiagnosticTrace();
  const result = fn();
  return { result, counts: endDiagnosticTrace() };
}

describe('tweezer: диагностика confidence (только измерение)', () => {
  it('bottom, volume ≡ 0: идеальный tweezer отсекается confidence, нейтральный объём его бы пропустил', () => {
    const { result, counts } = traced(() => detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP)));
    expect(result).toBeNull(); // 0.40 × 1.0 × 1.05 × 0.90 × 1.25 = 0.4725 < 0.5
    expect(counts.get('tweezer-bottom:07pre-volume-none')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-htf-1.00-bos')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-rsi-na')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-confirm-strong')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-confidence-0.4')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-confidence-volneutral-0.5')).toBe(1); // 0.525
    expect(counts.get('tweezer-bottom:07pre-passes-actual-false')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-passes-volneutral-true')).toBe(1);
  });

  it('top, volume ≡ 0: то же зеркально', () => {
    const { result, counts } = traced(() => detectTweezerTop(ctxOf(topCandles(NO_VOLUME), DOWN)));
    expect(result).toBeNull();
    expect(counts.get('tweezer-top:07pre-volume-none')).toBe(1);
    expect(counts.get('tweezer-top:07pre-htf-1.00-bos')).toBe(1);
    expect(counts.get('tweezer-top:07pre-rsi-na')).toBe(1);
    expect(counts.get('tweezer-top:07pre-confirm-strong')).toBe(1);
    expect(counts.get('tweezer-top:07pre-passes-actual-false')).toBe(1);
    expect(counts.get('tweezer-top:07pre-passes-volneutral-true')).toBe(1);
  });

  it('реальный объём (ratio 1.4): детектор срабатывает, счётчики отражают volume-real и passes-actual-true', () => {
    const { result, counts } = traced(() => detectTweezerBottom(ctxOf(bottomCandles(REAL_VOLUME), UP)));
    expect(result).not.toBeNull();
    expect(result!.confidence).toBeCloseTo(0.4 * 1.0 * 1.05 * 1.15 * 1.25, 10);
    expect(counts.get('tweezer-bottom:07pre-volume-real')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-passes-actual-true')).toBe(1);
  });

  it('RSI < 30 при volume ≡ 0 проходит (0.40 × 1.05 × 0.90 × 1.25 × 1.10 ≈ 0.52) — совместный срез htf × rsi', () => {
    const { result, counts } = traced(() => detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP, 28)));
    expect(result).not.toBeNull();
    expect(counts.get('tweezer-bottom:07pre-joint-htf1.00-bos+rsi-lt30')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-passes-actual-true')).toBe(1);
  });

  it('RSI 35–50 при volume ≡ 0 не проходит (множитель 0.85), корзина rsi-35-50', () => {
    const { result, counts } = traced(() => detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP, 40)));
    expect(result).toBeNull();
    expect(counts.get('tweezer-bottom:07pre-rsi-35-50')).toBe(1);
    expect(counts.get('tweezer-bottom:07pre-passes-actual-false')).toBe(1);
  });

  it('трассировка не меняет результат детектора (все сценарии)', () => {
    const scenarios: [string, () => unknown][] = [
      ['bottom no-volume', () => detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP))],
      ['bottom real-volume', () => detectTweezerBottom(ctxOf(bottomCandles(REAL_VOLUME), UP))],
      ['bottom rsi28', () => detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP, 28))],
      ['top no-volume', () => detectTweezerTop(ctxOf(topCandles(NO_VOLUME), DOWN))],
      ['top real-volume', () => detectTweezerTop(ctxOf(topCandles(REAL_VOLUME), DOWN))],
    ];
    for (const [name, run] of scenarios) {
      const plain = run();
      const { result } = traced(run);
      expect(result, name).toEqual(plain);
    }
  });

  it('вне трассировки счётчики не накапливаются', () => {
    detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP));
    detectTweezerTop(ctxOf(topCandles(NO_VOLUME), DOWN));
    beginDiagnosticTrace();
    expect(endDiagnosticTrace().size).toBe(0);
  });
});
