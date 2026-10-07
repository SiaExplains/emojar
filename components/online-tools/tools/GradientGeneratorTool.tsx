'use client';

import { useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, RangeField, SelectField, btnSecondary } from '../ui';

type Stop = { id: number; color: string; pos: number };

let nextId = 3;

export default function GradientGeneratorTool(_: ToolProps) {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: 1, color: '#6366f1', pos: 0 },
    { id: 2, color: '#ec4899', pos: 100 },
  ]);

  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const list = sorted.map((s) => `${s.color} ${s.pos}%`).join(', ');
  const value =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${list})`
      : `radial-gradient(circle, ${list})`;
  const css = `background: ${sorted[0]?.color ?? '#fff'};\nbackground: ${value};`;

  const update = (id: number, patch: Partial<Stop>) =>
    setStops((cur) => cur.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-5">
      <div
        className="h-48 rounded-2xl border border-gray-200 sm:h-64"
        style={{ background: value }}
        role="img"
        aria-label={`Preview of ${value}`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Type"
          value={type}
          onChange={(v) => setType(v as 'linear' | 'radial')}
          options={[
            { value: 'linear', label: 'Linear' },
            { value: 'radial', label: 'Radial' },
          ]}
        />
        {type === 'linear' && (
          <RangeField
            label="Angle"
            value={angle}
            onChange={setAngle}
            min={0}
            max={360}
            display={`${angle}°`}
          />
        )}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-gray-700">
          Color stops
        </legend>
        {stops.map((s, i) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={s.color}
              aria-label={`Stop ${i + 1} color`}
              onChange={(e) => update(s.id, { color: e.target.value })}
              className="h-9 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={s.pos}
              aria-label={`Stop ${i + 1} position`}
              onChange={(e) => update(s.id, { pos: Number(e.target.value) })}
              className="min-w-[140px] flex-1 accent-indigo-600"
            />
            <span className="w-10 text-right text-sm tabular-nums text-gray-600">
              {s.pos}%
            </span>
            <button
              type="button"
              className={btnSecondary}
              disabled={stops.length <= 2}
              onClick={() =>
                setStops((cur) => cur.filter((x) => x.id !== s.id))
              }
              aria-label={`Remove stop ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          disabled={stops.length >= 6}
          onClick={() =>
            setStops((cur) => [
              ...cur,
              { id: nextId++, color: '#facc15', pos: 50 },
            ])
          }
        >
          + Add stop
        </button>
      </fieldset>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">CSS</span>
          <CopyButton text={css} />
        </div>
        <pre className="overflow-auto whitespace-pre-wrap break-all rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[13px]">
          {css}
        </pre>
      </div>
    </div>
  );
}
