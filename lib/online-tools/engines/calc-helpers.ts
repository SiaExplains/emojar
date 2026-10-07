// Small formatting and parsing helpers shared by the form calculators.

import type { CalcOutput } from './calculators';
import { formatNumber } from './units';

export const fail = (error: string): CalcOutput => ({ ok: false, error });

/** Parses a field as a number ("" → NaN, thousands separators allowed). */
export function num(v: Record<string, string>, id: string): number {
  const raw = (v[id] ?? '').toString().replace(/,/g, '').trim();
  return raw === '' ? NaN : Number(raw);
}

export const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '—';

export const pct = (n: number) => `${formatNumber(n, 6)}%`;

export const plural = (n: number, word: string) =>
  `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;
