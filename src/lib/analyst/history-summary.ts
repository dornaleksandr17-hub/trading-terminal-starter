/**
 * Компактная выжимка локальной истории сигналов для ИИ-аналитика.
 *
 * Модели отправляются только агрегаты и короткий хвост последних сигналов,
 * не весь persist-массив (featureVector, chartContext и т.п. ей не нужны).
 * Винрейт = wins/(wins+losses), timeout и pending исключены — как везде в
 * проекте. Для каждой группы добавлена нижняя граница Вильсона, чтобы
 * модель не делала выводов по горстке сделок.
 */
import type { Signal } from '@/types/domain';
import { wilsonLowerBound } from '@/lib/wilson';

export interface GroupStat {
  key: string;
  decided: number;
  wins: number;
  winRatePct: number | null;
  wilsonLowerPct: number | null;
}

export interface CompactSignal {
  t: string;
  sym: string;
  tf: string;
  dir: string;
  str: string;
  score: number;
  prob: number | null;
  pattern: string | null;
  outcome: string;
  expiryBars: number;
  session: string | null;
  regime: string | null;
  structure: string | null;
  topFactors: string[];
}

export interface HistorySummary {
  generatedAt: string;
  totalSignals: number;
  decided: number;
  wins: number;
  losses: number;
  timeouts: number;
  pending: number;
  winRatePct: number | null;
  wilsonLowerPct: number | null;
  breakevenPct: number;
  firstSignalAt: string | null;
  lastSignalAt: string | null;
  bySymbol: GroupStat[];
  byPattern: GroupStat[];
  byDirection: GroupStat[];
  byStrength: GroupStat[];
  bySession: GroupStat[];
  byRegime: GroupStat[];
  byStructure: GroupStat[];
  byTimeframe: GroupStat[];
  byHourUtc: GroupStat[];
  byProbabilityBucket: GroupStat[];
  byFactor: GroupStat[];
  recent: CompactSignal[];
}

const r1 = (v: number) => Math.round(v * 10) / 10;

/** 80% выплаты → 55.56%. Экономика проекта не меняется здесь, только сообщается модели. */
export const DEFAULT_BREAKEVEN_PCT = r1(10000 / 180);

function group(signals: Signal[], keyOf: (s: Signal) => string | string[] | null): GroupStat[] {
  const map = new Map<string, { wins: number; decided: number }>();
  for (const s of signals) {
    if (s.outcome !== 'win' && s.outcome !== 'loss') continue;
    const raw = keyOf(s);
    if (raw == null) continue;
    for (const key of Array.isArray(raw) ? raw : [raw]) {
      const g = map.get(key) ?? { wins: 0, decided: 0 };
      g.decided += 1;
      if (s.outcome === 'win') g.wins += 1;
      map.set(key, g);
    }
  }
  return [...map.entries()]
    .map(([key, g]) => ({
      key,
      decided: g.decided,
      wins: g.wins,
      winRatePct: g.decided > 0 ? r1((100 * g.wins) / g.decided) : null,
      wilsonLowerPct: g.decided > 0 ? r1(100 * wilsonLowerBound(g.wins, g.decided)) : null,
    }))
    .sort((a, b) => b.decided - a.decided);
}

function probBucket(p: number | null): string | null {
  if (p == null || !Number.isFinite(p)) return null;
  const lo = Math.min(9, Math.max(0, Math.floor(p * 10)));
  return `${lo * 10}-${lo * 10 + 10}%`;
}

export function summarizeSignalHistory(signals: Signal[], recentLimit = 120): HistorySummary {
  const decided = signals.filter((s) => s.outcome === 'win' || s.outcome === 'loss');
  const wins = decided.filter((s) => s.outcome === 'win').length;
  const times = signals.map((s) => s.time).filter((t) => Number.isFinite(t));
  const iso = (t: number) => new Date(t < 1e12 ? t * 1000 : t).toISOString();
  const sorted = [...signals].sort((a, b) => b.time - a.time);

  return {
    generatedAt: new Date().toISOString(),
    totalSignals: signals.length,
    decided: decided.length,
    wins,
    losses: decided.length - wins,
    timeouts: signals.filter((s) => s.outcome === 'timeout').length,
    pending: signals.filter((s) => s.outcome === 'pending').length,
    winRatePct: decided.length > 0 ? r1((100 * wins) / decided.length) : null,
    wilsonLowerPct: decided.length > 0 ? r1(100 * wilsonLowerBound(wins, decided.length)) : null,
    breakevenPct: DEFAULT_BREAKEVEN_PCT,
    firstSignalAt: times.length ? iso(Math.min(...times)) : null,
    lastSignalAt: times.length ? iso(Math.max(...times)) : null,
    bySymbol: group(signals, (s) => s.symbolId),
    byPattern: group(signals, (s) => s.pattern ?? 'без паттерна'),
    byDirection: group(signals, (s) => s.direction),
    byStrength: group(signals, (s) => s.strength),
    bySession: group(signals, (s) => s.marketContext?.session ?? null),
    byRegime: group(signals, (s) => s.marketContext?.regime ?? null),
    byStructure: group(signals, (s) => (s.marketContext?.structure as string | undefined) ?? null),
    byTimeframe: group(signals, (s) => s.timeframe),
    byHourUtc: group(signals, (s) => String(new Date(s.time < 1e12 ? s.time * 1000 : s.time).getUTCHours()).padStart(2, '0')),
    byProbabilityBucket: group(signals, (s) => probBucket(s.calibratedProbability)),
    byFactor: group(signals, (s) => [...new Set((s.factors ?? []).map((f) => f.name))]).slice(0, 40),
    recent: sorted.slice(0, recentLimit).map((s) => ({
      t: iso(s.time),
      sym: s.symbolId,
      tf: s.timeframe,
      dir: s.direction,
      str: s.strength,
      score: r1(s.score),
      prob: s.calibratedProbability == null ? null : r1(100 * s.calibratedProbability),
      pattern: s.pattern,
      outcome: s.outcome,
      expiryBars: s.expiryBars ?? 1,
      session: s.marketContext?.session ?? null,
      regime: s.marketContext?.regime ?? null,
      structure: (s.marketContext?.structure as string | undefined) ?? null,
      topFactors: [...(s.factors ?? [])]
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 4)
        .map((f) => `${f.name}${f.contribution >= 0 ? '+' : ''}${r1(f.contribution)}`),
    })),
  };
}
