import { useCallback, useEffect, useRef, useState } from "react";
import { TreeMark } from "./TreeMark";
import { CareerWorldMap } from "./CareerWorldMap";
import { careerTimeline, type ImpactStep } from "@/lib/career-data";

function StepCard({
  step,
  index,
  isActive,
  registerNode,
}: {
  step: ImpactStep;
  index: number;
  isActive: boolean;
  registerNode: (index: number, el: HTMLLIElement | null) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // One-way entrance reveal — decoupled from active tracking, which the parent
  // computes from scroll position so the map always matches the centered card.
  const [revealed, setRevealed] = useState(index === 0);

  useEffect(() => {
    const el = ref.current;
    registerNode(index, el);
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, registerNode, revealed]);

  return (
    <li
      ref={ref}
      data-active={isActive}
      className={`relative transition-all duration-700 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {/* connector line into the next chapter */}
      {index < careerTimeline.length - 1 && (
        <div
          aria-hidden
          className="absolute left-6 top-full h-10 lg:h-16 w-px bg-gradient-to-b from-cedar/40 to-transparent"
        />
      )}

      <article
        className={`rounded-2xl border bg-card/70 p-6 lg:p-8 lift transition-colors duration-500 ${
          isActive ? "border-cedar/45 shadow-[var(--shadow-grove)]" : "border-border"
        }`}
      >
        {/* header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                Step 0{index + 1}
              </span>
              <span className="h-px w-8 bg-gradient-to-r from-cedar/50 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/55">
                {step.dates}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl lg:text-3xl text-foreground">
              {step.company}
            </h3>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cedar/90">
              {step.role}
            </div>
          </div>
          <TreeMark className="h-5 w-5 text-cedar/40 shrink-0 mt-1" />
        </div>

        {/* scope stat */}
        <div className="mt-5 flex items-end gap-3 border-y border-border/60 py-4">
          <div className="font-display text-4xl lg:text-5xl font-light text-mist leading-none">
            {step.stat}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/80 pb-1">
            {step.statLabel}
          </div>
          <div className="ml-auto pb-0.5 text-right text-[11px] text-stone/60">
            <span className="text-stone/40">From</span> {step.start}
            <br />
            <span className="text-stone/40">To</span> <span className="text-cedar">{step.end}</span>
          </div>
        </div>

        {/* narrative */}
        <p className="mt-5 text-sm lg:text-[15px] text-stone/85 leading-relaxed">{step.story}</p>

        {/* achievements */}
        <ul className="mt-5 space-y-2.5">
          {step.achievements.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-sm text-stone/85 leading-relaxed">
              <TreeMark className="mt-[3px] h-3.5 w-3.5 text-cedar/70 shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>

        {/* value line — the through-line to the mission */}
        <p className="mt-5 border-l-2 border-cedar/50 pl-4 text-sm italic leading-relaxed text-mist/85">
          {step.value}
        </p>

        {/* location chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {step.locations.map((city) => (
            <span
              key={city}
              className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.3)] text-stone/85"
            >
              {city}
            </span>
          ))}
        </div>

        {/* verifiable sources */}
        {step.sources.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone/55">
              Verify
            </span>
            {step.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone/75 hover:text-cedar transition-colors"
              >
                {s.label}
                <span aria-hidden className="opacity-50 group-hover:opacity-100 transition-opacity">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </article>
    </li>
  );
}

export function CareerImpactTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const nodesRef = useRef<(HTMLLIElement | null)[]>([]);
  const registerNode = useCallback((index: number, el: HTMLLIElement | null) => {
    nodesRef.current[index] = el;
  }, []);

  // Active chapter = the step card whose center is nearest the reading line.
  // Scroll-driven + rAF-throttled so the sticky map always matches what's being
  // read — not whichever card last tripped an IntersectionObserver threshold.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const focus = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      nodesRef.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveStep((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar/80">
            The journey · from one market to the world
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-balance">
            A career measured in <em className="not-italic text-cedar">impact,</em> not titles.
          </h1>
          <p className="mt-5 text-stone/85 leading-relaxed">
            Every role expanded the footprint. From training Mac and Mobile technicians in South
            Chicago to building systems that touch 22 cities across 5 continents. Follow the map as
            each chapter lights up, and read what shipped at every turn.
          </p>
        </div>

        {/* Map leads — full-width on mobile (top), sticky companion on desktop (left) */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.4fr)] lg:gap-12 xl:gap-16 items-start">
          <div className="mb-12 lg:mb-0 lg:sticky lg:top-24">
            <CareerWorldMap activeStep={activeStep} />
          </div>

          <ol className="space-y-10 lg:space-y-16">
            {careerTimeline.map((step, i) => (
              <StepCard
                key={step.company}
                step={step}
                index={i}
                isActive={i === activeStep}
                registerNode={registerNode}
              />
            ))}
          </ol>
        </div>

        {/* closing stat */}
        <div className="mt-20 rounded-3xl border border-cedar/30 bg-cedar/[0.06] p-8 lg:p-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">22</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                cities across 5 continents
              </div>
            </div>
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">150+</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                School of Rock locations opened
              </div>
            </div>
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">200+</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                locations supported
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
