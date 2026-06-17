# Multi-Dimensional Analysis: 3D Globe Visualization Libraries

## Security

| Library | Auth Model | Data Privacy | Vulnerability Surface | Assessment |
|---------|-----------|-------------|----------------------|------------|
| Three.js + three-globe | None (client-side) | All data stays in browser | Standard WebGL attack surface | Low risk. No external data transmission unless tile URLs configured. |
| CesiumJS | Optional ion token | Data may pass through Cesium ion cloud | Larger JS bundle = larger parsing surface | Medium risk if using ion services. Self-hostable to mitigate. |
| Mapbox GL JS | Access token required | Telemetry to Mapbox | Closed-source updates | Medium risk. Token can be exposed in client. Mapbox collects usage metrics. |
| MapLibre GL JS | None | Self-hosted tiles possible | Open-source, community-audited | Low risk. Best for privacy-conscious deployments. |
| Deck.gl | None | Client-side GPU only | vis.gl ecosystem regularly audited | Low risk. |
| ArcGIS | Enterprise license + API keys | Esri cloud integration | Enterprise-grade but proprietary | Medium risk. Vendor lock-in and licensing compliance overhead. |

## Cost

| Library | License | Infrastructure | Hidden Costs | Assessment |
|---------|---------|---------------|--------------|------------|
| Three.js + three-globe | MIT | None | None | Free forever. |
| CesiumJS | Apache 2.0 | Self-hosted or ion (free tier: 1M requests/mo) | ion overage, premium terrain/imagery | Free for low traffic. ion premium can scale to $$$. |
| Mapbox GL JS | Proprietary | Mapbox CDN + APIs | $5/1k MAU for GL JS loads, tile requests extra | Expensive at scale. Not suitable for hobby projects without free tier monitoring. |
| MapLibre GL JS | BSD 3-Clause | Self-hosted tiles | Tile hosting costs (MapTiler, self-host) | Free library. Tile hosting is the real cost. |
| Deck.gl | MIT | None | None | Free forever. |
| ArcGIS | Esri EULA | ArcGIS Online or Enterprise | Licensing per user/deploy | High cost. Enterprise only. |

## Implementation Complexity

| Library | Learning Curve | Integration Effort | React Wrapper Maturity | Assessment |
|---------|---------------|---------------------|----------------------|------------|
| Three.js raw | High (WebGL/GLSL) | High (build everything) | R3F is excellent | You already paid this cost. |
| three-globe | Medium (data-driven API) | Low (props/methods) | react-globe.gl is mature | Incremental learning if you know Three.js. |
| CesiumJS | Very high (geospatial concepts) | High (entities, primitives, 3D Tiles) | Resium is thin wrapper | Overkill for non-GIS devs. |
| Mapbox GL JS | Low (declarative style API) | Low | react-map-gl is excellent | Easiest if you know map styling. |
| MapLibre GL JS | Low | Low | react-map-gl works with compat layer | Same as Mapbox but less polish. |
| Deck.gl | Medium (layer grammar) | Medium | DeckGL React component is mature | Best if you already use vis.gl stack. |
| Babylon.js | High (engine concepts) | High | react-babylonjs is niche | Harder to find help than R3F. |
| D3-geo | Low (projection API) | Low | None needed (SVG/canvas) | Fastest to prototype. |

## Stability

| Library | Version | Breaking Changes | LTS | Community Health |
|---------|---------|-----------------|-----|-----------------|
| Three.js | r184 (0.184.0) | Rare in r150+; modules stable | Mr.doob + 100+ contributors | Excellent. Most stars in 3D web. |
| three-globe | 2.45.2 | Follows semver; minor API additions | vasturiano solo maintainer | Good. Single maintainer but very responsive. |
| CesiumJS | 1.142.0 | Quarterly releases; CZML stable | Cesium GS (company-backed) | Excellent. Commercial backing. |
| Mapbox GL JS | 3.24.0 | Frequent minor releases; style spec evolves | Mapbox Inc. | Good but proprietary roadmap. |
| MapLibre GL JS | 4.x | Community-driven; slower cadence | MapLibre community | Good. Open governance. |
| Deck.gl | 9.x | Major v8->v9 rewrite ongoing | Uber/vis.gl + OpenJS | Excellent. Foundation-backed. |
| Babylon.js | 7.x/8.x | Major version every 1-2 years | Microsoft-adjacent + community | Excellent. Strong tooling. |
| D3-geo | 3.x | Stable since v2 | Mike Bostock + community | Excellent. Battle-tested. |

