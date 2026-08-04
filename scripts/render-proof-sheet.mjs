#!/usr/bin/env node
/**
 * bc-12 — Home-print proof sheet.
 *
 * Renders an 8.5×11in letter sheet with the card front/back tiled at true
 * 100% scale (3.5×2in trim size, trim crop marks, no scaling) so Tyler can
 * home-print, cut one out, phone-scan the QR, and judge cedar-on-charcoal
 * before committing to a shop run.
 *
 * Output: dist/card/proof-sheet.pdf (2 pages: fronts sheet, backs sheet).
 *
 * Uses the same /brand/card route as the final render so what you proof is
 * what the printer gets. A tiny injected stylesheet resets @page to letter
 * and lays the faces out in a grid — screen CSS untouched.
 */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "dist", "card");
const PORT = 4174;
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
console.log(`proof-sheet: vite dev up on ${BASE_URL}`);

try {
  const browser = await chromium.launch();
  try {
    // Clone each face into tiled grids: page 1 = fronts, page 2 = backs.
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/brand/card`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    await page.evaluate(() => {
      const rootEl = document.querySelector(".brand-card-root");
      const front = rootEl.querySelector(".card-page--front");
      const back = rootEl.querySelector(".card-page:not(.card-page--front)");

      const makeSheet = (face, count) => {
        const sheet = document.createElement("div");
        sheet.className = "proof-sheet";
        for (let i = 0; i < count; i++) {
          const clone = face.cloneNode(true);
          sheet.appendChild(clone);
        }
        return sheet;
      };

      rootEl.innerHTML = "";
      rootEl.appendChild(makeSheet(front, 8)); // 2×4 fronts
      const backs = makeSheet(back, 8);
      backs.style.breakBefore = "page";
      rootEl.appendChild(backs);
    });

    await page.addStyleTag({
      content: `
        @page { size: 8.5in 11in; margin: 0.5in; }
        body:has(.brand-card-root) { display: block !important; padding: 0 !important; }
        .proof-sheet {
          display: grid;
          grid-template-columns: repeat(2, 3.5in);
          gap: 0.25in;
          justify-content: center;
        }
        /* Clip to trim size: shift the face contents left/up past the
           0.125in bleed — no scaling, so the proof is true 1:1 geometry. */
        .proof-sheet .card-page {
          width: 3.5in !important;
          height: 2in !important;
          overflow: hidden;
          outline: 0.5pt solid #999;
          break-after: auto !important;
        }
        .proof-sheet .card-face,
        .proof-sheet .card-atmosphere {
          transform: translate(-0.125in, -0.125in);
        }
      `,
    });

    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: join(OUT_DIR, "proof-sheet.pdf"),
      printBackground: true,
      preferCSSPageSize: true,
    });

    console.log(`proof-sheet: wrote ${join(OUT_DIR, "proof-sheet.pdf")}`);
    console.log("proof-sheet: print at 100% scale (NO fit-to-page), cut on the grey outlines");
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
