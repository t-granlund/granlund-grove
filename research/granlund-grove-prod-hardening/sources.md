# Sources & Credibility Assessment

All primary sources are Cloudflare official documentation (Tier 1: vendor primary docs for the exact product) or the canonical hstspreload.org project page (Tier 1: the authoritative submission source, run by the Chromium project). Cross-referencing notes included where one claim is corroborated by a second page.

| # | Source | URL | Tier | Last updated (page stamp) | Used for |
|---|--------|-----|------|---------------------------|----------|
| S1 | Workers Static Assets — Headers | https://developers.cloudflare.com/workers/static-assets/headers/ | 1 | Apr 23, 2026 | Q1 — `_headers` does not apply to Worker/SSR responses; supported for Workers Static Assets |
| S2 | Workers — Environment variables | https://developers.cloudflare.com/workers/configuration/environment-variables/ | 1 | Apr 23, 2026 | Q2 — `nodejs_compat_populate_process_env` default ≥ 2025-04-01; secrets via `process.env` |
| S3 | Web Analytics — FAQ (CSP section) | https://developers.cloudflare.com/web-analytics/faq/ | 1 | May 20, 2026 | Q3 — exact CSP domains, automatic vs manual connect-src, SRI/integrity, no-transform gotcha |
| S4 | Web Analytics — Get started | https://developers.cloudflare.com/web-analytics/get-started/ | 1 | Apr 17, 2026 | Q3 — automatic edge injection for proxied sites; injection modes |
| S5 | Workers Runtime APIs — Rate Limiting binding | https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ | 1 | Apr 23, 2026 | Q4a — `ratelimits` syntax, `.limit({key})`, Wrangler >= 4.36.0, per-location locality |
| S6 | WAF — Rate limiting rules (Availability) | https://developers.cloudflare.com/waf/rate-limiting-rules/ | 1 | Apr 22, 2026 | Q4b — Free = 1 rule, Path+Verified Bot, IP, 10s |
| S7 | Turnstile — Plans | https://developers.cloudflare.com/turnstile/plans/ | 1 | Apr 16, 2026 | Q5 — Free: 20 widgets, unlimited verifications, 10 hostnames/widget, 7-day analytics |
| S8 | Turnstile — Validate the token (siteverify) | https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | 1 | May 5, 2026 | Q5 — siteverify endpoint, token TTL/single-use/2048 chars, params |
| S9 | SSL/TLS — HSTS | https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/ | 1 | Apr 17, 2026 | Q6 — dashboard settings, origin/transform-rule alternative, 12-month preload note |
| S10 | HSTS Preload List Submission | https://hstspreload.org/ | 1 (primary) | live | Q6 — exact preload requirements (max-age >= 31536000, includeSubDomains, preload, HTTP->HTTPS, subdomains HTTPS) |

## Credibility notes
- **Authority:** S1–S9 are first-party Cloudflare docs for the exact products in question — the highest authority for product behavior. S10 is the canonical preload submission service (operated by the Chromium team) and is the literal gate for list inclusion.
- **Currency:** All Cloudflare pages carry 2026 "last updated" stamps, well within the "late-2025-or-newer" currency requirement. hstspreload.org reflects live, enforced requirements.
- **Validation / cross-referencing:**
  - Q1 corroborated within S1 itself by two independent warnings (general SSR note + "Harden security" callout).
  - Q3 connect-src behavior corroborated across S3 (CSP) and S4 (injection modes), plus S3's own "automatic -> /cdn-cgi/rum on same domain; manual -> cloudflareinsights.com" statement.
  - Q6 preload requirements corroborated between S9 (Cloudflare's 12-month note) and S10 (the authoritative 31536000s/includeSubDomains/preload list).
- **Bias:** Cloudflare docs have a mild vendor bias (favoring their managed dashboard features), explicitly flagged where it affects the recommendation (e.g., HSTS dashboard vs code in Q6).
- **Gaps / could-not-confirm:**
  - Q4a: The Workers Rate Limiting docs do **not** print an explicit "Free plan: yes" row. The conclusion that it works on Free is inferred from the absence of any plan gate in the docs (consistent with it being a standard Workers Runtime API). Treat as high-confidence-but-not-verbatim; confirm with a `wrangler deploy` dry run on the Free account if certainty is required.
  - Google web search was blocked (captcha) during this session, so all findings rely on direct navigation to official docs — which is the preferred Tier-1 path anyway.
