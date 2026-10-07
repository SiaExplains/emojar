'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  centerCrop,
  splitGrid,
  type Tile,
} from '@/lib/online-tools/image/layout';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  NumberField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  IMAGE_ACCEPT,
  baseName,
  keepFormat,
  makeCanvas,
  useImageFile,
  zipFiles,
} from './image-shared';

const PRESETS = [
  { value: '1x3', label: '1 row × 3 (panorama, 3 posts)' },
  { value: '2x3', label: '2 rows × 3 (6 posts)' },
  { value: '3x3', label: '3 rows × 3 (9 posts)' },
  { value: '4x3', label: '4 rows × 3 (12 posts)' },
  { value: '1x2', label: '1 row × 2 (carousel)' },
  { value: 'custom', label: 'Custom' },
];

/** Tile shape: Instagram's profile grid shows 3:4 crops; square is the classic look. */
const SHAPES = [
  { value: 'free', label: 'Keep the image as is' },
  { value: '1:1', label: 'Square tiles (1:1)' },
  { value: '4:5', label: 'Portrait tiles (4:5 — Instagram post)' },
  { value: '3:4', label: 'Portrait tiles (3:4 — Instagram profile grid)' },
];

export default function GridSplitterTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [preset, setPreset] = useState('3x3');
  const [rows, setRows] = useState('3');
  const [cols, setCols] = useState('3');
  const [shape, setShape] = useState('1:1');
  const [numbers, setNumbers] = useState(true);
  const [tiles, setTiles] = useState<{ tile: Tile; blob: Blob; url: string }[]>(
    [],
  );
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const r = Math.min(10, Math.max(1, Math.round(Number(rows) || 1)));
  const c = Math.min(10, Math.max(1, Math.round(Number(cols) || 1)));

  const area = useMemo(() => {
    if (!image) return null;
    const { width: w, height: h } = image.bitmap;
    if (shape === 'free') return { x: 0, y: 0, w, h };
    const [tw, th] = shape.split(':').map(Number);
    return centerCrop(w, h, c * tw, r * th);
  }, [image, shape, r, c]);

  const grid = useMemo(() => (area ? splitGrid(area, r, c) : []), [area, r, c]);

  useEffect(() => {
    setTiles((old) => {
      old.forEach((t) => URL.revokeObjectURL(t.url));
      return [];
    });
  }, [image, grid]);

  useEffect(
    () => () => tiles.forEach((t) => URL.revokeObjectURL(t.url)),
    [tiles],
  );

  // Preview with grid lines and posting order.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !image || !area) return;
    const scale = Math.min(1, 720 / Math.max(area.w, area.h));
    cv.width = Math.round(area.w * scale);
    cv.height = Math.round(area.h * scale);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(
      image.bitmap,
      area.x,
      area.y,
      area.w,
      area.h,
      0,
      0,
      cv.width,
      cv.height,
    );
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    for (const t of grid) {
      const x = (t.x - area.x) * scale;
      const y = (t.y - area.y) * scale;
      ctx.strokeRect(x, y, t.w * scale, t.h * scale);
      if (numbers) {
        const fs = Math.max(12, Math.min(t.w, t.h) * scale * 0.18);
        ctx.font = `700 ${fs}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(17,24,39,0.65)';
        ctx.beginPath();
        ctx.arc(
          x + (t.w * scale) / 2,
          y + (t.h * scale) / 2,
          fs * 0.9,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(
          String(t.post),
          x + (t.w * scale) / 2,
          y + (t.h * scale) / 2,
        );
      }
    }
  }, [image, area, grid, numbers]);

  const split = async () => {
    if (!image) return;
    setBusy(true);
    setError('');
    try {
      const out: { tile: Tile; blob: Blob; url: string }[] = [];
      const fmt = keepFormat(image.type);
      for (const t of grid) {
        const [cv, ctx] = makeCanvas(t.w, t.h);
        ctx.drawImage(image.bitmap, t.x, t.y, t.w, t.h, 0, 0, t.w, t.h);
        const blob = await canvasToBlob(cv, fmt, 0.95);
        out.push({ tile: t, blob, url: URL.createObjectURL(blob) });
      }
      setTiles(out.sort((a, b) => a.tile.post - b.tile.post));
    } catch {
      setError('The image could not be split. Try a smaller image.');
    } finally {
      setBusy(false);
    }
  };

  const ext = image ? keepFormat(image.type) : 'jpg';
  const fileName = (t: Tile) =>
    `${baseName(image?.name ?? 'image')}-post-${String(t.post).padStart(2, '0')}-r${t.row + 1}c${t.col + 1}.${ext}`;

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose an image or drop it here"
          hint="A wide or tall photo, a poster or a panorama"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            aria-label="Grid preview with posting order"
            className="block h-auto max-h-[560px] w-auto max-w-full rounded-xl border border-gray-200"
          />
          <p className="text-xs text-gray-500">
            Numbers show the order to post: start with 1 (bottom right) so the
            picture lines up on your profile.
          </p>
        </div>
        <div className="space-y-4">
          <SelectField
            label="Grid"
            value={preset}
            onChange={(v) => {
              setPreset(v);
              if (v !== 'custom') {
                const [pr, pc] = v.split('x');
                setRows(pr);
                setCols(pc);
              }
            }}
            options={PRESETS}
          />
          {preset === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Rows"
                value={rows}
                onChange={setRows}
                min={1}
                max={10}
              />
              <NumberField
                label="Columns"
                value={cols}
                onChange={setCols}
                min={1}
                max={10}
              />
            </div>
          )}
          <SelectField
            label="Tile shape"
            value={shape}
            onChange={setShape}
            options={SHAPES}
          />
          <Checkbox
            label="Show posting order on preview"
            checked={numbers}
            onChange={setNumbers}
          />
          <p className="text-xs text-gray-500">
            {r * c} tiles ·{' '}
            {grid[0] ? `${grid[0].w} × ${grid[0].h} px each` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              disabled={busy}
              onClick={split}
            >
              {busy ? 'Splitting…' : 'Split image'}
            </button>
            <button type="button" className={btnSecondary} onClick={clear}>
              Choose another image
            </button>
          </div>
        </div>
      </div>

      {tiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900">
              {tiles.length} tiles ready, in posting order
            </p>
            <button
              type="button"
              className={btnPrimary}
              onClick={async () =>
                downloadBlob(
                  await zipFiles(
                    tiles.map((t) => ({
                      name: fileName(t.tile),
                      data: t.blob,
                    })),
                  ),
                  `${baseName(image.name)}-grid-${r}x${c}.zip`,
                )
              }
            >
              ⬇ Download all (ZIP)
            </button>
          </div>
          <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {tiles.map((t) => (
              <li key={t.tile.post} className="space-y-1">
                <img
                  src={t.url}
                  alt={`Tile ${t.tile.post}`}
                  className="h-auto w-full rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  className="w-full text-xs text-indigo-700 hover:underline"
                  onClick={() => downloadBlob(t.blob, fileName(t.tile))}
                >
                  Post {t.tile.post} ⬇
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
