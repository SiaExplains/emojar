// PDF editing with pdf-lib. Pure byte-in / byte-out functions, so they run
// in the browser and in Vitest alike. pdf-lib is imported lazily.

import { ToolInputError } from '../engines/data';

const NOT_A_PDF =
  'This file could not be processed. Please make sure it is a valid, unencrypted PDF file.';

/** Parses "1-3, 5, 8-", "odd", "even" or "all" into 0-based page indices. */
export function parsePageRanges(
  input: string,
  total: number,
  opts: { allowDuplicates?: boolean } = {},
): number[] {
  const text = input.trim().toLowerCase();
  if (!text || text === 'all')
    return Array.from({ length: total }, (_, i) => i);
  if (text === 'odd')
    return Array.from({ length: total }, (_, i) => i).filter(
      (i) => i % 2 === 0,
    );
  if (text === 'even')
    return Array.from({ length: total }, (_, i) => i).filter(
      (i) => i % 2 === 1,
    );
  const out: number[] = [];
  for (const part of text.split(/[,;\s]+/).filter(Boolean)) {
    const m = /^(\d+)?(?:(-)(\d+)?)?$/.exec(part);
    if (!m || (!m[1] && !m[3]))
      throw new ToolInputError(
        `“${part}” is not a valid page or range. Use numbers like 1-3, 5, 8-.`,
      );
    const start = m[1] ? Number(m[1]) : 1;
    const end = m[2] ? (m[3] ? Number(m[3]) : total) : start;
    if (start < 1 || end > total || start > total) {
      throw new ToolInputError(
        `Page ${start > total ? start : end} does not exist — this PDF has ${total} page${total === 1 ? '' : 's'}.`,
      );
    }
    const step = start <= end ? 1 : -1;
    for (let p = start; step > 0 ? p <= end : p >= end; p += step)
      out.push(p - 1);
  }
  return opts.allowDuplicates ? out : Array.from(new Set(out));
}

async function lib() {
  return import('pdf-lib');
}

export async function loadPdf(bytes: Uint8Array | ArrayBuffer) {
  const { PDFDocument } = await lib();
  try {
    return await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (/encrypt/i.test(msg))
      throw new ToolInputError(
        'This PDF is password-protected. Please remove the password first.',
      );
    throw new ToolInputError(NOT_A_PDF);
  }
}

export async function pageCount(
  bytes: Uint8Array | ArrayBuffer,
): Promise<number> {
  return (await loadPdf(bytes)).getPageCount();
}

export async function mergePdfs(
  files: (Uint8Array | ArrayBuffer)[],
  onProgress?: (done: number) => void,
): Promise<Uint8Array> {
  if (files.length < 1)
    throw new ToolInputError('Please add at least one PDF.');
  const { PDFDocument } = await lib();
  const out = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await loadPdf(files[i]);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    onProgress?.(i + 1);
  }
  return out.save();
}

/** New PDF containing the given 0-based pages, in the given order. */
export async function selectPages(
  bytes: Uint8Array | ArrayBuffer,
  indices: number[],
): Promise<Uint8Array> {
  if (!indices.length)
    throw new ToolInputError('Please choose at least one page.');
  const { PDFDocument } = await lib();
  const src = await loadPdf(bytes);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export type SplitMode =
  | { mode: 'every'; size: number }
  | { mode: 'ranges'; ranges: string };

export async function splitPdf(
  bytes: Uint8Array | ArrayBuffer,
  spec: SplitMode,
): Promise<{ label: string; bytes: Uint8Array }[]> {
  const src = await loadPdf(bytes);
  const total = src.getPageCount();
  const groups: number[][] = [];
  if (spec.mode === 'every') {
    const size = Math.max(1, Math.floor(spec.size));
    for (let i = 0; i < total; i += size)
      groups.push(
        Array.from({ length: Math.min(size, total - i) }, (_, k) => i + k),
      );
  } else {
    for (const r of spec.ranges
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean))
      groups.push(parsePageRanges(r, total));
    if (!groups.length)
      throw new ToolInputError('Please enter at least one page range.');
  }
  const out: { label: string; bytes: Uint8Array }[] = [];
  for (const g of groups) {
    const label =
      g.length === 1
        ? `page-${g[0] + 1}`
        : `pages-${g[0] + 1}-${g[g.length - 1] + 1}`;
    out.push({ label, bytes: await selectPages(bytes, g) });
  }
  return out;
}

