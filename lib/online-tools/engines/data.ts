// Data-format helpers for the developer tools: JSON, CSV, XML, Base64, URL
// and JWT. All pure and synchronous.

/** Error with a message that is safe to show to users as-is. */
export class ToolInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ToolInputError';
  }
}

// ── JSON ───────────────────────────────────────────────────────────────────

export type JsonValidation =
  | { valid: true; value: unknown }
  | { valid: false; message: string; line?: number; column?: number };

function lineColumnAt(text: string, index: number) {
  const before = text.slice(0, index);
  const line = before.split('\n').length;
  const column = index - before.lastIndexOf('\n');
  return { line, column };
}

/**
 * Offset of the first syntax error in `text`, or -1. A small validating
 * scanner used when the engine's error message has no position (current
 * Chrome and Node only say "Unexpected token").
 */
export function jsonErrorOffset(text: string): number {
  let i = 0;
  const ws = () => {
    while (i < text.length && ' \t\n\r'.includes(text[i])) i++;
  };
  const fail = () => {
    throw i;
  };
  const value = (depth: number): void => {
    if (depth > 512) fail();
    ws();
    const c = text[i];
    if (c === '{') {
      i++;
      ws();
      if (text[i] === '}') return void i++;
      for (;;) {
        ws();
        if (text[i] !== '"') fail();
        string();
        ws();
        if (text[i] !== ':') fail();
        i++;
        value(depth + 1);
        ws();
        if (text[i] === ',') i++;
        else if (text[i] === '}') return void i++;
        else fail();
      }
    }
    if (c === '[') {
      i++;
      ws();
      if (text[i] === ']') return void i++;
      for (;;) {
        value(depth + 1);
        ws();
        if (text[i] === ',') i++;
        else if (text[i] === ']') return void i++;
        else fail();
      }
    }
    if (c === '"') return string();
    for (const lit of ['true', 'false', 'null'])
      if (text.startsWith(lit, i)) return void (i += lit.length);
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(
      text.slice(i, i + 400),
    );
    if (!m) fail();
    i += m![0].length;
  };
  const string = () => {
    i++;
    while (i < text.length) {
      const c = text[i];
      if (c === '"') return void i++;
      if (c === '\\') {
        const e = text[i + 1];
        if (e === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail();
          i += 6;
        } else if (e !== undefined && '"\\/bfnrt'.includes(e)) i += 2;
        else fail();
      } else if (c < ' ') fail();
      else i++;
    }
    fail();
  };
  try {
    value(0);
    ws();
    return i < text.length ? i : -1;
  } catch (pos) {
    return typeof pos === 'number' ? Math.min(pos, text.length) : -1;
  }
}

export function validateJson(input: string): JsonValidation {
  if (!input.trim())
    return { valid: false, message: 'Please enter some JSON.' };
  try {
    return { valid: true, value: JSON.parse(input) };
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    const pos = raw.match(/position (\d+)/);
    const lc = raw.match(/line (\d+) column (\d+)/);
    let line: number | undefined;
    let column: number | undefined;
    if (lc) {
      line = Number(lc[1]);
      column = Number(lc[2]);
    } else if (pos) {
      ({ line, column } = lineColumnAt(input, Number(pos[1])));
    } else {
      const at = jsonErrorOffset(input);
      if (at !== -1) ({ line, column } = lineColumnAt(input, at));
    }
    const cleaned = raw
      .replace(/^JSON\.parse: /, '')
      .replace(/ (in JSON )?at position \d+.*$/, '')
      .replace(/ at line \d+ column \d+.*$/, '')
      // V8 quotes the input: `Unexpected token '}', "…" is not valid JSON`.
      .replace(/, (\.\.\.)?"[\s\S]*" is not valid JSON$/, '')
      .replace(/^"[\s\S]*" is not valid JSON$/, 'unexpected input');
    return {
      valid: false,
      message: `Invalid JSON: ${cleaned}${line ? ` (line ${line}, column ${column})` : ''}.`,
      line,
      column,
    };
  }
}

