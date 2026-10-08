import { describe, expect, it } from 'vitest';
import {
  confusablePairs,
  deltaE2000,
  linearToSrgb,
  matrixFor,
  MODES,
  parsePalette,
  rgbToLab,
  simulate,
  simulatePixels,
  srgbToLinear,
  type CvdMode,
} from './color-blindness';

const SIMULATED = MODES.map((m) => m.value).filter(
  (m): m is CvdMode => m !== 'none',
);

describe('colour blindness simulation', () => {
  it('round-trips sRGB through linear light', () => {
    for (let v = 0; v <= 255; v++)
      expect(linearToSrgb(srgbToLinear(v))).toBe(v);
    expect(srgbToLinear(0)).toBe(0);
    expect(srgbToLinear(255)).toBeCloseTo(1, 10);
  });

  it('keeps white, black and greys neutral in every mode', () => {
    for (const mode of SIMULATED) {
      expect(simulate([255, 255, 255], mode), mode).toEqual([255, 255, 255]);
      expect(simulate([0, 0, 0], mode), mode).toEqual([0, 0, 0]);
      const [r, g, b] = simulate([128, 128, 128], mode, 0.6);
      expect(Math.abs(r - 128) + Math.abs(g - 128) + Math.abs(b - 128)).toBe(0);
    }
  });

  it('matrix rows sum to one', () => {
    for (const mode of ['protanopia', 'deuteranopia', 'tritanopia'] as const) {
      const m = matrixFor(mode)!;
      for (let r = 0; r < 3; r++)
        expect(m[r * 3] + m[r * 3 + 1] + m[r * 3 + 2]).toBeCloseTo(1, 5);
    }
  });

  it('uses luminance for achromatopsia', () => {
    const [r, g, b] = simulate([0, 255, 0], 'achromatopsia');
    expect(r).toBe(g);
    expect(g).toBe(b);
    // Linear luminance of pure green is 0.7152 → sRGB ≈ 220.
    expect(r).toBe(linearToSrgb(0.7152));
    expect(simulate([0, 0, 255], 'achromatopsia')[0]).toBe(
      linearToSrgb(0.0722),
    );
  });

  it('scales anomalies by severity', () => {
    expect(simulate([200, 30, 30], 'protanomaly', 0)).toEqual([200, 30, 30]);
    expect(simulate([200, 30, 30], 'protanomaly', 1)).toEqual(
      simulate([200, 30, 30], 'protanopia'),
    );
  });

  it('makes red and green alike for deuteranopia', () => {
    const red = rgbToLab(simulate([214, 39, 40], 'deuteranopia'));
    const green = rgbToLab(simulate([44, 160, 44], 'deuteranopia'));
    const before = deltaE2000(rgbToLab([214, 39, 40]), rgbToLab([44, 160, 44]));
    expect(deltaE2000(red, green)).toBeLessThan(before / 2);
  });

  it('simulates pixel buffers like single colours and keeps alpha', () => {
    const data = new Uint8ClampedArray([200, 30, 30, 128, 10, 200, 90, 255]);
    const out = simulatePixels(data, 'tritanopia');
    const a = simulate([200, 30, 30], 'tritanopia');
    for (let i = 0; i < 3; i++) expect(Math.abs(out[i] - a[i])).toBeLessThan(2);
    expect(out[3]).toBe(128);
    expect(simulatePixels(data, 'none')).toEqual(data);
  });
});

describe('palette checker', () => {
  it('computes CIEDE2000 (Sharma test pair)', () => {
    expect(deltaE2000([50, 2.6772, -79.7751], [50, 0, -82.7485])).toBeCloseTo(
      2.0425,
      3,
    );
    expect(deltaE2000([50, 10, 10], [50, 10, 10])).toBe(0);
  });

  it('parses palettes and reports invalid entries', () => {
    const p = parsePalette('#f00, 00ff00\nnope #12345');
    expect(p.colors.map((c) => c.hex)).toEqual(['#ff0000', '#00ff00']);
    expect(p.invalid).toEqual(['nope', '#12345']);
    expect(parsePalette('').colors).toEqual([]);
  });

  it('flags pairs that become hard to tell apart', () => {
    const pairs = confusablePairs(
      [
        [214, 39, 40],
        [44, 160, 44],
        [31, 119, 180],
      ],
      'deuteranopia',
    );
    expect(pairs.map((p) => [p.a, p.b])).toEqual([[0, 1]]);
    expect(pairs[0].original).toBeGreaterThan(50);
    expect(confusablePairs([[0, 0, 0]], 'protanopia')).toEqual([]);
  });
});
