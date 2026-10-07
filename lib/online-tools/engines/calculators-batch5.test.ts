import { describe, expect, it } from 'vitest';
import { CALCULATORS, initialValues } from './calculators';
import {
  binomialPmf,
  cagr,
  depositForGoal,
  exactPower,
  fractionOp,
  futureValue,
  idealWeights,
  mixedText,
  mortgagePayment,
  nCr,
  nPr,
  navyBodyFat,
  nearestNamedRatio,
  parseFraction,
  realRoot,
  simplifyRadical,
  simplifyRatio,
} from './calculators-more';

const run = (id: string, patch: Record<string, string> = {}) => {
  const def = CALCULATORS[id];
  const out = def.compute({
    ...initialValues(def, new Date('2026-10-07T12:00:00Z')),
    ...patch,
  });
  if (!out.ok) throw new Error(`${id}: ${out.error}`);
  const get = (label: string | RegExp) =>
    out.results.find((r) =>
      typeof label === 'string' ? r.label === label : label.test(r.label),
    )?.value;
  return { out, get, primary: out.results.find((r) => r.primary)?.value };
};
const errorOf = (id: string, patch: Record<string, string>) => {
  const def = CALCULATORS[id];
  const out = def.compute({ ...initialValues(def), ...patch });
  return out.ok ? null : out.error;
};

describe('every new calculator works with its defaults', () => {
  for (const id of [
    'mortgage',
    'salary',
    'fraction',
    'ratio',
    'aspect',
    'body-fat',
    'ideal-weight',
    'margin',
    'roi',
    'savings-goal',
    'retirement',
    'unit-price',
    'probability',
    'square-root',
    'exponent',
  ])
    it(id, () => expect(run(id).primary).toBeTruthy());
});

describe('mortgage', () => {
  it('matches the standard payment formula', () => {
    expect(mortgagePayment(320000, 6.5, 360)).toBeCloseTo(2022.62, 2);
    const { get } = run('mortgage');
    expect(get('Principal & interest')).toBe('2,022.62');
    expect(get('PMI')).toMatch(/None/);
    expect(get('Loan amount')).toBe('320,000.00');
  });

  it('charges PMI until 20 % equity and shortens the loan with extra payments', () => {
    const { get } = run('mortgage', { downPct: '10' });
    expect(get('PMI')).toMatch(/^150\.00 \/ month for \d+ months$/);
    const months = Number(/for (\d+) months/.exec(get('PMI')!)![1]);
    expect(months).toBeGreaterThan(60);
    expect(months).toBeLessThan(180);
    const extra = run('mortgage', { extra: '300' });
    expect(
      Number(extra.get('Time saved by extra payments')!.split(' ')[0]),
    ).toBeGreaterThan(60);
  });
});

describe('salary', () => {
  it('converts salary to hourly and back', () => {
    expect(run('salary').primary).toBe('28.85');
    const back = run('salary', { amount: '28.846153846', period: 'hour' });
    expect(back.primary).toBe('60,000.00');
  });
});

describe('fractions', () => {
  it('parses mixed numbers, decimals and negatives', () => {
    expect(parseFraction('-2 3/8')).toEqual({ n: BigInt(-19), d: BigInt(8) });
    expect(parseFraction('0.75')).toEqual({ n: BigInt(75), d: BigInt(100) });
    expect(parseFraction('1/0')).toBeNull();
    expect(parseFraction('abc')).toBeNull();
  });

  it('adds, divides and simplifies with steps', () => {
    const r = fractionOp(parseFraction('1 1/2')!, '+', parseFraction('3/4')!);
    expect(r.result).toEqual({ n: BigInt(9), d: BigInt(4) });
    expect(mixedText(r.result)).toBe('2 1/4');
    expect(r.steps.some((s) => /Common denominator 4/.test(s))).toBe(true);
    const d = fractionOp(parseFraction('2/3')!, '÷', parseFraction('4/9')!);
    expect(d.result).toEqual({ n: BigInt(3), d: BigInt(2) });
    expect(run('fraction').get('Decimal')).toBe('2.25');
    expect(errorOf('fraction', { op: '÷', b: '0' })).toMatch(/divide by zero/);
  });
});

describe('ratio and aspect ratio', () => {
  it('solves proportions and simplifies', () => {
    expect(run('ratio').primary).toBe('12');
    expect(simplifyRatio(1.5, 2)).toEqual([3, 4]);
    expect(run('ratio', { mode: 'share' }).primary).toBe('300 and 400');
    expect(errorOf('ratio', { d: '5' })).toMatch(/leave one empty/);
  });

  it('names aspect ratios and resizes', () => {
    expect(simplifyRatio(1920, 1080)).toEqual([16, 9]);
    expect(nearestNamedRatio(2560 / 1080).name).toMatch(/21:9/);
    const { primary, get } = run('aspect', { nw: '1280' });
    expect(primary).toBe('16:9');
    expect(get(/^Height for 1,?280 wide$/)).toMatch(/^720 px/);
  });
});

