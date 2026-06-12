# Backlog

Implementation-ready BDS tickets. Keep ticket IDs stable. If scope changes, edit the ticket; do not renumber the universe like a chaos raccoon.

## BDS-001 — Test harness baseline

- **Priority:** P0
- **Phase:** 1 — Foundations and quality gates
- **Dependencies:** None
- **Affected files:** `package.json`, lockfile, test config files, `tests/**`, `src/**` only as needed for testability
- **Acceptance criteria:**
  - Unit/component test runner is installed and configured for React 19/TanStack Start/Vite.
  - E2E runner is installed and can exercise `/`, `/privacy`, and `/sitemap.xml` locally.
  - Accessibility scan helper is available for E2E tests.
  - Test commands are documented and runnable by CI.
  - Initial smoke tests pass against existing routes without changing product behavior.
- **E2E/QA requirements:**
  - Verify `/` renders main landmark and expected page title/hero content.
  - Verify `/privacy` renders main landmark and privacy heading.
  - Verify `/sitemap.xml` returns XML and includes current public routes.
  - Run automated accessibility scan on `/` and `/privacy` with no serious/critical violations unless documented.
- **Risk:** Tooling friction with TanStack Start SSR/Workers environment; avoid brittle selectors.
- **Done evidence:** Implemented initial harness locally by `code-puppy-ea0a9f` on 2026-05-21. Added Vitest, Playwright, axe helper, architecture tests, and smoke/a11y E2E coverage. Verified: `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`, `npm run format:check`, and `npm run lint` all pass locally; lint has existing shadcn fast-refresh warnings only.

## BDS-002 — CI quality gates

- **Priority:** P0
- **Phase:** 1 — Foundations and quality gates
- **Dependencies:** `BDS-001`
- **Affected files:** `.github/workflows/**` or equivalent CI config, `package.json`, lockfile, test reports config
- **Acceptance criteria:**
  - CI runs install, format/check if available, lint, typecheck, build, unit/component tests, E2E smoke tests, and accessibility scans.
  - CI fails on test failures, type errors, lint failures, and build failures.
  - CI stores useful artifacts for E2E failures: screenshots, traces, and HTML reports where supported.
  - CI commands match local documented commands.
- **E2E/QA requirements:**
  - Confirm CI validates `/`, `/privacy`, and `/sitemap.xml` from `BDS-001`.
  - Confirm failure artifacts are created by intentionally inspecting a failed dry run or documented CI sample.
- **Risk:** CI runtime can become slow/noisy; cache dependencies and browsers responsibly.
- **Done evidence:** Added `.github/workflows/quality.yml` by `code-puppy-ea0a9f` on 2026-05-21. Workflow runs npm ci, format check, lint, typecheck, unit/architecture tests, build, Chromium install, and E2E/a11y smoke tests with Playwright artifacts. First remote green run still pending after push.

## BDS-003 — Manual WCAG 2.2 checklist and release QA protocol

- **Priority:** P0
- **Phase:** 1 — Foundations and quality gates
- **Dependencies:** None
- **Affected files:** `docs/planning/testing-strategy.md`, PR template/release checklist if introduced
- **Acceptance criteria:**
  - Manual WCAG 2.2 AA checklist exists for every UI PR/release.
  - Checklist explicitly covers focus not obscured, focus appearance, target size, consistent help, redundant entry, accessible authentication, keyboard order, screen-reader semantics, and reduced motion.
  - Browser/device matrix is documented: desktop Chromium/Firefox/Safari where feasible, iOS Safari/VoiceOver, Android/TalkBack where feasible.
  - QA protocol names evidence to capture before release.
- **E2E/QA requirements:**
  - Manually walk current `/` and `/privacy` with keyboard only.
  - Verify skip link lands at main content and sticky UI does not obscure focused anchors.
  - Verify OS-level reduced motion does not hide essential content.
- **Risk:** Manual QA gets skipped when velocity pressure appears; keep checklist short enough to use.
- **Done evidence:** Manual checklist lives in `docs/planning/testing-strategy.md`. First full manual device/screen-reader audit remains pending; automated axe smoke checks pass for `/` and `/privacy`.

