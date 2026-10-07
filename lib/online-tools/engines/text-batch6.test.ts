import { describe, expect, it } from 'vitest';
import {
  addPrefixSuffix,
  flipText,
  graphemes,
  removeLineBreaks,
  repeatText,
  reverseText,
  slugify,
  styleText,
} from './text-more';
import { countSyllables, readability, splitSentences } from './readability';
import { cleanInvisible, scanInvisible } from './invisible';
import { SYMBOL_GROUPS, htmlEntity, searchSymbols } from './symbols';
import { TRANSFORMS } from './transforms';

describe('flip text', () => {
  it('rotates text 180° and flips back', () => {
    expect(flipText('Hello!', 'upside-down')).toBe('¡ollǝH');
    for (const s of ['Hello world! Can you read this?', 'bdpq 69 (x)', 'PMW'])
      expect(flipText(flipText(s, 'upside-down'), 'upside-down')).toBe(s);
  });

  it('mirrors each line and keeps emoji whole', () => {
    expect(flipText('abc\ndef', 'mirror')).toBe('ɔdɒ\nfɘb');
    expect(flipText('hi 👩\u200D💻', 'mirror')).toBe('👩\u200D💻 iʜ');
    expect(flipText('ab', 'letters')).toBe('ɐq');
  });
});

describe('combining styles', () => {
  it('adds one mark per character and can remove it', () => {
    const s = styleText('ab c', 'strikethrough', { spaces: false });
    expect(s).toBe('a̶b̶ c̶');
    expect(styleText('é', 'underline')).toBe('é̲');
    expect(graphemes(styleText('👍🏽', 'underline'))).toHaveLength(1);
    expect(styleText(s, 'remove')).toBe('ab c');
    // Restyling replaces the old mark instead of stacking.
    expect(styleText(s, 'underline', { spaces: true })).toBe('a̲b̲ ̲c̲');
  });
});

describe('reverse text', () => {
  it('reverses characters, words, each word and lines', () => {
    expect(reverseText('hello 🇩🇪', 'characters')).toBe('🇩🇪 olleh');
    expect(reverseText('  one two  three ', 'words')).toBe('  three two  one ');
    expect(reverseText('hello world', 'each-word')).toBe('olleh dlrow');
    expect(reverseText('a\r\nb\nc', 'lines')).toBe('c\nb\na');
  });
});

describe('text repeater', () => {
  it('repeats with separators and enforces limits', () => {
    expect(repeatText('ha', 3, '')).toBe('hahaha');
    expect(repeatText('x', '2', '\n')).toBe('x\nx');
    expect(() => repeatText('x', '0', '')).toThrow(/1 to 10,000/);
    expect(() => repeatText('x', '1.5', '')).toThrow();
    expect(() => repeatText('x'.repeat(1000), 5000, '')).toThrow(/limit/);
  });
});

describe('remove line breaks', () => {
  const text = 'line one\r\nline two\n\n  para two infor-\nmation\nJean-\nLuc';
  it('keeps paragraphs and joins hyphenated words', () => {
    expect(
      removeLineBreaks(text, 'paragraphs', {
        joinHyphens: true,
        collapseSpaces: true,
      }),
    ).toBe('line one line two\n\npara two information Jean-Luc');
  });
  it('removes every break', () => {
    expect(removeLineBreaks('a\nb\n\nc', 'space')).toBe('a b c');
    expect(removeLineBreaks('a\nb', 'none')).toBe('ab');
  });
});

describe('prefix / suffix', () => {
  it('numbers lines with {n} and skips empty lines', () => {
    expect(addPrefixSuffix('a\n\nb', '{n}. ', ';', { skipEmpty: true })).toBe(
      '1. a;\n\n2. b;',
    );
    expect(addPrefixSuffix(' a ', '"', '",', { trim: true })).toBe('"a",');
  });
});

