import { describe, expect, it, vi } from "vitest";
import { FROM, RESEND_ENDPOINT, TO, isHoneypotTriggered, processContact } from "@/lib/contact";

const valid = {
  name: "Tyler Granlund",
  email: "hello@example.com",
  subject: "Hello",
  message: "I would like to chat about an FDE role.",
};

function okFetch() {
  return vi.fn(
    async (_url: string | URL | Request, _init?: RequestInit) =>
      new Response("{}", { status: 200 }),
  );
}

describe("isHoneypotTriggered", () => {
  it("is false for normal payloads and non-objects", () => {
    expect(isHoneypotTriggered(valid)).toBe(false);
    expect(isHoneypotTriggered({ company: "" })).toBe(false);
    expect(isHoneypotTriggered({ company: "   " })).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered("nope")).toBe(false);
  });

  it("is true when the honeypot is filled", () => {
    expect(isHoneypotTriggered({ company: "Acme Corp" })).toBe(true);
  });
});

describe("processContact", () => {
  it("silently accepts honeypot hits without sending", async () => {
    const fetchFn = okFetch();
    const res = await processContact({ ...valid, company: "spam" }, { apiKey: "key", fetchFn });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("rejects a missing name", async () => {
    const res = await processContact({ ...valid, name: "" }, { apiKey: "key" });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("rejects an invalid email", async () => {
    const res = await processContact({ ...valid, email: "not-an-email" }, { apiKey: "key" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing message", async () => {
    const res = await processContact({ ...valid, message: "" }, { apiKey: "key" });
    expect(res.status).toBe(400);
  });

  it("rejects an over-long subject", async () => {
    const res = await processContact({ ...valid, subject: "x".repeat(201) }, { apiKey: "key" });
    expect(res.status).toBe(400);
  });

  it("rejects an over-long message", async () => {
    const res = await processContact({ ...valid, message: "x".repeat(5001) }, { apiKey: "key" });
    expect(res.status).toBe(400);
  });

  it("returns 501 fallback when no API key is configured", async () => {
    const res = await processContact(valid, {});
    expect(res.status).toBe(501);
    expect(res.body.fallback).toBe(true);
  });

  it("delivers via the injected fetch when configured", async () => {
    const fetchFn = okFetch();
    const res = await processContact(valid, { apiKey: "key", fetchFn });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe(RESEND_ENDPOINT);
    expect(init?.method).toBe("POST");
    const payload = JSON.parse(String(init?.body));
    expect(payload.from).toBe(FROM);
    expect(payload.to).toEqual([TO]);
    expect(payload.reply_to).toBe(valid.email);
    expect(payload.subject).toContain(valid.subject);
    expect(payload.text).toContain(valid.message);
  });

  it("defaults the subject when omitted", async () => {
    const fetchFn = okFetch();
    const { subject: _omit, ...noSubject } = valid;
    await processContact(noSubject, { apiKey: "key", fetchFn });
    const payload = JSON.parse(String(fetchFn.mock.calls[0][1]?.body));
    expect(payload.subject).toContain("Website contact");
  });

  it("returns 502 fallback when the provider responds non-2xx", async () => {
    const fetchFn = vi.fn(async () => new Response("err", { status: 422 }));
    const res = await processContact(valid, { apiKey: "key", fetchFn });
    expect(res.status).toBe(502);
    expect(res.body.fallback).toBe(true);
  });

  it("returns 502 fallback when fetch throws", async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error("network down");
    });
    const res = await processContact(valid, { apiKey: "key", fetchFn });
    expect(res.status).toBe(502);
    expect(res.body.fallback).toBe(true);
  });
});
