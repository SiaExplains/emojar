import { describe, expect, it } from 'vitest';
import {
  blank,
  commit,
  floodFill,
  history,
  horizontalRuns,
  isPixels,
  linePoints,
  mirrorPoints,
  paint,
  redo,
  resizePixels,
  toRgba,
  toSvg,
  undo,
  wouldCrop,
} from './pixel-art';

const R = '#ff0000';
const B = '#0000ff';

describe('pixel art editing', () => {
  it('flood fills a bounded 4-connected area', () => {
    // A wall down column 1 splits a 3×3 grid; diagonals don't leak.
    const px = ['', R, '', '', R, '', '', R, ''];
    const out = floodFill(px, 3, 0, 0, B);
    expect(out).toEqual([B, R, '', B, R, '', B, R, '']);
    const diag = [R, '', '', '', R, '', '', '', R];
    expect(floodFill(diag, 3, 0, 0, B)).toEqual([
      B,
      '',
      '',
      '',
      R,
      '',
      '',
      '',
      R,
    ]);
  });

  it('flood fill with the same colour or out of bounds is a no-op', () => {
    const px = blank(4);
    expect(floodFill(px, 4, 1, 1, '')).toBe(px);
    expect(floodFill(px, 4, 9, 0, R)).toBe(px);
    expect(floodFill(px, 4, 0, 0, R).every((c) => c === R)).toBe(true);
  });

  it('mirrors across the centre lines', () => {
    expect(mirrorPoints(1, 2, 8, { h: false, v: false })).toEqual([[1, 2]]);
    expect(mirrorPoints(1, 2, 8, { h: true, v: false })).toEqual([
      [1, 2],
      [6, 2],
    ]);
    expect(mirrorPoints(1, 2, 8, { h: true, v: true })).toEqual([
      [1, 2],
      [6, 2],
      [1, 5],
      [6, 5],
    ]);
    // The centre cell of an odd grid only appears once.
    expect(mirrorPoints(2, 2, 5, { h: true, v: true })).toEqual([[2, 2]]);
  });

  it('interpolates lines without gaps', () => {
    expect(linePoints(0, 0, 3, 0)).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
    const diag = linePoints(0, 0, 4, 2);
    expect(diag[0]).toEqual([0, 0]);
    expect(diag[diag.length - 1]).toEqual([4, 2]);
    expect(diag).toHaveLength(5);
    expect(linePoints(2, 2, 2, 2)).toEqual([[2, 2]]);
  });

  it('paints cells and ignores out-of-range ones', () => {
    const px = blank(2);
    const out = paint(
      px,
      2,
      [
        [0, 0],
        [5, 5],
      ],
      R,
    );
    expect(out).toEqual([R, '', '', '']);
    expect(paint(out, 2, [[0, 0]], R)).toBe(out);
  });

  it('resizes keeping content and detects crops', () => {
    const px = [R, '', '', B];
    expect(resizePixels(px, 2, 3)).toEqual([R, '', '', '', B, '', '', '', '']);
    expect(resizePixels(px, 2, 1)).toEqual([R]);
    expect(wouldCrop(px, 2, 1)).toBe(true);
    expect(wouldCrop([R, '', '', ''], 2, 1)).toBe(false);
    expect(wouldCrop(px, 2, 4)).toBe(false);
  });

  it('validates stored frames', () => {
    expect(isPixels(blank(2), 2)).toBe(true);
    expect(isPixels([R, '', 'red', ''], 2)).toBe(false);
    expect(isPixels(blank(2), 3)).toBe(false);
  });
});

describe('pixel art export', () => {
  it('merges horizontal runs into rects', () => {
    const px = [R, R, B, '', R, R, R, ''];
    // Two painted rows of a 4×4 grid.
    const grid = [...px, ...blank(4).slice(8)];
    expect(horizontalRuns(grid, 4)).toEqual([
      { x: 0, y: 0, w: 2, color: R },
      { x: 2, y: 0, w: 1, color: B },
      { x: 0, y: 1, w: 3, color: R },
    ]);
    const svg = toSvg(grid, 4, 8);
    expect(svg.match(/<rect/g)).toHaveLength(3);
    expect(svg).toContain('width="32"');
    expect(toSvg(blank(2), 2)).not.toContain('<rect');
  });

  it('writes scaled RGBA with transparent background', () => {
    const data = toRgba([R, '', '', ''], 2, 2);
    expect(data).toHaveLength(4 * 4 * 4);
    expect(Array.from(data.slice(0, 4))).toEqual([255, 0, 0, 255]);
    // Pixel (1,1) of the scaled image is still inside the red cell.
    expect(data[(1 * 4 + 1) * 4 + 3]).toBe(255);
    expect(data[(0 * 4 + 2) * 4 + 3]).toBe(0);
  });
});

describe('undo stack', () => {
  it('undoes and redoes in order', () => {
    let h = history('a');
    h = commit(h, 'b');
    h = commit(h, 'c');
    h = undo(h);
    expect(h.present).toBe('b');
    h = undo(h);
    expect(h.present).toBe('a');
    expect(undo(h)).toBe(h);
    h = redo(h);
    expect(h.present).toBe('b');
    h = commit(h, 'd');
    expect(h.future).toEqual([]);
    expect(redo(h)).toBe(h);
  });

  it('ignores no-op commits and caps its length', () => {
    const h = history('a');
    expect(commit(h, 'a')).toBe(h);
    let long = history(0);
    for (let i = 1; i <= 10; i++) long = commit(long, i, 3);
    expect(long.past).toEqual([7, 8, 9]);
  });
});
