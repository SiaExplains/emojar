'use client';

// Shared pieces for the visual playgrounds and generators: numbered item
// tabs, the generated-code panel, pointer dragging inside an SVG and a
// localStorage-backed state hook.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { CopyButton, NumberField, labelBase } from '../ui';

export function ItemTabs({
  count,
  selected,
  onSelect,
  label = 'Choose an item to edit',
}: {
  count: number;
  selected: number;
  onSelect: (i: number) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={selected === i}
          onClick={() => onSelect(i)}
          className={`h-8 w-8 rounded-lg border text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            selected === i
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export function CodePanel({
  css,
  title = 'Generated CSS',
  copyLabel = 'Copy CSS',
}: {
  css: string;
  title?: string;
  copyLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <CopyButton text={css} label={copyLabel} />
      </div>
      <pre className="max-h-80 overflow-auto rounded-2xl bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
        <code>{css}</code>
      </pre>
    </div>
  );
}

export type Point = { x: number; y: number };

/**
 * Drag handles inside an <svg> with a viewBox. Returns a pointer-down
 * handler to put on each handle; `onMove` gets the pointer position in
 * viewBox units, clamped to the viewBox. Works for mouse, pen and touch.
 */
export function useSvgDrag<K>(
  svg: RefObject<SVGSVGElement | null>,
  onMove: (key: K, p: Point) => void,
) {
  const active = useRef<{ key: K; id: number } | null>(null);
  const move = useRef(onMove);
  move.current = onMove;

  const toSvg = useCallback(
    (clientX: number, clientY: number): Point | null => {
      const el = svg.current;
      const ctm = el?.getScreenCTM();
      if (!el || !ctm) return null;
      const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
      const vb = el.viewBox.baseVal;
      const w = vb && vb.width ? vb.width : el.clientWidth;
      const h = vb && vb.height ? vb.height : el.clientHeight;
      const x0 = vb ? vb.x : 0;
      const y0 = vb ? vb.y : 0;
      return {
        x: Math.min(x0 + w, Math.max(x0, p.x)),
        y: Math.min(y0 + h, Math.max(y0, p.y)),
      };
    },
    [svg],
  );

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const a = active.current;
      if (!a || e.pointerId !== a.id) return;
      const p = toSvg(e.clientX, e.clientY);
      if (p) move.current(a.key, p);
    };
    const end = (e: PointerEvent) => {
      if (active.current?.id === e.pointerId) active.current = null;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [toSvg]);

  const start = useCallback(
    (key: K) => (e: ReactPointerEvent) => {
      e.preventDefault();
      active.current = { key, id: e.pointerId };
    },
    [],
  );
  return { start, toSvg };
}

/**
 * Arrow-key nudging for a focused handle: 1 unit, or 10 with Shift.
 * Returns the moved point, or null when the key isn't an arrow.
 */
export function nudge(e: KeyboardEvent, p: Point, step = 1): Point | null {
  const d = e.shiftKey ? step * 10 : step;
  const moves: Record<string, Point> = {
    ArrowLeft: { x: p.x - d, y: p.y },
    ArrowRight: { x: p.x + d, y: p.y },
    ArrowUp: { x: p.x, y: p.y - d },
    ArrowDown: { x: p.x, y: p.y + d },
  };
  const next = moves[e.key];
  if (!next) return null;
  e.preventDefault();
  return next;
}

/**
 * useState that is saved to localStorage under `key`. Storage can be
 * missing or blocked (private mode, quota), so every access is guarded and
 * the tool keeps working in memory. `validate` rejects stale or corrupt
 * saved data.
 */
export function useStoredState<T>(
  key: string,
  initial: T | (() => T),
  validate: (v: unknown) => v is T,
) {
  const [value, setValue] = useState<T>(initial);
  // Don't save until the stored value has been read, or the initial value
  // would overwrite it on the first render.
  const [ready, setReady] = useState(false);
  const check = useRef(validate);
  check.current = validate;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (check.current(parsed)) setValue(parsed);
      }
    } catch {
      // Storage unavailable or corrupt — start fresh.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota or privacy mode — keep working without saving.
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}

/** Monotonic id for list items created in the browser. */
export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Number field that keeps half-typed text like "12." or "-" while the
// value it controls stays numeric, and a labelled colour swatch input.

const roundTo = (n: number, d: number) => {
  const f = 10 ** d;
  const r = Math.round(n * f) / f;
  return String(Object.is(r, -0) ? 0 : r);
};

export function DraftNumberField({
  label,
  value,
  onCommit,
  min,
  max,
  step = 'any',
  suffix,
  decimals = 2,
  className,
}: {
  label: string;
  value: number;
  onCommit: (n: number) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [text, setText] = useState(() => roundTo(value, decimals));
  useEffect(() => {
    // Only overwrite the text when the value really changed elsewhere
    // (dragging, nudging), not while the user is mid-way through typing.
    setText((t) =>
      t.trim() !== '' && Number(t) === value ? t : roundTo(value, decimals),
    );
  }, [value, decimals]);
  return (
    <NumberField
      label={label}
      value={text}
      min={min}
      max={max}
      step={step}
      suffix={suffix}
      className={className}
      onChange={(v) => {
        setText(v);
        const n = Number(v);
        if (v.trim() === '' || !Number.isFinite(n)) return;
        const c = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
        onCommit(c);
      }}
    />
  );
}

export function ColorInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`${labelBase} space-y-1.5`}>
      <span className="block">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40"
        />
        <span className="font-mono text-xs text-gray-600">
          {disabled ? 'none' : value}
        </span>
      </span>
    </label>
  );
}
