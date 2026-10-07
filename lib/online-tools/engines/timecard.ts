// Time card maths and calendar grids for the v0.11.0 date & time tools.

import { isoWeek } from './dates';

export type TimeEntry = { start: string; end: string; breakMin: string };

/** Parses "9:30", "09:30", "930", "9:30 pm", "21:30" → minutes after midnight. */
export function parseClock(input: string): number | null {
  const s = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!s) return null;
  const m = /^(\d{1,2})(?::?(\d{2}))?(am|pm|a|p)?$/.exec(s);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const ap = m[3];
  if (min > 59) return null;
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap.startsWith('a')) h = h === 12 ? 0 : h;
    else h = h === 12 ? 12 : h + 12;
  } else if (h > 24 || (h === 24 && min > 0)) return null;
  return h * 60 + min;
}

/** Worked minutes for one day; an end before the start means an overnight shift. */
export function workedMinutes(e: TimeEntry): number | null {
  const a = parseClock(e.start);
  const b = parseClock(e.end);
  if (a === null || b === null) return null;
  let span = b - a;
  if (span < 0) span += 24 * 60;
  const brk = Math.max(0, Number(e.breakMin) || 0);
  return Math.max(0, span - brk);
}

export type TimeCardResult = {
  days: (number | null)[];
  totalMin: number;
  regularMin: number;
  overtimeMin: number;
  pay: number;
};

export function timeCard(
  entries: TimeEntry[],
  opts: {
    rate?: number;
    overtimeMultiplier?: number;
    weeklyThresholdH?: number;
    dailyThresholdH?: number;
  } = {},
): TimeCardResult {
  const days = entries.map((e) =>
    !e.start.trim() && !e.end.trim() ? 0 : workedMinutes(e),
  );
  const daily = (opts.dailyThresholdH ?? 0) * 60;
  let dailyOt = 0;
  let total = 0;
  for (const d of days) {
    if (d === null) continue;
    total += d;
    if (daily > 0 && d > daily) dailyOt += d - daily;
  }
  const weekly = (opts.weeklyThresholdH ?? 40) * 60;
  const weeklyOt = weekly > 0 ? Math.max(0, total - dailyOt - weekly) : 0;
  const overtime = dailyOt + weeklyOt;
  const regular = total - overtime;
  const rate = opts.rate ?? 0;
  const mult = opts.overtimeMultiplier ?? 1.5;
  const pay =
    Math.round(((regular / 60) * rate + (overtime / 60) * rate * mult) * 100) /
    100;
  return {
    days,
    totalMin: total,
    regularMin: regular,
    overtimeMin: overtime,
    pay,
  };
}

export const formatHM = (min: number) =>
  `${Math.floor(min / 60)}:${String(Math.round(min % 60)).padStart(2, '0')}`;
export const formatDecimalHours = (min: number) => (min / 60).toFixed(2);

/* ------------------------------------------------------------------ */
/* Calendar grids                                                       */
/* ------------------------------------------------------------------ */

/**
 * Weeks of a month as rows of 7 day numbers (null = blank cell).
 * `weekStart` 1 = Monday, 0 = Sunday. Month is 0-based.
 */
export function monthGrid(
  year: number,
  month0: number,
  weekStart: 0 | 1,
): (number | null)[][] {
  const first = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const offset = (first - weekStart + 7) % 7;
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Localised weekday names starting at `weekStart`. */
export function weekdayNames(
  locale: string,
  weekStart: 0 | 1,
  style: 'short' | 'long' = 'short',
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, {
    weekday: style,
    timeZone: 'UTC',
  });
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2023, 0, 1 + ((i + weekStart) % 7)))),
  );
}

export function monthName(locale: string, month0: number): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2023, month0, 1)));
}

/** ISO week number of a calendar day (for week-number columns). */
export const isoWeekOf = (year: number, month0: number, day: number) =>
  isoWeek(new Date(Date.UTC(year, month0, day))).week;
