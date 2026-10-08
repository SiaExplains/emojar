// Pure helpers behind the CSS generator tools: box-shadow, border-radius,
// clip-path and transform. Kept free of React so they can be unit tested.

import { hexToRgb } from './color';

/** Rounds to `dp` decimals and drops trailing zeros (and negative zero). */
export function num(n: number, dp = 2): string {
  const f = Math.pow(10, dp);
  const r = Math.round(n * f) / f;
  return String(r === 0 ? 0 : r);
}

/** "0" for zero, otherwise the number with its unit. */
export const len = (n: number, unit = 'px', dp = 2) =>
  Number(num(n, dp)) === 0 ? '0' : `${num(n, dp)}${unit}`;

/**
 * Shortest form of a four-value box shorthand in top/right/bottom/left (or
 * top-left/top-right/bottom-right/bottom-left) order.
 */
export function collapse4(v: [string, string, string, string]): string[] {
  const [a, b, c, d] = v;
  if (d !== b) return [a, b, c, d];
  if (c !== a) return [a, b, c];
  if (b !== a) return [a, b];
  return [a];
}

// ── box-shadow ─────────────────────────────────────────────────────────────

export type Shadow = {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  /** #rrggbb */
  color: string;
  /** 0–100 */
  opacity: number;
  inset: boolean;
};

