// DPI / print size and percentage difference (v0.24.0). Same declarative
// shape as CALCULATORS: input fields plus a pure compute().

import { fail, num } from './calc-helpers';
import type { CalcResult, CalculatorDefinition } from './calculators';
import { formatNumber } from './units';

const MM_PER: Record<string, number> = { in: 25.4, cm: 10, mm: 1 };
const UNIT_LABEL: Record<string, string> = { in: 'in', cm: 'cm', mm: 'mm' };
const UNIT_CHOICES = [
  { value: 'in', label: 'Inches (in)' },
  { value: 'cm', label: 'Centimetres (cm)' },
  { value: 'mm', label: 'Millimetres (mm)' },
];

const fixed = (n: number, d = 2) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-US', {
        maximumFractionDigits: d,
        minimumFractionDigits: 0,
      })
    : '—';

/** Rough print-quality guide for a resolution in pixels per inch. */
export function dpiQuality(ppi: number): string {
  if (ppi >= 300) return 'Photo quality — sharp even when viewed up close.';
  if (ppi >= 200) return 'Good — fine for most prints held in the hand.';
  if (ppi >= 150)
    return 'Acceptable for posters and prints seen from a distance.';
  if (ppi >= 72)
    return 'Low — pixels may be visible up close; fine for large banners viewed far away.';
  return 'Very low — the print will look blocky.';
}

const positive = (n: number) => Number.isFinite(n) && n > 0;

