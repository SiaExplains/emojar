import { describe, expect, it } from 'vitest';
import {
  articleSchema,
  buildUtmUrl,
  extractJsonLd,
  faqSchema,
  inspectJsonLd,
  isIsoDateTime,
  scriptTag,
  type ArticleInput,
} from './seo-schema';
import {
  findRepeatedWords,
  formatDuration,
  keywordDensity,
  phraseCount,
  readingStats,
  removeRepeats,
  sentenceReport,
  splitSentences,
} from './text-analysis';
import { generateJsonSchema } from './json-schema';
import { jsonToToml, tomlKey, tomlString } from './toml';
import { htmlToJsx, styleToObject } from './html-jsx';
import {
  compareCells,
  detectDelimiter,
  escapeCell,
  queryRows,
  readCsv,
  toCsv,
  toMarkdownTable,
} from './tables';
import { convertLines, formatDate, parseDate, weekday } from './date-format';
import { extractPalette, sourcePixel } from './image-colors';
import { CALCULATORS } from './calculators';

const utm = (o: Partial<Record<string, string>> = {}) => ({
  utm_source: 'newsletter',
  utm_medium: 'email',
  utm_campaign: 'spring_sale',
  utm_term: '',
  utm_content: '',
  ...o,
});

describe('UTM builder', () => {
  it('keeps existing parameters and the fragment', () => {
    const r = buildUtmUrl(
      'https://shop.example.com/p?id=7&ref=x#reviews',
      utm(),
    );
    expect(r.ok && r.url).toBe(
      'https://shop.example.com/p?id=7&ref=x&utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale#reviews',
    );
  });

  it('replaces duplicate UTM keys and reports them', () => {
    const r = buildUtmUrl(
      'example.com/?utm_source=old&utm_source=older&a=1',
      utm({ utm_source: 'new' }),
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.url).toBe(
      'https://example.com/?utm_source=new&a=1&utm_medium=email&utm_campaign=spring_sale',
    );
    expect(r.replaced).toEqual(['utm_source']);
  });

  it('encodes values and warns about capitals and spaces', () => {
    const r = buildUtmUrl(
      'https://a.com',
      utm({ utm_campaign: 'Black Friday & more' }),
    );
    expect(r.ok && r.url).toContain('utm_campaign=Black+Friday+%26+more');
    expect(r.ok && r.warnings.length).toBe(2);
  });

  it('validates the URL and required fields', () => {
    expect(buildUtmUrl('', utm()).ok).toBe(false);
    expect(buildUtmUrl('not a url', utm()).ok).toBe(false);
    expect(buildUtmUrl('javascript:alert(1)', utm()).ok).toBe(false);
    const r = buildUtmUrl('https://a.com', utm({ utm_medium: '' }));
    expect(!r.ok && r.error).toMatch(/medium/);
  });
});

describe('schema generators', () => {
  it('builds FAQPage JSON-LD with escaping', () => {
    const r = faqSchema([
      { question: 'Is it "free"?', answer: 'Yes </script> really' },
      { question: '', answer: '' },
    ]);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const data = JSON.parse(r.json);
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(1);
    expect(data.mainEntity[0].acceptedAnswer.text).toBe('Yes </script> really');
    expect(scriptTag(r.json)).not.toMatch(/<\/script> really/);
    expect(faqSchema([{ question: 'Q', answer: '' }]).ok).toBe(false);
    expect(faqSchema([]).ok).toBe(false);
  });

  const article: ArticleInput = {
    type: 'BlogPosting',
    headline: 'How to brew coffee',
    description: '',
    url: 'https://example.com/coffee',
    images: 'https://example.com/a.jpg\nhttps://example.com/b.jpg',
    authorName: 'Ada',
    authorType: 'Person',
    authorUrl: '',
    publisherName: 'Example',
    publisherLogo: 'https://example.com/logo.png',
    datePublished: '2026-10-14',
    dateModified: '2026-10-14T09:30:00+02:00',
  };

  it('builds Article JSON-LD with only filled fields', () => {
    const r = articleSchema(article);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const d = JSON.parse(r.json);
    expect(d['@type']).toBe('BlogPosting');
    expect(d.image).toHaveLength(2);
    expect(d.author).toEqual({ '@type': 'Person', name: 'Ada' });
    expect(d.description).toBeUndefined();
    expect(d.publisher.logo.url).toBe('https://example.com/logo.png');
  });

  it('validates dates and URLs', () => {
    expect(isIsoDateTime('2024-02-29')).toBe(true);
    expect(isIsoDateTime('2026-02-29')).toBe(false);
    expect(isIsoDateTime('2026-10-14T25:00')).toBe(false);
    expect(articleSchema({ ...article, datePublished: '14/10/2026' }).ok).toBe(
      false,
    );
    expect(articleSchema({ ...article, url: 'example.com' }).ok).toBe(false);
    expect(articleSchema({ ...article, headline: ' ' }).ok).toBe(false);
    const r = articleSchema({ ...article, dateModified: '2026-01-01' });
    expect(r.ok && r.warnings.join()).toMatch(/earlier/);
  });
});

