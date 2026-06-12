import { TreeMark } from "./TreeMark";

// The proof band. Architectural firms lead with "47 countries · 200+ projects";
// this is the same move for a systems engineer. Every figure here is VERIFIED
// non-financial (docs/NUMBER_VERIFICATION.md, bd dev-kxh closed 2026-06-11).
// DOLLAR figures are intentionally absent until bd dev-jgu.2 clears — keep this
// list $-free so the band can ship today without tripping the number gate.
type Stat = {
  value: string;
  label: string;
  /** Optional support line for screen readers / context. */
  detail: string;
};

const stats: readonly Stat[] = [
  { value: "19", label: "Systems live", detail: "in production" },
  { value: "5", label: "Brands", detail: "one franchise portfolio" },
  { value: "200+", label: "Locations", detail: "served" },
  { value: "7,386", label: "Tests gating release", detail: "Control Tower CI" },
  { value: "48/48", label: "Judge score", detail: "automated release gate" },
] as const;

export function StatStrip() {
  return (
    <section
      aria-label="Proof of work, by the numbers"
      className="relative border-y border-border bg-card/40 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col gap-1.5 px-2 py-8 text-center max-sm:last:col-span-2 lg:px-6"
            >
              <span className="font-display text-4xl font-light leading-none text-mist sm:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cedar">
                {stat.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/45">
                {stat.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* quiet brand seam */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
          <TreeMark className="h-3 w-3 text-cedar/60" />
        </span>
      </div>
    </section>
  );
}
