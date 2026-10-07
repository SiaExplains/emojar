'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { containDest } from '@/lib/online-tools/image/layout';
import { formatBytes } from '@/lib/online-tools/image/core';
import { decodeImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  useObjectUrl,
} from '../ui';
import { IMAGE_ACCEPT, drawCover, makeCanvas } from './image-shared';

type Frame = { id: number; bitmap: ImageBitmap; name: string };
let nextId = 1;
const MAX_FRAMES = 200;

export default function GifMakerTool(_: ToolProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(500);
  const [width, setWidth] = useState('480');
  const [fit, setFit] = useState<'contain' | 'cover'>('contain');
  const [bg, setBg] = useState('#ffffff');
  const [loop, setLoop] = useState(true);
  const [result, setResult] = useState<Blob | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const url = useObjectUrl(result);
  const countRef = useRef(0);
  useEffect(() => {
    countRef.current = frames.length;
  }, [frames]);

  const addFiles = useCallback(async (files: File[]) => {
    setError('');
    const loaded: Frame[] = [];
    for (const f of files) {
      try {
        loaded.push({
          id: nextId++,
          bitmap: await decodeImage(f),
          name: f.name,
        });
      } catch {
        setError(`“${f.name}” could not be read as an image and was skipped.`);
      }
    }
    if (countRef.current + loaded.length > MAX_FRAMES)
      setError(
        `A GIF can have up to ${MAX_FRAMES} frames here; extra images were skipped.`,
      );
    setFrames((fr) => [...fr, ...loaded].slice(0, MAX_FRAMES));
    setResult(null);
  }, []);

  const move = (i: number, d: -1 | 1) =>
    setFrames((fr) => {
      const j = i + d;
      if (j < 0 || j >= fr.length) return fr;
      const copy = fr.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const make = async () => {
    if (frames.length < 2) return setError('Add at least two images.');
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
      const first = frames[0].bitmap;
      const w = Math.max(16, Math.min(1200, Number(width) || 480));
      const h = Math.round((first.height * w) / first.width);
      const [canvas, ctx] = makeCanvas(w, h);
      const gif = GIFEncoder();
      setProgress({ done: 0, total: frames.length });
      for (let i = 0; i < frames.length; i++) {
        const b = frames[i].bitmap;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        if (fit === 'cover') drawCover(ctx, b, 0, 0, w, h);
        else {
          const d = containDest(b.width, b.height, w, h);
          ctx.drawImage(b, d.x, d.y, d.w, d.h);
        }
        const { data } = ctx.getImageData(0, 0, w, h);
        const palette = quantize(data, 256);
        gif.writeFrame(applyPalette(data, palette), w, h, {
          palette,
          delay,
          repeat: loop ? 0 : -1,
        });
        setProgress({ done: i + 1, total: frames.length });
        await new Promise((r) => setTimeout(r, 0));
      }
      gif.finish();
      setResult(new Blob([gif.bytes() as BlobPart], { type: 'image/gif' }));
    } catch {
      setError(
        'The GIF could not be created. Try fewer images or a smaller width.',
      );
    } finally {
      setBusy(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  if (!frames.length)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={addFiles}
          accept={IMAGE_ACCEPT}
          multiple
          label="Choose images or drop them here"
          hint="Each image becomes one frame — add 2 or more, in any format"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Frames ({frames.length}) — use the arrows to change the order
        </p>
        <ol className="flex flex-wrap gap-2">
          {frames.map((f, i) => (
            <li
              key={f.id}
              className="w-24 space-y-1 rounded-lg border border-gray-200 p-1 text-center"
            >
              <FrameThumb bitmap={f.bitmap} />
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  aria-label={`Move frame ${i + 1} earlier`}
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="px-1 disabled:opacity-30"
                >
                  ◀
                </button>
                <span className="tabular-nums text-gray-600">{i + 1}</span>
                <button
                  type="button"
                  aria-label={`Move frame ${i + 1} later`}
                  disabled={i === frames.length - 1}
                  onClick={() => move(i, 1)}
                  className="px-1 disabled:opacity-30"
                >
                  ▶
                </button>
              </div>
              <button
                type="button"
                className="text-xs text-red-700 hover:underline"
                onClick={() => {
                  f.bitmap.close();
                  setFrames((fr) => fr.filter((x) => x.id !== f.id));
                }}
              >
                Remove
              </button>
            </li>
          ))}
          <li>
            <label className="flex h-full min-h-[96px] w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-2xl text-gray-400 hover:bg-gray-50">
              +<span className="sr-only">Add images</span>
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                multiple
                className="sr-only"
                onChange={(e) =>
                  e.target.files && addFiles(Array.from(e.target.files))
                }
              />
            </label>
          </li>
        </ol>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RangeField
          label="Time per frame"
          value={delay}
          onChange={setDelay}
          min={20}
          max={3000}
          step={10}
          display={`${(delay / 1000).toFixed(2)} s`}
        />
        <SelectField
          label="Width"
          value={width}
          onChange={setWidth}
          options={[
            { value: '320', label: '320 px (small file)' },
            { value: '480', label: '480 px' },
            { value: '640', label: '640 px' },
            { value: '800', label: '800 px' },
            { value: '1080', label: '1080 px (large file)' },
          ]}
        />
        <SelectField
          label="Different sizes"
          value={fit}
          onChange={(v) => setFit(v as 'contain' | 'cover')}
          options={[
            { value: 'contain', label: 'Fit whole image (bars)' },
            { value: 'cover', label: 'Fill frame (crop)' },
          ]}
        />
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Bar colour
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-8 w-14 cursor-pointer rounded border border-gray-200"
            />
          </label>
          <Checkbox label="Loop forever" checked={loop} onChange={setLoop} />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        The first image sets the GIF’s shape; others are fitted into it.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={busy || frames.length < 2}
          onClick={make}
        >
          {busy ? 'Creating GIF…' : 'Create GIF'}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            frames.forEach((f) => f.bitmap.close());
            setFrames([]);
            setResult(null);
          }}
        >
          Start over
        </button>
      </div>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Frame"
        />
      )}
      {result && url && (
        <div className="space-y-2 rounded-xl border border-gray-200 p-4">
          {/* Animated preview of the generated file */}
          <img
            src={url}
            alt="Generated GIF preview"
            className="max-h-80 rounded-lg"
          />
          <p className="text-sm text-gray-600">
            {frames.length} frames · {formatBytes(result.size)}
          </p>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => downloadBlob(result, 'animation.gif')}
          >
            ⬇ Download GIF
          </button>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}

function FrameThumb({ bitmap }: { bitmap: ImageBitmap }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    c.width = 88;
    c.height = 66;
    const d = containDest(bitmap.width, bitmap.height, 88, 66);
    ctx.drawImage(bitmap, d.x, d.y, d.w, d.h);
  }, [bitmap]);
  return <canvas ref={ref} aria-hidden className="h-[66px] w-full" />;
}
