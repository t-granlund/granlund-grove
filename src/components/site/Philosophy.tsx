import { SectionLabel } from "./SectionLabel";

const tenets = [
  {
    n: "I",
    t: "Clear the undergrowth",
    b: "Remove what blocks people from doing their best work — noise, friction, dead processes.",
  },
  {
    n: "II",
    t: "Bridge the canopy",
    b: "Connect tools, data, and teams so handoffs feel seamless and light reaches every layer.",
  },
  {
    n: "III",
    t: "Blaze the trail",
    b: "Document, train, and make the way forward visible — so others can walk it without a guide.",
  },
  {
    n: "IV",
    t: "Deepen the roots",
    b: "Design for resilience — every system supports the next, and the grove holds through every storm.",
  },
];

export function Philosophy() {
  return (
    <section id="philosophy" className="relative py-32 lg:py-44 overflow-hidden">
      {/* atmospheric backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,oklch(0.32_0.045_158/0.55),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(oklch(0.85_0.02_90/1)_1px,transparent_1px)] [background-size:1px_3px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel index="02" chapter="The Compass">
            Philosophy
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.04] font-light text-balance">
            Technology should feel like a <em className="not-italic text-cedar">trail</em>,
            <br className="hidden sm:block" /> not a maze.
          </h2>
          <p className="mt-8 text-lg sm:text-xl text-stone/90 max-w-2xl mx-auto leading-relaxed">
            The best systems create flow, visibility, accountability, and trust. My work is about
            helping teams move through complexity with confidence.
          </p>
        </div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tenets.map((t) => (
            <div
              key={t.n}
              className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur p-7 lift"
            >
              <div className="font-display text-cedar text-3xl italic">{t.n}</div>
              <h3 className="mt-4 font-display text-xl">{t.t}</h3>
              <p className="mt-3 text-sm text-stone/85 leading-relaxed">{t.b}</p>
              <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-cedar/0 via-cedar/40 to-cedar/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
