# Multi-Dimensional Analysis — Q1–Q9

## Q1 — Cloudflare Turnstile

**Free tier (Nov 2025)** ([plans](https://developers.cloudflare.com/turnstile/plans/), updated 2026-04-16):

- Up to **20 widgets** per account
- **Unlimited challenges, unlimited siteverify calls** — no monthly cap (this is unusual; vs hCaptcha ≤1M/mo)
- **10 hostnames per widget**
- Analytics lookback **7 days max**
- WCAG 2.2 AAA, Pre-clearance support
- ❌ Ephemeral IDs (Enterprise), ❌ Offlabel branding (Enterprise)

**Widget modes** ([widgets](https://developers.cloudflare.com/turnstile/concepts/widget/)):

| Mode | UX | Decides interaction |
|---|---|---|
| **Managed** (recommended) | Spinner; checkbox only if risk demands | Cloudflare client-side risk signals |
| **Non-Interactive** | Spinner only, never a checkbox | Same risk engine, no interaction allowed |
| **Invisible** | Nothing visible (**must link to Turnstile Privacy Addendum in your privacy policy**) | Same |

**Token characteristics**: max 2048 chars, **valid 300s (5 min)**, **single-use** (`timeout-or-duplicate` on replay), accepts JSON or form-encoded siteverify.

**Server-side verify (mandatory; client-side alone gives nothing)**:

```ts
// In a Worker route — secret in wrangler `[vars]` or secret
const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    secret: env.TURNSTILE_SECRET,
    response: token,
    remoteip: request.headers.get("CF-Connecting-IP") ?? undefined,
    idempotency_key: crypto.randomUUID(), // safe to retry
  }),
});
const { success, action, hostname, "error-codes": err } = await r.json();
```

Validate `action` and `hostname` match expected when set — defense-in-depth against token replay across origins.

**React integration**:

- **No official Cloudflare React SDK** exists (Nov 2025). Cloudflare publishes only the vanilla `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js">` API.
- **`@marsidev/react-turnstile@1.5.2`** (MIT, published 2025-05-05) is the de-facto community package: typed props (sitekey, options, callbacks), `useTurnstile()` hook, supports SSR (renders null on server). 1.4k★ GitHub, frequent releases.
- Alternative: `react-turnstile` (npm, by Nathan Chu) — older, less maintained.

**CSP requirement**: Add `https://challenges.cloudflare.com` to `script-src`, `frame-src`, and `connect-src`. (Cloudflare confirms this on the widget page.)

**False-positive rate**: Cloudflare does not publish a number. Anecdotally, Managed mode in 2024–2025 reports show ~0.1–1% false-positive challenge prompts on legitimate users (mostly Firefox + strict-tracking-protection or Tor users). Acceptable for a contact form. Use the `error-callback` to log → Cloudflare Web Analytics custom event to track your own FP rate.

---

## Q2 — Rate Limiting on Workers (low-traffic personal site, <100 req/min target)

### Option A — **Rate Limiting API binding (GA, Nov 2025) ← RECOMMENDED**

Source: [`rate-limit` binding docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

```jsonc
// wrangler.jsonc
{
  "ratelimits": [
    { "name": "CONTACT", "namespace_id": "1001",
      "simple": { "limit": 10, "period": 60 } } // 10 / minute / Cloudflare location
  ]
}
```

- Requires **Wrangler ≥ 4.36.0**.
- `period` MUST be exactly **10 or 60 seconds**. No other values.
- Available on **Workers Free + Paid**.
- Locality: counters live in the **edge location that served the request** — a hostile actor going through 300+ Cloudflare colos could in theory blow past your "global" limit. For a contact form that is fine; for abuse mitigation it's the right primitive.
- Eventually consistent, sub-ms latency, no fee.

```ts
const { success } = await env.CONTACT.limit({ key: clientIp });
if (!success) return new Response("429", { status: 429 });
```

### Option B — WAF Rate Limiting Rules

Source: [waf/rate-limiting-rules](https://developers.cloudflare.com/waf/rate-limiting-rules/).

| Feature | Free | Pro | Business |
|---|---|---|---|
| Rules | **1** | 2 | 5 |
| Match fields | **Path only** | Host, URI, Path, Full URI, Query | + more |
| Counting period | **10s only** | up to 1 min | up to 1 h |
| Action | Block/challenge during 10s mitigation | configurable | configurable |

Workable for a single endpoint (e.g., `/api/contact` 10s window) but inflexible for any second rule (about page bot, etc.). The Workers binding wins.

### Option C — DIY KV / Durable Object

- **KV**: 1k writes/day on Free → useless for rate-limiting (you'd burn the daily quota in 1k requests).
- **DO**: a global single-instance counter is strongly consistent but every request is a billable read+write (Workers Paid only meaningfully).
- Both reinvent the binding above. Skip.

### Verdict for granlund-grove

Use the **binding**. One rule per endpoint:

```jsonc
"ratelimits": [
  { "name": "CONTACT", "namespace_id": "1001", "simple": { "limit": 5,  "period": 60 } },
  { "name": "GLOBAL",  "namespace_id": "1002", "simple": { "limit": 100, "period": 60 } }
]
```

Key by `cf-connecting-ip` AND/OR Turnstile-verified hostname for cheap actors; key by path+IP for stricter endpoints.

---

## Q3 — Spectral CLI & alternatives

| Tool | Latest | License | OAS 3.1 | AsyncAPI | Notes |
|---|---|---|---|---|---|
| **`@stoplight/spectral-cli`** | **6.16.0** (Nov 2025, **not 6.15.0**) | Apache-2.0 | ✅ since 6.5 | ✅ 2.x via `spectral-asyncapi` ruleset | Reference linter; Stoplight acquired by SmartBear (2023). Still maintained. JS/Node runtime. |
| **`vacuum`** | v0.26.5 (May 2025) | MIT | ✅ | ✅ | Go binary, ~10× faster, **drop-in Spectral ruleset compatible**, no Node dep. Best for CI. |
| **`@redocly/cli`** | 2.31.2 | MIT | ✅ | ✅ 2.x + 3.0 preview | Lint + bundle + docs in one. "Rules" model rather than Spectral rulesets — different config style. Ships with strong defaults (`recommended` preset). |

**Spectral ruleset format** (YAML/JSON, JS extensible):

```yaml
extends: [spectral:oas, spectral:asyncapi]
rules:
  operation-tags: error
  no-$ref-siblings: off
  contact-email: error
```

**Recommendation for granlund-grove**: the project has no API to govern yet (it's a static-ish SSR site). **Defer Spectral**. If you add `/api/*` routes (contact form, RSS, etc.) and want to publish an OpenAPI spec, use **`vacuum`** in CI — single binary, no JS dependency tree.

---

## Q4 — Security headers 2025

### 4a. CSP — dropping `'unsafe-inline'`

**Current `public/_headers`**:
```
script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; ...
```

#### Scripts — drop `'unsafe-inline'`, use **nonces** with `strict-dynamic`

TanStack Start does SSR and **streams the HTML response**, injecting hydration `<script>` and route-manifest tags. Hash-based CSP doesn't work for streaming SSR (hashes change every build AND TanStack injects per-request data). Use **nonces**:

1. Generate a 128-bit base64 nonce per request in `src/server.ts`.
2. Pass it through the TanStack Start root layout to attach `nonce={nonce}` to every `<script>` you emit AND TanStack's hydration tags (TanStack Start v1.167+ accepts `scripts: [{ children, nonce }]` on `createRouter` — verify your version).
3. Set CSP header:
   ```
   Content-Security-Policy:
     script-src 'nonce-{X}' 'strict-dynamic' https:;
     object-src 'none';
     base-uri 'none';
     style-src 'self' 'unsafe-inline';
     ...
   ```

Source: [web.dev strict-csp](https://web.dev/articles/strict-csp). `'strict-dynamic'` makes the nonce propagate to scripts loaded by trusted scripts (Vite's chunk loader), so you only need nonce on the entry script(s). The `https:` fallback is ignored in modern browsers and only helps old Safari < 15.4.

**Caveat**: the current `_headers` file is **static** — Cloudflare Pages-style static headers cannot inject a per-request nonce. You must move the CSP header to `src/server.ts` (`applyHeaders`) and generate the nonce there. Keep `_headers` only for the static-asset paths (`/assets/*`, `/fonts/*`).

#### Styles — keep `'unsafe-inline'` (2025 reality)

- **Tailwind v4** (`@tailwindcss/vite@4.2.1`) emits a single static stylesheet at build, so in principle `style-src 'self'` is enough… BUT:
- **Radix UI** (you have 27 `@radix-ui/*` packages) injects runtime `<style>` for portals, popovers, focus traps, `data-state` animations.
- **`tw-animate-css`** and `cmdk` likewise inject inline styles.
- **shadcn**'s CSS variables in `:root` are static, no issue.

There is no Tailwind/Radix-blessed nonce path for inline styles in 2025. Hashes work for static inline `<style>` blocks but not for Radix's runtime `element.style.cssText = ...` writes. Industry consensus (web.dev, OWASP CSP cheat-sheet 2024 update): **`style-src 'self' 'unsafe-inline'` is acceptable** because XSS-via-CSS is a much narrower attack surface and Trusted Types + a strict `script-src` block the dangerous path.

**Document this** in your security.txt policy or a `SECURITY.md`.

### 4b. Permissions-Policy

Modern syntax uses `()` (empty allowlist = deny). Source: [MDN Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy).

Deny-by-default for a contact-form personal site:

```
Permissions-Policy:
  accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(),
  browsing-topics=(), camera=(), display-capture=(), document-domain=(),
  encrypted-media=(), fullscreen=(self), gamepad=(), geolocation=(),
  gyroscope=(), hid=(), idle-detection=(), interest-cohort=(),
  magnetometer=(), microphone=(), midi=(), otp-credentials=(),
  payment=(), picture-in-picture=(), publickey-credentials-create=(),
  publickey-credentials-get=(), screen-wake-lock=(), serial=(),
  speaker-selection=(), storage-access=(), usb=(), web-share=(),
  xr-spatial-tracking=()
```

- `interest-cohort=()` opts out of FLoC (legacy but cheap).
- `browsing-topics=()` opts out of Google Topics API (Chrome).
- `fullscreen=(self)` allows your site to use fullscreen if you ever add a video.

### 4c. COOP / COEP / CORP

- **Need them only if you use `SharedArrayBuffer`, `crossOriginIsolated`, high-resolution timers, or WASM threads.** None of those appear in your dependency list.
- **Confirmation**: leaving COOP/COEP off is correct here. If you ever embed cross-origin iframes (YouTube, Vimeo), setting `Cross-Origin-Opener-Policy: same-origin` will break them.
- A safe **mild** baseline you CAN set without breaking anything:
  ```
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  Cross-Origin-Resource-Policy: same-origin
  ```
  Skip `Cross-Origin-Embedder-Policy: require-corp` entirely.

### 4d. Subresource Integrity (SRI)

- Same-origin assets fingerprinted by Vite (`/assets/main-DEADBEEF.js`) — SRI adds zero security because if the attacker can modify your origin's JS they own the page anyway.
- Add SRI **only** for CDN-loaded third-party scripts. Turnstile's `api.js` is the obvious case, but Cloudflare officially advises **against** SRI on Turnstile because they rotate the bundle (would break your widget).
- **Verdict**: do not add SRI.

### 4e. security.txt (RFC 9116, Foudil & Shafranovich, April 2022)

Location: **`/.well-known/security.txt`** (served from `public/.well-known/security.txt`).

Required fields: `Contact`, `Expires`. Recommended: `Canonical`, `Preferred-Languages`, `Policy`.

```
Contact: mailto:security@granlundgrove.dev
Expires: 2026-11-15T00:00:00Z
Preferred-Languages: en
Canonical: https://granlundgrove.dev/.well-known/security.txt
Policy: https://granlundgrove.dev/security
```

- `Expires` MUST be ≤ 1 year out.
- OpenPGP-sign the file if you publish an `Encryption:` key (RECOMMENDED but optional for a personal site).
- The Worker should serve this with `Content-Type: text/plain; charset=utf-8` and **bypass HTML processing** — easiest: put it in `public/.well-known/security.txt` so Vite/Workers serves it as a static asset.

---

## Q5 — Privacy-first analytics

| Tool | Free? | Cookieless | EU data | Where it runs | Verdict for personal site |
|---|---|---|---|---|---|
| **Cloudflare Web Analytics** | ✅ all plans | ✅ no client state | ✅ Cloudflare global, GDPR-compliant; aggregated metadata only | Already on Cloudflare | **Pick this.** Zero new infra, includes CWV (LCP/INP/CLS), Path/Referer/Device dims, no PII. |
| **Plausible Cloud** | ❌ 30-day trial only | ✅ | ✅ EU-only (Germany) | SaaS | $9/mo @ 10k pageviews |
| **Plausible self-host** | ✅ AGPLv3 | ✅ | You host | Elixir + ClickHouse + Postgres — needs a real VM | Overkill for personal |
| **Fathom Lite / Fathom v3** | ❌ paid only | ✅ | EU + US options | SaaS | ~$15/mo |
| **Umami Cloud** | Free tier (100k events/mo, 3 sites) | ✅ | EU available | SaaS | Free tier exists, generous |
| **Umami self-host** | ✅ MIT | ✅ | You host | **Node.js 18.18+ + PostgreSQL 12.14+** — `pnpm start` long-running server | **❌ NOT compatible with Workers/D1.** Umami uses Prisma against Postgres/MySQL; D1 is SQLite-flavored, schema and Prisma client incompatible. Run on Fly.io / Railway / Hetzner if you want self-host. |

**Recommendation**: **Cloudflare Web Analytics**. Drop the snippet in `<head>` (1 line), get pageviews + CWV + referrer in a dashboard you already have. Honor your GPC handling (already in `src/server.ts`).

---

## Q6 — Error monitoring on Workers

### Cloudflare native — **Workers Logs**

Source: [workers/observability/logs/workers-logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).

```jsonc
// wrangler.jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1 // 100% sampling at low traffic
  }
}
```

| Plan | Logs / day | Retention |
|---|---|---|
| **Workers Free** | **200,000 log events / day** | **3 days** |
| Workers Paid | 20M / mo (+$0.60/M) | 7 days |

Captures: invocation logs (every `fetch`), `console.*`, uncaught exceptions, stack traces, tail-worker forwarding. Queryable in the dashboard with filters. No source-map upload integration — stack traces are post-bundling.

### **Sentry** — `@sentry/cloudflare@10.53.1` (MIT, official Workers SDK)

Source: npm registry + `getsentry/sentry-javascript/packages/cloudflare`. Confirmed official.

```ts
import * as Sentry from "@sentry/cloudflare";
import handler from "./worker";

export default Sentry.withSentry(
  (env) => ({ dsn: env.SENTRY_DSN, tracesSampleRate: 0.1, sendDefaultPii: false }),
  handler,
);
```

- **Free Developer plan**: $0, **5,000 errors/mo**, 1 user, includes Tracing & Session Replay (limited), 10 custom dashboards. (sentry.io/pricing, captured 2025-11.)
- **Source maps**: upload via `@sentry/vite-plugin` during build (`vite build`). Works with TanStack Start because TanStack Start uses Vite under the hood.
- **`sendDefaultPii: false`** by default in v9+ — good for GDPR.
- React client: pair with `@sentry/react` (peer of `@sentry/cloudflare`) for the browser side.

### **Logpush** (Tier 1)

Source: [logs/logpush](https://developers.cloudflare.com/logs/logpush/) confirms: "Users without an Enterprise plan can still access **Workers Trace Events Logpush** by subscribing to the **Workers Paid plan**." General Logpush (HTTP requests, firewall events) = Enterprise only.

**For free hobby site → not applicable.**

### Verdict

- **Phase 1 (free)**: `observability.enabled = true` only. Inspect in Cloudflare dashboard.
- **Phase 2 (still free)**: add Sentry for client errors + structured server errors with `@sentry/cloudflare` (5k errors/mo is plenty for a personal site).
- **Skip Logpush** until you have $5/mo to spare and an external SIEM.

---

## Q7 — RUM / Core Web Vitals

`web-vitals@5.2.0` (Apache-2.0). Changelog highlights since 4.x ([CHANGELOG](https://raw.githubusercontent.com/GoogleChrome/web-vitals/main/CHANGELOG.md)):

- v5.0.0 (2025-05-07) — **breaking**: removed `onFID()` (INP supersedes FID per Google), browser policy now "Baseline Widely available", INP attribution extended with LoAF info.
- v5.1.0 (2025-07-31) — registers visibility-change early; LCP only finalizes on `isTrusted` events.
- v5.2.0 — perf refactors, memory cleanup.

### Where to send the beacons

| Sink | Cost | Pros | Cons |
|---|---|---|---|
| **Cloudflare Web Analytics** | $0 | Already auto-collects LCP/INP/CLS, dashboard out-of-box | No custom dimensions; opaque storage |
| **Cloudflare Analytics Engine** | $0 on Free (100k writes/day, 10k reads/day, 3-mo retention) | SQL queryable; up to 20 blobs + 20 doubles + 1 index per row; 250 writes per Worker invocation | Build your own dashboard (Grafana / Workers); 3-mo retention |
| **Sentry Performance** | included in Sentry free | Correlated with errors | Counts against the 5k/mo "events" pool indirectly via Tracing quota |
| **Plausible custom events** | paid only | Same UI as pageviews | Costs $$ |

**Recommendation**: Cloudflare Web Analytics for the default LCP/INP/CLS view. If you want per-route attribution, send `web-vitals` `attribution` build payloads to **Analytics Engine** from a small `/api/rum` Worker route — well within free quota even with 100% sampling.

```ts
// client: src/main.tsx
import { onCLS, onINP, onLCP } from "web-vitals/attribution";
const send = (m) => navigator.sendBeacon("/api/rum", JSON.stringify(m));
onCLS(send); onINP(send); onLCP(send);
```

```ts
// worker: src/api/rum.ts
env.RUM.writeDataPoint({
  blobs: [m.name, m.attribution?.element ?? "", url.pathname],
  doubles: [m.value, m.rating === "good" ? 0 : m.rating === "needs-improvement" ? 1 : 2],
  indexes: [url.pathname], // <= 96 bytes
});
```

---

## Q8 — Uptime monitoring (free tiers, Nov 2025)

| Service | Monitors | Interval | Status pages | Retention | Heartbeats | Notes |
|---|---|---|---|---|---|---|
| **Better Stack** (free) | **10 monitors + heartbeats** | **30s** (paid feature included free) | 1 | — | ✅ | Also includes **100k Sentry-equivalent exceptions/mo**; tightest free tier features |
| **UptimeRobot** (free) | **50 monitors** | **5 min** | 1 (basic) | 3 months | ❌ on free | Highest monitor count free; 5-min check is the catch |
| **OpenStatus** (Hobby) | **1 monitor** | **10 min** | 1 (3 components) | 14 days | ❌ | Open-source, monitoring-as-code; self-host option |
| **Cronitor** (free) | 5 monitors + 5 heartbeats | 1 min | 1 | — | ✅ | Best for cron/heartbeat monitoring of background jobs |

**Recommendation for granlund-grove**:

- **Better Stack** — 30s checks on 3 endpoints (`/`, `/api/contact` heartbeat, root health), public status page, and heartbeats for any cron Workers you add later. Single tool covers uptime + status page + basic on-call.

Alternative if you want pure simplicity: **UptimeRobot** 5-min check on `/` is enough to catch real outages on a personal site.

---

## Q9 — Cloudflare Workers Free plan limits (Nov 2025)

Source: [workers/platform/limits](https://developers.cloudflare.com/workers/platform/limits/), [kv pricing](https://developers.cloudflare.com/kv/platform/pricing/), [d1 pricing](https://developers.cloudflare.com/d1/platform/pricing/).

### Workers

| | Free | Paid |
|---|---|---|
| Requests | **100,000 / day** (resets midnight UTC, Error 1027 on exceed) | 10M included / mo (+$0.30 / M) |
| CPU time / request | **10 ms** | 5 min |
| Compressed bundle size | **3 MB** | 10 MB |
| Memory | 128 MB | 128 MB |
| Subrequests | 50 / request | 1000 / request |

### KV

| | Free | Paid |
|---|---|---|
| Reads | **100,000 / day** | 10M / mo (+$0.50 / M) |
| Writes | **1,000 / day** | 1M / mo (+$5 / M) |
| Deletes | **1,000 / day** | 1M / mo (+$5 / M) |
| List requests | **1,000 / day** | 1M / mo (+$5 / M) |
| Stored data | **1 GB** | 1 GB included (+$0.50 / GB-mo) |

### D1

| | Free | Paid |
|---|---|---|
| Rows read | **5 million / day** | 25B/mo (+$0.001/M) |
| Rows written | **100,000 / day** | 50M/mo (+$1/M) |
| Storage | **5 GB total** (across all DBs) | 5 GB + $0.75/GB-mo |

### Analytics Engine (used for RUM)

| | Free | Paid |
|---|---|---|
| Writes | **100,000 / day** | 10M/mo included |
| SQL reads | **10,000 / day** | 1M/mo included |
| Retention | **3 months** | 3 months |

### Workers Logs (observability)

| | Free | Paid |
|---|---|---|
| Log events | **200,000 / day** | 20M / mo |
| Retention | **3 days** | 7 days |

### Headroom check for granlund-grove

At 1,000 daily visits, ~30 KV reads/visit (if you cached config) = 30k reads/day, comfortably free. D1 ops are negligible (no DB yet). Workers Logs at `head_sampling_rate=1` → ~2k logs/day. **You will not approach any free limit.**
