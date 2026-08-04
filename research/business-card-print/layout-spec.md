# Business Card Layout Design Spec — bc-01

**Date:** 2026-08-03 · **Author:** experience-architect (experience-architect-e9c629)
**Status:** Draft for bc-07 approval gate · **Grounded in:** `src/styles.css`, `research/business-card-print/findings.md`, `public/favicon.svg`

> Implementation rule: markup uses semantic `var(--*)` token references ONLY.
> Verified hexes appear in this spec for reference/QA assertions, never in code.

---

## 0. Canvas & Geometry Conventions

All measurements in **inches**, origin `(0,0)` = top-left of the full-bleed canvas.

| Region | Rect (x, y → w × h) | Notes |
|---|---|---|
| Full bleed (page) | `0, 0 → 3.75 × 2.25` | `@page` size; background fills this entirely |
| Trim line | `0.125, 0.125 → 3.50 × 2.00` | Final cut edge |
| Safe zone | `0.275, 0.275 → 3.20 × 1.70` | 0.15" inside trim; ALL text + QR modules live here |
| Bleed band | outer 0.125" ring | Background/panels may extend here; nothing critical |

Critical-content rule: text glyphs, the tree glyph, and all QR modules (incl. quiet
zone) must sit fully inside the safe zone. Decorative fills/panels may enter the
bleed band and MUST extend to the bleed edge if they touch it (no hairline gaps).

---

## 1. FRONT Face — Layout

**Composition:** left-aligned editorial stack. Tree mark top-left, name as the
single display moment, cedar rule, title, then a bottom-anchored contact block.
Asymmetry is the brand voice; the right ~35% of the card stays open "forest floor"
negative space.

### 1.1 Element table (all coordinates in inches)

