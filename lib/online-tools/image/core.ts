// Pure image helpers (no DOM): formats, sizing, file names and the
// background-removal pixel pass. Shared by the worker and the main thread.

export type ImageFormat = 'png' | 'jpg' | 'webp';
export type OutputFormat = ImageFormat | 'pdf';
export type InputKind = 'raster' | 'svg' | 'pdf';

export const MIME: Record<ImageFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
};

export const FORMAT_LABEL: Record<string, string> = {
  png: 'PNG',
  jpg: 'JPG',
  webp: 'WebP',
  pdf: 'PDF',
  svg: 'SVG',
  bmp: 'BMP',
  gif: 'GIF',
  avif: 'AVIF',
};

export function detectInputKind(file: {
  type: string;
  name: string;
}): InputKind | null {
  const t = file.type.toLowerCase();
  const ext = extensionOf(file.name);
  if (t === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (t === 'image/svg+xml' || ext === 'svg') return 'svg';
  if (
    t.startsWith('image/') ||
    [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'bmp',
      'gif',
      'avif',
      'ico',
      'tif',
      'tiff',
    ].includes(ext)
  ) {
    return 'raster';
  }
  return null;
}

export function extensionOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : '';
}

export function outputName(original: string, ext: string, suffix = ''): string {
  const base = original.replace(/\.[a-z0-9]+$/i, '') || 'image';
  return `${base}${suffix}.${ext}`;
}

export type ResizeSpec =
  | { mode: 'percent'; percent: number }
  | {
      mode: 'pixels';
      width?: number;
      height?: number;
      keepAspect: boolean;
      onlyShrink?: boolean;
    };

export function computeSize(
  w: number,
  h: number,
  spec: ResizeSpec,
): { width: number; height: number } {
  if (spec.mode === 'percent') {
    const f = Math.max(1, spec.percent) / 100;
    return {
      width: Math.max(1, Math.round(w * f)),
      height: Math.max(1, Math.round(h * f)),
    };
  }
  const { width, height, keepAspect, onlyShrink } = spec;
  // "Max width" style limits never enlarge an image that already fits.
  if (onlyShrink && (!width || w <= width) && (!height || h <= height))
    return { width: w, height: h };
  if (keepAspect) {
    if (width && height) {
      const f = Math.min(width / w, height / h);
      return {
        width: Math.max(1, Math.round(w * f)),
        height: Math.max(1, Math.round(h * f)),
      };
    }
    if (width)
      return {
        width: Math.round(width),
        height: Math.max(1, Math.round((h * width) / w)),
      };
    if (height)
      return {
        width: Math.max(1, Math.round((w * height) / h)),
        height: Math.round(height),
      };
    return { width: w, height: h };
  }
  return {
    width: Math.max(1, Math.round(width || w)),
    height: Math.max(1, Math.round(height || h)),
  };
}

/** Canvas size after rotating by a multiple of 90°. */
export function rotatedSize(
  w: number,
  h: number,
  degrees: number,
): { width: number; height: number } {
  const quarter = (((Math.round(degrees / 90) % 4) + 4) % 4) % 2 === 1;
  if (degrees % 90 === 0)
    return quarter ? { width: h, height: w } : { width: w, height: h };
  const rad = (degrees * Math.PI) / 180;
  const c = Math.abs(Math.cos(rad));
  const s = Math.abs(Math.sin(rad));
  return {
    width: Math.round(w * c + h * s),
    height: Math.round(w * s + h * c),
  };
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${units[i]}`;
}

export function savingsPercent(before: number, after: number): number {
  return before > 0 ? Math.round((1 - after / before) * 100) : 0;
}

export type PixelData = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

/**
 * Makes pixels similar to `target` transparent. With `contiguous`, only
 * pixels connected to the seed points (default: the four corners) are
 * removed — the usual "remove plain background" behaviour.
 */
export function removeBackground(
  img: PixelData,
  opts: {
    target: [number, number, number];
    tolerance: number;
    contiguous: boolean;
    seeds?: [number, number][];
    feather?: number;
  },
): number {
  const { data, width, height } = img;
  const [tr, tg, tb] = opts.target;
  const maxDist = Math.sqrt(3 * 255 * 255);
  const tol = (Math.max(0, Math.min(100, opts.tolerance)) / 100) * maxDist;
  const feather = Math.max(0, opts.feather ?? 0) * (maxDist / 100);
  const dist = (i: number) => {
    const dr = data[i] - tr;
    const dg = data[i + 1] - tg;
    const db = data[i + 2] - tb;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };
  const apply = (i: number, d: number) => {
    if (d <= tol) {
      data[i + 3] = 0;
      return true;
    }
    if (feather > 0 && d <= tol + feather) {
      data[i + 3] = Math.min(
        data[i + 3],
        Math.round(((d - tol) / feather) * 255),
      );
    }
    return false;
  };

  let removed = 0;
  if (!opts.contiguous) {
    for (let i = 0; i < data.length; i += 4) if (apply(i, dist(i))) removed++;
    return removed;
  }

  const seen = new Uint8Array(width * height);
  const seeds = opts.seeds ?? [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  const stack: number[] = [];
  for (const [x, y] of seeds) {
    if (x >= 0 && y >= 0 && x < width && y < height) stack.push(y * width + x);
  }
  while (stack.length) {
    const p = stack.pop()!;
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (!apply(i, dist(i))) continue;
    removed++;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }
  return removed;
}

/** Average color of the image border — a good guess for a plain background. */
export function guessBackground(img: PixelData): [number, number, number] {
  const { data, width, height } = img;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const add = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  };
  for (let x = 0; x < width; x++) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    add(0, y);
    add(width - 1, y);
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/** Identifies an image by its magic bytes. */
export function detectImageType(
  bytes: Uint8Array,
): { mime: string; ext: string } | null {
  const b = bytes;
  const starts = (...sig: number[]) => sig.every((v, i) => b[i] === v);
  if (starts(0x89, 0x50, 0x4e, 0x47)) return { mime: 'image/png', ext: 'png' };
  if (starts(0xff, 0xd8, 0xff)) return { mime: 'image/jpeg', ext: 'jpg' };
  if (starts(0x47, 0x49, 0x46, 0x38)) return { mime: 'image/gif', ext: 'gif' };
  if (
    starts(0x52, 0x49, 0x46, 0x46) &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  )
    return { mime: 'image/webp', ext: 'webp' };
  if (starts(0x42, 0x4d)) return { mime: 'image/bmp', ext: 'bmp' };
  if (starts(0x00, 0x00, 0x01, 0x00))
    return { mime: 'image/x-icon', ext: 'ico' };
  if (
    b[4] === 0x66 &&
    b[5] === 0x74 &&
    b[6] === 0x79 &&
    b[7] === 0x70 &&
    b[8] === 0x61 &&
    b[9] === 0x76 &&
    b[10] === 0x69 &&
    b[11] === 0x66
  ) {
    return { mime: 'image/avif', ext: 'avif' };
  }
  const head = new TextDecoder()
    .decode(b.subarray(0, 512))
    .trimStart()
    .toLowerCase();
  if (
    head.startsWith('<svg') ||
    (head.startsWith('<?xml') && head.includes('<svg'))
  )
    return { mime: 'image/svg+xml', ext: 'svg' };
  return null;
}
