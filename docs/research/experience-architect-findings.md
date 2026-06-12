# Experience Architect Findings — Tyler Granlund Personal Brand Site

**Project:** `/Users/tygranlund/dev/03-personal/granlund-grove`  
**Role:** Experience Architect — `experience-architect-7f4bae`  
**Date:** 2026-05-21  
**Research:** web-puppy retry completed successfully; report grounded in official docs/specs plus real inspiration URLs.  
**Baseline:** WCAG 2.2 AA minimum; AAA-aspirational for text contrast, focus, reduced-motion parity, and keyboard/screen-reader experience.

---

## 1. Executive direction

Tyler’s current site already has strong brand DNA: Nordic forest palette, spruce-grove metaphor, chapter framing, cinematic fog/grain/parallax, self-hosted fonts, privacy page, sitemap, JSON-LD, skip link, and reduced-motion handling.

**Best-in-class evolution:** make it feel like an **editorial operating memoir in a spruce grove** — cinematic and memorable, but grounded in executive proof.

The current risk is not “too plain.” The risk is adding more atmospheric effects without adding more credibility. The next version should add **proof surfaces, refined choreography, trust signals, and accessible craft**.

---

## 2. Opinionated stack decisions

| Category | One pick | Why |
|---|---|---|
| **Primary motion stack** | **Motion for React** (`motion.dev`) | Best fit for React/TanStack UI motion, lazy loading, reduced-motion hooks, route/component transitions, smaller footprint than full animation-heavy stacks. Source: https://motion.dev/docs/react |
| **Scroll choreography** | **CSS + IntersectionObserver, enhanced with Motion** | Use native CSS transforms/opacity and IO triggers first. Avoid hard dependency on CSS `scroll-timeline` because browser support is still evolving. Source: https://developer.chrome.com/docs/css-ui/scroll-driven-animations and https://caniuse.com/css-scroll-timeline |
| **Route transitions** | **View Transitions API with feature detection** | Perfect for card→case-study and chapter route morphs; gracefully falls back. Source: https://developer.chrome.com/docs/web-platform/view-transitions/ and https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API |
| **Analytics** | **Plausible** | Cookieless, lightweight, privacy-forward, no consent banner needed if no cookies/PII/cross-site tracking. Source: https://plausible.io/privacy-focused-web-analytics |
| **Image strategy** | **Build-time AVIF/WebP responsive assets** | Small site, fixed asset set, no need for Cloudflare Images operational overhead. |
| **Trust file** | **`/.well-known/security.txt`** | RFC-backed signal for an IT/security-credible professional. Source: https://datatracker.ietf.org/doc/html/rfc9116 |
| **Design system direction** | **Editorial dark forest, not fantasy forest** | Keep spruce, moss, cedar, stone, mist; avoid runes, literal Viking/Nordic tropes, excessive tree iconography. |

**Do not add Three.js/WebGL for v2.** It would be expensive, fragile, and unnecessary. This site can become award-worthy through choreography, typography, proof, and restraint.

---

## 3. Design system elevation

### Keep
- Dark Nordic forest design language.
- OKLCH token system.
- Fraunces + Inter + JetBrains Mono self-hosted stack.
- Chapter/field-note framing.
- Fog, grain, vignette, spruce silhouettes — but with stricter budgets.

### Change
1. **Atmospheric budget per section** — max 3 visual layers at once: one base, one texture, one motion. Hero currently risks layer overload.
2. **Typography refinement** — move to fluid `clamp()` scale; use Fraunces for editorial chapter moments; use tabular numerals for metrics.
3. **Proof-first components** — every “Impact” number should include provenance: source, date, method, and confidentiality note if applicable.
4. **Topographic motif** — use subtle generated SVG contour lines as dividers/case-study headers. This extends “spruce grove / terrain / systems map” without kitsch.
5. **Glass restraint** — keep glass blur for nav/cards only; avoid making every component translucent.

### Avoid
- Literal Nordic clichés: runes, axes, Viking motifs, overdone compass spam.
- Custom cursor as a primary gimmick.
- Autoplay sound.
- Horizontal scroll-jacking as the main story mechanic.

---

