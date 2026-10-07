'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import { loadPdf, parsePageRanges } from '@/lib/online-tools/pdf/core';
import { cropPdf, type Insets } from '@/lib/online-tools/pdf/edit';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  NumberField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';
import {
  PDF_ACCEPT,
  PageNav,
  pdfBlob,
  usePagePreview,
  usePdfFile,
} from './pdf-shared';

type Edge = 'top' | 'right' | 'bottom' | 'left';
type Drag = { edges: Edge[]; x: number; y: number; start: Insets };

const ZERO: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
const MIN = 0.05; // the crop must keep at least 5 % of each side
const PT_TO_MM = 25.4 / 72;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/** Finds the non-white content area of a rendered page, with a little padding. */
async function detectContent(url: string): Promise<Insets | null> {
  // createImageBitmap (unlike img.decode) also resolves in background tabs.
  const img = await createImageBitmap(await (await fetch(url)).blob());
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  img.close();
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  if (x1 < 0) return null;
  const pad = 0.015;
  return {
    left: clamp(x0 / width - pad, 0, 0.9),
    top: clamp(y0 / height - pad, 0, 0.9),
    right: clamp(1 - (x1 + 1) / width - pad, 0, 0.9),
    bottom: clamp(1 - (y1 + 1) / height - pad, 0, 0.9),
  };
}

