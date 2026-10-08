import { describe, expect, it } from 'vitest';
import COUNTRIES from '../data/countries.json';
import ENTITIES from '../data/html-entities.json';
import { ELEMENTS } from '../data/elements';
import { MATH_SYMBOLS } from '../data/math-symbols';
import { SHORTCUTS } from '../data/keyboard-shortcuts';
import { BLOCKS } from '../data/unicode-blocks';
import { ASCII, searchAscii } from './ascii';
import { brailleToText, textToBraille } from './braille';
import { balancesOxidation, molarMass, parseFormula } from './chemistry';
import { deltaE2000, nearestColors, rgbToLab } from './color-names';
import { DEFAULT_CONTEXT, fromPx, toPx } from './css-units';
import {
  HTTP_STATUSES,
  HTTP_STATUS_ISSUES,
  searchStatuses,
} from './http-status';
import { decompositionText, formatInBase, parseInBase } from './number-system';
import { fromRoman } from './number-words';
import { morseToText, textToMorse } from './text';
import { isDst, standardOffset, subsolarPoint } from './timezones';
import {
  blockOf,
  charInfo,
  parseNameDb,
  searchUnicode,
  utf16Units,
  utf8Bytes,
} from './unicode';

describe('molar mass', () => {
  const mass = (f: string) => Math.round(molarMass(f).molarMass * 1000) / 1000;
  it('calculates common compounds', () => {
    expect(mass('H2O')).toBeCloseTo(18.015, 3);
    expect(mass('CO2')).toBeCloseTo(44.009, 3);
    expect(mass('NaCl')).toBeCloseTo(58.44, 2);
    expect(mass('H2SO4')).toBeCloseTo(98.072, 2);
    expect(mass('C6H12O6')).toBeCloseTo(180.156, 2);
  });
  it('handles brackets, nesting, hydrates and subscripts', () => {
    expect(mass('Ca(OH)2')).toBeCloseTo(74.092, 2);
    expect(mass('K4[Fe(CN)6]')).toBeCloseTo(368.35, 1);
    expect(mass('CuSO4·5H2O')).toBeCloseTo(249.68, 1);
    expect(mass('CuSO4*5H2O')).toBe(mass('CuSO4·5H2O'));
    expect(mass('H₂O')).toBe(mass('H2O'));
    expect([...parseFormula('Ca(OH)2').counts]).toEqual([
      ['Ca', 1],
      ['O', 2],
      ['H', 2],
    ]);
  });
  it('gives a percentage breakdown that sums to 100', () => {
    const r = molarMass('H2O');
    expect(r.rows.reduce((n, x) => n + x.percent, 0)).toBeCloseTo(100, 6);
    expect(r.rows.find((x) => x.symbol === 'O')!.percent).toBeCloseTo(88.81, 1);
  });
  it('ignores a charge with a note', () => {
    const r = molarMass('SO4^2-');
    expect(r.molarMass).toBeCloseTo(96.06, 1);
    expect(r.notes.join(' ')).toMatch(/charge/);
  });
  it('rejects invalid formulas with clear messages', () => {
    expect(() => molarMass('Xx2')).toThrow(/not an element/);
    expect(() => molarMass('Ca(OH2')).toThrow(/closing/);
    expect(() => molarMass('CaOH)2')).toThrow(/Unexpected/);
    expect(() => molarMass('h2o')).toThrow(/capital/);
    expect(() => molarMass('')).toThrow();
  });
  it('flags formulas that look incomplete', () => {
    expect(molarMass('H2SO').warning).toMatch(/incomplete/);
    for (const ok of [
      'H2O',
      'H2O2',
      'Fe3O4',
      'C2H6',
      'NaCl',
      'KMnO4',
      'C6H12O6',
      'O2',
    ])
      expect(balancesOxidation(parseFormula(ok).counts), ok).toBe(true);
  });
});

