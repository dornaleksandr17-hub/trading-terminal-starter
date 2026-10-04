#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────────────
// npm run backtest:condition-scan -- --symbols=BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT
//   --timeframe=1m --from=2026-03-01 --to=2026-09-17 [--patterns=harmonic-pattern]
//   [--wf-folds=8] [--purge-bars=30] [--select-min-acc=0.53]
//
// Read-only: occurrences берутся из occurrence-кэша horizon-audit (тот же
// fingerprint, та же версия алгоритма). Если кэша нет — сначала запустите
// backtest:horizon-audit с теми же параметрами. Детекция не перезапускается
// (кроме восстановления harmonicType/PRZ-конфлюэнса для гармоник — тем же
// detectAllPatterns на тех же барах, с проверкой совпадения confidence).
// ─────────────────────────────────────────────────────────────────────────

import { writeFile, mkdir } from 'node:fs/promises';
import {
  auditFeatureSet,
  dedupeOccurrencesPooled,
  HORIZON_GRIDS,
  type Occurrence,
} from './horizon-audit';
import { readCache, type CacheKey } from './occurrence-cache';
import { loadHistory, resolveHistorySource } from './data-loader';
import { resample } from './resampler';
import { computeFoldBoundaries, assignFoldIndex } from './horizon-partitioning';
import { OCCURRENCE_ALGORITHM_VERSION } from './audit-version';
import {
  adxBucket,
  atrRegimeBucket,
  volumeBucket,
  confidenceBucket,
  hourBucket,
  scanPattern,
  applyHolm,
  type ScanOccurrence,
  type SliceResult,
  type ScanParams,
} from './condition-scan-core';
import { DEFAULT_INDICATOR_CONFIG, type Candle, type PatternName } from '@/types/domain';
import { adx } from '@/compute/indicators/adx';
import { atr } from '@/compute/indicators/atr';
import { ema, sma } from '@/compute/indicators/ema';
import { getSessionRegime } from '@/compute/session-regime';
import { detectAllPatterns } from '@/compute/patterns';
import { computeIndicatorSeriesRaw, snapshotFromSeries } from '@/compute/IndicatorAggregator';
import { computeStructure } from '@/compute/indicators/trend-structure';
import { calcSmartMoney } from '@/compute/indicators/smart-money';
import { isCrypto } from '@/data/symbols';

function parseArgs() {
  const m = new Map<string, string>();
  for (const a of process.argv.slice(2)) {
    const r = /^--([^=]+)=(.*)$/.exec(a);
    if (r) m.set(r[1], r[2]);
  }
  return {
    symbols: (m.get('symbols') ?? 'BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT').split(','),
    timeframe: m.get('timeframe') ?? '1m',
    from: m.get('from') ?? '2026-03-01',
    to: m.get('to') ?? '2026-09-17',
    patterns: m.get('patterns')?.split(',') ?? null,
    folds: parseInt(m.get('wf-folds') ?? '8', 10),
    purgeBars: parseInt(m.get('purge-bars') ?? '30', 10),
    windowSize: parseInt(m.get('window-size') ?? '500', 10),
    selectMinAcc: parseFloat(m.get('select-min-acc') ?? '0.53'),
    payout: parseFloat(m.get('payout') ?? '80'),
  };
}

const BAR_SECONDS: Record<string, number> = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600 };

interface SymbolSeries {
  candles: Candle[];
  adx: (number | null)[];
  atrRatio: (number | null)[];
  ema200: (number | null)[];
  volRatio: (number | null)[];
  volumeReliable: boolean;
}

function buildSeries(candles: Candle[]): SymbolSeries {
  const atrS = atr(candles, DEFAULT_INDICATOR_CONFIG.atrPeriod);
  const atrRatio: (number | null)[] = atrS.map((v, i) => {
    if (v === null || i < 500) return null;
    const hist = atrS.slice(i - 500, i).filter((x): x is number => x !== null).sort((a, b) => a - b);
    if (hist.length < 100) return null;
    const med = hist[Math.floor(hist.length / 2)];
    return med > 0 ? v / med : null;
  });
  const vols = candles.map((c) => c.volume ?? 0);
  const volSma = sma(vols, 20);
  const volumeReliable = vols.some((v) => v > 0);
  return {
    candles,
    adx: adx(candles, 14),
    atrRatio,
    ema200: ema(candles.map((c) => c.close), 200),
    volRatio: vols.map((v, i) => (volSma[i] && volSma[i]! > 0 ? v / volSma[i]! : null)),
    volumeReliable,
  };
}

