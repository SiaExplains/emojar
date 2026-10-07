import { describe, expect, it } from 'vitest';
import { ASCII_CHARSETS, imageToAscii } from './ascii';
import { blurRegion, fillRegion, pixelate } from './effects';
import { buildIco } from './ico';
import {
  COLLAGE_LAYOUTS,
  SOCIAL_PLATFORMS,
  anchorPoint,
  centerCrop,
  collageRects,
  containDest,
  coverSource,
  splitGrid,
} from './layout';
import { PASSPORT_PRESETS, SHEETS, mmToPx, sheetLayout } from './passport';

const solid = (w: number, h: number, rgba: number[]) => {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) data.set(rgba, i * 4);
  return { data, width: w, height: h };
};

describe('passport photos', () => {
  it('converts millimetres to pixels at 300 DPI', () => {
    expect(mmToPx(25.4)).toBe(300);
    expect(mmToPx(35)).toBe(413);
    expect(mmToPx(45)).toBe(531);
  });

  it('has sane presets', () => {
    const us = PASSPORT_PRESETS.find((p) => p.id === 'us')!;
    expect(mmToPx(us.widthMm)).toBe(600);
    for (const p of PASSPORT_PRESETS) {
      expect(p.head[0]).toBeLessThan(p.head[1]);
      expect(p.head[1]).toBeLessThanOrEqual(0.85);
    }
  });

  it('fits 2×2 in photos on a 4×6 print without overlap', () => {
    const sheet = SHEETS.find((s) => s.id === '4x6')!;
    const l = sheetLayout(50.8, 50.8, sheet);
    expect(l.width).toBe(1800);
    expect(l.height).toBe(1200);
    expect(l.photos.length).toBe(6); // edge-to-edge 3 × 2
    for (const p of l.photos) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.x + p.w).toBeLessThanOrEqual(l.width);
      expect(p.y + p.h).toBeLessThanOrEqual(l.height);
    }
  });

  it('fits many 35×45 mm photos on A4', () => {
    const l = sheetLayout(35, 45, SHEETS.find((s) => s.id === 'a4')!);
    expect(l.photos.length).toBeGreaterThanOrEqual(25);
  });
});

