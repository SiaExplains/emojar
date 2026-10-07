import { PDFDocument, degrees } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  computeSize,
  detectImageType,
  detectInputKind,
  outputName,
  removeBackground,
  rotatedSize,
  savingsPercent,
} from './image/core';
import { plan } from './image/render';
import {
  compressPdfLossless,
  imagesToPdf,
  mergePdfs,
  parsePageRanges,
  readMetadata,
  rotatePdf,
  selectPages,
  splitPdf,
  writeMetadata,
} from './pdf/core';

async function makePdf(pages: number, title = 'Doc'): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  for (let i = 0; i < pages; i++) doc.addPage([200 + i, 300]);
  return doc.save();
}

const widths = async (bytes: Uint8Array) =>
  (await PDFDocument.load(bytes)).getPages().map((p) => p.getWidth());

// Smallest valid 1×1 PNG and JPEG.
const PNG_1PX = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);

describe('image core', () => {
  it('computes resize targets', () => {
    expect(
      computeSize(4000, 3000, {
        mode: 'pixels',
        width: 1200,
        keepAspect: true,
      }),
    ).toEqual({ width: 1200, height: 900 });
    expect(
      computeSize(4000, 3000, {
        mode: 'pixels',
        height: 300,
        keepAspect: true,
      }),
    ).toEqual({ width: 400, height: 300 });
    expect(
      computeSize(4000, 3000, {
        mode: 'pixels',
        width: 500,
        height: 500,
        keepAspect: true,
      }),
    ).toEqual({ width: 500, height: 375 });
    expect(
      computeSize(4000, 3000, {
        mode: 'pixels',
        width: 500,
        height: 500,
        keepAspect: false,
      }),
    ).toEqual({ width: 500, height: 500 });
    expect(computeSize(1000, 500, { mode: 'percent', percent: 50 })).toEqual({
      width: 500,
      height: 250,
    });
  });

  it('computes rotated canvas sizes', () => {
    expect(rotatedSize(400, 200, 90)).toEqual({ width: 200, height: 400 });
    expect(rotatedSize(400, 200, -90)).toEqual({ width: 200, height: 400 });
    expect(rotatedSize(400, 200, 180)).toEqual({ width: 400, height: 200 });
    expect(rotatedSize(100, 100, 45)).toEqual({ width: 141, height: 141 });
  });

  it('plans crop → resize → rotate', () => {
    const p = plan(1000, 800, {
      format: 'png',
      crop: { x: 100, y: 100, width: 2000, height: 400 },
      resize: { mode: 'percent', percent: 50 },
      rotate: 90,
    });
    expect(p.crop).toEqual({ x: 100, y: 100, width: 900, height: 400 });
    expect(p.scaled).toEqual({ width: 450, height: 200 });
    expect(p.canvas).toEqual({ width: 200, height: 450 });
  });

  it('names output files and detects inputs', () => {
    expect(outputName('holiday.photo.JPG', 'png')).toBe('holiday.photo.png');
    expect(outputName('scan.pdf', 'jpg', '-page-2')).toBe('scan-page-2.jpg');
    expect(detectInputKind({ name: 'a.svg', type: '' })).toBe('svg');
    expect(detectInputKind({ name: 'a.PDF', type: '' })).toBe('pdf');
    expect(detectInputKind({ name: 'a.heic', type: 'image/heic' })).toBe(
      'raster',
    );
    expect(
      detectInputKind({ name: 'notes.txt', type: 'text/plain' }),
    ).toBeNull();
    expect(savingsPercent(1000, 250)).toBe(75);
  });

  it('detects image types by magic bytes', () => {
    expect(detectImageType(PNG_1PX)?.ext).toBe('png');
    expect(
      detectImageType(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]))?.ext,
    ).toBe('jpg');
    expect(
      detectImageType(
        new TextEncoder().encode('<?xml version="1.0"?><svg></svg>'),
      )?.ext,
    ).toBe('svg');
    expect(detectImageType(new TextEncoder().encode('hello'))).toBeNull();
  });

  it('removes a connected background but keeps enclosed pixels', () => {
    // 5×5 white image with a red ring; the centre pixel inside the ring is white too.
    const w = 5;
    const data = new Uint8ClampedArray(w * w * 4).fill(255);
    const set = (x: number, y: number, r: number, g: number, b: number) =>
      data.set([r, g, b, 255], (y * w + x) * 4);
    for (let i = 1; i <= 3; i++) {
      set(i, 1, 255, 0, 0);
      set(i, 3, 255, 0, 0);
      set(1, i, 255, 0, 0);
      set(3, i, 255, 0, 0);
    }
    const img = { data: new Uint8ClampedArray(data), width: w, height: w };
    removeBackground(img, {
      target: [255, 255, 255],
      tolerance: 5,
      contiguous: true,
    });
    const alpha = (x: number, y: number) => img.data[(y * w + x) * 4 + 3];
    expect(alpha(0, 0)).toBe(0);
    expect(alpha(1, 1)).toBe(255);
    expect(alpha(2, 2)).toBe(255); // enclosed white stays
    const all = { data: new Uint8ClampedArray(data), width: w, height: w };
    removeBackground(all, {
      target: [255, 255, 255],
      tolerance: 5,
      contiguous: false,
    });
    expect(all.data[(2 * w + 2) * 4 + 3]).toBe(0);
  });
});

