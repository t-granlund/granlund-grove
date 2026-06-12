import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SECURITY_HEADERS, applySecurityHeaders } from "../../src/lib/security-headers";

const root = process.cwd();

// Regression guard for the launch bug the Solutions Architect caught: security
// headers in public/_headers never reach SSR pages, so they MUST be applied in
// the Worker. These tests fail loudly if that wiring is ever removed.
describe("security headers", () => {
  it("defines a CSP locked to self (+ the analytics beacon)", () => {
    const csp = SECURITY_HEADERS["Content-Security-Policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    // Cloudflare Web Analytics beacon must be allow-listed or analytics breaks.
    expect(csp).toContain("https://static.cloudflareinsights.com");
  });

  it("ships preload-eligible HSTS", () => {
    expect(SECURITY_HEADERS["Strict-Transport-Security"]).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );
  });

  it("sets the rest of the baseline header set", () => {
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
    expect(SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
    expect(SECURITY_HEADERS["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(SECURITY_HEADERS["Permissions-Policy"]).toContain("geolocation=()");
  });

  it("applies every header to a response without clobbering existing values", () => {
    const headers = new Headers({ "Referrer-Policy": "no-referrer" });
    applySecurityHeaders(headers);
    // existing value preserved
    expect(headers.get("Referrer-Policy")).toBe("no-referrer");
    // everything else applied
    expect(headers.get("Content-Security-Policy")).toContain("default-src 'self'");
    expect(headers.get("Strict-Transport-Security")).toContain("preload");
  });

  it("is actually wired into the Worker entry (src/server.ts)", () => {
    const server = readFileSync(join(root, "src/server.ts"), "utf8");
    expect(server).toContain("applySecurityHeaders");
  });
});
