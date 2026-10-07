// Finance, health, maths and shopping calculators (v0.6.0). Same declarative
// shape as CALCULATORS: input fields plus a pure compute().

import { fail, money, num, pct } from './calc-helpers';
import type {
  CalcField,
  CalcTable,
  CalculatorDefinition,
  ShowIf,
} from './calculators';
import { addMonths, parseDateInput, toDateInput, todayUtc } from './dates';
import { formatNumber } from './units';

const fmt = (n: number, sig = 10) => formatNumber(n, sig);
const today = (now: Date) => toDateInput(todayUtc(now));
const yearsMonths = (months: number) => {
  const y = Math.floor(months / 12);
  const mo = months % 12;
  const part = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  return y && mo
    ? `${part(y, 'year')} ${part(mo, 'month')}`
    : y
      ? part(y, 'year')
      : part(mo, 'month');
};
const monthYear = (d: Date) =>
  d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/* =================================================================== */
/* Mortgage                                                             */
/* =================================================================== */

export function mortgagePayment(
  principal: number,
  annualRatePct: number,
  months: number,
): number {
  const r = annualRatePct / 100 / 12;
  return r === 0
    ? principal / months
    : (principal * r) / (1 - Math.pow(1 + r, -months));
}

const mortgage: CalculatorDefinition = {
  fields: [
    {
      id: 'price',
      label: 'Home price',
      type: 'number',
      default: '400000',
      min: 0,
    },
    {
      id: 'downType',
      label: 'Down payment as',
      type: 'select',
      default: 'percent',
      choices: [
        { value: 'percent', label: 'Percent of price' },
        { value: 'amount', label: 'Amount' },
      ],
    },
    {
      id: 'downPct',
      label: 'Down payment',
      type: 'number',
      default: '20',
      suffix: '%',
      min: 0,
      showIf: { field: 'downType', values: ['percent'] },
    },
    {
      id: 'downAmt',
      label: 'Down payment',
      type: 'number',
      default: '80000',
      min: 0,
      showIf: { field: 'downType', values: ['amount'] },
    },
    {
      id: 'rate',
      label: 'Interest rate',
      type: 'number',
      default: '6.5',
      suffix: '% per year',
      min: 0,
    },
    {
      id: 'years',
      label: 'Loan term',
      type: 'select',
      default: '30',
      choices: ['30', '25', '20', '15', '10'].map((y) => ({
        value: y,
        label: `${y} years`,
      })),
    },
    {
      id: 'tax',
      label: 'Property tax',
      type: 'number',
      default: '1.1',
      suffix: '% of price per year',
      min: 0,
    },
    {
      id: 'insurance',
      label: 'Home insurance',
      type: 'number',
      default: '1500',
      suffix: 'per year',
      min: 0,
    },
    {
      id: 'pmi',
      label: 'PMI (if down payment < 20 %)',
      type: 'number',
      default: '0.5',
      suffix: '% of loan per year',
      min: 0,
      help: 'Private mortgage insurance; it stops once you owe 80 % of the home price or less.',
    },
    {
      id: 'hoa',
      label: 'HOA / service charge',
      type: 'number',
      default: '0',
      suffix: 'per month',
      min: 0,
    },
    {
      id: 'extra',
      label: 'Extra principal payment',
      type: 'number',
      default: '0',
      suffix: 'per month',
      min: 0,
    },
    { id: 'start', label: 'First payment', type: 'date', default: today },
  ],
  compute: (v) => {
    const price = num(v, 'price');
    const down =
      v.downType === 'amount'
        ? num(v, 'downAmt')
        : (price * num(v, 'downPct')) / 100;
    const rate = num(v, 'rate');
    const months = Math.round(num(v, 'years') * 12);
    const taxPct = num(v, 'tax') || 0;
    const ins = num(v, 'insurance') || 0;
    const pmiPct = num(v, 'pmi') || 0;
    const hoa = num(v, 'hoa') || 0;
    const extra = num(v, 'extra') || 0;
    if (!(price > 0)) return fail('Please enter the home price.');
    if (!(down >= 0) || down >= price)
      return fail(
        'The down payment must be at least 0 and less than the price.',
      );
    if (!(rate >= 0) || !(months > 0))
      return fail('Please enter an interest rate of 0 or more.');
    if ([taxPct, ins, pmiPct, hoa, extra].some((x) => x < 0))
      return fail('Costs can’t be negative.');
    const loan = price - down;
    const r = rate / 100 / 12;
    const pi = mortgagePayment(loan, rate, months);
    const taxM = (price * taxPct) / 100 / 12;
    const insM = ins / 12;
    const needsPmi = down / price < 0.2;
    const pmiM = needsPmi ? (loan * pmiPct) / 100 / 12 : 0;
    const start = parseDateInput(v.start ?? '') ?? todayUtc(new Date());

    // Month-by-month schedule including extra payments and PMI removal.
    let bal = loan;
    let interestTotal = 0;
    let pmiTotal = 0;
    let pmiMonths = 0;
    let m = 0;
    const years: { p: number; i: number; bal: number }[] = [];
    while (bal > 0.005 && m < months) {
      const interest = bal * r;
      let principal = pi - interest + extra;
      if (principal > bal) principal = bal;
      if (needsPmi && bal > price * 0.8) {
        pmiTotal += pmiM;
        pmiMonths++;
      }
      bal -= principal;
      interestTotal += interest;
      const y = Math.floor(m / 12);
      years[y] = years[y] ?? { p: 0, i: 0, bal: 0 };
      years[y].p += principal;
      years[y].i += interest;
      years[y].bal = Math.max(0, bal);
      m++;
    }
    // Interest without extra payments, from the same month-by-month schedule.
    let baseInterest = 0;
    for (let b = loan, k = 0; b > 0.005 && k < months; k++) {
      const it = b * r;
      baseInterest += it;
      b -= Math.min(pi - it, b);
    }
    const payoff = addMonths(start, m - 1);
    const results = [
      {
        label: 'Monthly payment',
        value: money(pi + taxM + insM + pmiM + hoa + extra),
        primary: true,
      },
      { label: 'Principal & interest', value: money(pi) },
      { label: 'Property tax', value: `${money(taxM)} / month` },
      { label: 'Home insurance', value: `${money(insM)} / month` },
      {
        label: 'PMI',
        value: needsPmi
          ? `${money(pmiM)} / month for ${pmiMonths} month${pmiMonths === 1 ? '' : 's'}`
          : 'None (down payment is 20 % or more)',
      },
      ...(hoa
        ? [{ label: 'HOA / service charge', value: `${money(hoa)} / month` }]
        : []),
      ...(extra
        ? [{ label: 'Extra principal', value: `${money(extra)} / month` }]
        : []),
      { label: 'Loan amount', value: money(loan) },
      {
        label: 'Down payment',
        value: `${money(down)} (${fmt((down / price) * 100, 4)} %)`,
      },
      { label: 'Total interest', value: money(interestTotal) },
      { label: 'Total of loan payments', value: money(loan + interestTotal) },
      { label: 'Payoff date', value: monthYear(payoff) },
    ];
    if (extra > 0)
      results.push(
        {
          label: 'Time saved by extra payments',
          value: `${months - m} months`,
        },
        { label: 'Interest saved', value: money(baseInterest - interestTotal) },
      );
    return {
      ok: true,
      results,
      table: {
        caption: 'Yearly amortization',
        columns: ['Year', 'Principal paid', 'Interest paid', 'Balance'],
        rows: years.map((y, i) => [
          String(i + 1),
          money(y.p),
          money(y.i),
          money(y.bal),
        ]),
      },
      note: `${needsPmi ? `PMI is estimated at ${fmt(pmiPct)} % of the loan per year and stops once the balance reaches 80 % of the home price; total PMI ≈ ${money(pmiTotal)}. ` : ''}The monthly payment shown is for the first month${needsPmi ? ', while PMI applies' : ''}. Taxes, insurance and PMI rates vary by lender and location — this is an estimate, not a loan offer.`,
    };
  },
};

/* =================================================================== */
/* Salary ↔ hourly                                                      */
/* =================================================================== */

const PERIODS: Record<
  string,
  { label: string; perYear: (h: number, w: number, d: number) => number }
> = {
  year: { label: 'per year', perYear: () => 1 },
  month: { label: 'per month', perYear: () => 12 },
  semimonth: { label: 'twice a month', perYear: () => 24 },
  biweek: { label: 'every two weeks', perYear: (_h, w) => w / 2 },
  week: { label: 'per week', perYear: (_h, w) => w },
  day: { label: 'per day', perYear: (_h, w, d) => w * d },
  hour: { label: 'per hour', perYear: (h, w) => h * w },
};

