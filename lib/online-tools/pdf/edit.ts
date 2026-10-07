// Page editing: delete, crop, add text/images/boxes, and fill forms. Pure
// byte-in / byte-out functions on top of pdf-lib (runs in Vitest too).

import { ToolInputError } from '../engines/data';
import { hexToRgb01, loadPdf, visualFrame } from './core';

async function lib() {
  return import('pdf-lib');
}

/* ---------- Delete pages ---------- */

export async function deletePages(
  bytes: Uint8Array | ArrayBuffer,
  remove: number[],
  total: number,
): Promise<Uint8Array> {
  const drop = [...new Set(remove)].filter((i) => i >= 0 && i < total);
  if (!drop.length)
    throw new ToolInputError('Select at least one page to delete.');
  if (drop.length >= total)
    throw new ToolInputError(
      'You can’t delete every page — a PDF needs at least one page.',
    );
  // Remove pages in place (instead of copying the rest into a new file) so
  // form fields, bookmarks, links and document info survive.
  const doc = await loadPdf(bytes);
  const dropSet = new Set(drop);
  // getPages() can return stale entries after removePage, so decide up front.
  const keptPages = doc.getPages().filter((_, i) => !dropSet.has(i));
  for (const i of [...drop].sort((a, b) => b - a)) doc.removePage(i);
  // Drop form fields whose widgets were all on deleted pages.
  const { PDFDict } = await lib();
  const keptAnnots = new Set<unknown>();
  for (const p of keptPages)
    for (const a of p.node.Annots()?.asArray() ?? []) {
      const d = doc.context.lookup(a);
      if (d instanceof PDFDict) keptAnnots.add(d);
    }
  const form = doc.getForm();
  for (const field of form.getFields()) {
    const widgets = field.acroField.getWidgets();
    if (widgets.length && !widgets.some((w) => keptAnnots.has(w.dict)))
      form.removeField(field);
  }
  return doc.save();
}

/* ---------- Crop ---------- */

/** Insets as fractions (0–1) of the visible page, as seen on screen. */
export type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Box = { x: number; y: number; width: number; height: number };

/**
 * Converts visual insets into a crop box in unrotated page space. `/Rotate`
 * turns the page clockwise for display, so e.g. at 90° the visual top edge is
 * the page's left edge.
 */
