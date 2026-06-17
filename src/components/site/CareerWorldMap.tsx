import { useEffect, useMemo, useState } from "react";

interface MapCity {
  name: string;
  lat: number;
  lng: number;
  step: number; // 0-4
}

// Equirectangular projection: x = lng + 180, y = 90 - lat. This matches the
// /img/earth-map-2d.webp basemap (a real equirectangular Earth texture, tinted
// to the forest palette), so every dot lands on its true geography.
const CITIES: MapCity[] = [
  // Step 0: Apple
  { name: "Chicago", lat: 41.88, lng: -87.63, step: 0 },
  { name: "Glen Ellyn", lat: 41.88, lng: -88.07, step: 0 },
  { name: "Milwaukee", lat: 43.04, lng: -87.91, step: 0 },
  // Step 1: School of Rock
  { name: "São Paulo", lat: -23.55, lng: -46.63, step: 1 },
  { name: "Rio", lat: -22.91, lng: -43.17, step: 1 },
  { name: "Santiago", lat: -33.45, lng: -70.67, step: 1 },
  { name: "Lima", lat: -12.05, lng: -77.04, step: 1 },
  { name: "Asunción", lat: -25.26, lng: -57.58, step: 1 },
  { name: "Madrid", lat: 40.42, lng: -3.7, step: 1 },
  { name: "Lisbon", lat: 38.72, lng: -9.14, step: 1 },
  { name: "Blackrock", lat: 53.3, lng: -6.18, step: 1 },
  { name: "Taichung", lat: 24.15, lng: 120.67, step: 1 },
  { name: "Sydney", lat: -33.87, lng: 151.21, step: 1 },
  { name: "Perth", lat: -31.95, lng: 115.86, step: 1 },
  { name: "Cape Town", lat: -33.92, lng: 18.42, step: 1 },
  // Step 2: Outdoor Cap (US locations only)
  { name: "Bentonville", lat: 36.37, lng: -94.21, step: 2 },
  { name: "Dallas", lat: 32.78, lng: -96.8, step: 2 },
  { name: "Rancho Cucamonga", lat: 34.11, lng: -117.59, step: 2 },
  { name: "Zanesville", lat: 39.94, lng: -82.01, step: 2 },
  // Step 3: North 40
  { name: "Great Falls", lat: 47.51, lng: -111.3, step: 3 },
  // Step 4: Head to Toe
  { name: "Glen Arbor", lat: 44.87, lng: -85.99, step: 4 },
  { name: "South Lake", lat: 32.94, lng: -97.13, step: 4 },
];

// Journey arcs — the trail of each chapter, drawn city-to-city. `step` controls
// when the arc draws in (once that chapter is active). Kept within-employer so
// each role reads as its own network rather than one tangled line.
const JOURNEY_ARCS: { from: string; to: string; step: number }[] = [
  { from: "Chicago", to: "Glen Ellyn", step: 1 },
  { from: "Glen Ellyn", to: "Milwaukee", step: 1 },
  { from: "Glen Ellyn", to: "São Paulo", step: 1 },
  { from: "Glen Ellyn", to: "Santiago", step: 1 },
  { from: "Glen Ellyn", to: "Lima", step: 1 },
  { from: "Glen Ellyn", to: "Asunción", step: 1 },
  { from: "Glen Ellyn", to: "Blackrock", step: 1 },
  { from: "Glen Ellyn", to: "Taichung", step: 1 },
  { from: "Glen Ellyn", to: "Sydney", step: 1 },
  { from: "Glen Ellyn", to: "Perth", step: 1 },
  { from: "Glen Ellyn", to: "Cape Town", step: 1 },
  { from: "São Paulo", to: "Madrid", step: 1 },
  { from: "São Paulo", to: "Lisbon", step: 1 },
  { from: "Bentonville", to: "Dallas", step: 2 },
  { from: "Bentonville", to: "Rancho Cucamonga", step: 2 },
  { from: "Bentonville", to: "Zanesville", step: 2 },
  { from: "Glen Arbor", to: "South Lake", step: 4 },
];