const salary: CalculatorDefinition = {
  fields: [
    { id: 'amount', label: 'Pay', type: 'number', default: '60000', min: 0 },
    {
      id: 'period',
      label: 'Paid',
      type: 'select',
      default: 'year',
      choices: Object.entries(PERIODS).map(([value, p]) => ({
        value,
        label: p.label,
      })),
    },
    {
      id: 'hours',
      label: 'Hours per week',
      type: 'number',
      default: '40',
      min: 0,
    },
    {
      id: 'days',
      label: 'Days per week',
      type: 'number',
      default: '5',
      min: 0,
    },
    {
      id: 'weeks',
      label: 'Paid weeks per year',
      type: 'number',
      default: '52',
      min: 0,
      help: 'Keep 52 if holidays are paid; subtract unpaid weeks off.',
    },
  ],
  compute: (v) => {
    const amount = num(v, 'amount');
    const h = num(v, 'hours');
    const d = num(v, 'days');
    const w = num(v, 'weeks');
    const p = PERIODS[v.period];
    if (!(amount >= 0)) return fail('Please enter your pay.');
    if (!(h > 0 && h <= 168) || !(d > 0 && d <= 7) || !(w > 0 && w <= 53))
      return fail(
        'Hours (up to 168), days (up to 7) and weeks (up to 53) must be above 0.',
      );
    if (!p) return fail('Please choose how often you are paid.');
    const yearly = amount * p.perYear(h, w, d);
    const rows: string[][] = Object.entries(PERIODS).map(([key, x]) => [
      key === 'semimonth'
        ? 'Semi-monthly'
        : key === 'biweek'
          ? 'Bi-weekly'
          : x.label.replace('per ', '').replace(/^./, (c) => c.toUpperCase()),
      money(yearly / x.perYear(h, w, d)),
    ]);
    const hourly = yearly / (h * w);
    return {
      ok: true,
      results: [
        v.period === 'hour'
          ? { label: 'Yearly salary', value: money(yearly), primary: true }
          : { label: 'Hourly rate', value: money(hourly), primary: true },
        ...(v.period === 'hour'
          ? []
          : [{ label: 'Yearly', value: money(yearly) }]),
        { label: 'Monthly', value: money(yearly / 12) },
        { label: 'Weekly', value: money(yearly / w) },
        { label: 'Daily', value: money(yearly / (w * d)) },
        ...(v.period === 'hour'
          ? []
          : [{ label: 'Hourly', value: money(hourly) }]),
      ],
      table: {
        caption: 'Pay for every period',
        columns: ['Period', 'Gross pay'],
        rows,
      },
      note: `Based on ${fmt(h)} hours a week, ${fmt(d)} days a week and ${fmt(w)} paid weeks a year. Figures are gross (before tax).`,
    };
  },
};

/* =================================================================== */
/* Fractions                                                            */
/* =================================================================== */

export type Frac = { n: bigint; d: bigint };

const babs = (x: bigint) => (x < BigInt(0) ? -x : x);
export function gcd(a: bigint, b: bigint): bigint {
  a = babs(a);
  b = babs(b);
  while (b) [a, b] = [b, a % b];
  return a || BigInt(1);
}
export function simplify(f: Frac): Frac {
  if (f.d === BigInt(0)) throw new Error('zero denominator');
  const g = gcd(f.n, f.d);
  const sign = f.d < BigInt(0) ? BigInt(-1) : BigInt(1);
  return { n: (sign * f.n) / g, d: (sign * f.d) / g };
}

/** Parses "1 1/2", "-3/4", "2", "0.75" or "-2 3/8" into an (unsimplified) fraction. */
export function parseFraction(input: string): Frac | null {
  const s = input.trim().replace(/\s+/g, ' ').replace(/[−–]/g, '-');
  let m = /^(-)?(\d+) (\d+)\/(\d+)$/.exec(s);
  if (m) {
    const whole = BigInt(m[2]);
    const d = BigInt(m[4]);
    if (d === BigInt(0)) return null;
    const n = whole * d + BigInt(m[3]);
    return { n: m[1] ? -n : n, d };
  }
  m = /^(-)?(\d+)\/(-?\d+)$/.exec(s);
  if (m) {
    const d = BigInt(m[3]);
    if (d === BigInt(0)) return null;
    return { n: m[1] ? -BigInt(m[2]) : BigInt(m[2]), d };
  }
  m = /^(-)?(\d*)(?:\.(\d+))?$/.exec(s);
  if (m && (m[2] || m[3])) {
    const dec = m[3] ?? '';
    const d = BigInt(10) ** BigInt(dec.length);
    const n = BigInt((m[2] || '0') + dec);
    return { n: m[1] ? -n : n, d };
  }
  return null;
}

export const fracText = (f: Frac) =>
  f.d === BigInt(1) ? `${f.n}` : `${f.n}/${f.d}`;

export function mixedText(f: Frac): string {
  const s = simplify(f);
  const neg = s.n < BigInt(0);
  const n = babs(s.n);
  const whole = n / s.d;
  const rest = n % s.d;
  if (!rest) return `${neg ? '-' : ''}${whole}`;
  if (!whole) return `${neg ? '-' : ''}${rest}/${s.d}`;
  return `${neg ? '-' : ''}${whole} ${rest}/${s.d}`;
}

export function fracToNumber(f: Frac): number {
  return Number(f.n) / Number(f.d);
}

const lcm = (a: bigint, b: bigint) => (babs(a) / gcd(a, b)) * babs(b);

export function fractionOp(
  a: Frac,
  op: string,
  b: Frac,
): { result: Frac; steps: string[] } {
  const steps: string[] = [];
  const A = simplify(a);
  const B = simplify(b);
  steps.push(`Write as fractions: ${fracText(A)} ${op} ${fracText(B)}`);
  let result: Frac;
  if (op === '+' || op === '−') {
    const L = lcm(A.d, B.d);
    const an = A.n * (L / A.d);
    const bn = B.n * (L / B.d);
    if (A.d !== B.d)
      steps.push(`Common denominator ${L}: ${an}/${L} ${op} ${bn}/${L}`);
    const n = op === '+' ? an + bn : an - bn;
    steps.push(`${op === '+' ? 'Add' : 'Subtract'} the numerators: ${n}/${L}`);
    result = { n, d: L };
  } else if (op === '×') {
    result = { n: A.n * B.n, d: A.d * B.d };
    steps.push(
      `Multiply tops and bottoms: (${A.n} × ${B.n}) / (${A.d} × ${B.d}) = ${result.n}/${result.d}`,
    );
  } else {
    if (B.n === BigInt(0)) throw new Error('Division by zero');
    result = { n: A.n * B.d, d: A.d * B.n };
    steps.push(
      `Multiply by the reciprocal: ${fracText(A)} × ${B.d}/${B.n} = ${result.n}/${result.d}`,
    );
  }
  const s = simplify(result);
  const g = gcd(result.n, result.d);
  if (g !== BigInt(1) || result.d < BigInt(0))
    steps.push(`Simplify (divide by ${g}): ${fracText(s)}`);
  return { result: s, steps };
}

const fraction: CalculatorDefinition = {
  fields: [
    {
      id: 'a',
      label: 'First fraction',
      type: 'text',
      default: '1 1/2',
      placeholder: 'e.g. 3/4, 1 1/2, -2, 0.25',
    },
    {
      id: 'op',
      label: 'Operation',
      type: 'select',
      default: '+',
      choices: [
        { value: '+', label: '+ Add' },
        { value: '−', label: '− Subtract' },
        { value: '×', label: '× Multiply' },
        { value: '÷', label: '÷ Divide' },
      ],
    },
    {
      id: 'b',
      label: 'Second fraction',
      type: 'text',
      default: '3/4',
      placeholder: 'e.g. 3/4, 1 1/2, -2, 0.25',
    },
  ],
  compute: (v) => {
    const a = parseFraction(v.a ?? '');
    const b = parseFraction(v.b ?? '');
    if (!a || !b)
      return fail(
        'Enter fractions like 3/4, mixed numbers like 1 1/2, whole numbers or decimals (no zero denominators).',
      );
    try {
      const { result, steps } = fractionOp(a, v.op, b);
      return {
        ok: true,
        results: [
          { label: 'Result', value: fracText(result), primary: true },
          { label: 'Mixed number', value: mixedText(result) },
          { label: 'Decimal', value: fmt(fracToNumber(result), 12) },
          {
            label: 'Percent',
            value: `${fmt(fracToNumber(result) * 100, 10)} %`,
          },
        ],
        table: {
          caption: 'Step by step',
          columns: ['Step', 'Working'],
          rows: steps.map((s, i) => [String(i + 1), s]),
        },
      };
    } catch {
      return fail('You can’t divide by zero.');
    }
  },
};

/* =================================================================== */
/* Ratio & aspect ratio                                                 */
/* =================================================================== */

