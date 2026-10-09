'use client';

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import {
  pageCount,
  stampImage,
  type ImagePlacement,
} from '@/lib/online-tools/pdf/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

const SCRIPT_FONTS = [
  {
    value: '"Segoe Script", "Brush Script MT", "Snell Roundhand", cursive',
    label: 'Script',
  },
  {
    value: '"Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive',
    label: 'Handwritten',
  },
  {
    value: '"Lucida Handwriting", "Apple Chancery", "URW Chancery L", cursive',
    label: 'Calligraphy',
  },
];

/** Crops a canvas to its non-transparent pixels (with padding) and returns PNG bytes + aspect. */
async function trimToPng(
  canvas: HTMLCanvasElement,
): Promise<{ png: Uint8Array; aspect: number; url: string } | null> {
  const ctx = canvas.getContext('2d')!;
  const { data, width, height } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const pad = 8;
  const w = Math.min(width, maxX - minX + 1 + pad * 2);
  const h = Math.min(height, maxY - minY + 1 + pad * 2);
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  out
    .getContext('2d')!
    .drawImage(
      canvas,
      Math.max(0, minX - pad),
      Math.max(0, minY - pad),
      w,
      h,
      0,
      0,
      w,
      h,
    );
  const blob = await new Promise<Blob | null>((r) =>
    out.toBlob(r, 'image/png'),
  );
  if (!blob) return null;
  return {
    png: new Uint8Array(await blob.arrayBuffer()),
    aspect: w / h,
    url: out.toDataURL('image/png'),
  };
}