function genericFeatures(o: Occurrence, s: SymbolSeries): Record<string, string> {
  const i = o.barIndex;
  const e = s.ema200[i];
  const close = s.candles[i].close;
  const trend = e === null ? 'n/a' : (o.direction === 'buy') === close > e ? 'with' : 'against';
  return {
    session: getSessionRegime(o.time * 1000),
    hour: hourBucket(o.time),
    adx: adxBucket(s.adx[i]),
    atr: atrRegimeBucket(s.atrRatio[i]),
    volume: volumeBucket(s.volRatio[i], s.volumeReliable),
    ema200: trend,
    symbol: o.symbolId,
    direction: o.direction,
    conf: confidenceBucket(o.confidence),
  };
}

async function main() {
  const args = parseArgs();
  const barSeconds = BAR_SECONDS[args.timeframe] ?? 60;
  const { activeFeatures } = auditFeatureSet('live');
  const config = { ...DEFAULT_INDICATOR_CONFIG };
  const maxExpiry = Math.max(...Object.values(HORIZON_GRIDS).flat());
  const fromMs = new Date(args.from).getTime();
  const toMs = new Date(args.to).getTime();

  const all: Occurrence[] = [];
  const series = new Map<string, SymbolSeries>();
  const sources = new Set<string>();
  for (const sym of args.symbols) {
    const source = resolveHistorySource(sym);
    sources.add(source);
    const key: CacheKey = {
      symbol: sym,
      timeframe: args.timeframe,
      from: args.from,
      to: args.to,
      windowSize: args.windowSize,
      maxExpiry,
      activeFeatures,
      config,
      algorithmVersion: OCCURRENCE_ALGORITHM_VERSION,
      source,
    };
    const cached = await readCache(key);
    if (!cached) {
      console.error(`${sym}: нет occurrence-кэша для этих параметров — сначала backtest:horizon-audit. Пропуск.`);
      continue;
    }
    const { candles: c1m } = await loadHistory({ symbol: sym, fromMs, toMs });
    const candles = resample(c1m, args.timeframe);
    const s = buildSeries(candles);
    let misaligned = 0;
    for (const o of cached.occurrences) if (candles[o.barIndex]?.time !== o.time) misaligned++;
    if (misaligned > 0) {
      console.error(`${sym}: ${misaligned} occurrences не совпали со свечами по времени — символ пропущен.`);
      continue;
    }
    series.set(sym, s);
    all.push(...cached.occurrences);
    console.log(`${sym}: ${cached.occurrences.length} occurrences, ${candles.length} свечей (${source})`);
  }
  if (all.length === 0) throw new Error('Нет данных: occurrence-кэш не найден ни для одного символа.');

  let minT = Infinity;
  let maxT = -Infinity;
  for (const o of all) {
    minT = Math.min(minT, o.time);
    maxT = Math.max(maxT, o.time);
  }
  const foldBoundaries = computeFoldBoundaries(minT, maxT, args.folds);
  assignFoldIndex(all, foldBoundaries);

  const breakevenRate = 100 / (100 + args.payout);
  const params: ScanParams = {
    foldBoundaries,
    purgeSeconds: args.purgeBars * barSeconds,
    minTrainDecided: 30,
    selectMinAcc: args.selectMinAcc,
    minTestDecided: 200,
    alpha: 0.05,
    breakevenRate,
    targetLow: 0.53,
    targetHigh: 0.56,
  };

  const patterns = [...new Set(all.map((o) => o.patternName))]
    .filter((p) => HORIZON_GRIDS[p] && (!args.patterns || args.patterns.includes(p)))
    .sort();

  const results: SliceResult[] = [];
  const notes: string[] = [];
  for (const pattern of patterns) {
    const grid = HORIZON_GRIDS[pattern];
    const group = all.filter((o) => o.patternName === pattern);
    const deduped = dedupeOccurrencesPooled(group, Math.max(...grid), barSeconds);
    const scanOccs: ScanOccurrence[] = deduped.map((o) => ({ ...o, features: genericFeatures(o, series.get(o.symbolId)!) }));
    const featureNames = ['session', 'hour', 'adx', 'atr', 'volume', 'ema200', 'symbol', 'direction', 'conf'];

    if (pattern === 'harmonic-pattern') {
      const { matched, mismatched } = addHarmonicFeatures(scanOccs, series, activeFeatures, config, args.windowSize);
      featureNames.push('htype', 'prz');
      notes.push(`harmonic-pattern: harmonicType/PRZ восстановлены повторной детекцией на ${matched + mismatched} барах; совпали по направлению и confidence: ${matched}, нет — ${mismatched} (помечены 'unknown').`);
    }
    console.log(`${pattern}: ${group.length} сырых → ${deduped.length} независимых`);
    results.push(...scanPattern(pattern, scanOccs, featureNames, grid, params));
  }
  const familySize = applyHolm(results, params.alpha);

  await writeReport(args, results, familySize, params, [...sources], notes);
}

