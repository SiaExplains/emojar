// Tables shared by the Markdown Table Generator, CSV to Markdown and the CSV
// Viewer: GitHub-flavoured Markdown output with escaping, CSV reading (BOM,
// delimiter detection) and writing, and sorting/filtering for the viewer.

import { ToolInputError, parseCsv } from './data';

export type Align = 'none' | 'left' | 'center' | 'right';

/**
 * Escapes a cell for a GFM table: pipes become \| and line breaks <br>.
 * Backslashes are doubled so they stay literal — except inside `code` spans,
 * where Markdown doesn't process escapes and doubling would show.
 */
export function escapeCell(s: string): string {
  return s
    .split(/(`+[^`]*`+)/)
    .map((part, i) => (i % 2 ? part : part.replace(/\\/g, '\\\\')))
    .join('')
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, '<br>')
    .trim();
}

const SEP: Record<Align, (w: number) => string> = {
  none: (w) => '-'.repeat(Math.max(3, w)),
  left: (w) => `:${'-'.repeat(Math.max(2, w - 1))}`,
  center: (w) => `:${'-'.repeat(Math.max(1, w - 2))}:`,
  right: (w) => `${'-'.repeat(Math.max(2, w - 1))}:`,
};

/** Visible width, counting wide CJK and emoji as two columns. */
function width(s: string): number {
  let w = 0;
  for (const ch of s)
    w += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]|\p{Extended_Pictographic}/u.test(
      ch,
    )
      ? 2
      : 1;
  return w;
}

/**
 * A Markdown table from a header row and body rows. Short rows are padded
 * with empty cells; `pretty` pads columns so the source lines up.
 */
export function toMarkdownTable(
  header: string[],
  rows: string[][],
  align: Align[] = [],
  pretty = true,
): string {
  const cols = Math.max(header.length, ...rows.map((r) => r.length), 1);
  const norm = (r: string[]) =>
    Array.from({ length: cols }, (_, i) => escapeCell(r[i] ?? ''));
  const head = norm(header).map((h, i) => h || `Column ${i + 1}`);
  const body = rows.map(norm);
  const widths = Array.from({ length: cols }, (_, i) =>
    pretty ? Math.max(3, width(head[i]), ...body.map((r) => width(r[i]))) : 3,
  );
  const pad = (s: string, i: number) => {
    if (!pretty) return s;
    const gap = widths[i] - width(s);
    const a = align[i] ?? 'none';
    if (a === 'right') return ' '.repeat(gap) + s;
    if (a === 'center') {
      const l = Math.floor(gap / 2);
      return ' '.repeat(l) + s + ' '.repeat(gap - l);
    }
    return s + ' '.repeat(gap);
  };
  const line = (r: string[]) => `| ${r.map(pad).join(' | ')} |`;
  const sep = `| ${widths.map((w, i) => SEP[align[i] ?? 'none'](w)).join(' | ')} |`;
  return [line(head), sep, ...body.map(line)].join('\n');
}

/* ------------------------------------------------------------------ */
/* CSV                                                                  */
/* ------------------------------------------------------------------ */

export const MAX_CSV_BYTES = 25 * 1024 * 1024;

export type Delimiter = ',' | ';' | '\t' | '|';

/** Picks the delimiter that splits the first lines most consistently. */
export function detectDelimiter(text: string): Delimiter {
  const lines = text
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .slice(0, 20);
  let best: Delimiter = ',';
  let bestScore = -1;
  for (const d of [',', ';', '\t', '|'] as Delimiter[]) {
    // Count outside quotes only.
    const counts = lines.map((l) => {
      let n = 0;
      let q = false;
      for (const c of l) {
        if (c === '"') q = !q;
        else if (c === d && !q) n++;
      }
      return n;
    });
    if (!counts[0]) continue;
    const consistent = counts.filter((c) => c === counts[0]).length;
    const score = consistent * 100 + counts[0];
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

export type CsvTable = {
  header: string[];
  rows: string[][];
  delimiter: Delimiter;
  /** Rows whose cell count differs from the header. */
  ragged: number;
};

/**
 * Reads CSV text: strips a UTF-8 byte-order mark, detects the delimiter (or
 * uses the given one), and treats the first row as the header if asked.
 */
export function readCsv(
  text: string,
  opts: { delimiter?: Delimiter | 'auto'; header?: boolean } = {},
): CsvTable {
  const clean = text.replace(/^﻿/, '');
  if (!clean.trim())
    throw new ToolInputError('Paste CSV data or choose a file.');
  const delimiter =
    !opts.delimiter || opts.delimiter === 'auto'
      ? detectDelimiter(clean)
      : opts.delimiter;
  const all = parseCsv(clean, delimiter);
  if (!all.length) throw new ToolInputError('No rows found.');
  const useHeader = opts.header ?? true;
  const header = useHeader
    ? all[0]
    : Array.from(
        { length: Math.max(...all.map((r) => r.length)) },
        (_, i) => `Column ${i + 1}`,
      );
  const rows = useHeader ? all.slice(1) : all;
  const ragged = rows.filter((r) => r.length !== header.length).length;
  return { header, rows, delimiter, ragged };
}

/** Quotes a field when needed; guards against spreadsheet formula injection. */
export function csvCell(s: string, delimiter: string = ','): string {
  const safe = /^[=+\-@\t\r]/.test(s) && !/^-?\d/.test(s) ? `'${s}` : s;
  return safe.includes(delimiter) || /["\r\n]/.test(safe)
    ? `"${safe.replace(/"/g, '""')}"`
    : safe;
}

export function toCsv(
  header: string[],
  rows: string[][],
  delimiter = ',',
): string {
  return [header, ...rows]
    .map((r) => r.map((c) => csvCell(c, delimiter)).join(delimiter))
    .join('\r\n');
}

/* ------------------------------------------------------------------ */
/* Viewer: sort and filter                                              */
/* ------------------------------------------------------------------ */

const NUMBER_RE = /^[-+]?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?$/;

/** Compares numbers numerically, everything else with natural text order. */
export function compareCells(a: string, b: string): number {
  const x = a.trim();
  const y = b.trim();
  if (x === '' || y === '') return x === y ? 0 : x === '' ? 1 : -1;
  if (NUMBER_RE.test(x) && NUMBER_RE.test(y))
    return Number(x.replace(/,/g, '')) - Number(y.replace(/,/g, ''));
  return x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
}

export type ViewQuery = {
  search: string;
  /** Per-column "contains" filters, by column index. */
  filters: Record<number, string>;
  sort: { col: number; dir: 'asc' | 'desc' } | null;
};

/** Indexes of rows matching the query, in display order. */
export function queryRows(rows: string[][], q: ViewQuery): number[] {
  const s = q.search.trim().toLowerCase();
  const filters = Object.entries(q.filters)
    .map(([k, v]) => [Number(k), v.trim().toLowerCase()] as const)
    .filter(([, v]) => v);
  const idx: number[] = [];
  rows.forEach((r, i) => {
    if (s && !r.some((c) => c.toLowerCase().includes(s))) return;
    for (const [c, v] of filters)
      if (!(r[c] ?? '').toLowerCase().includes(v)) return;
    idx.push(i);
  });
  if (q.sort) {
    const { col, dir } = q.sort;
    idx.sort((a, b) => {
      const d = compareCells(rows[a][col] ?? '', rows[b][col] ?? '');
      // Empty cells stay last in both directions.
      const ea = !(rows[a][col] ?? '').trim();
      const eb = !(rows[b][col] ?? '').trim();
      if (ea !== eb) return ea ? 1 : -1;
      return (dir === 'asc' ? d : -d) || a - b;
    });
  }
  return idx;
}
