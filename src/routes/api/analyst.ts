import { createFileRoute } from "@tanstack/react-router";
import { handleAnalystChat } from "@/lib/analyst/analyst-chat.server";

export const Route = createFileRoute("/api/analyst")({
  server: { handlers: { POST: ({ request }) => handleAnalystChat(request) } },
});
