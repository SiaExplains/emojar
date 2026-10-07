'use client';

import { useState } from 'react';
import { outputName, type ImageFormat } from '@/lib/online-tools/image/core';
import { decodeImage, renderBitmap } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, SelectedFiles, type OutputItem } from '../image-results';
import {
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  btnPrimary,
} from '../ui';

/** Decodes HEIC natively where supported (Safari), otherwise with heic2any. */
async function heicToBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await decodeImage(file);
  } catch {
    const { default: heic2any } = await import('heic2any');
    const out = await heic2any({ blob: file, toType: 'image/png' });
    const blob = Array.isArray(out) ? out[0] : out;
    return createImageBitmap(blob);
  }
}

export default function HeicToJpgTool(_: ToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageFormat>('jpg');
  const [quality, setQuality] = useState(92);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const convert = async () => {
    setBusy(true);
    setError('');
    setResults([]);
    const out: OutputItem[] = [];
    const failed: string[] = [];
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const bmp = await heicToBitmap(f);
        const r = await renderBitmap(bmp, {
          format,
          quality: format === 'png' ? undefined : quality / 100,
        });
        out.push({
          name: outputName(f.name, format),
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
      setError(
        `These files could not be converted: ${failed.join(', ')}. Please make sure they are HEIC/HEIF photos.`,
      );
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept=".heic,.heif,image/heic,image/heif"
        onFiles={(list) => {
          setFiles((cur) => [...cur, ...list]);
          setResults([]);
        }}
        label="Choose HEIC photos or drop them here"
        hint="From iPhone or iPad — .heic or .heif"
      />
      <SelectedFiles
        files={files}
        onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))}
        onClear={() => (setFiles([]), setResults([]))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Convert to"
          value={format}
          onChange={(v) => setFormat(v as ImageFormat)}
          options={[
            { value: 'jpg', label: 'JPG — works everywhere' },
            { value: 'png', label: 'PNG — lossless' },
            { value: 'webp', label: 'WebP — smallest' },
          ]}
        />
        {format !== 'png' && (
          <RangeField
            label="Quality"
            value={quality}
            onChange={setQuality}
            min={50}
            max={100}
            display={`${quality}%`}
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
          : `Convert ${files.length || ''} photo${files.length === 1 ? '' : 's'}`}
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
