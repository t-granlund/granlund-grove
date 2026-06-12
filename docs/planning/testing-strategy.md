# Testing Strategy

This strategy defines the quality gate for future implementation. It intentionally front-loads tests because this repo currently has no test suite, current build passes, and future route/motion/security work needs guardrails before the shiny bits run loose with scissors.

## Implemented suite (2026-06-10, Richard code-puppy-078b36)

The suite is live: **36 tests** across vitest + Playwright, run 3x clean.

| Layer                | File                                 | Tests | Covers                                                             |
| -------------------- | ------------------------------------ | ----- | ------------------------------------------------------------------ |
| Architecture fitness | `tests/architecture/fitness.test.ts` | 4     | planning docs, 600-line guideline, CSP debt, 3 resume PDFs present |
| Unit (pure logic)    | `tests/unit/contact.test.ts`         | 13    | honeypot, every validation branch, 501/502 fallbacks, delivery     |
| Component            | `tests/unit/content.test.tsx`        | 6     | 6 skill groups, 3 resume links, 6 case studies x 5 beats, GH link  |
| E2E                  | `tests/e2e/site.spec.ts`             | 3     | home hero + skip link, privacy, sitemap                            |
| E2E content          | `tests/e2e/content.spec.ts`          | 8     | case studies, skills, resume links, PDFs served, contact form POST |
| Accessibility        | `tests/e2e/a11y.spec.ts`             | 2     | axe (serious/critical) on `/` and `/privacy`                       |

Contact rules were refactored into the pure, injectable `src/lib/contact.ts`
so they unit-test without a server. Contact e2e waits for React hydration
before interacting (pre-hydration clicks cause a native form submit).

## Goals

- Protect existing routes: `/`, `/privacy`, `/sitemap.xml`.
- Gate all new route/content work behind automated smoke, accessibility, and content validation.
- Establish manual WCAG 2.2 AA checks for cinematic UX that automated tools cannot prove.
- Add lightweight architecture fitness checks so future agents do not slowly turn the repo into soup.
- Keep tests practical, fast, and dependency-aware.

## Non-goals

- No requirement for 100% coverage theater.
- No browser/device farm before there is enough UI surface to justify it.
- No runtime database testing until a runtime database exists.
- No implementation code in this planning artifact. Obviously. We are behaving.

## Test pyramid for this repo

| Layer                | Purpose                                | Example coverage                                                                         |
| -------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| Architecture fitness | Enforce repo-level invariants          | Planning docs exist, route inventory intentional, CSP inspected, file size guardrails    |
| Unit/component       | Validate pure logic and UI states      | Content schema helpers, metadata helpers, disclosure components, reduced-motion behavior |
| Integration          | Validate route loaders/server behavior | GPC request handling, sitemap generation, draft filtering                                |
| E2E                  | Validate real user flows               | `/`, `/privacy`, `/sitemap.xml`, writing/case-study routes, keyboard navigation          |
| Accessibility        | Automated plus manual WCAG             | axe scans, focus behavior, screen-reader semantics, target sizes                         |
| Performance          | Prevent regressions                    | Lighthouse/Web Vitals budgets, asset sizes, CLS checks                                   |
| Security/trust       | Validate headers and privacy claims    | CSP, security.txt, analytics suppression under GPC                                       |

## Phase 1 minimum harness

Phase 1 must deliver the minimum useful harness before later work starts.

### Required commands

Exact command names can be finalized during implementation, but CI and local development should have equivalents for:

- Install dependencies
- Lint
- Typecheck
- Build
- Unit/component tests
- E2E tests
- Accessibility E2E scans
- Architecture fitness checks
- Performance/Lighthouse checks once budgets exist

### Initial E2E smoke coverage

Before adding new routes, cover the current baseline:

1. `/`
   - Returns success status.
   - Has a document title.
   - Exposes a main landmark.
   - Contains the primary hero/executive content.
   - Skip link reaches main content.
   - No serious/critical automated accessibility findings.