/** Scales decimals to integers and divides by the GCD: 1.5:2 → 3:4. */
export function simplifyRatio(a: number, b: number): [number, number] {
  const places = Math.max(decimals(a), decimals(b));
  const k = 10 ** Math.min(places, 9);
  const A = BigInt(Math.round(a * k));
  const B = BigInt(Math.round(b * k));
  const g = gcd(A, B);
  return [Number(A / g), Number(B / g)];
}
function decimals(x: number): number {
  const s = String(x);
  if (s.includes('e-')) return Number(s.split('e-')[1]);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

const ratio: CalculatorDefinition = {
  fields: [
    {
      id: 'mode',
      label: 'Calculate',
      type: 'select',
      default: 'solve',
      choices: [
        { value: 'solve', label: 'Missing value (A : B = C : D)' },
        { value: 'simplify', label: 'Simplify a ratio' },
        { value: 'share', label: 'Split a total in a ratio' },
      ],
    },
    { id: 'a', label: 'A', type: 'number', default: '3' },
    { id: 'b', label: 'B', type: 'number', default: '4' },
    {
      id: 'c',
      label: 'C',
      type: 'number',
      default: '9',
      showIf: { field: 'mode', values: ['solve'] },
    },
    {
      id: 'd',
      label: 'D',
      type: 'number',
      default: '',
      showIf: { field: 'mode', values: ['solve'] },
      help: 'Leave exactly one of A–D empty.',
    },
    {
      id: 'total',
      label: 'Total to split',
      type: 'number',
      default: '700',
      showIf: { field: 'mode', values: ['share'] },
    },
  ],
  compute: (v) => {
    const vals = ['a', 'b', 'c', 'd'].map((k) => num(v, k));
    if (v.mode === 'solve') {
      const blanks = vals
        .map((x, i) => (Number.isNaN(x) ? i : -1))
        .filter((i) => i >= 0);
      if (blanks.length !== 1)
        return fail('Fill in three of A, B, C and D and leave one empty.');
      const [a, b, c, d] = vals;
      const i = blanks[0];
      const x =
        i === 0
          ? (b * c) / d
          : i === 1
            ? (a * d) / c
            : i === 2
              ? (a * d) / b
              : (b * c) / a;
      if (!Number.isFinite(x))
        return fail(
          'That ratio has a zero in the wrong place — it can’t be solved.',
        );
      const letter = 'ABCD'[i];
      const all = [...vals];
      all[i] = x;
      return {
        ok: true,
        results: [
          { label: `${letter} =`, value: fmt(x, 12), primary: true },
          {
            label: 'Proportion',
            value: `${fmt(all[0])} : ${fmt(all[1])} = ${fmt(all[2])} : ${fmt(all[3])}`,
          },
          { label: 'Ratio as a decimal', value: fmt(all[0] / all[1], 10) },
        ],
        note: 'Cross-multiplication: A × D = B × C.',
      };
    }
    const [a, b] = vals;
    if (!(a > 0) || !(b > 0))
      return fail('Enter two positive numbers for A and B.');
    const [x, y] = simplifyRatio(a, b);
    if (v.mode === 'share') {
      const total = num(v, 'total');
      if (!Number.isFinite(total)) return fail('Enter the total to split.');
      const pa = (total * a) / (a + b);
      return {
        ok: true,
        results: [
          {
            label: 'Shares',
            value: `${fmt(pa, 10)} and ${fmt(total - pa, 10)}`,
            primary: true,
          },
          { label: 'Ratio', value: `${x} : ${y}` },
          { label: 'Share of A', value: `${fmt((a / (a + b)) * 100, 6)} %` },
          { label: 'Share of B', value: `${fmt((b / (a + b)) * 100, 6)} %` },
        ],
      };
    }
    return {
      ok: true,
      results: [
        { label: 'Simplest form', value: `${x} : ${y}`, primary: true },
        { label: '1 : n form', value: `1 : ${fmt(b / a, 8)}` },
        { label: 'n : 1 form', value: `${fmt(a / b, 8)} : 1` },
        { label: 'As a fraction', value: `${x}/${y}` },
        {
          label: 'Percent split',
          value: `${fmt((a / (a + b)) * 100, 6)} % / ${fmt((b / (a + b)) * 100, 6)} %`,
        },
      ],
    };
  },
};

const NAMED_RATIOS: [string, number][] = [
  ['1:1 (square)', 1],
  ['5:4', 1.25],
  ['4:3', 4 / 3],
  ['3:2', 1.5],
  ['16:10', 1.6],
  ['16:9 (widescreen)', 16 / 9],
  ['1.85:1 (cinema)', 1.85],
  ['2:1', 2],
  ['21:9 (ultrawide)', 64 / 27],
  ['2.39:1 (anamorphic)', 2.39],
  ['4:5 (Instagram portrait)', 0.8],
  ['3:4', 0.75],
  ['2:3', 2 / 3],
  ['9:16 (vertical video)', 9 / 16],
];

export function nearestNamedRatio(r: number): { name: string; diff: number } {
  let best = NAMED_RATIOS[0];
  for (const n of NAMED_RATIOS)
    if (Math.abs(Math.log(n[1] / r)) < Math.abs(Math.log(best[1] / r)))
      best = n;
  return { name: best[0], diff: Math.abs(best[1] / r - 1) };
}

const aspect: CalculatorDefinition = {
  fields: [
    {
      id: 'w',
      label: 'Width',
      type: 'number',
      default: '1920',
      min: 0,
      suffix: 'px',
    },
    {
      id: 'h',
      label: 'Height',
      type: 'number',
      default: '1080',
      min: 0,
      suffix: 'px',
    },
    {
      id: 'nw',
      label: 'New width (optional)',
      type: 'number',
      default: '',
      min: 0,
      suffix: 'px',
    },
    {
      id: 'nh',
      label: 'New height (optional)',
      type: 'number',
      default: '',
      min: 0,
      suffix: 'px',
      help: 'Fill one of the new sizes to get the other (if both are filled, the new width is used).',
    },
  ],
  compute: (v) => {
    const w = num(v, 'w');
    const h = num(v, 'h');
    if (!(w > 0) || !(h > 0))
      return fail('Enter a width and height greater than zero.');
    const [x, y] = simplifyRatio(w, h);
    const r = w / h;
    const near = nearestNamedRatio(r);
    const nw = num(v, 'nw');
    const nh = num(v, 'nh');
    const results = [
      { label: 'Aspect ratio', value: `${x}:${y}`, primary: true },
      { label: 'Decimal', value: `${fmt(r, 6)} : 1` },
      {
        label: 'Closest standard',
        value:
          near.diff < 0.005
            ? near.name
            : `${near.name} (${fmt(near.diff * 100, 2)} % off)`,
      },
      {
        label: 'Orientation',
        value: w === h ? 'Square' : w > h ? 'Landscape' : 'Portrait',
      },
    ];
    if (nw > 0)
      results.splice(1, 0, {
        label: `Height for ${fmt(nw)} wide`,
        value: `${fmt(Math.round((nw * h) / w))} px (exact ${fmt((nw * h) / w, 8)})`,
      });
    else if (nh > 0)
      results.splice(1, 0, {
        label: `Width for ${fmt(nh)} high`,
        value: `${fmt(Math.round((nh * w) / h))} px (exact ${fmt((nh * w) / h, 8)})`,
      });
    const widths = [320, 640, 854, 1280, 1920, 2560, 3840];
    const table: CalcTable = {
      caption: 'Common sizes at this ratio',
      columns: ['Width', 'Height', 'Exact?'],
      rows: widths.map((cw) => {
        const ch = (cw * h) / w;
        return [
          `${cw}`,
          `${Math.round(ch)}`,
          Number.isInteger(Math.round(ch * 1e6) / 1e6) ? 'Yes' : 'Rounded',
        ];
      }),
    };
    return { ok: true, results, table };
  },
};

/* =================================================================== */
/* Body fat & ideal weight                                              */
/* =================================================================== */

const UNIT_CHOICES = [
  { value: 'metric', label: 'Metric (cm, kg)' },
  { value: 'imperial', label: 'Imperial (in, lb)' },
];
const SEX_CHOICES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

/** U.S. Navy circumference method (Hodgdon & Beckett), lengths in cm. */
export function navyBodyFat(
  sex: string,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm = 0,
): number {
  if (sex === 'female')
    return (
      495 /
        (1.29579 -
          0.35004 * Math.log10(waistCm + hipCm - neckCm) +
          0.221 * Math.log10(heightCm)) -
      450
    );
  return (
    495 /
      (1.0324 -
        0.19077 * Math.log10(waistCm - neckCm) +
        0.15456 * Math.log10(heightCm)) -
    450
  );
}

export function bodyFatCategory(sex: string, bf: number): string {
  const t = sex === 'female' ? [14, 21, 25, 32] : [6, 14, 18, 25];
  if (bf < t[0]) return 'Essential fat';
  if (bf < t[1]) return 'Athletes';
  if (bf < t[2]) return 'Fitness';
  if (bf < t[3]) return 'Average';
  return 'Obese';
}

const HEALTH_NOTE =
  'An estimate for general information, not medical advice. Ask a doctor or dietitian about your own health.';

/** One number field per unit system, so switching units never misreads values. */
const perUnit = (
  id: string,
  label: string,
  metric: { def: string; suffix: string },
  imperial: { def: string; suffix: string },
  extra: { help?: string; showIf?: ShowIf[] } = {},
): CalcField[] => [
  {
    id: `${id}Metric`,
    label,
    type: 'number',
    default: metric.def,
    min: 0,
    suffix: metric.suffix,
    help: extra.help,
    showIf: [{ field: 'units', values: ['metric'] }, ...(extra.showIf ?? [])],
  },
  {
    id: `${id}Imperial`,
    label,
    type: 'number',
    default: imperial.def,
    min: 0,
    suffix: imperial.suffix,
    help: extra.help,
    showIf: [{ field: 'units', values: ['imperial'] }, ...(extra.showIf ?? [])],
  },
];
const unitValue = (v: Record<string, string>, id: string) =>
  v.units === 'imperial'
    ? num(v, `${id}Imperial`) * 2.54
    : num(v, `${id}Metric`);

const bodyFat: CalculatorDefinition = {
  fields: [
    {
      id: 'units',
      label: 'Units',
      type: 'select',
      default: 'metric',
      choices: UNIT_CHOICES,
    },
    {
      id: 'sex',
      label: 'Sex',
      type: 'select',
      default: 'male',
      choices: SEX_CHOICES,
    },
    ...perUnit(
      'height',
      'Height',
      { def: '178', suffix: 'cm' },
      { def: '70', suffix: 'in' },
    ),
    ...perUnit(
      'neck',
      'Neck (below the larynx)',
      { def: '38', suffix: 'cm' },
      { def: '15', suffix: 'in' },
    ),
    ...perUnit(
      'waist',
      'Waist',
      { def: '86', suffix: 'cm' },
      { def: '34', suffix: 'in' },
      { help: 'Men: at the navel. Women: at the narrowest point.' },
    ),
    ...perUnit(
      'hip',
      'Hips (widest point)',
      { def: '96', suffix: 'cm' },
      { def: '38', suffix: 'in' },
      { showIf: [{ field: 'sex', values: ['female'] }] },
    ),
    {
      id: 'weightMetric',
      label: 'Weight (optional)',
      type: 'number',
      default: '',
      min: 0,
      suffix: 'kg',
      help: 'For fat and lean mass',
      showIf: { field: 'units', values: ['metric'] },
    },
    {
      id: 'weightImperial',
      label: 'Weight (optional)',
      type: 'number',
      default: '',
      min: 0,
      suffix: 'lb',
      help: 'For fat and lean mass',
      showIf: { field: 'units', values: ['imperial'] },
    },
  ],
  compute: (v) => {
    const h = unitValue(v, 'height');
    const neck = unitValue(v, 'neck');
    const waist = unitValue(v, 'waist');
    const hip = unitValue(v, 'hip');
    if (
      ![h, neck, waist].every((x) => x > 0) ||
      (v.sex === 'female' && !(hip > 0))
    )
      return fail('Please enter all measurements.');
    if (v.sex === 'female' ? waist + hip <= neck : waist <= neck)
      return fail('The waist measurement must be larger than the neck.');
    const bf = navyBodyFat(v.sex, h, neck, waist, hip);
    if (!(bf > 0 && bf < 75))
      return fail(
        'These measurements give an implausible result — please check them.',
      );
    const imperial = v.units === 'imperial';
    const weight = num(v, imperial ? 'weightImperial' : 'weightMetric');
    const wu = imperial ? 'lb' : 'kg';
    const results = [
      { label: 'Body fat', value: `${fmt(bf, 3)} %`, primary: true },
      { label: 'Category (ACE)', value: bodyFatCategory(v.sex, bf) },
    ];
    if (weight > 0)
      results.push(
        { label: 'Fat mass', value: `${fmt((weight * bf) / 100, 4)} ${wu}` },
        {
          label: 'Lean mass',
          value: `${fmt(weight * (1 - bf / 100), 4)} ${wu}`,
        },
      );
    return {
      ok: true,
      results,
      table: {
        caption: 'ACE body-fat categories',
        columns: ['Category', 'Women', 'Men'],
        rows: [
          ['Essential fat', 'below 14 %', 'below 6 %'],
          ['Athletes', '14–20 %', '6–13 %'],
          ['Fitness', '21–24 %', '14–17 %'],
          ['Average', '25–31 %', '18–24 %'],
          ['Obese', '32 % +', '25 % +'],
        ],
      },
      note: `U.S. Navy circumference method; it is typically within about 3–4 percentage points of a lab measurement. ACE puts the essential-fat minimum at about 10–13 % for women and 2–5 % for men. ${HEALTH_NOTE}`,
    };
  },
};

/** Formula weights in kg for a height in cm (inches over 5 ft as the variable). */
export function idealWeights(sex: string, heightCm: number) {
  const over = heightCm / 2.54 - 60;
  const f = sex === 'female';
  return {
    Devine: (f ? 45.5 : 50) + 2.3 * over,
    Robinson: (f ? 49 : 52) + (f ? 1.7 : 1.9) * over,
    Miller: (f ? 53.1 : 56.2) + (f ? 1.36 : 1.41) * over,
    Hamwi: (f ? 45.5 : 48) + (f ? 2.2 : 2.7) * over,
  };
}

const idealWeight: CalculatorDefinition = {
  fields: [
    {
      id: 'units',
      label: 'Units',
      type: 'select',
      default: 'metric',
      choices: UNIT_CHOICES,
    },
    {
      id: 'sex',
      label: 'Sex',
      type: 'select',
      default: 'male',
      choices: SEX_CHOICES,
    },
    ...perUnit(
      'height',
      'Height',
      { def: '178', suffix: 'cm' },
      { def: '70', suffix: 'in' },
      { help: 'For imperial use total inches: 5 ft 10 in = 70.' },
    ),
  ],
  compute: (v) => {
    const imperial = v.units === 'imperial';
    const h = unitValue(v, 'height');
    if (!(h >= 120 && h <= 230))
      return fail('Please enter a height between 120 and 230 cm (47–90 in).');
    const w = idealWeights(v.sex, h);
    const conv = (kg: number) => (imperial ? kg / 0.45359237 : kg);
    const unit = imperial ? 'lb' : 'kg';
    const vals = Object.values(w).map(conv);
    const m = h / 100;
    const lo = conv(18.5 * m * m);
    const hi = conv(24.9 * m * m);
    return {
      ok: true,
      results: [
        {
          label: 'Ideal weight (formula range)',
          value: `${fmt(Math.min(...vals), 3)}–${fmt(Math.max(...vals), 3)} ${unit}`,
          primary: true,
        },
        ...Object.entries(w).map(([name, kg]) => ({
          label: `${name} formula`,
          value: `${fmt(conv(kg), 4)} ${unit}`,
        })),
        {
          label: 'Healthy BMI range (18.5–24.9)',
          value: `${fmt(lo, 3)}–${fmt(hi, 3)} ${unit}`,
        },
      ],
      note: `The formulas were designed for adults of average build and are least reliable for very short or tall people and muscular bodies. ${h < 152.4 ? 'Below 5 ft they extrapolate downwards and are less meaningful. ' : ''}${HEALTH_NOTE}`,
    };
  },
};

/* =================================================================== */
/* Profit margin & markup                                               */
/* =================================================================== */

const margin: CalculatorDefinition = {
  fields: [
    {
      id: 'mode',
      label: 'I know',
      type: 'select',
      default: 'cost-price',
      choices: [
        { value: 'cost-price', label: 'Cost and selling price' },
        { value: 'cost-margin', label: 'Cost and desired margin' },
        { value: 'cost-markup', label: 'Cost and markup' },
        { value: 'price-margin', label: 'Selling price and margin' },
      ],
    },
    {
      id: 'cost',
      label: 'Cost',
      type: 'number',
      default: '60',
      min: 0,
      showIf: {
        field: 'mode',
        values: ['cost-price', 'cost-margin', 'cost-markup'],
      },
    },
    {
      id: 'price',
      label: 'Selling price',
      type: 'number',
      default: '100',
      min: 0,
      showIf: { field: 'mode', values: ['cost-price', 'price-margin'] },
    },
    {
      id: 'margin',
      label: 'Margin',
      type: 'number',
      default: '40',
      suffix: '%',
      showIf: { field: 'mode', values: ['cost-margin', 'price-margin'] },
    },
    {
      id: 'markup',
      label: 'Markup',
      type: 'number',
      default: '50',
      suffix: '%',
      showIf: { field: 'mode', values: ['cost-markup'] },
    },
  ],
  compute: (v) => {
    let cost = num(v, 'cost');
    let price = num(v, 'price');
    const m = num(v, 'margin');
    const mk = num(v, 'markup');
    if (v.mode === 'cost-margin') {
      if (!(m < 100)) return fail('A margin must be below 100 %.');
      price = cost / (1 - m / 100);
    } else if (v.mode === 'cost-markup') price = cost * (1 + mk / 100);
    else if (v.mode === 'price-margin') {
      if (!(m < 100)) return fail('A margin must be below 100 %.');
      cost = price * (1 - m / 100);
    }
    if (!(cost >= 0) || !(price > 0))
      return fail(
        'Please enter a cost of 0 or more and a selling price above 0.',
      );
    const profit = price - cost;
    const solved =
      v.mode === 'cost-price'
        ? null
        : v.mode === 'price-margin'
          ? 'Cost'
          : 'Selling price';
    return {
      ok: true,
      results: [
        solved
          ? {
              label: solved,
              value: money(solved === 'Cost' ? cost : price),
              primary: true,
            }
          : {
              label: 'Profit margin',
              value: pct((profit / price) * 100),
              primary: true,
            },
        { label: 'Profit', value: money(profit) },
        ...(solved
          ? [{ label: 'Profit margin', value: pct((profit / price) * 100) }]
          : []),
        {
          label: 'Markup',
          value: cost > 0 ? pct((profit / cost) * 100) : '— (cost is 0)',
        },
        { label: 'Cost', value: money(cost) },
        { label: 'Selling price', value: money(price) },
      ],
      note: 'Margin is profit as a share of the selling price; markup is profit as a share of the cost. A 50 % markup is a 33.3 % margin.',
    };
  },
};

/* =================================================================== */
/* ROI                                                                  */
/* =================================================================== */

export function cagr(start: number, end: number, years: number): number {
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

const roi: CalculatorDefinition = {
  fields: [
    {
      id: 'invested',
      label: 'Amount invested',
      type: 'number',
      default: '10000',
      min: 0,
    },
    {
      id: 'returned',
      label: 'Amount returned (final value)',
      type: 'number',
      default: '14500',
      min: 0,
    },
    {
      id: 'period',
      label: 'Investment period',
      type: 'select',
      default: 'years',
      choices: [
        { value: 'none', label: 'Don’t annualize' },
        { value: 'years', label: 'Number of years' },
        { value: 'dates', label: 'Start and end date' },
      ],
    },
    {
      id: 'years',
      label: 'Years',
      type: 'number',
      default: '3',
      min: 0,
      showIf: { field: 'period', values: ['years'] },
    },
    {
      id: 'from',
      label: 'Start date',
      type: 'date',
      default: (now) => toDateInput(addMonths(todayUtc(now), -36)),
      showIf: { field: 'period', values: ['dates'] },
    },
    {
      id: 'to',
      label: 'End date',
      type: 'date',
      default: today,
      showIf: { field: 'period', values: ['dates'] },
    },
  ],
  compute: (v) => {
    const a = num(v, 'invested');
    const b = num(v, 'returned');
    if (!(a > 0) || !(b >= 0))
      return fail(
        'Enter an amount invested above 0 and the amount you got back.',
      );
    const gain = b - a;
    let years = NaN;
    if (v.period === 'years') years = num(v, 'years');
    else if (v.period === 'dates') {
      const f = parseDateInput(v.from ?? '');
      const t = parseDateInput(v.to ?? '');
      if (!f || !t || t <= f)
        return fail('The end date must be after the start date.');
      years = (t.getTime() - f.getTime()) / (365.25 * 86400000);
    }
    const results = [
      { label: 'ROI', value: pct((gain / a) * 100), primary: true },
      { label: gain >= 0 ? 'Gain' : 'Loss', value: money(Math.abs(gain)) },
      { label: 'Multiple', value: `${fmt(b / a, 6)}×` },
    ];
    if (v.period !== 'none') {
      if (!(years > 0)) return fail('Please enter a period longer than 0.');
      results.push(
        {
          label: 'Annualized ROI (CAGR)',
          value: b > 0 ? pct(cagr(a, b, years)) : '−100 %',
        },
        {
          label: 'Period',
          value: `${fmt(years, 4)} year${years === 1 ? '' : 's'}`,
        },
      );
    }
    return {
      ok: true,
      results,
      note: 'ROI = (final value − amount invested) ÷ amount invested. Add fees, taxes and dividends to the final value for a true picture.',
    };
  },
};

/* =================================================================== */
/* Savings goal & retirement                                            */
/* =================================================================== */

/** Future value of a balance plus monthly deposits, compounded monthly. */
export function futureValue(
  pv: number,
  monthly: number,
  annualPct: number,
  months: number,
): number {
  const r = annualPct / 100 / 12;
  if (r === 0) return pv + monthly * months;
  const g = Math.pow(1 + r, months);
  return pv * g + (monthly * (g - 1)) / r;
}

export function depositForGoal(
  goal: number,
  pv: number,
  annualPct: number,
  months: number,
): number {
  const r = annualPct / 100 / 12;
  if (r === 0) return (goal - pv) / months;
  const g = Math.pow(1 + r, months);
  return ((goal - pv * g) * r) / (g - 1);
}

function savingsTable(
  pv: number,
  monthly: number,
  annualPct: number,
  months: number,
): CalcTable {
  const r = annualPct / 100 / 12;
  const rows: string[][] = [];
  let bal = pv;
  let deposits = 0;
  let interest = 0;
  for (let m = 1; m <= months; m++) {
    const i = bal * r;
    interest += i;
    bal += i + monthly;
    deposits += monthly;
    if (m % 12 === 0 || m === months)
      rows.push([
        String(Math.ceil(m / 12)),
        money(deposits),
        money(interest),
        money(bal),
      ]);
  }
  return {
    caption: 'Year by year',
    columns: ['Year', 'Deposits', 'Interest', 'Balance'],
    rows,
  };
}

const savingsGoal: CalculatorDefinition = {
  fields: [
    {
      id: 'goal',
      label: 'Savings goal',
      type: 'number',
      default: '20000',
      min: 0,
    },
    {
      id: 'current',
      label: 'Saved so far',
      type: 'number',
      default: '2000',
      min: 0,
    },
    {
      id: 'rate',
      label: 'Interest / return',
      type: 'number',
      default: '4',
      suffix: '% per year',
      min: 0,
    },
    {
      id: 'mode',
      label: 'Calculate',
      type: 'select',
      default: 'deposit',
      choices: [
        { value: 'deposit', label: 'Monthly saving needed' },
        { value: 'time', label: 'Time to reach the goal' },
      ],
    },
    {
      id: 'years',
      label: 'Reach the goal in',
      type: 'number',
      default: '3',
      suffix: 'years',
      min: 0,
      showIf: { field: 'mode', values: ['deposit'] },
    },
    {
      id: 'monthly',
      label: 'Monthly saving',
      type: 'number',
      default: '500',
      min: 0,
      showIf: { field: 'mode', values: ['time'] },
    },
  ],
  compute: (v) => {
    const goal = num(v, 'goal');
    const pv = num(v, 'current') || 0;
    const rate = num(v, 'rate') || 0;
    if (!(goal > 0) || pv < 0 || rate < 0)
      return fail(
        'Please enter a goal above 0, current savings and a rate of 0 or more.',
      );
    if (pv >= goal)
      return {
        ok: true,
        results: [
          {
            label: 'Goal reached',
            value: 'You already have enough saved.',
            primary: true,
          },
        ],
      };
    if (v.mode === 'deposit') {
      const months = Math.round(num(v, 'years') * 12);
      if (!(months > 0)) return fail('Please enter how many years you have.');
      const dep = Math.max(0, depositForGoal(goal, pv, rate, months));
      const total = dep * months;
      return {
        ok: true,
        results: [
          { label: 'Save each month', value: money(dep), primary: true },
          { label: 'Total deposits', value: money(total) },
          { label: 'Interest earned', value: money(goal - pv - total) },
          { label: 'Months', value: String(months) },
        ],
        table: savingsTable(pv, dep, rate, months),
        note: 'Assumes monthly deposits at the end of each month and monthly compounding.',
      };
    }
    const monthly = num(v, 'monthly');
    if (!(monthly >= 0))
      return fail('Please enter how much you save each month.');
    const r = rate / 100 / 12;
    let bal = pv;
    let m = 0;
    while (bal < goal && m < 1200) {
      bal += bal * r + monthly;
      m++;
    }
    if (bal < goal)
      return fail(
        'At this rate the goal isn’t reached within 100 years — save more each month.',
      );
    return {
      ok: true,
      results: [
        {
          label: 'Time to goal',
          value: yearsMonths(m),
          primary: true,
        },
        {
          label: 'Reached',
          value: monthYear(addMonths(todayUtc(new Date()), m)),
        },
        { label: 'Total deposits', value: money(monthly * m) },
        { label: 'Interest earned', value: money(bal - pv - monthly * m) },
      ],
      table: savingsTable(pv, monthly, rate, m),
      note: 'Assumes monthly deposits at the end of each month and monthly compounding.',
    };
  },
};

const retirement: CalculatorDefinition = {
  fields: [
    { id: 'age', label: 'Current age', type: 'number', default: '35', min: 0 },
    {
      id: 'retire',
      label: 'Retirement age',
      type: 'number',
      default: '67',
      min: 0,
    },
    {
      id: 'until',
      label: 'Plan until age',
      type: 'number',
      default: '90',
      min: 0,
    },
    {
      id: 'savings',
      label: 'Current retirement savings',
      type: 'number',
      default: '50000',
      min: 0,
    },
    {
      id: 'monthly',
      label: 'Monthly contribution',
      type: 'number',
      default: '500',
      min: 0,
    },
    {
      id: 'pre',
      label: 'Return before retirement',
      type: 'number',
      default: '6',
      suffix: '% per year',
    },
    {
      id: 'post',
      label: 'Return in retirement',
      type: 'number',
      default: '4',
      suffix: '% per year',
    },
    {
      id: 'inflation',
      label: 'Inflation',
      type: 'number',
      default: '2.5',
      suffix: '% per year',
      min: 0,
    },
    {
      id: 'income',
      label: 'Yearly income wanted in retirement',
      type: 'number',
      default: '40000',
      min: 0,
      help: 'In today’s money, from these savings (excluding pensions).',
    },
    {
      id: 'withdraw',
      label: 'Withdrawal rate',
      type: 'number',
      default: '4',
      suffix: '%',
      min: 0,
      help: 'The “4 % rule” is a common starting point.',
    },
  ],
  compute: (v) => {
    const age = num(v, 'age');
    const ret = num(v, 'retire');
    const until = num(v, 'until');
    const pv = num(v, 'savings') || 0;
    const monthly = num(v, 'monthly') || 0;
    const pre = num(v, 'pre');
    const post = num(v, 'post');
    const inf = num(v, 'inflation') || 0;
    const income = num(v, 'income') || 0;
    const wr = num(v, 'withdraw');
    if (!(age >= 0) || !(ret > age) || !(until > ret) || until > 120)
      return fail(
        'Ages must increase: current age < retirement age < plan-until age (max 120).',
      );
    if (![pre, post, wr].every(Number.isFinite))
      return fail('Please enter the return and withdrawal rates.');
    const yearsToRet = ret - age;
    const nest = futureValue(pv, monthly, pre, Math.round(yearsToRet * 12));
    const deflate = Math.pow(1 + inf / 100, yearsToRet);
    const rows: string[][] = [];
    // Accumulation (yearly snapshot)
    let bal = pv;
    for (let y = 1; y <= yearsToRet; y++) {
      bal = futureValue(bal, monthly, pre, 12);
      rows.push([String(age + y), 'Saving', money(bal)]);
    }
    // Drawdown with inflation-indexed income
    let b = nest;
    let lastsUntil: number | null = null;
    for (let y = 0; y < until - ret; y++) {
      const need = income * Math.pow(1 + inf / 100, yearsToRet + y);
      b = b * (1 + post / 100) - need;
      rows.push([String(ret + y + 1), 'Withdrawing', money(Math.max(0, b))]);
      if (b <= 0) {
        lastsUntil = ret + y;
        break;
      }
    }
    return {
      ok: true,
      results: [
        { label: 'Savings at retirement', value: money(nest), primary: true },
        { label: 'In today’s money', value: money(nest / deflate) },
        {
          label: `Income at ${fmt(wr)} % withdrawal`,
          value: `${money((nest * wr) / 100)} / year (${money((nest * wr) / 100 / deflate)} today)`,
        },
        {
          label: `Wanted income (${money(income)} today, rising with inflation)`,
          value: income
            ? lastsUntil == null
              ? `Lasts beyond age ${fmt(until)}`
              : `Runs out around age ${fmt(lastsUntil)}`
            : 'Not set',
        },
        { label: 'Years until retirement', value: fmt(yearsToRet) },
        {
          label: 'Your contributions until retirement',
          value: money(monthly * 12 * yearsToRet),
        },
      ],
      table: {
        caption: 'Balance by age',
        columns: ['Age', 'Phase', 'Balance (future money)'],
        rows,
      },
      note: 'Assumes steady returns, monthly contributions until retirement and yearly withdrawals rising with inflation. Real markets go up and down, and taxes and fees are not included — an estimate, not financial advice.',
    };
  },
};

/* =================================================================== */
/* Unit price comparison                                                */
/* =================================================================== */

const UNITS: Record<
  string,
  { family: 'mass' | 'volume' | 'count'; base: number; label: string }
> = {
  g: { family: 'mass', base: 1, label: 'g' },
  kg: { family: 'mass', base: 1000, label: 'kg' },
  oz: { family: 'mass', base: 28.349523125, label: 'oz' },
  lb: { family: 'mass', base: 453.59237, label: 'lb' },
  ml: { family: 'volume', base: 1, label: 'ml' },
  l: { family: 'volume', base: 1000, label: 'l' },
  floz: { family: 'volume', base: 29.5735295625, label: 'fl oz' },
  item: { family: 'count', base: 1, label: 'item' },
};
const UNIT_SELECT = Object.entries(UNITS).map(([value, u]) => ({
  value,
  label: u.label,
}));
const DISPLAY: Record<string, { per: string; base: number }[]> = {
  mass: [
    { per: 'per 100 g', base: 100 },
    { per: 'per kg', base: 1000 },
    { per: 'per lb', base: 453.59237 },
    { per: 'per oz', base: 28.349523125 },
  ],
  volume: [
    { per: 'per 100 ml', base: 100 },
    { per: 'per litre', base: 1000 },
    { per: 'per fl oz', base: 29.5735295625 },
  ],
  count: [{ per: 'per item', base: 1 }],
};

const itemFields = (i: number, price: string, size: string, unit: string) => [
  {
    id: `price${i}`,
    label: `Product ${i} — price`,
    type: 'number' as const,
    default: price,
    min: 0,
  },
  {
    id: `size${i}`,
    label: `Product ${i} — size`,
    type: 'number' as const,
    default: size,
    min: 0,
  },
  {
    id: `unit${i}`,
    label: `Product ${i} — unit`,
    type: 'select' as const,
    default: unit,
    choices: UNIT_SELECT,
  },
];

const price4 = (n: number) =>
  Number.isFinite(n)
    ? n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      })
    : '—';

