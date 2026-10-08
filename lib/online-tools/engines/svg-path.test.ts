import { describe, expect, it } from 'vitest';
import {
  EXAMPLES,
  fmt,
  handlesOf,
  insertSegment,
  isClosed,
  movePoint,
  parsePath,
  removeSegment,
  serializePath,
  setClosed,
  startOf,
  svgMarkup,
  type Segment,
} from './svg-path';

const parse = (d: string): Segment[] => {
  const r = parsePath(d);
  if (!r.ok) throw new Error(r.error);
  return r.segments;
};
const norm = (d: string, decimals = 2) => serializePath(parse(d), decimals);

describe('svg path parsing', () => {
  it('round-trips absolute paths', () => {
    const d = 'M 10 20 L 30 40 Q 50 60 70 80 C 1 2 3 4 5 6 Z';
    expect(norm(d)).toBe(d);
    for (const ex of Object.values(EXAMPLES))
      expect(norm(norm(ex))).toBe(norm(ex));
  });

  it('converts relative commands to absolute', () => {
    expect(norm('m10 10 l5 5 l-5 5z')).toBe('M 10 10 L 15 15 L 10 20 Z');
    expect(norm('M10 10 c1 1 2 2 3 3')).toBe('M 10 10 C 11 11 12 12 13 13');
    expect(norm('M0 0 q5 5 10 0')).toBe('M 0 0 Q 5 5 10 0');
  });

  it('treats extra pairs after M as line-tos', () => {
    expect(norm('M0 0 10 0 10 10')).toBe('M 0 0 L 10 0 L 10 10');
    expect(norm('m5 5 10 0')).toBe('M 5 5 L 15 5');
  });

  it('expands H and V', () => {
    expect(norm('M10 10 H50 V30 h-20 v-10')).toBe(
      'M 10 10 L 50 10 L 50 30 L 30 30 L 30 20',
    );
  });

  it('expands S by reflecting the previous control point', () => {
    expect(norm('M0 0 C10 0 20 10 30 10 S50 20 60 10')).toBe(
      'M 0 0 C 10 0 20 10 30 10 C 40 10 50 20 60 10',
    );
    // Without a previous cubic the first control equals the current point.
    expect(norm('M5 5 S10 10 20 20')).toBe('M 5 5 C 5 5 10 10 20 20');
  });

  it('expands T by reflecting the previous quadratic control', () => {
    expect(norm('M0 10 Q10 0 20 10 T40 10')).toBe(
      'M 0 10 Q 10 0 20 10 Q 30 20 40 10',
    );
    expect(norm('M0 0 t10 10')).toBe('M 0 0 Q 0 0 10 10');
  });

  it('keeps arcs, including compact flags', () => {
    expect(norm('M0 0 A10 10 0 0 1 20 0')).toBe('M 0 0 A 10 10 0 0 1 20 0');
    expect(norm('M0 0 a10 10 0 01 20 0')).toBe('M 0 0 A 10 10 0 0 1 20 0');
    expect(norm('M0 0a5 5 0 1120 0')).toBe('M 0 0 A 5 5 0 1 1 20 0');
  });

  it('returns to the subpath start after Z', () => {
    expect(norm('M10 10 L20 20 Z l5 0')).toBe('M 10 10 L 20 20 Z L 15 10');
  });

  it('handles compact number syntax', () => {
    expect(norm('M.5.5L-1e1-2')).toBe('M 0.5 0.5 L -10 -2');
  });

  it('accepts empty input', () => {
    expect(parsePath('   ')).toEqual({ ok: true, segments: [] });
  });

  it('reports invalid input', () => {
    expect(parsePath('L 10 10').ok).toBe(false);
    expect(parsePath('M 10').ok).toBe(false);
    expect(parsePath('M 10 10 X 5').ok).toBe(false);
    expect(parsePath('10 10').ok).toBe(false);
    expect(parsePath('M0 0 A 1 1 0 2 0 5 5').ok).toBe(false);
    const r = parsePath('M 0 0 L 5');
    expect(r.ok === false && r.error).toMatch(/L needs 2 numbers/);
  });
});

describe('svg path editing', () => {
  it('rounds output to the chosen decimals', () => {
    expect(fmt(1.23456, 2)).toBe('1.23');
    expect(fmt(-0.0001, 2)).toBe('0');
    expect(fmt(2.5, 0)).toBe('3');
    expect(serializePath(parse('M 1.234 5.678'), 1)).toBe('M 1.2 5.7');
  });

  it('lists handles and moves them', () => {
    const segs = parse('M0 0 C1 1 2 2 3 3');
    expect(handlesOf(segs).map((h) => h.key)).toEqual([
      'end',
      'c1',
      'c2',
      'end',
    ]);
    const moved = movePoint(segs, 1, 'c2', { x: 9, y: 9 });
    expect(serializePath(moved)).toBe('M 0 0 C 1 1 9 9 3 3');
  });

  it('finds the pen position before a segment', () => {
    const segs = parse('M10 10 L20 20 Z L5 5');
    expect(startOf(segs, 2)).toEqual({ x: 20, y: 20 });
    expect(startOf(segs, 3)).toEqual({ x: 10, y: 10 });
  });

  it('inserts and removes segments', () => {
    const segs = parse('M0 0 L20 0');
    expect(serializePath(insertSegment(segs, 0, 'L'))).toBe(
      'M 0 0 L 10 0 L 20 0',
    );
    expect(serializePath(insertSegment(segs, 1, 'L'))).toBe(
      'M 0 0 L 20 0 L 40 0',
    );
    expect(insertSegment([], -1, 'C')[0].type).toBe('M');
    expect(serializePath(removeSegment(segs, 0))).toBe('M 20 0');
  });

  it('toggles the closing Z', () => {
    const segs = parse('M0 0 L5 5');
    expect(isClosed(setClosed(segs, true))).toBe(true);
    expect(setClosed(setClosed(segs, true), false)).toEqual(segs);
    expect(setClosed([], true)).toEqual([]);
  });

  it('builds standalone SVG markup', () => {
    const svg = svgMarkup(
      'M 0 0 L 5 5',
      { w: 200, h: 100 },
      {
        stroke: '#000',
        fill: 'none',
        strokeWidth: 2,
        linecap: 'round',
        linejoin: 'miter',
      },
    );
    expect(svg).toContain('viewBox="0 0 200 100"');
    expect(svg).toContain('stroke-linecap="round"');
    expect(svg).not.toContain('stroke-linejoin');
  });
});
