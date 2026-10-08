// Unicode character lookup: encodings, blocks, general categories and names.
// Names come from a compact copy of UnicodeData.txt that the explorer fetches
// on demand; algorithmic names (CJK, Hangul, Tangut …) are computed here.

import { BLOCKS, NAMED_RANGES } from '../data/unicode-blocks';

export const GENERAL_CATEGORIES: Record<string, string> = {
  Lu: 'Uppercase letter',
  Ll: 'Lowercase letter',
  Lt: 'Titlecase letter',
  Lm: 'Modifier letter',
  Lo: 'Other letter',
  Mn: 'Nonspacing mark',
  Mc: 'Spacing mark',
  Me: 'Enclosing mark',
  Nd: 'Decimal number',
  Nl: 'Letter number',
  No: 'Other number',
  Pc: 'Connector punctuation',
  Pd: 'Dash punctuation',
  Ps: 'Open punctuation',
  Pe: 'Close punctuation',
  Pi: 'Initial punctuation',
  Pf: 'Final punctuation',
  Po: 'Other punctuation',
  Sm: 'Math symbol',
  Sc: 'Currency symbol',
  Sk: 'Modifier symbol',
  So: 'Other symbol',
  Zs: 'Space separator',
  Zl: 'Line separator',
  Zp: 'Paragraph separator',
  Cc: 'Control',
  Cf: 'Format',
  Cs: 'Surrogate',
  Co: 'Private use',
  Cn: 'Unassigned',
};

export const hex = (cp: number) =>
  cp.toString(16).toUpperCase().padStart(4, '0');
export const uPlus = (cp: number) => `U+${hex(cp)}`;

export function utf8Bytes(cp: number): number[] {
  if (cp >= 0xd800 && cp <= 0xdfff) return []; // lone surrogates can't be UTF-8
  return [...new TextEncoder().encode(String.fromCodePoint(cp))];
}

export function utf16Units(cp: number): number[] {
  const s = String.fromCodePoint(cp);
  return s.length === 1
    ? [s.charCodeAt(0)]
    : [s.charCodeAt(0), s.charCodeAt(1)];
}

export const formatBytes = (b: number[]) =>
  b.map((x) => x.toString(16).toUpperCase().padStart(2, '0')).join(' ');

export function blockOf(
  cp: number,
): { first: number; last: number; name: string } | null {
  let lo = 0;
  let hi = BLOCKS.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [a, b, name] = BLOCKS[mid];
    if (cp < a) hi = mid - 1;
    else if (cp > b) lo = mid + 1;
    else return { first: a, last: b, name };
  }
  return null;
}

// ── Names ──────────────────────────────────────────────────────────────────

export type NameDb = {
  cps: Uint32Array;
  names: string[];
  gcs: string[];
  index: Map<number, number>;
};

/** Parses the compact names file: “<hex gap or empty>|name|gc?” per line. */
export function parseNameDb(text: string): NameDb {
  const lines = text.split('\n').filter(Boolean);
  const cps = new Uint32Array(lines.length);
  const names: string[] = new Array(lines.length);
  const gcs: string[] = new Array(lines.length);
  const index = new Map<number, number>();
  let cp = -1;
  let gc = 'Cn';
  lines.forEach((line, i) => {
    const [gap, name, g] = line.split('|');
    cp += gap ? parseInt(gap, 16) : 1;
    if (g) gc = g;
    cps[i] = cp;
    names[i] = name;
    gcs[i] = gc;
    index.set(cp, i);
  });
  return { cps, names, gcs, index };
}

const L = 'G GG N D DD R M B BB S SS  J JJ C K T P H'.split(' ');
const V = 'A AE YA YAE EO E YEO YE O WA WAE OE YO U WEO WE WI YU EU YI I'.split(
  ' ',
);
const T =
  ' G GG GS N NJ NH D L LG LM LB LS LT LP LH M B BS S SS NG J C K T P H'.split(
    ' ',
  );

function rangeName(cp: number): { name: string; gc: string } | null {
  for (const [a, b, label, gc] of NAMED_RANGES) {
    if (cp < a || cp > b) continue;
    if (label.startsWith('CJK Ideograph'))
      return { name: `CJK UNIFIED IDEOGRAPH-${hex(cp)}`, gc };
    if (label === 'Hangul Syllable') {
      const s = cp - 0xac00;
      const l = Math.floor(s / 588);
      const v = Math.floor((s % 588) / 28);
      const t = s % 28;
      return { name: `HANGUL SYLLABLE ${L[l]}${V[v]}${T[t]}`, gc };
    }
    if (/Private Use|Surrogate/.test(label)) return { name: '', gc };
    const base = label.replace(/ Supplement$/, '').toUpperCase();
    return { name: `${base}-${hex(cp)}`, gc };
  }
  return null;
}

