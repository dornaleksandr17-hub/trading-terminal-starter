// ─────────────────────────────────────────────────────────────────────────
// Condition scan — чистое ядро (read-only исследование, навык tts-condition-scan).
//
// Ничего не меняет в детекции: на вход — уже посчитанные occurrences
// (из occurrence-кэша horizon-audit) + признаки контекста, вычисленные
// отдельно по свечам. Пороги, веса, confidence и гейты не трогаются.
//
// Метод:
//  1. Дедупликация по пулу (как в аудите, схема 2) — ДО нарезки на срезы.
//  2. Срез = значение 1 признака или пара значений 2 признаков (не больше).
//  3. Walk-forward: для fold k срез ОТБИРАЕТСЯ только по train (folds < k,
//     с purge): лучший expiry по train и train-точность ≥ selectMinAcc.
//     Test fold k засчитывается только для отобранных fold'ов. Test в отбор
//     не попадает никак.
//  4. Срезы с ≥ minTestDecided независимых решённых test-исходов образуют
//     семейство Holm (поправка по ВСЕМ таким срезам всех стратегий).
// Границы бакетов зафиксированы ниже ДО запуска и по результатам не правятся.
// ─────────────────────────────────────────────────────────────────────────

import { wilsonLowerBound } from '@/lib/wilson';
import { binomialSignificanceTest } from './significance';
import { holmStepDown, driftBaselineFromCounts } from './horizon-verdict';
import { accuracyForExpiry, selectBestExpiry, tallyDrift, type Occurrence } from './horizon-audit';
import type { FoldBoundary } from './horizon-partitioning';

/** Признаки одного наблюдения: имя признака → метка бакета. */
export type FeatureMap = Record<string, string>;

export interface ScanOccurrence extends Occurrence {
  features: FeatureMap;
}

// ─── Бакеты (фиксированы до запуска) ────────────────────────────────

export function adxBucket(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return 'n/a';
  if (v < 20) return '<20';
  if (v < 25) return '20-25';
  return '>=25';
}

/** ATR относительно медианы ATR за предыдущие 500 баров. */
export function atrRegimeBucket(ratio: number | null): string {
  if (ratio === null || !Number.isFinite(ratio)) return 'n/a';
  if (ratio < 0.8) return 'low';
  if (ratio < 1.25) return 'normal';
  return 'high';
}

/** volume / SMA20(volume). volumeReliable=false (Deriv, volume≡0) → 'n/a'. */
export function volumeBucket(ratio: number | null, volumeReliable: boolean): string {
  if (!volumeReliable || ratio === null || !Number.isFinite(ratio)) return 'n/a';
  if (ratio < 0.8) return '<0.8';
  if (ratio < 1.5) return '0.8-1.5';
  return '>=1.5';
}

export function confidenceBucket(c: number): string {
  if (c < 0.6) return '<0.60';
  if (c < 0.7) return '0.60-0.70';
  if (c < 0.8) return '0.70-0.80';
  return '>=0.80';
}

/** 4-часовые окна UTC. */
export function hourBucket(timeSec: number): string {
  const h = new Date(timeSec * 1000).getUTCHours();
  const lo = Math.floor(h / 4) * 4;
  return `${String(lo).padStart(2, '0')}-${String(lo + 4).padStart(2, '0')}UTC`;
}

// ─── Срезы ──────────────────────────────────────────────────────────

export interface SliceSpec {
  /** Пары [признак, значение], 1 или 2 штуки, отсортированы по имени признака. */
  conds: [string, string][];
}

export function sliceKey(s: SliceSpec): string {
  return s.conds.map(([f, v]) => `${f}=${v}`).join(' & ');
}

/** Все срезы из 1 и 2 признаков, реально встречающиеся в данных. Детерминированный порядок. */
export function enumerateSlices(occs: ScanOccurrence[], featureNames: string[]): SliceSpec[] {
  const names = [...featureNames].sort();
  const values = new Map<string, Set<string>>();
  const pairs = new Set<string>();
  for (const o of occs) {
    for (const f of names) {
      const v = o.features[f];
      if (v === undefined) continue;
      if (!values.has(f)) values.set(f, new Set());
      values.get(f)!.add(v);
    }
    for (let i = 0; i < names.length; i++) {
      const vi = o.features[names[i]];
      if (vi === undefined) continue;
      for (let j = i + 1; j < names.length; j++) {
        const vj = o.features[names[j]];
        if (vj === undefined) continue;
        pairs.add(JSON.stringify([[names[i], vi], [names[j], vj]]));
      }
    }
  }
  const out: SliceSpec[] = [];
  for (const f of names) {
    for (const v of [...(values.get(f) ?? [])].sort()) out.push({ conds: [[f, v]] });
  }
  for (const p of [...pairs].sort()) out.push({ conds: JSON.parse(p) as [string, string][] });
  return out;
}

export function matchesSlice(o: ScanOccurrence, s: SliceSpec): boolean {
  return s.conds.every(([f, v]) => o.features[f] === v);
}

