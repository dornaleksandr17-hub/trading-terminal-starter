import { describe, it, expect } from 'vitest';
import { resolveHistorySource } from './data-loader';
import { fingerprint, type CacheKey } from './occurrence-cache';

describe('resolveHistorySource', () => {
  it('по умолчанию крипта, поддерживаемая Deriv, идёт через Deriv (прежний маршрут)', () => {
    for (const s of ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT']) {
      expect(resolveHistorySource(s, {})).toBe('deriv');
    }
  });

  it('BACKTEST_CRYPTO_SOURCE=binance переключает крипту на Binance (регистр и пробелы не важны)', () => {
    expect(resolveHistorySource('BTCUSDT', { BACKTEST_CRYPTO_SOURCE: 'binance' })).toBe('binance');
    expect(resolveHistorySource('ETHUSDT', { BACKTEST_CRYPTO_SOURCE: ' Binance ' })).toBe('binance');
  });

  it('форекс всегда остаётся на Deriv, даже с переключателем', () => {
    expect(resolveHistorySource('EURUSD', { BACKTEST_CRYPTO_SOURCE: 'binance' })).toBe('deriv');
  });

  it('неизвестное значение переключателя игнорируется', () => {
    expect(resolveHistorySource('BTCUSDT', { BACKTEST_CRYPTO_SOURCE: 'foo' })).toBe('deriv');
  });
});

describe('occurrence-cache fingerprint и источник истории', () => {
  const base: CacheKey = {
    symbol: 'BTCUSDT',
    timeframe: '1m',
    from: '2026-03-01',
    to: '2026-09-17',
    windowSize: 100,
    maxExpiry: 5,
    activeFeatures: [],
    config: {},
    algorithmVersion: 7,
  };

  it('разные источники дают разные ключи (Deriv и Binance не подменяют друг друга)', () => {
    expect(fingerprint({ ...base, source: 'deriv' })).not.toBe(fingerprint({ ...base, source: 'binance' }));
  });

  it('без source ключ не изменился (обратная совместимость со старым кэшем)', () => {
    expect(fingerprint(base)).toBe(fingerprint({ ...base, source: undefined }));
  });
});