const unitPrice: CalculatorDefinition = {
  fields: [
    ...itemFields(1, '3.49', '500', 'g'),
    ...itemFields(2, '5.99', '1', 'kg'),
    ...itemFields(3, '', '', 'g'),
    ...itemFields(4, '', '', 'g'),
  ],
  compute: (v) => {
    const items = [1, 2, 3, 4]
      .map((i) => ({
        i,
        price: num(v, `price${i}`),
        size: num(v, `size${i}`),
        unit: UNITS[v[`unit${i}`]],
      }))
      .filter((it) => Number.isFinite(it.price) && Number.isFinite(it.size));
    if (items.length < 2)
      return fail('Enter the price and size of at least two products.');
    const skipped = [1, 2, 3, 4].filter((i) => {
      const hasPrice = Number.isFinite(num(v, `price${i}`));
      const hasSize = Number.isFinite(num(v, `size${i}`));
      return hasPrice !== hasSize;
    });
    if (items.some((it) => !(it.price >= 0) || !(it.size > 0) || !it.unit))
      return fail('Prices must be 0 or more and sizes above 0.');
    const fam = items[0].unit.family;
    if (items.some((it) => it.unit.family !== fam))
      return fail(
        'Compare like with like: use weight units (g, kg, oz, lb), volume units (ml, l, fl oz) or items for all products.',
      );
    const perBase = items.map((it) => it.price / (it.size * it.unit.base));
    const best = Math.min(...perBase);
    const worst = Math.max(...perBase);
    const disp = DISPLAY[fam];
    const main = disp[0];
    const order = perBase
      .map((p, k) => [p, k] as const)
      .sort((a, b) => a[0] - b[0]);
    const bestItem = items[order[0][1]];
    return {
      ok: true,
      results: [
        {
          label: 'Best value',
          value: `Product ${bestItem.i} — ${price4(best * main.base)} ${main.per}`,
          primary: true,
        },
        ...order.map(([p, k]) => ({
          label: `Product ${items[k].i}`,
          value: `${price4(p * main.base)} ${main.per}${p === best ? ' ✓ cheapest' : ` (+${fmt(((p - best) / best) * 100, 3)} %)`}`,
        })),
        ...(worst > best
          ? [
              {
                label: 'You save vs. the most expensive',
                value: `${fmt(((worst - best) / worst) * 100, 3)} %`,
              },
            ]
          : []),
      ],
      table: {
        caption: 'Unit prices in other units',
        columns: ['Product', ...disp.map((d) => d.per)],
        rows: items.map((it, k) => [
          `Product ${it.i}`,
          ...disp.map((d) => price4(perBase[k] * d.base)),
        ]),
      },
      ...(skipped.length
        ? {
            note: `Product ${skipped.join(' and ')} skipped — enter both a price and a size to include it.`,
          }
        : {}),
    };
  },
};

