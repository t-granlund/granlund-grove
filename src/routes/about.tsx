import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { About } from "@/components/site/About";
import { Prologue } from "@/components/site/Prologue";
import { Philosophy } from "@/components/site/Philosophy";
import { Skills } from "@/components/site/Skills";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tyler Granlund" },
      {
        name: "description",
        content:
          "Who Tyler Granlund is — roots, operating philosophy, and the systems-engineering stack he builds with.",
      },
      { property: "og:title", content: "About — Tyler Granlund" },
      { property: "og:description", content: "Roots, philosophy, and the stack I build with." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/about" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <About />
        <Prologue />
        <Philosophy />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
