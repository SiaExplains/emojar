import { describe, expect, it } from 'vitest';
import { explainRegex, type RegexToken } from './regex-explain';

const tokens = (pattern: string, flags = '') => {
  const r = explainRegex(pattern, flags);
  if (!r.ok) throw new Error(r.error);
  return r.tokens;
};
const shape = (list: RegexToken[]): unknown[] =>
  list.map((t) =>
    t.children ? [t.kind, t.raw, shape(t.children)] : [t.kind, t.raw],
  );

describe('explainRegex', () => {
  it('reports invalid patterns', () => {
    const r = explainRegex('(abc', '');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Unterminated group/i);
    expect(explainRegex('a{2,1}').ok).toBe(false);
    expect(explainRegex('').ok).toBe(true);
  });

  it('merges literal runs but keeps quantified characters apart', () => {
    expect(shape(tokens('abc+'))).toEqual([
      ['literal', 'ab'],
      ['quantifier', 'c+', [['literal', 'c']]],
    ]);
    expect(tokens('a\\.b')[0].description).toBe(
      'Matches the text “a.b” literally',
    );
    expect(tokens('x', 'i')[0].description).toMatch(/any case/);
  });

  it('explains groups, named groups and lookarounds', () => {
    const r = explainRegex('(\\d+)-(?<year>\\d{4})(?:x)(?=a)(?!b)(?<=c)(?<!d)');
    if (!r.ok) throw new Error();
    expect(r.groups).toEqual([
      { number: 1, name: null },
      { number: 2, name: 'year' },
    ]);
    expect(r.tokens.map((t) => t.kind)).toEqual([
      'group',
      'literal',
      'group',
      'group',
      'lookaround',
      'lookaround',
      'lookaround',
      'lookaround',
    ]);
    expect(r.tokens[2].description).toMatch(/named “year”/);
    expect(r.tokens[3].description).toMatch(/Non-capturing/);
    expect(r.tokens[5].description).toMatch(/Negative lookahead/);
    expect(r.tokens[6].description).toMatch(/^Lookbehind/);
  });

  it('describes quantifiers', () => {
    const d = (p: string) => tokens(p)[0].description;
    expect(d('a*')).toMatch(
      /zero or more times — as many as possible \(greedy\)/,
    );
    expect(d('a+?')).toMatch(/one or more times — as few as possible \(lazy\)/);
    expect(d('a?')).toMatch(/optionally/);
    expect(d('a{3}')).toBe('Repeat the item below exactly 3 times');
    expect(d('a{2,}')).toMatch(/2 or more times/);
    expect(d('a{2,5}?')).toMatch(/between 2 and 5 times — as few/);
    // Without the u flag a brace that isn't a quantifier is a literal.
    expect(shape(tokens('a{x}'))).toEqual([['literal', 'a{x}']]);
  });

  it('explains character classes with ranges and escapes', () => {
    const [cls] = tokens('[^a-z0-9_\\s-]');
    expect(cls.kind).toBe('class');
    expect(cls.description).toMatch(/NOT listed/);
    expect(shape(cls.children!)).toEqual([
      ['range', 'a-z'],
      ['range', '0-9'],
      ['literal', '_'],
      ['class-escape', '\\s'],
      ['literal', '-'],
    ]);
    expect(cls.children![0].description).toBe(
      'Range: any character from “a” to “z”',
    );
    expect(tokens('[\\b]')[0].children![0].description).toMatch(/backspace/);
  });

  it('explains anchors, escapes and dot depending on flags', () => {
    expect(tokens('^')[0].description).toMatch(/start of the text/);
    expect(tokens('^', 'm')[0].description).toMatch(/start of a line/);
    expect(tokens('.')[0].description).toMatch(/except a line break/);
    expect(tokens('.', 's')[0].description).toMatch(/including line breaks/);
    expect(shape(tokens('\\bcat\\B'))).toEqual([
      ['anchor', '\\b'],
      ['literal', 'cat'],
      ['anchor', '\\B'],
    ]);
    expect(tokens('\\d')[0].description).toMatch(/digit/);
    expect(tokens('\\n')[0].description).toMatch(/line feed/);
    expect(tokens('\\x41')[0].description).toMatch(/“A”/);
    expect(tokens('\\u00e9')[0].description).toMatch(/“é”.*U\+00E9/);
  });

  it('understands unicode properties only with the u flag', () => {
    expect(tokens('\\p{L}', 'u')[0]).toMatchObject({
      kind: 'unicode-property',
      raw: '\\p{L}',
    });
    expect(tokens('\\p{Script=Greek}', 'u')[0].description).toMatch(
      /script Greek/,
    );
    expect(tokens('\\P{Lu}', 'u')[0].description).toMatch(
      /NOT an uppercase letter/,
    );
    expect(tokens('\\u{1F600}', 'u')[0].description).toMatch(/U\+1F600/);
    expect(tokens('\\p{L}')[0].kind).toBe('literal');
  });

  it('explains alternation and backreferences', () => {
    const [alt] = tokens('cat|dog|');
    expect(alt.kind).toBe('alternation');
    expect(alt.children).toHaveLength(3);
    expect(alt.children![2].description).toMatch(/empty/);
    const back = tokens('(a)\\1(?<q>b)\\k<q>');
    expect(back[1]).toMatchObject({ kind: 'backreference', raw: '\\1' });
    expect(back[3]).toMatchObject({ kind: 'backreference', raw: '\\k<q>' });
    // \2 with only one group is an octal escape outside unicode mode.
    expect(tokens('(a)\\2')[1].kind).toBe('literal');
  });

  it('lists the flags', () => {
    const r = explainRegex('a', 'gi');
    expect(r.ok && r.flags.length).toBe(2);
  });

  it('records start and end offsets', () => {
    const [g] = tokens('x(ab)');
    expect(g).toMatchObject({ start: 0, end: 1 });
    const grp = tokens('x(ab)')[1];
    expect(grp).toMatchObject({ start: 1, end: 5, raw: '(ab)' });
  });
});
