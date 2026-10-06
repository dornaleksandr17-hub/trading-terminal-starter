#!/usr/bin/env tsx
/**
 * Собирает КОМПАКТНУЮ выжимку отчётов бэктеста для ИИ-аналитика
 * (src/lib/analyst/backtest-context.gen.json). Полные отчёты весят мегабайты
 * и в серверный бандл не тянутся — берём только то, что нужно модели:
 * итог по каждому паттерну на независимых наблюдениях и лучшие срезы
 * condition-scan. Числа копируются как есть, ничего не пересчитывается.
 *
 * Запуск: npm run backtest:gen-analyst-context
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = 'backtest/output';
const TARGET = 'src/lib/analyst/backtest-context.gen.json';

type Num = number | null | undefined;
const pct = (v: Num) => (typeof v === 'number' ? Math.round(v * 1000) / 10 : null);

interface AuditRow {
  patternName: string;
  independentTestDecided?: number | null;
  testAccuracyDeduped?: number | null;
  wilsonLowerBoundDeduped?: number | null;
  driftBaseline?: number | null;
  bestExpiryBars?: number | null;
  verdict?: string;
}

async function main(): Promise<void> {
  const files = await readdir(OUT_DIR);
  const audits = [];
  for (const f of files.filter((x) => x.startsWith('horizon-audit-') && x.endsWith('.json'))) {
    const d = JSON.parse(await readFile(join(OUT_DIR, f), 'utf-8')) as {
      meta: Record<string, unknown>;
      results: AuditRow[];
    };
    audits.push({
      symbols: d.meta.symbols,
      timeframe: d.meta.timeframe,
      from: d.meta.from,
      to: d.meta.to,
      algorithmVersion: d.meta.algorithmVersion,
      breakevenPct: pct(d.meta.breakevenRate as number),
      patterns: d.results
        .map((r) => ({
          pattern: r.patternName,
          independentTestDecided: r.independentTestDecided ?? 0,
          winRatePct: pct(r.testAccuracyDeduped),
          wilsonLowerPct: pct(r.wilsonLowerBoundDeduped),
          driftPct: pct(r.driftBaseline),
          bestExpiryBars: r.bestExpiryBars ?? null,
          verdict: r.verdict ?? null,
        }))
        .sort((a, b) => b.independentTestDecided - a.independentTestDecided),
    });
  }

  const scans = [];
  for (const f of files.filter((x) => x.startsWith('condition-scan-') && x.endsWith('.json'))) {
    const d = JSON.parse(await readFile(join(OUT_DIR, f), 'utf-8')) as {
      meta: Record<string, unknown>;
      results: Array<{
        pattern: string; slice: string; testDecided: number; testAccuracy: Num;
        wilsonLB: Num; driftBaseline: Num; beatsDrift: boolean; holmSignificant: boolean | null; status: string;
      }>;
    };
    const top = d.results
      .filter((r) => r.testDecided >= 200 && typeof r.wilsonLB === 'number')
      .sort((a, b) => (b.wilsonLB as number) - (a.wilsonLB as number))
      .slice(0, 30)
      .map((r) => ({
        pattern: r.pattern,
        slice: r.slice,
        testDecided: r.testDecided,
        winRatePct: pct(r.testAccuracy),
        wilsonLowerPct: pct(r.wilsonLB),
        driftPct: pct(r.driftBaseline),
        beatsDrift: r.beatsDrift,
        holmSignificant: r.holmSignificant,
      }));
    scans.push({ source: f.replace(/\.json$/, ''), meta: { symbols: d.meta.symbols, from: d.meta.from, to: d.meta.to }, topSlicesByWilson: top });
  }

  await writeFile(TARGET, JSON.stringify({ audits, conditionScans: scans }, null, 0) + '\n', 'utf-8');
  console.log(`[gen-analyst-context] записано ${TARGET}: ${audits.length} аудит(а), ${scans.length} скан(а)`);
}

main().catch((e: unknown) => { console.error(e); process.exit(1); });
