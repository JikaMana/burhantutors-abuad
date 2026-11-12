import { createFileRoute } from "@tanstack/react-router";
import pageHtml from "../../site/leaderboard.html?raw";

export const Route = createFileRoute("/leaderboard.html")({
  server: {
    handlers: {
      GET: async () =>
        new Response(pageHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-cache",
          },
        }),
    },
  },
});
