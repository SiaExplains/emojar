'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { RangeField, btnPrimary, btnSecondary } from '../ui';
import { CodePanel, nudge, useSvgDrag, type Point } from './playground-shared';
import { DraftNumberField } from './playground-shared';
import {
  bernstein,
  cssCubicBezier,
  deCasteljau,
  fmtNum,
  formula,
  substituted,
  svgPath,
} from '@/lib/online-tools/engines/bezier';

type Degree = 1 | 2 | 3;

const W = 400;
const H = 300;

const DEFAULTS: Record<Degree, Point[]> = {
  1: [
    { x: 60, y: 240 },
    { x: 340, y: 60 },
  ],
  2: [
    { x: 50, y: 250 },
    { x: 200, y: 30 },
    { x: 350, y: 250 },
  ],
  3: [
    { x: 40, y: 260 },
    { x: 110, y: 40 },
    { x: 300, y: 40 },
    { x: 360, y: 260 },
  ],
};

const DEGREE_NAME: Record<Degree, string> = {
  1: 'Linear',
  2: 'Quadratic',
  3: 'Cubic',
};
// Colours for each de Casteljau level (level 0 is the control polygon).
const LEVEL_COLORS = ['#9ca3af', '#10b981', '#f59e0b', '#ef4444'];
const sub = ['₀', '₁', '₂', '₃'];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

