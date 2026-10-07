import { describe, expect, it } from 'vitest';
import {
  CALCULATORS,
  amortize,
  initialValues,
  parseNumberList,
} from './calculators';
import {
  allFormats,
  contrastRatio,
  hexToRgb,
  hslToRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  wcagResults,
} from './color';
import { describeCron, nextCronRuns, parseCron } from './cron';
import {
  ToolInputError,
  base64ToUtf8,
  csvToJson,
  decodeJwt,
  formatJson,
  formatXml,
  jsonToCsv,
  minifyJson,
  parseCsv,
  urlDecode,
  utf8ToBase64,
  validateJson,
} from './data';
import {
  addMonths,
  countWorkingDays,
  diffYMD,
  isoWeek,
  parseAnyDate,
  parseDateInput,
  timeZoneOffset,
  zonedTimeToUtc,
} from './dates';
import { hashText, hmacText, md5Hex } from './hash';
import { buildQrPayload } from './qr';
import {
  entropyBits,
  generatePassphrase,
  generatePassword,
  generateRandomNumbers,
  randomBelow,
  uuidV4,
  uuidV7,
  uuidVersion,
} from './random';
import {
  convertCase,
  diffLines,
  findAndReplace,
  loremIpsum,
  morseToText,
  removeDuplicateLines,
  removeEmptyLines,
  sortLines,
  textStats,
  textToMorse,
  toTitleCase,
} from './text';
import { TRANSFORMS } from './transforms';
import { QUANTITIES, convertUnit, formatNumber } from './units';

describe('JSON', () => {
  it('formats with the chosen indentation', () => {
    expect(formatJson('{"a":1,"b":[1,2]}')).toBe(
      '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}',
    );
    expect(formatJson('{"a":1}', { indent: 4 })).toBe('{\n    "a": 1\n}');
    expect(formatJson('{"a":1}', { indent: 'tab' })).toBe('{\n\t"a": 1\n}');
  });

  it('sorts keys deeply without touching arrays', () => {
    expect(
      formatJson('{"b":1,"a":{"d":1,"c":2},"z":[3,1]}', {
        indent: 0,
        sortKeys: true,
      }),
    ).toBe('{"a":{"c":2,"d":1},"b":1,"z":[3,1]}');
  });

  it('minifies', () => {
    expect(minifyJson('{\n  "a": [1, 2],\n  "b": "x y"\n}')).toBe(
      '{"a":[1,2],"b":"x y"}',
    );
  });

  it('reports invalid JSON with a friendly error and position', () => {
    const r = validateJson('{"a": 1,}');
    expect(r.valid).toBe(false);
    if (!r.valid) {
      expect(r.message).toMatch(/^Invalid JSON/);
      expect(r.line).toBe(1);
    }
    expect(() => formatJson('{a:1}')).toThrow(ToolInputError);
    expect(validateJson('   ').valid).toBe(false);
  });

  it('accepts any JSON value', () => {
    expect(validateJson('null').valid).toBe(true);
    expect(validateJson('[1,2]').valid).toBe(true);
  });
});

describe('CSV', () => {
  it('parses quoted fields, escaped quotes and newlines', () => {
    expect(parseCsv('a,b\n"x, y","he said ""hi"""\n"multi\nline",2')).toEqual([
      ['a', 'b'],
      ['x, y', 'he said "hi"'],
      ['multi\nline', '2'],
    ]);
  });

  it('converts CSV to JSON with type inference', () => {
    expect(
      JSON.parse(csvToJson('name,age,active\nAda,36,true\nBob,,false')),
    ).toEqual([
      { name: 'Ada', age: 36, active: true },
      { name: 'Bob', age: '', active: false },
    ]);
    expect(JSON.parse(csvToJson('id\n007', { inferTypes: false }))).toEqual([
      { id: '007' },
    ]);
    expect(JSON.parse(csvToJson('a;b\n1;2', { delimiter: ';' }))).toEqual([
      { a: 1, b: 2 },
    ]);
  });

  it('rejects unterminated quotes', () => {
    expect(() => csvToJson('a\n"oops')).toThrow(ToolInputError);
  });

  it('converts JSON to CSV, flattening nested objects', () => {
    expect(
      jsonToCsv('[{"n":"A","addr":{"city":"Berlin"}},{"n":"B, C","x":1}]'),
    ).toBe('n,addr.city,x\nA,Berlin,\n"B, C",,1');
  });

  it('round-trips', () => {
    const json = '[{"a":1,"b":"two"}]';
    expect(JSON.parse(csvToJson(jsonToCsv(json)))).toEqual(JSON.parse(json));
  });
});

