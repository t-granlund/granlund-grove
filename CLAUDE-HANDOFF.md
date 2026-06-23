# Claude Handoff — Granlund Grove (tylergranlund.com)

**For:** Claude Code (Opus 4.8, max effort)  
**Repo:** `granlund-grove` — Tyler Granlund's personal portfolio  
**Live:** https://tylergranlund.com  
**Git HEAD:** `95d7d62` on `main`  
**Deployed version:** `3ff4a4f2` (Cloudflare Workers)  
**Prepared by:** Richard (code-puppy-dc6e04) on 2026-06-18  
**Session context:** Full documentation dial-in + content accuracy fixes just completed. Repo is clean, green, deployed. Tyler wants a comprehensive review, analysis, recommendations, and next steps.

---

## TL;DR — Read This First

The site is **live, green, and deployed**. No fires. Tyler wants a strategic review of:
1. What's working well vs. what needs attention
2. Recommendations for improvements (technical, content, UX, SEO)
3. Prioritized next steps with effort estimates
4. Anything I (Richard) might have missed

**Quality baseline:** 75/75 e2e, 42/42 unit, 0 axe violations, 0 lint errors, TypeScript clean.
**Judge score:** 20/26 (77%). P0 all green. Remaining 6 are P1/P2 (live-site probes, process criteria).

---

## 1. Stack & Architecture

| Layer | Tech |
|---|---|
| Framework | TanStack Start (React Router successor) |
| React | 19 |
| Build | Vite 7 + vite-tsconfig-paths |
| Styling | Tailwind CSS 4 (CSS-first config, no JS config file) |
| UI primitives | shadcn/ui (customized to forest palette) |
| 3D / Globe | React Three Fiber + Drei + custom GLSL shaders |
| Animation | Framer Motion + GSAP ScrollTrigger (career timeline) |
| Fonts | Self-hosted variable: Fraunces (display), Inter (body), JetBrains Mono |
| Deployment | Cloudflare Workers via `npm run deploy` |
| Testing | Vitest (unit), Playwright (e2e), axe-core (a11y) |
| Email | Resend API + Cloudflare Email Routing |
| Analytics | Cloudflare Web Analytics (manual beacon, token not set yet) |

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
| Route | Purpose |
|---|---|
| `/` | Hero with 3D globe (22 cities, 5 continents), front-face-culled labels, bottom scrim CTA |
| `/about` | Bio, skills grid (6 groups), philosophy, headshot |
| `/career` | Journey timeline (5 steps, resume-style) + role cards + impact section + scroll-linked world map |
| `/work` | 6 flagship case studies + TenantFleet ecosystem |
| `/resume` | 3 downloadable PDF variants (Master, AI-PM, FDE) |
| `/contact` | Contact form (honeypot), email/LinkedIn/GitHub cards |
| `/ventures` | Spruce Grove Media, Bentonville Brewing, Zipline/Walmart pilot |
| `/colophon` | Build stack, credits (robots noindex) |
| `/privacy` | Privacy policy (robots noindex) |
| `/sitemap.xml` | 8 URLs, valid XML, lastmod 2026-06-18 |
| `/ecosystem` | 307 redirect → `/work#ecosystem` (merged) |

### Test Matrix
| Suite | Count | Status |
|---|---|---|
| Unit (Vitest) | 42 | ALL PASS |
| Architecture | 9 | ALL PASS |
| E2E (Playwright) | 75 | ALL PASS |
| A11y (axe-core) | 10 pages | 0 serious/critical violations |

### Lint/Type/Format
| Check | Status |
|---|---|
| TypeScript | Clean (`tsc --noEmit`) |
| ESLint | 0 errors, 6 pre-existing warnings (fast-refresh/only-export-components in shadcn UI files) |
| Prettier | Clean (only `docs/launch/` untracked debt, excluded) |
| Build | Clean (client + SSR) |

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
git log --oneline -5          # confirm 95d7d62 is HEAD

# Run gates
npm run test:all              # ~90s: typecheck + 42 unit + 75 e2e
npm run lint                  # 0 errors expected
npm run typecheck             # clean expected
python3 scripts/judge.py --skip-live   # 20/26 expected

# Build
npm run build                 # should complete clean

# Deploy (if needed)
source .cloudflare.env && npm run deploy
```

---

## 9. Key Metrics Snapshot

| Metric | Value |
|---|---|
| Deployed version | `3ff4a4f2` |
| Git HEAD | `95d7d62` |
| Judge score | 20/26 (77%) |
| Unit tests | 42/42 |
| E2E tests | 75/75 |
| A11y violations | 0 |
| Lint errors | 0 |
| TypeScript | Clean |
| Build | Clean |
| Bundle size (client) | ~1.36 MB total (TreeMark 0.38 kB, career 31.94 kB, GlobeNetwork 941 kB) |
| Country count | 14 (verified across all pages) |
| City count | 22 (globe data) |

---

*End of handoff. Everything above was verified on 2026-06-18 by Richard (code-puppy-dc6e04).*
