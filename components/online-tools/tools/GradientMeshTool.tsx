'use client';

import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  DownloadButton,
  ErrorMessage,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import { CodePanel, nudge, useSvgDrag, type Point } from './playground-shared';
import { ColorInput, DraftNumberField } from './playground-shared';

type MeshPoint = {
  x: number; // % of width
  y: number; // % of height
  color: string;
  opacity: number; // 0–100
  radius: number; // % of the gradient ray
};

type Mesh = { bg: string; points: MeshPoint[] };

const MIN_POINTS = 3;
const MAX_POINTS = 8;

const PRESETS: { name: string; mesh: Mesh }[] = [
  {
    name: 'Aurora',
    mesh: {
      bg: '#0f172a',
      points: [
        { x: 15, y: 20, color: '#22d3ee', opacity: 85, radius: 55 },
        { x: 80, y: 15, color: '#a855f7', opacity: 80, radius: 50 },
        { x: 55, y: 85, color: '#10b981', opacity: 75, radius: 55 },
        { x: 10, y: 90, color: '#6366f1', opacity: 70, radius: 45 },
      ],
    },
  },
  {
    name: 'Peach',
    mesh: {
      bg: '#fff7ed',
      points: [
        { x: 10, y: 10, color: '#fb923c', opacity: 80, radius: 50 },
        { x: 90, y: 20, color: '#f472b6', opacity: 75, radius: 50 },
        { x: 30, y: 90, color: '#fde047', opacity: 80, radius: 50 },
        { x: 85, y: 85, color: '#f87171', opacity: 70, radius: 45 },
      ],
    },
  },
  {
    name: 'Ocean',
    mesh: {
      bg: '#e0f2fe',
      points: [
        { x: 0, y: 0, color: '#0ea5e9', opacity: 85, radius: 55 },
        { x: 100, y: 30, color: '#2563eb', opacity: 70, radius: 50 },
        { x: 40, y: 100, color: '#14b8a6', opacity: 75, radius: 55 },
      ],
    },
  },
  {
    name: 'Candy',
    mesh: {
      bg: '#fdf4ff',
      points: [
        { x: 20, y: 25, color: '#e879f9', opacity: 80, radius: 45 },
        { x: 75, y: 20, color: '#60a5fa', opacity: 75, radius: 45 },
        { x: 85, y: 80, color: '#f9a8d4', opacity: 80, radius: 50 },
        { x: 20, y: 85, color: '#a78bfa', opacity: 75, radius: 45 },
        { x: 50, y: 50, color: '#fef08a', opacity: 60, radius: 35 },
      ],
    },
  },
];

const SIZES = [
  { value: '1920x1080', label: '1920 × 1080 (16:9)' },
  { value: '2560x1440', label: '2560 × 1440 (16:9, QHD)' },
  { value: '1080x1080', label: '1080 × 1080 (square)' },
  { value: '1080x1920', label: '1080 × 1920 (story)' },
  { value: '1200x630', label: '1200 × 630 (social card)' },
];

const hexRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = (hex: string, opacity: number) =>
  `rgba(${hexRgb(hex).join(', ')}, ${Math.round(opacity) / 100})`;
const r1 = (n: number) => String(Math.round(n * 10) / 10);

// Light fractal noise, used as an optional film-grain layer.
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

function meshLayers(mesh: Mesh, grain: boolean): string[] {
  const layers = mesh.points.map(
    (p) =>
      `radial-gradient(at ${r1(p.x)}% ${r1(p.y)}%, ${rgba(p.color, p.opacity)} 0, transparent ${r1(p.radius)}%)`,
  );
  return grain ? [GRAIN_URL, ...layers] : layers;
}

function meshCss(mesh: Mesh, grain: boolean): string {
  return `background-color: ${mesh.bg};\nbackground-image:\n  ${meshLayers(mesh, grain).join(',\n  ')};`;
}

