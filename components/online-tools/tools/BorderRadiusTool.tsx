'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import {
  borderRadiusValue,
  clamp,
  type Corners,
} from '@/lib/online-tools/engines/css-generators';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  NumberField,
  RangeField,
  SelectField,
  btnSecondary,
} from '../ui';
import { CodePanel, nudge, useSvgDrag, type Point } from './playground-shared';

type Unit = 'px' | '%';
const CORNERS = ['Top left', 'Top right', 'Bottom right', 'Bottom left'];
const SHAPES: Record<string, { w: number; h: number; label: string }> = {
  landscape: { w: 260, h: 180, label: 'Landscape' },
  square: { w: 220, h: 220, label: 'Square' },
  portrait: { w: 180, h: 250, label: 'Portrait' },
};

type State = {
  unit: Unit;
  linked: boolean;
  elliptical: boolean;
  h: Corners;
  v: Corners;
};
const DEFAULT: State = {
  unit: 'px',
  linked: true,
  elliptical: false,
  h: [24, 24, 24, 24],
  v: [24, 24, 24, 24],
};
const all = (n: number): Corners => [n, n, n, n];

const PRESETS: { name: string; s: Omit<State, 'linked'> }[] = [
  {
    name: 'Rounded',
    s: { unit: 'px', elliptical: false, h: all(16), v: all(16) },
  },
  {
    name: 'Pill',
    s: { unit: 'px', elliptical: false, h: all(9999), v: all(9999) },
  },
  {
    name: 'Circle',
    s: { unit: '%', elliptical: false, h: all(50), v: all(50) },
  },
  {
    name: 'Blob',
    s: {
      unit: '%',
      elliptical: true,
      h: [30, 70, 70, 30],
      v: [30, 30, 70, 70],
    },
  },
  {
    name: 'Leaf',
    s: { unit: '%', elliptical: false, h: [0, 70, 0, 70], v: [0, 70, 0, 70] },
  },
  {
    name: 'Drop',
    s: { unit: '%', elliptical: false, h: [50, 50, 50, 0], v: [50, 50, 50, 0] },
  },
  {
    name: 'Egg',
    s: { unit: '%', elliptical: true, h: all(50), v: [60, 60, 40, 40] },
  },
  {
    name: 'Ticket tab',
    s: { unit: 'px', elliptical: false, h: [24, 24, 0, 0], v: [24, 24, 0, 0] },
  },
];

type HandleKey = { corner: number; axis: 'h' | 'v' };

