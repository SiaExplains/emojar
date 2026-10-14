// Date Format Converter: calendar dates only (year, month, day). Values never
// pass through a Date in local time, so nothing shifts by a day across time
// zones. Ambiguous input such as 03/04/2026 is reported, not guessed.

export type YMD = { y: number; m: number; d: number };

export type DateFormatId =
  | 'iso'
  | 'iso-basic'
  | 'dmy-slash'
  | 'mdy-slash'
  | 'ymd-slash'
  | 'dmy-dot'
  | 'dmy-dash'
  | 'dmy-short'
  | 'mdy-short'
  | 'd-month-y'
  | 'month-d-y'
  | 'd-mon-y'
  | 'weekday-long';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const p2 = (n: number) => String(n).padStart(2, '0');
const p4 = (n: number) => String(n).padStart(4, '0');

export type FormatDef = {
  id: DateFormatId;
  label: string;
  example: string;
  /** Can be read as input (long text forms are output only). */
  input: boolean;
  format: (v: YMD) => string;
};

export const FORMATS: FormatDef[] = [
  {
    id: 'iso',
    label: 'ISO 8601 (YYYY-MM-DD)',
    example: '2026-10-14',
    input: true,
    format: (v) => `${p4(v.y)}-${p2(v.m)}-${p2(v.d)}`,
  },
  {
    id: 'iso-basic',
    label: 'ISO 8601 basic (YYYYMMDD)',
    example: '20261014',
    input: true,
    format: (v) => `${p4(v.y)}${p2(v.m)}${p2(v.d)}`,
  },
  {
    id: 'dmy-slash',
    label: 'DD/MM/YYYY (UK, Europe, most of the world)',
    example: '14/10/2026',
    input: true,
    format: (v) => `${p2(v.d)}/${p2(v.m)}/${p4(v.y)}`,
  },
  {
    id: 'mdy-slash',
    label: 'MM/DD/YYYY (US)',
    example: '10/14/2026',
    input: true,
    format: (v) => `${p2(v.m)}/${p2(v.d)}/${p4(v.y)}`,
  },
  {
    id: 'ymd-slash',
    label: 'YYYY/MM/DD (East Asia)',
    example: '2026/10/14',
    input: true,
    format: (v) => `${p4(v.y)}/${p2(v.m)}/${p2(v.d)}`,
  },
  {
    id: 'dmy-dot',
    label: 'DD.MM.YYYY (Germany, Russia)',
    example: '14.10.2026',
    input: true,
    format: (v) => `${p2(v.d)}.${p2(v.m)}.${p4(v.y)}`,
  },
  {
    id: 'dmy-dash',
    label: 'DD-MM-YYYY',
    example: '14-10-2026',
    input: true,
    format: (v) => `${p2(v.d)}-${p2(v.m)}-${p4(v.y)}`,
  },
  {
    id: 'dmy-short',
    label: 'DD/MM/YY',
    example: '14/10/26',
    input: true,
    format: (v) => `${p2(v.d)}/${p2(v.m)}/${p2(v.y % 100)}`,
  },
  {
    id: 'mdy-short',
    label: 'MM/DD/YY',
    example: '10/14/26',
    input: true,
    format: (v) => `${p2(v.m)}/${p2(v.d)}/${p2(v.y % 100)}`,
  },
  {
    id: 'd-month-y',
    label: 'D Month YYYY',
    example: '14 October 2026',
    input: true,
    format: (v) => `${v.d} ${MONTHS[v.m - 1]} ${v.y}`,
  },
  {
    id: 'month-d-y',
    label: 'Month D, YYYY',
    example: 'October 14, 2026',
    input: true,
    format: (v) => `${MONTHS[v.m - 1]} ${v.d}, ${v.y}`,
  },
  {
    id: 'd-mon-y',
    label: 'DD-Mon-YYYY',
    example: '14-Oct-2026',
    input: true,
    format: (v) => `${p2(v.d)}-${MONTHS[v.m - 1].slice(0, 3)}-${v.y}`,
  },
  {
    id: 'weekday-long',
    label: 'Weekday, D Month YYYY',
    example: 'Wednesday, 14 October 2026',
    input: false,
    format: (v) => `${weekday(v)}, ${v.d} ${MONTHS[v.m - 1]} ${v.y}`,
  },
];

