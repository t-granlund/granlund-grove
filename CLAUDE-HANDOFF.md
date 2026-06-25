# Claude Handoff — Granlund Grove (tylergranlund.com)

**For:** Claude Code (Opus 4.8, max effort)  
**Repo:** `granlund-grove` — Tyler Granlund's personal portfolio  
**Live:** https://tylergranlund.com  
**Git HEAD:** `560953f`+ on `main` — Wave 1 (Career) deployed and live on tylergranlund.com  
**Deployed version:** `fafce2cf` (Cloudflare Workers)  
**Prepared by:** Richard (code-puppy-dc6e04) on 2026-06-18 · **Refreshed by:** Richard (code-puppy-a87523) on 2026-06-25  
**Session context:** Full documentation dial-in + content accuracy fixes just completed. Repo is clean, green, deployed. Tyler wants a comprehensive review, analysis, recommendations, and next steps.

---

## TL;DR — Read This First

The site is **live, green, and deployed**. No fires. Tyler wants a strategic review of:

1. What's working well vs. what needs attention
2. Recommendations for improvements (technical, content, UX, SEO)
3. Prioritized next steps with effort estimates
4. Anything I (Richard) might have missed

**Quality baseline:** 81/81 e2e, 42/42 unit, 0 axe violations, 0 lint errors, TypeScript clean.
**Judge score:** READY — 21/26. P0 all green. Remaining 5 are 3 skipped live-checks + 2 external process gates.

---

## 0. Latest Session Updates

### 2026-06-25 — Wave 1 Career enrichment (Richard, code-puppy-a87523)

**Bottom line: Wave 1 (career) is complete, gate-green, pushed, and DEPLOYED — live on tylergranlund.com. Verified: the `/career` `<title>` now carries the pinned jobTitle in production. Exact live commit + Cloudflare version are tracked in `docs/launch/release-log.html`.**

- **What shipped (staged):**
  - `a522c8d` `feat(career)` — School of Rock ops enrichment across `careerRoles` + `careerTimeline` (help desk for 50+ corporate-owned locations / 25+ inherited in a year, security cameras, Wi-Fi, iPad fleets, COVID in-person→remote pivot, on-demand video modules + quizzes, online make-up booking; corporate + franchise, domestic + international). Mirrored into the chatbot KB (`career-sor-operations` chunk). Career intro + `careerRoles[0]` broadened to the orchestrator / cross-stakeholder / iterative-delivery / security & data-privacy / IT-debt framing.
  - `b9e040d` `fix(career)` — pinned `IT Operations & Systems Engineer` into `/career` `<title>` + og:title so the jobTitle is byte-identical across the home `<title>`, JSON-LD `jobTitle`, and chatbot KB (clears the cross-surface-consistency judge).
- **Numbers:** `NUMBER_VERIFICATION.md` row #31 checked (50+ corporate-owned, 25+ inherited/yr; Tyler-confirmed), count 30→31, status VERIFIED. iPad count + remote-conversion day count deliberately omitted (unconfirmed).
- **Gates (pre-ship):** build emits `dist/server/wrangler.json`; format/lint/typecheck clean; 42 unit + 81 e2e + 12 axe pass; `judge.py --skip-live` READY 21/26. `release-log.html` test 28/28.
- **Shipped:** pushed to `origin/main` and deployed to Cloudflare Workers; live curl sweep = all routes 200, `/ecosystem` 307, `/career` `<title>` byte-identical jobTitle confirmed live.
- **Still scoped for later (Wave 2B, do not touch yet):** displayed `∞` in `EcosystemShowcase.tsx`, hardcoded `616` in `WorkExtras`/`CodePuppyDeepDive`/`CodePuppyModal`.

### 2026-06-24 — Documentation dial-in + a11y/DRY (Richard, code-puppy-a87523)

**Bottom line: production is current and healthy. The last ship batch is fully deployed and verified. Safe to start the audit pass — nothing left to ship.**

### Git state

