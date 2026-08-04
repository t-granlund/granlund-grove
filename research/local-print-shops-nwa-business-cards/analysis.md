# Multi-Dimensional Analysis — Premium Dark Business Card Printing (NWA)

Evaluated against the project's known constraints: the card is a **premium dark-design job** — rich charcoal full-bleed background, token-only palette, double-sided, 3.75"×2.25" print-ready PDF (`dist/card/granlund-card.pdf`, fonts embedded). The deciding factors are **dark-fill coverage quality** and **heavy matte/soft-touch stock**, not raw speed.

## Print-technology lens (most important for a charcoal card)
- **Large solid dark fills are the hardest thing for digital presses.** Quick-print chains (Staples, FedEx "Quick", Office Depot) run toner/digital presses that can produce **banding, mottling, or a washed-out/gray-looking black** on big solid backgrounds, especially on light/uncoated stock.
- **Mitigations:** (a) choose **matte or soft-touch lamination** — the coating smooths toner laydown and visually deepens the black; (b) choose a **heavier stock** (16pt+ / 130 lb+) which holds coverage better; (c) for the best result use a **commercial offset or HD-digital (Indigo) press** at a shop like Broadaway/Morpho, where solid charcoal prints clean and rich.
- **Practical sequencing:** run the cheap/fast chain proof first to validate layout/trim/QR, then commit the premium run to a commercial printer for the dark-fill quality.

## Cost
- Cheapest published per-card: Staples 14pt (~$21.99/250 ≈ $0.09/card) and 16pt matte ($27.99/250 ≈ $0.11/card).
- FedEx Quick double-sided ≈ $18.75/100 (≈$0.19/card); FedEx Premium double ≈ $39.99/100 (≈$0.40/card) — premium stocks (soft-touch, ultra-thick) price into the Premium tier.
- 50-count proof runs: FedEx Quick 50 ≈ ~$20–25 (interpolated from the 100-count "for" pricing; confirm at checkout). Most chains price small runs poorly per-card.
- Local commercial printers: no online pricing → **call for quote**; expect $40–90 for a 250 run on heavy stock depending on coating/soft-touch, and a small-run premium on 25–50.

## Implementation complexity / PDF-upload friendliness
- **FedEx Office** is the standout: its published spec *is* 3.75"×2.25" with bleed, PDF preferred — zero rework on your existing file.
- **Staples** accepts PDF/JPG/PNG, trims at the bleed line, wants 300 DPI CMYK — also clean, but you must select the right stock/finish to avoid a template-builder default.
- **Broadaway / Morpho** have dedicated **"Send a File"** portals plus business-card order forms — genuinely print-ready-PDF friendly.
- **PostNet / Office Depot** accept PDFs but the flow is more store/counter-driven; premium stock selection is less self-serve.

## Turnaround / stability
- Same-day: Staples (order by 12 pm, traditional cards) and FedEx Quick (same/next-day in-store pickup) — both within ~5–8 mi.
- Commercial independents (Broadaway, Morpho, Minuteman): quote-based, typically 2–5 business days; higher and more consistent print quality, better for the final premium run.

## Risk flags
- **Office Depot**: limited/no published soft-touch or 32pt stock — weakest fit for a premium dark card; treat as backup only.
- **A&B Reprographics / Southern Reprographics**: primarily large-format/repro shops — confirm they stock heavy card before relying on them.
- **Band-aid risk:** ordering the cheapest quick-print option on light stock for a full-charcoal design is the classic way to get a disappointing gray, banded card. Always proof physically (project task bc-12 already covers a home-print + scan check before any paid run).

## Compatibility with the project
- Your deliverable is already a 2-page, font-embedded, exact-size PDF — this maps 1:1 to FedEx's spec and to the "Send a File" portals at Broadaway/Morpho. No template rebuild needed anywhere except possibly Office Depot's weaker flow.
