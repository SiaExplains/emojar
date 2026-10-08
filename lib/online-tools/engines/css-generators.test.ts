import { describe, expect, it } from 'vitest';
import {
  POLYGON_PRESETS,
  TRANSFORM_DEFAULT,
  borderRadiusValue,
  boxShadowCss,
  boxShadowValue,
  circleValue,
  collapse4,
  distToSegment,
  ellipseValue,
  insertIndex,
  insertPoint,
  insetValue,
  len,
  matrixValue,
  num,
  originValue,
  polygonCss,
  regularPolygon,
  shadowColor,
  shadowValue,
  snapTo,
  transformValue,
  type Shadow,
} from './css-generators';

const sh = (p: Partial<Shadow> = {}): Shadow => ({
  id: 'x',
  x: 0,
  y: 10,
  blur: 30,
  spread: 0,
  color: '#000000',
  opacity: 20,
  inset: false,
  ...p,
});

describe('number formatting', () => {
  it('rounds and drops zeros', () => {
    expect(num(1.006, 2)).toBe('1.01');
    expect(num(-0.0001)).toBe('0');
    expect(num(12)).toBe('12');
    expect(len(0)).toBe('0');
    expect(len(4.25, 'px', 1)).toBe('4.3px');
    expect(len(-3)).toBe('-3px');
  });
  it('collapses four-value shorthands', () => {
    expect(collapse4(['1', '2', '3', '4'])).toEqual(['1', '2', '3', '4']);
    expect(collapse4(['1', '2', '3', '2'])).toEqual(['1', '2', '3']);
    expect(collapse4(['1', '2', '1', '2'])).toEqual(['1', '2']);
    expect(collapse4(['1', '1', '1', '1'])).toEqual(['1']);
    expect(collapse4(['1', '1', '2', '1'])).toEqual(['1', '1', '2']);
  });
});

describe('box-shadow', () => {
  it('formats a single shadow like the spec', () => {
    expect(boxShadowCss([sh()])).toBe(
      'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);',
    );
  });
  it('includes spread and inset only when set', () => {
    expect(shadowValue(sh({ spread: -5, inset: true }))).toBe(
      'inset 0 10px 30px -5px rgba(0, 0, 0, 0.2)',
    );
    expect(shadowValue(sh({ blur: 0, spread: 0 }))).toBe(
      '0 10px rgba(0, 0, 0, 0.2)',
    );
    expect(shadowValue(sh({ blur: 0, spread: 2 }))).toBe(
      '0 10px 0 2px rgba(0, 0, 0, 0.2)',
    );
  });
  it('uses hex for opaque colours and clamps opacity', () => {
    expect(shadowColor('#FF0000', 100)).toBe('#ff0000');
    expect(shadowColor('#ff0000', 150)).toBe('#ff0000');
    expect(shadowColor('#ff0000', -5)).toBe('rgba(255, 0, 0, 0)');
    expect(shadowColor('not-a-colour', 50)).toBe('rgba(0, 0, 0, 0.5)');
  });
  it('writes several layers one per line, and none for an empty list', () => {
    expect(boxShadowCss([sh({ y: 1, blur: 2 }), sh()])).toBe(
      'box-shadow:\n  0 1px 2px rgba(0, 0, 0, 0.2),\n  0 10px 30px rgba(0, 0, 0, 0.2);',
    );
    expect(boxShadowCss([])).toBe('box-shadow: none;');
    expect(boxShadowValue([])).toBe('none');
  });
});

describe('border-radius', () => {
  it('collapses equal corners', () => {
    expect(borderRadiusValue([8, 8, 8, 8], null, 'px')).toBe('8px');
    expect(borderRadiusValue([0, 8, 0, 8], null, 'px')).toBe('0 8px');
    expect(borderRadiusValue([1, 2, 3, 4], null, 'px')).toBe('1px 2px 3px 4px');
  });
  it('writes elliptical radii only when they differ', () => {
    expect(borderRadiusValue([50, 50, 50, 50], [50, 50, 50, 50], '%')).toBe(
      '50%',
    );
    expect(borderRadiusValue([30, 70, 70, 30], [30, 30, 70, 70], '%')).toBe(
      '30% 70% 70% 30% / 30% 30% 70% 70%',
    );
    expect(borderRadiusValue([10, 10, 10, 10], [20, 20, 20, 20], 'px')).toBe(
      '10px / 20px',
    );
  });
  it('handles zero', () => {
    expect(borderRadiusValue([0, 0, 0, 0], null, '%')).toBe('0');
  });
});

