// Readability formulas for English text. Syllables are counted with a
// heuristic (vowel groups, minus silent endings), which is what most
// readability checkers do; scores can differ by a point from other tools.

export function countSyllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
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
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export function readability(text: string): Readability | null {
  const words = wordsOf(text);
  if (!words.length) return null;
  const sentenceList = splitSentences(text);
  const sentences = Math.max(1, sentenceList.length);
  const W = words.length;
  let syllables = 0;
  let complexWords = 0;
  let letters = 0;
  for (const w of words) {
    const s = countSyllables(w);
    syllables += s || 1;
    if (s >= 3) complexWords++;
    letters += (w.match(/[\p{L}\p{N}]/gu) ?? []).length;
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
    longestSentences: sentenceList
      .map((s) => ({ text: s, words: wordsOf(s).length }))
      .filter((s) => s.words >= 20)
      .sort((a, b) => b.words - a.words)
      .slice(0, 5),
  };
}
