'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_CONTEXT,
  UNIT_KIND,
  fmt,
  fromPx,
  pxPerUnit,
  toPx,
  type CssUnit,
  type UnitContext,
} from '@/lib/online-tools/engines/css-units';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, NumberField, SelectField, btnSecondary } from '../ui';

const UNITS: CssUnit[] = [
  'px',
  '%',
  'em',
  'rem',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'ch',
  'ex',
  'pt',
  'cm',
  'mm',
  'in',
];
const KIND_LABEL = {
  absolute: 'Absolute',
  font: 'Font-relative',
  viewport: 'Viewport',
  percent: 'Parent-relative',
} as const;
const KIND_STYLE = {
  absolute: 'bg-slate-500',
  font: 'bg-brand-500',
  viewport: 'bg-emerald-500',
  percent: 'bg-amber-500',
} as const;

const num = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function CssUnitTool(_: ToolProps) {
  const [root, setRoot] = useState('16');
  const [parentFont, setParentFont] = useState('16');
  const [parentSize, setParentSize] = useState('800');
  const [vw, setVw] = useState(String(DEFAULT_CONTEXT.viewportWidth));
  const [vh, setVh] = useState(String(DEFAULT_CONTEXT.viewportHeight));
  const [value, setValue] = useState('10');
  const [unit, setUnit] = useState<CssUnit>('rem');
  const [boxW, setBoxW] = useState('50');
  const [boxWUnit, setBoxWUnit] = useState<CssUnit>('vw');
  const [boxH, setBoxH] = useState('20');
  const [boxHUnit, setBoxHUnit] = useState<CssUnit>('vh');
  const [ratios, setRatios] = useState({ ch: 0.5, ex: 0.5 });
  const probe = useRef<HTMLSpanElement>(null);

  // ch and ex depend on the font, so measure them in this browser.
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    el.style.width = '100ch';
    const ch = el.getBoundingClientRect().width / 100;
    el.style.width = '100ex';
    const ex = el.getBoundingClientRect().width / 100;
    el.style.width = '0';
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    if (ch > 0 && ex > 0) setRatios({ ch: ch / fs, ex: ex / fs });
    setVw(String(window.innerWidth));
    setVh(String(window.innerHeight));
  }, []);

  const ctx: UnitContext = {
    rootFontSize: num(root, 16),
    parentFontSize: num(parentFont, 16),
    parentSize: num(parentSize, 800),
    viewportWidth: num(vw, 1440),
    viewportHeight: num(vh, 900),
    chRatio: ratios.ch,
    exRatio: ratios.ex,
  };
  const v = Number(value);
  const px = Number.isFinite(v) ? toPx(v, unit, ctx) : NaN;
  const reset = () => {
    setRoot('16');
    setParentFont('16');
    setParentSize('800');
    setVw(String(window.innerWidth));
    setVh(String(window.innerHeight));
    setValue('10');
    setUnit('rem');
  };

  // Mock viewport drawn to scale inside the page.
  const mockW = 560;
  const scale = mockW / ctx.viewportWidth;
  const bw = toPx(Number(boxW) || 0, boxWUnit, ctx);
  const bh = toPx(Number(boxH) || 0, boxHUnit, ctx);
  const unitOptions = UNITS.map((u) => ({ value: u, label: u }));
  const maxBar = Math.max(...UNITS.map((u) => pxPerUnit(u, ctx)));

  return (
    <div className="space-y-6">
      <span
        ref={probe}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden"
      />
      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <legend className="mb-2 text-sm font-semibold text-gray-900">
          Context
        </legend>
        <NumberField
          label="Root font (rem)"
          value={root}
          onChange={setRoot}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Parent font (em)"
          value={parentFont}
          onChange={setParentFont}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Parent width (%)"
          value={parentSize}
          onChange={setParentSize}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Viewport width"
          value={vw}
          onChange={setVw}
          min={1}
          suffix="px"
        />
        <NumberField
          label="Viewport height"
          value={vh}
          onChange={setVh}
          min={1}
          suffix="px"
        />
      </fieldset>

      <section
        aria-labelledby="cu-convert"
        className="space-y-3 rounded-2xl border border-gray-100 p-4"
      >
        <h2 id="cu-convert" className="text-sm font-semibold text-gray-900">
          Convert a length
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <NumberField
            label="Value"
            value={value}
            onChange={setValue}
            step="any"
            className="w-32"
          />
          <SelectField
            label="Unit"
            value={unit}
            onChange={(u) => setUnit(u as CssUnit)}
            options={unitOptions}
            className="w-28"
          />
          <button type="button" className={btnSecondary} onClick={reset}>
            Reset
          </button>
        </div>
        <p className="text-2xl font-semibold text-gray-900" aria-live="polite">
          {value}
          {unit} = {fmt(px)}px
        </p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((u) => {
            const text = `${fmt(fromPx(px, u, ctx))}${u}`;
            return (
              <li
                key={u}
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-3 py-1.5"
              >
                <span className="font-mono text-sm text-gray-900">{text}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {KIND_LABEL[UNIT_KIND[u]]}
                  </span>
                  <CopyButton text={text} className="!px-2 !py-0.5 text-xs" />
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="cu-one" className="space-y-2">
        <h2 id="cu-one" className="text-sm font-semibold text-gray-900">
          How big is 1 of each unit?
        </h2>
        <ul className="space-y-1">
          {UNITS.filter((u) => u !== 'in' && u !== 'cm').map((u) => {
            const p = pxPerUnit(u, ctx);
            return (
              <li key={u} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-right font-mono text-gray-900">
                  1{u}
                </span>
                <span
                  className="h-3 min-w-[2px] rounded-full"
                  style={{ width: `${(p / maxBar) * 100}%` }}
                >
                  <span
                    className={`block h-full rounded-full ${KIND_STYLE[UNIT_KIND[u]]}`}
                  />
                </span>
                <span className="shrink-0 tabular-nums text-gray-600">
                  {fmt(p)}px
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-gray-500">
          Bar colours: grey absolute, indigo font-relative, green viewport,
          amber parent-relative — the type is also written next to each unit
          above.
        </p>
      </section>

      <section aria-labelledby="cu-box" className="space-y-3">
        <h2 id="cu-box" className="text-sm font-semibold text-gray-900">
          Size a box inside the viewport
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <NumberField
            label="Width"
            value={boxW}
            onChange={setBoxW}
            step="any"
            className="w-28"
          />
          <SelectField
            label="Unit"
            value={boxWUnit}
            onChange={(u) => setBoxWUnit(u as CssUnit)}
            options={unitOptions}
            className="w-24"
          />
          <NumberField
            label="Height"
            value={boxH}
            onChange={setBoxH}
            step="any"
            className="w-28"
          />
          <SelectField
            label="Unit"
            value={boxHUnit}
            onChange={(u) => setBoxHUnit(u as CssUnit)}
            options={unitOptions}
            className="w-24"
          />
        </div>
        <div className="overflow-x-auto">
          <div
            className="relative rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
            style={{
              width: mockW,
              height: Math.max(40, ctx.viewportHeight * scale),
            }}
            aria-label={`Viewport ${ctx.viewportWidth} by ${ctx.viewportHeight} pixels, drawn at ${Math.round(scale * 100)}%`}
            role="img"
          >
            <span className="absolute right-2 top-1 text-xs text-gray-400">
              viewport {ctx.viewportWidth}×{ctx.viewportHeight}px ·{' '}
              {Math.round(scale * 100)}% scale
            </span>
            <div
              className="absolute left-3 top-5 flex items-center justify-center rounded-lg bg-brand-500/80 text-center text-xs font-medium text-white"
              style={{
                width: Math.max(2, bw * scale),
                height: Math.max(2, bh * scale),
              }}
            >
              {fmt(bw)}×{fmt(bh)}px
            </div>
          </div>
        </div>
        <p className="font-mono text-sm text-gray-700">
          width: {boxW}
          {boxWUnit}; /* {fmt(bw)}px */ height: {boxH}
          {boxHUnit}; /* {fmt(bh)}px */
        </p>
      </section>

      <section
        aria-labelledby="cu-learn"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        <h2 id="cu-learn" className="sr-only">
          About CSS units
        </h2>
        {[
          [
            'Absolute units',
            'px, pt, cm, mm, in. Fixed sizes: 1in = 96px = 72pt in CSS, whatever the screen. Good for borders and shadows.',
          ],
          [
            'Font-relative units',
            `rem follows the root font size (${ctx.rootFontSize}px here) — the best default for type and spacing. em follows the parent’s font size, so it compounds when nested. ch is the width of “0” and ex the height of “x” in the current font.`,
          ],
          [
            'Viewport units',
            `1vw = 1% of the viewport width (${fmt(ctx.viewportWidth / 100)}px here), 1vh = 1% of its height. vmin/vmax use the smaller/larger side. On phones, dvh/svh/lvh handle the moving address bar.`,
          ],
          [
            'Relative to the parent',
            '% sizes refer to the parent: width uses its width, font-size uses its font size, and vertical padding/margin also use its width.',
          ],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{t}</h3>
            <p className="mt-1 text-sm text-gray-600">{d}</p>
          </div>
        ))}
      </section>
      <p className="text-xs text-gray-500">
        Lay out what you’ve sized with the{' '}
        <Link
          className="text-brand-600 underline underline-offset-2"
          href="/online-tool/developer-tools/flexbox-playground"
        >
          Flexbox playground
        </Link>{' '}
        or{' '}
        <Link
          className="text-brand-600 underline underline-offset-2"
          href="/online-tool/developer-tools/grid-playground"
        >
          CSS Grid playground
        </Link>
        .
      </p>
    </div>
  );
}
