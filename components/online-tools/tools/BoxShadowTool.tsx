'use client';

import { useState } from 'react';
import {
  boxShadowCss,
  boxShadowValue,
  type Shadow,
} from '@/lib/online-tools/engines/css-generators';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  NumberField,
  RangeField,
  SelectField,
  btnSecondary,
  labelBase,
} from '../ui';
import { CodePanel, ItemTabs, newId } from './playground-shared';

type Layer = Omit<Shadow, 'id'>;

// The id goes last so copying an existing layer still gets a fresh one.
const layer = (p: Partial<Shadow> = {}): Shadow => ({
  x: 0,
  y: 10,
  blur: 30,
  spread: 0,
  color: '#000000',
  opacity: 20,
  inset: false,
  ...p,
  id: newId(),
});

const PRESETS: { name: string; card: string; layers: Layer[] }[] = [
  {
    name: 'Soft',
    card: '#ffffff',
    layers: [layer({ y: 10, blur: 30, opacity: 12 })],
  },
  {
    name: 'Layered',
    card: '#ffffff',
    layers: [
      layer({ y: 1, blur: 2, opacity: 6 }),
      layer({ y: 2, blur: 4, opacity: 6 }),
      layer({ y: 4, blur: 8, opacity: 6 }),
      layer({ y: 8, blur: 16, opacity: 6 }),
      layer({ y: 16, blur: 32, opacity: 6 }),
    ],
  },
  {
    name: 'Sharp',
    card: '#ffffff',
    layers: [layer({ x: 6, y: 6, blur: 0, color: '#111827', opacity: 100 })],
  },
  {
    name: 'Inset',
    card: '#f3f4f6',
    layers: [layer({ y: 2, blur: 6, opacity: 25, inset: true })],
  },
  {
    name: 'Neumorphic',
    card: '#e5e7eb',
    layers: [
      layer({ x: 8, y: 8, blur: 16, color: '#a3a8b0', opacity: 60 }),
      layer({ x: -8, y: -8, blur: 16, color: '#ffffff', opacity: 90 }),
    ],
  },
  {
    name: 'Glow',
    card: '#ffffff',
    layers: [
      layer({ y: 0, blur: 24, spread: 4, color: '#6366f1', opacity: 55 }),
    ],
  },
];

const BACKGROUNDS: Record<string, string> = {
  light: '#f3f4f6',
  white: '#ffffff',
  neutral: '#e5e7eb',
  dark: '#111827',
  gradient: 'linear-gradient(135deg, #e0e7ff, #fce7f3)',
};

const defaults = () => ({
  layers: [layer()],
  card: '#ffffff',
  bg: 'light',
  radius: 16,
});

const rand = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));

