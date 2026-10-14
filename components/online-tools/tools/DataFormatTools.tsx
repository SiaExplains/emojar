'use client';

// JSON Schema Generator, HTML to JSX, JSON to TOML, JSON-LD Validator,
// Markdown Table Generator, CSV to Markdown and the CSV Viewer. Pure
// conversions run on the text in this tab; files are read with File.text().

import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  FileDropzone,
  Notice,
  NumberField,
  SelectField,
  TextField,
  ToolInput,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
} from '../ui';
import { ToolInputError } from '@/lib/online-tools/engines/data';
import {
  generateJsonSchema,
  type SchemaDraft,
} from '@/lib/online-tools/engines/json-schema';
import { htmlToJsx } from '@/lib/online-tools/engines/html-jsx';
import { jsonToToml } from '@/lib/online-tools/engines/toml';
import {
  inspectJsonLd,
  type LdIssue,
} from '@/lib/online-tools/engines/seo-schema';
import {
  MAX_CSV_BYTES,
  queryRows,
  readCsv,
  toCsv,
  toMarkdownTable,
  type Align,
  type CsvTable,
  type Delimiter,
  type ViewQuery,
} from '@/lib/online-tools/engines/tables';

const errorOf = (e: unknown) =>
  e instanceof ToolInputError
    ? e.message
    : 'Something went wrong with this input.';

/** Runs a conversion and returns its output or the error to show. */
function useConvert<T>(
  input: string,
  fn: (s: string) => T,
): { value: T | null; error: string } {
  const deferred = useDeferredValue(input);
  return useMemo(() => {
    if (!deferred.trim()) return { value: null, error: '' };
    try {
      return { value: fn(deferred), error: '' };
    } catch (e) {
      return { value: null, error: errorOf(e) };
    }
  }, [deferred, fn]);
}

function ClearButton({
  onClick,
  show,
}: {
  onClick: () => void;
  show: boolean;
}) {
  return show ? (
    <button type="button" className={btnSecondary} onClick={onClick}>
      Clear
    </button>
  ) : null;
}

/* ------------------------------------------------------------------ */
/* JSON Schema Generator                                                */
/* ------------------------------------------------------------------ */

const SCHEMA_SAMPLE = `{
  "id": 1042,
  "email": "ada@example.com",
  "active": true,
  "createdAt": "2026-10-14T09:30:00Z",
  "tags": ["admin", "beta"],
  "address": { "city": "London", "postcode": null },
  "orders": [
    { "sku": "A-1", "qty": 2, "price": 9.99 },
    { "sku": "B-7", "qty": 1, "gift": true }
  ]
}`;

