// Work-page closers: the Code Puppy "engine" section (the through-line behind
// every system on the page) and a light personal coda.

import { CodePuppyModal } from "./CodePuppyModal";

export function CodePuppy() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="group relative overflow-hidden rounded-3xl border border-cedar/40 bg-[oklch(0.25_0.05_60/0.35)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]"
          />
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                The engine behind all of it
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone/70 px-2.5 py-1 rounded-full border border-cedar/30">
                616 stars · 4,000+ Walmart users
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl lg:text-4xl text-foreground">
              Built with Code Puppy
            </h2>
            <p className="mt-4 text-stone/85 leading-relaxed max-w-2xl">
              Every system above — the flagship case studies and the open-source TenantFleet
              ecosystem — was built with Code Puppy, the open-source AI code agent created by
              Michael Pfaffenberger and John Choi. Adopted internally at Walmart, where they
              received the <span className="text-cedar">President&apos;s Innovation Award</span>{" "}
              from Walmart President &amp; CEO John Furner. 4,000+ store employees now use Code
              Puppy daily. I use it at Head to Toe Brands to run a five-brand, 200+ location
              franchise portfolio with a lean team — building applications, automations, and
              operational efficiencies that would otherwise require a much larger organization.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <CodePuppyModal />
              <a
                href="https://github.com/mpfaffenberger/code_puppy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
              >
                View on GitHub <span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const passions = [
  { t: "Process Innovation", b: "Reframing how teams move from idea to ship." },
  { t: "Trails & Mountain Biking", b: "Northwest Arkansas singletrack as creative fuel." },
  { t: "Family, Community, Nature", b: "The grove that grounds everything else." },
];

export function Passions() {
  return (
    <section className="relative pb-28 lg:pb-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid sm:grid-cols-3 gap-4">
          {passions.map((c) => (
            <div
              key={c.t}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 lift"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]"
              />
              <div className="relative">
                <div className="font-display text-lg text-foreground">{c.t}</div>
                <p className="mt-2 text-sm text-stone/85">{c.b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
