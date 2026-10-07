// Pure text helpers shared by the text tools. No DOM access, so every
// function here runs in the browser and in Vitest alike.

const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'in',
  'nor',
  'of',
  'on',
  'or',
  'per',
  'so',
  'the',
  'to',
  'up',
  'via',
  'vs',
  'yet',
]);

/** Splits mixed-style input ("helloWorld", "hello_world", "Hello World") into words. */
export function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const cap = (w: string) =>
  w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase();

export function toTitleCase(input: string): string {
  return input
    .toLocaleLowerCase()
    .split(/(\s+)/)
    .map((word, i, all) => {
      if (/^\s+$/.test(word) || !word) return word;
      const isFirst = i === 0;
      const isLast = i === all.length - 1;
      const bare = word.replace(/[^\p{L}]/gu, '');
      if (!isFirst && !isLast && SMALL_WORDS.has(bare)) return word;
      return word.replace(/\p{L}/u, (c) => c.toLocaleUpperCase());
    })
    .join('');
}

export function toSentenceCase(input: string): string {
  return input
    .toLocaleLowerCase()
    .replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (m) => m.toLocaleUpperCase());
}

export type CaseStyle =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'dot'
  | 'alternating'
  | 'inverse';

export const CASE_STYLES: { id: CaseStyle; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'constant', label: 'CONSTANT_CASE' },
  { id: 'dot', label: 'dot.case' },
  { id: 'alternating', label: 'aLtErNaTiNg' },
  { id: 'inverse', label: 'iNVERSE' },
];

/** Code-style cases are applied per line so multi-line lists keep their shape. */
function perLine(input: string, fn: (line: string) => string): string {
  return input
    .split('\n')
    .map((l) => fn(l))
    .join('\n');
}

export function convertCase(input: string, style: CaseStyle): string {
  switch (style) {
    case 'upper':
      return input.toLocaleUpperCase();
    case 'lower':
      return input.toLocaleLowerCase();
    case 'title':
      return perLine(input, toTitleCase);
    case 'sentence':
      return toSentenceCase(input);
    case 'camel':
      return perLine(input, (l) =>
        splitWords(l)
          .map((w, i) => (i === 0 ? w.toLocaleLowerCase() : cap(w)))
          .join(''),
      );
    case 'pascal':
      return perLine(input, (l) => splitWords(l).map(cap).join(''));
    case 'snake':
      return perLine(input, (l) =>
        splitWords(l)
          .map((w) => w.toLocaleLowerCase())
          .join('_'),
      );
    case 'kebab':
      return perLine(input, (l) =>
        splitWords(l)
          .map((w) => w.toLocaleLowerCase())
          .join('-'),
      );
    case 'constant':
      return perLine(input, (l) =>
        splitWords(l)
          .map((w) => w.toLocaleUpperCase())
          .join('_'),
      );
    case 'dot':
      return perLine(input, (l) =>
        splitWords(l)
          .map((w) => w.toLocaleLowerCase())
          .join('.'),
      );
    case 'alternating': {
      let i = 0;
      return Array.from(input)
        .map((c) => {
          if (!/\p{L}/u.test(c)) return c;
          const out =
            i % 2 === 0 ? c.toLocaleLowerCase() : c.toLocaleUpperCase();
          i++;
          return out;
        })
        .join('');
    }
    case 'inverse':
      return Array.from(input)
        .map((c) =>
          c === c.toLocaleUpperCase()
            ? c.toLocaleLowerCase()
            : c.toLocaleUpperCase(),
        )
        .join('');
  }
}

// ── Line operations ────────────────────────────────────────────────────────

