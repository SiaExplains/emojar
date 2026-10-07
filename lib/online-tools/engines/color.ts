// Color parsing, conversion, palettes and WCAG contrast.

export type RGB = { r: number; g: number; b: number; a?: number };
export type HSL = { h: number; s: number; l: number };

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const round = (n: number, d = 0) => Number(n.toFixed(d));

const NAMED: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#008000',
  lime: '#00ff00',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  aqua: '#00ffff',
  magenta: '#ff00ff',
  fuchsia: '#ff00ff',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  maroon: '#800000',
  olive: '#808000',
  purple: '#800080',
  teal: '#008080',
  navy: '#000080',
  orange: '#ffa500',
  pink: '#ffc0cb',
  brown: '#a52a2a',
  gold: '#ffd700',
  indigo: '#4b0082',
  violet: '#ee82ee',
  coral: '#ff7f50',
  salmon: '#fa8072',
  tomato: '#ff6347',
  crimson: '#dc143c',
  turquoise: '#40e0d0',
  beige: '#f5f5dc',
  lavender: '#e6e6fa',
  khaki: '#f0e68c',
  rebeccapurple: '#663399',
};

export function hexToRgb(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(h)) return null;
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  const rgb: RGB = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  if (h.length === 8) rgb.a = round(parseInt(h.slice(6), 16) / 255, 3);
  return rgb;
}

export function rgbToHex({ r, g, b, a }: RGB): string {
  const hex = [r, g, b]
    .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
    .join('');
  const alpha =
    a !== undefined && a < 1
      ? Math.round(clamp(a, 0, 1) * 255)
          .toString(16)
          .padStart(2, '0')
      : '';
  return `#${hex}${alpha}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
  }
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;
  const hn = (((h % 360) + 360) % 360) / 360;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hue = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue(hn + 1 / 3) * 255),
    g: Math.round(hue(hn) * 255),
    b: Math.round(hue(hn - 1 / 3) * 255),
  };
}

export function rgbToHsv({ r, g, b }: RGB) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  const { h } = rgbToHsl({ r, g, b });
  return { h, s: round(max === 0 ? 0 : (d / max) * 100), v: round(max * 100) };
}

export function rgbToCmyk({ r, g, b }: RGB) {
  const k = 1 - Math.max(r, g, b) / 255;
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const f = (v: number) => round(((1 - v / 255 - k) / (1 - k)) * 100);
  return { c: f(r), m: f(g), y: f(b), k: round(k * 100) };
}

/**
 * Parses HEX (#abc, #aabbcc, #aabbccdd), rgb()/rgba(), hsl()/hsla(), bare
 * "r, g, b" / "h, s%, l%" triples and common CSS color names.
 */
export function parseColor(
  input: string,
  hint?: 'hex' | 'rgb' | 'hsl',
): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (NAMED[s]) return hexToRgb(NAMED[s]);
  if (s.startsWith('#') || (hint === 'hex' && /^[0-9a-f]+$/.test(s)))
    return hexToRgb(s);

  const nums = s.match(/-?\d*\.?\d+%?/g)?.map((x) => x) ?? [];
  const isHsl = s.startsWith('hsl') || (hint === 'hsl' && !s.startsWith('rgb'));
  const isRgb = s.startsWith('rgb') || (!isHsl && nums.length >= 3);
  if (nums.length < 3) return /^[0-9a-f]{3,8}$/.test(s) ? hexToRgb(s) : null;

  const alphaRaw = nums[3];
  const alpha =
    alphaRaw === undefined
      ? undefined
      : alphaRaw.endsWith('%')
        ? parseFloat(alphaRaw) / 100
        : parseFloat(alphaRaw);

  if (isHsl) {
    const [h, sat, l] = nums.map((n) => parseFloat(n));
    if (
      [h, sat, l].some((n) => !Number.isFinite(n)) ||
      sat > 100 ||
      l > 100 ||
      sat < 0 ||
      l < 0
    )
      return null;
    return {
      ...hslToRgb({ h, s: sat, l }),
      ...(alpha !== undefined ? { a: alpha } : {}),
    };
  }
  if (isRgb) {
    const [r, g, b] = nums
      .slice(0, 3)
      .map((n) =>
        n.endsWith('%') ? (parseFloat(n) / 100) * 255 : parseFloat(n),
      );
    if ([r, g, b].some((n) => !Number.isFinite(n) || n < 0 || n > 255))
      return null;
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      ...(alpha !== undefined ? { a: alpha } : {}),
    };
  }
  return null;
}

export function formatRgb(c: RGB): string {
  return c.a !== undefined && c.a < 1
    ? `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
    : `rgb(${c.r}, ${c.g}, ${c.b})`;
}

export function formatHsl(c: RGB): string {
  const { h, s, l } = rgbToHsl(c);
  return c.a !== undefined && c.a < 1
    ? `hsla(${h}, ${s}%, ${l}%, ${c.a})`
    : `hsl(${h}, ${s}%, ${l}%)`;
}

export function allFormats(c: RGB) {
  const hsv = rgbToHsv(c);
  const cmyk = rgbToCmyk(c);
  return {
    hex: rgbToHex(c),
    rgb: formatRgb(c),
    hsl: formatHsl(c),
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
  };
}

// ── WCAG contrast ──────────────────────────────────────────────────────────

export function relativeLuminance({ r, g, b }: RGB): number {
  const ch = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function wcagResults(ratio: number) {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
    uiComponents: ratio >= 3,
  };
}

/** Readable text color (black or white) for a background. */
export function readableOn(bg: RGB): string {
  return contrastRatio(bg, { r: 0, g: 0, b: 0 }) >=
    contrastRatio(bg, { r: 255, g: 255, b: 255 })
    ? '#000000'
    : '#ffffff';
}

// ── Palettes ───────────────────────────────────────────────────────────────

export type PaletteScheme =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic'
  | 'shades';

export function generatePalette(base: RGB, scheme: PaletteScheme): string[] {
  const { h, s, l } = rgbToHsl(base);
  const at = (dh: number, ss = s, ll = l) =>
    rgbToHex(hslToRgb({ h: h + dh, s: ss, l: ll }));
  switch (scheme) {
    case 'complementary':
      return [
        at(0),
        at(0, s, clamp(l + 20, 0, 95)),
        at(180),
        at(180, s, clamp(l + 20, 0, 95)),
        at(180, s, clamp(l - 20, 5, 100)),
      ];
    case 'analogous':
      return [at(-60), at(-30), at(0), at(30), at(60)];
    case 'triadic':
      return [
        at(0),
        at(120),
        at(240),
        at(0, s, clamp(l + 25, 0, 95)),
        at(120, s, clamp(l + 25, 0, 95)),
      ];
    case 'tetradic':
      return [at(0), at(90), at(180), at(270), at(0, s, clamp(l + 25, 0, 95))];
    case 'split-complementary':
      return [
        at(0),
        at(150),
        at(210),
        at(0, s, clamp(l + 25, 0, 95)),
        at(0, s, clamp(l - 25, 5, 100)),
      ];
    case 'monochromatic':
      return [15, 30, 45, 60, 75].map((ll, i) =>
        at(0, clamp(s - i * 4, 0, 100), ll),
      );
    case 'shades':
      return [95, 85, 70, 55, 40, 28, 18].map((ll) => at(0, s, ll));
  }
}

export function randomColor(random = Math.random): RGB {
  return hslToRgb({
    h: Math.floor(random() * 360),
    s: 45 + Math.floor(random() * 40),
    l: 40 + Math.floor(random() * 25),
  });
}
