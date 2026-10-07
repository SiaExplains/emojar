// Pixel effects for flattened PDF pages: grayscale, black & white (with an
// automatic Otsu threshold) and a "scanned document" look.

export function grayscalePixels(d: Uint8ClampedArray): void {
  for (let i = 0; i < d.length; i += 4) {
    const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = d[i + 1] = d[i + 2] = g;
  }
}

/** Otsu's method: the threshold that best separates ink from paper. */
export function otsuThreshold(d: Uint8ClampedArray): number {
  const hist = new Array<number>(256).fill(0);
  let n = 0;
  for (let i = 0; i < d.length; i += 4) {
    hist[d[i]]++;
    n++;
  }
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let best = 0;
  let threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > best) {
      best = between;
      threshold = t;
    }
  }
  return threshold;
}

/** Expects gray pixels. Values ≤ threshold become black, others white. */
export function thresholdPixels(d: Uint8ClampedArray, threshold: number): void {
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i] <= threshold ? 0 : 255;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
}

/** Small deterministic PRNG so the same page always gets the same grain. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Scanner look on gray pixels: a touch more contrast, faint paper tone and
 * grain. `bw` thresholds instead, like a black-and-white office scan.
 */
export function scanLookPixels(
  d: Uint8ClampedArray,
  opts: { bw: boolean; noise: number; rng: () => number },
): void {
  if (opts.bw) {
    const t = otsuThreshold(d);
    for (let i = 0; i < d.length; i += 4) {
      const jitter = (opts.rng() - 0.5) * opts.noise * 60;
      const v = d[i] + jitter <= t ? 20 : 250;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    return;
  }
  for (let i = 0; i < d.length; i += 4) {
    // Contrast around mid-gray, then lift the paper to a slightly warm gray.
    let v = (d[i] - 128) * 1.15 + 128;
    v += (opts.rng() - 0.5) * opts.noise * 40;
    v = Math.min(255, Math.max(0, v));
    const paper = v / 255;
    d[i] = Math.round(Math.min(250, v + 3 * paper));
    d[i + 1] = Math.round(Math.min(247, v + 1 * paper));
    d[i + 2] = Math.round(Math.min(240, v - 3 * paper));
  }
}
