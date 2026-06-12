# Roadmap

This roadmap sequences the BDS backlog into dependency-aware phases. It is intentionally realistic: quality gates first, then route/content expansion, then polish, then data/observability.

## Guiding principles

- **Quality gates before surface area.** Phase 1 gates everything else.
- **Git-native content first.** Prefer file-based content and build-time validation before runtime systems.
- **Accessible cinematic UX.** Motion and atmosphere are allowed only when keyboard, screen-reader, and reduced-motion users get equivalent dignity.
- **Cloudflare-native where practical.** Workers, headers, and lightweight observability should fit the hosting model.
- **No test theater.** Tests must protect real behavior: routes, accessibility, content validity, CSP/security posture, and performance budgets.

## Phase overview

| Phase | Name                                          | Goal                                                     | Exit gate                        |
| ----- | --------------------------------------------- | -------------------------------------------------------- | -------------------------------- |
| 1     | Foundations and quality gates                 | Add the harness and rules that make future work safe     | `BDS-001` through `BDS-004` done |
| 2     | Content architecture and core route expansion | Add validated content model and primary authority routes | `BDS-005` through `BDS-009` done |
| 3     | Trust, security, and privacy posture          | Reduce security risk and make trust visible              | `BDS-010` through `BDS-013` done |
| 4     | Design, motion, and interaction craft         | Elevate experience without harming accessibility/perf    | `BDS-014` through `BDS-017` done |
| 5     | Performance, observability, and data feedback | Measure site health and user experience responsibly      | `BDS-018` through `BDS-021` done |
| 6     | Optional authority surfaces                   | Add lower-priority routes only when content is real      | `BDS-022` onward as selected     |

## Phase 1 — Foundations and quality gates

**Goal:** Create confidence before touching user-visible expansion.

Tickets:

- `BDS-001` — Test harness baseline
- `BDS-002` — CI quality gates
- `BDS-003` — Manual WCAG 2.2 checklist and release QA protocol
- `BDS-004` — Architecture fitness checks

Exit criteria:

- Unit/component/E2E tooling selected and documented in repo scripts/config.
- CI can run typecheck, lint, build, unit/component tests, E2E smoke tests, accessibility scans, and architecture checks.
- Manual WCAG checklist exists and is linked from PR/release workflow.
- Fitness checks cover at least route inventory, planning docs existence, CSP posture, and source-size guardrails where feasible.

## Phase 2 — Content architecture and core route expansion

**Goal:** Move from homepage-heavy presence to credible executive proof surfaces.

Tickets:

- `BDS-005` — Git-native content layer and schemas
- `BDS-006` — Case studies route family
- `BDS-007` — Writing route family
- `BDS-008` — Colophon route
- `BDS-009` — Sitemap and metadata expansion

Dependency notes:

- `BDS-005` gates `BDS-006` and `BDS-007`.
- `BDS-009` depends on new route definitions and content inventory.
- Route pages should ship with content fixtures that prove layout, metadata, and accessibility behavior.

Exit criteria:

- `/case-studies/[slug]` exists with 2–3 confidential-safe launch studies.
- `/writing/[slug]` exists with at least 3 durable essays or draft-hidden content with route behavior tested.
- `/colophon` documents stack, accessibility, performance, privacy, hosting, typography, and credits.
- `/sitemap.xml` includes all public canonical routes.

## Phase 3 — Trust, security, and privacy posture

**Goal:** Align the site with Tyler's IT/security credibility.

Tickets:

- `BDS-010` — CSP hardening plan and nonce-safe scripts
- `BDS-011` — Global Privacy Control handling
- `BDS-012` — `/.well-known/security.txt`
- `BDS-013` — Privacy page trust update

Dependency notes:

- `BDS-010` can begin after Phase 1 but should be completed before adding analytics or third-party scripts.
- `BDS-011` gates analytics in `BDS-020`.
- `BDS-012` is low implementation complexity but high trust value.

Exit criteria:

- `script-src 'unsafe-inline'` removal has a concrete implementation and verification path.
- GPC behavior is documented and testable.
- Security contact signal exists and follows RFC 9116 expectations.
- Privacy content accurately reflects analytics, cookies, GPC, and data retention.

## Phase 4 — Design, motion, and interaction craft

**Goal:** Make the site memorable without turning it into a GPU bonfire.

Tickets:

- `BDS-014` — Design token and typography refinement
- `BDS-015` — Reduced-effects preference and motion budget
- `BDS-016` — Timeline, stats provenance, and proof components
- `BDS-017` — Route transitions and view-transition enhancement

Dependency notes:

- Motion work depends on Phase 1 accessibility and E2E gates.
- `BDS-015` should precede or accompany any new animation system.
- `BDS-016` depends on content schemas from `BDS-005` when stats/proof are content-driven.

Exit criteria:

- Motion respects `prefers-reduced-motion` and in-site reduced-effects preference.
- Proof components expose provenance: source, date, method, and confidentiality note.
- Keyboard users can navigate all enhanced components without traps.
- Performance budgets remain green.

## Phase 5 — Performance, observability, and data feedback

**Goal:** Add measurement without violating privacy posture.

Tickets:

- `BDS-018` — Image and asset performance pass
- `BDS-019` — Lighthouse/Web Vitals budgets
- `BDS-020` — Privacy-preserving analytics
- `BDS-021` — Error monitoring and uptime visibility

Dependency notes:

- `BDS-020` depends on `BDS-011`.
- `BDS-019` should integrate with CI from `BDS-002`.
- Observability should default to no PII and minimal retention.

Exit criteria:

- LCP, INP, CLS, Lighthouse, and bundle-size budgets are documented and measured.
- Analytics are suppressed when `Sec-GPC: 1` is present.
- Error monitoring avoids sensitive data and has clear sampling/filtering.

## Phase 6 — Optional authority surfaces

**Goal:** Add extra routes only if they can be maintained.

Tickets:

- `BDS-022` — `/uses`
- `BDS-023` — `/now`
- `BDS-024` — `/speaking`
- `BDS-025` — `/humans.txt`

Dependency notes:

- `/now` should not ship unless Tyler commits to quarterly updates.
- `/speaking` should not ship without real talks, panels, podcasts, or a speaking strategy.
- Optional surfaces should reuse the content layer and route QA patterns rather than inventing bespoke nonsense.

## Cross-phase risks

| Risk                                           | Mitigation                                                                                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Adding animation before quality gates          | Phase 1 hard gate; reduced-motion tests required                                          |
| Publishing vague case studies                  | Require problem, constraints, role, operating model, impact, lessons, and redaction notes |
| CSP hardening breaks framework/runtime scripts | Inventory current scripts first; implement nonce/hash strategy incrementally              |
| Analytics undermines trust                     | Gate by GPC and privacy page updates; use cookieless/minimal tools                        |
| Content layer over-engineering                 | Keep source of truth in Git and avoid runtime DB for read-mostly content                  |