describe('ICO writer', () => {
  it('writes a valid header and directory', () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([4, 5]);
    const ico = buildIco([
      { size: 16, png: a },
      { size: 256, png: b },
    ]);
    const v = new DataView(ico.buffer);
    expect(v.getUint16(0, true)).toBe(0);
    expect(v.getUint16(2, true)).toBe(1);
    expect(v.getUint16(4, true)).toBe(2);
    expect(ico[6]).toBe(16);
    expect(ico[22]).toBe(0); // 256 stored as 0
    expect(v.getUint32(6 + 8, true)).toBe(3);
    expect(v.getUint32(6 + 12, true)).toBe(38);
    expect(v.getUint32(22 + 12, true)).toBe(41);
    expect(Array.from(ico.slice(38))).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('ASCII art', () => {
  it('maps dark to dense and light to blank', () => {
    const img = solid(4, 2, [0, 0, 0, 255]);
    for (let x = 2; x < 4; x++)
      for (let y = 0; y < 2; y++)
        img.data.set([255, 255, 255, 255], (y * 4 + x) * 4);
    const r = imageToAscii(img, { cols: 2, chars: '# ', aspect: 2 });
    expect(r.text).toBe('#\n#');
    const inv = imageToAscii(img, {
      cols: 2,
      chars: '# ',
      invert: true,
      aspect: 2,
    });
    expect(inv.text).toBe(' #\n #');
  });

  it('halves the row density by default and returns colours', () => {
    const r = imageToAscii(solid(100, 100, [255, 0, 0, 255]), {
      cols: 20,
      chars: ASCII_CHARSETS.standard.chars,
      color: true,
    });
    expect(r.rows).toBe(10);
    expect(r.colors?.[0]).toEqual([255, 0, 0]);
  });
});

describe('layout geometry', () => {
  it('splits a grid exactly and numbers posts from the end', () => {
    const tiles = splitGrid({ x: 0, y: 0, w: 1000, h: 1000 }, 3, 3);
    expect(tiles.length).toBe(9);
    expect(tiles.reduce((n, t) => n + t.w * t.h, 0)).toBe(1_000_000);
    expect(tiles[0].post).toBe(9);
    expect(tiles[8].post).toBe(1);
  });

  it('centre-crops to an aspect ratio', () => {
    expect(centerCrop(1200, 800, 1, 1)).toEqual({
      x: 200,
      y: 0,
      w: 800,
      h: 800,
    });
    expect(centerCrop(800, 1200, 3, 2)).toEqual({
      x: 0,
      y: 334,
      w: 800,
      h: 533,
    });
  });

  it('places collage cells with even gaps', () => {
    const rects = collageRects(
      COLLAGE_LAYOUTS.find((l) => l.id === '2h')!.cells,
      1000,
      500,
      20,
    );
    expect(rects[0]).toEqual({ x: 20, y: 20, w: 470, h: 460 });
    expect(rects[1].x - (rects[0].x + rects[0].w)).toBe(20);
    expect(1000 - (rects[1].x + rects[1].w)).toBe(20);
    for (const l of COLLAGE_LAYOUTS) {
      const area = l.cells.reduce((n, c) => n + c.w * c.h, 0);
      expect(area, l.id).toBeCloseTo(1, 5);
    }
  });

  it('computes cover and contain fits', () => {
    expect(coverSource(2000, 1000, 1000, 1000)).toEqual({
      x: 500,
      y: 0,
      w: 1000,
      h: 1000,
    });
    expect(coverSource(2000, 1000, 1000, 1000, 0, 0.5)).toEqual({
      x: 0,
      y: 0,
      w: 1000,
      h: 1000,
    });
    expect(containDest(2000, 1000, 1000, 1000)).toEqual({
      x: 0,
      y: 250,
      w: 1000,
      h: 500,
    });
  });

  it('anchors watermarks inside the margin', () => {
    expect(anchorPoint('bottom-right', 1000, 800, 200, 100, 20)).toEqual({
      x: 880,
      y: 730,
    });
    expect(anchorPoint('center', 1000, 800, 200, 100, 20)).toEqual({
      x: 500,
      y: 400,
    });
  });

  it('has unique social preset ids', () => {
    const ids = Object.values(SOCIAL_PLATFORMS).flatMap((p) =>
      p.presets.map((x) => x.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('region effects', () => {
  const checker = () => {
    const img = solid(8, 8, [0, 0, 0, 255]);
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++)
        if ((x + y) % 2) img.data.set([255, 255, 255, 255], (y * 8 + x) * 4);
    return img;
  };

  it('pixelate replaces detail with block averages and leaves the rest', () => {
    const img = checker();
    pixelate(img, { x: 0, y: 0, w: 4, h: 4 }, 4);
    const inside = new Set<number>();
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) inside.add(img.data[(y * 8 + x) * 4]);
    expect([...inside]).toEqual([128]);
    expect(img.data[(5 * 8 + 4) * 4]).toBe(255); // (4,5) untouched
  });

  it('blur flattens a checkerboard region', () => {
    const img = checker();
    blurRegion(img, { x: 0, y: 0, w: 8, h: 8 }, 3);
    for (let i = 0; i < 64; i++) {
      expect(img.data[i * 4]).toBeGreaterThan(80);
      expect(img.data[i * 4]).toBeLessThan(175);
    }
  });

  it('fill paints a solid box clipped to the image', () => {
    const img = checker();
    fillRegion(img, { x: 6, y: 6, w: 10, h: 10 }, [10, 20, 30]);
    expect(
      Array.from(img.data.slice((7 * 8 + 7) * 4, (7 * 8 + 7) * 4 + 4)),
    ).toEqual([10, 20, 30, 255]);
    expect(img.data[(5 * 8 + 5) * 4]).toBe(0);
  });
});