export function cropBoxFor(current: Box, rotation: number, i: Insets): Box {
  const a = ((rotation % 360) + 360) % 360;
  // Map visual edges to page edges: [left, right, bottom, top] insets in page space.
  const [pl, pr, pb, pt] =
    a === 90
      ? [i.top, i.bottom, i.left, i.right]
      : a === 180
        ? [i.right, i.left, i.top, i.bottom]
        : a === 270
          ? [i.bottom, i.top, i.right, i.left]
          : [i.left, i.right, i.bottom, i.top];
  const x0 = current.x + pl * current.width;
  const x1 = current.x + current.width - pr * current.width;
  const y0 = current.y + pb * current.height;
  const y1 = current.y + current.height - pt * current.height;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

export async function cropPdf(
  bytes: Uint8Array | ArrayBuffer,
  insets: Insets,
  pages: number[],
): Promise<Uint8Array> {
  const vals = [insets.top, insets.right, insets.bottom, insets.left];
  if (
    vals.some((v) => !(v >= 0)) ||
    insets.left + insets.right >= 0.98 ||
    insets.top + insets.bottom >= 0.98
  )
    throw new ToolInputError(
      'The crop area is too small. Leave at least part of the page visible.',
    );
  if (!pages.length)
    throw new ToolInputError('Choose at least one page to crop.');
  const doc = await loadPdf(bytes);
  for (const idx of pages) {
    const page = doc.getPage(idx);
    const box = cropBoxFor(page.getCropBox(), page.getRotation().angle, insets);
    page.setCropBox(box.x, box.y, box.width, box.height);
    page.setTrimBox(box.x, box.y, box.width, box.height);
  }
  return doc.save();
}

/* ---------- Edit: text, images, boxes ---------- */

export type FontFamily = 'helvetica' | 'times' | 'courier';

/** Positions are fractions (0–1) of the visible page from its top-left corner. */
export type EditItem =
  | {
      kind: 'text';
      page: number;
      x: number;
      y: number;
      text: string;
      /** Font size in points. */
      size: number;
      font: FontFamily;
      bold: boolean;
      color: string;
    }
  | {
      kind: 'image';
      page: number;
      x: number;
      y: number;
      w: number;
      h: number;
      bytes: Uint8Array;
      format: 'png' | 'jpg';
    }
  | {
      kind: 'rect';
      page: number;
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      opacity: number;
    };

export const LINE_HEIGHT = 1.2;

export async function applyEdits(
  bytes: Uint8Array | ArrayBuffer,
  items: EditItem[],
): Promise<Uint8Array> {
  if (!items.length)
    throw new ToolInputError('Add some text, an image or a box first.');
  const { StandardFonts, rgb, degrees } = await lib();
  const doc = await loadPdf(bytes);
  const fontNames: Record<FontFamily, [string, string]> = {
    helvetica: [StandardFonts.Helvetica, StandardFonts.HelveticaBold],
    times: [StandardFonts.TimesRoman, StandardFonts.TimesRomanBold],
    courier: [StandardFonts.Courier, StandardFonts.CourierBold],
  };
  const fonts = new Map<string, Awaited<ReturnType<typeof doc.embedFont>>>();
  const font = async (f: FontFamily, bold: boolean) => {
    const name = fontNames[f][bold ? 1 : 0];
    if (!fonts.has(name)) fonts.set(name, await doc.embedFont(name));
    return fonts.get(name)!;
  };
  const images = new Map<
    Uint8Array,
    Awaited<ReturnType<typeof doc.embedPng>>
  >();

  // Draw in the order items were added, matching the on-screen preview.
  const ordered = items;
  for (const it of ordered) {
    if (it.page < 0 || it.page >= doc.getPageCount()) continue;
    const page = doc.getPage(it.page);
    const { vw, vh, angle, map } = visualFrame(page);
    const rotate = degrees(angle);
    if (it.kind === 'text') {
      if (!it.text.trim()) continue;
      const f = await font(it.font, it.bold);
      try {
        it.text.split('\n').forEach((line) => f.encodeText(line));
      } catch {
        throw new ToolInputError(
          'Some text contains characters the built-in PDF fonts can’t display (for example emoji or non-Latin scripts). Please use Latin letters.',
        );
      }
      const [r, g, b] = hexToRgb01(it.color);
      const ascent = f.heightAtSize(it.size, { descender: false });
      it.text.split('\n').forEach((line, n) => {
        const vx = it.x * vw;
        const vy = vh - it.y * vh - ascent - n * it.size * LINE_HEIGHT;
        const p = map(vx, vy);
        page.drawText(line, {
          x: p.x,
          y: p.y,
          size: it.size,
          font: f,
          color: rgb(r, g, b),
          rotate,
        });
      });
    } else if (it.kind === 'image') {
      let img = images.get(it.bytes);
      if (!img) {
        img =
          it.format === 'png'
            ? await doc.embedPng(it.bytes)
            : await doc.embedJpg(it.bytes);
        images.set(it.bytes, img);
      }
      const w = it.w * vw;
      const h = it.h * vh;
      const p = map(it.x * vw, vh - it.y * vh - h);
      page.drawImage(img, { x: p.x, y: p.y, width: w, height: h, rotate });
    } else {
      const [r, g, b] = hexToRgb01(it.color);
      const w = it.w * vw;
      const h = it.h * vh;
      const p = map(it.x * vw, vh - it.y * vh - h);
      page.drawRectangle({
        x: p.x,
        y: p.y,
        width: w,
        height: h,
        color: rgb(r, g, b),
        opacity: it.opacity,
        rotate,
      });
    }
  }
  return doc.save();
}

/* ---------- Forms ---------- */

export type FieldInfo = {
  name: string;
  type:
    | 'text'
    | 'checkbox'
    | 'radio'
    | 'dropdown'
    | 'list'
    | 'button'
    | 'signature'
    | 'other';
  value: string | boolean | string[];
  options: string[];
  readOnly: boolean;
  required: boolean;
  multiline: boolean;
  maxLength?: number;
  multiSelect: boolean;
};

export type FormInfo = { fields: FieldInfo[]; hasXfa: boolean };

export async function readForm(
  bytes: Uint8Array | ArrayBuffer,
): Promise<FormInfo> {
  const L = await lib();
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  const fields: FieldInfo[] = form.getFields().map((f) => {
    const base = {
      name: f.getName(),
      options: [] as string[],
      readOnly: f.isReadOnly(),
      required: f.isRequired(),
      multiline: false,
      multiSelect: false,
    };
    if (f instanceof L.PDFTextField)
      return {
        ...base,
        type: 'text' as const,
        value: f.getText() ?? '',
        multiline: f.isMultiline(),
        maxLength: f.getMaxLength(),
      };
    if (f instanceof L.PDFCheckBox)
      return { ...base, type: 'checkbox' as const, value: f.isChecked() };
    if (f instanceof L.PDFRadioGroup)
      return {
        ...base,
        type: 'radio' as const,
        value: f.getSelected() ?? '',
        options: f.getOptions(),
      };
    if (f instanceof L.PDFDropdown)
      return {
        ...base,
        type: 'dropdown' as const,
        value: f.getSelected()[0] ?? '',
        options: f.getOptions(),
      };
    if (f instanceof L.PDFOptionList)
      return {
        ...base,
        type: 'list' as const,
        value: f.getSelected(),
        options: f.getOptions(),
        multiSelect: f.isMultiselect(),
      };
    if (f instanceof L.PDFButton)
      return { ...base, type: 'button' as const, value: '' };
    if (f instanceof L.PDFSignature)
      return { ...base, type: 'signature' as const, value: '' };
    return { ...base, type: 'other' as const, value: '' };
  });
  return { fields, hasXfa: form.hasXFA() };
}

export async function fillForm(
  bytes: Uint8Array | ArrayBuffer,
  values: Record<string, string | boolean | string[]>,
  opts: { flatten: boolean },
): Promise<Uint8Array> {
  const L = await lib();
  const doc = await loadPdf(bytes);
  const form = doc.getForm();
  // Hybrid XFA forms: drop the XFA layer so viewers show the AcroForm values.
  if (form.hasXFA()) form.deleteXFA();
  const helv = await doc.embedFont(L.StandardFonts.Helvetica);
  for (const [name, value] of Object.entries(values)) {
    const f = form.getFieldMaybe(name);
    if (!f || f.isReadOnly()) continue;
    try {
      if (f instanceof L.PDFTextField && typeof value === 'string') {
        const max = f.getMaxLength();
        f.setText(max != null ? value.slice(0, max) : value);
      } else if (f instanceof L.PDFCheckBox) value ? f.check() : f.uncheck();
      else if (f instanceof L.PDFRadioGroup && typeof value === 'string') {
        if (value) f.select(value);
        else f.clear();
      } else if (f instanceof L.PDFDropdown && typeof value === 'string') {
        if (value) f.select(value);
        else f.clear();
      } else if (f instanceof L.PDFOptionList && Array.isArray(value)) {
        if (value.length) f.select(value);
        else f.clear();
      }
    } catch {
      throw new ToolInputError(`The value for “${name}” could not be set.`);
    }
  }
  try {
    form.updateFieldAppearances(helv);
  } catch {
    throw new ToolInputError(
      'Some text contains characters the built-in PDF font can’t display (for example emoji or non-Latin scripts). Please use Latin letters.',
    );
  }
  if (opts.flatten) form.flatten();
  return doc.save();
}
