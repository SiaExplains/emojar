'use client';

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  TRANSFORM_DEFAULT,
  clamp,
  matrixValue,
  originValue,
  transformValue,
  type TransformState,
} from '@/lib/online-tools/engines/css-generators';
import type { ToolProps } from '../ToolRenderer';
import { Checkbox, NumberField, RangeField, btnSecondary } from '../ui';
import { CodePanel } from './playground-shared';

const BOX = 112;
const MAX_T = 240;
const ORIGINS: [number, number, string][] = [
  [0, 0, 'left top'],
  [50, 0, 'center top'],
  [100, 0, 'right top'],
  [0, 50, 'left center'],
  [50, 50, 'center'],
  [100, 50, 'right center'],
  [0, 100, 'left bottom'],
  [50, 100, 'center bottom'],
  [100, 100, 'right bottom'],
];

const wrapAngle = (d: number) => {
  const a = ((((d + 180) % 360) + 360) % 360) - 180;
  return Math.round(a);
};
const rand = (min: number, max: number, dp = 0) => {
  const f = Math.pow(10, dp);
  return Math.round((min + Math.random() * (max - min)) * f) / f;
};

type Drag =
  | { mode: 'move'; id: number; x: number; y: number; tx: number; ty: number }
  | { mode: 'rotate'; id: number; cx: number; cy: number };

