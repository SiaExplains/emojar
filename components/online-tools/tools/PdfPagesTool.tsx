'use client';

import { useEffect, useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import { ToolInputError } from '@/lib/online-tools/engines/data';
import { deletePages } from '@/lib/online-tools/pdf/edit';
import {
  pageCount,
  parsePageRanges,
  rotatePdf,
  selectPages,
  splitPdf,
} from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  NumberField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

type Mode = 'split' | 'rotate' | 'extract' | 'reorder' | 'delete';

const pdfBlob = (bytes: Uint8Array) =>
  new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });

/** Page thumbnails as data URLs, rendered one by one (first 200 pages). */
function usePdfThumbs(buffer: ArrayBuffer): Record<number, string> {
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { openPdf } = await import('@/lib/online-tools/pdf/render');
      const { doc, close } = await openPdf(buffer);
      try {
        for (let i = 0; i < Math.min(doc.numPages, 200); i++) {
          if (cancelled) break;
          const page = await doc.getPage(i + 1);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: 110 / base.width });
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          await page.render({
            canvas,
            canvasContext: canvas.getContext('2d')!,
            viewport,
            intent: 'print',
          }).promise;
          const url = canvas.toDataURL('image/jpeg', 0.6);
          if (!cancelled) setThumbs((t) => ({ ...t, [i]: url }));
          page.cleanup();
        }
      } finally {
        await close();
      }
    })().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [buffer]);

  return thumbs;
}

