// Loads the vendored LibRaw WebAssembly build (public/vendor/libraw) on
// demand and decodes one RAW file to 8-bit RGB. The build uses threads
// (shared WebAssembly memory), so it only runs on cross-origin-isolated pages
// — the ARW Converter routes get the COOP/COEP headers in next.config.ts.

export type RawSettings = {
  useCameraWb?: boolean;
  useAutoWb?: boolean;
  bright?: number;
  halfSize?: boolean;
  outputBps?: 8 | 16;
  userQual?: number;
};

export type RawMetadata = {
  camera_make?: string;
  camera_model?: string;
  iso_speed?: number;
  shutter?: number;
  aperture?: number;
  focal_len?: number;
  timestamp?: Date;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

type RawImage = {
  width: number;
  height: number;
  colors: number;
  bits: number;
  data: Uint8Array | Uint8ClampedArray | Uint16Array;
};

type LibRawInstance = {
  open(bytes: Uint8Array, settings?: RawSettings): Promise<void>;
  metadata(full?: boolean): Promise<RawMetadata>;
  imageData(): Promise<RawImage | undefined>;
  dispose(): void;
};

type LibRawModule = { default: new () => LibRawInstance };

export const LIBRAW_URL = '/vendor/libraw/index.js';

/** Why full decoding can't run here, or null when it can. */
export function decodeUnavailableReason(): string | null {
  if (typeof WebAssembly === 'undefined')
    return 'This browser doesn’t support WebAssembly.';
  if (typeof crossOriginIsolated !== 'undefined' && !crossOriginIsolated)
    return 'This page isn’t running in the isolated mode the RAW decoder needs.';
  if (typeof SharedArrayBuffer === 'undefined')
    return 'This browser doesn’t support shared memory for WebAssembly.';
  return null;
}

let modulePromise: Promise<LibRawModule> | null = null;
const loadModule = () =>
  (modulePromise ??= import(
    /* webpackIgnore: true */ LIBRAW_URL
  ) as Promise<LibRawModule>);

export type DecodedRaw = {
  /** RGBA pixels, ready for a canvas. */
  image: ImageData;
  meta: RawMetadata;
};

/** RGB(16 or 8 bit) → RGBA 8-bit for ImageData. */
export function toRgba(img: RawImage): Uint8ClampedArray<ArrayBuffer> {
  const px = img.width * img.height;
  const out = new Uint8ClampedArray(new ArrayBuffer(px * 4));
  const src = img.data;
  const shift = img.bits > 8 ? 8 : 0;
  const c = img.colors;
  for (let i = 0, j = 0; i < px; i++, j += c) {
    const o = i * 4;
    if (c >= 3) {
      out[o] = src[j] >> shift;
      out[o + 1] = src[j + 1] >> shift;
      out[o + 2] = src[j + 2] >> shift;
    } else {
      const v = src[j] >> shift;
      out[o] = out[o + 1] = out[o + 2] = v;
    }
    out[o + 3] = 255;
  }
  return out;
}

/** Decodes a RAW file with LibRaw. Throws a readable Error on failure. */
export async function decodeRaw(
  bytes: Uint8Array,
  settings: RawSettings,
): Promise<DecodedRaw> {
  const { default: LibRaw } = await loadModule();
  const raw = new LibRaw();
  try {
    // open() transfers the buffer to LibRaw's worker; pass a copy so the
    // caller can still read the file (e.g. for the embedded-preview fallback).
    await raw.open(bytes.slice(), { outputBps: 8, userQual: 3, ...settings });
    const meta = await raw.metadata();
    const img = await raw.imageData();
    if (!img || !img.width || !img.height)
      throw new Error('LibRaw returned no image for this file.');
    const image = new ImageData(toRgba(img), img.width, img.height);
    return { image, meta };
  } finally {
    raw.dispose();
  }
}
