// Statistics for dice notation: possible range and exact expected value
// (including keep-highest / keep-lowest), plus per-roll and session stats.

import { parseDice, type DiceRoll } from './games';

/** Smallest and largest possible total for a notation like 2d6+3 or 4d6kh3. */
export function diceRange(notation: string): { min: number; max: number } {
  const { count, sides, keep, modifier } = parseDice(notation);
  const n = keep ? keep.n : count;
  return { min: n + modifier, max: n * sides + modifier };
}

/**
 * Expected value of the k highest of n dice with s sides, computed exactly
 * from order statistics: E[j-th highest] = Σ_v P(at least j dice ≥ v).
 */
function expectedTopK(n: number, s: number, k: number): number {
  let total = 0;
  for (let v = 2; v <= s; v++) {
    const p = (s - v + 1) / s;
    // Binomial pmf of "how many dice show ≥ v", built iteratively. p < 1
    // because v ≥ 2, and (1 − p)^n stays above the double underflow limit
    // for the largest allowed roll (100d1000).
    const pmf = new Array<number>(n + 1);
    pmf[0] = Math.pow(1 - p, n);
    for (let i = 1; i <= n; i++)
      pmf[i] = (pmf[i - 1] * (n - i + 1) * p) / (i * (1 - p));
    // tail[j] = P(at least j dice ≥ v); sum it for j = 1..k.
    let tail = 0;
    const tails = new Array<number>(n + 2).fill(0);
    for (let i = n; i >= 1; i--) {
      tail += pmf[i];
      tails[i] = tail;
    }
    for (let j = 1; j <= k; j++) total += tails[j];
  }
  // Every die is at least 1 (the v = 1 term).
  return total + k;
}

/** Exact expected total, e.g. 2d6+3 → 10, 4d6kh3 → ≈12.24. */
export function expectedValue(notation: string): number {
  const { count, sides, keep, modifier } = parseDice(notation);
  if (!keep) return (count * (sides + 1)) / 2 + modifier;
  if (keep.mode === 'h') return expectedTopK(count, sides, keep.n) + modifier;
  // Lowest k mirror the highest k: a face x behaves like s + 1 − x.
  return keep.n * (sides + 1) - expectedTopK(count, sides, keep.n) + modifier;
}

export function rollStats(roll: DiceRoll): {
  lowest: number;
  highest: number;
  average: number;
} {
  const r = roll.rolls;
  return {
    lowest: Math.min(...r),
    highest: Math.max(...r),
    average: r.reduce((a, b) => a + b, 0) / r.length,
  };
}

export type SessionStats = { rolls: number; sum: number };

export function addToSession(s: SessionStats, roll: DiceRoll): SessionStats {
  return { rolls: s.rolls + 1, sum: s.sum + roll.total };
}

/** Rounds for display without trailing zeros: 10 → "10", 12.2446 → "12.24". */
export function formatStat(n: number, digits = 2): string {
  return String(Math.round(n * 10 ** digits) / 10 ** digits);
}
