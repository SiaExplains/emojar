// Readability formulas for English, German, Spanish and French text.
// Syllables are counted with per-language heuristics (vowel groups, minus
// silent endings, diphthongs as one), which is what most readability
// checkers do; scores can differ by a point from other tools.

export type ReadabilityLang = 'en' | 'de' | 'es' | 'fr';

export function countSyllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** German: ä/ö/ü are vowels; ei, ai, au, eu, äu, ie and doubled vowels are one syllable. */
function syllablesDe(word: string): number {
  const w = word.toLowerCase().replace(/[^a-zäöüß]/g, '');
  if (!w) return 0;
  const groups = w
    .replace(/(?:äu|eu|ei|ai|au|ie|aa|ee|oo)/g, 'a')
    .match(/[aeiouyäöü]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Spanish: weak vowels (i, u) next to another vowel form a diphthong; two strong vowels split. */
function syllablesEs(word: string): number {
  const w = word
    .toLowerCase()
    .replace(/[^a-záéíóúüñ]/g, '')
    .replace(/qu|gu(?=[eéií])/g, 'q');
  if (!w) return 0;
  let n = 0;
  const groups = w.match(/[aeiouáéíóúü]+/g) ?? [];
  for (const g of groups) {
    // Accented í/ú break a diphthong (pa-ís); strong+strong is a hiatus.
    let count = 1;
    for (let i = 1; i < g.length; i++) {
      const a = g[i - 1];
      const b = g[i];
      const strong = (c: string) => 'aeoáéóíú'.includes(c);
      if (strong(a) && strong(b)) count++;
    }
    n += count;
  }
  return Math.max(1, n);
}

/** French: final mute e/es/ent are silent; vowel clusters (ai, au, eau, ou, oi…) are one. */
function syllablesFr(word: string): number {
  let w = word.toLowerCase().replace(/[^a-zàâäéèêëîïôöûùüÿœæç]/g, '');
  if (!w) return 0;
  if (w.length > 3) w = w.replace(/(?:e|es|ent)$/, '');
  const groups = w.match(/[aeiouyàâäéèêëîïôöûùüÿœæ]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function syllablesFor(word: string, lang: ReadabilityLang): number {
  return lang === 'de'
    ? syllablesDe(word)
    : lang === 'es'
      ? syllablesEs(word)
      : lang === 'fr'
        ? syllablesFr(word)
        : countSyllables(word);
}

/** Sentences: split after . ! ? (and …) or at blank lines / line breaks. */
export function splitSentences(text: string): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/(?<=[.!?…])["')\]]*\s+|\n\s*\n|\n(?=\s*[-*•\d])/)
    .map((s) => s.trim())
    .filter((s) => /[\p{L}\p{N}]/u.test(s));
}

export function wordsOf(text: string): string[] {
  return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];
}

export type ReadingLevel = {
  label: string;
  grade: string;
  min: number;
};

// Flesch Reading Ease bands (Flesch 1948, as commonly tabulated).
export const FLESCH_BANDS: ReadingLevel[] = [
  { min: 90, label: 'Very easy', grade: '5th grade' },
  { min: 80, label: 'Easy', grade: '6th grade' },
  { min: 70, label: 'Fairly easy', grade: '7th grade' },
  { min: 60, label: 'Plain English', grade: '8th–9th grade' },
  { min: 50, label: 'Fairly difficult', grade: '10th–12th grade' },
  { min: 30, label: 'Difficult', grade: 'College' },
  { min: -Infinity, label: 'Very difficult', grade: 'College graduate' },
];

/** A score from a language-specific formula, with how to read it. */
export type LocalScore = {
  name: string;
  value: number;
  /** Plain-language band, e.g. “Fairly easy”. */
  band: string;
  scale: string;
};

const band = (bands: [number, string][], v: number) =>
  bands.find(([min]) => v >= min)?.[1] ?? bands[bands.length - 1][1];

// Flesch-style 0–100 bands, as used for the Amstad, Fernández Huerta and
// Kandel–Moles adaptations.
const EASE_BANDS: [number, string][] = [
  [90, 'Very easy'],
  [80, 'Easy'],
  [70, 'Fairly easy'],
  [60, 'Standard'],
  [50, 'Fairly difficult'],
  [30, 'Difficult'],
  [-Infinity, 'Very difficult'],
];
// INFLESZ scale for Szigriszt-Pazos (Barrio-Cantalejo et al., 2008).
const INFLESZ_BANDS: [number, string][] = [
  [80, 'Very easy'],
  [65, 'Fairly easy'],
  [55, 'Normal'],
  [40, 'Somewhat difficult'],
  [-Infinity, 'Very difficult'],
];

export type Readability = {
  words: number;
  sentences: number;
  syllables: number;
  letters: number;
  complexWords: number;
  wordsPerSentence: number;
  syllablesPerWord: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smog: number;
  colemanLiau: number;
  ari: number;
  /** Mean of the five grade-level formulas. */
  averageGrade: number;
  level: ReadingLevel;
  longestSentences: { text: string; words: number }[];
  lang: ReadabilityLang;
  /** Scores from formulas made for this language (empty for English). */
  localScores: LocalScore[];
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function readability(
  text: string,
  lang: ReadabilityLang = 'en',
): Readability | null {
  const words = wordsOf(text);
  if (!words.length) return null;
  const sentenceList = splitSentences(text);
  const sentences = Math.max(1, sentenceList.length);
  const W = words.length;
  let syllables = 0;
  let complexWords = 0;
  let letters = 0;
  let oneSyllable = 0;
  let longWords = 0;
  for (const w of words) {
    const s = syllablesFor(w, lang);
    syllables += s || 1;
    if (s >= 3) complexWords++;
    if (s <= 1) oneSyllable++;
    const len = (w.match(/[\p{L}\p{N}]/gu) ?? []).length;
    if (len > 6) longWords++;
    letters += len;
  }
  const wps = W / sentences;
  const spw = syllables / W;
  const fre = 206.835 - 1.015 * wps - 84.6 * spw;
  const fk = 0.39 * wps + 11.8 * spw - 15.59;
  const fog = 0.4 * (wps + 100 * (complexWords / W));
  const smog = 1.043 * Math.sqrt(complexWords * (30 / sentences)) + 3.1291;
  const L = (letters / W) * 100;
  const S = (sentences / W) * 100;
  const cli = 0.0588 * L - 0.296 * S - 15.8;
  const ari = 4.71 * (letters / W) + 0.5 * wps - 21.43;
  const grades = [fk, fog, smog, cli, ari];
  const level = FLESCH_BANDS.find((b) => fre >= b.min)!;
  const localScores: LocalScore[] = [];
  if (lang === 'de') {
    // Amstad (1978): Flesch adapted to German.
    const amstad = 180 - wps - 58.5 * spw;
    // 1st Wiener Sachtextformel (Bamberger & Vanecek, 1984); inputs in %.
    const pct = (n: number) => (n / W) * 100;
    const wstf =
      0.1935 * pct(complexWords) +
      0.1672 * wps +
      0.1297 * pct(longWords) -
      0.0327 * pct(oneSyllable) -
      0.875;
    localScores.push(
      {
        name: 'Flesch (Amstad)',
        value: round1(amstad),
        band: band(EASE_BANDS, amstad),
        scale: '0–100, higher is easier',
      },
      {
        name: 'Wiener Sachtextformel',
        value: round1(wstf),
        band:
          wstf < 6
            ? 'Easy (school year 4–5)'
            : wstf < 9
              ? 'Plain (school year 6–8)'
              : wstf < 12
                ? 'Demanding (school year 9–11)'
                : 'Very difficult (academic)',
        scale: 'German school year, about 4–15',
      },
    );
  } else if (lang === 'es') {
    // Fernández Huerta (1959), in the corrected form that uses words per
    // sentence like Flesch (the often-quoted version has the term inverted).
    const fh = 206.84 - 60 * spw - 1.02 * wps;
    // Szigriszt-Pazos perspicuity (1993), read on the INFLESZ scale.
    const sp = 206.835 - 62.3 * spw - wps;
    localScores.push(
      {
        name: 'Fernández Huerta',
        value: round1(fh),
        band: band(EASE_BANDS, fh),
        scale: '0–100, higher is easier',
      },
      {
        name: 'Szigriszt-Pazos (INFLESZ)',
        value: round1(sp),
        band: band(INFLESZ_BANDS, sp),
        scale: '0–100, 55–65 is normal',
      },
    );
  } else if (lang === 'fr') {
    // Kandel & Moles (1958): Flesch adapted to French.
    const km = 207 - 1.015 * wps - 73.6 * spw;
    localScores.push({
      name: 'Kandel–Moles',
      value: round1(km),
      band: band(EASE_BANDS, km),
      scale: '0–100, higher is easier',
    });
  }

  return {
    words: W,
    sentences,
    syllables,
    letters,
    complexWords,
    wordsPerSentence: round1(wps),
    syllablesPerWord: Math.round(spw * 100) / 100,
    fleschReadingEase: round1(fre),
    fleschKincaidGrade: round1(fk),
    gunningFog: round1(fog),
    smog: round1(smog),
    colemanLiau: round1(cli),
    ari: round1(ari),
    averageGrade: round1(grades.reduce((a, b) => a + b, 0) / grades.length),
    level,
    lang,
    localScores,
    longestSentences: sentenceList
      .map((s) => ({ text: s, words: wordsOf(s).length }))
      .filter((s) => s.words >= 20)
      .sort((a, b) => b.words - a.words)
      .slice(0, 5),
  };
}
