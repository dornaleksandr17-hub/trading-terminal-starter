import { describe, it, expect } from 'vitest';
import type { Candle, MarketStructure, IndicatorSnapshot } from '@/types/domain';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import type { PatternContext } from '@/compute/patterns/pattern-context';
import { detectTweezerBottom, detectTweezerTop } from '@/compute/patterns/double';
import {
  beginUngatedDiag,
  endUngatedDiag,
  drainUngatedCandidates,
  isUngatedDiagActive,
  ungatedCandidate,
} from '@/compute/patterns/ungated-diag';

// Кандидаты ДО confidence-гейта: детектор по-прежнему возвращает null ниже порога,
// но кандидат записывается с классом HTF. Фикстуры — как в tweezer-confidence-diag.test.ts.

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

function bottomCandles(v: { base: number; prev: number; cur: number; confirm: number }): Candle[] {
  return [
    c(0, 110, 108, 110.5, 107.5, v.base),
    c(1, 108, 106, 108.5, 105.5, v.base),
    c(2, 106, 104, 106.5, 103.5, v.base),
    c(3, 104, 102, 104.5, 101.5, v.base),
    c(4, 102, 100, 102.5, 99.5, v.base),
    c(5, 98, 96, 98.5, 95, v.prev),
    c(6, 95.5, 97, 97.5, 95, v.cur),
    c(7, 97, 99, 99.5, 96.5, v.confirm),
  ];
}

function topCandles(v: { base: number; prev: number; cur: number; confirm: number }): Candle[] {
  return [
    c(0, 90, 92, 92.5, 89.5, v.base),
    c(1, 92, 94, 94.5, 91.5, v.base),
    c(2, 94, 96, 96.5, 93.5, v.base),
    c(3, 96, 98, 98.5, 95.5, v.base),
    c(4, 98, 100, 100.5, 97.5, v.base),
    c(5, 106, 109, 110, 105.5, v.prev),
    c(6, 109.5, 107, 110, 106.5, v.cur),
    c(7, 107, 105, 107.5, 104.5, v.confirm),
  ];
}

function ctxOf(candles: Candle[], structure: MarketStructure): PatternContext {
  return {
    candles,
    index: candles.length - 2,
    structure,
    htfStructure: structure,
    session: 'london',
    smartMoney: EMPTY_SMART_MONEY,
    indicators: NO_INDICATORS,
  };
}

const NO_VOLUME = { base: 0, prev: 0, cur: 0, confirm: 0 };
const REAL_VOLUME = { base: 100, prev: 100, cur: 140, confirm: 100 };

describe('ungated-diag: кандидаты до confidence-гейта', () => {
  it('вне трассировки ничего не пишется', () => {
    expect(isUngatedDiagActive()).toBe(false);
    ungatedCandidate('tweezer-bottom', 'buy', 0.3, 0.5, 1.0);
    expect(drainUngatedCandidates()).toEqual([]);
  });

  it('tweezer-bottom ниже порога: детектор возвращает null, кандидат записан с классом HTF и passed=false', () => {
    beginUngatedDiag();
    const result = detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP));
    const cands = drainUngatedCandidates();
    endUngatedDiag();
    expect(result).toBeNull();
    expect(cands).toHaveLength(1);
    expect(cands[0].name).toBe('tweezer-bottom');
    expect(cands[0].direction).toBe('buy');
    expect(cands[0].htfClass).toBe('1.00-bos');
    expect(cands[0].threshold).toBe(0.5);
    expect(cands[0].confidence).toBeCloseTo(0.4 * 1.0 * 1.05 * 0.9 * 1.25, 10);
    expect(cands[0].confidence).toBeLessThan(cands[0].threshold);
  });

  it('tweezer-top выше порога: детектор срабатывает, кандидат записан тоже', () => {
    beginUngatedDiag();
    const result = detectTweezerTop(ctxOf(topCandles(REAL_VOLUME), DOWN));
    const cands = drainUngatedCandidates();
    endUngatedDiag();
    expect(result).not.toBeNull();
    expect(cands).toHaveLength(1);
    expect(cands[0].name).toBe('tweezer-top');
    expect(cands[0].confidence).toBeGreaterThanOrEqual(cands[0].threshold);
    expect(cands[0].confidence).toBeCloseTo(result!.confidence, 10);
  });

  it('результат детектора одинаков с трассировкой и без неё', () => {
    const plain = detectTweezerBottom(ctxOf(bottomCandles(REAL_VOLUME), UP));
    beginUngatedDiag();
    const traced = detectTweezerBottom(ctxOf(bottomCandles(REAL_VOLUME), UP));
    endUngatedDiag();
    expect(traced).toEqual(plain);
  });

  it('drain очищает буфер', () => {
    beginUngatedDiag();
    detectTweezerBottom(ctxOf(bottomCandles(NO_VOLUME), UP));
    expect(drainUngatedCandidates()).toHaveLength(1);
    expect(drainUngatedCandidates()).toHaveLength(0);
    endUngatedDiag();
  });
});
