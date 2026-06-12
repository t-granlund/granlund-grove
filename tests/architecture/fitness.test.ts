import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const maxSourceFileLines = 600;
const allowedOversizedFiles = new Set(["src/components/ui/sidebar.tsx"]);

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git", ".vinxi", ".output"].includes(entry.name)) return [];
      return walk(fullPath);
    }

    return [fullPath];
  });
}

describe("architecture fitness", () => {
  it("keeps the BDS planning database present", () => {
    for (const filePath of [
      "docs/planning/README.md",
      "docs/planning/roadmap.md",
      "docs/planning/backlog.md",
      "docs/planning/testing-strategy.md",
    ]) {
      expect(existsSync(join(root, filePath)), `${filePath} should exist`).toBe(true);
    }
  });

  it("keeps source files under the 600-line guideline unless explicitly allowed", () => {
    const offenders = walk(join(root, "src"))
      .filter((filePath) => /\.(ts|tsx|css)$/.test(filePath))
      .filter((filePath) => statSync(filePath).isFile())
      .map((filePath) => ({
        filePath,
        relative: filePath.replace(`${root}/`, ""),
        lines: readFileSync(filePath, "utf8").split("\n").length,
      }))
      .filter(
        ({ relative, lines }) => lines > maxSourceFileLines && !allowedOversizedFiles.has(relative),
      );

    expect(offenders).toEqual([]);
  });

  it("keeps the three resume PDF variants hosted", () => {
    for (const file of [
      "public/resume/Tyler-Granlund-Master-Resume.pdf",
      "public/resume/Tyler-Granlund-Resume-AI-PM.pdf",
      "public/resume/Tyler-Granlund-Resume-FDE.pdf",
    ]) {
      expect(existsSync(join(root, file)), `${file} should exist`).toBe(true);
    }
  });

  it("tracks the current CSP hardening debt explicitly", () => {
    const headers = readFileSync(join(root, "public/_headers"), "utf8");
    expect(headers).toContain("Content-Security-Policy");
    expect(headers).toContain("script-src 'self' 'unsafe-inline'");
  });
});
