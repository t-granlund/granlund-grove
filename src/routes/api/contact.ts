import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { processContact } from "@/lib/contact";

// Thin adapter. All rules live in src/lib/contact.ts (unit-tested). Delivery
// uses Resend when RESEND_API_KEY is set (`wrangler secret put RESEND_API_KEY`);
// otherwise this returns 501 and the client falls back to mailto.
function readEnv(key: string): string | undefined {
  try {
    return typeof process !== "undefined" ? process.env?.[key] : undefined;
  } catch {
    return undefined;
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json({ ok: false, error: "Invalid JSON" }, 400);
        }
        const result = await processContact(raw, { apiKey: readEnv("RESEND_API_KEY") });
        return json(result.body, result.status);
      },
    },
  },
});
