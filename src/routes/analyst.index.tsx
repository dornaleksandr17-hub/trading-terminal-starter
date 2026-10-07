import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createThread, loadThreads } from "@/lib/analyst/threads";

export const Route = createFileRoute("/analyst/")({
  ssr: false,
  component: AnalystIndex,
});

// Открывает последнюю тему или создаёт первую. Повторный вызов эффекта
// (StrictMode) находит уже созданную тему и дубля не делает.
function AnalystIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = loadThreads()[0] ?? createThread();
    void navigate({ to: "/analyst/$threadId", params: { threadId: t.id }, replace: true });
  }, [navigate]);
  return null;
}
