import { describe, expect, it } from 'vitest';
import {
  bernstein,
  bernsteinTerms,
  binomial,
  cssCubicBezier,
  deCasteljau,
  derivative,
  formula,
  substituted,
  svgPath,
} from './bezier';

const line = [
  { x: 0, y: 0 },
  { x: 10, y: 20 },
];
const quad = [
  { x: 0, y: 0 },
  { x: 10, y: 20 },
  { x: 20, y: 0 },
];
const cubic = [
  { x: 0, y: 100 },
  { x: 25, y: 0 },
  { x: 75, y: 0 },
  { x: 100, y: 100 },
];

describe('bezier evaluation', () => {
  it('evaluates each degree at t', () => {
    expect(bernstein(line, 0.5)).toEqual({ x: 5, y: 10 });
    expect(bernstein(quad, 0.5)).toEqual({ x: 10, y: 10 });
    expect(bernstein(cubic, 0.5)).toEqual({ x: 50, y: 25 });
  });

  it('passes through the end points', () => {
    for (const pts of [line, quad, cubic]) {
      expect(bernstein(pts, 0)).toEqual(pts[0]);
      expect(bernstein(pts, 1)).toEqual(pts[pts.length - 1]);
    }
  });

  it('clamps t to 0–1 and copes with no points', () => {
    expect(bernstein(quad, 2)).toEqual(quad[2]);
    expect(bernstein([], 0.5)).toEqual({ x: 0, y: 0 });
    expect(deCasteljau([], 0.5)).toEqual([]);
  });

  it('de Casteljau ends at the Bernstein point', () => {
    for (const pts of [line, quad, cubic])
      for (const t of [0, 0.13, 0.5, 0.77, 1]) {
        const levels = deCasteljau(pts, t);
        expect(levels).toHaveLength(pts.length);
        const last = levels[levels.length - 1];
        expect(last).toHaveLength(1);
        const b = bernstein(pts, t);
        expect(last[0].x).toBeCloseTo(b.x, 10);
        expect(last[0].y).toBeCloseTo(b.y, 10);
      }
  });

  it('gives tangents along the control polygon at the ends', () => {
    expect(derivative(cubic, 0)).toEqual({ x: 75, y: -300 });
    expect(derivative(cubic, 1)).toEqual({ x: 75, y: 300 });
  });
});

describe('bezier text output', () => {
  it('computes binomial coefficients', () => {
    expect([0, 1, 2, 3].map((k) => binomial(3, k))).toEqual([1, 3, 3, 1]);
    expect(binomial(3, 4)).toBe(0);
  });

  it('writes Bernstein formulas', () => {
    expect(bernsteinTerms(3)).toEqual(['(1−t)³', '3(1−t)²t', '3(1−t)t²', 't³']);
    expect(formula(1)).toBe('B(t) = (1−t)·P₀ + t·P₁');
    expect(substituted(line, 0.5, 'x')).toBe('x(0.5) = 0.5×0 + 0.5×10 = 5');
  });

  it('writes SVG path data per degree', () => {
    expect(svgPath(line)).toBe('M 0 0 L 10 20');
    expect(svgPath(quad)).toBe('M 0 0 Q 10 20 20 0');
    expect(svgPath(cubic)).toBe('M 0 100 C 25 0 75 0 100 100');
  });

  it('maps a cubic to CSS cubic-bezier when valid', () => {
    const ease = [
      { x: 0, y: 100 },
      { x: 25, y: 90 },
      { x: 25, y: 0 },
      { x: 100, y: 0 },
    ];
    expect(cssCubicBezier(ease)).toBe('cubic-bezier(0.25, 0.1, 0.25, 1)');
    // Ends at the same height: no timing-function equivalent.
    expect(cssCubicBezier(cubic)).toBeNull();
    expect(cssCubicBezier(quad)).toBeNull();
  });
});
