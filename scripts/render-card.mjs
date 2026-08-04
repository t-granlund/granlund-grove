#!/usr/bin/env node
/**
 * bc-05 — Business card PDF renderer.
 *
 * Boots a vite dev server, captures /brand/card with Playwright page.pdf()
 * (Chromium print pipeline), and emits:
 *
 *   dist/card/granlund-card.pdf          2-page vector PDF, 3.75×2.25in pages
 *   dist/card/card-front.png             300-DPI raster, front face (bc-08/11)
 *   dist/card/card-back.png              300-DPI raster, back face (bc-08/11)
 *
 * Per layout-spec §6: preferCSSPageSize picks up the route's
 * `@page { size: 3.75in 2.25in; margin: 0 }`, printBackground keeps the dark
 * ground, and we wait on document.fonts.ready so Fraunces/Inter are embedded
 * before capture (bc-10 verifies `pdffonts` emb=yes).
 */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "dist", "card");
const CARD_PATH = "/brand/card"; // NO ?guides=1 — guides are review-only
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

mkdirSync(OUT_DIR, { recursive: true });

function startDevServer() {
  const proc = spawn("npx", ["vite", "dev", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return new Promise((resolvePromise, reject) => {
    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error("vite dev server did not come up within 30s"));
    }, 30_000);
    proc.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Local:")) {
        clearTimeout(timeout);
        resolvePromise(proc);
      }
    });
    proc.on("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`vite dev exited early (code ${code})`));
    });
  });
}

const server = await startDevServer();
console.log(`render-card: vite dev up on ${BASE_URL}`);

try {
  const browser = await chromium.launch();
  try {
    // deviceScaleFactor 3.125 = 300dpi from CSS's 96dpi reference (bc-08/11).
    const page = await browser.newPage({ deviceScaleFactor: 3.125 });
    await page.goto(`${BASE_URL}${CARD_PATH}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // 300-DPI per-face rasters (bc-08 baseline / bc-11 QR-decode QA).
    // 3.75in × 2.25in at 300dpi = 1125×675 px; deviceScaleFactor 3.125 from
    // CSS's 96dpi reference, scale:"device" keeps the native (scaled) pixels.
    const faces = await page.locator(".card-page").all();
    const names = ["card-front.png", "card-back.png"];
    if (faces.length !== 2) {
      throw new Error(`render-card: expected 2 .card-page elements, got ${faces.length}`);
    }
    for (const [i, face] of faces.entries()) {
      await face.screenshot({ path: join(OUT_DIR, names[i]), scale: "device" });
    }

    // Print media capture → final 2-page PDF.
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: join(OUT_DIR, "granlund-card.pdf"),
      width: "3.75in",
      height: "2.25in",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    console.log(`render-card: wrote ${join(OUT_DIR, "granlund-card.pdf")}`);
    console.log(`render-card: wrote ${names.map((n) => join(OUT_DIR, n)).join(", ")}`);
    console.log("render-card: expect MediaBox 270×162 pt per page (bc-10 verifies)");
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
