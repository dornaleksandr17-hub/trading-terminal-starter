import { describe, it, expect } from 'vitest';
import type { Candle, MarketStructure, IndicatorSnapshot } from '@/types/domain';
import type { SmartMoneyResult } from '@/compute/indicators/smart-money';
import { atr } from '@/compute/indicators/atr';
import { lastNonNull } from '@/compute/indicators/helpers';
import { detectLiquiditySweep } from './liquidity-sweep';
import { detectLiquiditySweepReaction } from './liquidity-sweep-reaction';
import { detectMeanReversion } from './mean-reversion';
import { detectAllPatterns } from './index';
import { bosAlignsWithDirection } from './pattern-context';

// Регрессионные тесты «очевидных багов» из fix-plan-liquidity-meanreversion.md:
// F06 (mean-reversion), F10, F15, F16, F17, F19 (liquidity-sweep и
// liquidity-sweep-reaction). Каждый тест написан так, чтобы падать на коде до
// правки и проходить после.

function candle(time: number, open: number, close: number, high: number, low: number, volume = 100): Candle {
  return { time, open, high, low, close, volume };
}

const WARMUP_LOW = 99.4;
const WARMUP_HIGH = 100.6;

function flatWarmup(count = 30): Candle[] {
  return Array.from({ length: count }, (_, i) => {
    const bullish = i % 2 === 0;
    return candle(i, bullish ? 99.9 : 100.1, bullish ? 100.1 : 99.9, WARMUP_HIGH, WARMUP_LOW, 100);
  });
}

// Зеркало относительно цены 100: buy-сценарий превращается в sell-сценарий.
function mirrorCandles(candles: Candle[]): Candle[] {
  return candles.map((c) => ({
    time: c.time,
    open: 200 - c.open,
    close: 200 - c.close,
    high: 200 - c.low,
    low: 200 - c.high,
    volume: c.volume,
  }));
}

function mirrorStructure(s: MarketStructure): MarketStructure {
  return {
    ...s,
    bosDirection: s.bosDirection === 'up' ? 'down' : s.bosDirection === 'down' ? 'up' : undefined,
    trend: s.trend === 'up' ? 'down' : s.trend === 'down' ? 'up' : 'range',
    swingHigh: s.swingLow == null ? null : 200 - s.swingLow,
    swingLow: s.swingHigh == null ? null : 200 - s.swingHigh,
  };
}

const EMPTY_SMART_MONEY: SmartMoneyResult = {
  orderBlocks: [], fvgs: [], inversionFvgs: [], breakerBlocks: [], rejectionBlocks: [], bosEvents: [],
};

const struct = (over: Partial<MarketStructure>): MarketStructure => ({
  trend: 'range', bos: false, choch: false, swingHigh: null, swingLow: null, provisional: false, ...over,
});

// Базовый buy-свип: прокол ~1.8 ATR ниже 20-барного минимума, закрытие внутри.
const sweepBar = () => candle(30, 99.5, 99.6, 100.5, 97.6, 260);
// Бар смещения: бычий, закрытие выше high свип-бара, low выше low свип-бара.
const displacementBar = () => candle(31, 100.5, 103.5, 103.7, 100.4, 300);

