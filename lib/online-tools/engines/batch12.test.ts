import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { uniqueNames } from '../image/core';
import { fmtTime, parseTime } from '../media/time';
import { ELEMENTS } from '../data/elements';
import { readability, syllablesFor } from './readability';
import { placeLabels } from './timezones';
import { parseNameDb, searchUnicode } from './unicode';

describe('readability in other languages', () => {
  it('counts syllables per language', () => {
    expect(syllablesFor('aeropuerto', 'es')).toBe(5);
    expect(syllablesFor('ciudad', 'es')).toBe(2);
    expect(syllablesFor('país', 'es')).toBe(2);
    expect(syllablesFor('Freiheit', 'de')).toBe(2);
    expect(syllablesFor('Sachtextformel', 'de')).toBe(4);
    expect(syllablesFor('beaucoup', 'fr')).toBe(2);
    expect(syllablesFor('maison', 'fr')).toBe(2);
  });
  it('applies the language formulas', () => {
    // 2 sentences, 10 words → ASL 5.
    const de = readability(
      'Der Hund läuft sehr schnell. Die Katze schläft hier.',
      'de',
    )!;
    const amstad = 180 - de.wordsPerSentence - 58.5 * (de.syllables / de.words);
    expect(de.localScores[0].name).toBe('Flesch (Amstad)');
    expect(de.localScores[0].value).toBeCloseTo(amstad, 0);
    expect(de.localScores[1].name).toBe('Wiener Sachtextformel');
    const es = readability('El perro corre. El gato duerme.', 'es')!;
    expect(es.localScores.map((s) => s.name)).toEqual([
      'Fernández Huerta',
      'Szigriszt-Pazos (INFLESZ)',
    ]);
    const fr = readability('Le chien court vite. Le chat dort.', 'fr')!;
    const km =
      207 - 1.015 * fr.wordsPerSentence - 73.6 * (fr.syllables / fr.words);
    expect(fr.localScores[0].value).toBeCloseTo(km, 0);
    expect(readability('Plain English text here.')!.localScores).toEqual([]);
  });
  it('keeps longer sentences harder in Spanish (corrected Fernández Huerta)', () => {
    const short = readability('El gato duerme. El perro come.', 'es')!;
    const long = readability(
      'El gato duerme y el perro come y la niña juega en el jardín.',
      'es',
    )!;
    expect(long.localScores[0].value).toBeLessThan(short.localScores[0].value);
  });
});

describe('unicode whole-word search', () => {
  const db = parseNameDb(
    fs.readFileSync('public/data/unicode-names-18.txt', 'utf8'),
  );
  it('ranks é first for “latin small e acute”', () => {
    const r = searchUnicode('latin small e acute', db);
    expect(r.kind === 'codepoints' && r.cps[0]).toBe(0xe9);
  });
  it('treats single letters as whole words', () => {
    const r = searchUnicode('latin small e acute', db);
    // Without the rule, every small letter with an acute (á, í, ó …) matched.
    expect(r.kind === 'codepoints' && r.cps.includes(0xe1)).toBe(false);
  });
});

describe('map labels', () => {
  it('moves or hides labels that would overlap', () => {
    const placed = placeLabels(
      [
        { x: 100, y: 100, text: 'Berlin 19:00' },
        { x: 104, y: 101, text: 'London 18:00' },
      ],
      720,
      360,
    );
    // The first label always gets a spot; the second never lands on the
    // same side (they would overlap) — it moves elsewhere or is hidden.
    expect(placed[0]).not.toBeNull();
    expect(placed[1] === null || placed[1].anchor !== placed[0]!.anchor).toBe(
      true,
    );
  });
  it('keeps labels inside the map', () => {
    const [p] = placeLabels(
      [{ x: 715, y: 180, text: 'Auckland 06:00' }],
      720,
      360,
    );
    expect(p?.anchor).toBe('end');
  });
});

describe('small helpers', () => {
  it('makes ZIP entry names unique', () => {
    expect(uniqueNames(['a.png', 'b.png', 'A.png', 'a.png'])).toEqual([
      'a.png',
      'b.png',
      'A (2).png',
      'a (3).png',
    ]);
  });
  it('parses and formats trim times', () => {
    expect(parseTime('1:15.5')).toBe(75.5);
    expect(parseTime('75.5')).toBe(75.5);
    expect(parseTime('1:02:03')).toBe(3723);
    expect(Number.isNaN(parseTime('abc'))).toBe(true);
    expect(fmtTime(75.5)).toBe('1:15.5');
    expect(fmtTime(5)).toBe('0:05.0');
  });
  it('has the corrected discovery years', () => {
    const y = (s: string) => ELEMENTS.find((e) => e.s === s)!.y;
    expect([y('F'), y('Si'), y('Ru'), y('Bh')]).toEqual([
      '1886',
      '1823',
      '1844',
      '1981',
    ]);
  });
});
