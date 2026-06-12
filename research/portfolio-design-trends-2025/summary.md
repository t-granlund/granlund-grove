# Portfolio Design Trends 2024–2025 — Executive Summary

> Research compiled March 2026 for `granlund-grove` (TanStack Start + React 19, Nordic forest dark design system).
> Researcher: web-puppy-9615c0

---

## 1. The Aesthetic Shift (2024 → 2025)

Award-winning personal/portfolio sites for senior tech and design talent have converged on a recognizable but increasingly refined set of moves. The high-flash WebGL-everywhere look of 2021–2023 has given way to something more **editorial, restrained, and atmospheric** — closer to a film title sequence or a Nordic art-book than a demo reel.

The dominant idiom now reads as:

- **Editorial typography first, motion second.** Oversized serif or condensed-grotesque display type carries the personality; motion serves the type, not the other way around.
- **Cinema-grade ambient backdrops.** Subtle grain, deep-blue/black/forest palettes, soft volumetric light, low-fps loops of nature/terrain footage, or shader-based fog. Sites read "dark" but never "edgelord."
- **Scroll choreography over scroll-jacking.** Lenis-style smooth scroll is everywhere, but the better sites avoid hijacking momentum — they use scroll position as a *timeline* for synchronized reveals, not a *handbrake*.
- **Page transitions as a signature.** A single recognizable transition (curtain wipe, view-transition morph, mask reveal) is treated like a brand asset.
- **One "wow moment" per page, max two.** Restraint is the new flex.

For `granlund-grove`'s positioning (Nordic forest dark, executive-credible-but-alive), this is excellent timing: the aesthetic the field has converged on is *exactly* the aesthetic the project already wants to inhabit.

---

## 2. Patterns the Winning Sites Share

| Pattern | What it looks like | Used by (see `site-references.md`) |
|---|---|---|
| **Word/line clip-path reveal** | Headings split into spans, each line/word masked with `clip-path: inset(...)` and animated up on enter | Simon Holm Larsen, Robin Noguier, Olivier Larose |
| **Counter loader** | `00 → 100` ticker on initial load, doubles as a moment of brand drama | Simon Holm Larsen, darkroom.engineering |
| **Cursor as character** | Magnetic dot, contextual labels ("View", "Drag"), color shifts on hover targets | Most Awwwards SOTD, Active Theory |
| **Marquee with scroll velocity** | Horizontal ticker whose speed/direction is driven by scroll velocity | Studio Lumio, Locomotive, Osmo demos |
| **Sticky stage + horizontal pan** | Section pins, content slides horizontally on vertical scroll | Robin Noguier, Igor Bastos |
| **Pinned image stack** | Image grows / unmasks while case-study text scrolls past | Olivier Larose, Henry Heffernan |
| **Hover-reveal previews** | Project list with image that follows cursor or replaces a viewport panel | darkroom.engineering, fromanother.love |
| **Page-transition mask / view-transition** | A solid color (or noise-textured) panel sweeps across the screen between routes | Simon Holm Larsen (Barba), modern sites using View Transitions API |
| **Ambient video / shader hero** | A muted, slow-motion natural texture (rain on lens, mist, terrain flyover) running behind type | Active Theory, Studio Yes Friends |
| **Editorial column grids** | 12-col grid with deliberate off-baseline pull-quotes; type weight contrast does the heavy lifting | Brad Frost, Lee Robinson, Paco Coursey, Rauno Freiberg |

---

## 3. Executive Credibility vs Designer Flash — How the Best Sites Balance Both

The interesting tension for a CTO/Director/Principal site (which `granlund-grove` is closer to than a pure creative-dev portfolio) is: **enough motion to feel current and considered, but not so much that hiring managers, board members, or potential clients dismiss it as "designer noise."**

The sites that nail this share four restraint patterns:

1. **Motion is reserved for transitions and accents, not body content.** Headlines reveal. Body copy does not. Reading content is *still*. The aliveness lives in the chrome — the loader, the page edges, the cursor, the route changes.
2. **Density of information is high.** These sites read more like an annual report or a New Yorker long-form piece than a moodboard. Credentials, dates, clients, metrics are visible above the fold or one scroll down. Flash without substance is the failure mode they avoid.
3. **Typography does 70% of the personality work.** A single distinctive display face (variable Fraunces, GT Sectra, NB International, Söhne) paired with a workhorse sans is enough to differentiate without any motion at all. `granlund-grove` is already correctly set up here (Fraunces + Inter + JetBrains Mono).
4. **Dark is not goth.** The successful Nordic/forest/atmospheric dark sites use a desaturated greenish or bluish near-black (not `#000`), warm off-white text (not `#fff`), and a single restrained accent. They feel like a winter morning, not a nightclub.

The failure mode in either direction:
- **Too executive:** Reads like a Squarespace template. No memorable moment. Forgettable.
- **Too flash:** Reads like a 22-year-old's reel. Hiring committees and enterprise buyers swipe away.

