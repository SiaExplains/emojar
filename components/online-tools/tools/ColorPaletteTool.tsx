'use client';

import { useState } from 'react';
import {
  generatePalette,
  parseColor,
  randomColor,
  readableOn,
  rgbToHex,
  type PaletteScheme,
} from '@/lib/online-tools/engines/color';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, SelectField, btnSecondary } from '../ui';

const SCHEMES: { value: PaletteScheme; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'tetradic', label: 'Tetradic (square)' },
  { value: 'split-complementary', label: 'Split complementary' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'shades', label: 'Tints & shades' },
];

export default function ColorPaletteTool(_: ToolProps) {
  const [base, setBase] = useState('#6366f1');
  const [scheme, setScheme] = useState<PaletteScheme>('analogous');
  const [copied, setCopied] = useState('');
  const rgb = parseColor(base) ?? { r: 99, g: 102, b: 241 };
  const palette = generatePalette(rgb, scheme);
  const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied(''), 1200);
    } catch {
      setCopied('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="pal-base"
            className="block text-sm font-medium text-gray-700"
          >
            Base color
          </label>
          <input
            id="pal-base"
            type="color"
            value={rgbToHex(rgb)}
            onChange={(e) => setBase(e.target.value)}
            className="h-[38px] w-20 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
          />
        </div>
        <SelectField
          label="Harmony"
          value={scheme}
          onChange={(v) => setScheme(v as PaletteScheme)}
          options={SCHEMES}
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setBase(rgbToHex(randomColor()))}
        >
          🎲 Random
        </button>
      </div>

      <ul
        className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 sm:flex"
        aria-label="Palette"
      >
        {palette.map((hex) => {
          const c = parseColor(hex)!;
          return (
            <li key={hex + scheme} className="sm:flex-1">
              <button
                type="button"
                onClick={() => copy(hex)}
                className="flex h-28 w-full flex-col items-center justify-end gap-1 pb-3 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:h-40"
                style={{ background: hex, color: readableOn(c) }}
                aria-label={`Copy ${hex}`}
              >
                {copied === hex ? 'Copied!' : hex}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            CSS variables
          </span>
          <CopyButton text={css} />
        </div>
        <pre className="overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[13px]">
          {css}
        </pre>
      </div>
    </div>
  );
}
