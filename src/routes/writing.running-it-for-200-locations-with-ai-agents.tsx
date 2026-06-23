import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { postBySlug } from "@/lib/writing/posts";

const SLUG = "running-it-for-200-locations-with-ai-agents";
const post = postBySlug(SLUG)!;
const URL = `https://tylergranlund.com/writing/${SLUG}`;

export const Route = createFileRoute("/writing/running-it-for-200-locations-with-ai-agents")({
  head: () => ({
    meta: [
      { title: `${post.title} — Tyler Granlund` },
      { name: "description", content: post.description },
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
      { property: "article:published_time", content: post.dateISO },
      { property: "article:author", content: "Tyler Granlund" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PostPage,
});

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": URL,
  headline: post.title,
  description: post.description,
  datePublished: post.dateISO,
  dateModified: post.dateISO,
  author: { "@id": "https://tylergranlund.com/#person" },
  publisher: { "@id": "https://tylergranlund.com/#person" },
  mainEntityOfPage: URL,
  keywords: post.tags.join(", "),
  isPartOf: { "@id": "https://tylergranlund.com/#website" },
};

function PostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <article className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6">
            {/* back link */}
            <a
              href="/writing"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cedar hover:text-mist transition-colors"
            >
              <span aria-hidden>←</span> Writing
            </a>

            {/* header */}
            <header className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cedar/80">
                Field Notes · {post.date} · {post.readingMinutes} min read
              </div>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.06] font-light text-balance">
                Running IT for 200+ locations with{" "}
                <em className="not-italic text-cedar">supervised AI agents.</em>
              </h1>
              <p className="mt-6 text-lg text-stone/90 leading-relaxed">
                For two years I was the IT function for a five-brand, 200-plus-location franchise
                group — a lean team and a private-equity budget, against an estate most companies
                staff with a department. The way that math works is supervised AI agents. Here is
                how I built it, and what I would tell anyone trying the same.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.3)] text-stone/85"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* body */}
            <div className="mt-12 space-y-5 text-stone/90 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:text-mist [&_h2]:font-light [&_h2]:mt-12 [&_h2]:mb-1 [&_strong]:text-mist [&_strong]:font-medium [&_em]:not-italic [&_em]:text-cedar">
              <h2>The constraint shaped the method</h2>
              <p>
                Five brands, 200-plus locations, five Microsoft tenants, and a budget that did not
                include hiring a platform team. I could not out-staff the problem, so I built
                capacity instead: production systems built with supervised AI agents. The agent I
                used is <strong>Code Puppy</strong>, the open-source coding agent adopted at
                Walmart, where it won the company&apos;s President&apos;s Innovation Award. I did
                not build the agent — I built <em>with</em> it, under tight supervision.
              </p>

              <h2>Supervision is the product, not the model</h2>
              <p>
                The interesting part of agent work is not the model — it is the system around it. I
                ran a planner agent that orchestrated specialists: a crawler, a programmer, a
                code-reviewer, a security-auditor. Every destructive action waited behind a
                human-in-the-loop gate, and every release had to clear an evaluation harness — a
                judge — before it shipped. <strong>Control Tower</strong>, the governance plane
                across the five tenants, ships behind 7,386 automated tests and a 48/48 judge score.
                The judge caught regressions the test suite missed and quietly became the real
                release gate. If you take one thing from this:{" "}
                <em>stand up the eval harness first.</em>
              </p>

              <h2>Identity is the filter, not an afterthought</h2>
              <p>
                <strong>Knowledge Fabric</strong> answers support questions drawn from more than
                100,000 help-desk tickets, plus point-of-sale configs and SharePoint. The hard part
                was never search — it was that answers have to respect brand and role boundaries.
                Staff in one brand should never surface another brand&apos;s playbook. So it is
                grounded on Entra ID — 1,523 verified identities across a 15-slot attribute schema —
                and identity is the filter on every retrieval, not a check bolted on later. Phase
                one closed at 52/52 QA checks.
              </p>

              <h2>You cannot govern what you cannot see</h2>
              <p>
                <strong>Estate Trace</strong> started from a question no one could answer: what do
                we run, and what does it cost — across 41 repos, 11 subscriptions, roughly 196 Azure
                resources, and reseller-billed licensing. It pulls all of that, read-only, into a
                DuckDB warehouse and one canonical workbook, and 12 of 12 verification checks have
                to pass before that workbook is published as source of truth. It quantified the IT
                run-rate and a roughly 40% optimization path with 25 prioritized actions. Once
                people trusted the numbers, every cost conversation started there.
              </p>

              <h2>Zero stored secrets</h2>
              <p>
                None of this stores a credential. Automation authenticates to Azure with OIDC
                workload identity federation across all five tenants — no client secrets in repos,
                no API keys in CI, no rotation nightmares. For a multi-tenant estate, removing an
                entire class of secret-handling risk was worth more than the hours it took to wire.
              </p>

              <h2>What I would tell you</h2>
              <p>
                Supervise, do not trust — the gates are the point. Ground on identity from day one;
                retrofitting role boundaries later is painful. And measure before you optimize. I
                left the group before the framework was rolled out portfolio-wide, which is exactly
                why I am open-sourcing the governance layer as <strong>TenantFleet</strong> — the
                patterns worked, and other franchise operators, MSPs, and PE-backed teams should not
                have to rebuild them from scratch.
              </p>
              <p>
                The through-line is the same as every role I have had: understand what people
                actually need, then remove the technological obstacles that make their day harder.
                Agents just let a small team do that at a scale that used to require a big one.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-cedar/30 bg-cedar/[0.06] p-7 lg:p-8">
              <p className="text-stone/90 leading-relaxed">
                Building something that needs this kind of system?{" "}
                <a
                  href="/contact"
                  className="text-cedar hover:text-mist underline underline-offset-2"
                >
                  Let&apos;s talk
                </a>{" "}
                — or see the{" "}
                <a href="/work" className="text-cedar hover:text-mist underline underline-offset-2">
                  case studies
                </a>
                .
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
