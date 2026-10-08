// CSS length units → pixels for a given context, matching how browsers
// resolve them. ch and ex depend on the font, so the ratios are measured in
// the browser and passed in.

export type CssUnit =
  | 'px'
  | '%'
  | 'em'
  | 'rem'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax'
  | 'ch'
  | 'ex'
  | 'pt'
  | 'cm'
  | 'mm'
  | 'in'
  | 'pc';

export type UnitContext = {
  /** Root (html) font size in px — 16 by default. */
  rootFontSize: number;
  /** Parent element's font size in px (what em refers to for font-size). */
  parentFontSize: number;
  /** Size of the containing block in px (what % refers to for width). */
  parentSize: number;
  viewportWidth: number;
  viewportHeight: number;
  /** Width of “0” and height of “x” as a fraction of the font size. */
  chRatio: number;
  exRatio: number;
};

export const DEFAULT_CONTEXT: UnitContext = {
  rootFontSize: 16,
  parentFontSize: 16,
  parentSize: 800,
  viewportWidth: 1440,
  viewportHeight: 900,
  chRatio: 0.5,
  exRatio: 0.5,
};

export const UNIT_KIND: Record<
  CssUnit,
  'absolute' | 'font' | 'viewport' | 'percent'
> = {
  px: 'absolute',
  pt: 'absolute',
  pc: 'absolute',
  in: 'absolute',
  cm: 'absolute',
  mm: 'absolute',
  em: 'font',
  rem: 'font',
  ch: 'font',
  ex: 'font',
  vw: 'viewport',
  vh: 'viewport',
  vmin: 'viewport',
  vmax: 'viewport',
  '%': 'percent',
};

/** Pixels for one unit of `unit` in this context. */
export function pxPerUnit(unit: CssUnit, c: UnitContext): number {
  switch (unit) {
    case 'px':
      return 1;
    case '%':
      return c.parentSize / 100;
    case 'em':
      return c.parentFontSize;
    case 'rem':
      return c.rootFontSize;
    case 'vw':
      return c.viewportWidth / 100;
    case 'vh':
      return c.viewportHeight / 100;
    case 'vmin':
      return Math.min(c.viewportWidth, c.viewportHeight) / 100;
    case 'vmax':
      return Math.max(c.viewportWidth, c.viewportHeight) / 100;
    case 'ch':
      return c.parentFontSize * c.chRatio;
    case 'ex':
      return c.parentFontSize * c.exRatio;
    case 'in':
      return 96;
    case 'cm':
      return 96 / 2.54;
    case 'mm':
      return 96 / 25.4;
    case 'pt':
      return 96 / 72;
    case 'pc':
      return 16;
  }
}

export const toPx = (value: number, unit: CssUnit, c: UnitContext) =>
  value * pxPerUnit(unit, c);

export const fromPx = (px: number, unit: CssUnit, c: UnitContext) =>
  px / pxPerUnit(unit, c);

export const fmt = (n: number) =>
  Number.isFinite(n) ? String(Math.round(n * 1000) / 1000) : '—';