- **HEAD = `70265d7`**, local and `origin/main` in sync (`0 ahead / 0 behind`), working tree clean.
- The 3-commit batch (`/writing` blog, the 44-component shadcn prune, handoff doc) is now on origin. History continued past it with a11y/DRY/judge fixes through `70265d7`.
- **Deployed to Cloudflare** — live version `fafce2cf`.

### Production smoke test (verified live this session)

| Route                                                                   | Status                                    |
| ----------------------------------------------------------------------- | ----------------------------------------- |
| `/`, `/writing`, `/writing/running-it-for-200-locations-with-ai-agents` | ✅ 200                                    |
| `/work`, `/career`, `/about`, `/resume`, `/contact`                     | ✅ 200                                    |
| `/ecosystem`                                                            | ↪ 307 (intentional — folded into `/work`) |

### Quality gates

- **Build clean** — `routeTree.gen.ts` regenerated _after_ the 44-file shadcn prune; `/writing` routes intact. The prune broke nothing.
- Tests: 42 unit / 81 e2e / 12 axe — **0 axe serious/critical**.
- `judge.py` repo-local checks green; live checks no longer false-fail as P0 (`1edc661`).
- a11y: hero `<h1>` promoted across about/resume/contact/career (`bf1f362`).
- DRY: career content unified in `career-data.ts` (`bf0c461`).

### Private strategy assets (NOT in public repo)

- **`docs/launch/` is gitignored** (`00f7c00`) — job-search/outreach material stays local. Do **not** commit it.
- Inside it: rebuilt `release-log.html` (local release-notes app, reconciled against every real commit on `main`) + `release-log.test.mjs` suite — **28/28 passing** (design tokens, look & feel, commit-hash data integrity, axe a11y). Run with `node docs/launch/release-log.test.mjs`.

### Open threads

1. Cloudflare Web Analytics token — enable or skip?
2. Known SEO gap: no OG tags / canonical / favicon on some surfaces.
3. The full audit prompt below (§ rest of this doc) is the suggested next deep-dive.

---

## 1. Stack & Architecture

| Layer         | Tech                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| Framework     | TanStack Start (React Router successor)                                |
| React         | 19                                                                     |
| Build         | Vite 7 + vite-tsconfig-paths                                           |
| Styling       | Tailwind CSS 4 (CSS-first config, no JS config file)                   |
| UI primitives | shadcn/ui (customized to forest palette)                               |
| 3D / Globe    | React Three Fiber + Drei + custom GLSL shaders                         |
| Animation     | Framer Motion + GSAP ScrollTrigger (career timeline)                   |
| Fonts         | Self-hosted variable: Fraunces (display), Inter (body), JetBrains Mono |
| Deployment    | Cloudflare Workers via `npm run deploy`                                |
| Testing       | Vitest (unit), Playwright (e2e), axe-core (a11y)                       |
| Email         | Resend API + Cloudflare Email Routing                                  |
| Analytics     | Cloudflare Web Analytics (manual beacon, token not set yet)            |

### Key architectural files

- `src/lib/security-headers.ts` — CSP, HSTS, XFO, Permissions-Policy (single source of truth, wired in `server.ts`)
- `src/routes/` — TanStack file-based routing (auto-discovered)
- `src/components/site/` — All page components
- `src/lib/chatbot/` — Retrieval engine + knowledge base (bio-contact, career, projects, skills)
- `wrangler.jsonc` — Worker config
- `dist/server/wrangler.json` — Generated deploy config

---

## 2. Current State (Verified 2026-06-18)

### Routes (all serving HTTP 200)

