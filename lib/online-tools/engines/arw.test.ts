import { describe, expect, it } from 'vitest';
import {
  findEmbeddedJpegs,
  formatShutter,
  isTiffBased,
  largestPreview,
  outputName,
} from './arw';
import { toRgba } from './raw-decoder';

/**
 * Builds a minimal TIFF: IFD0 with a small JPEG and a SubIFD pointer, the
 * SubIFD with a larger JPEG, and IFD1 (via IFD0's next pointer) with a third.
 */
function tiff(le: boolean): Uint8Array {
  const buf = new ArrayBuffer(512);
  const v = new DataView(buf);
  const b = new Uint8Array(buf);
  const w16 = (o: number, x: number) => v.setUint16(o, x, le);
  const w32 = (o: number, x: number) => v.setUint32(o, x, le);
  b.set(le ? [0x49, 0x49, 0x2a, 0] : [0x4d, 0x4d, 0, 0x2a]);
  w32(4, 8);
  const jpeg = (at: number, len: number) => {
    b[at] = 0xff;
    b[at + 1] = 0xd8;
    b[at + len - 2] = 0xff;
    b[at + len - 1] = 0xd9;
  };
  const ifd = (
    at: number,
    entries: [number, number, number, number][],
    next: number,
  ) => {
    w16(at, entries.length);
    entries.forEach(([tag, type, n, val], i) => {
      const e = at + 2 + i * 12;
      w16(e, tag);
      w16(e + 2, type);
      w32(e + 4, n);
      if (type === 3) w16(e + 8, val);
      else w32(e + 8, val);
    });
    w32(at + 2 + entries.length * 12, next);
  };
  // IFD0 at 8: JPEG (300, 20 bytes), SubIFD -> 100, next IFD -> 150
  ifd(
    8,
    [
      [0x0201, 4, 1, 300],
      [0x0202, 4, 1, 20],
      [0x014a, 4, 1, 100],
    ],
    150,
  );
  // SubIFD at 100: JPEG (330, 120 bytes)
  ifd(
    100,
    [
      [0x0201, 4, 1, 330],
      [0x0202, 4, 1, 120],
    ],
    0,
  );
  // IFD1 at 150: JPEG (460, 40 bytes); length as SHORT
  ifd(
    150,
    [
      [0x0201, 4, 1, 460],
      [0x0202, 3, 1, 40],
    ],
    0,
  );
  jpeg(300, 20);
  jpeg(330, 120);
  jpeg(460, 40);
  return b;
}

describe('ARW preview extraction', () => {
  it('finds every embedded JPEG, largest first, in both byte orders', () => {
    for (const le of [true, false]) {
      const f = tiff(le);
      expect(isTiffBased(f)).toBe(true);
      expect(findEmbeddedJpegs(f)).toEqual([
        { offset: 330, length: 120 },
        { offset: 460, length: 40 },
        { offset: 300, length: 20 },
      ]);
      const p = largestPreview(f)!;
      expect(p.length).toBe(120);
      expect([p[0], p[1], p[118], p[119]]).toEqual([0xff, 0xd8, 0xff, 0xd9]);
    }
  });

  it('ignores non-TIFF data, bad offsets and IFD loops', () => {
    expect(
      isTiffBased(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0])),
    ).toBe(false);
    expect(findEmbeddedJpegs(new Uint8Array(4))).toEqual([]);
    const f = tiff(true);
    // Point IFD1's next-IFD back at IFD0: must not loop forever.
    new DataView(f.buffer).setUint32(150 + 2 + 2 * 12, 8, true);
    expect(findEmbeddedJpegs(f)).toHaveLength(3);
    // A JPEG offset outside the file is skipped.
    new DataView(f.buffer).setUint32(100 + 2 + 8, 5000, true);
    expect(findEmbeddedJpegs(f).map((j) => j.offset)).toEqual([460, 300]);
    // No SOI marker at the offset: skipped too.
    f[460] = 0;
    expect(findEmbeddedJpegs(f).map((j) => j.offset)).toEqual([300]);
  });

  it('names output files and formats shutter speeds', () => {
    expect(outputName('DSC01234.ARW', 'jpg')).toBe('DSC01234.jpg');
    expect(outputName('shot.final.arw', 'png')).toBe('shot.final.png');
    expect(formatShutter(1 / 250)).toBe('1/250 s');
    expect(formatShutter(2)).toBe('2 s');
    expect(formatShutter(0)).toBe('');
  });

  it('converts RGB (8- and 16-bit) to RGBA', () => {
    const rgb8 = toRgba({
      width: 2,
      height: 1,
      colors: 3,
      bits: 8,
      data: new Uint8Array([1, 2, 3, 4, 5, 6]),
    });
    expect([...rgb8]).toEqual([1, 2, 3, 255, 4, 5, 6, 255]);
    const rgb16 = toRgba({
      width: 1,
      height: 1,
      colors: 3,
      bits: 16,
      data: new Uint16Array([0xff00, 0x8000, 0x0100]),
    });
    expect([...rgb16]).toEqual([255, 128, 1, 255]);
  });
});