function parseJsonOrThrow(input: string): unknown {
  const r = validateJson(input);
  if (!r.valid) throw new ToolInputError(r.message);
  return r.value;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => [k, sortKeysDeep((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

export function formatJson(
  input: string,
  opts: { indent?: number | 'tab'; sortKeys?: boolean } = {},
): string {
  const { indent = 2, sortKeys = false } = opts;
  let value = parseJsonOrThrow(input);
  if (sortKeys) value = sortKeysDeep(value);
  return JSON.stringify(value, null, indent === 'tab' ? '\t' : indent);
}

export function minifyJson(input: string): string {
  return JSON.stringify(parseJsonOrThrow(input));
}

// ── CSV ────────────────────────────────────────────────────────────────────

export function parseCsv(input: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (inQuotes)
    throw new ToolInputError('Invalid CSV: a quoted field is never closed.');
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

function inferValue(v: string): unknown {
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null') return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(v)) return Number(v);
  return v;
}

export function csvToJson(
  input: string,
  opts: { delimiter?: string; header?: boolean; inferTypes?: boolean } = {},
): string {
  const { delimiter = ',', header = true, inferTypes = true } = opts;
  if (!input.trim()) throw new ToolInputError('Please enter some CSV.');
  const rows = parseCsv(input, delimiter === '\\t' ? '\t' : delimiter);
  const conv = (v: string) => (inferTypes ? inferValue(v) : v);
  if (!header)
    return JSON.stringify(
      rows.map((r) => r.map(conv)),
      null,
      2,
    );
  const [head, ...body] = rows;
  const keys = head.map((h, i) => h.trim() || `column${i + 1}`);
  return JSON.stringify(
    body.map((r) =>
      Object.fromEntries(keys.map((k, i) => [k, conv(r[i] ?? '')])),
    ),
    null,
    2,
  );
}

function flatten(
  value: unknown,
  prefix = '',
  out: Record<string, unknown> = {},
) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out[prefix] = value;
  }
  return out;
}

function csvCell(v: unknown, delimiter: string): string {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.includes('"') || s.includes(delimiter) || /[\r\n]/.test(s)
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

export function jsonToCsv(
  input: string,
  opts: { delimiter?: string } = {},
): string {
  const delimiter = opts.delimiter === '\\t' ? '\t' : (opts.delimiter ?? ',');
  const data = parseJsonOrThrow(input);
  const items = Array.isArray(data) ? data : [data];
  if (!items.length) return '';
  const rows: Record<string, unknown>[] = items.map((item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? flatten(item)
      : { value: item },
  );
  const keys: string[] = [];
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => keys.includes(k) || keys.push(k)),
  );
  return [
    keys.map((k) => csvCell(k, delimiter)).join(delimiter),
    ...rows.map((r) =>
      keys.map((k) => csvCell(r[k], delimiter)).join(delimiter),
    ),
  ].join('\n');
}

// ── XML ────────────────────────────────────────────────────────────────────

export function formatXml(input: string, indent = 2): string {
  const src = input.trim();
  if (!src) throw new ToolInputError('Please enter some XML.');
  if (!src.startsWith('<'))
    throw new ToolInputError(
      'Invalid XML: the document must start with a tag.',
    );
  const tokens =
    src.match(/<!\[CDATA\[[\s\S]*?\]\]>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  const pad = ' '.repeat(indent);
  const stack: string[] = [];
  const lines: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t.startsWith('<')) {
      const text = t.trim();
      if (text) lines.push(pad.repeat(stack.length) + text);
      continue;
    }
    if (/^<\//.test(t)) {
      const name = t.slice(2, -1).trim();
      const open = stack.pop();
      if (open !== name) {
        throw new ToolInputError(
          `Invalid XML: closing tag </${name}> does not match ${open ? `<${open}>` : 'any open tag'}.`,
        );
      }
      lines.push(pad.repeat(stack.length) + t);
    } else if (/^<(\?|!)/.test(t) || /\/>$/.test(t)) {
      lines.push(pad.repeat(stack.length) + t);
    } else {
      const name = t.slice(1).match(/^[^\s/>]+/)?.[0] ?? '';
      // Keep <tag>text</tag> on one line.
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      if (next && !next.startsWith('<') && after === `</${name}>`) {
        lines.push(pad.repeat(stack.length) + t + next.trim() + after);
        i += 2;
        continue;
      }
      lines.push(pad.repeat(stack.length) + t);
      stack.push(name);
    }
  }
  if (stack.length)
    throw new ToolInputError(
      `Invalid XML: <${stack[stack.length - 1]}> is never closed.`,
    );
  return lines.join('\n');
}

export function minifyXml(input: string): string {
  return formatXml(input, 0)
    .split('\n')
    .map((l) => l.trim())
    .join('');
}

// ── Base64 / URL ───────────────────────────────────────────────────────────

export function utf8ToBase64(input: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(input);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  const b64 = btoa(bin);
  return urlSafe
    ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : b64;
}

export function base64ToBytes(input: string): Uint8Array {
  const clean = input
    .trim()
    .replace(/^data:[^,]*,/, '')
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
    throw new ToolInputError(
      'Invalid Base64: the input contains characters that are not part of Base64.',
    );
  }
  const padded = clean + '='.repeat((4 - (clean.length % 4)) % 4);
  let bin: string;
  try {
    bin = atob(padded);
  } catch {
    throw new ToolInputError('Invalid Base64: the input could not be decoded.');
  }
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function base64ToUtf8(input: string): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(
      base64ToBytes(input),
    );
  } catch (e) {
    if (e instanceof ToolInputError) throw e;
    throw new ToolInputError(
      'The decoded data is not valid UTF-8 text. It may be a binary file — try the Base64 to Image tool.',
    );
  }
}