const STEP_COLORS = [
  "#e8d5c0", // Apple - cream
  "#c49a6c", // School of Rock - cedar
  "#8a6a4b", // Outdoor Cap - dark cedar
  "#a08060", // North 40 - medium
  "#c49a6c", // Head to Toe - cedar
];

const STEP_LABELS = ["Apple", "School of Rock", "Outdoor Cap", "North 40", "Head to Toe"];

function project(lat: number, lng: number): [number, number] {
  const x = lng + 180;
  const y = 90 - lat;
  return [x, y];
}

const CITY_BY_NAME: Record<string, MapCity> = Object.fromEntries(CITIES.map((c) => [c.name, c]));

// Quadratic arc between two cities, bowed toward the north for an airline-route feel.
function arcPath(from: MapCity, to: MapCity): string {
  const [x1, y1] = project(from.lat, from.lng);
  const [x2, y2] = project(to.lat, to.lng);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const lift = Math.max(4, Math.min(28, len * 0.2));
  const cx = mx + nx * lift;
  const cy = my + ny * lift;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

const LABEL_OFFSETS: Record<string, number> = {
  Chicago: -5,
  "Glen Ellyn": -1,
  Milwaukee: 3,
  Bentonville: -3,
  Dallas: 1,
  Zanesville: 5,
  "Rancho Cucamonga": 8,
  Lima: -6,
  "São Paulo": -3,
  Rio: 0,
  Asunción: 3,
  Santiago: 6,
  Lisbon: -3,
  Madrid: 0,
  Blackrock: 3,
  Perth: -2,
  Sydney: 2,
};

const LABEL_SIDE: Record<string, "left" | "right"> = {
  Rio: "right",
  Asunción: "right",
  Santiago: "right",
  Lisbon: "right",
  Sydney: "left",
};

// Label geometry for a city (shared by the collision pass and the renderer).
function labelGeom(city: MapCity) {
  const [x, y] = project(city.lat, city.lng);
  const side = LABEL_SIDE[city.name] || (city.lng > 0 ? "right" : "left");
  const labelX = clamp(x + (side === "right" ? 5 : -5), 6, 354);
  const labelY = y - 5 + (LABEL_OFFSETS[city.name] || 0);
  const anchor: "start" | "end" = side === "right" ? "start" : "end";
  const w = city.name.length * 2.5; // approx px width at fontSize 4.2
  const x0 = anchor === "start" ? labelX : labelX - w;
  const x1 = anchor === "start" ? labelX + w : labelX;
  return { labelX, labelY, anchor, box: { x0, x1, y0: labelY - 3.5, y1: labelY + 1.5 } };
}

function MapDot({
  city,
  isActive,
  isCurrent,
  showLabel,
}: {
  city: MapCity;
  isActive: boolean;
  isCurrent: boolean;
  showLabel: boolean;
}) {
  const [x, y] = project(city.lat, city.lng);
  const color = STEP_COLORS[city.step];
  const r = isCurrent ? 2.6 : isActive ? 1.7 : 1.1;
  const { labelX, labelY, anchor } = labelGeom(city);

  return (
    <g>
      {isCurrent && (
        <circle cx={x} cy={y} r={6} fill={color} opacity="0.18">
          <animate attributeName="r" values="5;9;5" dur="2.4s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.18;0.05;0.18"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* thin halo keeps the dot legible on busy land texture */}
      {isActive && <circle cx={x} cy={y} r={r + 0.7} fill="#0b1310" opacity="0.6" />}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={isActive ? color : "#7c8a80"}
        opacity={isActive ? 1 : 0.35}
        className="transition-all duration-500"
      />
      {showLabel && (
        <text
          x={labelX}
          y={labelY}
          textAnchor={anchor}
          fill={color}
          fontSize="4.2"
          fontFamily="monospace"
          fontWeight="500"
          opacity="0.95"
          style={{ paintOrder: "stroke", stroke: "#0b1310", strokeWidth: 0.9 }}
        >
          {city.name}
        </text>
      )}
    </g>
  );
}

function WorldMap({ activeStep, activeSteps }: { activeStep: number; activeSteps: Set<number> }) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const hoveredData = hoveredCity ? CITY_BY_NAME[hoveredCity] : null;

  // Greedy collision: among the current chapter's cities, keep only the labels
  // that don't overlap (in CITIES order). Dense clusters (LATAM, Iberia) used to
  // pile into a blob; now a clean, readable subset shows and the rest stay dots.
  const labelSet = useMemo(() => {
    const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
    const set = new Set<string>();
    const pad = 1.5;
    for (const c of CITIES) {
      if (c.step !== activeStep) continue;
      const { box } = labelGeom(c);
      const hit = placed.some(
        (p) =>
          !(
            box.x1 + pad < p.x0 ||
            box.x0 - pad > p.x1 ||
            box.y1 + pad < p.y0 ||
            box.y0 - pad > p.y1
          ),
      );
      if (!hit) {
        placed.push(box);
        set.add(c.name);
      }
    }
    return set;
  }, [activeStep]);

  return (
    <div className="relative w-full" style={{ paddingBottom: "52%" }}>
      <svg
        viewBox="0 0 360 180"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ background: "#0b1310" }}
        onMouseLeave={() => setHoveredCity(null)}
      >
        <defs>
          <radialGradient id="mapVignette" cx="50%" cy="47%" r="65%">
            <stop offset="52%" stopColor="#0b1310" stopOpacity="0" />
            <stop offset="100%" stopColor="#0b1310" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Realistic equirectangular Earth basemap, tinted to the forest palette */}
        <image
          href="/img/earth-map-2d.webp"
          x="0"
          y="0"
          width="360"
          height="180"
          preserveAspectRatio="none"
          opacity="0.92"
          aria-hidden="true"
        />

        {/* Graticule — faint cartographic grid over the basemap */}
        <g stroke="#7e9488" strokeWidth="0.2" opacity="0.12">
          {[-120, -60, 0, 60, 120].map((lng) => (
            <line key={`v${lng}`} x1={lng + 180} y1="0" x2={lng + 180} y2="180" />
          ))}
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line key={`h${lat}`} x1="0" y1={90 - lat} x2="360" y2={90 - lat} />
          ))}
        </g>
        <line x1="0" y1="90" x2="360" y2="90" stroke="#9bb0a4" strokeWidth="0.25" opacity="0.18" />

        {/* Edge vignette blends the rectangular map into the rounded card */}
        <rect width="360" height="180" fill="url(#mapVignette)" />

        {/* Journey arcs — draw in as each chapter activates */}
        <g fill="none" strokeLinecap="round">
          {JOURNEY_ARCS.map((arc) => {
            const from = CITY_BY_NAME[arc.from];
            const to = CITY_BY_NAME[arc.to];
            if (!from || !to) return null;
            const active = activeSteps.has(arc.step);
            const color = STEP_COLORS[arc.step];
            return (
              <path
                key={`${arc.from}-${arc.to}`}
                d={arcPath(from, to)}
                stroke={color}
                strokeWidth="0.5"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={active ? 0 : 1}
                opacity={active ? 0.6 : 0}
                style={{ transition: "stroke-dashoffset 1.1s ease, opacity 0.7s ease" }}
              />
            );
          })}
        </g>

        {/* City dots + collision-deconflicted current-chapter labels */}
        {CITIES.map((city) => (
          <g
            key={city.name}
            onMouseEnter={() => setHoveredCity(city.name)}
            style={{ cursor: "pointer" }}
          >
            <MapDot
              city={city}
              isActive={activeSteps.has(city.step)}
              isCurrent={city.step === activeStep}
              showLabel={labelSet.has(city.name)}
            />
          </g>
        ))}

        {hoveredData && activeSteps.has(hoveredData.step) && (
          <circle
            cx={project(hoveredData.lat, hoveredData.lng)[0]}
            cy={project(hoveredData.lat, hoveredData.lng)[1]}
            r="5"
            fill="none"
            stroke={STEP_COLORS[hoveredData.step]}
            strokeWidth="0.5"
            opacity="0.7"
          />
        )}
      </svg>

      {hoveredData && activeSteps.has(hoveredData.step) && (
        <div
          className="absolute pointer-events-none px-3 py-2 rounded-lg border border-border bg-card/95 backdrop-blur text-xs"
          style={{ left: "50%", bottom: "8px", transform: "translateX(-50%)" }}
        >
          <div
            className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: STEP_COLORS[hoveredData.step] }}
          >
            {STEP_LABELS[hoveredData.step]}
          </div>
          <div className="font-medium text-foreground mt-0.5">{hoveredData.name}</div>
          <div className="text-stone/60 mt-0.5">
            {hoveredData.lat > 0
              ? `${hoveredData.lat.toFixed(1)}°N`
              : `${Math.abs(hoveredData.lat).toFixed(1)}°S`}
            {" · "}
            {hoveredData.lng > 0
              ? `${hoveredData.lng.toFixed(1)}°E`
              : `${Math.abs(hoveredData.lng).toFixed(1)}°W`}
          </div>
        </div>
      )}
    </div>
  );
}

