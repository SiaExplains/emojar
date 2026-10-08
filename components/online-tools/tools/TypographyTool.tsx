'use client';

import { useEffect, useRef, useState } from 'react';
import { contrastRatio, parseColor } from '@/lib/online-tools/engines/color';
import { num } from '@/lib/online-tools/engines/css-generators';
import type { ToolProps } from '../ToolRenderer';
import {
  NumberField,
  RangeField,
  SelectField,
  ToolInput,
  btnSecondary,
  labelBase,
} from '../ui';
import { CodePanel } from './playground-shared';

// Only stacks that resolve to fonts already on the visitor's device — no
// web fonts are downloaded, so the preview matches what the CSS will do.
const FONTS: { value: string; label: string; stack: string }[] = [
  {
    value: 'system',
    label: 'System UI (sans-serif)',
    stack:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    value: 'arial',
    label: 'Arial / Helvetica',
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  },
  { value: 'verdana', label: 'Verdana', stack: 'Verdana, Geneva, sans-serif' },
  {
    value: 'tahoma',
    label: 'Tahoma',
    stack: 'Tahoma, Verdana, "Segoe UI", sans-serif',
  },
  {
    value: 'trebuchet',
    label: 'Trebuchet MS',
    stack: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif',
  },
  {
    value: 'rounded',
    label: 'ui-rounded',
    stack:
      'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", system-ui, sans-serif',
  },
  {
    value: 'georgia',
    label: 'Georgia (serif)',
    stack: 'Georgia, "Times New Roman", Times, serif',
  },
  {
    value: 'uiserif',
    label: 'ui-serif',
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  },
  {
    value: 'times',
    label: 'Times New Roman',
    stack: '"Times New Roman", Times, serif',
  },
  {
    value: 'courier',
    label: 'Courier New (monospace)',
    stack: '"Courier New", Courier, monospace',
  },
  {
    value: 'mono',
    label: 'ui-monospace',
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
];

const SAMPLES: Record<string, string> = {
  'Heading + paragraph':
    'Good type is invisible\n\nWhen the size, spacing and line length are right, readers stop noticing the letters and simply read. Try changing one setting at a time and watch how the rhythm of the paragraph changes.',
  'Long paragraph':
    'A comfortable line holds roughly 45 to 75 characters. Shorter lines make the eye jump back too often, and longer ones make it hard to find the start of the next line. Line height matters just as much: body text usually reads best between 1.4 and 1.7 times the font size, while large headings can be set tighter. Letter spacing is best left alone for body text, but a little extra helps small capitals and all-caps labels breathe. Finally, check the contrast between the text and its background so the words stay readable on every screen and in bright sunlight.',
  'UI labels':
    'Sign in    Create account    Forgot password?\nSave changes    Cancel\nSettings › Notifications › Email\n3 new messages · Updated 2 minutes ago',
};

const DEVICES = [
  { w: 375, label: 'Mobile 375' },
  { w: 768, label: 'Tablet 768' },
  { w: 1200, label: 'Desktop 1200' },
];
const FRAME_H = 420;

type State = {
  font: string;
  size: number;
  unit: 'px' | 'rem';
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  align: string;
  transform: string;
  color: string;
  bg: string;
  width: number;
  widthUnit: 'ch' | 'px';
};
const DEFAULT: State = {
  font: 'system',
  size: 18,
  unit: 'px',
  weight: 400,
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  align: 'left',
  transform: 'none',
  color: '#1f2937',
  bg: '#ffffff',
  width: 65,
  widthUnit: 'ch',
};

export default function TypographyTool(_: ToolProps) {
  const [text, setText] = useState(SAMPLES['Heading + paragraph']);
  const [s, setS] = useState<State>(DEFAULT);
  const [device, setDevice] = useState(375);
  const [avail, setAvail] = useState(device);
  const wrapRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof State>(k: K, v: State[K]) =>
    setS((cur) => ({ ...cur, [k]: v }));

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setAvail(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1, avail / device);

  const font = FONTS.find((f) => f.value === s.font) ?? FONTS[0];
  const sizePx = s.unit === 'rem' ? s.size * 16 : s.size;
  const fg = parseColor(s.color);
  const bgc = parseColor(s.bg);
  const ratio = fg && bgc ? contrastRatio(fg, bgc) : null;
  // WCAG "large text": 24px, or 18.66px (14pt) when bold.
  const large = sizePx >= 24 || (sizePx >= 18.66 && s.weight >= 700);
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;

  const sizeCss = `${num(s.size, 3)}${s.unit}`;
  const decl: [string, string][] = [
    ['font-family', font.stack],
    ['font-size', sizeCss],
    ['font-weight', String(s.weight)],
    ['line-height', num(s.lineHeight)],
    [
      'letter-spacing',
      s.letterSpacing ? `${num(s.letterSpacing, 3)}em` : 'normal',
    ],
  ];
  if (s.wordSpacing) decl.push(['word-spacing', `${num(s.wordSpacing, 3)}em`]);
  if (s.align !== 'left') decl.push(['text-align', s.align]);
  if (s.transform !== 'none') decl.push(['text-transform', s.transform]);
  decl.push(
    ['color', s.color],
    ['background-color', s.bg],
    ['max-width', `${s.width}${s.widthUnit}`],
  );
  const css = `.text {\n${decl.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

  const changeUnit = (u: string) => {
    const unit = u === 'rem' ? 'rem' : 'px';
    if (unit === s.unit) return;
    setS((cur) => ({
      ...cur,
      unit,
      size:
        unit === 'rem'
          ? Number(num(cur.size / 16, 3))
          : Math.round(cur.size * 16),
    }));
  };
  const changeWidthUnit = (u: string) => {
    const widthUnit = u === 'px' ? 'px' : 'ch';
    if (widthUnit === s.widthUnit) return;
    // Rough conversion: 1ch is about half the font size in most fonts.
    const ch = sizePx * 0.5;
    setS((cur) => ({
      ...cur,
      widthUnit,
      width:
        widthUnit === 'px'
          ? Math.round(cur.width * ch)
          : Math.round(cur.width / ch),
    }));
  };

  const color = (k: 'color' | 'bg', label: string) => (
    <div className="space-y-1.5">
      <label htmlFor={`ty-${k}`} className={labelBase}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={`ty-${k}`}
          type="color"
          value={s[k]}
          onChange={(e) => set(k, e.target.value)}
          className="h-[38px] w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
        />
        <span className="font-mono text-xs text-gray-600">{s[k]}</span>
      </div>
    </div>
  );

  const sizeMax = s.unit === 'rem' ? 6 : 96;

  return (
    <div className="space-y-6">
      <ToolInput
        label="Sample text"
        value={text}
        onChange={setText}
        rows={4}
        mono={false}
        actions={Object.keys(SAMPLES).map((k) => (
          <button
            key={k}
            type="button"
            className={btnSecondary}
            onClick={() => setText(SAMPLES[k])}
          >
            {k}
          </button>
        ))}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4">
          <SelectField
            label="Font family"
            value={s.font}
            onChange={(v) => set('font', v)}
            options={FONTS.map((f) => ({ value: f.value, label: f.label }))}
          />
          <div className="grid grid-cols-[1fr_6rem] items-end gap-2">
            <RangeField
              label="Font size"
              value={Math.min(s.size, sizeMax)}
              onChange={(v) => set('size', v)}
              min={s.unit === 'rem' ? 0.5 : 8}
              max={sizeMax}
              step={s.unit === 'rem' ? 0.125 : 1}
              display={sizeCss}
            />
            <SelectField
              label="Size unit"
              value={s.unit}
              onChange={changeUnit}
              options={[
                { value: 'px', label: 'px' },
                { value: 'rem', label: 'rem' },
              ]}
            />
          </div>
          <RangeField
            label="Font weight"
            value={s.weight}
            onChange={(v) => set('weight', v)}
            min={100}
            max={900}
            step={100}
          />
          <RangeField
            label="Line height"
            value={s.lineHeight}
            onChange={(v) => set('lineHeight', v)}
            min={0.8}
            max={2.5}
            step={0.05}
          />
          <RangeField
            label="Letter spacing"
            value={s.letterSpacing}
            onChange={(v) => set('letterSpacing', v)}
            min={-0.1}
            max={0.5}
            step={0.01}
            display={`${num(s.letterSpacing, 3)}em`}
          />
          <RangeField
            label="Word spacing"
            value={s.wordSpacing}
            onChange={(v) => set('wordSpacing', v)}
            min={-0.2}
            max={1}
            step={0.05}
            display={`${num(s.wordSpacing, 3)}em`}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Alignment"
              value={s.align}
              onChange={(v) => set('align', v)}
              options={['left', 'center', 'right', 'justify'].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <SelectField
              label="Text transform"
              value={s.transform}
              onChange={(v) => set('transform', v)}
              options={['none', 'uppercase', 'lowercase', 'capitalize'].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {color('color', 'Text colour')}
            {color('bg', 'Background')}
          </div>
          {ratio !== null && (
            <div
              className="rounded-xl border border-gray-200 p-3 text-sm"
              aria-live="polite"
            >
              <p>
                Contrast{' '}
                <strong className="tabular-nums">{ratio.toFixed(2)}:1</strong>{' '}
                <span className="text-xs text-gray-500">
                  ({large ? 'large' : 'normal'} text)
                </span>
              </p>
              <p className="mt-1 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ratio >= aa ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                >
                  AA {ratio >= aa ? '✓ pass' : '✗ fail'} (≥ {aa}:1)
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ratio >= aaa ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                >
                  AAA {ratio >= aaa ? '✓ pass' : '✗ fail'} (≥ {aaa}:1)
                </span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-[1fr_6rem] items-end gap-2">
            <NumberField
              label="Container max-width"
              value={s.width}
              min={1}
              onChange={(v) => {
                const n = Number(v);
                if (v !== '' && Number.isFinite(n) && n > 0)
                  set('width', Math.min(Math.round(n), 5000));
              }}
            />
            <SelectField
              label="Width unit"
              value={s.widthUnit}
              onChange={changeWidthUnit}
              options={[
                { value: 'ch', label: 'ch' },
                { value: 'px', label: 'px' },
              ]}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Preview width"
          >
            {DEVICES.map((d) => (
              <button
                key={d.w}
                type="button"
                aria-pressed={device === d.w}
                onClick={() => setDevice(d.w)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  device === d.w
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div ref={wrapRef} className="w-full">
            <div
              className="overflow-hidden rounded-2xl border border-gray-300 bg-gray-100"
              style={{ width: device * scale, height: FRAME_H * scale }}
            >
              <div
                className="overflow-auto"
                style={{
                  width: device,
                  height: FRAME_H,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  background: s.bg,
                }}
                tabIndex={0}
                role="region"
                aria-label={`Preview at ${device}px wide`}
              >
                <div
                  className="whitespace-pre-wrap px-5 py-6"
                  style={{
                    fontFamily: font.stack,
                    fontSize: sizeCss,
                    fontWeight: s.weight,
                    lineHeight: s.lineHeight,
                    letterSpacing: s.letterSpacing
                      ? `${s.letterSpacing}em`
                      : 'normal',
                    wordSpacing: s.wordSpacing
                      ? `${s.wordSpacing}em`
                      : undefined,
                    textAlign: s.align as 'left',
                    textTransform: s.transform as 'none',
                    color: s.color,
                    backgroundColor: s.bg,
                    maxWidth: `${s.width}${s.widthUnit}`,
                  }}
                >
                  {text || 'Type some sample text above.'}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {scale < 1
              ? `Shown at ${Math.round(scale * 100)}% to fit your screen. `
              : ''}
            System fonts may not include every weight; the browser then uses the
            nearest one.
          </p>
          <CodePanel css={css} />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setS(DEFAULT);
              setText(SAMPLES['Heading + paragraph']);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