/**
 * SVG version. CSS "radial-gradient(at x y …)" is a farthest-corner
 * ellipse, so each gradient is scaled the same way here to look alike;
 * a blur on top smooths the joins between colours.
 */
function meshSvg(
  mesh: Mesh,
  w: number,
  h: number,
  grain: boolean,
  blur = true,
): string {
  const defs: string[] = [];
  const rects: string[] = [];
  // Painted bottom-up: the first CSS layer is the top one.
  [...mesh.points].reverse().forEach((p, i) => {
    const cx = (p.x / 100) * w;
    const cy = (p.y / 100) * h;
    const rx = Math.SQRT2 * Math.max(cx, w - cx);
    const ry = Math.SQRT2 * Math.max(cy, h - cy);
    const r = (rx * p.radius) / 100;
    const k = rx ? ry / rx : 1;
    const [cr, cg, cb] = hexRgb(p.color);
    defs.push(
      `    <radialGradient id="g${i}" gradientUnits="userSpaceOnUse" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(0.1, r))}" gradientTransform="translate(0 ${r1(cy)}) scale(1 ${Math.round(k * 1000) / 1000}) translate(0 ${r1(-cy)})">\n      <stop offset="0" stop-color="rgb(${cr},${cg},${cb})" stop-opacity="${p.opacity / 100}"/>\n      <stop offset="1" stop-color="rgb(${cr},${cg},${cb})" stop-opacity="0"/>\n    </radialGradient>`,
    );
    // Extend past the edges so the blur doesn't fade the borders.
    rects.push(
      `    <rect x="${r1(-w * 0.1)}" y="${r1(-h * 0.1)}" width="${r1(w * 1.2)}" height="${r1(h * 1.2)}" fill="url(#g${i})"/>`,
    );
  });
  const sd = Math.round(Math.min(w, h) * 0.04);
  if (blur)
    defs.push(
      `    <filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${sd}"/></filter>`,
    );
  if (grain)
    defs.push(
      `    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/></filter>`,
    );
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`,
    `  <defs>\n${defs.join('\n')}\n  </defs>`,
    `  <rect width="${w}" height="${h}" fill="${mesh.bg}"/>`,
    `  <g${blur ? ' filter="url(#soft)"' : ''}>\n${rects.join('\n')}\n  </g>`,
    ...(grain
      ? [`  <rect width="${w}" height="${h}" filter="url(#grain)"/>`]
      : []),
    '</svg>',
    '',
  ].join('\n');
}

const randomHex = (h: number, s: number, l: number) => {
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

function randomMesh(): Mesh {
  const base = Math.random() * 360;
  const n = 3 + Math.floor(Math.random() * 3);
  const dark = Math.random() < 0.35;
  return {
    bg: randomHex(base, 40, dark ? 0.1 : 0.96),
    points: Array.from({ length: n }, (_, i) => ({
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      color: randomHex((base + i * (360 / n) * 0.6) % 360, 85, 0.62),
      opacity: 65 + Math.round(Math.random() * 25),
      radius: 40 + Math.round(Math.random() * 20),
    })),
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function GradientMeshTool(_: ToolProps) {
  const [mesh, setMesh] = useState<Mesh>(PRESETS[0].mesh);
  const [sel, setSel] = useState(0);
  const [grain, setGrain] = useState(false);
  const [view, setView] = useState<'css' | 'svg'>('css');
  const [size, setSize] = useState('1920x1080');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [w, h] = size.split('x').map(Number);
  const css = useMemo(() => meshCss(mesh, grain), [mesh, grain]);
  const svg = useMemo(() => meshSvg(mesh, w, h, grain), [mesh, w, h, grain]);
  const svgUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    [svg],
  );
  const point = mesh.points[Math.min(sel, mesh.points.length - 1)];
  const selIdx = Math.min(sel, mesh.points.length - 1);

  const update = (i: number, patch: Partial<MeshPoint>) =>
    setMesh((m) => ({
      ...m,
      points: m.points.map((p, j) => (j === i ? { ...p, ...patch } : p)),
    }));

  const { start } = useSvgDrag<number>(svgRef, (i, p) =>
    update(i, {
      x: Math.round(clamp(p.x, 0, 100)),
      y: Math.round(clamp(p.y, 0, 100)),
    }),
  );

  const onKey = (i: number, p: Point) => (e: KeyboardEvent) => {
    const n = nudge(e, p);
    if (n) update(i, { x: clamp(n.x, 0, 100), y: clamp(n.y, 0, 100) });
  };

  const add = () => {
    if (mesh.points.length >= MAX_POINTS) return;
    const base = point ?? mesh.points[0];
    setMesh((m) => ({
      ...m,
      points: [
        ...m.points,
        {
          x: 50,
          y: 50,
          color: randomHex(Math.random() * 360, 80, 0.62),
          opacity: base?.opacity ?? 75,
          radius: base?.radius ?? 50,
        },
      ],
    }));
    setSel(mesh.points.length);
    setStatus(`Added point ${mesh.points.length + 1}.`);
  };

  const remove = () => {
    if (mesh.points.length <= MIN_POINTS) return;
    setMesh((m) => ({
      ...m,
      points: m.points.filter((_, j) => j !== selIdx),
    }));
    setSel(Math.max(0, selIdx - 1));
    setStatus(`Removed point ${selIdx + 1}.`);
  };

  const downloadPng = async () => {
    setBusy(true);
    setError('');
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('svg'));
        img.src = svgUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');
      ctx.drawImage(img, 0, 0, w, h);
      const blob = await new Promise<Blob | null>((r) =>
        canvas.toBlob(r, 'image/png'),
      );
      if (!blob) throw new Error('png');
      downloadBlob(blob, `mesh-gradient-${w}x${h}.png`);
      setStatus('PNG ready.');
    } catch {
      setError(
        'Your browser could not render the PNG. Download the SVG instead and convert it with the SVG to PNG tool.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-3">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Preview format"
          >
            {(['css', 'svg'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`rounded-xl border px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  view === v
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                {v === 'css' ? 'CSS preview' : 'SVG / PNG preview'}
              </button>
            ))}
          </div>
          <div
            className="relative mx-auto max-h-[70vh] w-full overflow-hidden rounded-2xl border border-gray-200"
            style={{
              aspectRatio: `${w} / ${h}`,
              maxWidth: h > w ? `${(w / h) * 70}vh` : undefined,
            }}
          >
            {view === 'css' ? (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: mesh.bg,
                  backgroundImage: meshLayers(mesh, grain).join(', '),
                }}
                role="img"
                aria-label="Mesh gradient preview (CSS)"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("${svgUrl}")`,
                  backgroundSize: '100% 100%',
                }}
                role="img"
                aria-label="Mesh gradient preview (SVG)"
              />
            )}
            <svg
              ref={svgRef}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden
            />
            {mesh.points.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Point ${i + 1}, ${p.color}, x ${Math.round(p.x)}%, y ${Math.round(p.y)}%`}
                aria-pressed={selIdx === i}
                onPointerDown={(e) => {
                  setSel(i);
                  start(i)(e);
                }}
                onFocus={() => setSel(i)}
                onKeyDown={onKey(i, p)}
                className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-move items-center justify-center rounded-full border-2 text-[11px] font-bold shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  selIdx === i
                    ? 'border-gray-900 ring-2 ring-white'
                    : 'border-white'
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  background: p.color,
                  touchAction: 'none',
                  color: '#111827',
                }}
              >
                <span className="rounded-full bg-white/80 px-1">{i + 1}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Drag the numbered points, or Tab to one and use the arrow keys
            (Shift moves 10%). The CSS preview shows exactly what the CSS code
            produces; the SVG preview adds a blur for smoother blending.
          </p>
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
        </div>

        <div className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Point {selIdx + 1}
              </h2>
              <div
                className="flex flex-wrap gap-1"
                role="group"
                aria-label="Choose a point"
              >
                {mesh.points.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={selIdx === i}
                    aria-label={`Edit point ${i + 1}`}
                    onClick={() => setSel(i)}
                    className={`h-7 w-7 rounded-lg border text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      selIdx === i
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            {point && (
              <>
                <ColorInput
                  label="Colour"
                  value={point.color}
                  onChange={(color) => update(selIdx, { color })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <DraftNumberField
                    label="x"
                    suffix="%"
                    value={point.x}
                    min={0}
                    max={100}
                    decimals={1}
                    onCommit={(x) => update(selIdx, { x })}
                  />
                  <DraftNumberField
                    label="y"
                    suffix="%"
                    value={point.y}
                    min={0}
                    max={100}
                    decimals={1}
                    onCommit={(y) => update(selIdx, { y })}
                  />
                </div>
                <RangeField
                  label="Opacity"
                  value={point.opacity}
                  min={5}
                  max={100}
                  onChange={(opacity) => update(selIdx, { opacity })}
                  display={`${point.opacity}%`}
                />
                <RangeField
                  label="Radius (softness)"
                  value={point.radius}
                  min={10}
                  max={100}
                  onChange={(radius) => update(selIdx, { radius })}
                  display={`${point.radius}%`}
                />
              </>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={add}
                disabled={mesh.points.length >= MAX_POINTS}
              >
                + Add point
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={remove}
                disabled={mesh.points.length <= MIN_POINTS}
              >
                Remove point
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {MIN_POINTS}–{MAX_POINTS} points.
            </p>
          </section>
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <ColorInput
              label="Background colour"
              value={mesh.bg}
              onChange={(bg) => setMesh((m) => ({ ...m, bg }))}
            />
            <Checkbox label="Film grain" checked={grain} onChange={setGrain} />
          </section>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-700">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={btnSecondary}
            onClick={() => {
              setMesh(p.mesh);
              setSel(0);
              setStatus(`Loaded the ${p.name} preset.`);
            }}
          >
            {p.name}
          </button>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setMesh(randomMesh());
            setSel(0);
            setStatus('Randomized the gradient.');
          }}
        >
          🎲 Randomize
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setMesh(PRESETS[0].mesh);
            setGrain(false);
            setSel(0);
            setStatus('Reset to the default gradient.');
          }}
        >
          Reset
        </button>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">
          A · CSS (works in every browser)
        </h2>
        <p className="text-xs text-gray-500">
          Layered radial gradients over a background colour. Paste into any
          element’s style; it scales to any size without an image file.
        </p>
        <CodePanel css={css} title="CSS" copyLabel="Copy CSS" />
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">
          B · SVG (smoother, blurred blend)
        </h2>
        <p className="text-xs text-gray-500">
          Radial gradients with a Gaussian blur filter, sized {w} × {h}. Use it
          as an image or inline SVG.
        </p>
        <CodePanel css={svg} title="SVG" copyLabel="Copy SVG" />
        <DownloadButton
          data={svg}
          filename={`mesh-gradient-${w}x${h}.svg`}
          type="image/svg+xml"
          label="Download SVG"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">C · PNG image</h2>
        <div className="flex flex-wrap items-end gap-3">
          <SelectField
            label="Size (also sets the preview shape)"
            value={size}
            onChange={setSize}
            options={SIZES}
            className="w-64 max-w-full"
          />
          <button
            type="button"
            className={btnPrimary}
            onClick={downloadPng}
            disabled={busy}
          >
            {busy ? 'Rendering…' : '⬇ Download PNG'}
          </button>
        </div>
        <ErrorMessage>{error}</ErrorMessage>
      </section>
    </div>
  );
}