| Route          | Purpose                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `/`            | Hero with 3D globe (22 cities, 5 continents), front-face-culled labels, bottom scrim CTA         |
| `/about`       | Bio, skills grid (6 groups), philosophy, headshot                                                |
| `/career`      | Journey timeline (5 steps, resume-style) + role cards + impact section + scroll-linked world map |
| `/work`        | 6 flagship case studies + TenantFleet ecosystem                                                  |
| `/resume`      | 3 downloadable PDF variants (Master, AI-PM, FDE)                                                 |
| `/contact`     | Contact form (honeypot), email/LinkedIn/GitHub cards                                             |
| `/ventures`    | Spruce Grove Media, Bentonville Brewing, Zipline/Walmart pilot                                   |
| `/colophon`    | Build stack, credits (robots noindex)                                                            |
| `/privacy`     | Privacy policy (robots noindex)                                                                  |
| `/sitemap.xml` | 8 URLs, valid XML, lastmod 2026-06-18                                                            |
| `/ecosystem`   | 307 redirect → `/work#ecosystem` (merged)                                                        |

### Test Matrix

| Suite            | Count    | Status                        |
| ---------------- | -------- | ----------------------------- |
| Unit (Vitest)    | 42       | ALL PASS                      |
| Architecture     | 9        | ALL PASS                      |
| E2E (Playwright) | 75       | ALL PASS                      |
| A11y (axe-core)  | 10 pages | 0 serious/critical violations |

### Lint/Type/Format

| Check      | Status                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------ |
| TypeScript | Clean (`tsc --noEmit`)                                                                     |
| ESLint     | 0 errors, 6 pre-existing warnings (fast-refresh/only-export-components in shadcn UI files) |
| Prettier   | Clean (only `docs/launch/` untracked debt, excluded)                                       |
| Build      | Clean (client + SSR)                                                                       |

---

## 3. Recent Changes (Last 7 Days — Commit Log)

### `95d7d62` — docs: comprehensive documentation dial-in

