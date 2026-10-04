import { describe, it, expect } from 'vitest';
import type { Candle, IndicatorSnapshot, MarketStructure } from '@/types/domain';
import { detectMeanReversion, type MeanReversionExitContext } from './mean-reversion';

// Этап 2 (fix-plan-liquidity-meanreversion.md): F01, F03, F04, F05.

function candle(time: number, open: number, close: number, high: number, low: number, volume = 100): Candle {
  return { time, open, high, low, close, volume };
}

function flatWarmup(count = 30): Candle[] {
  return Array.from({ length: count }, (_, i) => {
    const bullish = i % 2 === 0;
    return candle(i, bullish ? 99.9 : 100.1, bullish ? 100.1 : 99.9, 100.6, 99.4, 100);
  });
}

function mirror(candles: Candle[]): Candle[] {
  return candles.map((c) => ({
    time: c.time, open: 200 - c.open, close: 200 - c.close,
    high: 200 - c.low, low: 200 - c.high, volume: c.volume,
  }));
}

const snapshot: IndicatorSnapshot = {
  rsi: 50, emaFast: 100, emaSlow: 100,
  macd: 0, macdSignal: 0, macdHistogram: 0,
  atr: 1.2, bollingerUpper: 102, bollingerMiddle: 100, bollingerLower: 98,
  vwap: null, vwapIsProxyVolume: false, volumeProfilePoc: null, volumeProfilePocIsProxyVolume: false,
  meanReversionRsi: null, impulseVelocity: null, adx: 10,
};

const exitBar = () => candle(30, 100, 96, 100.2, 95, 120); // закрытие 96 < нижней полосы 98
const returnBar = () => candle(31, 96, 99, 99.5, 95.8, 120);
const buyCandles = () => [...flatWarmup(30), exitBar(), returnBar()];

const exitCtx = (over: Partial<MeanReversionExitContext> = {}): MeanReversionExitContext => ({
  rsi: 20, upper: 102, lower: 98,
  prev2Close: 100, prev2Upper: 102, prev2Lower: 98,
  ...over,
});

const htf = (trend: MarketStructure['trend']): MarketStructure => ({
  trend, bos: false, choch: false, swingHigh: 105, swingLow: 95, provisional: false,
});

describe('F01 — RSI(7) берётся на баре выхода', () => {
  it('RSI выхода экстремален, RSI последнего бара нет → сигнал', () => {
    const r = detectMeanReversion(buyCandles(), snapshot, 50, 'london', undefined, false, exitCtx({ rsi: 20 }));
    expect(r?.direction).toBe('buy');
  });
  it('RSI последнего бара экстремален, RSI выхода нет → нет сигнала', () => {
    expect(detectMeanReversion(buyCandles(), snapshot, 20, 'london', undefined, false, exitCtx({ rsi: 50 }))).toBeNull();
  });
  it('sell (зеркало)', () => {
    const c = mirror(buyCandles());
    expect(detectMeanReversion(c, snapshot, 50, 'london', undefined, false, exitCtx({ rsi: 80 }))?.direction).toBe('sell');
    expect(detectMeanReversion(c, snapshot, 80, 'london', undefined, false, exitCtx({ rsi: 50 }))).toBeNull();
  });
});

describe('F05 — полоса бара выхода', () => {
  // Полоса последнего бара ушла вниз (94): prev.close=96 уже не «за полосой»
  // последнего бара, но был за полосой бара выхода (98).
  const lastBandSnap = { ...snapshot, bollingerLower: 94 };
  it('с контекстом выхода — сигнал', () => {
    expect(detectMeanReversion(buyCandles(), lastBandSnap, 20, 'london', undefined, false, exitCtx({ lower: 98 }))?.direction).toBe('buy');
  });
  it('без контекста (прежнее поведение) — нет сигнала', () => {
    expect(detectMeanReversion(buyCandles(), lastBandSnap, 20, 'london')).toBeNull();
  });
});

describe('F03 — только первый выход за полосу', () => {
  it('закрытие перед баром выхода уже за полосой → нет сигнала', () => {
    expect(detectMeanReversion(buyCandles(), snapshot, 20, 'london', undefined, false, exitCtx({ prev2Close: 97, prev2Lower: 98 }))).toBeNull();
  });
  it('закрытие перед баром выхода внутри полосы → сигнал', () => {
    expect(detectMeanReversion(buyCandles(), snapshot, 20, 'london', undefined, false, exitCtx({ prev2Close: 99, prev2Lower: 98 }))?.direction).toBe('buy');
  });
  it('sell (зеркало)', () => {
    const c = mirror(buyCandles());
    expect(detectMeanReversion(c, snapshot, 80, 'london', undefined, false, exitCtx({ rsi: 80, prev2Close: 103, prev2Upper: 102 }))).toBeNull();
    expect(detectMeanReversion(c, snapshot, 80, 'london', undefined, false, exitCtx({ rsi: 80, prev2Close: 101, prev2Upper: 102 }))?.direction).toBe('sell');
  });
});

describe('F04 — HTF-тренд против сделки', () => {
  it('buy: HTF down → нет сигнала; range и up → сигнал', () => {
    const run = (t: MarketStructure['trend']) =>
      detectMeanReversion(buyCandles(), snapshot, 20, 'london', htf(t), false, exitCtx());
    expect(run('down')).toBeNull();
    expect(run('range')?.direction).toBe('buy');
    expect(run('up')?.direction).toBe('buy');
  });
  it('sell: HTF up → нет сигнала; range и down → сигнал', () => {
    const c = mirror(buyCandles());
    const run = (t: MarketStructure['trend']) =>
      detectMeanReversion(c, snapshot, 80, 'london', htf(t), false, exitCtx({ rsi: 80 }));
    expect(run('up')).toBeNull();
    expect(run('range')?.direction).toBe('sell');
    expect(run('down')?.direction).toBe('sell');
  });
});
