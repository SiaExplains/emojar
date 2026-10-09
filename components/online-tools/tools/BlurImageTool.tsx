'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  blurRegion,
  fillRegion,
  pixelate,
} from '@/lib/online-tools/image/effects';
import type { Rect } from '@/lib/online-tools/image/layout';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  RangeField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  IMAGE_ACCEPT,
  MAX_CANVAS_SIDE,
  baseName,
  hexToRgb,
  keepFormat,
  makeCanvas,
  useImageFile,
} from './image-shared';

type Effect = 'pixelate' | 'blur' | 'box';

const PREVIEW_MAX = 1100;

/** Draws the image at `scale` and applies the effect to every region. */
function render(
  bitmap: ImageBitmap,
  regions: Rect[],
  effect: Effect,
  strength: number,
  color: string,
  scale: number,
) {
  const W = Math.round(bitmap.width * scale);
  const H = Math.round(bitmap.height * scale);
  const [canvas, ctx] = makeCanvas(W, H);
  ctx.drawImage(bitmap, 0, 0, W, H);
  if (!regions.length) return canvas;
  const img = ctx.getImageData(0, 0, W, H);
  // Strength is relative to the image so the preview matches the export.
  const amount = Math.max(2, Math.round((Math.max(W, H) * strength) / 250));
  for (const r of regions) {
    const sr = {
      x: r.x * scale,
      y: r.y * scale,
      w: r.w * scale,
      h: r.h * scale,
    };
    if (effect === 'pixelate') pixelate(img, sr, amount);
    else if (effect === 'blur') {
      // A light pixelate first destroys fine detail that blur alone can leave readable.
      pixelate(img, sr, Math.max(2, Math.round(amount / 3)));
      blurRegion(img, sr, amount);
    } else fillRegion(img, sr, hexToRgb(color));
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

export default function BlurImageTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [regions, setRegions] = useState<Rect[]>([]);
  const [effect, setEffect] = useState<Effect>('pixelate');
  const [strength, setStrength] = useState(5);
  const [color, setColor] = useState('#000000');
  const [draft, setDraft] = useState<Rect | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const scale = image
    ? Math.min(
        1,
        PREVIEW_MAX / Math.max(image.bitmap.width, image.bitmap.height),
      )
    : 1;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !image) return;
    const r = render(image.bitmap, regions, effect, strength, color, scale);
    c.width = r.width;
    c.height = r.height;
    c.getContext('2d')?.drawImage(r, 0, 0);
  }, [image, regions, effect, strength, color, scale]);

  const toImage = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const bw = image?.bitmap.width ?? 1;
    const bh = image?.bitmap.height ?? 1;
    return {
      x: Math.min(bw, Math.max(0, ((e.clientX - rect.left) / rect.width) * bw)),
      y: Math.min(bh, Math.max(0, ((e.clientY - rect.top) / rect.height) * bh)),
    };
  };
  const norm = (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): Rect => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  });

  const download = async () => {
    if (!image) return;
    setBusy(true);
    try {
      const s = Math.min(
        1,
        MAX_CANVAS_SIDE / Math.max(image.bitmap.width, image.bitmap.height),
      );
      const canvas = render(image.bitmap, regions, effect, strength, color, s);
      const png = keepFormat(image.type) === 'png';
      const blob = await canvasToBlob(canvas, png ? 'png' : 'jpg', 0.92);
      downloadBlob(
        blob,
        `${baseName(image.name)}-${effect === 'box' ? 'redacted' : effect === 'blur' ? 'blurred' : 'pixelated'}.${png ? 'png' : 'jpg'}`,
      );
    } catch {
      setError('The image could not be exported. Try a smaller image.');
    } finally {
      setBusy(false);
    }
  };

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose an image or drop it here"
          hint="Then drag boxes over faces, number plates or private details"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const pct = (v: number, total: number) => `${(v / total) * 100}%`;
  const bw = image.bitmap.width;
  const bh = image.bitmap.height;

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-2">
          <div
            className="relative cursor-crosshair touch-none select-none"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              start.current = toImage(e);
              setDraft(null);
            }}
            onPointerMove={(e) =>
              start.current && setDraft(norm(start.current, toImage(e)))
            }
            onPointerUp={(e) => {
              if (start.current) {
                const r = norm(start.current, toImage(e));
                if (r.w > bw / 200 && r.h > bh / 200)
                  setRegions((rs) => [...rs, r]);
              }
              start.current = null;
              setDraft(null);
            }}
          >
            <canvas
              ref={canvasRef}
              aria-label="Image preview — drag to add a region"
              className="block h-auto w-full rounded-xl border border-gray-200"
            />
            {regions.map((r, i) => (
              <div
                key={i}
                className="pointer-events-none absolute border-2 border-brand-500/80"
                style={{
                  left: pct(r.x, bw),
                  top: pct(r.y, bh),
                  width: pct(r.w, bw),
                  height: pct(r.h, bh),
                }}
              >
                <span className="absolute -left-0.5 -top-5 rounded bg-brand-600 px-1 text-xs font-semibold text-white">
                  {i + 1}
                </span>
              </div>
            ))}
            {draft && (
              <div
                className="pointer-events-none absolute border-2 border-dashed border-brand-600 bg-brand-500/10"
                style={{
                  left: pct(draft.x, bw),
                  top: pct(draft.y, bh),
                  width: pct(draft.w, bw),
                  height: pct(draft.h, bh),
                }}
              />
            )}
          </div>
          <p className="text-xs text-gray-500">
            Drag on the image to cover an area. Add as many areas as you need.
          </p>
        </div>
        <div className="space-y-4">
          <div
            role="radiogroup"
            aria-label="Effect"
            className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 p-1"
          >
            {(
              [
                ['pixelate', 'Pixelate'],
                ['blur', 'Blur'],
                ['box', 'Solid box'],
              ] as [Effect, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={effect === k}
                onClick={() => setEffect(k)}
                className={`rounded-lg px-2 py-1.5 text-sm ${effect === k ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {effect === 'box' ? (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              Box colour
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border border-gray-200"
              />
            </label>
          ) : (
            <RangeField
              label="Strength"
              value={strength}
              onChange={setStrength}
              min={1}
              max={10}
            />
          )}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-700">
              Areas ({regions.length})
            </p>
            {regions.length === 0 ? (
              <p className="text-xs text-gray-500">No areas yet.</p>
            ) : (
              <ul className="space-y-1">
                {regions.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-700"
                  >
                    <span>
                      {i + 1}. {Math.round(r.w)} × {Math.round(r.h)} px
                    </span>
                    <button
                      type="button"
                      className="text-red-700 hover:underline"
                      onClick={() =>
                        setRegions((rs) => rs.filter((_, j) => j !== i))
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Notice tone="green">
            The effect replaces the original pixels in the downloaded file, so
            the hidden detail can’t be recovered from it. For text such as
            account numbers, a solid box is the safest choice.
          </Notice>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={busy || !regions.length}
          onClick={download}
        >
          ⬇ Download image
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={!regions.length}
          onClick={() => setRegions((rs) => rs.slice(0, -1))}
        >
          Undo last area
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setRegions([]);
            clear();
          }}
        >
          Choose another image
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
