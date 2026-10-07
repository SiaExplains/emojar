// Text transforms for the v0.7.0 text tools: flips, combining-mark styles,
// reversing, repeating, line-break and line-affix clean-up, and slugs. All
// work on grapheme clusters so emoji and accented letters stay whole.

import { ToolInputError } from './data';

/** Splits text into user-perceived characters (grapheme clusters). */
export function graphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/** Builds a two-way lookup so flipping flipped text restores the original. */
function twoWay(pairs: string): Map<string, string> {
  const map = new Map<string, string>();
  const list = pairs.trim().split(/\s+/);
  for (const pair of list) {
    const [a, b] = Array.from(pair);
    if (!map.has(a)) map.set(a, b);
  }
  for (const pair of list) {
    const [a, b] = Array.from(pair);
    if (!map.has(b)) map.set(b, a);
  }
  return map;
}

// Each token is "<plain><flipped>". Letters that look the same flipped
// (l, o, s, x, z, H, I, N, O, S, X, Z, 0, 8) are left out and pass through.
const UPSIDE_DOWN = twoWay(`
  aɐ bq cɔ dp eǝ fɟ gƃ hɥ iᴉ jɾ kʞ mɯ nu rɹ tʇ vʌ wʍ yʎ
  A∀ Bꓭ CƆ Dꓷ EƎ FℲ G⅁ Jſ Kꓘ L⅂ MW PԀ QΌ Rꓤ T⊥ U∩ VΛ Y⅄
  1Ɩ 2ᄅ 3Ɛ 4ㄣ 5ϛ 69 7ㄥ
  .˙ ,' ?¿ !¡ "„ () [] {} <> &⅋ _‾ ;؛
`);

const MIRROR = twoWay(`
  aɒ bd cɔ eɘ gϱ hʜ jᒐ kʞ pq rɿ sꙅ tƚ yʏ zꙃ
  Bᗺ CƆ Dᗡ EƎ Fꟻ JႱ Kꓘ L⅃ NИ Pꟼ QϘ RЯ SƧ ZƸ
  3Ɛ 7Ⲋ ?⸮ () [] {} <> /\\
`);

export type FlipMode = 'upside-down' | 'mirror' | 'letters';

/**
 * upside-down: rotate the whole text 180° (characters flipped, order reversed).
 * mirror: flip each line left↔right. letters: flip characters, keep order.
 */
export function flipText(text: string, mode: FlipMode): string {
  const map = mode === 'mirror' ? MIRROR : UPSIDE_DOWN;
  const flip = (g: string) => map.get(g) ?? g;
  const norm = text.replace(/\r\n?/g, '\n');
  if (mode === 'letters') return graphemes(norm).map(flip).join('');
  if (mode === 'mirror')
    return norm
      .split('\n')
      .map((line) => graphemes(line).map(flip).reverse().join(''))
      .join('\n');
  return graphemes(norm).map(flip).reverse().join('');
}

export const COMBINING_STYLES = {
  strikethrough: { mark: '̶', label: 'Strikethrough  (s̶t̶r̶i̶k̶e̶)' },
  'short-stroke': { mark: '̵', label: 'Short stroke  (s̵h̵o̵r̵t̵)' },
  slash: { mark: '̸', label: 'Slash  (s̸l̸a̸s̸h̸)' },
  underline: { mark: '̲', label: 'Underline  (u̲n̲d̲e̲r̲)' },
  'double-underline': {
    mark: '̳',
    label: 'Double underline  (d̳o̳u̳b̳l̳e̳)',
  },
  overline: { mark: '̅', label: 'Overline  (o̅v̅e̅r̅)' },
  'x-above': { mark: '̽', label: 'Cross above  (c̽r̽o̽s̽s̽)' },
} as const;

export type CombiningStyle = keyof typeof COMBINING_STYLES | 'remove';

const ALL_MARKS = new RegExp(
  `[${Object.values(COMBINING_STYLES)
    .map((s) => s.mark)
    .join('')}]`,
  'g',
);

/** Adds a combining mark after every character, or strips the marks again. */
export function styleText(
  text: string,
  style: CombiningStyle,
  opts: { spaces?: boolean } = {},
): string {
  if (style === 'remove') return text.replace(ALL_MARKS, '');
  const mark = COMBINING_STYLES[style]?.mark;
  if (!mark) return text;
  return graphemes(text.replace(ALL_MARKS, ''))
    .map((g) => {
      if (g === '\n' || g === '\r' || g === '\r\n' || g === '\t') return g;
      if (/^\s$/.test(g) && !opts.spaces) return g;
      return g + mark;
    })
    .join('');
}

export type ReverseMode = 'characters' | 'words' | 'each-word' | 'lines';

export function reverseText(text: string, mode: ReverseMode): string {
  const norm = text.replace(/\r\n?/g, '\n');
  switch (mode) {
    case 'lines':
      return norm.split('\n').reverse().join('\n');
    case 'words':
      return norm
        .split('\n')
        .map((line) => {
          const lead = /^\s*/.exec(line)![0];
          const trail = /\s*$/.exec(line.slice(lead.length))![0];
          const core = line.slice(lead.length, line.length - trail.length);
          if (!core) return line;
          const words = core.split(/(\s+)/);
          const tokens = words.filter((_, i) => i % 2 === 0).reverse();
          const gaps = words.filter((_, i) => i % 2 === 1);
          return (
            lead + tokens.map((t, i) => t + (gaps[i] ?? '')).join('') + trail
          );
        })
        .join('\n');
    case 'each-word':
      return norm
        .split(/(\s+)/)
        .map((part, i) =>
          i % 2 === 1 ? part : graphemes(part).reverse().join(''),
        )
        .join('');
    default:
      return graphemes(norm).reverse().join('');
  }
}

