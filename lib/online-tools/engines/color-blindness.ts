// Colour-vision-deficiency simulation. Dichromacy uses the severity-1.0
// matrices of Machado, Oliveira & Fernandes (2009), which are defined for
// linear RGB, so colours are decoded from sRGB first and encoded back after.

export type CvdMode =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'protanomaly'
  | 'deuteranomaly'
  | 'tritanomaly'
  | 'achromatopsia';

export type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const MACHADO: Record<'protan' | 'deutan' | 'tritan', Mat3> = {
  protan: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deutan: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritan: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
};

const IDENTITY: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export const MODES: { value: CvdMode; label: string; note: string }[] = [
  { value: 'none', label: 'Normal vision', note: 'No simulation.' },
  {
    value: 'protanopia',
    label: 'Protanopia',
    note: 'No working red (L) cones; reds look dark and close to greens.',
  },
  {
    value: 'deuteranopia',
    label: 'Deuteranopia',
    note: 'No working green (M) cones; the most common form of red–green colour blindness.',
  },
  {
    value: 'tritanopia',
    label: 'Tritanopia',
    note: 'No working blue (S) cones; blue–green and yellow–pink confusions. Rare.',
  },
  {
    value: 'protanomaly',
    label: 'Protanomaly',
    note: 'Weakened red cones. Use the severity slider.',
  },
  {
    value: 'deuteranomaly',
    label: 'Deuteranomaly',
    note: 'Weakened green cones — the most common colour vision deficiency (around 5% of men).',
  },
  {
    value: 'tritanomaly',
    label: 'Tritanomaly',
    note: 'Weakened blue cones. Use the severity slider.',
  },
  {
    value: 'achromatopsia',
    label: 'Achromatopsia',
    note: 'No colour vision at all — only lightness. Very rare.',
  },
];

export const isAnomaly = (m: CvdMode) => m.endsWith('anomaly');