/* =================================================================== */
/* Probability                                                          */
/* =================================================================== */

export function nCr(n: number, r: number): bigint {
  if (r < 0 || r > n) return BigInt(0);
  r = Math.min(r, n - r);
  let res = BigInt(1);
  for (let i = 1; i <= r; i++) res = (res * BigInt(n - r + i)) / BigInt(i);
  return res;
}
export function nPr(n: number, r: number): bigint {
  if (r < 0 || r > n) return BigInt(0);
  let res = BigInt(1);
  for (let i = 0; i < r; i++) res *= BigInt(n - i);
  return res;
}

function logChoose(n: number, k: number): number {
  let s = 0;
  k = Math.min(k, n - k);
  for (let i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i);
  return s;
}

export function binomialPmf(n: number, k: number, p: number): number {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return Math.exp(
    logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p),
  );
}

const bigText = (b: bigint) => {
  const s = b.toString();
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return s.length > 21
    ? `${grouped.slice(0, 40)}… (${s.length} digits, ≈ ${Number(b).toExponential(6)})`
    : grouped;
};
const prob = (p: number) => `${fmt(p * 100, 8)} %`;

const probability: CalculatorDefinition = {
  fields: [
    {
      id: 'mode',
      label: 'Calculate',
      type: 'select',
      default: 'single',
      choices: [
        { value: 'single', label: 'Chance of one event' },
        { value: 'two', label: 'Two independent events (A and B, A or B…)' },
        { value: 'atleast', label: 'At least once in several tries' },
        {
          value: 'binomial',
          label: 'Exactly / at most / at least k successes',
        },
        { value: 'combo', label: 'Combinations and permutations (nCr, nPr)' },
      ],
    },
    {
      id: 'fav',
      label: 'Favourable outcomes',
      type: 'number',
      default: '1',
      min: 0,
      showIf: { field: 'mode', values: ['single'] },
    },
    {
      id: 'total',
      label: 'Total possible outcomes',
      type: 'number',
      default: '6',
      min: 0,
      showIf: { field: 'mode', values: ['single'] },
    },
    {
      id: 'pa',
      label: 'Probability of A',
      type: 'number',
      default: '50',
      suffix: '%',
      min: 0,
      showIf: { field: 'mode', values: ['two'] },
    },
    {
      id: 'p',
      label: 'Chance of success in each try',
      type: 'number',
      default: '10',
      suffix: '%',
      min: 0,
      showIf: { field: 'mode', values: ['atleast', 'binomial'] },
    },
    {
      id: 'pb',
      label: 'Probability of B',
      type: 'number',
      default: '30',
      suffix: '%',
      min: 0,
      showIf: { field: 'mode', values: ['two'] },
    },
    {
      id: 'n',
      label: 'Number of tries (n)',
      type: 'number',
      default: '10',
      min: 0,
      showIf: { field: 'mode', values: ['atleast', 'binomial', 'combo'] },
    },
    {
      id: 'k',
      label: 'Successes / items chosen (k)',
      type: 'number',
      default: '3',
      min: 0,
      showIf: { field: 'mode', values: ['binomial', 'combo'] },
    },
  ],
  compute: (v) => {
    if (v.mode === 'single') {
      const f = num(v, 'fav');
      const t = num(v, 'total');
      if (!(t > 0) || !(f >= 0) || f > t)
        return fail('Favourable outcomes must be between 0 and the total.');
      const p = f / t;
      return {
        ok: true,
        results: [
          { label: 'Probability', value: prob(p), primary: true },
          {
            label: 'As a fraction',
            value: (() => {
              const g = gcd(BigInt(Math.round(f)), BigInt(Math.round(t)));
              return `${BigInt(Math.round(f)) / g}/${BigInt(Math.round(t)) / g}`;
            })(),
          },
          { label: 'Decimal', value: fmt(p, 10) },
          { label: 'Odds for', value: `${fmt(f)} : ${fmt(t - f)}` },
          { label: 'Not happening', value: prob(1 - p) },
        ],
      };
    }
    const pa = num(v, v.mode === 'two' ? 'pa' : 'p') / 100;
    if (!(pa >= 0 && pa <= 1))
      return fail('Probabilities must be between 0 and 100 %.');
    if (v.mode === 'two') {
      const pb = num(v, 'pb') / 100;
      if (!(pb >= 0 && pb <= 1))
        return fail('Probabilities must be between 0 and 100 %.');
      return {
        ok: true,
        results: [
          { label: 'A and B', value: prob(pa * pb), primary: true },
          { label: 'A or B (at least one)', value: prob(pa + pb - pa * pb) },
          { label: 'Exactly one of them', value: prob(pa + pb - 2 * pa * pb) },
          { label: 'Neither', value: prob((1 - pa) * (1 - pb)) },
          { label: 'Not A', value: prob(1 - pa) },
          { label: 'Not B', value: prob(1 - pb) },
        ],
        note: 'Assumes A and B are independent — one doesn’t change the chance of the other.',
      };
    }
    const n = num(v, 'n');
    if (!(Number.isInteger(n) && n >= 0 && n <= 100000))
      return fail(
        'The number of tries must be a whole number from 0 to 100,000.',
      );
    if (v.mode === 'atleast') {
      const none = Math.pow(1 - pa, n);
      return {
        ok: true,
        results: [
          { label: 'At least once', value: prob(1 - none), primary: true },
          { label: 'Never', value: prob(none) },
          { label: 'Every time', value: prob(Math.pow(pa, n)) },
          { label: 'Expected number of successes', value: fmt(n * pa, 8) },
        ],
        note: 'Each try is assumed independent with the same chance.',
      };
    }
    const k = num(v, 'k');
    if (!(Number.isInteger(k) && k >= 0 && k <= n))
      return fail('k must be a whole number between 0 and n.');
    if (v.mode === 'combo') {
      if (n > 10000) return fail('For combinations please use n up to 10,000.');
      return {
        ok: true,
        results: [
          {
            label: `Combinations C(${n}, ${k})`,
            value: bigText(nCr(n, k)),
            primary: true,
          },
          { label: `Permutations P(${n}, ${k})`, value: bigText(nPr(n, k)) },
          {
            label: 'Chance of one specific combination',
            value: `1 in ${bigText(nCr(n, k))}`,
          },
        ],
        note: 'Combinations ignore order (a lottery draw); permutations count every order separately (a race podium).',
      };
    }
    let cdf = 0;
    const pmf: number[] = [];
    for (let i = 0; i <= n; i++) {
      const p = binomialPmf(n, i, pa);
      pmf.push(p);
      if (i <= k) cdf += p;
    }
    const exact = pmf[k];
    const table: CalcTable | undefined =
      n <= 200
        ? {
            caption: 'Probability of each number of successes',
            columns: ['Successes', 'Exactly', 'At most'],
            rows: pmf.map((p, i) => [
              String(i),
              prob(p),
              prob(
                Math.min(
                  1,
                  pmf.slice(0, i + 1).reduce((s, x) => s + x, 0),
                ),
              ),
            ]),
          }
        : undefined;
    return {
      ok: true,
      results: [
        { label: `Exactly ${k} of ${n}`, value: prob(exact), primary: true },
        { label: `At most ${k}`, value: prob(Math.min(1, cdf)) },
        { label: `At least ${k}`, value: prob(Math.min(1, 1 - cdf + exact)) },
        { label: 'Mean', value: fmt(n * pa, 8) },
        {
          label: 'Standard deviation',
          value: fmt(Math.sqrt(n * pa * (1 - pa)), 8),
        },
      ],
      table,
      note: 'Binomial distribution: n independent tries, each with the same chance of success.',
    };
  },
};

