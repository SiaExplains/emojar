'use client';

import { useEffect, useRef, useState } from 'react';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  CENTERED,
  CoverEditor,
  IMAGE_ACCEPT,
  baseName,
  drawCover,
  makeCanvas,
  useImageFile,
  type CoverView,
} from './image-shared';

type Shape = 'circle' | 'rounded' | 'square';
type BorderStyle = 'none' | 'solid' | 'gradient';

const GRADIENTS: Record<string, [string, string, string]> = {
  sunset: ['#f9ce34', '#ee2a7b', '#6228d7'],
  ocean: ['#22d3ee', '#3b82f6', '#6366f1'],
  forest: ['#a3e635', '#10b981', '#0f766e'],
  mono: ['#e5e7eb', '#6b7280', '#111827'],
};

type Options = {
  shape: Shape;
  border: BorderStyle;
  borderWidth: number; // % of size
  borderColor: string;
  gradient: string;
  bg: string;
  transparent: boolean;
  view: CoverView;
};

function shapePath(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  x: number,
  y: number,
  s: number,
) {
  ctx.beginPath();
  if (shape === 'circle') ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
  else if (shape === 'rounded') ctx.roundRect(x, y, s, s, s * 0.18);
  else ctx.rect(x, y, s, s);
  ctx.closePath();
}

function render(
  bitmap: ImageBitmap,
  size: number,
  o: Options,
): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  // JPG has no transparency: paint the whole square so the corners match.
  if (!o.transparent) {
    ctx.fillStyle = o.bg;
    ctx.fillRect(0, 0, size, size);
  }
  const bw = o.border === 'none' ? 0 : Math.round((size * o.borderWidth) / 100);
  if (bw > 0) {
    shapePath(ctx, o.shape, 0, 0, size);
    if (o.border === 'solid') ctx.fillStyle = o.borderColor;
    else {
      const [a, b, c] = GRADIENTS[o.gradient] ?? GRADIENTS.sunset;
      const g = ctx.createLinearGradient(0, size, size, 0);
      g.addColorStop(0, a);
      g.addColorStop(0.5, b);
      g.addColorStop(1, c);
      ctx.fillStyle = g;
    }
    ctx.fill();
  }
  const inner = size - 2 * bw;
  ctx.save();
  shapePath(ctx, o.shape, bw, bw, inner);
  ctx.clip();
  if (!o.transparent) {
    ctx.fillStyle = o.bg;
    ctx.fillRect(bw, bw, inner, inner);
  } else if (bw > 0) {
    // Transparent inside a border: punch out the ring's fill first.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(bw, bw, inner, inner);
    ctx.globalCompositeOperation = 'source-over';
  }
  drawCover(ctx, bitmap, bw, bw, inner, inner, o.view);
  ctx.restore();
  return canvas;
}

