'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FAVICON_ICO_SIZES,
  buildIco,
  faviconHtml,
  webManifest,
} from '@/lib/online-tools/image/ico';
import { containDest } from '@/lib/online-tools/image/layout';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  IMAGE_ACCEPT,
  drawCover,
  makeCanvas,
  useImageFile,
  zipFiles,
} from './image-shared';

type Opts = {
  fit: 'contain' | 'cover';
  padding: number;
  transparent: boolean;
  bg: string;
  radius: number;
};

/** Renders the icon square at `size`. Apple icons are always opaque. */
function renderIcon(
  bitmap: ImageBitmap,
  size: number,
  o: Opts,
  opaque = false,
): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(size, size);
  const solid = opaque || !o.transparent;
  if (solid) {
    ctx.save();
    if (!opaque && o.radius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, (size * o.radius) / 100);
      ctx.clip();
    }
    ctx.fillStyle = o.bg;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }
  const pad = Math.round((size * o.padding) / 100);
  const inner = size - 2 * pad;
  ctx.save();
  if (!opaque && o.radius > 0) {
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, (size * o.radius) / 100);
    ctx.clip();
  }
  if (o.fit === 'cover') drawCover(ctx, bitmap, pad, pad, inner, inner);
  else {
    const d = containDest(bitmap.width, bitmap.height, inner, inner);
    ctx.drawImage(bitmap, pad + d.x, pad + d.y, d.w, d.h);
  }
  ctx.restore();
  return canvas;
}

const pngBytes = async (c: HTMLCanvasElement) =>
  new Uint8Array(await (await canvasToBlob(c, 'png')).arrayBuffer());

