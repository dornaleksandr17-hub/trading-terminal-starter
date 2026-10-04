// АВТОГЕНЕРИРОВАНО — не редактировать руками.
// Генератор: backtest/generate-pattern-horizon-table.ts
// Перегенерация: npm run backtest:gen-horizon-table
// Сверка в CI:  npm run backtest:gen-horizon-table -- --check
//
// Источники: BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17, EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17
import type { AssetClass } from '@/types/domain';

export interface PatternHorizonEntry {
  /** Лучший горизонт в барах, выбранный ТОЛЬКО по train/validation. */
  expiryBars: number;
  /** Точность на отложенных test-наблюдениях. */
  accuracy: number;
  testCount: number;
  pValue: number | null;
  significant: boolean;
  passesWilsonGate: boolean;
  sourceRun: string;
}

/**
 * 'valid'       — значимо лучше случайного + Wilson pass → берём expiryBars.
 * 'rejected'    — значимо ХУЖЕ случайного → signal-builder подавляет сигнал.
 * 'no-evidence' — отличие не установлено (или не прошло Wilson) → fallback,
 *                 сигнал НЕ подавляется. Отсутствие записи эквивалентно.
 */
export type PatternHorizonStatus = 'valid' | 'rejected' | 'no-evidence';

export interface PatternHorizonRecord {
  entry: PatternHorizonEntry | null;
  status: PatternHorizonStatus;
  note?: string;
}

export type PatternHorizonTable = Record<AssetClass, Partial<Record<string, PatternHorizonRecord>>>;

export const PATTERN_HORIZON_TABLE: PatternHorizonTable = {
  crypto: {
    "consolidation-breakout": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4539,
        testCount: 1866,
        pValue: 0.00007458,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-breaker-block": {
      entry: {
        expiryBars: 10,
        accuracy: 0.4615,
        testCount: 1571,
        pValue: 0.002455,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-nested": {
      entry: {
        expiryBars: 5,
        accuracy: 0.4792,
        testCount: 2692,
        pValue: 0.03239,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-rejection": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4773,
        testCount: 3905,
        pValue: 0.004849,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-return": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4689,
        testCount: 5067,
        pValue: 0.00001022,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "harmonic-pattern": {
      entry: {
        expiryBars: 30,
        accuracy: 0.5324,
        testCount: 817,
        pValue: 0.06881,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "impulse-breakout": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4509,
        testCount: 6973,
        pValue: 2.451e-16,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "inside-bar": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4871,
        testCount: 25346,
        pValue: 0.00003881,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "marubozu-bearish": {
      entry: {
        expiryBars: 2,
        accuracy: 0.4552,
        testCount: 279,
        pValue: 0.1506,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "marubozu-bullish": {
      entry: {
        expiryBars: 2,
        accuracy: 0.4099,
        testCount: 322,
        pValue: 0.001452,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "mean-reversion": {
      entry: {
        expiryBars: 20,
        accuracy: 0.4773,
        testCount: 419,
        pValue: 0.3792,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "order-block-breaker": {
      entry: {
        expiryBars: 30,
        accuracy: 0.4654,
        testCount: 2357,
        pValue: 0.0008437,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "order-block-continuation": {
      entry: {
        expiryBars: 10,
        accuracy: 0.4746,
        testCount: 3639,
        pValue: 0.002283,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "order-block-nested": {
      entry: {
        expiryBars: 30,
        accuracy: 0.4841,
        testCount: 851,
        pValue: 0.3728,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "pin-bar": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4391,
        testCount: 271,
        pValue: 0.05171,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "strong-order-block-reaction": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4855,
        testCount: 4056,
        pValue: 0.06618,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
  },
  forex: {
    "consolidation-breakout": {
      entry: {
        expiryBars: 2,
        accuracy: 0.4174,
        testCount: 860,
        pValue: 0.000001447,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-breaker-block": {
      entry: {
        expiryBars: 5,
        accuracy: 0.4582,
        testCount: 993,
        pValue: 0.009229,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-nested": {
      entry: {
        expiryBars: 20,
        accuracy: 0.4885,
        testCount: 1615,
        pValue: 0.3704,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-rejection": {
      entry: {
        expiryBars: 1,
        accuracy: 0.5175,
        testCount: 1432,
        pValue: 0.1953,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-return": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4825,
        testCount: 2454,
        pValue: 0.08617,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "harmonic-pattern": {
      entry: {
        expiryBars: 30,
        accuracy: 0.4868,
        testCount: 491,
        pValue: 0.5882,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "impulse-breakout": {
      entry: {
        expiryBars: 2,
        accuracy: 0.4591,
        testCount: 5236,
        pValue: 3.543e-9,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "inside-bar": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4918,
        testCount: 13303,
        pValue: 0.0611,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "marubozu-bullish": {
      entry: {
        expiryBars: 3,
        accuracy: 0.5268,
        testCount: 224,
        pValue: 0.4624,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "mean-reversion": {
      entry: {
        expiryBars: 15,
        accuracy: 0.4444,
        testCount: 189,
        pValue: null,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "fewer independent observations than the significance threshold",
    },
    "order-block-breaker": {
      entry: {
        expiryBars: 10,
        accuracy: 0.4767,
        testCount: 1548,
        pValue: 0.07111,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "order-block-continuation": {
      entry: {
        expiryBars: 30,
        accuracy: 0.481,
        testCount: 2131,
        pValue: 0.08307,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "order-block-nested": {
      entry: {
        expiryBars: 30,
        accuracy: 0.4943,
        testCount: 613,
        pValue: 0.8085,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "pin-bar": {
      entry: {
        expiryBars: 3,
        accuracy: 0.4675,
        testCount: 198,
        pValue: null,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "fewer independent observations than the significance threshold",
    },
    "strong-order-block-reaction": {
      entry: {
        expiryBars: 10,
        accuracy: 0.4981,
        testCount: 2847,
        pValue: 0.8513,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
  },
};
