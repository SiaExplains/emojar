'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import {
  POLYGON_PRESETS,
  circleValue,
  clamp,
  ellipseValue,
  insertPoint,
  insetValue,
  num,
  polygonCss,
  polygonValue,
  snapTo,
  type Pt,
} from '@/lib/online-tools/engines/css-generators';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  NumberField,
  RangeField,
  SelectField,
  btnSecondary,
} from '../ui';
import { CodePanel, nudge, useSvgDrag } from './playground-shared';

type Shape = 'polygon' | 'circle' | 'ellipse' | 'inset';
type DragKey = number | 'center';

const BACKGROUNDS: Record<string, { label: string; css: string }> = {
  sunset: {
    label: 'Sunset gradient',
    css: 'linear-gradient(135deg, #f97316, #ec4899 50%, #6366f1)',
  },
  ocean: {
    label: 'Ocean gradient',
    css: 'linear-gradient(160deg, #22d3ee, #3b82f6 55%, #1e3a8a)',
  },
  pattern: {
    label: 'Checker pattern',
    css: 'repeating-conic-gradient(#6366f1 0 25%, #c7d2fe 0 50%) 0 0 / 40px 40px',
  },
};

const DEFAULT_POINTS = POLYGON_PRESETS[0].points;
const DEFAULTS = {
  circle: { r: 40, cx: 50, cy: 50 },
  ellipse: { rx: 45, ry: 30, cx: 50, cy: 50 },
  inset: { t: 10, r: 10, b: 10, l: 10, round: 0 },
};

const fmt = (n: number) => Number(num(n, 1));

