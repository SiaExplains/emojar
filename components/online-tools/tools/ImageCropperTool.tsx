'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { outputName, type ImageFormat } from '@/lib/online-tools/image/core';
import { imageSize, processImage } from '@/lib/online-tools/image/process';
import type { CropRect } from '@/lib/online-tools/image/render';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  NumberField,
  SelectField,
  btnPrimary,
  btnSecondary,
  useObjectUrl,
} from '../ui';

const RATIOS: { value: string; label: string; ratio: number | null }[] = [
  { value: 'free', label: 'Free', ratio: null },
  { value: '1:1', label: '1:1 (square)', ratio: 1 },
  { value: '4:3', label: '4:3', ratio: 4 / 3 },
  { value: '3:2', label: '3:2', ratio: 3 / 2 },
  { value: '16:9', label: '16:9', ratio: 16 / 9 },
  { value: '9:16', label: '9:16 (story)', ratio: 9 / 16 },
  { value: '4:5', label: '4:5 (portrait post)', ratio: 4 / 5 },
];

function fitRatio(c: CropRect, ratio: number, w: number, h: number): CropRect {
  let width = c.width;
  let height = width / ratio;
  if (height > h) {
    height = h;
    width = height * ratio;
  }
  if (width > w) {
    width = w;
    height = width / ratio;
  }
  return {
    x: Math.min(c.x, w - width),
    y: Math.min(c.y, h - height),
    width,
    height,
  };
}

export default function ImageCropperTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [crop, setCrop] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [ratioKey, setRatioKey] = useState('free');
  const [format, setFormat] = useState<ImageFormat>('png');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const url = useObjectUrl(file);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const ratio = RATIOS.find((r) => r.value === ratioKey)?.ratio ?? null;

  useEffect(() => {
    if (!file) return;
    imageSize(file)
      .then((s) => {
        setSize(s);
        setCrop({
          x: Math.round(s.width * 0.1),
          y: Math.round(s.height * 0.1),
          width: Math.round(s.width * 0.8),
          height: Math.round(s.height * 0.8),
        });
        setFormat(
          file.type === 'image/jpeg'
            ? 'jpg'
            : file.type === 'image/webp'
              ? 'webp'
              : 'png',
        );
      })
      .catch(() => setError('This file could not be read as an image.'));
  }, [file]);

  useEffect(() => {
    if (size && ratio)
      setCrop((c) => fitRatio(c, ratio, size.width, size.height));
  }, [ratio, size]);

  const toImage = (e: PointerEvent) => {
    const rect = boxRef.current!.getBoundingClientRect();
    return {
      x: Math.max(
        0,
        Math.min(
          size!.width,
          ((e.clientX - rect.left) / rect.width) * size!.width,
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          size!.height,
          ((e.clientY - rect.top) / rect.height) * size!.height,
        ),
      ),
    };
  };

  const onDown = (e: PointerEvent) => {
    if (!size) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = toImage(e);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.current || !size) return;
    const p = toImage(e);
    const s = drag.current;
    let width = Math.abs(p.x - s.x);
    let height = Math.abs(p.y - s.y);
    if (ratio) {
      if (width / ratio > height) height = width / ratio;
      else width = height * ratio;
    }
    const x = p.x < s.x ? s.x - width : s.x;
    const y = p.y < s.y ? s.y - height : s.y;
    const next = {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.max(1, width),
      height: Math.max(1, height),
    };
    setCrop(
      ratio
        ? fitRatio(next, ratio, size.width, size.height)
        : {
            ...next,
            width: Math.min(next.width, size.width - next.x),
            height: Math.min(next.height, size.height - next.y),
          },
    );
  };
  const onUp = () => {
    drag.current = null;
  };

  const setField = (k: keyof CropRect, v: string) => {
    if (!size) return;
    const n = Math.max(0, Math.round(Number(v) || 0));
    setCrop((c) => {
      const next = { ...c, [k]: n };
      if (ratio && k === 'width') next.height = Math.round(n / ratio);
      if (ratio && k === 'height') next.width = Math.round(n * ratio);
      return next;
    });
  };

  const valid =
    size &&
    crop.width >= 1 &&
    crop.height >= 1 &&
    crop.x + crop.width <= size.width + 0.5 &&
    crop.y + crop.height <= size.height + 0.5;

  const doCrop = async () => {
    if (!file || !valid) return;
    setBusy(true);
    setError('');
    try {
      const r = await processImage(file, {
        format,
        quality: format === 'png' ? undefined : 0.92,
        crop,
      });
      setResults([
        {
          name: outputName(file.name, format, '-cropped'),
          blob: r.blob,
          width: r.width,
          height: r.height,
        },
      ]);
    } catch {
      setError('The image could not be cropped.');
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="image/*"
        onFiles={(f) => setFile(f[0])}
        hint="JPG, PNG, WebP, GIF, BMP"
      />
    );

  const pct = (n: number, total: number) => `${(n / total) * 100}%`;

  return (
    <div className="space-y-5">
      {url && size && (
        <div className="flex justify-center rounded-2xl bg-gray-50 p-2">
          <div
            ref={boxRef}
            className="relative touch-none select-none"
            style={{
              aspectRatio: `${size.width} / ${size.height}`,
              width: `min(100%, ${Math.round((480 * size.width) / size.height)}px)`,
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          >
            <img
              src={url}
              alt="Image to crop — drag to select an area"
              className="pointer-events-none h-full w-full"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
              style={{
                left: pct(crop.x, size.width),
                top: pct(crop.y, size.height),
                width: pct(crop.width, size.width),
                height: pct(crop.height, size.height),
              }}
            />
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Drag on the image to draw a new crop area, or type exact values below.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NumberField
          label="X"
          value={Math.round(crop.x)}
          onChange={(v) => setField('x', v)}
          min={0}
          suffix="px"
        />
        <NumberField
          label="Y"
          value={Math.round(crop.y)}
          onChange={(v) => setField('y', v)}
          min={0}
          suffix="px"
        />
        <NumberField
          label="Width"
          value={Math.round(crop.width)}
          onChange={(v) => setField('width', v)}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Height"
          value={Math.round(crop.height)}
          onChange={(v) => setField('height', v)}
          min={1}
          suffix="px"
        />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Aspect ratio"
          value={ratioKey}
          onChange={setRatioKey}
          options={RATIOS}
        />
        <SelectField
          label="Format"
          value={format}
          onChange={(v) => setFormat(v as ImageFormat)}
          options={[
            { value: 'png', label: 'PNG' },
            { value: 'jpg', label: 'JPG' },
            { value: 'webp', label: 'WebP' },
          ]}
        />
        <button
          type="button"
          className={btnPrimary}
          onClick={doCrop}
          disabled={!valid || busy}
        >
          {busy ? 'Cropping…' : 'Crop image'}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setSize(null);
            setResults([]);
          }}
        >
          Choose another image
        </button>
      </div>
      {size && !valid && (
        <ErrorMessage>
          The crop area must lie inside the image ({size.width}×{size.height}{' '}
          px).
        </ErrorMessage>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