## BDS-004 — Architecture fitness checks

- **Priority:** P0
- **Phase:** 1 — Foundations and quality gates
- **Dependencies:** `BDS-001`
- **Affected files:** `tests/architecture/**`, scripts/config as needed
- **Acceptance criteria:**
  - Fitness checks run in CI and locally.
  - Checks verify planning files exist, known route inventory is intentional, source files stay under agreed size thresholds, and CSP posture is inspected.
  - Checks are pragmatic and low-flake; no AST cathedral unless needed.
  - Failing checks provide clear remediation messages.
- **E2E/QA requirements:**
  - CI proves architecture checks run.
  - Document how to update checks when routes or content models expand.
- **Risk:** Overzealous checks block harmless refactors; keep checks focused on architectural invariants.
- **Done evidence:** Implemented `tests/architecture/fitness.test.ts` by `code-puppy-ea0a9f` on 2026-05-21. Verified via `npm run test` with 3 passing architecture checks.

## BDS-005 — Git-native content layer and schemas

- **Priority:** P0
- **Phase:** 2 — Content architecture and core route expansion
- **Dependencies:** `BDS-001`, `BDS-002`, `BDS-004`
- **Affected files:** content directory, content config, route loaders, type definitions, tests
- **Acceptance criteria:**
  - File-based content source of truth exists for writing, case studies, projects/impact, and career/proof data.
  - Schemas validate required fields, dates, slugs, drafts, redaction/confidentiality flags, SEO metadata, and provenance for impact metrics.
  - Build/test fails on invalid content.
  - Existing homepage content can either read from the content layer or has a documented migration path.
- **E2E/QA requirements:**
  - Test valid content renders through at least one route or fixture.
  - Test draft/private/confidential content is not publicly reachable.
  - Test invalid fixture/schema failure in unit or architecture checks.
- **Risk:** Content tooling can complicate Workers builds; prefer build-time output and no runtime DB for read-mostly content.
- **Done evidence:** Pending. Record schema summary and validation command output.

## BDS-006 — Case studies route family

- **Priority:** P0
- **Phase:** 2 — Content architecture and core route expansion
- **Dependencies:** `BDS-005`
- **Affected files:** `src/routes/case-studies/**`, content case studies, metadata helpers, tests
- **Acceptance criteria:**
  - `/case-studies` index lists public case studies.
  - `/case-studies/[slug]` renders confidential-safe studies with problem, constraints, Tyler's role, architecture/operating model, impact, lessons, stack, and redaction notes.
  - Launch content includes 2–3 credible case studies or explicitly marked drafts hidden from production.
  - Pages include canonical metadata and share-friendly descriptions.
- **E2E/QA requirements:**
  - E2E covers index, one detail page, missing slug 404, keyboard navigation, and automated accessibility scan.
  - Manual QA verifies claims are confidential-safe and not client-sensitive.
- **Risk:** Weak/vague case studies hurt credibility more than no case studies; content quality gate matters.
- **Done evidence:** Pending. Record public slugs and QA reviewer sign-off.

## BDS-007 — Writing route family

- **Priority:** P0
- **Phase:** 2 — Content architecture and core route expansion
- **Dependencies:** `BDS-005`
- **Affected files:** `src/routes/writing/**`, writing content, RSS/feed helpers if added, tests
- **Acceptance criteria:**
  - `/writing` index lists public essays with title, date, excerpt, tags, and reading time if available.
  - `/writing/[slug]` renders durable essays with semantic headings and metadata.
  - Launch content includes at least 3 essays or draft-hidden placeholders with no production leakage.
  - Drafts are excluded from sitemap/feed/public index.
- **E2E/QA requirements:**
  - E2E covers index, one detail page, missing slug 404, headings, and accessibility scan.
  - Manual QA verifies typography readability, link states, and code block accessibility if present.
- **Risk:** Empty writing section feels performative; ship only when real content exists.
- **Done evidence:** Pending. Record public slugs and feed/sitemap inclusion status.

## BDS-008 — Colophon route