export default function FaviconGeneratorTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [o, setO] = useState<Opts>({
    fit: 'contain',
    padding: 0,
    transparent: true,
    bg: '#ffffff',
    radius: 0,
  });
  const [name, setName] = useState('My Website');
  const [theme, setTheme] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const previews = useRef<Record<number, HTMLCanvasElement | null>>({});
  const tabRef = useRef<HTMLCanvasElement | null>(null);
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) =>
    setO((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!image) return;
    for (const s of [16, 32, 48, 180]) {
      const c = previews.current[s];
      if (!c) continue;
      const r = renderIcon(image.bitmap, s * 2, o, s === 180);
      c.width = s * 2;
      c.height = s * 2;
      const ctx = c.getContext('2d');
      ctx?.clearRect(0, 0, c.width, c.height);
      ctx?.drawImage(r, 0, 0);
    }
    const tab = tabRef.current;
    if (tab) {
      tab.width = 32;
      tab.height = 32;
      const ctx = tab.getContext('2d');
      ctx?.clearRect(0, 0, 32, 32);
      ctx?.drawImage(renderIcon(image.bitmap, 32, o), 0, 0);
    }
  }, [image, o]);

  const html = useMemo(
    () => faviconHtml({ name, themeColor: theme }),
    [name, theme],
  );

  const download = async () => {
    if (!image) return;
    setBusy(true);
    setError('');
    try {
      const icoImages = [];
      for (const s of FAVICON_ICO_SIZES)
        icoImages.push({
          size: s,
          png: await pngBytes(renderIcon(image.bitmap, s, o)),
        });
      const files = [
        { name: 'favicon.ico', data: buildIco(icoImages) },
        { name: 'favicon-16x16.png', data: icoImages[0].png },
        { name: 'favicon-32x32.png', data: icoImages[1].png },
        {
          name: 'apple-touch-icon.png',
          data: await pngBytes(renderIcon(image.bitmap, 180, o, true)),
        },
        {
          name: 'android-chrome-192x192.png',
          data: await pngBytes(renderIcon(image.bitmap, 192, o)),
        },
        {
          name: 'android-chrome-512x512.png',
          data: await pngBytes(renderIcon(image.bitmap, 512, o)),
        },
        {
          name: 'site.webmanifest',
          data: webManifest({
            name,
            themeColor: theme,
            backgroundColor: o.bg,
          }),
        },
        {
          name: 'favicon-html.txt',
          data: `Paste this inside <head>:\n\n${html}\n`,
        },
      ];
      downloadBlob(await zipFiles(files), 'favicon-package.zip');
    } catch {
      setError('The favicon files could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const downloadIco = async () => {
    if (!image) return;
    try {
      const icoImages = [];
      for (const s of FAVICON_ICO_SIZES)
        icoImages.push({
          size: s,
          png: await pngBytes(renderIcon(image.bitmap, s, o)),
        });
      downloadBlob(
        new Blob([buildIco(icoImages) as BlobPart], { type: 'image/x-icon' }),
        'favicon.ico',
      );
    } catch {
      setError('The ICO file could not be created.');
    }
  };

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0], { svgWidth: 1024 })}
          accept={`${IMAGE_ACCEPT},.svg`}
          label="Choose a logo or image or drop it here"
          hint="Square images of 512 × 512 px or larger give the sharpest result; SVG works too"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Preview</p>
          <div className="flex flex-wrap items-end gap-6">
            {[16, 32, 48, 180].map((s) => (
              <figure key={s} className="space-y-1 text-center">
                <canvas
                  ref={(el) => {
                    previews.current[s] = el;
                  }}
                  style={{
                    width: Math.min(s, 96),
                    height: Math.min(s, 96),
                    imageRendering: s < 48 ? 'pixelated' : 'auto',
                  }}
                  className="mx-auto rounded bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:8px_8px]"
                  aria-label={`${s} × ${s} preview`}
                />
                <figcaption className="text-xs text-gray-500">
                  {s === 180 ? 'Apple 180' : `${s} px`}
                </figcaption>
              </figure>
            ))}
          </div>
          <div
            className="flex max-w-sm items-center gap-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-700"
            aria-hidden
          >
            <canvas ref={tabRef} style={{ width: 16, height: 16 }} />
            <span className="truncate">{name || 'My Website'}</span>
          </div>
        </div>
        <div className="space-y-4">
          <SelectField
            label="Fit"
            value={o.fit}
            onChange={(v) => set('fit', v as Opts['fit'])}
            options={[
              { value: 'contain', label: 'Show the whole image' },
              { value: 'cover', label: 'Crop to fill the square' },
            ]}
          />
          <RangeField
            label="Padding"
            value={o.padding}
            onChange={(v) => set('padding', v)}
            min={0}
            max={25}
            display={`${o.padding}%`}
          />
          <Checkbox
            label="Transparent background"
            checked={o.transparent}
            onChange={(v) => set('transparent', v)}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Background{' '}
            {o.transparent && (
              <span className="text-xs text-gray-500">
                (used for the Apple icon)
              </span>
            )}
            <input
              type="color"
              value={o.bg}
              onChange={(e) => set('bg', e.target.value)}
              className="h-8 w-14 cursor-pointer rounded border border-gray-200"
            />
          </label>
          <RangeField
            label="Rounded corners"
            value={o.radius}
            onChange={(v) => set('radius', v)}
            min={0}
            max={50}
            display={o.radius === 50 ? 'circle' : `${o.radius}%`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Site name (for the web app manifest)"
          value={name}
          onChange={setName}
        />
        <label className="space-y-1.5 text-sm font-medium text-gray-700">
          <span className="block">Theme colour</span>
          <input
            type="color"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded border border-gray-200"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={busy}
          onClick={download}
        >
          ⬇ Download favicon package (ZIP)
        </button>
        <button type="button" className={btnSecondary} onClick={downloadIco}>
          ⬇ favicon.ico only
        </button>
        <button type="button" className={btnSecondary} onClick={clear}>
          Choose another image
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Package: favicon.ico (16, 32 and 48 px), favicon-16x16.png,
        favicon-32x32.png, apple-touch-icon.png (180 px, always on your
        background colour — iOS rounds the corners itself), android-chrome 192
        and 512 px, site.webmanifest and favicon-html.txt with the code below.
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            HTML for your &lt;head&gt;
          </p>
          <CopyButton text={html} />
        </div>
        <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
          {html}
        </pre>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
