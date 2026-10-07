'use client';

import { useState } from 'react';
import { outputName, type ImageFormat } from '@/lib/online-tools/image/core';
import { processImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, SelectedFiles, type OutputItem } from '../image-results';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  NumberField,
  btnPrimary,
  btnSecondary,
  useObjectUrl,
} from '../ui';

function formatOf(f: File): ImageFormat {
  if (f.type === 'image/jpeg') return 'jpg';
  if (f.type === 'image/webp') return 'webp';
  return 'png';
}

export default function ImageTransformTool({ config }: ToolProps) {
  const isRotate = config.mode === 'rotate';
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState(isRotate ? 90 : 0);
  const [flipH, setFlipH] = useState(!isRotate);
  const [flipV, setFlipV] = useState(false);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const previewUrl = useObjectUrl(files[0] ?? null);

  const apply = async () => {
    setBusy(true);
    setError('');
    const out: OutputItem[] = [];
    const failed: string[] = [];
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        // Arbitrary angles leave empty corners; keep them transparent unless the source is JPG.
        const fmt = formatOf(f);
        const r = await processImage(f, {
          format: fmt,
          quality: fmt === 'png' ? undefined : 0.95,
          rotate: isRotate ? angle : 0,
          flipH,
          flipV,
        });
        out.push({
          name: outputName(
            f.name,
            fmt,
            isRotate ? `-rotated-${angle}` : '-flipped',
          ),
          blob: r.blob,
          width: r.width,
          height: r.height,
        });
      } catch {
        failed.push(f.name);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setResults(out);
    if (failed.length)
      setError(`These files could not be processed: ${failed.join(', ')}.`);
    setBusy(false);
  };

  const cssTransform = `rotate(${isRotate ? angle : 0}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`;

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

      {isRotate ? (
        <div className="flex flex-wrap items-end gap-2">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setAngle((a) => (((a - 90) % 360) + 360) % 360)}
          >
            ↺ 90° left
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setAngle((a) => (a + 90) % 360)}
          >
            ↻ 90° right
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setAngle((a) => (a + 180) % 360)}
          >
            180°
          </button>
          <NumberField
            label="Custom angle"
            value={angle}
            onChange={(v) => setAngle(Number(v) || 0)}
            min={-360}
            max={360}
            suffix="°"
            className="w-36"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="Flip horizontal (mirror)"
          checked={flipH}
          onChange={setFlipH}
        />
        <Checkbox label="Flip vertical" checked={flipV} onChange={setFlipV} />
      </div>

      {previewUrl && (
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <img
            src={previewUrl}
            alt="Preview of the first image with the transformation applied"
            className="max-h-48 max-w-[60%] object-contain transition-transform"
            style={{ transform: cssTransform }}
          />
        </div>
      )}

      <button
        type="button"
        className={btnPrimary}
        onClick={apply}
        disabled={!files.length || busy}
      >
        {busy
          ? 'Processing…'
          : isRotate
            ? `Rotate ${files.length || ''} image${files.length === 1 ? '' : 's'}`
            : `Flip ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
      </button>
      {busy && (
        <ConversionProgress done={progress.done} total={progress.total} />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