describe('XML', () => {
  it('indents nested tags and keeps text-only elements inline', () => {
    expect(formatXml('<a><b>hi</b><c/></a>')).toBe(
      '<a>\n  <b>hi</b>\n  <c/>\n</a>',
    );
  });
  it('detects mismatched and unclosed tags', () => {
    expect(() => formatXml('<a><b></a>')).toThrow(/does not match/);
    expect(() => formatXml('<a>')).toThrow(/never closed/);
  });
});

describe('Base64 / URL / JWT', () => {
  it('round-trips UTF-8 text including emoji', () => {
    const s = 'Hello 👋 Ünïcödé';
    expect(base64ToUtf8(utf8ToBase64(s))).toBe(s);
    expect(base64ToUtf8(utf8ToBase64(s, true))).toBe(s);
    expect(utf8ToBase64('hi')).toBe('aGk=');
  });
  it('rejects invalid Base64', () => {
    expect(() => base64ToUtf8('not base64!')).toThrow(ToolInputError);
  });
  it('decodes URLs and reports bad escapes', () => {
    expect(urlDecode('caf%C3%A9+cr%C3%A8me')).toBe('café crème');
    expect(urlDecode('a+b', false)).toBe('a+b');
    expect(() => urlDecode('%E0%A4%A')).toThrow(ToolInputError);
  });
  it('decodes a JWT and checks expiry', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTgwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.7u8tB60bd0KASOJ_0fJRF0yyw10TEKBAq1eq4_hB8Eg';
    const d = decodeJwt(`Bearer ${token}`, new Date('2026-10-07T00:00:00Z'));
    expect(d.header.alg).toBe('HS256');
    expect(d.payload.name).toBe('Ada Lovelace');
    expect(d.expired).toBe(false);
    expect(decodeJwt(token, new Date('2034-01-01T00:00:00Z')).expired).toBe(
      true,
    );
    expect(() => decodeJwt('abc.def')).toThrow(/three parts/);
  });
});

