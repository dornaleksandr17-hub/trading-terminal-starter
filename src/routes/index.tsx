import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trading Terminal" },
      { name: "description", content: "Trading Terminal" },
      { property: "og:title", content: "Trading Terminal" },
      { property: "og:description", content: "Trading Terminal" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div className="min-h-screen bg-background" />;
}
