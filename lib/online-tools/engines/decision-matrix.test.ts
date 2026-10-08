import { describe, expect, it } from 'vitest';
import {
  EXAMPLE_MATRIX,
  computeResults,
  csvCell,
  effectiveScore,
  isDecisionMatrixState,
  normaliseTo100,
  normalisedWeights,
  pruneScores,
  rescaleScores,
  toCsv,
  toTsv,
  tsvCell,
  type DMState,
} from './decision-matrix';

const clone = (s: DMState): DMState => JSON.parse(JSON.stringify(s));

describe('decision matrix totals', () => {
  it('computes the spec example: A = 7.9, B = 7.5', () => {
    const r = computeResults(EXAMPLE_MATRIX);
    expect(r.ranked.map((o) => o.id)).toEqual(['a', 'b']);
    expect(r.ranked[0].total).toBeCloseTo(7.9, 10);
    expect(r.ranked[1].total).toBeCloseTo(7.5, 10);
    expect(r.winners).toEqual(['a']);
    expect(r.margin).toBeCloseTo(0.4, 10);
    expect(r.missingCells).toBe(0);
    expect(r.weightTotal).toBe(100);
  });

  it('gives the same result for raw points as for percentages', () => {
    const s = clone(EXAMPLE_MATRIX);
    s.criteria = s.criteria.map((c) => ({ ...c, weight: c.weight / 10 }));
    expect(computeResults(s).ranked[0].total).toBeCloseTo(7.9, 10);
  });

  it('reports ties with a shared rank and no margin', () => {
    const s = clone(EXAMPLE_MATRIX);
    s.scores = {
      price: { a: 5, b: 5 },
      quality: { a: 5, b: 5 },
      location: { a: 5, b: 5 },
    };
    const r = computeResults(s);
    expect(r.winners).toEqual(['a', 'b']);
    expect(r.ranked.map((o) => o.rank)).toEqual([1, 1]);
    expect(r.margin).toBeNull();
  });

  it('uses competition ranking (1, 1, 3)', () => {
    const s = clone(EXAMPLE_MATRIX);
    s.options.push({ id: 'c', name: 'C' });
    s.scores = {
      price: { a: 9, b: 9, c: 1 },
      quality: { a: 9, b: 9, c: 1 },
      location: { a: 9, b: 9, c: 1 },
    };
    expect(computeResults(s).ranked.map((o) => o.rank)).toEqual([1, 1, 3]);
  });

  it('counts missing scores as 0 and reports them', () => {
    const s = clone(EXAMPLE_MATRIX);
    delete s.scores.price.b;
    const r = computeResults(s);
    expect(r.missingCells).toBe(1);
    expect(r.ranked.find((o) => o.id === 'b')?.total).toBeCloseTo(5.7, 10);
  });

  it('handles empty matrices and zero weights', () => {
    const empty = {
      ...clone(EXAMPLE_MATRIX),
      options: [],
      criteria: [],
      scores: {},
    };
    expect(computeResults(empty)).toMatchObject({
      ranked: [],
      winners: [],
      margin: null,
    });
    const zero = clone(EXAMPLE_MATRIX);
    zero.criteria = zero.criteria.map((c) => ({ ...c, weight: 0 }));
    expect(normalisedWeights(zero.criteria)).toEqual([0, 0, 0]);
    expect(computeResults(zero).ranked[0].total).toBe(0);
  });
});

describe('weights and inversion', () => {
  it('normalises weights to exactly 100', () => {
    const c = [
      { id: 'x', name: 'x', weight: 1, lowerIsBetter: false },
      { id: 'y', name: 'y', weight: 1, lowerIsBetter: false },
      { id: 'z', name: 'z', weight: 1, lowerIsBetter: false },
    ];
    const n = normaliseTo100(c);
    expect(n.reduce((s, x) => s + x.weight, 0)).toBeCloseTo(100, 10);
    expect(n.map((x) => x.weight).sort()).toEqual([33.3, 33.3, 33.4]);
    expect(normaliseTo100([])).toEqual([]);
  });

  it('inverts scores when lower is better', () => {
    expect(effectiveScore(2, 10, true)).toBe(9);
    expect(effectiveScore(1, 5, true)).toBe(5);
    expect(effectiveScore(5, 5, true)).toBe(1);
    expect(effectiveScore(7, 10, false)).toBe(7);
    const s = clone(EXAMPLE_MATRIX);
    s.criteria[0].lowerIsBetter = true; // price 8 → 3, 6 → 5
    const r = computeResults(s);
    expect(r.ranked.find((o) => o.id === 'a')?.total).toBeCloseTo(6.4, 10);
    expect(r.ranked.find((o) => o.id === 'b')?.total).toBeCloseTo(7.2, 10);
    expect(r.winners).toEqual(['b']);
  });

  it('rescales scores between 1–10 and 1–5', () => {
    const s = rescaleScores(EXAMPLE_MATRIX, 5);
    expect(s.scale).toBe(5);
    expect(s.scores.price.a).toBeCloseTo(4.1, 10);
    const ten = rescaleScores({ ...s, scores: { price: { a: 5, b: 1 } } }, 10);
    expect(ten.scores.price).toEqual({ a: 10, b: 1 });
  });

  it('prunes scores of deleted rows and columns', () => {
    const s = clone(EXAMPLE_MATRIX);
    s.options = s.options.slice(0, 1);
    s.criteria = s.criteria.slice(1);
    expect(pruneScores(s).scores).toEqual({
      quality: { a: 7 },
      location: { a: 9 },
    });
  });
});

describe('CSV / TSV export', () => {
  it('escapes commas, quotes, newlines and formulas', () => {
    expect(csvCell('plain')).toBe('plain');
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('two\nlines')).toBe('"two\nlines"');
    expect(csvCell('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(csvCell(' padded')).toBe('" padded"');
    expect(csvCell(-3)).toBe('-3');
    expect(tsvCell('a\tb\nc')).toBe('a b c');
  });

  it('writes the whole table with totals and ranks', () => {
    const csv = toCsv(EXAMPLE_MATRIX).split('\r\n');
    expect(csv[0]).toBe(
      'Criterion,Weight (%),Lower is better,Option A,Option B',
    );
    expect(csv[1]).toBe('Price,30,no,8,6');
    expect(csv[4]).toBe('Weighted total (out of 10),,,7.9,7.5');
    expect(csv[5]).toBe('Rank,,,1,2');
    expect(toTsv(EXAMPLE_MATRIX).split('\n')[2]).toBe('Quality\t40\tno\t7\t9');
  });
});

describe('validation', () => {
  it('accepts the example and rejects bad data', () => {
    expect(isDecisionMatrixState(EXAMPLE_MATRIX)).toBe(true);
    expect(isDecisionMatrixState(null)).toBe(false);
    expect(isDecisionMatrixState({ ...EXAMPLE_MATRIX, version: 2 })).toBe(
      false,
    );
    expect(isDecisionMatrixState({ ...EXAMPLE_MATRIX, scale: 7 })).toBe(false);
    expect(
      isDecisionMatrixState({
        ...EXAMPLE_MATRIX,
        scores: { price: { a: 11 } },
      }),
    ).toBe(false);
    expect(
      isDecisionMatrixState({
        ...EXAMPLE_MATRIX,
        options: [
          { id: 'a', name: 'x' },
          { id: 'a', name: 'y' },
        ],
      }),
    ).toBe(false);
    expect(
      isDecisionMatrixState({
        ...EXAMPLE_MATRIX,
        criteria: [{ id: 'p', name: 'P', weight: -1, lowerIsBetter: false }],
      }),
    ).toBe(false);
  });
});