- **Priority:** P0
- **Phase:** 2 — Content architecture and core route expansion
- **Dependencies:** `BDS-001`
- **Affected files:** `src/routes/colophon.*`, route navigation/footer links, tests
- **Acceptance criteria:**
  - `/colophon` documents stack, accessibility posture, performance budget, privacy/GPC behavior, typography, hosting, image provenance, and credits.
  - Colophon links to privacy page, security contact route/file if present, and source/project references where appropriate.
  - Content is plain-English and accurate.
- **E2E/QA requirements:**
  - E2E verifies route status, main heading, key trust statements, and footer/nav discoverability.
  - Accessibility scan has no serious/critical violations.
- **Risk:** Colophon can drift from reality; add update reminder to release checklist.
- **Done evidence:** Pending. Record route URL and reviewed statements.

## BDS-009 — Sitemap and metadata expansion

- **Priority:** P0
- **Phase:** 2 — Content architecture and core route expansion
- **Dependencies:** `BDS-006`, `BDS-007`, `BDS-008`
- **Affected files:** sitemap route, metadata utilities, route definitions, tests
- **Acceptance criteria:**
  - `/sitemap.xml` includes all public canonical routes and excludes drafts/private/confidential items.
  - Metadata helpers produce title, description, canonical URL, and Open Graph/Twitter metadata for core routes.
  - Route additions are covered by tests so sitemap drift is caught.
- **E2E/QA requirements:**
  - E2E verifies sitemap XML includes `/`, `/privacy`, `/colophon`, public case studies, and public writing.
  - E2E verifies draft/confidential slugs are absent.
- **Risk:** Dynamic route discovery can become fragile; prefer content schema-driven sitemap generation.
- **Done evidence:** Pending. Record route inventory and sitemap test output.

## BDS-010 — CSP hardening plan and nonce-safe scripts

- **Priority:** P0
- **Phase:** 3 — Trust, security, and privacy posture
- **Dependencies:** `BDS-001`, `BDS-002`, `BDS-004`
- **Affected files:** `public/_headers`, server/render entry points, any inline scripts/styles, tests
- **Acceptance criteria:**
  - Inventory current need for `script-src 'unsafe-inline'` and document framework/runtime constraints.
  - Implement a path to remove unsafe inline scripts using nonces, hashes, or script extraction as appropriate.
  - CSP remains compatible with TanStack Start, Vite output, Cloudflare Workers, and any analytics/error tooling.
  - Security headers are covered by tests or architecture checks.
- **E2E/QA requirements:**
  - E2E validates primary routes still hydrate and navigate under hardened CSP.
  - Header test verifies `script-src` does not include `'unsafe-inline'` once implementation lands.
- **Risk:** Breaking hydration or route transitions; stage carefully and test production-like build output.
- **Done evidence:** Pending. Record before/after CSP and hydration smoke results.

## BDS-011 — Global Privacy Control handling

- **Priority:** P0
- **Phase:** 3 — Trust, security, and privacy posture
- **Dependencies:** `BDS-001`
- **Affected files:** server request handling, analytics loader, privacy/colophon content, tests
- **Acceptance criteria:**
  - Requests with `Sec-GPC: 1` suppress optional analytics and sale/share-like tracking.
  - Behavior is documented on `/privacy` and `/colophon`.
  - GPC state does not require cookies to function.
- **E2E/QA requirements:**
  - E2E or integration test sends `Sec-GPC: 1` and verifies analytics script/loader is absent.
  - E2E verifies normal request behavior still renders the site.
- **Risk:** GPC logic can be bypassed by client-only analytics loading; gate analytics server-side or via loader data.
- **Done evidence:** Pending. Record GPC test output and docs links.

## BDS-012 — Security.txt trust surface

- **Priority:** P0
- **Phase:** 3 — Trust, security, and privacy posture
- **Dependencies:** `BDS-001`
- **Affected files:** `public/.well-known/security.txt` or route equivalent, tests, footer/colophon link if used
- **Acceptance criteria:**
  - `/.well-known/security.txt` follows RFC 9116 conventions with Contact, Expires, Preferred-Languages, and Canonical fields.
  - Expiry is set no more than one year out and has a maintenance reminder.
  - Contact method is safe to publish.
