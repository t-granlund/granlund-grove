# Planning BDS — Backlog Decision Store

This directory is the **BDS: Backlog Decision Store** for `granlund-grove`.

The BDS is the file-based source of truth for implementation planning. Agents should read these files before proposing or executing work, update them when decisions change, and avoid burying product/technical decisions in chat history. Chat evaporates. Markdown survives. Mostly.

## Scope

Planning artifacts only. These files describe future implementation work for the TanStack Start + React 19 + Vite + Tailwind v4 + shadcn/ui site deployed to Cloudflare Workers.

Current known baseline:

- Routes: `/`, `/about`, `/career`, `/work`, `/resume`, `/contact`, `/ventures`, `/colophon`, `/privacy`, `/sitemap.xml`
- 75 e2e tests (Playwright), 42 unit tests (Vitest), architecture fitness tests
- Build passes clean; deployed to Cloudflare Workers
- CSP in `src/lib/security-headers.ts` (single source of truth, not `public/_headers`)
- Research sources of truth:
  - `docs/research/experience-architect-findings.md`
  - `docs/research/solutions-architect-findings.md`

## How agents should use the BDS

1. **Read first:** Start with this README, then `roadmap.md`, then `backlog.md`, then `testing-strategy.md`.
2. **Claim narrowly:** Work one ticket or tightly related ticket cluster at a time.
3. **Respect dependencies:** Do not start later phases until their gate tickets are done.
4. **Keep evidence:** Update ticket `Done evidence` with PR/build/test/audit links or exact command output summaries when work lands.
5. **Do not skip QA:** Every implementation ticket needs the listed E2E/QA requirement satisfied or explicitly deferred with rationale.
6. **Prefer boring:** Keep architecture simple, Git-native, Cloudflare-native, and measurable.

## File map

| File                  | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| `README.md`           | BDS operating model and conventions                             |
| `roadmap.md`          | Prioritized phases, gates, and sequencing                       |
| `backlog.md`          | Implementation-ready tickets, `BDS-001` onward                  |
| `testing-strategy.md` | Quality gate, test harness, WCAG, and architecture fitness plan |

## Ticket schema

Every BDS ticket must include:

- **Title**
- **Priority**: `P0`, `P1`, `P2`, or `P3`
- **Phase**
- **Dependencies**
- **Affected files**
- **Acceptance criteria**
- **E2E/QA requirements**
- **Risk**
- **Done evidence**

## Priority definitions

| Priority | Meaning                                                                 |
| -------- | ----------------------------------------------------------------------- |
| `P0`     | Foundational or trust/security work that gates credible expansion       |
| `P1`     | High-leverage site capability or user-facing improvement                |
| `P2`     | Differentiating polish, optimization, or optional route/content surface |
| `P3`     | Nice-to-have follow-up, only after core value is proven                 |

## Phase gate rule

**Phase 1 gates all later work.**

No route/content expansion, motion polish, analytics, or security surface expansion should begin until Phase 1 creates the test harness, CI quality gates, manual WCAG checklist, and reasonable architecture fitness checks.

Yes, it is tempting to build the shiny stuff first. No, do not. That is how websites become haunted CSS cabins.

## Decision update protocol

When a decision changes:

1. Update the relevant ticket in `backlog.md`.
2. If sequencing changes, update `roadmap.md`.
3. If testing expectations change, update `testing-strategy.md`.
4. Add a short dated note here.

### Decision log

| Date       | Decision                                                                           | Source                           |
| ---------- | ---------------------------------------------------------------------------------- | -------------------------------- |
| 2026-05-21 | Establish BDS as file-based planning source of truth in `docs/planning`.           | User request                     |
| 2026-05-21 | Phase 1 quality/test/accessibility gates must precede later implementation phases. | User request + research findings |
