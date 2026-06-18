import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { EcosystemPage } from "@/components/site/EcosystemPage";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "TenantFleet Ecosystem — Tyler Granlund" },
      {
        name: "description",
        content:
          "TenantFleet — A multi-tenant Microsoft Entra ID governance ecosystem. Seven open-source repos for MSPs, PE firms, and multi-brand portfolios.",
      },
      { property: "og:title", content: "TenantFleet Ecosystem — Tyler Granlund" },
      {
        property: "og:description",
        content: "Seven open-source repos for multi-tenant identity governance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/ecosystem" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/ecosystem" }],
  }),
  component: EcosystemRoute,
});

function EcosystemRoute() {
  return (
    <>
      <Nav />
      <main id="main-content" className="relative min-h-screen pt-16" tabIndex={-1}>
        <EcosystemPage />
      </main>
      <Footer />
    </>
  );
}