describe('text', () => {
  it('converts between cases', () => {
    expect(convertCase('user ID number', 'camel')).toBe('userIdNumber');
    expect(convertCase('userIdNumber', 'snake')).toBe('user_id_number');
    expect(convertCase('Hello World', 'kebab')).toBe('hello-world');
    expect(convertCase('hello world', 'constant')).toBe('HELLO_WORLD');
    expect(convertCase('hello world', 'pascal')).toBe('HelloWorld');
    expect(convertCase('straße', 'upper')).toBe('STRASSE');
    expect(convertCase('hello. how are you? fine', 'sentence')).toBe(
      'Hello. How are you? Fine',
    );
  });

  it('title-cases with small-word rules', () => {
    expect(toTitleCase('the lord of the rings')).toBe('The Lord of the Rings');
    expect(toTitleCase('what are you looking at')).toBe(
      'What Are You Looking At',
    );
  });

  it('counts words, sentences and paragraphs', () => {
    const s = textStats(
      "Hello world. It's a well-known fact!\n\nNew paragraph here 👋",
    );
    expect(s.words).toBe(9);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(textStats('👍').characters).toBe(1);
    expect(textStats('').words).toBe(0);
  });

  it('removes duplicate and empty lines', () => {
    expect(removeDuplicateLines('a\nb\nA\na \nc')).toBe('a\nb\nA\nc');
    expect(removeDuplicateLines('a\nA', { caseSensitive: false })).toBe('a');
    expect(removeEmptyLines('a\n\n  \nb')).toBe('a\nb');
    expect(removeEmptyLines('a\n\n  \nb', { whitespaceOnly: false })).toBe(
      'a\n  \nb',
    );
  });

  it('sorts lines naturally', () => {
    expect(sortLines('item 10\nitem 2\nitem 1', 'natural')).toBe(
      'item 1\nitem 2\nitem 10',
    );
    expect(sortLines('b\na\nC', 'az')).toBe('a\nb\nC');
    expect(sortLines('a\nbbb\ncc', 'length-desc')).toBe('bbb\ncc\na');
    let i = 0;
    const fixed = () => [0.9, 0.1, 0.5][i++ % 3];
    expect(
      sortLines('1\n2\n3', 'shuffle', { random: fixed }).split('\n').sort(),
    ).toEqual(['1', '2', '3']);
  });

  it('finds and replaces literally and with regex', () => {
    expect(findAndReplace('Cat cat CAT', 'cat', 'dog')).toEqual({
      output: 'dog dog dog',
      count: 3,
    });
    expect(
      findAndReplace('Cat cat', 'cat', 'dog', { caseSensitive: true }).count,
    ).toBe(1);
    expect(
      findAndReplace('cat category', 'cat', 'dog', { wholeWord: true }).output,
    ).toBe('dog category');
    expect(
      findAndReplace('2026-10-07', '(\\d{4})-(\\d{2})-(\\d{2})', '$3.$2.$1', {
        useRegex: true,
      }).output,
    ).toBe('07.10.2026');
    expect(findAndReplace('a.b', '.', '$1').output).toBe('a$1b');
    expect(() => findAndReplace('x', '(', '', { useRegex: true })).toThrow();
  });

  it('translates Morse code both ways', () => {
    expect(textToMorse('SOS')).toBe('... --- ...');
    expect(textToMorse('hi you')).toBe('.... .. / -.-- --- ..-');
    expect(morseToText('.... .. / -.-- --- ..-')).toBe('HI YOU');
  });

  it('diffs lines', () => {
    const d = diffLines('a\nb\nc', 'a\nx\nc');
    expect(d.map((p) => `${p.type[0]}${p.value}`)).toEqual([
      'ea',
      'rb',
      'ax',
      'ec',
    ]);
  });

  it('generates lorem ipsum', () => {
    expect(loremIpsum(5, 'words')).toBe('Lorem ipsum dolor sit amet');
    expect(loremIpsum(3, 'paragraphs').split('\n\n')).toHaveLength(3);
    expect(loremIpsum(2, 'sentences', { startWithLorem: false })).toMatch(
      /\.$/,
    );
  });
});

describe('transforms registry', () => {
  it('runs every sample without throwing (except the deliberately invalid validator sample)', async () => {
    for (const [id, def] of Object.entries(TRANSFORMS)) {
      if (['html-format', 'css-format', 'js-format'].includes(id)) continue; // prettier plugins are browser bundles
      const opts = Object.fromEntries(
        (def.options ?? []).map((o) => [o.id, o.default]),
      );
      if (id === 'json-validate') {
        expect(() => def.run(def.sample, opts)).toThrow(ToolInputError);
        continue;
      }
      await expect(
        Promise.resolve(def.run(def.sample, opts)),
        id,
      ).resolves.toEqual(expect.any(String));
    }
  });

  it('converts JSON ↔ YAML and Markdown ↔ HTML', async () => {
    const yaml = await TRANSFORMS['json-to-yaml'].run('{"a":1,"b":["x"]}', {});
    expect(yaml).toBe('a: 1\nb:\n  - x\n');
    expect(
      JSON.parse(await TRANSFORMS['yaml-to-json'].run(yaml, { indent: '2' })),
    ).toEqual({ a: 1, b: ['x'] });
    await expect(
      Promise.resolve(TRANSFORMS['yaml-to-json'].run('a: [1, 2', {})),
    ).rejects.toThrow(/Invalid YAML/);
    expect(
      await TRANSFORMS['markdown-to-html'].run('# Hi\n\n**b**', { gfm: true }),
    ).toContain('<h1>Hi</h1>');
    expect(
      await TRANSFORMS['html-to-markdown'].run(
        '<h1>Hi</h1><p><strong>b</strong></p>',
        { headingStyle: 'atx' },
      ),
    ).toBe('# Hi\n\n**b**');
  });

  it('minifies JavaScript with terser', async () => {
    const out = await TRANSFORMS['js-minify'].run(
      'function add(first, second) {\n  return first + second;\n}\nconsole.log(add(1, 2));',
      { mangle: true },
    );
    expect(out.length).toBeLessThan(60);
    expect(out).toContain('console.log');
    await expect(
      Promise.resolve(TRANSFORMS['js-minify'].run('function (', {})),
    ).rejects.toThrow(ToolInputError);
  });
});