- **E2E/QA requirements:**
  - E2E verifies file returns 200 text/plain at `/.well-known/security.txt`.
  - Manual QA verifies contact and canonical URL are correct.
- **Risk:** Stale expiry undermines trust; add release/quarterly reminder.
- **Done evidence:** Pending. Record served URL and expiry date.

## BDS-013 — Privacy page trust update

- **Priority:** P0
- **Phase:** 3 — Trust, security, and privacy posture
- **Dependencies:** `BDS-011`, `BDS-020` if analytics is included
- **Affected files:** privacy route/content, footer trust copy, tests
- **Acceptance criteria:**
  - `/privacy` clearly states cookie usage, analytics behavior, GPC handling, data retention, contact method, and third-party services.
  - Footer trust copy reflects reality, e.g. no cookies/GPC honored/security contact available only when true.
  - Claims match implemented behavior.
- **E2E/QA requirements:**
  - E2E verifies privacy route includes GPC and analytics/cookie statements.
  - Manual QA verifies plain-English readability and no misleading claims.
- **Risk:** Legal/trust copy can overpromise; keep statements factual and narrow.
- **Done evidence:** Pending. Record reviewed copy and implementation links.

## BDS-014 — Design token and typography refinement

- **Priority:** P1
- **Phase:** 4 — Design, motion, and interaction craft
- **Dependencies:** `BDS-003`
- **Affected files:** global CSS/theme tokens, typography utilities, component styles, visual tests if present
- **Acceptance criteria:**
  - Fluid type scale is defined with readable min/max sizes.
  - OKLCH color tokens preserve WCAG 2.2 AA contrast; body text aims AAA where feasible.
  - Focus styles have strong contrast and visible area across dark, glass, image, and cedar surfaces.
  - Tabular numerals are used for metrics/stats where applicable.
- **E2E/QA requirements:**
  - Manual contrast check covers text, muted text, links, buttons, focus rings, and stat cards.
  - Visual regression baseline updated if visual tests exist.
- **Risk:** Token churn can create wide diffs; keep changes systematic and documented.
- **Done evidence:** Pending. Record contrast audit notes and representative screenshots.

## BDS-015 — Reduced-effects preference and motion budget

- **Priority:** P1
- **Phase:** 4 — Design, motion, and interaction craft
- **Dependencies:** `BDS-001`, `BDS-003`
- **Affected files:** motion utilities, layout/root state, local storage or preference handling, tests
- **Acceptance criteria:**
  - Site respects `prefers-reduced-motion`.
  - In-site reduced-effects toggle exists if motion expansion proceeds.
  - Motion budget is documented: transform/opacity only, no scroll-jacking, pause offscreen animations, no trapped pinned sections.
  - Reduced-motion mode preserves editorial richness with static composition rather than deleting content.
- **E2E/QA requirements:**
  - E2E emulates reduced motion and verifies animations/effects are suppressed or simplified.
  - Manual keyboard QA verifies toggle is reachable, labelled, persistent, and does not steal focus.
- **Risk:** Preference persistence can flash wrong state; initialize early without unsafe inline scripts if CSP work is active.
- **Done evidence:** Pending. Record reduced-motion test output and manual QA notes.

## BDS-016 — Timeline, stats provenance, and proof components

- **Priority:** P1
- **Phase:** 4 — Design, motion, and interaction craft
- **Dependencies:** `BDS-005`, `BDS-014`, `BDS-015`
- **Affected files:** career/impact components, content schemas, tests
- **Acceptance criteria:**
  - Career timeline is vertical, semantic, keyboard-friendly, and not horizontal scroll-jacked.
  - Impact stats include provenance: source, date, method, and confidentiality note when needed.
  - Provenance UI works with keyboard and screen readers.
  - Reduced-motion users see final stat values immediately.
- **E2E/QA requirements:**
  - E2E covers keyboard access to timeline and provenance disclosures/popovers.
  - Accessibility scan has no serious/critical violations.
  - Manual screen-reader pass verifies stats announce final value and label, not animation noise.
