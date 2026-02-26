#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  'Socarrat.JPG',
  'Logo.png',
  'Paella1.png',
  'Paella 3.jpg',
  'Clientes/Cliente1.png',
  'Clientes/Cliente 3.png',
  'Clientes/Cliente 4.png',
  'Clientes/Cliente 5.png',
];

async function convert() {
  for (const file of images) {
    try {
      const fullPath = path.join(__dirname, file);
      if (!fs.existsSync(fullPath)) {
        console.log('Skip (not found):', file);
        continue;
      }
      const dir = path.dirname(file);
      const base = path.basename(file, path.extname(file));
      const outPath = path.join(__dirname, dir, base + '.webp');
      await sharp(fullPath).webp({ quality: 82 }).toFile(outPath);
      const orig = fs.statSync(fullPath).size;
      const webp = fs.statSync(outPath).size;
      const saved = ((1 - webp / orig) * 100).toFixed(1);
      console.log(`✓ ${file} → ${path.join(dir, base + '.webp')} (${saved}% smaller)`);
    } catch (err) {
      console.error('✗', file, err.message);
    }
  }
}
convert();
