'use client';

// Shared pieces for the canvas image tools: loading an image, a drag-and-zoom
// crop editor, cover drawing and ZIP downloads.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { coverSource } from '@/lib/online-tools/image/layout';
import { decodeImage } from '@/lib/online-tools/image/process';

export const IMAGE_ACCEPT = 'image/*,.heic,.heif';

/** Hard cap so huge exports can't exhaust memory on phones. */
export const MAX_CANVAS_SIDE = 8192;

export type LoadedImage = { bitmap: ImageBitmap; name: string; type: string };

/**
 * Output format that keeps what matters about the input: formats that can
 * carry transparency are saved as PNG, everything else as JPG.
 */
export function keepFormat(type: string): 'png' | 'jpg' {
  return /png|webp|gif|svg/i.test(type) ? 'png' : 'jpg';
}

/** Loads one image file into an ImageBitmap, closing the previous one. */
export function useImageFile() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async (file: File, opts?: { svgWidth?: number }) => {
    setError('');
    try {
      const bitmap = await decodeImage(file, opts);
      setImage((prev) => {
        prev?.bitmap.close();
        return { bitmap, name: file.name, type: file.type };
      });
    } catch {
      setError(
        'This file could not be read as an image. Try a JPG, PNG or WebP.',
      );
    }
  }, []);
  const clear = useCallback(() => {
    setImage((prev) => {
      prev?.bitmap.close();
      return null;
    });
  }, []);
  return { image, error, setError, load, clear };
}

export function makeCanvas(
  w: number,
  h: number,
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create an image canvas.');
  ctx.imageSmoothingQuality = 'high';
  return [canvas, ctx];
}

export type CoverView = { fx: number; fy: number; zoom: number };
export const CENTERED: CoverView = { fx: 0.5, fy: 0.5, zoom: 1 };

/** Draws `src` so it fills the destination rectangle (object-fit: cover). */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource & { width: number; height: number },
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  view: CoverView = CENTERED,
) {
  const s = coverSource(
    src.width,
    src.height,
    dw,
    dh,
    view.fx,
    view.fy,
    view.zoom,
  );
  ctx.drawImage(src, s.x, s.y, s.w, s.h, dx, dy, dw, dh);
}

/**
 * Interactive crop: drag (or arrow keys) to move, +/− keys or the caller's
 * slider to zoom. The image always
 * covers the frame; `overlay` draws guides (circle mask, head oval…) on top.
 */
export function CoverEditor({
  bitmap,
  aspect,
  view,
  onChange,
  overlay,
  maxWidth = 420,
  background,
}: {
  bitmap: ImageBitmap;
  aspect: number;
  view: CoverView;
  onChange: (v: CoverView) => void;
  overlay?: ReactNode;
  maxWidth?: number;
  background?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; v: CoverView } | null>(null);
  const [boxW, setBoxW] = useState(maxWidth);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = Math.max(80, Math.min(maxWidth, boxW));
  const h = Math.round(w / aspect);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingQuality = 'high';
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, c.width, c.height);
    } else ctx.clearRect(0, 0, c.width, c.height);
    drawCover(ctx, bitmap, 0, 0, c.width, c.height, view);
  }, [bitmap, w, h, view, background]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, v: view };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const s = coverSource(
      bitmap.width,
      bitmap.height,
      w,
      h,
      d.v.fx,
      d.v.fy,
      d.v.zoom,
    );
    const scale = w / s.w; // screen px per source px
    const ox = bitmap.width - s.w;
    const oy = bitmap.height - s.h;
    const fx = ox > 0.5 ? d.v.fx - (e.clientX - d.x) / scale / ox : 0.5;
    const fy = oy > 0.5 ? d.v.fy - (e.clientY - d.y) / scale / oy : 0.5;
    onChange({
      ...d.v,
      fx: Math.min(1, Math.max(0, fx)),
      fy: Math.min(1, Math.max(0, fy)),
    });
  };
  const nudge = (dx: number, dy: number) =>
    onChange({
      ...view,
      fx: Math.min(1, Math.max(0, view.fx + dx)),
      fy: Math.min(1, Math.max(0, view.fy + dy)),
    });

  return (
    <div ref={boxRef} className="w-full" style={{ maxWidth }}>
      <div
        role="application"
        aria-label="Crop area. Drag or use the arrow keys to move the photo, plus and minus to zoom."
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          const step = 0.03;
          if (e.key === 'ArrowLeft') nudge(-step, 0);
          else if (e.key === 'ArrowRight') nudge(step, 0);
          else if (e.key === 'ArrowUp') nudge(0, -step);
          else if (e.key === 'ArrowDown') nudge(0, step);
          else if (e.key === '+' || e.key === '=')
            onChange({ ...view, zoom: Math.min(5, view.zoom * 1.1) });
          else if (e.key === '-')
            onChange({ ...view, zoom: Math.max(1, view.zoom / 1.1) });
          else return;
          e.preventDefault();
        }}
        className="relative cursor-move touch-none select-none overflow-hidden rounded-xl border border-gray-200 bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        style={{ width: w, height: h }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: w, height: h }}
          className="block"
        />
        {overlay && (
          <div className="pointer-events-none absolute inset-0">{overlay}</div>
        )}
      </div>
    </div>
  );
}

/** Builds a ZIP in the browser (fflate is loaded only when needed). */
export async function zipFiles(
  files: { name: string; data: Blob | Uint8Array | string }[],
): Promise<Blob> {
  const { zipSync, strToU8 } = await import('fflate');
  const entries: Record<string, Uint8Array> = {};
  for (const f of files) {
    entries[f.name] =
      typeof f.data === 'string'
        ? strToU8(f.data)
        : f.data instanceof Uint8Array
          ? f.data
          : new Uint8Array(await f.data.arrayBuffer());
  }
  // PNGs and JPGs are already compressed; level 0 keeps zipping instant.
  const zipped = zipSync(entries, { level: 0 });
  return new Blob([zipped as BlobPart], { type: 'application/zip' });
}

/** Strips the extension from a file name for building output names. */
export function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '') || 'image';
}

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
