// Engines for the v0.9.0 developer tools that are plain text in / text out:
// HTML entities, JSON ↔ XML, string escaping and number bases.

import { ToolInputError } from './data';

/* ------------------------------------------------------------------ */
/* HTML entities                                                        */
/* ------------------------------------------------------------------ */

// Named entities used for encoding (and decoding without a DOM).
const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  copy: '©',
  reg: '®',
  trade: '™',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
  sect: '§',
  para: '¶',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  micro: 'µ',
  middot: '·',
  laquo: '«',
  raquo: '»',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  sbquo: '‚',
  bdquo: '„',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  bull: '•',
  dagger: '†',
  Dagger: '‡',
  permil: '‰',
  prime: '′',
  Prime: '″',
  larr: '←',
  rarr: '→',
  uarr: '↑',
  darr: '↓',
  harr: '↔',
  hearts: '♥',
  infin: '∞',
  ne: '≠',
  le: '≤',
  ge: '≥',
  frac12: '½',
  frac14: '¼',
  frac34: '¾',
  sup2: '²',
  sup3: '³',
  iexcl: '¡',
  iquest: '¿',
  szlig: 'ß',
  agrave: 'à',
  aacute: 'á',
  acirc: 'â',
  atilde: 'ã',
  auml: 'ä',
  aring: 'å',
  aelig: 'æ',
  ccedil: 'ç',
  egrave: 'è',
  eacute: 'é',
  ecirc: 'ê',
  euml: 'ë',
  igrave: 'ì',
  iacute: 'í',
  icirc: 'î',
  iuml: 'ï',
  ntilde: 'ñ',
  ograve: 'ò',
  oacute: 'ó',
  ocirc: 'ô',
  otilde: 'õ',
  ouml: 'ö',
  oslash: 'ø',
  ugrave: 'ù',
  uacute: 'ú',
  ucirc: 'û',
  uuml: 'ü',
  yacute: 'ý',
  yuml: 'ÿ',
  Agrave: 'À',
  Aacute: 'Á',
  Acirc: 'Â',
  Atilde: 'Ã',
  Auml: 'Ä',
  Aring: 'Å',
  AElig: 'Æ',
  Ccedil: 'Ç',
  Egrave: 'È',
  Eacute: 'É',
  Ecirc: 'Ê',
  Euml: 'Ë',
  Ntilde: 'Ñ',
  Ouml: 'Ö',
  Oslash: 'Ø',
  Uuml: 'Ü',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  pi: 'π',
  sigma: 'σ',
  omega: 'ω',
  Omega: 'Ω',
};
const NAME_OF = new Map(Object.entries(NAMED).map(([k, v]) => [v, k]));

export type EntityEncodeMode = 'minimal' | 'named' | 'numeric' | 'hex';

/**
 * minimal: only & < > " ' (enough for HTML text and attributes).
 * named / numeric / hex: also every non-ASCII character.
 */
export function encodeEntities(input: string, mode: EntityEncodeMode): string {
  const basic: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  let out = '';
  for (const ch of input) {
    if (basic[ch]) {
      out += basic[ch];
      continue;
    }
    const cp = ch.codePointAt(0)!;
    if (mode === 'minimal' || cp < 0x80) {
      out += ch;
      continue;
    }
    const name = mode === 'named' ? NAME_OF.get(ch) : undefined;
    out += name
      ? `&${name};`
      : mode === 'hex'
        ? `&#x${cp.toString(16).toUpperCase()};`
        : `&#${cp};`;
  }
  return out;
}

const ENTITY_RE = /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);?/gi;

function decodeOne(m: string, body: string, semicolon: boolean): string | null {
  if (body[0] === '#') {
    const cp =
      body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
    if (!Number.isFinite(cp) || cp < 0 || cp > 0x10ffff) return '\uFFFD';
    if (cp === 0) return '\uFFFD';
    return String.fromCodePoint(cp);
  }
  if (!semicolon && !['amp', 'lt', 'gt', 'quot', 'nbsp'].includes(body))
    return null;
  return NAMED[body] ?? null;
}

/** Decodes numeric and common named entities without a DOM. */
export function decodeEntitiesBasic(input: string): string {
  return input.replace(ENTITY_RE, (m, body: string) => {
    const r = decodeOne(m, body, m.endsWith(';'));
    return r ?? m;
  });
}

/**
 * Decodes every HTML5 named entity using the browser's own parser. A
 * DOMParser document is inert: scripts never run and nothing is fetched.
 */
