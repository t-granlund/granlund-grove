import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

// The base favicon SVG (already written to public/favicon.svg)
const faviconSvg = readFileSync("public/favicon.svg", "utf8");

// Regular render: just resize the favicon SVG
async function render(size, outPath) {
  await sharp(Buffer.from(faviconSvg)).resize(size, size).png().toFile(outPath);
  console.log(`  ${outPath} (${size}x${size})`);
}

// Maskable: full-bleed square (no rounded corners), tree scaled to ~70%
function scalePath(d, scale, cx, cy) {
  // Parse path commands and scale coordinates around center
  return d.replace(/([MLHVZ ])([^MLHVZ ]*)/g, (match, cmd, nums) => {
    if (cmd === "Z" || cmd === "z") return cmd;
    if (!nums.trim()) return cmd;
    const coords = nums.trim().split(/[ ,]+/).filter(Boolean);
    const scaled = coords.map((n, i) => {
      const val = parseFloat(n);
      const axisCenter = i % 2 === 0 ? cx : cy;
      const result = axisCenter + (val - axisCenter) * scale;
      return Math.round(result * 10) / 10;
    });
    return cmd + scaled.join(" ");
  });
}

async function renderMaskable(outPath) {
  const originalD =
    "M24 7 L13.8 22.3 H18.9 L11.25 34.2 H20.6 V41 H27.4 V34.2 H36.75 L29.1 22.3 H34.2 Z";
  const scaledD = scalePath(originalD, 0.7, 24, 24);

  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#1a2620"/>
  <path d="${scaledD}" fill="#c89b6a"/>
</svg>`;

  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(outPath);
  console.log(`  ${outPath} (512x512 maskable)`);
}

console.log("Generating favicon set...");
await render(180, "public/apple-touch-icon.png");
await render(192, "public/icon-192.png");
await render(512, "public/icon-512.png");
await renderMaskable("public/icon-512-maskable.png");
console.log("Done.");
