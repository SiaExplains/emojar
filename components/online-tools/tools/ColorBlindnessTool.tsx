'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  RangeField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
  labelBase,
} from '../ui';
import { IMAGE_ACCEPT, makeCanvas, useImageFile } from './image-shared';
import {
  MODES,
  confusablePairs,
  isAnomaly,
  parsePalette,
  simulate,
  simulatePixels,
  toHex,
  type CvdMode,
} from '@/lib/online-tools/engines/color-blindness';

type View = 'original' | 'simulated' | 'split';

// Big photos are scaled down so simulation stays quick on phones.
const MAX_SIDE = 1600;

const DEMO_PALETTE = [
  ['#d62728', 'Red'],
  ['#2ca02c', 'Green'],
  ['#1f77b4', 'Blue'],
  ['#ff7f0e', 'Orange'],
  ['#9467bd', 'Purple'],
  ['#8c564b', 'Brown'],
  ['#e377c2', 'Pink'],
  ['#bcbd22', 'Olive'],
];

// roundRect is missing in older Safari; square corners are fine there.
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

/** A small dashboard with typical colour-coded content. */
function drawDemo(): ImageData {
  const W = 880;
  const H = 560;
  const [, ctx] = makeCanvas(W, H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  const font = (size: number, weight = 400) =>
    (ctx.font = `${weight} ${size}px system-ui, -apple-system, Segoe UI, sans-serif`);

  font(22, 700);
  ctx.fillStyle = '#111827';
  ctx.fillText('Palette', 32, 36);
  DEMO_PALETTE.forEach(([c, name], i) => {
    const x = 32 + i * 104;
    ctx.fillStyle = c;
    ctx.beginPath();
    roundRect(ctx, x, 58, 92, 56, 10);
    ctx.fill();
    font(13);
    ctx.fillStyle = '#374151';
    ctx.fillText(name, x, 130);
  });

  // Bar chart.
  font(18, 700);
  ctx.fillStyle = '#111827';
  ctx.fillText('Sales by region', 32, 176);
  const bars = [
    [0.55, 0.8, 0.4],
    [0.7, 0.5, 0.65],
    [0.35, 0.6, 0.9],
    [0.8, 0.45, 0.55],
  ];
  const series = ['#d62728', '#2ca02c', '#ff7f0e'];
  const base = 400;
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 4; g++) {
    ctx.beginPath();
    ctx.moveTo(32, base - g * 50);
    ctx.lineTo(420, base - g * 50);
    ctx.stroke();
  }
  bars.forEach((grp, i) => {
    grp.forEach((v, k) => {
      ctx.fillStyle = series[k];
      ctx.fillRect(48 + i * 94 + k * 24, base - v * 200, 20, v * 200);
    });
    font(12);
    ctx.fillStyle = '#6b7280';
    ctx.fillText(['North', 'South', 'East', 'West'][i], 50 + i * 94, base + 16);
  });
  ['2024', '2025', '2026'].forEach((label, k) => {
    ctx.fillStyle = series[k];
    ctx.fillRect(48 + k * 90, base + 40, 14, 14);
    font(13);
    ctx.fillStyle = '#374151';
    ctx.fillText(label, 68 + k * 90, base + 47);
  });

  // Line chart.
  font(18, 700);
  ctx.fillStyle = '#111827';
  ctx.fillText('Uptime vs errors', 470, 176);
  const lines: [string, number[]][] = [
    ['#2ca02c', [0.6, 0.7, 0.65, 0.8, 0.75, 0.85, 0.9]],
    ['#d62728', [0.3, 0.45, 0.35, 0.5, 0.4, 0.3, 0.45]],
    ['#1f77b4', [0.2, 0.25, 0.4, 0.3, 0.55, 0.5, 0.6]],
  ];
  ctx.strokeStyle = '#e5e7eb';
  for (let g = 0; g <= 4; g++) {
    ctx.beginPath();
    ctx.moveTo(470, base - g * 50);
    ctx.lineTo(848, base - g * 50);
    ctx.stroke();
  }
  ctx.lineWidth = 3;
  lines.forEach(([c, vals]) => {
    ctx.strokeStyle = c;
    ctx.beginPath();
    vals.forEach((v, i) => {
      const x = 480 + i * 60;
      const y = base - v * 200;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.stroke();
  });
  ['Uptime', 'Errors', 'Latency'].forEach((label, k) => {
    ctx.fillStyle = lines[k][0];
    ctx.fillRect(480 + k * 110, base + 40, 14, 14);
    font(13);
    ctx.fillStyle = '#374151';
    ctx.fillText(label, 500 + k * 110, base + 47);
  });

  // UI mock: buttons and status messages.
  const y = 486;
  const button = (x: number, w: number, bg: string, text: string) => {
    ctx.fillStyle = bg;
    ctx.beginPath();
    roundRect(ctx, x, y, w, 40, 10);
    ctx.fill();
    font(14, 600);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x + 16, y + 20);
  };
  button(32, 92, '#2563eb', 'Save');
  button(136, 100, '#dc2626', 'Delete');
  button(248, 116, '#16a34a', 'Approve');
  const msg = (
    x: number,
    bg: string,
    border: string,
    fg: string,
    text: string,
  ) => {
    ctx.fillStyle = bg;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    roundRect(ctx, x, y, 230, 40, 10);
    ctx.fill();
    ctx.stroke();
    font(14, 500);
    ctx.fillStyle = fg;
    ctx.fillText(text, x + 14, y + 20);
  };
  msg(384, '#fef2f2', '#f87171', '#b91c1c', 'Payment failed');
  msg(626, '#f0fdf4', '#4ade80', '#15803d', 'Payment received');
  return ctx.getImageData(0, 0, W, H);
}

function PixelCanvas({ image, label }: { image: ImageData; label: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    c.width = image.width;
    c.height = image.height;
    ctx.putImageData(image, 0, 0);
  }, [image]);
  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      className="block h-auto w-full rounded-xl border border-gray-200 bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px]"
    />
  );
}

