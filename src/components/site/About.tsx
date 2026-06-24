import { SectionLabel } from "./SectionLabel";
import { Picture } from "./Picture";

export function About() {
  return (
    <section id="about" className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 lg:col-start-1">
            <SectionLabel index="01" chapter="Roots">
              About
            </SectionLabel>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
              Rooted in <em className="not-italic text-cedar">systems.</em>
              <br />
              Driven by <em className="not-italic text-cedar">people.</em>
            </h1>

            <div className="mt-10 space-y-8 text-lg leading-relaxed text-stone/90 max-w-2xl">
              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-cedar/80">
                  The span
                </h3>
                <p className="mt-3">
                  IT operations &amp; systems engineer and former Director of IT. Franchise
                  technology, B2B wholesale e-commerce, B2C brick-and-mortar e-commerce, agile
                  product management, Microsoft cloud environments, data and BI modernization, and
                  cross-functional transformation.
                </p>
              </div>

              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-cedar/80">
                  How I work
                </h3>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-1 w-1 rounded-full bg-cedar shrink-0" />
                    <span>Optimize and refine everything based on the needs of the customer.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-1 w-1 rounded-full bg-cedar shrink-0" />
                    <span>Create clear end-to-end agile software development life cycles.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 h-1 w-1 rounded-full bg-cedar shrink-0" />
                    <span>
                      Help teams realize their plan, track it through failure, learn, reiterate, and
                      continuously optimize.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-cedar/80">
                  Why it matters
                </h3>
                <p className="mt-3">
                  Support people. Remove technological obstacles so their day-to-day is more
                  fulfilling. Create brand ambassadors by making work less stressful and home lives
                  better. Technology should serve people, not the other way around.
                </p>
              </div>

              <div>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-cedar/80">
                  Beyond the day job
                </h3>
                <p className="mt-3">
                  Enterprise dashboards, AI-powered tools, open-source agents, desktop applications,
                  and accessible websites for local businesses. The grove doesn&apos;t just tend
                  itself. It grows new trails.
                </p>
              </div>
            </div>

            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-lg">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Based
                </dt>
                <dd className="mt-2 text-foreground">Bella Vista, AR</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Role
                </dt>
                <dd className="mt-2 text-foreground">IT Ops &amp; Systems Engineer</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Focus
                </dt>
                <dd className="mt-2 text-foreground">Digital Transformation</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-grove)]">
              <Picture
                name="tyler-headshot"
                widths={[480, 760, 1122]}
                sizes="(min-width: 1024px) 40vw, 100vw"
                width={1122}
                height={1402}
                alt="Tyler Granlund — IT operations and systems engineer, Bella Vista, Arkansas"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
            {/* decorative ring */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full border border-cedar/30 -z-10" />
            <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full border border-cedar/20 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