export function decodeEntities(input: string): string {
  if (typeof DOMParser === 'undefined') return decodeEntitiesBasic(input);
  // Decode entity by entity so markup in the input stays literal text.
  const doc = new DOMParser().parseFromString(
    '<!doctype html><p></p>',
    'text/html',
  );
  const p = doc.body.firstChild as HTMLElement;
  return input.replace(ENTITY_RE, (m) => {
    p.innerHTML = m;
    const t = p.textContent ?? m;
    return t;
  });
}

/* ------------------------------------------------------------------ */
/* JSON ↔ XML                                                           */
/* ------------------------------------------------------------------ */

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Makes any JSON key a valid XML element name. */
export function xmlName(key: string): string {
  let n = key.replace(/[^\p{L}\p{N}_.-]/gu, '_');
  if (!/^[\p{L}_]/u.test(n)) n = `_${n}`;
  if (/^xml/i.test(n)) n = `_${n}`;
  return n;
}

export type JsonToXmlOptions = {
  root?: string;
  item?: string;
  indent?: string;
  /** Keys starting with this prefix become attributes. */
  attrPrefix?: string;
  declaration?: boolean;
};

export function jsonToXml(json: string, opts: JsonToXmlOptions = {}): string {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch (e) {
    throw new ToolInputError(
      `Invalid JSON: ${(e as Error).message.replace(/^JSON\.parse: /, '')}`,
    );
  }
  const indent = opts.indent ?? '  ';
  const prefix = opts.attrPrefix ?? '@';
  const item = xmlName(opts.item || 'item');
  const nl = indent ? '\n' : '';

  const render = (name: string, value: unknown, depth: number): string => {
    const pad = indent.repeat(depth);
    if (Array.isArray(value)) {
      return value.map((v) => render(name, v, depth)).join(nl);
    }
    if (value === null || value === undefined) return `${pad}<${name}/>`;
    if (typeof value !== 'object')
      return `${pad}<${name}>${xmlEscape(String(value))}</${name}>`;
    const entries = Object.entries(value as Record<string, unknown>);
    const attrs = entries
      .filter(
        ([k, v]) => prefix && k.startsWith(prefix) && typeof v !== 'object',
      )
      .map(
        ([k, v]) =>
          ` ${xmlName(k.slice(prefix.length))}="${xmlEscape(String(v))}"`,
      )
      .join('');
    const text = entries.find(([k]) => k === '#text');
    const children = entries.filter(
      ([k, v]) =>
        k !== '#text' &&
        !(prefix && k.startsWith(prefix) && typeof v !== 'object'),
    );
    if (!children.length && !text) return `${pad}<${name}${attrs}/>`;
    if (!children.length)
      return `${pad}<${name}${attrs}>${xmlEscape(String(text![1]))}</${name}>`;
    const inner = children
      .map(([k, v]) =>
        Array.isArray(v) && v.length === 0
          ? `${indent.repeat(depth + 1)}<${xmlName(k)}/>`
          : render(xmlName(k), v, depth + 1),
      )
      .join(nl);
    return `${pad}<${name}${attrs}>${nl}${text ? `${indent.repeat(depth + 1)}${xmlEscape(String(text[1]))}${nl}` : ''}${inner}${nl}${pad}</${name}>`;
  };

  const root = xmlName(opts.root || 'root');
  const body = Array.isArray(data)
    ? `<${root}>${nl}${data.map((v) => render(item, v, 1)).join(nl)}${nl}</${root}>`
    : data !== null &&
        typeof data === 'object' &&
        Object.keys(data).length === 1 &&
        !opts.root
      ? render(xmlName(Object.keys(data)[0]), Object.values(data)[0], 0)
      : render(root, data, 0);
  return (
    (opts.declaration === false
      ? ''
      : `<?xml version="1.0" encoding="UTF-8"?>${nl}`) + body
  );
}

type XmlValue = string | null | XmlObject | XmlValue[];
type XmlObject = { [k: string]: XmlValue };

function scalar(s: string): string | number | boolean | null {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(s) && s.length < 16)
    return Number(s);
  return s;
}

