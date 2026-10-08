/**
 * Журнал форвард-тестов: гипотезы аналитика + их проверка на исходах сигналов,
 * полученных ПОСЛЕ записи гипотезы. Только чтение истории сигналов — торговые
 * пороги, веса и детекторы здесь не трогаются.
 * Винрейт = wins/(wins+losses), timeout/pending исключены; нижняя граница Вильсона.
 */
import type { Signal } from '@/types/domain';
import { wilsonLowerBound } from '@/lib/wilson';
import backtestContext from '@/lib/analyst/backtest-context.gen.json';

export const BREAKEVEN_PCT = 10000 / 180; // выплата 80%

export interface HypothesisConditions {
  symbolId?: string;
  pattern?: string;
  direction?: string;
  session?: string;
  timeframe?: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  text: string;
  /** Момент фиксации: учитываются только сигналы не раньше этого времени (мс). */
  startAt: number;
  conditions: HypothesisConditions;
  minTrades: number;
  sourceThreadId?: string;
  closed?: { at: number; verdict: Verdict };
}

export type Verdict = 'insufficient' | 'pass' | 'fail';

const KEY = 'forward-journal-v1';
const EVT = 'forward-journal-changed';

export function loadHypotheses(): Hypothesis[] {
  if (typeof window === 'undefined') return [];
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? (v as Hypothesis[]) : [];
  } catch {
    return [];
  }
}

function save(list: Hypothesis[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}
export const JOURNAL_EVENT = EVT;

export function addHypothesis(h: Partial<Hypothesis> & { text: string }): Hypothesis {
  const item: Hypothesis = {
    id: crypto.randomUUID().slice(0, 12),
    title: h.title?.trim() || h.text.trim().slice(0, 60),
    text: h.text,
    startAt: h.startAt ?? Date.now(),
    conditions: h.conditions ?? {},
    minTrades: h.minTrades ?? 100,
    sourceThreadId: h.sourceThreadId,
  };
  save([item, ...loadHypotheses()]);
  return item;
}

/** Условия и старт можно менять, пока нет ни одного учтённого исхода — иначе подгонка. */
export function updateHypothesis(id: string, patch: Partial<Hypothesis>) {
  save(loadHypotheses().map((h) => (h.id === id ? { ...h, ...patch } : h)));
}

export function deleteHypothesis(id: string) {
  save(loadHypotheses().filter((h) => h.id !== id));
}

export const signalMs = (s: Signal) => (s.time < 1e12 ? s.time * 1000 : s.time);

export function matches(s: Signal, c: HypothesisConditions): boolean {
  if (c.symbolId && s.symbolId !== c.symbolId) return false;
  if (c.pattern && (s.pattern ?? '') !== c.pattern) return false;
  if (c.direction && s.direction !== c.direction) return false;
  if (c.timeframe && s.timeframe !== c.timeframe) return false;
  if (c.session && (s.marketContext?.session ?? '') !== c.session) return false;
  return true;
}

export interface Stats {
  decided: number;
  wins: number;
  timeouts: number;
  winRatePct: number | null;
  wilsonLowerPct: number | null;
}

export function stats(signals: Signal[]): Stats {
  let wins = 0, losses = 0, timeouts = 0;
  for (const s of signals) {
    if (s.outcome === 'win') wins++;
    else if (s.outcome === 'loss') losses++;
    else if (s.outcome === 'timeout') timeouts++;
  }
  const d = wins + losses;
  return {
    decided: d,
    wins,
    timeouts,
    winRatePct: d ? (100 * wins) / d : null,
    wilsonLowerPct: d ? 100 * wilsonLowerBound(wins, d) : null,
  };
}

export function hypothesisSignals(h: Hypothesis, signals: Signal[]): Signal[] {
  const end = h.closed?.at ?? Infinity;
  return signals.filter((s) => signalMs(s) >= h.startAt && signalMs(s) <= end && matches(s, h.conditions));
}

export function judge(st: Stats, minTrades: number): Verdict {
  if (st.decided < minTrades) return 'insufficient';
  return st.wilsonLowerPct !== null && st.wilsonLowerPct > BREAKEVEN_PCT ? 'pass' : 'fail';
}

export interface BacktestRef {
  market: string;
  decided: number;
  winRatePct: number;
  wilsonLowerPct: number;
  verdict: string;
}

interface AuditCtx {
  symbols: string[];
  patterns: Array<{ pattern: string; independentTestDecided: number; winRatePct: number; wilsonLowerPct: number; verdict: string }>;
}

/** Итог бэктеста по паттерну (крипта/форекс) из сгенерированной выжимки. */
export function backtestFor(pattern: string | undefined | null): BacktestRef[] {
  if (!pattern) return [];
  const audits = (backtestContext as { audits?: AuditCtx[] }).audits ?? [];
  return audits.flatMap((a) => {
    const p = a.patterns.find((x) => x.pattern === pattern);
    if (!p) return [];
    return [{
      market: a.symbols.some((s) => s.endsWith('USDT')) ? 'крипта' : 'форекс',
      decided: p.independentTestDecided,
      winRatePct: p.winRatePct,
      wilsonLowerPct: p.wilsonLowerPct,
      verdict: p.verdict,
    }];
  });
}

export type GroupBy = 'pattern' | 'strategy';

export interface PeriodRow extends Stats { key: string }

/**
 * Сравнение паттернов (или «стратегий» = паттерн+таймфрейм) в периоде [fromMs, toMs].
 * Группы с решёнными исходами < minTrades отбрасываются.
 */
export function comparePeriod(
  signals: Signal[],
  opts: { fromMs: number; toMs: number; minTrades: number; groupBy: GroupBy },
): PeriodRow[] {
  const groups = new Map<string, Signal[]>();
  for (const s of signals) {
    const t = signalMs(s);
    if (t < opts.fromMs || t > opts.toMs) continue;
    const base = s.pattern ?? 'без паттерна';
    const key = opts.groupBy === 'pattern' ? base : `${base} · ${s.timeframe}`;
    const arr = groups.get(key) ?? [];
    arr.push(s);
    groups.set(key, arr);
  }
  return [...groups.entries()]
    .map(([key, arr]) => ({ key, ...stats(arr) }))
    .filter((r) => r.decided >= opts.minTrades)
    .sort((a, b) => (b.wilsonLowerPct ?? 0) - (a.wilsonLowerPct ?? 0));
}