export async function rotatePdf(
  bytes: Uint8Array | ArrayBuffer,
  degrees: number,
  indices?: number[],
): Promise<Uint8Array> {
  const { degrees: deg } = await lib();
  const doc = await loadPdf(bytes);
  const targets = indices ?? doc.getPageIndices();
  for (const i of targets) {
    const page = doc.getPage(i);
    page.setRotation(
      deg((((page.getRotation().angle + degrees) % 360) + 360) % 360),
    );
  }
  return doc.save();
}

/** Lossless size reduction: re-serialises with object streams and drops metadata bloat. */
export async function compressPdfLossless(
  bytes: Uint8Array | ArrayBuffer,
): Promise<Uint8Array> {
  const doc = await loadPdf(bytes);
  return doc.save({ useObjectStreams: true });
}

export type PdfMetadata = {
  pages: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  created?: Date;
  modified?: Date;
  pageSizes: { width: number; height: number }[];
};

export async function readMetadata(
  bytes: Uint8Array | ArrayBuffer,
): Promise<PdfMetadata> {
  const doc = await loadPdf(bytes);
  return {
    pages: doc.getPageCount(),
    title: doc.getTitle(),
    author: doc.getAuthor(),
    subject: doc.getSubject(),
    keywords: doc.getKeywords(),
    creator: doc.getCreator(),
    producer: doc.getProducer(),
    created: doc.getCreationDate(),
    modified: doc.getModificationDate(),
    pageSizes: doc.getPages().map((p) => p.getSize()),
  };
}

export async function writeMetadata(
  bytes: Uint8Array | ArrayBuffer,
  meta: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  },
): Promise<Uint8Array> {
  const doc = await loadPdf(bytes);
  if (meta.title !== undefined) doc.setTitle(meta.title);
  if (meta.author !== undefined) doc.setAuthor(meta.author);
  if (meta.subject !== undefined) doc.setSubject(meta.subject);
  if (meta.keywords !== undefined)
    doc.setKeywords(
      meta.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    );
  doc.setModificationDate(new Date());
  return doc.save();
}

export type PageSize = 'fit' | 'a4' | 'letter';
const PAGE_SIZES: Record<Exclude<PageSize, 'fit'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

/** Builds a PDF with one image per page. Images must be JPG or PNG bytes. */
export async function imagesToPdf(
  images: {
    bytes: Uint8Array | ArrayBuffer;
    type: 'jpg' | 'png';
    width: number;
    height: number;
  }[],
  opts: { pageSize?: PageSize; margin?: number } = {},
): Promise<Uint8Array> {
  const { PDFDocument } = await lib();
  const doc = await PDFDocument.create();
  const margin = Math.max(0, opts.margin ?? 0);
  for (const img of images) {
    const embedded =
      img.type === 'jpg'
        ? await doc.embedJpg(img.bytes)
        : await doc.embedPng(img.bytes);
    // 96 dpi pixels → 72 dpi points.
    const w = img.width * 0.75;
    const h = img.height * 0.75;
    if (!opts.pageSize || opts.pageSize === 'fit') {
      const page = doc.addPage([w + margin * 2, h + margin * 2]);
      page.drawImage(embedded, { x: margin, y: margin, width: w, height: h });
    } else {
      let [pw, ph] = PAGE_SIZES[opts.pageSize];
      if (w > h) [pw, ph] = [ph, pw];
      const f = Math.min((pw - margin * 2) / w, (ph - margin * 2) / h, 1);
      const page = doc.addPage([pw, ph]);
      page.drawImage(embedded, {
        x: (pw - w * f) / 2,
        y: (ph - h * f) / 2,
        width: w * f,
        height: h * f,
      });
    }
  }
  return doc.save();
}
