// Helpers for the local-only productivity tools: strict type guards for data
// read back from localStorage or an imported file, and JSON import parsing.
// Imported files are only ever parsed as JSON and checked — never executed.

export const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const isStr = (v: unknown, max = 10000): v is string =>
  typeof v === 'string' && v.length <= max;

export const isId = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= 64;

export const isFiniteNum = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

/** True when every element passes `guard` and the array isn't too long. */
export function isArrayOf<T>(
  v: unknown,
  guard: (x: unknown) => x is T,
  max = 1000,
): v is T[] {
  return Array.isArray(v) && v.length <= max && v.every(guard);
}

/** Ids must be unique, or editing one item would change another. */
export function uniqueIds(items: { id: string }[]): boolean {
  return new Set(items.map((i) => i.id)).size === items.length;
}

/** Real calendar date in YYYY-MM-DD form (rejects 2024-02-30). */
export function isIsoDate(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1) return false;
  const dim = [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return d <= dim[mo - 1];
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Today's date in the user's time zone as YYYY-MM-DD. */
export function todayIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export type ImportResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

/** Largest import accepted; real boards are a few kilobytes. */
export const MAX_IMPORT_BYTES = 2_000_000;

/**
 * Parses an exported JSON file. Exports carry a `tool` field so a Kanban
 * file can't be loaded into the timeline by mistake; it is removed before
 * the data is checked against `guard`.
 */
export function parseJsonImport<T>(
  text: string,
  tool: string,
  guard: (v: unknown) => v is T,
): ImportResult<T> {
  if (text.length > MAX_IMPORT_BYTES)
    return { ok: false, error: 'That file is too large to import (max 2 MB).' };
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: 'That file isn’t valid JSON. Choose a file exported by this tool.',
    };
  }
  if (!isObj(data))
    return { ok: false, error: 'The file doesn’t contain a saved board.' };
  const { tool: from, ...rest } = data;
  if (from !== undefined && from !== tool)
    return {
      ok: false,
      error: `This file was exported from “${String(from).slice(0, 40)}”, not from this tool.`,
    };
  if (!guard(rest))
    return {
      ok: false,
      error:
        'The file’s contents don’t match this tool’s format (missing fields, wrong types or a newer version). Nothing was changed.',
    };
  return { ok: true, value: rest };
}

/** JSON text for an export file, tagged with the tool it came from. */
export function toExportJson(tool: string, state: object): string {
  return JSON.stringify({ tool, ...state }, null, 2);
}