export function CareerWorldMap({ activeStep }: { activeStep: number }) {
  const [activeSteps, setActiveSteps] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const steps = new Set<number>();
    for (let i = 0; i <= activeStep; i++) steps.add(i);
    setActiveSteps(steps);
  }, [activeStep]);

  const activeNames = new Set(CITIES.filter((c) => activeSteps.has(c.step)).map((c) => c.name));
  const activeCount = activeNames.size;
  const totalUnique = new Set(CITIES.map((c) => c.name)).size;

  return (
    <div>
      <div className="rounded-2xl border border-cedar/15 overflow-hidden shadow-[var(--shadow-lift)] ring-1 ring-inset ring-[oklch(0.85_0.02_90/0.03)]">
        <WorldMap activeStep={activeStep} activeSteps={activeSteps} />
      </div>

      {/* Stats bar */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone/60">
          {activeCount} of {totalUnique} cities
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone/40">
          {activeSteps.size} of 5 chapters
        </span>
      </div>

      {/* Step legend */}
      <div className="mt-4 rounded-2xl border border-border bg-card/30 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone/60 mb-3">
          The journey
        </div>
        <div className="space-y-2.5">
          {STEP_LABELS.map((label, i) => {
            const isActive = activeSteps.has(i);
            const isCurrent = i === activeStep;
            return (
              <div key={label} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 transition-all duration-500"
                  style={{
                    backgroundColor: STEP_COLORS[i],
                    opacity: isActive ? 1 : 0.2,
                    transform: isCurrent ? "scale(1.25)" : isActive ? "scale(1)" : "scale(0.8)",
                    boxShadow: isCurrent ? `0 0 0 3px ${STEP_COLORS[i]}22` : "none",
                  }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-widest transition-all duration-500 flex-1"
                  style={{
                    color: isActive ? STEP_COLORS[i] : "oklch(0.45 0.02 158 / 0.4)",
                    fontWeight: isCurrent ? 600 : 500,
                  }}
                >
                  {label}
                </span>
                <span
                  className="font-mono text-[9px] transition-all duration-500"
                  style={{
                    color: isActive ? "oklch(0.65 0.05 60 / 0.8)" : "oklch(0.40 0.02 158 / 0.3)",
                  }}
                >
                  Step 0{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
