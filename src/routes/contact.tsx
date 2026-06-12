import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Contact } from "@/components/site/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tyler Granlund" },
      {
        name: "description",
        content:
          "Get in touch with Tyler Granlund — send a note, or reach out on LinkedIn or GitHub. Based in Bella Vista, Arkansas.",
      },
      { property: "og:title", content: "Contact — Tyler Granlund" },
      { property: "og:description", content: "Step into the clearing. Send a note." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/contact" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <Contact />
      </main>
      <Footer />
    </>
  );
}
