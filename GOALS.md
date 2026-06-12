# Granlund Grove (tylergranlund.com) -- Launch Readiness Goals

> **Single source of truth for "can we ship / are we differentiated?"**
> Evaluated by `scripts/judge.py` -- objective criteria, no hand-waving.
> Last updated: 2026-06-10 (Richard, code-puppy-078b36)
>
> **The P0 north star:** drive every P0 criterion to green == the site is LIVE
> behind the domain. Until then the judge reports LAUNCH BLOCKED, which is
> correct -- an unresolving portfolio URL on a resume is worse than none.
>
> Plan of attack tracked in `bd` under label `granlund-grove` (meta-epic
> `dev-679`). Source plan: `career-package-2026-06/Granlund-Grove-Enhancement-Plan.md`.

---

## Scoring

| Symbol | Meaning                         |
| ------ | ------------------------------- |
| PASS   | Criterion met, no action needed |
| FAIL   | Criterion not met               |

**Launch gate rule:** All P0 criteria must PASS. No more than 2 P1 criteria may
FAIL. P2 are polish (post-launch iteration), not gating.

Two check classes: **repo-local** (always runnable, offline) and **live-site**
(HTTP probes against the domain -- fail until shipped).

---

## Pillar 1: Build & Quality Gates (repo-local)

| ID   | Criterion                            | Severity | How Verified                                  |
| ---- | ------------------------------------ | -------- | --------------------------------------------- |
| G1.1 | TypeScript typecheck clean           | P0       | `npm run typecheck`                           |
| G1.2 | Unit tests pass                      | P0       | `npm run test` (vitest)                       |
| G1.3 | Build OK + Workers output emitted    | P0       | `npm run build` + `dist/server/wrangler.json` |
| G1.4 | E2E tests pass                       | P0       | `npm run test:e2e` (Playwright)               |
| G1.5 | A11y axe clean (no serious/critical) | P0       | `npm run test:a11y`                           |
| G1.6 | Lint: 0 errors                       | P1       | `npm run lint`                                |

## Pillar 2: Deploy Readiness (P0 = the publish blocker)

| ID   | Criterion                                 | Severity | How Verified                                      |
| ---- | ----------------------------------------- | -------- | ------------------------------------------------- |
| G2.1 | `deploy` script present (wrangler deploy) | P0       | `package.json` scripts                            |
| G2.2 | wrangler config complete                  | P0       | `wrangler.jsonc` (name/main/compat/nodejs_compat) |
| G2.3 | `tylergranlund.com` returns 200           | P0       | HTTP probe (live)                                 |
| G2.4 | `www` resolves/redirects                  | P1       | HTTP probe (live)                                 |
| G2.5 | `sitemap.xml` + `robots.txt` live         | P1       | HTTP probe (live)                                 |

## Pillar 3: Content Integrity

| ID   | Criterion                           | Severity | How Verified                                       |
| ---- | ----------------------------------- | -------- | -------------------------------------------------- |
| G3.1 | No placeholder/template copy in src | P1       | grep src                                           |
| G3.2 | Number-verification gate signed     | P1       | `docs/NUMBER_VERIFICATION.md` (no unchecked items) |
| G3.3 | Career section matches new resume   | P1       | grep `Career.tsx` for 4 roles                      |
| G3.4 | Resume PDFs hosted (3 variants)     | P1       | `public/*.pdf` master/AI-PM/FDE                    |

## Pillar 4: Case Studies (the differentiator)

| ID   | Criterion                                            | Severity | How Verified         |
| ---- | ---------------------------------------------------- | -------- | -------------------- |
| G4.1 | Structured, content-driven case-study model          | P1       | `Projects.tsx` shape |
| G4.2 | >= 4 flagship case studies present                   | P1       | grep `Projects.tsx`  |
| G4.3 | 5-beat narrative present (Problem->Arch->Outcome...) | P1       | grep `Projects.tsx`  |

## Pillar 5: SEO / Open Graph / Structured Data

| ID   | Criterion                    | Severity | How Verified    |
| ---- | ---------------------------- | -------- | --------------- |
| G5.1 | Meta description + canonical | P2       | grep src head() |
| G5.2 | OG + Twitter card tags       | P2       | grep src        |
| G5.3 | JSON-LD Person schema        | P2       | grep src        |

## Pillar 6: Functionality

