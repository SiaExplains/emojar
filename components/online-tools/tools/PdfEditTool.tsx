'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import { loadPdf } from '@/lib/online-tools/pdf/core';
import {
  LINE_HEIGHT,
  applyEdits,
  type EditItem,
  type FontFamily,
} from '@/lib/online-tools/pdf/edit';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  Notice,
  NumberField,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  friendlyError,
  inputBase,
} from '../ui';
import {
  PDF_ACCEPT,
  PageNav,
  pdfBlob,
  usePagePreview,
  usePdfFile,
} from './pdf-shared';

type Item = EditItem & { id: number; url?: string };
type ToolMode = 'select' | 'text' | 'whiteout' | 'highlight' | 'rect';
type Drag =
  | { kind: 'move'; id: number; x: number; y: number; ox: number; oy: number }
  | {
      kind: 'resize';
      id: number;
      x: number;
      y: number;
      ow: number;
      oh: number;
      aspect?: number;
    }
  | { kind: 'draw'; x0: number; y0: number; id: number };

const CSS_FONT: Record<FontFamily, string> = {
  helvetica: 'Helvetica, Arial, sans-serif',
  times: '"Times New Roman", Times, serif',
  courier: '"Courier New", Courier, monospace',
};

const RECT_STYLE: Record<
  'whiteout' | 'highlight' | 'rect',
  { color: string; opacity: number }
> = {
  whiteout: { color: '#ffffff', opacity: 1 },
  highlight: { color: '#facc15', opacity: 0.35 },
  rect: { color: '#000000', opacity: 1 },
};

let nextId = 1;

