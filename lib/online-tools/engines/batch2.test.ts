import { describe, expect, it } from 'vitest';
import { fitToSize, parseSize } from '../image/fit-size';
import { CALCULATORS, initialValues } from './calculators';
import { ToolInputError } from './data';
import { evaluate, formatResult } from './expression';
import { FANCY_STYLES, toFancy } from './fancy-text';
import {
  computeGpa,
  finalNeeded,
  flipCoin,
  formatCountdown,
  formatStopwatch,
  letterFor,
  parseDice,
  rollDice,
  weightedGrade,
  wheelRotation,
} from './games';
import { jsonToTypeScript } from './json-to-ts';
import { fromRoman, numberToWords, toRoman } from './number-words';
import { TRANSFORMS } from './transforms';

describe('fancy text', () => {
  it('maps letters and digits per style', () => {
    expect(toFancy('Abc 1', 'bold')).toBe('𝐀𝐛𝐜 𝟏');
    expect(toFancy('hello', 'italic')).toBe('ℎ𝑒𝑙𝑙𝑜');
    expect(toFancy('Hi', 'double-struck')).toBe('ℍ𝕚');
    expect(toFancy('abc', 'circled')).toBe('ⓐⓑⓒ');
    expect(toFancy('Hi!', 'full-width')).toBe('Ｈｉ！');
    expect(toFancy('hello', 'small-caps')).toBe('ʜᴇʟʟᴏ');
    expect(toFancy('abc', 'upside-down')).toBe('ɔqɐ');
    expect(toFancy('a b', 'strikethrough')).toBe('a̶ b̶');
  });
  it('keeps unsupported characters and every style is lossless for punctuation', () => {
    for (const s of FANCY_STYLES) {
      const out = toFancy('é', s.id);
      expect(out.length, s.id).toBeGreaterThan(0);
    }
    expect(toFancy('ü?', 'bold')).toBe('ü?');
  });
});

describe('JSON → TypeScript', () => {
  it('infers nested interfaces, optional fields and unions', () => {
    const out = jsonToTypeScript(
      '{"id":1,"tags":["a"],"owner":{"name":"Ada"},"items":[{"sku":"x","qty":1},{"sku":"y","note":"gift"}],"misc":[1,"a"],"nothing":null}',
    );
    expect(out).toContain('export interface Root {');
    expect(out).toContain('  id: number;');
    expect(out).toContain('  tags: string[];');
    expect(out).toContain('  owner: Owner;');
    expect(out).toContain('  items: Item[];');
    expect(out).toContain('  qty?: number;');
    expect(out).toContain('  note?: string;');
    expect(out).toContain('  misc: (number | string)[];');
    expect(out).toContain('  nothing: null;');
    expect(out.indexOf('interface Root')).toBeLessThan(
      out.indexOf('interface Owner'),
    );
  });
  it('handles arrays at the root, odd keys and type aliases', () => {
    const out = jsonToTypeScript('[{"first-name":"A"}]', {
      rootName: 'users',
      useType: true,
      readonly: true,
    });
    expect(out).toContain('export type UsersItem = {');
    expect(out).toContain('  readonly "first-name": string;');
    expect(out).toContain('export type Users = UsersItem[];');
    expect(() => jsonToTypeScript('{oops}')).toThrow(ToolInputError);
  });
});

describe('SQL formatter transform', () => {
  it('formats with uppercase keywords', async () => {
    const out = await TRANSFORMS['sql-format'].run(
      'select a, b from t where a = 1',
      { language: 'sql', keywordCase: 'upper', indent: '2' },
    );
    expect(out).toBe('SELECT\n  a,\n  b\nFROM\n  t\nWHERE\n  a = 1');
  });
});

describe('number to words & Roman numerals', () => {
  it('writes cardinal, ordinal and cheque forms', () => {
    expect(numberToWords('0')).toBe('zero');
    expect(numberToWords('1,234')).toBe('one thousand two hundred thirty-four');
    expect(numberToWords('1234', { and: true })).toBe(
      'one thousand two hundred and thirty-four',
    );
    expect(numberToWords('1005', { and: true })).toBe('one thousand and five');
    expect(numberToWords('-12.05')).toBe('minus twelve point zero five');
    expect(numberToWords('1000000000000')).toBe('one trillion');
    expect(numberToWords('21', { mode: 'ordinal' })).toBe('twenty-first');
    expect(numberToWords('112', { mode: 'ordinal' })).toBe(
      'one hundred twelfth',
    );
    expect(numberToWords('40', { mode: 'ordinal' })).toBe('fortieth');
    expect(numberToWords('1250.5', { mode: 'cheque' })).toBe(
      'One thousand two hundred fifty dollars and 50/100 (50 cents)',
    );
    expect(() => numberToWords('12abc')).toThrow(ToolInputError);
  });
  it('converts Roman numerals both ways and rejects non-canonical forms', () => {
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(fromRoman('mmxxvi')).toBe(2026);
    expect(() => fromRoman('IIII')).toThrow(/did you mean IV/);
    expect(() => fromRoman('ABC')).toThrow(ToolInputError);
    expect(() => toRoman(0)).toThrow(ToolInputError);
    for (let n = 1; n <= 3999; n += 7) expect(fromRoman(toRoman(n))).toBe(n);
  });
});