## 4. Narrative & information architecture

### Current flow assessment
Current flow — Hero → Prologue → Marquee → About → Career → Interlude → Impact → Projects → Philosophy → Skills → Resume → Contact — works as a one-page story, but it is too homepage-heavy for an IT director’s credibility surface.

The homepage should become a **cinematic executive overview** that links to deeper proof.

### Recommended IA

| Surface | Priority | Recommendation |
|---|---:|---|
| **`/case-studies/[slug]`** | P0 | Highest leverage. Add 2–3 confidential-safe case studies with business problem, constraints, leadership role, architecture/operating model, impact, and lessons. |
| **`/writing/[slug]`** | P0 | Publish durable essays on franchise technology, digital transformation, IT operating models, security, data/AI, and leadership. This creates authority beyond a resume. |
| **`/colophon`** | P0 | Explain stack, accessibility, performance, privacy, typography, hosting, image provenance. For this audience, craft transparency is trust. |
| **`/.well-known/security.txt`** | P0 | Required credibility move for an IT leader. |
| **`/uses`** | P1 | Good fit: tools, operating rituals, hardware/software, productivity stack. Reference convention: https://uses.tech/ |
| **`/now`** | P2 | Useful if updated quarterly. Pattern source: https://nownownow.com/about |
| **`/speaking`** | P2 | Add only if there are talks/panels/podcasts or a real speaking strategy. Premature speaking pages feel empty. |
| **`/humans.txt`** | P2 | Optional craft signal. Source: https://humanstxt.org/ |

### Section changes
- **Hero:** keep cinematic, but add one hard proof line near the top: current title, transformation scope, and domain.
- **Prologue:** make it the executive positioning section, not only poetic atmosphere.
- **Marquee:** repurpose as “systems touched / domains led,” not decorative words.
- **Career:** convert to vertical interactive timeline; avoid horizontal scroll.
- **Impact:** add stat cards with provenance popovers.
- **Projects:** become preview cards linking to `/case-studies/[slug]`.
- **Skills:** group by domain: Platforms, Data, Security, Product, Leadership.

---

## 5. Motion & interaction choreography

### Primary stack
Use **Motion for React** as the only animation library. Do not add GSAP in this phase. Use CSS and IntersectionObserver underneath Motion patterns.

### Choreography plan
1. **Hero descent:** spruce layers drift at different depths for non-reduced-motion users; reduced-motion gets a beautiful static hero with grain/vignette preserved.
2. **Chapter reveals:** section labels draw in with a cedar line and subtle opacity, not big slide animations.
3. **Career timeline rail:** cedar progress rail fills as each role enters viewport.
4. **Impact counters:** numbers settle into place once; no looping or bouncy animation; final value shown instantly for reduced motion.
5. **Case-study route morph:** card image/title morphs into case-study hero using View Transitions API when supported.
6. **Magnetic cards:** extremely subtle hover response on desktop pointer devices only; disabled for touch and reduced motion.
7. **Footer trust reveal:** privacy/GPC/security badges appear as calm editorial metadata, not marketing badges.

### Motion rules
- Animate only `transform`, `opacity`, and CSS custom properties that do not trigger layout.
- No scroll-jacking.
- No pinned sections that trap keyboard/page-scroll users.
- Respect `prefers-reduced-motion` and add an in-site “Reduce effects” toggle.
- Pause offscreen animations.

---

## 6. Accessibility: WCAG 2.2 AA + AAA-aspirational cinematic UX

Sources: WCAG 2.2 Recommendation and QuickRef: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/quickref/

### Accessibility goals
- **WCAG 2.2 AA is the floor.**
- **AAA-aspirational:** body text contrast near/above 7:1 where feasible, strong focus appearance, no obscured focus, reduced-motion equivalent delight.
- Automated tools cannot prove accessibility. axe-core catches roughly 57%; the remaining ~43% requires manual testing.

### Reduced-motion equivalent delight
Reduced-motion must not mean “dead site.” It should become an editorial still mode:
- Keep rich static imagery, grain, contrast, typography, chapter labels, and topographic dividers.
- Replace parallax with fixed depth composition.
- Replace slide/reveal with short opacity fades or instant state changes.
- Show stat final values immediately.
- Disable magnetic hover, fog drift, glow pulses, and route morphs.