- **Risk:** Popovers/tooltips are easy to make inaccessible; prefer native disclosure patterns where possible.
- **Done evidence:** Pending. Record tested components and sample provenance entries.

## BDS-017 — Route transitions and view-transition enhancement

- **Priority:** P2
- **Phase:** 4 — Design, motion, and interaction craft
- **Dependencies:** `BDS-006`, `BDS-015`, `BDS-019`
- **Affected files:** router/navigation components, case-study cards, motion utilities, tests
- **Acceptance criteria:**
  - View Transitions API is used only with feature detection.
  - Navigation falls back cleanly without animation.
  - Reduced-motion/reduced-effects disables route morphs.
  - Focus moves to the destination main heading or main landmark after route changes.
- **E2E/QA requirements:**
  - E2E validates card-to-detail navigation with and without reduced motion.
  - Manual QA verifies back/forward behavior, focus placement, and no scroll trap.
- **Risk:** Fancy transitions can break focus and history; accessibility beats spectacle every time, sorry dopamine goblin.
- **Done evidence:** Pending. Record route-transition test output and manual focus notes.

## BDS-018 — Image and asset performance pass

- **Priority:** P1
- **Phase:** 5 — Performance, observability, and data feedback
- **Dependencies:** `BDS-002`
- **Affected files:** public assets, image components, build scripts if needed, tests
- **Acceptance criteria:**
  - Hero and major imagery use responsive AVIF/WebP where practical.
  - Image dimensions/aspect ratios are reserved to avoid CLS.
  - Decorative atmospheric assets are budgeted and lazy/non-blocking where possible.
  - Font preload strategy is intentional and measured.
- **E2E/QA requirements:**
  - Lighthouse or equivalent confirms no major image sizing/format warnings on core routes.
  - Manual visual QA verifies no blurry/incorrect crops at mobile, tablet, desktop widths.
- **Risk:** Over-optimizing tiny assets wastes time; focus on LCP and repeated large visuals.
- **Done evidence:** Pending. Record before/after asset sizes and Lighthouse notes.

## BDS-019 — Lighthouse/Web Vitals budgets

- **Priority:** P1
- **Phase:** 5 — Performance, observability, and data feedback
- **Dependencies:** `BDS-002`, `BDS-018`
- **Affected files:** CI config, Lighthouse config, performance docs/tests
- **Acceptance criteria:**
  - Budgets documented for LCP, INP, CLS, Lighthouse categories, and initial JS.
  - CI or scheduled workflow runs Lighthouse on core routes.
  - Budget failures are visible and actionable.
  - Targets align with research: LCP <= 2.0s mobile p75 target, INP <= 150ms, CLS <= 0.05, Lighthouse 95+ where practical.
- **E2E/QA requirements:**
  - Performance run covers `/`, `/privacy`, `/colophon`, one writing page, and one case-study page once they exist.
  - Report artifacts are retained in CI.
- **Risk:** Lab metrics can be noisy; use thresholds with sane tolerance and trend evidence.
- **Done evidence:** Pending. Record first baseline report and chosen thresholds.

## BDS-020 — Privacy-preserving analytics

- **Priority:** P1
- **Phase:** 5 — Performance, observability, and data feedback
- **Dependencies:** `BDS-010`, `BDS-011`, `BDS-013`
- **Affected files:** analytics loader, server request handling, privacy/colophon content, tests
- **Acceptance criteria:**
  - Analytics provider is privacy-forward, cookieless/minimal, and documented.
  - Analytics does not load when `Sec-GPC: 1` is present.
  - No analytics event captures sensitive/PII content.
  - CSP is updated without reintroducing unsafe inline scripts.
- **E2E/QA requirements:**
  - E2E verifies analytics script/load request is absent under GPC.
  - E2E verifies analytics can load under normal conditions if enabled.
  - Manual QA verifies privacy and colophon copy match behavior.
- **Risk:** Third-party scripts can hurt trust/performance; keep this optional until value is clear.
- **Done evidence:** Pending. Record provider, CSP diff, and GPC test output.

