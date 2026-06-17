# Deck.gl GlobeView Limitations (Extracted from Official Docs)

Source: https://deck.gl/docs/api-reference/core/globe-view

## Status
Experimental. "Does not provide the compatibility and stability that one would typically expect from other View classes. Use with caution."

## Limitations
1. No support for rotation (pitch or bearing). Camera always points toward center of earth, north up.
2. No high-precision rendering at high zoom levels (> 12). City-block scale features may not render accurately.
3. Only supports 'lnglat' coordinateSystem.
4. Known rendering issues when mixing GlobeView and MapView, or switching between them.
5. TileLayer and MVTLayer support is experimental.
6. These layers do NOT work in GlobeView:
   - HeatmapLayer
   - ContourLayer
   - TerrainLayer
7. MaskExtension is not supported.

## Notes on GeoJSON
Straight lines and flat surfaces are warped to the globe surface. Warped edges still correspond to straight lines in Mercator projection. To draw shortest-distance lines, use GreatCircleLayer.

## Constructor Options
- `resolution` (number, optional) — degrees. Smaller = more detailed mesh. Default 10.
- `nearZMultiplier` — default 0.1
- `farZMultiplier` — default 2
- `parameters` — enables back-face culling by default (`{cullMode: 'back'}`)

## Controller
GlobeController handles interactivity. Enable with `controller: true`.
