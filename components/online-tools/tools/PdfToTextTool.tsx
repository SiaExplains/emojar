'use client';

import { useRef, useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';
import { OCR_LANGUAGES, ocrStatusLabel, recognizeAll } from './ocr-shared';

type PageText = { page: number; text: string; ocr?: boolean };

/** OCR is slow (seconds per page), so very long scans are capped. */
const MAX_OCR_PAGES = 60;

const joinPages = (pages: PageText[]) =>
  pages
    .map((p) => `--- Page ${p.page}${p.ocr ? ' (OCR)' : ''} ---\n${p.text}`)
    .join('\n\n');

export default function PdfToTextTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageText[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState('eng');
  const [ocrAll, setOcrAll] = useState(false);
  const [ocr, setOcr] = useState<{ label: string; percent: number } | null>(
    null,
  );
  const cancel = useRef({ cancelled: false });

  const extract = async (f: File) => {
    setFile(f);
    setBusy(true);
    setError('');
    setPages([]);
    try {
      const { extractPdfText } = await import('@/lib/online-tools/pdf/render');
      const result = await extractPdfText(
        await f.arrayBuffer(),
        (done, total) => setProgress({ done, total }),
      );
      setPages(result);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const empty = pages.filter((p) => !p.text);
  const targets = (ocrAll ? pages : empty).slice(0, MAX_OCR_PAGES);
  const hasText = pages.some((p) => p.text);

  const runOcr = async () => {
    if (!file || !targets.length) return;
    cancel.current = { cancelled: false };
    setError('');
    setOcr({ label: 'Rendering pages…', percent: 0 });
    try {
      const { renderPdfPages } = await import('@/lib/online-tools/pdf/render');
      // 200 dpi is a good balance of OCR accuracy and speed.
      const rendered = await renderPdfPages(await file.arrayBuffer(), {
        format: 'png',
        dpi: 200,
        pages: targets.map((p) => p.page - 1),
        onProgress: (done, total) =>
          setOcr({
            label: `Rendering page ${done} of ${total}…`,
            percent: Math.round((done / total) * 15),
          }),
      });
      const results = await recognizeAll(
        rendered.map((r) => r.blob),
        lang,
        ({ status, progress: p, index }) =>
          setOcr({
            label:
              status === 'recognizing text'
                ? `Reading page ${index + 1} of ${rendered.length}…`
                : ocrStatusLabel(status),
            percent:
              15 +
              Math.round(
                ((index + (status === 'recognizing text' ? p : 0)) /
                  rendered.length) *
                  85,
              ),
          }),
        cancel.current,
      );
      const byPage = new Map(results.map((r, i) => [rendered[i].page, r.text]));
      setPages((ps) =>
        ps.map((p) =>
          byPage.has(p.page)
            ? { ...p, text: byPage.get(p.page)!, ocr: true }
            : p,
        ),
      );
      if (results.every((r) => !r.text))
        setError(
          'OCR found no text. Check that the right language is selected and that the scan is sharp.',
        );
    } catch (e) {
      setError(
        friendlyError(
          e,
          'OCR failed. Check your internet connection (the OCR engine downloads on first use) and try again.',
        ),
      );
    } finally {
      setOcr(null);
    }
  };

  const text = joinPages(pages);
  const ocrCount = pages.filter((p) => p.ocr).length;

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => extract(f[0])}
          label="Choose a PDF or drop it here"
          hint="Text PDFs are read instantly; scanned pages can be read with OCR"
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-700">
            📄 <strong>{file.name}</strong>
          </p>
          <button
            type="button"
            className={btnSecondary}
            disabled={!!ocr}
            onClick={() => {
              setFile(null);
              setPages([]);
              setError('');
            }}
          >
            Choose another PDF
          </button>
        </div>
      )}
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Reading pages"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>

      {pages.length > 0 &&
        !busy &&
        (empty.length > 0 || ocrAll || ocrCount > 0) && (
          <section
            aria-labelledby="pdf-ocr"
            className="space-y-3 rounded-2xl border border-gray-100 p-4"
          >
            <h2 id="pdf-ocr" className="text-sm font-semibold text-gray-900">
              Scanned pages (OCR)
            </h2>
            <p className="text-sm text-gray-600">
              {empty.length === pages.length
                ? 'This PDF has no text layer — it is probably a scan. Read it with OCR (optical character recognition) in your browser.'
                : empty.length
                  ? `${empty.length} of ${pages.length} pages have no text layer. Read them with OCR in your browser.`
                  : 'Every page has a text layer. Tick “OCR every page” to read the page images instead (useful when the text layer is garbled).'}
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <SelectField
                label="Text language"
                value={lang}
                onChange={setLang}
                options={OCR_LANGUAGES}
              />
              <Checkbox
                label="OCR every page"
                checked={ocrAll}
                onChange={setOcrAll}
              />
              <button
                type="button"
                className={btnPrimary}
                onClick={() => void runOcr()}
                disabled={!!ocr || !targets.length}
              >
                {ocr
                  ? 'Reading…'
                  : `Read ${targets.length} page${targets.length === 1 ? '' : 's'} with OCR`}
              </button>
              {ocr && (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => (cancel.current.cancelled = true)}
                >
                  Stop after this page
                </button>
              )}
            </div>
            {(ocrAll ? pages.length : empty.length) > MAX_OCR_PAGES && (
              <p className="text-xs text-amber-800">
                Only the first {MAX_OCR_PAGES} pages are read with OCR at a time
                — split the PDF for longer scans.
              </p>
            )}
            {ocr && (
              <div className="space-y-1" role="status" aria-live="polite">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{ocr.label}</span>
                  <span>{ocr.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${ocr.percent}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Pages are rendered and recognised on your device with Tesseract.
              The OCR engine and language data (a few MB) download on first use.
            </p>
          </section>
        )}

      {hasText && !error && (
        <Notice tone="green">
          Text from {pages.filter((p) => p.text).length} of {pages.length} page
          {pages.length === 1 ? '' : 's'}
          {ocrCount ? ` (${ocrCount} read with OCR)` : ''}.
        </Notice>
      )}
      {hasText && (
        <ToolOutput
          label="Extracted text"
          value={text}
          rows={16}
          mono={false}
          filename={outputName(file?.name ?? 'document', 'txt')}
        />
      )}
    </div>
  );
}
