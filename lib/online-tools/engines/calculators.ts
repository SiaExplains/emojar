// Declarative calculators behind the generic FormCalculatorTool: each one is
// a list of input fields plus a pure compute() that returns labelled results.

import {
  addDays,
  addMonths,
  addWorkingDays,
  countWorkingDays,
  dayOfYear,
  diffDays,
  diffYMD,
  formatLongDate,
  isoWeek,
  parseDateInput,
  toDateInput,
  todayUtc,
} from './dates';
import { formatNumber } from './units';

export type CalcField = {
  id: string;
  label: string;
  type: 'number' | 'date' | 'time' | 'select' | 'textarea';
  default: string | ((now: Date) => string);
  choices?: { value: string; label: string }[];
  suffix?: string;
  min?: number;
  step?: number | 'any';
  placeholder?: string;
  /** Only show the field when another field has one of these values. */
  showIf?: { field: string; values: string[] };
  help?: string;
};

export type CalcResult = { label: string; value: string; primary?: boolean };

export type CalcTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type CalcOutput =
  | { ok: true; results: CalcResult[]; table?: CalcTable; note?: string }
  | { ok: false; error: string };

export type CalculatorDefinition = {
  fields: CalcField[];
  compute: (v: Record<string, string>) => CalcOutput;
};

const today = (now: Date) => toDateInput(todayUtc(now));

const fail = (error: string): CalcOutput => ({ ok: false, error });

function num(v: Record<string, string>, id: string): number {
  const raw = (v[id] ?? '').toString().replace(/,/g, '').trim();
  return raw === '' ? NaN : Number(raw);
}

const money = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '—';

const pct = (n: number) => `${formatNumber(n, 6)}%`;

