// Standard 5-field cron (minute hour day-of-month month day-of-week):
// parsing, an English description and the next run times.

import { ToolInputError } from './data';

const FIELD_SPECS = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'day of month', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  { name: 'day of week', min: 0, max: 6 },
] as const;

const MONTH_NAMES = [
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
const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const MONTH_ALIASES = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];
const DAY_ALIASES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

export type ParsedCron = {
  fields: string[];
  values: Set<number>[];
  domRestricted: boolean;
  dowRestricted: boolean;
};

function parseField(raw: string, idx: number): Set<number> {
  const spec = FIELD_SPECS[idx];
  const out = new Set<number>();
  let text = raw.toUpperCase();
  if (idx === 3)
    MONTH_ALIASES.forEach((m, i) => (text = text.replaceAll(m, String(i + 1))));
  if (idx === 4)
    DAY_ALIASES.forEach((d, i) => (text = text.replaceAll(d, String(i))));

  for (const part of text.split(',')) {
    const m = /^(\*|\d+)(?:-(\d+))?(?:\/(\d+))?$/.exec(part);
    if (!m) throw new ToolInputError(`Invalid ${spec.name} field: “${raw}”.`);
    const step = m[3] ? Number(m[3]) : 1;
    if (step < 1)
      throw new ToolInputError(`Invalid step in the ${spec.name} field.`);
    let lo: number;
    let hi: number;
    if (m[1] === '*') {
      lo = spec.min;
      hi = spec.max;
    } else {
      lo = Number(m[1]);
      hi = m[2] !== undefined ? Number(m[2]) : m[3] ? spec.max : lo;
    }
    const maxAllowed = idx === 4 ? 7 : spec.max;
    if (lo < spec.min || hi > maxAllowed || lo > hi) {
      throw new ToolInputError(
        `The ${spec.name} must be between ${spec.min} and ${spec.max}.`,
      );
    }
    for (let v = lo; v <= hi; v += step) out.add(idx === 4 && v === 7 ? 0 : v);
  }
  return out;
}

export function parseCron(expr: string): ParsedCron {
  const trimmed = expr.trim().toLowerCase();
  const expanded = MACROS[trimmed] ?? expr.trim();
  const fields = expanded.split(/\s+/);
  if (fields.length !== 5) {
    throw new ToolInputError(
      'A cron expression needs exactly 5 fields: minute hour day-of-month month day-of-week.',
    );
  }
  return {
    fields,
    values: fields.map((f, i) => parseField(f, i)),
    domRestricted: fields[2] !== '*',
    dowRestricted: fields[4] !== '*',
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

function joinWords(words: string[]): string {
  if (words.length <= 1) return words.join('');
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

function listWords(values: number[], names?: string[]): string {
  return joinWords(
    values.map((v) =>
      names ? names[v - (names === MONTH_NAMES ? 1 : 0)] : String(v),
    ),
  );
}

function describeField(
  raw: string,
  values: Set<number>,
  unit: string,
  names?: string[],
): string | null {
  if (raw === '*') return null;
  const step = /^\*\/(\d+)$/.exec(raw);
  if (step) return `every ${step[1]} ${unit}s`;
  const range = /^(\w+)-(\w+)$/.exec(raw);
  const sorted = [...values].sort((a, b) => a - b);
  if (range && names)
    return `${names[sorted[0] - (names === MONTH_NAMES ? 1 : 0)]} through ${names[sorted[sorted.length - 1] - (names === MONTH_NAMES ? 1 : 0)]}`;
  if (range)
    return `${unit}s ${sorted[0]} through ${sorted[sorted.length - 1]}`;
  return names ? listWords(sorted, names) : `${unit} ${listWords(sorted)}`;
}

export function describeCron(expr: string): string {
  const c = parseCron(expr);
  const [minF, hourF, domF, monF, dowF] = c.fields;
  const mins = [...c.values[0]].sort((a, b) => a - b);
  const hours = [...c.values[1]].sort((a, b) => a - b);

  let time: string;
  if (minF === '*' && hourF === '*') time = 'Every minute';
  else if (/^\*\/\d+$/.test(minF) && hourF === '*')
    time = `Every ${minF.slice(2)} minutes`;
  else if (hourF === '*') time = `At minute ${listWords(mins)} past every hour`;
  else if (minF === '*') time = `Every minute during hour ${listWords(hours)}`;
  else if (/^\*\/\d+$/.test(hourF) && mins.length === 1)
    time = `At minute ${mins[0]} past every ${hourF.slice(2)} hours`;
  else if (mins.length * hours.length <= 6) {
    time = `At ${joinWords(hours.flatMap((h) => mins.map((m) => `${pad(h)}:${pad(m)}`)))}`;
  } else time = `At minute ${listWords(mins)} past hour ${listWords(hours)}`;

  const parts = [time];
  const dom = describeField(domF, c.values[2], 'day');
  const dow = describeField(dowF, c.values[4], 'day', DAY_NAMES);
  const mon = describeField(monF, c.values[3], 'month', MONTH_NAMES);
  if (dom && dow)
    parts.push(`on day-of-month ${dom.replace(/^day /, '')} or on ${dow}`);
  else if (dom)
    parts.push(
      `on ${dom.startsWith('every') ? dom : `day-of-month ${dom.replace(/^days? /, '')}`}`,
    );
  else if (dow) parts.push(`on ${dow}`);
  if (mon) parts.push(`in ${mon}`);
  return `${parts.join(', ')}.`;
}

/** Next `count` run times after `from` (local time by default). */
export function nextCronRuns(
  expr: string,
  count = 5,
  from = new Date(),
  utc = false,
): Date[] {
  const c = parseCron(expr);
  const [mins, hours, doms, months, dows] = c.values;
  const runs: Date[] = [];
  const d = new Date(from.getTime());
  if (utc) d.setUTCSeconds(0, 0);
  else d.setSeconds(0, 0);
  const get = {
    min: () => (utc ? d.getUTCMinutes() : d.getMinutes()),
    hour: () => (utc ? d.getUTCHours() : d.getHours()),
    dom: () => (utc ? d.getUTCDate() : d.getDate()),
    mon: () => (utc ? d.getUTCMonth() : d.getMonth()) + 1,
    dow: () => (utc ? d.getUTCDay() : d.getDay()),
  };
  const addMinutes = (n: number) => d.setTime(d.getTime() + n * 60_000);
  // Skip whole days/hours that cannot match; bounded to ~5 years of steps.
  for (let guard = 0; guard < 500_000 && runs.length < count; guard++) {
    addMinutes(1);
    const domOk = doms.has(get.dom());
    const dowOk = dows.has(get.dow());
    const dayOk =
      c.domRestricted && c.dowRestricted ? domOk || dowOk : domOk && dowOk;
    if (!months.has(get.mon()) || !dayOk) {
      addMinutes((23 - get.hour()) * 60 + (59 - get.min()));
      continue;
    }
    if (!hours.has(get.hour())) {
      addMinutes(59 - get.min());
      continue;
    }
    if (!mins.has(get.min())) continue;
    runs.push(new Date(d.getTime()));
  }
  return runs;
}
