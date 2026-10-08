import { describe, expect, it } from 'vitest';
import {
  analyzeSelectors,
  calculateSpecificity,
  compareSpecificity,
  rankEntries,
  splitSelectorList,
} from './css-specificity';

const spec = (s: string) => {
  const r = calculateSpecificity(s);
  if (r.error) throw new Error(`${s}: ${r.error}`);
  return r.specificity;
};
const err = (s: string) => calculateSpecificity(s).error;

describe('css specificity — basics', () => {
  it.each([
    ['#app .card:hover > button', [1, 2, 1]],
    ['*', [0, 0, 0]],
    ['div', [0, 0, 1]],
    ['li a', [0, 0, 2]],
    ['ul li + li ~ a', [0, 0, 4]],
    ['.a.b.c', [0, 3, 0]],
    ['#a#b', [2, 0, 0]],
    ['div#main.wide', [1, 1, 1]],
    ['a[href^="https"]', [0, 1, 1]],
    ['input[type=checkbox i]:checked', [0, 2, 1]],
    ['p::first-line', [0, 0, 2]],
    ['p:first-line', [0, 0, 2]],
    ['a:before', [0, 0, 2]],
    ['a::after', [0, 0, 2]],
    ['li:first-child', [0, 1, 1]],
    ['* > *', [0, 0, 0]],
    ['table || td', [0, 0, 2]],
    ['  div  ', [0, 0, 1]],
  ])('%s', (s, expected) => {
    expect(spec(s)).toEqual(expected);
  });
});

describe('css specificity — Selectors Level 4', () => {
  it.each([
    [':is(#a, .b)', [1, 0, 0]],
    [':is(.b, p)', [0, 1, 0]],
    [':not(.a)', [0, 1, 0]],
    ['a:not(#x.y)', [1, 1, 1]],
    [':where(#a, .b) p', [0, 0, 1]],
    [':where()', [0, 0, 0]],
    [':has(> img)', [0, 0, 1]],
    ['a:has(> img, + .b)', [0, 1, 1]],
    [':matches(.a, .b .c)', [0, 2, 0]],
    [':nth-child(2n+1)', [0, 1, 0]],
    [':nth-child(odd of .item)', [0, 2, 0]],
    [':nth-child(2n of li.important, #x)', [1, 1, 0]],
    [':nth-last-child(-n + 3)', [0, 1, 0]],
    ['li:nth-of-type(3)', [0, 1, 1]],
    [':is(:not(#a), .b)', [1, 0, 0]],
    [':is(div, :where(#x))', [0, 0, 1]],
    ['::slotted(.x)', [0, 1, 1]],
    [':host(.dark)', [0, 2, 0]],
    [':host', [0, 1, 0]],
    [':lang(en)', [0, 1, 0]],
    ['::part(label)', [0, 0, 1]],
  ])('%s', (s, expected) => {
    expect(spec(s)).toEqual(expected);
  });

  it('explains the argument rule', () => {
    const r = calculateSpecificity('a:is(.b, #c)');
    const part = r.parts.find((p) => p.text.startsWith(':is'));
    expect(part?.note).toContain('#c');
    expect(part?.specificity).toEqual([1, 0, 0]);
  });
});

describe('css specificity — tricky syntax', () => {
  it.each([
    ['a[title="a]b"]', [0, 1, 1]],
    ["a[title='(x']", [0, 1, 1]],
    ['[data-x="1,2"]', [0, 1, 0]],
    ['.a\\:hover', [0, 1, 0]],
    ['#\\31 23', [1, 0, 0]],
    ['.\\@media', [0, 1, 0]],
    ['svg|circle', [0, 0, 1]],
    ['*|*', [0, 0, 0]],
    ['|p', [0, 0, 1]],
    ['[xlink|href]', [0, 1, 0]],
    ['[*|lang]', [0, 1, 0]],
    ['.émoji', [0, 1, 0]],
    ['--custom', [0, 0, 1]],
    ['DIV.Card', [0, 1, 1]],
    ['a:HOVER', [0, 1, 1]],
    ['& > .child', [0, 1, 0]],
  ])('%s', (s, expected) => {
    expect(spec(s)).toEqual(expected);
  });

  it('records parts with offsets for highlighting', () => {
    const s = '#app .card:hover > button';
    const r = calculateSpecificity(s);
    expect(r.parts.map((p) => [p.kind, s.slice(p.start, p.end)])).toEqual([
      ['id', '#app'],
      ['class', '.card'],
      ['pseudo-class', ':hover'],
      ['combinator', '>'],
      ['type', 'button'],
    ]);
  });
});

describe('css specificity — malformed input', () => {
  it.each([
    [''],
    ['   '],
    ['> a'],
    ['a >'],
    ['a > > b'],
    ['a + ~ b'],
    ['a[href'],
    ['a]'],
    [':not(.a'],
    [':not()'],
    [':has()'],
    ['a)'],
    ['#'],
    ['.'],
    ['#1a'],
    ['[="x"]'],
    ['[x=]'],
    ['[x=1]'],
    ['[x="unterminated]'],
    ['a:'],
    ['a::'],
    [':nth-child(abc)'],
    [':nth-child(2n of )'],
    ['a\\'],
    ['a $ b'],
    ['a, b'],
  ])('%j gives an error, not a crash', (s) => {
    expect(err(s)).toBeTruthy();
  });

  it('accepts the valid compound ".a div" order only', () => {
    expect(err('.adiv')).toBeNull();
    expect(err('[x]div')).toContain('must come first');
  });
});

describe('selector lists and ranking', () => {
  it('splits only top-level commas', () => {
    expect(splitSelectorList('a, :is(b, c), [x="1,2"], d\\,e')).toEqual([
      'a',
      ' :is(b, c)',
      ' [x="1,2"]',
      ' d\\,e',
    ]);
  });

  it('turns lines and lists into entries, with errors per line', () => {
    const entries = analyzeSelectors(
      '#a, .b\n\n/* comment */ p { color: red }\na >\nx,',
    );
    expect(entries.map((e) => [e.line, e.selector, e.error === null])).toEqual([
      [1, '#a', true],
      [1, '.b', true],
      [3, 'p', true],
      [4, 'a >', false],
      [5, 'x', true],
      [5, 'x,', false],
    ]);
  });

  it('returns nothing for empty input', () => {
    expect(analyzeSelectors('')).toEqual([]);
    expect(analyzeSelectors('\n  \n')).toEqual([]);
  });

  it('ranks highest first and the later of equal selectors first', () => {
    const entries = analyzeSelectors('.a\n#b\n.c\nbad >');
    const ranked = rankEntries(entries).map((x) => x.e.selector);
    expect(ranked).toEqual(['#b', '.c', '.a']);
  });

  it('compares tuples column by column', () => {
    expect(compareSpecificity([1, 0, 0], [0, 99, 99])).toBeGreaterThan(0);
    expect(compareSpecificity([0, 1, 0], [0, 0, 12])).toBeGreaterThan(0);
    expect(compareSpecificity([0, 1, 1], [0, 1, 1])).toBe(0);
  });
});
