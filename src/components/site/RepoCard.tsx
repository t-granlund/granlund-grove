// Individual repo card for the ecosystem grid

import type { Repo } from "./EcosystemShowcase";

// Forest-palette pillar accents (was off-system indigo/orange/emerald). Three
// distinguishable hues from the site's own gold→green family, with text
// lightness kept readable on the dark card.
const pillarStyles: Record<Repo["pillar"], { gradient: string; badge: string }> = {
  mind: {
    gradient: "from-[oklch(0.78_0.12_55/0.25)] to-[oklch(0.32_0.025_60/0.10)]",
    badge: "bg-[oklch(0.78_0.12_55/0.15)] text-cedar border-[oklch(0.78_0.12_55/0.35)]",
  },
  body: {
    gradient: "from-[oklch(0.55_0.07_150/0.25)] to-[oklch(0.32_0.045_158/0.10)]",
    badge:
      "bg-[oklch(0.55_0.07_150/0.15)] text-[oklch(0.74_0.07_150)] border-[oklch(0.6_0.07_150/0.4)]",
  },
  spirit: {
    gradient: "from-[oklch(0.5_0.06_175/0.25)] to-[oklch(0.32_0.045_158/0.10)]",
    badge:
      "bg-[oklch(0.5_0.06_175/0.15)] text-[oklch(0.72_0.06_175)] border-[oklch(0.55_0.06_175/0.4)]",
  },
};

export function RepoCard({ repo }: { repo: Repo }) {
  const style = pillarStyles[repo.pillar];

  return (
    <article className="group relative rounded-3xl border border-border bg-card/70 overflow-hidden lift flex flex-col">
      {/* Top gradient accent */}
      <div
        aria-hidden
        className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${style.gradient}`}
      />

      <div className="relative p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] border ${style.badge}`}
              >
                {repo.pillar}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl lg:text-3xl text-mist">{repo.name}</h3>
            <p className="mt-1 text-sm text-cedar/90">{repo.tagline}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-5 grid grid-cols-3 gap-4 border-l-2 border-cedar/40 pl-4">
          {repo.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-2xl font-light text-mist">{m.value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-stone/70">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="mt-5 text-sm text-stone/80 leading-relaxed flex-1">{repo.description}</p>

        {/* Features */}
        <div className="mt-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar mb-2">
            Key Features
          </div>
          <ul className="space-y-1.5">
            {repo.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-stone/75">
                <span className="text-cedar mt-0.5" aria-hidden="true">
                  &#8250;
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Stack */}
        <div className="mt-5 flex flex-wrap gap-2">
          {repo.stack.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.15em] text-stone/80 bg-spruce-deep/50 border border-border"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={repo.pages}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cedar/90 px-5 py-2.5 text-sm font-medium text-spruce-deep hover:bg-cedar transition-colors"
          >
            Live Site <span aria-hidden="true">&#8599;</span>
          </a>
          <a
            href={repo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
          >
            GitHub <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>
    </article>
  );
}
