import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Lock, Plus, Trash2 } from "lucide-react";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import {
  addHypothesis, backtestFor, BREAKEVEN_PCT, comparePeriod, deleteHypothesis, hypothesisSignals,
  JOURNAL_EVENT, judge, loadHypotheses, stats, updateHypothesis,
  type GroupBy, type Hypothesis, type HypothesisConditions,
} from "@/lib/journal/journal";
import { comparisonCsv, downloadCsv, exportNames, hypothesesCsv, outcomesCsv } from "@/lib/journal/export";
import type { Signal } from "@/types/domain";

export const Route = createFileRoute("/journal")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Журнал форвард-тестов — Trading Terminal" },
      { name: "description", content: "Гипотезы аналитика, их проверка на новых сигналах и сравнение с бэктестом по периодам." },
      { property: "og:title", content: "Журнал форвард-тестов — Trading Terminal" },
      { property: "og:description", content: "Форвард-проверка гипотез и сравнение паттернов на разных отрезках времени." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JournalPage,
});

const pct = (v: number | null | undefined) => (v == null ? "—" : `${v.toFixed(1)}%`);
const VERDICT = {
  insufficient: { label: "мало данных", cls: "bg-muted text-muted-foreground" },
  pass: { label: "выше безубытка", cls: "bg-success-700/30 text-success-400" },
  fail: { label: "не подтверждена", cls: "bg-error-700/30 text-error-400" },
} as const;

function useHypotheses() {
  const [list, setList] = useState<Hypothesis[]>(() => loadHypotheses());
  useEffect(() => {
    const u = () => setList(loadHypotheses());
    window.addEventListener(JOURNAL_EVENT, u);
    window.addEventListener("storage", u);
    return () => {
      window.removeEventListener(JOURNAL_EVENT, u);
      window.removeEventListener("storage", u);
    };
  }, []);
  return list;
}

function uniq(signals: Signal[], f: (s: Signal) => string | null | undefined) {
  return [...new Set(signals.map(f).filter((x): x is string => !!x))].sort();
}

const inputCls = "rounded-md border border-border bg-background px-2 py-1 text-xs";

function JournalPage() {
  const signals = useAnalyticsStore((s) => s.signals);
  const list = useHypotheses();
  const [text, setText] = useState("");

  const options = useMemo(() => ({
    symbolId: uniq(signals, (s) => s.symbolId),
    pattern: uniq(signals, (s) => s.pattern),
    direction: ["buy", "sell"],
    session: ["sydney", "tokyo", "london", "newyork", "overlap", "closed"],
    timeframe: uniq(signals, (s) => s.timeframe),
  }), [signals]);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="flex items-center gap-2 border-b border-border p-3">
        <Link to="/" className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Назад в терминал">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="flex-1 text-sm font-semibold">Журнал форвард-тестов</h1>
        <button
          onClick={() => downloadCsv(exportNames.hypotheses(), hypothesesCsv(list, signals))}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Download size={12} /> Гипотезы CSV
        </button>
        <button
          onClick={() => downloadCsv(exportNames.outcomes(), outcomesCsv(signals))}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Download size={12} /> Исходы CSV
        </button>
        <Link to="/analyst" className="text-xs text-muted-foreground hover:text-foreground">ИИ-аналитик →</Link>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4">
        <p className="text-xs text-muted-foreground">
          Журнал только читает исходы ваших сигналов — торговые пороги не меняются. Гипотеза проверяется на сигналах,
          пришедших после её записи. Безубыток при выплате 80% — {BREAKEVEN_PCT.toFixed(2)}%; вердикт — по нижней границе Вильсона.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Новая гипотеза</h2>
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Например: harmonic на BTCUSDT против старшего тренда"
              className={`${inputCls} flex-1`}
            />
            <button
              disabled={!text.trim()}
              onClick={() => { addHypothesis({ text }); setText(""); }}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Plus size={12} /> Записать
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Гипотезы ({list.length})</h2>
          {list.length === 0 && <p className="text-xs text-muted-foreground">Пока пусто. Сохраняйте гипотезы из ответов аналитика кнопкой «В журнал».</p>}
          {list.map((h) => <HypothesisCard key={h.id} h={h} signals={signals} options={options} />)}
        </section>

        <PeriodCompare signals={signals} />
      </div>
    </div>
  );
}

