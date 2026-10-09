'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import {
  COLLAGE_LAYOUTS,
  collageRects,
  coverSource,
  type Rect,
} from '@/lib/online-tools/image/layout';
import { canvasToBlob, decodeImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
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
  IMAGE_ACCEPT,
  drawCover,
  makeCanvas,
  type CoverView,
} from './image-shared';

const ASPECTS: Record<string, { label: string; w: number; h: number }> = {
  '1:1': { label: 'Square 1:1', w: 1, h: 1 },
  '4:5': { label: 'Portrait 4:5 (Instagram)', w: 4, h: 5 },
  '9:16': { label: 'Story 9:16', w: 9, h: 16 },
  '16:9': { label: 'Landscape 16:9', w: 16, h: 9 },
  '3:2': { label: 'Photo print 3:2', w: 3, h: 2 },
};

type Photo = { id: number; bitmap: ImageBitmap; name: string };
let nextId = 1;

const PREVIEW_W = 640;
const gapPx = (width: number, gapPct: number) =>
  Math.round((width * gapPct) / 100);

function render(
  width: number,
  height: number,
  rects: Rect[],
  photos: Photo[],
  assign: (number | null)[],
  views: CoverView[],
  bg: string,
  radius: number,
) {
  const [canvas, ctx] = makeCanvas(width, height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  const r = (Math.min(width, height) * radius) / 100;
  rects.forEach((cell, i) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      cell.x,
      cell.y,
      cell.w,
      cell.h,
      Math.min(r, cell.w / 2, cell.h / 2),
    );
    ctx.clip();
    const photo = photos.find((p) => p.id === assign[i]);
    if (photo)
      drawCover(
        ctx,
        photo.bitmap,
        cell.x,
        cell.y,
        cell.w,
        cell.h,
        views[i] ?? CENTERED,
      );
    else {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
    }
    ctx.restore();
  });
  return canvas;
}

