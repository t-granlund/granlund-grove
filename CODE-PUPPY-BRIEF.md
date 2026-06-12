# Brief for Code Puppy — granlund-grove (tylergranlund.com)

Paste this into a Code Puppy session working in `03-personal/granlund-grove/`.
Written 2026-06-12 by Tyler's Cowork session after a full repo review. Treat as
authoritative for this folder.

---

## What this repo is

Tyler's personal site, **deploy-ready**, mid-launch. TanStack Start + Vite +
React, shadcn/Radix UI, SSR on **Cloudflare Workers** (worker: `granlund-grove`,
config `wrangler.jsonc`, deploy via `npm run deploy`). Domain: apex
`tylergranlund.com` is canonical, `www` → apex 301. Positioning truth everywhere
(title/meta/OG/JSON-LD/copy): **"IT Operations & Systems Engineer" / "HTT
Brands"** — never reintroduce older titles.

## Current state (verify with `git status` before starting)

- Punchlist P0/P1 `[code]` items: **done** (see `LAUNCH_PUNCHLIST.md`).
- **Uncommitted work in flight:** visual polish pass touching
  `src/components/site/Nav.tsx`, `Projects.tsx`, `src/routes/index.tsx`,
  `src/styles.css`, `tests/unit/content.test.tsx`, plus new untracked assets
  `public/img/lake-1280.{avif,jpg,webp}` and `public/img/CREDITS.md`, and edits
  to `docs/NUMBER_VERIFICATION.md`. **First job of any session: get this to a
  green, committed state** — don't start new work on top of a dirty tree.

## Quality gates — every change ends with these passing

```bash
npm run test:all          # typecheck + vitest (23) + Playwright e2e/a11y (13)
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

1. **Land the in-flight polish pass** (commit, gates green).
2. P2 `[code]` items: print stylesheet (`@media print` — clean resume output),
   `/.well-known/security.txt`, sitemap `lastmod` as build-time constant
   (currently `new Date()` per request).
3. **Draft the 1200×630 branded OG share card** (current `og-cover.jpg` is the
   1920×1080 hero — wrong dims). Produce the asset + wire `og:image`; Tyler
   approves before it ships.
4. Keep `judge.py --skip-live` ≥ 20/26; raise it where cheap.

## Reference docs in-repo

`LAUNCH.md` (runbook, the [Tyler] dashboard steps), `LAUNCH_PUNCHLIST.md`
(architect-reviewed, [code]/[Tyler] split), `GOALS.md` + `GOALS_WIGGUM_WORKBOOK.md`
(intent/voice), `docs/NUMBER_VERIFICATION.md` (claims gate),
`docs/planning/`, `docs/research/`.
