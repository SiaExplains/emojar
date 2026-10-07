// Invisible and blank Unicode characters: a copy palette for "empty" names
// and messages, and a detector that finds hidden characters in pasted text.

export type InvisibleKind = 'blank' | 'space' | 'zero-width' | 'control';

export type InvisibleChar = {
  cp: number;
  name: string;
  short: string;
  kind: InvisibleKind;
  /** Shown in the copy palette (characters that are useful to paste). */
  palette?: string;
};

export const INVISIBLE_CHARS: InvisibleChar[] = [
  {
    cp: 0x3164,
    name: 'Hangul Filler',
    short: 'HF',
    kind: 'blank',
    palette:
      'Counts as a letter, so many games and apps accept it as a blank name.',
  },
  {
    cp: 0x2800,
    name: 'Braille Pattern Blank',
    short: 'BRL',
    kind: 'blank',
    palette:
      'Looks like a space but is not trimmed — good for blank messages and bios.',
  },
  {
    cp: 0xffa0,
    name: 'Halfwidth Hangul Filler',
    short: 'HHF',
    kind: 'blank',
    palette: 'A narrower Hangul filler; an alternative when U+3164 is blocked.',
  },
  {
    cp: 0x115f,
    name: 'Hangul Choseong Filler',
    short: 'HCF',
    kind: 'blank',
  },
  {
    cp: 0x1160,
    name: 'Hangul Jungseong Filler',
    short: 'HJF',
    kind: 'blank',
  },
  {
    cp: 0x200b,
    name: 'Zero Width Space',
    short: 'ZWSP',
    kind: 'zero-width',
    palette:
      'Takes up no width. Lets long words or URLs wrap; often stripped by apps.',
  },
  {
    cp: 0x200c,
    name: 'Zero Width Non-Joiner',
    short: 'ZWNJ',
    kind: 'zero-width',
  },
  {
    cp: 0x200d,
    name: 'Zero Width Joiner',
    short: 'ZWJ',
    kind: 'zero-width',
  },
  {
    cp: 0x2060,
    name: 'Word Joiner',
    short: 'WJ',
    kind: 'zero-width',
    palette: 'Zero width and stops a line break at that point.',
  },
  {
    cp: 0xfeff,
    name: 'Zero Width No-Break Space (BOM)',
    short: 'BOM',
    kind: 'zero-width',
  },
  {
    cp: 0x180e,
    name: 'Mongolian Vowel Separator',
    short: 'MVS',
    kind: 'zero-width',
  },
  {
    cp: 0x034f,
    name: 'Combining Grapheme Joiner',
    short: 'CGJ',
    kind: 'zero-width',
  },
  { cp: 0x00ad, name: 'Soft Hyphen', short: 'SHY', kind: 'zero-width' },
  {
    cp: 0x00a0,
    name: 'No-Break Space',
    short: 'NBSP',
    kind: 'space',
    palette: 'A normal-width space that keeps two words on the same line.',
  },
  { cp: 0x2002, name: 'En Space', short: 'ENSP', kind: 'space' },
  {
    cp: 0x2003,
    name: 'Em Space',
    short: 'EMSP',
    kind: 'space',
    palette: 'A wide space (the width of an “M”) for indents and alignment.',
  },
  { cp: 0x2004, name: 'Three-Per-Em Space', short: '3/MSP', kind: 'space' },
  { cp: 0x2005, name: 'Four-Per-Em Space', short: '4/MSP', kind: 'space' },
  { cp: 0x2006, name: 'Six-Per-Em Space', short: '6/MSP', kind: 'space' },
  { cp: 0x2007, name: 'Figure Space', short: 'FSP', kind: 'space' },
  { cp: 0x2008, name: 'Punctuation Space', short: 'PSP', kind: 'space' },
  { cp: 0x2009, name: 'Thin Space', short: 'THSP', kind: 'space' },
  { cp: 0x200a, name: 'Hair Space', short: 'HSP', kind: 'space' },
  { cp: 0x202f, name: 'Narrow No-Break Space', short: 'NNBSP', kind: 'space' },
  {
    cp: 0x205f,
    name: 'Medium Mathematical Space',
    short: 'MMSP',
    kind: 'space',
  },
  {
    cp: 0x3000,
    name: 'Ideographic Space',
    short: 'IDSP',
    kind: 'space',
    palette: 'A full-width space used in Chinese, Japanese and Korean text.',
  },
  { cp: 0x200e, name: 'Left-to-Right Mark', short: 'LRM', kind: 'control' },
  { cp: 0x200f, name: 'Right-to-Left Mark', short: 'RLM', kind: 'control' },
  { cp: 0x061c, name: 'Arabic Letter Mark', short: 'ALM', kind: 'control' },
  {
    cp: 0x202a,
    name: 'Left-to-Right Embedding',
    short: 'LRE',
    kind: 'control',
  },
  {
    cp: 0x202b,
    name: 'Right-to-Left Embedding',
    short: 'RLE',
    kind: 'control',
  },
  {
    cp: 0x202c,
    name: 'Pop Directional Formatting',
    short: 'PDF',
    kind: 'control',
  },
  { cp: 0x202d, name: 'Left-to-Right Override', short: 'LRO', kind: 'control' },
  { cp: 0x202e, name: 'Right-to-Left Override', short: 'RLO', kind: 'control' },
  { cp: 0x2066, name: 'Left-to-Right Isolate', short: 'LRI', kind: 'control' },
  { cp: 0x2067, name: 'Right-to-Left Isolate', short: 'RLI', kind: 'control' },
  { cp: 0x2068, name: 'First Strong Isolate', short: 'FSI', kind: 'control' },
  {
    cp: 0x2069,
    name: 'Pop Directional Isolate',
    short: 'PDI',
    kind: 'control',
  },
  { cp: 0x2061, name: 'Function Application', short: 'FA', kind: 'zero-width' },
  { cp: 0x2062, name: 'Invisible Times', short: 'IT', kind: 'zero-width' },
  { cp: 0x2063, name: 'Invisible Separator', short: 'IS', kind: 'zero-width' },
  { cp: 0x2064, name: 'Invisible Plus', short: 'IP', kind: 'zero-width' },
];

