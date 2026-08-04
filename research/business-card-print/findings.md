# Business Card Print Research — Findings

**Date:** 2026-08-03 · **Author:** solutions-architect (via code-puppy-afd064) · **Status:** Verified

> Goal: a 2-sided US business card (3.5" × 2") matching the granlund-grove
> "Nordic forest dark" design system, print-ready.

---

## 1. Toolchain — RECOMMENDED: in-repo route + Playwright PDF capture

Add a non-indexed route (e.g. `/brand/card`) rendering both card faces at exact
physical size using the site's real Tailwind v4 tokens + self-hosted fonts,
then capture with the repo's **existing Playwright** via `page.pdf()` into a
2-page PDF (front/back).

- The repo already proves the pattern: `scripts/generate-assets.mjs` renders
  branded assets with real Fraunces in-repo.
- Zero token drift (uses `var(--cedar)` directly), vector text in PDF,
  deterministic/CI-able.
- Runner-up: hand SVG (good for motif/QR components, bad for typography).
- Anti-pattern: Figma (rebuilds the design system by hand, manual exports rot).

**Implementation specs:**
- Page size = full bleed: `3.75in × 2.25in`, `printBackground: true`,
  `preferCSSPageSize: true`, margin 0.
- `@page { size: 3.75in 2.25in; margin: 0; }`; trim box 3.5"×2", 0.125" bleed.
- Chromium emits RGB PDF without PDF/X — fine for MOO/Vistaprint-class uploads;
  add Ghostscript X-1a step only if the chosen printer demands it.

## 2. Color fidelity — VERIFIED with culori (2026-08-03)

All tokens are **IN sRGB gamut** (`inGamut('rgb')` = true for all nine).
Initial "out of gamut" scare was a float-noise artifact of hand-rolled checks;
culori's epsilon-tolerant `inGamut()` confirms everything fits.

| Token | OKLCH | sRGB hex (verified) | Est. CMYK (Coated GRACoL) | Gamut risk |
|---|---|---|---|---|
| background | 0.18 / 0.012 / 150 | **#0e130f** | rich black: C40 M30 Y30 K100 | None (print depth is the risk, not gamut) |
| primary | 0.78 / 0.10 / 65 | **#e4aa71** | ≈ C3 M40 Y68 K2 | Low |
| cedar | 0.78 / 0.12 / 55 | **#f2a26a** | ≈ C3 M40 Y70 K2 | Highest — CMYK dulls orange-amber slightly |
| spruce | 0.32 / 0.045 / 158 | **#1d3a2a** | ≈ C78 M48 Y68 K50 | Clean |
| spruce-deep | 0.22 / 0.03 / 158 | **#0e1f15** | ≈ C80 M55 Y70 K65 | Clean |
| moss | 0.45 / 0.06 / 155 | **#395f47** | ≈ C65 M38 Y60 K25 | Clean |
| stone | 0.85 / 0.012 / 90 | **#d1cec5** | ≈ C16 M12 Y20 K0 | Clean |
| mist | 0.94 / 0.008 / 100 | **#ecebe5** | ≈ C6 M4 Y7 K0 | Clean |
| bark | 0.32 / 0.025 / 60 | **#3d3026** | ≈ C55 M55 Y65 K55 | Clean |

**Rich charcoal background:** use supported rich black **C40 M30 Y30 K100**
(TAC 200%, under the 300% cap) on coated stock; C30 M20 Y20 K100 on uncoated.
**Reversed (light) text on the dark fill must be knockout, ≥7pt**; prefer Inter
over light Fraunces below ~10pt on dark.

Verification script: culori `clampChroma` + `inGamut('rgb')` round-trip
(fitness function candidate in `tests/architecture/`).

## 3. Print specs (US)

- Trim 3.5"×2" · bleed 0.125"/side → doc 3.75"×2.25" · safe zone ≥0.125"
  (use 0.15") inside trim · 300 DPI min for raster (1125×675 px full bleed).
- PDF/X-4 preferred if accepted; PDF/X-1a:2001 universal fallback; most online
  printers just take a clean PDF and normalize it.
- Fonts: Chromium embeds/subsets automatically — confirm `pdffonts` shows
  `emb yes`.

**Printers for dark cards** (verify pricing before ordering):
- **MOO Luxe 32pt** — reference premium dark-card product; optional colored
  core seam (a cedar seam would be on-brand).
- **Jukebox Print** — 32pt soft-touch, spot UV, copper foil (nice on the tree).
- **Print Peppermint** — boutique, faithful darks, longer lead times.
- **Vistaprint** — budget proof-run fallback.

**Finish:** 32pt soft-touch matte laminate (NOT gloss — fingerprints/glare;
NOT raw uncoated — muddies charcoal). Optional spot-UV or cedar/copper foil on
the tree motif = highest-ROI flourish. Order a 25–50 proof run first.

## 4. QR code on dark card

- **Payload:** plain URL `https://tylergranlund.com/?utm_source=business_card&utm_medium=qr`
  (not vCard — lower density, analytics, mutable destination).
- **Error correction:** M (15%); H (30%) only if overlaying a logo.
- **Size:** 0.8" floor, target 1.0". **Quiet zone: 4 modules, same color as
  light modules — non-negotiable.**
- **Inverted (light-on-dark) works in 2026** phone cameras, but put **mist
  (#ecebe5) modules on a spruce-deep (#0e1f15) panel**, never cedar-on-charcoal
  (scanners need luminance contrast, not hue contrast).
- Generate as SVG with npm `qrcode` (errorCorrectionLevel 'M'), restyle fill.
- QA: rasterize rendered PDF at 300 DPI and decode (jsQR/zxing) at 100% & 75%
  scale; physical home-print + iPhone scan before ordering.

## 5. Inventory gap analysis (YAGNI-strict)

Current Code Puppy setup covers ~95% of this:

| Step | Use | New stuff? |
|---|---|---|
| Layout/design | experience-architect + `styles.css` tokens + `public/favicon.svg` tree motif (verified: cedar tree #c89b6a on charcoal #1a2620) | None |
| Authoring | repo React 19 + Tailwind v4 route | None |
| Render → PDF | repo Playwright `page.pdf()` script | None |
| Color math | one-off script + **`culori`** | 1 small MIT devDep (justified) |
| QR | one-off script + **`qrcode`** | 1 small devDep (justified); do NOT build a helios tool for this |
| Visual QA | qa-kitten (pixel diff, decode assertions) | None |
| Raster texture (optional) | codex-imagegen | Optional; NOT for the tree motif (must stay vector) |
| PDF/X-1a (if required) | Ghostscript one-liner | Install only if printer demands |
| MCP servers | — | **None needed** |
| New plugins/agents | — | **None** |

**Pipeline:**
1. experience-architect → face layouts against safe-zone geometry
2. solutions-architect → ADR + fitness functions (this doc is the research base)
3. code-puppy → `/brand/card` route + `scripts/render-card.mjs` +
   `scripts/card-colors.mjs` + `scripts/card-qr.mjs`
4. qa-kitten → visual diff, QR decode, `pdffonts` emb check, page-box assert
5. vitest fitness functions → token parity (no literal colors), TAC ≤ 300%
6. Tyler → home-print proof → phone scan → MOO/Jukebox sample run → full order

**Total new surface area: 2 npm devDeps + 3 scripts. No MCP, no plugins.**