describe('clip-path', () => {
  it('formats polygons over several lines', () => {
    expect(
      polygonCss([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 100 },
      ]),
    ).toBe('clip-path: polygon(\n  0% 0%,\n  100% 0%,\n  50% 100%\n);');
  });
  it('formats circle, ellipse and inset', () => {
    expect(circleValue(40, 50, 50)).toBe('circle(40% at 50% 50%)');
    expect(ellipseValue(40, 25.55, 50, 50)).toBe(
      'ellipse(40% 25.6% at 50% 50%)',
    );
    expect(insetValue(10, 20, 10, 20, 0)).toBe('inset(10% 20%)');
    expect(insetValue(5, 5, 5, 5, 8)).toBe('inset(5% round 8%)');
    expect(insetValue(0, 0, 0, 0, 0)).toBe('inset(0)');
  });
  it('measures distance to a segment', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 0 };
    expect(distToSegment({ x: 5, y: 3 }, a, b)).toBeCloseTo(3);
    expect(distToSegment({ x: -4, y: 3 }, a, b)).toBeCloseTo(5);
    expect(distToSegment({ x: 1, y: 1 }, a, a)).toBeCloseTo(Math.SQRT2);
  });
  it('inserts a point on the nearest edge', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    expect(insertIndex(square, { x: 50, y: 2 })).toBe(1);
    expect(insertIndex(square, { x: 98, y: 50 })).toBe(2);
    // The closing edge (last → first) inserts at the end.
    expect(insertIndex(square, { x: 1, y: 50 })).toBe(4);
    expect(insertIndex([], { x: 1, y: 1 })).toBe(0);
    expect(insertIndex([{ x: 0, y: 0 }], { x: 1, y: 1 })).toBe(1);
    const r = insertPoint(square, { x: 50, y: 99 });
    expect(r.index).toBe(3);
    expect(r.points[3]).toEqual({ x: 50, y: 99 });
    expect(r.points).toHaveLength(5);
  });
  it('snaps to a grid', () => {
    expect(snapTo(12, 5)).toBe(10);
    expect(snapTo(13, 5)).toBe(15);
    expect(snapTo(13, 0)).toBe(13);
  });
  it('builds regular polygons and stars inside the box', () => {
    const star = regularPolygon(5, 20);
    expect(star).toHaveLength(10);
    expect(star[0]).toEqual({ x: 50, y: 0 });
    for (const preset of POLYGON_PRESETS)
      for (const p of preset.points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
  });
});

describe('transform', () => {
  const t = (p: Partial<typeof TRANSFORM_DEFAULT>) => ({
    ...TRANSFORM_DEFAULT,
    ...p,
  });
  it('outputs only non-default functions', () => {
    expect(transformValue(TRANSFORM_DEFAULT)).toBe('none');
    expect(
      transformValue(
        t({
          translateX: 20,
          translateY: 10,
          rotate: 15,
          scaleX: 1.2,
          scaleY: 1.2,
        }),
      ),
    ).toBe('translate(20px, 10px) rotate(15deg) scale(1.2)');
    expect(transformValue(t({ translateY: -5, scaleX: 2 }))).toBe(
      'translateY(-5px) scale(2, 1)',
    );
    expect(transformValue(t({ skewX: 10 }))).toBe('skewX(10deg)');
    expect(transformValue(t({ skewX: 10, skewY: 5 }))).toBe(
      'skew(10deg, 5deg)',
    );
  });
  it('adds perspective only for 3D rotation', () => {
    expect(transformValue(t({ threeD: true }))).toBe('none');
    expect(transformValue(t({ rotateX: 30 }))).toBe('none');
    expect(transformValue(t({ threeD: true, rotateY: 45 }))).toBe(
      'perspective(600px) rotateY(45deg)',
    );
  });
  it('names transform-origin keywords', () => {
    expect(originValue(50, 50)).toBe('center');
    expect(originValue(0, 0)).toBe('left top');
    expect(originValue(100, 50)).toBe('right center');
    expect(originValue(25, 75)).toBe('25% 75%');
  });
  it('computes the equivalent matrix', () => {
    expect(matrixValue(TRANSFORM_DEFAULT)).toBe('matrix(1, 0, 0, 1, 0, 0)');
    expect(matrixValue(t({ rotate: 90 }))).toBe('matrix(0, 1, -1, 0, 0, 0)');
    expect(matrixValue(t({ translateX: 10, scaleX: 2, scaleY: 2 }))).toBe(
      'matrix(2, 0, 0, 2, 10, 0)',
    );
    expect(matrixValue(t({ skewX: 45 }))).toBe('matrix(1, 0, 1, 1, 0, 0)');
    // translate is applied before scale, so it isn't scaled.
    expect(matrixValue(t({ translateX: 10, translateY: 5, rotate: 180 }))).toBe(
      'matrix(-1, 0, 0, -1, 10, 5)',
    );
  });
  it('switches to matrix3d for 3D rotation', () => {
    const m = matrixValue(t({ threeD: true, rotateY: 90, perspective: 500 }));
    expect(m.startsWith('matrix3d(')).toBe(true);
    const v = m.slice(9, -1).split(', ').map(Number);
    expect(v).toHaveLength(16);
    // rotateY(90deg): m13 = -sin = -1; perspective puts -1/500 in m34.
    expect(v[2]).toBeCloseTo(-1);
    expect(v[11]).toBeCloseTo(-1 / 500);
  });
});