## BDS-021 — Error monitoring and uptime visibility

- **Priority:** P2
- **Phase:** 5 — Performance, observability, and data feedback
- **Dependencies:** `BDS-010`, `BDS-013`
- **Affected files:** Workers/server instrumentation, monitoring config, privacy/colophon content, tests
- **Acceptance criteria:**
  - Error monitoring captures production exceptions without PII-heavy payloads.
  - Source maps and release identifiers are configured if provider supports them.
  - Uptime monitor covers the production homepage and key routes.
  - Privacy/colophon disclose monitoring where appropriate.
- **E2E/QA requirements:**
  - Verify monitoring initialization does not run in test unnecessarily.
  - Verify CSP allows monitoring endpoint only if used.
  - Manual smoke confirms production monitor alerts route to Tyler.
- **Risk:** Monitoring SDKs can bloat client JS; prefer server/runtime monitoring and sampling.
- **Done evidence:** Pending. Record monitor URLs/config summary and sample non-sensitive event.

## BDS-022 — `/uses` route

- **Priority:** P2
- **Phase:** 6 — Optional authority surfaces
- **Dependencies:** `BDS-005`, `BDS-009`
- **Affected files:** `src/routes/uses.*`, content, navigation/footer if linked, tests
- **Acceptance criteria:**
  - `/uses` documents tools, hardware/software, operating rituals, and productivity stack.
  - Content is useful and current, not affiliate sludge.
  - Route metadata and sitemap inclusion are correct.
- **E2E/QA requirements:**
  - E2E verifies route renders, metadata exists, and accessibility scan passes.
  - Manual QA verifies links open correctly and content is not stale/misleading.
- **Risk:** Can become a junk drawer; keep categories tight.
- **Done evidence:** Pending. Record route URL and content review date.

## BDS-023 — `/now` route

- **Priority:** P2
- **Phase:** 6 — Optional authority surfaces
- **Dependencies:** `BDS-005`, `BDS-009`
- **Affected files:** `src/routes/now.*`, content, tests
- **Acceptance criteria:**
  - `/now` exists only if Tyler commits to quarterly updates.
  - Page shows current focus, date updated, and archive/history if useful.
  - Stale content has a visible updated date rather than pretending to be evergreen.
- **E2E/QA requirements:**
  - E2E verifies route renders latest entry and sitemap inclusion if public.
  - Manual QA verifies update cadence reminder exists.
- **Risk:** A stale `/now` page screams abandoned cabin in the woods; do not ship without maintenance intent.
- **Done evidence:** Pending. Record update cadence owner and first published date.

## BDS-024 — `/speaking` route

- **Priority:** P3
- **Phase:** 6 — Optional authority surfaces
- **Dependencies:** `BDS-005`, `BDS-009`
- **Affected files:** `src/routes/speaking.*`, content, tests
- **Acceptance criteria:**
  - `/speaking` ships only when there are real talks, panels, podcasts, or a clear speaking offer.
  - Page includes topics, bio, headshot/downloads if appropriate, past appearances, and contact CTA.
  - Empty-state marketing fluff is avoided.
- **E2E/QA requirements:**
  - E2E verifies route renders content and contact CTA.
  - Manual QA verifies claims and media links.
- **Risk:** Premature route damages credibility; defer until content exists.
- **Done evidence:** Pending. Record content inventory and published route.

## BDS-025 — `/humans.txt`

- **Priority:** P3
- **Phase:** 6 — Optional authority surfaces
- **Dependencies:** `BDS-008`
- **Affected files:** `public/humans.txt` or route equivalent, colophon link if desired, tests
- **Acceptance criteria:**
  - `/humans.txt` credits people, tools, typography, and inspiration accurately.
  - Content does not expose private contact details or operational secrets.
  - Colophon links to it only if useful.
- **E2E/QA requirements:**
  - E2E verifies `/humans.txt` returns 200 text/plain if shipped.
  - Manual QA verifies credits are accurate and permission-safe.
- **Risk:** Low; mostly maintenance drift.
- **Done evidence:** Pending. Record served URL and review date.
