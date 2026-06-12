import { useState, useRef, useEffect } from "react";
import { SectionLabel } from "./SectionLabel";
import { Picture } from "./Picture";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const formRef = useRef<HTMLFormElement>(null);

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
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-[1.04] font-light text-balance">
            Step into <em className="not-italic text-cedar">the clearing.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-xl mx-auto">
            A quiet place in the grove. Send a note — I read everything, and I respond.
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
                className="block group rounded-2xl border border-border bg-card/70 backdrop-blur p-6 lift"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                  {c.l}
                </div>
                <div className="mt-2 font-display text-lg text-foreground group-hover:text-cedar transition-colors">
                  {c.v}
                </div>
              </a>
            ))}
          </div>

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
            className="lg:col-span-3 rounded-3xl border border-border bg-card/80 backdrop-blur p-8 lg:p-10 space-y-5"
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
                className="w-full rounded-xl bg-[oklch(0.16_0.012_150)] border border-border focus:border-cedar focus:outline-none focus:ring-2 focus:ring-cedar/30 px-4 py-3 text-foreground transition-colors resize-none"
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
                : status === "sent"
                  ? "Thanks — your message is on its way."
                  : status === "fallback"
                    ? "Opening your email client to finish sending…"
                    : "Sent securely. If the backend isn't reachable, this opens your email client instead."}
            </p>
          </form>
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
        className="w-full rounded-xl bg-[oklch(0.16_0.012_150)] border border-border focus:border-cedar focus:outline-none focus:ring-2 focus:ring-cedar/30 px-4 py-3 text-foreground transition-colors"
      />
    </div>
  );
}
