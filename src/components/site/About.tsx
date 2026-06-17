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

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
              Rooted in <em className="not-italic text-cedar">systems.</em>
              <br />
              Driven by <em className="not-italic text-cedar">people.</em>
            </h2>

            <div className="mt-10 space-y-6 text-lg leading-relaxed text-stone/90 max-w-2xl">
              <p>
                I&apos;m an IT operations &amp; systems engineer and former Director of IT. My
                career has spanned franchise technology, B2B wholesale e-commerce, B2C
                brick-and-mortar e-commerce, agile product management, Microsoft cloud environments,
                data and BI modernization, and cross-functional transformation.
              </p>
              <p>
                The thread through every role — whether franchising, wholesale, or retail — has been
                the same: optimize and refine everything based on the needs of the customer. I
                create clear end-to-end agile software development life cycles that help teams
                realize their plan, track it through failure, learn, reiterate, and continuously
                optimize.
              </p>
              <p>
                My mission is simple: support people. Remove technological obstacles so their
                day-to-day is more fulfilling. That permeates the entire ecosystem — creating brand
                ambassadors, making people want to work at a place that helps their home lives be
                better because they are not stressed running their business. Technology should serve
                people, not the other way around.
              </p>
              <p>
                Beyond the day job, I build — enterprise dashboards, AI-powered tools, open-source
                agents, desktop applications, and accessible websites for local businesses. The
                grove doesn&apos;t just tend itself; it grows new trails.
              </p>
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
