import type { PatternName, SignalDirection } from '@/types/domain';
import { wilsonLowerBound } from '@/lib/wilson';

/**
 * Диагностика БЕЗ confidence-гейта (`--ungated-diag` в horizon-audit.ts).
 *
 * Отвечает на вопрос «какова точность ВСЕХ кандидатов tweezer / harami /
 * hammer-семейства по HTF-классам», включая тех, кого отсёк confidence-гейт.
 * Результаты ТОЛЬКО исследовательские: не попадают в вердикты, кэш
 * occurrences и таблицу горизонтов; поправки на множественные сравнения нет.
 */

/** Кандидат на баре входа с исходами по сетке горизонтов паттерна. */
export interface UngatedRecord {
  patternName: PatternName;
  direction: SignalDirection;
  symbolId: string;
  barIndex: number;
  htfClass: string;
  confidence: number;
  /** Прошёл ли кандидат штатный confidence-гейт (confidence >= threshold). */
  passedGate: boolean;
  /** expiry (в барах) → 1 победа / -1 проигрыш / 0 тай или нет данных. */
  outcomes: Map<number, number>;
}

export const UNGATED_MIN_DECIDED = 30;

export interface UngatedCell {
  expiry: number;
  /** Независимые наблюдения после дедупликации (зазор = expiry баров). */
  independent: number;
  decided: number;
  wins: number;
  accuracy: number | null;
  wilsonLower: number | null;
}

export interface UngatedRow {
  patternName: string;
  htfClass: string; // 'all' | класс HTF
  subset: 'all' | 'passed-gate';
  candidates: number;
  cells: UngatedCell[];
}

/** Дедупликация по (symbol, direction): следующее наблюдение считается независимым, если отстоит от последнего оставленного дальше gap баров. */
export function dedupeRecords(recs: UngatedRecord[], gap: number): UngatedRecord[] {
  const sorted = [...recs].sort((a, b) => {
    if (a.symbolId !== b.symbolId) return a.symbolId < b.symbolId ? -1 : 1;
    if (a.direction !== b.direction) return a.direction < b.direction ? -1 : 1;
    return a.barIndex - b.barIndex;
  });
  const kept: UngatedRecord[] = [];
  let lastKey = '';
  let lastBar = -Infinity;
  for (const r of sorted) {
    const key = `${r.symbolId}|${r.direction}`;
    if (key !== lastKey) {
      lastKey = key;
      lastBar = -Infinity;
    }
    if (r.barIndex - lastBar > gap) {
      kept.push(r);
      lastBar = r.barIndex;
    }
  }
  return kept;
}

function cellFor(recs: UngatedRecord[], expiry: number): UngatedCell {
  const indep = dedupeRecords(recs, expiry);
  let wins = 0;
  let decided = 0;
  for (const r of indep) {
    const o = r.outcomes.get(expiry);
    if (o === 1) { wins++; decided++; } else if (o === -1) decided++;
  }
  return {
    expiry,
    independent: indep.length,
    decided,
    wins,
    accuracy: decided > 0 ? wins / decided : null,
    wilsonLower: decided > 0 ? wilsonLowerBound(wins, decided) : null,
  };
}

const HTF_ORDER = ['1.00-bos', '0.75-choch', '0.40-range', 'other'];

/**
 * Строки отчёта: на каждый паттерн — «all» и по каждому HTF-классу, для
 * подмножеств «все кандидаты» и «прошли штатный гейт».
 * `grids` — сетка горизонтов по имени паттерна.
 */
export function aggregateUngated(records: UngatedRecord[], grids: Record<string, number[]>): UngatedRow[] {
  const byPattern = new Map<string, UngatedRecord[]>();
  for (const r of records) {
    const arr = byPattern.get(r.patternName);
    if (arr) arr.push(r); else byPattern.set(r.patternName, [r]);
  }
  const rows: UngatedRow[] = [];
  for (const name of [...byPattern.keys()].sort()) {
    const recs = byPattern.get(name) as UngatedRecord[];
    const grid = grids[name] ?? [];
    const classes = ['all', ...HTF_ORDER.filter((c) => recs.some((r) => r.htfClass === c))];
    for (const cls of classes) {
      const inClass = cls === 'all' ? recs : recs.filter((r) => r.htfClass === cls);
      for (const subset of ['all', 'passed-gate'] as const) {
        const sel = subset === 'all' ? inClass : inClass.filter((r) => r.passedGate);
        if (sel.length === 0) continue;
        rows.push({
          patternName: name,
          htfClass: cls,
          subset,
          candidates: sel.length,
          cells: grid.map((e) => cellFor(sel, e)),
        });
      }
    }
  }
  return rows;
}

export function formatUngatedReport(
  rows: UngatedRow[],
  meta: { symbols: string[]; timeframe: string; from: string; to: string; breakevenRate: number; source?: string },
): string {
  const be = (meta.breakevenRate * 100).toFixed(2);
  const lines: string[] = [
    '# Диагностика без confidence-гейта (--ungated-diag)',
    '',
    '> **Только исследование.** Не входит в вердикты аудита, не пишется в occurrence-кэш и таблицу горизонтов. Поправки на множественные сравнения нет: число ячеек ниже велико, часть «†» возникнет случайно.',
    `> Символы: ${meta.symbols.join(', ')}; ТФ ${meta.timeframe}; ${meta.from} → ${meta.to}. Безубыточность: ${be}%.`,
    `> Ячейка: точность среди решённых (тай исключён) по независимым наблюдениям (дедупликация по символу и направлению, зазор = expiry баров); «W» — нижняя граница Вильсона 95%; «—» при decided < ${UNGATED_MIN_DECIDED}; «†» — W выше безубыточности.`,
    '> «all» = все кандидаты до гейта; «passed-gate» = те, кого штатный детектор пропустил бы (confidence ≥ порога).',
    '',
  ];
  let current = '';
  for (const r of rows) {
    if (r.patternName !== current) {
      current = r.patternName;
      const exps = r.cells.map((c) => `exp ${c.expiry}`).join(' | ');
      lines.push(`## ${current}`, '', `| HTF-класс | Подмножество | Кандидатов | ${exps} |`, `|---|---|---|${r.cells.map(() => '---').join('|')}|`);
    }
    const cells = r.cells.map((c) => {
      if (c.decided < UNGATED_MIN_DECIDED || c.accuracy === null || c.wilsonLower === null) return `— (n=${c.decided})`;
      const mark = c.wilsonLower > meta.breakevenRate ? ' †' : '';
      return `${(c.accuracy * 100).toFixed(1)}% (n=${c.decided}, W ${(c.wilsonLower * 100).toFixed(1)})${mark}`;
    });
    lines.push(`| ${r.htfClass} | ${r.subset} | ${r.candidates} | ${cells.join(' | ')} |`);
  }
  lines.push('');
  return lines.join('\n');
}