function Thumbnails({
  buffer,
  order,
  onMove,
  onRemove,
}: {
  buffer: ArrayBuffer;
  order: number[];
  onMove: (i: number, d: -1 | 1) => void;
  onRemove: (i: number) => void;
}) {
  const thumbs = usePdfThumbs(buffer);
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {order.map((p, i) => (
        <li
          key={`${p}-${i}`}
          className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 p-2"
        >
          <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded bg-gray-50">
            {thumbs[p] ? (
              <img
                src={thumbs[p]}
                alt={`Page ${p + 1}`}
                className="max-h-full max-w-full shadow-sm"
              />
            ) : (
              <span className="text-xs text-gray-400">Page {p + 1}</span>
            )}
          </div>
          <span className="text-xs text-gray-600">
            {i + 1}. page {p + 1}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onMove(i, -1)}
              disabled={i === 0}
              className="rounded px-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              aria-label={`Move page ${p + 1} earlier`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => onMove(i, 1)}
              disabled={i === order.length - 1}
              className="rounded px-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              aria-label={`Move page ${p + 1} later`}
            >
              →
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              disabled={order.length === 1}
              className="rounded px-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
              aria-label={`Remove page ${p + 1}`}
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** "1-3, 5" style text for a set of 0-based page indexes. */
function toRangeText(pages: number[]): string {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i];
    while (i + 1 < sorted.length && sorted[i + 1] === sorted[i] + 1) i++;
    parts.push(
      start === sorted[i] ? `${start + 1}` : `${start + 1}-${sorted[i] + 1}`,
    );
  }
  return parts.join(', ');
}

function DeleteGrid({
  buffer,
  total,
  selected,
  onToggle,
}: {
  buffer: ArrayBuffer;
  total: number;
  selected: Set<number>;
  onToggle: (page: number) => void;
}) {
  const thumbs = usePdfThumbs(buffer);
  return (
    <ol className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: Math.min(total, 200) }, (_, p) => {
        const on = selected.has(p);
        return (
          <li key={p}>
            <button
              type="button"
              aria-pressed={on}
              aria-label={`${on ? 'Keep' : 'Delete'} page ${p + 1}`}
              onClick={() => onToggle(p)}
              className={`relative flex w-full flex-col items-center gap-1 rounded-xl border-2 p-2 transition ${on ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-300'}`}
            >
              <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded bg-gray-50">
                {thumbs[p] ? (
                  <img
                    src={thumbs[p]}
                    alt=""
                    className={`max-h-full max-w-full shadow-sm ${on ? 'opacity-40' : ''}`}
                  />
                ) : (
                  <span className="text-xs text-gray-400">Page {p + 1}</span>
                )}
              </div>
              {on && (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-red-600"
                >
                  ✕
                </span>
              )}
              <span
                className={`text-xs ${on ? 'font-semibold text-red-700' : 'text-gray-600'}`}
              >
                Page {p + 1}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default function PdfPagesTool({ config }: ToolProps) {
  const mode = String(config.mode) as Mode;
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [total, setTotal] = useState(0);
  const [ranges, setRanges] = useState('');
  const [splitMode, setSplitMode] = useState<'every' | 'ranges'>('every');
  const [every, setEvery] = useState('1');
  const [angle, setAngle] = useState('90');
  const [order, setOrder] = useState<number[]>([]);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (f: File) => {
    setError('');
    setResults([]);
    try {
      const buf = await f.arrayBuffer();
      const n = await pageCount(buf);
      setFile(f);
      setBuffer(buf);
      setTotal(n);
      setOrder(Array.from({ length: n }, (_, i) => i));
      setRanges(
        mode === 'extract'
          ? n > 1
            ? `1-${Math.min(n, 3)}`
            : '1'
          : mode === 'split' || mode === 'delete'
            ? ''
            : 'all',
      );
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  };

  const run = async () => {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      if (mode === 'split') {
        const parts = await splitPdf(
          buffer,
          splitMode === 'every'
            ? { mode: 'every', size: Number(every) || 1 }
            : { mode: 'ranges', ranges },
        );
        setResults(
          parts.map((p) => ({
            name: outputName(file.name, 'pdf', `-${p.label}`),
            blob: pdfBlob(p.bytes),
          })),
        );
      } else if (mode === 'rotate') {
        const pages = parsePageRanges(ranges, total);
        const bytes = await rotatePdf(buffer, Number(angle), pages);
        setResults([
          {
            name: outputName(file.name, 'pdf', '-rotated'),
            blob: pdfBlob(bytes),
            note: `${pages.length} page${pages.length === 1 ? '' : 's'} rotated`,
          },
        ]);
      } else if (mode === 'extract') {
        const pages = parsePageRanges(ranges, total, { allowDuplicates: true });
        const bytes = await selectPages(buffer, pages);
        setResults([
          {
            name: outputName(file.name, 'pdf', '-extracted'),
            blob: pdfBlob(bytes),
            note: `${pages.length} page${pages.length === 1 ? '' : 's'}`,
          },
        ]);
      } else if (mode === 'delete') {
        if (!ranges.trim())
          throw new ToolInputError('Select at least one page to delete.');
        const pages = parsePageRanges(ranges, total);
        const bytes = await deletePages(buffer, pages, total);
        const left = total - pages.length;
        setResults([
          {
            name: outputName(file.name, 'pdf', '-pages-deleted'),
            blob: pdfBlob(bytes),
            note: `${pages.length} deleted · ${left} page${left === 1 ? '' : 's'} left`,
          },
        ]);
      } else {
        const bytes = await selectPages(buffer, order);
        setResults([
          {
            name: outputName(file.name, 'pdf', '-reordered'),
            blob: pdfBlob(bytes),
            note: `${order.length} pages`,
          },
        ]);
      }
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be processed.'));
    } finally {
      setBusy(false);
    }
  };

  if (!file || !buffer)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => load(f[0])}
          label="Choose a PDF or drop it here"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  const selectedSet = (() => {
    try {
      return new Set(ranges.trim() ? parsePageRanges(ranges, total) : []);
    } catch {
      return new Set<number>();
    }
  })();

  const action = {
    split: 'Split PDF',
    rotate: 'Rotate pages',
    extract: 'Extract pages',
    reorder: 'Save new order',
    delete: 'Delete pages',
  }[mode];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📄 <strong>{file.name}</strong> · {total} page{total === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setBuffer(null);
            setResults([]);
          }}
        >
          Choose another PDF
        </button>
      </div>

      {mode === 'split' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Split"
            value={splitMode}
            onChange={(v) => setSplitMode(v as 'every' | 'ranges')}
            options={[
              { value: 'every', label: 'Every N pages' },
              { value: 'ranges', label: 'By custom ranges' },
            ]}
          />
          {splitMode === 'every' ? (
            <NumberField
              label="Pages per file"
              value={every}
              onChange={setEvery}
              min={1}
              max={total}
            />
          ) : (
            <TextField
              label="Ranges (separate files with ;)"
              value={ranges}
              onChange={setRanges}
              mono
              placeholder={`1-3; 4-${total}`}
            />
          )}
        </div>
      )}
      {(mode === 'rotate' || mode === 'extract') && (
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label={mode === 'rotate' ? 'Pages to rotate' : 'Pages to keep'}
            value={ranges}
            onChange={setRanges}
            mono
            placeholder="all, odd, even, 1-3, 5, 8-"
          />
          {mode === 'rotate' && (
            <SelectField
              label="Rotation"
              value={angle}
              onChange={setAngle}
              options={[
                { value: '90', label: '90° clockwise' },
                { value: '180', label: '180°' },
                { value: '270', label: '90° counter-clockwise' },
              ]}
            />
          )}
        </div>
      )}
      {mode === 'delete' && (
        <div className="space-y-3">
          <TextField
            label="Pages to delete (or click the pages below)"
            value={ranges}
            onChange={setRanges}
            mono
            placeholder="e.g. 2, 5-7, even"
          />
          <DeleteGrid
            buffer={buffer}
            total={total}
            selected={selectedSet}
            onToggle={(p) => {
              const next = new Set(selectedSet);
              if (next.has(p)) next.delete(p);
              else next.add(p);
              setRanges(toRangeText([...next]));
            }}
          />
          {total > 200 && (
            <p className="text-xs text-gray-500">
              Previews show the first 200 pages; type page numbers to delete
              later pages.
            </p>
          )}
        </div>
      )}
      {mode === 'reorder' && (
        <div className="space-y-2">
          <Thumbnails
            buffer={buffer}
            order={order}
            onMove={(i, d) =>
              setOrder((cur) => {
                const j = i + d;
                if (j < 0 || j >= cur.length) return cur;
                const next = [...cur];
                [next[i], next[j]] = [next[j], next[i]];
                return next;
              })
            }
            onRemove={(i) => setOrder((cur) => cur.filter((_, k) => k !== i))}
          />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setOrder(Array.from({ length: total }, (_, i) => i))}
          >
            Reset
          </button>
        </div>
      )}

      <button
        type="button"
        className={btnPrimary}
        onClick={run}
        disabled={busy || (mode === 'delete' && selectedSet.size === 0)}
      >
        {busy ? 'Working…' : action}
      </button>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
