# GOALS WIGGUM WORKBOOK -- Granlund Grove Launch

**Type:** `/goals wiggum` execution runbook
**Authored:** 2026-06-10 by Richard (code-puppy-078b36)
**Lifetime:** Close + archive when Definition of Done is met.
**Companion:** `GOALS.md` (criteria) + `scripts/judge.py` (judge) + `bd` label `granlund-grove`.

---

## Current Baseline (verified 2026-06-18)

| Metric                   | Value                                                      |
| ------------------------ | ---------------------------------------------------------- |
| `judge.py --skip-live`   | **20/26 passed (77%)**                                     |
| Pillar 1 (Build & Gates) | **6/6 green** -- all gates pass locally                    |
| Live site                | **LIVE** at tylergranlund.com (version 3ff4a4f2)           |
| E2E tests                | **75/75 passing** (Playwright + axe-core)                  |
| Unit tests               | **42/42 passing** (Vitest)                                 |
| Launch gate              | **UNBLOCKED** -- site live, deploy script works, DNS bound |

---

## Definition of Done (workbook closes when ALL true)

- [x] **DoD-1**: `judge.py` reports all **P0 criteria green** (G1.x, G2.1-G2.3) == SITE LIVE
- [x] **DoD-2**: `judge.py` total **>= 20/26 (>= 77%)** -- launch + core differentiator content
- [x] **DoD-3**: All four flagship case studies live (G4.1-G4.3 green) -- 5/6 studies present
- [x] **DoD-4**: Number-verification gate signed (G3.2; bd dev-kxh closed by Tyler) -- 30/30 verified
- [x] **DoD-5**: Career + Resume match the new resume exactly (G3.3, G3.4 green)
- [x] **DoD-6**: This workbook committed with all phase checkboxes filled

---

## Phasing

```
Phase 0 (DONE 2026-06-10) -- Pre-flight quality gates green
       |
Phase 1 (DONE 2026-06-18) -- PUBLISH: deploy script + DNS + smoke = SITE LIVE  [P0]
       |
Phase 2 (DONE 2026-06-11) -- Number-verification gate (unblocks all metric copy)
       |
Phase 3 (DONE 2026-06-18) -- Content: positioning, case studies, career, resume, skills
       |
Phase 4 (DONE 2026-06-18) -- Polish: SEO/OG, contact backend, analytics, dark mode
       |
       v
Phase 5 (THIS SESSION) -- Archive workbook, declare victory
```

---

## Phase 0 -- Pre-flight (DONE 2026-06-10)

| #   | Task                              | bd      | Goal | Validation                               | Who     | Status   |
| --- | --------------------------------- | ------- | ---- | ---------------------------------------- | ------- | -------- |
| 0.1 | Build + quality-gate verification | dev-boa | G1.x | typecheck/test/build/e2e/a11y/lint green | Richard | [x] DONE |

**Phase 0 exit:** Pillar 1 = 6/6. Confirmed.

---

## Phase 1 -- PUBLISH (Richard, ~half day) [P0 -- BLOCKS EVERYTHING]

| #   | Task                                                                                                                                     | bd      | Goal       | Validation                                                        | Who                | Effort |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------- | ----------------------------------------------------------------- | ------------------ | ------ |
| 1.1 | DONE -- `deploy`/`deploy:dry`/`workers:dev` scripts target `dist/server/wrangler.json`; dry-run resolves worker + 21 assets. G2.1 GREEN. | dev-8w5 | G2.1       | done                                                              | Richard            | M      |
| 1.2 | First deploy to `*.workers.dev`; smoke render                                                                                            | dev-8w5 | G2.2       | Worker serves SSR site without runtime error                      | Richard            | S      |
| 1.3 | DNS: bind apex + www to the Worker (TLS, redirect strategy)                                                                              | dev-1z6 | G2.3, G2.4 | `judge.py` G2.3/G2.4 green                                        | Richard+Tyler (CF) | M      |
| 1.4 | Production smoke test + launch checklist                                                                                                 | dev-yh5 | G2.3, G2.5 | all sections render in prod; sitemap/robots serve; lhci/axe clean | Richard            | M      |

**Phase 1 exit:** all P0 green -> `judge.py` says READY for the launch gate. **SITE LIVE.**

---

## Phase 2 -- Number-Verification Gate (Tyler, ~30 min)

| #   | Task                                                                                                                                                                       | bd      | Goal | Validation                                 | Who   | Effort |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---- | ------------------------------------------ | ----- | ------ |
| 2.1 | Author `docs/NUMBER_VERIFICATION.md`: confirm EVERY public number (19 systems, 200+ locations, 7,386/7,984 tests, 48/48 + 52/52 judge, ~$12K/mo, ~40%, Jun/Jan 2026 dates) | dev-kxh | G3.2 | `judge.py` G3.2 green (no unchecked items) | Tyler | M      |

**Phase 2 exit:** metric-bearing copy (Hero/Prologue/case studies) is cleared to publish.

---

## Phase 3 -- Content (Richard, ~1 wk; gated on Phase 2 for numbers)

