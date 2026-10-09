'use client';

import { useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import { loadPdf } from '@/lib/online-tools/pdf/core';
import {
  grayscalePixels,
  mulberry32,
  otsuThreshold,
  scanLookPixels,
  thresholdPixels,
} from '@/lib/online-tools/pdf/scan';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  Notice,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';
import { PDF_ACCEPT, pdfBlob, usePdfFile } from './pdf-shared';

type Mode = 'gray' | 'bw' | 'scan';

const toBlob = (c: HTMLCanvasElement, type: string, q?: number) =>
  new Promise<Blob>((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), type, q),
  );

/** Gray JPEG from a colour JPEG, decoded and re-encoded by the browser. */
async function grayJpeg(jpeg: Uint8Array): Promise<Uint8Array | null> {
  try {
    const bmp = await createImageBitmap(
      new Blob([jpeg as BlobPart], { type: 'image/jpeg' }),
    );
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(bmp, 0, 0);
    bmp.close();
    const img = ctx.getImageData(0, 0, c.width, c.height);
    grayscalePixels(img.data);
    ctx.putImageData(img, 0, 0);
    return new Uint8Array(
      await (await toBlob(c, 'image/jpeg', 0.9)).arrayBuffer(),
    );
  } catch {
    return null;
  }
}

export default function PdfGrayscaleTool(_: ToolProps) {
  const { file, buffer, total, error, setError, load, clear } = usePdfFile();
  const [mode, setMode] = useState<Mode>('gray');
  const [dpi, setDpi] = useState('200');
  const [autoThreshold, setAutoThreshold] = useState(true);
  const [threshold, setThreshold] = useState(160);
  const [scanBw, setScanBw] = useState(false);
  const [tilt, setTilt] = useState(true);
  const [noise, setNoise] = useState(0.5);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<OutputItem[]>([]);
  const [busy, setBusy] = useState(false);

  /** Grayscale that keeps text; flattens only pages it can't convert. */
  const runVector = async (buf: ArrayBuffer, name: string) => {
    const PDFLib = await import('pdf-lib');
    const { grayscalePdfDocument, replacePageWithImage } = await import(
      '@/lib/online-tools/pdf/grayscale'
    );
    const doc = await loadPdf(buf);
    setProgress({ done: 0, total: 1 });
    const report = await grayscalePdfDocument(doc, PDFLib, {
      convertJpeg: grayJpeg,
    });
    const flatten = report.unsupported.map((u) => u.page);
    if (flatten.length) {
      // Re-render the original pages that need it and swap them in as gray images.
      const { forEachRenderedPage } = await import(
        '@/lib/online-tools/pdf/render'
      );
      const sizes = new Map<number, { w: number; h: number }>();
      for (const i of flatten) {
        const p = doc.getPage(i);
        const b = p.getCropBox();
        sizes.set(
          i,
          p.getRotation().angle % 180
            ? { w: b.height, h: b.width }
            : { w: b.width, h: b.height },
        );
      }
      const images = new Map<number, Uint8Array>();
      await forEachRenderedPage(
        buf,
        {
          dpi: 200,
          pages: flatten,
          onProgress: (d, t) => setProgress({ done: d, total: t }),
        },
        async (canvas, i) => {
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          grayscalePixels(img.data);
          ctx.putImageData(img, 0, 0);
          images.set(
            i,
            new Uint8Array(
              await (await toBlob(canvas, 'image/jpeg', 0.85)).arrayBuffer(),
            ),
          );
        },
      );
      for (const i of flatten) {
        const s = sizes.get(i)!;
        await replacePageWithImage(doc, i, images.get(i)!, s.w, s.h);
      }
    }
    const bytes = await doc.save();
    const reasons = [...new Set(report.unsupported.flatMap((u) => u.reasons))];
    setResults([
      {
        name: outputName(name, 'pdf', '-grayscale'),
        blob: pdfBlob(bytes),
        note: flatten.length
          ? `Text kept on ${total - flatten.length} of ${total} pages · page${flatten.length === 1 ? '' : 's'} ${flatten.map((p) => p + 1).join(', ')} flattened (${reasons.join(', ')})`
          : `Text and vectors kept on ${total === 1 ? 'the page' : `all ${total} pages`} · ${report.imagesConverted} image${report.imagesConverted === 1 ? '' : 's'} converted`,
      },
    ]);
  };

  /** Black & white or scanned look: every page becomes an image. */
  const runRaster = async (buf: ArrayBuffer, name: string) => {
    const { PDFDocument } = await import('pdf-lib');
    const { forEachRenderedPage } = await import(
      '@/lib/online-tools/pdf/render'
    );
    const out = await PDFDocument.create();
    const d = Number(dpi);
    await forEachRenderedPage(
      buf,
      { dpi: d, onProgress: (done, t) => setProgress({ done, total: t }) },
      async (canvas, i) => {
        let src = canvas;
        if (mode === 'scan' && tilt) {
          const rng = mulberry32(i + 1);
          const angle = ((rng() - 0.5) * 2.4 * Math.PI) / 180; // up to ±1.2°
          const t = document.createElement('canvas');
          t.width = canvas.width;
          t.height = canvas.height;
          const tctx = t.getContext('2d', { willReadFrequently: true })!;
          tctx.fillStyle = '#ecebe6';
          tctx.fillRect(0, 0, t.width, t.height);
          tctx.translate(t.width / 2, t.height / 2);
          tctx.rotate(angle);
          tctx.filter = 'blur(0.35px)';
          tctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
          src = t;
        }
        const ctx = src.getContext('2d', { willReadFrequently: true })!;
        const img = ctx.getImageData(0, 0, src.width, src.height);
        grayscalePixels(img.data);
        if (mode === 'bw')
          thresholdPixels(
            img.data,
            autoThreshold ? otsuThreshold(img.data) : threshold,
          );
        else
          scanLookPixels(img.data, {
            bw: scanBw,
            noise,
            rng: mulberry32(1000 + i),
          });
        ctx.putImageData(img, 0, 0);
        const png = mode === 'bw';
        const bytes = new Uint8Array(
          await (
            await toBlob(
              src,
              png ? 'image/png' : 'image/jpeg',
              png ? undefined : 0.8,
            )
          ).arrayBuffer(),
        );
        const embedded = png
          ? await out.embedPng(bytes)
          : await out.embedJpg(bytes);
        const w = (src.width * 72) / d;
        const h = (src.height * 72) / d;
        out
          .addPage([w, h])
          .drawImage(embedded, { x: 0, y: 0, width: w, height: h });
      },
    );
    const bytes = await out.save();
    setResults([
      {
        name: outputName(
          name,
          'pdf',
          mode === 'bw' ? '-black-and-white' : '-scanned',
        ),
        blob: pdfBlob(bytes),
        note: `${total} page${total === 1 ? '' : 's'} at ${d} DPI · text is no longer selectable`,
      },
    ]);
  };

  const run = async () => {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      if (mode === 'gray') await runVector(buffer, file.name);
      else await runRaster(buffer, file.name);
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be converted.'));
    } finally {
      setBusy(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  if (!file || !buffer)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept={PDF_ACCEPT}
          onFiles={(f) => load(f[0])}
          label="Choose a PDF or drop it here"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const modes: [Mode, string, string][] = [
    ['gray', 'Grayscale', 'Keeps text selectable and the file small'],
    ['bw', 'Black & white', 'Pure black and white, like a fax or copy'],
    ['scan', 'Scanned look', 'Slight tilt, grain and paper tone'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
        </p>
        <button type="button" className={btnSecondary} onClick={clear}>
          Choose another PDF
        </button>
      </div>
      <div
        role="radiogroup"
        aria-label="Conversion"
        className="grid gap-2 sm:grid-cols-3"
      >
        {modes.map(([m, label, hint]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-xl border-2 p-3 text-left transition ${mode === m ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <span className="block text-sm font-semibold text-gray-900">
              {label}
            </span>
            <span className="block text-xs text-gray-600">{hint}</span>
          </button>
        ))}
      </div>

      {mode === 'gray' ? (
        <Notice>
          Colours in text, shapes and images are converted to shades of gray
          directly in the PDF, so text stays selectable and searchable. Pages
          that use features this can’t convert exactly (gradients, patterns,
          spot colours, CMYK photos and some other image types) are flattened
          into a 200 DPI gray image instead, which also removes links on those
          pages — the result tells you which pages.
        </Notice>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Resolution"
            value={dpi}
            onChange={setDpi}
            options={[
              { value: '150', label: '150 DPI (smaller file)' },
              { value: '200', label: '200 DPI (recommended)' },
              { value: '300', label: '300 DPI (sharpest)' },
            ]}
          />
          {mode === 'bw' ? (
            <div className="space-y-2">
              <Checkbox
                label="Automatic threshold"
                checked={autoThreshold}
                onChange={setAutoThreshold}
              />
              {!autoThreshold && (
                <RangeField
                  label="Threshold (higher = darker)"
                  value={threshold}
                  onChange={setThreshold}
                  min={40}
                  max={240}
                />
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Checkbox
                  label="Slightly tilted pages"
                  checked={tilt}
                  onChange={setTilt}
                />
                <Checkbox
                  label="Black & white scan"
                  checked={scanBw}
                  onChange={setScanBw}
                />
              </div>
              <RangeField
                label="Grain"
                value={noise}
                onChange={setNoise}
                min={0}
                max={1}
                step={0.05}
                display={`${Math.round(noise * 100)}%`}
              />
            </>
          )}
        </div>
      )}
      {mode !== 'gray' && (
        <p className="text-xs text-gray-500">
          Black & white and scanned look turn every page into an image, so text
          is no longer selectable and links stop working.
        </p>
      )}

      <button
        type="button"
        className={btnPrimary}
        onClick={run}
        disabled={busy}
      >
        {busy
          ? 'Converting…'
          : mode === 'gray'
            ? 'Convert to grayscale'
            : mode === 'bw'
              ? 'Convert to black & white'
              : 'Make it look scanned'}
      </button>
      {busy && progress.total > 1 && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Page"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
