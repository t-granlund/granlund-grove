import { z } from "zod";

// Pure, dependency-injected contact logic so the route stays a thin adapter and
// the rules are unit-testable without a server. (bd dev-28e / judge G6.1.)
export const TO = "hello@tylergranlund.com";
export const FROM = "Granlund Grove <noreply@tylergranlund.com>";
export const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional().default("Website contact"),
  message: z.string().trim().min(1).max(5000),
  company: z.string().optional(), // honeypot — humans never fill this
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactResult = { status: number; body: Record<string, unknown> };
type FetchFn = typeof fetch;

/** A filled `company` field means a bot — caller should silently accept. */
export function isHoneypotTriggered(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null) return false;
  const company = (raw as { company?: unknown }).company;
  return typeof company === "string" && company.trim() !== "";
}

/**
 * Validate, honeypot-screen, and (when configured) deliver a contact message.
 * Returns a status + JSON body for the route to echo. `fetchFn` is injectable
 * for tests; `apiKey` absent => 501 so the client falls back to mailto.
 */
export async function processContact(
  raw: unknown,
  opts: { apiKey?: string; fetchFn?: FetchFn } = {},
): Promise<ContactResult> {
  if (isHoneypotTriggered(raw)) {
    return { status: 200, body: { ok: true } };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { ok: false, error: "Invalid input" } };
  }
  const { name, email, subject, message } = parsed.data;

  if (!opts.apiKey) {
    return {
      status: 501,
      body: { ok: false, fallback: true, error: "Email backend not configured" },
    };
  }

  const doFetch = opts.fetchFn ?? fetch;
  try {
    const res = await doFetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `[tylergranlund.com] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return { status: 502, body: { ok: false, fallback: true, error: "Delivery failed" } };
    }
    return { status: 200, body: { ok: true } };
  } catch {
    return { status: 502, body: { ok: false, fallback: true, error: "Delivery error" } };
  }
}
