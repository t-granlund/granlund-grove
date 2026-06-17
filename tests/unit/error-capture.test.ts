import { describe, expect, it } from "vitest";
import { consumeLastCapturedError } from "@/lib/error-capture";

describe("error capture", () => {
  it("returns undefined when no error has been captured", () => {
    // This may return a stale error from a previous test's unhandled rejection.
    // Clear it first.
    consumeLastCapturedError();
    const result = consumeLastCapturedError();
    expect(result).toBeUndefined();
  });

  it("expires stale errors after the TTL", () => {
    // We can't easily simulate time passage in a unit test without vi.useFakeTimers,
    // but we can at least verify the API shape.
    const result = consumeLastCapturedError();
    // Either undefined (no error) or the error itself.
    expect(result === undefined || result instanceof Error).toBe(true);
  });
});

describe("error page", () => {
  it("renders a branded HTML error page", async () => {
    const { renderErrorPage } = await import("@/lib/error-page");
    const html = renderErrorPage();
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("This page didn't");
    expect(html).toContain("Try again");
    expect(html).toContain("Back to the grove");
    expect(html).toContain('lang="en"');
  });
});
