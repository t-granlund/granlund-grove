# Mapbox GL JS Globe Example (Extracted from Official Docs)

Source: https://docs.mapbox.com/mapbox-gl-js/example/globe-spin/

## Key APIs
- `projection: 'globe'` in Map constructor
- `map.setFog({})` — sets default atmosphere style on style.load
- `map.easeTo({ center, duration, easing })` — camera animation
- `map.on('moveend', ...)` — chain rotation indefinitely
- Rotation paused on `mousedown`, resumed on `mouseup` / `dragend`

## Code Pattern
```js
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/standard-satellite',
  zoom: 1.5,
  center: [-90, 40],
  projection: 'globe'
});

map.on('style.load', () => {
  map.setFog({}); // Set the default atmosphere style
});
```

## Bundle
Mapbox GL JS v3.24.0 used in example.