- NEW: `README.md` (root README didn't exist)
- Marked stale docs as SUPERSEDED: `BRIEFING-2025-06-25.md`, `HANDOFF.md`
- Updated `CODE-PUPPY-BRIEF.md`, `LAUNCH.md`, `LAUNCH_PUNCHLIST.md`, `GOALS_WIGGUM_WORKBOOK.md`
- Fixed `docs/NUMBER_VERIFICATION.md` stale dates (HTT Ops end → June 2026, SoR end → Jan 2022)
- Updated `docs/planning/README.md` from pre-launch state to current reality

### `e3c3a80` — fix(content): accurate career perspective

- **CareerImpactTimeline.tsx:** Compass story → "designated project lead that orchestrated the agile SDLC lifecycle"
- Adobe advocate → "sharing agile SDLC best practices with a global audience, lives in Adobe Experience Center" + Experience League source link
- North 40 migration → "unraveled contractor gatekeeping, moved to multi-year six-figure Adobe Commerce Cloud contract"
- HTT story → past tense (no longer employed); "Today I ship" → "Built and shipped"
- HTT onboarding → "Developed the identity onboarding framework... Left before full rollout; open-sourcing"
- HTT multi-agent → "Built... Developed the production pipeline... Left before full deployment; open-sourcing"
- **Career.tsx:** Same framing updates in role cards + outcome chips
- **globe/data.ts:** "Won the President's Innovation Award" → "Code Puppy won Walmart's President's Innovation Award" (attribution fix)
- **chatbot/knowledge/career.ts:** All 5 affected chunks updated with same accurate framing

### `c04676b` — feat(brand): cleaner filled tree mark + favicon set + award attribution fix

- `TreeMark.tsx`: thin stroked spruce → filled silhouette (currentColor fill 16% opacity + stroke). Chunk: 0.62 kB → 0.38 kB.
- `favicon.svg`: solid-fill with charcoal tile + cedar tree
- Regenerated all PNGs via sharp (apple-touch-icon, icon-192, icon-512, icon-512-maskable)
- New script: `scripts/generate-favicons.mjs`
- Skills/projects/career knowledge: removed award claims; clarified Tyler uses Code Puppy
- Career.tsx outcome chip: "President's Innovation Award-winning agent" → "Built with Code Puppy multi-agent system"

### `ba19bb3` — fix(content): correct HTT end date to June 2026

- Career.tsx + CareerImpactTimeline + chatbot knowledge + index.tsx: HTT Ops dates "Jan 2026 — Present" → "Jan 2026 — June 2026"
- Chatbot retrieval tuning: added fuzzy matching, multi-word boost, stopword removal, query expansion
- Award attribution clarification in knowledge base

### `e6569ad` — docs: add comprehensive co-work session briefing note

- Added `BRIEFING-2025-06-25.md` (now superseded by later commits)

---

## 4. Known Issues & Technical Debt

### P0 — None

No launch blockers. Site is live and healthy.

### P1 — Worth Addressing

1. **`judge.py` G1.4 fails in `--skip-live` mode** — E2E runner times out because `npm run test:e2e` takes >15s in the judge's subprocess. The tests PASS when run directly (75/75). The judge's `_run` helper has a 240s timeout but the regex match fails on timeout. **Recommendation:** Increase judge timeout or make E2E check smarter (parse playwright output instead of relying on exit code alone).

2. **`og-cover.jpg` is 1920×1080** — Should be 1200×630 for optimal OG sharing. Current image works but isn't ideal.

3. **`VITE_CF_BEACON_TOKEN` not set** — Cloudflare Web Analytics beacon renders `null`. No analytics until Tyler enables it in the dashboard and sets the token.

4. **Sitemap `lastmod` uses `new Date()` per request** — Should be a build-time constant for caching. Low impact (sitemap is tiny).

### P2 — Nice to Have

5. **Print stylesheet (`@media print`)** — Clean resume output when printing career page.
6. **No `/.well-known/security.txt`** — RFC-backed trust signal. File exists in `public/` but may not be serving correctly.
7. **Bundle sizes:** GlobeNetwork chunk ~941 kB (Three.js + city data). Acceptable but large.
8. **No `ECOSYSTEM_IMPLEMENTATION_PROMPT.md` integration** — Ecosystem page merged into `/work#ecosystem`, but the standalone route components still exist in `src/components/site/EcosystemPage.tsx` (unused).

### Process Debt (non-blocking)

9. **`judge.py` G7.1/G7.2 fail** — bd DB not resolvable (external dependency), 0 granlund-grove issues tracked. These are process criteria that don't affect the site.

---

## 5. Open Questions for Tyler

1. **Analytics:** Enable Cloudflare Web Analytics in dashboard → copy token → set `VITE_CF_BEACON_TOKEN` in `.cloudflare.env`?
2. **OG share card:** Draft a 1200×630 branded image? Current hero crop is suboptimal.
3. **Dashboard items** (need Cloudflare dashboard access):
   - Native rate-limit binding on `/api/contact`
   - `www→apex` Redirect Rule (already works via wrangler but dashboard rule not set)
   - Polish=Lossy+WebP, Cache Rules for `/assets/*`, `/img/*`, `/resume/*`
   - DMARC record `p=none`, Min TLS 1.2
4. **Email Routing permissions on deploy token** — Add `Email Routing (Read)` so I can audit rules via API?
5. **Content refresh cadence** — Should career dates auto-update (e.g., "June 2026 — Present" becoming "June 2026 — [current month]") or stay static until Tyler updates?

---

## 6. Architecture Deep Dive — What Claude Should Check

### A. Chatbot Knowledge Base

Location: `src/lib/chatbot/knowledge/*.ts`

The chatbot uses a simple TF-IDF-like retrieval engine (`src/lib/chatbot/engine.ts`) with:

- Fuzzy string matching via `fuse.js`-style logic (custom implementation)
- Multi-word query expansion
- Topic-based boosting
- Stopword removal
- Source attribution

**Knowledge chunks:**

- `bio-contact.ts` — Bio, contact methods, availability
- `career.ts` — 11 chunks covering Apple, School of Rock, Outdoor Cap, North 40, Head to Toe Brands
- `projects.ts` — 8 chunks covering Control Tower, Knowledge Fabric, Estate Trace, Mysa Mail, TenantFleet
- `skills.ts` — 14+ chunks covering languages, frameworks, cloud, AI/ML, security, data

**Audit recommendation:** Verify no stale claims remain. The recent content pass fixed Compass SDLC story, Adobe advocate talk, North 40 migration, and HTT exit framing. Check for any remaining inaccuracies.

### B. Security Headers

Location: `src/lib/security-headers.ts`

CSP is comprehensive but allows `'unsafe-inline'` for scripts (TanStack Start requirement). Headers include:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy` — default-src 'self', script-src 'self' 'unsafe-inline' + CF analytics, style-src 'self' 'unsafe-inline', img-src 'self' data: blob:, font-src 'self', connect-src 'self' + CF analytics

**Fitness test:** `tests/architecture/security-headers.test.ts` — validates all headers against expected values.

### C. Globe (3D)

Location: `src/components/site/globe/`

- **Data:** `data.ts` — 22 cities with lat/lng, labels, tooltips
- **Rendering:** React Three Fiber + custom shaders (atmosphere, cloud layer)
- **Labels:** Front-face culled, screen-space collision deconflicted, fade-in, capped at 9 visible
- **Accessibility:** Pauses auto-rotation under `prefers-reduced-motion`
- **Performance:** Lazy-loaded chunk (~941 kB gzipped ~255 kB)

### D. Contact API

Location: `src/routes/api/contact.ts`

- POST `/api/contact` → validates input → calls Resend
- Honeypot field (`company`, hidden, tabindex=-1)
- Rate limiting: implicit via Cloudflare (not native Workers binding yet)
- Fallback: returns `{ok: false, error: 'Email backend not configured'}` if `RESEND_API_KEY` missing
- **Confirmed live:** Resend accepting emails (tested 2026-06-18, returned `{"ok": true, "id": "..."}`)

---

## 7. What I Want Claude to Do

1. **Read the codebase** — Start with `CODE-PUPPY-BRIEF.md`, then `README.md`, then `src/routes/`, `src/components/site/`, `src/lib/`
2. **Run the gates** — `npm run test:all`, `npm run lint`, `npm run typecheck`, `python3 scripts/judge.py --skip-live`
3. **Audit for issues I missed** — Content accuracy, accessibility, performance, security, SEO
4. **Provide recommendations** — Prioritized by impact/effort. Be opinionated. Challenge any assumptions.
5. **Suggest next steps** — What should Tyler focus on next? What's the highest-ROI improvement?

---

## 8. Quick Start for Claude

```bash
# Verify state
git status                    # should be clean (docs/launch/ untracked is OK)
git log --oneline -5          # confirm 70265d7 is HEAD

# Run gates
npm run test:all              # ~90s: typecheck + 42 unit + 81 e2e
npm run lint                  # 0 errors expected
npm run typecheck             # clean expected
python3 scripts/judge.py --skip-live   # READY, 21/26 expected

# Build
npm run build                 # should complete clean

# Deploy (if needed)
source .cloudflare.env && npm run deploy
```

---

## 9. Key Metrics Snapshot

| Metric               | Value                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| Deployed version     | `fafce2cf`                                                              |
| Git HEAD             | `70265d7`                                                               |
| Judge score          | READY — 21/26 (5 remaining: 3 skipped live-checks + 2 process gates)    |
| Unit tests           | 42/42                                                                   |
| E2E tests            | 81/81                                                                   |
| A11y violations      | 0                                                                       |
| Lint errors          | 0                                                                       |
| TypeScript           | Clean                                                                   |
| Build                | Clean                                                                   |
| Bundle size (client) | ~1.36 MB total (TreeMark 0.38 kB, career 31.94 kB, GlobeNetwork 941 kB) |
| Country count        | 14 (verified across all pages)                                          |
| City count           | 22 (globe data)                                                         |

---

_End of handoff. Baseline verified 2026-06-18 by Richard (code-puppy-dc6e04); metrics refreshed 2026-06-24 by Richard (code-puppy-a87523)._
