import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { createThread, deleteThread, loadThreads, type AnalystThread } from "@/lib/analyst/threads";
import logo from "@/assets/analyst-logo.png";

export const Route = createFileRoute("/analyst")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "ИИ-аналитик сигналов — Trading Terminal" },
      { name: "description", content: "Вопросы к истории ваших сигналов: паттерны, сессии, индикаторы и сравнение с бэктестом." },
      { property: "og:title", content: "ИИ-аналитик сигналов — Trading Terminal" },
      { property: "og:description", content: "Разбор истории сигналов и эффективности стратегий с помощью ИИ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalystLayout,
});

function useThreads() {
  const [threads, setThreads] = useState<AnalystThread[]>(() => loadThreads());
  useEffect(() => {
    const update = () => setThreads(loadThreads());
    window.addEventListener("analyst-threads-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("analyst-threads-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return threads;
}

function AnalystLayout() {
  const threads = useThreads();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };

  const onNew = () => {
    const t = createThread();
    void navigate({ to: "/analyst/$threadId", params: { threadId: t.id } });
  };

  const onDelete = (id: string) => {
    deleteThread(id);
    if (params.threadId === id) void navigate({ to: "/analyst", replace: true });
  };

  return (
    <div className="dark flex h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <Link to="/" className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Назад в терминал">
            <ArrowLeft size={16} />
          </Link>
          <img src={logo} alt="" className="h-6 w-6" />
          <span className="text-sm font-semibold">ИИ-аналитик</span>
        </div>
        <button
          onClick={onNew}
          className="m-3 flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus size={14} /> Новая тема
        </button>
        <nav className="flex-1 overflow-y-auto px-2 pb-3">
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-1 rounded-md ${params.threadId === t.id ? "bg-muted" : "hover:bg-muted/60"}`}
            >
              <Link
                to="/analyst/$threadId"
                params={{ threadId: t.id }}
                className="min-w-0 flex-1 truncate px-2 py-2 text-xs"
              >
                {t.title}
              </Link>
              <button
                onClick={() => onDelete(t.id)}
                aria-label="Удалить тему"
                className="mr-1 rounded p-1 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border p-2 md:hidden">
          <Link to="/" className="rounded p-1 text-muted-foreground" aria-label="Назад в терминал">
            <ArrowLeft size={16} />
          </Link>
          <img src={logo} alt="" className="h-5 w-5" />
          <span className="flex-1 text-sm font-semibold">ИИ-аналитик</span>
          <button onClick={onNew} className="rounded-md bg-primary p-1.5 text-primary-foreground" aria-label="Новая тема">
            <Plus size={14} />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
