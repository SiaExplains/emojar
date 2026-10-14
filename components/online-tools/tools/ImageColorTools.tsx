'use client';

// Image Color Palette Extractor and Image Pixel Color Picker. Images are
// decoded with createImageBitmap (EXIF orientation applied) into a canvas;
// pixels are read locally and never uploaded.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  btnSecondary,
} from '../ui';
import {
  formatHsl,
  formatRgb,
  readableOn,
  rgbToHex,
  type RGB,
} from '@/lib/online-tools/engines/color';
import {
  MAX_DECODE_SIDE,
  extractPalette,
  sourcePixel,
  type PaletteColor,
} from '@/lib/online-tools/engines/image-colors';

const MAX_FILE = 40 * 1024 * 1024;

type Decoded = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  scaled: boolean;
  name: string;
};

/** Decodes an image file into a canvas, capping very large images. */
async function decode(file: File, maxSide: number): Promise<Decoded> {
  if (file.size > MAX_FILE) throw new Error('That image is larger than 40 MB.');
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      file.type === 'image/heic' || /\.hei[cf]$/i.test(file.name)
        ? 'This browser can’t open HEIC photos. Convert it with HEIC to JPG first.'
        : 'This file couldn’t be opened as an image. Try JPG, PNG, WebP or GIF.',
    );
  }
  const f = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(bmp.width * f));
  c.height = Math.max(1, Math.round(bmp.height * f));
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx)
    throw new Error('Your browser couldn’t create a canvas for this image.');
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return {
    canvas: c,
    width: c.width,
    height: c.height,
    scaled: f < 1,
    name: file.name,
  };
}

