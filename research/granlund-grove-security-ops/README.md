# Granlund Grove — Security, API Governance & Observability (Nov 2025)

> **Project context**: TanStack Start 1.167 + React 19.2 + Vite 7 + Tailwind v4 + shadcn/Radix on Cloudflare Workers (`compatibility_date: 2025-09-24`, `nodejs_compat`). Single-tenant personal site. Existing `public/_headers` sets HSTS, X-Frame, Referrer-Policy, Permissions-Policy stub, and a CSP that still permits `'unsafe-inline'` in both `script-src` and `style-src`. Server applies headers as belt-and-suspenders in `src/server.ts`.

Research compiled **2025-11**. All citations dated. Pin versions; npm registry timestamps shown after package names.

---

## TL;DR — One-line answers

| # | Topic | Recommendation |
|---|-------|----------------|
| 1 | Turnstile | Free plan, **Managed mode**, `@marsidev/react-turnstile@1.5.2`, siteverify from the Worker. **No /month cap** — "unlimited challenges/verification". |
| 2 | Rate limiting | **Workers Rate Limiting API binding** (GA, free, simple key/limit/period). Skip WAF (1 rule only on Free, 10s window only) and DIY KV/DO. |
| 3 | API governance | **Spectral CLI `@stoplight/spectral-cli@6.16.0`** (Apache-2.0) for OAS 3.1 + AsyncAPI 2.6. Vacuum (Go, MIT) is a faster drop-in; Redocly CLI broader but MIT non-OSI quirks. |
| 4 | Security headers | Drop `'unsafe-inline'` in `script-src` via **nonces injected in TanStack Start SSR**; keep `'unsafe-inline'` in `style-src` (Tailwind v4 + Radix runtime styles still need it — there's no Tailwind-native hash/nonce path yet). Add `Permissions-Policy: browsing-topics=(), interest-cohort=(), …`. **No COOP/COEP needed** (no SharedArrayBuffer). SRI not needed (same-origin assets). Ship `/.well-known/security.txt` per RFC 9116. |
| 5 | Analytics | **Cloudflare Web Analytics** — free, cookieless, includes Core Web Vitals, zero new infra. Umami cannot run on Workers/D1 (needs Node+Postgres). |
| 6 | Error monitoring | **Cloudflare Workers Logs** (`observability.enabled = true`) for server. **Sentry `@sentry/cloudflare@10.53.1`** free Developer tier (5k errors/mo, 1 user) optional for client + structured Worker capture. **Logpush is paid** (Workers Trace Events Logpush requires Workers Paid). |
| 7 | RUM / CWV | Cloudflare Web Analytics already collects LCP/INP/CLS automatically. If you need custom: `web-vitals@5.2.0` → Cloudflare Analytics Engine (Workers Free: 100k writes/day, 10k reads/day, 3-month retention). |
| 8 | Uptime | **Better Stack** free (10 monitors + heartbeats, 30s checks, 1 status page) > UptimeRobot Free (50 monitors but 5-min interval) > OpenStatus Hobby (1 monitor, 10-min). |
| 9 | Workers Free | 100k req/day, 10ms CPU, 3 MB compressed bundle; KV: 100k reads/1k writes per day; D1: 5M rows read / 100k written per day, 5 GB total. |

---

## Files in this directory

- `README.md` — this summary
- `sources.md` — every URL + access date + tier rating
- `analysis.md` — Q1–Q9 deep dive with code snippets
- `recommendations.md` — prioritized, project-specific action plan with diffs to `_headers`, `wrangler.jsonc`, `package.json`
- `raw-findings/` — extracted raw text from primary docs (Cloudflare, RFC 9116, web.dev)

---

## Authoritative version pins (npm, captured Nov 2025)

```
@marsidev/react-turnstile  1.5.2     MIT          (npm: 2025-05-05)
@stoplight/spectral-cli    6.16.0    Apache-2.0
@redocly/cli               2.31.2    MIT
vacuum                     v0.26.5   MIT          (github release)
web-vitals                 5.2.0     Apache-2.0
@sentry/cloudflare         10.53.1   MIT
```

---

## Critical flags

1. **Your current CSP is not "strict"**: `script-src 'self' 'unsafe-inline'` defeats the purpose of CSP for XSS. Migrate to nonce-based (see analysis §4). Tailwind/Radix still require `style-src 'unsafe-inline'` in 2025 — acceptable, document the residual risk.
2. **Logpush is NOT free** for general HTTP/Firewall logs (Enterprise). Workers Trace Events Logpush works on the **Workers Paid plan** ($5/mo) — not the Free plan. Don't budget Logpush for a hobby site.
3. **Cloudflare Rate Limiting API is GA** (no longer `unstable_` since Wrangler ≥ 4.36.0). Counters are **per-Cloudflare-location** and **eventually consistent** — fine for abuse mitigation, not for accurate quotas.
4. **`@sentry/cloudflare` is the official Workers SDK** (not `@sentry/node`). Use the `withSentry` wrapper or `instrument` Sentry on the default export.
