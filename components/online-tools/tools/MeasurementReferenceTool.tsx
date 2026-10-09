'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SOCIAL_PLATFORMS } from '@/lib/online-tools/image/layout';
import type { ToolProps } from '../ToolRenderer';
import { Chips, useCopyFlash } from './ReferenceUI';

type Section = 'paper' | 'ratios' | 'images' | 'type' | 'social';

// ISO 216 (A series) and ANSI/North American sizes, in millimetres.
const PAPER: {
  name: string;
  w: number;
  h: number;
  family: 'ISO' | 'US';
  use: string;
}[] = [
  {
    name: 'A0',
    w: 841,
    h: 1189,
    family: 'ISO',
    use: 'Posters, technical drawings',
  },
  { name: 'A1', w: 594, h: 841, family: 'ISO', use: 'Posters, flip charts' },
  { name: 'A2', w: 420, h: 594, family: 'ISO', use: 'Posters, drawings' },
  { name: 'A3', w: 297, h: 420, family: 'ISO', use: 'Diagrams, small posters' },
  {
    name: 'A4',
    w: 210,
    h: 297,
    family: 'ISO',
    use: 'Letters, documents (most of the world)',
  },
  { name: 'A5', w: 148, h: 210, family: 'ISO', use: 'Notebooks, flyers' },
  { name: 'A6', w: 105, h: 148, family: 'ISO', use: 'Postcards' },
  {
    name: 'Letter',
    w: 215.9,
    h: 279.4,
    family: 'US',
    use: 'Documents (US, Canada, Mexico)',
  },
  {
    name: 'Legal',
    w: 215.9,
    h: 355.6,
    family: 'US',
    use: 'Contracts, legal forms',
  },
  {
    name: 'Tabloid / Ledger',
    w: 279.4,
    h: 431.8,
    family: 'US',
    use: 'Newspapers, spreadsheets',
  },
];

const RATIOS: { r: string; w: number; h: number; use: string }[] = [
  { r: '16:9', w: 16, h: 9, use: 'HD video, TVs, most monitors and YouTube' },
  { r: '16:10', w: 16, h: 10, use: 'Laptops (MacBook) and some monitors' },
  { r: '4:3', w: 4, h: 3, use: 'Older TVs and monitors, iPad, many cameras' },
  { r: '3:2', w: 3, h: 2, use: '35 mm photos, Surface and some laptops' },
  { r: '21:9', w: 21, h: 9, use: 'Ultrawide monitors, cinema (≈2.37:1)' },
  { r: '1:1', w: 1, h: 1, use: 'Square posts and profile pictures' },
  { r: '4:5', w: 4, h: 5, use: 'Portrait social posts' },
  {
    r: '9:16',
    w: 9,
    h: 16,
    use: 'Phone screens, Stories, Reels, Shorts, TikTok',
  },
];

const RESOLUTIONS: { name: string; w: number; h: number }[] = [
  { name: 'QVGA', w: 320, h: 240 },
  { name: 'VGA', w: 640, h: 480 },
  { name: 'HD (720p)', w: 1280, h: 720 },
  { name: 'Full HD (1080p)', w: 1920, h: 1080 },
  { name: 'QHD / 1440p', w: 2560, h: 1440 },
  { name: '4K UHD (2160p)', w: 3840, h: 2160 },
  { name: '8K UHD (4320p)', w: 7680, h: 4320 },
];

