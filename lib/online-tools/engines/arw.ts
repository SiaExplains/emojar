// Sony ARW helpers. ARW (and SR2/SRF) files are TIFF containers: besides the
// raw sensor data they carry JPEG previews, referenced from IFD entries
// 0x0201 (JPEGInterchangeFormat, offset) and 0x0202 (…Length). The ARW
// Converter decodes the sensor data with LibRaw; this module is the fallback
// that finds the largest embedded preview when full decoding isn't possible.

const JPEG_OFFSET = 0x0201;
const JPEG_LENGTH = 0x0202;
const SUB_IFDS = 0x014a;
const MAX_IFDS = 64;

/** True for a little- ("II*\0") or big-endian ("MM\0*") TIFF header. */
export function isTiffBased(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  const le =
    bytes[0] === 0x49 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x2a &&
    bytes[3] === 0;
  const be =
    bytes[0] === 0x4d &&
    bytes[1] === 0x4d &&
    bytes[2] === 0 &&
    bytes[3] === 0x2a;
  return le || be;
}

export type EmbeddedJpeg = { offset: number; length: number };

/**
 * Every embedded JPEG referenced by an IFD (IFD0 chain and SubIFDs), largest
 * first. Entries pointing outside the file or not starting with a JPEG SOI
 * marker are ignored, so corrupt files simply yield an empty list.
 */
export function findEmbeddedJpegs(bytes: Uint8Array): EmbeddedJpeg[] {
  if (!isTiffBased(bytes)) return [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const le = bytes[0] === 0x49;
  const u16 = (o: number) => view.getUint16(o, le);
  const u32 = (o: number) => view.getUint32(o, le);
  const inRange = (o: number, n: number) => o >= 0 && o + n <= bytes.length;

  const found = new Map<number, number>();
  const queue = [u32(4)];
  const seen = new Set<number>();
  while (queue.length && seen.size < MAX_IFDS) {
    const ifd = queue.shift()!;
    if (!ifd || seen.has(ifd) || !inRange(ifd, 2)) continue;
    seen.add(ifd);
    const count = u16(ifd);
    if (count > 1000 || !inRange(ifd + 2, count * 12 + 4)) continue;
    let jOff = 0;
    let jLen = 0;
    for (let i = 0; i < count; i++) {
      const e = ifd + 2 + i * 12;
      const tag = u16(e);
      const type = u16(e + 2);
      const n = u32(e + 4);
      // SHORT (3) or LONG (4) single values sit inline in the entry.
      const value = type === 3 ? u16(e + 8) : u32(e + 8);
      if (tag === JPEG_OFFSET) jOff = value;
      else if (tag === JPEG_LENGTH) jLen = value;
      else if (tag === SUB_IFDS && (type === 4 || type === 13)) {
        if (n === 1) queue.push(u32(e + 8));
        else if (n > 1 && n < 64 && inRange(u32(e + 8), n * 4))
          for (let k = 0; k < n; k++) queue.push(u32(u32(e + 8) + k * 4));
      }
    }
    if (
      jOff &&
      jLen > 4 &&
      inRange(jOff, jLen) &&
      bytes[jOff] === 0xff &&
      bytes[jOff + 1] === 0xd8
    )
      found.set(jOff, Math.max(found.get(jOff) ?? 0, jLen));
    queue.push(u32(ifd + 2 + count * 12));
  }
  return [...found.entries()]
    .map(([offset, length]) => ({ offset, length }))
    .sort((a, b) => b.length - a.length);
}

/** The largest embedded JPEG as its own bytes, or null. */
export function largestPreview(
  bytes: Uint8Array,
): Uint8Array<ArrayBuffer> | null {
  const [best] = findEmbeddedJpegs(bytes);
  return best ? bytes.slice(best.offset, best.offset + best.length) : null;
}

/** File extensions the converter accepts (Sony RAW variants). */
export const SONY_RAW_EXT = /\.(arw|sr2|srf)$/i;

/** "DSC01234.ARW" → "DSC01234.jpg". */
export function outputName(name: string, format: 'jpg' | 'png'): string {
  const base = name.replace(/\.[^.]+$/, '') || 'photo';
  return `${base}.${format}`;
}

/** Shutter time in seconds → "1/250 s" or "2 s". */
export function formatShutter(s: number): string {
  if (!Number.isFinite(s) || s <= 0) return '';
  if (s >= 1) return `${Math.round(s * 10) / 10} s`;
  return `1/${Math.round(1 / s)} s`;
}