export default function ClipPathTool(_: ToolProps) {
  const [shape, setShape] = useState<Shape>('polygon');
  const [points, setPoints] = useState<Pt[]>(DEFAULT_POINTS);
  const [sel, setSel] = useState<number | null>(null);
  const [snap, setSnap] = useState(0);
  const [circle, setCircle] = useState(DEFAULTS.circle);
  const [ellipse, setEllipse] = useState(DEFAULTS.ellipse);
  const [inset, setInset] = useState(DEFAULTS.inset);
  const [bg, setBg] = useState('sunset');
  const [outline, setOutline] = useState(true);
  const [status, setStatus] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const handleRefs = useRef<(SVGCircleElement | null)[]>([]);

  const place = (p: Pt): Pt => ({
    x: fmt(clamp(snapTo(p.x, snap), 0, 100)),
    y: fmt(clamp(snapTo(p.y, snap), 0, 100)),
  });

  const movePoint = (key: DragKey, p: Pt) => {
    const q = place(p);
    if (key === 'center') {
      if (shape === 'circle') setCircle((c) => ({ ...c, cx: q.x, cy: q.y }));
      if (shape === 'ellipse') setEllipse((c) => ({ ...c, cx: q.x, cy: q.y }));
      return;
    }
    setPoints((ps) => ps.map((pt, i) => (i === key ? q : pt)));
  };
  const { start, toSvg } = useSvgDrag<DragKey>(svgRef, movePoint);

  const removePoint = (i: number) => {
    if (points.length <= 3) {
      setStatus('A polygon needs at least 3 points.');
      return;
    }
    setPoints((ps) => ps.filter((_, k) => k !== i));
    setSel(null);
    setStatus(`Point ${i + 1} removed.`);
  };
  const addAfterSelected = () => {
    // Midpoint of the edge after the selected (or last) point.
    const i = sel ?? points.length - 1;
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const p = place({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    setPoints((ps) => [...ps.slice(0, i + 1), p, ...ps.slice(i + 1)]);
    setSel(i + 1);
    setStatus(`Point ${i + 2} added.`);
  };

  const value =
    shape === 'polygon'
      ? polygonValue(points)
      : shape === 'circle'
        ? circleValue(circle.r, circle.cx, circle.cy)
        : shape === 'ellipse'
          ? ellipseValue(ellipse.rx, ellipse.ry, ellipse.cx, ellipse.cy)
          : insetValue(inset.t, inset.r, inset.b, inset.l, inset.round);
  const css = shape === 'polygon' ? polygonCss(points) : `clip-path: ${value};`;

  const reset = () => {
    setPoints(DEFAULT_POINTS);
    setCircle(DEFAULTS.circle);
    setEllipse(DEFAULTS.ellipse);
    setInset(DEFAULTS.inset);
    setSel(null);
    setSnap(0);
    setStatus('Reset.');
  };

  const range = (
    label: string,
    v: number,
    on: (n: number) => void,
    min = 0,
    max = 100,
  ) => (
    <RangeField
      key={label}
      label={label}
      value={v}
      onChange={on}
      min={min}
      max={max}
      display={`${v}%`}
    />
  );

  const centre =
    shape === 'circle' ? circle : shape === 'ellipse' ? ellipse : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Shape"
              value={shape}
              onChange={(v) => {
                setShape(v as Shape);
                setSel(null);
              }}
              options={[
                { value: 'polygon', label: 'Polygon' },
                { value: 'circle', label: 'Circle' },
                { value: 'ellipse', label: 'Ellipse' },
                { value: 'inset', label: 'Inset' },
              ]}
            />
            <SelectField
              label="Sample"
              value={bg}
              onChange={setBg}
              options={Object.entries(BACKGROUNDS).map(([value, b]) => ({
                value,
                label: b.label,
              }))}
            />
          </div>

          {shape === 'polygon' && (
            <>
              <div>
                <h2 className="mb-2 text-sm font-semibold text-gray-900">
                  Presets
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {POLYGON_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      className={`${btnSecondary} !px-2.5 !py-1.5 text-xs`}
                      onClick={() => {
                        setPoints(p.points);
                        setSel(null);
                        setStatus(`${p.name} loaded.`);
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <SelectField
                label="Snap to grid"
                value={String(snap)}
                onChange={(v) => setSnap(Number(v))}
                options={[
                  { value: '0', label: 'Off' },
                  { value: '5', label: '5%' },
                  { value: '10', label: '10%' },
                ]}
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Points ({points.length})
                  </h2>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={addAfterSelected}
                  >
                    + Add point
                  </button>
                </div>
                <ol className="max-h-72 space-y-1.5 overflow-auto pr-1">
                  {points.map((p, i) => (
                    <li
                      key={i}
                      className={`grid grid-cols-[1.5rem_1fr_1fr_auto] items-end gap-2 rounded-lg p-1 ${sel === i ? 'bg-brand-50' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSel(i);
                          handleRefs.current[i]?.focus();
                        }}
                        className="pb-2 text-left text-xs font-semibold text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        aria-label={`Select point ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                      <NumberField
                        label={`Point ${i + 1} x (%)`}
                        value={p.x}
                        min={0}
                        max={100}
                        step="any"
                        onChange={(v) => {
                          const n = Number(v);
                          if (v !== '' && Number.isFinite(n))
                            setPoints((ps) =>
                              ps.map((q, k) =>
                                k === i
                                  ? { ...q, x: fmt(clamp(n, 0, 100)) }
                                  : q,
                              ),
                            );
                        }}
                        className="[&>label]:sr-only"
                      />
                      <NumberField
                        label={`Point ${i + 1} y (%)`}
                        value={p.y}
                        min={0}
                        max={100}
                        step="any"
                        onChange={(v) => {
                          const n = Number(v);
                          if (v !== '' && Number.isFinite(n))
                            setPoints((ps) =>
                              ps.map((q, k) =>
                                k === i
                                  ? { ...q, y: fmt(clamp(n, 0, 100)) }
                                  : q,
                              ),
                            );
                        }}
                        className="[&>label]:sr-only"
                      />
                      <button
                        type="button"
                        className={`${btnSecondary} !px-2.5`}
                        onClick={() => removePoint(i)}
                        disabled={points.length <= 3}
                        aria-label={`Delete point ${i + 1}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-500">
                  x and y are in % of the element.
                </p>
              </div>
            </>
          )}

          {shape === 'circle' && (
            <div className="space-y-3">
              {range(
                'Radius',
                circle.r,
                (r) => setCircle((c) => ({ ...c, r })),
                0,
                75,
              )}
              {range('Centre x', circle.cx, (cx) =>
                setCircle((c) => ({ ...c, cx })),
              )}
              {range('Centre y', circle.cy, (cy) =>
                setCircle((c) => ({ ...c, cy })),
              )}
            </div>
          )}
          {shape === 'ellipse' && (
            <div className="space-y-3">
              {range('Horizontal radius', ellipse.rx, (rx) =>
                setEllipse((c) => ({ ...c, rx })),
              )}
              {range('Vertical radius', ellipse.ry, (ry) =>
                setEllipse((c) => ({ ...c, ry })),
              )}
              {range('Centre x', ellipse.cx, (cx) =>
                setEllipse((c) => ({ ...c, cx })),
              )}
              {range('Centre y', ellipse.cy, (cy) =>
                setEllipse((c) => ({ ...c, cy })),
              )}
            </div>
          )}
          {shape === 'inset' && (
            <div className="space-y-3">
              {range(
                'Top',
                inset.t,
                (t) => setInset((c) => ({ ...c, t })),
                0,
                50,
              )}
              {range(
                'Right',
                inset.r,
                (r) => setInset((c) => ({ ...c, r })),
                0,
                50,
              )}
              {range(
                'Bottom',
                inset.b,
                (b) => setInset((c) => ({ ...c, b })),
                0,
                50,
              )}
              {range(
                'Left',
                inset.l,
                (l) => setInset((c) => ({ ...c, l })),
                0,
                50,
              )}
              {range(
                'Corner round',
                inset.round,
                (round) => setInset((c) => ({ ...c, round })),
                0,
                50,
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="mx-auto w-full max-w-md">
            <div className="relative aspect-square w-full select-none">
              <div
                className="absolute inset-0 rounded-sm opacity-20"
                style={{ background: BACKGROUNDS[bg].css }}
                aria-hidden
              />
              <div
                className="absolute inset-0"
                style={{ background: BACKGROUNDS[bg].css, clipPath: value }}
                role="img"
                aria-label={`Sample clipped with clip-path: ${value}`}
              />
              <svg
                ref={svgRef}
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full overflow-visible"
                style={{ touchAction: 'none' }}
              >
                <rect
                  x={0}
                  y={0}
                  width={100}
                  height={100}
                  fill="transparent"
                  stroke="#9ca3af"
                  strokeWidth={0.4}
                  strokeDasharray="1.5 1.5"
                  className={shape === 'polygon' ? 'cursor-crosshair' : ''}
                  onPointerDown={(e) => {
                    if (shape !== 'polygon') return;
                    const p = toSvg(e.clientX, e.clientY);
                    if (!p) return;
                    const r = insertPoint(points, place(p));
                    setPoints(r.points);
                    setSel(r.index);
                    setStatus(`Point ${r.index + 1} added.`);
                    start(r.index)(e);
                  }}
                />
                {snap > 0 &&
                  shape === 'polygon' &&
                  Array.from(
                    { length: 100 / snap - 1 },
                    (_, i) => (i + 1) * snap,
                  ).map((g) => (
                    <g
                      key={g}
                      stroke="#ffffff"
                      strokeOpacity={0.35}
                      strokeWidth={0.2}
                      pointerEvents="none"
                    >
                      <line x1={g} y1={0} x2={g} y2={100} />
                      <line x1={0} y1={g} x2={100} y2={g} />
                    </g>
                  ))}
                {outline && (
                  <g
                    fill="none"
                    stroke="#111827"
                    strokeWidth={0.6}
                    pointerEvents="none"
                  >
                    {shape === 'polygon' && (
                      <polygon
                        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                      />
                    )}
                    {shape === 'circle' && (
                      <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
                    )}
                    {shape === 'ellipse' && (
                      <ellipse
                        cx={ellipse.cx}
                        cy={ellipse.cy}
                        rx={ellipse.rx}
                        ry={ellipse.ry}
                      />
                    )}
                    {shape === 'inset' && (
                      <rect
                        x={inset.l}
                        y={inset.t}
                        width={Math.max(0, 100 - inset.l - inset.r)}
                        height={Math.max(0, 100 - inset.t - inset.b)}
                        rx={inset.round}
                      />
                    )}
                  </g>
                )}
                {shape === 'polygon' &&
                  points.map((p, i) => (
                    <g key={i}>
                      <circle
                        ref={(el) => {
                          handleRefs.current[i] = el;
                        }}
                        cx={p.x}
                        cy={p.y}
                        r={4.5}
                        fill="transparent"
                        tabIndex={0}
                        role="button"
                        aria-label={`Point ${i + 1} at ${p.x}%, ${p.y}%. Arrow keys move it, Delete removes it.`}
                        aria-pressed={sel === i}
                        onPointerDown={(e) => {
                          setSel(i);
                          start(i)(e);
                        }}
                        onFocus={() => setSel(i)}
                        onKeyDown={(e: KeyboardEvent) => {
                          if (e.key === 'Delete' || e.key === 'Backspace') {
                            e.preventDefault();
                            removePoint(i);
                            return;
                          }
                          const next = nudge(e, p, snap || 1);
                          if (next) movePoint(i, next);
                        }}
                        className="peer cursor-grab outline-none"
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={sel === i ? 2.6 : 2}
                        className={`${sel === i ? 'fill-brand-600' : 'fill-white'} peer-focus-visible:[stroke-width:1.4] peer-focus-visible:[stroke:#4f46e5]`}
                        stroke="#111827"
                        strokeWidth={0.6}
                        pointerEvents="none"
                      />
                      <text
                        x={p.x + 3}
                        y={p.y - 3}
                        fontSize={3.5}
                        fill="#111827"
                        stroke="#ffffff"
                        strokeWidth={0.8}
                        paintOrder="stroke"
                        pointerEvents="none"
                      >
                        {i + 1}
                      </text>
                    </g>
                  ))}
                {centre && (
                  <circle
                    cx={centre.cx}
                    cy={centre.cy}
                    r={2.5}
                    tabIndex={0}
                    role="button"
                    aria-label={`Centre at ${centre.cx}%, ${centre.cy}%. Arrow keys move it.`}
                    className="cursor-grab fill-white outline-none focus-visible:fill-brand-500"
                    stroke="#111827"
                    strokeWidth={0.6}
                    onPointerDown={start('center')}
                    onKeyDown={(e: KeyboardEvent) => {
                      const next = nudge(e, { x: centre.cx, y: centre.cy });
                      if (next) movePoint('center', next);
                    }}
                  />
                )}
              </svg>
            </div>
          </div>
          {shape === 'polygon' && (
            <p className="text-xs text-gray-500">
              Click or tap empty space to add a point on the nearest edge. Drag
              points to move them. Select a point with Tab and use the arrow
              keys (Shift ×10) to nudge it, or Delete to remove it.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Checkbox
              label="Show outline"
              checked={outline}
              onChange={setOutline}
            />
            {shape === 'polygon' && sel !== null && points[sel] && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => removePoint(sel)}
                disabled={points.length <= 3}
              >
                Delete point {sel + 1}
              </button>
            )}
            <button type="button" className={btnSecondary} onClick={reset}>
              Reset
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
          <CodePanel css={css} />
        </div>
      </div>
    </div>
  );
}
