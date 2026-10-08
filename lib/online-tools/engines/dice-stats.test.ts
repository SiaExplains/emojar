import { describe, expect, it } from 'vitest';
import {
  addToSession,
  diceRange,
  expectedValue,
  formatStat,
  rollStats,
} from './dice-stats';
import type { DiceRoll } from './games';

/** Brute-force expected value by enumerating every outcome. */
function enumerate(count: number, sides: number, keep?: ['h' | 'l', number]) {
  let total = 0;
  let outcomes = 0;
  const faces = new Array<number>(count).fill(1);
  for (;;) {
    const sorted = [...faces].sort((a, b) =>
      keep?.[0] === 'l' ? a - b : b - a,
    );
    total += sorted.slice(0, keep ? keep[1] : count).reduce((a, b) => a + b, 0);
    outcomes++;
    let i = 0;
    while (i < count && faces[i] === sides) faces[i++] = 1;
    if (i === count) break;
    faces[i]++;
  }
  return total / outcomes;
}

describe('dice statistics', () => {
  it('gives the range of a notation', () => {
    expect(diceRange('2d6+3')).toEqual({ min: 5, max: 15 });
    expect(diceRange('d20')).toEqual({ min: 1, max: 20 });
    expect(diceRange('3d8-2')).toEqual({ min: 1, max: 22 });
    expect(diceRange('4d6kh3')).toEqual({ min: 3, max: 18 });
    expect(diceRange('2d%')).toEqual({ min: 2, max: 200 });
  });

  it('gives the expected value without keep', () => {
    expect(expectedValue('2d6+3')).toBe(10);
    expect(expectedValue('d20')).toBe(10.5);
    expect(expectedValue('3d8-1')).toBe(12.5);
  });

  it('computes keep-highest and keep-lowest exactly', () => {
    expect(expectedValue('2d20kh1')).toBeCloseTo(13.825, 10);
    expect(expectedValue('2d20kl1')).toBeCloseTo(7.175, 10);
    expect(expectedValue('4d6kh3')).toBeCloseTo(enumerate(4, 6, ['h', 3]), 10);
    expect(expectedValue('4d6kh3')).toBeCloseTo(12.2446, 4);
    expect(expectedValue('5d4kl2+1')).toBeCloseTo(
      enumerate(5, 4, ['l', 2]) + 1,
      10,
    );
    expect(expectedValue('3d6kh3')).toBeCloseTo(10.5, 10);
  });

  it('stays finite for the largest allowed roll', () => {
    const ev = expectedValue('100d1000kh1');
    expect(Number.isFinite(ev)).toBe(true);
    expect(ev).toBeGreaterThan(990);
    expect(ev).toBeLessThanOrEqual(1000);
  });

  it('summarises a roll and the session', () => {
    const roll: DiceRoll = {
      notation: '4d6kh3',
      rolls: [1, 6, 3, 2],
      kept: [6, 3, 2],
      modifier: 0,
      total: 11,
    };
    expect(rollStats(roll)).toEqual({ lowest: 1, highest: 6, average: 3 });
    const s = addToSession(addToSession({ rolls: 0, sum: 0 }, roll), {
      ...roll,
      total: 7,
    });
    expect(s).toEqual({ rolls: 2, sum: 18 });
    expect(formatStat(12.24459)).toBe('12.24');
    expect(formatStat(10)).toBe('10');
  });
});