| # | Element | Rect / position | Size | Token (verified hex) |
|---|---|---|---|---|
| F0 | Background fill | `0,0 → 3.75×2.25` | full bleed | `var(--background)` (#0e130f) |
| F1 | Atmosphere gradient (optional, see §4) | `0,0 → 3.75×1.4` | radial, top-center | `--gradient-fade` equivalent, spruce hue |
| F2 | Tree glyph | `0.275, 0.275 → 0.30×0.30` | display size | `var(--cedar)` (#f2a26a) fill |
| F3 | Name: "Tyler Granlund" | block top `x 0.275, y 0.66`; width ≤ 3.20 | 19pt/22pt Fraunces | `var(--mist)` (#ecebe5) |
| F4 | Cedar accent rule | `0.275, 1.04 → 0.55 × 0.021` (1.5pt) | solid bar | `var(--cedar)` |
| F5 | Title line | baseline `x 0.275, y 1.24` | 7.5pt Inter | `var(--stone)` (#d1cec5) |
| F6 | Contact line 1: `hello@tylergranlund.com` | baseline `x 0.275, y 1.72` | 7pt Inter | `var(--mist)` |
| F7 | Contact line 2: `tylergranlund.com  ·  linkedin.com/in/tylergranlund` | baseline `x 0.275, y 1.88` | 7pt Inter | `var(--stone)`; separator dots `var(--cedar)` |

### 1.2 Geometry checks
- F3 at 19pt Fraunces: "Tyler Granlund" ≈ 1.85" wide — fits 3.20" safe width, leaves right negative space.
- F7 at 7pt Inter (avg 0.049"/char × 50 chars ≈ 2.45") — fits safe width.
- F7 descender bottom ≈ y 1.90 vs safe bottom 1.975.
- F2 glyph bottom 0.575 vs F3 cap top ≈ 0.68 → 0.10" gap, clean.

### 1.3 Treatment decisions (what survives print)
- **Tree glyph WITHOUT the rounded-square badge.** The favicon's charcoal badge
  (#1a2620) on the card's charcoal ground reads as a muddy app-icon at 0.30";
  the bare cedar glyph reads as a brand mark. Reuse the favicon `<path>` verbatim
  (viewBox 48×48, path is vector) with fill swapped to `var(--cedar)`.
  *(Flagged as Open Question Q2 for Tyler.)*
- **Cedar rule (F4):** solid 1.5pt bar, NO alpha. Chosen over `.topo-divider`:
  the dashed topo motif at 0.4 alpha risks sub-0.5pt effective strokes that drop
  out on press. (Alternate if Tyler wants more texture: topo-divider in
  `var(--moss)` at 100% alpha, 0.75pt dash height — see Q5.)
- **No glass, no grain, no shadows on the front** — see §4.
- Separator dots in F7 are literal `·` glyphs colored cedar via a `<span>` —
  cheapest possible accent, prints as vector text.

---

## 2. BACK Face — Layout

### 2.1 PRIMARY composition: **Centered QR panel** (recommended)

**Why centered over split:** (a) the QR is the back's only job — symmetric
placement maximizes quiet-zone integrity and scan reliability at arm's length;
(b) a 2"-tall card gives a split layout ≤1.6" columns, which pinches the
mandatory 4-module quiet zone toward trim; (c) centered minimalism on the back
contrasts deliberately with the front's asymmetry — the card feels designed,
not templated.

| # | Element | Rect / position | Size | Token |
|---|---|---|---|---|
| B0 | Background fill | `0,0 → 3.75×2.25` | full bleed | `var(--background)` |
| B1 | QR panel (rounded square) | `1.205, 0.22 → 1.34×1.34`, corner radius 0.08 | flat fill, NO blur | `var(--spruce-deep)` (#0e1f15) |
| B2 | QR code (incl. built-in 4-module quiet zone) | `1.375, 0.39 → 1.00×1.00` (centered in B1) | 1.0" target | modules `var(--mist)` on B1 ground |
| B3 | Human URL: `tylergranlund.com` | centered, baseline `y 1.74` | 7pt Inter 500 | `var(--mist)` |
| B4 | Location: `BELLA VISTA, AR` | centered, baseline `y 1.89` | 7pt Inter 500, uppercase, +0.18em tracking | `var(--stone)` |

Geometry checks:
- Panel top 0.22 sits in the bleed-adjacent band — allowed (panel is a fill, not
  critical content). Panel does NOT touch any bleed edge, so no extension needed.
- QR rect `1.375–2.375 × 0.39–1.39` is fully inside safe zone `0.275–3.475 × 0.275–1.975`.
- Panel padding around QR = 0.17" all sides. Payload (~70-char URL, byte mode,
  EC M) lands at QR Version 5 = 37×37 modules → 4-module quiet zone =
  4/37 × 1.0" ≈ 0.108". Panel padding 0.17" EXCEEDS the built-in quiet zone —
  double protection. **Generate the SVG with the 4-module quiet zone included;
  the panel padding is additive, not a substitute.**
- B4 at 7pt +0.18em tracking: "BELLA VISTA, AR" ≈ 1.55" wide, centered at x 1.875 →
  spans 1.10–2.65.

**Tree motif on back: omitted in primary** (Tyler ruled optional; centered
composition is stronger without a competing mark). The spruce-deep panel IS the
brand echo.

### 2.2 ALTERNATE composition (sketch, for bc-07 comparison)

**"Split grove":** vertical hairline (`var(--moss)`, 0.75pt, from y 0.275 to
1.975 at x 2.30) divides the card. Left column: cedar tree glyph (0.34") at top
safe area, name in JetBrains Mono 6.5→7pt micro-stack beneath, moss topo-divider
accent at bottom. Right column: QR panel (1.20" square, QR 0.90") vertically
centered, location line beneath in the right column only.
*Weaknesses:* QR shrinks below the 1.0" target; quiet zone sits 0.35" from trim;
two reading centers compete. Kept only as an approval-gate foil.

---

## 3. Typography Rules (print-hard)

| Element | Font | Weight | Size/leading | Tracking | Color |
|---|---|---|---|---|---|
| Name (F3) | Fraunces (variable) | 600 | 19pt / 22pt | −0.01em | mist |
| Title (F5) | Inter | 500 | 7.5pt / 10pt | +0.02em | stone |
| Contact 1 (F6) | Inter | 500 | 7pt / 9.5pt | +0.01em | mist |
| Contact 2 (F7) | Inter | 400 | 7pt / 9.5pt | +0.01em | stone (+cedar dots) |
| Back URL (B3) | Inter | 500 | 7pt / 9.5pt | +0.01em | mist |
| Location (B4) | Inter | 500 | 7pt / 9.5pt | +0.18em, uppercase | stone |

Rules applied:
- **≥7pt reversed-text floor:** nothing on either face is below 7pt. No exceptions.
- **Inter below 10pt:** only the name (19pt) is Fraunces; everything else is Inter.
  Fraunces' hairlines at small sizes would plug/break in reversed knockout print.
- **JetBrains Mono: not used.** Measured F7 in mono 7pt = ~3.27" wide > 3.20"
  safe width. Inter wins on fit; mono reserved for future micro-labels only.
- **Tracking:** print ink spread thickens glyphs — small text gets +0.01–0.02em;
  the tracked-out uppercase location line (+0.18em) is the classic small-caps
  print convention. Name keeps tight display tracking (−0.01em, half the site's
  −0.02em heading value, softened for ink).
- Site base sets `font-feature-settings: "ss01","cv11"` — harmless in print; leave on.
- All text renders as **knockout** (light ink on the rich-charcoal ground); do not
  overprint. Rich black build per findings: C40 M30 Y30 K100 (TAC 200% ≤ 300% cap).

---

## 4. Print-Survival Notes (CSS effect triage)

`page.pdf()` uses print media; printer RIPs flatten transparency. Verdicts:

| Site effect | Print verdict | Action for /brand/card |
|---|---|---|
| `.grain` / `.grain-overlay` (SVG turbulence, `mix-blend-mode: overlay`, 6–10% opacity) | **REMOVE** | Blend modes flatten unpredictably at the RIP; 6% noise becomes dot-gain mud at 300dpi screening. The 32pt soft-touch laminate provides real tactile grain — that's the brand-correct translation. |
| `.glass` (`backdrop-filter: blur(14px)`) | **REPLACE** | Backdrop blur is meaningless over a solid ground and is force-stripped by the global print reset anyway. QR panel B1 = flat `var(--spruce-deep)` + optional 0.75pt `var(--border)`-style stroke. |
| Radial atmosphere gradients (body `background-image`, `--gradient-fade`) | **KEEP ONE, carefully** | F1: single radial gradient, top-center, spruce-hue alpha ramp identical to the site's body treatment. Gradients become PDF shading patterns (vector-safe). Keep the luminance delta SMALL to avoid digital-press banding. Omit entirely on the back (scan surface stays calm). |
| Linear `--gradient-cedar` / `--gradient-grove` | **OMIT** | Not needed at card scale; banding risk without payoff. |
| `box-shadow` (`--shadow-grove`, `--shadow-lift`, `.lift`) | **REMOVE** | Invisible on a charcoal ground; global print CSS strips them regardless. |
| Hairline strokes / alpha borders | **USE WITH FLOORS** | Minimum stroke 0.5pt; minimum bar height 1.5pt. Prefer solid token colors over alpha for anything structural; alpha acceptable only on large decorative fills (F1). |
| `.topo-divider` (repeating-linear-gradient) | **OPTIONAL** | Vector-safe, but only at 100% alpha, ≥0.75pt. See Q5. |
| Animations (`.drift`, `.rise`, `.glow-soft`, `.fog-band`), parallax | **N/A — strip** | Route is static; never add these classes. Global print block already force-hides them, but don't rely on that. |
| Rich charcoal ground | **NOTE** | Body bg prints via `printBackground: true` + `print-color-adjust: exact`. CMYK build C40 M30 Y30 K100 per findings §2. |

**Recommended print subset (brand feel, press-safe):** flat charcoal ground +
one subtle radial spruce atmosphere (front only) + solid cedar accents (glyph,
rule, separator dots) + flat spruce-deep panel + vector type. That's the whole
recipe. The laminate and stock carry the tactility the screen gets from grain.

---

## 5. Accessibility-Adjacent Print Contrast

Relative luminance computed from verified sRGB hexes (WCAG formula);
ratio = (L1+0.05)/(L2+0.05).

| Pair | Foreground L | Background L | Ratio | WCAG 2.2 verdict |
|---|---|---|---|---|
| **mist #ecebe5 on background #0e130f** | 0.830 | 0.006 | **15.7 : 1** | AAA (normal text) — primary text pair |
| **stone #d1cec5 on background #0e130f** | 0.618 | 0.006 | **11.9 : 1** | AAA — secondary text pair |
| **cedar #f2a26a on background #0e130f** | 0.458 | 0.006 | **9.1 : 1** | AAA — accent/name-adjacent use; never body text (hue, not luminance, is its job) |
| mist #ecebe5 on spruce-deep #0e1f15 (QR + panel context) | 0.830 | 0.011 | **14.4 : 1** | AAA — also far exceeds scanner luminance-contrast needs |
| stone #d1cec5 on spruce-deep #0e1f15 | 0.618 | 0.011 | **10.9 : 1** | AAA — panel-adjacent fallback |

Print caveats WCAG doesn't cover (flagged, not blocking):
- These are screen-space ratios; uncoated/dark stocks compress effective contrast.
  32pt soft-touch matte on coated stock (the locked choice) preserves them well.
- **Minimum approved pairs: mist-on-background and mist-on-spruce-deep.** Stone
  pairs are approved for ≤7.5pt secondary lines (≥11.9:1 headroom absorbs press
  gain). **Never** cedar-on-background for reading text below large-display size,
  and never cedar QR modules (findings §4 — scanners need luminance contrast).
- QR + human URL (B3) pairing is the redundant-entry/non-digital fallback:
  recipients who can't or won't scan still get the destination. This is the
  print analogue of an accessible alternative.

---

## 6. For the Implementer (/brand/card route contract — bc-04)

1. **Page geometry:** `@page { size: 3.75in 2.25in; margin: 0; }`. Two page
   containers, each exactly `3.75in × 2.25in`, `overflow: hidden`, front first,
   `break-after: page` between them. Render both faces in ONE route so a single
   `page.pdf({ preferCSSPageSize: true, printBackground: true })` emits the
   2-page PDF.
2. **Neutralize the global print reset — route-scoped.** `src/styles.css`
   `@media print` forces `html, body { background:#fff !important; color:#111
   !important; }` and `a { color:#111 !important; text-decoration: underline; }`.
   Chromium `page.pdf()` triggers print media, so without an override the card
   prints white. Override MUST be scoped under the route root to avoid leaking
   into résumé-print behavior:
   ```css
   @media print {
     .brand-card-root, .brand-card-root body { /* via route wrapper */
       background: var(--background) !important;
       color: var(--foreground) !important;
     }
     .brand-card-root a { color: inherit !important; text-decoration: none !important; }
   }
   .brand-card-root { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
   ```
   (Structural detail of how the wrapper reaches `body` is bc-04's problem —
   e.g. route applies a `brand-card-print` class to `documentElement` and scopes
   the override off that. The contract: card pages print dark, the rest of the
   site still prints white.)
3. **Tokens only.** Zero literal hex/oklch values in card markup — every color
   via `var(--*)` semantic tokens or existing utilities (`.text-cedar`, `.bg-spruce-deep`).
   Exception: the `?guides=1` overlay may use literal debug colors (red/cyan).
4. **SEO:** route `<head>` carries `<meta name="robots" content="noindex, nofollow">`;
   exclude from sitemap. Route is unlinked from public nav.
5. **Guides mode:** `?guides=1` renders a review overlay (and must be OFF for
   final render): trim rect (red, 0.5pt, at 0.125" inset), safe-zone rect (cyan,
   dashed, at 0.275" inset), center crosshairs on both faces. Guides layer must
   be a sibling overlay, never affecting layout.
6. **Fonts:** self-hosted woff2 already in `/fonts`; Chromium subsets+embeds —
   bc-10 verifies `pdffonts` shows `emb yes` for Fraunces + Inter (mono not used).
7. **QR:** inline SVG from `qrcode` (EC level 'M', margin = 4 modules), modules
   restyled to `var(--mist)`, mounted inside the spruce-deep panel per §2.1.
   Payload: `https://tylergranlund.com/?utm_source=business_card&utm_medium=qr`.
8. **Tree glyph:** inline the favicon `<path>` verbatim, fill `var(--cedar)`,
   no badge rect (per Q2 ruling).
9. **No JS-dependent layout.** Card must render correctly with animations off
   and `prefers-reduced-motion` set; Playwright capture waits on
   `document.fonts.ready` before `page.pdf()`.

---

## 7. Open Questions for Tyler (pre-bc-04 / bc-07 gate)

1. **Q1 — Title pick:** spec ships locked default "Technology Leader — Product,
   Platform & AI". Alternates for bc-07: A) "Full-Spectrum Technology Leader"
   B) "Technical Product, Program & Delivery Leader" C) "Agentic Technology &
   Program Leader". All four fit the 7.5pt single-line measure (longest ≈ 2.4"
   < 3.20"). **Pick one.**
2. **Q2 — Tree badge:** spec drops the favicon's rounded-square badge at card
   size (bare cedar glyph). Confirm, or keep badge for app-icon recognition.
3. **Q3 — Back-face human URL:** B3 (`tylergranlund.com` under the QR) is
   included as the non-scan fallback. Keep, or go pure QR + location?
4. **Q4 — Atmosphere gradient F1:** subtle radial spruce glow on the front
   (screen-faithful, slight banding risk) vs perfectly flat ground (safest,
   flatter feel). Recommend keep-and-proof; final call after home-print (bc-12).
5. **Q5 — Topo texture:** plain cedar rule (specced) vs moss topo-divider
   accent on the front. Recommend plain rule for v1.
6. **Q6 — Foil/spot-UV on the tree (bc-13 territory):** if Jukebox foil is
   chosen, the render script needs a 3rd PDF page as the foil mask (100% K
   silhouette of F2). Cheap to add; needs the printer decision first.