export const MAX_REPEAT = 10_000;
export const MAX_REPEAT_OUTPUT = 2_000_000;

export function repeatText(
  text: string,
  countInput: string | number,
  separator: string,
): string {
  const count = Number(String(countInput).trim());
  if (!Number.isInteger(count) || count < 1 || count > MAX_REPEAT)
    throw new ToolInputError(
      `Enter a whole number of repeats from 1 to ${MAX_REPEAT.toLocaleString('en-US')}.`,
    );
  const size = text.length * count + separator.length * (count - 1);
  if (size > MAX_REPEAT_OUTPUT)
    throw new ToolInputError(
      `That would create ${size.toLocaleString('en-US')} characters — the limit is ${MAX_REPEAT_OUTPUT.toLocaleString('en-US')}. Use fewer repeats or shorter text.`,
    );
  return Array(count).fill(text).join(separator);
}

export const REPEAT_SEPARATORS: Record<string, string> = {
  newline: '\n',
  space: ' ',
  none: '',
  comma: ', ',
};

export type LineBreakMode = 'space' | 'none' | 'paragraphs';

export function removeLineBreaks(
  text: string,
  mode: LineBreakMode,
  opts: { collapseSpaces?: boolean; joinHyphens?: boolean } = {},
): string {
  let t = text.replace(/\r\n?/g, '\n').replace(/[\u2028\u2029]/g, '\n');
  // "infor-\nmation" from PDFs → "information"; "Jean-\nLuc" → "Jean-Luc".
  if (opts.joinHyphens)
    t = t
      .replace(/(\p{L})-[ \t]*\n[ \t]*(\p{Ll})/gu, '$1$2')
      .replace(/(\p{L})-[ \t]*\n[ \t]*(\p{Lu}|\p{N})/gu, '$1-$2');
  const join = mode === 'none' ? '' : ' ';
  const flatten = (s: string) => s.replace(/[ \t]*(?:\n[ \t]*)+/g, join);
  let out =
    mode === 'paragraphs'
      ? t
          .split(/\n[ \t]*\n\s*/)
          .map((p) => flatten(p.trim()))
          .filter(Boolean)
          .join('\n\n')
      : flatten(t);
  if (opts.collapseSpaces) out = out.replace(/[ \t]{2,}/g, ' ');
  return mode === 'paragraphs' ? out : out.trim();
}

/** Adds text before/after every line; `{n}` becomes the line number. */
export function addPrefixSuffix(
  text: string,
  prefix: string,
  suffix: string,
  opts: { skipEmpty?: boolean; trim?: boolean; start?: number } = {},
): string {
  let n = opts.start ?? 1;
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((raw) => {
      const line = opts.trim ? raw.trim() : raw;
      if (opts.skipEmpty && !line.trim()) return line;
      const num = String(n++);
      return (
        prefix.replaceAll('{n}', num) + line + suffix.replaceAll('{n}', num)
      );
    })
    .join('\n');
}

const TRANSLIT: Record<string, string> = {
  ß: 'ss',
  ẞ: 'SS',
  æ: 'ae',
  Æ: 'AE',
  œ: 'oe',
  Œ: 'OE',
  ø: 'o',
  Ø: 'O',
  đ: 'd',
  Đ: 'D',
  ð: 'd',
  Ð: 'D',
  þ: 'th',
  Þ: 'TH',
  ł: 'l',
  Ł: 'L',
  ı: 'i',
  ħ: 'h',
  Ħ: 'H',
};

const STOP_WORDS = new Set(
  'a an and are as at be but by for from has have in into is it its of on or that the this to was were will with'.split(
    ' ',
  ),
);

export type SlugOptions = {
  separator?: '-' | '_';
  lowercase?: boolean;
  stopWords?: boolean;
  maxLength?: number;
};

/** URL slug from a title: accents removed, punctuation dropped, words joined. */
export function slugify(input: string, opts: SlugOptions = {}): string {
  const sep = opts.separator ?? '-';
  let s = input
    .replace(/[ßẞæÆœŒøØđĐðÐþÞłŁıħĦ]/g, (c) => TRANSLIT[c] ?? c)
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/['’‘`´]/g, '');
  if (opts.lowercase !== false) s = s.toLowerCase();
  let words = s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (opts.stopWords) {
    const kept = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    if (kept.length) words = kept;
  }
  let slug = words.join(sep);
  const max = opts.maxLength;
  if (max && max > 0 && slug.length > max) {
    const cut = slug.slice(0, max + 1);
    const at = cut.lastIndexOf(sep);
    slug = (at > 0 ? cut.slice(0, at) : slug.slice(0, max)).replace(
      new RegExp(`\\${sep}+$`),
      '',
    );
  }
  return slug;
}