export default function BoxShadowTool(_: ToolProps) {
  const [layers, setLayers] = useState<Shadow[]>(() => defaults().layers);
  const [sel, setSel] = useState(0);
  const [card, setCard] = useState('#ffffff');
  const [bg, setBg] = useState('light');
  const [radius, setRadius] = useState(16);

  const cur = layers[Math.min(sel, layers.length - 1)];
  const update = (patch: Partial<Layer>) =>
    setLayers((xs) => xs.map((x, i) => (i === sel ? { ...x, ...patch } : x)));
  const numeric =
    (k: 'x' | 'y' | 'blur' | 'spread' | 'opacity', min: number, max: number) =>
    (v: string) => {
      const n = Number(v);
      if (v !== '' && Number.isFinite(n))
        update({ [k]: Math.min(max, Math.max(min, n)) });
    };

  const add = () => {
    setLayers((xs) => [...xs, layer(cur)]);
    setSel(layers.length);
  };
  const remove = () => {
    if (layers.length <= 1) return;
    setLayers((xs) => xs.filter((_, i) => i !== sel));
    setSel((s) => Math.max(0, s - 1));
  };
  const move = (d: -1 | 1) => {
    const j = sel + d;
    if (j < 0 || j >= layers.length) return;
    setLayers((xs) => {
      const next = [...xs];
      [next[sel], next[j]] = [next[j], next[sel]];
      return next;
    });
    setSel(j);
  };
  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setLayers(p.layers.map((l) => layer(l)));
    setCard(p.card);
    setSel(0);
  };
  const reset = () => {
    const d = defaults();
    setLayers(d.layers);
    setCard(d.card);
    setBg(d.bg);
    setRadius(d.radius);
    setSel(0);
  };
  const randomize = () => {
    const n = rand(1, 3);
    setLayers(
      Array.from({ length: n }, () =>
        layer({
          x: rand(-20, 20),
          y: rand(0, 30),
          blur: rand(0, 60),
          spread: rand(-10, 10),
          color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`,
          opacity: rand(10, 60),
          inset: Math.random() < 0.15,
        }),
      ),
    );
    setSel(0);
  };

  const css = boxShadowCss(layers);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Presets">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className={btnSecondary}
            onClick={() => applyPreset(p)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Shadow {sel + 1} of {layers.length}
              </h2>
              <ItemTabs
                count={layers.length}
                selected={sel}
                onSelect={setSel}
                label="Choose a shadow layer to edit"
              />
            </div>
            <p className="text-xs text-gray-500">
              Layer 1 is drawn on top of the others.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={add}
                disabled={layers.length >= 8}
              >
                + Add shadow
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={remove}
                disabled={layers.length <= 1}
              >
                Remove
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => move(-1)}
                disabled={sel === 0}
                aria-label="Move shadow up (towards the top layer)"
              >
                ↑ Up
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => move(1)}
                disabled={sel >= layers.length - 1}
                aria-label="Move shadow down"
              >
                ↓ Down
              </button>
            </div>
          </div>

          {cur && (
            <div className="space-y-3">
              {(
                [
                  ['x', 'X offset', -100, 100],
                  ['y', 'Y offset', -100, 100],
                  ['blur', 'Blur', 0, 150],
                  ['spread', 'Spread', -60, 60],
                ] as const
              ).map(([k, label, min, max]) => (
                <div
                  key={k}
                  className="grid grid-cols-[1fr_5.5rem] items-end gap-2"
                >
                  <RangeField
                    label={label}
                    value={cur[k]}
                    onChange={(v) => update({ [k]: v })}
                    min={min}
                    max={max}
                    display={`${cur[k]}px`}
                  />
                  <NumberField
                    label={`${label} (px)`}
                    value={cur[k]}
                    onChange={numeric(k, min * 4, max * 4)}
                    className="[&>label]:sr-only"
                  />
                </div>
              ))}
              <div className="grid grid-cols-[auto_1fr] items-end gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="bs-color" className={labelBase}>
                    Colour
                  </label>
                  <input
                    id="bs-color"
                    type="color"
                    value={cur.color}
                    onChange={(e) => update({ color: e.target.value })}
                    className="h-[38px] w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                  />
                </div>
                <RangeField
                  label="Opacity"
                  value={cur.opacity}
                  onChange={(v) => update({ opacity: v })}
                  min={0}
                  max={100}
                  display={`${cur.opacity}%`}
                />
              </div>
              <Checkbox
                label="Inset (inner shadow)"
                checked={cur.inset}
                onChange={(v) => update({ inset: v })}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div
            className="flex min-h-[18rem] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 p-10"
            style={{ background: BACKGROUNDS[bg] }}
          >
            <div
              className="flex h-40 w-full max-w-[16rem] items-center justify-center text-sm font-medium text-gray-500"
              style={{
                background: card,
                borderRadius: radius,
                boxShadow: boxShadowValue(layers),
              }}
              role="img"
              aria-label={`Preview card with box-shadow: ${boxShadowValue(layers)}`}
            >
              Preview
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField
              label="Background"
              value={bg}
              onChange={setBg}
              options={[
                { value: 'light', label: 'Light grey' },
                { value: 'white', label: 'White' },
                { value: 'neutral', label: 'Mid grey' },
                { value: 'dark', label: 'Dark' },
                { value: 'gradient', label: 'Gradient' },
              ]}
            />
            <div className="space-y-1.5">
              <label htmlFor="bs-card" className={labelBase}>
                Card colour
              </label>
              <input
                id="bs-card"
                type="color"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="h-[38px] w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
              />
            </div>
            <RangeField
              label="Card corners"
              value={radius}
              onChange={setRadius}
              min={0}
              max={48}
              display={`${radius}px`}
            />
          </div>
          <CodePanel css={css} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnSecondary} onClick={randomize}>
              🎲 Randomize
            </button>
            <button type="button" className={btnSecondary} onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
