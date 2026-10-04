import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateRandomWalk } from './synthetic/random-walk';

// BUGFIX (реальный прогон 2026-09-27, лог GBPUSD): loadHistory() бросал
// ошибку после исчерпания MAX_CONSECUTIVE_FETCH_ERRORS (реальный, не
// транзиентный сетевой обрыв), и это падало через весь for-цикл символов в
// main(), убивая ВЕСЬ многочасовой прогон — включая символы, до которых
// очередь ещё не дошла, хотя уже собранные символы были в полном порядке.
// Этот тест воспроизводит именно это: один символ (GBPUSD) бросает ошибку,
// другой (EURUSD) — в порядке. Падает на коде без try/catch вокруг тела
// цикла (main() отклоняет промис вместо того чтобы завершиться), проходит
// после фикса (EURUSD посчитан, GBPUSD отмечен как провалившийся, а не
// молча пропущен и не уронивший всё остальное).
vi.mock('./data-loader', () => ({
  resolveHistorySource: () => 'deriv' as const,
  loadHistory: ({ symbol }: { symbol: string }) => {
    if (symbol === 'GBPUSD') return Promise.reject(new Error('Deriv WS: connection failed'));
    return Promise.resolve({
      candles: generateRandomWalk({ bars: 7000, seed: 11, noiseFraction: 0.15 }),
      truncated: false,
    });
  },
}));

import { main } from './horizon-audit';

interface PerSymbolCandleCount {
  symbolId: string;
  candles1m: number;
  candlesResampled: number;
  truncated: boolean;
}
interface Report {
  meta: { historyTruncated?: boolean; [key: string]: unknown };
  poolMeta?: { perSymbolCandleCounts: PerSymbolCandleCount[] };
  results: unknown[];
}

let workDir: string;
let originalCwd: string;
let originalArgv: string[];

beforeAll(() => {
  originalCwd = process.cwd();
  originalArgv = process.argv;
  workDir = mkdtempSync(join(tmpdir(), 'horizon-resilience-'));
  process.chdir(workDir);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  process.argv = originalArgv;
  process.chdir(originalCwd);
  vi.restoreAllMocks();
  rmSync(workDir, { recursive: true, force: true });
});

describe('horizon-audit main(): один сбойный символ не должен ронять весь прогон', () => {
  it('EURUSD успешно посчитан, GBPUSD отмечен провалившимся, процесс не падает', { timeout: 60000 }, async () => {
    const out = join(workDir, 'out');
    process.argv = [
      'node', 'horizon-audit.ts',
      '--symbols=EURUSD,GBPUSD',
      '--from=2026-03-01', '--to=2026-03-15', '--timeframe=1m', '--min-samples=20',
      `--output=${out}`,
    ];

    // Раньше main() отклонял промис целиком (весь прогон падал) — тест на
    // старом коде должен упасть именно на этом await, а не дойти до проверок ниже.
    await main();

    const files = readdirSync(out);
    const json = JSON.parse(readFileSync(join(out, files.find((f) => f.endsWith('.json'))!), 'utf8')) as Report;

    const counts = json.poolMeta!.perSymbolCandleCounts;
    const eurusd = counts.find((p) => p.symbolId === 'EURUSD');
    const gbpusd = counts.find((p) => p.symbolId === 'GBPUSD');

    expect(eurusd).toBeDefined();
    expect(eurusd!.candles1m).toBeGreaterThan(0);
    expect(eurusd!.truncated).toBe(false);

    expect(gbpusd).toBeDefined();
    expect(gbpusd!.candles1m).toBe(0);
    expect(gbpusd!.truncated).toBe(true);

    // Агрегированный флаг честно отражает, что не всё прошло гладко.
    expect(json.meta.historyTruncated).toBe(true);

    // Результаты по EURUSD всё равно есть в отчёте — не всё потеряно.
    expect(json.results.length).toBeGreaterThan(0);
  });
});