| ID   | Criterion                            | Severity | How Verified                |
| ---- | ------------------------------------ | -------- | --------------------------- |
| G6.1 | Contact backend (not mailto-only)    | P2       | `Contact.tsx` + Workers fn  |
| G6.2 | Analytics snippet present            | P2       | grep src (CF Web Analytics) |
| G6.3 | Dark-mode persistence (localStorage) | P2       | grep src                    |

## Pillar 7: Process

| ID   | Criterion                     | Severity | How Verified                 |
| ---- | ----------------------------- | -------- | ---------------------------- |
| G7.1 | No bd dependency cycles       | P1       | `bd dep cycles`              |
| G7.2 | granlund-grove issues tracked | P2       | `bd count -l granlund-grove` |

---

## Current Verdict

Run `python3 scripts/judge.py` (or `--skip-live` for offline) for live evaluation.

**Loop progress 2026-06-10 (Richard, code-puppy-078b36):**

- Judge: **20/26 passed (77%)** (up from 11/26 baseline). Workbook DoD-2 met.
- GREEN: Pillar 1 build-gates (6/6), G2.1 deploy script (dry-run validated),
  Content G3.1/G3.3/G3.4, Case Studies (3/3, 6 flagship 5-beat cases), SEO
  (3/3), Contact backend G6.1, Process (2/2). Skills now mirror the resume.
- **Only remaining P0: G2.3 (site live).** Repo is DEPLOY-READY; needs
  `wrangler login` + `npm run deploy` + DNS. G3.2 is the only remaining P1
  fail (within the gate's max-2 rule), so the gate flips to READY on deploy.
- Remaining (all Tyler-gated or N/A): deploy/DNS (G2.3-2.5); number gate
  (G3.2, tick docs/NUMBER_VERIFICATION.md); CF Analytics (G6.2, enable in
  the Cloudflare dashboard -- no code needed); dark-mode (G6.3 -- the site is
  dark-only by design, so there is nothing to persist without a light theme).
- Deferred: case-study architecture diagrams (dev-alw, needs design assets);
  contact email delivery needs `wrangler secret put RESEND_API_KEY`.

---

## Issue <-> Goal Mapping

| bd Issue                    | Pri | Goal Criterion(s) | Status | Action                                                          |
| --------------------------- | --- | ----------------- | ------ | --------------------------------------------------------------- |
| dev-boa                     | P0  | G1.1-G1.6         | closed | Pre-flight gates green                                          |
| dev-8w5                     | P0  | G2.1, G2.2        | open   | Add `deploy` script + point at built Workers entry              |
| dev-1z6                     | P0  | G2.3, G2.4        | open   | DNS apex + www binding                                          |
| dev-yh5                     | P0  | G2.3, G2.5        | open   | Prod smoke test = SITE LIVE milestone                           |
| dev-c3q                     | P1  | G3.1              | open   | Placeholder-content honesty pass                                |
| dev-kxh                     | P1  | G3.2              | open   | Tyler: number-verification gate (author NUMBER_VERIFICATION.md) |
| dev-ejm                     | P1  | (G3.2 gated)      | open   | Hero tagline (verified numbers only)                            |
| dev-f05                     | P1  | (G3.2 gated)      | open   | Prologue dual-audience narrative                                |
| dev-eqz                     | P1  | G3.3              | open   | Career section matches resume                                   |
| dev-zmd                     | P1  | G3.4              | open   | Tyler: supply 3 resume PDFs to public/                          |
| dev-6l3                     | P1  | G3.4              | open   | Resume UI: default master + variant selector                    |
| dev-yu0                     | P1  | G4.1              | open   | Case-study component/data model                                 |
| dev-b39/k4v/r76/oyi/9af/461 | P1  | G4.2, G4.3        | open   | 6 flagship case studies (gated on dev-kxh)                      |
| dev-alw                     | P2  | G4.2              | open   | Architecture diagrams                                           |
| dev-jhe                     | P2  | G5.1, G5.2        | open   | Meta tags + Twitter card                                        |
| dev-hnv                     | P2  | G5.3              | open   | JSON-LD Person/CreativeWork                                     |
| dev-gqa                     | P2  | G5.2              | open   | Dynamic OG image generation                                     |
| dev-28e                     | P2  | G6.1              | open   | Contact Workers function + email service                        |
| dev-wtw                     | P3  | G6.2              | open   | Cloudflare Web Analytics                                        |
| dev-yv9                     | P3  | G6.3              | open   | Dark-mode persistence                                           |
| dev-vmw                     | P2  | (Skills)          | open   | Group skills by orchestration/models/infra/evals                |
| dev-0lf                     | P4  | (deferred)        | open   | MDX blog -- do NOT gate launch                                  |