### Keyboard journey
- Skip link already exists; verify it lands at the true main content target.
- Sticky nav must never cover focused anchors.
- Career timeline must be normal document flow with headings/lists/details — not canvas, not horizontal scroll trap.
- View transitions must not steal focus; after route change, focus should move to the case-study `<h1>` or main landmark.
- Mobile menu focus trap and Escape behavior should be manually tested on Safari/iOS VoiceOver and Android TalkBack.

### Screen-reader story
- Atmospheric layers: `aria-hidden="true"`.
- Hero image can keep meaningful alt if it contributes mood; purely decorative fog/silhouettes should not be announced.
- Chapter labels should be real headings or labelled sections, not only visual ornaments.
- Impact stats should expose final values and labels, not count-up increments.
- Case studies need semantic structure: heading hierarchy, lists, figures with captions, and accessible diagrams.

### Mandatory manual WCAG 2.2 checklist
For every UI PR, manually verify:
1. **2.4.11 / 2.4.12 Focus Not Obscured** — sticky nav, mobile menu, route transitions, timeline anchors.
2. **2.4.13 Focus Appearance** — focus ring size and contrast on dark, glass, image, and cedar surfaces.
3. **2.5.7 Dragging Movements** — if any drag interaction exists, provide button/keyboard alternative.
4. **2.5.8 Target Size** — every interactive target at least 24×24 CSS px.
5. **3.2.6 Consistent Help** — contact/help mechanisms consistent across routes.
6. **3.3.7 Redundant Entry** — contact form should preserve entered info after validation/navigation errors.
7. **3.3.8 / 3.3.9 Accessible Authentication** — no CAPTCHA puzzle/cognitive test without accessible alternative.

---

## 7. Performance budget

Source: Google Web Vitals: https://web.dev/articles/vitals

| Metric | Good threshold | Target for this site |
|---|---:|---:|
| **LCP** | ≤2.5s | ≤2.0s mobile p75; stretch ≤1.5s |
| **INP** | ≤200ms | ≤150ms; stretch ≤100ms |
| **CLS** | ≤0.1 | ≤0.05; stretch 0.00 |
| **Lighthouse mobile** | n/a | 95+ performance/accessibility/SEO/best-practices |

### Budgets
- **Hero LCP asset:** AVIF/WebP responsive, target ≤150 KB for default desktop candidate.
- **Initial JS:** target ≤120 KB gzipped for home route; lazy-load non-critical motion/case-study code.
- **Continuous animation:** max 1–2 atmospheric animations on mobile; pause offscreen effects.
- **Fonts:** keep self-hosted `woff2`, `font-display: swap`; preload only critical display/sans fonts; avoid preloading mono unless measured necessary.
- **CLS:** reserve dimensions for all images, stat counters, and route-transition surfaces; use tabular numerals.
- **Scroll:** passive listeners only; prefer IntersectionObserver and Motion hooks; no per-frame layout reads/writes.

---

## 8. Privacy & trust

### GPC — P0
Honor `Sec-GPC: 1` server-side. If present, do not load optional analytics or any sale/share-like tracking. Sources: https://globalprivacycontrol.org/ and https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-GPC

### Analytics — one pick
Use **Plausible**. It is privacy-forward, cookieless, lightweight, and aligned with a personal executive site’s trust posture. Source: https://plausible.io/privacy-focused-web-analytics

If GPC is present, suppress analytics entirely and document that behavior on `/privacy` and `/colophon`.

### Trust surfaces
- Add `/.well-known/security.txt` with contact, canonical URL, preferred language, and annual expiry. Source: https://securitytxt.org/
- Add `/colophon` with stack, accessibility posture, privacy posture, performance budget, typography, hosting, and credits.
- Add `/humans.txt` as optional craft credit.
- Footer copy: **“No cookies. GPC honored. Security contact available.”**
- Keep privacy page plain-English and specific.

---

## 9. Prioritized recommendations