export function JsonSchemaTool(_: ToolProps) {
  const [input, setInput] = useState(SCHEMA_SAMPLE);
  const [draft, setDraft] = useState<SchemaDraft>('2020-12');
  const [required, setRequired] = useState(true);
  const [strict, setStrict] = useState(false);
  const [formats, setFormats] = useState(true);
  const fn = useMemo(
    () => (s: string) =>
      generateJsonSchema(s, { draft, required, strict, formats }),
    [draft, required, strict, formats],
  );
  const { value, error } = useConvert(input, fn);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <SelectField
          label="JSON Schema version"
          value={draft}
          onChange={(v) => setDraft(v as SchemaDraft)}
          options={[
            { value: '2020-12', label: 'Draft 2020-12 (default)' },
            { value: '2019-09', label: 'Draft 2019-09' },
            { value: '07', label: 'Draft-07' },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          Mark keys found in every object as required
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
          />
          No extra keys (additionalProperties: false)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={formats}
            onChange={(e) => setFormats(e.target.checked)}
          />
          Detect formats (date-time, email, uri, uuid)
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSON sample"
          value={input}
          onChange={setInput}
          rows={18}
          actions={<ClearButton show={!!input} onClick={() => setInput('')} />}
        />
        <ToolOutput
          label="JSON Schema"
          value={value ?? ''}
          filename="schema.json"
          mime="application/schema+json"
          rows={18}
        />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <p className="text-xs text-gray-500">
        The schema describes your sample: its types, nesting and the keys it
        always has. Real data may allow more — review limits, enums and optional
        fields before using it as a contract.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HTML to JSX                                                          */
/* ------------------------------------------------------------------ */

const HTML_SAMPLE = `<div class="card" style="padding: 16px; border-radius: 8px">
  <!-- Sign-up form -->
  <label for="email">Email</label>
  <input id="email" type="email" required autofocus>
  <button class="btn" tabindex="0" onclick="subscribe()">Subscribe</button>
  <p>Free for {everyone}.<br>No spam.</p>
</div>`;

export function HtmlToJsxTool(_: ToolProps) {
  const [input, setInput] = useState(HTML_SAMPLE);
  const [fragment, setFragment] = useState(true);
  const [component, setComponent] = useState(false);
  const [name, setName] = useState('MyComponent');
  const fn = useMemo(
    () => (s: string) =>
      htmlToJsx(s, { fragment, component: component ? name : undefined }),
    [fragment, component, name],
  );
  const { value } = useConvert(input, fn);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={fragment}
            onChange={(e) => setFragment(e.target.checked)}
          />
          Wrap several top-level elements in a fragment (&lt;&gt;…&lt;/&gt;)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={component}
            onChange={(e) => setComponent(e.target.checked)}
          />
          Wrap in a component
        </label>
        {component && (
          <TextField
            label="Component name"
            value={name}
            onChange={setName}
            mono
          />
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="HTML"
          value={input}
          onChange={setInput}
          rows={16}
          actions={<ClearButton show={!!input} onClick={() => setInput('')} />}
        />
        <ToolOutput
          label="JSX"
          value={value?.jsx ?? ''}
          filename={component ? `${name || 'Component'}.jsx` : 'markup.jsx'}
          mime="text/jsx"
          rows={16}
        />
      </div>
      {value?.notes.map((n) => (
        <Notice key={n} tone="amber">
          {n}
        </Notice>
      ))}
      <p className="text-xs text-gray-500">
        Handles class → className, for → htmlFor, inline styles, boolean and
        void elements, comments, SVG attributes and braces in text. The HTML is
        only read as text — never rendered or run. Review the result: complex
        templates and invalid markup may need manual fixes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* JSON to TOML                                                         */
/* ------------------------------------------------------------------ */

const TOML_SAMPLE = `{
  "title": "My app",
  "version": 2,
  "debug": false,
  "server": { "host": "localhost", "port": 8080 },
  "database": { "url": "postgres://localhost/app", "pool": { "max": 10 } },
  "features": ["search", "export"],
  "users": [
    { "name": "Ada", "role": "admin" },
    { "name": "Linus", "role": "dev" }
  ]
}`;

export function JsonToTomlTool(_: ToolProps) {
  const [input, setInput] = useState(TOML_SAMPLE);
  const [omitNulls, setOmitNulls] = useState(false);
  const fn = useMemo(
    () => (s: string) => jsonToToml(s, { nulls: omitNulls ? 'omit' : 'error' }),
    [omitNulls],
  );
  const { value, error } = useConvert(input, fn);
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={omitNulls}
          onChange={(e) => setOmitNulls(e.target.checked)}
        />
        Leave out null values (TOML has no null) and list them
      </label>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSON"
          value={input}
          onChange={setInput}
          rows={18}
          actions={<ClearButton show={!!input} onClick={() => setInput('')} />}
        />
        <ToolOutput
          label="TOML"
          value={value?.toml ?? ''}
          filename="config.toml"
          mime="application/toml"
          rows={18}
        />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {value && value.omitted.length > 0 && (
        <Notice tone="amber">
          Left out {value.omitted.length} null value
          {value.omitted.length === 1 ? '' : 's'}: {value.omitted.join(', ')}.
        </Notice>
      )}
      {value?.notes.map((n) => (
        <Notice key={n}>{n}</Notice>
      ))}
      <p className="text-xs text-gray-500">
        Supported: a top-level object with strings, numbers, booleans, arrays
        and nested objects. Objects become [tables], arrays of objects become
        [[arrays of tables]], and other values are written inline. Keys that
        aren’t plain words are quoted. Strings that look like dates stay
        strings.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* JSON-LD Validator                                                    */
/* ------------------------------------------------------------------ */

const LD_SAMPLE = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to brew better coffee",
  "datePublished": "2026-10-14",
  "author": { "@type": "Person", "name": "Ada Lovelace" },
  "image": "https://example.com/coffee.jpg"
}
</script>`;

function Tree({
  value,
  name,
  depth = 0,
}: {
  value: unknown;
  name?: string;
  depth?: number;
}) {
  const label = name !== undefined && (
    <span className="text-indigo-700">{name}: </span>
  );
  if (value === null || typeof value !== 'object')
    return (
      <div className="pl-4 font-mono text-[13px]">
        {label}
        <span
          className={
            typeof value === 'string' ? 'text-emerald-800' : 'text-amber-800'
          }
        >
          {JSON.stringify(value)}
        </span>
      </div>
    );
  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const type =
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>)['@type'] === 'string'
      ? ` ${(value as Record<string, unknown>)['@type']}`
      : '';
  return (
    <details open={depth < 3} className="pl-4">
      <summary className="cursor-pointer font-mono text-[13px] text-gray-700">
        {label}
        {Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}
        {type && (
          <span className="ml-1 rounded bg-brand-50 px-1 text-brand-800">
            {type.trim()}
          </span>
        )}
      </summary>
      {entries.map(([k, v]) => (
        <Tree key={k} name={k} value={v} depth={depth + 1} />
      ))}
    </details>
  );
}

const TONE: Record<LdIssue['level'], string> = {
  error: 'border-red-200 bg-red-50 text-red-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  info: 'border-gray-200 bg-gray-50 text-gray-700',
};

export function JsonLdValidatorTool(_: ToolProps) {
  const [input, setInput] = useState(LD_SAMPLE);
  const deferred = useDeferredValue(input);
  const r = useMemo(
    () => (deferred.trim() ? inspectJsonLd(deferred) : null),
    [deferred],
  );
  const errors = r?.ok ? r.issues.filter((i) => i.level === 'error').length : 0;
  const warnings = r?.ok
    ? r.issues.filter((i) => i.level === 'warning').length
    : 0;
  return (
    <div className="space-y-4">
      <ToolInput
        label='JSON-LD or HTML with <script type="application/ld+json">'
        value={input}
        onChange={setInput}
        rows={12}
        actions={<ClearButton show={!!input} onClick={() => setInput('')} />}
      />
      {r && !r.ok && <ErrorMessage>{r.error}</ErrorMessage>}
      {r?.ok && (
        <>
          <Notice tone={errors ? 'amber' : 'green'}>
            {errors ? '⚠' : '✓'} Valid JSON
            {r.blocks > 1 ? ` in ${r.blocks} script blocks` : ''}.{' '}
            {r.nodes.length} typed{' '}
            {r.nodes.length === 1 ? 'entity' : 'entities'}, {errors} error
            {errors === 1 ? '' : 's'}, {warnings} warning
            {warnings === 1 ? '' : 's'}.
          </Notice>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Found</h3>
              <dl className="space-y-1 text-sm">
                <div>
                  <dt className="inline text-gray-500">@context: </dt>
                  <dd className="inline font-mono text-[13px]">
                    {r.contexts.join(', ') || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="inline text-gray-500">Types: </dt>
                  <dd className="inline">
                    {[...new Set(r.nodes.flatMap((n) => n.types))].map((t) => (
                      <span
                        key={t}
                        className="mr-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-800"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
              {r.issues.length > 0 && (
                <ul className="space-y-1.5">
                  {r.issues.map((i, n) => (
                    <li
                      key={n}
                      className={`rounded-lg border px-3 py-2 text-sm ${TONE[i.level]}`}
                    >
                      <span className="font-semibold capitalize">
                        {i.level}
                      </span>{' '}
                      · <code className="text-xs">{i.path}</code>
                      <br />
                      {i.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Structure
                </h3>
                <CopyButton
                  text={JSON.stringify(r.value, null, 2)}
                  label="Copy formatted JSON"
                />
              </div>
              <div className="max-h-[480px] overflow-auto rounded-xl border border-gray-200 bg-white p-2">
                <Tree value={r.value} />
              </div>
            </div>
          </div>
        </>
      )}
      <p className="text-xs text-gray-500">
        Checks JSON syntax, @context and @type, keywords, dates, URLs and the
        properties Google lists as required for common types. Remote contexts
        are not downloaded, and this is not a full Schema.org or rich-results
        test.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Markdown table generator                                             */
/* ------------------------------------------------------------------ */

const ALIGNS: { value: Align; label: string }[] = [
  { value: 'none', label: 'Default' },
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Centre' },
  { value: 'right', label: 'Right' },
];
const MAX_CELLS = 2500;

function TablePreview({
  header,
  rows,
  align,
}: {
  header: string[];
  rows: string[][];
  align: Align[];
}) {
  const ta = (a: Align | undefined) =>
    a === 'center' ? 'text-center' : a === 'right' ? 'text-right' : 'text-left';
  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className={`border-b border-gray-200 px-3 py-2 font-semibold ${ta(align[i])}`}
              >
                {h || `Column ${i + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, i) => (
            <tr key={i}>
              {header.map((_, j) => (
                <td
                  key={j}
                  className={`whitespace-pre-line px-3 py-1.5 ${ta(align[j])}`}
                >
                  {r[j] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MarkdownTableTool(_: ToolProps) {
  const [header, setHeader] = useState(['Feature', 'Free', 'Pro']);
  const [rows, setRows] = useState([
    ['Tools', 'All', 'All'],
    ['Price', '$0', '$0 | always'],
  ]);
  const [align, setAlign] = useState<Align[]>(['left', 'center', 'center']);
  const [pretty, setPretty] = useState(true);
  const cols = header.length;
  const md = toMarkdownTable(header, rows, align, pretty);
  const canGrow = (cols + 1) * (rows.length + 1) <= MAX_CELLS;
  const setCell = (r: number, c: number, v: string) =>
    setRows((rs) =>
      rs.map((row, i) =>
        i === r ? row.map((x, j) => (j === c ? v : x)) : row,
      ),
    );
  const cellCls = `${inputBase} min-w-[110px] !py-1.5`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={!canGrow}
          onClick={() => setRows((rs) => [...rs, Array(cols).fill('')])}
        >
          ＋ Row
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={!canGrow || cols >= 20}
          onClick={() => {
            setHeader((h) => [...h, `Column ${h.length + 1}`]);
            setRows((rs) => rs.map((r) => [...r, '']));
            setAlign((a) => [...a, 'none']);
          }}
        >
          ＋ Column
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setHeader(['Column 1', 'Column 2']);
            setRows([['', '']]);
            setAlign(['none', 'none']);
          }}
        >
          Clear table
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={pretty}
            onChange={(e) => setPretty(e.target.checked)}
          />
          Align columns in the Markdown source
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-2">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              {header.map((h, c) => (
                <th key={c} className="space-y-1 align-top">
                  <input
                    value={h}
                    aria-label={`Header ${c + 1}`}
                    onChange={(e) =>
                      setHeader((hs) =>
                        hs.map((x, j) => (j === c ? e.target.value : x)),
                      )
                    }
                    className={`${cellCls} font-semibold`}
                  />
                  <div className="flex gap-1">
                    <select
                      value={align[c] ?? 'none'}
                      aria-label={`Alignment of column ${c + 1}`}
                      onChange={(e) =>
                        setAlign((a) =>
                          a.map((x, j) =>
                            j === c ? (e.target.value as Align) : x,
                          ),
                        )
                      }
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-1 py-1 text-xs font-normal"
                    >
                      {ALIGNS.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                    {cols > 1 && (
                      <button
                        type="button"
                        aria-label={`Delete column ${c + 1}`}
                        className="rounded-lg px-1.5 text-xs text-gray-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setHeader((hs) => hs.filter((_, j) => j !== c));
                          setRows((rs) =>
                            rs.map((r) => r.filter((_, j) => j !== c)),
                          );
                          setAlign((a) => a.filter((_, j) => j !== c));
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {header.map((_, c) => (
                  <td key={c}>
                    <input
                      value={r[c] ?? ''}
                      aria-label={`Row ${ri + 1}, column ${c + 1}`}
                      onChange={(e) => setCell(ri, c, e.target.value)}
                      className={cellCls}
                    />
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    aria-label={`Delete row ${ri + 1}`}
                    className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      setRows((rs) => rs.filter((_, i) => i !== ri))
                    }
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToolOutput
        label="Markdown"
        value={md}
        filename="table.md"
        mime="text/markdown"
        rows={Math.min(14, rows.length + 4)}
      />
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700">Preview</p>
        <TablePreview header={header} rows={rows} align={align} />
      </div>
      <p className="text-xs text-gray-500">
        Pipes (|) and backslashes are escaped and line breaks become &lt;br&gt;,
        so every cell stays in its column on GitHub, GitLab and other
        GitHub-flavoured Markdown renderers.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSV helpers                                                          */
/* ------------------------------------------------------------------ */

const DELIMS: { value: Delimiter | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Detect automatically' },
  { value: ',', label: 'Comma ,' },
  { value: ';', label: 'Semicolon ;' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe |' },
];

async function readFileText(file: File): Promise<string> {
  if (file.size > MAX_CSV_BYTES)
    throw new ToolInputError(
      `That file is ${(file.size / 1048576).toFixed(1)} MB; the limit is ${MAX_CSV_BYTES / 1048576} MB so your browser stays responsive.`,
    );
  // TextDecoder strips a UTF-8 BOM and replaces invalid bytes instead of failing.
  return new TextDecoder('utf-8').decode(await file.arrayBuffer());
}

function CsvSource({
  onText,
  onError,
  children,
}: {
  onText: (text: string, name: string) => void;
  onError: (e: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <FileDropzone
        accept=".csv,.tsv,.txt,text/csv,text/plain,text/tab-separated-values"
        onFiles={async (f) => {
          try {
            onText(await readFileText(f[0]), f[0].name);
          } catch (e) {
            onError(errorOf(e));
          }
        }}
        hint={`CSV or TSV up to ${MAX_CSV_BYTES / 1048576} MB — read on your device, never uploaded`}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSV to Markdown                                                      */
/* ------------------------------------------------------------------ */

const CSV_SAMPLE = `Plan,Price,Notes
Free,$0,"All tools, no account"
Team,$8,"Shared ""workspaces"" | coming soon"`;

export function CsvToMarkdownTool(_: ToolProps) {
  const [input, setInput] = useState(CSV_SAMPLE);
  const [delim, setDelim] = useState<Delimiter | 'auto'>('auto');
  const [header, setHeader] = useState(true);
  const [alignAll, setAlignAll] = useState<Align>('none');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');
  const deferred = useDeferredValue(input);
  const conv = useMemo(() => {
    if (!deferred.trim())
      return { md: '', t: null as CsvTable | null, err: '', total: 0 };
    try {
      const t = readCsv(deferred, { delimiter: delim, header });
      const max = Math.max(0, Math.floor(Number(limit) || 0));
      // Never more than 5,000 rows: huge Markdown tables are unreadable.
      const rows = t.rows.slice(0, Math.min(max || 5000, 5000));
      const align = t.header.map(() => alignAll);
      return {
        md: toMarkdownTable(t.header, rows, align, rows.length <= 1000),
        t,
        err: '',
        total: t.rows.length,
      };
    } catch (e) {
      return { md: '', t: null, err: errorOf(e), total: 0 };
    }
  }, [deferred, delim, header, alignAll, limit]);
  const shown = conv.md ? conv.md.split('\n').length - 2 : 0;

  return (
    <div className="space-y-4">
      <CsvSource
        onText={(t) => (setError(''), setInput(t))}
        onError={setError}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <SelectField
          label="Delimiter"
          value={delim}
          onChange={(v) => setDelim(v as Delimiter | 'auto')}
          options={DELIMS}
        />
        <SelectField
          label="Alignment"
          value={alignAll}
          onChange={(v) => setAlignAll(v as Align)}
          options={ALIGNS}
        />
        <NumberField
          label="Row limit (empty = all)"
          value={limit}
          onChange={setLimit}
          min={0}
          step={1}
        />
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={header}
            onChange={(e) => setHeader(e.target.checked)}
          />
          First row is the header
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="CSV"
          value={input}
          onChange={setInput}
          rows={14}
          actions={<ClearButton show={!!input} onClick={() => setInput('')} />}
        />
        <ToolOutput
          label="Markdown table"
          value={conv.md}
          filename="table.md"
          mime="text/markdown"
          rows={14}
        />
      </div>
      <ErrorMessage>{error || conv.err}</ErrorMessage>
      {conv.t && (
        <p className="text-xs text-gray-600">
          {conv.total.toLocaleString('en-US')} rows × {conv.t.header.length}{' '}
          columns
          {shown < conv.total && ` — showing ${shown.toLocaleString('en-US')}`}
          {conv.t.ragged > 0 &&
            ` · ${conv.t.ragged} row${conv.t.ragged === 1 ? ' has' : 's have'} a different number of cells (padded)`}
          {conv.total > 1000 &&
            !limit &&
            ' · columns aren’t padded above 1,000 rows'}
          .
        </p>
      )}
      {conv.t && conv.total <= 200 && (
        <TablePreview
          header={conv.t.header}
          rows={conv.t.rows.slice(0, Number(limit) || undefined)}
          align={conv.t.header.map(() => alignAll)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSV Viewer                                                           */
/* ------------------------------------------------------------------ */

const PAGE = 200;

export function CsvViewerTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [paste, setPaste] = useState('');
  const [delim, setDelim] = useState<Delimiter | 'auto'>('auto');
  const [header, setHeader] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState<ViewQuery>({
    search: '',
    filters: {},
    sort: null,
  });
  const [shown, setShown] = useState(PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const search = useDeferredValue(q);

  const table = useMemo(() => {
    if (!text) return { t: null as CsvTable | null, err: '' };
    try {
      return { t: readCsv(text, { delimiter: delim, header }), err: '' };
    } catch (e) {
      return { t: null, err: errorOf(e) };
    }
  }, [text, delim, header]);
  const t = table.t;
  const idx = useMemo(() => (t ? queryRows(t.rows, search) : []), [t, search]);

  const open = (s: string, n: string) => {
    setError('');
    setText(s);
    setName(n);
    setQ({ search: '', filters: {}, sort: null });
    setShown(PAGE);
  };
  const sortBy = (col: number) =>
    setQ((p) => ({
      ...p,
      sort:
        p.sort?.col === col
          ? p.sort.dir === 'asc'
            ? { col, dir: 'desc' }
            : null
          : { col, dir: 'asc' },
    }));
  const download = () => {
    if (!t) return;
    const out = toCsv(
      t.header,
      idx.map((i) => t.rows[i]),
      t.delimiter,
    );
    downloadBlob(
      `﻿${out}`,
      `${name.replace(/\.[^.]+$/, '') || 'data'}-filtered.csv`,
      'text/csv;charset=utf-8',
    );
  };

  if (!t)
    return (
      <div className="space-y-4">
        <CsvSource onText={open} onError={setError} />
        <details className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">
            …or paste CSV text
          </summary>
          <div className="mt-3 space-y-2">
            <ToolInput
              label="CSV text"
              value={paste}
              onChange={setPaste}
              rows={8}
            />
            <button
              type="button"
              className={btnPrimary}
              disabled={!paste.trim()}
              onClick={() => open(paste, 'pasted')}
            >
              Show table
            </button>
          </div>
        </details>
        <ErrorMessage>{error || table.err}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{name}</span> ·{' '}
          {t.rows.length.toLocaleString('en-US')} rows × {t.header.length}{' '}
          columns
          {idx.length !== t.rows.length &&
            ` · ${idx.length.toLocaleString('en-US')} match`}
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => (setText(''), setName(''))}
        >
          Open another file
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_auto]">
        <TextField
          label="Search all columns"
          value={q.search}
          onChange={(v) => (setQ((p) => ({ ...p, search: v })), setShown(PAGE))}
          placeholder="Type to filter rows…"
        />
        <SelectField
          label="Delimiter"
          value={delim}
          onChange={(v) => setDelim(v as Delimiter | 'auto')}
          options={DELIMS}
        />
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={header}
            onChange={(e) => setHeader(e.target.checked)}
          />
          Header row
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setShowFilters((s) => !s)}
          aria-expanded={showFilters}
        >
          {showFilters ? 'Hide column filters' : 'Filter by column'}
        </button>
        <button
          type="button"
          className={btnPrimary}
          onClick={download}
          disabled={!idx.length}
        >
          ⬇ Download{' '}
          {idx.length === t.rows.length
            ? 'CSV'
            : `${idx.length.toLocaleString('en-US')} filtered rows`}
        </button>
        {(q.search || Object.values(q.filters).some(Boolean) || q.sort) && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setQ({ search: '', filters: {}, sort: null })}
          >
            Reset view
          </button>
        )}
      </div>
      {t.ragged > 0 && (
        <Notice tone="amber">
          {t.ragged.toLocaleString('en-US')} row{t.ragged === 1 ? '' : 's'} have
          a different number of cells than the header — check the delimiter.
        </Notice>
      )}
      <div className="max-h-[600px] overflow-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              <th className="px-2 py-2 text-xs font-medium text-gray-400">#</th>
              {t.header.map((h, c) => (
                <th
                  key={c}
                  className="whitespace-nowrap px-3 py-2 font-semibold text-gray-900"
                  aria-sort={
                    q.sort?.col === c
                      ? q.sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    type="button"
                    onClick={() => sortBy(c)}
                    className="inline-flex items-center gap-1 hover:text-brand-700"
                  >
                    {h || `Column ${c + 1}`}
                    <span aria-hidden className="text-gray-400">
                      {q.sort?.col === c
                        ? q.sort.dir === 'asc'
                          ? '▲'
                          : '▼'
                        : '↕'}
                    </span>
                  </button>
                  {showFilters && (
                    <input
                      value={q.filters[c] ?? ''}
                      onChange={(e) => (
                        setQ((p) => ({
                          ...p,
                          filters: { ...p.filters, [c]: e.target.value },
                        })),
                        setShown(PAGE)
                      )}
                      placeholder="contains…"
                      aria-label={`Filter ${h || `column ${c + 1}`}`}
                      className="mt-1 block w-full min-w-[90px] rounded-lg border border-gray-200 px-2 py-1 text-xs font-normal"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {idx.slice(0, shown).map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-2 py-1.5 text-xs text-gray-400">{i + 1}</td>
                {t.header.map((_, c) => (
                  <td
                    key={c}
                    className="max-w-[360px] whitespace-pre-wrap break-words px-3 py-1.5 align-top text-gray-800"
                  >
                    {t.rows[i][c] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!idx.length && (
          <p className="p-4 text-sm text-gray-500">No rows match.</p>
        )}
      </div>
      {shown < idx.length && (
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setShown((s) => s + PAGE * 5)}
        >
          Show more ({(idx.length - shown).toLocaleString('en-US')} more rows)
        </button>
      )}
    </div>
  );
}