const MAIN_MODES: CvdMode[] = [
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'achromatopsia',
];
const label = (m: CvdMode) => MODES.find((x) => x.value === m)?.label ?? m;

export default function ColorBlindnessTool(_: ToolProps) {
  const [mode, setMode] = useState<CvdMode>('deuteranopia');
  const [severity, setSeverity] = useState(0.6);
  const [view, setView] = useState<View>('split');
  const [simOn, setSimOn] = useState(true);
  const [src, setSrc] = useState<ImageData | null>(null);
  const [srcName, setSrcName] = useState('demo');
  const [palette, setPalette] = useState(
    '#d62728 #2ca02c #1f77b4 #ff7f0e #9467bd #8c564b',
  );
  const { image, error, setError, load, clear } = useImageFile();

  useEffect(() => {
    if (image) return;
    try {
      setSrc(drawDemo());
      setSrcName('demo');
    } catch {
      setError('Your browser could not draw the demo canvas.');
    }
  }, [image, setError]);

  useEffect(() => {
    if (!image) return;
    try {
      const b = image.bitmap;
      const k = Math.min(1, MAX_SIDE / Math.max(b.width, b.height));
      const [, ctx] = makeCanvas(b.width * k, b.height * k);
      ctx.drawImage(b, 0, 0, ctx.canvas.width, ctx.canvas.height);
      setSrc(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
      setSrcName(image.name.replace(/\.[^.]+$/, '') || 'image');
    } catch {
      setError('This image could not be processed. Try a smaller JPG or PNG.');
    }
  }, [image, setError]);

  const active: CvdMode = simOn ? mode : 'none';
  const sim = useMemo(() => {
    if (!src) return null;
    const data = simulatePixels(src.data, active, severity);
    const out = new ImageData(src.width, src.height);
    out.data.set(data);
    return out;
  }, [src, active, severity]);

  const modeInfo = MODES.find((m) => m.value === mode);
  const simLabel = simOn
    ? `${label(mode)}${isAnomaly(mode) ? ` at ${Math.round(severity * 100)}%` : ''}`
    : 'Simulation off';

  const downloadPng = () => {
    if (!sim) return;
    try {
      const [canvas, ctx] = makeCanvas(sim.width, sim.height);
      ctx.putImageData(sim, 0, 0);
      canvas.toBlob((b) => {
        if (b) downloadBlob(b, `${srcName}-${active}.png`);
        else setError('The PNG could not be created.');
      }, 'image/png');
    } catch {
      setError('The PNG could not be created.');
    }
  };

  const parsed = useMemo(() => parsePalette(palette), [palette]);
  const checkMode: CvdMode = mode === 'none' ? 'deuteranopia' : mode;
  const pairs = useMemo(
    () =>
      confusablePairs(
        parsed.colors.map((c) => c.rgb),
        checkMode,
        severity,
      ),
    [parsed, checkMode, severity],
  );

  const tab = (active: boolean) =>
    `rounded-xl border px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
      active
        ? 'border-gray-900 bg-gray-900 text-white'
        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
    }`;

  return (
    <div className="space-y-6">
      <Notice tone="amber">
        This is a visual approximation of how colours may look with a colour
        vision deficiency, based on a published model (Machado et al. 2009). It
        is not a medical or diagnostic test, and real vision varies from person
        to person.
      </Notice>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Vision type</h2>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Vision type"
        >
          {MODES.filter((m) => m.value !== 'none').map((m) => (
            <button
              key={m.value}
              type="button"
              aria-pressed={mode === m.value}
              onClick={() => {
                setMode(m.value);
                setSimOn(true);
              }}
              className={tab(mode === m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">{modeInfo?.note}</p>
        {isAnomaly(mode) && (
          <div className="max-w-sm">
            <RangeField
              label="Severity"
              value={Math.round(severity * 100)}
              min={0}
              max={100}
              step={5}
              onChange={(v) => setSeverity(v / 100)}
              display={`${Math.round(severity * 100)}%`}
            />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="View">
            {(
              [
                ['original', 'Original'],
                ['simulated', 'Simulated'],
                ['split', 'Side by side'],
              ] as [View, string][]
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={tab(view === v)}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setSimOn((s) => !s)}
          >
            {simOn ? 'Turn simulation off' : 'Turn simulation on'}
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={downloadPng}
            disabled={!sim}
          >
            ⬇ Download simulated PNG
          </button>
        </div>
        <p className="text-sm text-gray-600" aria-live="polite">
          Showing: {view === 'original' ? 'original' : simLabel}
          {view === 'split' ? ' (right) next to the original (left)' : ''}
        </p>
        {src && sim && (
          <div
            className={`grid gap-3 ${view === 'split' ? 'sm:grid-cols-2' : ''}`}
          >
            {view !== 'simulated' && (
              <figure className="space-y-1">
                <PixelCanvas image={src} label="Original image" />
                <figcaption className="text-xs text-gray-500">
                  Original
                </figcaption>
              </figure>
            )}
            {view !== 'original' && (
              <figure className="space-y-1">
                <PixelCanvas image={sim} label={`Simulated: ${simLabel}`} />
                <figcaption className="text-xs text-gray-500">
                  {simLabel}
                </figcaption>
              </figure>
            )}
          </div>
        )}
        <ErrorMessage>{error}</ErrorMessage>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">
          Use your own image
        </h2>
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose an image or drop it here"
          hint={`Processed on a canvas in your browser — never uploaded. Large images are scaled to ${MAX_SIDE}px.`}
        />
        {image && (
          <button type="button" className={btnSecondary} onClick={clear}>
            Back to the demo
          </button>
        )}
      </section>

      <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
        <h2 className="text-base font-semibold text-gray-900">
          Palette checker
        </h2>
        <label htmlFor="cvd-palette" className={labelBase}>
          Hex colours (separated by spaces, commas or new lines)
        </label>
        <textarea
          id="cvd-palette"
          value={palette}
          onChange={(e) => setPalette(e.target.value)}
          rows={2}
          spellCheck={false}
          className={`${inputBase} font-mono text-[13px]`}
        />
        {parsed.invalid.length > 0 && (
          <p className="text-sm text-red-700" role="alert">
            Not a hex colour: {parsed.invalid.slice(0, 5).join(', ')}
            {parsed.invalid.length > 5 ? '…' : ''}
          </p>
        )}
        {parsed.colors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-xs">
              <thead>
                <tr className="text-gray-500">
                  <th className="py-1 pr-2 font-medium">Original</th>
                  {MAIN_MODES.map((m) => (
                    <th key={m} className="py-1 pr-2 font-medium">
                      {label(m)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsed.colors.map((c, i) => (
                  <tr key={i}>
                    <Swatch hex={c.hex} />
                    {MAIN_MODES.map((m) => (
                      <Swatch key={m} hex={toHex(simulate(c.rgb, m))} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div aria-live="polite" className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Hard to tell apart with {label(checkMode).toLowerCase()}
            {isAnomaly(checkMode) ? ` (${Math.round(severity * 100)}%)` : ''}
          </h3>
          {parsed.colors.length < 2 ? (
            <p className="text-sm text-gray-500">Enter at least two colours.</p>
          ) : pairs.length === 0 ? (
            <p className="text-sm text-emerald-700">
              ✓ No pairs fall below ΔE 10 — these colours stay distinguishable.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {pairs.map((p) => {
                const a = parsed.colors[p.a];
                const b = parsed.colors[p.b];
                return (
                  <li
                    key={`${p.a}-${p.b}`}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    <span aria-hidden className="text-amber-600">
                      ⚠
                    </span>
                    <span
                      className="inline-block h-4 w-4 rounded border border-gray-300"
                      style={{ background: a.hex }}
                      aria-hidden
                    />
                    <span className="font-mono">{a.hex}</span>
                    <span>and</span>
                    <span
                      className="inline-block h-4 w-4 rounded border border-gray-300"
                      style={{ background: b.hex }}
                      aria-hidden
                    />
                    <span className="font-mono">{b.hex}</span>
                    <span className="text-gray-600">
                      — ΔE {p.original.toFixed(0)} → {p.simulated.toFixed(1)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-xs text-gray-500">
            ΔE is the CIEDE2000 colour difference; under about 10 two colours
            are easy to confuse at a glance. Don’t rely on colour alone — add
            labels, patterns or icons too.
          </p>
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setPalette(DEMO_PALETTE.map(([c]) => c).join(' '))}
        >
          Use the demo palette
        </button>
      </section>
    </div>
  );
}

function Swatch({ hex }: { hex: string }) {
  return (
    <td className="py-1 pr-2">
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-6 w-10 rounded border border-gray-200"
          style={{ background: hex }}
          aria-hidden
        />
        <span className="font-mono text-gray-700">{hex}</span>
      </span>
    </td>
  );
}
