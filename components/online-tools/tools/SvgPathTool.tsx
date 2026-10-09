'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  DownloadButton,
  ErrorMessage,
  NumberField,
  SelectField,
  btnPrimary,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';
import { CodePanel, nudge, useSvgDrag, type Point } from './playground-shared';
import { ColorInput, DraftNumberField } from './playground-shared';
import {
  EXAMPLES,
  fmt,
  handlesOf,
  insertSegment,
  isClosed,
  movePoint,
  parsePath,
  removeSegment,
  serializePath,
  setClosed,
  startOf,
  svgMarkup,
  type HandleKey,
  type Segment,
  type SegmentType,
} from '@/lib/online-tools/engines/svg-path';

type Linecap = 'butt' | 'round' | 'square';
type Linejoin = 'miter' | 'round' | 'bevel';
type Sel = { seg: number; key: HandleKey } | null;

const SEG_LABEL: Record<SegmentType, string> = {
  M: 'Move',
  L: 'Line',
  Q: 'Quadratic',
  C: 'Cubic',
  A: 'Arc',
  Z: 'Close',
};
const KEY_LABEL: Record<HandleKey, string> = {
  end: 'end point',
  c1: 'control point 1',
  c2: 'control point 2',
};

const initial = () => {
  const r = parsePath(EXAMPLES.heart);
  return r.ok ? r.segments : [];
};