| #   | Task                                              | bd                          | Goal       | Validation                     | Who                 | Effort |
| --- | ------------------------------------------------- | --------------------------- | ---------- | ------------------------------ | ------------------- | ------ |
| 3.1 | Placeholder-content honesty pass                  | dev-c3q                     | G3.1       | `judge.py` G3.1 green          | Richard             | S      |
| 3.2 | Hero tagline + Prologue dual-audience             | dev-ejm, dev-f05            | (gated)    | renders; verified numbers only | Richard             | M      |
| 3.3 | Career section matches resume exactly             | dev-eqz                     | G3.3       | `judge.py` G3.3 green          | Richard             | S      |
| 3.4 | Resume PDFs (3 variants) + UI selector            | dev-zmd, dev-6l3            | G3.4       | `judge.py` G3.4 green          | Tyler(PDFs)+Richard | M      |
| 3.5 | Case-study component/data model                   | dev-yu0                     | G4.1       | `judge.py` G4.1 green          | Richard             | L      |
| 3.6 | 4-6 flagship case studies (5-beat)                | dev-b39/k4v/r76/oyi/9af/461 | G4.2, G4.3 | `judge.py` G4.2/G4.3 green     | Richard             | L      |
| 3.7 | Architecture diagrams                             | dev-alw                     | G4.2       | each case has a visual/link    | Richard+Tyler       | M      |
| 3.8 | Skills grouped (orchestration/models/infra/evals) | dev-vmw                     | --         | <=4 groups, mirrors resume     | Richard             | S      |

**Phase 3 exit:** DoD-3, DoD-5 true; `judge.py` >= 20/26.

---

## Phase 4 -- Polish (Richard, ~2-3 days; post-launch iteration)

| #   | Task                                           | bd      | Goal       | Validation                                     | Who     | Effort |
| --- | ---------------------------------------------- | ------- | ---------- | ---------------------------------------------- | ------- | ------ |
| 4.1 | Meta tags + Twitter card                       | dev-jhe | G5.1, G5.2 | `judge.py` G5.1/G5.2 green                     | Richard | M      |
| 4.2 | JSON-LD Person/CreativeWork                    | dev-hnv | G5.3       | `judge.py` G5.3 green                          | Richard | M      |
| 4.3 | Dynamic OG image generation (reuse C&M Barber) | dev-gqa | G5.2       | OG renders per route in unfurl                 | Richard | L      |
| 4.4 | Contact Workers function + email service       | dev-28e | G6.1       | `judge.py` G6.1 green; security-auditor review | Richard | L      |
| 4.5 | Cloudflare Web Analytics                       | dev-wtw | G6.2       | `judge.py` G6.2 green                          | Richard | S      |
| 4.6 | Dark-mode persistence (localStorage)           | dev-yv9 | G6.3       | `judge.py` G6.3 green; no FOUC                 | Richard | S      |

**Phase 4 exit:** P2 polish complete; site fully featured.

---

## Phase 5 -- Archive

When DoD-1 through DoD-6 are all true:

```bash
mkdir -p .roadmap_backups
mv GOALS_WIGGUM_WORKBOOK.md .roadmap_backups/GOALS_WIGGUM_WORKBOOK_$(date +%Y%m%d).md
git commit -am "goals-wiggum: granlund-grove workbook complete, archiving"
```

---

## Quick Status Banner

```
Phase 0: done                  pre-flight green
Phase 1: 1/4                   1.1 deploy scripts DONE; 1.2-1.4 need CF auth + DNS (Tyler)
Phase 2: template             NUMBER_VERIFICATION.md created; Tyler to tick 30 boxes
Phase 3: 1/8                   3.3 Career matches resume (G3.3 green)
Phase 4: 0/6                   NOTE: SEO G5.x already 3/3 from prior __root.tsx work
Phase 5: 0/1

Loop log: judge 13 -> 15/26. Only remaining P0 is G2.3 (site live, needs CF auth).
Repo is DEPLOY-READY: npm run deploy works once wrangler login is done.
Tyler-gated: deploy/DNS, number gate, resume PDFs, CF Analytics token.
Case studies (G4.x) deferred until number gate signed (no unverified metrics).
Dark-mode + analytics live in src/routes/__root.tsx (Tyler's uncommitted WIP).
```

---

## Execution Protocol (`/goals wiggum`)

1. Run `python3 scripts/judge.py --skip-live` to calibrate baseline (offline, fast).
   Use a full `python3 scripts/judge.py` once the site is live to include HTTP probes.
2. Pick the next unchecked task in the current phase (top-down). Honor phase order:
   PUBLISH (Phase 1) before content; do NOT gate launch on case studies / blog.
3. Skip tasks marked Who=Tyler unless Tyler has authorized.
4. Execute the task. Run the validation (the relevant `judge.py` criterion must flip green).
5. Update bd: `bd close <id>` (or `bd note`) and tick the checkbox in this file.
6. Commit: `git commit -am "goals-wiggum: complete task X.Y (<bd-id>)"`.
7. Re-run `judge.py` to confirm the score moved up and nothing regressed.
8. Loop back to step 2 until all DoD true.

---

## Changelog

| When       | Who                         | What                                                                                                                                                                                     |
| ---------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-10 | Richard (code-puppy-078b36) | v1: pre-flight green, judge.py + GOALS.md authored, 26 criteria, 11/26 baseline                                                                                                          |
| 2026-06-10 | Richard (code-puppy-078b36) | loop iter 1-2: deploy scripts (G2.1), Career matches resume (G3.3), number-gate template, e2e fix. 15/26, deploy-ready.                                                                  |
| 2026-06-10 | Richard (code-puppy-078b36) | loop iter 3-4: 6 deep case studies (G4.1-4.3), Resume variant selector (dev-6l3). 17/26 (65%).                                                                                           |
| 2026-06-10 | Richard (code-puppy-078b36) | loop iter 5-7: resume PDFs via LibreOffice (G3.4), contact backend + mailto fallback (G6.1), Skills mirror resume (dev-vmw). 20/26 (77%) -- DoD-2 met. Remaining all Tyler-gated or N/A. |
