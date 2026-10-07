'use client';

import { useState } from 'react';
import { formatBytes, outputName } from '@/lib/online-tools/image/core';
import { compressPdfLossless, imagesToPdf } from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
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

export default function PdfCompressTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'lossless' | 'strong'>('lossless');
  const [dpi, setDpi] = useState('110');
  const [quality, setQuality] = useState(60);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const buf = await file.arrayBuffer();
      let bytes: Uint8Array;
      if (mode === 'lossless') {
        bytes = await compressPdfLossless(buf);
      } else {
        const { renderPdfPages } = await import(
          '@/lib/online-tools/pdf/render'
        );
        const pages = await renderPdfPages(buf, {
          format: 'jpg',
          dpi: Number(dpi),
          quality: quality / 100,
          onProgress: (done, total) => setProgress({ done, total }),
        });
        // Render at `dpi` but lay pages out at their original physical size.
        const scale = 96 / Number(dpi);
        bytes = await imagesToPdf(
          await Promise.all(
            pages.map(async (p) => ({
              bytes: await p.blob.arrayBuffer(),
              type: 'jpg' as const,
              width: p.width * scale,
              height: p.height * scale,
            })),
          ),
        );
      }
      const smaller = bytes.length < file.size;
      setResults([
        {
          name: outputName(file.name, 'pdf', '-compressed'),
          blob: smaller
            ? new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
            : file,
          originalSize: file.size,
          note: smaller
            ? undefined
            : 'could not be made smaller — original kept',
        },
      ]);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This PDF could not be compressed. Please make sure it is a valid, unencrypted PDF.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="application/pdf,.pdf"
        onFiles={(f) => setFile(f[0])}
        label="Choose a PDF or drop it here"
      />
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {formatBytes(file.size)}
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
      <SelectField
        label="Compression"
        value={mode}
        onChange={(v) => setMode(v as 'lossless' | 'strong')}
        options={[
          { value: 'lossless', label: 'Lossless — keeps text selectable' },
          {
            value: 'strong',
            label: 'Strong — converts pages to images (best for scans)',
          },
        ]}
        className="max-w-md"
      />
      {mode === 'strong' && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Resolution"
              value={dpi}
              onChange={setDpi}
              options={[
                { value: '72', label: '72 DPI — smallest' },
                { value: '110', label: '110 DPI — screen reading' },
                { value: '150', label: '150 DPI — good quality' },
                { value: '200', label: '200 DPI — print' },
              ]}
            />
            <RangeField
              label="Image quality"
              value={quality}
              onChange={setQuality}
              min={20}
              max={90}
              display={`${quality}%`}
            />
          </div>
          <Notice tone="amber">
            Strong mode turns pages into images — text will no longer be
            selectable or searchable.
          </Notice>
        </>
      )}
      <button
        type="button"
        className={btnPrimary}
        onClick={compress}
        disabled={busy}
      >
        {busy ? 'Compressing…' : 'Compress PDF'}
      </button>
      {busy && mode === 'strong' && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Rendering pages"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