export function urlEncode(
  input: string,
  mode: 'component' | 'uri' = 'component',
): string {
  return mode === 'uri' ? encodeURI(input) : encodeURIComponent(input);
}

export function urlDecode(input: string, plusAsSpace = true): string {
  try {
    return decodeURIComponent(plusAsSpace ? input.replace(/\+/g, ' ') : input);
  } catch {
    throw new ToolInputError(
      'Invalid URL encoding: a "%" is not followed by two hex digits.',
    );
  }
}

// ── JWT ────────────────────────────────────────────────────────────────────

export type DecodedJwt = {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  issuedAt?: Date;
  expiresAt?: Date;
  notBefore?: Date;
  expired?: boolean;
};

export function decodeJwt(token: string, now = new Date()): DecodedJwt {
  const parts = token
    .trim()
    .replace(/^Bearer\s+/i, '')
    .split('.');
  if (parts.length !== 3) {
    throw new ToolInputError(
      'Invalid JWT: a token has three parts separated by dots (header.payload.signature).',
    );
  }
  const decodePart = (p: string, label: string) => {
    try {
      const json = JSON.parse(base64ToUtf8(p));
      if (!json || typeof json !== 'object') throw new Error();
      return json as Record<string, unknown>;
    } catch {
      throw new ToolInputError(
        `Invalid JWT: the ${label} is not Base64URL-encoded JSON.`,
      );
    }
  };
  const header = decodePart(parts[0], 'header');
  const payload = decodePart(parts[1], 'payload');
  const toDate = (v: unknown) =>
    typeof v === 'number' ? new Date(v * 1000) : undefined;
  const expiresAt = toDate(payload.exp);
  return {
    header,
    payload,
    signature: parts[2],
    issuedAt: toDate(payload.iat),
    expiresAt,
    notBefore: toDate(payload.nbf),
    expired: expiresAt ? expiresAt.getTime() < now.getTime() : undefined,
  };
}