describe('units', () => {
  it('converts linear units', () => {
    expect(convertUnit(1, 'length', 'mi', 'km')).toBeCloseTo(1.609344, 9);
    expect(convertUnit(1, 'weight', 'kg', 'lb')).toBeCloseTo(2.20462262, 6);
    expect(convertUnit(1, 'data-storage', 'GiB', 'MB')).toBeCloseTo(
      1073.741824,
      9,
    );
    expect(convertUnit(180, 'angle', 'deg', 'rad')).toBeCloseTo(Math.PI, 12);
    expect(convertUnit(100, 'speed', 'kmh', 'mph')).toBeCloseTo(62.1371, 3);
  });
  it('converts temperatures', () => {
    expect(convertUnit(100, 'temperature', 'c', 'f')).toBeCloseTo(212);
    expect(convertUnit(32, 'temperature', 'f', 'c')).toBeCloseTo(0);
    expect(convertUnit(0, 'temperature', 'k', 'c')).toBeCloseTo(-273.15);
    expect(convertUnit(0, 'temperature', 'c', 'r')).toBeCloseTo(491.67);
  });
  it('has defaults that exist in every quantity', () => {
    for (const q of Object.values(QUANTITIES)) {
      expect(
        q.units.some((u) => u.id === q.defaultFrom),
        q.id,
      ).toBe(true);
      expect(
        q.units.some((u) => u.id === q.defaultTo),
        q.id,
      ).toBe(true);
    }
  });
  it('formats numbers without float noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatNumber(1234567.5)).toBe('1,234,567.5');
    expect(formatNumber(1e-9)).toBe('1e-9');
  });
});

describe('dates', () => {
  const d = (s: string) => parseDateInput(s)!;
  it('parses only real dates', () => {
    expect(parseDateInput('2026-02-30')).toBeNull();
    expect(parseDateInput('2024-02-29')).not.toBeNull();
  });
  it('clamps month arithmetic to month end', () => {
    expect(addMonths(d('2026-01-31'), 1).toISOString().slice(0, 10)).toBe(
      '2026-02-28',
    );
    expect(addMonths(d('2024-02-29'), 12).toISOString().slice(0, 10)).toBe(
      '2025-02-28',
    );
  });
  it('computes calendar differences', () => {
    expect(diffYMD(d('1990-06-15'), d('2026-10-07'))).toEqual({
      years: 36,
      months: 3,
      days: 22,
    });
    expect(diffYMD(d('2026-01-31'), d('2026-03-01'))).toEqual({
      years: 0,
      months: 1,
      days: 1,
    });
    expect(diffYMD(d('2026-03-01'), d('2026-01-31'))).toEqual({
      years: 0,
      months: 1,
      days: 1,
    });
  });
  it('counts working days', () => {
    // Mon 2026-10-05 → Sun 2026-10-11: five weekdays.
    expect(countWorkingDays(d('2026-10-05'), d('2026-10-11'))).toBe(5);
    expect(
      countWorkingDays(d('2026-10-05'), d('2026-10-11'), {
        holidays: new Set(['2026-10-07']),
      }),
    ).toBe(4);
  });
  it('computes ISO week numbers at year boundaries', () => {
    expect(isoWeek(d('2026-01-01'))).toEqual({ week: 1, year: 2026 });
    expect(isoWeek(d('2027-01-01'))).toEqual({ week: 53, year: 2026 });
    expect(isoWeek(d('2026-10-07'))).toEqual({ week: 41, year: 2026 });
  });
  it('parses timestamps in seconds and milliseconds', () => {
    expect(parseAnyDate('1767225600')!.toISOString()).toBe(
      '2026-01-01T00:00:00.000Z',
    );
    expect(parseAnyDate('1767225600000')!.toISOString()).toBe(
      '2026-01-01T00:00:00.000Z',
    );
    expect(parseAnyDate('not a date')).toBeNull();
  });
  it('converts wall-clock times across time zones, including DST', () => {
    expect(
      timeZoneOffset(new Date('2026-07-01T12:00:00Z'), 'Europe/Berlin'),
    ).toBe(120);
    expect(
      timeZoneOffset(new Date('2026-01-01T12:00:00Z'), 'Europe/Berlin'),
    ).toBe(60);
    expect(
      zonedTimeToUtc('2026-07-01T09:00', 'America/New_York')!.toISOString(),
    ).toBe('2026-07-01T13:00:00.000Z');
    expect(
      zonedTimeToUtc('2026-12-01T09:00', 'Asia/Kolkata')!.toISOString(),
    ).toBe('2026-12-01T03:30:00.000Z');
  });
});

