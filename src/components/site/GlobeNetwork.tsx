import { useCallback, Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "./globe/GlobeScene";
import { ErrorBoundary } from "./ErrorBoundary";

function GlobeFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-xs uppercase tracking-widest text-stone/50 animate-pulse">
        Loading network…
      </span>
    </div>
  );
}

// Shown if WebGL is unavailable or a globe texture fails to load. Keeps the
// section intentional and the overlay headline/CTA legible instead of letting a
// decorative 3D dependency crash the whole page (see ErrorBoundary).
function GlobeStaticFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[#141916] bg-[radial-gradient(circle_at_50%_42%,oklch(0.35_0.05_150/0.55),transparent_62%)]"
    >
      <div className="absolute left-1/2 top-[42%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cedar/25 bg-[radial-gradient(circle_at_38%_32%,oklch(0.45_0.06_150/0.6),oklch(0.14_0.012_150)_70%)] shadow-[0_0_80px_oklch(0.4_0.06_150/0.35)]" />
    </div>
  );
}

export function GlobeNetwork() {
  const handleSelect = useCallback(() => {
    // Globe is decorative-only on home page — no selection state
  }, []);

  return (
    <section
      aria-label="Global impact network"
      data-testid="globe-network"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 mb-16">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar/80 mb-4">
            The Network · 22 cities · 5 continents
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-balance">
            A career that <em className="not-italic text-cedar">crossed continents.</em>
          </h2>
          <p className="mt-5 text-stone/85 leading-relaxed max-w-2xl">
            From Apple&apos;s training rooms in Chicago to master franchise launches across LATAM,
            Europe, APAC, and Africa. From B2B wholesale supply chains in Asia to multi-brand
            identity governance across 200+ locations. Every system built with the same philosophy:
            understand what people need, then remove the obstacles that make their day harder.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div
          data-testid="globe-canvas-container"
          className="relative rounded-3xl border border-cedar/15 overflow-hidden h-[58vh] sm:h-[68vh] lg:h-[78vh] shadow-[var(--shadow-grove)] ring-1 ring-inset ring-[oklch(0.85_0.02_90/0.04)]"
        >
          {/* 3D Globe — auto-rotating, decorative. Wrapped in an ErrorBoundary
              so a transient texture/WebGL failure degrades to a static globe
              instead of crashing the home route (Suspense only handles loading,
              not thrown errors). */}
          <ErrorBoundary fallback={<GlobeStaticFallback />}>
            <Suspense fallback={<GlobeFallback />}>
              <Canvas
                camera={{ position: [0, 0.4, 2.8], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "#141916" }}
              >
                <GlobeScene onSelectLocation={handleSelect} selectedIndex={null} />
              </Canvas>
            </Suspense>
          </ErrorBoundary>

          {/* Top vignette — anchors the orbit hint without washing out the globe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,oklch(0.10_0.012_150/0.55),transparent)]"
          />
          {/* Bottom cinematic scrim — keeps the headline legible while the
              decluttered city labels own the upper two-thirds of the globe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[linear-gradient(180deg,transparent_0%,oklch(0.10_0.012_150/0.5)_42%,oklch(0.09_0.012_150/0.94)_100%)]"
          />

          {/* Overlay message + CTA — anchored to the lower band, poster-style */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 sm:p-10 lg:p-12">
            <div className="max-w-xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cedar/70 mb-3">
                22 locations · 5 continents · 10+ years
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-balance text-mist drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
                From <em className="not-italic text-cedar">one market</em> to{" "}
                <em className="not-italic text-mist">the world.</em>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-stone/80">
                Each role lit up the map. From Chicago to São Paulo, Great Falls to Cape Town.
                Follow the journey, role by role.
              </p>
              <div className="pointer-events-auto mt-6">
                <Link
                  to="/career"
                  className="group inline-flex items-center gap-3 rounded-full bg-[image:var(--gradient-cedar)] px-8 py-4 text-primary-foreground font-medium shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
                >
                  See the journey
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Orbit hint — top-right, clear of the headline band */}
          <div className="absolute top-4 right-5 font-mono text-[9px] uppercase tracking-widest text-stone/40 pointer-events-none">
            Drag to orbit
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {[
            { label: "Roots", color: "bg-[#e8d5c0]" },
            { label: "Hubs", color: "bg-[#c49a6c]" },
            { label: "International", color: "bg-[#8a6a4b]" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
