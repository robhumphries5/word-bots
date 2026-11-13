// Rasterises the app icon to PNG with no dependencies (run: node scripts/make-icons.mjs).
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const BG = [0x1b, 0x21, 0x40], METAL = [0x9a, 0xa6, 0xc8], DARK = [0x2a, 0x31, 0x58], RED = [0xff, 0x5a, 0x5a];
// Shapes in a 512 coordinate space, drawn in order (later wins).
const rrect = (x, y, w, h, r, c) => (px, py) => {
  if (px < x || px > x + w || py < y || py > y + h) return null;
  const dx = Math.max(x + r - px, 0, px - (x + w - r));
  const dy = Math.max(y + r - py, 0, py - (y + h - r));
  return dx * dx + dy * dy <= r * r ? c : null;
};
const circle = (cx, cy, r, c) => (px, py) => ((px - cx) ** 2 + (py - cy) ** 2 <= r * r ? c : null);
const shapes = [
  rrect(246, 70, 20, 60, 0, METAL), circle(256, 70, 24, RED),
  rrect(106, 130, 300, 270, 48, METAL), rrect(146, 190, 220, 110, 24, DARK),
  circle(206, 245, 28, RED), circle(306, 245, 28, RED), rrect(176, 330, 160, 30, 10, DARK),
];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (const b of buf) {
    c = (crc ^ b) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size) {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const s = 512 / size;
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let col = BG;
      for (const sh of shapes) col = sh((x + 0.5) * s, (y + 0.5) * s) ?? col;
      raw.set(col, y * (size * 3 + 1) + 1 + x * 3);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}
for (const size of [192, 512]) writeFileSync(`public/icon-${size}.png`, png(size));
console.log('icons written');