export default function PdfEditTool(_: ToolProps) {
  const { file, buffer, total, error, setError, load, clear } = usePdfFile();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<ToolMode>('text');
  const [selected, setSelected] = useState<number | null>(null);
  const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [boxW, setBoxW] = useState(600);
  const { preview, failed } = usePagePreview(buffer, page, 900);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    if (!buffer) return;
    let cancelled = false;
    setItems([]);
    setPage(0);
    setResults([]);
    loadPdf(buffer)
      .then((doc) => {
        if (cancelled) return;
        setSizes(
          doc.getPages().map((p) => {
            const b = p.getCropBox();
            return p.getRotation().angle % 180
              ? { w: b.height, h: b.width }
              : { w: b.width, h: b.height };
          }),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [buffer]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [preview]);

  const size = sizes[page] ?? { w: 595, h: 842 };
  const pxPerPt = boxW / size.w;
  const update = (id: number, patch: Partial<Item>) =>
    setItems((list) =>
      list.map((it) => (it.id === id ? ({ ...it, ...patch } as Item) : it)),
    );
  const sel = items.find((it) => it.id === selected) ?? null;

  const frac = (e: PointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };

  const onBackgroundDown = (e: PointerEvent<HTMLDivElement>) => {
    const p = frac(e);
    if (mode === 'select') return setSelected(null);
    if (mode === 'text') {
      const id = nextId++;
      setItems((list) => [
        ...list,
        {
          id,
          kind: 'text',
          page,
          x: p.x,
          y: p.y,
          text: 'Text',
          size: 12,
          font: 'helvetica',
          bold: false,
          color: '#000000',
        },
      ]);
      setSelected(id);
      setMode('select');
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    const id = nextId++;
    const style = RECT_STYLE[mode];
    setItems((list) => [
      ...list,
      { id, kind: 'rect', page, x: p.x, y: p.y, w: 0, h: 0, ...style },
    ]);
    setSelected(id);
    drag.current = { kind: 'draw', x0: p.x, y0: p.y, id };
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = frac(e);
    if (d.kind === 'draw') {
      update(d.id, {
        x: Math.min(d.x0, p.x),
        y: Math.min(d.y0, p.y),
        w: Math.abs(p.x - d.x0),
        h: Math.abs(p.y - d.y0),
      });
    } else if (d.kind === 'move') {
      const r = boxRef.current!.getBoundingClientRect();
      update(d.id, {
        x: Math.min(0.98, Math.max(0, d.ox + (e.clientX - d.x) / r.width)),
        y: Math.min(0.98, Math.max(0, d.oy + (e.clientY - d.y) / r.height)),
      });
    } else {
      const r = boxRef.current!.getBoundingClientRect();
      const w = Math.max(0.01, d.ow + (e.clientX - d.x) / r.width);
      const h = d.aspect
        ? (w * d.aspect * r.width) / r.height
        : Math.max(0.01, d.oh + (e.clientY - d.y) / r.height);
      update(d.id, { w, h });
    }
  };

  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.kind === 'draw') {
      // Drop accidental clicks that drew nothing.
      setItems((list) =>
        list.filter(
          (it) =>
            !(
              it.id === d.id &&
              it.kind === 'rect' &&
              (it.w < 0.005 || it.h < 0.005)
            ),
        ),
      );
      setMode('select');
    }
  };

  const startMove = (it: Item) => (e: PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    boxRef.current?.setPointerCapture(e.pointerId);
    setSelected(it.id);
    drag.current = {
      kind: 'move',
      id: it.id,
      x: e.clientX,
      y: e.clientY,
      ox: it.x,
      oy: it.y,
    };
  };
  const startResize = (it: Item) => (e: PointerEvent<HTMLElement>) => {
    if (it.kind === 'text') return;
    e.stopPropagation();
    boxRef.current?.setPointerCapture(e.pointerId);
    const r = boxRef.current!.getBoundingClientRect();
    drag.current = {
      kind: 'resize',
      id: it.id,
      x: e.clientX,
      y: e.clientY,
      ow: it.w,
      oh: it.h,
      aspect:
        it.kind === 'image' ? (it.h * r.height) / (it.w * r.width) : undefined,
    };
  };

  const addImage = async (f: File) => {
    const type = /png/i.test(f.type)
      ? 'png'
      : /jpe?g/i.test(f.type)
        ? 'jpg'
        : null;
    let bytes: Uint8Array;
    let format: 'png' | 'jpg' = 'png';
    let w: number;
    let h: number;
    try {
      const bmp = await createImageBitmap(f);
      w = bmp.width;
      h = bmp.height;
      if (type) {
        bytes = new Uint8Array(await f.arrayBuffer());
        format = type;
      } else {
        // Other formats (WebP, GIF…) are converted to PNG for the PDF.
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d')!.drawImage(bmp, 0, 0);
        const blob = await new Promise<Blob | null>((r) =>
          c.toBlob(r, 'image/png'),
        );
        if (!blob) throw new Error('encode');
        bytes = new Uint8Array(await blob.arrayBuffer());
      }
      bmp.close();
    } catch {
      setError('This image could not be read. Use a PNG or JPG.');
      return;
    }
    const wFrac = 0.3;
    const hFrac = (wFrac * (h / w) * size.w) / size.h;
    const id = nextId++;
    const url = URL.createObjectURL(
      new Blob([bytes as BlobPart], {
        type: format === 'png' ? 'image/png' : 'image/jpeg',
      }),
    );
    setItems((list) => [
      ...list,
      {
        id,
        kind: 'image',
        page,
        x: 0.35,
        y: 0.35,
        w: wFrac,
        h: Math.min(0.9, hFrac),
        bytes,
        format,
        url,
      },
    ]);
    setSelected(id);
    setMode('select');
  };

  const run = async () => {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const bytes = await applyEdits(buffer, items);
      setResults([
        {
          name: outputName(file.name, 'pdf', '-edited'),
          blob: pdfBlob(bytes),
          note: `${items.length} edit${items.length === 1 ? '' : 's'}`,
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be saved.'));
    } finally {
      setBusy(false);
    }
  };

  if (!file || !buffer)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept={PDF_ACCEPT}
          onFiles={(f) => load(f[0])}
          label="Choose a PDF or drop it here"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const pageItems = items.filter((it) => it.page === page);
  const pct = (v: number) => `${v * 100}%`;
  const tools: [ToolMode, string][] = [
    ['select', '↖ Select'],
    ['text', 'T Add text'],
    ['whiteout', '▭ White-out'],
    ['highlight', '🖍 Highlight'],
    ['rect', '■ Box'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="toolbar"
          aria-label="Edit tools"
          className="flex flex-wrap gap-1 rounded-xl border border-gray-200 p-1"
        >
          {tools.map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {label}
            </button>
          ))}
          <label className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            🖼 Add image
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) =>
                e.target.files?.[0] && addImage(e.target.files[0])
              }
            />
          </label>
        </div>
        <PageNav
          page={page}
          total={total}
          onChange={(p) => (setPage(p), setSelected(null))}
        />
      </div>
      <p className="text-xs text-gray-500">
        {mode === 'text'
          ? 'Click on the page where the text should start.'
          : mode === 'select'
            ? 'Drag items to move them; drag the corner handle to resize boxes and images.'
            : 'Drag on the page to draw the box.'}
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="mx-auto w-full max-w-[700px]">
          {preview ? (
            <div
              ref={boxRef}
              className={`relative touch-none select-none ${mode === 'select' ? '' : 'cursor-crosshair'}`}
              onPointerDown={onBackgroundDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <img
                src={preview.url}
                alt={`Page ${page + 1}`}
                draggable={false}
                className="block w-full rounded border border-gray-200 shadow-sm"
              />
              {pageItems.map((it) => {
                const active = it.id === selected;
                const ring = active
                  ? 'outline outline-2 outline-brand-600'
                  : 'hover:outline hover:outline-1 hover:outline-brand-300';
                if (it.kind === 'text')
                  return (
                    <div
                      key={it.id}
                      onPointerDown={startMove(it)}
                      className={`absolute cursor-move whitespace-pre ${ring}`}
                      style={{
                        left: pct(it.x),
                        top: pct(it.y),
                        fontFamily: CSS_FONT[it.font],
                        fontWeight: it.bold ? 700 : 400,
                        fontSize: it.size * pxPerPt,
                        lineHeight: LINE_HEIGHT,
                        color: it.color,
                      }}
                    >
                      {it.text || ' '}
                    </div>
                  );
                return (
                  <div
                    key={it.id}
                    onPointerDown={startMove(it)}
                    className={`absolute cursor-move ${ring}`}
                    style={{
                      left: pct(it.x),
                      top: pct(it.y),
                      width: pct(it.w),
                      height: pct(it.h),
                      ...(it.kind === 'rect'
                        ? {
                            background: it.color,
                            opacity: it.opacity,
                            boxShadow:
                              it.color === '#ffffff'
                                ? 'inset 0 0 0 1px #d1d5db'
                                : undefined,
                          }
                        : {}),
                    }}
                  >
                    {it.kind === 'image' && it.url && (
                      <img
                        src={it.url}
                        alt=""
                        draggable={false}
                        className="h-full w-full"
                      />
                    )}
                    {active && (
                      <span
                        onPointerDown={startResize(it)}
                        aria-hidden
                        className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-brand-600 bg-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded border border-gray-200 text-sm text-gray-400">
              {failed ? 'This page could not be displayed.' : 'Loading page…'}
            </div>
          )}
        </div>

        <aside className="space-y-4" aria-label="Selected item">
          {!sel ? (
            <p className="text-sm text-gray-500">
              Select an item to change it.{' '}
              {items.length > 0 &&
                `${items.length} edit${items.length === 1 ? '' : 's'} so far.`}
            </p>
          ) : sel.kind === 'text' ? (
            <>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Text</span>
                <textarea
                  rows={3}
                  value={sel.text}
                  onChange={(e) => update(sel.id, { text: e.target.value })}
                  className={inputBase}
                  autoFocus
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Font"
                  value={sel.font}
                  onChange={(v) => update(sel.id, { font: v as FontFamily })}
                  options={[
                    { value: 'helvetica', label: 'Helvetica' },
                    { value: 'times', label: 'Times' },
                    { value: 'courier', label: 'Courier' },
                  ]}
                />
                <NumberField
                  label="Size (pt)"
                  value={sel.size}
                  onChange={(v) =>
                    update(sel.id, {
                      size: Math.min(200, Math.max(4, Number(v) || 12)),
                    })
                  }
                  min={4}
                  max={200}
                />
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  label="Bold"
                  checked={sel.bold}
                  onChange={(v) => update(sel.id, { bold: v })}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  Colour
                  <input
                    type="color"
                    value={sel.color}
                    onChange={(e) => update(sel.id, { color: e.target.value })}
                    className="h-8 w-14 cursor-pointer rounded border border-gray-200"
                  />
                </label>
              </div>
            </>
          ) : sel.kind === 'rect' ? (
            <>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                Colour
                <input
                  type="color"
                  value={sel.color}
                  onChange={(e) => update(sel.id, { color: e.target.value })}
                  className="h-8 w-14 cursor-pointer rounded border border-gray-200"
                />
              </label>
              <RangeField
                label="Opacity"
                value={sel.opacity}
                onChange={(v) => update(sel.id, { opacity: v })}
                min={0.1}
                max={1}
                step={0.05}
                display={`${Math.round(sel.opacity * 100)}%`}
              />
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Image — drag to move, use the corner handle to resize.
            </p>
          )}
          {sel && (
            <button
              type="button"
              className={`${btnSecondary} !text-red-700`}
              onClick={() => {
                setItems((list) => list.filter((it) => it.id !== sel.id));
                setSelected(null);
              }}
            >
              Delete item
            </button>
          )}
        </aside>
      </div>

      <Notice>
        Edits are added on top of the page. A white-out box hides text visually,
        but the original text is still in the file and can be copied — to remove
        it for good, convert it to images with PDF to JPG and turn those back
        into a PDF with the Image Converter. Text uses the standard PDF fonts,
        which cover Latin letters only.
      </Notice>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={run}
          disabled={busy || !items.length}
        >
          {busy ? 'Saving…' : 'Save PDF'}
        </button>
        <button type="button" className={btnSecondary} onClick={clear}>
          Choose another PDF
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