describe('calculators', () => {
  const run = (id: string, v: Record<string, string>) => {
    const def = CALCULATORS[id];
    return def.compute({
      ...initialValues(def, new Date('2026-10-07T12:00:00Z')),
      ...v,
    });
  };
  const primary = (out: ReturnType<typeof run>) =>
    out.ok ? out.results.find((r) => r.primary)?.value : out.error;

  it('computes every calculator with its defaults', () => {
    for (const [id, def] of Object.entries(CALCULATORS)) {
      expect(def.compute(initialValues(def)).ok, id).toBe(true);
    }
  });
  it('percentages', () => {
    expect(primary(run('percentage', { mode: 'of', x: '20', y: '150' }))).toBe(
      '30',
    );
    expect(primary(run('percentage', { mode: 'is', x: '30', y: '150' }))).toBe(
      '20%',
    );
    expect(
      primary(run('percentage', { mode: 'change', x: '80', y: '100' })),
    ).toBe('25%');
    expect(run('percentage', { mode: 'is', x: '1', y: '0' }).ok).toBe(false);
    expect(
      primary(
        run('percentage-increase', { mode: 'between', from: '100', to: '80' }),
      ),
    ).toBe('20%');
  });
  it('age', () => {
    expect(primary(run('age', { dob: '1990-06-15', at: '2026-10-07' }))).toBe(
      '36 years, 3 months, 22 days',
    );
    expect(run('age', { dob: '2030-01-01', at: '2026-10-07' }).ok).toBe(false);
  });
  it('BMI and BMR', () => {
    expect(
      primary(run('bmi', { units: 'metric', weight: '70', height: '175' })),
    ).toBe('22.9');
    expect(
      primary(run('bmi', { units: 'imperial', lb: '154', ft: '5', in: '9' })),
    ).toBe('22.7');
    expect(
      primary(
        run('bmr', {
          sex: 'male',
          age: '30',
          weight: '80',
          height: '180',
          activity: '1.2',
        }),
      ),
    ).toBe('1,780 kcal/day');
  });
  it('loans', () => {
    // 100,000 at 6% over 30 years = 599.55/month (standard reference value).
    expect(
      primary(run('loan', { amount: '100000', rate: '6', years: '30' })),
    ).toBe('599.55');
    expect(amortize(1200, 0, 12).payment).toBe(100);
    const emi = run('emi', { amount: '100000', rate: '12', months: '12' });
    expect(primary(emi)).toBe('8,884.88');
    expect(emi.ok && emi.table?.rows).toHaveLength(12);
  });
  it('money helpers', () => {
    expect(primary(run('tip', { bill: '100', tip: '15', people: '2' }))).toBe(
      '57.50',
    );
    expect(
      primary(run('discount', { price: '100', discount: '25', extra: '10' })),
    ).toBe('67.50');
    expect(
      primary(run('vat', { mode: 'remove', amount: '119', rate: '19' })),
    ).toBe('100.00');
    expect(
      primary(run('vat', { mode: 'add', amount: '100', rate: '20' })),
    ).toBe('120.00');
    expect(
      primary(
        run('compound-interest', {
          principal: '1000',
          contribution: '0',
          rate: '10',
          years: '1',
          n: '1',
        }),
      ),
    ).toBe('1,100.00');
  });
  it('time duration, average and date tools', () => {
    expect(
      primary(
        run('time-duration', { start: '22:00', end: '06:30', break: '30' }),
      ),
    ).toBe('8 h 0 min');
    expect(primary(run('average', { numbers: '1, 2, 3, 4' }))).toBe('2.5');
    expect(parseNumberList('1 2,3;\n4 x')).toEqual([1, 2, 3, 4]);
    expect(
      primary(
        run('date-difference', {
          start: '2026-01-01',
          end: '2026-12-31',
          include: 'yes',
        }),
      ),
    ).toBe('365');
    expect(
      primary(
        run('date-add-subtract', {
          date: '2026-10-09',
          op: 'add',
          amount: '1',
          unit: 'business',
        }),
      ),
    ).toBe('Monday, October 12, 2026');
    expect(
      primary(
        run('working-days', {
          start: '2026-10-05',
          end: '2026-10-11',
          weekend: '0,6',
          holidays: '',
        }),
      ),
    ).toBe('5');
    expect(run('working-days', { holidays: 'nope' }).ok).toBe(false);
    expect(primary(run('week-number', { date: '2026-10-07' }))).toBe('Week 41');
  });
});

