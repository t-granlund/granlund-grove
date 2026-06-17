/**
 * Cloudflare Web Analytics — manual beacon.
 *
 * The beacon only renders when VITE_CF_BEACON_TOKEN is set at build time.
 * This keeps the site analytics-free until Tyler explicitly opts in by
 * adding the token (e.g. via the Cloudflare dashboard → Web Analytics →
 * "Manage site" → copy the token into the build env).
 *
 * Why manual mode for a Workers site?
 * - Automatic edge injection works for static/proxied HTML, but SSR Workers
 *   generate responses dynamically; injection is less reliable.
 * - Manual mode is deterministic and keeps the CSP simple.
 *
 * CSP requirements:
 *   script-src ... https://static.cloudflareinsights.com
 *   connect-src ... https://cloudflareinsights.com
 */
const BEACON_TOKEN = import.meta.env.VITE_CF_BEACON_TOKEN as string | undefined;

export function Analytics() {
  if (!BEACON_TOKEN) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${BEACON_TOKEN}"}`}
    />
  );
}