describe('JSON-LD inspector', () => {
  it('reads script tags and finds types and contexts', () => {
    const html = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q"}]}</script>`;
    expect(extractJsonLd(html)).toHaveLength(1);
    const r = inspectJsonLd(html);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.contexts).toEqual(['https://schema.org']);
    expect(r.nodes.map((n) => n.types[0])).toEqual(['FAQPage', 'Question']);
    expect(r.issues.some((i) => /acceptedAnswer/.test(i.message))).toBe(true);
  });

  it('reports syntax errors with a location and common mistakes', () => {
    const bad = inspectJsonLd('{"@type": "Thing",\n "name": }');
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.line).toBe(2);
    const r = inspectJsonLd(
      '{"@type":"Article","datePublished":"14/10/2026","@foo":1,"url":"/rel"}',
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const msgs = r.issues.map((i) => i.message).join('\n');
    expect(msgs).toMatch(/No @context/);
    expect(msgs).toMatch(/headline/);
    expect(msgs).toMatch(/ISO 8601/);
    expect(msgs).toMatch(/@foo/);
    expect(msgs).toMatch(/absolute/);
  });
});

describe('text analysis', () => {
  it('computes reading and speaking time', () => {
    const r = readingStats('word '.repeat(476), 238, 150);
    expect(r.words).toBe(476);
    expect(r.readingMinutes).toBe(2);
    expect(formatDuration(2)).toBe('2 min');
    expect(formatDuration(3.5)).toBe('3 min 30 sec');
    expect(formatDuration(0.1)).toBe('6 sec');
    expect(formatDuration(75)).toBe('1 h 15 min');
    expect(readingStats('', 200, 150).words).toBe(0);
    // CJK characters count individually.
    expect(readingStats('日本語のテキスト', 200, 150).words).toBe(8);
  });

  it('counts keyword density, phrases and stop words', () => {
    const text =
      'Coffee beans. The best coffee beans are fresh coffee beans! Fresh is best.';
    const one = keywordDensity(text, { excludeStopWords: true });
    expect(one.totalWords).toBe(13);
    expect(one.rows[0]).toMatchObject({ phrase: 'beans', count: 3 });
    expect(one.rows.find((r) => r.phrase === 'the')).toBeUndefined();
    const two = keywordDensity(text, { phraseLength: 2 });
    expect(two.rows[0]).toMatchObject({ phrase: 'coffee beans', count: 3 });
    // 3 occurrences × 2 words ÷ 13 words.
    expect(two.rows[0].density).toBeCloseTo((6 / 13) * 100, 5);
    // Phrases don't cross sentence breaks ("beans the").
    expect(two.rows.find((r) => r.phrase === 'beans the')).toBeUndefined();
    expect(phraseCount(text, 'Coffee Beans')).toBe(3);
    expect(keywordDensity('').rows).toEqual([]);
  });

  it('finds repeated words but not legitimate doubles or across punctuation', () => {
    const t =
      'I saw the the cat. Well, well. He had had enough. And and then\nthen it ended.';
    const r = findRepeatedWords(t);
    expect(r.map((x) => x.word)).toEqual(['the', 'and', 'then']);
    expect(t.slice(r[0].firstStart, r[0].end)).toBe('the the');
    expect(findRepeatedWords('he had had it', true).map((x) => x.word)).toEqual(
      ['had'],
    );
    expect(
      removeRepeats(
        'And and then\nthen it.',
        findRepeatedWords('And and then\nthen it.'),
      ),
    ).toBe('And then\nit.');
    expect(
      removeRepeats(
        'I saw the the cat',
        findRepeatedWords('I saw the the cat'),
      ),
    ).toBe('I saw the cat');
  });

  it('splits sentences around abbreviations, initials and decimals', () => {
    const t =
      'Dr. Smith paid $3.50 for coffee, e.g. a latte. J. R. R. Tolkien wrote books! Did you know? Yes.';
    expect(splitSentences(t).map((s) => s.text)).toEqual([
      'Dr. Smith paid $3.50 for coffee, e.g. a latte.',
      'J. R. R. Tolkien wrote books!',
      'Did you know?',
      'Yes.',
    ]);
    const r = sentenceReport(t, 6);
    expect(r.count).toBe(4);
    expect(r.overLimit).toBe(1);
    expect(r.longest[0].words).toBe(10);
    expect(sentenceReport('', 20).count).toBe(0);
    expect(splitSentences('Heading\n\nBody text here.').length).toBe(2);
  });
});

