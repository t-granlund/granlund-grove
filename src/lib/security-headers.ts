// Single source of truth for security/privacy response headers.
//
// IMPORTANT: Cloudflare's `public/_headers` file is applied ONLY to static-asset
// responses — never to responses the Worker generates (our SSR pages, the
// contact API, the sitemap). So these MUST be set in the Worker (src/server.ts)
// to actually protect the document. `_headers` mirrors a subset as
// belt-and-suspenders for assets; THIS file is canonical.

// Content-Security-Policy.
// - 'unsafe-inline' on script-src is required because TanStack Start injects
//   inline hydration scripts and we ship inline JSON-LD. XSS surface is near-zero
//   (no user-generated HTML, no third-party scripts) so this is the pragmatic
//   call; nonce-based CSP is a future hardening, not a launch blocker.
// - static.cloudflareinsights.com = Cloudflare Web Analytics beacon (automatic
//   mode, edge-injected). The beacon posts RUM to /cdn-cgi/rum on our own origin,
//   so connect-src 'self' covers it.
// - Resend is a server->server fetch from inside the Worker; the browser never
//   talks to it, so it needs NO connect-src entry.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  // Ventures page embeds privacy-enhanced YouTube only AFTER an explicit click
  // (facade pattern). Posters are self-hosted, so img-src stays 'self'; only the
  // nocookie player frame needs allow-listing.
  "frame-src 'self' https://www.youtube-nocookie.com",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Canonical security/privacy headers for every Worker response.
 * Order is irrelevant; kept as a flat record so the fitness test can assert it.
 */
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  // X-Frame-Options is superseded by frame-ancestors but still honored by older
  // browsers — harmless belt-and-suspenders.
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), camera=(), microphone=(), browsing-topics=(), payment=(), usb=()",
};

/** Apply the canonical headers without clobbering anything already set. */
export function applySecurityHeaders(headers: Headers): void {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
}