/* =================================================================== */
/* Roots & exponents                                                    */
/* =================================================================== */

/** Writes ⁿ√x as a·ⁿ√b with b free of nth powers (x a positive integer). */
export function simplifyRadical(
  x: number,
  n: number,
): { outside: number; inside: number } | null {
  if (
    !Number.isInteger(x) ||
    x < 1 ||
    x > 1e12 ||
    !Number.isInteger(n) ||
    n < 2
  )
    return null;
  let outside = 1;
  let inside = x;
  for (let p = 2; p ** n <= inside; p++) {
    const pn = p ** n;
    while (inside % pn === 0) {
      inside /= pn;
      outside *= p;
    }
  }
  return { outside, inside };
}

export function realRoot(x: number, n: number): number {
  if (x < 0 && n % 2 === 1) return -Math.pow(-x, 1 / n);
  const r = Math.pow(x, 1 / n);
  // Snap tiny floating-point errors for perfect powers (e.g. ∛27).
  const rounded = Math.round(r);
  return Math.abs(rounded ** n - x) < 1e-9 * Math.max(1, Math.abs(x))
    ? rounded
    : r;
}

const sup = (n: number) =>
  String(n)
    .split('')
    .map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)] ?? c)
    .join('');
const rootSign = (n: number) =>
  n === 2 ? '√' : n === 3 ? '∛' : n === 4 ? '∜' : `${sup(n)}√`;