2. `/privacy`
   - Returns success status.
   - Exposes a main landmark.
   - Contains a privacy heading.
   - No serious/critical automated accessibility findings.
3. `/sitemap.xml`
   - Returns success status and XML content type where feasible.
   - Includes `/` and `/privacy`.
   - Excludes draft/private future content.

## Manual WCAG 2.2 checklist

Automated accessibility checks are necessary but not sufficient. For every UI PR and every release, manually verify the following.

### Keyboard and focus

- All interactive controls are reachable with keyboard only.
- Focus order follows the visual/logical reading order.
- Skip link is visible on focus and lands at the true main content target.
- Sticky navigation does not obscure focused anchors or headings.
- Focus is not lost after route transitions, menu open/close, or disclosure interactions.
- Escape closes modal/menu/popover interactions where applicable.

### WCAG 2.2 items called out by research

- **2.4.11 Focus Not Obscured (Minimum):** focused controls remain visible.
- **2.4.12 Focus Not Obscured (Enhanced):** aspirational where practical.
- **2.4.13 Focus Appearance:** focus indicator has sufficient size and contrast.
- **2.5.7 Dragging Movements:** any drag interaction has a button/keyboard alternative.
- **2.5.8 Target Size:** interactive targets are at least 24×24 CSS px.
- **3.2.6 Consistent Help:** contact/help mechanisms stay consistent across routes.
- **3.3.7 Redundant Entry:** future forms preserve entered information after validation/navigation errors.
- **3.3.8 / 3.3.9 Accessible Authentication:** no inaccessible CAPTCHA/puzzle/cognitive test without alternative.

### Screen-reader semantics

- Page has one clear `h1`.
- Heading hierarchy is logical.
- Landmarks are present and not duplicated confusingly.
- Decorative atmosphere/fog/grain/spruce layers are hidden from assistive tech.
- Impact stats announce final value and label, not count-up animation noise.
- Case studies use semantic structure: headings, lists, figures/captions where needed.
- Popovers/disclosures expose state and are operable by keyboard and screen reader.

### Reduced motion and reduced effects

- OS-level `prefers-reduced-motion` is honored.
- In-site reduced-effects preference, if implemented, is reachable and persistent.
- Reduced-motion mode keeps content and editorial richness; it must not become a sad blank wall.
- Parallax, fog drift, glow pulses, magnetic hover, route morphs, and looping counters are disabled or simplified.
- No scroll-jacking or pinned keyboard traps.

### Visual accessibility

- Body text contrast meets WCAG AA; AAA is preferred for long-form body text where feasible.
- Muted text remains readable on dark, glass, image, and cedar/moss surfaces.
- Focus rings remain visible on all major backgrounds.
- Links are distinguishable beyond color alone where necessary.
- Text remains usable at 200% zoom and narrow mobile widths.

## Browser/device QA matrix

Use this as the realistic target matrix. Not every PR needs every device, but release candidates should.

| Environment               | Required for                                     | Notes                                         |
| ------------------------- | ------------------------------------------------ | --------------------------------------------- |
| Chromium desktop          | Every UI PR                                      | Primary automated E2E target                  |
| Firefox desktop           | Release candidate                                | Catches CSS/focus quirks                      |
| Safari desktop            | Release candidate where available                | Important for View Transitions/focus behavior |
| iOS Safari + VoiceOver    | Major navigation/motion releases                 | Manual smoke                                  |
| Android Chrome + TalkBack | Major navigation/motion releases where available | Manual smoke                                  |

## Architecture fitness checks

Architecture checks should be small, readable, and intentionally boring.

Recommended checks:

1. `docs/planning/README.md`, `roadmap.md`, `backlog.md`, and `testing-strategy.md` exist.
2. Known public route inventory is documented and sitemap expectations match tests.
3. Source files stay under the agreed 600-line guideline unless explicitly allowed.
4. `public/_headers` CSP is inspected; eventually fail if `script-src 'unsafe-inline'` remains after `BDS-010` is complete.
5. Draft/private/confidential content is excluded from sitemap and public route lists once content layer exists.
6. New route families include E2E smoke tests and metadata expectations.
7. Content schemas require provenance for impact stats once proof components exist.

