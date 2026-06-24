import { useState, useRef, useEffect } from "react";
import { SectionLabel } from "./SectionLabel";
import { Picture } from "./Picture";
import { TreeMark } from "./TreeMark";

// Shared field styling. Border is intentionally light enough to meet WCAG 2.2
// 1.4.11 non-text contrast (>=3:1) against the form card; focus swaps to cedar.
const FIELD_CLASS =
  "w-full rounded-xl bg-[oklch(0.16_0.012_150)] border border-[oklch(0.52_0.02_150)] " +
  "focus:border-cedar focus:outline-none focus:ring-2 focus:ring-cedar/40 " +
  "px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resubmitRef = useRef<HTMLButtonElement>(null);
  const done = status === "sent" || status === "fallback";

  // When the success overlay appears, move focus to its action so keyboard
  // users aren't stranded behind it (the fields underneath are covered).
  useEffect(() => {
    if (done) resubmitRef.current?.focus();
  }, [done]);

  return (
    <section id="contact" className="relative pt-32 lg:pt-40 pb-32 lg:pb-40 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Picture
          name="clearing"
          widths={[768, 1280, 1920]}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          decorative
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.18_0.012_150)_0%,oklch(0.18_0.012_150/0.55)_30%,oklch(0.18_0.012_150/0.7)_70%,oklch(0.18_0.012_150)_100%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel index="01" chapter="The Grove Opens">
            Contact
          </SectionLabel>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.04] font-light text-balance">
            Step into <em className="not-italic text-cedar">the clearing.</em>
          </h1>
          <p className="mt-6 text-lg text-stone/90 max-w-xl mx-auto">
            A quiet place in the grove. Send a note. I read everything, and I respond.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { l: "Email", v: "hello@tylergranlund.com", h: "mailto:hello@tylergranlund.com" },
              {
                l: "LinkedIn",
                v: "/in/tylergranlund",
                h: "https://www.linkedin.com/in/tylergranlund",
              },
              { l: "GitHub", v: "@t-granlund", h: "https://github.com/t-granlund" },
              {
                l: "Location",
                v: "Bella Vista, Arkansas",
                h: "https://maps.google.com/?q=Bella+Vista,+Arkansas",
              },
            ].map((c) => (
              <a
                key={c.l}
                href={c.h}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur p-6 lift"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]"
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                      {c.l}
                    </div>
                    <div className="mt-2 font-display text-lg text-foreground group-hover:text-cedar transition-colors">
                      {c.v}
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 text-base leading-none text-transparent transition-colors group-hover:text-cedar/70"
                  >
                    ↗
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-3 relative">
            <form
              ref={formRef}
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const name = String(data.get("name") ?? "");
                const email = String(data.get("email") ?? "");
                const subject = String(data.get("subject") ?? "Website contact");
                const message = String(data.get("message") ?? "");
                const company = String(data.get("company") ?? ""); // honeypot

                const openMailto = () => {
                  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
                  const mailto = `mailto:hello@tylergranlund.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  window.open(mailto, "_self");
                };

                setStatus("sending");
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, subject, message, company }),
                  });
                  if (res.ok) {
                    setStatus("sent");
                    form.reset();
                    return;
                  }
                  // Backend unavailable or rejected — fall back to the mail client.
                  openMailto();
                  setStatus("fallback");
                } catch {
                  openMailto();
                  setStatus("fallback");
                }
              }}
              className="rounded-3xl border border-border bg-card/80 backdrop-blur p-8 lg:p-10 space-y-5"
            >
              {/* Honeypot — off-screen, hidden from humans and AT; bots fill it. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px overflow-hidden"
              />
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" name="name" id="contact-name" autoComplete="name" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  id="contact-email"
                  autoComplete="email"
                />
              </div>
              <Field label="Subject" name="subject" id="contact-subject" autoComplete="off" />
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[image:var(--gradient-cedar)] px-8 py-4 text-primary-foreground font-medium shadow-[var(--shadow-lift)] hover:brightness-110 transition-all duration-300"
                disabled={status === "sending"}
                aria-busy={status === "sending"}
              >
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                    ? "Sent — talk soon."
                    : status === "fallback"
                      ? "Opening your email client…"
                      : "Send message"}
                {status === "idle" && <span aria-hidden="true">&#8594;</span>}
              </button>
              <p
                role="status"
                aria-live="polite"
                className="text-center text-[10px] font-mono text-muted-foreground tracking-wide"
              >
                {status === "sending"
                  ? "Sending your message…"
                  : "Sent securely. If the backend isn't reachable, this opens your email client instead."}
              </p>
            </form>

            {done && (
              <div
                role="status"
                aria-live="polite"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-cedar/40 bg-card/95 backdrop-blur-md p-8 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cedar/40 bg-cedar/10">
                  <TreeMark className="h-7 w-7 text-cedar" />
                </span>
                <h3 className="font-display text-2xl font-light text-foreground">
                  {status === "sent" ? "Thank you." : "Check your email app."}
                </h3>
                <p className="max-w-sm leading-relaxed text-stone/85">
                  {status === "sent"
                    ? "Your message is on its way. I read everything, and I respond."
                    : "I opened your email client to finish sending. If nothing happened, you can send it here instead."}
                </p>
                <button
                  ref={resubmitRef}
                  type="button"
                  onClick={() => {
                    formRef.current?.reset();
                    setStatus("idle");
                  }}
                  className="mt-1 inline-flex items-center gap-2 rounded-full border border-cedar bg-[oklch(0.68_0.12_55/0.1)] px-6 py-3 text-sm text-cedar transition-colors hover:bg-[oklch(0.68_0.12_55/0.18)] focus:outline-none focus:ring-2 focus:ring-cedar/40"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  id,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  id: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className={FIELD_CLASS}
      />
    </div>
  );
}
