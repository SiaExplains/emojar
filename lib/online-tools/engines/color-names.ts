// Named colours: the 148 CSS keywords plus the 949 colours named in the xkcd
// colour survey (CC0). Nearest-name matching uses CIEDE2000 in CIELAB.

import CSS_COLORS from '../data/css-colors.json';
import XKCD_COLORS from '../data/xkcd-colors.json';
import { hexToRgb, rgbToHsl, rgbToHsv, type RGB } from './color';

export type NamedColor = {
  name: string;
  hex: string;
  source: 'css' | 'xkcd';
  rgb: RGB;
  lab: Lab;
};

type Lab = { L: number; a: number; b: number };

export function rgbToLab({ r, g, b }: RGB): Lab {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  // sRGB → XYZ (D65), normalised by the reference white.
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) =>
    t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29;
  return { L: 116 * f(y) - 16, a: 500 * (f(x) - f(y)), b: 200 * (f(y) - f(z)) };
}

/** CIEDE2000 colour difference. ~1 is barely visible, >10 clearly different. */
export function deltaE2000(p: Lab, q: Lab): number {
  const rad = Math.PI / 180;
  const C1 = Math.hypot(p.a, p.b);
  const C2 = Math.hypot(q.a, q.b);
  const Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1 = (1 + G) * p.a;
  const a2 = (1 + G) * q.a;
  const c1 = Math.hypot(a1, p.b);
  const c2 = Math.hypot(a2, q.b);
  const h = (a: number, b: number) => {
    if (a === 0 && b === 0) return 0;
    const d = Math.atan2(b, a) / rad;
    return d < 0 ? d + 360 : d;
  };
  const h1 = h(a1, p.b);
  const h2 = h(a2, q.b);
  const dL = q.L - p.L;
  const dC = c2 - c1;
  let dh = 0;
  if (c1 * c2 !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(c1 * c2) * Math.sin((dh / 2) * rad);
  const Lm = (p.L + q.L) / 2;
  const cm = (c1 + c2) / 2;
  let hm = h1 + h2;
  if (c1 * c2 !== 0) {
    if (Math.abs(h1 - h2) <= 180) hm = (h1 + h2) / 2;
    else hm = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hm - 30) * rad) +
    0.24 * Math.cos(2 * hm * rad) +
    0.32 * Math.cos((3 * hm + 6) * rad) -
    0.2 * Math.cos((4 * hm - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(cm ** 7 / (cm ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2);
  const Sc = 1 + 0.045 * cm;
  const Sh = 1 + 0.015 * cm * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(
    (dL / Sl) ** 2 +
      (dC / Sc) ** 2 +
      (dH / Sh) ** 2 +
      Rt * (dC / Sc) * (dH / Sh),
  );
}

const make = (name: string, hex: string, source: NamedColor['source']) => {
  const rgb = hexToRgb(hex)!;
  return { name, hex: hex.toUpperCase(), source, rgb, lab: rgbToLab(rgb) };
};

export const NAMED_COLORS: NamedColor[] = [
  ...(CSS_COLORS as [string, string][]).map(([n, h]) => make(n, h, 'css')),
  ...(XKCD_COLORS as [string, string][]).map(([n, h]) => make(n, h, 'xkcd')),
];

export type Match = NamedColor & { distance: number };

/** Closest named colours to `rgb`, nearest first. */
export function nearestColors(
  rgb: RGB,
  count = 1,
  source: 'all' | 'css' | 'xkcd' = 'all',
): Match[] {
  const lab = rgbToLab(rgb);
  return NAMED_COLORS.filter((c) => source === 'all' || c.source === source)
    .map((c) => ({ ...c, distance: deltaE2000(lab, c.lab) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

export function describeDistance(d: number): string {
  if (d < 1) return 'exact or indistinguishable';
  if (d < 3) return 'very close';
  if (d < 6) return 'close';
  if (d < 12) return 'similar';
  return 'only loosely similar';
}

export type ColorSort = 'name' | 'hue' | 'brightness' | 'saturation';

export function sortKey(c: NamedColor, by: ColorSort): number | string {
  if (by === 'name') return c.name;
  if (by === 'brightness') return -c.lab.L;
  const hsl = rgbToHsl(c.rgb);
  if (by === 'saturation') return -rgbToHsv(c.rgb).s;
  // Greys first, then by hue.
  return hsl.s < 8 ? -1000 + hsl.l / 100 : hsl.h;
}

export function searchNamedColors(
  q: string,
  sort: ColorSort,
  source: 'all' | 'css' | 'xkcd' = 'all',
): NamedColor[] {
  const s = q.trim().toLowerCase().replace(/^#/, '');
  const list = NAMED_COLORS.filter(
    (c) =>
      (source === 'all' || c.source === source) &&
      (!s ||
        c.name.toLowerCase().includes(s) ||
        c.hex.toLowerCase().slice(1).startsWith(s)),
  );
  return list.sort((a, b) => {
    const ka = sortKey(a, sort);
    const kb = sortKey(b, sort);
    return typeof ka === 'string'
      ? ka.localeCompare(kb as string)
      : (ka as number) - (kb as number);
  });
}
