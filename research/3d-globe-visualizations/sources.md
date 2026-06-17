# Sources and Credibility Assessment

## Tier 1 (Highest) — Official Documentation & Primary Sources

### 1. three-globe GitHub Repository
- **URL:** https://github.com/vasturiano/three-globe
- **Stars:** 1.6k
- **Last Commit:** Apr 4, 2026
- **Assessment:** Primary source. README contains exhaustive API reference for all 15+ data layers. Repository includes 20+ runnable examples (Basic, Arc Links, Country Polygons, Heatmap, Hex Bins, Tiles, Clouds, Day/Night Cycle, Custom Globe Material, etc.). Author (vasturiano) is a prolific dataviz library maintainer (also force-graph, sunburst-chart).
- **Validation:** Cross-checked with npm registry and CodePen examples linked from README.

### 2. globe.gl GitHub Repository
- **URL:** https://github.com/vasturiano/globe.gl
- **Stars:** 3k
- **Assessment:** Wrapper around three-globe. README confirms identical API surface with added renderer/camera/orbit controls management. CDN delivery documented.

### 3. react-globe.gl GitHub Repository
- **URL:** https://github.com/vasturiano/react-globe.gl
- **Stars:** 1.4k
- **Assessment:** React prop bindings for globe.gl. Full TypeScript prop types. Includes post-processing composer example (Glitch effect). Active issue tracker.

### 4. CesiumJS GitHub Repository
- **URL:** https://github.com/CesiumGS/cesium
- **Stars:** 15.4k
- **Last Commit:** Jun 12, 2026
- **Assessment:** Enterprise 3D geospatial standard. Source code confirms WebGPU experimental modules, 3D Tiles implementation, ion integration. Bundle size verified via bundlephobia.

### 5. Deck.gl GitHub Repository
- **URL:** https://github.com/visgl/deck.gl
- **Stars:** 14.3k
- **Assessment:** Primary source for GPU-accelerated layers. GlobeView explicitly marked "Experimental" in source and docs. luma.gl v9 WebGPU migration tracked in repo issues.

### 6. Mapbox GL JS GitHub Repository
- **URL:** https://github.com/mapbox/mapbox-gl-js
- **Stars:** 12.3k
- **Assessment:** Official vector tile renderer. Globe projection and fog API documented in examples and source. Token-based licensing model verified.

### 7. MapLibre GL JS GitHub Repository
- **URL:** https://github.com/maplibre/maplibre-gl-js
- **Stars:** 10.8k
- **Assessment:** Open-source fork. GlobeControl visible in source. Self-hosting confirmed. Community governance via MapLibre charter.

### 8. Babylon.js GitHub Repository
- **URL:** https://github.com/BabylonJS/Babylon.js
- **Stars:** 25.7k
- **Assessment:** Game engine codebase. WebGPU renderer module confirmed in source. Scene optimizer and PBR materials documented.

### 9. D3-geo GitHub Repository
- **URL:** https://github.com/d3/d3-geo
- **Stars:** 1.1k
- **Assessment:** Reference implementation of geographic projections. No WebGL dependency by design. Versor dragging in separate d3-inertia module.

### 10. React Three Fiber GitHub Repository
- **URL:** https://github.com/pmndrs/react-three-fiber
- **Stars:** 31.1k
- **Assessment:** De facto React renderer for Three.js. Reconciler source confirms full Three.js object support. `useFrame`, `useThree`, `useLoader` hooks documented.

### 11. Three.js WebGPU Renderer Source
- **URL:** https://github.com/mrdoob/three.js/tree/dev/src/renderers/webgpu
- **Assessment:** Direct inspection of source files shows active development (commits Jun 16, 2026). WebGPURenderer.js, WebGPUBackend.js, Nodes system all present. r170 release notes confirm move to addons.

## Tier 2 (High) — Benchmarks & Package Registries

### 12. Bundlephobia — three
- **URL:** https://bundlephobia.com/package/three
- **Data:** 707.2 kB minified / 177.7 kB gzipped. Tree-shakeable. No dependencies.

### 13. Bundlephobia — three-globe
- **URL:** https://bundlephobia.com/package/three-globe
- **Data:** 452.2 kB minified / 148 kB gzipped. Tree-shakeable. 17 dependencies.

### 14. Bundlephobia — cesium
- **URL:** https://bundlephobia.com/package/cesium
- **Data:** 4.6 MB minified / 1.2 MB gzipped. Tree-shakeable partial. 2 dependencies.

### 15. Bundlephobia — @deck.gl/core
- **URL:** https://bundlephobia.com/package/@deck.gl/core
- **Data:** Loading at time of research. Estimated ~150 kB gzipped from npm metadata.

## Tier 3 (Medium) — Community Discussions & Examples

### 16. Deck.gl GlobeView Documentation
- **URL:** https://deck.gl/docs/api-reference/core/globe-view
- **Assessment:** Official docs but marks feature as experimental. Limitations list is explicit.

### 17. Mapbox Globe Spin Example
- **URL:** https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/
- **Assessment:** Official Mapbox example. Demonstrates `projection: 'globe'` and `map.setFog({})`.

### 18. Observable — Three.js Globe Examples
- **URL:** https://observablehq.com/search?query=three+globe
- **Assessment:** Community notebooks. Good for validating math approaches (orthographic projection, great-circle interpolation).

## Tier 4 (Lower) — Aggregated Opinions

### 19. DuckDuckGo Search — "three.js webgpu renderer 2025 status"
- **URL:** https://duckduckgo.com/?q=three.js+webgpu+renderer+2025+status
- **Assessment:** Secondary aggregation. Used to discover primary sources (threejs.org manual, GitHub PRs).
