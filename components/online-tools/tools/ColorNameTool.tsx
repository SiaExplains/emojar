'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import {
  formatHsl,
  formatRgb,
  parseColor,
  readableOn,
  rgbToHex,
  rgbToHsv,
} from '@/lib/online-tools/engines/color';
import {
  NAMED_COLORS,
  describeDistance,
  nearestColors,
  searchNamedColors,
  type ColorSort,
  type NamedColor,
} from '@/lib/online-tools/engines/color-names';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, TextField } from '../ui';
import {
  Chips,
  CopyChip,
  EmptyState,
  SearchBox,
  useCopyFlash,
} from './ReferenceUI';

type Source = 'all' | 'css' | 'xkcd';
const LIMIT = 300;

export default function ColorNameTool(_: ToolProps) {
  const [input, setInput] = useState('#3B7DD8');
  const [source, setSource] = useState<Source>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<ColorSort>('hue');
  const q = useDeferredValue(query);
  const { copy, region } = useCopyFlash();

  // Accept survey names too (“sage”, “dusty rose”), not just CSS keywords.
  const rgb = useMemo(
    () =>
      parseColor(input) ??
      NAMED_COLORS.find((c) => c.name === input.trim().toLowerCase())?.rgb ??
      null,
    [input],
  );
  const matches = useMemo(
    () => (rgb ? nearestColors(rgb, 9, source) : []),
    [rgb, source],
  );
  const best = matches[0];
  const list = useMemo(
    () => searchNamedColors(q, sort, source),
    [q, sort, source],
  );
  const hex = rgb ? rgbToHex(rgb).toUpperCase() : '';
  const hsv = rgb ? rgbToHsv(rgb) : null;

  const swatch = (c: NamedColor, size = 'h-12') => (
    <button
      type="button"
      onClick={() => {
        setInput(c.hex);
        void copy(c.hex, `${c.name} ${c.hex}`);
      }}
      aria-label={`${c.name} ${c.hex} — copy and inspect`}
      title={`${c.name} ${c.hex}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-gray-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span className={`block w-full ${size}`} style={{ background: c.hex }} />
      <span className="block truncate px-2 pt-1 text-xs font-medium text-gray-900">
        {c.name}
      </span>
      <span className="block px-2 pb-1 font-mono text-[10px] text-gray-500">
        {c.hex}
        {c.source === 'css' && ' · CSS'}
      </span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <TextField
          label="Colour (HEX, RGB, HSL or name)"
          value={input}
          onChange={setInput}
          placeholder="#3B7DD8, rgb(59 125 216), hsl(215 67% 54%), teal"
          mono
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="color"
            value={
              rgb
                ? rgbToHex({ r: rgb.r, g: rgb.g, b: rgb.b }).slice(0, 7)
                : '#000000'
            }
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 bg-white"
            aria-label="Pick a colour"
          />
          Picker
        </label>
      </div>
      <Chips
        label="Colour names"
        value={source}
        onChange={setSource}
        options={[
          { value: 'all', label: 'All names (1,097)' },
          { value: 'css', label: 'CSS named colours (148)' },
          { value: 'xkcd', label: 'xkcd survey names (949)' },
        ]}
      />
      {input.trim() && !rgb && (
        <ErrorMessage>
          That isn’t a colour I can read — try #FF8800, rgb(255, 136, 0) or
          hsl(32, 100%, 50%).
        </ErrorMessage>
      )}
      {rgb && best && hsv && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[14rem_1fr]">
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div
              className="flex h-28 items-end p-3"
              style={{ background: hex, color: readableOn(rgb) }}
            >
              <span className="text-xs font-semibold">Your colour</span>
            </div>
            <div
              className="flex h-16 items-end p-3"
              style={{ background: best.hex, color: readableOn(best.rgb) }}
            >
              <span className="text-xs font-semibold">
                Closest: {best.name}
              </span>
            </div>
          </div>
          <div className="space-y-3" aria-live="polite">
            <p className="text-lg text-gray-900">
              Closest named colour:{' '}
              <span className="font-semibold">{best.name}</span>{' '}
              <span className="font-mono text-sm text-gray-500">
                {best.hex}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Distance ΔE {best.distance.toFixed(1)} —{' '}
              {describeDistance(best.distance)}
              {best.source === 'css'
                ? ' · CSS keyword, usable directly in stylesheets.'
                : ' · from the xkcd colour survey.'}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CopyChip label="HEX" value={hex} />
              <CopyChip label="RGB" value={formatRgb(rgb)} />
              <CopyChip label="HSL" value={formatHsl(rgb)} />
              <CopyChip
                label="HSB / HSV"
                value={`hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`}
              />
              <CopyChip label="Closest name" value={best.name} mono={false} />
            </div>
          </div>
        </div>
      )}
      {matches.length > 1 && (
        <section aria-labelledby="cn-similar" className="space-y-2">
          <h2 id="cn-similar" className="text-sm font-semibold text-gray-900">
            Visually similar named colours
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
            {matches.slice(1).map((m) => (
              <li key={`${m.source}-${m.name}`}>
                {swatch(m)}
                <span className="block px-1 text-[10px] text-gray-500">
                  ΔE {m.distance.toFixed(1)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="cn-all" className="space-y-3">
        <h2 id="cn-all" className="text-sm font-semibold text-gray-900">
          Browse named colours
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr] sm:items-end">
          <SearchBox
            label="Search by name or HEX"
            value={query}
            onChange={setQuery}
            placeholder="blue, sage, #FF…"
            count={list.length}
            noun="colour"
          />
          <Chips
            label="Sort"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'hue', label: 'Hue' },
              { value: 'brightness', label: 'Brightness' },
              { value: 'saturation', label: 'Saturation' },
              { value: 'name', label: 'Name' },
            ]}
          />
        </div>
        {region}
        {list.length === 0 ? (
          <EmptyState>No colour name contains “{q}”.</EmptyState>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
            {list.slice(0, LIMIT).map((c) => (
              <li key={`${c.source}-${c.name}`}>{swatch(c, 'h-10')}</li>
            ))}
          </ul>
        )}
        {list.length > LIMIT && (
          <p className="text-xs text-gray-500">
            Showing {LIMIT} of {list.length} — search to find a specific name.
          </p>
        )}
        <p className="text-xs text-gray-500">
          Click a swatch to copy its HEX and inspect it above. Survey names come
          from the xkcd colour survey (CC0).
        </p>
      </section>
    </div>
  );
}