describe('scientific expression evaluator', () => {
  it('respects precedence, associativity and unary minus', () => {
    expect(evaluate('2 + 3 * 4')).toBe(14);
    expect(evaluate('2^3^2')).toBe(512);
    expect(evaluate('-2^2')).toBe(-4);
    expect(evaluate('2^-1')).toBe(0.5);
    expect(evaluate('(1+2)(3+4)')).toBe(21);
    expect(evaluate('2pi')).toBeCloseTo(2 * Math.PI);
    expect(evaluate('7 mod 3')).toBe(1);
    expect(evaluate('5!')).toBe(120);
    expect(evaluate('200 * 10%')).toBe(20);
    expect(evaluate('ans * 2', 'deg', 21)).toBe(42);
  });
  it('supports functions in degrees and radians', () => {
    expect(evaluate('sin(30)')).toBeCloseTo(0.5, 12);
    expect(evaluate('sin(180)')).toBe(0);
    expect(evaluate('cos(pi)', 'rad')).toBeCloseTo(-1, 12);
    expect(evaluate('sqrt(16) + log(1000) + ln(e)')).toBe(8);
    expect(evaluate('max(3, 9, 4)')).toBe(9);
    expect(evaluate('nroot(27, 3)')).toBeCloseTo(3, 12);
    expect(evaluate('√(81)')).toBe(9);
  });
  it('reports friendly errors', () => {
    expect(() => evaluate('1/0')).toThrow(/Division by zero/);
    expect(() => evaluate('(1+2')).toThrow(/parentheses/);
    expect(() => evaluate('sqrt(-4)')).toThrow(/negative/);
    expect(() => evaluate('foo(2)')).toThrow(/Unknown function/);
    expect(() => evaluate('2 +')).toThrow(/incomplete/);
    expect(() => evaluate('tan(90)')).toThrow(/undefined/);
    expect(() => evaluate('alert(1)')).toThrow(ToolInputError);
  });
  it('formats results', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3');
    expect(formatResult(1e20)).toBe('1e+20');
    expect(formatResult(Infinity)).toBe('∞');
  });
});

describe('dice, coins, wheel and grades', () => {
  const seq = (...vals: number[]) => {
    let i = 0;
    return (buf: Uint32Array) => {
      buf[0] = vals[i++ % vals.length];
      return buf;
    };
  };
  it('parses and rolls dice notation', () => {
    expect(parseDice('d20')).toMatchObject({
      count: 1,
      sides: 20,
      modifier: 0,
    });
    expect(parseDice('4d6kh3')).toMatchObject({
      count: 4,
      sides: 6,
      keep: { mode: 'h', n: 3 },
    });
    expect(parseDice('2d%')).toMatchObject({ sides: 100 });
    const r = rollDice('4d6kh3+2', seq(0, 5, 2, 1)); // faces 1,6,3,2
    expect(r.rolls).toEqual([1, 6, 3, 2]);
    expect(r.kept).toEqual([6, 3, 2]);
    expect(r.total).toBe(13);
    expect(() => parseDice('2x6')).toThrow(ToolInputError);
    expect(() => parseDice('500d6')).toThrow(/1 and 100/);
  });
  it('flips coins fairly', () => {
    let heads = 0;
    for (let i = 0; i < 4000; i++) if (flipCoin() === 'heads') heads++;
    expect(heads).toBeGreaterThan(1800);
    expect(heads).toBeLessThan(2200);
  });
  it('lands the wheel on the chosen segment', () => {
    for (let n = 2; n <= 12; n++) {
      for (let i = 0; i < n; i++) {
        const rot = wheelRotation(i, n, 123);
        const pointerAngle = (((360 - (rot % 360)) % 360) + 360) % 360;
        expect(Math.floor(pointerAngle / (360 / n))).toBe(i);
        expect(rot).toBeGreaterThan(123);
      }
    }
  });
  it('computes GPA and grades', () => {
    const g = computeGpa([
      { grade: 'A', credits: 3 },
      { grade: 'B+', credits: 4 },
      { grade: 'C', credits: 2 },
    ]);
    expect(g.gpa).toBeCloseTo((12 + 13.2 + 4) / 9, 10);
    expect(
      computeGpa([{ grade: 'A', credits: 3 }], { gpa: 3, credits: 30 }).gpa,
    ).toBeCloseTo((90 + 12) / 33, 10);
    expect(
      weightedGrade([
        { score: 90, weight: 20 },
        { score: 80, weight: 30 },
      ]).grade,
    ).toBeCloseTo(84);
    expect(finalNeeded(84, 90, 40)).toBeCloseTo(99);
    expect(letterFor(89.9)).toBe('B+');
  });
  it('formats stopwatch and countdown times', () => {
    expect(formatStopwatch(65_430)).toBe('01:05.43');
    expect(formatStopwatch(3_725_120)).toBe('1:02:05.12');
    expect(formatCountdown(1_500_000)).toBe('25:00');
    expect(formatCountdown(59_001)).toBe('01:00');
    expect(formatCountdown(3_600_000)).toBe('1:00:00');
  });
});