export default function CollageMakerTool(_: ToolProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [layoutId, setLayoutId] = useState('4g');
  const [aspect, setAspect] = useState('1:1');
  const [gap, setGap] = useState(2);
  const [radius, setRadius] = useState(0);
  const [bg, setBg] = useState('#ffffff');
  const [outW, setOutW] = useState('2048');
  const [assign, setAssign] = useState<(number | null)[]>([]);
  const [views, setViews] = useState<CoverView[]>([]);
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<{
    cell: number;
    x: number;
    y: number;
    v: CoverView;
  } | null>(null);
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const layout =
    COLLAGE_LAYOUTS.find((l) => l.id === layoutId) ?? COLLAGE_LAYOUTS[0];
  const a = ASPECTS[aspect];
  const previewH = Math.round((PREVIEW_W * a.h) / a.w);
  const previewRects = useMemo(
    () =>
      collageRects(layout.cells, PREVIEW_W, previewH, gapPx(PREVIEW_W, gap)),
    [layout, previewH, gap],
  );

  // Fill new cells with photos in upload order.
  useEffect(() => {
    setAssign((prev) => {
      const next: (number | null)[] = [];
      const valid = (id: number | null | undefined) =>
        id != null && photos.some((p) => p.id === id);
      layout.cells.forEach((_, i) => {
        const keep = prev[i];
        if (valid(keep) && !next.includes(keep!)) return next.push(keep!);
        const unused = photos.find(
          (p) => !next.includes(p.id) && !prev.slice(i + 1).includes(p.id),
        );
        // More cells than photos: repeat photos in order.
        next.push(
          unused?.id ?? photos[i % Math.max(1, photos.length)]?.id ?? null,
        );
      });
      return next;
    });
    setViews((prev) => layout.cells.map((_, i) => prev[i] ?? CENTERED));
    setSelected((s) => Math.min(s, layout.cells.length - 1));
  }, [layout, photos]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = render(
      PREVIEW_W,
      previewH,
      previewRects,
      photos,
      assign,
      views,
      bg,
      radius,
    );
    c.width = PREVIEW_W;
    c.height = previewH;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(r, 0, 0);
    const sel = previewRects[selected];
    if (sel) {
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 3;
      ctx.strokeRect(sel.x + 1.5, sel.y + 1.5, sel.w - 3, sel.h - 3);
    }
  }, [previewRects, previewH, photos, assign, views, bg, radius, selected]);

  const addFiles = useCallback(async (files: File[]) => {
    setError('');
    const loaded: Photo[] = [];
    for (const f of files.slice(0, 9)) {
      try {
        loaded.push({
          id: nextId++,
          bitmap: await decodeImage(f),
          name: f.name,
        });
      } catch {
        setError(`“${f.name}” could not be read as an image.`);
      }
    }
    // Pick a layout that matches the number of photos when starting out.
    if (photosRef.current.length === 0) {
      const match = COLLAGE_LAYOUTS.find(
        (l) => l.cells.length === Math.min(9, loaded.length),
      );
      if (match) setLayoutId(match.id);
    }
    setPhotos((p) => [...p, ...loaded].slice(0, 9));
  }, []);

  const cellAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * PREVIEW_W;
    const y = ((e.clientY - r.top) / r.height) * previewH;
    return previewRects.findIndex(
      (c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h,
    );
  };

  const download = async () => {
    try {
      const w = Number(outW);
      const h = Math.round((w * a.h) / a.w);
      const canvas = render(
        w,
        h,
        collageRects(layout.cells, w, h, gapPx(w, gap)),
        photos,
        assign,
        views,
        bg,
        radius,
      );
      downloadBlob(
        await canvasToBlob(canvas, 'jpg', 0.92),
        `collage-${layout.id}-${w}x${h}.jpg`,
      );
    } catch {
      setError('The collage could not be exported. Try a smaller size.');
    }
  };

  if (!photos.length)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={addFiles}
          accept={IMAGE_ACCEPT}
          multiple
          label="Choose 2–9 photos or drop them here"
          hint="You can add more later and swap photos between cells"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const selView = views[selected] ?? CENTERED;

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,640px)_1fr]">
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            aria-label="Collage preview. Click a cell to select it, drag to move its photo."
            className="block h-auto w-full cursor-move touch-none rounded-xl border border-gray-200"
            onPointerDown={(e) => {
              const cell = cellAt(e);
              if (cell < 0) return;
              setSelected(cell);
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                cell,
                x: e.clientX,
                y: e.clientY,
                v: views[cell] ?? CENTERED,
              };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const photo = photos.find((p) => p.id === assign[d.cell]);
              const cell = previewRects[d.cell];
              if (!photo || !cell) return;
              const scr =
                e.currentTarget.getBoundingClientRect().width / PREVIEW_W;
              const s = coverSource(
                photo.bitmap.width,
                photo.bitmap.height,
                cell.w,
                cell.h,
                d.v.fx,
                d.v.fy,
                d.v.zoom,
              );
              const k = (cell.w / s.w) * scr;
              const ox = photo.bitmap.width - s.w;
              const oy = photo.bitmap.height - s.h;
              const fx = ox > 0.5 ? d.v.fx - (e.clientX - d.x) / k / ox : 0.5;
              const fy = oy > 0.5 ? d.v.fy - (e.clientY - d.y) / k / oy : 0.5;
              setViews((vs) =>
                vs.map((v, i) =>
                  i === d.cell
                    ? {
                        ...d.v,
                        fx: Math.min(1, Math.max(0, fx)),
                        fy: Math.min(1, Math.max(0, fy)),
                      }
                    : v,
                ),
              );
            }}
            onPointerUp={() => (drag.current = null)}
          />
          <p className="text-xs text-gray-500">
            Click a cell to select it, then pick its photo below. Drag inside a
            cell to reposition the photo.
          </p>
        </div>
        <div className="space-y-4">
          <SelectField
            label="Layout"
            value={layoutId}
            onChange={setLayoutId}
            options={COLLAGE_LAYOUTS.map((l) => ({
              value: l.id,
              label: `${l.label} (${l.cells.length} photos)`,
            }))}
          />
          <SelectField
            label="Shape"
            value={aspect}
            onChange={setAspect}
            options={Object.entries(ASPECTS).map(([k, v]) => ({
              value: k,
              label: v.label,
            }))}
          />
          <RangeField
            label="Spacing"
            value={gap}
            onChange={setGap}
            min={0}
            max={8}
            step={0.5}
            display={`${gap}%`}
          />
          <RangeField
            label="Rounded corners"
            value={radius}
            onChange={setRadius}
            min={0}
            max={10}
            step={0.5}
            display={`${radius}%`}
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Background
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-8 w-14 cursor-pointer rounded border border-gray-200"
            />
          </label>
          <RangeField
            label={`Zoom (cell ${selected + 1})`}
            value={selView.zoom}
            onChange={(z) =>
              setViews((vs) =>
                vs.map((v, i) => (i === selected ? { ...v, zoom: z } : v)),
              )
            }
            min={1}
            max={4}
            step={0.01}
            display={`${Math.round(selView.zoom * 100)}%`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Photo for cell {selected + 1}
        </p>
        <div className="flex flex-wrap gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              <button
                type="button"
                title={p.name}
                aria-label={`Use ${p.name} in cell ${selected + 1}`}
                aria-pressed={assign[selected] === p.id}
                onClick={() => {
                  setAssign((as) =>
                    as.map((v, i) => (i === selected ? p.id : v)),
                  );
                  setViews((vs) =>
                    vs.map((v, i) => (i === selected ? CENTERED : v)),
                  );
                }}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${assign[selected] === p.id ? 'border-brand-600' : 'border-transparent'}`}
              >
                <Thumb bitmap={p.bitmap} />
              </button>
              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                onClick={() => {
                  p.bitmap.close();
                  setPhotos((ps) => ps.filter((x) => x.id !== p.id));
                }}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {photos.length < 9 && (
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-2xl text-gray-400 hover:bg-gray-50">
              +<span className="sr-only">Add photos</span>
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
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Export width"
          value={outW}
          onChange={setOutW}
          options={[
            { value: '1080', label: '1080 px (social media)' },
            { value: '2048', label: '2048 px' },
            { value: '4096', label: '4096 px (print)' },
          ]}
        />
        <button type="button" className={btnPrimary} onClick={download}>
          ⬇ Download collage
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            photos.forEach((p) => p.bitmap.close());
            setPhotos([]);
          }}
        >
          Start over
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}

function Thumb({ bitmap }: { bitmap: ImageBitmap }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    c.width = 64;
    c.height = 64;
    drawCover(ctx, bitmap, 0, 0, 64, 64);
  }, [bitmap]);
  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