Keep these checks focused. A fitness suite should be a guardrail, not a tiny bureaucrat with a clipboard and no hobbies.

## Route expansion QA requirements

Every new public route must include:

- Route smoke E2E test.
- Main landmark and one `h1`.
- Metadata/canonical verification where practical.
- Automated accessibility scan.
- Sitemap inclusion or explicit exclusion test.
- Keyboard navigation check for all interactive elements.
- Manual content review for accuracy and confidentiality.

Specific route requirements:

| Route family                | Additional QA                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `/case-studies/[slug]`      | Missing slug 404, confidential/draft exclusion, redaction review, provenance review |
| `/writing/[slug]`           | Draft exclusion, heading hierarchy, code block/link readability if present          |
| `/colophon`                 | Claims match actual stack/privacy/performance posture                               |
| `/.well-known/security.txt` | RFC fields present, expiry less than one year, text/plain response                  |
| `/uses`                     | Link integrity and staleness review                                                 |
| `/now`                      | Updated date visible and maintenance cadence accepted                               |
| `/speaking`                 | Real content exists; no empty marketing shell                                       |

## Security and privacy QA

### CSP

Current context: `public/_headers` CSP has `script-src 'unsafe-inline'`.

Testing expectations after hardening:

- Header tests verify CSP is present on HTML routes.
- Header tests verify `script-src` no longer includes `'unsafe-inline'` after `BDS-010` completes.
- E2E verifies hydration, navigation, and route transitions still work under CSP.
- Any analytics/error-monitoring endpoints are explicitly allowed and documented.

### GPC

Testing expectations:

- Request with `Sec-GPC: 1` suppresses optional analytics.
- Privacy and colophon pages describe GPC behavior.
- GPC does not depend on a cookie.
- Normal request path still renders and can load optional analytics only if enabled.

### Security.txt

Testing expectations:

- `/.well-known/security.txt` returns 200.
- Content type is `text/plain` where feasible.
- Required fields exist: `Contact`, `Expires`, `Preferred-Languages`, `Canonical`.
- Expiry has a renewal reminder.

## Performance testing

Performance should be measured after the baseline harness exists and before heavy visual/motion work ships.

Targets from research:

| Metric            |                                                           Target |
| ----------------- | ---------------------------------------------------------------: |
| LCP               |                       <= 2.0s mobile p75 target; stretch <= 1.5s |
| INP               |                                <= 150ms target; stretch <= 100ms |
| CLS               |                                     <= 0.05 target; stretch 0.00 |
| Lighthouse mobile | 95+ performance/accessibility/SEO/best-practices where practical |
| Initial JS        |                          <= 120 KB gzipped for home route target |

Performance QA should cover:

- `/`
- `/privacy`
- `/colophon` once added
- One writing detail route once added
- One case-study detail route once added

Motion-specific performance checks:

- Animate only transform/opacity or cheap CSS custom properties.
- Pause offscreen animations.
- No per-frame layout reads/writes.
- No scroll-jacking.
- No WebGL/Three.js in the planned phases.

## Done evidence expectations

Every ticket in `backlog.md` has a `Done evidence` field. When implemented, fill it with:

- PR or commit link/hash.
- Commands run and short output summary.
- CI run link if available.
- Screenshots/traces/reports for UI, E2E, Lighthouse, or accessibility work.
- Manual QA notes for WCAG/content/security review.
- Any accepted deviations and their rationale.

## Release readiness checklist

Before release:

- CI green.
- Build green.
- E2E smoke green for all public routes.
- Automated accessibility scan green or documented with accepted exceptions.
- Manual WCAG checklist completed for changed surfaces.
- Sitemap matches public route inventory.
- Privacy/colophon/security claims match implementation.
- CSP and security headers checked.
- Performance budgets checked for affected routes.
- `Done evidence` updated for completed BDS tickets.