describe('color', () => {
  it('converts HEX ↔ RGB ↔ HSL', () => {
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
    expect(hexToRgb('fa0')).toEqual({ r: 255, g: 170, b: 0 });
    expect(rgbToHex({ r: 59, g: 130, b: 246 })).toBe('#3b82f6');
    expect(rgbToHsl({ r: 59, g: 130, b: 246 })).toEqual({
      h: 217,
      s: 91,
      l: 60,
    });
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#zzz')).toBeNull();
  });
  it('parses CSS color syntaxes and names', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('59 130 246', 'rgb')).toEqual({ r: 59, g: 130, b: 246 });
    expect(parseColor('hsl(120, 100%, 25%)')).toEqual({ r: 0, g: 128, b: 0 });
    expect(parseColor('217, 91%, 60%', 'hsl')).toEqual(
      hslToRgb({ h: 217, s: 91, l: 60 }),
    );
    expect(parseColor('coral')).toEqual({ r: 255, g: 127, b: 80 });
    expect(parseColor('rgba(0,0,0,0.5)')).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
    expect(parseColor('rgb(300, 0, 0)')).toBeNull();
    expect(allFormats({ r: 0, g: 0, b: 0 }).cmyk).toBe(
      'cmyk(0%, 0%, 0%, 100%)',
    );
  });
  it('computes WCAG contrast', () => {
    expect(
      contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }),
    ).toBeCloseTo(21, 5);
    expect(
      contrastRatio({ r: 119, g: 119, b: 119 }, { r: 255, g: 255, b: 255 }),
    ).toBeCloseTo(4.48, 2);
    expect(wcagResults(4.5)).toMatchObject({
      aaNormal: true,
      aaaNormal: false,
    });
  });
});

