import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { SectionLabel } from "@/components/site/SectionLabel";
import { posts } from "@/lib/writing/posts";

export const Route = createFileRoute("/writing/")({
  head: () => ({
    meta: [
      { title: "Writing — Tyler Granlund" },
      {
        name: "description",
        content:
          "Field notes from the work — building production systems with supervised AI agents, franchise-scale IT, identity governance, and cloud cost.",
      },
      { property: "og:title", content: "Writing — Tyler Granlund" },
      {
        property: "og:description",
        content:
          "Field notes on supervised AI agents, franchise-scale IT, and identity governance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/writing" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/writing" }],
  }),
  component: WritingIndexPage,
});

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://tylergranlund.com/writing",
  name: "Writing — Tyler Granlund",
  url: "https://tylergranlund.com/writing",
  isPartOf: { "@id": "https://tylergranlund.com/#website" },
  about: { "@id": "https://tylergranlund.com/#person" },
};

function WritingIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <section className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <SectionLabel index="05" chapter="Field Notes">
              Writing
            </SectionLabel>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
              Notes from <em className="not-italic text-cedar">the work.</em>
            </h1>
            <p className="mt-6 text-lg text-stone/90">
              Short, specific write-ups on what I build and how — supervised AI agents,
              franchise-scale IT, identity governance, and keeping cloud cost honest. No
              think-pieces, just what actually shipped and what I learned.
            </p>

            <ul className="mt-14 space-y-4">
              {posts.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/writing/${post.slug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-border bg-card/70 p-7 lg:p-8 lift"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]"
                    />
                    <div className="relative">
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cedar/80">
                        {post.date} · {post.readingMinutes} min read
                      </div>
                      <h2 className="mt-3 font-display text-2xl lg:text-3xl text-foreground group-hover:text-cedar transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-stone/85 leading-relaxed">{post.description}</p>
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
                      <span
                        aria-hidden
                        className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-cedar transition-colors"
                      >
                        Read
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