export default function BezierCurveTool(_: ToolProps) {
  const [degree, setDegree] = useState<Degree>(3);
  const [all, setAll] = useState<Record<Degree, Point[]>>(DEFAULTS);
  const [t, setT] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [sel, setSel] = useState(0);
  const reduced = usePrefersReducedMotion();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pts = all[degree];

  const setPoint = (i: number, p: Point) =>
    setAll((a) => ({
      ...a,
      [degree]: a[degree].map((q, j) =>
        j === i
          ? {
              x: Math.round(Math.min(W, Math.max(0, p.x))),
              y: Math.round(Math.min(H, Math.max(0, p.y))),
            }
          : q,
      ),
    }));

  const { start } = useSvgDrag<number>(svgRef, setPoint);

  // Play: sweep t from 0 to 1 over 3 s and loop. With reduced motion the
  // point jumps in tenths, twice a second, instead of gliding.
  useEffect(() => {
    if (!playing) return;
    if (reduced) {
      const id = window.setInterval(
        () => setT((v) => (v >= 1 ? 0 : Math.round((v + 0.1) * 10) / 10)),
        500,
      );
      return () => window.clearInterval(id);
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 3000;
      last = now;
      setT((v) => {
        const n = v + dt;
        return n > 1 ? 0 : n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  const levels = useMemo(() => deCasteljau(pts, t), [pts, t]);
  const bt = bernstein(pts, t);
  const d = svgPath(pts);
  const traced = useMemo(() => {
    const steps = 60;
    const out: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const p = bernstein(pts, (i / steps) * t);
      out.push(`${fmtNum(p.x, 2)},${fmtNum(p.y, 2)}`);
    }
    return out.join(' ');
  }, [pts, t]);
  const css = degree === 3 ? cssCubicBezier(pts) : null;
  const tangent = levels[levels.length - 2];

  const code = [
    `<path d="${d}" />`,
    '',
    formula(degree),
    `B(${fmtNum(t, 2)}) = (${fmtNum(bt.x, 2)}, ${fmtNum(bt.y, 2)})`,
    ...(css
      ? [
          '',
          `/* As a CSS timing function */`,
          `transition-timing-function: ${css};`,
        ]
      : []),
  ].join('\n');

  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Curve degree"
      >
        {([1, 2, 3] as Degree[]).map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={degree === g}
            onClick={() => {
              setDegree(g);
              setSel(0);
            }}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              degree === g
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
            }`}
          >
            {DEGREE_NAME[g]} ({g + 1} points)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-3">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="block w-full select-none"
              style={{ touchAction: 'none' }}
              role="group"
              aria-label={`${DEGREE_NAME[degree]} Bézier curve with draggable control points`}
            >
              <defs>
                <pattern
                  id="bz-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#f1f2f4"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width={W} height={H} fill="url(#bz-grid)" />
              {/* The whole curve, faint, and the part traced up to t. */}
              <path d={d} fill="none" stroke="#c7d2fe" strokeWidth={3} />
              <polyline
                points={traced}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={3.5}
                strokeLinecap="round"
              />
              {levels.slice(0, -1).map((lvl, k) => (
                <g key={k}>
                  <polyline
                    points={lvl.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={LEVEL_COLORS[k]}
                    strokeWidth={k === 0 ? 1.5 : 1.25}
                    strokeDasharray={k === 0 ? '5 4' : undefined}
                  />
                  {k > 0 &&
                    lvl.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={3.5}
                        fill={LEVEL_COLORS[k]}
                      />
                    ))}
                </g>
              ))}
              {tangent && tangent.length === 2 && (
                <line
                  x1={tangent[0].x}
                  y1={tangent[0].y}
                  x2={tangent[1].x}
                  y2={tangent[1].y}
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              )}
              <circle
                cx={bt.x}
                cy={bt.y}
                r={7}
                fill="#4f46e5"
                stroke="#fff"
                strokeWidth={2.5}
              />
              <text
                x={bt.x + 10}
                y={bt.y - 10}
                fontSize={12}
                fill="#312e81"
                fontWeight={600}
              >
                B(t)
              </text>
              {pts.map((p, i) => {
                const end = i === 0 || i === pts.length - 1;
                return (
                  <g
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-label={`Control point P${i}, x ${p.x}, y ${p.y}`}
                    aria-pressed={sel === i}
                    onPointerDown={(e) => {
                      setSel(i);
                      start(i)(e);
                    }}
                    onFocus={() => setSel(i)}
                    onKeyDown={(e) => {
                      const n = nudge(e, p);
                      if (n) setPoint(i, n);
                    }}
                    className="cursor-move outline-none"
                  >
                    <circle cx={p.x} cy={p.y} r={18} fill="transparent" />
                    {sel === i && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={12}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth={2}
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={7}
                      fill={end ? '#111827' : '#fff'}
                      stroke="#111827"
                      strokeWidth={2}
                    />
                    <text
                      x={p.x + 11}
                      y={p.y + 18}
                      fontSize={12}
                      fill="#374151"
                      pointerEvents="none"
                    >
                      P{sub[i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            Drag a point, or Tab to it and use the arrow keys (Shift moves 10).
            Filled points are the end points; hollow ones are control points.
            Coordinates are SVG units with y growing downwards.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1">
              <RangeField
                label="t"
                value={t}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => {
                  setPlaying(false);
                  setT(v);
                }}
                display={fmtNum(t, 2)}
              />
            </div>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? '❚❚ Pause' : '▶ Play'}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setAll((a) => ({ ...a, [degree]: DEFAULTS[degree] }));
                setT(0.5);
                setPlaying(false);
              }}
            >
              Reset
            </button>
          </div>
          {reduced && playing && (
            <p className="text-xs text-gray-500">
              Reduced motion is on, so the animation steps in tenths.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Control points
            </h2>
            {pts.map((p, i) => (
              <fieldset
                key={i}
                className="grid grid-cols-[2rem_1fr_1fr] items-end gap-2"
              >
                <legend className="sr-only">Point P{i}</legend>
                <span
                  className="pb-2 text-sm font-semibold text-gray-700"
                  aria-hidden
                >
                  P{sub[i]}
                </span>
                <DraftNumberField
                  label={`x`}
                  value={p.x}
                  min={0}
                  max={W}
                  decimals={0}
                  onCommit={(x) => setPoint(i, { x, y: p.y })}
                />
                <DraftNumberField
                  label={`y`}
                  value={p.y}
                  min={0}
                  max={H}
                  decimals={0}
                  onCommit={(y) => setPoint(i, { x: p.x, y })}
                />
              </fieldset>
            ))}
          </section>
          <section
            className="space-y-2 rounded-2xl border border-gray-100 p-4 text-sm"
            aria-live="polite"
          >
            <h2 className="text-sm font-semibold text-gray-900">
              At t = {fmtNum(t, 2)}
            </h2>
            <p className="font-mono text-xs text-gray-800">
              B(t) = ({fmtNum(bt.x, 1)}, {fmtNum(bt.y, 1)})
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              {levels.slice(1).map((lvl, k) => (
                <li key={k} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        k + 1 === levels.length - 1
                          ? '#4f46e5'
                          : LEVEL_COLORS[k + 1],
                    }}
                    aria-hidden
                  />
                  Level {k + 1}: {lvl.length} point{lvl.length > 1 ? 's' : ''}
                  {lvl.length === 1 ? ' — the curve point' : ''}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="space-y-2 rounded-2xl border border-gray-100 p-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Formula ({DEGREE_NAME[degree].toLowerCase()}, Bernstein form)
        </h2>
        <p className="overflow-x-auto whitespace-nowrap font-mono text-sm text-gray-900">
          {formula(degree)}
        </p>
        <div className="overflow-x-auto">
          <p className="whitespace-nowrap font-mono text-xs text-gray-700">
            {substituted(pts, t, 'x')}
          </p>
          <p className="whitespace-nowrap font-mono text-xs text-gray-700">
            {substituted(pts, t, 'y')}
          </p>
        </div>
        {degree === 3 && !css && (
          <p className="text-xs text-gray-500">
            No CSS cubic-bezier() equivalent: the end points must differ in both
            x and y, and both control points must lie between them horizontally.
          </p>
        )}
      </section>

      <CodePanel css={code} title="SVG path & values" copyLabel="Copy" />

      <section className="space-y-2 text-sm leading-relaxed text-gray-700">
        <h2 className="text-base font-semibold text-gray-900">
          How control points shape the curve
        </h2>
        <p>
          A Bézier curve always starts at the first point and ends at the last
          one — those end points lie on the curve. The points in between are
          “magnets”: the curve is pulled towards them but usually doesn’t touch
          them. The further a control point is from the line between the ends,
          the stronger the bend.
        </p>
        <p>
          At each end the curve leaves along the control polygon: its direction
          at P₀ points towards P₁, and at the end it arrives from the direction
          of the last control point. That’s why designers line up control points
          on either side of a joint to make two curves join smoothly.
        </p>
        <p>
          de Casteljau’s construction shows how a point on the curve is found:
          split every polygon edge at the same fraction t, join the new points,
          and repeat until one point is left — that point is B(t), and the last
          line (red) is the tangent there. The Bernstein formula gives the same
          result as a weighted average of the control points, with weights that
          always add up to 1.
        </p>
      </section>
    </div>
  );
}