export function shadowColor(hex: string, opacity: number): string {
  const c = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  const a = Math.min(100, Math.max(0, opacity)) / 100;
  if (a >= 1) return hex.toLowerCase();
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${num(a)})`;
}

/** One shadow layer, e.g. "inset 0 10px 30px -5px rgba(0, 0, 0, 0.2)". */
export function shadowValue(s: Shadow): string {
  const lengths = [len(s.x), len(s.y)];
  if (s.blur || s.spread) lengths.push(len(Math.max(0, s.blur)));
  if (s.spread) lengths.push(len(s.spread));
  return [s.inset ? 'inset' : '', ...lengths, shadowColor(s.color, s.opacity)]
    .filter(Boolean)
    .join(' ');
}

/** Value for the style attribute: layers joined by commas, first on top. */
export const boxShadowValue = (list: Shadow[]) =>
  list.length ? list.map(shadowValue).join(', ') : 'none';

/** The declaration, one layer per line when there are several. */
export function boxShadowCss(list: Shadow[]): string {
  if (list.length <= 1) return `box-shadow: ${boxShadowValue(list)};`;
  return `box-shadow:\n${list.map((s) => `  ${shadowValue(s)}`).join(',\n')};`;
}

// ── border-radius ──────────────────────────────────────────────────────────

/** Corner order: top-left, top-right, bottom-right, bottom-left. */
export type Corners = [number, number, number, number];

/**
 * border-radius value in its shortest valid form. `vertical` is only
 * written (after a slash) when it differs from the horizontal radii.
 */
export function borderRadiusValue(
  horizontal: Corners,
  vertical: Corners | null,
  unit: 'px' | '%',
): string {
  const fmt = (c: Corners) =>
    collapse4(
      c.map((n) => len(n, unit, 1)) as [string, string, string, string],
    ).join(' ');
  const h = fmt(horizontal);
  if (!vertical) return h;
  const v = fmt(vertical);
  return v === h ? h : `${h} / ${v}`;
}

// ── clip-path ──────────────────────────────────────────────────────────────

/** A polygon point in percent of the element box. */
export type Pt = { x: number; y: number };

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/** Rounds to the nearest multiple of `step` (no-op for step 0). */
export const snapTo = (n: number, step: number) =>
  step > 0 ? Math.round(n / step) * step : n;

const pct = (n: number) => `${num(n, 1)}%`;

export function polygonCss(points: Pt[]): string {
  return `clip-path: polygon(\n${points.map((p) => `  ${pct(p.x)} ${pct(p.y)}`).join(',\n')}\n);`;
}

/** Single-line value for inline styles. */
export const polygonValue = (points: Pt[]) =>
  `polygon(${points.map((p) => `${pct(p.x)} ${pct(p.y)}`).join(', ')})`;

export const circleValue = (r: number, cx: number, cy: number) =>
  `circle(${pct(r)} at ${pct(cx)} ${pct(cy)})`;

export const ellipseValue = (rx: number, ry: number, cx: number, cy: number) =>
  `ellipse(${pct(rx)} ${pct(ry)} at ${pct(cx)} ${pct(cy)})`;

export function insetValue(
  top: number,
  right: number,
  bottom: number,
  left: number,
  round: number,
): string {
  const sides = collapse4(
    [top, right, bottom, left].map((n) => len(n, '%', 1)) as [
      string,
      string,
      string,
      string,
    ],
  ).join(' ');
  return round > 0
    ? `inset(${sides} round ${len(round, '%', 1)})`
    : `inset(${sides})`;
}

/** Distance from p to the segment a–b. */
export function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, 0, 1) : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * Index at which a new point should be inserted so it lands on the nearest
 * edge of the (closed) polygon instead of creating a crossing line.
 */
export function insertIndex(points: Pt[], p: Pt): number {
  if (points.length < 2) return points.length;
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < points.length; i++) {
    const d = distToSegment(p, points[i], points[(i + 1) % points.length]);
    if (d < bestD - 1e-9) {
      bestD = d;
      best = i;
    }
  }
  return best + 1;
}

export function insertPoint(
  points: Pt[],
  p: Pt,
): { points: Pt[]; index: number } {
  const index = insertIndex(points, p);
  return {
    points: [...points.slice(0, index), p, ...points.slice(index)],
    index,
  };
}

/** Regular polygon (or star when `inner` is set) inscribed in the box. */
export function regularPolygon(sides: number, inner?: number): Pt[] {
  const n = inner ? sides * 2 : sides;
  return Array.from({ length: n }, (_, i) => {
    const r = inner && i % 2 ? inner : 50;
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return {
      x: Number(num(50 + r * Math.cos(a), 1)),
      y: Number(num(50 + r * Math.sin(a), 1)),
    };
  });
}

const P = (...xy: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < xy.length; i += 2) out.push({ x: xy[i], y: xy[i + 1] });
  return out;
};

export const POLYGON_PRESETS: { name: string; points: Pt[] }[] = [
  { name: 'Triangle', points: P(50, 0, 100, 100, 0, 100) },
  { name: 'Rhombus', points: P(50, 0, 100, 50, 50, 100, 0, 50) },
  { name: 'Trapezoid', points: P(20, 0, 80, 0, 100, 100, 0, 100) },
  { name: 'Parallelogram', points: P(25, 0, 100, 0, 75, 100, 0, 100) },
  { name: 'Pentagon', points: regularPolygon(5) },
  {
    name: 'Hexagon',
    points: P(25, 0, 75, 0, 100, 50, 75, 100, 25, 100, 0, 50),
  },
  {
    name: 'Octagon',
    points: P(30, 0, 70, 0, 100, 30, 100, 70, 70, 100, 30, 100, 0, 70, 0, 30),
  },
  { name: 'Star', points: regularPolygon(5, 20) },
  {
    name: 'Arrow',
    points: P(0, 20, 60, 20, 60, 0, 100, 50, 60, 100, 60, 80, 0, 80),
  },
  { name: 'Chevron', points: P(75, 0, 100, 50, 75, 100, 0, 100, 25, 50, 0, 0) },
  {
    name: 'Message bubble',
    points: P(0, 0, 100, 0, 100, 75, 75, 75, 75, 100, 50, 75, 0, 75),
  },
  {
    name: 'Cross',
    points: P(
      35,
      0,
      65,
      0,
      65,
      35,
      100,
      35,
      100,
      65,
      65,
      65,
      65,
      100,
      35,
      100,
      35,
      65,
      0,
      65,
      0,
      35,
      35,
      35,
    ),
  },
];

// ── transform ──────────────────────────────────────────────────────────────

export type TransformState = {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  /** transform-origin in percent of the box. */
  originX: number;
  originY: number;
  threeD: boolean;
  perspective: number;
  rotateX: number;
  rotateY: number;
};

export const TRANSFORM_DEFAULT: TransformState = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  originX: 50,
  originY: 50,
  threeD: false,
  perspective: 600,
  rotateX: 0,
  rotateY: 0,
};

/** The non-default transform functions, in the order they are applied. */
export function transformFunctions(t: TransformState): string[] {
  const out: string[] = [];
  const deg = (n: number) => `${num(n, 1)}deg`;
  const has3d = t.threeD && (t.rotateX !== 0 || t.rotateY !== 0);
  if (has3d) out.push(`perspective(${len(t.perspective)})`);
  if (t.translateX && t.translateY)
    out.push(`translate(${len(t.translateX)}, ${len(t.translateY)})`);
  else if (t.translateX) out.push(`translateX(${len(t.translateX)})`);
  else if (t.translateY) out.push(`translateY(${len(t.translateY)})`);
  if (has3d && t.rotateX) out.push(`rotateX(${deg(t.rotateX)})`);
  if (has3d && t.rotateY) out.push(`rotateY(${deg(t.rotateY)})`);
  if (t.rotate) out.push(`rotate(${deg(t.rotate)})`);
  if (t.scaleX !== 1 || t.scaleY !== 1)
    out.push(
      t.scaleX === t.scaleY
        ? `scale(${num(t.scaleX)})`
        : `scale(${num(t.scaleX)}, ${num(t.scaleY)})`,
    );
  if (t.skewX && t.skewY) out.push(`skew(${deg(t.skewX)}, ${deg(t.skewY)})`);
  else if (t.skewX) out.push(`skewX(${deg(t.skewX)})`);
  else if (t.skewY) out.push(`skewY(${deg(t.skewY)})`);
  return out;
}

export const transformValue = (t: TransformState) =>
  transformFunctions(t).join(' ') || 'none';

/** transform-origin as keywords where possible ("left top"), else percent. */
export function originValue(x: number, y: number): string {
  const kx: Record<number, string> = { 0: 'left', 50: 'center', 100: 'right' };
  const ky: Record<number, string> = { 0: 'top', 50: 'center', 100: 'bottom' };
  if (kx[x] && ky[y])
    return x === 50 && y === 50 ? 'center' : `${kx[x]} ${ky[y]}`;
  return `${pct(x)} ${pct(y)}`;
}

/** 4×4 matrix, row-major, acting on column vectors. */
type M4 = number[][];

const identity = (): M4 => [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];
function mul(a: M4, b: M4): M4 {
  return a.map((row) =>
    [0, 1, 2, 3].map((j) => row.reduce((s, v, k) => s + v * b[k][j], 0)),
  );
}
const rad = (d: number) => (d * Math.PI) / 180;

/** The whole transform list as one matrix, in CSS application order. */
export function transformMatrix(t: TransformState): M4 {
  const steps: M4[] = [];
  const has3d = t.threeD && (t.rotateX !== 0 || t.rotateY !== 0);
  if (has3d) {
    const p = identity();
    p[3][2] = -1 / Math.max(1, t.perspective);
    steps.push(p);
  }
  const tr = identity();
  tr[0][3] = t.translateX;
  tr[1][3] = t.translateY;
  steps.push(tr);
  if (has3d) {
    const cx = Math.cos(rad(t.rotateX));
    const sx = Math.sin(rad(t.rotateX));
    const rx = identity();
    rx[1][1] = cx;
    rx[1][2] = -sx;
    rx[2][1] = sx;
    rx[2][2] = cx;
    const cy = Math.cos(rad(t.rotateY));
    const sy = Math.sin(rad(t.rotateY));
    const ry = identity();
    ry[0][0] = cy;
    ry[0][2] = sy;
    ry[2][0] = -sy;
    ry[2][2] = cy;
    steps.push(rx, ry);
  }
  const c = Math.cos(rad(t.rotate));
  const s = Math.sin(rad(t.rotate));
  const rz = identity();
  rz[0][0] = c;
  rz[0][1] = -s;
  rz[1][0] = s;
  rz[1][1] = c;
  const sc = identity();
  sc[0][0] = t.scaleX;
  sc[1][1] = t.scaleY;
  const sk = identity();
  sk[0][1] = Math.tan(rad(t.skewX));
  sk[1][0] = Math.tan(rad(t.skewY));
  steps.push(rz, sc, sk);
  return steps.reduce(mul, identity());
}

/** matrix() when the result is 2D, matrix3d() otherwise. */
export function matrixValue(t: TransformState): string {
  const m = transformMatrix(t);
  const f = (n: number) => num(n, 6);
  const is2d =
    [
      m[0][2],
      m[1][2],
      m[2][0],
      m[2][1],
      m[2][3],
      m[3][0],
      m[3][1],
      m[3][2],
    ].every((v) => Math.abs(v) < 1e-9) &&
    Math.abs(m[2][2] - 1) < 1e-9 &&
    Math.abs(m[3][3] - 1) < 1e-9;
  if (is2d)
    return `matrix(${[m[0][0], m[1][0], m[0][1], m[1][1], m[0][3], m[1][3]].map(f).join(', ')})`;
  // matrix3d lists the matrix column by column.
  const cols: number[] = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) cols.push(m[i][j]);
  return `matrix3d(${cols.map(f).join(', ')})`;
}