export type CharInfo = {
  cp: number;
  char: string;
  name: string;
  gc: string;
  category: string;
  block: string;
};

export function charInfo(cp: number, db: NameDb | null): CharInfo {
  let name = '';
  let gc = 'Cn';
  const i = db?.index.get(cp);
  if (db && i !== undefined) {
    name = db.names[i].toUpperCase();
    gc = db.gcs[i];
  } else {
    const r = rangeName(cp);
    if (r) ({ name, gc } = r);
  }
  return {
    cp,
    char: String.fromCodePoint(cp),
    name: name || (db ? (gc === 'Cn' ? 'Unassigned' : '') : ''),
    gc,
    category: GENERAL_CATEGORIES[gc] ?? gc,
    block: blockOf(cp)?.name ?? 'No block',
  };
}

/** Characters that make no visible glyph on their own get a placeholder. */
export function displayChar(cp: number, gc: string): string {
  if (cp < 0x20) return String.fromCodePoint(0x2400 + cp); // ␀ … ␟
  if (cp === 0x7f) return '␡';
  if (gc === 'Zs') return '␣';
  if (gc === 'Mn' || gc === 'Me') return `◌${String.fromCodePoint(cp)}`;
  if (/^(Cc|Cf|Cs|Co|Cn|Zl|Zp)$/.test(gc)) return '⬚';
  return String.fromCodePoint(cp);
}

export type SearchResult =
  | { kind: 'codepoints'; cps: number[]; truncated: boolean }
  | { kind: 'block'; first: number; last: number; name: string };

const MAX_RESULTS = 400;

/**
 * Search by pasted character(s), code point (U+00E9, 0xE9, E9), block name,
 * or words of the character name (“latin small e acute”).
 */
export function searchUnicode(query: string, db: NameDb | null): SearchResult {
  const q = query.trim();
  if (!q) return { kind: 'codepoints', cps: [], truncated: false };
  const cpMatch = /^(?:u\+|0x|&#x)?([0-9a-f]{2,6});?$/i.exec(q);
  const decMatch = /^&#(\d{1,7});?$/.exec(q);
  const chars = [...q];
  // A short run of non-ASCII or symbol characters is a paste, not a word.
  if (chars.length <= 8 && !/^[a-z0-9 \-]+$/i.test(q) && !cpMatch && !decMatch)
    return {
      kind: 'codepoints',
      cps: [...new Set(chars.map((c) => c.codePointAt(0)!))],
      truncated: false,
    };
  const out: number[] = [];
  if (decMatch) out.push(Number(decMatch[1]));
  if (cpMatch && /^(u\+|0x|&#x)/i.test(q)) {
    const cp = parseInt(cpMatch[1], 16);
    if (cp <= 0x10ffff)
      return { kind: 'codepoints', cps: [cp], truncated: false };
  }
  if (cpMatch) {
    const cp = parseInt(cpMatch[1], 16);
    if (cp <= 0x10ffff) out.push(cp);
  }
  const lower = q.toLowerCase();
  const block = BLOCKS.find(([, , n]) => n.toLowerCase() === lower);
  if (block)
    return { kind: 'block', first: block[0], last: block[1], name: block[2] };
  if (chars.length === 1) out.push(q.codePointAt(0)!);
  const words = lower.split(/[\s,]+/).filter(Boolean);
  if (db && words.length) {
    // Every word must appear; single letters (“e”, “a”) must be whole words.
    // Matches with more whole-word hits, then shorter names, rank first, so
    // “latin small e acute” puts é ahead of every other small acute letter.
    const hits: { cp: number; whole: number; len: number }[] = [];
    for (let i = 0; i < db.names.length; i++) {
      const n = db.names[i];
      if (!words.every((w) => n.includes(w))) continue;
      const tokens = n.split(/[\s-]+/);
      let whole = 0;
      let ok = true;
      for (const w of words) {
        const isWhole = tokens.includes(w);
        if (isWhole) whole++;
        else if (w.length === 1) ok = false;
      }
      if (ok) hits.push({ cp: db.cps[i], whole, len: n.length });
    }
    hits.sort((a, b) => b.whole - a.whole || a.len - b.len || a.cp - b.cp);
    for (const h of hits) {
      if (out.length >= MAX_RESULTS) break;
      out.push(h.cp);
    }
  }
  const unique = [...new Set(out)];
  return {
    kind: 'codepoints',
    cps: unique.slice(0, MAX_RESULTS),
    truncated: unique.length >= MAX_RESULTS,
  };
}

/** Blocks whose name contains the query, for the block picker. */
export const findBlocks = (q: string) =>
  BLOCKS.filter(([, , n]) => n.toLowerCase().includes(q.trim().toLowerCase()));
