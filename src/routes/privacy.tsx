import { createFileRoute } from "@tanstack/react-router";
import { TreeMark } from "@/components/site/TreeMark";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Tyler Granlund" },
      { name: "description", content: "Privacy policy for tylergranlund.com" },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Privacy Policy — Tyler Granlund" },
      { property: "og:url", content: "https://tylergranlund.com/privacy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-background)]" tabIndex={-1}>
      <div className="mx-auto max-w-3xl px-6 py-32">
        <a
          href="/"
          className="inline-flex items-center gap-2.5 mb-16 hover:opacity-80 transition-opacity"
        >
          <TreeMark className="h-7 w-7 text-cedar" />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Tyler Granlund
          </span>
        </a>

        <h1 className="font-display text-4xl sm:text-5xl font-light text-balance">
          Privacy <em className="not-italic text-cedar">Policy</em>
        </h1>

        <p className="mt-6 text-sm font-mono text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-12 space-y-10 text-stone/90 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Data Collection</h2>
            <p>
              This website collects <strong>no personal data automatically</strong>. There are no
              cookies, no advertising pixels, no cross-site tracking, and no fingerprinting. The
              only data flows are the privacy-first analytics and the contact form described below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Analytics</h2>
            <p>
              This site uses <strong>Cloudflare Web Analytics</strong>, a privacy-first, cookieless
              analytics service. It records aggregate metrics such as page views, referrers, and
              page-load performance.{" "}
              <strong>
                It sets no cookies, uses no localStorage, and does not fingerprint or track you
                across sites.
              </strong>{" "}
              No personally identifying profile is built. This is governed by{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-cedar hover:text-mist transition-colors underline underline-offset-4"
              >
                Cloudflare&apos;s Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Fonts</h2>
            <p>
              All fonts are self-hosted on this domain. No requests are made to Google Fonts or any
              external CDN. Your IP address is never sent to a third party for font loading.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Contact Form</h2>
            <p>
              When you submit the contact form, the name, email, subject, and message you enter are
              transmitted to this site&apos;s server (a Cloudflare Worker) and relayed by email to{" "}
              <code className="font-mono text-cedar text-sm">hello@tylergranlund.com</code> through{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer noopener"
                className="text-cedar hover:text-mist transition-colors underline underline-offset-4"
              >
                Resend
              </a>
              , an email-delivery processor. If that backend is ever unavailable, the form falls
              back to opening your own email client with the message pre-filled instead.
            </p>
            <p className="mt-3">
              I use the details you submit{" "}
              <strong>solely to read and respond to your message</strong>. They are not stored in a
              database beyond the resulting email, never added to a mailing list, and never sold or
              shared. The form also includes a hidden anti-spam field; it is not used to identify
              you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Hosting</h2>
            <p>
              This site is hosted on <strong>Cloudflare Workers</strong>. Cloudflare may process
              request data (IP address, HTTP headers) as part of delivering the website and
              mitigating security threats. This processing is governed by{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-cedar hover:text-mist transition-colors underline underline-offset-4"
              >
                Cloudflare&apos;s Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">
              Global Privacy Control (GPC)
            </h2>
            <p>
              This site honors the <strong>Global Privacy Control (GPC)</strong> signal per CCPA
              §1798.135. If your browser sends the{" "}
              <code className="font-mono text-cedar text-sm">Sec-GPC: 1</code> header, we
              acknowledge and honor your opt-out of personal data sale or sharing. Since we do not
              sell or share personal data in the first place, this is consistent with our existing
              practices.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Third-Party Links</h2>
            <p>
              This site contains links to external sites (LinkedIn, GitHub, Google Maps). These
              sites have their own privacy policies, which we encourage you to read. We are not
              responsible for the privacy practices of third-party sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Your Rights</h2>
            <p>Under applicable data protection laws (GDPR, CCPA), you have the right to:</p>
            <ul className="mt-3 list-disc list-inside space-y-1.5">
              <li>Know what personal data is collected (answer: none automatically)</li>
              <li>Request deletion of any personal data (contact hello@tylergranlund.com)</li>
              <li>Opt out of data sale (we do not sell data)</li>
              <li>Access and port your data (contact hello@tylergranlund.com)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Changes</h2>
            <p>
              This policy may be updated from time to time. The &quot;Last updated&quot; date at the
              top reflects the most recent revision. Continued use of the site constitutes
              acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">Contact</h2>
            <p>
              Questions about this policy? Reach out at{" "}
              <a
                href="mailto:hello@tylergranlund.com"
                className="text-cedar hover:text-mist transition-colors underline underline-offset-4"
              >
                hello@tylergranlund.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-border">
          <a href="/" className="text-cedar hover:text-mist transition-colors text-sm">
            ← Back to the grove
          </a>
        </div>
      </div>
    </main>
  );
}
