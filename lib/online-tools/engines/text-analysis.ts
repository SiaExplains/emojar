// Local text analysis for the writing tools: reading time, keyword density,
// repeated words and sentence length. Heuristic by design and documented as
// such on the tool pages — nothing here is search or ranking data.

/** Words: runs of letters/digits, keeping inner apostrophes and hyphens; 3.50 is one word. */
const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*(?:[.,]\p{N}+)*/gu;

/** Scripts written without spaces between words, counted per character. */
const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

export type WordToken = { word: string; start: number; end: number };

export function wordTokens(text: string): WordToken[] {
  const out: WordToken[] = [];
  for (const m of text.matchAll(WORD_RE)) {
    // Treat each CJK character as a word, as reading-speed studies do.
    if (CJK_RE.test(m[0])) {
      let i = m.index!;
      for (const ch of m[0]) {
        out.push({ word: ch, start: i, end: i + ch.length });
        i += ch.length;
      }
    } else
      out.push({ word: m[0], start: m.index!, end: m.index! + m[0].length });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Reading time                                                         */
/* ------------------------------------------------------------------ */

export type ReadingStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  readingMinutes: number;
  speakingMinutes: number;
};

export function readingStats(
  text: string,
  readWpm: number,
  speakWpm: number,
): ReadingStats {
  const words = wordTokens(text).length;
  const chars = Array.from(text);
  return {
    words,
    characters: chars.length,
    charactersNoSpaces: chars.filter((c) => !/\s/.test(c)).length,
    readingMinutes: readWpm > 0 ? words / readWpm : 0,
    speakingMinutes: speakWpm > 0 ? words / speakWpm : 0,
  };
}

/** 0.4 min → "24 sec", 3.5 → "3 min 30 sec", 75 → "1 h 15 min". */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0 sec';
  const total = Math.round(minutes * 60);
  if (total < 60) return `${Math.max(1, total)} sec`;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h} h${m ? ` ${m} min` : ''}`;
  return `${m} min${s ? ` ${s} sec` : ''}`;
}

/* ------------------------------------------------------------------ */
/* Keyword density                                                      */
/* ------------------------------------------------------------------ */

/** Common English function words, excluded on request. */
export const STOP_WORDS = new Set(
  "a about above after again against all am an and any are aren't as at be because been before being below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves also just get got like one two may might much many us via".split(
    ' ',
  ),
);

const norm = (w: string) =>
  w
    .toLocaleLowerCase()
    .replace(/’/g, "'")
    .replace(/^['-]+|['-]+$/g, '');

export type KeywordRow = { phrase: string; count: number; density: number };

export type DensityReport = {
  totalWords: number;
  uniqueWords: number;
  rows: KeywordRow[];
};

/**
 * Counts single words or n-word phrases. Density is occurrences × phrase
 * length ÷ total words, the common definition; phrases never span a sentence
 * break. With `excludeStopWords`, single stop words are skipped and phrases
 * that start or end with one are dropped.
 */
export function keywordDensity(
  text: string,
  opts: {
    phraseLength?: number;
    minLength?: number;
    excludeStopWords?: boolean;
    limit?: number;
  } = {},
): DensityReport {
  const n = Math.min(4, Math.max(1, opts.phraseLength ?? 1));
  const minLength = opts.minLength ?? 1;
  const tokens = wordTokens(text);
  const words = tokens.map((t) => norm(t.word)).filter(Boolean);
  const total = words.length;
  // Sentence breaks between consecutive tokens.
  const breakAfter = tokens.map((t, i) =>
    i < tokens.length - 1
      ? /[.!?;:…]|\n\s*\n/.test(text.slice(t.end, tokens[i + 1].start))
      : true,
  );
  const counts = new Map<string, number>();
  for (let i = 0; i + n <= tokens.length; i++) {
    let ok = true;
    for (let j = i; j < i + n - 1; j++) if (breakAfter[j]) ok = false;
    if (!ok) continue;
    const parts = tokens.slice(i, i + n).map((t) => norm(t.word));
    if (parts.some((p) => !p || [...p].length < minLength)) continue;
    if (opts.excludeStopWords) {
      if (n === 1 && STOP_WORDS.has(parts[0])) continue;
      if (n > 1 && (STOP_WORDS.has(parts[0]) || STOP_WORDS.has(parts[n - 1])))
        continue;
    }
    if (parts.every((p) => /^\d+$/.test(p))) continue;
    const key = parts.join(' ');
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .filter(([, c]) => n === 1 || c > 1)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: total ? ((count * n) / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
    .slice(0, opts.limit ?? 50);
  return { totalWords: total, uniqueWords: new Set(words).size, rows };
}

/** Occurrences of a user-chosen keyword or phrase (case-insensitive, whole words). */
export function phraseCount(text: string, phrase: string): number {
  const target = wordTokens(phrase).map((t) => norm(t.word));
  if (!target.length) return 0;
  const words = wordTokens(text).map((t) => norm(t.word));
  let c = 0;
  for (let i = 0; i + target.length <= words.length; i++)
    if (target.every((w, j) => words[i + j] === w)) c++;
  return c;
}

/* ------------------------------------------------------------------ */
/* Repeated words                                                       */
/* ------------------------------------------------------------------ */

export type Repeat = {
  /** Offsets of the second (repeated) word in the original text. */
  start: number;
  end: number;
  /** Offset of the first word, for highlighting both. */
  firstStart: number;
  word: string;
};

/**
 * Words that are deliberately doubled in normal English; not flagged unless
 * `strict` is on. ("had had", "that that" and "is is" can be correct.)
 */
const ALLOWED_DOUBLES = new Set([
  'had',
  'that',
  'is',
  'bye',
  'no',
  'yes',
  'very',
  'so',
  'ha',
  'haha',
  'knock',
  'well',
  'hey',
  'oh',
  'wait',
  'now',
  'go',
  'chop',
  'tsk',
  'boo',
  'cha',
  'la',
  'bla',
  'blah',
  'again',
  'really',
  'more',
  'many',
  'far',
  'round',
  'over',
  'out',
  'on',
  'off',
  'up',
  'down',
]);

/**
 * Finds a word immediately repeated ("the the"), ignoring case, across spaces
 * and line breaks but not across punctuation — so "Well, well" and "Yes. Yes"
 * aren't flagged. Numbers are skipped.
 */
export function findRepeatedWords(text: string, strict = false): Repeat[] {
  const tokens = wordTokens(text);
  const out: Repeat[] = [];
  for (let i = 1; i < tokens.length; i++) {
    const a = tokens[i - 1];
    const b = tokens[i];
    const gap = text.slice(a.end, b.start);
    if (!/^\s+$/.test(gap)) continue;
    const w = norm(b.word);
    if (!w || w !== norm(a.word) || /^\d+$/.test(w)) continue;
    if (CJK_RE.test(w)) continue;
    if (!strict && ALLOWED_DOUBLES.has(w)) continue;
    // A run of three ("very very very") is reported once per extra word.
    out.push({ start: b.start, end: b.end, firstStart: a.start, word: b.word });
  }
  return out;
}

/**
 * Removes each flagged repeat with the spaces after it, so line breaks stay
 * where they were; at the end of a line the spaces before it go instead.
 */
export function removeRepeats(text: string, repeats: Repeat[]): string {
  let out = text;
  for (const r of [...repeats].sort((x, y) => y.start - x.start)) {
    let s = r.start;
    let e = r.end;
    while (e < out.length && /[ \t]/.test(out[e])) e++;
    if (e === r.end) while (s > 0 && /[ \t]/.test(out[s - 1])) s--;
    out = out.slice(0, s) + out.slice(e);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Sentences                                                            */
/* ------------------------------------------------------------------ */

/** Abbreviations that end with a period but don't end a sentence. */
const ABBREVIATIONS = new Set(
  'mr mrs ms dr prof sr jr st vs etc e.g i.e cf al approx dept est fig inc ltd co corp no vol pp ed eds jan feb mar apr jun jul aug sep sept oct nov dec mon tue wed thu fri sat sun u.s u.k a.m p.m ph.d mt ft lb oz'.split(
    ' ',
  ),
);

export type Sentence = {
  text: string;
  start: number;
  end: number;
  words: number;
};

/**
 * Splits text into sentences at . ! ? … (and blank lines), skipping common
 * abbreviations, initials ("J. R. Smith"), decimals and ellipses inside
 * quotes. A heuristic: unusual punctuation can still split or merge sentences.
 */
export function splitSentences(text: string): Sentence[] {
  const out: Sentence[] = [];
  let start = 0;
  const push = (end: number) => {
    const raw = text.slice(start, end);
    const lead = raw.length - raw.trimStart().length;
    const t = raw.trim();
    if (t && /[\p{L}\p{N}]/u.test(t))
      out.push({
        text: t,
        start: start + lead,
        end: start + lead + t.length,
        words: wordTokens(t).length,
      });
    start = end;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\n' && /\n\s*$/.test(text.slice(start, i))) {
      push(i);
      continue;
    }
    if (!/[.!?…。！？]/.test(ch)) continue;
    // Consume runs like "?!" or "..." and closing quotes/brackets.
    let j = i + 1;
    while (j < text.length && /[.!?…"'”’)\]]/.test(text[j])) j++;
    const next = text.slice(j, j + 2);
    if (ch === '.' && j === i + 1) {
      const before = text.slice(start, i);
      const lastRaw = /([\p{L}.]+)$/u.exec(before)?.[1] ?? '';
      if (ABBREVIATIONS.has(lastRaw.toLowerCase())) continue;
      // Single capital-letter initials ("J. Smith") and decimals ("3.5").
      if (/^\p{Lu}$/u.test(lastRaw)) continue;
      if (/\d$/.test(before) && /^\d/.test(text[j] ?? '')) continue;
    }
    // A sentence ends only before whitespace + something, or end of text.
    if (j < text.length && !/^\s/.test(next)) continue;
    // Lowercase after the stop usually means it wasn't a sentence end.
    const after = text.slice(j).trimStart();
    if (ch !== '?' && ch !== '!' && /^\p{Ll}/u.test(after)) continue;
    push(j);
    i = j - 1;
  }
  push(text.length);
  return out;
}

export type SentenceReport = {
  sentences: Sentence[];
  count: number;
  words: number;
  average: number;
  median: number;
  longest: Sentence[];
  overLimit: number;
};

export function sentenceReport(text: string, limit: number): SentenceReport {
  const sentences = splitSentences(text);
  const lens = sentences.map((s) => s.words).sort((a, b) => a - b);
  const words = lens.reduce((a, b) => a + b, 0);
  const mid = Math.floor(lens.length / 2);
  return {
    sentences,
    count: sentences.length,
    words,
    average: sentences.length ? words / sentences.length : 0,
    median: !lens.length
      ? 0
      : lens.length % 2
        ? lens[mid]
        : (lens[mid - 1] + lens[mid]) / 2,
    longest: [...sentences].sort((a, b) => b.words - a.words).slice(0, 5),
    overLimit: sentences.filter((s) => s.words > limit).length,
  };
}
