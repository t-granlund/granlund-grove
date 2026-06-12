// Downloads four CC-licensed nature photos and processes them into the
// same responsive-image pipeline used by the rest of the grove site.
// Run once: node scripts/download-case-images.mjs
//
// Sources (Openverse / CC licensed for commercial use):
//   bluffs  — "Rugged bluffs near Bella Vista, AR" (Flickr / CC)
//   canopy  — "Forest Canopy Morning" (Wikimedia Commons / CC)
//   creek   — "Ozark Stream" (Flickr / CC)
//   lake    — "Lake through the Trees" (Flickr / CC)
//
// Each source is cropped to a cinematic 1920×600 landscape before sizing,
// so card headers (h-40/h-48, object-cover) look great at every breakpoint.

import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import https from "node:https";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "img");
const tmp = join(__dirname, "..", ".img-tmp");
mkdirSync(tmp, { recursive: true });

const IMAGES = [
  {
    name: "bluffs",
    url: "https://live.staticflickr.com/8021/7489654358_93d0c4f0ac_b.jpg",
    credit: "Rugged bluffs near Bella Vista, AR — Flickr CC",
  },
  {
    name: "canopy",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Forest_Canopy_Morning.jpg",
    credit: "Forest Canopy Morning — Wikimedia Commons CC",
  },
  {
    name: "creek",
    url: "https://live.staticflickr.com/3618/3568158480_5ee467bd47_b.jpg",
    credit: "Ozark Stream — Flickr CC",
  },
  {
    name: "lake",
    url: "https://live.staticflickr.com/5027/5616044063_d3220e474a_b.jpg",
    credit: "Lake through the Trees — Flickr CC",
  },
];

const WIDTHS = [768, 1280, 1920];
const CROP_H = 620; // cinematic landscape crop for card headers

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "granlund-grove/1.0 (portfolio site)" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetch(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function processImage({ name, url, credit }) {
  console.log(`\n▸ ${name}  (${credit})`);
  const src = await fetch(url);
  console.log(`  downloaded ${(src.length / 1024).toFixed(0)} KB`);

  for (const w of WIDTHS) {
    const h = Math.round((w / 1920) * CROP_H);

    for (const [ext, fn] of [
      ["jpg", (s) => s.jpeg({ quality: 85, progressive: true })],
      ["webp", (s) => s.webp({ quality: 82 })],
      ["avif", (s) => s.avif({ quality: 60, effort: 4 })],
    ]) {
      const dest = join(out, `${name}-${w}.${ext}`);
      if (existsSync(dest)) {
        console.log(`  skip ${name}-${w}.${ext} (exists)`);
        continue;
      }
      await fn(sharp(src).resize(w, h, { fit: "cover", position: "centre" })).toFile(dest);
      console.log(`  wrote ${name}-${w}.${ext}`);
    }
  }
}

console.log("=== Granlund Grove — case-study image download + process ===");
for (const img of IMAGES) {
  await processImage(img);
}
console.log("\n done — images in public/img/");
