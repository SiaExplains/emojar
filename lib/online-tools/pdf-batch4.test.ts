import { crc32, deflateSync } from 'node:zlib';
import * as PDFLib from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import {
  applyEdits,
  cropBoxFor,
  cropPdf,
  deletePages,
  fillForm,
  readForm,
} from './pdf/edit';
import {
  cmykToGray,
  grayscalePdfDocument,
  inlineImageIsGray,
  rewriteContent,
  rgbToGray,
  unpredictPng,
  type SpaceKind,
} from './pdf/grayscale';

const {
  PDFDocument,
  PDFName,
  PDFRawStream,
  StandardFonts,
  rgb,
  cmyk,
  decodePDFRawStream,
} = PDFLib;

/** Minimal RGB PNG writer for tests. */
function makePng(
  w: number,
  h: number,
  pixel: [number, number, number],
): Uint8Array {
  const chunk = (type: string, data: Uint8Array) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), Buffer.from(data)]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // truecolour
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) raw.set(pixel, y * (w * 3 + 1) + 1 + x * 3);
  return new Uint8Array(
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw)),
      chunk('IEND', new Uint8Array()),
    ]),
  );
}

async function pagesOfWidths(widths: number[]) {
  const doc = await PDFDocument.create();
  for (const w of widths) doc.addPage([w, 500]);
  return doc.save();
}

const pageContent = (doc: PDFLib.PDFDocument, i: number) => {
  const c = doc.getPage(i).node.Contents();
  const streams =
    c instanceof PDFLib.PDFArray
      ? c.asArray().map((r) => doc.context.lookup(r) as PDFLib.PDFRawStream)
      : [c as unknown as PDFLib.PDFRawStream];
  return streams
    .map((s) => Buffer.from(decodePDFRawStream(s).decode()).toString('latin1'))
    .join('\n');
};

describe('delete pages', () => {
  it('removes the chosen pages and keeps the order', async () => {
    const bytes = await pagesOfWidths([100, 200, 300, 400, 500]);
    const out = await PDFDocument.load(await deletePages(bytes, [1, 3], 5));
    expect(out.getPages().map((p) => p.getWidth())).toEqual([100, 300, 500]);
  });

  it('keeps form fields on remaining pages and drops those on deleted pages', async () => {
    const doc = await PDFDocument.create();
    const p1 = doc.addPage([300, 300]);
    const p2 = doc.addPage([300, 300]);
    doc.setTitle('Keep my title');
    const form = doc.getForm();
    form.createTextField('on_page_1').addToPage(p1, { x: 10, y: 10 });
    form.createTextField('on_page_2').addToPage(p2, { x: 10, y: 10 });
    const out = await PDFDocument.load(
      await deletePages(await doc.save(), [1], 2),
    );
    expect(out.getPageCount()).toBe(1);
    expect(
      out
        .getForm()
        .getFields()
        .map((f) => f.getName()),
    ).toEqual(['on_page_1']);
    expect(out.getTitle()).toBe('Keep my title');
  });

  it('refuses to delete every page or nothing', async () => {
    const bytes = await pagesOfWidths([100, 200]);
    await expect(deletePages(bytes, [0, 1], 2)).rejects.toThrow(
      /at least one page/,
    );
    await expect(deletePages(bytes, [], 2)).rejects.toThrow(/Select/);
  });
});

