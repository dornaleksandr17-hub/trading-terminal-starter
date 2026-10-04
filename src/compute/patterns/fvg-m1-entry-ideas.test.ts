import { describe, it, expect } from 'vitest';
import { detectFvgHtfMss } from '@/compute/patterns/fvg-htf-mss';
import { detectFvgSweepReturn } from '@/compute/patterns/fvg-sweep-return';
import { detectFvgInversionRetest } from '@/compute/patterns/fvg-inversion-retest';
import type { Candle, IndicatorSnapshot } from '@/types/domain';
import type { SmartMoneyResult, SmartMoneyFVG } from '@/compute/indicators/smart-money';

const EMPTY: SmartMoneyResult = { orderBlocks: [], fvgs: [], inversionFvgs: [], breakerBlocks: [], rejectionBlocks: [], bosEvents: [] };
const SNAP = (atr: number | null = null): IndicatorSnapshot => ({
  rsi: null, emaFast: null, emaSlow: 100, macd: null, macdSignal: null, macdHistogram: null,
  atr, bollingerUpper: null, bollingerMiddle: null, bollingerLower: null,
  vwap: null, vwapIsProxyVolume: false, volumeProfilePoc: null, volumeProfilePocIsProxyVolume: false,
  meanReversionRsi: null, impulseVelocity: null, adx: null,
});

// Свечи по пути закрытий: open = прошлый close, фитили ±0.05 (как в risingWarmup).
function path(closes: number[], startClose: number, startTime: number): Candle[] {
  const out: Candle[] = [];
  let prev = startClose;
  closes.forEach((c, i) => {
    out.push({ time: startTime + i * 60, open: prev, close: c, high: Math.max(prev, c) + 0.05, low: Math.min(prev, c) - 0.05, volume: 100 });
    prev = c;
  });
  return out;
}
function ramp(from: number, to: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => from + ((to - from) * (i + 1)) / n);
}
function mockFvg(o: Partial<SmartMoneyFVG> & Pick<SmartMoneyFVG, 'top' | 'bottom' | 'time' | 'type'>): SmartMoneyFVG {
  return { broken: false, endTime: null, touchedTime: null, ce: (o.top + o.bottom) / 2, hasDisplacement: true, hasOBConfluence: false, hasBOSConfluence: false, ...o };
}

// t0 кратно 300 → границы синтетического M5 совпадают с индексами (бакеты по 5 M1).
const T0 = 1700000100;

// 60 баров подъёма 98→99.8 (12 M5), левый/средний/правый M5 с гэпом, затем откат в зону.
function htfMssBase(): number[] {
  return [
    ...ramp(98, 99.8, 60),
    99.84, 99.88, 99.92, 99.96, 100.0,       // левый M5: high ≈ 100.05
    100.8, 101.6, 102.4, 103.2, 104.0,       // средний M5: импульс
    104.1, 104.2, 104.3, 104.4, 104.5,       // правый M5: low ≈ 103.95 → bullish gap [100.05; 103.95]
  ];
}
// Конфлюэнс идеи A: M1-FVG, оставленный свечой слома (свежий, ≤3 баров). RSI при входе
// на MSS уже отскочил (>40), поэтому rsiConfirmOk не набирается — порог 67 достигается
// за счёт этого бонуса (скоринг и порог — общие с исходными FVG-стратегиями).
function withM1Fvg(candles: Candle[]): SmartMoneyResult {
  return { ...EMPTY, fvgs: [mockFvg({ top: 104.0, bottom: 103.6, time: candles[candles.length - 3].time, type: 'bullish' })] };
}
const PULLBACK = [104.2, 103.9, 103.5, 103.2, 103.0, 103.1, 103.8]; // экстремум на 103.0 (low 102.95)

describe('detectFvgHtfMss (идея A — HTF FVG + слом структуры M1)', () => {
  it('buy: первый M1-слом выше swing-high отката внутри непробитой HTF-зоны', () => {
    const candles = path([...htfMssBase(), ...PULLBACK, 104.5], 98, T0);
    const r = detectFvgHtfMss(candles, SNAP(), 'london', withM1Fvg(candles));
    expect(r).not.toBeNull();
    expect(r?.direction).toBe('buy');
    expect(r?.name).toBe('fvg-htf-mss');
  });

  it('один слом — один сигнал: следующая свеча над уровнем не повторяет вход', () => {
    const candles = path([...htfMssBase(), ...PULLBACK, 104.5, 104.7], 98, T0);
    expect(detectFvgHtfMss(candles, SNAP(), 'london', withM1Fvg(candles))).toBeNull();
  });

  it('без конфлюэнса скоринг ниже порога 67 — сигнала нет (пороги не ослаблялись)', () => {
    const candles = path([...htfMssBase(), ...PULLBACK, 104.5], 98, T0);
    expect(detectFvgHtfMss(candles, SNAP(), 'london', EMPTY)).toBeNull();
  });

  it('нет слома — нет сигнала (закрытие не выше swing-high отката)', () => {
    const candles = path([...htfMssBase(), ...PULLBACK, 104.1], 98, T0);
    expect(detectFvgHtfMss(candles, SNAP(), 'london', withM1Fvg(candles))).toBeNull();
  });

  it('зона пробита закрытием ниже дальнего края — сигнала нет', () => {
    const deep = [104.2, 103.5, 102.0, 100.0, 99.5, 100.2, 101.5, 104.5];
    const candles = path([...htfMssBase(), ...deep], 98, T0);
    expect(detectFvgHtfMss(candles, SNAP(), 'london', withM1Fvg(candles))).toBeNull();
  });

  it('мало истории → null', () => {
    expect(detectFvgHtfMss(path([100, 101], 100, T0), SNAP(), 'london', EMPTY)).toBeNull();
  });
});

