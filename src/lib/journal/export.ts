/**
 * Экспорт журнала форвард-тестов в CSV: гипотезы, исходы сигналов,
 * результаты сравнения по периодам. Только выгрузка данных — логика не меняется.
 * CSV в кодировке UTF-8 с BOM, чтобы Excel корректно открывал кириллицу.
 */
import type { Signal } from '@/types/domain';
import {
  backtestFor, hypothesisSignals, judge, signalMs, stats,
  type Hypothesis, type PeriodRow,
} from '@/lib/journal/journal';

const esc = (v: string | number | null | undefined): string => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(header: string[], rows: (string | number | null | undefined)[][]): string {
  const lines = [header, ...rows].map((r) => r.map(esc).join(';'));
  return `﻿${lines.join('\r\n')}`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const stamp = () => new Date().toISOString().slice(0, 10);

/** Гипотезы с форвард-статистикой и ссылкой на бэктест. */
export function hypothesesCsv(list: Hypothesis[], signals: Signal[]): string {
  return toCsv(
    ['id', 'название', 'текст', 'записана', 'закрыта', 'пара', 'паттерн', 'направление', 'сессия', 'таймфрейм',
      'мин_сделок', 'решено', 'побед', 'таймаутов', 'винрейт_%', 'нижняя_граница_%', 'вердикт',
      'бэктест_рынок', 'бэктест_решено', 'бэктест_винрейт_%', 'бэктест_нижняя_граница_%', 'бэктест_вердикт'],
    list.flatMap((h) => {
      const st = stats(hypothesisSignals(h, signals));
      const verdict = h.closed?.verdict ?? judge(st, h.minTrades);
      const bt = backtestFor(h.conditions.pattern);
      const base = [
        h.id, h.title, h.text, new Date(h.startAt).toISOString(), h.closed ? new Date(h.closed.at).toISOString() : '',
        h.conditions.symbolId ?? '', h.conditions.pattern ?? '', h.conditions.direction ?? '',
        h.conditions.session ?? '', h.conditions.timeframe ?? '', h.minTrades,
        st.decided, st.wins, st.timeouts,
        st.winRatePct?.toFixed(2) ?? '', st.wilsonLowerPct?.toFixed(2) ?? '', verdict,
      ];
      return bt.length
        ? bt.map((b) => [...base, b.market, b.decided, b.winRatePct.toFixed(2), b.wilsonLowerPct.toFixed(2), b.verdict])
        : [[...base, '', '', '', '', '']];
    }),
  );
}

/** Исходы всех сигналов истории (win/loss/timeout/pending). */
export function outcomesCsv(signals: Signal[]): string {
  const sorted = [...signals].sort((a, b) => signalMs(a) - signalMs(b));
  return toCsv(
    ['время', 'пара', 'таймфрейм', 'паттерн', 'направление', 'сила', 'сессия', 'исход', 'вероятность_%'],
    sorted.map((s) => [
      new Date(signalMs(s)).toISOString(), s.symbolId, s.timeframe, s.pattern ?? '', s.direction,
      s.strength ?? '', s.marketContext?.session ?? '', s.outcome ?? 'pending',
      s.probability != null ? (s.probability * 100).toFixed(1) : '',
    ]),
  );
}

/** Результаты сравнения по периоду (строки таблицы сравнения). */
export function comparisonCsv(rows: PeriodRow[]): string {
  return toCsv(
    ['группа', 'решено', 'побед', 'таймаутов', 'винрейт_%', 'нижняя_граница_%', 'бэктест_винрейт_%'],
    rows.map((r) => [
      r.key, r.decided, r.wins, r.timeouts,
      r.winRatePct?.toFixed(2) ?? '', r.wilsonLowerPct?.toFixed(2) ?? '',
      backtestFor(r.key.split(' · ')[0]).map((b) => `${b.market}:${b.winRatePct.toFixed(2)}`).join(' | '),
    ]),
  );
}

export const exportNames = {
  hypotheses: () => `journal-hypotheses-${stamp()}.csv`,
  outcomes: () => `journal-outcomes-${stamp()}.csv`,
  comparison: () => `journal-comparison-${stamp()}.csv`,
};