export const isLeapYear = (y: number) =>
  (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    m - 1
  ];
}

export function isValidYmd(v: YMD): boolean {
  return (
    Number.isInteger(v.y) &&
    v.y >= 1 &&
    v.y <= 9999 &&
    v.m >= 1 &&
    v.m <= 12 &&
    v.d >= 1 &&
    v.d <= daysInMonth(v.y, v.m)
  );
}

/** Day of the week from the calendar date alone (UTC arithmetic, no time zone). */
export function weekday(v: YMD): string {
  const dt = new Date(Date.UTC(2000, v.m - 1, v.d));
  dt.setUTCFullYear(v.y);
  return WEEKDAYS[dt.getUTCDay()];
}

/** Two-digit years: 00–49 → 2000s, 50–99 → 1900s (a common pivot). */
export const expandYear = (yy: number) => (yy < 50 ? 2000 + yy : 1900 + yy);

const monthFromName = (s: string): number => {
  const k = s.toLowerCase().replace(/\.$/, '');
  if (k.length < 3) return 0;
  const i = MONTHS.findIndex((m) => m.toLowerCase().startsWith(k));
  return i === -1 || (k.length > 3 && !MONTHS[i].toLowerCase().startsWith(k))
    ? 0
    : i + 1;
};

type Parser = (s: string) => YMD | null;

const num3 =
  (re: RegExp, order: 'ymd' | 'dmy' | 'mdy', short = false): Parser =>
  (s) => {
    const m = re.exec(s);
    if (!m) return null;
    const [a, b, c] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const y = (n: number) => (short ? expandYear(n) : n);
    return order === 'ymd'
      ? { y: y(a), m: b, d: c }
      : order === 'dmy'
        ? { y: y(c), m: b, d: a }
        : { y: y(c), m: a, d: b };
  };

const PARSERS: Record<Exclude<DateFormatId, 'weekday-long'>, Parser> = {
  iso: num3(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, 'ymd'),
  'iso-basic': num3(/^(\d{4})(\d{2})(\d{2})$/, 'ymd'),
  'dmy-slash': num3(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, 'dmy'),
  'mdy-slash': num3(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, 'mdy'),
  'ymd-slash': num3(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, 'ymd'),
  'dmy-dot': num3(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, 'dmy'),
  'dmy-dash': num3(/^(\d{1,2})-(\d{1,2})-(\d{4})$/, 'dmy'),
  'dmy-short': num3(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2})$/, 'dmy', true),
  'mdy-short': num3(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, 'mdy', true),
  'd-month-y': (s) => {
    const m = /^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+\.?),?\s+(\d{4})$/.exec(
      s,
    );
    const mo = m ? monthFromName(m[2]) : 0;
    return m && mo ? { y: Number(m[3]), m: mo, d: Number(m[1]) } : null;
  },
  'month-d-y': (s) => {
    const m = /^([A-Za-z]+\.?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/.exec(
      s,
    );
    const mo = m ? monthFromName(m[1]) : 0;
    return m && mo ? { y: Number(m[3]), m: mo, d: Number(m[2]) } : null;
  },
  'd-mon-y': (s) => {
    const m = /^(\d{1,2})[-\s]([A-Za-z]{3,})\.?[-\s](\d{4})$/.exec(s);
    const mo = m ? monthFromName(m[2]) : 0;
    return m && mo ? { y: Number(m[3]), m: mo, d: Number(m[1]) } : null;
  },
};

