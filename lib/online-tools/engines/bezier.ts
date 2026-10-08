// Bézier curve maths for the visualiser: Bernstein evaluation, de Casteljau
// construction, formulas and the matching SVG / CSS strings.

export type Pt = { x: number; y: number };

export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** B(t) = Σ C(n,i) (1−t)^(n−i) t^i Pᵢ — the Bernstein form. */
export function bernstein(points: Pt[], t: number): Pt {
  const n = points.length - 1;
  if (n < 0) return { x: 0, y: 0 };
  const u = clamp01(t);
  let x = 0;
  let y = 0;
  points.forEach((p, i) => {
    const w = binomial(n, i) * (1 - u) ** (n - i) * u ** i;
    x += w * p.x;
    y += w * p.y;
  });
  return { x, y };
}

/**
 * Every level of de Casteljau's construction: level 0 is the control
 * points, each next level interpolates neighbours at t, and the last level
 * is the single point B(t).
 */
export function deCasteljau(points: Pt[], t: number): Pt[][] {
  if (!points.length) return [];
  const u = clamp01(t);
  const levels: Pt[][] = [points];
  let cur = points;
  while (cur.length > 1) {
    const next: Pt[] = [];
    for (let i = 0; i < cur.length - 1; i++)
      next.push({
        x: cur[i].x + (cur[i + 1].x - cur[i].x) * u,
        y: cur[i].y + (cur[i + 1].y - cur[i].y) * u,
      });
    levels.push(next);
    cur = next;
  }
  return levels;
}

/** Tangent direction B′(t), which also equals n × the last de Casteljau segment. */
export function derivative(points: Pt[], t: number): Pt {
  const n = points.length - 1;
  if (n < 1) return { x: 0, y: 0 };
  const diffs: Pt[] = [];
  for (let i = 0; i < n; i++)
    diffs.push({
      x: n * (points[i + 1].x - points[i].x),
      y: n * (points[i + 1].y - points[i].y),
    });
  return bernstein(diffs, t);
}

export const fmtNum = (n: number, d = 2) => {
  const f = 10 ** d;
  const r = Math.round(n * f) / f;
  return String(Object.is(r, -0) ? 0 : r);
};

const SUP = ['', '', '²', '³'];
const power = (base: string, e: number) =>
  e === 0 ? '' : `${base}${SUP[e] ?? `^${e}`}`;

/** Symbolic Bernstein terms, e.g. ["(1−t)³", "3(1−t)²t", "3(1−t)t²", "t³"]. */
export function bernsteinTerms(degree: number): string[] {
  return Array.from({ length: degree + 1 }, (_, i) => {
    const c = binomial(degree, i);
    const parts = `${power('(1−t)', degree - i)}${power('t', i)}` || '1';
    return `${c === 1 ? '' : c}${parts}`;
  });
}

/** "B(t) = (1−t)²·P₀ + 2(1−t)t·P₁ + t²·P₂" */
export function formula(degree: number): string {
  const sub = ['₀', '₁', '₂', '₃'];
  return `B(t) = ${bernsteinTerms(degree)
    .map((term, i) => `${term}·P${sub[i]}`)
    .join(' + ')}`;
}

/** The formula with numbers for one axis and the weights at t substituted. */
export function substituted(points: Pt[], t: number, axis: 'x' | 'y'): string {
  const n = points.length - 1;
  const u = clamp01(t);
  const terms = points.map((p, i) => {
    const w = binomial(n, i) * (1 - u) ** (n - i) * u ** i;
    return `${fmtNum(w, 3)}×${fmtNum(p[axis], 1)}`;
  });
  return `${axis}(${fmtNum(u, 2)}) = ${terms.join(' + ')} = ${fmtNum(bernstein(points, u)[axis], 2)}`;
}

export function svgPath(points: Pt[], d = 1): string {
  const f = (p: Pt) => `${fmtNum(p.x, d)} ${fmtNum(p.y, d)}`;
  const [p0, ...rest] = points;
  if (!p0) return '';
  const cmd = rest.length === 1 ? 'L' : rest.length === 2 ? 'Q' : 'C';
  return `M ${f(p0)} ${cmd} ${rest.map(f).join(' ')}`;
}

/**
 * CSS cubic-bezier() for a cubic whose ends are mapped to (0,0) and (1,1).
 * The y axis is flipped because screens grow downwards while timing curves
 * grow upwards. Returns null when the mapping isn't defined or the x values
 * fall outside 0–1 (CSS rejects those).
 */
export function cssCubicBezier(points: Pt[]): string | null {
  if (points.length !== 4) return null;
  const [p0, p1, p2, p3] = points;
  const dx = p3.x - p0.x;
  const dy = p0.y - p3.y;
  if (Math.abs(dx) < 1e-9 || Math.abs(dy) < 1e-9) return null;
  const nx = (p: Pt) => (p.x - p0.x) / dx;
  const ny = (p: Pt) => (p0.y - p.y) / dy;
  const vals = [nx(p1), ny(p1), nx(p2), ny(p2)];
  if (vals[0] < 0 || vals[0] > 1 || vals[2] < 0 || vals[2] > 1) return null;
  return `cubic-bezier(${vals.map((v) => fmtNum(v, 2)).join(', ')})`;
}