/** XML → JSON using the browser's DOMParser (no entity expansion of DTDs). */
export function xmlToJson(
  xml: string,
  opts: { attrPrefix?: string; typed?: boolean; indent?: number } = {},
): string {
  if (typeof DOMParser === 'undefined')
    throw new ToolInputError('XML parsing needs a browser.');
  if (/<!DOCTYPE[^>]*\[/i.test(xml))
    throw new ToolInputError('XML with an inline DTD is not supported.');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const err = doc.getElementsByTagName('parsererror')[0];
  if (err)
    throw new ToolInputError(
      `Invalid XML: ${(err.textContent || '').split('\n').find((l) => l.trim()) ?? 'could not parse'}`,
    );
  const prefix = opts.attrPrefix ?? '@';
  const conv = (s: string) => (opts.typed === false ? s : scalar(s));

  const walk = (el: Element): unknown => {
    const obj: Record<string, unknown> = {};
    for (const a of Array.from(el.attributes))
      obj[prefix + a.name] = conv(a.value);
    const kids = Array.from(el.children);
    const text = Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3 || n.nodeType === 4)
      .map((n) => n.nodeValue ?? '')
      .join('')
      .trim();
    if (!kids.length) {
      if (!Object.keys(obj).length) return text === '' ? null : conv(text);
      if (text) obj['#text'] = conv(text);
      return obj;
    }
    for (const k of kids) {
      const v = walk(k);
      const name = k.tagName;
      if (name in obj) {
        const cur = obj[name];
        obj[name] = Array.isArray(cur) ? [...cur, v] : [cur, v];
      } else obj[name] = v;
    }
    if (text) obj['#text'] = conv(text);
    return obj;
  };
  const root = doc.documentElement;
  return JSON.stringify(
    { [root.tagName]: walk(root) } as XmlObject,
    null,
    opts.indent ?? 2,
  );
}

/* ------------------------------------------------------------------ */
/* String escape / unescape                                             */
/* ------------------------------------------------------------------ */

export type EscapeMode =
  | 'json'
  | 'javascript'
  | 'java'
  | 'python'
  | 'sql'
  | 'csv'
  | 'regex'
  | 'shell'
  | 'xml';

const hex4 = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');

function escapeCLike(
  s: string,
  mode: 'json' | 'javascript' | 'java' | 'python',
) {
  let out = '';
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    switch (ch) {
      case '\\':
        out += '\\\\';
        continue;
      case '"':
        out += '\\"';
        continue;
      case "'":
        out += mode === 'json' || mode === 'java' ? "'" : "\\'";
        continue;
      case '\n':
        out += '\\n';
        continue;
      case '\r':
        out += '\\r';
        continue;
      case '\t':
        out += '\\t';
        continue;
      case '\b':
        out += '\\b';
        continue;
      case '\f':
        out += '\\f';
        continue;
    }
    if (mode === 'javascript' && (ch === '`' || ch === '$')) {
      // Escaping $ too keeps template literals from interpolating ${…}.
      out += `\\${ch}`;
      continue;
    }
    if (cp < 0x20 || cp === 0x7f || cp === 0x2028 || cp === 0x2029) {
      out +=
        mode === 'python' && cp < 0x100
          ? `\\x${cp.toString(16).padStart(2, '0')}`
          : `\\u${hex4(cp)}`;
      continue;
    }
    out += ch;
  }
  return out;
}

function unescapeCLike(s: string): string {
  return s.replace(
    /\\(u\{([0-9a-fA-F]+)\}|u([0-9a-fA-F]{4})|x([0-9a-fA-F]{2})|U([0-9a-fA-F]{8})|([0-7]{1,3})|([\s\S])|$)/g,
    (m, _all, ub, u4, x2, u8, oct, c) => {
      if (ub) return String.fromCodePoint(parseInt(ub, 16));
      if (u4) return String.fromCharCode(parseInt(u4, 16));
      if (x2) return String.fromCharCode(parseInt(x2, 16));
      if (u8) return String.fromCodePoint(parseInt(u8, 16));
      if (oct) return String.fromCharCode(parseInt(oct, 8));
      if (c === undefined)
        throw new ToolInputError('The text ends with a lone backslash.');
      const map: Record<string, string> = {
        n: '\n',
        r: '\r',
        t: '\t',
        b: '\b',
        f: '\f',
        v: '\v',
        '0': '\0',
      };
      return map[c] ?? c;
    },
  );
}

