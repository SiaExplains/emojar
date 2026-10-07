'use client';

import { useState } from 'react';
import {
  formatBytes,
  outputName,
  type ImageFormat,
} from '@/lib/online-tools/image/core';
import { fitToSize, parseSize } from '@/lib/online-tools/image/fit-size';
import { decodeImage, renderBitmap } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
  useObjectUrl,
} from '../ui';

const PRESETS = [20, 30, 50, 100, 200, 500];

export default function CompressToSizeTool({ config }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState(String(config.target ?? 50));
  const [format, setFormat] = useState<ImageFormat>('jpg');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const url = useObjectUrl(file);

  const compress = async () => {
    if (!file) return;
    const bytes = parseSize(target);
    if (!bytes)
      return setError(
        'Enter a target size of at least 1 KB, e.g. 50 or 100 KB.',
      );
    setBusy(true);
    setError('');
    setNote('');
    setResults([]);
    try {
      if (
        file.size <= bytes &&
        (file.type === 'image/jpeg' || file.type === 'image/webp')
      ) {
        setNote(
          `This image is already ${formatBytes(file.size)} — under your limit, so it is returned unchanged.`,
        );
        setResults([{ name: file.name, blob: file, originalSize: file.size }]);
        return;
      }
      const source = await decodeImage(file);
      const w = source.width;
      const h = source.height;
      const r = await fitToSize(
        async ({ quality, scale }) => {
          // renderBitmap transfers/closes its bitmap, so hand it a copy each attempt.
          const copy = await createImageBitmap(source);
          const out = await renderBitmap(copy, {
            format,
            quality,
            resize:
              scale < 1
                ? {
                    mode: 'pixels',
                    width: Math.max(1, Math.round(w * scale)),
                    keepAspect: true,
                  }
                : undefined,
          });
          return out.blob;
        },
        bytes,
        { onAttempt: setAttempts },
      );
      source.close();
      if (!r.fits) {
        setError(
          `Even the smallest version is ${formatBytes(r.blob.size)}. Try a larger target or crop the image first.`,
        );
        return;
      }
      const outW = Math.round(w * r.scale);
      const outH = Math.round(h * r.scale);
      setResults([
        {
          name: outputName(
            file.name,
            format,
            `-${target.replace(/\s/g, '')}kb`,
          ),
          blob: r.blob,
          width: outW,
          height: outH,
          originalSize: file.size,
          note: `quality ${Math.round(r.quality * 100)}%`,
        },
      ]);
      if (r.scale < 1)
        setNote(
          `To fit under ${formatBytes(bytes)} the image was also resized from ${w}×${h} to ${outW}×${outH} px.`,
        );
    } catch (e) {
      setError(friendlyError(e, 'This image could not be compressed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFiles={(f) => (setFile(f[0]), setResults([]))}
          hint="JPG, PNG, WebP, HEIC (Safari), BMP"
        />
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          {url && (
            <img
              src={url}
              alt=""
              className="h-16 w-16 rounded-lg border border-gray-100 object-cover"
            />
          )}
          <p className="text-sm text-gray-700">
            {file.name} · {formatBytes(file.size)}
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => (setFile(null), setResults([]), setNote(''))}
          >
            Choose another
          </button>
        </div>
      )}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">
          Target size
        </legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((kb) => (
            <button
              key={kb}
              type="button"
              aria-pressed={target === String(kb)}
              onClick={() => setTarget(String(kb))}
              className={`rounded-xl border px-3 py-1.5 text-sm ${target === String(kb) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {kb} KB
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Custom size (KB, or e.g. 1.5 MB)"
          value={target}
          onChange={setTarget}
        />
        <SelectField
          label="Output format"
          value={format}
          onChange={(v) => setFormat(v as ImageFormat)}
          options={[
            { value: 'jpg', label: 'JPG (accepted by every form)' },
            { value: 'webp', label: 'WebP (smaller, less widely accepted)' },
          ]}
        />
      </div>
      <button
        type="button"
        className={btnPrimary}
        onClick={compress}
        disabled={!file || busy}
      >
        {busy ? `Finding the best quality… (try ${attempts})` : 'Compress'}
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      {note && <Notice>{note}</Notice>}
      <OutputList items={results} />
    </div>
  );
}
