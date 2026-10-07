'use client';

import { useState } from 'react';
import {
  MIME,
  formatBytes,
  outputName,
  type ImageFormat,
} from '@/lib/online-tools/image/core';
import { processImage } from '@/lib/online-tools/image/process';
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
} from '../ui';

function sameFormat(f: File): ImageFormat {
  if (f.type === MIME.png) return 'png';
  if (f.type === MIME.webp) return 'webp';
  return 'jpg';
}

export default function ImageCompressorTool(_: ToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<'same' | ImageFormat>('same');
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState('');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const compress = async () => {
    setBusy(true);
    setError('');
    const out: OutputItem[] = [];
    const failed: string[] = [];
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const fmt = format === 'same' ? sameFormat(f) : format;
        const mw = Number(maxWidth);
        const r = await processImage(f, {
          format: fmt,
          quality: fmt === 'png' ? undefined : quality / 100,
          resize:
            mw > 0
              ? { mode: 'pixels', width: mw, keepAspect: true }
              : undefined,
        });
        // Never hand back a bigger file than the original in the same format.
        const bigger = r.blob.size >= f.size && fmt === sameFormat(f) && !mw;
        out.push({
          name: outputName(f.name, fmt, '-compressed'),
          blob: bigger ? f : r.blob,
          width: r.width,
          height: r.height,
          originalSize: f.size,
          note: bigger ? 'already optimised — original kept' : undefined,
        });
      } catch {
        failed.push(f.name);
      }
      setProgress({ done: i + 1, total: files.length });
      setResults([...out]);
    }
    if (failed.length)
      setError(`These files could not be compressed: ${failed.join(', ')}.`);
    setBusy(false);
  };

  const before = results.reduce((s, r) => s + (r.originalSize ?? 0), 0);
  const after = results.reduce((s, r) => s + r.blob.size, 0);

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept="image/jpeg,image/png,image/webp,image/bmp,image/gif,image/avif"
        onFiles={(list) => {
          setFiles((cur) => [
            ...cur,
            ...list.filter((f) => f.type.startsWith('image/')),
          ]);
          setResults([]);
        }}
        hint="JPG, PNG, WebP — as many as you like"
      />
      <SelectedFiles
        files={files}
        onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))}
        onClear={() => (setFiles([]), setResults([]))}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Output format"
          value={format}
          onChange={(v) => setFormat(v as 'same' | ImageFormat)}
          options={[
            { value: 'same', label: 'Keep original format' },
            { value: 'jpg', label: 'JPG' },
            { value: 'webp', label: 'WebP (smallest)' },
            { value: 'png', label: 'PNG (lossless)' },
          ]}
        />
        <RangeField
          label="Quality"
          value={quality}
          onChange={setQuality}
          min={10}
          max={95}
          display={`${quality}%`}
        />
        <NumberField
          label="Max width (optional)"
          value={maxWidth}
          onChange={setMaxWidth}
          min={1}
          suffix="px"
        />
      </div>
      {format === 'png' && (
        <p className="text-xs text-gray-500">
          PNG is lossless, so the quality slider has no effect. Use WebP or JPG,
          or set a max width, for real savings.
        </p>
      )}
      <button
        type="button"
        className={btnPrimary}
        onClick={compress}
        disabled={!files.length || busy}
      >
        {busy
          ? 'Compressing…'
          : `Compress ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Compressing"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {results.length > 0 && !busy && before > 0 && (
        <p className="text-sm text-gray-700" aria-live="polite">
          Total: {formatBytes(before)} → <strong>{formatBytes(after)}</strong> (
          {Math.max(0, Math.round((1 - after / before) * 100))}% smaller)
        </p>
      )}
      <OutputList items={results} />
    </div>
  );
}