export default function SvgPathTool(_: ToolProps) {
  const [segs, setSegs] = useState<Segment[]>(initial);
  const [sel, setSel] = useState<Sel>({ seg: 0, key: 'end' });
  const [size, setSize] = useState({ w: 200, h: 200 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<Point>({ x: 100, y: 100 });
  const [snap, setSnap] = useState(true);
  const [gridStep, setGridStep] = useState(10);
  const [decimals, setDecimals] = useState(1);
  const [stroke, setStroke] = useState('#4f46e5');
  const [fill, setFill] = useState('#c7d2fe');
  const [noFill, setNoFill] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [linecap, setLinecap] = useState<Linecap>('round');
  const [linejoin, setLinejoin] = useState<Linejoin>('round');
  const [newType, setNewType] = useState<SegmentType>('C');
  const [pasted, setPasted] = useState('');
  const [pasteError, setPasteError] = useState('');
  const [status, setStatus] = useState('');
  const svgRef = useRef<SVGSVGElement | null>(null);

  const W = Math.max(10, size.w);
  const H = Math.max(10, size.h);
  // A 6% margin keeps handles at the edges grabbable.
  const vw = (W * 1.12) / zoom;
  const vh = (H * 1.12) / zoom;
  const view = { x: center.x - vw / 2, y: center.y - vh / 2, w: vw, h: vh };
  const unit = vw / 200;

  const snapV = (v: number) =>
    snap ? Math.round(v / gridStep) * gridStep : Math.round(v * 100) / 100;

  const { start } = useSvgDrag<NonNullable<Sel>>(svgRef, (key, p) => {
    setSegs((s) =>
      movePoint(s, key.seg, key.key, { x: snapV(p.x), y: snapV(p.y) }),
    );
  });

  const handles = useMemo(() => handlesOf(segs), [segs]);
  const selected = sel
    ? handles.find((h) => h.seg === sel.seg && h.key === sel.key)
    : undefined;
  const selSeg = sel ? segs[sel.seg] : undefined;

  const d = serializePath(segs, decimals);
  const style = {
    stroke,
    fill: noFill ? 'none' : fill,
    strokeWidth,
    linecap,
    linejoin,
  };
  const markup = svgMarkup(d, { w: W, h: H }, style);

  // Ctrl/⌘ + wheel (and trackpad pinch, which sends ctrlKey) zooms; a plain
  // wheel keeps scrolling the page. Non-passive so the zoom can cancel it.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) => clampZoom(e.deltaY < 0 ? z * 1.15 : z / 1.15));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Panning: drag the empty canvas.
  const pan = useRef<{ id: number; x: number; y: number; c: Point } | null>(
    null,
  );
  const onBgDown = (e: ReactPointerEvent<SVGRectElement>) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pan.current = { id: e.pointerId, x: e.clientX, y: e.clientY, c: center };
  };
  const onBgMove = (e: ReactPointerEvent<SVGRectElement>) => {
    const p = pan.current;
    const el = svgRef.current;
    if (!p || p.id !== e.pointerId || !el) return;
    const k = vw / Math.max(1, el.clientWidth);
    setCenter({
      x: p.c.x - (e.clientX - p.x) * k,
      y: p.c.y - (e.clientY - p.y) * k,
    });
  };
  const onBgUp = (e: ReactPointerEvent<SVGRectElement>) => {
    const p = pan.current;
    pan.current = null;
    // A click without movement clears the selection.
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 3) setSel(null);
  };

  const resetView = () => {
    setZoom(1);
    setCenter({ x: W / 2, y: H / 2 });
  };

  const setPoint = (axis: 'x' | 'y', n: number) => {
    if (!sel || !selected) return;
    setSegs((s) =>
      movePoint(s, sel.seg, sel.key, {
        x: axis === 'x' ? n : selected.x,
        y: axis === 'y' ? n : selected.y,
      }),
    );
  };

  const onHandleKey =
    (h: { seg: number; key: HandleKey; x: number; y: number }) =>
    (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSeg(h.seg);
        return;
      }
      const p = nudge(e, h, snap ? gridStep : 1);
      if (!p) return;
      setSel({ seg: h.seg, key: h.key });
      setSegs((s) => movePoint(s, h.seg, h.key, p));
    };

  const selectSeg = (i: number) => {
    const s = segs[i];
    setSel(s && s.type !== 'Z' ? { seg: i, key: 'end' } : null);
  };

  const addSeg = (after: number) => {
    if (!segs.length) {
      setSegs([{ type: 'M', x: snapV(W / 2), y: snapV(H / 2) }]);
      setSel({ seg: 0, key: 'end' });
      setStatus('Added a start point. Add more segments to draw.');
      return;
    }
    // A closing Z stays last: insert before it when adding "at the end".
    const end =
      after >= segs.length - 1 && isClosed(segs) ? segs.length - 2 : after;
    const next = insertSegment(segs, end, newType, gridStep * 2, {
      w: W,
      h: H,
    });
    setSegs(next);
    setSel({ seg: end + 1, key: 'end' });
    setStatus(`Added a ${SEG_LABEL[newType].toLowerCase()} segment.`);
  };

  const deleteSeg = (i: number) => {
    setSegs((s) => removeSegment(s, i));
    setSel(null);
    setStatus(`Deleted segment ${i + 1}.`);
  };

  const loadPasted = () => {
    const r = parsePath(pasted);
    if (!r.ok) return setPasteError(r.error);
    if (!r.segments.length)
      return setPasteError('Paste some path data first, e.g. M 10 10 L 90 90.');
    setPasteError('');
    setSegs(r.segments);
    setSel(null);
    setStatus(`Loaded ${r.segments.length} segments.`);
  };

  const loadExample = (name: string) => {
    const r = parsePath(EXAMPLES[name]);
    if (!r.ok) return;
    setSize({ w: 200, h: 200 });
    setSegs(r.segments);
    setSel(null);
    setZoom(1);
    setCenter({ x: 100, y: 100 });
    setStatus(`Loaded the ${name} example.`);
  };

  // Grid lines, with every fifth line darker.
  const gridLines = useMemo(() => {
    const lines: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      major: boolean;
    }[] = [];
    const step = Math.max(1, gridStep);
    if (W / step > 400 || H / step > 400) return lines;
    for (let x = 0, i = 0; x <= W + 1e-9; x += step, i++)
      lines.push({ x1: x, y1: 0, x2: x, y2: H, major: i % 5 === 0 });
    for (let y = 0, i = 0; y <= H + 1e-9; y += step, i++)
      lines.push({ x1: 0, y1: y, x2: W, y2: y, major: i % 5 === 0 });
    return lines;
  }, [W, H, gridStep]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setZoom((z) => clampZoom(z * 1.25))}
              aria-label="Zoom in"
            >
              ＋
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setZoom((z) => clampZoom(z / 1.25))}
              aria-label="Zoom out"
            >
              −
            </button>
            <button type="button" className={btnSecondary} onClick={resetView}>
              Fit view
            </button>
            <span className="text-sm tabular-nums text-gray-600">
              {Math.round(zoom * 100)}%
            </span>
            <span className="ml-auto text-xs text-gray-500">
              Drag points · drag empty space to pan · Ctrl/⌘ + wheel or pinch to
              zoom
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <svg
              ref={svgRef}
              viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
              className="block max-h-[70vh] w-full select-none"
              style={{ touchAction: 'none', aspectRatio: `${W} / ${H}` }}
              role="group"
              aria-label="Path editing canvas"
            >
              <rect
                x={view.x}
                y={view.y}
                width={view.w}
                height={view.h}
                fill="#f9fafb"
                onPointerDown={onBgDown}
                onPointerMove={onBgMove}
                onPointerUp={onBgUp}
                onPointerCancel={() => (pan.current = null)}
                style={{ cursor: 'grab' }}
              />
              <rect
                x={0}
                y={0}
                width={W}
                height={H}
                fill="#fff"
                pointerEvents="none"
              />
              <g pointerEvents="none">
                {gridLines.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke={l.major ? '#d1d5db' : '#eef0f3'}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <rect
                  x={0}
                  y={0}
                  width={W}
                  height={H}
                  fill="none"
                  stroke="#9ca3af"
                  strokeDasharray="4 3"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
                {d && (
                  <path
                    d={d}
                    fill={style.fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap={linecap}
                    strokeLinejoin={linejoin}
                  />
                )}
                {segs.map((s, i) => {
                  if (s.type !== 'Q' && s.type !== 'C') return null;
                  const from = startOf(segs, i);
                  const c2 = s.type === 'C' ? { x: s.x2, y: s.y2 } : null;
                  const lineProps = {
                    stroke: '#d97706',
                    strokeWidth: 1.5,
                    vectorEffect: 'non-scaling-stroke' as const,
                    strokeDasharray: '3 2',
                  };
                  return (
                    <g key={i}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={s.x1}
                        y2={s.y1}
                        {...lineProps}
                      />
                      <line
                        x1={c2 ? c2.x : s.x1}
                        y1={c2 ? c2.y : s.y1}
                        x2={s.x}
                        y2={s.y}
                        {...lineProps}
                      />
                    </g>
                  );
                })}
              </g>
              {handles.map((h) => {
                const isSel = sel?.seg === h.seg && sel.key === h.key;
                const ctrl = h.key !== 'end';
                const r = (ctrl ? 3 : 3.6) * unit;
                const k = { seg: h.seg, key: h.key };
                return (
                  <g
                    key={`${h.seg}-${h.key}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Segment ${h.seg + 1} ${KEY_LABEL[h.key]}, x ${fmt(h.x, 1)}, y ${fmt(h.y, 1)}`}
                    aria-pressed={isSel}
                    onPointerDown={(e) => {
                      setSel(k);
                      start(k)(e);
                    }}
                    onFocus={() => setSel(k)}
                    onKeyDown={onHandleKey(h)}
                    className="cursor-move outline-none"
                  >
                    <circle cx={h.x} cy={h.y} r={r * 3} fill="transparent" />
                    {isSel && (
                      <circle
                        cx={h.x}
                        cy={h.y}
                        r={r * 2}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth={2}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                    {ctrl ? (
                      <rect
                        x={h.x - r}
                        y={h.y - r}
                        width={r * 2}
                        height={r * 2}
                        fill={isSel ? '#f59e0b' : '#fff'}
                        stroke="#b45309"
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                        transform={`rotate(45 ${h.x} ${h.y})`}
                      />
                    ) : (
                      <circle
                        cx={h.x}
                        cy={h.y}
                        r={r}
                        fill={isSel ? '#4f46e5' : '#fff'}
                        stroke="#4f46e5"
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-gray-500">
            Circles are end points, diamonds are Bézier control points. Tab to a
            point and use the arrow keys to move it (Shift for ×10), Delete to
            remove its segment.
          </p>
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
        </div>

        <div className="space-y-4">
          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              {selected && sel
                ? `Segment ${sel.seg + 1} · ${KEY_LABEL[sel.key]}`
                : 'No point selected'}
            </h2>
            {selected ? (
              <div className="grid grid-cols-2 gap-3">
                <DraftNumberField
                  label="x"
                  value={selected.x}
                  onCommit={(n) => setPoint('x', n)}
                />
                <DraftNumberField
                  label="y"
                  value={selected.y}
                  onCommit={(n) => setPoint('y', n)}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Click or tab to a point, or pick a segment below.
              </p>
            )}
            {selSeg?.type === 'A' && sel && (
              <ArcFields
                seg={selSeg}
                onChange={(patch) =>
                  setSegs((s) =>
                    s.map((x, i) =>
                      i === sel.seg && x.type === 'A' ? { ...x, ...patch } : x,
                    ),
                  )
                }
              />
            )}
          </section>

          <section className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Segments</h2>
            <SelectField
              label="New segment type"
              value={newType}
              onChange={(v) => setNewType(v as SegmentType)}
              options={(['L', 'Q', 'C', 'A', 'M'] as SegmentType[]).map(
                (t) => ({ value: t, label: `${SEG_LABEL[t]} (${t})` }),
              )}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() => addSeg(segs.length - 1)}
              >
                Add at end
              </button>
              <button
                type="button"
                className={btnSecondary}
                disabled={!sel}
                onClick={() => sel && addSeg(sel.seg)}
              >
                Insert after selected
              </button>
              <button
                type="button"
                className={btnSecondary}
                disabled={!sel}
                onClick={() => sel && deleteSeg(sel.seg)}
              >
                Delete selected
              </button>
            </div>
            <Checkbox
              label="Close path (Z)"
              checked={isClosed(segs)}
              onChange={(v) => setSegs((s) => setClosed(s, v))}
            />
            {segs.length > 0 && (
              <ol
                className="max-h-48 space-y-1 overflow-auto text-xs"
                aria-label="Segment list"
              >
                {segs.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => selectSeg(i)}
                      aria-pressed={sel?.seg === i}
                      disabled={s.type === 'Z'}
                      className={`w-full rounded-lg px-2 py-1 text-left font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        sel?.seg === i
                          ? 'bg-brand-50 text-brand-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}. {serializePath([s], 1)}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl border border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 className="text-sm font-semibold text-gray-900 sm:col-span-2 lg:col-span-4">
          Canvas &amp; style
        </h2>
        <NumberField
          label="viewBox width"
          value={size.w}
          min={10}
          max={2000}
          onChange={(v) => setSize((s) => ({ ...s, w: clampSize(v, s.w) }))}
        />
        <NumberField
          label="viewBox height"
          value={size.h}
          min={10}
          max={2000}
          onChange={(v) => setSize((s) => ({ ...s, h: clampSize(v, s.h) }))}
        />
        <SelectField
          label="Grid size"
          value={String(gridStep)}
          onChange={(v) => setGridStep(Number(v))}
          options={[1, 2, 5, 10, 20, 25, 50].map((n) => ({
            value: String(n),
            label: `${n} units`,
          }))}
        />
        <div className="flex items-end pb-2">
          <Checkbox label="Snap to grid" checked={snap} onChange={setSnap} />
        </div>
        <ColorInput label="Stroke colour" value={stroke} onChange={setStroke} />
        <div className="space-y-1.5">
          <ColorInput
            label="Fill colour"
            value={fill}
            onChange={setFill}
            disabled={noFill}
          />
          <Checkbox label="No fill" checked={noFill} onChange={setNoFill} />
        </div>
        <DraftNumberField
          label="Stroke width"
          value={strokeWidth}
          min={0}
          max={100}
          step={0.5}
          onCommit={setStrokeWidth}
        />
        <SelectField
          label="Decimals in output"
          value={String(decimals)}
          onChange={(v) => setDecimals(Number(v))}
          options={[0, 1, 2, 3].map((n) => ({
            value: String(n),
            label: String(n),
          }))}
        />
        <SelectField
          label="Line cap"
          value={linecap}
          onChange={(v) => setLinecap(v as Linecap)}
          options={['butt', 'round', 'square'].map((v) => ({
            value: v,
            label: v,
          }))}
        />
        <SelectField
          label="Line join"
          value={linejoin}
          onChange={(v) => setLinejoin(v as Linejoin)}
          options={['miter', 'round', 'bevel'].map((v) => ({
            value: v,
            label: v,
          }))}
        />
      </section>

      <section className="space-y-2">
        <label htmlFor="svg-path-paste" className={labelBase}>
          Paste path data (d attribute)
        </label>
        <textarea
          id="svg-path-paste"
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={3}
          spellCheck={false}
          placeholder="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
          className={`${inputBase} font-mono text-[13px]`}
        />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnPrimary} onClick={loadPasted}>
            Load path
          </button>
          <span className="self-center text-xs text-gray-500">
            Relative commands and H, V, S, T shorthands are converted to
            absolute M, L, Q, C and A.
          </span>
        </div>
        <ErrorMessage>{pasteError}</ErrorMessage>
      </section>

      <div className="flex flex-wrap gap-2">
        <SelectField
          label="Reset to example"
          value=""
          onChange={(v) => v && loadExample(v)}
          options={[
            { value: '', label: 'Choose…' },
            { value: 'heart', label: 'Heart' },
            { value: 'wave', label: 'Wave' },
            { value: 'star', label: 'Star' },
          ]}
          className="w-44"
        />
        <div className="flex items-end gap-2">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => loadExample('heart')}
          >
            Reset
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setSegs([]);
              setSel(null);
              setStatus('Cleared the path.');
            }}
          >
            Clear
          </button>
          <DownloadButton
            data={segs.length ? markup : null}
            filename="path.svg"
            type="image/svg+xml"
            label="Download SVG"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <CodePanel css={d} title="Path data (d)" copyLabel="Copy path" />
        <CodePanel css={markup} title="SVG markup" copyLabel="Copy SVG" />
      </div>
    </div>
  );
}

const clampZoom = (z: number) => Math.min(12, Math.max(0.25, z));

function clampSize(v: string, fallback: number) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(2000, Math.max(10, n));
}

function ArcFields({
  seg,
  onChange,
}: {
  seg: Extract<Segment, { type: 'A' }>;
  onChange: (p: Partial<Extract<Segment, { type: 'A' }>>) => void;
}) {
  const num = (k: 'rx' | 'ry' | 'rotation') => (n: number) =>
    onChange({ [k]: k === 'rotation' ? n : Math.abs(n) });
  return (
    <div className="space-y-3 border-t border-gray-100 pt-3">
      <div className="grid grid-cols-3 gap-2">
        <DraftNumberField label="rx" value={seg.rx} onCommit={num('rx')} />
        <DraftNumberField label="ry" value={seg.ry} onCommit={num('ry')} />
        <DraftNumberField
          label="Rotate"
          value={seg.rotation}
          onCommit={num('rotation')}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="Large arc"
          checked={seg.largeArc}
          onChange={(v) => onChange({ largeArc: v })}
        />
        <Checkbox
          label="Sweep"
          checked={seg.sweep}
          onChange={(v) => onChange({ sweep: v })}
        />
      </div>
    </div>
  );
}