describe('slugify', () => {
  it('transliterates and cleans titles', () => {
    expect(slugify('Crème Brûlée & Straße!')).toBe('creme-brulee-strasse');
    expect(slugify('Why Don’t Cats Like Water?')).toBe(
      'why-dont-cats-like-water',
    );
    expect(slugify('Næstved Øl Łódź', { separator: '_' })).toBe(
      'naestved_ol_lodz',
    );
    expect(slugify('The Best of the Web', { stopWords: true })).toBe(
      'best-web',
    );
    expect(slugify('one two three four', { maxLength: 9 })).toBe('one-two');
    expect(slugify('Привет мир')).toBe('привет-мир');
    expect(slugify('Next.js 15', { lowercase: false })).toBe('Next-js-15');
  });
});

describe('readability', () => {
  it('counts syllables with the usual heuristic', () => {
    expect(countSyllables('the')).toBe(1);
    expect(countSyllables('make')).toBe(1);
    expect(countSyllables('table')).toBe(2);
    expect(countSyllables('readability')).toBe(5);
  });

  it('matches the Flesch formulas on a known sentence', () => {
    const r = readability('The cat sat on the mat.')!;
    expect(r.words).toBe(6);
    expect(r.sentences).toBe(1);
    expect(r.syllables).toBe(6);
    expect(r.fleschReadingEase).toBeCloseTo(116.1, 1);
    expect(r.fleschKincaidGrade).toBeCloseTo(-1.4, 1);
    expect(r.level.label).toBe('Very easy');
    expect(readability('   ')).toBeNull();
  });

  it('splits sentences and lists long ones', () => {
    expect(splitSentences('One. Two! Three?\n\nFour')).toEqual([
      'One.',
      'Two!',
      'Three?',
      'Four',
    ]);
    const long = `${'word '.repeat(25).trim()}. Short one.`;
    expect(readability(long)!.longestSentences[0].words).toBe(25);
  });
});

describe('invisible characters', () => {
  it('finds hidden characters but keeps emoji joiners', () => {
    const text = 'a\u200Bb\u00A0c 👩\u200D💻 \u3164';
    const scan = scanInvisible(text);
    expect(scan.total).toBe(3);
    expect(scan.findings.map((f) => f.short).sort()).toEqual(
      ['HF', 'NBSP', 'ZWSP'].sort(),
    );
    expect(cleanInvisible(text)).toBe('ab c 👩\u200D💻 ');
    expect(cleanInvisible('a\u2003b', { spacesToNormal: false })).toBe('ab');
  });

  it('keeps flag tag sequences intact', () => {
    const england = '🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}';
    expect(scanInvisible(england).total).toBe(0);
    expect(scanInvisible('hi\u{E0041}').total).toBe(1);
    // A run of tag characters outside a flag is a hidden message: report all.
    const hidden = 'hi\u{E0041}\u{E0042}\u{E0043}';
    expect(scanInvisible(hidden).total).toBe(3);
    expect(cleanInvisible(hidden)).toBe('hi');
  });
});

describe('symbols', () => {
  it('has unique symbols with names and searches by name', () => {
    const all = SYMBOL_GROUPS.flatMap((g) => g.symbols);
    expect(all.length).toBeGreaterThan(500);
    expect(new Set(all.map((s) => s.char)).size).toBe(all.length);
    all.forEach((s) => expect(s.name.length, s.char).toBeGreaterThan(2));
    const hits = searchSymbols('check', 'all').flatMap((g) => g.symbols);
    expect(hits.some((s) => s.char === '✓')).toBe(true);
    expect(searchSymbols('', 'currency')).toHaveLength(1);
    expect(htmlEntity('✓')).toBe('&#x2713;');
  });
});

describe('transform wiring', () => {
  it('registers the new text transforms', () => {
    expect(TRANSFORMS.slug.run('Hello World', { separator: '-' })).toBe(
      'hello-world',
    );
    expect(
      TRANSFORMS['repeat-text'].run('a', {
        count: '3',
        separator: 'custom',
        custom: '-',
      }),
    ).toBe('a-a-a');
  });
});
