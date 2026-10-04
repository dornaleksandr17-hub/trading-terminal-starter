import App from "@/App";
import { ErrorBoundary } from "@/ui/ErrorBoundary";

// Замена src/main.tsx из Bolt-проекта: тот же ErrorBoundary вокруг <App />.
export default function AppRoot() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
