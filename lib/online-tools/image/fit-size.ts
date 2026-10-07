// Finds the best-quality encoding that fits under a byte budget: binary
// search over quality first, then shrink dimensions and search again.

export type Encoder = (opts: {
  quality: number;
  scale: number;
}) => Promise<Blob>;

export type FitResult = {
  blob: Blob;
  quality: number;
  scale: number;
  attempts: number;
  fits: boolean;
};

export async function fitToSize(
  encode: Encoder,
  targetBytes: number,
  opts: {
    minQuality?: number;
    maxQuality?: number;
    minScale?: number;
    onAttempt?: (n: number) => void;
  } = {},
): Promise<FitResult> {
  const minQ = opts.minQuality ?? 0.3;
  const maxQ = opts.maxQuality ?? 0.95;
  const minScale = opts.minScale ?? 0.05;
  let attempts = 0;
  let best: FitResult | null = null;
  let smallest: FitResult | null = null;

  const tryEncode = async (quality: number, scale: number) => {
    attempts++;
    opts.onAttempt?.(attempts);
    const blob = await encode({ quality, scale });
    const r = {
      blob,
      quality,
      scale,
      attempts,
      fits: blob.size <= targetBytes,
    };
    if (!smallest || blob.size < smallest.blob.size) smallest = r;
    return r;
  };

  let scale = 1;
  while (scale >= minScale) {
    // Quick check at the lowest quality we allow: if even that is too big, shrink.
    const low = await tryEncode(minQ, scale);
    if (low.fits) {
      best = low;
      let lo = minQ;
      let hi = maxQ;
      // 7 iterations ≈ quality within 0.005.
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const r = await tryEncode(mid, scale);
        if (r.fits) {
          best = r;
          lo = mid;
        } else hi = mid;
      }
      const top = await tryEncode(maxQ, scale);
      if (top.fits) best = top;
      return { ...best, attempts };
    }
    // Shrink proportionally to how far over budget we are (area ∝ bytes, roughly).
    const ratio = Math.sqrt(targetBytes / low.blob.size);
    scale = Math.min(scale * 0.9, scale * ratio * 0.95);
  }
  const fallback = smallest as FitResult | null;
  if (!fallback) throw new Error('nothing encoded');
  return { ...fallback, attempts, fits: false };
}

export function parseSize(input: string): number | null {
  const m = /^\s*(\d+(?:\.\d+)?)\s*(kb|k|mb|m|b)?\s*$/i.exec(input);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = (m[2] ?? 'kb').toLowerCase();
  const bytes = unit.startsWith('m')
    ? n * 1024 * 1024
    : unit === 'b'
      ? n
      : n * 1024;
  return bytes >= 1024 ? Math.floor(bytes) : null;
}