const BY_CP = new Map(INVISIBLE_CHARS.map((c) => [c.cp, c]));

export const PALETTE = INVISIBLE_CHARS.filter((c) => c.palette);

export const charOf = (cp: number) => String.fromCodePoint(cp);
export const codeLabel = (cp: number) =>
  `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;

/** Unicode "tag" characters (U+E0000–E007F) can hide whole messages. */
const isTag = (cp: number) => cp >= 0xe0000 && cp <= 0xe007f;

export function describeInvisible(cp: number): InvisibleChar | null {
  const known = BY_CP.get(cp);
  if (known) return known;
  if (isTag(cp))
    return { cp, name: 'Tag character', short: 'TAG', kind: 'control' };
  return null;
}

export type Finding = InvisibleChar & { count: number };

export type Segment =
  | { type: 'text'; value: string }
  | { type: 'hidden'; char: InvisibleChar };

/**
 * Splits text into visible runs and hidden characters. Zero-width joiners
 * inside emoji sequences (👩‍💻) and tag characters inside flag emoji (🏴 of
 * England, Scotland, Wales) are part of the emoji and are not reported.
 */
export function scanInvisible(text: string): {
  segments: Segment[];
  findings: Finding[];
  total: number;
} {
  const segments: Segment[] = [];
  const counts = new Map<number, Finding>();
  let run = '';
  let total = 0;
  // True while inside a tag sequence that follows 🏴 (subdivision flags).
  let inFlag = false;
  const cps = Array.from(text);
  for (let i = 0; i < cps.length; i++) {
    const ch = cps[i];
    const cp = ch.codePointAt(0)!;
    const info = describeInvisible(cp);
    const prev = cps[i - 1]?.codePointAt(0) ?? 0;
    const next = cps[i + 1]?.codePointAt(0) ?? 0;
    if (isTag(cp)) inFlag = prev === 0x1f3f4 || (inFlag && isTag(prev));
    else inFlag = false;
    const inEmoji =
      (cp === 0x200d && isPictographic(prev) && isPictographic(next)) || inFlag;
    if (!info || inEmoji) {
      run += ch;
      continue;
    }
    if (run) segments.push({ type: 'text', value: run });
    run = '';
    segments.push({ type: 'hidden', char: info });
    total++;
    const f = counts.get(info.cp) ?? { ...info, count: 0 };
    f.count++;
    counts.set(info.cp, f);
  }
  if (run) segments.push({ type: 'text', value: run });
  return {
    segments,
    findings: [...counts.values()].sort((a, b) => b.count - a.count),
    total,
  };
}

function isPictographic(cp: number) {
  if (!cp) return false;
  const ch = String.fromCodePoint(cp);
  return /\p{Extended_Pictographic}|\p{Emoji_Modifier}|️/u.test(ch);
}

/**
 * Removes hidden characters. Unusual spaces become a normal space unless
 * `spacesToNormal` is false; emoji joiners are kept so emoji stay intact.
 */
export function cleanInvisible(
  text: string,
  opts: { spacesToNormal?: boolean } = {},
): string {
  return scanInvisible(text)
    .segments.map((s) =>
      s.type === 'text'
        ? s.value
        : s.char.kind === 'space' && opts.spacesToNormal !== false
          ? ' '
          : '',
    )
    .join('');
}

export const MAX_BLANK_COUNT = 1000;

export function blankText(cp: number, count: number): string {
  const n = Math.min(MAX_BLANK_COUNT, Math.max(1, Math.floor(count) || 1));
  return charOf(cp).repeat(n);
}
