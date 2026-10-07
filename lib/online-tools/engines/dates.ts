// Calendar maths on plain dates (no time-of-day, no time zone drift). Dates
// are handled as UTC midnights so DST changes can never shift a day.

const DAY_MS = 86_400_000;

/** Parses "YYYY-MM-DD" to a UTC-midnight Date, or null if invalid. */
export function parseDateInput(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCMonth() === Number(m[2]) - 1 ? d : null;
}

export function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayUtc(now = new Date()): Date {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}

/** Adds months, clamping to the end of the month (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const target = new Date(Date.UTC(y, m, 1));
  const day = Math.min(
    d.getUTCDate(),
    daysInMonth(target.getUTCFullYear(), target.getUTCMonth()),
  );
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), day));
}

export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/** Calendar difference as years, months and days (order-independent). */
export function diffYMD(
  a: Date,
  b: Date,
): { years: number; months: number; days: number } {
  let start = a;
  let end = b;
  if (end < start) [start, end] = [end, start];
  // Largest whole number of months that still fits, then the remaining days.
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() -
    start.getUTCMonth();
  while (months > 0 && addMonths(start, months) > end) months--;
  const days = diffDays(addMonths(start, months), end);
  return { years: Math.floor(months / 12), months: months % 12, days };
}

export function isWeekend(d: Date): boolean {
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}

/** Counts business days between two dates, inclusive of both ends. */
export function countWorkingDays(
  a: Date,
  b: Date,
  opts: { holidays?: Set<string>; weekend?: number[] } = {},
): number {
  const weekend = opts.weekend ?? [0, 6];
  let start = a;
  let end = b;
  if (end < start) [start, end] = [end, start];
  const total = diffDays(start, end) + 1;
  let count = 0;
  for (let i = 0; i < total; i++) {
    const d = addDays(start, i);
    if (weekend.includes(d.getUTCDay())) continue;
    if (opts.holidays?.has(toDateInput(d))) continue;
    count++;
  }
  return count;
}

export function addWorkingDays(d: Date, n: number, weekend = [0, 6]): Date {
  const step = n < 0 ? -1 : 1;
  let remaining = Math.abs(n);
  let cur = d;
  while (remaining > 0) {
    cur = addDays(cur, step);
    if (!weekend.includes(cur.getUTCDay())) remaining--;
  }
  return cur;
}

/** ISO-8601 week number and week-year. */
export function isoWeek(d: Date): { week: number; year: number } {
  const t = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const dayNum = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((t.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7,
  );
  return { week, year: t.getUTCFullYear() };
}

export function dayOfYear(d: Date): number {
  return diffDays(new Date(Date.UTC(d.getUTCFullYear(), 0, 1)), d) + 1;
}

export function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** "3 days ago" / "in 2 hours" style relative description. */
export function relativeTime(target: Date, now = new Date()): string {
  const diff = target.getTime() - now.getTime();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_556_952_000],
    ['month', 2_629_746_000],
    ['week', 604_800_000],
    ['day', DAY_MS],
    ['hour', 3_600_000],
    ['minute', 60_000],
    ['second', 1000],
  ];
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'second')
      return rtf.format(Math.round(diff / ms), unit);
  }
  return '';
}

/** Parses epoch seconds/ms, ISO 8601, RFC 2822 and most human date strings. */
export function parseAnyDate(input: string): Date | null {
  const s = input.trim();
  if (!s) return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    // ≥ 1e11 is beyond year 5138 in seconds, so treat it as milliseconds.
    const ms = Math.abs(n) >= 1e11 ? n : n * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Offset of `tz` from UTC at the given instant, in minutes (e.g. +120 for CEST). */
export function timeZoneOffset(instant: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return Math.round(
    (asUtc - Math.floor(instant.getTime() / 1000) * 1000) / 60_000,
  );
}

/** Converts a wall-clock time ("YYYY-MM-DDTHH:mm") in `tz` to the UTC instant. */
export function zonedTimeToUtc(local: string, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Two passes settle the offset around DST transitions.
  let guess = wall - timeZoneOffset(new Date(wall), tz) * 60_000;
  guess = wall - timeZoneOffset(new Date(guess), tz) * 60_000;
  return new Date(guess);
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '−';
  const abs = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}