describe('JSON Schema generator', () => {
  it('infers nested objects, arrays and required keys', () => {
    const s = JSON.parse(
      generateJsonSchema(
        JSON.stringify({
          id: 1,
          price: 9.5,
          name: 'A',
          tags: ['x'],
          created: '2026-10-14T09:00:00Z',
          owner: null,
          items: [
            { sku: 'a', qty: 1 },
            { sku: 'b', note: 'gift' },
          ],
        }),
      ),
    );
    expect(s.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(s.properties.id).toEqual({ type: 'integer' });
    expect(s.properties.price).toEqual({ type: 'number' });
    expect(s.properties.created.format).toBe('date-time');
    expect(s.properties.owner).toEqual({ type: 'null' });
    expect(s.properties.tags).toEqual({
      type: 'array',
      items: { type: 'string' },
    });
    const items = s.properties.items.items;
    expect(items.required).toEqual(['sku']);
    expect(Object.keys(items.properties)).toEqual(['sku', 'qty', 'note']);
  });

  it('handles mixed arrays, drafts and errors', () => {
    const s = JSON.parse(
      generateJsonSchema('[1, "a", null, 2.5]', { draft: '07' }),
    );
    expect(s.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(s.items.type).toEqual(['number', 'string', 'null']);
    const mixed = JSON.parse(generateJsonSchema('[{"a":1}, [1]]'));
    expect(mixed.items.anyOf).toHaveLength(2);
    expect(JSON.parse(generateJsonSchema('[]')).items).toEqual({});
    expect(() => generateJsonSchema('{bad')).toThrow(/Invalid JSON/);
  });
});

describe('JSON to TOML', () => {
  it('writes tables, arrays of tables and inline values', () => {
    const { toml } = jsonToToml(
      JSON.stringify({
        title: 'App',
        'my key': 'v',
        port: 8080,
        ratio: 0.5,
        tags: ['a', 'b'],
        server: { host: 'localhost', tls: { enabled: true } },
        users: [{ name: 'Ada' }, { name: 'Linus', roles: ['admin'] }],
        matrix: [[1, 2], [3]],
        mixed: [1, { a: 1 }],
      }),
    );
    expect(toml).toBe(
      [
        'title = "App"',
        '"my key" = "v"',
        'port = 8080',
        'ratio = 0.5',
        'tags = ["a", "b"]',
        'matrix = [[1, 2], [3]]',
        'mixed = [1, { a = 1 }]',
        '',
        '[server]',
        'host = "localhost"',
        '',
        '[server.tls]',
        'enabled = true',
        '',
        '[[users]]',
        'name = "Ada"',
        '',
        '[[users]]',
        'name = "Linus"',
        'roles = ["admin"]',
        '',
      ].join('\n'),
    );
  });

  it('escapes keys and strings', () => {
    expect(tomlKey('a.b')).toBe('"a.b"');
    expect(tomlKey('ok_key-1')).toBe('ok_key-1');
    expect(tomlString('say "hi"\n\t\\ \u0001')).toBe(
      '"say \\"hi\\"\\n\\t\\\\ \\u0001"',
    );
  });

  it('refuses nulls unless asked, and never drops array items', () => {
    expect(() => jsonToToml('{"a": null}')).toThrow(/no null/);
    const r = jsonToToml('{"a": null, "b": {"c": null, "d": 1}}', {
      nulls: 'omit',
    });
    expect(r.omitted).toEqual(['a', 'b.c']);
    expect(r.toml).toBe('[b]\nd = 1\n');
    expect(() => jsonToToml('{"a": [1, null]}', { nulls: 'omit' })).toThrow(
      /array/,
    );
    expect(() => jsonToToml('[1]')).toThrow(/top level/);
    expect(() => jsonToToml('"x"')).toThrow(/top level/);
    expect(jsonToToml('{"f": 1.0}').notes).toHaveLength(1);
  });
});

describe('HTML to JSX', () => {
  it('converts attributes, styles, void elements and comments', () => {
    const { jsx } = htmlToJsx(
      '<div class="box" style="color: red; font-size:12px; -webkit-transition: none; --gap: 4px"><label for="e">E</label><input id="e" type="checkbox" checked disabled><br><img src="a.png" alt=""><!-- note --></div>',
    );
    expect(jsx).toBe(
      `<div className="box" style={{ color: 'red', fontSize: '12px', WebkitTransition: 'none', '--gap': '4px' }}><label htmlFor="e">E</label><input id="e" type="checkbox" defaultChecked disabled /><br /><img src="a.png" alt="" />{/* note */}</div>`,
    );
  });

  it('escapes braces, keeps SVG case and closes tags', () => {
    expect(htmlToJsx('<p>a {b} > c').jsx).toBe("<p>a {'{'}b{'}'} &gt; c</p>");
    expect(
      htmlToJsx(
        '<svg viewBox="0 0 1 1"><path stroke-width="2" xlink:href="#a"/><linearGradient></linearGradient></svg>',
      ).jsx,
    ).toBe(
      '<svg viewBox="0 0 1 1"><path strokeWidth="2" xlinkHref="#a" /><linearGradient></linearGradient></svg>',
    );
    expect(htmlToJsx('<ul><li>a<li>b</ul>').jsx).toBe(
      '<ul><li>a</li><li>b</li></ul>',
    );
    const ev = htmlToJsx('<button onclick="go()">Go</button>');
    expect(ev.jsx).toBe('<button onClick={() => { /* go() */ }}>Go</button>');
    expect(ev.notes.length).toBe(1);
    expect(htmlToJsx('<a title=\'say "hi"\'>x</a>').jsx).toBe(
      '<a title={"say \\"hi\\""}>x</a>',
    );
  });

  it('wraps multiple roots and builds a component', () => {
    expect(htmlToJsx('<h1>A</h1><p>B</p>', { fragment: true }).jsx).toBe(
      '<>\n<h1>A</h1><p>B</p>\n</>',
    );
    expect(htmlToJsx('<h1>A</h1><p>B</p>').notes.join()).toMatch(/fragment/);
    expect(htmlToJsx('<h1>A</h1><p>B</p>', { component: 'X' }).jsx).toContain(
      '<>',
    );
    expect(htmlToJsx('<b>x</b>', { component: 'Hello' }).jsx).toBe(
      'export default function Hello() {\n  return (\n    <b>x</b>\n  );\n}',
    );
    expect(styleToObject('background: url("a;b.png"); opacity: 0.5')).toBe(
      `{{ background: 'url("a;b.png")', opacity: 0.5 }}`,
    );
  });
});

describe('tables and CSV', () => {
  it('builds escaped, aligned Markdown tables', () => {
    expect(escapeCell('a|b\nc\\d')).toBe('a\\|b<br>c\\\\d');
    expect(escapeCell('`C:\\temp` or C:\\temp')).toBe(
      '`C:\\temp` or C:\\\\temp',
    );
    expect(
      toMarkdownTable(
        ['Name', 'Qty'],
        [['Apple', '3'], ['Kiwi']],
        ['left', 'right'],
      ),
    ).toBe(
      [
        '| Name  | Qty |',
        '| :---- | --: |',
        '| Apple |   3 |',
        '| Kiwi  |     |',
      ].join('\n'),
    );
    expect(toMarkdownTable(['', 'B'], [], ['center'], false)).toBe(
      '| Column 1 | B |\n| :-: | --- |',
    );
  });

  it('reads CSV with BOM, quotes, newlines and other delimiters', () => {
    const t = readCsv(
      '﻿name,note\n"Smith, J","said ""hi""\nthen left"\nLee,ok\n',
    );
    expect(t.header).toEqual(['name', 'note']);
    expect(t.rows).toEqual([
      ['Smith, J', 'said "hi"\nthen left'],
      ['Lee', 'ok'],
    ]);
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
    expect(detectDelimiter('a\tb\n1\t2')).toBe('\t');
    expect(readCsv('a,b\n1', { header: false }).header).toEqual([
      'Column 1',
      'Column 2',
    ]);
    expect(readCsv('a,b\n1').ragged).toBe(1);
    expect(() => readCsv('  ')).toThrow();
    expect(() => readCsv('"open')).toThrow(/never closed/);
  });

  it('writes CSV safely and sorts and filters rows', () => {
    expect(toCsv(['a'], [['=1+1'], ['x,y'], ['-5']])).toBe(
      `a\r\n'=1+1\r\n"x,y"\r\n-5`,
    );
    expect(compareCells('10', '9')).toBeGreaterThan(0);
    expect(compareCells('1,200', '950')).toBeGreaterThan(0);
    expect(compareCells('file2', 'file10')).toBeLessThan(0);
    const rows = [
      ['b', '2'],
      ['a', '10'],
      ['c', ''],
      ['A', '1'],
    ];
    expect(
      queryRows(rows, {
        search: '',
        filters: {},
        sort: { col: 1, dir: 'desc' },
      }),
    ).toEqual([1, 0, 3, 2]);
    expect(queryRows(rows, { search: 'a', filters: {}, sort: null })).toEqual([
      1, 3,
    ]);
    expect(
      queryRows(rows, { search: '', filters: { 1: '1' }, sort: null }),
    ).toEqual([1, 3]);
  });
});

describe('date format converter', () => {
  it('detects unambiguous formats and reports ambiguous ones', () => {
    expect(parseDate('14/10/2026', 'auto')).toMatchObject({
      ok: true,
      value: { y: 2026, m: 10, d: 14 },
    });
    expect(parseDate('10/14/2026', 'auto')).toMatchObject({
      ok: true,
      value: { y: 2026, m: 10, d: 14 },
    });
    const amb = parseDate('03/04/2026', 'auto');
    expect(amb.ok).toBe(false);
    if (!amb.ok) expect(amb.candidates).toHaveLength(2);
    expect(parseDate('05/05/2026', 'auto').ok).toBe(true);
    expect(parseDate('03/04/2026', 'mdy-slash')).toMatchObject({
      ok: true,
      value: { m: 3, d: 4 },
    });
    expect(parseDate('14 Oct 2026', 'auto')).toMatchObject({
      ok: true,
      value: { m: 10, d: 14 },
    });
    expect(parseDate('October 14th, 2026', 'auto')).toMatchObject({ ok: true });
  });

  it('validates leap years and rejects times', () => {
    expect(parseDate('29/02/2024', 'dmy-slash').ok).toBe(true);
    const r = parseDate('29/02/2026', 'dmy-slash');
    expect(!r.ok && r.error).toMatch(/not a leap year/);
    expect(parseDate('2026-13-01', 'auto').ok).toBe(false);
    expect(parseDate('2026-10-14T10:00', 'auto').ok).toBe(false);
    expect(parseDate('31/12/99', 'dmy-short')).toMatchObject({
      ok: true,
      value: { y: 1999 },
    });
  });

  it('formats without time-zone shifts', () => {
    const v = { y: 2026, m: 1, d: 1 };
    expect(formatDate(v, 'iso')).toBe('2026-01-01');
    expect(formatDate(v, 'mdy-slash')).toBe('01/01/2026');
    expect(formatDate(v, 'weekday-long')).toBe('Thursday, 1 January 2026');
    expect(weekday({ y: 2000, m: 2, d: 29 })).toBe('Tuesday');
    expect(weekday({ y: 1, m: 1, d: 1 })).toBe('Monday');
    const lines = convertLines('2026-10-14\n\nnope', 'auto', 'dmy-dot');
    expect(lines.map((l) => l.output)).toEqual(['14.10.2026', '', '']);
    expect(lines[2].error).toBeTruthy();
  });
});

describe('image colours', () => {
  it('extracts dominant colours by share and skips transparent pixels', () => {
    const px: number[] = [];
    for (let i = 0; i < 300; i++) px.push(255, 0, 0, 255);
    for (let i = 0; i < 100; i++) px.push(0, 0, 255, 255);
    for (let i = 0; i < 50; i++) px.push(0, 255, 0, 0);
    const pal = extractPalette(new Uint8ClampedArray(px), 3);
    expect(pal.length).toBe(2);
    expect(pal[0]).toMatchObject({ r: 255, g: 0, b: 0 });
    expect(pal[0].share).toBeCloseTo(0.75, 2);
    expect(extractPalette(new Uint8ClampedArray([0, 0, 0, 0]), 5)).toEqual([]);
  });

  it('maps scaled pointer positions to source pixels', () => {
    const rect = { left: 10, top: 20, width: 200, height: 100 };
    const nat = { width: 4000, height: 2000 };
    expect(sourcePixel(10, 20, rect, nat)).toEqual({ x: 0, y: 0 });
    expect(sourcePixel(110, 70, rect, nat)).toEqual({ x: 2000, y: 1000 });
    expect(sourcePixel(209.99, 119.99, rect, nat)).toEqual({
      x: 3999,
      y: 1999,
    });
    expect(sourcePixel(5, 50, rect, nat)).toBeNull();
  });
});

describe('DPI and percentage difference calculators', () => {
  const run = (id: string, v: Record<string, string>) =>
    CALCULATORS[id].compute(v);

  it('converts pixels, DPI and print size', () => {
    const size = run('dpi', {
      mode: 'size',
      wpx: '3000',
      hpx: '2000',
      dpi: '300',
      unit: 'cm',
    });
    expect(size.ok && size.results[0].value).toBe('25.4 × 16.93 cm');
    const px = run('dpi', {
      mode: 'pixels',
      w: '6',
      h: '4',
      dpi: '300',
      unit: 'in',
    });
    expect(px.ok && px.results[0].value).toBe('1,800 × 1,200 px');
    const dpi = run('dpi', {
      mode: 'dpi',
      wpx: '3000',
      hpx: '2000',
      w: '20',
      h: '10',
      unit: 'in',
    });
    expect(dpi.ok && dpi.results[0].value).toBe('150 DPI');
    expect(dpi.ok && dpi.note).toMatch(/different shapes/);
    expect(
      run('dpi', { mode: 'size', wpx: '0', hpx: '10', dpi: '300', unit: 'in' })
        .ok,
    ).toBe(false);
    expect(
      run('dpi', { mode: 'size', wpx: '10', hpx: '10', dpi: '-1', unit: 'in' })
        .ok,
    ).toBe(false);
  });

  it('handles change, symmetric difference, zero and negatives', () => {
    const r = run('percentage-difference', { a: '50', b: '75', decimals: '2' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const val = (l: RegExp) => r.results.find((x) => l.test(x.label))?.value;
    expect(val(/Absolute/)).toBe('25.00');
    expect(val(/change/)).toBe('+50.00% (increase)');
    expect(val(/symmetric/)).toBe('40.00%');
    const z = run('percentage-difference', { a: '0', b: '10', decimals: '1' });
    expect(z.ok && z.results.find((x) => /change/.test(x.label))?.value).toBe(
      'Undefined',
    );
    expect(
      z.ok && z.results.find((x) => /symmetric/.test(x.label))?.value,
    ).toBe('200.0%');
    const both = run('percentage-difference', {
      a: '0',
      b: '0',
      decimals: '0',
    });
    expect(both.ok && both.note).toMatch(/Both values are 0/);
    const neg = run('percentage-difference', {
      a: '-20',
      b: '-10',
      decimals: '0',
    });
    expect(
      neg.ok && neg.results.find((x) => /change/.test(x.label))?.value,
    ).toBe('+50% (increase)');
    const signs = run('percentage-difference', {
      a: '-5',
      b: '5',
      decimals: '0',
    });
    expect(signs.ok && signs.note).toMatch(/opposite signs/);
    expect(
      run('percentage-difference', { a: '', b: '1', decimals: '2' }).ok,
    ).toBe(false);
  });
});