### P0 — foundations
1. Add `/case-studies/[slug]` and publish 2–3 launch case studies.
2. Add `/writing/[slug]` with at least 3 durable essays.
3. Implement GPC handling and Plausible suppression when `Sec-GPC: 1` is present.
4. Add `/.well-known/security.txt` and `/colophon`.
5. Convert hero/background assets to responsive AVIF/WebP.
6. Add contrast verification for OKLCH tokens, including focus rings and muted text.
7. Add manual WCAG checklist to PR/release process.

### P1 — high-value craft
1. Convert Career to vertical timeline with progress rail.
2. Add Impact stat provenance popovers.
3. Add View Transition route morphs for project/case-study navigation.
4. Refine typography with fluid type scale and tabular numerals.
5. Add `/uses`.
6. Add site-level “Reduce effects” toggle beyond OS preference.

### P2 — award polish
1. Add `/now` only if Tyler will update it quarterly.
2. Add `/speaking` only when content exists.
3. Add subtle generated topographic SVG dividers for case studies.
4. Add tiny footer compass/coordinates detail if it remains tasteful.
5. Add `/humans.txt`.
6. Prototype opt-in ambient audio only behind a feature flag; likely do not ship by default.

---

## 10. Wow moments

1. **Case-study card → hero morph** using View Transitions API.
2. **Career cedar progress rail** that fills as the role timeline advances.
3. **Impact stat provenance** — every number has a footnote popover with source/date/method.
4. **Topographic chapter dividers** generated from each page slug.
5. **Hero “still mode”** for reduced motion that looks intentionally editorial, not disabled.
6. **Subtle magnetic project cards** on desktop pointer devices only.
7. **Colophon as trust artifact** — stack, accessibility, privacy, and performance made visible.
8. **Footer privacy/security line** — “No cookies. GPC honored. Security contact available.”

---

## 11. Risks & tradeoffs

| Risk | Mitigation |
|---|---|
| Atmosphere becomes gimmick | Enforce 3-layer visual budget per section. |
| Motion harms accessibility | Reduced-motion still mode, no scroll-jacking, no focus theft. |
| Safari gaps for scroll-timeline/View Transitions | Feature-detect; Motion/IO fallback. |
| Animated stats feel cheesy | Use short restrained animation and provenance footnotes. |
| `/now` gets stale | Only ship if quarterly update cadence is realistic. |
| Analytics undermines privacy posture | Plausible only; suppress on GPC; document clearly. |
| Case studies reveal confidential employer details | Use abstracted metrics, sanitized diagrams, “available on request” where needed. |
| Initial JS grows too much | Lazy-load motion features and route-specific code. |

---

## 12. Inspiration URLs

| URL | Use it for |
|---|---|
| https://www.awwwards.com/websites/portfolio/ | Award-level portfolio scanning. |
| https://www.awwwards.com/websites/personal/ | Personal brand presentation patterns. |
| https://thefwa.com/cases | High-craft interactive/cinematic references. |
| https://www.siteinspire.com/websites?categories=19 | More restrained portfolio inspiration. |
| https://tympanus.net/codrops/ | Experimental interaction implementation ideas. |
| https://bruno-simon.com/ | Memorable personal-site “wow” benchmark; also a caution on accessibility/performance. |
| https://www.rauno.me/ | Refined product-minded personal site craft. |
| https://leerob.io/ | Technical executive IA: writing, work, speaking, credibility. |
| https://simonwillison.net/ | Durable authority through writing and archive depth. |
| https://uses.tech/ | `/uses` convention. |
| https://nownownow.com/about | `/now` convention. |

---

## 13. Final recommendation

Do **not** rebuild the site. Evolve it in this order:

1. **Proof:** case studies, writing, impact provenance.
2. **Trust:** GPC, Plausible posture, security.txt, colophon.
3. **Performance/accessibility:** AVIF/WebP, budgets, contrast, manual WCAG process.
4. **Choreography:** Motion-based section reveals, timeline rail, View Transitions.
5. **Polish:** topographic details, uses/now/humans, optional experiments.

The site becomes “badass” not by being louder — but by making the forest metaphor feel inevitable, the systems leadership undeniable, and the experience polished enough that technical peers notice the craft.
