'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import { useStoredState } from './playground-shared';
import { makeCanvas } from './image-shared';
import {
  DEFAULT_PALETTE,
  GRID_SIZES,
  blank,
  floodFill,
  history,
  isHexColor,
  isPixels,
  linePoints,
  mirrorPoints,
  paint,
  redo,
  resizePixels,
  toRgba,
  toSvg,
  undo,
  wouldCrop,
  type History,
  type Pixels,
} from '@/lib/online-tools/engines/pixel-art';

type Tool = 'pencil' | 'eraser' | 'fill' | 'picker';
type Doc = { size: number; frames: Pixels[] };
type Saved = Doc & { v: 1; fps: number; recent: string[] };

const STORE_KEY = 'emojar:pixel-art:v1';
const MAX_FRAMES = 64;
const DEFAULT_DOC: Saved = {
  v: 1,
  size: 16,
  frames: [blank(16)],
  fps: 6,
  recent: [],
};

const isSaved = (v: unknown): v is Saved => {
  if (!v || typeof v !== 'object') return false;
  const s = v as Partial<Saved>;
  return (
    s.v === 1 &&
    typeof s.size === 'number' &&
    (GRID_SIZES as readonly number[]).includes(s.size) &&
    Array.isArray(s.frames) &&
    s.frames.length >= 1 &&
    s.frames.length <= MAX_FRAMES &&
    s.frames.every((f) => isPixels(f, s.size as number)) &&
    typeof s.fps === 'number' &&
    s.fps >= 1 &&
    s.fps <= 24 &&
    Array.isArray(s.recent) &&
    s.recent.every((c) => typeof c === 'string' && isHexColor(c))
  );
};

const TOOLS: { value: Tool; label: string; icon: string; key: string }[] = [
  { value: 'pencil', label: 'Pencil', icon: '✏️', key: 'P' },
  { value: 'eraser', label: 'Eraser', icon: '🧽', key: 'E' },
  { value: 'fill', label: 'Fill', icon: '🪣', key: 'F' },
  { value: 'picker', label: 'Eyedropper', icon: '💧', key: 'I' },
];

/** Draws one frame with a checkerboard behind transparent pixels. */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  px: Pixels,
  size: number,
  cell: number,
  opts: {
    onion?: Pixels | null;
    grid?: boolean;
    cursor?: { x: number; y: number } | null;
  } = {},
) {
  const dim = size * cell;
  ctx.clearRect(0, 0, dim, dim);
  const check = Math.max(2, cell / 2);
  for (let y = 0; y < dim; y += check)
    for (let x = 0; x < dim; x += check) {
      ctx.fillStyle = (x / check + y / check) % 2 ? '#e5e7eb' : '#ffffff';
      ctx.fillRect(x, y, check, check);
    }
  if (opts.onion) {
    ctx.globalAlpha = 0.3;
    opts.onion.forEach((c, i) => {
      if (!c) return;
      ctx.fillStyle = c;
      ctx.fillRect((i % size) * cell, Math.floor(i / size) * cell, cell, cell);
    });
    ctx.globalAlpha = 1;
  }
  px.forEach((c, i) => {
    if (!c) return;
    ctx.fillStyle = c;
    ctx.fillRect((i % size) * cell, Math.floor(i / size) * cell, cell, cell);
  });
  if (opts.grid && cell >= 4) {
    ctx.strokeStyle = 'rgba(17,24,39,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= size; i++) {
      const p = i * cell + 0.5;
      ctx.moveTo(p, 0);
      ctx.lineTo(p, dim);
      ctx.moveTo(0, p);
      ctx.lineTo(dim, p);
    }
    ctx.stroke();
  }
  if (opts.cursor) {
    const { x, y } = opts.cursor;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#4f46e5';
    ctx.strokeRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * cell + 3, y * cell + 3, cell - 6, cell - 6);
  }
}

