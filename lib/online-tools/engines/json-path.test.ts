import { describe, expect, it } from 'vitest';
import {
  ancestorIds,
  containerIdsToDepth,
  copyValueText,
  describeJsonError,
  findJsonError,
  formatPath,
  jsonType,
  nodeId,
  offsetToLineColumn,
  parseJson,
  quoteKey,
  searchJson,
  valueAt,
} from './json-path';

describe('formatPath', () => {
  it('builds dotted paths with array indexes', () => {
    expect(formatPath(['users', 0, 'profile', 'name'])).toBe(
      'users[0].profile.name',
    );
    expect(formatPath([0, 'id'])).toBe('[0].id');
  });

  it('adds the JSONPath root when asked', () => {
    expect(formatPath(['users', 0], { root: true })).toBe('$.users[0]');
    expect(formatPath([], { root: true })).toBe('$');
    expect(formatPath([])).toBe('');
  });

  it('brackets keys that are not identifiers', () => {
    expect(formatPath(['odd key', 'a-b', '1st', '$ok', '_x'])).toBe(
      '["odd key"]["a-b"]["1st"].$ok._x',
    );
    expect(formatPath(['data', ''], { root: true })).toBe('$.data[""]');
  });

  it('escapes quotes, backslashes and control characters', () => {
    expect(quoteKey('say "hi"')).toBe('"say \\"hi\\""');
    expect(quoteKey("it's", "'")).toBe("'it\\'s'");
    expect(quoteKey('a"b', "'")).toBe(`'a"b'`);
    expect(quoteKey('back\\slash', "'")).toBe("'back\\\\slash'");
    expect(quoteKey('line\nbreak', "'")).toBe("'line\\nbreak'");
    expect(formatPath(['é ü'], { quote: "'" })).toBe("['é ü']");
  });
});

describe('parse errors', () => {
  it('converts offsets to 1-based line and column', () => {
    const text = 'ab\ncd\nef';
    expect(offsetToLineColumn(text, 0)).toEqual({ line: 1, column: 1 });
    expect(offsetToLineColumn(text, 4)).toEqual({ line: 2, column: 2 });
    expect(offsetToLineColumn(text, 6)).toEqual({ line: 3, column: 1 });
    expect(offsetToLineColumn(text, 999)).toEqual({ line: 3, column: 3 });
    expect(offsetToLineColumn('', 5)).toEqual({ line: 1, column: 1 });
  });

  it('reads V8, Firefox and Safari style messages', () => {
    const text = '{\n  "a": 1,\n}';
    expect(
      describeJsonError(
        text,
        'Expected double-quoted property name in JSON at position 12',
      ),
    ).toEqual({
      message: 'Expected double-quoted property name',
      line: 3,
      column: 1,
    });
    expect(
      describeJsonError(
        text,
        'JSON.parse: expected double-quoted property name at line 3 column 1 of the JSON data',
      ),
    ).toMatchObject({ line: 3, column: 1 });
    expect(describeJsonError(text, "JSON Parse error: Expected '}'")).toEqual({
      message: "Expected '}'",
    });
  });

  it('parses valid JSON and reports invalid JSON with a position', () => {
    expect(parseJson('{"a":[1,2]}')).toEqual({
      ok: true,
      value: { a: [1, 2] },
    });
    const bad = parseJson('{\n "a": tru\n}');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.line).toBe(2);
    expect(parseJson('   ')).toMatchObject({ ok: false });
  });
});

describe('findJsonError', () => {
  it('accepts valid JSON', () => {
    for (const ok of [
      '{}',
      '[]',
      ' {"a": [1, -2.5e3, true, false, null, "x\\n\\u00e9"]} ',
      '"just a string"',
      '0',
    ])
      expect(findJsonError(ok), ok).toBeNull();
    expect(findJsonError('['.repeat(10000) + ']'.repeat(10000))).toBeNull();
  });

  it('points at the first error', () => {
    const cases: [string, number, RegExp][] = [
      ['{"a": 1,}', 8, /Trailing comma before '}'/],
      ['[1, 2,]', 6, /Trailing comma before ']'/],
      ["{'a': 1}", 1, /double quotes/],
      ['{"a" 1}', 5, /Expected ':'/],
      ['{"a": tru}', 6, /expected a value/],
      ['[1 2]', 3, /Expected ',' or ']'/],
      ['{"a": 1 "b": 2}', 8, /Expected ',' or '}'/],
      ['[1,', 3, /Unexpected end/],
      ['"abc', 0, /Unterminated string/],
      ['"a\\qb"', 2, /Invalid escape/],
      ['"a\nb"', 2, /Line break/],
      ['{} x', 3, /after the end/],
      ['', 0, /Unexpected end/],
    ];
    for (const [text, offset, message] of cases) {
      const err = findJsonError(text);
      expect(err?.offset, text).toBe(offset);
      expect(err?.message, text).toMatch(message);
    }
  });
});

describe('tree helpers', () => {
  const doc = {
    users: [
      { name: 'Ada', tags: ['math'] },
      { name: 'Alan', active: null },
    ],
    'odd key': { Name: 'x' },
  };

  it('labels JSON types', () => {
    expect([{}, [], 'a', 1, true, null].map((v) => jsonType(v))).toEqual([
      'object',
      'array',
      'string',
      'number',
      'boolean',
      'null',
    ]);
  });

  it('reads values by path', () => {
    expect(valueAt(doc, ['users', 1, 'name'])).toBe('Alan');
    expect(valueAt(doc, ['users', 5, 'name'])).toBeUndefined();
    expect(valueAt(doc, [])).toBe(doc);
  });

  it('searches keys and values case-insensitively in document order', () => {
    const { matches } = searchJson(doc, 'NAME');
    expect(matches.map((m) => formatPath(m.path))).toEqual([
      'users[0].name',
      'users[1].name',
      '["odd key"].Name',
    ]);
    expect(searchJson(doc, 'ada').matches).toEqual([
      { path: ['users', 0, 'name'], on: 'value' },
    ]);
    expect(searchJson(doc, 'null').matches[0].path).toEqual([
      'users',
      1,
      'active',
    ]);
    expect(searchJson(doc, '').matches).toEqual([]);
  });

  it('caps the number of matches', () => {
    const big = Array.from({ length: 50 }, () => 'x');
    expect(searchJson(big, 'x', 10)).toMatchObject({ truncated: true });
  });

  it('lists ancestors and containers to a depth', () => {
    expect(ancestorIds(['users', 0, 'name'])).toEqual([
      nodeId([]),
      nodeId(['users']),
      nodeId(['users', 0]),
    ]);
    expect(containerIdsToDepth(doc, 1).ids).toEqual([nodeId([])]);
    expect(containerIdsToDepth(doc, 2).ids).toHaveLength(3);
    expect(containerIdsToDepth(doc, 99, 2)).toMatchObject({ truncated: true });
    expect(containerIdsToDepth('scalar', 5).ids).toEqual([]);
  });

  it('copies raw strings and JSON for everything else', () => {
    expect(copyValueText('hi')).toBe('hi');
    expect(copyValueText(null)).toBe('null');
    expect(copyValueText({ a: 1 })).toBe('{"a":1}');
  });
});
