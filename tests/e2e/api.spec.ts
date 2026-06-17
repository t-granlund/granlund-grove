import { expect, test } from "@playwright/test";

test.describe("contact API endpoint", () => {
  test("POST /api/contact returns 501 when backend is not configured", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "Hello world",
      },
    });
    expect(res.status()).toBe(501);
    const body = await res.json();
    expect(body.fallback).toBe(true);
  });

  test("POST /api/contact rejects invalid JSON", async ({ request }) => {
    // Send raw bytes that are not valid JSON — Playwright may auto-wrap a string
    // in quotes, so we assert the error is one of the documented shapes.
    const res = await request.post("/api/contact", {
      data: "{not valid json",
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    // Either "Invalid JSON" (parse failure) or "Invalid input" (schema failure)
    expect(["Invalid JSON", "Invalid input"]).toContain(body.error);
  });

  test("POST /api/contact rejects missing name", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: { email: "test@example.com", message: "Hello" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/contact rejects invalid email", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test",
        email: "not-an-email",
        message: "Hello",
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/contact rejects empty message", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test",
        email: "test@example.com",
        message: "",
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test("POST /api/contact silently accepts honeypot submissions", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Spam Bot",
        email: "spam@evil.com",
        message: "Buy my stuff",
        company: "Evil Corp",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("POST /api/contact caps subject length", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test",
        email: "test@example.com",
        subject: "x".repeat(201),
        message: "Hello",
      },
    });
    expect(res.status()).toBe(400);
  });

  test("POST /api/contact caps message length", async ({ request }) => {
    const res = await request.post("/api/contact", {
      data: {
        name: "Test",
        email: "test@example.com",
        message: "x".repeat(5001),
      },
    });
    expect(res.status()).toBe(400);
  });

  test("GET /api/contact returns the route page (TanStack Start does not auto-405)", async ({
    request,
  }) => {
    // TanStack Start file-routes serve the page for GET by default.
    // The POST handler only applies to POST requests.
    const res = await request.get("/api/contact");
    expect([200, 404]).toContain(res.status());
  });
});
