# Recommendations — Prioritized Action Plan for granlund-grove

Cost target: **$0**. Effort scale: 🟢 < 30min, 🟡 1-2h, 🔴 > half day.

## P0 — Do this week

### 1. Harden the CSP (🟡)

The current `public/_headers` `Content-Security-Policy: script-src 'self' 'unsafe-inline'` is not effective against XSS. Two-part fix:

1. **Remove CSP from `public/_headers`** (static headers can't carry per-request nonces). Keep the static headers there for asset paths only.
2. **Move CSP to `src/server.ts` `applyHeaders()`** and generate a nonce per request:

```ts
// src/server.ts (extend applyHeaders)
const nonce = btoa(crypto.getRandomValues(new Uint8Array(16)).reduce(
  (s, b) => s + String.fromCharCode(b), ""));

headers.set("Content-Security-Policy", [
  `script-src 'nonce-${nonce}' 'strict-dynamic' https:`,
  `style-src 'self' 'unsafe-inline'`,                // Radix/Tailwind runtime
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self' https://challenges.cloudflare.com`,
  `frame-src https://challenges.cloudflare.com`,     // Turnstile widget
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `base-uri 'none'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; "));
```

Inject the nonce into TanStack Start by passing it to `renderToReadableStream`'s `nonce` option and into your root layout's `<Scripts nonce={nonce}/>`. Verify your `@tanstack/react-start` version exposes the nonce prop (1.167.50 does via the `Scripts` component prop).

**Test with**: https://csp-evaluator.withgoogle.com/ — target "Strict CSP".

### 2. Modernize Permissions-Policy (🟢)

Replace the line in `public/_headers`:

```diff
- Permissions-Policy: camera=(), microphone=(), geolocation=()
+ Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), browsing-topics=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), usb=(), web-share=(), xr-spatial-tracking=()
```

### 3. Ship `security.txt` (🟢)

Create `public/.well-known/security.txt`:

```
Contact: mailto:security@granlundgrove.dev
Expires: 2026-11-15T00:00:00Z
Preferred-Languages: en
Canonical: https://granlundgrove.dev/.well-known/security.txt
Policy: https://granlundgrove.dev/security
```

Vite will copy it; Cloudflare Workers will serve it under `/.well-known/`. Set a calendar reminder for **2026-10-15** to bump `Expires` (RFC 9116 §2.5.5 requires it be < 1 year future).

### 4. Enable Workers observability (🟢)

```jsonc
// wrangler.jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "granlund-grove",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts",
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

Redeploy. Errors and `console.error()` calls (you already have these in `server.ts`) will appear in Dashboard → Workers → Logs.

### 5. Add Cloudflare Web Analytics (🟢)

Dashboard → Web Analytics → Add a site → copy the snippet → drop into your root layout's `<head>` (one `<script>` tag). Cookieless, captures CWV automatically. **Honors GPC** because no cookies are set.

---

## P1 — Do this month

### 6. Add Turnstile to the contact form (🟡)

```bash
bun add @marsidev/react-turnstile  # 1.5.2 MIT, pinned
```

```tsx
import { Turnstile } from "@marsidev/react-turnstile";
<Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
           options={{ appearance: "interaction-only", theme: "auto" }} />
```

Add `TURNSTILE_SECRET` via `wrangler secret put TURNSTILE_SECRET`. Verify server-side in the contact-form Worker route (see analysis §1). Use the `idempotency_key` retry pattern.

Update CSP `connect-src`/`frame-src`/`script-src` to allow `https://challenges.cloudflare.com` (already in the snippet above).

### 7. Add Rate Limiting binding on the contact form (🟢)

```jsonc
// wrangler.jsonc
"ratelimits": [
  { "name": "CONTACT", "namespace_id": "1001", "simple": { "limit": 5, "period": 60 } }
]
```

In the contact route: `const { success } = await env.CONTACT.limit({ key: clientIp });`.

### 8. Add an uptime monitor (🟢)

Sign up for **Better Stack** free → 30s check on `https://granlundgrove.dev/` → email alert. 5 minutes of work.

---

## P2 — Optional / when traffic grows

### 9. Sentry for client + server errors (🟡)

```bash
bun add @sentry/cloudflare @sentry/react @sentry/vite-plugin
```

Wrap default export with `Sentry.withSentry(...)`. Configure the Vite plugin to upload source maps on `bun run build`. Free Developer tier: 5k errors/mo.

### 10. Custom RUM via Analytics Engine (🟡)

Only if Cloudflare Web Analytics doesn't give you per-route attribution. Bind `analytics_engine_datasets` in `wrangler.jsonc`, send `web-vitals/attribution` beacons from the client to a `/api/rum` route.

### 11. API governance with vacuum (🟢)

Only if you publish an OpenAPI spec. Add `vacuum lint openapi.yaml` to CI; ignore Spectral unless you need the JS plugin ecosystem.

---

## Diffs to ship together (commit 1)

**`public/_headers`**:
```diff
 /*
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Referrer-Policy: strict-origin-when-cross-origin
-  Permissions-Policy: camera=(), microphone=(), geolocation=()
+  Permissions-Policy: accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), browsing-topics=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), gamepad=(), geolocation=(), gyroscope=(), hid=(), idle-detection=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), payment=(), picture-in-picture=(), publickey-credentials-create=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), usb=(), web-share=(), xr-spatial-tracking=()
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
-  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self'; form-action 'self' mailto:; frame-ancestors 'none'; base-uri 'none'
+  Cross-Origin-Opener-Policy: same-origin-allow-popups
+  Cross-Origin-Resource-Policy: same-origin
```

(CSP is removed from `_headers` and moved into `src/server.ts` because it now needs the per-request nonce — see P0.1.)

**`wrangler.jsonc`**:
```diff
 {
   "$schema": "node_modules/wrangler/config-schema.json",
   "name": "granlund-grove",
   "compatibility_date": "2025-09-24",
   "compatibility_flags": ["nodejs_compat"],
-  "main": "src/server.ts"
+  "main": "src/server.ts",
+  "observability": { "enabled": true, "head_sampling_rate": 1 }
 }
```

**New file `public/.well-known/security.txt`** — see P0.3.

---

## Anti-recommendations (do NOT do)

- ❌ **Don't add SRI** to your build chunks — they're same-origin and Vite-fingerprinted; SRI adds operational pain (cache invalidation on every deploy) for zero benefit.
- ❌ **Don't add COOP/COEP `require-corp`** — you have no `SharedArrayBuffer`, no WASM threads, and will break Turnstile's iframe.
- ❌ **Don't self-host Umami on Workers** — it needs Node+Postgres. If you must self-host analytics, use Fly.io.
- ❌ **Don't budget Cloudflare Logpush** — Enterprise only for HTTP logs; Workers Trace Events Logpush wants Workers Paid. Workers Logs (free) covers your needs.
- ❌ **Don't implement DIY rate-limiting in KV** — 1k writes/day on Free would be exhausted by the rate limiter itself.
- ❌ **Don't pin `@stoplight/spectral-cli@6.15.0`** — 6.16.0 is current. If you actually want a tool, vacuum is the better choice for this stack.
