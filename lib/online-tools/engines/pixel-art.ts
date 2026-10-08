// Pixel-art editing primitives. A frame is a flat row-major array of
// "#rrggbb" strings, with '' for a transparent pixel; grids are square.

export type Pixels = string[];

export const GRID_SIZES = [8, 16, 24, 32, 48, 64] as const;

export const blank = (size: number): Pixels =>
  Array.from({ length: size * size }, () => '');

export const isHexColor = (c: string) => /^#[0-9a-f]{6}$/.test(c);

export const isPixels = (v: unknown, size: number): v is Pixels =>
  Array.isArray(v) &&
  v.length === size * size &&
  v.every((c) => c === '' || (typeof c === 'string' && isHexColor(c)));

/** 4-connected flood fill. Returns the same array when nothing changes. */
export function floodFill(
  px: Pixels,
  size: number,
  x: number,
  y: number,
  color: string,
): Pixels {
  if (x < 0 || y < 0 || x >= size || y >= size) return px;
  const target = px[y * size + x];
  if (target === color) return px;
  const out = px.slice();
  const stack = [y * size + x];
  while (stack.length) {
    const i = stack.pop() as number;
    if (out[i] !== target) continue;
    out[i] = color;
    const cx = i % size;
    if (cx > 0) stack.push(i - 1);
    if (cx < size - 1) stack.push(i + 1);
    if (i >= size) stack.push(i - size);
    if (i < size * (size - 1)) stack.push(i + size);
  }
  return out;
}

/**
 * The cells to paint for one click with mirroring. "Horizontal mirror"
 * reflects left↔right across the vertical centre line; "vertical mirror"
 * reflects top↔bottom. Duplicates are removed.
 */
export function mirrorPoints(
  x: number,
  y: number,
  size: number,
  mirror: { h: boolean; v: boolean },
): [number, number][] {
  const pts: [number, number][] = [[x, y]];
  if (mirror.h) pts.push([size - 1 - x, y]);
  if (mirror.v) pts.push([x, size - 1 - y]);
  if (mirror.h && mirror.v) pts.push([size - 1 - x, size - 1 - y]);
  const seen = new Set<string>();
  return pts.filter(([a, b]) => {
    const k = `${a},${b}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Cells on the line between two cells (Bresenham), both ends included. */
export function linePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): [number, number][] {
  const pts: [number, number][] = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    pts.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
}

/** Paints a set of cells (ignoring ones outside the grid). */
export function paint(
  px: Pixels,
  size: number,
  cells: [number, number][],
  color: string,
): Pixels {
  let out: Pixels | null = null;
  for (const [x, y] of cells) {
    if (x < 0 || y < 0 || x >= size || y >= size) continue;
    const i = y * size + x;
    if (px[i] === color) continue;
    if (!out) out = px.slice();
    out[i] = color;
  }
  return out ?? px;
}

/** Resizes keeping the top-left content; shrinking crops the rest. */
export function resizePixels(px: Pixels, from: number, to: number): Pixels {
  const out = blank(to);
  const n = Math.min(from, to);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) out[y * to + x] = px[y * from + x] ?? '';
  return out;
}

/** True when shrinking would drop painted pixels. */
export function wouldCrop(px: Pixels, from: number, to: number): boolean {
  if (to >= from) return false;
  for (let y = 0; y < from; y++)
    for (let x = 0; x < from; x++)
      if ((x >= to || y >= to) && px[y * from + x]) return true;
  return false;
}

export type Run = { x: number; y: number; w: number; color: string };

/** Merges horizontal runs of the same colour into single rectangles. */
export function horizontalRuns(px: Pixels, size: number): Run[] {
  const runs: Run[] = [];
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      const c = px[y * size + x];
      let w = 1;
      while (x + w < size && px[y * size + x + w] === c) w++;
      if (c) runs.push({ x, y, w, color: c });
      x += w;
    }
  }
  return runs;
}

export function toSvg(px: Pixels, size: number, scale = 1): string {
  const rects = horizontalRuns(px, size)
    .map(
      (r) =>
        `  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.color}"/>`,
    )
    .join('\n');
  const dim = size * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${dim}" height="${dim}" shape-rendering="crispEdges">\n${rects}\n</svg>\n`;
}

/** Writes a frame into RGBA data at `scale` (transparent where empty). */
export function toRgba(
  px: Pixels,
  size: number,
  scale = 1,
  out?: { data: Uint8ClampedArray; width: number; offsetX: number },
): Uint8ClampedArray {
  const w = out?.width ?? size * scale;
  const data = out?.data ?? new Uint8ClampedArray(w * size * scale * 4);
  const ox = out?.offsetX ?? 0;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const c = px[y * size + x];
      if (!c) continue;
      const n = parseInt(c.slice(1), 16);
      const r = (n >> 16) & 255;
      const g = (n >> 8) & 255;
      const b = n & 255;
      for (let dy = 0; dy < scale; dy++)
        for (let dx = 0; dx < scale; dx++) {
          const i = ((y * scale + dy) * w + ox + x * scale + dx) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
    }
  return data;
}

// ── Undo history ───────────────────────────────────────────────────────────

export type History<T> = { past: T[]; present: T; future: T[] };

export const history = <T>(present: T): History<T> => ({
  past: [],
  present,
  future: [],
});

/** Records a new state; identical states are ignored, redo is cleared. */
export function commit<T>(h: History<T>, next: T, limit = 100): History<T> {
  if (next === h.present) return h;
  const past = [...h.past, h.present];
  if (past.length > limit) past.splice(0, past.length - limit);
  return { past, present: next, future: [] };
}

export function undo<T>(h: History<T>): History<T> {
  if (!h.past.length) return h;
  return {
    past: h.past.slice(0, -1),
    present: h.past[h.past.length - 1],
    future: [h.present, ...h.future],
  };
}

export function redo<T>(h: History<T>): History<T> {
  if (!h.future.length) return h;
  return {
    past: [...h.past, h.present],
    present: h.future[0],
    future: h.future.slice(1),
  };
}

export const DEFAULT_PALETTE = [
  '#000000',
  '#ffffff',
  '#7f7f7f',
  '#c3c3c3',
  '#880015',
  '#ed1c24',
  '#ff7f27',
  '#fff200',
  '#22b14c',
  '#b5e61d',
  '#00a2e8',
  '#99d9ea',
  '#3f48cc',
  '#7092be',
  '#a349a4',
  '#ffaec9',
  '#b97a57',
  '#efe4b0',
];
