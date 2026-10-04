import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

// Приложение целиком клиентское (Web Worker, localStorage, WebSocket, canvas-график).
// Поэтому: (1) ssr:false, (2) динамический import — сервер НИКОГДА не загружает код терминала.
const AppRoot = lazy(() => import("@/AppRoot"));

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Trading Terminal" },
      {
        name: "description",
        content:
          "Real-time crypto & forex trading terminal with technical analysis and signal generation.",
      },
      { property: "og:title", content: "Trading Terminal" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // id="root" и h-full нужны CSS приложения (html, body, #root { height: 100% }).
  return (
    <div id="root" className="h-full">
      {mounted ? (
        <Suspense fallback={null}>
          <AppRoot />
        </Suspense>
      ) : null}
    </div>
  );
}
