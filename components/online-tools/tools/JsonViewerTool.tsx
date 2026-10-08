'use client';

// JSON tree explorer. The tree is flattened into the rows that are actually
// visible (children exist only once their parent is expanded) and the rows
// are windowed, so a multi-megabyte document stays responsive.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  ancestorIds,
  containerIdsToDepth,
  copyValueText,
  formatPath,
  isContainer,
  jsonType,
  nodeId,
  parseJson,
  prettySubtree,
  searchJson,
  valueAt,
  type JsonType,
  type PathSegment,
} from '@/lib/online-tools/engines/json-path';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  ToolInput,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

const SAMPLE = JSON.stringify(
  {
    users: [
      {
        id: 1,
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        active: true,
        profile: { name: 'Ada', languages: ['English', 'French'], age: 36 },
      },
      {
        id: 2,
        name: 'Alan Turing',
        email: null,
        active: false,
        profile: { name: 'Alan', languages: ['English'], age: 41 },
      },
    ],
    meta: { total: 2, 'next page': null, generated: '2026-10-08T12:00:00Z' },
  },
  null,
  2,
);

const ROW_H = 30;
const VIEW_H = 480;
const OVERSCAN = 12;
/** Children shown per container before a "Show more" row. */
const PAGE = 200;
const EXPAND_LIMIT = 2000;
const ROOT_ID = nodeId([]);

const TYPE_STYLE: Record<JsonType, string> = {
  string: 'text-emerald-700',
  number: 'text-blue-700',
  boolean: 'text-purple-700',
  null: 'text-gray-500',
  object: 'text-gray-500',
  array: 'text-gray-500',
};

type NodeRow = {
  kind: 'node';
  id: string;
  path: PathSegment[];
  value: unknown;
  depth: number;
  pos: number;
  size: number;
  parentId: string | null;
};
type MoreRow = {
  kind: 'more';
  id: string;
  parentId: string;
  depth: number;
  remaining: number;
};
type Row = NodeRow | MoreRow;

function childCount(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  return isContainer(value) ? Object.keys(value).length : 0;
}

/** Depth-first list of the rows currently visible. */
function buildRows(
  root: unknown,
  expanded: Set<string>,
  shown: Map<string, number>,
): Row[] {
  const rows: Row[] = [];
  type Frame = {
    path: PathSegment[];
    value: unknown;
    depth: number;
    pos: number;
    size: number;
    parentId: string | null;
  };
  const stack: (Frame | MoreRow)[] = [
    { path: [], value: root, depth: 0, pos: 1, size: 1, parentId: null },
  ];
  while (stack.length) {
    const f = stack.pop()!;
    if ('kind' in f) {
      rows.push(f);
      continue;
    }
    const id = nodeId(f.path);
    rows.push({ kind: 'node', id, ...f });
    if (!isContainer(f.value) || !expanded.has(id)) continue;
    const keys: PathSegment[] = Array.isArray(f.value)
      ? f.value.map((_, i) => i)
      : Object.keys(f.value);
    const limit = Math.min(keys.length, shown.get(id) ?? PAGE);
    if (limit < keys.length)
      stack.push({
        kind: 'more',
        id: `${id}#more`,
        parentId: id,
        depth: f.depth + 1,
        remaining: keys.length - limit,
      });
    const obj = f.value as Record<string | number, unknown>;
    for (let i = limit - 1; i >= 0; i--)
      stack.push({
        path: [...f.path, keys[i]],
        value: obj[keys[i]],
        depth: f.depth + 1,
        pos: i + 1,
        size: keys.length,
        parentId: id,
      });
  }
  return rows;
}

