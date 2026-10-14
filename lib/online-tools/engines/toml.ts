// JSON → TOML 1.0. Supported subset: a top-level object; strings, numbers,
// booleans, arrays and nested objects. Objects become [tables], arrays of
// objects become [[arrays of tables]], everything else is written inline.
// TOML has no null, so nulls are either reported as an error or — only when
// the user asks — left out and listed. Nothing is dropped silently.

import { ToolInputError, validateJson } from './data';

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

export type TomlOptions = {
  /** What to do with null values. Default: refuse and list them. */
  nulls?: 'error' | 'omit';
};

export type TomlResult = { toml: string; omitted: string[]; notes: string[] };

const isObj = (v: Json): v is Obj =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Bare keys are A–Z, a–z, 0–9, _ and -; anything else is quoted. */
export function tomlKey(k: string): string {
  return /^[A-Za-z0-9_-]+$/.test(k) ? k : tomlString(k);
}

export function tomlString(s: string): string {
  let out = '"';
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (ch === '"') out += '\\"';
    else if (ch === '\\') out += '\\\\';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (ch === '\b') out += '\\b';
    else if (ch === '\f') out += '\\f';
    else if (c < 0x20 || c === 0x7f)
      out += `\\u${c.toString(16).padStart(4, '0').toUpperCase()}`;
    else out += ch;
  }
  return `${out}"`;
}

function tomlNumber(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER)
    return String(n);
  // Floats need a "." or an exponent in TOML; JS gives "1e+21" or "0.5".
  const s = String(n);
  return /[.e]/i.test(s) ? s : `${s}.0`;
}

const pathOf = (parts: string[]) => parts.map(tomlKey).join('.');

export function jsonToToml(input: string, opts: TomlOptions = {}): TomlResult {
  const r = validateJson(input);
  if (!r.valid) throw new ToolInputError(r.message);
  const root = r.value as Json;
  if (!isObj(root))
    throw new ToolInputError(
      Array.isArray(root)
        ? 'TOML documents are tables, so the top level must be a JSON object, not an array. Wrap it, for example {"items": [...]}.'
        : 'TOML documents are tables, so the top level must be a JSON object such as {"name": "value"}.',
    );

  const nulls: string[] = [];
  const findNulls = (v: Json, p: string) => {
    if (v === null) nulls.push(p || '(root)');
    else if (Array.isArray(v)) v.forEach((x, i) => findNulls(x, `${p}[${i}]`));
    else if (isObj(v))
      for (const [k, x] of Object.entries(v)) findNulls(x, p ? `${p}.${k}` : k);
  };
  findNulls(root, '');
  const nullsInArrays = nulls.filter((p) => p.endsWith(']'));
  if (nulls.length && opts.nulls !== 'omit')
    throw new ToolInputError(
      `TOML has no null value, so ${nulls.length} value${nulls.length === 1 ? '' : 's'} can’t be converted: ${nulls.slice(0, 8).join(', ')}${nulls.length > 8 ? ', …' : ''}. Remove them, replace them, or choose “Leave out null values”.`,
    );
  if (nullsInArrays.length)
    throw new ToolInputError(
      `Null inside an array can’t be left out without shifting the positions of the other items: ${nullsInArrays.slice(0, 8).join(', ')}. Replace these values first.`,
    );

  const notes: string[] = [];
  const inline = (v: Json): string => {
    if (typeof v === 'string') return tomlString(v);
    if (typeof v === 'number') return tomlNumber(v);
    if (typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
    if (isObj(v)) {
      const entries = Object.entries(v).filter(([, x]) => x !== null);
      return entries.length
        ? `{ ${entries.map(([k, x]) => `${tomlKey(k)} = ${inline(x)}`).join(', ')} }`
        : '{}';
    }
    return '';
  };

  const lines: string[] = [];
  const isTableArray = (v: Json) =>
    Array.isArray(v) && v.length > 0 && v.every(isObj);

  const table = (obj: Obj, path: string[], header: string | null) => {
    if (header) {
      if (lines.length) lines.push('');
      lines.push(header);
    }
    const entries = Object.entries(obj).filter(([, v]) => v !== null);
    for (const [k, v] of entries)
      if (!isObj(v) && !isTableArray(v))
        lines.push(`${tomlKey(k)} = ${inline(v)}`);
    for (const [k, v] of entries) {
      if (isObj(v)) {
        const p = [...path, k];
        const hasScalars = Object.values(v).some(
          (x) => x !== null && !isObj(x) && !isTableArray(x),
        );
        // A table that only holds sub-tables needs no header of its own.
        table(
          v,
          p,
          hasScalars || !Object.keys(v).length ? `[${pathOf(p)}]` : null,
        );
      } else if (isTableArray(v)) {
        const p = [...path, k];
        for (const item of v as Obj[]) table(item, p, `[[${pathOf(p)}]]`);
      }
    }
  };
  table(root, [], null);
  // JSON.parse turns 1.0 into 1, so TOML gets an integer. Say so.
  if (/[:[,]\s*-?\d+\.0+\s*[,\]}]/.test(input))
    notes.push(
      'Numbers written like 1.0 are whole numbers to JSON, so they appear as integers (1) in the TOML.',
    );
  return {
    toml: `${lines.join('\n')}\n`.replace(/^\n+/, ''),
    omitted: nulls,
    notes,
  };
}