export function removeDuplicateLines(
  input: string,
  opts: { caseSensitive?: boolean; trim?: boolean } = {},
): string {
  const { caseSensitive = true, trim = true } = opts;
  const seen = new Set<string>();
  return input
    .split(/\r?\n/)
    .filter((line) => {
      let key = trim ? line.trim() : line;
      if (!caseSensitive) key = key.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join('\n');
}

export function removeEmptyLines(
  input: string,
  opts: { whitespaceOnly?: boolean } = {},
): string {
  const { whitespaceOnly = true } = opts;
  return input
    .split(/\r?\n/)
    .filter((l) => (whitespaceOnly ? l.trim() !== '' : l !== ''))
    .join('\n');
}

export type SortMode =
  | 'az'
  | 'za'
  | 'natural'
  | 'length'
  | 'length-desc'
  | 'reverse'
  | 'shuffle';

export function sortLines(
  input: string,
  mode: SortMode,
  opts: { caseSensitive?: boolean; random?: () => number } = {},
): string {
  const { caseSensitive = false, random = Math.random } = opts;
  const lines = input.split(/\r?\n/);
  const collator = new Intl.Collator(undefined, {
    sensitivity: caseSensitive ? 'variant' : 'base',
    numeric: mode === 'natural',
  });
  switch (mode) {
    case 'az':
    case 'natural':
      return [...lines].sort(collator.compare).join('\n');
    case 'za':
      return [...lines].sort((a, b) => collator.compare(b, a)).join('\n');
    case 'length':
      return [...lines].sort((a, b) => a.length - b.length).join('\n');
    case 'length-desc':
      return [...lines].sort((a, b) => b.length - a.length).join('\n');
    case 'reverse':
      return [...lines].reverse().join('\n');
    case 'shuffle': {
      const out = [...lines];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out.join('\n');
    }
  }
}

// ── Statistics ─────────────────────────────────────────────────────────────

export type TextStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMin: number;
  speakingTimeMin: number;
  topWords: { word: string; count: number }[];
};

const STOP_WORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'of',
  'to',
  'in',
  'is',
  'it',
  'for',
  'on',
  'that',
  'this',
  'with',
  'as',
  'are',
  'was',
  'be',
  'at',
  'by',
  'i',
  'you',
  'we',
  'they',
  'he',
  'she',
]);

export function textStats(input: string): TextStats {
  const trimmed = input.trim();
  const words = trimmed
    ? (trimmed.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [])
    : [];
  const graphemes = Array.from(input);
  const sentences = trimmed
    ? trimmed
        .split(/(?<=[.!?…])\s+|\n{2,}/)
        .filter((s) => /[\p{L}\p{N}]/u.test(s)).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  const counts = new Map<string, number>();
  for (const w of words) {
    const k = w.toLocaleLowerCase();
    if (k.length < 3 || STOP_WORDS.has(k)) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const topWords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    words: words.length,
    characters: graphemes.length,
    charactersNoSpaces: graphemes.filter((c) => !/\s/.test(c)).length,
    letters: graphemes.filter((c) => /\p{L}/u.test(c)).length,
    sentences,
    paragraphs,
    lines: input === '' ? 0 : input.split(/\r?\n/).length,
    // 238 wpm silent reading and 150 wpm speaking are common averages.
    readingTimeMin: words.length / 238,
    speakingTimeMin: words.length / 150,
    topWords,
  };
}

// ── Find & replace ─────────────────────────────────────────────────────────

export type FindReplaceOptions = {
  caseSensitive?: boolean;
  wholeWord?: boolean;
  useRegex?: boolean;
};

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildSearchRegex(
  find: string,
  opts: FindReplaceOptions,
): RegExp {
  let source = opts.useRegex ? find : escapeRegExp(find);
  if (opts.wholeWord) source = `\\b(?:${source})\\b`;
  return new RegExp(source, opts.caseSensitive ? 'gu' : 'giu');
}

export function findAndReplace(
  input: string,
  find: string,
  replacement: string,
  opts: FindReplaceOptions = {},
): { output: string; count: number } {
  if (!find) return { output: input, count: 0 };
  const re = buildSearchRegex(find, opts);
  const count = Array.from(input.matchAll(re)).length;
  // Regex mode keeps "$1"-style references; literal mode inserts the text as-is.
  const output = opts.useRegex
    ? input.replace(re, replacement)
    : input.replace(re, () => replacement);
  return { output, count };
}

// ── Morse code ─────────────────────────────────────────────────────────────