## Optimization

| Library | GPU Utilization | CPU Overhead | Memory Usage | Mobile Battery |
|---------|----------------|-------------|-------------|---------------|
| Three.js raw (13 markers) | ~5% | Negligible | ~20MB | Low |
| three-globe (13 markers) | ~5% | Negligible | ~25MB | Low |
| CesiumJS | 30-80% (terrain) | High (workers, ion) | 100-300MB | High |
| Mapbox GL JS | 10-20% | Low | 40-80MB | Medium |
| Deck.gl (flat) | 10-30% | Low | 30-60MB | Medium |
| Babylon.js | 5-15% | Low | 30-50MB | Low |

**For your portfolio:** All libraries except Cesium will have negligible impact on mobile battery because your scene has <50 draw calls.

## Compatibility

| Library | React 19 | TanStack Start | Tailwind v4 | SSR Notes |
|---------|----------|---------------|------------|-----------|
| Three.js raw | Yes | Yes | Yes | Canvas only renders client-side. Use `Suspense` + lazy load. |
| three-globe | Yes | Yes | Yes | Same as above. |
| CesiumJS | Partial (Resium lags) | No | Yes | Not SSR-friendly. Must guard `window` access. |
| Mapbox GL JS | Yes | Yes | Yes | Requires `mapbox-gl.css` import. |
| MapLibre GL JS | Yes | Yes | Yes | CSS import required. |
| Deck.gl | Yes | Yes | Yes | Needs WebGL context; hydrate after mount. |
| Babylon.js | Yes | Yes | Yes | Engine init is async; defer to client. |

## Maintenance

| Library | Update Frequency | Deprecation Policy | Migration Burden | Vendor Lock-in |
|---------|-----------------|--------------------|-----------------|---------------|
| Three.js | Monthly releases | Deprecations warned 2+ versions | Low | None |
| three-globe | Bi-monthly | Feature additions only; no removals | None | Low (stays on Three.js) |
| CesiumJS | Quarterly | ion API changes tracked | Medium (CZML/entities) | High if using ion |
| Mapbox | Monthly | Style spec versions | Medium (style JSON) | High (token + tiles) |
| MapLibre | Bi-monthly | Community RFC process | Low | None |
| Deck.gl | Quarterly | Major versions have migration guides | Medium (v8->v9) | Low (vis.gl open) |

---

## WebGPU vs WebGL Roadmap Analysis (2025-2026)

| Library | WebGL2 Status | WebGPU Status | Est. Stable WebGPU | Impact |
|---------|--------------|---------------|--------------------|--------|
| Three.js | Stable default | Renderer in `addons/webgpu`; active dev | **2026-2027** (r190+) | You can switch renderer with one import change once stable. |
| Babylon.js | Stable | First-class since v6; mature | **Available now** | Best WebGPU support today. |
| Deck.gl | Stable | Via luma.gl v9 (in development) | **2027+** | Will require major version upgrade. |
| CesiumJS | Stable | Experimental module | **2027+** | Not a priority for geospatial accuracy use cases. |
| Mapbox/MapLibre | Stable | No announced plans | Unknown | 2D vector tile rendering benefits less from WebGPU. |

**Project implication:** Your portfolio globe does not need WebGPU. WebGL2 is more than sufficient for 13 markers + 10 arcs. If you want to experiment with WebGPU in 2026, Babylon.js is the only production-ready option, but it means leaving the R3F ecosystem.
