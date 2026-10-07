import { PDFDocument, degrees } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  addPageNumbers,
  addTextWatermark,
  pageLabel,
  stampImage,
} from './pdf/core';

async function makePdf(pages: number, rotate = 0): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++)
    doc.addPage([300, 400]).setRotation(degrees(rotate));
  return doc.save();
}

const PNG_1PX = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);

/** Decoded content streams of a page, to assert on drawn operators. */
async function contents(bytes: Uint8Array, index: number): Promise<string> {
  const doc = await PDFDocument.load(bytes);
  const page = doc.getPage(index);
  const { PDFArray, PDFName, decodePDFRawStream } = await import('pdf-lib');
  const c = page.node.get(PDFName.of('Contents'));
  if (!c) return '';
  const refs = c instanceof PDFArray ? c.asArray() : [c];
  return refs
    .map((r) => {
      const stream = doc.context.lookup(r!) as Parameters<
        typeof decodePDFRawStream
      >[0];
      return new TextDecoder('latin1').decode(
        decodePDFRawStream(stream).decode(),
      );
    })
    .join('\n');
}

describe('PDF stamping', () => {
  it('formats page labels', () => {
    expect(pageLabel('page-n-of-total', 3, 10)).toBe('Page 3 of 10');
    expect(pageLabel('n', 1, 1)).toBe('1');
  });

  it('numbers pages, optionally skipping the cover', async () => {
    const out = await addPageNumbers(await makePdf(3), {
      position: 'bottom-center',
      format: 'n-of-total',
      start: 1,
      fontSize: 10,
      skipFirst: true,
    });
    expect(await contents(out, 0)).not.toMatch(/of 2/);
    const second = await contents(out, 1);
    expect(second).toMatch(/Tj/);
    // Text is hex-encoded by pdf-lib: "1 of 2".
    expect(second.toLowerCase()).toContain(
      Buffer.from('1 of 2').toString('hex'),
    );
    expect((await contents(out, 2)).toLowerCase()).toContain(
      Buffer.from('2 of 2').toString('hex'),
    );
  });

  it('keeps numbers upright on rotated pages', async () => {
    const out = await addPageNumbers(await makePdf(1, 90), {
      position: 'bottom-right',
      format: 'n',
      start: 5,
      fontSize: 12,
      skipFirst: false,
    });
    const c = await contents(out, 0);
    // Rotated 90°: matrix ≈ [0 1 -1 0]; bottom-right of the visible page maps to x = 300 − 28.
    expect(c).toMatch(/[\d.e-]+ 1 -1 [\d.e-]+ 272 [\d.]+ Tm/);
  });

  it('adds a watermark with opacity and rejects unsupported text', async () => {
    const out = await addTextWatermark(await makePdf(2), {
      text: 'CONFIDENTIAL',
      fontSize: 48,
      color: '#ff0000',
      opacity: 0.3,
      angle: 45,
    });
    expect((await contents(out, 1)).toLowerCase()).toContain(
      Buffer.from('CONFIDENTIAL').toString('hex'),
    );
    await expect(
      addTextWatermark(await makePdf(1), {
        text: '機密',
        fontSize: 40,
        color: '#000000',
        opacity: 0.5,
        angle: 0,
      }),
    ).rejects.toThrow(/Latin/);
    await expect(
      addTextWatermark(await makePdf(1), {
        text: '  ',
        fontSize: 40,
        color: '#000000',
        opacity: 0.5,
        angle: 0,
      }),
    ).rejects.toThrow(/enter/);
  });

  it('stamps a signature image where it was placed', async () => {
    const out = await stampImage(await makePdf(2), PNG_1PX, [
      { pageIndex: 1, x: 0.5, y: 0.75, width: 0.25, height: 0.1 },
    ]);
    const c = await contents(out, 1);
    // x = 0.5 × 300 = 150; y from bottom = 400 − 0.75 × 400 − 40 = 60; size 75 × 40.
    expect(c).toMatch(/1 0 0 1 150 60 cm/);
    expect(c).toMatch(/75 0 0 40 0 0 cm/);
    expect(await contents(out, 0)).not.toMatch(/ Do/);
    await expect(stampImage(await makePdf(1), PNG_1PX, [])).rejects.toThrow(
      /Place/,
    );
  });
});

describe('regressions', () => {
  it('splits ranges on semicolons only; commas stay in one file', async () => {
    const { splitPdf } = await import('./pdf/core');
    const parts = await splitPdf(await makePdf(5), {
      mode: 'ranges',
      ranges: '1-2, 4; 5',
    });
    expect(parts).toHaveLength(2);
    expect((await PDFDocument.load(parts[0].bytes)).getPageCount()).toBe(3);
  });
  it('max-width resizing never enlarges', async () => {
    const { computeSize } = await import('./image/core');
    expect(
      computeSize(800, 600, {
        mode: 'pixels',
        width: 1200,
        keepAspect: true,
        onlyShrink: true,
      }),
    ).toEqual({ width: 800, height: 600 });
    expect(
      computeSize(2400, 1800, {
        mode: 'pixels',
        width: 1200,
        keepAspect: true,
        onlyShrink: true,
      }),
    ).toEqual({ width: 1200, height: 900 });
  });
});