function HypothesisCard({ h, signals, options }: { h: Hypothesis; signals: Signal[]; options: Record<keyof HypothesisConditions, string[]> }) {
  const matched = hypothesisSignals(h, signals);
  const st = stats(matched);
  const verdict = h.closed?.verdict ?? judge(st, h.minTrades);
  // После первого учтённого исхода условия замораживаются — иначе это подгонка под результат.
  const locked = st.decided > 0 || !!h.closed;
  const bt = backtestFor(h.conditions.pattern);
  const labels: Record<keyof HypothesisConditions, string> = { symbolId: "Пара", pattern: "Паттерн", direction: "Направление", session: "Сессия", timeframe: "ТФ" };

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">{h.title}</div>
          {h.text !== h.title && <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs text-muted-foreground">{h.text}</p>}
          <div className="mt-1 text-[10px] text-muted-foreground">
            Записана {new Date(h.startAt).toLocaleString("ru-RU")}{h.closed && ` · закрыта ${new Date(h.closed.at).toLocaleString("ru-RU")}`}
          </div>
        </div>
        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${VERDICT[verdict].cls}`}>{VERDICT[verdict].label}</span>
        <button onClick={() => deleteHypothesis(h.id)} aria-label="Удалить гипотезу" className="p-1 text-muted-foreground hover:text-destructive">
          <Trash2 size={12} />
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {(Object.keys(labels) as (keyof HypothesisConditions)[]).map((k) => (
          <label key={k} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            {labels[k]}
            <select
              disabled={locked}
              value={h.conditions[k] ?? ""}
              onChange={(e) => updateHypothesis(h.id, { conditions: { ...h.conditions, [k]: e.target.value || undefined } })}
              className={inputCls}
            >
              <option value="">любой</option>
              {options[k].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        ))}
        <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
          Мин. сделок
          <input
            type="number" min={10} disabled={locked} value={h.minTrades}
            onChange={(e) => updateHypothesis(h.id, { minTrades: Math.max(10, Number(e.target.value) || 10) })}
            className={`${inputCls} w-20`}
          />
        </label>
        {locked && <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Lock size={10} /> условия заморожены</span>}
      </div>

      <table className="mt-3 w-full text-xs">
        <thead className="text-[10px] text-muted-foreground">
          <tr><th className="text-left font-normal">Источник</th><th className="text-right font-normal">Сделок</th><th className="text-right font-normal">Винрейт</th><th className="text-right font-normal">Нижняя граница</th><th className="text-right font-normal">Статус</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Форвард (ваши сигналы)</td>
            <td className="text-right font-mono">{st.decided} / {h.minTrades}</td>
            <td className="text-right font-mono">{pct(st.winRatePct)}</td>
            <td className="text-right font-mono">{pct(st.wilsonLowerPct)}</td>
            <td className="text-right">{st.timeouts ? `${st.timeouts} timeout` : ""}</td>
          </tr>
          {bt.map((b) => (
            <tr key={b.market} className="text-muted-foreground">
              <td>Бэктест · {b.market}</td>
              <td className="text-right font-mono">{b.decided}</td>
              <td className="text-right font-mono">{pct(b.winRatePct)}</td>
              <td className="text-right font-mono">{pct(b.wilsonLowerPct)}</td>
              <td className="text-right">{b.verdict}</td>
            </tr>
          ))}
          {!h.conditions.pattern && <tr><td colSpan={5} className="pt-1 text-[10px] text-muted-foreground">Выберите паттерн, чтобы увидеть бэктест.</td></tr>}
        </tbody>
      </table>

      {!h.closed && verdict !== "insufficient" && (
        <button
          onClick={() => updateHypothesis(h.id, { closed: { at: Date.now(), verdict } })}
          className="mt-2 rounded-md border border-border px-2 py-1 text-[10px] hover:bg-muted"
        >
          Зафиксировать итог и закрыть
        </button>
      )}
    </div>
  );
}

const PERIODS = [
  { id: "7", label: "7 дней" },
  { id: "30", label: "30 дней" },
  { id: "90", label: "90 дней" },
  { id: "all", label: "Всё время" },
  { id: "custom", label: "Свой период" },
] as const;

function PeriodCompare({ signals }: { signals: Signal[] }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["id"]>("30");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minTrades, setMinTrades] = useState(30);
  const [groupBy, setGroupBy] = useState<GroupBy>("pattern");

  const range = useMemo(() => {
    const now = Date.now();
    if (period === "all") return { fromMs: 0, toMs: Infinity };
    if (period === "custom")
      return {
        fromMs: from ? new Date(from).getTime() : 0,
        toMs: to ? new Date(to).getTime() + 86_400_000 - 1 : Infinity,
      };
    return { fromMs: now - Number(period) * 86_400_000, toMs: Infinity };
  }, [period, from, to]);

  const rows = useMemo(() => comparePeriod(signals, { ...range, minTrades, groupBy }), [signals, range, minTrades, groupBy]);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">Сравнение по периоду</h2>
      <div className="flex flex-wrap items-center gap-2">
        <select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)} className={inputCls} aria-label="Период">
          {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        {period === "custom" && (
          <>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} aria-label="С" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} aria-label="По" />
          </>
        )}
        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          Мин. сделок
          <input type="number" min={1} value={minTrades} onChange={(e) => setMinTrades(Math.max(1, Number(e.target.value) || 1))} className={`${inputCls} w-20`} />
        </label>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)} className={inputCls} aria-label="Группировка">
          <option value="pattern">По паттернам</option>
          <option value="strategy">По стратегиям (паттерн + ТФ)</option>
        </select>
        <button
          disabled={rows.length === 0}
          onClick={() => downloadCsv(exportNames.comparison(), comparisonCsv(rows))}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <Download size={12} /> Сравнение CSV
        </button>
      </div>
      {minTrades < 30 && <p className="text-[10px] text-warning-400">Меньше 30 сделок в группе — в основном шум.</p>}
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">Недостаточно данных: нет групп с таким числом сделок в выбранном периоде.</p>
      ) : (
        <table className="w-full text-xs">
          <thead className="text-[10px] text-muted-foreground">
            <tr><th className="text-left font-normal">Группа</th><th className="text-right font-normal">Сделок</th><th className="text-right font-normal">Винрейт</th><th className="text-right font-normal">Нижняя граница</th><th className="text-right font-normal">Бэктест (крипта / форекс)</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const bt = backtestFor(r.key.split(" · ")[0]);
              return (
                <tr key={r.key} className="border-t border-border">
                  <td className="py-1">{r.key}</td>
                  <td className="text-right font-mono">{r.decided}</td>
                  <td className="text-right font-mono">{pct(r.winRatePct)}</td>
                  <td className={`text-right font-mono ${(r.wilsonLowerPct ?? 0) > BREAKEVEN_PCT ? "text-success-400" : ""}`}>{pct(r.wilsonLowerPct)}</td>
                  <td className="text-right font-mono text-muted-foreground">{bt.length ? bt.map((b) => pct(b.winRatePct)).join(" / ") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