function addHarmonicFeatures(
  occs: ScanOccurrence[],
  series: Map<string, SymbolSeries>,
  activeFeatures: ReturnType<typeof auditFeatureSet>['activeFeatures'],
  config: typeof DEFAULT_INDICATOR_CONFIG,
  windowSize: number,
): { matched: number; mismatched: number } {
  let matched = 0;
  let mismatched = 0;
  const indicatorCache = new Map<string, ReturnType<typeof computeIndicatorSeriesRaw>>();
  for (const o of occs) {
    const s = series.get(o.symbolId)!;
    if (!indicatorCache.has(o.symbolId)) indicatorCache.set(o.symbolId, computeIndicatorSeriesRaw(s.candles, config, activeFeatures));
    const ind = indicatorCache.get(o.symbolId)!;
    const i = o.barIndex;
    const window = s.candles.slice(i - windowSize + 1, i + 1);
    const res = detectAllPatterns(
      window,
      activeFeatures,
      snapshotFromSeries(ind, i),
      computeStructure(window, 50, true, config.atrPeriod),
      calcSmartMoney(window),
      config.atrPeriod,
      { fast: config.macdFast, slow: config.macdSlow, signal: config.macdSignal },
      { minLegAtr: config.harmonicMinLegAtr, fibTolerancePct: config.harmonicFibTolerancePct, htfFactor: config.harmonicHtfFactor },
      undefined,
      isCrypto(o.symbolId),
    ).find((p) => p.name === ('harmonic-pattern' as PatternName) && p.direction === o.direction);
    if (res && Math.abs(res.confidence - o.confidence) < 1e-9) {
      matched++;
      o.features.htype = res.harmonicType ?? 'unknown';
      const f = (res.confluenceFactors ?? []).find((x) => x.startsWith('PRZ confluence'));
      o.features.prz = f ? (f.includes('order block') ? 'ob' : 'fvg') : 'none';
    } else {
      mismatched++;
      o.features.htype = 'unknown';
      o.features.prz = 'unknown';
    }
  }
  return { matched, mismatched };
}

const pct = (x: number | null) => (x === null ? '—' : `${(x * 100).toFixed(1)}%`);

