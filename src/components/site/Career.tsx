import { SectionLabel } from "./SectionLabel";
import { careerRoles } from "@/lib/career-data";

export function Career() {
  return (
    <section id="career" className="relative py-28 lg:py-36 bg-spruce-deep/40">
      <div className="topo-divider absolute top-0 inset-x-0" />
      <div className="topo-divider absolute bottom-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="02" chapter="The Record">
            Career
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            The roles, <em className="not-italic text-cedar">in brief.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            The journey above is the story forward. This is the résumé view. Most recent first, the
            scope and the outcomes that marked each turn.
          </p>
          <p className="mt-4 text-base text-stone/70 max-w-2xl">
            The thread never changed: orchestrate the messy, cross-functional problems into a clear
            direction, align the people who have to live with the outcome, then ship fast and
            iterate &mdash; owning security, data privacy, and the IT debt and shadow IT most teams
            would rather ignore, so the day-to-day actually gets easier.
          </p>
        </div>

        <ol className="mt-14 space-y-4">
          {careerRoles.map((r) => (
            <li key={`${r.company}-${r.role}`}>
              <article className="group grid gap-4 rounded-2xl border border-border bg-card/70 p-6 lg:grid-cols-[210px_1fr] lg:gap-10 lg:p-8 lift">
                {/* left rail — when + where */}
                <div className="lg:border-r lg:border-border/60 lg:pr-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cedar">
                    {r.dates}
                  </div>
                  <div className="mt-2 font-display text-lg text-foreground leading-snug">
                    {r.company}
                  </div>
                </div>

                {/* right — role, summary, outcomes */}
                <div>
                  <h3 className="font-display text-xl lg:text-2xl text-foreground group-hover:text-cedar transition-colors">
                    {r.role}
                  </h3>
                  <p className="mt-3 text-sm lg:text-[15px] text-stone/85 leading-relaxed">
                    {r.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {r.outcomes.map((o) => (
                      <li
                        key={o}
                        className="text-xs px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.4)] text-stone/90"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
