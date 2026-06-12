// Headshot dark-grade (bd dev-45b.4). The studio source has a light grey
// backdrop that clashes with the forest-dark theme. Tyler wears all black, so a
// spruce-deep vignette + top/bottom fades swallow the grey edges without
// touching the subject. Bakes the treatment into all responsive variants:
//   node scripts/process-headshot.mjs
//   -> public/img/tyler-headshot-{480,760,1122}.{avif,webp,jpg}
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src/assets/tyler-headshot.png");
const outDir = join(root, "public/img");
const SPRUCE_DEEP = "#0f1a0b"; // slightly greener spruce so the backdrop tints on-theme; still melts into page bg
const WIDTHS = [480, 760, 1122];

// Vignette to spruce-deep (transparent over the face, opaque at the edges) plus
// a hard top fade (pure backdrop above the cap) and a soft bottom fade.
const overlay = (w, h) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="vig" cx="50%" cy="38%" r="74%">
        <stop offset="0%" stop-color="${SPRUCE_DEEP}" stop-opacity="0"/>
        <stop offset="42%" stop-color="${SPRUCE_DEEP}" stop-opacity="0.06"/>
        <stop offset="68%" stop-color="${SPRUCE_DEEP}" stop-opacity="0.5"/>
        <stop offset="86%" stop-color="${SPRUCE_DEEP}" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="${SPRUCE_DEEP}" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${SPRUCE_DEEP}" stop-opacity="0.95"/>
        <stop offset="28%" stop-color="${SPRUCE_DEEP}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bot" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="${SPRUCE_DEEP}" stop-opacity="0.70"/>
        <stop offset="20%" stop-color="${SPRUCE_DEEP}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#vig)"/>
    <rect width="${w}" height="${h}" fill="url(#top)"/>
    <rect width="${w}" height="${h}" fill="url(#bot)"/>
  </svg>`);

const meta = await sharp(src).metadata();
const ratio = meta.height / meta.width;
mkdirSync(outDir, { recursive: true });

console.log("Processing headshot…");
for (const w of WIDTHS) {
  const h = Math.round(w * ratio);
  // Slight cool/darken on the base first, then composite the vignette.
  const composed = await sharp(src)
    .resize(w, h)
    .modulate({ brightness: 1.02, saturation: 0.95 })
    .composite([{ input: overlay(w, h), top: 0, left: 0 }])
    .toBuffer();
  await sharp(composed)
    .avif({ quality: 52 })
    .toFile(join(outDir, `tyler-headshot-${w}.avif`));
  await sharp(composed)
    .webp({ quality: 74 })
    .toFile(join(outDir, `tyler-headshot-${w}.webp`));
  await sharp(composed)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(outDir, `tyler-headshot-${w}.jpg`));
  console.log(`   tyler-headshot-${w}.{avif,webp,jpg} (${w}x${h})`);
}
console.log("Done.");
