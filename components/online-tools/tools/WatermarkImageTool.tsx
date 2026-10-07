'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ANCHORS,
  anchorPoint,
  tilePoints,
  type Anchor,
} from '@/lib/online-tools/image/layout';
import { canvasToBlob, decodeImage } from '@/lib/online-tools/image/process';
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
  inputBase,
} from '../ui';
import {
  IMAGE_ACCEPT,
  MAX_CANVAS_SIDE,
  baseName,
  makeCanvas,
  zipFiles,
} from './image-shared';

type Mark = 'text' | 'logo';

type Options = {
  mark: Mark;
  text: string;
  font: string;
  bold: boolean;
  size: number; // text: font size as % of image width; logo: width is 3× this %
  color: string;
  opacity: number;
  rotation: number;
  anchor: Anchor;
  margin: number; // % of the shorter side
  tiled: boolean;
  spacing: number; // multiple of the mark size
  outline: boolean;
};

const FONTS = [
  {
    value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    label: 'Sans-serif',
  },
  { value: 'Georgia, "Times New Roman", serif', label: 'Serif' },
  { value: 'ui-monospace, Menlo, Consolas, monospace', label: 'Monospace' },
  { value: 'Impact, "Arial Black", sans-serif', label: 'Impact' },
  { value: '"Brush Script MT", "Segoe Script", cursive', label: 'Handwriting' },
];

const DEFAULTS: Record<'text' | 'watermark', Options> = {
  text: {
    mark: 'text',
    text: 'Your text here',
    font: FONTS[0].value,
    bold: true,
    size: 8,
    color: '#ffffff',
    opacity: 1,
    rotation: 0,
    anchor: 'center',
    margin: 4,
    tiled: false,
    spacing: 2.5,
    outline: true,
  },
  watermark: {
    mark: 'text',
    text: `© ${new Date().getFullYear()} Your Name`,
    font: FONTS[0].value,
    bold: true,
    size: 4,
    color: '#ffffff',
    opacity: 0.45,
    rotation: 0,
    anchor: 'bottom-right',
    margin: 3,
    tiled: false,
    spacing: 2.5,
    outline: false,
  },
};

type Source = { file: File; bitmap: ImageBitmap };

const MAX_IMAGES = 50;