// 50 баров у 100.3 (опорный минимум), 6 обычных, свеча-снятие, импульс, правая свеча, 2 вверх, возврат.
function sweepBase(sweepLow = 99.7): { candles: Candle[]; fvgTime: number } {
  const flat = Array.from({ length: 50 }, (_, i) => (i % 2 === 0 ? 100.3 : 100.4));
  const calm = [100.4, 100.35, 100.4, 100.35, 100.4, 100.35];
  const head = path([...flat, ...calm], 100.3, T0);
  const prevClose = head[head.length - 1].close;
  const sweep: Candle = { time: head[head.length - 1].time + 60, open: prevClose, close: 100.35, high: 100.4, low: sweepLow, volume: 100 };
  const tail = path([101.3, 101.6, 101.7, 101.9], 100.35, sweep.time + 60);
  const ret: Candle = { time: tail[tail.length - 1].time + 60, open: 101.8, close: 101.0, high: 101.85, low: 100.7, volume: 100 };
  return { candles: [...head, sweep, ...tail, ret], fvgTime: sweep.time };
}

describe('detectFvgSweepReturn (идея B — снятие ликвидности + возврат в FVG)', () => {
  it('buy: возврат в FVG, оставленный смещением после снятия минимума', () => {
    const { candles, fvgTime } = sweepBase();
    const sm = { ...EMPTY, fvgs: [mockFvg({ top: 101.25, bottom: 100.4, time: fvgTime, type: 'bullish' })] };
    const r = detectFvgSweepReturn(candles, SNAP(), 'london', sm);
    expect(r?.direction).toBe('buy');
    expect(r?.name).toBe('fvg-sweep-return');
  });

  it('без снятия ликвидности (фитиль не проколол минимум) — null', () => {
    const { candles, fvgTime } = sweepBase(100.3);
    const sm = { ...EMPTY, fvgs: [mockFvg({ top: 101.25, bottom: 100.4, time: fvgTime, type: 'bullish' })] };
    expect(detectFvgSweepReturn(candles, SNAP(), 'london', sm)).toBeNull();
  });

  it('FVG, возникший ДО снятия, не годится', () => {
    const { candles, fvgTime } = sweepBase();
    const sm = { ...EMPTY, fvgs: [mockFvg({ top: 101.25, bottom: 100.4, time: fvgTime - 120, type: 'bullish' })] };
    expect(detectFvgSweepReturn(candles, SNAP(), 'london', sm)).toBeNull();
  });

  it('одна зона — один сигнал: повторный вход в ту же зону не стреляет', () => {
    const { candles, fvgTime } = sweepBase();
    const again: Candle = { time: candles[candles.length - 1].time + 60, open: 101.4, close: 101.05, high: 101.45, low: 100.75, volume: 100 };
    const sm = { ...EMPTY, fvgs: [mockFvg({ top: 101.25, bottom: 100.4, time: fvgTime, type: 'bullish' })] };
    expect(detectFvgSweepReturn([...candles, again], SNAP(), 'london', sm)).toBeNull();
  });
});

function inversionBase(): { candles: Candle[]; breakTime: number } {
  const flat = Array.from({ length: 40 }, (_, i) => (i % 2 === 0 ? 100.3 : 100.4));
  const head = path(flat, 100.3, T0);
  const brk: Candle = { time: head[head.length - 1].time + 60, open: 100.4, close: 101.6, high: 101.65, low: 100.35, volume: 100 };
  const up = path([101.8, 102.0], 101.6, brk.time + 60);
  const ret: Candle = { time: up[up.length - 1].time + 60, open: 102.0, close: 101.2, high: 102.05, low: 100.9, volume: 100 };
  return { candles: [...head, brk, ...up, ret], breakTime: brk.time };
}
const IFVG = (time: number) => mockFvg({ top: 101.0, bottom: 100.2, time, type: 'bullish' });

describe('detectFvgInversionRetest (идея C — ретест инверсного FVG)', () => {
  it('buy: первый возврат в инверсную bullish-зону с закрытием не ниже CE', () => {
    const { candles, breakTime } = inversionBase();
    const r = detectFvgInversionRetest(candles, SNAP(0.5), 'london', { ...EMPTY, inversionFvgs: [IFVG(breakTime)] });
    expect(r?.direction).toBe('buy');
    expect(r?.name).toBe('fvg-inversion-retest');
  });

  it('слабая пробойная свеча (тело < 0.5 ATR) — зона не принимается', () => {
    const { candles, breakTime } = inversionBase();
    expect(detectFvgInversionRetest(candles, SNAP(5), 'london', { ...EMPTY, inversionFvgs: [IFVG(breakTime)] })).toBeNull();
  });

  it('если зона уже ретестировалась раньше — повторного сигнала нет', () => {
    const { candles, breakTime } = inversionBase();
    const early: Candle = { time: candles[candles.length - 1].time + 60, open: 101.5, close: 101.1, high: 101.55, low: 100.85, volume: 100 };
    const late: Candle = { time: early.time + 60, open: 101.4, close: 101.15, high: 101.45, low: 100.9, volume: 100 };
    const all = [...candles.slice(0, -1), early, late];
    // candles[-1] (первый ретест) заменён на early → «late» — второй вход в зону
    const sm = { ...EMPTY, inversionFvgs: [IFVG(breakTime)] };
    expect(detectFvgInversionRetest(all, SNAP(0.5), 'london', sm)).toBeNull();
  });

  it('зона, пробитая обратно (broken), игнорируется', () => {
    const { candles, breakTime } = inversionBase();
    const z = { ...IFVG(breakTime), broken: true };
    expect(detectFvgInversionRetest(candles, SNAP(0.5), 'london', { ...EMPTY, inversionFvgs: [z] })).toBeNull();
  });
});
