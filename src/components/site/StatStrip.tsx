import { TreeMark } from "./TreeMark";

// The proof band. Career-spanning figures — years, depth, breadth, and the
// testing discipline that carries across every system. All numbers are
// non-financial and true across the full career (School of Rock, Outdoor Cap,
// HTT Brands / Multi-Brand Franchise Group).
type Stat = {
  value: string;
  label: string;
  /** Optional support line for screen readers / context. */
  detail: string;
};

const stats: readonly Stat[] = [
  { value: "10+", label: "Years", detail: "building production systems" },
  { value: "6", label: "Flagship systems", detail: "deep case studies" },
  { value: "200+", label: "Locations", detail: "operations supported" },
  { value: "7,000+", label: "Tests", detail: "automated quality gate" },
  { value: "48/48", label: "Judge score", detail: "release discipline" },
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
