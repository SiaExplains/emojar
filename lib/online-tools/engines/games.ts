// Dice notation, coin flips, wheel picks and grade maths. Randomness comes
// from the unbiased crypto-backed randomBelow().

import { ToolInputError } from './data';
import { randomBelow, type RandomSource } from './random';

export type DiceRoll = {
  notation: string;
  rolls: number[];
  kept: number[];
  modifier: number;
  total: number;
};

/** Parses "2d6+3", "d20", "4d6kh3" (keep highest 3), "3d8-1". */
export function parseDice(notation: string): {
  count: number;
  sides: number;
  keep?: { mode: 'h' | 'l'; n: number };
  modifier: number;
} {
  const m =
    /^\s*(\d*)\s*d\s*(\d+|%)\s*(?:k([hl])(\d+))?\s*([+-]\s*\d+)?\s*$/i.exec(
      notation,
    );
  if (!m)
    throw new ToolInputError(
      'Use dice notation like 2d6, d20, 4d6kh3 or 3d8+2.',
    );
  const count = m[1] ? Number(m[1]) : 1;
  const sides = m[2] === '%' ? 100 : Number(m[2]);
  if (count < 1 || count > 100)
    throw new ToolInputError('Roll between 1 and 100 dice at a time.');
  if (sides < 2 || sides > 1000)
    throw new ToolInputError('Dice need between 2 and 1000 sides.');
  const keep = m[3]
    ? { mode: m[3].toLowerCase() as 'h' | 'l', n: Number(m[4]) }
    : undefined;
  if (keep && (keep.n < 1 || keep.n > count))
    throw new ToolInputError(`You can keep between 1 and ${count} dice.`);
  return {
    count,
    sides,
    keep,
    modifier: m[5] ? Number(m[5].replace(/\s/g, '')) : 0,
  };
}

export function rollDice(notation: string, source?: RandomSource): DiceRoll {
  const { count, sides, keep, modifier } = parseDice(notation);
  const rolls = Array.from(
    { length: count },
    () => 1 + randomBelow(sides, source),
  );
  let kept = rolls;
  if (keep) {
    const sorted = [...rolls].sort((a, b) =>
      keep.mode === 'h' ? b - a : a - b,
    );
    kept = sorted.slice(0, keep.n);
  }
  return {
    notation,
    rolls,
    kept,
    modifier,
    total: kept.reduce((a, b) => a + b, 0) + modifier,
  };
}

export function flipCoin(source?: RandomSource): 'heads' | 'tails' {
  return randomBelow(2, source) === 0 ? 'heads' : 'tails';
}

export function pickIndex(n: number, source?: RandomSource): number {
  return randomBelow(n, source);
}

/**
 * Wheel rotation (degrees, clockwise) that lands the pointer at the top on
 * segment `index` of `n`, plus whole extra turns for the animation.
 */
export function wheelRotation(
  index: number,
  n: number,
  current: number,
  turns = 6,
  jitter = 0.5,
): number {
  const seg = 360 / n;
  // Segment i spans [i*seg, (i+1)*seg) measured clockwise from the top.
  const target = 360 - (index * seg + seg * jitter);
  const base = current - (current % 360);
  return base + turns * 360 + (((target % 360) + 360) % 360);
}

// ── Grades ─────────────────────────────────────────────────────────────────

export const GPA_SCALE: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  'D-': 0.7,
  F: 0,
};

export type Course = { name?: string; grade: string; credits: number };

export function computeGpa(
  courses: Course[],
  prior?: { gpa: number; credits: number },
): { gpa: number; credits: number; points: number } {
  let points = prior ? prior.gpa * prior.credits : 0;
  let credits = prior ? prior.credits : 0;
  for (const c of courses) {
    if (!(c.credits > 0)) continue;
    const v =
      GPA_SCALE[c.grade] ??
      (Number.isFinite(Number(c.grade)) ? Number(c.grade) : undefined);
    if (v === undefined) continue;
    points += v * c.credits;
    credits += c.credits;
  }
  return { gpa: credits ? points / credits : 0, credits, points };
}

export type Assignment = { name?: string; score: number; weight: number };

export function weightedGrade(items: Assignment[]): {
  grade: number;
  weight: number;
} {
  const valid = items.filter((i) => Number.isFinite(i.score) && i.weight > 0);
  const weight = valid.reduce((s, i) => s + i.weight, 0);
  const grade = weight
    ? valid.reduce((s, i) => s + i.score * i.weight, 0) / weight
    : 0;
  return { grade, weight };
}

/** Score needed on the final to reach `target` overall. */
export function finalNeeded(
  current: number,
  target: number,
  finalWeightPct: number,
): number {
  const w = finalWeightPct / 100;
  if (!(w > 0 && w <= 1))
    throw new ToolInputError(
      'The final exam weight must be between 1% and 100%.',
    );
  return (target - current * (1 - w)) / w;
}

export function letterFor(pct: number): string {
  if (pct >= 97) return 'A+';
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 63) return 'D';
  if (pct >= 60) return 'D-';
  return 'F';
}

// ── Time formatting ────────────────────────────────────────────────────────

/** 3725123 ms → "1:02:05.12" (hours only when needed). */
export function formatStopwatch(ms: number): string {
  const total = Math.max(0, Math.floor(ms));
  const cs = Math.floor((total % 1000) / 10);
  const s = Math.floor(total / 1000) % 60;
  const m = Math.floor(total / 60000) % 60;
  const h = Math.floor(total / 3600000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${h ? `${h}:${pad(m)}` : pad(m)}:${pad(s)}.${pad(cs)}`;
}

/** 1500 s → "25:00"; rounds up so a timer never shows 0:00 early. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