function Codes({ c }: { c: RGB }) {
  const rows = [
    ['HEX', rgbToHex(c).toUpperCase()],
    ['RGB', formatRgb(c)],
    ['HSL', formatHsl(c)],
  ];
  return (
    <dl className="space-y-1">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <dt className="w-9 text-xs font-semibold text-gray-500">{k}</dt>
          <dd className="flex-1 font-mono text-[13px] text-gray-900">{v}</dd>
          <CopyButton text={v} className="!px-2 !py-1 text-xs" />
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ */
/* Palette extractor                                                    */
/* ------------------------------------------------------------------ */

export function PaletteExtractorTool(_: ToolProps) {
  const [img, setImg] = useState<Decoded | null>(null);
  const [k, setK] = useState('6');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const preview = useRef<HTMLDivElement>(null);

  const load = async (file: File) => {
    setError('');
    setBusy(true);
    try {
      // A small copy is plenty for colour statistics and keeps it fast.
      setImg(await decode(file, 400));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The image couldn’t be read.');
    } finally {
      setBusy(false);
    }
  };

  const palette = useMemo<PaletteColor[]>(() => {
    if (!img) return [];
    const data = img.canvas
      .getContext('2d')!
      .getImageData(0, 0, img.width, img.height).data;
    return extractPalette(data, Number(k));
  }, [img, k]);

  useEffect(() => {
    const box = preview.current;
    if (!box || !img) return;
    img.canvas.className =
      'max-h-[320px] max-w-full rounded-xl border border-gray-200';
    box.replaceChildren(img.canvas);
  }, [img]);

  const hexes = palette.map((c) => rgbToHex(c).toUpperCase());
  const css = `:root {\n${hexes.map((h, i) => `  --color-${i + 1}: ${h};`).join('\n')}\n}`;
  const json = JSON.stringify(
    palette.map((c) => ({
      hex: rgbToHex(c).toUpperCase(),
      rgb: [c.r, c.g, c.b],
      share: Number(c.share.toFixed(3)),
    })),
    null,
    2,
  );

  return (
    <div className="space-y-5">
      {!img ? (
        <FileDropzone
          accept="image/*"
          onFiles={(f) => load(f[0])}
          hint="JPG, PNG, WebP, GIF, AVIF — stays on your device"
        />
      ) : (
        <div className="flex flex-wrap items-end gap-3">
          <SelectField
            label="Number of colours"
            value={k}
            onChange={setK}
            options={['3', '4', '5', '6', '8', '10', '12'].map((v) => ({
              value: v,
              label: v,
            }))}
          />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setImg(null)}
          >
            Use another image
          </button>
        </div>
      )}
      {busy && (
        <p className="text-sm text-gray-500" role="status">
          Reading the image…
        </p>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {img && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div ref={preview} aria-label={`Preview of ${img.name}`} />
          <div className="space-y-4">
            {palette.length ? (
              <>
                <div
                  className="flex h-14 overflow-hidden rounded-xl border border-gray-200"
                  aria-hidden
                >
                  {palette.map((c) => (
                    <div
                      key={rgbToHex(c)}
                      style={{ background: rgbToHex(c), flexGrow: c.share }}
                    />
                  ))}
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {palette.map((c) => (
                    <li
                      key={rgbToHex(c)}
                      className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <span
                        className="flex h-16 w-16 shrink-0 items-end justify-end rounded-lg p-1 text-[10px] font-semibold"
                        style={{
                          background: rgbToHex(c),
                          color: readableOn(c),
                        }}
                      >
                        {Math.round(c.share * 100)}%
                      </span>
                      <div className="min-w-0 flex-1">
                        <Codes c={c} />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={hexes.join(', ')} label="Copy HEX list" />
                  <CopyButton text={css} label="Copy CSS variables" />
                  <CopyButton text={json} label="Copy JSON" />
                </div>
              </>
            ) : (
              <Notice>This image has no opaque pixels to sample.</Notice>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        The image is reduced to at most 400 px for the analysis, transparent
        pixels are ignored and similar colours are grouped with k-means
        clustering. Percentages show roughly how much of the image each colour
        covers.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pixel colour picker                                                  */
/* ------------------------------------------------------------------ */

type Pick = { x: number; y: number; c: RGB };
const LENS = 11;

export function ImageColorPickerTool(_: ToolProps) {
  const [img, setImg] = useState<Decoded | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [hover, setHover] = useState<Pick | null>(null);
  const [picked, setPicked] = useState<Pick | null>(null);
  const [history, setHistory] = useState<Pick[]>([]);
  const view = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);

  const load = async (file: File) => {
    setError('');
    setBusy(true);
    try {
      setImg(await decode(file, MAX_DECODE_SIDE));
      setPicked(null);
      setHover(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The image couldn’t be read.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const c = view.current;
    if (!c || !img) return;
    c.width = img.width;
    c.height = img.height;
    c.getContext('2d', { willReadFrequently: true })!.drawImage(
      img.canvas,
      0,
      0,
    );
    // Keep one full-size copy only: release the decode canvas.
    img.canvas.width = img.canvas.height = 0;
  }, [img]);

  const at = useCallback(
    (x: number, y: number): Pick | null => {
      const c = view.current;
      if (!img || !c) return null;
      const [r, g, b] = c
        .getContext('2d', { willReadFrequently: true })!
        .getImageData(x, y, 1, 1).data;
      return { x, y, c: { r, g, b } };
    },
    [img],
  );

  // Magnifier: the pixels around the current point, drawn without smoothing.
  const focus = hover ?? picked;
  useEffect(() => {
    const l = lens.current;
    const src = view.current;
    if (!l || !src || !img || !focus) return;
    const ctx = l.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, l.width, l.height);
    const half = Math.floor(LENS / 2);
    ctx.drawImage(
      src,
      focus.x - half,
      focus.y - half,
      LENS,
      LENS,
      0,
      0,
      l.width,
      l.height,
    );
    const cell = l.width / LENS;
    ctx.strokeStyle = readableOn(focus.c);
    ctx.lineWidth = 2;
    ctx.strokeRect(half * cell, half * cell, cell, cell);
  }, [img, focus]);

  const fromPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    // Map against the content box: the border isn't part of the image.
    const box = {
      left: r.left + el.clientLeft,
      top: r.top + el.clientTop,
      width: el.clientWidth,
      height: el.clientHeight,
    };
    const p = sourcePixel(e.clientX, e.clientY, box, {
      width: img?.width ?? 1,
      height: img?.height ?? 1,
    });
    return p ? at(p.x, p.y) : null;
  };

  const choose = (p: Pick | null) => {
    if (!p) return;
    setPicked(p);
    setHistory((h) =>
      [p, ...h.filter((x) => rgbToHex(x.c) !== rgbToHex(p.c))].slice(0, 8),
    );
  };

  const onKey = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (!img) return;
    const base = picked ?? {
      x: Math.floor(img.width / 2),
      y: Math.floor(img.height / 2),
    };
    const d = e.shiftKey ? 10 : 1;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-d, 0],
      ArrowRight: [d, 0],
      ArrowUp: [0, -d],
      ArrowDown: [0, d],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    const x = Math.min(img.width - 1, Math.max(0, base.x + m[0]));
    const y = Math.min(img.height - 1, Math.max(0, base.y + m[1]));
    setPicked(at(x, y));
  };

  const shown = picked ?? hover;

  return (
    <div className="space-y-5">
      {!img ? (
        <FileDropzone
          accept="image/*"
          onFiles={(f) => load(f[0])}
          hint="JPG, PNG, WebP, GIF, AVIF — stays on your device"
        />
      ) : (
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>
            {img.name} · {img.width} × {img.height} px
          </span>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setImg(null)}
          >
            Use another image
          </button>
        </div>
      )}
      {busy && (
        <p className="text-sm text-gray-500" role="status">
          Reading the image…
        </p>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {img?.scaled && (
        <Notice tone="amber">
          This image is very large, so it was reduced to {img.width} ×{' '}
          {img.height} px; coordinates refer to the reduced size.
        </Notice>
      )}
      {img && (
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0">
            <canvas
              ref={view}
              tabIndex={0}
              role="img"
              aria-label="Your image. Click or tap a pixel to pick its colour; with the keyboard, use the arrow keys (Shift for 10 px)."
              onPointerMove={(e) => setHover(fromPointer(e))}
              onPointerLeave={() => setHover(null)}
              onPointerDown={(e) => choose(fromPointer(e))}
              onKeyDown={onKey}
              className="max-h-[560px] max-w-full cursor-crosshair touch-none rounded-xl border border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="space-y-4">
            <canvas
              ref={lens}
              width={176}
              height={176}
              aria-hidden
              className="rounded-xl border border-gray-200 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px]"
              style={{ imageRendering: 'pixelated' }}
            />
            {shown ? (
              <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-12 w-12 rounded-lg border border-gray-200"
                    style={{ background: rgbToHex(shown.c) }}
                  />
                  <p className="text-sm text-gray-700">
                    {picked ? 'Picked' : 'Under the pointer'}
                    <br />
                    <span className="font-mono text-[13px]">
                      x {shown.x}, y {shown.y}
                    </span>
                  </p>
                </div>
                <Codes c={shown.c} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Move over the image, then click or tap a pixel.
              </p>
            )}
            {history.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500">
                  Recent picks
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {history.map((h) => (
                    <button
                      key={`${h.x},${h.y}`}
                      type="button"
                      onClick={() => setPicked(h)}
                      title={`${rgbToHex(h.c).toUpperCase()} at ${h.x}, ${h.y}`}
                      aria-label={`${rgbToHex(h.c).toUpperCase()} at ${h.x}, ${h.y}`}
                      className="h-8 w-8 rounded-lg border border-gray-200"
                      style={{ background: rgbToHex(h.c) }}
                    />
                  ))}
                </div>
                <CopyButton
                  text={history
                    .map((h) => rgbToHex(h.c).toUpperCase())
                    .join(', ')}
                  label="Copy all HEX"
                />
              </div>
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Coordinates are in image pixels, counted from the top-left corner (0,
        0), whatever size the image is shown at. Photo orientation from the
        camera (EXIF) is applied first.
      </p>
    </div>
  );
}
