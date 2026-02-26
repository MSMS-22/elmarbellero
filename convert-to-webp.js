#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  { file: 'Socarrat.JPG', widths: [400, 800] },
  { file: 'Logo.png', widths: [100, 200] },
  { file: 'Paella1.png', widths: [400, 600] },
  { file: 'Paella 3.jpg', widths: [400, 600] },
  { file: 'Clientes/Cliente1.png', widths: [400, 600] },
  { file: 'Clientes/Cliente 3.png', widths: [400, 600] },
  { file: 'Clientes/Cliente 4.png', widths: [400, 600] },
  { file: 'Clientes/Cliente 5.png', widths: [400, 600] },
];

async function convert() {
  for (const { file, widths } of images) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      console.log('Skip (not found):', file);
      continue;
    }

    const dir = path.dirname(file);
    const base = path.basename(file, path.extname(file));

    // Full-size WebP
    try {
      const outPath = path.join(__dirname, dir, base + '.webp');
      await sharp(fullPath).webp({ quality: 75 }).toFile(outPath);
      const orig = fs.statSync(fullPath).size;
      const webp = fs.statSync(outPath).size;
      const saved = ((1 - webp / orig) * 100).toFixed(1);
      console.log(`✓ ${file} → ${path.join(dir, base + '.webp')} (${saved}% smaller)`);
    } catch (err) {
      console.error('✗', file, err.message);
    }

    // Responsive sizes
    for (const w of widths) {
      try {
        const outPath = path.join(__dirname, dir, `${base}-${w}.webp`);
        await sharp(fullPath).resize(w).webp({ quality: 75 }).toFile(outPath);
        const size = fs.statSync(outPath).size;
        console.log(`  → ${path.join(dir, `${base}-${w}.webp`)} (${(size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error('  ✗', `${base}-${w}.webp`, err.message);
      }
    }
  }
}

convert();
