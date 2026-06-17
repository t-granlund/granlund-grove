# Project-Specific Recommendations: tylergranlund.com Globe

## Current State Assessment

Your `GlobeNetwork.tsx` is a **solid, well-architected R3F component** with:
- Correct spherical math (quaternion-based great-circle interpolation)
- Proper React patterns (`useMemo`, `useRef`, `useFrame`)
- Clean Tailwind + dark-mode aesthetic
- Accessibility via `aria-label` and `Suspense` fallback
- Zero axe violations (confirmed by test suite)

**What it lacks is not engineering quality — it is polish layers.**

---

## Recommendation A: Incremental Polish (Keep Hand-Rolled, Add Shaders)

**Effort:** 2-4 hours  
**Risk:** Low  
**Bundle Impact:** +0 kB (uses existing three.js)

### Action Items

1. **Add Fresnel Atmosphere Glow** (30 min)
   - See README.md Q2 for complete shader code
   - Place a `BackSide` sphere at `scale={1.18}` with `AdditiveBlending`
   - Use cedar color `#c49a6c` to match your design system

2. **Add Animated Dash Arcs** (1 hour)
   - See README.md Q3 Option A for `ShaderMaterial` approach
   - Encode `vProgress` into UV.x of `TubeGeometry`
   - Dash pattern: `mod(vProgress + uTime * 0.5, 0.15 + 0.25) < 0.15`

3. **Add Graticule Grid** (15 min)
   - Use `three-globe`'s approach: `SphereGeometry(1.01, 64, 64)` with `wireframe: true` and `opacity: 0.08`
   - Or add a second `IcosahedronGeometry` at higher subdivision

4. **Add City Labels** (1 hour)
   - Use `@react-three/drei/Html` for labels positioned at each marker
   - Only show label for hovered marker to avoid clutter
   - Style with Tailwind classes inside the `Html` component

5. **Performance Guard** (15 min)
   - Lazy-load the entire `GlobeNetwork` section:
   ```tsx
   const GlobeNetwork = lazy(() => import('./GlobeNetwork'));
   ```
   - Wrap in `Suspense` with the existing fallback

### When to Choose This Path
- You prefer owning the math and shaders
- You don't need hover tooltips or click-to-fly camera
- Your design system requires custom shader effects beyond what `three-globe` exposes

---

## Recommendation B: Switch to react-globe.gl (Declarative Data Layer)

**Effort:** 4-6 hours (includes styling to match cedar/stone palette)  
**Risk:** Low-Medium  
**Bundle Impact:** +~180 kB gzipped for `react-globe.gl`

### Action Items

1. **Install dependencies**
   ```bash
   npm install react-globe.gl
   ```

2. **Replace GlobeNetwork with react-globe.gl component**
   - Map your `LOCATIONS` and `ARCS` to `pointsData` and `arcsData`
   - Configure `globeMaterial` with your dark earth colors
   - Set `atmosphereColor="#c49a6c"` and `atmosphereAltitude={0.15}`

3. **Customize styling to match design system**
   - `globeMaterial`: `MeshPhongMaterial({ color: '#1c2420', emissive: '#0a0f0c' })`
   - `pointColor`: `d => d.type === 'root' ? '#e8d5c0' : '#c49a6c'`
   - `arcColor`: `'#c49a6c'`
   - `backgroundColor`: `'#141916'`

4. **Preserve scroll and section layout**
   - `react-globe.gl` renders its own `<canvas>`
   - Keep your section wrapper, `<h2>`, and legend markup
   - The globe canvas sits inside your `relative rounded-3xl border border-border` container

5. **Add interaction if desired**
   - `onPointHover` to show custom HTML tooltips
   - `pointOfView` for fly-to animations when section enters viewport

### When to Choose This Path
- You want hover/click tooltips without building raycasting logic
- You want animated dash arcs without writing GLSL
- You want `flyTo` camera animations for future storytelling
- You want a tile engine for a future iteration (real satellite imagery)

---

## Recommendation C: Hybrid — three-globe Inside Existing R3F Scene

**Effort:** 3-5 hours  
**Risk:** Medium  
**Bundle Impact:** +148 kB gzipped for `three-globe`

### Action Items

1. **Install `three-globe` (not react-globe.gl)**
   ```bash
   npm install three-globe
   ```

2. **Create a `ThreeGlobeLayer` component inside your existing `<Canvas>`**
   ```tsx
   import ThreeGlobe from 'three-globe';
   
   function GlobeLayer() {
     const globe = useMemo(() => {
       const g = new ThreeGlobe()
         .showAtmosphere(true)
         .atmosphereColor('#c49a6c')
         .atmosphereAltitude(0.15)
         .globeMaterial(new THREE.MeshPhongMaterial({ color: '#1c2420' }))
         .pointsData(LOCATIONS.map(l => ({ lat: l.lat, lng: l.lng, color: l.type === 'root' ? '#e8d5c0' : '#c49a6c' })))
         .pointColor('color')
         .arcsData(ARC_DATA)
         .arcColor('color')
         .arcDashLength(0.3)
         .arcDashGap(0.2)
         .arcDashAnimateTime(2000);
       return g;
     }, []);

     useFrame((_, delta) => {
       globe.rotation.y += delta * 0.06;
     });

     return <primitive object={globe} />;
   }
   ```

3. **Preserve your custom stars, lighting, and background**
   - Keep `<Stars />` and `<pointLight>` from your current `<Scene>`
   - `three-globe` manages its own globe mesh; everything else stays as-is

4. **Override `three-globe` defaults that conflict with your design**
   - Disable default lights: pass custom `lights` array
   - Or use `globeMaterial` to override the default `MeshPhongMaterial`

### When to Choose This Path
- You want `three-globe`'s data layers but don't want to give up your R3F scene graph
- You have custom post-processing or effects that must wrap the globe
- You want to mix `three-globe` with custom R3F components (your markers, custom UI overlays)

---

## Prioritized Decision Matrix for tylergranlund.com

| Priority | Recommendation | Rationale |
|----------|---------------|-----------|
| **1** | **Recommendation A** (Incremental) | Lowest risk, zero bundle increase, keeps full shader control. Addresses the actual gap (aesthetics) without a framework switch. |
| **2** | **Recommendation C** (Hybrid) | If you later need tile imagery or rich interactivity, you can drop `three-globe` into your existing scene without rewriting layout. |
| **3** | **Recommendation B** (Full switch) | Only if you decide the portfolio needs Mapbox-style interactivity (tooltips, fly-to, search) in a future revision. |

---

## Quick-Win Checklist (Do This Week)

- [ ] Add Fresnel atmosphere shader to existing globe (30 min)
- [ ] Add dash animation to arcs via shader or `three-globe` (1 hour)
- [ ] Verify lazy-loading with `lazy()` + `Suspense` (15 min)
- [ ] Test on mobile Safari (iOS WebGL performance check)
- [ ] Run Lighthouse after changes to ensure TTI stays <2.5s

## If You Choose to Stay Hand-Rolled

Your current code is actually **better than 90% of portfolio globes** already. The only upgrades needed are:
1. Fresnel glow (shader, 10 lines)
2. Dash animation (shader, 15 lines)
3. Graticule opacity tweak (1 line)

Everything else — great-circle math, marker pulse, auto-rotation, dark palette — is already production-grade.
