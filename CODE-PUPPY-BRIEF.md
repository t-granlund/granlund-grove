# Brief for Code Puppy — granlund-grove (tylergranlund.com)

Paste this into a Code Puppy session working in `03-personal/granlund-grove/`.
Written 2026-06-12; last updated 2026-06-18 by Richard (code-puppy-dc6e04).
Treat as authoritative for this folder.

---

## What this repo is

Tyler's personal site, **live at tylergranlund.com**. TanStack Start + Vite +
React 19, shadcn/ui, SSR on **Cloudflare Workers** (worker: `granlund-grove`,
config `wrangler.jsonc`, deploy via `npm run deploy`). Domain: apex
`tylergranlund.com` is canonical, `www` → apex 301. Positioning truth everywhere
(title/meta/OG/JSON-LD/copy): **"IT Operations & Systems Engineer" / "HTT
Brands"** — never reintroduce older titles.

## Current state (verify with `git status` before starting)

- Punchlist P0/P1 `[code]` items: **done** (see `LAUNCH_PUNCHLIST.md`).
- Site is **live and deployed** — version `3ff4a4f2` as of 2026-06-18.
- No uncommitted work in flight. Tree is clean on main (`e3c3a80`).

## Quality gates — every change ends with these passing

```bash
npm run test:all          # typecheck + vitest (42) + Playwright e2e/a11y (75)
npm run format:check && npm run lint
python3 scripts/judge.py --skip-live   # repo-only readiness, baseline 20/26
```

Lighthouse CI (`npm run lhci`) for anything touching layout, images, or fonts.
New images follow the established `<picture>` AVIF/WebP + srcset pattern, with
attribution in `public/img/CREDITS.md`.

## Hard rules

1. **Number gate:** nothing ships with an unverified metric. All numbers in
   Hero/Prologue/case studies trace to `docs/NUMBER_VERIFICATION.md`; if you
   change a number, update that doc; status line must read `VERIFIED` before
   anything goes public.
2. **Security headers single source of truth** = `src/lib/security-headers.ts`
   wired in `server.ts` (NOT `public/_headers`). Any header change must keep the
   header fitness test green.
3. **No deploys / no Cloudflare dashboard assumptions.** Anything marked
   `[Tyler]` in `LAUNCH_PUNCHLIST.md` needs his account (wrangler login, Resend
   key, DMARC, redirect/cache rules). Stop and surface those instead of
   attempting them. `npm run deploy:dry` is the only deploy-shaped command
   you run.
4. **YAGNI list is binding** (bottom of `LAUNCH_PUNCHLIST.md`): no nonce CSP,
   Turnstile, KV rate limiting, SRI, COOP/COEP, light mode, edge-cached SSR —
   do not add "enterprise theater" unprompted.
5. Design system: Fraunces (display/H1, preloaded) + existing tokens. Job-scout
   dashboard inherits this system 1:1 — if you change tokens here, note that
   downstream dependency in the commit message.

## Backlog, in priority order

1. P2 `[code]` items: print stylesheet (`@media print` — clean resume output),
   sitemap `lastmod` as build-time constant (currently `new Date()` per request).
2. **Draft the 1200×630 branded OG share card** (current `og-cover.jpg` is the
   1920×1080 hero — wrong dims). Produce the asset + wire `og:image`; Tyler
   approves before it ships.
3. **Cloudflare dashboard items** (need Tyler's account):
   - Native rate-limit binding on `/api/contact`
   - `www→apex` Redirect Rule, Polish=Lossy+WebP, Cache Rules `/assets/*` `/img/*` `/resume/*`
   - DMARC record `p=none`, Min TLS 1.2, Auto HTTPS Rewrites
4. Keep `judge.py --skip-live` ≥ 20/26; raise it where cheap.
5. **Analytics:** Cloudflare Web Analytics token (`VITE_CF_BEACON_TOKEN`) not
   yet set — beacon renders null until Tyler enables it in the dashboard.

## Reference docs in-repo

`LAUNCH.md` (runbook, the [Tyler] dashboard steps), `LAUNCH_PUNCHLIST.md`
(architect-reviewed, [code]/[Tyler] split), `GOALS.md` + `GOALS_WIGGUM_WORKBOOK.md`
(intent/voice), `docs/NUMBER_VERIFICATION.md` (claims gate),
`docs/planning/`, `docs/research/`.
