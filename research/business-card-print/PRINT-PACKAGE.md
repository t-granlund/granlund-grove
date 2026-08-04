# Business Card — Print Package & Local Shop Guide

**Date:** 2026-08-04 · **Status:** bc-12/13 prepped, awaiting physical proof + order
**Files for the printer:** `dist/card/granlund-card.pdf` (final, 2-page vector PDF)
**File for home proofing:** `dist/card/proof-sheet.pdf` (8 fronts + 8 backs on letter)

---

## 1. The deliverables

| File | What | Notes |
|---|---|---|
| `dist/card/granlund-card.pdf` | **Shop file.** 2 pages (front/back), 3.75"×2.25" full bleed (0.125"), fonts embedded, vector text + QR | Upload/email this |
| `dist/card/proof-sheet.pdf` | Home proof: 8 fronts (page 1) + 8 backs (page 2) tiled at true 100% scale with crop outlines | Print at **100% — no fit-to-page** |
| `dist/card/card-front.png` / `card-back.png` | 300-DPI rasters (1125×675) | Preview / reference only |

Print spec to quote: **3.5"×2" trim, double-sided, full bleed, dark
full-coverage background.** Rich-black build C40 M30 Y30 K100 (TAC 200%).
Reversed text ≥7pt. Fonts embedded in the PDF.

## 2. Local options near 72714 (researched 2026-08-04, verify before ordering)

| Rank | Shop | Where | Stock for dark fill | Turnaround | Price (dbl-sided) | PDF-friendly |
|---|---|---|---|---|---|---|
| 1 | **FedEx Office** | 1406 S Walton Blvd, Bentonville · (479) 254-8165 · ~5.4 mi | 130 lb **soft-touch** / 240 lb ultra-thick | Same/next day | ~$20–25 / 50 · ~$45–70 / 250 | Yes — published spec is literally 3.75×2.25 + bleed, PDF preferred |
| 2 | **Broadaway Printing** | 218 W Walnut, Rogers · (479) 636-2003 · ~9.2 mi | 100/120 lb matte/gloss + aqueous; ask 32pt/soft-touch | 2–5 days | call for quote | Yes — Send-a-File portal |
| 3 | **Staples** | 4021 W Walnut, Rogers · (479) 636-0285 · ~8.3 mi | 16pt / 38pt matte or gloss | Same-day by noon | **$27.99 / 250 (16pt)** | Yes — PDF/JPG/PNG w/ bleed |
| 4 | Morpho Printing & Marketing | Bentonville · (479) 254-8525 · ~5.6 mi | matte/gloss cover; ask soft-touch | quote | call | Yes — Send-a-File |
| 5 | PostNet | Bentonville 1200 SE 14th / Rogers 5204 Village Pkwy | varies | same/next | call | store-driven |

Others verified: NLG Printing (Rogers 479-581-0597), Dymark (Rogers
479-631-1919), A&B Reprographics (Bentonville 479-271-7922), Minuteman Press
(Springdale 479-361-3581). Office Depot = weakest fit (no soft-touch/32pt).

Full research w/ source URLs: `research/local-print-shops-nwa-business-cards/`.

## 3. Recommended play

1. **Home proof (bc-12, free):** print `proof-sheet.pdf` at 100%, cut one card,
   iPhone-scan the QR, eyeball cedar-on-charcoal at arm's length.
2. **Proof run (bc-14):** FedEx Office Bentonville — 50 cards on 130 lb
   soft-touch (~$20–25). Their digital press + soft-touch laminate is the best
   chain match for a rich charcoal solid.
3. **Quality alternative:** Broadaway if you want a real commercial printer to
   nail the dark fill — ask for a physical press proof before the full run.
4. **Budget scale-out:** Staples 250 @ $27.99 once the proof looks right.

## 4. Dark-background gotchas (tell the printer)

- Big charcoal solids can band or wash out on digital presses — **soft-touch /
  matte lamination** masks it and deepens the black. Never gloss (fingerprints).
- If the fill looks gray/washed, ask them to run the background as **rich black
  (C40 M30 Y30 K100)**, not 100K-only.
- QR is inverted (mist modules on spruce-deep panel) — confirm contrast on the
  physical proof before the full order; the quiet zone is baked in.

## 5. Foil option (bc-13 contingency, only if desired)

If a shop offers spot-UV or copper/cedar foil on the tree motif, the render
pipeline can emit a 3rd PDF page as a 100% K foil mask (silhouette of the tree
glyph). Cheap to add — flag it and it's a ~10-line change to
`scripts/render-card.mjs`.