const plural = (n: number, word: string) =>
  `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

function needDates(v: Record<string, string>, ...ids: string[]): Date[] | null {
  const dates = ids.map((id) => parseDateInput(v[id] ?? ''));
  return dates.every(Boolean) ? (dates as Date[]) : null;
}

function parseTime(v: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : null;
}

export function amortize(
  principal: number,
  annualRatePct: number,
  months: number,
) {
  const r = annualRatePct / 100 / 12;
  const payment =
    r === 0
      ? principal / months
      : (principal * r) / (1 - Math.pow(1 + r, -months));
  const schedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const princ = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - princ);
    schedule.push({ month: m, payment, principal: princ, interest, balance });
  }
  return {
    payment,
    totalPaid: payment * months,
    totalInterest: payment * months - principal,
    schedule,
  };
}

export function parseNumberList(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export const CALCULATORS: Record<string, CalculatorDefinition> = {
  percentage: {
    fields: [
      {
        id: 'mode',
        label: 'Calculation',
        type: 'select',
        default: 'of',
        choices: [
          { value: 'of', label: 'What is X% of Y?' },
          { value: 'is', label: 'X is what % of Y?' },
          { value: 'change', label: 'Percentage change from X to Y' },
        ],
      },
      { id: 'x', label: 'X', type: 'number', default: '20', step: 'any' },
      { id: 'y', label: 'Y', type: 'number', default: '150', step: 'any' },
    ],
    compute: (v) => {
      const x = num(v, 'x');
      const y = num(v, 'y');
      if (!Number.isFinite(x) || !Number.isFinite(y))
        return fail('Please enter both numbers.');
      if (v.mode === 'is') {
        if (y === 0) return fail('Y cannot be zero.');
        return {
          ok: true,
          results: [
            {
              label: `${formatNumber(x)} is this % of ${formatNumber(y)}`,
              value: pct((x / y) * 100),
              primary: true,
            },
          ],
        };
      }
      if (v.mode === 'change') {
        if (x === 0) return fail('The starting value X cannot be zero.');
        const c = ((y - x) / Math.abs(x)) * 100;
        return {
          ok: true,
          results: [
            {
              label: c >= 0 ? 'Increase' : 'Decrease',
              value: pct(Math.abs(c)),
              primary: true,
            },
            { label: 'Difference', value: formatNumber(y - x) },
          ],
        };
      }
      return {
        ok: true,
        results: [
          {
            label: `${formatNumber(x)}% of ${formatNumber(y)}`,
            value: formatNumber((x / 100) * y),
            primary: true,
          },
        ],
      };
    },
  },

  'percentage-increase': {
    fields: [
      {
        id: 'mode',
        label: 'Calculation',
        type: 'select',
        default: 'between',
        choices: [
          { value: 'between', label: 'Increase/decrease between two values' },
          { value: 'apply', label: 'Increase or decrease a value by a %' },
        ],
      },
      {
        id: 'from',
        label: 'Original value',
        type: 'number',
        default: '80',
        step: 'any',
      },
      {
        id: 'to',
        label: 'New value',
        type: 'number',
        default: '100',
        step: 'any',
        showIf: { field: 'mode', values: ['between'] },
      },
      {
        id: 'percent',
        label: 'Percentage',
        type: 'number',
        default: '15',
        step: 'any',
        suffix: '%',
        showIf: { field: 'mode', values: ['apply'] },
      },
    ],
    compute: (v) => {
      const from = num(v, 'from');
      if (!Number.isFinite(from))
        return fail('Please enter the original value.');
      if (v.mode === 'apply') {
        const p = num(v, 'percent');
        if (!Number.isFinite(p)) return fail('Please enter a percentage.');
        return {
          ok: true,
          results: [
            {
              label: `${formatNumber(from)} increased by ${formatNumber(p)}%`,
              value: formatNumber(from * (1 + p / 100)),
              primary: true,
            },
            {
              label: `${formatNumber(from)} decreased by ${formatNumber(p)}%`,
              value: formatNumber(from * (1 - p / 100)),
            },
            {
              label: 'Amount of change',
              value: formatNumber((from * p) / 100),
            },
          ],
        };
      }
      const to = num(v, 'to');
      if (!Number.isFinite(to)) return fail('Please enter the new value.');
      if (from === 0) return fail('The original value cannot be zero.');
      const c = ((to - from) / Math.abs(from)) * 100;
      return {
        ok: true,
        results: [
          {
            label: c >= 0 ? 'Percentage increase' : 'Percentage decrease',
            value: pct(Math.abs(c)),
            primary: true,
          },
          { label: 'Absolute change', value: formatNumber(to - from) },
          {
            label: 'New value as % of original',
            value: pct((to / from) * 100),
          },
        ],
      };
    },
  },

  age: {
    fields: [
      {
        id: 'dob',
        label: 'Date of birth',
        type: 'date',
        default: '1990-06-15',
      },
      { id: 'at', label: 'Age on', type: 'date', default: today },
    ],
    compute: (v) => {
      const d = needDates(v, 'dob', 'at');
      if (!d) return fail('Please enter valid dates.');
      const [dob, at] = d;
      if (at < dob)
        return fail('The date of birth must be before the “age on” date.');
      const { years, months, days } = diffYMD(dob, at);
      const total = diffDays(dob, at);
      let next = addMonths(dob, (years + 1) * 12);
      if (addMonths(dob, years * 12).getTime() === at.getTime()) next = at;
      const untilNext = diffDays(at, next);
      return {
        ok: true,
        results: [
          {
            label: 'Age',
            value: `${plural(years, 'year')}, ${plural(months, 'month')}, ${plural(days, 'day')}`,
            primary: true,
          },
          {
            label: 'Total months',
            value: (years * 12 + months).toLocaleString('en-US'),
          },
          {
            label: 'Total weeks',
            value: `${Math.floor(total / 7).toLocaleString('en-US')} weeks, ${total % 7} days`,
          },
          { label: 'Total days', value: total.toLocaleString('en-US') },
          {
            label: 'Next birthday',
            value:
              untilNext === 0
                ? 'Today! 🎉'
                : `in ${plural(untilNext, 'day')} (${formatLongDate(next)})`,
          },
          {
            label: 'Born on a',
            value: dob.toLocaleDateString('en-US', {
              weekday: 'long',
              timeZone: 'UTC',
            }),
          },
        ],
      };
    },
  },

  'date-calculator': {
    fields: [
      {
        id: 'mode',
        label: 'Calculation',
        type: 'select',
        default: 'diff',
        choices: [
          { value: 'diff', label: 'Days between two dates' },
          { value: 'add', label: 'Add to a date' },
          { value: 'sub', label: 'Subtract from a date' },
        ],
      },
      { id: 'start', label: 'Start date', type: 'date', default: today },
      {
        id: 'end',
        label: 'End date',
        type: 'date',
        default: (n) => toDateInput(addDays(todayUtc(n), 100)),
        showIf: { field: 'mode', values: ['diff'] },
      },
      {
        id: 'years',
        label: 'Years',
        type: 'number',
        default: '0',
        min: 0,
        showIf: { field: 'mode', values: ['add', 'sub'] },
      },
      {
        id: 'months',
        label: 'Months',
        type: 'number',
        default: '0',
        min: 0,
        showIf: { field: 'mode', values: ['add', 'sub'] },
      },
      {
        id: 'weeks',
        label: 'Weeks',
        type: 'number',
        default: '0',
        min: 0,
        showIf: { field: 'mode', values: ['add', 'sub'] },
      },
      {
        id: 'days',
        label: 'Days',
        type: 'number',
        default: '30',
        min: 0,
        showIf: { field: 'mode', values: ['add', 'sub'] },
      },
    ],
    compute: (v) => {
      if (v.mode === 'diff') {
        const d = needDates(v, 'start', 'end');
        if (!d) return fail('Please enter two valid dates.');
        const days = diffDays(d[0], d[1]);
        const ymd = diffYMD(d[0], d[1]);
        return {
          ok: true,
          results: [
            {
              label: 'Difference',
              value: plural(Math.abs(days), 'day'),
              primary: true,
            },
            {
              label: 'In years, months, days',
              value: `${plural(ymd.years, 'year')}, ${plural(ymd.months, 'month')}, ${plural(ymd.days, 'day')}`,
            },
            {
              label: 'In weeks',
              value: `${Math.floor(Math.abs(days) / 7)} weeks, ${Math.abs(days) % 7} days`,
            },
          ],
        };
      }
      const d = needDates(v, 'start');
      if (!d) return fail('Please enter a valid date.');
      const sign = v.mode === 'sub' ? -1 : 1;
      const y = num(v, 'years') || 0;
      const m = num(v, 'months') || 0;
      const w = num(v, 'weeks') || 0;
      const dd = num(v, 'days') || 0;
      const result = addDays(
        addMonths(d[0], sign * (y * 12 + m)),
        sign * (w * 7 + dd),
      );
      return {
        ok: true,
        results: [
          {
            label: 'Resulting date',
            value: formatLongDate(result),
            primary: true,
          },
          { label: 'ISO date', value: toDateInput(result) },
        ],
      };
    },
  },

  bmi: {
    fields: [
      {
        id: 'units',
        label: 'Units',
        type: 'select',
        default: 'metric',
        choices: [
          { value: 'metric', label: 'Metric (kg, cm)' },
          { value: 'imperial', label: 'Imperial (lb, ft/in)' },
        ],
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        default: '70',
        step: 'any',
        suffix: 'kg',
        showIf: { field: 'units', values: ['metric'] },
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        default: '175',
        step: 'any',
        suffix: 'cm',
        showIf: { field: 'units', values: ['metric'] },
      },
      {
        id: 'lb',
        label: 'Weight',
        type: 'number',
        default: '154',
        step: 'any',
        suffix: 'lb',
        showIf: { field: 'units', values: ['imperial'] },
      },
      {
        id: 'ft',
        label: 'Height (feet)',
        type: 'number',
        default: '5',
        step: 1,
        suffix: 'ft',
        showIf: { field: 'units', values: ['imperial'] },
      },
      {
        id: 'in',
        label: 'Height (inches)',
        type: 'number',
        default: '9',
        step: 'any',
        suffix: 'in',
        showIf: { field: 'units', values: ['imperial'] },
      },
    ],
    compute: (v) => {
      const kg =
        v.units === 'imperial' ? num(v, 'lb') * 0.45359237 : num(v, 'weight');
      const m =
        v.units === 'imperial'
          ? ((num(v, 'ft') || 0) * 12 + (num(v, 'in') || 0)) * 0.0254
          : num(v, 'height') / 100;
      if (!(kg > 0) || !(m > 0))
        return fail('Please enter a positive weight and height.');
      const bmi = kg / (m * m);
      const cat =
        bmi < 18.5
          ? 'Underweight'
          : bmi < 25
            ? 'Healthy weight'
            : bmi < 30
              ? 'Overweight'
              : 'Obesity';
      return {
        ok: true,
        results: [
          { label: 'BMI', value: bmi.toFixed(1), primary: true },
          { label: 'Category (WHO, adults)', value: cat },
          {
            label: 'Healthy weight range for this height',
            value: `${(18.5 * m * m).toFixed(1)}–${(24.9 * m * m).toFixed(1)} kg`,
          },
        ],
        note: 'BMI is a screening measure for adults and does not account for muscle mass, age or sex. It is not a diagnosis.',
      };
    },
  },

  bmr: {
    fields: [
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        default: 'female',
        choices: [
          { value: 'female', label: 'Female' },
          { value: 'male', label: 'Male' },
        ],
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        default: '30',
        min: 1,
        suffix: 'years',
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        default: '65',
        step: 'any',
        suffix: 'kg',
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        default: '168',
        step: 'any',
        suffix: 'cm',
      },
      {
        id: 'activity',
        label: 'Activity level',
        type: 'select',
        default: '1.375',
        choices: [
          { value: '1.2', label: 'Sedentary (little or no exercise)' },
          { value: '1.375', label: 'Light (1–3 days/week)' },
          { value: '1.55', label: 'Moderate (3–5 days/week)' },
          { value: '1.725', label: 'Active (6–7 days/week)' },
          { value: '1.9', label: 'Very active (physical job + training)' },
        ],
      },
    ],
    compute: (v) => {
      const age = num(v, 'age');
      const w = num(v, 'weight');
      const h = num(v, 'height');
      if (!(age > 0) || !(w > 0) || !(h > 0))
        return fail('Please enter a positive age, weight and height.');
      // Mifflin-St Jeor equation.
      const bmr = 10 * w + 6.25 * h - 5 * age + (v.sex === 'male' ? 5 : -161);
      const tdee = bmr * Number(v.activity || 1.2);
      return {
        ok: true,
        results: [
          {
            label: 'Basal metabolic rate (BMR)',
            value: `${Math.round(bmr).toLocaleString('en-US')} kcal/day`,
            primary: true,
          },
          {
            label: 'Daily calories to maintain weight (TDEE)',
            value: `${Math.round(tdee).toLocaleString('en-US')} kcal/day`,
          },
          {
            label: 'Mild weight loss (≈ −0.25 kg/week)',
            value: `${Math.round(tdee - 275).toLocaleString('en-US')} kcal/day`,
          },
          {
            label: 'Weight loss (≈ −0.5 kg/week)',
            value: `${Math.round(tdee - 550).toLocaleString('en-US')} kcal/day`,
          },
        ],
        note: 'Estimates use the Mifflin-St Jeor equation. Individual needs vary — ask a professional for medical advice.',
      };
    },
  },

  loan: {
    fields: [
      {
        id: 'amount',
        label: 'Loan amount',
        type: 'number',
        default: '250000',
        step: 'any',
        min: 0,
      },
      {
        id: 'rate',
        label: 'Annual interest rate',
        type: 'number',
        default: '4.5',
        step: 'any',
        suffix: '%',
        min: 0,
      },
      {
        id: 'years',
        label: 'Loan term',
        type: 'number',
        default: '25',
        step: 'any',
        suffix: 'years',
        min: 0,
      },
    ],
    compute: (v) => {
      const p = num(v, 'amount');
      const r = num(v, 'rate');
      const months = Math.round(num(v, 'years') * 12);
      if (!(p > 0) || !(r >= 0) || !(months > 0))
        return fail(
          'Please enter a positive amount, a rate of 0 or more, and a term.',
        );
      const a = amortize(p, r, months);
      const rows: string[][] = [];
      for (let y = 1; y <= Math.ceil(months / 12); y++) {
        const slice = a.schedule.slice((y - 1) * 12, y * 12);
        rows.push([
          String(y),
          money(slice.reduce((s, x) => s + x.principal, 0)),
          money(slice.reduce((s, x) => s + x.interest, 0)),
          money(slice[slice.length - 1].balance),
        ]);
      }
      return {
        ok: true,
        results: [
          { label: 'Monthly payment', value: money(a.payment), primary: true },
          { label: 'Total interest', value: money(a.totalInterest) },
          { label: 'Total amount paid', value: money(a.totalPaid) },
          {
            label: 'Number of payments',
            value: months.toLocaleString('en-US'),
          },
        ],
        table: {
          caption: 'Yearly amortization',
          columns: [
            'Year',
            'Principal paid',
            'Interest paid',
            'Remaining balance',
          ],
          rows,
        },
      };
    },
  },

  emi: {
    fields: [
      {
        id: 'amount',
        label: 'Principal amount',
        type: 'number',
        default: '500000',
        step: 'any',
        min: 0,
      },
      {
        id: 'rate',
        label: 'Interest rate (per year)',
        type: 'number',
        default: '9',
        step: 'any',
        suffix: '%',
        min: 0,
      },
      {
        id: 'months',
        label: 'Tenure',
        type: 'number',
        default: '24',
        step: 1,
        suffix: 'months',
        min: 1,
      },
    ],
    compute: (v) => {
      const p = num(v, 'amount');
      const r = num(v, 'rate');
      const n = Math.round(num(v, 'months'));
      if (!(p > 0) || !(r >= 0) || !(n > 0))
        return fail(
          'Please enter a positive principal, a rate of 0 or more, and a tenure.',
        );
      if (n > 600) return fail('Please enter a tenure of 600 months or less.');
      const a = amortize(p, r, n);
      return {
        ok: true,
        results: [
          {
            label: 'EMI (monthly instalment)',
            value: money(a.payment),
            primary: true,
          },
          { label: 'Total interest payable', value: money(a.totalInterest) },
          {
            label: 'Total payment (principal + interest)',
            value: money(a.totalPaid),
          },
          {
            label: 'Interest share of total',
            value: pct((a.totalInterest / a.totalPaid) * 100),
          },
        ],
        table: {
          caption: 'Monthly schedule',
          columns: ['Month', 'EMI', 'Principal', 'Interest', 'Balance'],
          rows: a.schedule.map((s) => [
            String(s.month),
            money(s.payment),
            money(s.principal),
            money(s.interest),
            money(s.balance),
          ]),
        },
      };
    },
  },

  tip: {
    fields: [
      {
        id: 'bill',
        label: 'Bill amount',
        type: 'number',
        default: '86.40',
        step: 'any',
        min: 0,
      },
      {
        id: 'tip',
        label: 'Tip',
        type: 'number',
        default: '15',
        step: 'any',
        suffix: '%',
        min: 0,
      },
      {
        id: 'people',
        label: 'Split between',
        type: 'number',
        default: '2',
        step: 1,
        suffix: 'people',
        min: 1,
      },
    ],
    compute: (v) => {
      const bill = num(v, 'bill');
      const t = num(v, 'tip');
      const people = Math.max(1, Math.round(num(v, 'people') || 1));
      if (!(bill >= 0) || !(t >= 0))
        return fail('Please enter the bill and tip percentage.');
      const tip = (bill * t) / 100;
      return {
        ok: true,
        results: [
          {
            label: 'Total per person',
            value: money((bill + tip) / people),
            primary: true,
          },
          { label: 'Tip amount', value: money(tip) },
          { label: 'Total bill with tip', value: money(bill + tip) },
          { label: 'Tip per person', value: money(tip / people) },
        ],
      };
    },
  },

  discount: {
    fields: [
      {
        id: 'price',
        label: 'Original price',
        type: 'number',
        default: '120',
        step: 'any',
        min: 0,
      },
      {
        id: 'discount',
        label: 'Discount',
        type: 'number',
        default: '25',
        step: 'any',
        suffix: '%',
        min: 0,
      },
      {
        id: 'extra',
        label: 'Extra discount (optional)',
        type: 'number',
        default: '0',
        step: 'any',
        suffix: '%',
        min: 0,
        help: 'Applied after the first discount, as in “an extra 10% off sale prices”.',
      },
    ],
    compute: (v) => {
      const price = num(v, 'price');
      const d = num(v, 'discount');
      const e = num(v, 'extra') || 0;
      if (!(price >= 0) || !(d >= 0) || d > 100 || e > 100)
        return fail('Please enter a price and discounts between 0 and 100%.');
      const final = price * (1 - d / 100) * (1 - e / 100);
      return {
        ok: true,
        results: [
          { label: 'Final price', value: money(final), primary: true },
          { label: 'You save', value: money(price - final) },
          {
            label: 'Effective discount',
            value: pct(price ? ((price - final) / price) * 100 : 0),
          },
        ],
      };
    },
  },

  'compound-interest': {
    fields: [
      {
        id: 'principal',
        label: 'Initial investment',
        type: 'number',
        default: '10000',
        step: 'any',
        min: 0,
      },
      {
        id: 'contribution',
        label: 'Monthly contribution',
        type: 'number',
        default: '200',
        step: 'any',
        min: 0,
      },
      {
        id: 'rate',
        label: 'Annual interest rate',
        type: 'number',
        default: '6',
        step: 'any',
        suffix: '%',
      },
      {
        id: 'years',
        label: 'Years',
        type: 'number',
        default: '20',
        step: 1,
        min: 1,
      },
      {
        id: 'n',
        label: 'Compounding',
        type: 'select',
        default: '12',
        choices: [
          { value: '1', label: 'Yearly' },
          { value: '4', label: 'Quarterly' },
          { value: '12', label: 'Monthly' },
          { value: '365', label: 'Daily' },
        ],
      },
    ],
    compute: (v) => {
      const p = num(v, 'principal');
      const c = num(v, 'contribution') || 0;
      const r = num(v, 'rate') / 100;
      const years = Math.round(num(v, 'years'));
      const n = Number(v.n || 12);
      if (!(p >= 0) || !Number.isFinite(r) || !(years > 0) || years > 200)
        return fail('Please enter an investment, a rate and 1–200 years.');
      // Simulate month by month: contributions monthly, interest at the chosen frequency.
      let balance = p;
      let contributed = p;
      const rows: string[][] = [];
      const periodicRate = Math.pow(1 + r / n, n / 12) - 1;
      for (let m = 1; m <= years * 12; m++) {
        balance = balance * (1 + periodicRate) + c;
        contributed += c;
        if (m % 12 === 0)
          rows.push([
            String(m / 12),
            money(contributed),
            money(balance - contributed),
            money(balance),
          ]);
      }
      return {
        ok: true,
        results: [
          { label: 'Future value', value: money(balance), primary: true },
          { label: 'Total contributions', value: money(contributed) },
          {
            label: 'Total interest earned',
            value: money(balance - contributed),
          },
        ],
        table: {
          caption: 'Growth by year',
          columns: ['Year', 'Contributed', 'Interest', 'Balance'],
          rows,
        },
      };
    },
  },

  vat: {
    fields: [
      {
        id: 'mode',
        label: 'Calculation',
        type: 'select',
        default: 'add',
        choices: [
          { value: 'add', label: 'Add VAT to a net amount' },
          { value: 'remove', label: 'Remove VAT from a gross amount' },
        ],
      },
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        default: '100',
        step: 'any',
        min: 0,
      },
      {
        id: 'rate',
        label: 'VAT rate',
        type: 'number',
        default: '19',
        step: 'any',
        suffix: '%',
        min: 0,
      },
    ],
    compute: (v) => {
      const a = num(v, 'amount');
      const r = num(v, 'rate');
      if (!(a >= 0) || !(r >= 0))
        return fail('Please enter an amount and a VAT rate.');
      const net = v.mode === 'remove' ? a / (1 + r / 100) : a;
      const gross = net * (1 + r / 100);
      return {
        ok: true,
        results: [
          {
            label:
              v.mode === 'remove'
                ? 'Net amount (excl. VAT)'
                : 'Gross amount (incl. VAT)',
            value: money(v.mode === 'remove' ? net : gross),
            primary: true,
          },
          { label: 'VAT amount', value: money(gross - net) },
          { label: 'Net', value: money(net) },
          { label: 'Gross', value: money(gross) },
        ],
      };
    },
  },

  'time-duration': {
    fields: [
      { id: 'start', label: 'Start time', type: 'time', default: '09:00' },
      { id: 'end', label: 'End time', type: 'time', default: '17:30' },
      {
        id: 'break',
        label: 'Break',
        type: 'number',
        default: '30',
        min: 0,
        suffix: 'minutes',
      },
    ],
    compute: (v) => {
      const s = parseTime(v.start ?? '');
      const e = parseTime(v.end ?? '');
      if (s === null || e === null)
        return fail('Please enter valid times (HH:MM).');
      let mins = e - s;
      const overnight = mins < 0;
      if (overnight) mins += 24 * 60;
      mins -= num(v, 'break') || 0;
      if (mins < 0) return fail('The break is longer than the time span.');
      return {
        ok: true,
        results: [
          {
            label: 'Duration',
            value: `${Math.floor(mins / 60)} h ${mins % 60} min`,
            primary: true,
          },
          { label: 'Decimal hours', value: (mins / 60).toFixed(2) },
          { label: 'Total minutes', value: String(mins) },
        ],
        note: overnight
          ? 'The end time is earlier than the start time, so it is treated as the next day.'
          : undefined,
      };
    },
  },

  average: {
    fields: [
      {
        id: 'numbers',
        label: 'Numbers',
        type: 'textarea',
        default: '12, 7, 3, 7, 21, 9',
        placeholder: 'Separate numbers with commas, spaces or new lines',
      },
    ],
    compute: (v) => {
      const xs = parseNumberList(v.numbers ?? '');
      if (!xs.length) return fail('Please enter at least one number.');
      const sum = xs.reduce((a, b) => a + b, 0);
      const mean = sum / xs.length;
      const sorted = [...xs].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const freq = new Map<number, number>();
      xs.forEach((x) => freq.set(x, (freq.get(x) ?? 0) + 1));
      const maxF = Math.max(...freq.values());
      const modes =
        maxF > 1
          ? [...freq.entries()].filter(([, f]) => f === maxF).map(([x]) => x)
          : [];
      const variance = xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length;
      const sampleVar =
        xs.length > 1 ? (variance * xs.length) / (xs.length - 1) : 0;
      return {
        ok: true,
        results: [
          { label: 'Average (mean)', value: formatNumber(mean), primary: true },
          { label: 'Median', value: formatNumber(median) },
          {
            label: 'Mode',
            value: modes.length
              ? modes.map((m) => formatNumber(m)).join(', ')
              : 'No repeated values',
          },
          { label: 'Count', value: String(xs.length) },
          { label: 'Sum', value: formatNumber(sum) },
          {
            label: 'Minimum / maximum',
            value: `${formatNumber(sorted[0])} / ${formatNumber(sorted[sorted.length - 1])}`,
          },
          {
            label: 'Range',
            value: formatNumber(sorted[sorted.length - 1] - sorted[0]),
          },
          {
            label: 'Standard deviation (population / sample)',
            value: `${formatNumber(Math.sqrt(variance), 6)} / ${formatNumber(Math.sqrt(sampleVar), 6)}`,
          },
        ],
      };
    },
  },

  'date-difference': {
    fields: [
      { id: 'start', label: 'Start date', type: 'date', default: today },
      {
        id: 'end',
        label: 'End date',
        type: 'date',
        default: (n) => `${todayUtc(n).getUTCFullYear()}-12-31`,
      },
      {
        id: 'include',
        label: 'Include end date',
        type: 'select',
        default: 'no',
        choices: [
          { value: 'no', label: 'No (count nights)' },
          { value: 'yes', label: 'Yes (count both days)' },
        ],
      },
    ],
    compute: (v) => {
      const d = needDates(v, 'start', 'end');
      if (!d) return fail('Please enter two valid dates.');
      const [a, b] = d;
      const days = Math.abs(diffDays(a, b)) + (v.include === 'yes' ? 1 : 0);
      const ymd = diffYMD(
        a,
        v.include === 'yes' ? addDays(b, b >= a ? 1 : -1) : b,
      );
      const working =
        days === 0
          ? 0
          : countWorkingDays(
              a,
              v.include === 'yes' ? b : addDays(b, b >= a ? -1 : 1),
            );
      return {
        ok: true,
        results: [
          {
            label: 'Total days',
            value: days.toLocaleString('en-US'),
            primary: true,
          },
          {
            label: 'Years, months, days',
            value: `${plural(ymd.years, 'year')}, ${plural(ymd.months, 'month')}, ${plural(ymd.days, 'day')}`,
          },
          {
            label: 'Weeks',
            value: `${Math.floor(days / 7)} weeks, ${days % 7} days`,
          },
          {
            label: 'Working days (Mon–Fri)',
            value: working.toLocaleString('en-US'),
          },
          { label: 'Hours', value: (days * 24).toLocaleString('en-US') },
          { label: 'Minutes', value: (days * 1440).toLocaleString('en-US') },
        ],
        note:
          b < a
            ? 'The end date is before the start date; the difference is shown as a positive number.'
            : undefined,
      };
    },
  },

  'date-add-subtract': {
    fields: [
      { id: 'date', label: 'Start date', type: 'date', default: today },
      {
        id: 'op',
        label: 'Operation',
        type: 'select',
        default: 'add',
        choices: [
          { value: 'add', label: 'Add (+)' },
          { value: 'sub', label: 'Subtract (−)' },
        ],
      },
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        default: '90',
        step: 1,
        min: 0,
      },
      {
        id: 'unit',
        label: 'Unit',
        type: 'select',
        default: 'days',
        choices: [
          { value: 'days', label: 'Days' },
          { value: 'business', label: 'Business days (Mon–Fri)' },
          { value: 'weeks', label: 'Weeks' },
          { value: 'months', label: 'Months' },
          { value: 'years', label: 'Years' },
        ],
      },
    ],
    compute: (v) => {
      const d = needDates(v, 'date');
      const amount = Math.round(num(v, 'amount'));
      if (!d || !Number.isFinite(amount))
        return fail('Please enter a valid date and amount.');
      const n = (v.op === 'sub' ? -1 : 1) * amount;
      const date = d[0];
      const result =
        v.unit === 'business'
          ? addWorkingDays(date, n)
          : v.unit === 'weeks'
            ? addDays(date, n * 7)
            : v.unit === 'months'
              ? addMonths(date, n)
              : v.unit === 'years'
                ? addMonths(date, n * 12)
                : addDays(date, n);
      return {
        ok: true,
        results: [
          { label: 'Result', value: formatLongDate(result), primary: true },
          { label: 'ISO date', value: toDateInput(result) },
          {
            label: 'Calendar days from start',
            value: diffDays(date, result).toLocaleString('en-US'),
          },
        ],
      };
    },
  },

  'working-days': {
    fields: [
      {
        id: 'start',
        label: 'Start date',
        type: 'date',
        default: (n) => `${todayUtc(n).getUTCFullYear()}-01-01`,
      },
      {
        id: 'end',
        label: 'End date',
        type: 'date',
        default: (n) => `${todayUtc(n).getUTCFullYear()}-12-31`,
      },
      {
        id: 'weekend',
        label: 'Weekend days',
        type: 'select',
        default: '0,6',
        choices: [
          { value: '0,6', label: 'Saturday & Sunday' },
          { value: '5,6', label: 'Friday & Saturday' },
          { value: '0', label: 'Sunday only' },
          { value: '', label: 'None' },
        ],
      },
      {
        id: 'holidays',
        label: 'Public holidays to exclude (optional)',
        type: 'textarea',
        default: '',
        placeholder: 'One date per line, e.g. 2026-12-25',
      },
    ],
    compute: (v) => {
      const d = needDates(v, 'start', 'end');
      if (!d) return fail('Please enter two valid dates.');
      const weekend = (v.weekend ?? '0,6')
        .split(',')
        .filter(Boolean)
        .map(Number);
      const holidayList = (v.holidays ?? '').split(/[\s,;]+/).filter(Boolean);
      const bad = holidayList.filter((h) => !parseDateInput(h));
      if (bad.length)
        return fail(
          `These holiday dates are not valid (use YYYY-MM-DD): ${bad.slice(0, 3).join(', ')}`,
        );
      const holidays = new Set(holidayList);
      const total = Math.abs(diffDays(d[0], d[1])) + 1;
      const noHolidays = countWorkingDays(d[0], d[1], { weekend });
      const working = countWorkingDays(d[0], d[1], { weekend, holidays });
      return {
        ok: true,
        results: [
          {
            label: 'Working days',
            value: working.toLocaleString('en-US'),
            primary: true,
          },
          {
            label: 'Calendar days (inclusive)',
            value: total.toLocaleString('en-US'),
          },
          {
            label: 'Weekend days',
            value: (total - noHolidays).toLocaleString('en-US'),
          },
          {
            label: 'Holidays on working days',
            value: (noHolidays - working).toLocaleString('en-US'),
          },
          {
            label: 'Working hours (8 h/day)',
            value: (working * 8).toLocaleString('en-US'),
          },
        ],
      };
    },
  },

  'week-number': {
    fields: [{ id: 'date', label: 'Date', type: 'date', default: today }],
    compute: (v) => {
      const d = needDates(v, 'date');
      if (!d) return fail('Please enter a valid date.');
      const date = d[0];
      const { week, year } = isoWeek(date);
      const dow = date.getUTCDay() || 7;
      const monday = addDays(date, 1 - dow);
      return {
        ok: true,
        results: [
          { label: 'ISO week number', value: `Week ${week}`, primary: true },
          { label: 'ISO week-year', value: String(year) },
          {
            label: 'Week runs',
            value: `${formatLongDate(monday)} – ${formatLongDate(addDays(monday, 6))}`,
          },
          { label: 'Day of the year', value: String(dayOfYear(date)) },
          {
            label: 'Weeks in this ISO year',
            value: String(isoWeek(new Date(Date.UTC(year, 11, 28))).week),
          },
        ],
      };
    },
  },
};

export function initialValues(
  def: CalculatorDefinition,
  now = new Date(),
): Record<string, string> {
  return Object.fromEntries(
    def.fields.map((f) => [
      f.id,
      typeof f.default === 'function' ? f.default(now) : f.default,
    ]),
  );
}
