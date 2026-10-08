// Helpers for the JSON tree explorer: path formatting, parse errors with
// line/column, type labels and key/value search. Pure functions so they can
// be tested without a DOM.

export type PathSegment = string | number;
export type JsonType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'null'
  | 'object'
  | 'array';

export type PathOptions = {
  /** Prefix the path with `$` (JSONPath style). */
  root?: boolean;
  /** Quote character used for keys that need bracket notation. */
  quote?: '"' | "'";
};

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export function isIdentifier(key: string): boolean {
  return IDENTIFIER.test(key);
}

/** Quotes a key for bracket notation, escaping backslashes, quotes and control characters. */
export function quoteKey(key: string, quote: '"' | "'" = '"'): string {
  if (quote === '"') return JSON.stringify(key);
  // JSON.stringify handles control characters; swap the outer quotes.
  const inner = JSON.stringify(key)
    .slice(1, -1)
    .replace(/\\"/g, '"')
    .replace(/'/g, "\\'");
  return `'${inner}'`;
}

/**
 * Builds a path like `users[0].profile.name`, or `$.users[0]…` with the root
 * option. Keys that aren't identifiers use bracket notation: `["odd key"]`.
 */
export function formatPath(
  segments: readonly PathSegment[],
  { root = false, quote = '"' }: PathOptions = {},
): string {
  let out = root ? '$' : '';
  for (const seg of segments) {
    if (typeof seg === 'number') out += `[${seg}]`;
    else if (isIdentifier(seg)) out += out ? `.${seg}` : seg;
    else out += `[${quoteKey(seg, quote)}]`;
  }
  return out || (root ? '$' : '');
}

export function jsonType(value: unknown): JsonType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'object';
}

/** 1-based line and column for a character offset into `text`. */
export function offsetToLineColumn(
  text: string,
  offset: number,
): { line: number; column: number } {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < clamped; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: clamped - lineStart + 1 };
}

export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string; line?: number; column?: number };

/**
 * Parses JSON and turns the engine's error into a message with a line and
 * column. Browsers word errors differently: V8 reports "at position N",
 * Firefox "at line L column C", Safari often neither.
 */
export function parseJson(text: string): JsonParseResult {
  if (!text.trim())
    return { ok: false, message: 'Paste some JSON to explore.' };
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (e) {
    // Engines disagree on whether (and how) they report a position, so find
    // the first error ourselves and only fall back to the engine's message.
    const found = findJsonError(text);
    if (found)
      return {
        ok: false,
        message: found.message,
        ...offsetToLineColumn(text, found.offset),
      };
    const raw = e instanceof Error ? e.message : String(e);
    return { ok: false, ...describeJsonError(text, raw) };
  }
}

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

/**
 * Scans `text` as JSON and returns the offset and a readable reason for the
 * first error, or null when it is valid. Iterative, so deep nesting is fine.
 */
export function findJsonError(
  text: string,
): { offset: number; message: string } | null {
  const n = text.length;
  const stack: ('o' | 'a')[] = [];
  type State = 'value' | 'valueOrEnd' | 'key' | 'keyOrEnd' | 'colon' | 'after';
  let state: State = 'value';
  let i = 0;
  const fail = (offset: number, message: string) => ({ offset, message });
  const show = (c: string) => JSON.stringify(c);

  const scanString = (): { offset: number; message: string } | null => {
    const start = i;
    i++;
    for (;;) {
      if (i >= n) return fail(start, 'Unterminated string');
      const c = text[i];
      if (c === '"') {
        i++;
        return null;
      }
      if (c === '\\') {
        const next = text[i + 1];
        if (next !== undefined && '"\\/bfnrt'.includes(next)) i += 2;
        else if (
          next === 'u' &&
          /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))
        )
          i += 6;
        else return fail(i, 'Invalid escape sequence in string');
      } else if (c.charCodeAt(0) < 0x20) {
        return fail(
          i,
          c === '\n'
            ? 'Line break inside a string (use \\n instead)'
            : 'Control character inside a string',
        );
      } else i++;
    }
  };

  for (;;) {
    while (i < n && ' \t\n\r'.includes(text[i])) i++;
    if (i >= n) {
      if (state === 'after' && stack.length === 0) return null;
      return fail(n, 'Unexpected end of JSON input');
    }
    const c = text[i];
    if (state === 'after' && stack.length === 0)
      return fail(i, `Unexpected ${show(c)} after the end of the JSON value`);

    if (state === 'value' || state === 'valueOrEnd') {
      if (c === ']') {
        if (state === 'valueOrEnd') {
          stack.pop();
          i++;
          state = 'after';
          continue;
        }
        if (stack[stack.length - 1] === 'a')
          return fail(i, "Trailing comma before ']'");
      }
      if (c === '{') {
        stack.push('o');
        i++;
        state = 'keyOrEnd';
        continue;
      }
      if (c === '[') {
        stack.push('a');
        i++;
        state = 'valueOrEnd';
        continue;
      }
      if (c === '"') {
        const err = scanString();
        if (err) return err;
      } else if (c === '-' || (c >= '0' && c <= '9')) {
        NUMBER.lastIndex = i;
        const m = NUMBER.exec(text);
        if (!m) return fail(i, 'Invalid number');
        i += m[0].length;
      } else if (text.startsWith('true', i)) i += 4;
      else if (text.startsWith('false', i)) i += 5;
      else if (text.startsWith('null', i)) i += 4;
      else if (c === "'") return fail(i, 'Strings must use double quotes');
      else return fail(i, `Unexpected ${show(c)}, expected a value`);
      state = 'after';
      continue;
    }

    if (state === 'key' || state === 'keyOrEnd') {
      if (c === '}') {
        if (state === 'keyOrEnd') {
          stack.pop();
          i++;
          state = 'after';
          continue;
        }
        return fail(i, "Trailing comma before '}'");
      }
      if (c !== '"')
        return fail(
          i,
          c === "'"
            ? 'Property names must use double quotes'
            : 'Expected a double-quoted property name',
        );
      const err = scanString();
      if (err) return err;
      state = 'colon';
      continue;
    }

    if (state === 'colon') {
      if (c !== ':') return fail(i, "Expected ':' after the property name");
      i++;
      state = 'value';
      continue;
    }

    // state === 'after': inside a container, after a value.
    const top = stack[stack.length - 1];
    if (c === ',') {
      i++;
      state = top === 'o' ? 'key' : 'value';
    } else if ((top === 'o' && c === '}') || (top === 'a' && c === ']')) {
      stack.pop();
      i++;
    } else
      return fail(
        i,
        top === 'o'
          ? "Expected ',' or '}' after a property value"
          : "Expected ',' or ']' after an array item",
      );
  }
}