const squareRoot: CalculatorDefinition = {
  fields: [
    { id: 'x', label: 'Number', type: 'number', default: '72' },
    {
      id: 'root',
      label: 'Root',
      type: 'select',
      default: '2',
      choices: [
        { value: '2', label: 'Square root (√)' },
        { value: '3', label: 'Cube root (∛)' },
        { value: 'n', label: 'nth root' },
      ],
    },
    {
      id: 'n',
      label: 'n',
      type: 'number',
      default: '4',
      min: 2,
      showIf: { field: 'root', values: ['n'] },
    },
  ],
  compute: (v) => {
    const x = num(v, 'x');
    const n = v.root === 'n' ? num(v, 'n') : Number(v.root);
    if (!Number.isFinite(x)) return fail('Please enter a number.');
    if (!(Number.isInteger(n) && n >= 2 && n <= 100))
      return fail('The root must be a whole number from 2 to 100.');
    const sign = rootSign(n);
    if (x < 0 && n % 2 === 0) {
      const r = realRoot(-x, n);
      return {
        ok: true,
        results: [
          {
            label: `${sign}${fmt(x)}`,
            value: n === 2 ? `${fmt(r, 12)}i` : 'No real root',
            primary: true,
          },
          {
            label: 'Real result',
            value: 'None — even roots of negative numbers are not real numbers',
          },
        ],
        note:
          n === 2
            ? `In complex numbers, √${fmt(x)} = ${fmt(r, 12)}i, because i² = −1.`
            : undefined,
      };
    }
    const r = realRoot(x, n);
    const rad = simplifyRadical(Math.abs(x), n);
    const perfect = Number.isInteger(r);
    const results = [
      {
        label: `${sign}${Number.isInteger(x) ? x.toLocaleString('en-US') : fmt(x)}`,
        value: fmt(r, 14),
        primary: true,
      },
      {
        label: `Perfect ${n === 2 ? 'square' : n === 3 ? 'cube' : `${n}th power`}?`,
        value: perfect ? `Yes — ${fmt(r)}${sup(n)} = ${fmt(x)}` : 'No',
      },
    ];
    if (rad && !perfect && rad.outside > 1)
      results.push({
        label: 'Simplified radical',
        value: `${x < 0 ? '−' : ''}${rad.outside}${sign}${rad.inside}`,
      });
    results.push({
      label: 'Check',
      value: `${fmt(r, 10)}${sup(n)} ≈ ${fmt(Math.pow(r, n), 12)}`,
    });
    return { ok: true, results };
  },
};

