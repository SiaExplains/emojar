'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import { canvasToBlob, decodeImage } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  RangeField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
} from '../ui';

type Caption = {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

const FONT = 'Impact, "Anton", "Arial Black", "Helvetica Neue", sans-serif';
const MAX_SIDE = 2000;
let nextId = 3;

/** Splits text into lines that fit `maxWidth`. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

export default function MemeGeneratorTool(_: ToolProps) {
  const [image, setImage] = useState<ImageBitmap | null>(null);
  const [name, setName] = useState('meme');
  const [captions, setCaptions] = useState<Caption[]>([
    { id: 1, text: 'TOP TEXT', x: 0.5, y: 0.08, size: 10, color: '#ffffff' },
    { id: 2, text: 'BOTTOM TEXT', x: 0.5, y: 0.9, size: 10, color: '#ffffff' },
  ]);
  const [uppercase, setUppercase] = useState(true);
  const [outline, setOutline] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<{ id: number; dx: number; dy: number } | null>(null);

  const load = async (file: File) => {
    setError('');
    try {
      const bmp = await decodeImage(file);
      setImage(bmp);
      setName(file.name);
    } catch {
      setError('This file could not be read as an image.');
    }
  };

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = Array.from(e.clipboardData?.files ?? []).find((x) =>
        x.type.startsWith('image/'),
      );
      if (f) void load(f);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const f = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
    canvas.width = Math.round(image.width * f);
    canvas.height = Math.round(image.height * f);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const c of captions) {
      const size = (c.size / 100) * canvas.width;
      ctx.font = `bold ${size}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size / 7;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = c.color;
      const lines = wrap(
        ctx,
        uppercase ? c.text.toUpperCase() : c.text,
        canvas.width * 0.92,
      );
      const lh = size * 1.08;
      const top = c.y * canvas.height - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => {
        const y = top + i * lh;
        if (outline) ctx.strokeText(line, c.x * canvas.width, y);
        ctx.fillText(line, c.x * canvas.width, y);
      });
    }
  }, [image, captions, uppercase, outline]);

  useEffect(draw, [draw]);

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = point(e);
    // Pick the caption whose centre is closest (within 15% of the image).
    const hit = [...captions]
      .map((c) => ({ c, d: Math.hypot(c.x - p.x, c.y - p.y) }))
      .sort((a, b) => a.d - b.d)[0];
    if (hit && hit.d < 0.15) {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { id: hit.c.id, dx: hit.c.x - p.x, dy: hit.c.y - p.y };
    }
  };
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const p = point(e);
    const { id, dx, dy } = drag.current;
    setCaptions((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              x: Math.min(1, Math.max(0, p.x + dx)),
              y: Math.min(1, Math.max(0, p.y + dy)),
            }
          : c,
      ),
    );
  };

  const update = (id: number, patch: Partial<Caption>) =>
    setCaptions((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, 'png');
    downloadBlob(blob, outputName(name, 'png', '-meme'));
  };

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept="image/*"
          onFiles={(f) => load(f[0])}
          label="Choose an image, or paste one (Ctrl/⌘ + V)"
          hint="Use an image you have the right to share"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-2">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => (drag.current = null)}
          className="h-auto w-full max-w-full cursor-move touch-none rounded-xl border border-gray-200"
          role="img"
          aria-label={`Meme preview: ${captions.map((c) => c.text).join(' / ')}`}
        />
        <p className="text-xs text-gray-500">
          Drag a caption on the image to move it.
        </p>
      </div>
      <div className="space-y-4">
        {captions.map((c, i) => (
          <div
            key={c.id}
            className="space-y-2 rounded-xl border border-gray-100 p-3"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor={`cap-${c.id}`}
                className="text-sm font-medium text-gray-700"
              >
                Caption {i + 1}
              </label>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-800"
                onClick={() =>
                  setCaptions((cs) => cs.filter((x) => x.id !== c.id))
                }
                aria-label={`Remove caption ${i + 1}`}
              >
                Remove
              </button>
            </div>
            <textarea
              id={`cap-${c.id}`}
              rows={2}
              value={c.text}
              onChange={(e) => update(c.id, { text: e.target.value })}
              className={inputBase}
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={c.color}
                onChange={(e) => update(c.id, { color: e.target.value })}
                aria-label={`Caption ${i + 1} colour`}
                className="h-8 w-10 rounded border border-gray-200"
              />
              <div className="flex-1">
                <RangeField
                  label="Size"
                  value={c.size}
                  onChange={(v) => update(c.id, { size: v })}
                  min={3}
                  max={20}
                  step={0.5}
                  display={`${c.size}%`}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() =>
            setCaptions((cs) => [
              ...cs,
              {
                id: nextId++,
                text: 'NEW TEXT',
                x: 0.5,
                y: 0.5,
                size: 8,
                color: '#ffffff',
              },
            ])
          }
        >
          + Add caption
        </button>
        <div className="flex flex-col gap-2">
          <Checkbox
            label="ALL CAPS"
            checked={uppercase}
            onChange={setUppercase}
          />
          <Checkbox
            label="Black outline"
            checked={outline}
            onChange={setOutline}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnPrimary} onClick={download}>
            ⬇ Download PNG
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setImage(null)}
          >
            New image
          </button>
        </div>
      </div>
    </div>
  );
}