export type ParseResult =
  | { ok: true; value: YMD; format: DateFormatId }
  | {
      ok: false;
      error: string;
      candidates?: { format: DateFormatId; value: YMD }[];
    };

function invalidReason(v: YMD): string {
  if (v.m < 1 || v.m > 12) return `there is no month ${v.m}`;
  if (v.y < 1 || v.y > 9999) return 'the year must be between 1 and 9999';
  if (v.m === 2 && v.d === 29)
    return `${v.y} is not a leap year, so February has 28 days`;
  return `${MONTHS[v.m - 1]} has ${daysInMonth(v.y, v.m)} days`;
}

/**
 * Reads a date in the given format, or with 'auto' tries every input format.
 * In auto mode, a value that is valid in more than one format with different
 * results (03/04/2026) is returned as ambiguous with the candidates.
 */
export function parseDate(
  input: string,
  format: DateFormatId | 'auto',
): ParseResult {
  const s = input.trim().replace(/\s+/g, ' ');
  if (!s) return { ok: false, error: 'Enter a date.' };
  if (/\d{1,2}:\d{2}|T\d{2}/.test(s))
    return {
      ok: false,
      error:
        'This converter handles calendar dates only. Remove the time, or use the Timestamp Converter for dates with times and time zones.',
    };
  if (format !== 'auto') {
    if (format === 'weekday-long')
      return { ok: false, error: 'That format is for output only.' };
    const v = PARSERS[format](s);
    if (!v) {
      const def = FORMATS.find((f) => f.id === format)!;
      return {
        ok: false,
        error: `“${s}” doesn’t match ${def.label}, e.g. ${def.example}.`,
      };
    }
    return isValidYmd(v)
      ? { ok: true, value: v, format }
      : { ok: false, error: `“${s}” isn’t a real date: ${invalidReason(v)}.` };
  }
  const hits: { format: DateFormatId; value: YMD }[] = [];
  let firstInvalid: YMD | null = null;
  for (const [id, parse] of Object.entries(PARSERS) as [
    Exclude<DateFormatId, 'weekday-long'>,
    Parser,
  ][]) {
    // Two-digit years only when chosen explicitly: 01/02/03 is too ambiguous.
    if (id === 'dmy-short' || id === 'mdy-short') continue;
    const v = parse(s);
    if (!v) continue;
    if (isValidYmd(v)) {
      if (
        !hits.some(
          (h) => h.value.y === v.y && h.value.m === v.m && h.value.d === v.d,
        )
      )
        hits.push({ format: id, value: v });
    } else firstInvalid ??= v;
  }
  if (hits.length === 1)
    return { ok: true, value: hits[0].value, format: hits[0].format };
  if (hits.length > 1)
    return {
      ok: false,
      error: `“${s}” is ambiguous — it could be ${hits
        .map((h) => `${h.value.d} ${MONTHS[h.value.m - 1]} ${h.value.y}`)
        .join(' or ')}. Choose the input format.`,
      candidates: hits,
    };
  if (firstInvalid)
    return {
      ok: false,
      error: `“${s}” isn’t a real date: ${invalidReason(firstInvalid)}.`,
    };
  return {
    ok: false,
    error: `“${s}” isn’t in a supported format. Try 2026-10-14, 14/10/2026, 14.10.2026 or 14 October 2026.`,
  };
}

export const formatDate = (v: YMD, id: DateFormatId) =>
  FORMATS.find((f) => f.id === id)!.format(v);

export type LineResult = { input: string; output: string; error?: string };

/** Converts one date per line; blank lines are kept blank. */
export function convertLines(
  text: string,
  from: DateFormatId | 'auto',
  to: DateFormatId,
): LineResult[] {
  return text.split(/\r?\n/).map((line) => {
    if (!line.trim()) return { input: line, output: '' };
    const r = parseDate(line, from);
    return r.ok
      ? { input: line, output: formatDate(r.value, to) }
      : { input: line, output: '', error: r.error };
  });
}
