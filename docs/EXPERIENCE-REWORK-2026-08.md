# Experience Rework — Session State & Resume Guide (2026-08-27)

> **Start here if you're resuming this work.** Written by code-puppy-a07765.
> Status: **Round 1 + Round 2 complete. Waiting on Tyler's review answers.**
> Nothing new has shipped to `src/` yet — the site's content is unchanged.

---

## The goal (Tyler's words, condensed)

Rework tylergranlund.com's experience/impact/skills content using two voice-memo
"brainstorm" recordings, cross-referenced against `granlund-grove`,
`job-scout/resume-kit`, and `Job-Interview-Insight` — with detailed
implementation stories (websites, integrations, localization, merchant
processing, data privacy), what was done, how, and the technology involved.

## The core finding

The site has 6 five-beat case studies, **all HTT-era or personal projects**.
School of Rock (Apr 2015 – Jan 2022, ~145→300+ locations, 8→14 countries) exists
only as résumé bullets. The brainstorms fill that gap. This is the rework's
center of gravity.

## Artifacts (all in this repo)

| Path | What |
| --- | --- |
| `docs/brainstorm-transcripts.md` | Verbatim, timestamped transcripts of both recordings (153 segments) |
| `experience-rework-review.html` | **Self-contained review page.** Tyler marks Ship/Edit/Cut + fills answers, downloads markdown |
| `docs/EXPERIENCE-AND-WORK-HISTORY.md` | Pre-existing consolidated dossier; consolidation target for validated new facts |
| Raw transcription JSON | `/tmp/gg-transcriptions/` — ephemeral, reproducible (see below) |

## How the transcription was done (reproducible)

Local only, using Mockingbird's (`~/dev/mockingbird`) vendored whisper.cpp
example binary — no cloud:

```bash
ffmpeg -i Brainstorm-N.qta -ar 16000 -ac 1 out.wav
~/dev/mockingbird/target/release/examples/verbatim_dump \
  out.wav \
  ~/dev/mockingbird/target/release/models/whisper-large-v3-turbo-q5_0.bin \
  out.json Brainstorm-N.qta
# audio: Brainstorm-{1,2}.qta in Audio-Recordings/ (~7 and ~5 min; ~25x realtime on M4 Pro)
```

## Round 2 validation results (2026-08-27)

All gates green — **SAFE BASE TO BUILD ON:**
typecheck 0 errors · 56/56 vitest · 81/81 Playwright e2e · 12/12 axe a11y ·
build + lint clean · `judge.py --skip-live` 21/26 READY (failures are
deploy-gated live probes + bd-not-installed + nothing else).

Fact validation across all repos: merchant-processing integration, GDPR
Ireland/Iberia + COPPA/FERPA, COVID pivot, and the global market footprint are
**corroborated** by `EXPERIENCE-AND-WORK-HISTORY.md` + `career-data.ts`.
**UNVERIFIED (transcript-only, zero repo hits):** Yext, MetaJive, Drupal,
Zendesk, PCI Level 4 status, LGPD/POPIA/CDPA formal shipping, the 2.5-year
Google bulk-verification battle, royalty-split details, and the names
Pedro/Paulo, Johanna, Kristen Kidd. These are pending Tyler — see the review
page's 12 open questions. Pending list mirrored in
`docs/NUMBER_VERIFICATION.md` (gate-neutral, no unchecked boxes — judge G3.2
regex-fails on any literal `[ ]`).

Corrections made in Round 2: Spruce Grove Media case-study proposal **cut**
(Ventures page already covers it); audio's Paraguay confusion resolved
(Asunción IS a supported market; the correction was about a franchise owner's
daughter's path Lisbon→Madrid).

## Pending — what Tyler must do

1. Open `experience-rework-review.html` in a browser (comments autosave to
   localStorage — same browser/machine).
2. Verdict every item (Ship/Edit/Cut), answer the 12 open questions
   (bank name, locale counts, market timelines, name spellings, GBP metrics...).
3. Hit **Download Markdown** → produces `grove-rework-review-<date>.md`.

## Resume instructions (next session)

1. Read this file, then `docs/brainstorm-transcripts.md` (or the review
   markdown Tyler provides, which supersedes it).
2. Ingest Tyler's downloaded markdown (contains verdicts + answers).
3. For every **Ship/Edit** item: merge validated facts into
   `docs/EXPERIENCE-AND-WORK-HISTORY.md`, `src/lib/career-data.ts`,
   and `src/lib/chatbot/knowledge/*.ts` — **single source of truth stays DRY**;
   chatbot knowledge derives from the same facts.
4. New numbers require ticks in `docs/NUMBER_VERIFICATION.md` (status must stay
   `VERIFIED`, zero unchecked boxes) before any `src/` copy uses them.
5. New case studies follow the existing 5-beat model in
   `src/components/site/Projects.tsx`; content goes through CaseStudyModal.
6. End with: `npm run typecheck && npm run test && npm run test:e2e &&
   npm run test:a11y && python3 scripts/judge.py --skip-live` — stay ≥ 21/26.
7. Hard rules from `CODE-PUPPY-BRIEF.md` apply: no deploys, no [Tyler] dashboard
   items, number gate is binding.

## Git state at handoff

Committed by code-puppy-a07765 (this session): transcripts, review page,
this doc, and the brief/gate/GOALS updates. `Audio-Recordings/` source .qta
files are **ignored** (51 MB binaries, stay local).
Prior session head before this work: `172db44` (business-card pipeline).
