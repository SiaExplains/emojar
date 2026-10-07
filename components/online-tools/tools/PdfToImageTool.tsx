'use client';

import { useState } from 'react';
import { outputName, type ImageFormat } from '@/lib/online-tools/image/core';
import { pageCount, parsePageRanges } from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

export default function PdfToImageTool({ config }: ToolProps) {
  const format = (String(config.format ?? 'jpg') as ImageFormat) || 'jpg';
  const [file, setFile] = useState<File | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState('all');
  const [dpi, setDpi] = useState('150');
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (f: File) => {
    setError('');
    setResults([]);
    try {
      setTotal(await pageCount(await f.arrayBuffer()));
      setFile(f);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const indices = parsePageRanges(pages, total);
      const { renderPdfPages } = await import('@/lib/online-tools/pdf/render');
      const out = await renderPdfPages(await file.arrayBuffer(), {
        format,
        dpi: Number(dpi),
        quality: format === 'jpg' ? quality / 100 : undefined,
        pages: indices,
        onProgress: (done, t) => setProgress({ done, total: t }),
      });
      setResults(
        out.map((p) => ({
          name: outputName(file.name, format, `-page-${p.page}`),
          blob: p.blob,
          width: p.width,
          height: p.height,
        })),
      );
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be converted.'));
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => load(f[0])}
          label="Choose a PDF or drop it here"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setResults([]);
          }}
        >
          Choose another PDF
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Pages"
          value={pages}
          onChange={setPages}
          mono
          placeholder="all, 1-3, 5"
        />
        <SelectField
          label="Resolution"
          value={dpi}
          onChange={setDpi}
          options={[
            { value: '72', label: '72 DPI' },
            { value: '96', label: '96 DPI' },
            { value: '150', label: '150 DPI (recommended)' },
            { value: '300', label: '300 DPI (print)' },
          ]}
        />
        {format === 'jpg' && (
          <RangeField
            label="JPG quality"
            value={quality}
            onChange={setQuality}
            min={30}
            max={100}
            display={`${quality}%`}
          />
        )}
      </div>
      <button
        type="button"
        className={btnPrimary}
        onClick={convert}
        disabled={busy}
      >
        {busy ? 'Converting…' : `Convert to ${format.toUpperCase()}`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Rendering"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
