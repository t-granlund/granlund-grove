# Project-Specific Recommendations — Granlund Grove

Prioritized for THIS repo (TanStack Start SSR Worker, `src/server.ts`, Workers Static Assets, `nodejs_compat`, compat date 2025-09-24, contact form -> Resend).

---

## P0 — Fix the security-headers gap on SSR HTML (correctness bug)

**Why:** `public/_headers` does NOT apply to Worker/SSR responses (Q1). Your SSR HTML currently ships with NO `Content-Security-Policy`, NO `Strict-Transport-Security`, NO `Permissions-Policy`. Only `X-Content-Type-Options`/`X-Frame-Options`/`Referrer-Policy` make it onto the document (set in `applyHeaders()`).

**Action:** Add CSP, Permissions-Policy (and HSTS unless you choose dashboard HSTS — see P2) to `applyHeaders()` in `src/server.ts`. Suggested additions, mirroring your `_headers` values:

```ts
if (!headers.has("Permissions-Policy")) {
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}
if (!headers.has("Content-Security-Policy")) {
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; " + // CF Web Analytics beacon (Q3)
    "style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; " +
    "connect-src 'self'; " +                 // 'self' covers Web Analytics automatic mode (Q3)
    "form-action 'self' mailto:; frame-ancestors 'none'; base-uri 'self'"
  );
}
```

**Notes:**
- Keep the `if (!headers.has(...))` guards so a route can override per-response.
- Update your code comment in `server.ts`: it currently implies `_headers` also covers these on the document — it does NOT for CSP/HSTS/Permissions-Policy.
- **Avoid drift:** ideally define these header values once (e.g. `src/lib/security-headers.ts`) and import into both the Worker and any build step that writes `_headers`.
- Your existing architecture fitness tests (`tests/architecture/fitness.test.ts`) plus an e2e assertion would be a good place to lock this in: assert `GET /` response includes `content-security-policy` and `strict-transport-security`. This would have caught the gap.

---

## P1 — Confirm the Resend secret path works (Q2)

**Status: already correct.** With `nodejs_compat` + compat date 2025-09-24, `process.env.RESEND_API_KEY` resolves (secrets are populated into `process.env`). The `env` arg also works and is threaded through `src/server.ts`.

**Action:**
- Set the secret: `wrangler secret put RESEND_API_KEY` (and `TURNSTILE_SECRET` if you adopt P3).
- Local dev: add them to `.dev.vars` (gitignored).
- Prefer reading from the `env` arg in request-scoped contact code; use `process.env` only where `env` isn't available. Don't lower compat date below 2025-04-01 or you lose `process.env` population.

---

## P2 — Decide ONE home for HSTS (Q6)

Pick exactly one to avoid duplicate/conflicting `Strict-Transport-Security` headers:
- **Option A (recommended): Dashboard HSTS** (SSL/TLS -> Edge Certificates). Covers the whole zone on every HTTPS response, auto-omitted on HTTP. If you choose this, **remove** HSTS from `_headers` AND don't add it in `applyHeaders()`.
- **Option B: Worker code.** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` in `applyHeaders()` (HTTPS only). If you choose this, leave dashboard HSTS off and remove HSTS from `_headers` (it only hits static assets anyway).

**Before any hstspreload.org submission:** ensure HSTS is on the SSR document (P0/P2), HTTP redirects to HTTPS, and all subdomains (incl. `www` if present) are HTTPS. Preload is near-permanent — opt in deliberately.

---

## P3 — Bot/abuse protection for the contact form (Q4 + Q5)

The contact endpoint posts to Resend — protect it from spam/abuse. Layered options, cheapest-first, all Free-tier viable:

1. **Turnstile (recommended primary):** Free = 20 widgets, unlimited verifications. Add one widget to the contact form; in the Worker handler, validate `cf-turnstile-response` server-side via `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET`. Reject on `!success`. (Tokens: 5 min, single-use.) This is the strongest signal for a public form and pairs naturally with your existing pure, injectable `src/lib/contact.ts` (`processContact` with injectable `fetchFn` — add an injectable `verifyTurnstileFn` the same way for unit-testability).
2. **Workers native rate limit binding (defense in depth):** add a `ratelimits` binding keyed by IP+route on the contact POST (Free-viable, no plan gate). Remember it's per-CF-location and eventually consistent — good enough as a throttle, not a hard quota. Period must be 10 or 60.
3. **WAF rate limiting rule (coarse outer guard):** Free = 1 rule, Path + IP, 10s window. Spend your single Free rule on the contact path if you want an edge-level cap before the request hits the Worker.

Recommended combo for a resume site: **Turnstile + native binding**. Keep the single WAF rule in reserve.

---

## P4 — Web Analytics + strict CSP (Q3)

If you enable Cloudflare Web Analytics:
- Add `https://static.cloudflareinsights.com` to `script-src` (done in the P0 snippet).
- **Automatic mode:** `connect-src 'self'` is enough; ensure the HTML document is NOT served with `Cache-Control: public, no-transform` (would block edge injection). The injected script is external + SRI'd, so no `'unsafe-inline'` needed for it.
- **Manual mode:** embed the beacon `<script>` yourself and use `connect-src ... cloudflareinsights.com`.
- Validate CSP changes with `Content-Security-Policy-Report-Only` before enforcing.

---

## P5 — CSP hardening (stretch)

Your CSP uses `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`. `'unsafe-inline'` on `script-src` substantially weakens XSS protection. Web Analytics does NOT require it. Longer-term, move to nonce/hash-based inline handling (TanStack Start SSR can emit a per-request nonce) and drop `'unsafe-inline'` from `script-src`. Style `'unsafe-inline'` is lower-risk but also removable with hashing if desired.

---

## Suggested implementation order
1. P0 (header gap) + an architecture/e2e test asserting CSP+HSTS on `GET /`.
2. P2 (pick HSTS home) — align with P0.
3. P3 (Turnstile on contact form) — highest abuse-reduction ROI.
4. P1 verify secrets; P4 if adding analytics; P5 as ongoing hardening.
