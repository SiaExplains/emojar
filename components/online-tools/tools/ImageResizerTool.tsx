'use client';

import { useEffect, useState } from 'react';
import {
  computeSize,
  outputName,
  type ImageFormat,
  type ResizeSpec,
} from '@/lib/online-tools/image/core';
import { imageSize, processImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, SelectedFiles, type OutputItem } from '../image-results';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  NumberField,
  RangeField,
  SelectField,
  btnPrimary,
} from '../ui';

function formatOf(f: File, choice: string): ImageFormat {
  if (choice !== 'same') return choice as ImageFormat;
  if (f.type === 'image/png') return 'png';
  if (f.type === 'image/webp') return 'webp';
  return 'jpg';
}

export default function ImageResizerTool(_: ToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [first, setFirst] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState('1200');
  const [height, setHeight] = useState('');
  const [percent, setPercent] = useState(50);
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState('same');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!files[0]) return setFirst(null);
    imageSize(files[0])
      .then(setFirst)
      .catch(() => setFirst(null));
  }, [files]);

  const spec: ResizeSpec =
    mode === 'percent'
      ? { mode: 'percent', percent }
      : {
          mode: 'pixels',
          width: Number(width) || undefined,
          height: Number(height) || undefined,
          keepAspect,
        };
  const preview = first ? computeSize(first.width, first.height, spec) : null;

  const resize = async () => {
    if (mode === 'pixels' && !Number(width) && !Number(height))
      return setError('Enter a width or a height.');
    setBusy(true);
    setError('');
    const out: OutputItem[] = [];
    const failed: string[] = [];
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const fmt = formatOf(f, format);
        const r = await processImage(f, {
          format: fmt,
          quality: fmt === 'png' ? undefined : 0.92,
          resize: spec,
        });
        out.push({
          name: outputName(f.name, fmt, `-${r.width}x${r.height}`),
          blob: r.blob,
          width: r.width,
          height: r.height,
          originalSize: f.size,
        });
      } catch {
        failed.push(f.name);
      }
      setProgress({ done: i + 1, total: files.length });
      setResults([...out]);
    }
    if (failed.length)
      setError(`These files could not be resized: ${failed.join(', ')}.`);
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept="image/*"
        onFiles={(list) => {
          setFiles((cur) => [
            ...cur,
            ...list.filter((f) => f.type.startsWith('image/')),
          ]);
          setResults([]);
        }}
        hint="JPG, PNG, WebP, GIF, BMP"
      />
      <SelectedFiles
        files={files}
        onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))}
        onClear={() => (setFiles([]), setResults([]))}
      />

      <div
        role="radiogroup"
        aria-label="Resize mode"
        className="inline-flex rounded-xl border border-gray-200 p-1"
      >
        {(['pixels', 'percent'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            {m === 'pixels' ? 'By pixels' : 'By percentage'}
          </button>
        ))}
      </div>

      {mode === 'pixels' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Width"
              value={width}
              onChange={setWidth}
              min={1}
              max={16384}
              suffix="px"
            />
            <NumberField
              label="Height"
              value={height}
              onChange={setHeight}
              min={1}
              max={16384}
              suffix="px"
            />
          </div>
          <Checkbox
            label="Lock aspect ratio (fit inside width × height)"
            checked={keepAspect}
            onChange={setKeepAspect}
          />
        </div>
      ) : (
        <RangeField
          label="Scale"
          value={percent}
          onChange={setPercent}
          min={1}
          max={400}
          display={`${percent}%`}
        />
      )}

      <SelectField
        label="Output format"
        value={format}
        onChange={setFormat}
        options={[
          { value: 'same', label: 'Keep original format' },
          { value: 'jpg', label: 'JPG' },
          { value: 'png', label: 'PNG' },
          { value: 'webp', label: 'WebP' },
        ]}
        className="max-w-xs"
      />

      {first && preview && (
        <p className="text-sm text-gray-600">
          {files.length > 1 ? 'First image: ' : ''}
          {first.width}×{first.height} →{' '}
          <strong>
            {preview.width}×{preview.height}
          </strong>{' '}
          px
        </p>
      )}

      <button
        type="button"
        className={btnPrimary}
        onClick={resize}
        disabled={!files.length || busy}
      >
        {busy
          ? 'Resizing…'
          : `Resize ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Resizing"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