function drawMarks(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  o: Options,
  logo: ImageBitmap | null,
) {
  let markW: number;
  let markH: number;
  const lines = o.text.split('\n');
  const fontPx = Math.max(6, (W * o.size) / 100);
  if (o.mark === 'logo') {
    if (!logo) return;
    markW = Math.max(4, (W * o.size * 3) / 100);
    markH = (markW * logo.height) / logo.width;
  } else {
    if (!o.text.trim()) return;
    ctx.font = `${o.bold ? 700 : 400} ${fontPx}px ${o.font}`;
    markW = Math.max(...lines.map((l) => ctx.measureText(l).width));
    markH = fontPx * 1.2 * lines.length;
  }
  const margin = (Math.min(W, H) * o.margin) / 100;
  const points = o.tiled
    ? tilePoints(W, H, markW * o.spacing, markH * o.spacing * 1.6)
    : [anchorPoint(o.anchor, W, H, markW, markH, margin)];
  ctx.save();
  ctx.globalAlpha = o.opacity;
  for (const p of points) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((o.rotation * Math.PI) / 180);
    if (o.mark === 'logo' && logo) {
      ctx.drawImage(logo, -markW / 2, -markH / 2, markW, markH);
    } else {
      ctx.font = `${o.bold ? 700 : 400} ${fontPx}px ${o.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      lines.forEach((line, i) => {
        const y = (i - (lines.length - 1) / 2) * fontPx * 1.2;
        if (o.outline) {
          ctx.lineWidth = Math.max(1, fontPx / 8);
          ctx.strokeStyle =
            o.color.toLowerCase() === '#000000' ? '#ffffff' : '#000000';
          ctx.strokeText(line, 0, y);
        } else {
          ctx.shadowColor = 'rgba(0,0,0,0.35)';
          ctx.shadowBlur = fontPx / 6;
        }
        ctx.fillStyle = o.color;
        ctx.fillText(line, 0, y);
        ctx.shadowColor = 'transparent';
      });
    }
    ctx.restore();
  }
  ctx.restore();
}

function renderImage(
  src: ImageBitmap,
  o: Options,
  logo: ImageBitmap | null,
  maxSide?: number,
) {
  const scale = Math.min(
    1,
    (maxSide ?? MAX_CANVAS_SIDE) / Math.max(src.width, src.height),
  );
  const W = Math.round(src.width * scale);
  const H = Math.round(src.height * scale);
  const [canvas, ctx] = makeCanvas(W, H);
  ctx.drawImage(src, 0, 0, W, H);
  drawMarks(ctx, W, H, o, logo);
  return canvas;
}

const outFormat = (f: File) =>
  /png/i.test(f.type) ? 'png' : /webp/i.test(f.type) ? 'webp' : 'jpg';

export default function WatermarkImageTool({ config }: ToolProps) {
  const mode = config.mode === 'watermark' ? 'watermark' : 'text';
  const [o, setO] = useState<Options>(DEFAULTS[mode]);
  const [sources, setSources] = useState<Source[]>([]);
  const [logo, setLogo] = useState<ImageBitmap | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const countRef = useRef(0);
  useEffect(() => {
    countRef.current = sources.length;
  }, [sources]);
  const set = <K extends keyof Options>(k: K, v: Options[K]) =>
    setO((p) => ({ ...p, [k]: v }));

  const addFiles = useCallback(async (files: File[]) => {
    setError('');
    const loaded: Source[] = [];
    const room = MAX_IMAGES - countRef.current;
    if (files.length > room)
      setError(
        `Up to ${MAX_IMAGES} images at a time — ${files.length - Math.max(0, room)} were skipped.`,
      );
    for (const file of files.slice(0, Math.max(0, room))) {
      try {
        loaded.push({ file, bitmap: await decodeImage(file) });
      } catch {
        setError(
          `“${file.name}” could not be read as an image and was skipped.`,
        );
      }
    }
    setSources((s) => [...s, ...loaded].slice(0, MAX_IMAGES));
  }, []);

  useEffect(() => {
    const c = previewRef.current;
    const first = sources[0];
    if (!c || !first) return;
    const r = renderImage(first.bitmap, o, logo, 1200);
    c.width = r.width;
    c.height = r.height;
    c.getContext('2d')?.drawImage(r, 0, 0);
  }, [sources, o, logo]);

  const exportOne = async (s: Source) => {
    const fmt = outFormat(s.file);
    const blob = await canvasToBlob(renderImage(s.bitmap, o, logo), fmt, 0.92);
    return {
      blob,
      name: `${baseName(s.file.name)}-${mode === 'watermark' ? 'watermarked' : 'text'}.${fmt}`,
    };
  };

  const downloadAll = async () => {
    setBusy(true);
    setError('');
    try {
      if (sources.length === 1) {
        const r = await exportOne(sources[0]);
        downloadBlob(r.blob, r.name);
      } else {
        const files = [];
        for (const s of sources) {
          const r = await exportOne(s);
          files.push({ name: r.name, data: r.blob });
        }
        downloadBlob(
          await zipFiles(files),
          `${mode === 'watermark' ? 'watermarked' : 'images-with-text'}.zip`,
        );
      }
    } catch {
      setError(
        'The images could not be exported. Try fewer or smaller images.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {sources.length === 0 ? (
        <FileDropzone
          onFiles={addFiles}
          accept={IMAGE_ACCEPT}
          multiple
          label={
            mode === 'watermark'
              ? 'Choose photos to watermark or drop them here'
              : 'Choose an image or drop it here'
          }
          hint={
            mode === 'watermark'
              ? 'Add up to 50 photos — the same watermark is applied to all of them'
              : 'JPG, PNG, WebP and more'
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-2">
            <canvas
              ref={previewRef}
              aria-label="Preview of the first image"
              className="max-h-[520px] w-full rounded-xl border border-gray-200 object-contain"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-xs text-gray-500">
              {sources.length === 1
                ? sources[0].file.name
                : `Previewing ${sources[0].file.name} · ${sources.length} images will be exported`}
            </p>
          </div>
          <div className="space-y-4">
            <div
              role="radiogroup"
              aria-label="Watermark type"
              className="inline-flex rounded-xl border border-gray-200 p-1"
            >
              {(['text', 'logo'] as Mark[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={o.mark === m}
                  onClick={() => set('mark', m)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${o.mark === m ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {m === 'text' ? 'Text' : 'Logo image'}
                </button>
              ))}
            </div>
            {o.mark === 'text' ? (
              <>
                <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                  <span>Text</span>
                  <textarea
                    rows={2}
                    value={o.text}
                    onChange={(e) => set('text', e.target.value)}
                    className={inputBase}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <SelectField
                    label="Font"
                    value={o.font}
                    onChange={(v) => set('font', v)}
                    options={FONTS}
                  />
                  <label className="space-y-1.5 text-sm font-medium text-gray-700">
                    <span className="block">Colour</span>
                    <input
                      type="color"
                      value={o.color}
                      onChange={(e) => set('color', e.target.value)}
                      className="h-10 w-full cursor-pointer rounded border border-gray-200"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Checkbox
                    label="Bold"
                    checked={o.bold}
                    onChange={(v) => set('bold', v)}
                  />
                  <Checkbox
                    label="Outline"
                    checked={o.outline}
                    onChange={(v) => set('outline', v)}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Logo (PNG with transparency works best)
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full text-sm"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        setLogo(await decodeImage(f));
                      } catch {
                        setError('The logo could not be read as an image.');
                      }
                    }}
                  />
                </label>
              </div>
            )}
            <RangeField
              label="Size"
              value={o.size}
              onChange={(v) => set('size', v)}
              min={1}
              max={30}
              step={0.5}
              display={
                o.mark === 'logo'
                  ? `${Math.round(o.size * 3)}% wide`
                  : `${o.size}%`
              }
            />
            <RangeField
              label="Opacity"
              value={o.opacity}
              onChange={(v) => set('opacity', v)}
              min={0.05}
              max={1}
              step={0.05}
              display={`${Math.round(o.opacity * 100)}%`}
            />
            <RangeField
              label="Rotation"
              value={o.rotation}
              onChange={(v) => set('rotation', v)}
              min={-90}
              max={90}
              display={`${o.rotation}°`}
            />
            <Checkbox
              label="Repeat across the whole image (tiled)"
              checked={o.tiled}
              onChange={(v) =>
                setO((p) => ({
                  ...p,
                  tiled: v,
                  rotation: v && p.rotation === 0 ? -30 : p.rotation,
                }))
              }
            />
            {o.tiled ? (
              <RangeField
                label="Spacing"
                value={o.spacing}
                onChange={(v) => set('spacing', v)}
                min={1.2}
                max={5}
                step={0.1}
                display={`${o.spacing.toFixed(1)}×`}
              />
            ) : (
              <div className="space-y-1.5">
                <span className="block text-sm font-medium text-gray-700">
                  Position
                </span>
                <div
                  role="radiogroup"
                  aria-label="Position"
                  className="grid w-32 grid-cols-3 gap-1"
                >
                  {ANCHORS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      role="radio"
                      aria-checked={o.anchor === a}
                      aria-label={a.replace('-', ' ')}
                      onClick={() => set('anchor', a)}
                      className={`h-9 rounded-md border ${o.anchor === a ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnPrimary}
            disabled={busy || (o.mark === 'logo' && !logo)}
            onClick={downloadAll}
          >
            {busy
              ? 'Exporting…'
              : sources.length > 1
                ? `⬇ Download ${sources.length} images (ZIP)`
                : '⬇ Download image'}
          </button>
          <label className={`${btnSecondary} cursor-pointer`}>
            + Add images
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
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              sources.forEach((s) => s.bitmap.close());
              setSources([]);
            }}
          >
            Clear
          </button>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
