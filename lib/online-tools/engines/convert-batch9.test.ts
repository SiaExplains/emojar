import { describe, expect, it } from 'vitest';
import { convertUnit } from './units';
import { convertCooking, kitchenFraction } from './cooking';
import {
  CLOTHING_TABLES,
  SHOE_TABLES,
  findRow,
  rowForMeasurement,
} from './sizes';
import { bytesToText, textToBytes } from './dev-tools';
import { TRANSFORMS } from './transforms';

describe('power and torque', () => {
  it('converts power', () => {
    expect(convertUnit(1, 'power', 'hp', 'W')).toBeCloseTo(745.7, 1);
    expect(convertUnit(100, 'power', 'kW', 'hp')).toBeCloseTo(134.1, 1);
    expect(convertUnit(100, 'power', 'kW', 'PS')).toBeCloseTo(135.96, 2);
    expect(convertUnit(12000, 'power', 'BTUh', 'TR')).toBeCloseTo(1, 3);
  });
  it('converts torque', () => {
    expect(convertUnit(100, 'torque', 'Nm', 'lbft')).toBeCloseTo(73.76, 2);
    expect(convertUnit(1, 'torque', 'kgfm', 'Nm')).toBeCloseTo(9.80665, 5);
    expect(convertUnit(12, 'torque', 'lbin', 'lbft')).toBeCloseTo(1, 6);
  });
});

describe('fuel economy (reciprocal units)', () => {
  it('converts between consumption and distance per volume', () => {
    expect(convertUnit(30, 'fuel-economy', 'mpgus', 'l100km')).toBeCloseTo(
      7.84,
      2,
    );
    expect(convertUnit(5, 'fuel-economy', 'l100km', 'mpguk')).toBeCloseTo(
      56.5,
      1,
    );
    expect(convertUnit(5, 'fuel-economy', 'l100km', 'kml')).toBeCloseTo(20, 9);
    expect(convertUnit(8, 'fuel-economy', 'l100km', 'l100km')).toBeCloseTo(
      8,
      9,
    );
    expect(convertUnit(25, 'fuel-economy', 'mpgus', 'gal100mi')).toBeCloseTo(
      4,
      9,
    );
    expect(convertUnit(40, 'fuel-economy', 'mpguk', 'mpgus')).toBeCloseTo(
      33.31,
      2,
    );
  });
  it('returns NaN for zero in reciprocal units', () => {
    expect(convertUnit(0, 'fuel-economy', 'l100km', 'mpgus')).toBeNaN();
    expect(convertUnit(0, 'fuel-economy', 'mpgus', 'l100km')).toBeNaN();
  });
});

describe('cooking', () => {
  it('converts volume, weight and across with densities', () => {
    expect(convertCooking(1, 'cup', 'ml', 'water')).toBeCloseTo(236.59, 2);
    expect(convertCooking(1, 'cup', 'tbsp')).toBeCloseTo(16, 9);
    expect(convertCooking(1, 'tbsp', 'tsp')).toBeCloseTo(3, 9);
    expect(convertCooking(1, 'cup', 'g', 'ap-flour')).toBeCloseTo(120, 6);
    expect(convertCooking(200, 'g', 'cup', 'sugar')).toBeCloseTo(1.01, 2);
    expect(convertCooking(2, 'stick', 'cup', 'butter')).toBeCloseTo(1, 2);
    expect(convertCooking(1, 'lb', 'g')).toBeCloseTo(453.59, 2);
    expect(() => convertCooking(1, 'cup', 'g', 'nope')).toThrow(/ingredient/);
  });
  it('rounds to kitchen fractions', () => {
    expect(kitchenFraction(0.333)).toBe('≈ ⅓');
    expect(kitchenFraction(1.5)).toBe('≈ 1 ½');
    expect(kitchenFraction(2)).toBe('≈ 2');
    expect(kitchenFraction(0.44)).toBe('');
  });
});

describe('sizes', () => {
  const men = SHOE_TABLES.find((t) => t.id === 'men')!;
  it('looks up shoe sizes', () => {
    const i = findRow(men, 'us', '10');
    expect(men.rows[i]).toMatchObject({
      uk: '9.5',
      eu: '44',
      cm: '28',
      mondo: '280',
    });
    expect(men.rows[rowForMeasurement(men, 27.2)].us).toBe('9.5');
    expect(rowForMeasurement(men, 40)).toBe(-1);
    for (const t of SHOE_TABLES)
      for (const r of t.rows) expect(Object.keys(r)).toHaveLength(6);
  });
  it('looks up clothing sizes', () => {
    const w = CLOTHING_TABLES.find((t) => t.id === 'women-dresses')!;
    expect(w.rows[findRow(w, 'us', '8')]).toMatchObject({
      uk: '12',
      eu: '38',
      it: '44',
    });
    const shirts = CLOTHING_TABLES.find((t) => t.id === 'men-shirts')!;
    expect(shirts.rows[findRow(shirts, 'us', '15.5')].eu).toBe('39');
    expect(shirts.rows[rowForMeasurement(shirts, 15.5 * 2.54)].us).toBe('15.5');
    for (const t of CLOTHING_TABLES)
      for (const r of t.rows)
        expect(Object.keys(r).sort()).toEqual(
          t.columns.map((c) => c.id).sort(),
        );
  });
});

describe('text ↔ binary', () => {
  it('encodes UTF-8 and round-trips', () => {
    expect(textToBytes('Hi')).toBe('01001000 01101001');
    expect(textToBytes('é', 'hex')).toBe('c3 a9');
    expect(textToBytes('A', 'decimal')).toBe('65');
    for (const s of ['Hello, world!', 'Grüße 👋', '日本'])
      for (const f of ['binary', 'hex', 'decimal', 'octal'] as const)
        expect(bytesToText(textToBytes(s, f), f)).toBe(s);
    expect(bytesToText('0100100001101001')).toBe('Hi');
  });
  it('reports bad input', () => {
    expect(() => bytesToText('0100100')).toThrow(/multiple of 8/);
    expect(() => bytesToText('01001002')).toThrow(/not a valid binary/);
    expect(() => bytesToText('11111111')).toThrow(/UTF-8/);
    expect(() => bytesToText('300', 'decimal')).toThrow(/one byte/);
    expect(
      TRANSFORMS['text-binary'].run('Hi', {
        mode: 'encode',
        format: 'binary',
        spaces: false,
      }),
    ).toBe('0100100001101001');
  });
});