export default function ProfilePictureTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [o, setO] = useState<Options>({
    shape: 'circle',
    border: 'gradient',
    borderWidth: 4,
    borderColor: '#4f46e5',
    gradient: 'sunset',
    bg: '#ffffff',
    transparent: true,
    view: CENTERED,
  });
  const [size, setSize] = useState('800');
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const smallRef = useRef<HTMLCanvasElement | null>(null);
  const set = <K extends keyof Options>(k: K, v: Options[K]) =>
    setO((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!image || !previewRef.current) return;
    const c = render(image.bitmap, 360, o);
    const p = previewRef.current;
    p.width = 360;
    p.height = 360;
    const ctx = p.getContext('2d');
    ctx?.clearRect(0, 0, 360, 360);
    ctx?.drawImage(c, 0, 0);
    const sm = smallRef.current;
    const sctx = sm?.getContext('2d');
    if (sm && sctx) {
      sm.width = 80;
      sm.height = 80;
      sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(c, 0, 0, 80, 80);
    }
  }, [image, o]);

  const download = async () => {
    if (!image) return;
    try {
      const px = Number(size);
      const blob = await canvasToBlob(
        render(image.bitmap, px, o),
        o.transparent ? 'png' : 'jpg',
        0.95,
      );
      downloadBlob(
        blob,
        `${baseName(image.name)}-profile-${px}.${o.transparent ? 'png' : 'jpg'}`,
      );
    } catch {
      setError('The picture could not be created.');
    }
  };

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose a photo or drop it here"
          hint="A clear, well-lit photo of your face works best"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            1. Position your photo
          </p>
          <CoverEditor
            bitmap={image.bitmap}
            aspect={1}
            view={o.view}
            onChange={(v) => set('view', v)}
            maxWidth={360}
            overlay={
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <mask id="pp-mask">
                    <rect width="100" height="100" fill="white" />
                    {o.shape === 'circle' ? (
                      <circle cx="50" cy="50" r="50" fill="black" />
                    ) : (
                      <rect
                        width="100"
                        height="100"
                        rx={o.shape === 'rounded' ? 18 : 0}
                        fill="black"
                      />
                    )}
                  </mask>
                </defs>
                <rect
                  width="100"
                  height="100"
                  fill="rgba(17,24,39,0.45)"
                  mask="url(#pp-mask)"
                />
              </svg>
            }
          />
          <RangeField
            label="Zoom"
            value={o.view.zoom}
            onChange={(z) => set('view', { ...o.view, zoom: z })}
            min={1}
            max={5}
            step={0.01}
            display={`${Math.round(o.view.zoom * 100)}%`}
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">2. Preview</p>
          <canvas
            ref={previewRef}
            aria-label="Profile picture preview"
            className="h-[240px] w-[240px] rounded-xl bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px]"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">How it looks small:</span>
            <canvas ref={smallRef} aria-hidden className="h-10 w-10" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label="Shape"
          value={o.shape}
          onChange={(v) => set('shape', v as Shape)}
          options={[
            { value: 'circle', label: 'Circle' },
            { value: 'rounded', label: 'Rounded square' },
            { value: 'square', label: 'Square' },
          ]}
        />
        <SelectField
          label="Border"
          value={o.border}
          onChange={(v) => set('border', v as BorderStyle)}
          options={[
            { value: 'none', label: 'No border' },
            { value: 'solid', label: 'Solid colour' },
            { value: 'gradient', label: 'Gradient ring' },
          ]}
        />
        {o.border !== 'none' && (
          <RangeField
            label="Border width"
            value={o.borderWidth}
            onChange={(v) => set('borderWidth', v)}
            min={1}
            max={15}
            display={`${o.borderWidth}%`}
          />
        )}
        {o.border === 'solid' && (
          <label className="space-y-1.5 text-sm font-medium text-gray-700">
            <span className="block">Border colour</span>
            <input
              type="color"
              value={o.borderColor}
              onChange={(e) => set('borderColor', e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-gray-200"
            />
          </label>
        )}
        {o.border === 'gradient' && (
          <SelectField
            label="Gradient"
            value={o.gradient}
            onChange={(v) => set('gradient', v)}
            options={[
              { value: 'sunset', label: 'Sunset (yellow → pink → purple)' },
              { value: 'ocean', label: 'Ocean (cyan → blue)' },
              { value: 'forest', label: 'Forest (lime → teal)' },
              { value: 'mono', label: 'Monochrome' },
            ]}
          />
        )}
        <div className="space-y-2">
          <Checkbox
            label="Transparent background (PNG)"
            checked={o.transparent}
            onChange={(v) => set('transparent', v)}
          />
          {!o.transparent && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              Background
              <input
                type="color"
                value={o.bg}
                onChange={(e) => set('bg', e.target.value)}
                className="h-8 w-14 cursor-pointer rounded border border-gray-200"
              />
            </label>
          )}
        </div>
        <SelectField
          label="Size"
          value={size}
          onChange={setSize}
          options={[
            { value: '400', label: '400 × 400 px' },
            { value: '800', label: '800 × 800 px (recommended)' },
            { value: '1024', label: '1024 × 1024 px' },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnPrimary} onClick={download}>
          ⬇ Download {o.transparent ? 'PNG' : 'JPG'}
        </button>
        <button type="button" className={btnSecondary} onClick={clear}>
          Choose another photo
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