export default function PdfSignTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [preview, setPreview] = useState<{
    url: string;
    aspect: number;
  } | null>(null);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typed, setTyped] = useState('');
  const [font, setFont] = useState(SCRIPT_FONTS[0].value);
  const [ink, setInk] = useState('#1e3a8a');
  const [addDate, setAddDate] = useState(false);
  const [signature, setSignature] = useState<{
    png: Uint8Array;
    aspect: number;
    url: string;
  } | null>(null);
  const [width, setWidth] = useState(28);
  const [placements, setPlacements] = useState<ImagePlacement[]>([]);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const padRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const load = async (f: File) => {
    setError('');
    try {
      const buf = await f.arrayBuffer();
      setTotal(await pageCount(buf));
      setFile(f);
      setBuffer(buf);
      setPage(0);
      setPlacements([]);
      setResults([]);
    } catch (e) {
      setError(
        friendlyError(
          e,
          'This file could not be processed. Please make sure it is a valid PDF file.',
        ),
      );
    }
  };

  // Render the selected page as a preview image.
  useEffect(() => {
    if (!buffer) return;
    let cancelled = false;
    (async () => {
      const { renderThumbnail } = await import('@/lib/online-tools/pdf/render');
      const url = await renderThumbnail(buffer, page, 700);
      const img = new Image();
      img.onload = () =>
        !cancelled && setPreview({ url, aspect: img.width / img.height });
      img.src = url;
    })().catch(() => setError('This page could not be displayed.'));
    return () => {
      cancelled = true;
    };
  }, [buffer, page]);

  const padPoint = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * e.currentTarget.width,
      y: ((e.clientY - r.top) / r.height) * e.currentTarget.height,
    };
  };

  const startStroke = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = e.currentTarget.getContext('2d')!;
    const p = padPoint(e);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const moveStroke = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext('2d')!;
    const p = padPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const clearPad = () => {
    const c = padRef.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    setSignature(null);
  };

  /** Builds the signature image from the pad or the typed name (+ optional date line). */
  const buildSignature = async () => {
    const src = document.createElement('canvas');
    src.width = 900;
    src.height = addDate ? 330 : 260;
    const ctx = src.getContext('2d')!;
    if (mode === 'draw' && padRef.current)
      ctx.drawImage(padRef.current, 0, 0, 900, 260);
    else {
      ctx.fillStyle = ink;
      ctx.font = `110px ${font}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(typed, 20, 130, 860);
    }
    if (addDate) {
      ctx.fillStyle = ink;
      ctx.font = '40px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(new Date().toLocaleDateString(), 24, 300);
    }
    const sig = await trimToPng(src);
    if (!sig)
      return setError(
        mode === 'draw'
          ? 'Draw your signature first.'
          : 'Type your name first.',
      );
    setError('');
    setSignature(sig);
  };

  const place = (e: MouseEvent<HTMLDivElement>) => {
    if (!signature || !preview) return;
    const r = e.currentTarget.getBoundingClientRect();
    const w = width / 100;
    const h = (w / signature.aspect) * preview.aspect;
    const x = Math.min(
      1 - w,
      Math.max(0, (e.clientX - r.left) / r.width - w / 2),
    );
    const y = Math.min(
      1 - h,
      Math.max(0, (e.clientY - r.top) / r.height - h / 2),
    );
    setPlacements((ps) => [
      ...ps,
      { pageIndex: page, x, y, width: w, height: h },
    ]);
  };

  const save = async () => {
    if (!buffer || !signature || !file) return;
    try {
      const out = await stampImage(buffer, signature.png, placements);
      setResults([
        {
          name: outputName(file.name, 'pdf', '-signed'),
          blob: new Blob([new Uint8Array(out)], { type: 'application/pdf' }),
          note: `${placements.length} signature${placements.length === 1 ? '' : 's'}`,
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be signed.'));
    }
  };

  if (!file || !buffer)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept="application/pdf,.pdf"
          onFiles={(f) => load(f[0])}
          label="Choose the PDF to sign"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          1. Create your signature
        </h3>
        <div
          role="tablist"
          aria-label="Signature type"
          className="inline-flex rounded-xl border border-gray-200 p-1"
        >
          {(['draw', 'type'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === m ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {m === 'draw' ? 'Draw' : 'Type'}
            </button>
          ))}
        </div>
        {mode === 'draw' ? (
          <div className="space-y-2">
            <canvas
              ref={padRef}
              width={900}
              height={260}
              onPointerDown={startStroke}
              onPointerMove={moveStroke}
              onPointerUp={() => (drawing.current = false)}
              className="h-40 w-full max-w-xl touch-none rounded-xl border-2 border-dashed border-gray-300 bg-white"
              aria-label="Signature pad — draw with your mouse, finger or stylus"
            />
            <button type="button" className={btnSecondary} onClick={clearPad}>
              Clear
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Your name"
              value={typed}
              onChange={setTyped}
              placeholder="Ada Lovelace"
            />
            <SelectField
              label="Style"
              value={font}
              onChange={setFont}
              options={SCRIPT_FONTS}
            />
            {typed && (
              <p
                className="sm:col-span-2 text-4xl"
                style={{ fontFamily: font, color: ink }}
              >
                {typed}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="color"
              value={ink}
              onChange={(e) => setInk(e.target.value)}
              className="h-8 w-10 rounded border border-gray-200"
            />{' '}
            Ink colour
          </label>
          <Checkbox
            label="Add today’s date"
            checked={addDate}
            onChange={setAddDate}
          />
          <button type="button" className={btnPrimary} onClick={buildSignature}>
            Use this signature
          </button>
        </div>
        {signature && (
          <img
            src={signature.url}
            alt="Your signature"
            className="h-14 rounded border border-gray-100 bg-white p-1"
          />
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          2. Click on the page where it should go
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <SelectField
            label="Page"
            value={String(page)}
            onChange={(v) => setPage(Number(v))}
            options={Array.from({ length: total }, (_, i) => ({
              value: String(i),
              label: `Page ${i + 1} of ${total}`,
            }))}
          />
          <div className="min-w-[200px] flex-1">
            <RangeField
              label="Signature width"
              value={width}
              onChange={setWidth}
              min={8}
              max={70}
              display={`${width}% of page`}
            />
          </div>
        </div>
        {preview && (
          <div
            onClick={place}
            className={`relative mx-auto max-w-xl overflow-hidden rounded-lg border border-gray-200 shadow-sm ${signature ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
            role="button"
            tabIndex={-1}
            aria-label="Page preview — click to place the signature"
          >
            <img
              src={preview.url}
              alt={`Page ${page + 1}`}
              className="block w-full select-none"
              draggable={false}
            />
            {signature &&
              placements
                .map((p, i) => ({ p, i }))
                .filter(({ p }) => p.pageIndex === page)
                .map(({ p, i }) => (
                  <button
                    key={i}
                    type="button"
                    title="Remove this signature"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlacements((ps) => ps.filter((_, k) => k !== i));
                    }}
                    className="absolute border border-dashed border-brand-400 bg-brand-50/20"
                    style={{
                      left: `${p.x * 100}%`,
                      top: `${p.y * 100}%`,
                      width: `${p.width * 100}%`,
                      height: `${p.height * 100}%`,
                    }}
                  >
                    <img
                      src={signature.url}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
          </div>
        )}
        {signature && preview && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              const w = width / 100;
              const h = (w / signature.aspect) * preview.aspect;
              setPlacements((ps) => [
                ...ps,
                {
                  pageIndex: page,
                  x: 1 - w - 0.06,
                  y: 1 - h - 0.08,
                  width: w,
                  height: h,
                },
              ]);
            }}
          >
            Place at bottom right of this page
          </button>
        )}
        {!signature && (
          <p className="text-xs text-gray-500">
            Create your signature first, then click on the page.
          </p>
        )}
        {placements.length > 0 && (
          <p className="text-xs text-gray-500">
            {placements.length} placed · click a signature on the preview to
            remove it.
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={save}
          disabled={!placements.length}
        >
          Download signed PDF
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => (setFile(null), setBuffer(null), setPreview(null))}
        >
          Choose another PDF
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
    </div>
  );
}