describe('fit to size', () => {
  // Fake encoder: size grows with quality and with scale².
  const fake =
    (base: number) =>
    async ({ quality, scale }: { quality: number; scale: number }) =>
      new Blob([
        new Uint8Array(Math.round(base * scale * scale * (0.2 + quality))),
      ]);

  it('finds the highest quality under the budget', async () => {
    const r = await fitToSize(fake(100_000), 50_000);
    expect(r.fits).toBe(true);
    expect(r.blob.size).toBeLessThanOrEqual(50_000);
    expect(r.scale).toBe(1);
    expect(r.quality).toBeGreaterThan(0.28);
    expect(r.quality).toBeLessThan(0.31);
  });
  it('shrinks dimensions when quality alone is not enough', async () => {
    const r = await fitToSize(fake(1_000_000), 20_480);
    expect(r.fits).toBe(true);
    expect(r.blob.size).toBeLessThanOrEqual(20_480);
    expect(r.scale).toBeLessThan(1);
  });
  it('parses size inputs', () => {
    expect(parseSize('20')).toBe(20_480);
    expect(parseSize('1.5 MB')).toBe(1_572_864);
    expect(parseSize('100kb')).toBe(102_400);
    expect(parseSize('abc')).toBeNull();
  });
});

describe('new calculators', () => {
  const run = (id: string, v: Record<string, string>) => {
    const def = CALCULATORS[id];
    const out = def.compute({
      ...initialValues(def, new Date('2026-10-07T12:00:00Z')),
      ...v,
    });
    return out.ok ? out.results.find((r) => r.primary)?.value : out.error;
  };
  it('calorie targets', () => {
    // BMR female 70kg 170cm 32y = 700 + 1062.5 - 160 - 161 = 1441.5; ×1.375 = 1982.06; −550/day.
    expect(
      run('calorie', {
        sex: 'female',
        age: '32',
        weight: '70',
        height: '170',
        activity: '1.375',
        goal: '-0.5',
      }),
    ).toBe('1,432 kcal/day');
    expect(
      run('calorie', {
        sex: 'female',
        age: '60',
        weight: '45',
        height: '150',
        activity: '1.2',
        goal: '-1',
      }),
    ).toBe('1,200 kcal/day');
  });
  it('due date', () => {
    expect(
      run('due-date', {
        method: 'lmp',
        date: '2026-01-01',
        cycle: '28',
        today: '2026-03-01',
      }),
    ).toBe('Thursday, October 8, 2026');
    expect(
      run('due-date', {
        method: 'lmp',
        date: '2026-01-01',
        cycle: '32',
        today: '2026-03-01',
      }),
    ).toBe('Monday, October 12, 2026');
    expect(
      run('due-date', {
        method: 'conception',
        date: '2026-01-15',
        today: '2026-03-01',
      }),
    ).toBe('Thursday, October 8, 2026');
    expect(
      run('due-date', {
        method: 'ivf5',
        date: '2026-01-20',
        today: '2026-03-01',
      }),
    ).toBe('Thursday, October 8, 2026');
  });
  it('ovulation', () => {
    expect(
      run('ovulation', { lmp: '2026-10-01', cycle: '28', luteal: '14' }),
    ).toBe('Thursday, October 15, 2026');
    expect(
      run('ovulation', { lmp: '2026-10-01', cycle: '50', luteal: '14' }),
    ).toMatch(/between 20 and 45/);
  });
});

describe('batch 2 regressions', () => {
  it('evaluates a typed √ without parentheses', () => {
    expect(evaluate('√16', 'deg', 0)).toBe(4);
    expect(evaluate('2√9', 'deg', 0)).toBe(6);
    expect(evaluate('√(9+16)', 'deg', 0)).toBe(5);
  });

  it('writes cheque cents with two digits', () => {
    expect(numberToWords('105.07', { mode: 'cheque' })).toBe(
      'One hundred five dollars and 07/100 (7 cents)',
    );
    expect(numberToWords('45', { mode: 'cheque' })).toBe(
      'Forty-five dollars and 00/100 (0 cents)',
    );
  });

  it('singularises -es plurals for array item names', () => {
    const ts = jsonToTypeScript('{"addresses":[{"a":1}],"boxes":[{"b":1}]}', {
      rootName: 'Root',
      useType: false,
      readonly: false,
    });
    expect(ts).toContain('interface Address ');
    expect(ts).toContain('interface Box ');
  });
});