export const EXTRA_CALCULATORS: Record<string, CalculatorDefinition> = {
  dpi: {
    fields: [
      {
        id: 'mode',
        label: 'Calculate',
        type: 'select',
        default: 'size',
        choices: [
          { value: 'size', label: 'Print size from pixels and DPI' },
          { value: 'pixels', label: 'Pixels needed for a print size' },
          { value: 'dpi', label: 'DPI from pixels and print size' },
        ],
      },
      {
        id: 'wpx',
        label: 'Image width',
        type: 'number',
        default: '3000',
        min: 1,
        step: 1,
        suffix: 'px',
        showIf: { field: 'mode', values: ['size', 'dpi'] },
      },
      {
        id: 'hpx',
        label: 'Image height',
        type: 'number',
        default: '2000',
        min: 1,
        step: 1,
        suffix: 'px',
        showIf: { field: 'mode', values: ['size', 'dpi'] },
      },
      {
        id: 'dpi',
        label: 'Resolution',
        type: 'number',
        default: '300',
        min: 1,
        step: 'any',
        suffix: 'DPI',
        showIf: { field: 'mode', values: ['size', 'pixels'] },
        help: '300 for photo prints, 150 for posters, 72–96 is screen resolution.',
      },
      {
        id: 'w',
        label: 'Print width',
        type: 'number',
        default: '6',
        min: 0,
        step: 'any',
        showIf: { field: 'mode', values: ['pixels', 'dpi'] },
      },
      {
        id: 'h',
        label: 'Print height',
        type: 'number',
        default: '4',
        min: 0,
        step: 'any',
        showIf: { field: 'mode', values: ['pixels', 'dpi'] },
      },
      {
        id: 'unit',
        label: 'Unit',
        type: 'select',
        default: 'in',
        choices: UNIT_CHOICES,
      },
    ],
    compute: (v) => {
      const unit = MM_PER[v.unit] ? v.unit : 'in';
      const u = UNIT_LABEL[unit];
      const toUnit = (inches: number) => (inches * 25.4) / MM_PER[unit];
      const toInches = (x: number) => (x * MM_PER[unit]) / 25.4;
      if (v.mode === 'pixels') {
        const dpi = num(v, 'dpi');
        const w = num(v, 'w');
        const h = num(v, 'h');
        if (!positive(dpi)) return fail('Enter a resolution above 0 DPI.');
        if (!positive(w) || !positive(h))
          return fail('Enter a print width and height above 0.');
        const pw = Math.ceil(toInches(w) * dpi);
        const ph = Math.ceil(toInches(h) * dpi);
        return {
          ok: true,
          results: [
            {
              label: 'Pixels needed',
              value: `${pw.toLocaleString('en-US')} × ${ph.toLocaleString('en-US')} px`,
              primary: true,
            },
            { label: 'Megapixels', value: `${fixed((pw * ph) / 1e6, 1)} MP` },
          ],
          note: `${fixed(w)} × ${fixed(h)} ${u} is ${fixed(toInches(w), 3)} × ${fixed(toInches(h), 3)} in. Pixels = inches × DPI, rounded up: ${fixed(toInches(w), 3)} × ${formatNumber(dpi)} = ${pw.toLocaleString('en-US')}.`,
        };
      }
      const wpx = num(v, 'wpx');
      const hpx = num(v, 'hpx');
      if (!positive(wpx) || !positive(hpx))
        return fail('Enter the image width and height in pixels (above 0).');
      if (v.mode === 'dpi') {
        const w = num(v, 'w');
        const h = num(v, 'h');
        if (!positive(w) || !positive(h))
          return fail('Enter a print width and height above 0.');
        const dx = wpx / toInches(w);
        const dy = hpx / toInches(h);
        const low = Math.min(dx, dy);
        const aspectImg = wpx / hpx;
        const aspectPrint = w / h;
        const crop = Math.abs(aspectImg / aspectPrint - 1) > 0.01;
        return {
          ok: true,
          results: [
            {
              label: 'Effective resolution',
              value: `${fixed(low, 0)} DPI`,
              primary: true,
            },
            {
              label: 'Horizontal × vertical',
              value: `${fixed(dx, 1)} × ${fixed(dy, 1)} DPI`,
            },
            { label: 'Quality guide', value: dpiQuality(low) },
          ],
          note: `DPI = pixels ÷ inches: ${formatNumber(wpx)} px ÷ ${fixed(toInches(w), 3)} in = ${fixed(dx, 1)}.${crop ? ' The image and the print have different shapes, so it will be cropped or have borders; the lower value is the one that counts.' : ''}`,
        };
      }
      const dpi = num(v, 'dpi');
      if (!positive(dpi)) return fail('Enter a resolution above 0 DPI.');
      const wi = wpx / dpi;
      const hi = hpx / dpi;
      return {
        ok: true,
        results: [
          {
            label: 'Print size',
            value: `${fixed(toUnit(wi))} × ${fixed(toUnit(hi))} ${u}`,
            primary: true,
          },
          { label: 'In inches', value: `${fixed(wi)} × ${fixed(hi)} in` },
          {
            label: 'In centimetres',
            value: `${fixed(wi * 2.54)} × ${fixed(hi * 2.54)} cm`,
          },
          { label: 'Quality guide', value: dpiQuality(dpi) },
        ],
        note: `Inches = pixels ÷ DPI: ${formatNumber(wpx)} ÷ ${formatNumber(dpi)} = ${fixed(wi, 3)} in. The DPI setting only decides the print size; it adds no detail to the image.`,
      };
    },
  },

  'percentage-difference': {
    fields: [
      {
        id: 'a',
        label: 'Value A (first / original)',
        type: 'number',
        default: '50',
        step: 'any',
      },
      {
        id: 'b',
        label: 'Value B (second / new)',
        type: 'number',
        default: '75',
        step: 'any',
      },
      {
        id: 'decimals',
        label: 'Decimal places',
        type: 'select',
        default: '2',
        choices: ['0', '1', '2', '3', '4', '6'].map((d) => ({
          value: d,
          label: d,
        })),
      },
    ],
    compute: (v) => {
      const a = num(v, 'a');
      const b = num(v, 'b');
      if (!Number.isFinite(a) || !Number.isFinite(b))
        return fail('Enter both values.');
      const dp = Math.min(10, Math.max(0, Number(v.decimals) || 0));
      const f = (n: number) =>
        n.toLocaleString('en-US', {
          minimumFractionDigits: dp,
          maximumFractionDigits: dp,
        });
      const diff = b - a;
      const results: CalcResult[] = [
        { label: 'Absolute difference |B − A|', value: f(Math.abs(diff)) },
      ];
      const notes: string[] = [];
      if (a === 0) {
        results.push({ label: 'Percentage change A → B', value: 'Undefined' });
        notes.push(
          'Percentage change divides by A, and A is 0, so it isn’t defined (any change from zero is an infinite percentage).',
        );
      } else {
        const ch = (diff / Math.abs(a)) * 100;
        results.push({
          label: 'Percentage change A → B',
          value: `${ch > 0 ? '+' : ''}${f(ch)}% (${ch > 0 ? 'increase' : ch < 0 ? 'decrease' : 'no change'})`,
          primary: true,
        });
        notes.push(
          `Change = (B − A) ÷ |A| × 100 = (${formatNumber(b)} − ${formatNumber(a)}) ÷ ${formatNumber(Math.abs(a))} × 100 = ${f(ch)}%.`,
        );
      }
      const mean = (Math.abs(a) + Math.abs(b)) / 2;
      if (mean === 0) {
        results.push({ label: 'Percentage difference', value: 'Undefined' });
        notes.push(
          'Both values are 0, so the percentage difference isn’t defined.',
        );
      } else {
        const pd = (Math.abs(diff) / mean) * 100;
        results.push({
          label: 'Percentage difference (symmetric)',
          value: `${f(pd)}%`,
          ...(a === 0 ? { primary: true } : {}),
        });
        notes.push(
          `Difference = |A − B| ÷ ((|A| + |B|) ÷ 2) × 100 = ${formatNumber(Math.abs(diff))} ÷ ${formatNumber(mean)} × 100 = ${f(pd)}%. It is the same whichever value comes first.`,
        );
        if (a !== 0 && b !== 0 && Math.sign(a) !== Math.sign(b))
          notes.push(
            'A and B have opposite signs, so both percentages can exceed 100% and are hard to interpret — the absolute difference is usually more meaningful.',
          );
      }
      if (a !== 0)
        results.push({
          label: 'B as a percentage of A',
          value: `${f((b / a) * 100)}%`,
        });
      return { ok: true, results, note: notes.join(' ') };
    },
  },
};