describe('crop', () => {
  const box = { x: 0, y: 0, width: 600, height: 800 };
  const insets = { top: 0.1, right: 0.2, bottom: 0.05, left: 0.25 };

  it('maps visual insets to page space for every rotation', () => {
    expect(cropBoxFor(box, 0, insets)).toEqual({
      x: 150,
      y: 40,
      width: 330,
      height: 680,
    });
    // 90°: visual top = page left, visual right = page top.
    expect(cropBoxFor(box, 90, insets)).toEqual({
      x: 60,
      y: 200,
      width: 510,
      height: 440,
    });
    expect(cropBoxFor(box, 180, insets)).toEqual({
      x: 120,
      y: 80,
      width: 330,
      height: 680,
    });
    expect(cropBoxFor(box, 270, insets)).toEqual({
      x: 30,
      y: 160,
      width: 510,
      height: 440,
    });
  });

  it('respects an existing crop box offset', () => {
    const r = cropBoxFor({ x: 50, y: 50, width: 100, height: 100 }, 0, {
      top: 0,
      right: 0,
      bottom: 0.5,
      left: 0.5,
    });
    expect(r).toEqual({ x: 100, y: 100, width: 50, height: 50 });
  });

  it('writes CropBox and TrimBox on the chosen pages only', async () => {
    const bytes = await pagesOfWidths([600, 600]);
    const out = await PDFDocument.load(
      await cropPdf(bytes, { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 }, [
        1,
      ]),
    );
    expect(out.getPage(0).getCropBox()).toEqual({
      x: 0,
      y: 0,
      width: 600,
      height: 500,
    });
    const cb = out.getPage(1).getCropBox();
    expect(cb.x).toBeCloseTo(60);
    expect(cb.width).toBeCloseTo(480);
    expect(out.getPage(1).getTrimBox().height).toBeCloseTo(400);
  });

  it('rejects a crop that leaves nothing', async () => {
    const bytes = await pagesOfWidths([600]);
    await expect(
      cropPdf(bytes, { top: 0.5, right: 0, bottom: 0.5, left: 0 }, [0]),
    ).rejects.toThrow(/too small/);
  });
});

describe('edit', () => {
  it('draws text, images and boxes at the right place', async () => {
    const bytes = await pagesOfWidths([600]);
    const out = await applyEdits(bytes, [
      {
        kind: 'rect',
        page: 0,
        x: 0.5,
        y: 0.5,
        w: 0.2,
        h: 0.1,
        color: '#ffffff',
        opacity: 1,
      },
      {
        kind: 'text',
        page: 0,
        x: 0.1,
        y: 0.1,
        text: 'Hello\nWorld',
        size: 20,
        font: 'times',
        bold: true,
        color: '#ff0000',
      },
      {
        kind: 'image',
        page: 0,
        x: 0,
        y: 0,
        w: 0.1,
        h: 0.1,
        bytes: makePng(4, 4, [0, 128, 255]),
        format: 'png',
      },
    ]);
    const doc = await PDFDocument.load(out);
    const content = pageContent(doc, 0);
    expect(content).toMatch(/Tj/);
    expect(content).toMatch(/1 1 1 rg/);
    expect(content).toMatch(/\bDo\b/);
    // Items are drawn in the order they were added (white-out first here).
    expect(content.indexOf('1 1 1 rg')).toBeLessThan(content.indexOf('Tj'));
    // Text starts 10 % from the left: x = 60.
    expect(content).toMatch(/1 0 0 1 60 /);
    expect(String(doc.getPage(0).node.Resources())).toMatch(/Times-Bold/);
  });

  it('positions edits relative to the visible (cropped) page', async () => {
    const cropped = await cropPdf(
      await pagesOfWidths([600]),
      { top: 0, right: 0, bottom: 0, left: 0.5 },
      [0],
    );
    const doc = await PDFDocument.load(
      await applyEdits(cropped, [
        {
          kind: 'rect',
          page: 0,
          x: 0,
          y: 0,
          w: 0.1,
          h: 0.1,
          color: '#000000',
          opacity: 1,
        },
      ]),
    );
    // Left edge of the visible area is x = 300, so the box starts there.
    expect(pageContent(doc, 0)).toMatch(/\b300 450\b|\b300 450 m/);
  });

  it('rejects text the standard fonts cannot encode', async () => {
    const bytes = await pagesOfWidths([600]);
    await expect(
      applyEdits(bytes, [
        {
          kind: 'text',
          page: 0,
          x: 0,
          y: 0,
          text: 'Привет',
          size: 12,
          font: 'helvetica',
          bold: false,
          color: '#000000',
        },
      ]),
    ).rejects.toThrow(/Latin letters/);
  });
});