export default function PdfCropTool(_: ToolProps) {
  const { file, buffer, total, error, setError, load, clear } = usePdfFile();
  const [page, setPage] = useState(0);
  const [insets, setInsets] = useState<Insets>(ZERO);
  const [scope, setScope] = useState('all');
  const [custom, setCustom] = useState('');
  const [sizes, setSizes] = useState<{ w: number; h: number }[]>([]);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [busy, setBusy] = useState(false);
  const { preview, failed } = usePagePreview(buffer, page);
  const drag = useRef<Drag | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Visible page sizes in points (rotation applied), for the mm fields.
  useEffect(() => {
    if (!buffer) return;
    let cancelled = false;
    loadPdf(buffer)
      .then((doc) => {
        if (cancelled) return;
        setSizes(
          doc.getPages().map((p) => {
            const b = p.getCropBox();
            const rot = p.getRotation().angle % 180 !== 0;
            return rot
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
    setPage(0);
    setInsets(ZERO);
    setResults([]);
  }, [buffer]);

  const size = sizes[page] ?? { w: 595, h: 842 };

  const onDown = (edges: Edge[]) => (e: PointerEvent<HTMLElement>) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { edges, x: e.clientX, y: e.clientY, start: insets };
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const box = boxRef.current?.getBoundingClientRect();
    if (!d || !box) return;
    const dx = (e.clientX - d.x) / box.width;
    const dy = (e.clientY - d.y) / box.height;
    const s = d.start;
    const next = { ...s };
    const moveAll = d.edges.length === 4;
    if (moveAll) {
      const mx = clamp(dx, -s.left, s.right);
      const my = clamp(dy, -s.top, s.bottom);
      next.left = s.left + mx;
      next.right = s.right - mx;
      next.top = s.top + my;
      next.bottom = s.bottom - my;
    } else {
      if (d.edges.includes('left'))
        next.left = clamp(s.left + dx, 0, 1 - s.right - MIN);
      if (d.edges.includes('right'))
        next.right = clamp(s.right - dx, 0, 1 - s.left - MIN);
      if (d.edges.includes('top'))
        next.top = clamp(s.top + dy, 0, 1 - s.bottom - MIN);
      if (d.edges.includes('bottom'))
        next.bottom = clamp(s.bottom - dy, 0, 1 - s.top - MIN);
    }
    setInsets(next);
  };
  const onUp = () => {
    drag.current = null;
  };

  const mm = (edge: Edge) => {
    const dim = edge === 'left' || edge === 'right' ? size.w : size.h;
    return Math.round(insets[edge] * dim * PT_TO_MM * 10) / 10;
  };
  const setMm = (edge: Edge, v: string) => {
    const dim = edge === 'left' || edge === 'right' ? size.w : size.h;
    const frac = clamp((Number(v) || 0) / PT_TO_MM / dim, 0, 0.9);
    setInsets((cur) => ({ ...cur, [edge]: frac }));
  };

  const run = async () => {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const pages =
        scope === 'current'
          ? [page]
          : scope === 'custom'
            ? parsePageRanges(custom, total)
            : parsePageRanges(scope, total);
      const bytes = await cropPdf(buffer, insets, pages);
      setResults([
        {
          name: outputName(file.name, 'pdf', '-cropped'),
          blob: pdfBlob(bytes),
          note: `${pages.length} page${pages.length === 1 ? '' : 's'} cropped`,
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be cropped.'));
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

  const pct = (v: number) => `${v * 100}%`;
  const handles: { edges: Edge[]; cls: string; label: string }[] = [
    {
      edges: ['top', 'left'],
      cls: '-left-2 -top-2 cursor-nwse-resize',
      label: 'top-left corner',
    },
    {
      edges: ['top', 'right'],
      cls: '-right-2 -top-2 cursor-nesw-resize',
      label: 'top-right corner',
    },
    {
      edges: ['bottom', 'left'],
      cls: '-left-2 -bottom-2 cursor-nesw-resize',
      label: 'bottom-left corner',
    },
    {
      edges: ['bottom', 'right'],
      cls: '-right-2 -bottom-2 cursor-nwse-resize',
      label: 'bottom-right corner',
    },
    {
      edges: ['top'],
      cls: 'left-1/2 -top-2 -translate-x-1/2 cursor-ns-resize',
      label: 'top edge',
    },
    {
      edges: ['bottom'],
      cls: 'left-1/2 -bottom-2 -translate-x-1/2 cursor-ns-resize',
      label: 'bottom edge',
    },
    {
      edges: ['left'],
      cls: '-left-2 top-1/2 -translate-y-1/2 cursor-ew-resize',
      label: 'left edge',
    },
    {
      edges: ['right'],
      cls: '-right-2 top-1/2 -translate-y-1/2 cursor-ew-resize',
      label: 'right edge',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
        </p>
        <PageNav page={page} total={total} onChange={setPage} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="mx-auto w-full max-w-[560px]">
          {preview ? (
            <div
              ref={boxRef}
              className="relative touch-none select-none"
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <img
                src={preview.url}
                alt={`Page ${page + 1}`}
                className="block w-full rounded border border-gray-200 shadow-sm"
              />
              {/* Shade everything outside the crop area */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 bg-gray-900/45"
                style={{ height: pct(insets.top) }}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gray-900/45"
                style={{ height: pct(insets.bottom) }}
              />
              <div
                className="pointer-events-none absolute left-0 bg-gray-900/45"
                style={{
                  top: pct(insets.top),
                  bottom: pct(insets.bottom),
                  width: pct(insets.left),
                }}
              />
              <div
                className="pointer-events-none absolute right-0 bg-gray-900/45"
                style={{
                  top: pct(insets.top),
                  bottom: pct(insets.bottom),
                  width: pct(insets.right),
                }}
              />
              <div
                role="group"
                aria-label="Crop area — drag to move, drag the handles to resize"
                className="absolute cursor-move border-2 border-indigo-600"
                style={{
                  left: pct(insets.left),
                  right: pct(insets.right),
                  top: pct(insets.top),
                  bottom: pct(insets.bottom),
                }}
                onPointerDown={onDown(['top', 'right', 'bottom', 'left'])}
              >
                {handles.map((h) => (
                  <span
                    key={h.label}
                    aria-hidden
                    onPointerDown={onDown(h.edges)}
                    className={`absolute h-4 w-4 rounded-sm border-2 border-indigo-600 bg-white ${h.cls}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded border border-gray-200 text-sm text-gray-400">
              {failed ? 'This page could not be displayed.' : 'Loading page…'}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <fieldset className="grid grid-cols-2 gap-3">
            <legend className="mb-2 text-sm font-medium text-gray-700">
              Margins to remove (mm)
            </legend>
            {(['top', 'bottom', 'left', 'right'] as Edge[]).map((edge) => (
              <NumberField
                key={edge}
                label={edge[0].toUpperCase() + edge.slice(1)}
                value={mm(edge)}
                onChange={(v) => setMm(edge, v)}
                min={0}
                step={0.5}
              />
            ))}
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={!preview}
              onClick={async () => {
                if (!preview) return;
                const found = await detectContent(preview.url);
                if (found) setInsets(found);
                else
                  setError(
                    'This page looks blank — there is nothing to trim to.',
                  );
              }}
            >
              ✂ Trim white margins (this page)
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInsets(ZERO)}
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Margins are measured on this page and applied proportionally to the
            pages you choose. Result:{' '}
            {Math.round(size.w * (1 - insets.left - insets.right) * PT_TO_MM)} ×{' '}
            {Math.round(size.h * (1 - insets.top - insets.bottom) * PT_TO_MM)}{' '}
            mm
          </p>
          <SelectField
            label="Apply to"
            value={scope}
            onChange={setScope}
            options={[
              { value: 'all', label: 'All pages' },
              { value: 'current', label: `This page only (page ${page + 1})` },
              { value: 'odd', label: 'Odd pages' },
              { value: 'even', label: 'Even pages' },
              { value: 'custom', label: 'Custom pages…' },
            ]}
          />
          {scope === 'custom' && (
            <TextField
              label="Pages"
              value={custom}
              onChange={setCustom}
              mono
              placeholder="1-3, 7"
            />
          )}
        </div>
      </div>
      <Notice>
        Cropping changes what viewers and printers show; the trimmed-off content
        stays inside the file. Don’t rely on cropping to hide private
        information — to remove it for good, convert it to images with PDF to
        JPG and turn those back into a PDF with the Image Converter.
      </Notice>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={run}
          disabled={busy}
        >
          {busy ? 'Cropping…' : 'Crop PDF'}
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
