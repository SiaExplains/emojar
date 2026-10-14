// Colour extraction from image pixels: a small k-means palette and the
// pointer → source-pixel mapping used by the image colour picker. Works on
// RGBA arrays from a canvas; nothing leaves the browser.

import type { RGB } from './color';

export type PaletteColor = RGB & { share: number };

/** Deterministic PRNG so the same image always gives the same palette. */
function lcg(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const dist2 = (a: number[], b: number[]) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

/**
 * Representative colours of an image. Pixels are sampled (at most
 * `maxSamples`), mostly-transparent pixels are skipped, and k-means with
 * k-means++ seeding groups them. Returns the cluster centres sorted by how
 * much of the image they cover.
 */
export function extractPalette(
  data: Uint8ClampedArray,
  k: number,
  opts: { maxSamples?: number; iterations?: number } = {},
): PaletteColor[] {
  const total = data.length / 4;
  const maxSamples = opts.maxSamples ?? 20000;
  const step = Math.max(1, Math.floor(total / maxSamples));
  const pts: number[][] = [];
  for (let i = 0; i < total; i += step) {
    const o = i * 4;
    if (data[o + 3] < 128) continue;
    pts.push([data[o], data[o + 1], data[o + 2]]);
  }
  if (!pts.length) return [];
  const rand = lcg(pts.length * 31 + k);
  // k-means++: spread the starting centres out.
  const centres: number[][] = [pts[Math.floor(rand() * pts.length)]];
  const d = pts.map((p) => dist2(p, centres[0]));
  while (centres.length < Math.min(k, pts.length)) {
    const sum = d.reduce((a, b) => a + b, 0);
    if (sum === 0) break; // every remaining pixel equals a centre
    let r = rand() * sum;
    let idx = 0;
    while (idx < pts.length - 1 && (r -= d[idx]) > 0) idx++;
    centres.push(pts[idx]);
    for (let i = 0; i < pts.length; i++)
      d[i] = Math.min(d[i], dist2(pts[i], pts[idx]));
  }
  const assign = new Int32Array(pts.length);
  for (let it = 0; it < (opts.iterations ?? 12); it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0;
      let bd = Infinity;
      for (let c = 0; c < centres.length; c++) {
        const dd = dist2(pts[i], centres[c]);
        if (dd < bd) {
          bd = dd;
          best = c;
        }
      }
      if (assign[i] !== best) {
        assign[i] = best;
        moved = true;
      }
    }
    const sums = centres.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < pts.length; i++) {
      const s = sums[assign[i]];
      s[0] += pts[i][0];
      s[1] += pts[i][1];
      s[2] += pts[i][2];
      s[3]++;
    }
    sums.forEach((s, c) => {
      if (s[3]) centres[c] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]];
    });
    if (!moved && it > 0) break;
  }
  const counts = new Array(centres.length).fill(0);
  for (let i = 0; i < pts.length; i++) counts[assign[i]]++;
  return centres
    .map((c, i) => ({
      r: Math.round(c[0]),
      g: Math.round(c[1]),
      b: Math.round(c[2]),
      share: counts[i] / pts.length,
    }))
    .filter((c) => c.share > 0)
    .sort((a, b) => b.share - a.share);
}

/**
 * Maps a pointer position on a displayed image to the source pixel. The
 * element may be scaled (CSS width/height) and the box may contain borders,
 * so the content box is used; positions outside return null.
 */
export function sourcePixel(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  natural: { width: number; height: number },
): { x: number; y: number } | null {
  const fx = (clientX - rect.left) / rect.width;
  const fy = (clientY - rect.top) / rect.height;
  if (fx < 0 || fy < 0 || fx >= 1 || fy >= 1) return null;
  return {
    x: Math.min(natural.width - 1, Math.floor(fx * natural.width)),
    y: Math.min(natural.height - 1, Math.floor(fy * natural.height)),
  };
}

/** Largest canvas side we decode to; huge photos are scaled down to this. */
export const MAX_DECODE_SIDE = 8192;
