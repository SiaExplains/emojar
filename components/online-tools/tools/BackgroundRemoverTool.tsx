'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  guessBackground,
  outputName,
  removeBackground,
} from '@/lib/online-tools/image/core';
import { canvasToBlob, readPixels } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
} from '../ui';

const MAX_PIXELS = 16_000_000;

export default function BackgroundRemoverTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<ImageData | null>(null);
  const [target, setTarget] = useState<[number, number, number]>([
    255, 255, 255,
  ]);
  const [tolerance, setTolerance] = useState(12);
  const [feather, setFeather] = useState(4);
  const [mode, setMode] = useState<'contiguous' | 'all'>('contiguous');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) return;
    readPixels(file)
      .then(({ imageData }) => {
        if (imageData.width * imageData.height > MAX_PIXELS) {
          setError(
            'This image is very large. Please resize it below 16 megapixels first for a smooth preview.',
          );
          return;
        }
        setSource(imageData);
        setTarget(guessBackground(imageData));
      })
      .catch(() => setError('This file could not be read as an image.'));
  }, [file]);

  // Re-render the preview whenever settings change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!source || !canvas) return;
    const t = window.setTimeout(() => {
      const copy = new ImageData(
        new Uint8ClampedArray(source.data),
        source.width,
        source.height,
      );
      removeBackground(copy, {
        target,
        tolerance,
        feather,
        contiguous: mode === 'contiguous',
      });
      canvas.width = copy.width;
      canvas.height = copy.height;
      canvas.getContext('2d')!.putImageData(copy, 0, 0);
    }, 60);
    return () => window.clearTimeout(t);
  }, [source, target, tolerance, feather, mode]);

  const pick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!source) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * source.width);
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * source.height,
    );
    const i = (y * source.width + x) * 4;
    setTarget([source.data[i], source.data[i + 1], source.data[i + 2]]);
  };

  const download = async () => {
    if (!canvasRef.current || !file) return;
    const blob = await canvasToBlob(canvasRef.current, 'png');
    setResults([
      {
        name: outputName(file.name, 'png', '-no-bg'),
        blob,
        width: source?.width,
        height: source?.height,
      },
    ]);
  };

  if (!file)
    return (
      <FileDropzone
        accept="image/*"
        onFiles={(f) => (setError(''), setFile(f[0]))}
        hint="Works best with plain or solid-colour backgrounds"
      />
    );

  return (
    <div className="space-y-5">
      <div className="flex justify-center rounded-2xl bg-[repeating-conic-gradient(#e5e7eb_0_25%,#fff_0_50%)] bg-[length:20px_20px] p-2">
        <canvas
          ref={canvasRef}
          onClick={pick}
          className="max-h-[460px] max-w-full cursor-crosshair"
          role="img"
          aria-label="Preview with background removed — click a background area to pick its colour"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span>Background colour:</span>
        <span
          className="inline-block h-6 w-10 rounded border border-gray-300"
          style={{ background: `rgb(${target.join(',')})` }}
        />
        <span className="font-mono">rgb({target.join(', ')})</span>
        <span className="text-xs text-gray-400">
          (click the image to change)
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <RangeField
          label="Tolerance"
          value={tolerance}
          onChange={setTolerance}
          min={0}
          max={60}
          display={`${tolerance}%`}
        />
        <RangeField
          label="Edge softness"
          value={feather}
          onChange={setFeather}
          min={0}
          max={20}
          display={`${feather}%`}
        />
        <SelectField
          label="Remove"
          value={mode}
          onChange={(v) => setMode(v as 'contiguous' | 'all')}
          options={[
            { value: 'contiguous', label: 'Connected background only' },
            { value: 'all', label: 'All matching pixels' },
          ]}
        />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={download}
          disabled={!source}
        >
          Create transparent PNG
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setSource(null);
            setResults([]);
          }}
        >
          Choose another image
        </button>
      </div>
      <OutputList items={results} />
    </div>
  );
}