The sites listed in `site-references.md` were chosen specifically because they walk this line. Several (Brad Frost, Lee Robinson, Paco Coursey, Rauno Freiberg) lean executive; several (Simon Holm Larsen, Robin Noguier, Olivier Larose) lean designer — they bracket the space `granlund-grove` should sit *between*.

---

## 4. Dark / Nature / Atmospheric Themes — What Actually Works

Successful atmospheric dark themes share these technical and design moves:

### Color
- Background is a **near-black with a hue cast** — `#0B0E0C` (forest), `#0C1014` (deep blue-graphite), `#11100E` (warm charcoal). Pure `#000` is rare and reads cheap.
- Foreground text is an **off-white**, often warm: `#E8E4DC`, `#EFEAE0`. Never `#FFFFFF` against a tinted dark.
- A **single muted accent** (moss green, ember orange, ice blue) used sparingly — usually for link hover and one structural element.
- Optional: a slight **noise/grain overlay** (SVG `<feTurbulence>` filter or a tiny tiled PNG at 3–6% opacity) to kill banding and warm up the field.

### Texture & Light
- **Static grain** over the whole viewport — single biggest cheap upgrade to a dark site.
- **Soft radial gradients** offset from corners to suggest light source / depth, animated very slowly via scroll.
- **Subtle vignette** at viewport edges (radial gradient overlay at 8–15% opacity).

### Motion (atmospheric, not loud)
- Slow parallax (10–30% offset) on hero imagery.
- A muted video loop (`<video autoplay muted loop playsinline>`) of terrain, fog, water — 6–10s loop, < 2 MB after AV1/H.265 compression.
- Scroll-driven exposure / desaturation: as the user scrolls, hero brightness drops to push focus to text.
- Type that lifts in with a 600–800ms ease (cubic-bezier `0.16, 1, 0.3, 1` or a `linear()` easing). Never spring physics on display copy — too jaunty for the register.

### What to avoid
- Animated SVG line-art "constellations" — read as 2018.
- Twinkling stars / particle.js — read as crypto bro.
- Frosted-glass `backdrop-filter` overload — kills mobile perf, dates fast.
- Anything with `perspective: 1000px; rotateX(...)` on scroll — looks like a Webflow demo.

---

## 5. CSS Scroll-Driven Animations — State of the Web (March 2026)

This is the single biggest "what changed in the last 18 months" answer.

### Browser support — verified against MDN, March 2026
| Feature | Chrome / Edge | Safari (desktop) | Safari iOS | Firefox | Firefox Android |
|---|---|---|---|---|---|
| `animation-timeline` | 115+ ✅ | **26+ ✅** | **26+ ✅** | ❌ (110 behind flag) | ❌ |
| `scroll()` function | 115+ ✅ | 26+ ✅ | 26+ ✅ | ❌ | ❌ |
| `view()` function | 115+ ✅ | 26+ ✅ | 26+ ✅ | ❌ | ❌ |
| `scroll-timeline-name` | 115+ ✅ | 26+ ✅ | 26+ ✅ | ❌ | ❌ |
| `view-timeline-name` | 115+ ✅ | 26+ ✅ | 26+ ✅ | ❌ | ❌ |

**Safari 26 (shipped late 2025) was the inflection point** — before that, scroll-driven animations were Chromium-only. Now they cover roughly 91–94% of global traffic. Firefox remains the holdout (~3–6% globally).

### What's safe to ship in production today
- **Yes, ship it** — for *enhancement* (reveal-on-scroll fades, parallax, progress bars). Wrap in `@supports (animation-timeline: scroll())` and provide a static fallback for Firefox. Firefox users see a working site without the scroll choreography.
- **Don't ship it** — as the *only* mechanism for content reveal. If something is invisible by default and only appears via `animation-timeline`, Firefox users see broken layout.

