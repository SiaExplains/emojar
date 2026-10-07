'use client';

import { useState } from 'react';
import { ToolInputError } from '@/lib/online-tools/engines/data';
import {
  FORMAT_LABEL,
  detectInputKind,
  outputName,
  type ImageFormat,
  type OutputFormat,
} from '@/lib/online-tools/image/core';
import {
  decodeImage,
  processImage,
  renderBitmap,
} from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, SelectedFiles, type OutputItem } from '../image-results';
import {
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  NumberField,
  RangeField,
  SelectField,
  btnPrimary,
  friendlyError,
} from '../ui';

const ACCEPT: Record<string, string> = {
  jpg: 'image/jpeg,.jpg,.jpeg',
  png: 'image/png,.png',
  webp: 'image/webp,.webp',
  svg: 'image/svg+xml,.svg',
  bmp: 'image/bmp,.bmp',
  pdf: 'application/pdf,.pdf',
  any: 'image/*,application/pdf,.svg,.bmp,.pdf',
};

export default function ImageConverterTool({ config }: ToolProps) {
  const from = String(config.from ?? 'any');
  const [files, setFiles] = useState<File[]>([]);
  const [to, setTo] = useState<OutputFormat>(
    (String(config.to ?? 'png') as OutputFormat) || 'png',
  );
  const [quality, setQuality] = useState(90);
  const [svgWidth, setSvgWidth] = useState('1024');
  const [dpi, setDpi] = useState('150');
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const kinds = files.map((f) => detectInputKind(f));
  const hasSvg = from === 'svg' || kinds.includes('svg');
  const hasPdf = kinds.includes('pdf');
  const lossy = to === 'jpg' || to === 'webp';

  const addFiles = (list: File[]) => {
    const ok = list.filter((f) => detectInputKind(f));
    if (ok.length < list.length)
      setError('Some files were skipped because they are not images or PDFs.');
    else setError('');
    setFiles((cur) => [...cur, ...ok]);
    setResults([]);
  };

  const convert = async () => {
    setBusy(true);
    setError('');
    setResults([]);
    const out: OutputItem[] = [];
    const failed: string[] = [];
    try {
      if (to === 'pdf') {
        if (hasPdf)
          throw new ToolInputError(
            'PDF files cannot be converted to PDF. Remove them or choose an image format.',
          );
        const { imagesToPdf } = await import('@/lib/online-tools/pdf/core');
        const pages: {
          bytes: ArrayBuffer;
          type: 'jpg' | 'png';
          width: number;
          height: number;
        }[] = [];
        setProgress({ done: 0, total: files.length });
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          try {
            const bmp = await decodeImage(f, {
              svgWidth: Number(svgWidth) || undefined,
            });
            const { width, height } = bmp;
            const isJpg = f.type === 'image/jpeg';
            const isPng = f.type === 'image/png';
            if (isJpg || isPng) {
              bmp.close();
              pages.push({
                bytes: await f.arrayBuffer(),
                type: isJpg ? 'jpg' : 'png',
                width,
                height,
              });
            } else {
              const png = await renderBitmap(bmp, { format: 'png' });
              pages.push({
                bytes: await png.blob.arrayBuffer(),
                type: 'png',
                width,
                height,
              });
            }
          } catch {
            failed.push(f.name);
          }
          setProgress({ done: i + 1, total: files.length });
        }
        if (!pages.length)
          throw new ToolInputError(
            'None of the files could be read as images.',
          );
        const bytes = await imagesToPdf(pages, {
          pageSize,
          margin: pageSize === 'fit' ? 0 : 24,
        });
        const name =
          files.length === 1 ? outputName(files[0].name, 'pdf') : 'images.pdf';
        out.push({
          name,
          blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
          note: `${pages.length} page${pages.length === 1 ? '' : 's'}`,
        });
      } else {
        const fmt = to as ImageFormat;
        const q = lossy ? quality / 100 : undefined;
        let total = files.length;
        let done = 0;
        setProgress({ done, total });
        for (const f of files) {
          try {
            if (detectInputKind(f) === 'pdf') {
              const { renderPdfPages } = await import(
                '@/lib/online-tools/pdf/render'
              );
              const buf = await f.arrayBuffer();
              const pages = await renderPdfPages(buf, {
                format: fmt,
                dpi: Number(dpi),
                quality: q,
                onProgress: (d, t) => {
                  if (d === 1) total += t - 1;
                  setProgress({ done: done + d, total });
                },
              });
              pages.forEach((p) =>
                out.push({
                  name: outputName(
                    f.name,
                    fmt,
                    pages.length > 1 ? `-page-${p.page}` : '',
                  ),
                  blob: p.blob,
                  width: p.width,
                  height: p.height,
                }),
              );
              done += pages.length;
            } else {
              const r = await processImage(f, {
                format: fmt,
                quality: q,
                svgWidth: Number(svgWidth) || undefined,
              });
              out.push({
                name: outputName(f.name, fmt),
                blob: r.blob,
                width: r.width,
                height: r.height,
                originalSize: f.size,
              });
              done += 1;
            }
          } catch (e) {
            failed.push(
              e instanceof ToolInputError && files.length === 1
                ? e.message
                : f.name,
            );
            done += 1;
          }
          setProgress({ done, total });
          setResults([...out]);
        }
      }
      setResults(out);
      if (failed.length) {
        setError(
          failed.length === 1 &&
            files.length === 1 &&
            failed[0] !== files[0].name
            ? failed[0]
            : `These files could not be converted: ${failed.join(', ')}. Please make sure they are valid images or PDFs.`,
        );
      }
    } catch (e) {
      setError(
        friendlyError(
          e,
          'The conversion failed. Please make sure your files are valid images.',
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept={ACCEPT[from] ?? ACCEPT.any}
        onFiles={addFiles}
        label={
          from === 'any'
            ? 'Choose images or PDFs, or drop them here'
            : `Choose ${FORMAT_LABEL[from]} files, or drop them here`
        }
        hint={
          from === 'any'
            ? 'JPG, PNG, WebP, GIF, BMP, SVG, AVIF or PDF'
            : `Convert ${FORMAT_LABEL[from]} to ${FORMAT_LABEL[String(config.to)] ?? 'another format'}`
        }
      />
      <SelectedFiles
        files={files}
        onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))}
        onClear={() => (setFiles([]), setResults([]))}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Convert to"
          value={to}
          onChange={(v) => setTo(v as OutputFormat)}
          options={[
            { value: 'png', label: 'PNG — lossless, transparency' },
            { value: 'jpg', label: 'JPG — small, for photos' },
            { value: 'webp', label: 'WebP — smallest, modern' },
            ...(from === 'pdf'
              ? []
              : [{ value: 'pdf', label: 'PDF — one page per image' }]),
          ]}
        />
        {lossy && (
          <RangeField
            label="Quality"
            value={quality}
            onChange={setQuality}
            min={10}
            max={100}
            display={`${quality}%`}
          />
        )}
        {to === 'pdf' && (
          <SelectField
            label="Page size"
            value={pageSize}
            onChange={(v) => setPageSize(v as 'fit' | 'a4' | 'letter')}
            options={[
              { value: 'fit', label: 'Same as image' },
              { value: 'a4', label: 'A4' },
              { value: 'letter', label: 'US Letter' },
            ]}
          />
        )}
        {hasSvg && (
          <NumberField
            label="SVG output width"
            value={svgWidth}
            onChange={setSvgWidth}
            min={16}
            max={8192}
            suffix="px"
          />
        )}
        {(from === 'pdf' || hasPdf) && to !== 'pdf' && (
          <SelectField
            label="PDF resolution"
            value={dpi}
            onChange={setDpi}
            options={[
              { value: '72', label: '72 DPI — small' },
              { value: '150', label: '150 DPI — screen' },
              { value: '300', label: '300 DPI — print' },
            ]}
          />
        )}
      </div>

      <button
        type="button"
        className={btnPrimary}
        onClick={convert}
        disabled={!files.length || busy}
      >
        {busy
          ? 'Converting…'
          : `Convert ${files.length || ''} file${files.length === 1 ? '' : 's'} to ${FORMAT_LABEL[to]}`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Converting"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