function FrameThumb({ px, size }: { px: Pixels; size: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) drawFrame(ctx, px, size, Math.max(1, Math.floor(48 / size)));
  }, [px, size]);
  const dim = size * Math.max(1, Math.floor(48 / size));
  return (
    <canvas
      ref={ref}
      width={dim}
      height={dim}
      className="h-12 w-12"
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    />
  );
}

const canvasBlob = (c: HTMLCanvasElement) =>
  new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'));

export default function PixelArtTool(_: ToolProps) {
  const [saved, setSaved, ready] = useStoredState<Saved>(
    STORE_KEY,
    DEFAULT_DOC,
    isSaved,
  );
  const [hist, setHist] = useState<History<Doc>>(() =>
    history({ size: DEFAULT_DOC.size, frames: DEFAULT_DOC.frames }),
  );
  const loaded = useRef(false);
  const [cur, setCur] = useState(0);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#ed1c24');
  const [zoom, setZoom] = useState(24);
  const [grid, setGrid] = useState(true);
  const [mirror, setMirror] = useState({ h: false, v: false });
  const [onion, setOnion] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [previewFrame, setPreviewFrame] = useState(0);
  const [scale, setScale] = useState(8);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // Largest zoom (up to a 512px canvas) that fits the box, so phones can
  // draw without scrolling.
  const fitZoom = (n: number) => {
    const room = (wrapRef.current?.clientWidth ?? 528) - 16;
    return Math.max(4, Math.min(Math.floor(512 / n), Math.floor(room / n)));
  };
  const stroke = useRef<{
    id: number;
    base: Doc;
    last: [number, number];
  } | null>(null);

  // Load the saved drawing once storage has been read.
  useEffect(() => {
    if (!ready || loaded.current) return;
    loaded.current = true;
    setHist(history({ size: saved.size, frames: saved.frames }));
    setZoom(fitZoom(saved.size));
  }, [ready, saved]);

  const doc = hist.present;
  const { size, frames } = doc;
  const frameIdx = Math.min(cur, frames.length - 1);
  const px = frames[frameIdx];
  const fps = saved.fps;
  const recent = saved.recent;

  // Autosave the drawing (not the undo history).
  useEffect(() => {
    if (!loaded.current) return;
    setSaved((s) =>
      s.size === doc.size && s.frames === doc.frames
        ? s
        : { ...s, size: doc.size, frames: doc.frames },
    );
  }, [doc, setSaved]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawFrame(ctx, px, size, zoom, {
      grid,
      cursor,
      onion: onion && frameIdx > 0 ? frames[frameIdx - 1] : null,
    });
  }, [px, size, zoom, grid, cursor, onion, frames, frameIdx]);

  const commitDoc = useCallback((next: Doc, msg?: string) => {
    setHist((h) =>
      next === h.present
        ? h
        : {
            past: [...h.past, h.present].slice(-100),
            present: next,
            future: [],
          },
    );
    if (msg) setStatus(msg);
  }, []);

  const withFrame = (d: Doc, i: number, f: Pixels): Doc =>
    f === d.frames[i]
      ? d
      : { ...d, frames: d.frames.map((x, j) => (j === i ? f : x)) };

  const rememberColor = (c: string) =>
    setSaved((s) => ({
      ...s,
      recent: [c, ...s.recent.filter((x) => x !== c)].slice(0, 10),
    }));

  /** Applies the current tool at a cell; returns the new frame. */
  const applyAt = (f: Pixels, x: number, y: number): Pixels => {
    const pts = mirrorPoints(x, y, size, mirror);
    if (tool === 'fill')
      return pts.reduce((acc, [a, b]) => floodFill(acc, size, a, b, color), f);
    return paint(f, size, pts, tool === 'eraser' ? '' : color);
  };

  const pick = (x: number, y: number) => {
    const c = px[y * size + x];
    if (c) {
      setColor(c);
      setTool('pencil');
      setStatus(`Picked ${c}. Switched to the pencil.`);
    } else setStatus('That pixel is transparent.');
  };

  const cellAt = (e: PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * size);
    const y = Math.floor(((e.clientY - r.top) / r.height) * size);
    return [
      Math.min(size - 1, Math.max(0, x)),
      Math.min(size - 1, Math.max(0, y)),
    ];
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    const [x, y] = cellAt(e);
    setCursor(null);
    if (tool === 'picker') return pick(x, y);
    const next = withFrame(doc, frameIdx, applyAt(px, x, y));
    if (tool === 'fill') return commitDoc(next);
    if (tool !== 'eraser') rememberColor(color);
    e.currentTarget.setPointerCapture(e.pointerId);
    stroke.current = { id: e.pointerId, base: doc, last: [x, y] };
    setHist((h) => ({ ...h, present: next }));
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = stroke.current;
    if (!s || s.id !== e.pointerId) return;
    const [x, y] = cellAt(e);
    if (x === s.last[0] && y === s.last[1]) return;
    // Fill in the cells between pointer events so fast strokes stay solid.
    const line = linePoints(s.last[0], s.last[1], x, y);
    s.last = [x, y];
    setHist((h) => {
      const f0 = h.present.frames[frameIdx];
      const cells = line.flatMap(([a, b]) => mirrorPoints(a, b, size, mirror));
      const f = paint(f0, size, cells, tool === 'eraser' ? '' : color);
      return { ...h, present: withFrame(h.present, frameIdx, f) };
    });
  };

  const onUp = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = stroke.current;
    if (!s || s.id !== e.pointerId) return;
    stroke.current = null;
    // One undo step per stroke.
    setHist((h) =>
      h.present === s.base
        ? h
        : {
            past: [...h.past, s.base].slice(-100),
            present: h.present,
            future: [],
          },
    );
  };

  const onCanvasKey = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const c = cursor ?? { x: Math.floor(size / 2), y: Math.floor(size / 2) };
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const m = moves[e.key];
    if (m) {
      e.preventDefault();
      const next = {
        x: Math.min(size - 1, Math.max(0, c.x + m[0])),
        y: Math.min(size - 1, Math.max(0, c.y + m[1])),
      };
      setCursor(next);
      const v = px[next.y * size + next.x];
      setStatus(
        `Cursor at column ${next.x + 1}, row ${next.y + 1}: ${v || 'transparent'}.`,
      );
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setCursor(c);
      if (tool === 'picker') return pick(c.x, c.y);
      if (tool === 'pencil' || tool === 'fill') rememberColor(color);
      commitDoc(
        withFrame(doc, frameIdx, applyAt(px, c.x, c.y)),
        `${TOOLS.find((t) => t.value === tool)?.label} at column ${c.x + 1}, row ${c.y + 1}.`,
      );
    }
  };

  const doUndo = useCallback(() => setHist((h) => undo(h)), []);
  const doRedo = useCallback(() => setHist((h) => redo(h)), []);

  // Undo/redo and tool shortcuts, except while typing in a field.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === 'z') {
        e.preventDefault();
        if (e.shiftKey) doRedo();
        else doUndo();
      } else if (mod && k === 'y') {
        e.preventDefault();
        doRedo();
      } else if (!mod && !e.altKey) {
        const tl = TOOLS.find((x) => x.key.toLowerCase() === k);
        if (tl) setTool(tl.value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doUndo, doRedo]);

  const changeSize = (to: number) => {
    if (to === size) return;
    if (
      frames.some((f) => wouldCrop(f, size, to)) &&
      !window.confirm(
        `Shrinking to ${to}×${to} will cut off pixels outside the top-left ${to}×${to} area. Continue?`,
      )
    )
      return;
    commitDoc(
      { size: to, frames: frames.map((f) => resizePixels(f, size, to)) },
      `Grid is now ${to}×${to}.`,
    );
    setCursor(null);
    setZoom(fitZoom(to));
  };

  // ── Frames ──
  const addFrame = (copy: boolean) => {
    if (frames.length >= MAX_FRAMES) return;
    const f = copy ? px.slice() : blank(size);
    const next = [
      ...frames.slice(0, frameIdx + 1),
      f,
      ...frames.slice(frameIdx + 1),
    ];
    commitDoc(
      { size, frames: next },
      copy ? 'Frame duplicated.' : 'Frame added.',
    );
    setCur(frameIdx + 1);
  };
  const deleteFrame = () => {
    if (frames.length <= 1) return;
    commitDoc(
      { size, frames: frames.filter((_, i) => i !== frameIdx) },
      `Deleted frame ${frameIdx + 1}.`,
    );
    setCur(Math.max(0, frameIdx - 1));
  };
  const moveFrame = (d: -1 | 1) => {
    const j = frameIdx + d;
    if (j < 0 || j >= frames.length) return;
    const next = frames.slice();
    [next[frameIdx], next[j]] = [next[j], next[frameIdx]];
    commitDoc({ size, frames: next }, `Moved frame to position ${j + 1}.`);
    setCur(j);
  };

  // Animation preview.
  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const id = window.setInterval(
      () => setPreviewFrame((f) => (f + 1) % frames.length),
      1000 / fps,
    );
    return () => window.clearInterval(id);
  }, [playing, fps, frames.length]);
  useEffect(() => {
    const ctx = previewRef.current?.getContext('2d');
    if (!ctx) return;
    const f = frames[previewFrame % frames.length];
    drawFrame(ctx, f, size, Math.max(1, Math.floor(128 / size)));
  }, [previewFrame, frames, size, playing]);

  // ── Export ──
  const base = 'pixel-art';
  const exportPng = async (sheet: boolean) => {
    setError('');
    try {
      const list = sheet ? frames : [px];
      const cols = Math.min(list.length, 8);
      const rows = Math.ceil(list.length / cols);
      const fw = size * scale;
      if (fw * cols > 16384)
        throw new Error('Too wide — choose a smaller scale.');
      const [canvas, ctx] = makeCanvas(fw * cols, fw * rows);
      list.forEach((f, i) => {
        const data = toRgba(f, size, scale);
        const img = new ImageData(fw, fw);
        img.data.set(data);
        ctx.putImageData(img, (i % cols) * fw, Math.floor(i / cols) * fw);
      });
      const blob = await canvasBlob(canvas);
      if (!blob) throw new Error('png');
      downloadBlob(
        blob,
        sheet
          ? `${base}-sheet-${list.length}x${fw}px.png`
          : `${base}-${fw}px.png`,
      );
    } catch (e) {
      setError(
        e instanceof Error && e.message.startsWith('Too')
          ? e.message
          : 'The PNG could not be created.',
      );
    }
  };

  const exportSvg = () =>
    downloadBlob(toSvg(px, size, scale), `${base}.svg`, 'image/svg+xml');

  const exportGif = async () => {
    setBusy(true);
    setError('');
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
      const fw = size * scale;
      const gif = GIFEncoder();
      const delay = Math.round(1000 / fps);
      // Exact palette when the art has ≤255 colours (it nearly always does);
      // index 0 is reserved for transparency.
      const unique = new Map<string, number>();
      for (const f of frames)
        for (const c of f)
          if (c && !unique.has(c) && unique.size < 256)
            unique.set(c, unique.size + 1);
      const exact = unique.size <= 255;
      const globalPalette: number[][] = [[0, 0, 0]];
      if (exact)
        for (const c of unique.keys()) {
          const n = parseInt(c.slice(1), 16);
          globalPalette.push([(n >> 16) & 255, (n >> 8) & 255, n & 255]);
        }
      const lookup = new Map<number, number>();
      if (exact)
        for (const [c, i] of unique) lookup.set(parseInt(c.slice(1), 16), i);

      for (const f of frames) {
        const rgba = toRgba(f, size, scale);
        const index = new Uint8Array(fw * fw);
        let palette = globalPalette;
        if (exact) {
          for (let p = 0; p < index.length; p++) {
            const o = p * 4;
            if (rgba[o + 3] < 128) continue;
            index[p] =
              lookup.get((rgba[o] << 16) | (rgba[o + 1] << 8) | rgba[o + 2]) ??
              0;
          }
        } else {
          const q = quantize(rgba, 255);
          const mapped = applyPalette(rgba, q);
          palette = [[0, 0, 0], ...q];
          for (let p = 0; p < index.length; p++)
            index[p] = rgba[p * 4 + 3] < 128 ? 0 : mapped[p] + 1;
        }
        gif.writeFrame(index, fw, fw, {
          palette,
          delay,
          repeat: 0,
          transparent: true,
          // Clear each frame so transparent areas don't show the last one.
          dispose: 2,
        });
        await new Promise((r) => setTimeout(r, 0));
      }
      gif.finish();
      downloadBlob(
        new Blob([gif.bytes() as BlobPart], { type: 'image/gif' }),
        `${base}-${frames.length}f.gif`,
      );
    } catch {
      setError('The GIF could not be created. Try a smaller scale.');
    } finally {
      setBusy(false);
    }
  };

  const clearFrame = () =>
    commitDoc(withFrame(doc, frameIdx, blank(size)), 'Frame cleared.');

  const toolBtn = (activeTool: boolean) =>
    `inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
      activeTool
        ? 'border-gray-900 bg-gray-900 text-white'
        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
    }`;

  const dim = size * zoom;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tools">
          {TOOLS.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={tool === t.value}
              onClick={() => setTool(t.value)}
              className={toolBtn(tool === t.value)}
              title={`${t.label} (${t.key})`}
            >
              <span aria-hidden>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={btnSecondary}
          onClick={doUndo}
          disabled={!hist.past.length}
          title="Undo (Ctrl/Cmd+Z)"
        >
          ↶ Undo
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={doRedo}
          disabled={!hist.future.length}
          title="Redo (Shift+Ctrl/Cmd+Z or Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0 space-y-2">
          <div
            ref={wrapRef}
            className="max-h-[75vh] overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-2"
          >
            <canvas
              ref={canvasRef}
              width={dim}
              height={dim}
              tabIndex={0}
              aria-label={`Pixel canvas, ${size} by ${size}. Arrow keys move the cursor; Space or Enter uses the ${tool}.`}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={onCanvasKey}
              onBlur={() => setCursor(null)}
              className="mx-auto block cursor-crosshair focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              style={{ width: dim, height: dim, touchAction: 'none' }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Draw with the mouse or a finger. Keyboard: focus the canvas, move
            the cursor with the arrow keys and press Space or Enter. Shortcuts:
            P pencil, E eraser, F fill, I eyedropper, Ctrl/Cmd+Z undo.
          </p>
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
        </div>

        <div className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Colour</h2>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
              <span className="font-mono">{color}</span>
            </label>
            <Swatches
              label="Palette"
              colors={DEFAULT_PALETTE}
              current={color}
              onPick={setColor}
            />
            {recent.length > 0 && (
              <Swatches
                label="Recent colours"
                colors={recent}
                current={color}
                onPick={setColor}
              />
            )}
          </section>
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <SelectField
              label="Grid size"
              value={String(size)}
              onChange={(v) => changeSize(Number(v))}
              options={GRID_SIZES.map((n) => ({
                value: String(n),
                label: `${n} × ${n}`,
              }))}
            />
            <RangeField
              label="Zoom"
              value={zoom}
              min={4}
              max={48}
              onChange={setZoom}
              display={`${zoom}px per pixel`}
            />
            <div className="flex flex-col gap-2">
              <Checkbox label="Show grid" checked={grid} onChange={setGrid} />
              <Checkbox
                label="Horizontal mirror (left ↔ right)"
                checked={mirror.h}
                onChange={(h) => setMirror((m) => ({ ...m, h }))}
              />
              <Checkbox
                label="Vertical mirror (top ↔ bottom)"
                checked={mirror.v}
                onChange={(v) => setMirror((m) => ({ ...m, v }))}
              />
              <Checkbox
                label="Onion skin (show previous frame)"
                checked={onion}
                onChange={setOnion}
              />
            </div>
            <button type="button" className={btnSecondary} onClick={clearFrame}>
              Clear frame
            </button>
          </section>
        </div>
      </div>

      <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Frames ({frameIdx + 1} of {frames.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => addFrame(false)}
              disabled={frames.length >= MAX_FRAMES}
            >
              + New
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => addFrame(true)}
              disabled={frames.length >= MAX_FRAMES}
            >
              Duplicate
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => moveFrame(-1)}
              disabled={frameIdx === 0}
              aria-label="Move frame earlier"
            >
              ←
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => moveFrame(1)}
              disabled={frameIdx === frames.length - 1}
              aria-label="Move frame later"
            >
              →
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={deleteFrame}
              disabled={frames.length <= 1}
            >
              Delete
            </button>
          </div>
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Choose a frame"
        >
          {frames.map((f, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === frameIdx}
              aria-label={`Frame ${i + 1}`}
              onClick={() => setCur(i)}
              className={`shrink-0 rounded-lg border-2 p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                i === frameIdx ? 'border-brand-600' : 'border-gray-200'
              }`}
            >
              <FrameThumb px={f} size={size} />
              <span className="block text-center text-xs text-gray-600">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
        {frames.length > 1 && (
          <div className="flex flex-wrap items-end gap-4">
            <canvas
              ref={previewRef}
              width={size * Math.max(1, Math.floor(128 / size))}
              height={size * Math.max(1, Math.floor(128 / size))}
              className="h-32 w-32 rounded-lg border border-gray-200"
              style={{ imageRendering: 'pixelated' }}
              role="img"
              aria-label="Animation preview"
            />
            <div className="min-w-[12rem] flex-1 space-y-2">
              <RangeField
                label="Frames per second"
                value={fps}
                min={1}
                max={24}
                onChange={(v) => setSaved((s) => ({ ...s, fps: v }))}
                display={`${fps} fps`}
              />
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? '❚❚ Pause preview' : '▶ Play preview'}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-900">Export</h2>
        <div className="flex flex-wrap items-end gap-3">
          <SelectField
            label="Scale"
            value={String(scale)}
            onChange={(v) => setScale(Number(v))}
            options={[1, 2, 4, 8, 16, 32].map((n) => ({
              value: String(n),
              label: `${n}× (${size * n}px)`,
            }))}
            className="w-40"
          />
          <button
            type="button"
            className={btnPrimary}
            onClick={() => exportPng(false)}
          >
            ⬇ PNG
          </button>
          <button type="button" className={btnSecondary} onClick={exportSvg}>
            ⬇ SVG
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => exportPng(true)}
          >
            ⬇ Sprite sheet
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={exportGif}
            disabled={busy}
          >
            {busy ? 'Making GIF…' : '⬇ Animated GIF'}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          PNG, SVG and GIF keep a transparent background. PNG and SVG export the
          current frame; the sprite sheet and GIF include every frame (up to 8
          per row in the sheet). Your drawing is saved in this browser
          automatically.
        </p>
        <ErrorMessage>{error}</ErrorMessage>
      </section>
    </div>
  );
}

function Swatches({
  label,
  colors,
  current,
  onPick,
}: {
  label: string;
  colors: string[];
  current: string;
  onPick: (c: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <div className="flex flex-wrap gap-1" role="group" aria-label={label}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            aria-pressed={current === c}
            title={c}
            onClick={() => onPick(c)}
            className={`h-7 w-7 rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              current === c
                ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                : 'border-gray-300'
            }`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}
