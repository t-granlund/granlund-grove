# three-globe API Reference (Extracted from GitHub README)

Source: https://github.com/vasturiano/three-globe (1.6k stars, last commit Apr 4, 2026)

## Data Layers

### Globe Layer
- `globeImageUrl([url])` — equirectangular projection image
- `bumpImageUrl([url])` — bump map for terrain
- `showGlobe([boolean])` — default true
- `showGraticules([boolean])` — lat/lng grid every 10 deg, default false
- `showAtmosphere([boolean])` — bright halo, default true
- `atmosphereColor([str])` — default lightskyblue
- `atmosphereAltitude([str])` — default 0.15 (globe radius units)
- `globeMaterial([material])` — default MeshPhongMaterial
- `globeTileEngineUrl([fn(x,y,l)])` — slippy map tile engine
- `globeCurvatureResolution([number])` — default 4 (angular degrees)

### Arcs Layer
- `arcsData([array])` — list of links
- `arcStartLat`, `arcStartLng`, `arcEndLat`, `arcEndLng` — accessors
- `arcColor([str,[str,...] or fn])` — supports gradients
- `arcAltitude([num, str or fn])` — max altitude; null = auto-scaled
- `arcAltitudeAutoScale([num])` — default 0.5
- `arcStroke([num])` — diameter in angular degrees; null = 1px Line
- `arcCurveResolution([num])` — default 64 segments
- `arcCircularResolution([num])` — default 6 (TubeGeometry only)
- `arcDashLength([num])` — relative length (1 = full line)
- `arcDashGap([num])` — relative gap length
- `arcDashInitialGap([num])`
- `arcDashAnimateTime([num])` — ms for dash motion across full line; 0 = disabled
- `arcsTransitionDuration([num])` — default 1000ms

### Points Layer
- `pointsData([array])` — cylinders rising from surface
- `pointLat`, `pointLng`, `pointColor`, `pointAltitude`, `pointRadius` — accessors
- `pointResolution([num])` — default 12 slices
- `pointsMerge([boolean])` — batch into single mesh for perf, default false
- `pointsTransitionDuration([num])` — default 1000ms

### Additional Layers
- Polygons — GeoJSON Polygon/MultiPolygon extruded cones
- Paths — multi-point lines with dash animation
- Heatmaps — Gaussian KDE density on sphere
- Hex Bins — H3 hexagonal prisms
- Hexed Polygons — H3-tesselated country shapes
- Tiles — spherical surface segments
- Particles — point sprites
- Rings — propagating ripple circles
- Labels — 3D text with Facetype.js
- HTML Elements — CSS2DRenderer overlays
- 3D Objects — custom Object3d placement
- Custom Layer — arbitrary ThreeJS objects

## Utility
- `getGlobeRadius()` — cartesian distance of globe radius
- `getCoords(lat, lng [,altitude])` — spherical to cartesian
- `toGeoCoords({x,y,z})` — cartesian to spherical
- `setPointOfView(camera)` — sync camera for optimal layer rendering
- `pauseAnimation()` / `resumeAnimation()`