export function srgbToLinear(v: number): number {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function linearToSrgb(v: number): number {
  const c = Math.min(1, Math.max(0, v));
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

/**
 * The matrix for a mode. Anomalous trichromacy blends linearly between
 * normal vision and the full dichromat matrix by `severity` (0–1) — a
 * simpler approximation than Machado's per-step tables.
 */
export function matrixFor(mode: CvdMode, severity = 1): Mat3 | null {
  const base =
    mode === 'protanopia' || mode === 'protanomaly'
      ? MACHADO.protan
      : mode === 'deuteranopia' || mode === 'deuteranomaly'
        ? MACHADO.deutan
        : mode === 'tritanopia' || mode === 'tritanomaly'
          ? MACHADO.tritan
          : null;
  if (!base) return null;
  if (!isAnomaly(mode)) return base;
  const s = Math.min(1, Math.max(0, severity));
  return base.map((v, i) => IDENTITY[i] + (v - IDENTITY[i]) * s) as Mat3;
}

export type Rgb = [number, number, number];

/** Simulates one sRGB colour (0–255 channels). */
export function simulate(rgb: Rgb, mode: CvdMode, severity = 1): Rgb {
  if (mode === 'none') return [rgb[0], rgb[1], rgb[2]];
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);
  if (mode === 'achromatopsia') {
    const y = linearToSrgb(0.2126 * r + 0.7152 * g + 0.0722 * b);
    return [y, y, y];
  }
  const m = matrixFor(mode, severity);
  if (!m) return [rgb[0], rgb[1], rgb[2]];
  return [
    linearToSrgb(m[0] * r + m[1] * g + m[2] * b),
    linearToSrgb(m[3] * r + m[4] * g + m[5] * b),
    linearToSrgb(m[6] * r + m[7] * g + m[8] * b),
  ];
}

// Lookup tables keep whole-image simulation fast: 256 decode entries and a
// 4096-step encode table (finer than 8-bit output needs).
const TO_LINEAR = Array.from({ length: 256 }, (_, i) => srgbToLinear(i));
const ENC_STEPS = 4095;
const TO_SRGB = Array.from({ length: ENC_STEPS + 1 }, (_, i) =>
  linearToSrgb(i / ENC_STEPS),
);
const enc = (v: number) =>
  TO_SRGB[Math.round(Math.min(1, Math.max(0, v)) * ENC_STEPS)];

/** Simulates RGBA pixel data into a new buffer; alpha is kept. */
export function simulatePixels(
  data: Uint8ClampedArray,
  mode: CvdMode,
  severity = 1,
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(data.length);
  if (mode === 'none') {
    out.set(data);
    return out;
  }
  const m = mode === 'achromatopsia' ? null : matrixFor(mode, severity);
  for (let i = 0; i < data.length; i += 4) {
    const r = TO_LINEAR[data[i]];
    const g = TO_LINEAR[data[i + 1]];
    const b = TO_LINEAR[data[i + 2]];
    if (m) {
      out[i] = enc(m[0] * r + m[1] * g + m[2] * b);
      out[i + 1] = enc(m[3] * r + m[4] * g + m[5] * b);
      out[i + 2] = enc(m[6] * r + m[7] * g + m[8] * b);
    } else {
      const y = enc(0.2126 * r + 0.7152 * g + 0.0722 * b);
      out[i] = out[i + 1] = out[i + 2] = y;
    }
    out[i + 3] = data[i + 3];
  }
  return out;
}

// ── Palette checking ───────────────────────────────────────────────────────

export type Lab = [number, number, number];

export function rgbToLab(rgb: Rgb): Lab {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);
  // D65 white point.
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047;
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883;
  const f = (t: number) =>
    t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 / 116) * t + 16 / 116;
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** CIEDE2000 colour difference. Below ~10 colours are easy to confuse. */
export function deltaE2000(a: Lab, b: Lab): number {
  const [L1, a1, b1] = a;
  const [L2, a2, b2] = b;
  const rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const hue = (bb: number, ap: number) => {
    if (bb === 0 && ap === 0) return 0;
    const h = Math.atan2(bb, ap) / rad;
    return h < 0 ? h + 360 : h;
  };
  const h1p = hue(b1, a1p);
  const h2p = hue(b2, a2p);
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lmp = (L1 + L2) / 2;
  const Cmp = (C1p + C2p) / 2;
  let hmp = h1p + h2p;
  if (C1p * C2p !== 0) {
    if (Math.abs(h1p - h2p) > 180) hmp += h1p + h2p < 360 ? 360 : -360;
    hmp /= 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hmp - 30) * rad) +
    0.24 * Math.cos(2 * hmp * rad) +
    0.32 * Math.cos((3 * hmp + 6) * rad) -
    0.2 * Math.cos((4 * hmp - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hmp - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cmp ** 7 / (Cmp ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lmp - 50) ** 2) / Math.sqrt(20 + (Lmp - 50) ** 2);
  const Sc = 1 + 0.045 * Cmp;
  const Sh = 1 + 0.015 * Cmp * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt(
    (dLp / Sl) ** 2 +
      (dCp / Sc) ** 2 +
      (dHp / Sh) ** 2 +
      Rt * (dCp / Sc) * (dHp / Sh),
  );
}

export function parseHex(s: string): Rgb | null {
  let h = s.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return null;
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const toHex = (c: Rgb) =>
  `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

/** Splits "a, #b c\nd" into colour tokens. */
export function parsePalette(input: string): {
  colors: { hex: string; rgb: Rgb }[];
  invalid: string[];
} {
  const colors: { hex: string; rgb: Rgb }[] = [];
  const invalid: string[] = [];
  for (const tok of input.split(/[\s,;]+/).filter(Boolean)) {
    const rgb = parseHex(tok);
    if (rgb) colors.push({ hex: toHex(rgb), rgb });
    else invalid.push(tok);
  }
  return { colors, invalid };
}

export type ConfusablePair = {
  a: number;
  b: number;
  original: number;
  simulated: number;
};

/**
 * Pairs that are distinct for normal vision but close after simulation.
 * Pairs that already look alike in the original are left out: that's a
 * general contrast issue, not a colour-blindness one.
 */
export function confusablePairs(
  colors: Rgb[],
  mode: CvdMode,
  severity = 1,
  threshold = 10,
): ConfusablePair[] {
  const labs = colors.map(rgbToLab);
  const sims = colors.map((c) => rgbToLab(simulate(c, mode, severity)));
  const out: ConfusablePair[] = [];
  for (let a = 0; a < colors.length; a++)
    for (let b = a + 1; b < colors.length; b++) {
      const original = deltaE2000(labs[a], labs[b]);
      const simulated = deltaE2000(sims[a], sims[b]);
      if (simulated < threshold && original >= threshold)
        out.push({ a, b, original, simulated });
    }
  return out.sort((x, y) => x.simulated - y.simulated);
}