export default function BorderRadiusTool(_: ToolProps) {
  const [s, setS] = useState<State>(DEFAULT);
  const [shape, setShape] = useState('landscape');
  const { w: W, h: H } = SHAPES[shape];
  const svgRef = useRef<SVGSVGElement>(null);
  const max = s.unit === '%' ? 100 : 300;

  const setCorner = (axis: 'h' | 'v', corner: number, value: number) => {
    const n = clamp(Math.round(value), 0, s.unit === '%' ? 100 : 9999);
    setS((cur) => {
      const update = (c: Corners): Corners =>
        cur.linked
          ? all(n)
          : (c.map((x, i) => (i === corner ? n : x)) as Corners);
      // Without elliptical mode both radii move together.
      if (!cur.elliptical)
        return { ...cur, h: update(cur.h), v: update(cur.v) };
      return axis === 'h'
        ? { ...cur, h: update(cur.h) }
        : { ...cur, v: update(cur.v) };
    });
  };

  // Handle positions in preview pixels. Percentages are of the box width
  // (horizontal radii) or height (vertical radii), like CSS.
  const toPx = (axis: 'h' | 'v', n: number) => {
    const size = axis === 'h' ? W : H;
    const px = s.unit === '%' ? (n / 100) * size : n;
    return Math.min(px, size);
  };
  const fromPx = (axis: 'h' | 'v', px: number) =>
    s.unit === '%' ? (px / (axis === 'h' ? W : H)) * 100 : px;

  const handlePos = ({ corner, axis }: HandleKey): Point => {
    const r = toPx(axis, (axis === 'h' ? s.h : s.v)[corner]);
    const right = corner === 1 || corner === 2;
    const bottom = corner === 2 || corner === 3;
    if (axis === 'h') return { x: right ? W - r : r, y: bottom ? H : 0 };
    return { x: right ? W : 0, y: bottom ? H - r : r };
  };
  const moveHandle = ({ corner, axis }: HandleKey, p: Point) => {
    const right = corner === 1 || corner === 2;
    const bottom = corner === 2 || corner === 3;
    const px = axis === 'h' ? (right ? W - p.x : p.x) : bottom ? H - p.y : p.y;
    setCorner(axis, corner, fromPx(axis, px));
  };
  const { start } = useSvgDrag<HandleKey>(svgRef, moveHandle);

  const handles: HandleKey[] = [0, 1, 2, 3].flatMap((corner) =>
    s.elliptical
      ? [
          { corner, axis: 'h' as const },
          { corner, axis: 'v' as const },
        ]
      : [{ corner, axis: 'h' as const }],
  );

  const value = borderRadiusValue(s.h, s.elliptical ? s.v : null, s.unit);
  const css = `border-radius: ${value};`;

  const changeUnit = (u: string) => {
    const unit = u === '%' ? '%' : 'px';
    if (unit === s.unit) return;
    // Convert so the shape stays roughly the same.
    const conv = (c: Corners, size: number): Corners =>
      c.map((n) =>
        unit === '%'
          ? clamp(Math.round((Math.min(n, size) / size) * 100), 0, 100)
          : Math.round((n / 100) * size),
      ) as Corners;
    setS((cur) => ({ ...cur, unit, h: conv(cur.h, W), v: conv(cur.v, H) }));
  };

  const cornerControls = (axis: 'h' | 'v', title: string) => {
    const list = axis === 'h' ? s.h : s.v;
    const rows = s.linked ? [0] : [0, 1, 2, 3];
    return (
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-900">{title}</legend>
        {rows.map((i) => {
          const label = s.linked ? 'All corners' : CORNERS[i];
          return (
            <div
              key={i}
              className="grid grid-cols-[1fr_5.5rem] items-end gap-2"
            >
              <RangeField
                label={label}
                value={Math.min(list[i], max)}
                onChange={(n) => setCorner(axis, i, n)}
                min={0}
                max={max}
                display={`${list[i]}${s.unit}`}
              />
              <NumberField
                label={`${label} ${title.toLowerCase()} (${s.unit})`}
                value={list[i]}
                min={0}
                onChange={(v) => {
                  const n = Number(v);
                  if (v !== '' && Number.isFinite(n)) setCorner(axis, i, n);
                }}
                className="[&>label]:sr-only"
              />
            </div>
          );
        })}
      </fieldset>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={btnSecondary}
            onClick={() =>
              setS((cur) => ({
                ...p.s,
                linked:
                  p.s.h.every((n) => n === p.s.h[0]) &&
                  p.s.v.every((n) => n === p.s.v[0]) &&
                  cur.linked,
              }))
            }
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Unit"
              value={s.unit}
              onChange={changeUnit}
              options={[
                { value: 'px', label: 'px' },
                { value: '%', label: '%' },
              ]}
            />
            <SelectField
              label="Preview shape"
              value={shape}
              onChange={setShape}
              options={Object.entries(SHAPES).map(([value, o]) => ({
                value,
                label: o.label,
              }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox
              label="Link all corners"
              checked={s.linked}
              onChange={(linked) =>
                setS((cur) =>
                  linked
                    ? { ...cur, linked, h: all(cur.h[0]), v: all(cur.v[0]) }
                    : { ...cur, linked },
                )
              }
            />
            <Checkbox
              label="Elliptical corners (separate horizontal and vertical radii)"
              checked={s.elliptical}
              onChange={(elliptical) =>
                setS((cur) => ({
                  ...cur,
                  elliptical,
                  v: elliptical ? cur.v : ([...cur.h] as Corners),
                }))
              }
            />
          </div>
          {cornerControls('h', s.elliptical ? 'Horizontal radius' : 'Radius')}
          {s.elliptical && cornerControls('v', 'Vertical radius')}
        </div>

        <div className="space-y-4">
          <div className="flex min-h-[20rem] items-center justify-center overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-8">
            <div className="relative shrink-0" style={{ width: W, height: H }}>
              <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-pink-400"
                style={{ borderRadius: value }}
                role="img"
                aria-label={`Preview with border-radius: ${value}`}
              />
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                height={H}
                className="absolute inset-0 overflow-visible"
                style={{ touchAction: 'none' }}
              >
                <rect
                  x={0}
                  y={0}
                  width={W}
                  height={H}
                  fill="none"
                  stroke="#9ca3af"
                  strokeDasharray="4 4"
                />
                {handles.map((k) => {
                  const p = handlePos(k);
                  const radii = k.axis === 'h' ? s.h : s.v;
                  const name = `${CORNERS[k.corner]} ${
                    s.elliptical
                      ? k.axis === 'h'
                        ? 'horizontal radius'
                        : 'vertical radius'
                      : 'radius'
                  }: ${radii[k.corner]}${s.unit}`;
                  return (
                    <circle
                      key={`${k.corner}${k.axis}`}
                      cx={p.x}
                      cy={p.y}
                      r={9}
                      tabIndex={0}
                      role="slider"
                      aria-label={name}
                      aria-valuenow={radii[k.corner]}
                      aria-valuemin={0}
                      aria-valuemax={max}
                      onPointerDown={start(k)}
                      onKeyDown={(e: KeyboardEvent) => {
                        const next = nudge(e, p);
                        if (next) moveHandle(k, next);
                      }}
                      className="cursor-grab fill-white stroke-gray-900 outline-none focus-visible:stroke-indigo-600 focus-visible:[stroke-width:4]"
                      strokeWidth={2}
                    >
                      <title>{name}</title>
                    </circle>
                  );
                })}
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Drag the handles along the edges, or focus one with Tab and use the
            arrow keys (Shift for steps of 10).
          </p>
          <CodePanel css={css} />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setS(DEFAULT);
              setShape('landscape');
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