export function describeJsonError(
  text: string,
  raw: string,
): { message: string; line?: number; column?: number } {
  const clean = raw
    .replace(/^JSON\.parse:\s*/i, '')
    .replace(/^JSON Parse error:\s*/i, '')
    .replace(/\s*\(line \d+ column \d+\)/i, '')
    .replace(/\s+at line \d+ column \d+ of the JSON data/i, '')
    .replace(/\s+in JSON at position \d+/i, '')
    .replace(/\s+at position \d+/i, '');
  const message = clean.charAt(0).toUpperCase() + clean.slice(1);
  const lc = /line (\d+) column (\d+)/i.exec(raw);
  if (lc) return { message, line: Number(lc[1]), column: Number(lc[2]) };
  const pos = /position (\d+)/i.exec(raw);
  if (pos) return { message, ...offsetToLineColumn(text, Number(pos[1])) };
  if (/unexpected end/i.test(raw))
    return { message, ...offsetToLineColumn(text, text.length) };
  return { message };
}

/** Stable id for a node, used as the key of the expanded set. */
export function nodeId(path: readonly PathSegment[]): string {
  return JSON.stringify(path);
}

export function isContainer(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export function childEntries(value: unknown): [PathSegment, unknown][] {
  if (Array.isArray(value)) return value.map((v, i) => [i, v]);
  if (isContainer(value)) return Object.entries(value);
  return [];
}

export function valueAt(root: unknown, path: readonly PathSegment[]): unknown {
  let cur: unknown = root;
  for (const seg of path) {
    if (!isContainer(cur)) return undefined;
    cur = (cur as Record<string | number, unknown>)[seg];
  }
  return cur;
}

export type SearchMatch = {
  path: PathSegment[];
  /** Whether the key, the primitive value, or both matched. */
  on: 'key' | 'value' | 'both';
};

/**
 * Case-insensitive search over keys and primitive values, in document
 * order. Iterative so deeply nested input can't overflow the stack; capped
 * so a one-letter query on a huge file stays fast.
 */
export function searchJson(
  root: unknown,
  query: string,
  limit = 5000,
): { matches: SearchMatch[]; truncated: boolean } {
  const q = query.trim().toLowerCase();
  const matches: SearchMatch[] = [];
  if (!q) return { matches, truncated: false };
  const stack: { path: PathSegment[]; value: unknown }[] = [
    { path: [], value: root },
  ];
  while (stack.length) {
    const { path, value } = stack.pop()!;
    const last = path[path.length - 1];
    const keyHit = typeof last === 'string' && last.toLowerCase().includes(q);
    const valueHit =
      !isContainer(value) && String(value).toLowerCase().includes(q);
    if (keyHit || valueHit) {
      matches.push({
        path,
        on: keyHit && valueHit ? 'both' : keyHit ? 'key' : 'value',
      });
      if (matches.length >= limit) return { matches, truncated: true };
    }
    if (isContainer(value)) {
      const entries = childEntries(value);
      for (let i = entries.length - 1; i >= 0; i--)
        stack.push({ path: [...path, entries[i][0]], value: entries[i][1] });
    }
  }
  return { matches, truncated: false };
}

/** Ids of every ancestor container of `path` (root included, node excluded). */
export function ancestorIds(path: readonly PathSegment[]): string[] {
  const ids: string[] = [];
  for (let i = 0; i < path.length; i++) ids.push(nodeId(path.slice(0, i)));
  return ids;
}

/**
 * Ids of containers down to `depth` levels (root = level 0), stopping at
 * `limit` so "expand all" on a huge document can't render millions of rows.
 */
export function containerIdsToDepth(
  root: unknown,
  depth: number,
  limit = 2000,
): { ids: string[]; truncated: boolean } {
  const ids: string[] = [];
  const queue: { path: PathSegment[]; value: unknown }[] = [
    { path: [], value: root },
  ];
  // Breadth-first so a truncated "expand all" opens the top levels first.
  for (let head = 0; head < queue.length; head++) {
    const { path, value } = queue[head];
    if (!isContainer(value) || path.length >= depth) continue;
    ids.push(nodeId(path));
    if (ids.length >= limit) return { ids, truncated: true };
    for (const [k, v] of childEntries(value))
      if (isContainer(v)) queue.push({ path: [...path, k], value: v });
  }
  return { ids, truncated: false };
}

/** Text for "Copy value": raw strings unquoted, everything else as JSON. */
export function copyValueText(value: unknown): string {
  if (typeof value === 'string') return value;
  return JSON.stringify(value) ?? '';
}

export function prettySubtree(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? '';
}
