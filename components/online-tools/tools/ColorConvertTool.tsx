'use client';

import { useState } from 'react';
import {
  allFormats,
  parseColor,
  readableOn,
  rgbToHex,
  type RGB,
} from '@/lib/online-tools/engines/color';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, ResultRow, TextField } from '../ui';

const DEFAULTS: Record<string, string> = {
  hex: '#3b82f6',
  rgb: 'rgb(59, 130, 246)',
  hsl: 'hsl(217, 91%, 60%)',
  any: '#3b82f6',
};
const LABELS: Record<string, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  hsv: 'HSV',
  cmyk: 'CMYK',
};

/** Shared preview + all-formats block used by several color tools. */
export function ColorFormats({
  color,
  highlight,
}: {
  color: RGB;
  highlight?: string;
}) {
  const f = allFormats(color);
  const order = (['hex', 'rgb', 'hsl', 'hsv', 'cmyk'] as const)
    .slice()
    .sort((a, b) => (a === highlight ? -1 : b === highlight ? 1 : 0));
  return (
    <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
      <div
        className="flex h-32 items-center justify-center rounded-2xl border border-gray-200 text-sm font-semibold sm:h-auto"
        style={{ background: f.rgb, color: readableOn(color) }}
      >
        {f.hex}
      </div>
      <div className="rounded-2xl border border-gray-100 px-4">
        {order.map((k) => (
          <ResultRow
            key={k}
            label={k === highlight ? `${LABELS[k]} (result)` : LABELS[k]}
            value={f[k]}
            mono
          />
        ))}
      </div>
    </div>
  );
}

export default function ColorConvertTool({ config }: ToolProps) {
  const from = String(config.from ?? 'any');
  const to = String(config.to ?? 'all');
  const [value, setValue] = useState(DEFAULTS[from] ?? DEFAULTS.any);
  const color = parseColor(
    value,
    from === 'any' ? undefined : (from as 'hex' | 'rgb' | 'hsl'),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          label={
            from === 'any'
              ? 'Color (HEX, RGB, HSL or name)'
              : `${LABELS[from]} color`
          }
          value={value}
          onChange={setValue}
          mono
          className="min-w-[220px] flex-1"
          placeholder={DEFAULTS[from]}
        />
        <div className="space-y-1.5">
          <label
            htmlFor="color-picker-input"
            className="block text-sm font-medium text-gray-700"
          >
            Picker
          </label>
          <input
            id="color-picker-input"
            type="color"
            value={color ? rgbToHex({ ...color, a: undefined }) : '#000000'}
            onChange={(e) => {
              const c = parseColor(e.target.value)!;
              const fm = allFormats(c);
              setValue(
                from === 'rgb' ? fm.rgb : from === 'hsl' ? fm.hsl : fm.hex,
              );
            }}
            className="h-[38px] w-16 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
          />
        </div>
      </div>
      {!color && value.trim() && (
        <ErrorMessage>
          “{value}” is not a valid{' '}
          {from === 'any' ? 'color' : `${LABELS[from]} color`}. Example:{' '}
          {DEFAULTS[from]}
        </ErrorMessage>
      )}
      {color && (
        <ColorFormats color={color} highlight={to === 'all' ? undefined : to} />
      )}
    </div>
  );
}