describe('body fat and ideal weight', () => {
  it('matches the U.S. Navy formula', () => {
    expect(navyBodyFat('male', 177.8, 38.1, 86.36)).toBeCloseTo(17.4, 0);
    expect(run('body-fat').primary).toMatch(/%$/);
    expect(errorOf('body-fat', { waistMetric: '30' })).toMatch(
      /larger than the neck/,
    );
    // Imperial fields have their own defaults (70 in, 15 in, 34 in).
    expect(run('body-fat', { units: 'imperial' }).primary).toBe('17.4 %');
    expect(run('ideal-weight', { units: 'imperial' }).primary).toMatch(/lb$/);
  });

  it('computes formula weights', () => {
    expect(idealWeights('male', 180).Devine).toBeCloseTo(74.99, 1);
    expect(idealWeights('female', 165).Devine).toBeCloseTo(56.91, 1);
  });
});

describe('margin, markup and ROI', () => {
  it('keeps margin and markup consistent', () => {
    const a = run('margin');
    expect(a.primary).toBe('40%');
    expect(a.get('Markup')).toMatch(/^66\.66/);
    expect(run('margin', { mode: 'cost-markup' }).primary).toBe('90.00');
    expect(run('margin', { mode: 'cost-margin' }).primary).toBe('100.00');
    expect(errorOf('margin', { mode: 'cost-margin', margin: '100' })).toMatch(
      /below 100/,
    );
  });

  it('annualizes ROI', () => {
    expect(cagr(10000, 14500, 3)).toBeCloseTo(13.19, 2);
    expect(run('roi').primary).toBe('45%');
  });
});

describe('savings and retirement', () => {
  it('future value and required deposits round-trip', () => {
    expect(futureValue(0, 100, 0, 12)).toBe(1200);
    expect(futureValue(1000, 0, 12, 12)).toBeCloseTo(1126.83, 2);
    const dep = depositForGoal(20000, 2000, 4, 36);
    expect(futureValue(2000, dep, 4, 36)).toBeCloseTo(20000, 6);
    expect(run('savings-goal', { mode: 'time' }).primary).toMatch(
      /^\d+ years \d+ months$/,
    );
  });

  it('projects retirement savings', () => {
    const { primary, get } = run('retirement');
    const expected = futureValue(50000, 500, 6, 32 * 12);
    expect(primary).toBe(
      expected.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
    expect(get(/^Wanted income/)).toMatch(/Runs out|Lasts beyond/);
    expect(errorOf('retirement', { retire: '30' })).toMatch(
      /Ages must increase/,
    );
  });
});

describe('unit price', () => {
  it('finds the cheapest across units', () => {
    const { primary } = run('unit-price');
    expect(primary).toBe('Product 2 — 0.599 per 100 g');
    expect(errorOf('unit-price', { unit2: 'l' })).toMatch(/like with like/);
    expect(run('unit-price', { price3: '2.00' }).out).toMatchObject({
      note: expect.stringMatching(/Product 3 skipped/),
    });
  });
});

describe('probability', () => {
  it('computes combinatorics and binomials exactly', () => {
    expect(nCr(52, 5)).toBe(BigInt(2598960));
    expect(nPr(5, 2)).toBe(BigInt(20));
    expect(binomialPmf(10, 3, 0.5)).toBeCloseTo(120 / 1024, 12);
    expect(run('probability').primary).toBe('16.666667 %');
    expect(
      run('probability', { mode: 'atleast', p: '10', n: '10' }).primary,
    ).toBe('65.132156 %');
    expect(run('probability', { mode: 'combo', n: '52', k: '5' }).primary).toBe(
      '2,598,960',
    );
  });
});

describe('roots and exponents', () => {
  it('simplifies radicals and snaps perfect powers', () => {
    expect(simplifyRadical(72, 2)).toEqual({ outside: 6, inside: 2 });
    expect(simplifyRadical(54, 3)).toEqual({ outside: 3, inside: 2 });
    expect(realRoot(27, 3)).toBe(3);
    expect(realRoot(-8, 3)).toBe(-2);
    expect(run('square-root').get('Simplified radical')).toBe('6√2');
    expect(run('square-root', { x: '-9' }).primary).toBe('3i');
  });

  it('computes powers, logs and roots', () => {
    expect(run('exponent').primary).toBe('1,024');
    expect(exactPower(2, 100)).toBe('1267650600228229401496703205376');
    expect(run('exponent', { n: '100' }).get('Exact value (31 digits)')).toBe(
      '1,267,650,600,228,229,401,496,703,205,376',
    );
    expect(run('exponent', { a: '-2', n: '2' }).out.results[0].label).toBe(
      '(-2)^2',
    );
    expect(run('exponent', { mode: 'exp' }).primary).toBe('10');
    expect(run('exponent', { mode: 'base', n: '10', y: '1024' }).primary).toBe(
      '2',
    );
    expect(errorOf('exponent', { a: '-8', n: '0.5' })).toMatch(
      /no real result/,
    );
  });
});