describe('number systems', () => {
  it('converts 255 to every base', () => {
    const v = parseInBase('255', 10).value;
    expect(formatInBase(v, 2)).toBe('11111111');
    expect(formatInBase(v, 8)).toBe('377');
    expect(formatInBase(v, 16, { upper: true })).toBe('FF');
    expect(formatInBase(v, 36)).toBe('73');
    expect(decompositionText(v, 16)).toBe('255 = 15×16¹ + 15×16⁰');
  });
  it('detects prefixes and keeps huge values exact', () => {
    expect(parseInBase('0xff', 0)).toMatchObject({ base: 16 });
    expect(parseInBase('0b1010', 0).value.toString()).toBe('10');
    const big = parseInBase('1'.repeat(80), 2).value;
    expect(formatInBase(big, 2)).toBe('1'.repeat(80));
    expect(formatInBase(parseInBase('-ff', 16).value, 10)).toBe('-255');
  });
  it('explains invalid digits', () => {
    expect(() => parseInBase('102', 2)).toThrow(
      /102 is not a valid binary number/,
    );
    expect(() => parseInBase('1.5', 10)).toThrow(/whole numbers/);
  });
  it('groups digits', () => {
    expect(formatInBase(parseInBase('255', 10).value, 2, { group: true })).toBe(
      '1111 1111',
    );
    expect(
      formatInBase(parseInBase('1234567', 10).value, 10, { group: true }),
    ).toBe('1,234,567');
  });
});

describe('braille and morse', () => {
  it('translates text to grade 1 braille and back', () => {
    const { output } = textToBraille('Hello, World 2026!');
    expect(output.startsWith('⠠⠓⠑⠇⠇⠕⠂')).toBe(true);
    expect(output).toContain('⠼⠃⠚⠃⠋');
    expect(brailleToText(output)).toBe('Hello, World 2026!');
  });
  it('uses the letter sign after a number', () => {
    const { output } = textToBraille('2a');
    expect(output).toBe('⠼⠃⠰⠁');
    expect(brailleToText(output)).toBe('2a');
  });
  it('reports unsupported characters', () => {
    expect(textToBraille('a€').unsupported).toEqual(['€']);
  });
  it('round-trips Morse', () => {
    expect(textToMorse('HELLO')).toBe('.... . .-.. .-.. ---');
    expect(morseToText(textToMorse('SOS 123'))).toBe('SOS 123');
  });
  it('rejects IIIIIIII as a Roman numeral', () => {
    expect(() => fromRoman('IIIIIIII')).toThrow(/Invalid Roman numeral/);
  });
});

describe('unicode', () => {
  it('encodes UTF-8 and UTF-16', () => {
    expect(utf8Bytes(0xe9)).toEqual([0xc3, 0xa9]);
    expect(utf8Bytes(0x1f600)).toEqual([0xf0, 0x9f, 0x98, 0x80]);
    expect(utf16Units(0x1f600)).toEqual([0xd83d, 0xde00]);
  });
  it('finds blocks and computed names', () => {
    expect(blockOf(0x41)?.name).toBe('Basic Latin');
    expect(blockOf(0x2190)?.name).toBe('Arrows');
    expect(charInfo(0x4e00, null).name).toBe('CJK UNIFIED IDEOGRAPH-4E00');
    expect(charInfo(0xac00, null).name).toBe('HANGUL SYLLABLE GA');
    expect(charInfo(0xd55c, null).name).toBe('HANGUL SYLLABLE HAN');
    expect(BLOCKS.length).toBeGreaterThan(300);
  });
  it('parses the compact names file and searches it', () => {
    const db = parseNameDb(
      '42|latin capital letter a|Lu\n|latin capital letter b\n25c1|snowman|So\n',
    );
    expect(charInfo(0x41, db)).toMatchObject({
      name: 'LATIN CAPITAL LETTER A',
      gc: 'Lu',
    });
    expect(charInfo(0x42, db).gc).toBe('Lu');
    expect(searchUnicode('snowman', db)).toMatchObject({ cps: [0x2603] });
    expect(searchUnicode('U+00E9', db)).toMatchObject({ cps: [0xe9] });
    expect(searchUnicode('é', db)).toMatchObject({ cps: [0xe9] });
    expect(searchUnicode('Arrows', db).kind).toBe('block');
  });
});

