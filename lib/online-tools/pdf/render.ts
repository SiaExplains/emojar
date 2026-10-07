// PDF rendering and text extraction with pdf.js (browser only). pdf.js runs
// its parser in its own Web Worker, so large PDFs don't block the UI.

import { ToolInputError } from '../engines/data';
import { MIME, type ImageFormat } from '../image/core';

type PdfJs = typeof import('pdfjs-dist');

let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

/** Opens a PDF; call `close()` when done to free pdf.js worker memory. */
export async function openPdf(bytes: ArrayBuffer) {
  const pdfjs = await loadPdfJs();
  // pdf.js takes ownership of the buffer, so hand it a copy.
  const task = pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)) });
  try {
    const doc = await task.promise;
    return { doc, close: () => task.destroy() };
  } catch (e) {
    void task.destroy();
    const name = (e as { name?: string })?.name;
    if (name === 'PasswordException')
      throw new ToolInputError(
        'This PDF is password-protected. Please remove the password first.',
      );
    throw new ToolInputError(
      'This file could not be processed. Please make sure it is a valid PDF file.',
    );
  }
}

export type RenderedPage = {
  page: number;
  blob: Blob;
  width: number;
  height: number;
};

export async function renderPdfPages(
  bytes: ArrayBuffer,
  opts: {
    format: ImageFormat;
    dpi: number;
    quality?: number;
    pages?: number[];
    onProgress?: (done: number, total: number) => void;
    signal?: AbortSignal;
  },
): Promise<RenderedPage[]> {
  const { doc, close } = await openPdf(bytes);
  const pages = opts.pages ?? Array.from({ length: doc.numPages }, (_, i) => i);
  const scale = opts.dpi / 72;
  const out: RenderedPage[] = [];
  try {
    for (let k = 0; k < pages.length; k++) {
      if (opts.signal?.aborted) break;
      const page = await doc.getPage(pages[k] + 1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');
      if (!ctx)
        throw new ToolInputError(
          'Your browser could not create an image canvas.',
        );
      if (opts.format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      // 'print' intent renders without requestAnimationFrame, so conversion
      // keeps going while the tab is in the background.
      await page.render({
        canvas,
        canvasContext: ctx,
        viewport,
        intent: 'print',
      }).promise;
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(
                  new ToolInputError(
                    'A page could not be converted to an image.',
                  ),
                ),
          MIME[opts.format],
          opts.quality,
        ),
      );
      out.push({
        page: pages[k] + 1,
        blob,
        width: canvas.width,
        height: canvas.height,
      });
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
      opts.onProgress?.(k + 1, pages.length);
    }
  } finally {
    await close();
  }
  return out;
}

export async function extractPdfText(
  bytes: ArrayBuffer,
  onProgress?: (done: number, total: number) => void,
): Promise<{ page: number; text: string }[]> {
  const { doc, close } = await openPdf(bytes);
  const out: { page: number; text: string }[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      let text = '';
      for (const item of content.items) {
        if (!('str' in item)) continue;
        text += item.str + (item.hasEOL ? '\n' : ' ');
      }
      out.push({ page: i, text: text.replace(/[ \t]+\n/g, '\n').trim() });
      page.cleanup();
      onProgress?.(i, doc.numPages);
    }
  } finally {
    await close();
  }
  return out;
}

export async function renderThumbnail(
  bytes: ArrayBuffer,
  pageIndex: number,
  width = 160,
): Promise<string> {
  const { doc, close } = await openPdf(bytes);
  try {
    const page = await doc.getPage(pageIndex + 1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: width / base.width });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    await page.render({ canvas, canvasContext: ctx, viewport, intent: 'print' })
      .promise;
    return canvas.toDataURL('image/jpeg', 0.7);
  } finally {
    await close();
  }
}