describe('hashing', () => {
  it('matches known digests', async () => {
    expect(md5Hex('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(md5Hex('The quick brown fox jumps over the lazy dog')).toBe(
      '9e107d9d372bb6826bd81d3542a419d6',
    );
    expect(md5Hex('a'.repeat(1000))).toBe('cabe45dcc9ae5b66ba86600cca6b8ba8');
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
    expect(await hashText('abc', 'SHA-1')).toBe(
      'a9993e364706816aba3e25717850c26c9cd0d89d',
    );
    expect(
      await hmacText(
        'The quick brown fox jumps over the lazy dog',
        'key',
        'SHA-256',
      ),
    ).toBe('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
  });
});

describe('random', () => {
  it('stays in range and is unbiased enough', () => {
    const counts = [0, 0, 0];
    for (let i = 0; i < 3000; i++) counts[randomBelow(3)]++;
    counts.forEach((c) => expect(c).toBeGreaterThan(850));
  });
  it('generates passwords with every chosen character class', () => {
    for (let i = 0; i < 50; i++) {
      const p = generatePassword({
        length: 8,
        upper: true,
        lower: true,
        digits: true,
        symbols: true,
      });
      expect(p).toHaveLength(8);
      expect(p).toMatch(/[A-Z]/);
      expect(p).toMatch(/[a-z]/);
      expect(p).toMatch(/\d/);
      expect(p).toMatch(/[^A-Za-z0-9]/);
    }
    expect(
      generatePassword({
        length: 50,
        upper: false,
        lower: true,
        digits: false,
        symbols: false,
        excludeAmbiguous: true,
      }),
    ).not.toMatch(/[lo]/);
    expect(() =>
      generatePassword({
        length: 10,
        upper: false,
        lower: false,
        digits: false,
        symbols: false,
      }),
    ).toThrow();
    expect(entropyBits(94, 16)).toBeCloseTo(104.9, 1);
  });
  it('generates passphrases', () => {
    const p = generatePassphrase({
      words: 5,
      separator: '-',
      capitalize: true,
      addNumber: true,
    });
    expect(p.split('-')).toHaveLength(5);
    expect(p).toMatch(/\d/);
  });
  it('generates unique random numbers and refuses impossible requests', () => {
    const n = generateRandomNumbers({
      min: 1,
      max: 10,
      count: 10,
      unique: true,
      decimals: 0,
    });
    expect(new Set(n).size).toBe(10);
    expect(() =>
      generateRandomNumbers({
        min: 1,
        max: 3,
        count: 5,
        unique: true,
        decimals: 0,
      }),
    ).toThrow(/3 unique/);
    const dec = generateRandomNumbers({
      min: 0,
      max: 1e6,
      count: 20,
      unique: false,
      decimals: 4,
    });
    dec.forEach((x) => expect(x).toBeLessThanOrEqual(1e6));
  });
  it('generates valid UUIDs', () => {
    expect(uuidVersion(uuidV4())).toBe(4);
    const a = uuidV7(1_700_000_000_000);
    const b = uuidV7(1_700_000_000_001);
    expect(uuidVersion(a)).toBe(7);
    expect(a < b).toBe(true);
  });
});

describe('cron', () => {
  it('parses and describes expressions', () => {
    expect(describeCron('*/5 * * * *')).toBe('Every 5 minutes.');
    expect(describeCron('0 9 * * 1-5')).toBe(
      'At 09:00, on Monday through Friday.',
    );
    expect(describeCron('@daily')).toBe('At 00:00.');
    expect(describeCron('30 3 1 1,7 *')).toBe(
      'At 03:30, on day-of-month 1, in January and July.',
    );
    expect(() => parseCron('* * *')).toThrow(/5 fields/);
    expect(() => parseCron('61 * * * *')).toThrow(/minute/);
    expect(parseCron('0 0 * * 7').values[4].has(0)).toBe(true);
  });
  it('finds the next runs', () => {
    const runs = nextCronRuns(
      '0 9 * * 1-5',
      3,
      new Date('2026-10-09T10:00:00Z'),
      true,
    );
    expect(runs.map((r) => r.toISOString())).toEqual([
      '2026-10-12T09:00:00.000Z',
      '2026-10-13T09:00:00.000Z',
      '2026-10-14T09:00:00.000Z',
    ]);
    expect(
      nextCronRuns(
        '0 0 29 2 *',
        1,
        new Date('2026-01-01T00:00:00Z'),
        true,
      )[0].toISOString(),
    ).toBe('2028-02-29T00:00:00.000Z');
  });
});

describe('QR payloads', () => {
  it('builds Wi-Fi, URL, email and phone payloads', () => {
    expect(
      buildQrPayload({
        type: 'wifi',
        ssid: 'Cafe;Guest',
        password: 'p:w',
        security: 'WPA',
        hidden: false,
      }),
    ).toBe('WIFI:T:WPA;S:Cafe\\;Guest;P:p\\:w;;');
    expect(buildQrPayload({ type: 'url', url: 'emojar.com' })).toBe(
      'https://emojar.com',
    );
    expect(
      buildQrPayload({
        type: 'email',
        to: 'a@b.c',
        subject: 'Hi there',
        body: '',
      }),
    ).toBe('mailto:a@b.c?subject=Hi%20there');
    expect(buildQrPayload({ type: 'phone', phone: '+49 (30) 123' })).toBe(
      'tel:+4930123',
    );
    expect(buildQrPayload({ type: 'url', url: '  ' })).toBe('');
  });
});
