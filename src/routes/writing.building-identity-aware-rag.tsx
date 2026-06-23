import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { postBySlug } from "@/lib/writing/posts";

const SLUG = "building-identity-aware-rag";
const post = postBySlug(SLUG)!;
const URL = `https://tylergranlund.com/writing/${SLUG}`;

export const Route = createFileRoute("/writing/building-identity-aware-rag")({
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
                Identity is the filter: building{" "}
                <em className="not-italic text-cedar">identity-aware RAG.</em>
              </h1>
              <p className="mt-6 text-lg text-stone/90 leading-relaxed">
                A support assistant that can answer from 100,000-plus tickets is easy to demo and
                hard to ship — because the moment it works, it knows too much. For a five-brand
                company the hard problem in retrieval was never finding the answer. It was making
                sure the person asking was allowed to see it. Here is how I built Knowledge Fabric
                so identity does the filtering, and why that decision had to come first.
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
              <h2>The problem was never search</h2>
              <p>
                <strong>Knowledge Fabric</strong> answers support questions from more than 100,000
                help-desk tickets, plus point-of-sale configs and SharePoint. Standard retrieval —
                embed the corpus, match the question, return the closest chunks — gets you a working
                demo in an afternoon. Then you remember the corpus spans five brands. A front-desk
                lead at one brand asking how to refund a membership should never get back another
                brand&apos;s playbook, another brand&apos;s pricing, or a note meant for a regional
                manager. The hard part is not relevance.{" "}
                <em>The right answer for one person is a leak for another.</em>
              </p>

              <h2>Identity is the filter, not a redaction step</h2>
              <p>
                The tempting shortcut is to retrieve first and scrub after — pull the best chunks,
                then strip the ones this user should not see. That fails two ways: the sensitive
                content already rode through the model&apos;s context, and the answer quietly
                degrades because you deleted material it was reasoning over. So I pushed identity to
                the front. Knowledge Fabric is grounded on Entra ID —{" "}
                <strong>1,523 verified identities across a 15-slot attribute schema</strong> — and
                those attributes become a filter applied <em>at retrieval</em>, before a single
                chunk reaches the model. You do not retrieve and redact. You retrieve only what this
                identity is allowed to see.
              </p>

              <h2>Attributes scale where role lists don&apos;t</h2>
              <p>
                Five brands, several roles, regions on top of that — model it as static role lists
                and you are hand-maintaining a combinatorial mess forever. The 15-slot attribute
                schema is what made it tractable: every chunk is tagged with the attributes required
                to see it, every identity carries its attributes from Entra, and access is simply
                the match between the two. Add a brand or a role and you are adding attribute
                values, not rewriting access rules. Attribute-based access is more work to stand up
                than a role dropdown, and far less work to live with.
              </p>

              <h2>Grounded answers, with receipts</h2>
              <p>
                Every answer cites where it came from — the ticket, the POS config, the SharePoint
                doc. That is partly trust: a support lead can click through and verify instead of
                taking the model&apos;s word. It is also a guardrail — an assistant that has to cite
                a source has a harder time inventing one. Grounding plus identity-filtered retrieval
                means the model only ever sees a small, authorized, relevant slice of the corpus,
                which is also why it answers quickly and stays on topic.
              </p>

              <h2>How I knew it actually held</h2>
              <p>
                Boundary logic is exactly the kind of thing that looks right in a demo and leaks in
                week three, so phase one did not ship on vibes — it closed at{" "}
                <strong>52/52 QA checks</strong>, and the access-boundary cases were the ones I
                cared about most. Can one brand reach another brand&apos;s content? Does a role
                change immediately narrow what is retrievable? Does an identity with missing
                attributes fail closed — return nothing — instead of failing open? The eval harness
                was the release gate. If a boundary check failed, it did not ship.
              </p>

              <h2>What I would tell you</h2>
              <p>
                Decide who is allowed to see what <em>before</em> you tune retrieval quality —
                boundaries are load-bearing and retrofitting them is miserable. Filter at retrieval,
                not after. Reach for attributes over roles the moment access has more than one
                dimension. And write the boundary tests first, because those are the ones that fail
                quietly. I left the franchise group before Knowledge Fabric rolled out
                portfolio-wide, which is why the identity-aware patterns are going open source as
                part of <strong>TenantFleet</strong> — the boundary problem is not unique to one
                company, and nobody should have to rediscover &ldquo;filter on identity, not
                after&rdquo; the hard way.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-cedar/30 bg-cedar/[0.06] p-7 lg:p-8">
              <p className="text-stone/90 leading-relaxed">
                Building retrieval that has to respect who is asking?{" "}
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
