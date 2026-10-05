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
        accuracy: 0.4529,
        testCount: 1369,
        pValue: 0.0005366,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-breaker-block": {
      entry: {
        expiryBars: 30,
        accuracy: 0.4827,
        testCount: 2335,
        pValue: 0.09779,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-htf-mss": {
      entry: {
        expiryBars: 1,
        accuracy: 0.5026,
        testCount: 772,
        pValue: 0.914,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-inversion-retest": {
      entry: {
        expiryBars: 2,
        accuracy: 0.4828,
        testCount: 6494,
        pValue: 0.005649,
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
        accuracy: 0.4637,
        testCount: 2163,
        pValue: 0.000792,
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
        accuracy: 0.4782,
        testCount: 1332,
        pValue: 0.1183,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-return": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4806,
        testCount: 5183,
        pValue: 0.005464,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-sweep-return": {
      entry: {
        expiryBars: 3,
        accuracy: 0.4781,
        testCount: 1644,
        pValue: 0.0799,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "harmonic-pattern": {
      entry: {
        expiryBars: 30,
        accuracy: 0.5333,
        testCount: 750,
        pValue: 0.07351,
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
        accuracy: 0.4553,
        testCount: 7455,
        pValue: 1.177e-14,
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
        accuracy: 0.5018,
        testCount: 24270,
        pValue: 0.5853,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "marubozu-bearish": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4846,
        testCount: 2763,
        pValue: 0.11,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "marubozu-bullish": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4893,
        testCount: 2708,
        pValue: 0.2734,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "mean-reversion": {
      entry: {
        expiryBars: 5,
        accuracy: 0.4691,
        testCount: 388,
        pValue: 0.2429,
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
        accuracy: 0.4663,
        testCount: 2033,
        pValue: 0.002551,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "order-block-continuation": {
      entry: {
        expiryBars: 5,
        accuracy: 0.4797,
        testCount: 3594,
        pValue: 0.01557,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "BTCUSDT-ETHUSDT-SOLUSDT-BNBUSDT-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "order-block-nested": {
      entry: {
        expiryBars: 5,
        accuracy: 0.497,
        testCount: 823,
        pValue: 0.8891,
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
        accuracy: 0.4989,
        testCount: 3295,
        pValue: 0.9168,
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
        accuracy: 0.4078,
        testCount: 765,
        pValue: 3.866e-7,
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
        accuracy: 0.4555,
        testCount: 1113,
        pValue: 0.003291,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "fvg-htf-mss": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4372,
        testCount: 247,
        pValue: 0.05606,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-inversion-retest": {
      entry: {
        expiryBars: 1,
        accuracy: 0.4668,
        testCount: 2136,
        pValue: 0.002275,
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
        accuracy: 0.4773,
        testCount: 1077,
        pValue: 0.1435,
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
        accuracy: 0.5087,
        testCount: 1317,
        pValue: 0.5444,
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
        accuracy: 0.4805,
        testCount: 2150,
        pValue: 0.07343,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
    "fvg-sweep-return": {
      entry: {
        expiryBars: 3,
        accuracy: 0.4786,
        testCount: 654,
        pValue: 0.2911,
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
        accuracy: 0.4875,
        testCount: 441,
        pValue: 0.634,
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
        accuracy: 0.4586,
        testCount: 4695,
        pValue: 1.464e-8,
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
        accuracy: 0.4899,
        testCount: 13680,
        pValue: 0.01871,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "rejected",
      note: "significant below baseline (deduplicated)",
    },
    "marubozu-bullish": {
      entry: {
        expiryBars: 3,
        accuracy: 0.5123,
        testCount: 203,
        pValue: 0.779,
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
        accuracy: 0.4587,
        testCount: 196,
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
        expiryBars: 5,
        accuracy: 0.4745,
        testCount: 1100,
        pValue: 0.09721,
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
        accuracy: 0.4798,
        testCount: 1878,
        pValue: 0.08348,
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
        accuracy: 0.5018,
        testCount: 556,
        pValue: 0.9662,
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
        accuracy: 0.4977,
        testCount: 188,
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
        accuracy: 0.5032,
        testCount: 1262,
        pValue: 0.8438,
        significant: false,
        passesWilsonGate: false,
        sourceRun: "EURUSD-GBPUSD-USDJPY-AUDUSD-1m-walkforward-2026-03-01-2026-09-17",
      },
      status: "no-evidence",
      note: "not distinguishable from baseline (deduplicated)",
    },
  },
};