// ─── Оценка среза ───────────────────────────────────────────────────

export interface ScanParams {
  foldBoundaries: FoldBoundary[];
  purgeSeconds: number;
  /** Минимум решённых train-исходов на выбранном expiry, чтобы fold мог быть отобран. */
  minTrainDecided: number;
  /** Отбор fold'а: train-точность на лучшем expiry ≥ этого порога. */
  selectMinAcc: number;
  /** Минимум независимых решённых test-исходов для участия в Holm. */
  minTestDecided: number;
  alpha: number;
  breakevenRate: number;
  targetLow: number;
  targetHigh: number;
}

export interface SliceResult {
  pattern: string;
  slice: string;
  independentCount: number;
  foldsEvaluated: number;
  foldsSelected: number;
  foldsPositive: number;
  testDecided: number;
  testWins: number;
  testAccuracy: number | null;
  wilsonLB: number | null;
  /** Точность случайного направления с тем же buy/sell-миксом на тех же test-барах (рыночный дрейф). */
  driftBaseline: number | null;
  /** Wilson LB выше дрейф-baseline. */
  beatsDrift: boolean;
  pValue: number | null;
  holmSignificant: boolean | null;
  inTargetRange: boolean;
  aboveBreakeven: boolean;
  stable: boolean;
  status: 'evaluated' | 'insufficient-data';
}

export function evaluateSlice(
  pattern: string,
  slice: SliceSpec,
  sliceOccs: Occurrence[],
  grid: number[],
  p: ScanParams,
): SliceResult {
  let wins = 0;
  let decided = 0;
  let foldsEvaluated = 0;
  let foldsSelected = 0;
  let foldsPositive = 0;
  const drift = { decided: 0, rises: 0, buys: 0 };
  for (let k = 1; k < p.foldBoundaries.length; k++) {
    const cutoff = p.foldBoundaries[k].start - p.purgeSeconds;
    const train = sliceOccs.filter((o) => o.fold < k && o.time <= cutoff);
    const test = sliceOccs.filter((o) => o.fold === k);
    if (test.length === 0) continue;
    foldsEvaluated++;
    const best = selectBestExpiry(train, grid);
    if (!best) continue;
    const trainRes = accuracyForExpiry(train, best.bestExpiry);
    if (trainRes.decided < p.minTrainDecided || best.bestAccuracy < p.selectMinAcc) continue;
    foldsSelected++;
    const t = accuracyForExpiry(test, best.bestExpiry);
    wins += t.wins;
    decided += t.decided;
    const d = tallyDrift(test, best.bestExpiry);
    drift.decided += d.decided;
    drift.rises += d.rises;
    drift.buys += d.buys;
    if (t.decided > 0 && t.wins / t.decided > 0.5) foldsPositive++;
  }
  const acc = decided > 0 ? wins / decided : null;
  const enough = decided >= p.minTestDecided;
  const pValue = enough ? binomialSignificanceTest(wins, decided, 0.5, p.alpha).pValue : null;
  const driftBaseline = driftBaselineFromCounts(drift.decided, drift.rises, drift.buys);
  const lb = decided > 0 ? wilsonLowerBound(wins, decided) : null;
  const stableNeed = Math.ceil(0.75 * (p.foldBoundaries.length - 1));
  return {
    pattern,
    slice: sliceKey(slice),
    independentCount: sliceOccs.length,
    foldsEvaluated,
    foldsSelected,
    foldsPositive,
    testDecided: decided,
    testWins: wins,
    testAccuracy: acc,
    wilsonLB: lb,
    driftBaseline,
    beatsDrift: enough && lb !== null && driftBaseline !== null && lb > driftBaseline,
    pValue,
    holmSignificant: null,
    inTargetRange: enough && acc !== null && acc >= p.targetLow && acc <= p.targetHigh,
    aboveBreakeven: enough && acc !== null && acc > p.breakevenRate,
    stable: enough && foldsPositive >= stableNeed,
    status: enough ? 'evaluated' : 'insufficient-data',
  };
}

/** Holm по всему семейству (все стратегии, все срезы с p-value). Мутирует results. Возвращает размер семейства. */
export function applyHolm(results: SliceResult[], alpha: number): number {
  const flags = holmStepDown(
    results.map((r) => ({ pValue: r.pValue, accuracy: r.testAccuracy })),
    alpha,
  );
  results.forEach((r, i) => (r.holmSignificant = flags[i]));
  return results.filter((r) => r.pValue !== null).length;
}

export function scanPattern(
  pattern: string,
  dedupedOccs: ScanOccurrence[],
  featureNames: string[],
  grid: number[],
  p: ScanParams,
): SliceResult[] {
  return enumerateSlices(dedupedOccs, featureNames).map((s) =>
    evaluateSlice(pattern, s, dedupedOccs.filter((o) => matchesSlice(o, s)), grid, p),
  );
}
