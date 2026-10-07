// Region effects for the blur/pixelate tool. They overwrite the pixels inside
// the region, so the original detail cannot be recovered from the export.

import type { Rect } from './layout';

type Pixels = { data: Uint8ClampedArray; width: number; height: number };

function clampRect(img: Pixels, r: Rect) {
  const x0 = Math.max(0, Math.floor(r.x));
  const y0 = Math.max(0, Math.floor(r.y));
  const x1 = Math.min(img.width, Math.ceil(r.x + r.w));
  const y1 = Math.min(img.height, Math.ceil(r.y + r.h));
  return { x0, y0, x1, y1, ok: x1 > x0 && y1 > y0 };
}

/** Replaces each `block × block` cell with its average colour. */
export function pixelate(img: Pixels, r: Rect, block: number): void {
  const { x0, y0, x1, y1, ok } = clampRect(img, r);
  if (!ok) return;
  const b = Math.max(2, Math.round(block));
  const d = img.data;
  for (let by = y0; by < y1; by += b)
    for (let bx = x0; bx < x1; bx += b) {
      const ex = Math.min(bx + b, x1);
      const ey = Math.min(by + b, y1);
      const sum = [0, 0, 0, 0];
      let n = 0;
      for (let y = by; y < ey; y++)
        for (let x = bx; x < ex; x++) {
          const i = (y * img.width + x) * 4;
          sum[0] += d[i];
          sum[1] += d[i + 1];
          sum[2] += d[i + 2];
          sum[3] += d[i + 3];
          n++;
        }
      const avg = sum.map((s) => Math.round(s / n));
      for (let y = by; y < ey; y++)
        for (let x = bx; x < ex; x++) {
          const i = (y * img.width + x) * 4;
          d[i] = avg[0];
          d[i + 1] = avg[1];
          d[i + 2] = avg[2];
          d[i + 3] = avg[3];
        }
    }
}

/**
 * Strong blur: three passes of a separable box blur (≈ Gaussian) applied to
 * the region only. Edges sample pixels inside the region, so nothing outside
 * leaks in or out.
 */
export function blurRegion(img: Pixels, r: Rect, radius: number): void {
  const { x0, y0, x1, y1, ok } = clampRect(img, r);
  if (!ok) return;
  const w = x1 - x0;
  const h = y1 - y0;
  const rad = Math.max(1, Math.round(radius));
  const buf = new Float32Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * img.width + x0 + x) * 4;
      const t = (y * w + x) * 4;
      for (let k = 0; k < 4; k++) buf[t + k] = img.data[s + k];
    }
  const tmp = new Float32Array(buf.length);
  const pass = (src: Float32Array, dst: Float32Array, horizontal: boolean) => {
    const len = horizontal ? w : h;
    const lines = horizontal ? h : w;
    for (let line = 0; line < lines; line++) {
      for (let k = 0; k < 4; k++) {
        const at = (p: number) =>
          horizontal ? (line * w + p) * 4 + k : (p * w + line) * 4 + k;
        let acc = 0;
        for (let p = -rad; p <= rad; p++)
          acc += src[at(Math.min(len - 1, Math.max(0, p)))];
        for (let p = 0; p < len; p++) {
          dst[at(p)] = acc / (2 * rad + 1);
          const add = Math.min(len - 1, p + rad + 1);
          const sub = Math.max(0, p - rad);
          acc += src[at(add)] - src[at(sub)];
        }
      }
    }
  };
  for (let i = 0; i < 3; i++) {
    pass(buf, tmp, true);
    pass(tmp, buf, false);
  }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const s = (y * w + x) * 4;
      const t = ((y0 + y) * img.width + x0 + x) * 4;
      for (let k = 0; k < 4; k++) img.data[t + k] = Math.round(buf[s + k]);
    }
}

/** Fills the region with a solid colour. */
export function fillRegion(
  img: Pixels,
  r: Rect,
  rgb: [number, number, number],
): void {
  const { x0, y0, x1, y1, ok } = clampRect(img, r);
  if (!ok) return;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * img.width + x) * 4;
      img.data[i] = rgb[0];
      img.data[i + 1] = rgb[1];
      img.data[i + 2] = rgb[2];
      img.data[i + 3] = 255;
    }
}