describe('pdf core', () => {
  it('parses page ranges', () => {
    expect(parsePageRanges('1-3, 5, 8-', 9)).toEqual([0, 1, 2, 4, 7, 8]);
    expect(parsePageRanges('all', 3)).toEqual([0, 1, 2]);
    expect(parsePageRanges('odd', 5)).toEqual([0, 2, 4]);
    expect(parsePageRanges('even', 5)).toEqual([1, 3]);
    expect(parsePageRanges('3-1', 3)).toEqual([2, 1, 0]);
    expect(parsePageRanges('1,1', 3, { allowDuplicates: true })).toEqual([
      0, 0,
    ]);
    expect(() => parsePageRanges('4', 3)).toThrow(/does not exist/);
    expect(() => parsePageRanges('a-b', 3)).toThrow(/not a valid/);
  });

  it('merges PDFs in order', async () => {
    const merged = await mergePdfs([await makePdf(2), await makePdf(1)]);
    expect(await widths(merged)).toEqual([200, 201, 200]);
  });

  it('selects, reorders and splits pages', async () => {
    const src = await makePdf(5);
    expect(await widths(await selectPages(src, [4, 0]))).toEqual([204, 200]);
    const parts = await splitPdf(src, { mode: 'every', size: 2 });
    expect(parts.map((p) => p.label)).toEqual([
      'pages-1-2',
      'pages-3-4',
      'page-5',
    ]);
    const ranged = await splitPdf(src, { mode: 'ranges', ranges: '1-2; 5' });
    expect(await widths(ranged[1].bytes)).toEqual([204]);
  });

  it('rotates selected pages', async () => {
    const out = await PDFDocument.load(
      await rotatePdf(await makePdf(3), 90, [1]),
    );
    expect(out.getPages().map((p) => p.getRotation().angle)).toEqual([
      0, 90, 0,
    ]);
    const twice = await PDFDocument.load(
      await rotatePdf(await rotatePdf(await makePdf(1), 270), 180),
    );
    expect(twice.getPage(0).getRotation()).toEqual(degrees(90));
  });

  it('reads and writes metadata, and re-saves losslessly', async () => {
    const src = await makePdf(2, 'Quarterly report');
    const meta = await readMetadata(src);
    expect(meta).toMatchObject({ pages: 2, title: 'Quarterly report' });
    const edited = await readMetadata(
      await writeMetadata(src, {
        title: 'New',
        author: 'Ada',
        keywords: 'a, b',
      }),
    );
    expect(edited).toMatchObject({
      title: 'New',
      author: 'Ada',
      keywords: 'a b',
    });
    expect(
      (await PDFDocument.load(await compressPdfLossless(src))).getPageCount(),
    ).toBe(2);
  });

  it('builds a PDF from images', async () => {
    const pdf = await PDFDocument.load(
      await imagesToPdf(
        [{ bytes: PNG_1PX, type: 'png', width: 400, height: 200 }],
        { pageSize: 'fit' },
      ),
    );
    expect(pdf.getPage(0).getSize()).toEqual({ width: 300, height: 150 });
    const a4 = await PDFDocument.load(
      await imagesToPdf(
        [{ bytes: PNG_1PX, type: 'png', width: 400, height: 200 }],
        { pageSize: 'a4' },
      ),
    );
    expect(Math.round(a4.getPage(0).getWidth())).toBe(842); // landscape for a wide image
  });

  it('rejects non-PDF input with a friendly message', async () => {
    await expect(
      readMetadata(new TextEncoder().encode('not a pdf')),
    ).rejects.toThrow(/valid, unencrypted PDF/);
  });
});