const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
};
const MORSE_REVERSE = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
);

export function textToMorse(input: string): string {
  return input
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .map((word) =>
      Array.from(word)
        .map((c) => MORSE[c] ?? '')
        .filter(Boolean)
        .join(' '),
    )
    .filter(Boolean)
    .join(' / ');
}

export function morseToText(input: string): string {
  return input
    .trim()
    .split(/\s*[/|]\s*|\s{3,}/)
    .map((word) =>
      word
        .split(/\s+/)
        .map(
          (code) =>
            MORSE_REVERSE[code.replace(/[•·]/g, '.').replace(/[−–—_]/g, '-')] ??
            '',
        )
        .join(''),
    )
    .join(' ');
}

export function isMorse(input: string): boolean {
  return /^[\s.\-/|•·−–—_]+$/.test(input.trim()) && /[.\-]/.test(input);
}

// ── Diff ───────────────────────────────────────────────────────────────────

export type DiffPart = { type: 'equal' | 'added' | 'removed'; value: string };

/**
 * Longest-common-subsequence diff over tokens. Quadratic memory, so callers
 * diff lines (not characters) for large inputs.
 */
export function diffTokens(a: string[], b: string[]): DiffPart[] {
  // Trim common prefix/suffix first — makes typical edits near-linear.
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  const n = midA.length;
  const m = midB.length;
  const dp: Uint32Array[] = Array.from(
    { length: n + 1 },
    () => new Uint32Array(m + 1),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        midA[i] === midB[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  const push = (type: DiffPart['type'], value: string) =>
    parts.push({ type, value });
  a.slice(0, start).forEach((v) => push('equal', v));
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (midA[i] === midB[j]) {
      push('equal', midA[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push('removed', midA[i++]);
    } else {
      push('added', midB[j++]);
    }
  }
  while (i < n) push('removed', midA[i++]);
  while (j < m) push('added', midB[j++]);
  a.slice(endA).forEach((v) => push('equal', v));
  return parts;
}

export const MAX_DIFF_CELLS = 25_000_000;

export function diffLines(a: string, b: string): DiffPart[] {
  return diffTokens(a.split(/\r?\n/), b.split(/\r?\n/));
}

export function diffWords(a: string, b: string): DiffPart[] {
  return diffTokens(a.split(/(\s+)/), b.split(/(\s+)/));
}

// ── Lorem ipsum ────────────────────────────────────────────────────────────

const LOREM_WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nunc pulvinar sapien ligula viverra faucibus mauris vitae ultricies leo integer malesuada odio morbi tristique senectus netus fames ac turpis egestas pellentesque habitant'.split(
    ' ',
  );

export type LoremUnit = 'paragraphs' | 'sentences' | 'words';

export function loremIpsum(
  count: number,
  unit: LoremUnit,
  opts: { startWithLorem?: boolean; random?: () => number } = {},
): string {
  const { startWithLorem = true, random = Math.random } = opts;
  const n = Math.max(1, Math.min(Math.floor(count) || 1, 500));
  const word = () => LOREM_WORDS[Math.floor(random() * LOREM_WORDS.length)];
  const sentence = () => {
    const len = 8 + Math.floor(random() * 10);
    const ws = Array.from({ length: len }, word);
    if (len > 10) ws[Math.floor(len / 2)] += ',';
    const s = ws.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };
  const paragraph = () =>
    Array.from({ length: 4 + Math.floor(random() * 4) }, sentence).join(' ');

  let out: string;
  if (unit === 'words') out = Array.from({ length: n }, word).join(' ');
  else if (unit === 'sentences')
    out = Array.from({ length: n }, sentence).join(' ');
  else out = Array.from({ length: n }, paragraph).join('\n\n');

  if (startWithLorem) {
    const opening = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    if (unit === 'words') {
      const openWords = opening.replace(',', '').split(' ');
      const rest = out.split(' ').slice(openWords.length);
      out = [...openWords, ...rest].slice(0, n).join(' ');
    } else {
      out = out.replace(/^[^.]*\./, `${opening}.`);
    }
  }
  return out;
}
