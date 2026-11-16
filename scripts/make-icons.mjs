// Writes the app icons as PNG files with no image library: a dark blue square with an open book.
// Run with `npm run icons`; the output is committed in public/icons/.

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const BG = [0x1f, 0x3a, 0x5f];
const PAGE = [0xf7, 0xf5, 0xf0];
const LINE = [0x9a, 0xa8, 0xb8];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** inset: fraction of the size kept clear around the book (bigger for maskable icons). */
function icon(size, inset) {
  const px = (x, y) => {
    const u = x / size, v = y / size;
    const lo = inset, hi = 1 - inset, w = hi - lo;
    const top = lo + w * 0.18, bottom = lo + w * 0.82;
    const mid = 0.5, gap = w * 0.02;
    const left = lo + w * 0.06, right = hi - w * 0.06;
    if (v < top || v > bottom || u < left || u > right) return BG;
    if (Math.abs(u - mid) < gap) return BG; // spine
    // text lines on each page
    const rel = (v - top) / (bottom - top);
    const onLine = rel > 0.15 && rel < 0.85 && (rel * 7) % 1 < 0.28;
    const inPageL = u > left + w * 0.06 && u < mid - w * 0.06;
    const inPageR = u > mid + w * 0.06 && u < right - w * 0.06;
    if (onLine && (inPageL || inPageR)) return LINE;
    return PAGE;
  };
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b] = px(x + 0.5, y + 0.5);
      const o = y * (size * 3 + 1) + 1 + x * 3;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', icon(192, 0.1));
writeFileSync('public/icons/icon-512.png', icon(512, 0.1));
writeFileSync('public/icons/maskable-512.png', icon(512, 0.2));
writeFileSync('public/icons/apple-touch-icon.png', icon(180, 0.1));
console.log('icons written to public/icons/');