export function sci(n: number, digits = 10): string {
  if (n === 0) return '0';
  const [m, e] = n.toExponential(digits).split('e');
  return `${m.replace(/\.?0+$/, '')} × 10^${Number(e)}`;
}

/** Exact integer power with BigInt when it is reasonable to show. */
export function exactPower(base: number, exp: number): string | null {
  if (
    !Number.isInteger(base) ||
    !Number.isInteger(exp) ||
    exp < 0 ||
    exp > 5000
  )
    return null;
  const digitsEstimate = exp * Math.log10(Math.max(2, Math.abs(base)));
  if (digitsEstimate > 3000) return null;
  return (BigInt(base) ** BigInt(exp)).toString();
}

const exponent: CalculatorDefinition = {
  fields: [
    {
      id: 'mode',
      label: 'Solve for',
      type: 'select',
      default: 'power',
      choices: [
        { value: 'power', label: 'Result (aⁿ)' },
        { value: 'exp', label: 'Exponent n (logarithm)' },
        { value: 'base', label: 'Base a (root)' },
      ],
    },
    {
      id: 'a',
      label: 'Base (a)',
      type: 'number',
      default: '2',
      showIf: { field: 'mode', values: ['power', 'exp'] },
    },
    {
      id: 'n',
      label: 'Exponent (n)',
      type: 'number',
      default: '10',
      showIf: { field: 'mode', values: ['power', 'base'] },
    },
    {
      id: 'y',
      label: 'Result (aⁿ)',
      type: 'number',
      default: '1024',
      showIf: { field: 'mode', values: ['exp', 'base'] },
    },
  ],
  compute: (v) => {
    const a = num(v, 'a');
    const n = num(v, 'n');
    const y = num(v, 'y');
    if (v.mode === 'exp') {
      if (!(a > 0) || a === 1 || !(y > 0))
        return fail(
          'The base must be positive and not 1, and the result positive.',
        );
      const e = Math.log(y) / Math.log(a);
      return {
        ok: true,
        results: [
          { label: 'Exponent n', value: fmt(e, 12), primary: true },
          {
            label: 'Written as',
            value: `log${a === 10 ? '' : `₍${fmt(a)}₎`}(${fmt(y)}) = ${fmt(e, 12)}`,
          },
          {
            label: 'Check',
            value: `${fmt(a)}^${fmt(e, 8)} ≈ ${fmt(Math.pow(a, e), 12)}`,
          },
        ],
      };
    }
    if (v.mode === 'base') {
      if (!Number.isFinite(n) || n === 0 || !Number.isFinite(y))
        return fail('Enter a non-zero exponent and a result.');
      if (y < 0 && !(Number.isInteger(n) && Math.abs(n) % 2 === 1))
        return fail('A negative result needs an odd whole-number exponent.');
      const b = y < 0 ? -Math.pow(-y, 1 / n) : Math.pow(y, 1 / n);
      return {
        ok: true,
        results: [
          { label: 'Base a', value: fmt(b, 12), primary: true },
          {
            label: 'Check',
            value: `${fmt(b, 8)}^${fmt(n)} ≈ ${fmt(Math.pow(b, n), 12)}`,
          },
        ],
      };
    }
    if (!Number.isFinite(a) || !Number.isFinite(n))
      return fail('Please enter a base and an exponent.');
    if (a === 0 && n < 0)
      return fail('0 to a negative power is undefined (division by zero).');
    if (a < 0 && !Number.isInteger(n))
      return fail(
        'A negative base with a fractional exponent has no real result.',
      );
    const r = Math.pow(a, n);
    const exact = exactPower(a, n);
    const results = [
      {
        label: `${a < 0 ? `(${fmt(a)})` : fmt(a)}^${fmt(n)}`,
        value:
          exact && exact.length <= 21
            ? exact.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : Number.isFinite(r)
              ? Math.abs(r) >= 1e21 || (Math.abs(r) < 1e-6 && r !== 0)
                ? sci(r)
                : fmt(r, 15)
              : 'Too large to display',
        primary: true,
      },
      ...(Number.isFinite(r) && r !== 0
        ? [{ label: 'Scientific notation', value: sci(r) }]
        : []),
    ];
    if (exact && exact.length > 21 && exact.length <= 80)
      results.push({
        label: `Exact value (${exact.length} digits)`,
        value: exact.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    else if (exact && exact.length > 80)
      results.push({
        label: 'Exact value',
        value: `${exact.length.toLocaleString('en-US')} digits: ${exact.slice(0, 30)}…${exact.slice(-10)}`,
      });
    if (n < 0)
      results.push({
        label: 'As a fraction',
        value: `1 / ${fmt(a)}^${fmt(-n)}`,
      });
    if (!Number.isInteger(n) && a > 0)
      results.push({
        label: 'As a root',
        value: `${fmt(n)} = fractional exponent; a^(p/q) = q-th root of a^p`,
      });
    return { ok: true, results };
  },
};

/* =================================================================== */

export const MORE_CALCULATORS: Record<string, CalculatorDefinition> = {
  mortgage,
  salary,
  fraction,
  ratio,
  aspect,
  'body-fat': bodyFat,
  'ideal-weight': idealWeight,
  margin,
  roi,
  'savings-goal': savingsGoal,
  retirement,
  'unit-price': unitPrice,
  probability,
  'square-root': squareRoot,
  exponent,
};
