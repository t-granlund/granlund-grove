import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// Paths whose responses should be cached immutably — build fingerprints filenames
// so the content can never change at a given URL. 1 year TTL is the convention.
const IMMUTABLE_PREFIXES = ["/assets/", "/img/", "/fonts/"];
// Resume PDFs may be updated; 24h TTL gives fresh content without hammering origin.
const RESUME_PREFIX = "/resume/";

/**
 * Apply security + privacy headers to every response.
 * - GPC header (CCPA §1798.135) — honor Global Privacy Control signal
 * - Security headers: `public/_headers` only covers static assets, so the Worker
 *   is the ONLY place these reach the SSR document. See src/lib/security-headers.ts.
 * - Cache-Control: immutable for fingerprinted assets, 24h for resume PDFs.
 */
function applyHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);

  // Honor Global Privacy Control — CCPA legal requirement
  const gpc = request.headers.get("Sec-GPC");
  if (gpc === "1") {
    headers.set("GPC", "1");
  }

  // Cache-Control for fingerprinted static assets
  if (!headers.has("Cache-Control")) {
    const { pathname } = new URL(request.url);
    if (IMMUTABLE_PREFIXES.some((p) => pathname.startsWith(p))) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (pathname.startsWith(RESUME_PREFIX)) {
      headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    }
  }

  // Canonical security/privacy headers (CSP, HSTS, Permissions-Policy, etc.)
  applySecurityHeaders(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // www -> apex redirect (canonical host is tylergranlund.com).
    // Both are Workers custom_domain routes so the redirect must happen in code.
    const url = new URL(request.url);
    if (url.hostname === "www.tylergranlund.com") {
      url.hostname = "tylergranlund.com";
      return Response.redirect(url.toString(), 301);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applyHeaders(normalized, request);
    } catch (error) {
      console.error(error);
      return applyHeaders(brandedErrorResponse(), request);
    }
  },
};