const TYPE_SIZES = [10, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const mmToIn = (mm: number) => mm / 25.4;
const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const simplest = (w: number, h: number) => {
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
};

export default function MeasurementReferenceTool({ config }: ToolProps) {
  const init = String(config.init_section ?? 'paper') as Section;
  const [section, setSection] = useState<Section>(
    ['paper', 'ratios', 'images', 'type', 'social'].includes(init)
      ? init
      : 'paper',
  );
  const [paper, setPaper] = useState(String(config.init_paper ?? 'A4'));
  const [base, setBase] = useState(16);
  const { copy, region } = useCopyFlash();
  const sel = PAPER.find((p) => p.name === paper) ?? PAPER[4];

  const copyBtn = (text: string) => (
    <button
      type="button"
      onClick={() => void copy(text)}
      aria-label={`Copy ${text}`}
      className="whitespace-nowrap rounded-md px-1 font-mono tabular-nums hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {text}
    </button>
  );

  return (
    <div className="space-y-5">
      <Chips
        label="Reference section"
        value={section}
        onChange={setSection}
        options={[
          { value: 'paper', label: '📄 Paper sizes' },
          { value: 'ratios', label: '▭ Aspect ratios' },
          { value: 'images', label: '🖥️ Screen & image sizes' },
          { value: 'type', label: '🔤 Typography units' },
          { value: 'social', label: '📱 Social media sizes' },
        ]}
      />
      {region}

      {section === 'paper' && (
        <section aria-labelledby="mr-paper" className="space-y-4">
          <h2 id="mr-paper" className="text-sm font-semibold text-gray-900">
            Paper sizes, drawn to scale
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_16rem]">
            <svg
              viewBox="0 0 900 600"
              className="h-auto w-full rounded-2xl border border-gray-100 bg-gray-50"
              role="img"
              aria-label={`${sel.name} is ${sel.w} by ${sel.h} millimetres, shown against A0 to A6 and US sizes`}
            >
              {/* A series nests: each size is half of the one above. */}
              {PAPER.filter((p) => p.family === 'ISO').map((p) => {
                const s = 0.48; // px per mm
                return (
                  <g
                    key={p.name}
                    onClick={() => setPaper(p.name)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={20}
                      y={20}
                      width={p.w * s}
                      height={p.h * s}
                      className={
                        p.name === sel.name
                          ? 'fill-brand-200 stroke-brand-600'
                          : 'fill-white stroke-gray-400'
                      }
                      strokeWidth={p.name === sel.name ? 2 : 1}
                      fillOpacity={0.6}
                    />
                    <text
                      x={20 + p.w * s - 6}
                      y={20 + p.h * s - 6}
                      textAnchor="end"
                      className="fill-gray-600 text-[13px]"
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}
              {PAPER.filter((p) => p.family === 'US').map((p, i, us) => {
                const s = 0.48;
                const x =
                  470 + us.slice(0, i).reduce((n, q) => n + q.w * s + 20, 0);
                return (
                  <g
                    key={p.name}
                    onClick={() => setPaper(p.name)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={40}
                      width={p.w * s}
                      height={p.h * s}
                      className={
                        p.name === sel.name
                          ? 'fill-brand-200 stroke-brand-600'
                          : 'fill-white stroke-gray-400'
                      }
                      strokeWidth={p.name === sel.name ? 2 : 1}
                    />
                    <text
                      x={x + 4}
                      y={40 + p.h * s + 16}
                      className="fill-gray-600 text-[12px]"
                    >
                      {p.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
              <text x={470} y={28} className="fill-gray-400 text-[12px]">
                US sizes (same scale)
              </text>
            </svg>
            <div
              className="space-y-2 rounded-2xl border border-gray-100 p-4"
              aria-live="polite"
            >
              <p className="text-lg font-semibold text-gray-900">{sel.name}</p>
              <p className="text-sm text-gray-600">{sel.use}</p>
              <ul className="space-y-1 text-sm">
                <li>{copyBtn(`${sel.w} × ${sel.h} mm`)}</li>
                <li>{copyBtn(`${r1(sel.w / 10)} × ${r1(sel.h / 10)} cm`)}</li>
                <li>
                  {copyBtn(`${r2(mmToIn(sel.w))} × ${r2(mmToIn(sel.h))} in`)}
                </li>
                <li>
                  {copyBtn(
                    `${Math.round(mmToIn(sel.w) * 72)} × ${Math.round(mmToIn(sel.h) * 72)} pt`,
                  )}
                </li>
                <li>
                  {copyBtn(
                    `${Math.round(mmToIn(sel.w) * 300)} × ${Math.round(mmToIn(sel.h) * 300)} px @ 300 dpi`,
                  )}
                </li>
                <li>
                  {copyBtn(
                    `${Math.round(mmToIn(sel.w) * 96)} × ${Math.round(mmToIn(sel.h) * 96)} px @ 96 dpi`,
                  )}
                </li>
              </ul>
              <p className="text-xs text-gray-500">
                Ratio 1 : {(sel.h / sel.w).toFixed(3)}
                {sel.family === 'ISO' ? ' (√2 — halving keeps the shape)' : ''}
              </p>
            </div>
          </div>
          <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">
                Paper sizes in millimetres, inches and points
              </caption>
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  {[
                    'Size',
                    'Millimetres',
                    'Inches',
                    'Points',
                    'Ratio',
                    'Typical use',
                  ].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAPER.map((p) => (
                  <tr
                    key={p.name}
                    className={`border-t border-gray-100 ${p.name === sel.name ? 'bg-brand-50/60' : ''}`}
                  >
                    <th scope="row" className="px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => setPaper(p.name)}
                        className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-2"
                      >
                        {p.name}
                      </button>
                    </th>
                    <td className="px-2 py-1.5">
                      {copyBtn(`${p.w} × ${p.h} mm`)}
                    </td>
                    <td className="px-2 py-1.5">
                      {copyBtn(`${r2(mmToIn(p.w))} × ${r2(mmToIn(p.h))} in`)}
                    </td>
                    <td className="px-2 py-1.5">
                      {copyBtn(
                        `${Math.round(mmToIn(p.w) * 72)} × ${Math.round(mmToIn(p.h) * 72)} pt`,
                      )}
                    </td>
                    <td className="px-3 py-1.5 tabular-nums text-gray-600">
                      1 : {(p.h / p.w).toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-gray-600">{p.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === 'ratios' && (
        <section aria-labelledby="mr-ratios" className="space-y-3">
          <h2 id="mr-ratios" className="text-sm font-semibold text-gray-900">
            Screen and video aspect ratios
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RATIOS.map((a) => {
              const max = 120;
              const k = max / Math.max(a.w, a.h);
              return (
                <li
                  key={a.r}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 p-4 text-center"
                >
                  <div className="flex h-[124px] items-center justify-center">
                    <div
                      className="rounded-md border-2 border-brand-500 bg-brand-50"
                      style={{ width: a.w * k, height: a.h * k }}
                      aria-hidden
                    />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {copyBtn(a.r)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(a.w / a.h).toFixed(3)} : 1
                  </p>
                  <p className="text-sm text-gray-600">{a.use}</p>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-gray-500">
            Work out a missing width or height with the{' '}
            <Link
              className="text-brand-600 underline underline-offset-2"
              href="/online-tool/calculators/aspect-ratio-calculator"
            >
              aspect ratio calculator
            </Link>
            .
          </p>
        </section>
      )}

      {section === 'images' && (
        <section aria-labelledby="mr-images" className="space-y-3">
          <h2 id="mr-images" className="text-sm font-semibold text-gray-900">
            Common screen and image resolutions, to scale
          </h2>
          <svg
            viewBox="0 0 784 444"
            className="h-auto w-full rounded-2xl border border-gray-100 bg-gray-50"
            role="img"
            aria-label="Resolutions from QVGA to 8K drawn to scale from the same corner"
          >
            {[...RESOLUTIONS].reverse().map((r, i) => {
              const s = 760 / 7680;
              return (
                <g key={r.name}>
                  <rect
                    x={12}
                    y={12}
                    width={r.w * s}
                    height={r.h * s}
                    className="stroke-brand-500"
                    fill={`rgba(99,102,241,${0.06 + i * 0.03})`}
                    strokeWidth={1}
                  />
                  <text
                    x={12 + r.w * s - 4}
                    y={12 + r.h * s - 4}
                    textAnchor="end"
                    className="fill-gray-700 text-xs"
                  >
                    {r.name}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">
                Resolutions with ratio and megapixels
              </caption>
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  {['Name', 'Pixels', 'Ratio', 'Megapixels'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESOLUTIONS.map((r) => (
                  <tr key={r.name} className="border-t border-gray-100">
                    <th
                      scope="row"
                      className="px-3 py-1.5 font-medium text-gray-900"
                    >
                      {r.name}
                    </th>
                    <td className="px-2 py-1.5">{copyBtn(`${r.w}×${r.h}`)}</td>
                    <td className="px-3 py-1.5 text-gray-600">
                      {simplest(r.w, r.h)}
                    </td>
                    <td className="px-3 py-1.5 tabular-nums text-gray-600">
                      {r1((r.w * r.h) / 1e6)} MP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === 'type' && (
        <section aria-labelledby="mr-type" className="space-y-3">
          <h2 id="mr-type" className="text-sm font-semibold text-gray-900">
            px, pt, em and rem
          </h2>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            Base font size
            <select
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="rounded-lg border border-gray-200 px-2 py-1"
            >
              {[14, 15, 16, 18, 20].map((b) => (
                <option key={b} value={b}>
                  {b}px
                </option>
              ))}
            </select>
          </label>
          <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">
                Font sizes in px, pt and rem
              </caption>
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  {['px', 'pt', 'em / rem', 'Preview'].map((h) => (
                    <th key={h} scope="col" className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TYPE_SIZES.map((px) => (
                  <tr
                    key={px}
                    className={`border-t border-gray-100 ${px === base ? 'bg-brand-50/60' : ''}`}
                  >
                    <td className="px-2 py-1.5">{copyBtn(`${px}px`)}</td>
                    <td className="px-2 py-1.5">
                      {copyBtn(`${r2(px * 0.75)}pt`)}
                    </td>
                    <td className="px-2 py-1.5">
                      {copyBtn(`${r2(px / base)}rem`)}
                    </td>
                    <td
                      className="truncate px-3 py-1.5 text-gray-900"
                      style={{ fontSize: Math.min(px, 40) }}
                    >
                      Aa Quick fox
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            In CSS, 1in = 96px = 72pt, so 1pt = 1.333px. em is relative to the
            parent’s font size; rem to the root (html) font size. See every unit
            side by side in the{' '}
            <Link
              className="text-brand-600 underline underline-offset-2"
              href="/online-tool/developer-tools/css-unit-visualizer"
            >
              CSS unit visualizer
            </Link>
            .
          </p>
        </section>
      )}

      {section === 'social' && (
        <section aria-labelledby="mr-social" className="space-y-3">
          <h2 id="mr-social" className="text-sm font-semibold text-gray-900">
            Social media image sizes
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.entries(SOCIAL_PLATFORMS).map(([id, p]) => (
              <div key={id} className="rounded-2xl border border-gray-100 p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  {p.name}
                </h3>
                <ul className="space-y-1.5">
                  {p.presets.map((s) => {
                    const k = 40 / Math.max(s.w, s.h);
                    return (
                      <li
                        key={s.id}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center"
                          aria-hidden
                        >
                          <span
                            className="block rounded-sm border border-brand-500 bg-brand-50"
                            style={{ width: s.w * k, height: s.h * k }}
                          />
                        </span>
                        <span className="min-w-0 flex-1 text-gray-700">
                          {s.label}
                        </span>
                        {copyBtn(`${s.w}×${s.h}`)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Platforms change their recommendations from time to time — these are
            the sizes our{' '}
            <Link
              className="text-brand-600 underline underline-offset-2"
              href="/online-tool/image-tools/social-media-image-resizer"
            >
              social media image resizer
            </Link>{' '}
            uses, so you can crop to them directly.
          </p>
        </section>
      )}
    </div>
  );
}