async function writeReport(
  args: ReturnType<typeof parseArgs>,
  results: SliceResult[],
  familySize: number,
  p: ScanParams,
  sources: string[],
  notes: string[],
) {
  const base = `backtest/output/condition-scan-${args.symbols.join('-')}-${args.timeframe}-${args.from}-${args.to}`;
  await mkdir('backtest/output', { recursive: true });
  await writeFile(`${base}.json`, JSON.stringify({ meta: { ...args, sources, familySize, params: { ...p, foldBoundaries: p.foldBoundaries.length }, algorithmVersion: OCCURRENCE_ALGORITHM_VERSION, generatedAt: new Date().toISOString(), notes }, results }, null, 2));

  const L: string[] = [];
  L.push(`# Condition scan — ${args.symbols.join(', ')} ${args.timeframe}, ${args.from}…${args.to}`, '');
  L.push(`Источник: ${sources.join(' + ')}. Walk-forward ${args.folds} фолдов, purge ${args.purgeBars}, дедуп по пулу. Отбор fold'а по train: точность ≥ ${pct(p.selectMinAcc)} на ≥ ${p.minTrainDecided} решённых. Минимум ${p.minTestDecided} независимых test-исходов. Безубыточность ${pct(p.breakevenRate)}. Семейство Holm: ${familySize} срезов.`);
  if (!sources.includes('binance')) L.push('', '> volume ≡ 0 (Deriv): объёмные условия не проверялись.');
  for (const n of notes) L.push('', `> ${n}`);
  L.push('', '> Целевой диапазон 53–56% почти целиком ниже безубыточности: «найдено условие» ≠ «прибыльно».', '');

  const byPattern = new Map<string, SliceResult[]>();
  for (const r of results) {
    if (!byPattern.has(r.pattern)) byPattern.set(r.pattern, []);
    byPattern.get(r.pattern)!.push(r);
  }
  L.push('## Итог по стратегиям', '', '| Стратегия | Срезов оценено | В диапазоне 53–56% | из них LB>50% | Выше безубыточности | Holm-значимых | LB выше дрейфа | Стабильных (≥75% фолдов >50%) | Итог |', '|---|---|---|---|---|---|---|---|---|');
  for (const [pat, rs] of byPattern) {
    const ev = rs.filter((r) => r.status === 'evaluated');
    const tgt = ev.filter((r) => r.inTargetRange);
    const tgtLb = tgt.filter((r) => (r.wilsonLB ?? 0) > 0.5);
    const be = ev.filter((r) => r.aboveBreakeven);
    const holm = ev.filter((r) => r.holmSignificant);
    const st = ev.filter((r) => r.stable);
    const bd = ev.filter((r) => r.beatsDrift);
    const verdict = ev.length === 0 ? 'недостаточно данных' : bd.length > 0 ? 'найдено (проверить форвардом)' : holm.length > 0 || tgtLb.length > 0 ? 'только относительно 50% — объясняется дрейфом' : 'не найдено';
    L.push(`| ${pat} | ${ev.length} | ${tgt.length} | ${tgtLb.length} | ${be.length} | ${holm.length} | ${bd.length} | ${st.length} | ${verdict} |`);
  }

  for (const [pat, rs] of byPattern) {
    const ev = rs.filter((r) => r.status === 'evaluated').sort((a, b) => (b.testAccuracy ?? 0) - (a.testAccuracy ?? 0));
    L.push('', `## ${pat}`, '');
    if (ev.length === 0) {
      L.push('Недостаточно данных: ни один срез не набрал 200 независимых test-исходов.');
      continue;
    }
    L.push('Топ-15 срезов по test-точности (все оценённые — в JSON):', '', '| Срез | Незав. n | Test решено | Test acc | Wilson LB | Дрейф | p | Holm | Фолды отобр./>50% | Пометки |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const r of ev.slice(0, 15)) {
      const marks = [
        r.inTargetRange ? ((r.wilsonLB ?? 0) > 0.5 ? 'в диапазоне' : 'в диапазоне, LB≤50% (шум)') : '',
        r.aboveBreakeven ? 'выше безубыточности' : '',
        r.beatsDrift ? 'LB выше дрейфа' : 'не лучше дрейфа',
        r.stable ? 'стабильно' : '',
      ].filter(Boolean).join('; ');
      L.push(`| ${r.slice} | ${r.independentCount} | ${r.testDecided} | ${pct(r.testAccuracy)} | ${pct(r.wilsonLB)} | ${pct(r.driftBaseline)} | ${r.pValue?.toExponential(2) ?? '—'} | ${r.holmSignificant ? 'да' : 'нет'} | ${r.foldsSelected}/${r.foldsPositive} | ${marks} |`);
    }
  }
  await writeFile(`${base}.md`, L.join('\n') + '\n');
  console.log(`\nОтчёт: ${base}.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