export default function CssTransformTool(_: ToolProps) {
  const [t, setT] = useState<TransformState>(TRANSFORM_DEFAULT);
  const [linkScale, setLinkScale] = useState(true);
  const ghostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const set = <K extends keyof TransformState>(k: K, v: TransformState[K]) =>
    setT((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      if (d.mode === 'move') {
        const tx = clamp(Math.round(d.tx + e.clientX - d.x), -MAX_T, MAX_T);
        const ty = clamp(Math.round(d.ty + e.clientY - d.y), -MAX_T, MAX_T);
        setT((s) => ({ ...s, translateX: tx, translateY: ty }));
      } else {
        const deg =
          (Math.atan2(e.clientY - d.cy, e.clientX - d.cx) * 180) / Math.PI + 90;
        setT((s) => ({ ...s, rotate: wrapAngle(deg) }));
      }
    };
    const end = (e: PointerEvent) => {
      if (drag.current?.id === e.pointerId) drag.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, []);

  const startMove = (e: ReactPointerEvent) => {
    e.preventDefault();
    drag.current = {
      mode: 'move',
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      tx: t.translateX,
      ty: t.translateY,
    };
  };
  const startRotate = (e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const r = ghostRef.current?.getBoundingClientRect();
    if (!r) return;
    // Rotation is measured around the moved box's centre.
    drag.current = {
      mode: 'rotate',
      id: e.pointerId,
      cx: r.left + r.width / 2 + t.translateX,
      cy: r.top + r.height / 2 + t.translateY,
    };
  };

  const onBoxKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    setT((s) => ({
      ...s,
      translateX: clamp(s.translateX + m[0], -MAX_T, MAX_T),
      translateY: clamp(s.translateY + m[1], -MAX_T, MAX_T),
    }));
  };
  const onRotateKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 15 : 1;
    const by =
      e.key === 'ArrowRight' || e.key === 'ArrowUp'
        ? step
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
          ? -step
          : 0;
    if (!by) return;
    e.preventDefault();
    e.stopPropagation();
    setT((s) => ({ ...s, rotate: wrapAngle(s.rotate + by) }));
  };

  const randomize = () => {
    const s = rand(0.6, 1.6, 1);
    const linked = Math.random() < 0.6;
    setLinkScale(linked);
    setT({
      ...TRANSFORM_DEFAULT,
      translateX: rand(-60, 60),
      translateY: rand(-40, 40),
      rotate: rand(-90, 90),
      scaleX: s,
      scaleY: linked ? s : rand(0.6, 1.6, 1),
      skewX: Math.random() < 0.4 ? rand(-20, 20) : 0,
      skewY: Math.random() < 0.2 ? rand(-15, 15) : 0,
      threeD: t.threeD,
      perspective: t.perspective,
      rotateX: t.threeD ? rand(-50, 50) : 0,
      rotateY: t.threeD ? rand(-50, 50) : 0,
    });
  };

  const value = transformValue(t);
  const lines = [`transform: ${value};`];
  if (t.originX !== 50 || t.originY !== 50)
    lines.push(`transform-origin: ${originValue(t.originX, t.originY)};`);
  if (value !== 'none')
    lines.push(
      '',
      `/* Same as one matrix: */`,
      `transform: ${matrixValue(t)};`,
    );
  const css = lines.join('\n');

  const slider = (
    k: keyof TransformState,
    label: string,
    min: number,
    max: number,
    unit: string,
    step = 1,
  ) => (
    <RangeField
      label={label}
      value={t[k] as number}
      onChange={(v) => set(k, v)}
      min={min}
      max={max}
      step={step}
      display={`${t[k]}${unit}`}
    />
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">
              Move
            </legend>
            {slider('translateX', 'Translate X', -MAX_T, MAX_T, 'px')}
            {slider('translateY', 'Translate Y', -MAX_T, MAX_T, 'px')}
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">
              Rotate &amp; scale
            </legend>
            {slider('rotate', 'Rotate', -180, 180, '°')}
            <Checkbox
              label="Same scale for X and Y"
              checked={linkScale}
              onChange={(v) => {
                setLinkScale(v);
                if (v) set('scaleY', t.scaleX);
              }}
            />
            {linkScale ? (
              <RangeField
                label="Scale"
                value={t.scaleX}
                onChange={(v) => setT((s) => ({ ...s, scaleX: v, scaleY: v }))}
                min={0.1}
                max={3}
                step={0.05}
                display={`${t.scaleX}`}
              />
            ) : (
              <>
                {slider('scaleX', 'Scale X', -3, 3, '', 0.05)}
                {slider('scaleY', 'Scale Y', -3, 3, '', 0.05)}
              </>
            )}
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">
              Skew
            </legend>
            {slider('skewX', 'Skew X', -60, 60, '°')}
            {slider('skewY', 'Skew Y', -60, 60, '°')}
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-gray-900">
              Transform origin
            </legend>
            <div className="flex items-end gap-4">
              <div
                className="grid w-[5.5rem] shrink-0 grid-cols-3 gap-1"
                role="group"
                aria-label="Origin presets"
              >
                {ORIGINS.map(([x, y, name]) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={`Origin ${name}`}
                    aria-pressed={t.originX === x && t.originY === y}
                    onClick={() =>
                      setT((s) => ({ ...s, originX: x, originY: y }))
                    }
                    className={`h-7 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      t.originX === x && t.originY === y
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-200 bg-white hover:bg-gray-100'
                    }`}
                  />
                ))}
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2">
                <NumberField
                  label="X %"
                  value={t.originX}
                  onChange={(v) => {
                    const n = Number(v);
                    if (v !== '' && Number.isFinite(n))
                      set('originX', clamp(Math.round(n), -100, 200));
                  }}
                />
                <NumberField
                  label="Y %"
                  value={t.originY}
                  onChange={(v) => {
                    const n = Number(v);
                    if (v !== '' && Number.isFinite(n))
                      set('originY', clamp(Math.round(n), -100, 200));
                  }}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="sr-only">3D</legend>
            <Checkbox
              label="3D rotation (adds perspective)"
              checked={t.threeD}
              onChange={(v) => set('threeD', v)}
            />
            {t.threeD && (
              <>
                {slider('perspective', 'Perspective', 100, 2000, 'px', 10)}
                {slider('rotateX', 'Rotate X', -180, 180, '°')}
                {slider('rotateY', 'Rotate Y', -180, 180, '°')}
              </>
            )}
          </fieldset>
        </div>

        <div className="space-y-4">
          <div
            className="relative h-80 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 sm:h-96"
            style={{
              backgroundImage:
                'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: 'center',
            }}
          >
            <div
              ref={ghostRef}
              className="absolute left-1/2 top-1/2 rounded-lg border-2 border-dashed border-gray-400"
              style={{
                width: BOX,
                height: BOX,
                marginLeft: -BOX / 2,
                marginTop: -BOX / 2,
              }}
              aria-hidden
            >
              <span
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 ring-2 ring-white"
                style={{ left: `${t.originX}%`, top: `${t.originY}%` }}
                title="transform-origin"
              />
            </div>
            {/* The box and its rotate handle are siblings in one transformed
                wrapper, so the handle turns with the box without nesting one
                control inside another. */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: BOX,
                height: BOX,
                marginLeft: -BOX / 2,
                marginTop: -BOX / 2,
                transform: value,
                transformOrigin: `${t.originX}% ${t.originY}%`,
              }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Transformed box, moved ${t.translateX}px, ${t.translateY}px. Drag it or use the arrow keys to move it.`}
                onPointerDown={startMove}
                onKeyDown={onBoxKey}
                className="flex h-full w-full cursor-move items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-pink-500 text-sm font-bold text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
                style={{ touchAction: 'none' }}
              >
                Box
              </div>
              <button
                type="button"
                aria-label={`Rotation ${t.rotate}°. Drag to rotate, or use the arrow keys (Shift for 15°).`}
                onPointerDown={startRotate}
                onKeyDown={onRotateKey}
                className="absolute -top-9 left-1/2 h-6 w-6 -translate-x-1/2 cursor-grab rounded-full border-2 border-gray-900 bg-white text-xs leading-none text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                style={{ touchAction: 'none' }}
              >
                ↻
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Drag the box to translate it and the ↻ handle to rotate it. The
            dashed outline is the untransformed box and the red dot is the
            transform origin. Tab to the box or handle and use the arrow keys
            instead of dragging.
          </p>
          <CodePanel css={css} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnSecondary} onClick={randomize}>
              🎲 Randomize
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setT(TRANSFORM_DEFAULT);
                setLinkScale(true);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
