/**
 * Темы разговоров с ИИ-аналитиком — хранятся только в этом браузере.
 * Все функции безопасны для SSR (без window возвращают пустой список).
 */
import type { UIMessage } from "ai";

export interface AnalystThread {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
}

const KEY = "analyst-threads-v1";
const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

export function loadThreads(): AnalystThread[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as AnalystThread[]) : [];
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

function save(list: AnalystThread[]) {
  if (!hasStorage()) return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("analyst-threads-changed"));
}

export function getThread(id: string): AnalystThread | undefined {
  return loadThreads().find((t) => t.id === id);
}

export function createThread(): AnalystThread {
  const t: AnalystThread = {
    id: crypto.randomUUID().slice(0, 12),
    title: "Новая тема",
    updatedAt: Date.now(),
    messages: [],
  };
  save([t, ...loadThreads()]);
  return t;
}

/** Создаёт тему с данным id, если её ещё нет (идемпотентно). */
export function ensureThread(id: string): AnalystThread {
  const existing = getThread(id);
  if (existing) return existing;
  const t: AnalystThread = { id, title: "Новая тема", updatedAt: Date.now(), messages: [] };
  save([t, ...loadThreads()]);
  return t;
}

function titleFrom(messages: UIMessage[]): string | null {
  const first = messages.find((m) => m.role === "user");
  const text = first?.parts.find((p) => p.type === "text");
  if (!text || text.type !== "text") return null;
  const s = text.text.trim().replace(/\s+/g, " ");
  return s.length > 48 ? `${s.slice(0, 48)}…` : s || null;
}

export function saveThreadMessages(id: string, messages: UIMessage[]) {
  const list = loadThreads();
  const idx = list.findIndex((t) => t.id === id);
  const base = idx >= 0 ? list[idx] : { id, title: "Новая тема", updatedAt: 0, messages: [] };
  const next: AnalystThread = {
    ...base,
    messages,
    updatedAt: Date.now(),
    title: base.title === "Новая тема" ? titleFrom(messages) ?? base.title : base.title,
  };
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  save(list);
}

export function deleteThread(id: string) {
  save(loadThreads().filter((t) => t.id !== id));
}
