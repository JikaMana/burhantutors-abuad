import { createFileRoute } from "@tanstack/react-router";

async function handle({ request, params }: { request: Request; params: { name: string } }) {
  const { dispatchOracle } = await import("../../../server/oracle/dispatch.mjs");
  return dispatchOracle(params.name, request);
}

export const Route = createFileRoute("/api/$name")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