describe('colours and CSS units', () => {
  it('names colours', () => {
    expect(nearestColors({ r: 255, g: 0, b: 0 }, 1, 'css')[0].name).toBe('red');
    expect(nearestColors({ r: 102, g: 51, b: 153 }, 1, 'css')[0].name).toBe(
      'rebeccapurple',
    );
    const lab = rgbToLab({ r: 10, g: 20, b: 30 });
    expect(deltaE2000(lab, lab)).toBe(0);
  });
  it('converts CSS units', () => {
    const c = { ...DEFAULT_CONTEXT, viewportWidth: 1200, viewportHeight: 800 };
    expect(toPx(10, 'rem', c)).toBe(160);
    expect(toPx(50, 'vw', c)).toBe(600);
    expect(toPx(10, 'vmin', c)).toBe(80);
    expect(toPx(72, 'pt', c)).toBe(96);
    expect(fromPx(160, 'rem', c)).toBe(10);
  });
});

describe('time zones', () => {
  it('detects daylight saving', () => {
    expect(isDst('Europe/Berlin', new Date('2026-07-01T12:00:00Z'))).toBe(true);
    expect(isDst('Europe/Berlin', new Date('2026-01-15T12:00:00Z'))).toBe(
      false,
    );
    expect(isDst('Asia/Tokyo', new Date('2026-07-01T12:00:00Z'))).toBe(false);
    expect(standardOffset('America/New_York', 2026)).toBe(-300);
  });
  it('puts the sun over the right latitude', () => {
    expect(subsolarPoint(new Date('2026-06-21T12:00:00Z')).lat).toBeCloseTo(
      23.4,
      0,
    );
    expect(
      Math.abs(subsolarPoint(new Date('2026-03-20T12:00:00Z')).lon),
    ).toBeLessThan(5);
  });
});

describe('reference data integrity', () => {
  it('has 118 well-formed elements', () => {
    expect(ELEMENTS).toHaveLength(118);
    expect(new Set(ELEMENTS.map((e) => e.s)).size).toBe(118);
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1));
    expect(ELEMENTS.find((e) => e.s === 'Fe')).toMatchObject({
      p: 4,
      g: 8,
      b: 'd',
    });
    expect(
      ELEMENTS.filter((e) => e.st === 'liquid')
        .map((e) => e.s)
        .sort(),
    ).toEqual(['Br', 'Hg']);
  });
  it('has unique country codes and complete key fields', () => {
    const list = COUNTRIES as {
      a2: string;
      a3: string;
      n: string;
      ct: string;
    }[];
    expect(list.length).toBeGreaterThan(240);
    expect(new Set(list.map((c) => c.a2)).size).toBe(list.length);
    expect(new Set(list.map((c) => c.a3)).size).toBe(list.length);
    list.forEach((c) => expect(c.n && c.ct, c.a2).toBeTruthy());
  });
  it('has entities that decode to their character', () => {
    const list = ENTITIES as [string, string[], string][];
    const copy = list.find(([c]) => c === '©')!;
    expect(copy[1]).toContain('copy');
    expect(new Set(list.map(([c]) => c)).size).toBe(list.length);
  });
  it('has math symbols and shortcuts', () => {
    expect(MATH_SYMBOLS.find((m) => m.char === '∑')?.latex).toBe('\\sum');
    const copy = SHORTCUTS.find((s) => s.action.toLowerCase() === 'copy');
    expect(copy?.keys).toMatchObject({ windows: 'Ctrl + C', macos: 'Cmd + C' });
  });
  it('labels ASCII control characters', () => {
    expect(ASCII[10]).toMatchObject({ abbr: 'LF', control: true, hex: '0A' });
    expect(ASCII[127].abbr).toBe('DEL');
    expect(searchAscii('0x41')[0].char).toBe('A');
    expect(searchAscii('esc')[0].dec).toBe(27);
  });
  it('has consistent HTTP status data', () => {
    expect(HTTP_STATUS_ISSUES).toEqual([]);
    expect(HTTP_STATUSES.find((s) => s.code === 404)?.common).toBe(true);
    expect(searchStatuses('', 0, true).every((s) => s.common)).toBe(true);
  });
});

describe('braille capitals after numbers', () => {
  it('lets the capital sign end number mode', () => {
    const { output } = textToBraille('2B');
    expect(output).toBe('⠼⠃⠠⠃');
    expect(brailleToText(output)).toBe('2B');
  });
});