### Recommended pattern for granlund-grove
```css
/* Default: visible. Firefox-safe. */
.reveal {
  opacity: 1;
  transform: none;
}

@supports (animation-timeline: view()) {
  .reveal {
    opacity: 0;
    transform: translateY(2rem);
    animation: reveal-in linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }

  @keyframes reveal-in {
    to { opacity: 1; transform: none; }
  }
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

This is **zero JavaScript**, GPU-accelerated, and degrades gracefully. For 90%+ of granlund-grove's expected audience (developers, designers, executives on modern Chromium/Safari), this will hit. For Firefox users, the content is still readable — just static.

### Polyfill option
The Scroll-driven Animations polyfill (`scroll-timeline-polyfill` by Bramus / Google) exists but adds ~20 KB and uses `requestAnimationFrame`. For a bundle-conscious project, **don't ship the polyfill** — accept that Firefox gets the static version. The pattern above is the better trade.

---

## 6. View Transitions API — State of the Web (March 2026)

The other major shift since the last research cycle.

### Same-document (in-app route transitions) — NOW UNIVERSAL ✅
| Feature | Chrome / Edge | Safari | Safari iOS | Firefox |
|---|---|---|---|---|
| `document.startViewTransition()` | 111+ ✅ | 18+ ✅ | 18+ ✅ | **144+ ✅** |
| `startViewTransition({update, types})` (multi-arg) | 125+ | 18.2+ | 18.2+ | 147+ ✅ |

**Firefox 144 (shipped late 2025) brought same-document View Transitions to every major browser.** This is now safe to ship as a primary mechanism for in-app route transitions, modal entrances, list filter re-orders, etc.

### Cross-document (multi-page apps via `@view-transition`)
| Feature | Chrome / Edge | Safari | Safari iOS | Firefox |
|---|---|---|---|---|
| `@view-transition { navigation: auto; }` | 126+ ✅ | 18.2+ ✅ | 18.2+ ✅ | ❌ No support |

Cross-document remains **Chromium + Safari only**. Firefox users get a normal navigation (no transition). For `granlund-grove`, this is largely **moot** — TanStack Start renders as a client-routed SPA, so all route changes are same-document and benefit from the universal-support tier.

### Recommended pattern for granlund-grove (TanStack Router)
```ts
// In a navigation utility or router event hook
function navigateWithTransition(to: string, router: Router) {
  if (!document.startViewTransition) {
    router.navigate({ to });
    return;
  }
  document.startViewTransition(() => router.navigate({ to }));
}
```
Paired with CSS:
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 480ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

For named shared elements (e.g. a project card morphing into a project detail header), use `view-transition-name` on both endpoints — `view-transition-class` is also supported in Chrome 125+ / Safari 18.2+ for grouping.

---

## 7. Motion Library Landscape — Quick Verdict

Full analysis lives in `motion-stack-decision.md`. Headline:

| Library | License | React 19 | Bundle (core) | Verdict for granlund-grove |
|---|---|---|---|---|
| **Motion** (ex-Framer Motion) v12 | MIT | ✅ | ~5–9 KB (mini API) / ~18–34 KB (full) | **✅ Recommended.** React-native, declarative, scroll integration via native ScrollTimeline, layout animations, tiny mini API. |
| **GSAP** 3.13+ | **100% free as of 2025** (Webflow-sponsored) | ✅ | ~23 KB core + plugins (40–80 KB realistic) | Skip unless you need SplitText / MorphSVG / Flip for a specific one-off. Imperative, not React-idiomatic. |
| **Motion One** | MIT | ✅ (manual) | ~3.8 KB | Vanilla flavor by same team. Skip — Motion's mini API is now nearly as small and gives you the React layer for free. |
| **Native CSS** (transitions + scroll-driven + view-transitions) | — | ✅ | 0 KB | ✅ Use for 60–70% of motion. Pair with Motion for the rest. |

**Final stack recommendation:** Native CSS (transitions + scroll-driven + view-transitions) for the majority, **Motion** (`motion/react`, mini imports) for the React-driven interactions that need orchestration, layout animation, or gesture. Optional **Lenis** (~2 KB) only if smooth scroll proves necessary after testing without it.

---

## 8. Files in This Research Bundle

- `summary.md` — this file (executive synthesis + technical state)
- `site-references.md` — 10 specific sites with URLs, techniques, and credibility assessment
- `motion-stack-decision.md` — detailed library comparison with code snippets for granlund-grove
- `raw-findings/` — supporting notes

---

## 9. Top-Line Recommendations for granlund-grove

1. **Lean into the existing aesthetic.** Nordic forest dark + Fraunces + self-hosted fonts is already where the field has converged. Don't second-guess it.
2. **Pick one signature transition** and reuse it. Suggested: a vertical mask wipe via View Transitions API, paired with a Fraunces wordmark fade-through.
3. **Ship native CSS scroll-driven animations with `@supports` fallback** for reveals, parallax, and progress indicators. ~90% of users get the choreography; Firefox users get a clean static site.
4. **Add Motion (`motion/react`) only when CSS can't do it** — layout transitions, gesture (drag/hover with physics), staggered orchestration. Use the `motion/react-mini` import pattern to stay under 10 KB.
5. **Do not add GSAP.** The free-licensing news is good, but it's the wrong tool for a React 19 + bundle-conscious project. Revisit only if a specific creative requirement (e.g. SplitText kerning-aware reveals, or Flip layout magic that Motion's `layout` prop can't handle) appears.
6. **Treat motion as ambient, not loud.** One counter loader, one page transition, scroll-reveal type, and a magnetic cursor over interactive elements is plenty. Information density and Fraunces will carry the executive register.
7. **Respect `prefers-reduced-motion` everywhere.** Non-negotiable for a site that wants to read as serious.