export function escapeString(s: string, mode: EscapeMode): string {
  switch (mode) {
    case 'json':
    case 'javascript':
    case 'java':
    case 'python':
      return escapeCLike(s, mode);
    case 'sql':
      return s.replace(/'/g, "''");
    case 'csv':
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    case 'regex':
      return s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
    case 'shell':
      return `'${s.replace(/'/g, `'\\''`)}'`;
    case 'xml':
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
  }
}

export function unescapeString(s: string, mode: EscapeMode): string {
  switch (mode) {
    case 'json': {
      try {
        return JSON.parse(`"${s.replace(/^"|"$/g, '')}"`);
      } catch {
        throw new ToolInputError(
          'This is not a valid JSON string body — check for unescaped quotes or bad \\u sequences.',
        );
      }
    }
    case 'javascript':
    case 'java':
    case 'python':
      return unescapeCLike(s);
    case 'sql':
      return s.replace(/''/g, "'");
    case 'csv': {
      const m = /^"([\s\S]*)"$/.exec(s);
      return m ? m[1].replace(/""/g, '"') : s;
    }
    case 'regex':
      return s.replace(/\\(.)/g, '$1');
    case 'shell': {
      const m = /^'([\s\S]*)'$/.exec(s);
      return (m ? m[1] : s).replace(/'\\''/g, "'");
    }
    case 'xml':
      return decodeEntitiesBasic(s);
  }
}

/* ------------------------------------------------------------------ */
/* Number bases                                                         */
/* ------------------------------------------------------------------ */

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Parses an integer in base 2–36 (prefixes 0x/0b/0o, _ and spaces allowed). */
export function parseBigInt(input: string, base: number): bigint {
  let s = input
    .trim()
    .toLowerCase()
    .replace(/[_\s,']/g, '');
  let neg = false;
  if (s.startsWith('-')) {
    neg = true;
    s = s.slice(1);
  } else if (s.startsWith('+')) s = s.slice(1);
  // An explicit 0x / 0b / 0o prefix always wins over the chosen base — except
  // in hex, where "0b…" is a valid number (0b12 = 2834).
  const pre = /^0([xbo])/.exec(s);
  if (pre && !(base === 16 && pre[1] === 'b')) {
    base = { x: 16, b: 2, o: 8 }[pre[1] as 'x' | 'b' | 'o'];
    s = s.slice(2);
  }
  if (base === 0) base = 10;
  if (!s) throw new ToolInputError('Enter a number.');
  let n = BigInt(0);
  const B = BigInt(base);
  for (const ch of s) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base)
      throw new ToolInputError(
        `“${ch}” is not a valid digit in base ${base}${base <= 10 ? ` (use 0–${base - 1})` : ` (use 0–9 and a–${DIGITS[base - 1]})`}.`,
      );
    n = n * B + BigInt(d);
  }
  return neg ? -n : n;
}

export function formatBigInt(
  n: bigint,
  base: number,
  opts: { group?: boolean; pad?: number; upper?: boolean } = {},
): string {
  const neg = n < BigInt(0);
  let s = (neg ? -n : n).toString(base);
  if (opts.upper) s = s.toUpperCase();
  if (opts.pad && s.length < opts.pad) s = s.padStart(opts.pad, '0');
  if (opts.group) {
    const size =
      base === 2 || base === 16 ? 4 : base === 8 ? 3 : base === 10 ? 3 : 0;
    if (size) {
      const sep = base === 10 ? ',' : ' ';
      s = s.replace(new RegExp(`\\B(?=(.{${size}})+$)`, 'g'), sep);
    }
  }
  return (neg ? '-' : '') + s;
}

export const BASE_NAMES: Record<number, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
  32: 'Base 32',
  36: 'Base 36',
};

const PREFIX: Record<number, string> = { 2: '0b', 8: '0o', 16: '0x' };

/**
 * Converts one number per line from base `from` (0 = detect from prefix)
 * to base `to`, or to binary/octal/decimal/hex when `to` is 'all'.
 */
export function convertBases(
  input: string,
  from: number,
  to: number | 'all',
  opts: { group?: boolean; upper?: boolean } = {},
): string {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return '';
  const fmt = (n: bigint, b: number) =>
    formatBigInt(n, b, { group: opts.group, upper: opts.upper });
  if (to !== 'all')
    return lines.map((line) => fmt(parseBigInt(line, from), to)).join('\n');
  return lines
    .map((line) => {
      const n = parseBigInt(line, from);
      const rows = [2, 8, 10, 16]
        .map(
          (b) =>
            `${BASE_NAMES[b].padEnd(12)} ${n < BigInt(0) ? '-' : ''}${PREFIX[b] ?? ''}${fmt(n < BigInt(0) ? -n : n, b)}`,
        )
        .join('\n');
      return lines.length > 1 ? `${line}\n${rows}` : rows;
    })
    .join('\n\n');
}
