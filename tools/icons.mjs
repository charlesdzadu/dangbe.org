// Rasterises public/favicon.svg into the PNG sizes the manifest and Apple need.
//   node tools/icons.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));
const out = [
  ['web-app-manifest-512x512.png', 512],
  ['web-app-manifest-192x192.png', 192],
  ['apple-touch-icon.png', 180],
  ['favicon-96x96.png', 96],
];
for (const [name, size] of out) {
  const dest = fileURLToPath(new URL(`../public/${name}`, import.meta.url));
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(dest);
  console.log(name);
}