// ─────────────────────────────────────────────────────────────────────────
describe('F10 — liquidity-sweep: reversal-at-key-level использует направленную близость к swing', () => {
  it('buy: близость high свечи к swingHigh (сопротивление) НЕ делает разворот у ключевого уровня', () => {
    const candles = [...flatWarmup(30), sweepBar()];
    // trend='down' (контр-тренд для buy) — continuation исключён. swingLow далеко,
    // swingHigh вплотную к high свип-бара (100.5): прежняя isNearSwingLevel это пропускала.
    const wrongSide = struct({ trend: 'down', bos: true, swingHigh: 100.5, swingLow: 50 });
    expect(detectLiquiditySweep(candles, wrongSide, 'london', EMPTY_SMART_MONEY)).toBeNull();
  });

  it('buy: близость low свечи к swingLow по-прежнему даёт reversal-at-key-level', () => {
    const candles = [...flatWarmup(30), sweepBar()];
    const rightSide = struct({ trend: 'down', bos: true, swingHigh: 130, swingLow: 97.6 });
    const r = detectLiquiditySweep(candles, rightSide, 'london', EMPTY_SMART_MONEY);
    expect(r?.setupType).toBe('reversal-at-key-level');
    expect(r?.direction).toBe('buy');
  });

  it('sell (зеркало): близость low свечи к swingLow НЕ делает разворот; близость high к swingHigh — делает', () => {
    const candles = mirrorCandles([...flatWarmup(30), sweepBar()]);
    const wrongSide = mirrorStructure(struct({ trend: 'down', bos: true, swingHigh: 100.5, swingLow: 50 }));
    expect(detectLiquiditySweep(candles, wrongSide, 'london', EMPTY_SMART_MONEY)).toBeNull();

    const rightSide = mirrorStructure(struct({ trend: 'down', bos: true, swingHigh: 130, swingLow: 97.6 }));
    const r = detectLiquiditySweep(candles, rightSide, 'london', EMPTY_SMART_MONEY);
    expect(r?.setupType).toBe('reversal-at-key-level');
    expect(r?.direction).toBe('sell');
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('F15 — liquidity-sweep-reaction: BOS/CHoCH учитываются только в направлении сделки', () => {
  const candles = [...flatWarmup(30), sweepBar(), displacementBar()];
  // Reversal-маршрут: trend='down' против buy, swingLow у прокола. Для reversal
  // htfAlignment во внутреннем свипе не применяется (множитель 0.9), поэтому
  // confidence стадии свипа не зависит от bos/choch, а различие даёт только ×0.75.
  const run = (over: Partial<MarketStructure>) =>
    detectLiquiditySweepReaction(
      candles,
      struct({ swingHigh: 130, swingLow: 97.6, ...over }),
      'london',
      EMPTY_SMART_MONEY,
    );

  it('медвежий BOS (trend=down) не подтверждает бычью реакцию — штраф ×0.75 не снимается', () => {
    const bearishBos = run({ trend: 'down', bos: true });
    const noSignal = run({ trend: 'down' });
    const bullishChoch = run({ trend: 'down', choch: true });
    expect(bearishBos).not.toBeNull();
    expect(noSignal).not.toBeNull();
    expect(bullishChoch).not.toBeNull();
    // Прежний код: bearishBos === bullishChoch > noSignal.
    expect(bearishBos!.confidence).toBeCloseTo(noSignal!.confidence, 10);
    expect(bullishChoch!.confidence).toBeGreaterThan(bearishBos!.confidence);
  });

  it('BOS в range без bosDirection не подтверждает реакцию (решение D2)', () => {
    const rangeBos = run({ trend: 'range', bos: true });
    const noSignal = run({ trend: 'down' });
    expect(rangeBos).not.toBeNull();
    expect(rangeBos!.confidence).toBeCloseTo(noSignal!.confidence, 10);
  });

  it('D2: BOS в range с bosDirection подтверждает реакцию только в свою сторону', () => {
    const noSignal = run({ trend: 'down' });
    const upBos = run({ trend: 'range', bos: true, bosDirection: 'up' });
    const downBos = run({ trend: 'range', bos: true, bosDirection: 'down' });
    expect(upBos!.confidence).toBeGreaterThan(noSignal!.confidence);
    expect(downBos!.confidence).toBeCloseTo(noSignal!.confidence, 10);
  });

  it('bosAlignsWithDirection: up→buy, down→sell, range и отсутствие BOS — нет', () => {
    expect(bosAlignsWithDirection(struct({ trend: 'up', bos: true }), 'buy')).toBe(true);
    expect(bosAlignsWithDirection(struct({ trend: 'up', bos: true }), 'sell')).toBe(false);
    expect(bosAlignsWithDirection(struct({ trend: 'down', bos: true }), 'sell')).toBe(true);
    expect(bosAlignsWithDirection(struct({ trend: 'down', bos: true }), 'buy')).toBe(false);
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: true }), 'buy')).toBe(false);
    expect(bosAlignsWithDirection(struct({ trend: 'up', bos: false }), 'buy')).toBe(false);
  });

  it('D2: bosDirection главнее trend; BOS в range с направлением подтверждает свою сторону', () => {
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: true, bosDirection: 'up' }), 'buy')).toBe(true);
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: true, bosDirection: 'up' }), 'sell')).toBe(false);
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: true, bosDirection: 'down' }), 'sell')).toBe(true);
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: true, bosDirection: 'down' }), 'buy')).toBe(false);
    expect(bosAlignsWithDirection(struct({ trend: 'range', bos: false, bosDirection: 'up' }), 'buy')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('F16 — liquidity-sweep-reaction: сессия и OB/FVG-конфлюэнс считаются один раз', () => {
  it('confidence реакции = (sweep.confidence + displacement)/2 без повторных ×session и ×(1+confluence)', () => {
    // Объём бара смещения ~2.3× среднего: ≥2.0 (множитель 1.0), <2.5 (без ×1.3),
    // чтобы результат не упирался в clamp и двойной счёт был виден.
    // Тело бара смещения умеренное (~1.4 ATR) — displacement-часть тоже не упирается в 1.0.
    const candles = [...flatWarmup(30), sweepBar(), candle(31, 100.5, 102.5, 102.7, 100.4, 250)];
    const structure = struct({ trend: 'up', bos: true, swingHigh: 130, swingLow: 97.6 });
    // Свежий бычий OB рядом со свип-баром → confluenceBonus 0.1 внутри свипа.
    const smartMoney: SmartMoneyResult = {
      ...EMPTY_SMART_MONEY,
      orderBlocks: [{
        top: 98.6, bottom: 97.8, time: 20, type: 'bullish', mitigated: false, endTime: null, touchCount: 0,
        rejections: [], status: 'untested', strengthScore: 1, bodyTop: 98.6, bodyBottom: 97.8,
        meanThreshold: 98.2, hasFvgConfluence: true, hasLiquiditySweep: true, hasDisplacement: true,
        hasStructureConfluence: true,
      }],
    };

    const sweep = detectLiquiditySweep(candles.slice(0, -1), structure, 'london', smartMoney, 20, 14);
    expect(sweep).not.toBeNull();
    const atrValue = lastNonNull(atr(candles, 14))!;
    const body = Math.abs(candles[candles.length - 1].close - candles[candles.length - 1].open);
    const displacement = Math.min(1, body / atrValue / 2);
    const expected = (sweep!.confidence + displacement) / 2;
    // Запас до clamp: прежний двойной счёт (×1.1×1.05) дал бы заметно большее значение.
    expect(expected).toBeLessThan(0.9);

    const r = detectLiquiditySweepReaction(candles, structure, 'london', smartMoney);
    expect(r).not.toBeNull();
    expect(r!.confidence).toBeCloseTo(expected, 10);
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('F17 — sessionAgnostic доходит до стадии свипа в liquidity-sweep-reaction', () => {
  // Глубокий прокол (~1.76 ATR): confidence свипа упирается в 1.0 до сессионного
  // множителя → в Asia ×0.6 = 0.60 (<0.65, отказ), для sessionAgnostic ×0.7 = 0.70.
  const deepSweep = candle(30, 99.5, 99.6, 100.5, 97.0, 260);
  const candles = [...flatWarmup(30), deepSweep, displacementBar()];
  const structure = struct({ trend: 'up', bos: true, swingHigh: 130, swingLow: 97.6 });

  it('форекс (sessionAgnostic не задан): азиатская сессия отсекает реакцию', () => {
    expect(detectLiquiditySweepReaction(candles, structure, 'tokyo', EMPTY_SMART_MONEY)).toBeNull();
  });

  it('крипта (sessionAgnostic=true): та же свеча в азиатской сессии даёт реакцию', () => {
    const r = detectLiquiditySweepReaction(candles, structure, 'tokyo', EMPTY_SMART_MONEY, 14, true);
    expect(r).not.toBeNull();
    expect(r?.direction).toBe('buy');
  });

  it('detectAllPatterns пробрасывает sessionAgnostic в liquidity-sweep-reaction (tokyo)', () => {
    const base = Date.UTC(2026, 9, 5, 2, 0, 0) / 1000; // понедельник 02:00 UTC — tokyo
    const timed = candles.map((c, i) => ({ ...c, time: base + i * 60 }));
    const htf = struct({ trend: 'range' });
    const names = (agnostic: boolean) =>
      detectAllPatterns(timed, ['liquidity-sweep-reaction'], undefined, structure, EMPTY_SMART_MONEY, 14,
        undefined, undefined, htf, agnostic).map((p) => p.name);
    expect(names(false)).not.toContain('liquidity-sweep-reaction');
    expect(names(true)).toContain('liquidity-sweep-reaction');
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('F19 — liquidity-sweep-reaction: проверка бара смещения и промежуточного бара', () => {
  const structure = struct({ trend: 'up', bos: true, swingHigh: 130, swingLow: 97.6 });

  it('контроль: исходный бычий бар смещения проходит', () => {
    const candles = [...flatWarmup(30), sweepBar(), displacementBar()];
    expect(detectLiquiditySweepReaction(candles, structure, 'london', EMPTY_SMART_MONEY)).not.toBeNull();
  });

  it('бар смещения обратного направления (медвежья свеча, закрытие выше high свипа) отбрасывается', () => {
    const candles = [...flatWarmup(30), sweepBar(), candle(31, 106, 103.2, 106.1, 102.9, 300)];
    expect(detectLiquiditySweepReaction(candles, structure, 'london', EMPTY_SMART_MONEY)).toBeNull();
  });

  it('бар смещения, повторно ушедший ниже low свип-бара, отбрасывается', () => {
    // Закрытие выше high свипа, тело 6.3 из диапазона 6.7 (проходит прежние гейты), но low 97.0 < 97.6.
    const candles = [...flatWarmup(30), sweepBar(), candle(31, 97.2, 103.5, 103.7, 97.0, 300)];
    expect(detectLiquiditySweepReaction(candles, structure, 'london', EMPTY_SMART_MONEY)).toBeNull();
  });

  it('промежуточный бар (свип 2 бара назад), ушедший тенью ниже low свипа и закрывшийся внутри, отбрасывается', () => {
    const candles = [
      ...flatWarmup(30),
      sweepBar(),
      candle(31, 100.5, 100.6, 100.7, 97.0, 100),
      candle(32, 100.6, 104, 104.2, 100.5, 300),
    ];
    expect(detectLiquiditySweepReaction(candles, structure, 'london', EMPTY_SMART_MONEY)).toBeNull();
  });

  it('контроль: промежуточный бар, удержавший уровень, по-прежнему проходит', () => {
    const candles = [
      ...flatWarmup(30),
      sweepBar(),
      candle(31, 100.5, 100.6, 100.7, 100.4, 100),
      candle(32, 100.6, 104, 104.2, 100.5, 300),
    ];
    expect(detectLiquiditySweepReaction(candles, structure, 'london', EMPTY_SMART_MONEY)).not.toBeNull();
  });

  it('sell (зеркало): бычий бар смещения и повторный уход выше high свипа отбрасываются', () => {
    const mStructure = mirrorStructure(structure);
    const ok = mirrorCandles([...flatWarmup(30), sweepBar(), displacementBar()]);
    const r = detectLiquiditySweepReaction(ok, mStructure, 'london', EMPTY_SMART_MONEY);
    expect(r?.direction).toBe('sell');

    const wrongDir = mirrorCandles([...flatWarmup(30), sweepBar(), candle(31, 106, 103.2, 106.1, 102.9, 300)]);
    expect(detectLiquiditySweepReaction(wrongDir, mStructure, 'london', EMPTY_SMART_MONEY)).toBeNull();

    const retook = mirrorCandles([...flatWarmup(30), sweepBar(), candle(31, 97.2, 103.5, 103.7, 97.0, 300)]);
    expect(detectLiquiditySweepReaction(retook, mStructure, 'london', EMPTY_SMART_MONEY)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────
describe('F06 — mean-reversion: направление свечи возврата', () => {
  const snapshot: IndicatorSnapshot = {
    rsi: 50, emaFast: 100, emaSlow: 100,
    macd: 0, macdSignal: 0, macdHistogram: 0,
    atr: 1.2, bollingerUpper: 102, bollingerMiddle: 100, bollingerLower: 98,
    vwap: null, vwapIsProxyVolume: false, volumeProfilePoc: null, volumeProfilePocIsProxyVolume: false,
    meanReversionRsi: null, impulseVelocity: null, adx: 10,
  };
  const exitBar = () => candle(30, 100, 96, 100.2, 95, 120); // закрытие под нижней полосой (98)
  const bullishReturn = () => candle(31, 96, 99, 99.5, 95.8, 120);
  // Медвежья свеча возврата: закрытие 99 > 98 (нижняя полоса), но close < open.
  const bearishReturn = () => candle(31, 100.4, 99, 100.5, 98.9, 120);

  it('buy: бычья свеча возврата проходит (контроль)', () => {
    const r = detectMeanReversion([...flatWarmup(30), exitBar(), bullishReturn()], snapshot, 20, 'london');
    expect(r?.direction).toBe('buy');
  });

  it('buy: медвежья свеча возврата, закрывшаяся выше нижней полосы, не даёт сигнал', () => {
    expect(detectMeanReversion([...flatWarmup(30), exitBar(), bearishReturn()], snapshot, 20, 'london')).toBeNull();
  });

  it('sell (зеркало): медвежья свеча возврата проходит, бычья — нет', () => {
    const mSnapshot = { ...snapshot, bollingerUpper: 102, bollingerLower: 98 };
    const ok = mirrorCandles([...flatWarmup(30), exitBar(), bullishReturn()]);
    expect(detectMeanReversion(ok, mSnapshot, 80, 'london')?.direction).toBe('sell');

    const bad = mirrorCandles([...flatWarmup(30), exitBar(), bearishReturn()]);
    expect(detectMeanReversion(bad, mSnapshot, 80, 'london')).toBeNull();
  });
});