describe('forms', () => {
  async function makeForm() {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 800]);
    const form = doc.getForm();
    form.createTextField('full_name').addToPage(page, { x: 50, y: 700 });
    form.createCheckBox('agree').addToPage(page, { x: 50, y: 650 });
    const dd = form.createDropdown('country');
    dd.addOptions(['Germany', 'France']);
    dd.addToPage(page, { x: 50, y: 600 });
    const rg = form.createRadioGroup('size');
    rg.addOptionToPage('S', page, { x: 50, y: 550 });
    rg.addOptionToPage('M', page, { x: 100, y: 550 });
    const ro = form.createTextField('locked');
    ro.setText('fixed');
    ro.enableReadOnly();
    ro.addToPage(page, { x: 50, y: 500 });
    return doc.save();
  }

  it('lists fields with their types and options', async () => {
    const info = await readForm(await makeForm());
    expect(info.hasXfa).toBe(false);
    const byName = Object.fromEntries(info.fields.map((f) => [f.name, f]));
    expect(byName.full_name.type).toBe('text');
    expect(byName.agree.type).toBe('checkbox');
    expect(byName.country.options).toEqual(['Germany', 'France']);
    expect(byName.size.options).toEqual(['S', 'M']);
    expect(byName.locked.readOnly).toBe(true);
  });

  it('fills values and can flatten', async () => {
    const bytes = await makeForm();
    const values = {
      full_name: 'Ada Lovelace',
      agree: true,
      country: 'France',
      size: 'M',
      locked: 'changed',
    };
    const filled = await PDFDocument.load(
      await fillForm(bytes, values, { flatten: false }),
    );
    const form = filled.getForm();
    expect(form.getTextField('full_name').getText()).toBe('Ada Lovelace');
    expect(form.getCheckBox('agree').isChecked()).toBe(true);
    expect(form.getDropdown('country').getSelected()).toEqual(['France']);
    expect(form.getRadioGroup('size').getSelected()).toBe('M');
    expect(form.getTextField('locked').getText()).toBe('fixed');
    const flat = await PDFDocument.load(
      await fillForm(bytes, values, { flatten: true }),
    );
    expect(flat.getForm().getFields()).toHaveLength(0);
  });

  it('rejects text the field font cannot show', async () => {
    await expect(
      fillForm(await makeForm(), { full_name: '日本' }, { flatten: false }),
    ).rejects.toThrow(/Latin/);
  });
});

