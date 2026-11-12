import { createFileRoute } from "@tanstack/react-router";
import homeHtml from "../../site/index.html?raw";

function htmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () => htmlResponse(homeHtml),
    },
  },
  component: HomeFallback,
});

function HomeFallback() {
  return (
    <main className="p-8">
      <p>Opening Exam Oracle…</p>
      <a href="/exam-oracle.html">Continue</a>
    </main>
  );
}