/** Node ids are the JSON of the path; "Show more" rows add a suffix. */
function pathFromId(id: string): PathSegment[] {
  try {
    const p: unknown = JSON.parse(id.replace(/#more$/, ''));
    return Array.isArray(p) ? (p as PathSegment[]) : [];
  } catch {
    return [];
  }
}

function preview(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.length} item${value.length === 1 ? '' : 's'}]`;
  if (isContainer(value)) {
    const n = Object.keys(value).length;
    return `{${n} key${n === 1 ? '' : 's'}}`;
  }
  const s = typeof value === 'string' ? JSON.stringify(value) : String(value);
  return s.length > 160 ? `${s.slice(0, 159)}…` : s;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  if (!q) return <>{text}</>;
  const parts: ReactNode[] = [];
  const lower = text.toLowerCase();
  let pos = 0;
  for (let at = lower.indexOf(q); at !== -1; at = lower.indexOf(q, pos)) {
    if (at > pos) parts.push(text.slice(pos, at));
    parts.push(
      <mark key={at} className="rounded bg-amber-200 text-gray-900">
        {text.slice(at, at + q.length)}
      </mark>,
    );
    pos = at + q.length;
  }
  parts.push(text.slice(pos));
  return <>{parts}</>;
}

/** Copy button that builds its text on click, so a huge subtree isn't stringified on every render. */
function LazyCopy({
  label,
  getText,
  disabled,
}: {
  label: string;
  getText: () => string;
  disabled?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'ok' | 'err'>('idle');
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  return (
    <button
      type="button"
      className={btnSecondary}
      disabled={disabled}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(getText());
          setState('ok');
        } catch {
          setState('err');
        }
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setState('idle'), 1800);
      }}
    >
      <span aria-live="polite">
        {state === 'ok' ? '✓ Copied' : state === 'err' ? 'Copy failed' : label}
      </span>
    </button>
  );
}

export default function JsonViewerTool(_: ToolProps) {
  const [text, setText] = useState(SAMPLE);
  const [source, setSource] = useState(SAMPLE);
  const [fileNote, setFileNote] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [shown, setShown] = useState<Map<string, number>>(new Map());
  const [selected, setSelected] = useState(ROOT_ID);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [matchIndex, setMatchIndex] = useState(0);
  const [depth, setDepth] = useState('2');
  const [rootPrefix, setRootPrefix] = useState(false);
  const [quote, setQuote] = useState<'"' | "'">('"');
  const [notice, setNotice] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const scroller = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());
  const wantFocus = useRef(false);

  // Big documents are parsed after a pause in typing rather than per keystroke.
  useEffect(() => {
    if (text === source) return;
    const t = window.setTimeout(
      () => setSource(text),
      text.length > 200_000 ? 400 : 150,
    );
    return () => window.clearTimeout(t);
  }, [text, source]);

  useEffect(() => {
    const t = window.setTimeout(() => setQuery(queryInput), 200);
    return () => window.clearTimeout(t);
  }, [queryInput]);

  const parsed = useMemo(() => parseJson(source), [source]);
  const root = parsed.ok ? parsed.value : undefined;

  // A new document starts with the top two levels open.
  useEffect(() => {
    if (!parsed.ok) return;
    setExpanded(new Set(containerIdsToDepth(parsed.value, 2).ids));
    setShown(new Map());
    setSelected(ROOT_ID);
    setNotice('');
    setScrollTop(0);
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [parsed]);

  const search = useMemo(
    () => (parsed.ok ? searchJson(root, query) : null),
    [parsed.ok, root, query],
  );
  const matches = useMemo(() => search?.matches ?? [], [search]);
  const matchIds = useMemo(
    () => new Set(matches.map((m) => nodeId(m.path))),
    [matches],
  );

  const rows = useMemo(
    () => (parsed.ok ? buildRows(root, expanded, shown) : []),
    [parsed.ok, root, expanded, shown],
  );
  const indexById = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r, i) => m.set(r.id, i));
    return m;
  }, [rows]);

  /** Opens every ancestor of `path` and pages far enough to show it. */
  const reveal = useCallback(
    (paths: PathSegment[][]) => {
      if (!parsed.ok) return;
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const p of paths) ancestorIds(p).forEach((id) => next.add(id));
        return next;
      });
      setShown((prev) => {
        const next = new Map(prev);
        for (const p of paths)
          for (let i = 0; i < p.length; i++) {
            const parent = valueAt(root, p.slice(0, i));
            const seg = p[i];
            const idx = Array.isArray(parent)
              ? Number(seg)
              : Object.keys(parent as object).indexOf(String(seg));
            const id = nodeId(p.slice(0, i));
            if (idx >= (next.get(id) ?? PAGE))
              next.set(id, Math.ceil((idx + 1) / PAGE) * PAGE);
          }
        return next;
      });
    },
    [parsed.ok, root],
  );

  // New query: open the first matches so they are visible straight away.
  useEffect(() => {
    setMatchIndex(0);
    if (matches.length) {
      reveal(matches.slice(0, 50).map((m) => m.path));
      setSelected(nodeId(matches[0].path));
    }
  }, [matches, reveal]);

  const ensureVisible = useCallback((index: number) => {
    const el = scroller.current;
    if (!el) return;
    const top = index * ROW_H;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + ROW_H > el.scrollTop + el.clientHeight)
      el.scrollTop = top + ROW_H - el.clientHeight;
    setScrollTop(el.scrollTop);
  }, []);

  // Scroll the selected row into view once it exists (after expanding).
  useEffect(() => {
    const index = indexById.get(selected);
    if (index === undefined) return;
    ensureVisible(index);
    if (wantFocus.current) {
      wantFocus.current = false;
      // The selected row is always rendered, so it exists once effects run.
      rowRefs.current.get(selected)?.focus({ preventScroll: true });
    }
  }, [selected, indexById, ensureVisible]);

  const goToMatch = (i: number) => {
    if (!matches.length) return;
    const n = (i + matches.length) % matches.length;
    setMatchIndex(n);
    reveal([matches[n].path]);
    setSelected(nodeId(matches[n].path));
  };

  const toggle = (id: string, open?: boolean) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });

  const showMore = (parentId: string) =>
    setShown((prev) =>
      new Map(prev).set(parentId, (prev.get(parentId) ?? PAGE) + PAGE),
    );

  const expandTo = (levels: number) => {
    if (!parsed.ok) return;
    const { ids, truncated } = containerIdsToDepth(root, levels, EXPAND_LIMIT);
    setExpanded(new Set(ids));
    setNotice(
      truncated
        ? `Opened the first ${EXPAND_LIMIT.toLocaleString()} objects and arrays — this document is too large to expand completely. Use search or open branches one by one.`
        : '',
    );
  };

  const moveTo = (id: string) => {
    wantFocus.current = true;
    setSelected(id);
  };

  const onTreeKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Act on the focused row, which is normally also the selected one.
    const focusedId = (e.target as HTMLElement).dataset.id ?? selected;
    const index = indexById.get(focusedId) ?? 0;
    const row = rows[index];
    if (!row) return;
    if (row.id !== selected) setSelected(row.id);
    const isOpen = row.kind === 'node' && expanded.has(row.id);
    const container =
      row.kind === 'node' && isContainer(row.value) && childCount(row.value);
    const pageRows = Math.max(1, Math.floor(VIEW_H / ROW_H) - 1);
    let handled = true;
    switch (e.key) {
      case 'ArrowDown':
        if (index < rows.length - 1) moveTo(rows[index + 1].id);
        break;
      case 'ArrowUp':
        if (index > 0) moveTo(rows[index - 1].id);
        break;
      case 'PageDown':
        moveTo(rows[Math.min(rows.length - 1, index + pageRows)].id);
        break;
      case 'PageUp':
        moveTo(rows[Math.max(0, index - pageRows)].id);
        break;
      case 'Home':
        moveTo(rows[0].id);
        break;
      case 'End':
        moveTo(rows[rows.length - 1].id);
        break;
      case 'ArrowRight':
        if (container && !isOpen) toggle(row.id, true);
        else if (container && rows[index + 1]) moveTo(rows[index + 1].id);
        break;
      case 'ArrowLeft':
        if (container && isOpen) toggle(row.id, false);
        else if (row.parentId) moveTo(row.parentId);
        break;
      case 'Enter':
      case ' ':
        if (row.kind === 'more') showMore(row.parentId);
        else if (container) toggle(row.id);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  const selectedPath = pathFromId(selected);
  const selectedValue = parsed.ok ? valueAt(root, selectedPath) : undefined;
  const pathText =
    formatPath(selectedPath, { root: rootPrefix, quote }) || '(root)';

  const totalH = rows.length * ROW_H;
  const viewH = Math.min(VIEW_H, Math.max(totalH, ROW_H));
  const first = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
  const last = Math.min(
    rows.length,
    Math.ceil((scrollTop + viewH) / ROW_H) + OVERSCAN,
  );
  // The tabbable row must always be in the DOM, even when scrolled away.
  const selIndex = indexById.get(selected) ?? -1;
  const tabId = selIndex >= 0 ? selected : rows[0]?.id;
  const visible: number[] = [];
  for (let i = first; i < last; i++) visible.push(i);
  if (selIndex >= 0 && (selIndex < first || selIndex >= last))
    visible.push(selIndex);
  const currentMatchId = matches[matchIndex]
    ? nodeId(matches[matchIndex].path)
    : null;

  return (
    <div className="space-y-5">
      <ToolInput
        label="JSON"
        value={text}
        onChange={(v) => {
          setText(v);
          setFileNote('');
        }}
        rows={8}
        placeholder='{"paste": "your JSON here"}'
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setText(SAMPLE);
                setFileNote('');
              }}
            >
              Sample
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setText('');
                setSource('');
                setFileNote('');
                setQueryInput('');
              }}
            >
              Clear
            </button>
          </>
        }
      />
      <FileDropzone
        accept=".json,application/json,text/plain"
        label="Or open a .json file"
        hint="Read on your device — nothing is uploaded"
        onFiles={async ([file]) => {
          try {
            const content = await file.text();
            setText(content);
            setSource(content);
            setFileNote(
              `${file.name} · ${(file.size / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 })} KB`,
            );
          } catch {
            setFileNote('That file could not be read.');
          }
        }}
      />
      {fileNote && <p className="text-xs text-gray-500">{fileNote}</p>}

      {!parsed.ok && source.trim() && (
        <ErrorMessage>
          Invalid JSON
          {parsed.line !== undefined
            ? ` at line ${parsed.line}, column ${parsed.column}`
            : ''}
          : {parsed.message}
        </ErrorMessage>
      )}
      {!parsed.ok && !source.trim() && (
        <Notice>Paste JSON above, open a file or load the sample.</Notice>
      )}

      {parsed.ok && (
        <>
          <div className="flex flex-wrap items-end gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => expandTo(Infinity)}
            >
              Expand all
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setExpanded(new Set([ROOT_ID]));
                setNotice('');
              }}
            >
              Collapse all
            </button>
            <div className="flex items-end gap-2">
              <SelectField
                label="Depth"
                value={depth}
                onChange={setDepth}
                options={Array.from({ length: 10 }, (_, i) => ({
                  value: String(i + 1),
                  label: String(i + 1),
                }))}
                className="w-20"
              />
              <button
                type="button"
                className={btnSecondary}
                onClick={() => expandTo(Number(depth))}
              >
                Expand to depth
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label htmlFor="json-search" className={labelBase}>
                Search keys and values
              </label>
              <input
                id="json-search"
                type="search"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    goToMatch(matchIndex + (e.shiftKey ? -1 : 1));
                  }
                }}
                placeholder="e.g. email"
                className={inputBase}
              />
            </div>
            <button
              type="button"
              className={btnSecondary}
              disabled={!matches.length}
              onClick={() => goToMatch(matchIndex - 1)}
              aria-label="Previous match"
            >
              ↑ Prev
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={!matches.length}
              onClick={() => goToMatch(matchIndex + 1)}
              aria-label="Next match"
            >
              ↓ Next
            </button>
          </div>
          <p className="text-sm text-gray-600" aria-live="polite">
            {query.trim()
              ? matches.length
                ? `Match ${matchIndex + 1} of ${matches.length.toLocaleString()}${search?.truncated ? '+' : ''}`
                : 'No matches.'
              : `Root is ${jsonType(root) === 'array' ? 'an array' : `a${jsonType(root) === 'object' ? 'n' : ''} ${jsonType(root)}`} · ${rows.length.toLocaleString()} visible row${rows.length === 1 ? '' : 's'}`}
          </p>
          {notice && <Notice tone="amber">{notice}</Notice>}

          <div
            ref={scroller}
            className="relative overflow-auto rounded-2xl border border-gray-200 bg-white"
            style={{ height: viewH }}
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
          >
            <div
              role="tree"
              aria-label="JSON tree"
              tabIndex={-1}
              onKeyDown={onTreeKey}
              className="relative"
              style={{ height: totalH }}
            >
              {visible.map((index) => {
                const row = rows[index];
                const top = index * ROW_H;
                const isSel = row.id === selected;
                const tab = row.id === tabId ? 0 : -1;
                const base = `absolute left-0 right-0 flex items-center gap-1.5 whitespace-nowrap pr-3 font-mono text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${isSel ? 'bg-indigo-50' : 'hover:bg-gray-50'}`;
                const pad = 8 + Math.min(row.depth, 40) * 16;
                if (row.kind === 'more')
                  return (
                    <div
                      key={row.id}
                      ref={(el) => {
                        if (el) rowRefs.current.set(row.id, el);
                        else rowRefs.current.delete(row.id);
                      }}
                      data-id={row.id}
                      role="treeitem"
                      aria-level={row.depth + 1}
                      aria-selected={isSel}
                      tabIndex={tab}
                      className={`${base} cursor-pointer text-indigo-700 underline`}
                      style={{ top, height: ROW_H, paddingLeft: pad + 20 }}
                      onClick={() => {
                        setSelected(row.id);
                        showMore(row.parentId);
                      }}
                    >
                      Show {Math.min(PAGE, row.remaining).toLocaleString()} more
                      ({row.remaining.toLocaleString()} hidden)
                    </div>
                  );
                const type = jsonType(row.value);
                const container = isContainer(row.value);
                const open = expanded.has(row.id);
                const key = row.path[row.path.length - 1];
                const pv = preview(row.value);
                const isMatch = matchIds.has(row.id);
                const label = `${key === undefined ? 'root' : String(key)}: ${pv}, ${type}`;
                return (
                  <div
                    key={row.id}
                    ref={(el) => {
                      if (el) rowRefs.current.set(row.id, el);
                      else rowRefs.current.delete(row.id);
                    }}
                    data-id={row.id}
                    role="treeitem"
                    aria-level={row.depth + 1}
                    aria-setsize={row.size}
                    aria-posinset={row.pos}
                    aria-expanded={
                      container && childCount(row.value) ? open : undefined
                    }
                    aria-selected={isSel}
                    aria-label={label}
                    tabIndex={tab}
                    className={`${base} cursor-default ${row.id === currentMatchId ? 'outline outline-2 -outline-offset-2 outline-amber-400' : ''}`}
                    style={{ top, height: ROW_H, paddingLeft: pad }}
                    onClick={() => setSelected(row.id)}
                    onDoubleClick={() => container && toggle(row.id)}
                  >
                    <span
                      aria-hidden
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-500 ${container && childCount(row.value) ? 'cursor-pointer hover:bg-gray-200' : 'invisible'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(row.id);
                        toggle(row.id);
                      }}
                    >
                      {open ? '▾' : '▸'}
                    </span>
                    {key !== undefined && (
                      <span
                        className={
                          typeof key === 'number'
                            ? 'text-gray-400'
                            : 'text-rose-700'
                        }
                      >
                        {typeof key === 'number' ? (
                          key
                        ) : (
                          <Highlight text={key} query={query} />
                        )}
                        :
                      </span>
                    )}
                    <span
                      className={`min-w-0 overflow-hidden text-ellipsis ${TYPE_STYLE[type]}`}
                    >
                      {container ? pv : <Highlight text={pv} query={query} />}
                    </span>
                    <span className="ml-auto shrink-0 rounded bg-gray-100 px-1.5 py-0.5 font-sans text-[10px] uppercase tracking-wide text-gray-500">
                      {type}
                    </span>
                    {isMatch && <span className="sr-only">(match)</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Keyboard: ↑ ↓ move, → expand, ← collapse or go to parent, Enter
            toggles, Home/End jump. Double-click a row to toggle it.
          </p>

          <section
            aria-label="Selected node"
            className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-gray-900">Selected:</span>
              <code className="min-w-0 break-all rounded bg-white px-2 py-0.5 text-[13px] text-gray-800">
                {pathText}
              </code>
              <span className="rounded bg-white px-1.5 py-0.5 text-xs uppercase text-gray-500">
                {jsonType(selectedValue)}
              </span>
              {isContainer(selectedValue) && (
                <span className="text-xs text-gray-500">
                  {preview(selectedValue)}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <LazyCopy
                label="Copy value"
                getText={() => copyValueText(selectedValue)}
              />
              <LazyCopy
                label="Copy JSON path"
                getText={() =>
                  formatPath(selectedPath, { root: rootPrefix, quote })
                }
                disabled={!selectedPath.length && !rootPrefix}
              />
              <LazyCopy
                label="Copy subtree"
                getText={() => prettySubtree(selectedValue)}
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <Checkbox
                label="Start paths with $ (JSONPath)"
                checked={rootPrefix}
                onChange={setRootPrefix}
              />
              <SelectField
                label="Quotes for odd keys"
                value={quote}
                onChange={(v) => setQuote(v === "'" ? "'" : '"')}
                options={[
                  { value: '"', label: 'Double ["key"]' },
                  { value: "'", label: "Single ['key']" },
                ]}
                className="w-44"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
