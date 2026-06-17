import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { processContact } from "@/lib/contact";

// Thin adapter. All rules live in src/lib/contact.ts (unit-tested). Delivery
// uses Resend when RESEND_API_KEY is set (`wrangler secret put RESEND_API_KEY`);
// otherwise this returns 501 and the client falls back to mailto.
//
// Cloudflare Workers env access: with nodejs_compat, process.env reads from
// worker bindings. We also try the global env fallback for robustness.
function getEnv(key: string): string | undefined {
  try {
    // Cloudflare Workers with nodejs_compat polyfills process.env from bindings
    if (typeof process !== "undefined" && process.env?.[key]) {
      return process.env[key];
    }
  } catch {
    /* noop */
  }
  try {
    // Fallback: some Worker runtimes expose env on globalThis
    const globalEnv = (globalThis as Record<string, unknown>).env;
    if (globalEnv && typeof globalEnv === "object" && key in globalEnv) {
      return String((globalEnv as Record<string, string>)[key]);
    }
  } catch {
    /* noop */
  }
  return undefined;
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
        const apiKey = getEnv("RESEND_API_KEY");
        if (!apiKey) {
          console.warn("[contact] RESEND_API_KEY not set — returning 501");
        }
        const result = await processContact(raw, { apiKey });
        if (result.status >= 400) {
          console.error(`[contact] delivery failed: ${result.status}`, result.body);
        } else if (result.status === 200) {
          console.log("[contact] email accepted by Resend");
        }
        return json(result.body, result.status);
      },
    },
  },
});