describe('grayscale engine', () => {
  const spaces: Record<string, SpaceKind> = {
    CS0: { ok: true, kind: 'rgb' },
    CS1: { ok: true, kind: 'cmyk' },
    P0: { ok: false, reason: 'pattern fill' },
  };
  const resolve = (n: string): SpaceKind =>
    spaces[n] ?? { ok: false, reason: 'x' };

  it('converts colour maths', () => {
    expect(rgbToGray(1, 0, 0)).toBeCloseTo(0.299);
    expect(cmykToGray(0, 0, 0, 1)).toBe(0);
    expect(cmykToGray(0, 0, 0, 0)).toBeCloseTo(1);
  });

  it('rewrites colour operators but leaves strings and other operators alone', () => {
    const src =
      'q 1 0 0 rg 0 0 1 RG (rg 1 0 0) Tj 0 0 0 1 k /CS0 cs 0 1 0 scn 10 10 m Q';
    const r = rewriteContent(src, resolve, () => true);
    expect(r.problems).toEqual([]);
    expect(r.text).toBe(
      'q 0.299 g 0.114 G (rg 1 0 0) Tj 0 g /DeviceGray cs 0.587 scn 10 10 m Q',
    );
  });

  it('tracks colour spaces through q/Q', () => {
    const r = rewriteContent(
      '/CS1 cs q /CS0 cs Q 0 0 0 0 scn',
      resolve,
      () => true,
    );
    expect(r.text).toBe('/DeviceGray cs q /DeviceGray cs Q 1 scn');
  });

  it('flags patterns, shadings and colour inline images', () => {
    const r = rewriteContent(
      '/P0 cs /Sh0 sh BI /W 1 /H 1 /CS /RGB /BPC 8 ID \x00\x01\x02 EI',
      resolve,
      inlineImageIsGray,
    );
    expect(r.problems.sort()).toEqual([
      'gradient (shading)',
      'inline colour image',
      'pattern fill',
    ]);
    expect(inlineImageIsGray('BI /W 1 /H 1 /CS /G /BPC 8 ID')).toBe(true);
    expect(inlineImageIsGray('BI /W 1 /H 1 /IM true ID')).toBe(true);
  });

  it('undoes PNG predictors', () => {
    // Two rows of 2 RGB pixels: row 1 "Sub", row 2 "Up".
    const data = new Uint8Array([1, 10, 20, 30, 5, 5, 5, 2, 1, 1, 1, 1, 1, 1]);
    expect(Array.from(unpredictPng(data, 3, 2))).toEqual([
      10, 20, 30, 15, 25, 35, 11, 21, 31, 16, 26, 36,
    ]);
  });

  it('turns a coloured PDF gray and keeps the text', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([400, 400]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawRectangle({
      x: 10,
      y: 10,
      width: 100,
      height: 100,
      color: rgb(1, 0, 0),
      borderColor: cmyk(0, 1, 0, 0),
      borderWidth: 2,
    });
    page.drawText('Keep me selectable', {
      x: 20,
      y: 300,
      size: 18,
      font,
      color: rgb(0, 0, 1),
    });
    const png = await doc.embedPng(makePng(8, 8, [255, 0, 0]));
    page.drawImage(png, { x: 200, y: 200, width: 50, height: 50 });
    const loaded = await PDFDocument.load(await doc.save());

    const report = await grayscalePdfDocument(loaded, PDFLib);
    expect(report.unsupported).toEqual([]);
    expect(report.imagesConverted).toBe(1);
    const out = await PDFDocument.load(await loaded.save());
    const content = pageContent(out, 0);
    expect(content).not.toMatch(/\s(rg|RG|k|K)\s/);
    expect(content).toMatch(/Keep me selectable|<4B656570/);
    // The image is now DeviceGray with one byte per pixel.
    const xobjs = out
      .getPage(0)
      .node.Resources()!
      .lookup(PDFName.of('XObject'), PDFLib.PDFDict);
    const [, ref] = xobjs.entries()[0];
    const img = out.context.lookup(ref) as PDFLib.PDFRawStream;
    expect(img.dict.lookup(PDFName.of('ColorSpace'))).toBe(
      PDFName.of('DeviceGray'),
    );
    const px = decodePDFRawStream(img).decode();
    expect(px.length).toBe(64);
    expect(px[0]).toBe(Math.round(0.299 * 255));
  });

  it('reports JPEGs as unsupported when no browser converter is given', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([100, 100]);
    const jpeg = doc.context.stream(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), {
      Type: 'XObject',
      Subtype: 'Image',
      Width: 1,
      Height: 1,
      BitsPerComponent: 8,
      ColorSpace: 'DeviceRGB',
      Filter: 'DCTDecode',
    });
    const ref = doc.context.register(jpeg);
    page.node.setXObject(PDFName.of('Im0'), ref);
    page.pushOperators(
      PDFLib.pushGraphicsState(),
      PDFLib.drawObject('Im0'),
      PDFLib.popGraphicsState(),
    );
    const loaded = await PDFDocument.load(await doc.save());
    const report = await grayscalePdfDocument(loaded, PDFLib);
    expect(report.unsupported).toEqual([
      { page: 0, reasons: ['colour image in an unsupported format'] },
    ]);
  });

  it('does not leave orphaned content streams', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]).drawRectangle({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      color: rgb(0, 1, 0),
    });
    const loaded = await PDFDocument.load(await doc.save());
    const before = loaded.context.enumerateIndirectObjects().length;
    await grayscalePdfDocument(loaded, PDFLib);
    expect(loaded.context.enumerateIndirectObjects().length).toBe(before);
    expect(PDFRawStream).toBeDefined();
  });
});

describe('scan effects', () => {
  it('finds a threshold between ink and paper and binarises', async () => {
    const {
      otsuThreshold,
      thresholdPixels,
      grayscalePixels,
      mulberry32,
      scanLookPixels,
    } = await import('./pdf/scan');
    const d = new Uint8ClampedArray(400 * 4);
    for (let i = 0; i < 400; i++)
      d.set(i < 100 ? [30, 30, 30, 255] : [230, 230, 230, 255], i * 4);
    const t = otsuThreshold(d);
    expect(t).toBeGreaterThanOrEqual(30);
    expect(t).toBeLessThan(230);
    thresholdPixels(d, t);
    expect(d[0]).toBe(0);
    expect(d[399 * 4]).toBe(255);
    const c = new Uint8ClampedArray([255, 0, 0, 255]);
    grayscalePixels(c);
    expect(Array.from(c)).toEqual([76, 76, 76, 255]);
    const a = mulberry32(7);
    const b = mulberry32(7);
    expect([a(), a()]).toEqual([b(), b()]);
    const s = new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]);
    scanLookPixels(s, { bw: false, noise: 0, rng: () => 0.5 });
    expect(s[0]).toBeGreaterThan(s[2]); // warm paper tone
    expect(s[4]).toBeLessThan(10);
  });
});
