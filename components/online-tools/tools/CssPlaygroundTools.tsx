'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { RangeField, SelectField, TextField, btnSecondary } from '../ui';
import { CodePanel, ItemTabs } from './playground-shared';

const COLORS = [
  'bg-indigo-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-sky-400',
  'bg-violet-400',
  'bg-lime-400',
  'bg-orange-400',
  'bg-teal-400',
  'bg-pink-400',
  'bg-cyan-400',
  'bg-fuchsia-400',
];
const opts = (xs: string[]) => xs.map((x) => ({ value: x, label: x }));
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function cssBlock(selector: string, rules: [string, string][]) {
  if (!rules.length) return '';
  return `${selector} {\n${rules.map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;
}

// ── Flexbox ────────────────────────────────────────────────────────────────

type FlexItem = {
  grow: string;
  shrink: string;
  basis: string;
  alignSelf: string;
  order: string;
};
const FLEX_ITEM: FlexItem = {
  grow: '0',
  shrink: '1',
  basis: 'auto',
  alignSelf: 'auto',
  order: '0',
};
const FLEX_DEFAULT = {
  direction: 'row',
  wrap: 'nowrap',
  justify: 'flex-start',
  alignItems: 'stretch',
  alignContent: 'normal',
  rowGap: 12,
  colGap: 12,
  count: 4,
};

export function FlexboxPlaygroundTool(_: ToolProps) {
  const [c, setC] = useState(FLEX_DEFAULT);
  const [items, setItems] = useState<FlexItem[]>(() =>
    Array.from({ length: 12 }, () => ({ ...FLEX_ITEM })),
  );
  const [sel, setSel] = useState(0);
  const [width, setWidth] = useState(100);
  const set =
    <K extends keyof typeof c>(k: K) =>
    (v: (typeof c)[K]) =>
      setC((s) => ({ ...s, [k]: v }));
  const setItem = (k: keyof FlexItem) => (v: string) =>
    setItems((xs) => xs.map((x, i) => (i === sel ? { ...x, [k]: v } : x)));
  const item = items[Math.min(sel, c.count - 1)];

  const container: [string, string][] = [['display', 'flex']];
  if (c.direction !== 'row') container.push(['flex-direction', c.direction]);
  if (c.wrap !== 'nowrap') container.push(['flex-wrap', c.wrap]);
  if (c.justify !== 'flex-start')
    container.push(['justify-content', c.justify]);
  if (c.alignItems !== 'stretch') container.push(['align-items', c.alignItems]);
  if (c.alignContent !== 'normal')
    container.push(['align-content', c.alignContent]);
  if (c.rowGap === c.colGap) {
    if (c.rowGap) container.push(['gap', `${c.rowGap}px`]);
  } else {
    container.push(
      ['row-gap', `${c.rowGap}px`],
      ['column-gap', `${c.colGap}px`],
    );
  }
  const itemRules = items.slice(0, c.count).map((it) => {
    const r: [string, string][] = [];
    if (it.grow !== '0' || it.shrink !== '1' || it.basis !== 'auto')
      r.push(['flex', `${it.grow} ${it.shrink} ${it.basis}`]);
    if (it.alignSelf !== 'auto') r.push(['align-self', it.alignSelf]);
    if (it.order !== '0') r.push(['order', it.order]);
    return r;
  });
  const css = [
    cssBlock('.container', container),
    cssBlock('.item', [['padding', '16px']]),
    ...itemRules.map((r, i) => cssBlock(`.item:nth-child(${i + 1})`, r)),
  ]
    .filter(Boolean)
    .join('\n\n');

  const style: CSSProperties = {
    display: 'flex',
    flexDirection: c.direction as CSSProperties['flexDirection'],
    flexWrap: c.wrap as CSSProperties['flexWrap'],
    justifyContent: c.justify,
    alignItems: c.alignItems,
    alignContent: c.alignContent,
    rowGap: c.rowGap,
    columnGap: c.colGap,
  };

  const randomize = () => {
    setC({
      direction: pick(['row', 'row', 'column', 'row-reverse']),
      wrap: pick(['nowrap', 'wrap', 'wrap']),
      justify: pick([
        'flex-start',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
        'flex-end',
      ]),
      alignItems: pick([
        'stretch',
        'center',
        'flex-start',
        'flex-end',
        'baseline',
      ]),
      alignContent: pick(['normal', 'center', 'space-between', 'flex-start']),
      rowGap: pick([0, 8, 12, 16, 24]),
      colGap: pick([0, 8, 12, 16, 24]),
      count: pick([3, 4, 5, 6, 8]),
    });
    setItems(
      Array.from({ length: 12 }, () => ({
        grow: pick(['0', '0', '1', '2']),
        shrink: '1',
        basis: pick(['auto', 'auto', '120px', '25%']),
        alignSelf: pick(['auto', 'auto', 'auto', 'center', 'flex-end']),
        order: '0',
      })),
    );
  };
  const reset = () => {
    setC(FLEX_DEFAULT);
    setItems(Array.from({ length: 12 }, () => ({ ...FLEX_ITEM })));
    setSel(0);
    setWidth(100);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Container</h2>
          <SelectField
            label="flex-direction"
            value={c.direction}
            onChange={set('direction')}
            options={opts(['row', 'row-reverse', 'column', 'column-reverse'])}
          />
          <SelectField
            label="flex-wrap"
            value={c.wrap}
            onChange={set('wrap')}
            options={opts(['nowrap', 'wrap', 'wrap-reverse'])}
          />
          <SelectField
            label="justify-content"
            value={c.justify}
            onChange={set('justify')}
            options={opts([
              'flex-start',
              'center',
              'flex-end',
              'space-between',
              'space-around',
              'space-evenly',
            ])}
          />
          <SelectField
            label="align-items"
            value={c.alignItems}
            onChange={set('alignItems')}
            options={opts([
              'stretch',
              'flex-start',
              'center',
              'flex-end',
              'baseline',
            ])}
          />
          <SelectField
            label="align-content (wrapped lines)"
            value={c.alignContent}
            onChange={set('alignContent')}
            options={opts([
              'normal',
              'flex-start',
              'center',
              'flex-end',
              'space-between',
              'space-around',
              'space-evenly',
              'stretch',
            ])}
          />
          <RangeField
            label="row-gap"
            value={c.rowGap}
            onChange={set('rowGap')}
            min={0}
            max={48}
            display={`${c.rowGap}px`}
          />
          <RangeField
            label="column-gap"
            value={c.colGap}
            onChange={set('colGap')}
            min={0}
            max={48}
            display={`${c.colGap}px`}
          />
          <RangeField
            label="Items"
            value={c.count}
            onChange={(n) => {
              set('count')(n);
              setSel((s) => Math.min(s, n - 1));
            }}
            min={1}
            max={12}
          />
        </div>
        <div className="space-y-4">
          <RangeField
            label="Preview width"
            value={width}
            onChange={setWidth}
            min={30}
            max={100}
            display={`${width}%`}
          />
          <div
            className="min-h-[16rem] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3 transition-all"
            style={{
              ...style,
              width: `${width}%`,
              minHeight: c.direction.startsWith('column') ? '24rem' : '16rem',
            }}
            aria-label="Flexbox preview"
          >
            {items.slice(0, c.count).map((it, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={sel === i}
                aria-label={`Item ${i + 1}`}
                className={`${COLORS[i]} rounded-lg px-4 py-3 text-sm font-bold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${sel === i ? 'ring-2 ring-gray-900 ring-offset-2' : ''}`}
                style={{
                  flex: `${it.grow} ${it.shrink} ${it.basis}`,
                  alignSelf: it.alignSelf,
                  order: Number(it.order) || 0,
                  minHeight: i % 3 === 1 ? '4.5rem' : undefined,
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Item {sel + 1}
              </h2>
              <ItemTabs count={c.count} selected={sel} onSelect={setSel} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <SelectField
                label="flex-grow"
                value={item.grow}
                onChange={setItem('grow')}
                options={opts(['0', '1', '2', '3'])}
              />
              <SelectField
                label="flex-shrink"
                value={item.shrink}
                onChange={setItem('shrink')}
                options={opts(['0', '1', '2'])}
              />
              <SelectField
                label="flex-basis"
                value={item.basis}
                onChange={setItem('basis')}
                options={opts([
                  'auto',
                  '0',
                  '80px',
                  '120px',
                  '200px',
                  '25%',
                  '50%',
                  '100%',
                ])}
              />
              <SelectField
                label="align-self"
                value={item.alignSelf}
                onChange={setItem('alignSelf')}
                options={opts([
                  'auto',
                  'flex-start',
                  'center',
                  'flex-end',
                  'stretch',
                  'baseline',
                ])}
              />
              <SelectField
                label="order"
                value={item.order}
                onChange={setItem('order')}
                options={opts(['-1', '0', '1', '2', '3'])}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnSecondary} onClick={randomize}>
              🎲 Randomize
            </button>
            <button type="button" className={btnSecondary} onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>
      <CodePanel css={css} />
      <p className="text-xs text-gray-500">
        Need two dimensions? Try the{' '}
        <Link
          className="text-indigo-600 underline underline-offset-2"
          href="/online-tool/developer-tools/grid-playground"
        >
          CSS Grid playground
        </Link>
        . Sizing with rem, % or vw? See the{' '}
        <Link
          className="text-indigo-600 underline underline-offset-2"
          href="/online-tool/developer-tools/css-unit-visualizer"
        >
          CSS unit visualizer
        </Link>
        .
      </p>
    </div>
  );
}

// ── Grid ───────────────────────────────────────────────────────────────────

type GridItem = {
  colStart: string;
  colEnd: string;
  rowStart: string;
  rowEnd: string;
};
const GRID_ITEM: GridItem = {
  colStart: 'auto',
  colEnd: 'auto',
  rowStart: 'auto',
  rowEnd: 'auto',
};
type GridState = {
  columns: string;
  rows: string;
  rowGap: number;
  colGap: number;
  justifyItems: string;
  alignItems: string;
  justifyContent: string;
  alignContent: string;
  autoFlow: string;
  count: number;
  items: GridItem[];
};
const blankItems = () => Array.from({ length: 16 }, () => ({ ...GRID_ITEM }));
const GRID_DEFAULT: GridState = {
  columns: 'repeat(3, 1fr)',
  rows: 'repeat(2, 100px)',
  rowGap: 12,
  colGap: 12,
  justifyItems: 'stretch',
  alignItems: 'stretch',
  justifyContent: 'normal',
  alignContent: 'normal',
  autoFlow: 'row',
  count: 6,
  items: blankItems(),
};
const withItems = (
  base: Partial<GridState>,
  placed: Partial<GridItem>[],
): GridState => ({
  ...GRID_DEFAULT,
  ...base,
  items: blankItems().map((it, i) => ({ ...it, ...(placed[i] ?? {}) })),
});
const EXAMPLES: Record<string, GridState> = {
  'Holy grail page': withItems(
    {
      columns: '200px 1fr 200px',
      rows: 'auto 1fr auto',
      count: 5,
      rowGap: 8,
      colGap: 8,
    },
    [
      { colStart: '1', colEnd: '4' },
      {},
      {},
      {},
      { colStart: '1', colEnd: '4' },
    ],
  ),
  'Photo gallery (auto-fill)': withItems(
    { columns: 'repeat(auto-fill, minmax(120px, 1fr))', rows: '', count: 10 },
    [],
  ),
  Dashboard: withItems(
    { columns: 'repeat(4, 1fr)', rows: 'repeat(3, 90px)', count: 6 },
    [
      { colStart: '1', colEnd: 'span 2', rowStart: '1', rowEnd: 'span 2' },
      { colStart: '3', colEnd: 'span 2' },
      {},
      {},
      { colStart: '1', colEnd: 'span 4' },
    ],
  ),
  '12-column layout': withItems(
    {
      columns: 'repeat(12, 1fr)',
      rows: 'repeat(3, 70px)',
      count: 4,
      colGap: 8,
    },
    [
      { colStart: '1', colEnd: 'span 12' },
      { colStart: '1', colEnd: 'span 8' },
      { colStart: '9', colEnd: 'span 4' },
      { colStart: '1', colEnd: 'span 12' },
    ],
  ),
};

const gridLine = (start: string, end: string) =>
  start === 'auto' && end === 'auto' ? '' : `${start} / ${end}`;

export function GridPlaygroundTool(_: ToolProps) {
  const [g, setG] = useState<GridState>(GRID_DEFAULT);
  const [sel, setSel] = useState(0);
  const [width, setWidth] = useState(100);
  const [tracks, setTracks] = useState<{ cols: number[]; rows: number[] }>({
    cols: [],
    rows: [],
  });
  const ref = useRef<HTMLDivElement>(null);
  const set =
    <K extends keyof GridState>(k: K) =>
    (v: GridState[K]) =>
      setG((s) => ({ ...s, [k]: v }));
  const it = g.items[Math.min(sel, g.count - 1)];
  const setItem = (k: keyof GridItem) => (v: string) =>
    setG((s) => ({
      ...s,
      items: s.items.map((x, i) =>
        i === sel ? { ...x, [k]: v || 'auto' } : x,
      ),
    }));

  const style: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: g.columns || undefined,
    gridTemplateRows: g.rows || undefined,
    rowGap: g.rowGap,
    columnGap: g.colGap,
    justifyItems: g.justifyItems,
    alignItems: g.alignItems,
    justifyContent: g.justifyContent,
    alignContent: g.alignContent,
    gridAutoFlow: g.autoFlow,
  };

  // Read the resolved track sizes back from the browser to number the lines.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const cs = getComputedStyle(el);
      const parse = (v: string) =>
        v && v !== 'none'
          ? v
              .split(/\s+/)
              .map(parseFloat)
              .filter((n) => Number.isFinite(n))
          : [];
      setTracks({
        cols: parse(cs.gridTemplateColumns),
        rows: parse(cs.gridTemplateRows),
      });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [g, width]);

  const container: [string, string][] = [['display', 'grid']];
  if (g.columns) container.push(['grid-template-columns', g.columns]);
  if (g.rows) container.push(['grid-template-rows', g.rows]);
  if (g.rowGap === g.colGap) {
    if (g.rowGap) container.push(['gap', `${g.rowGap}px`]);
  } else
    container.push(
      ['row-gap', `${g.rowGap}px`],
      ['column-gap', `${g.colGap}px`],
    );
  if (g.justifyItems !== 'stretch')
    container.push(['justify-items', g.justifyItems]);
  if (g.alignItems !== 'stretch') container.push(['align-items', g.alignItems]);
  if (g.justifyContent !== 'normal')
    container.push(['justify-content', g.justifyContent]);
  if (g.alignContent !== 'normal')
    container.push(['align-content', g.alignContent]);
  if (g.autoFlow !== 'row') container.push(['grid-auto-flow', g.autoFlow]);
  const css = [
    cssBlock('.container', container),
    ...g.items.slice(0, g.count).map((x, i) => {
      const r: [string, string][] = [];
      const col = gridLine(x.colStart, x.colEnd);
      const row = gridLine(x.rowStart, x.rowEnd);
      if (col) r.push(['grid-column', col]);
      if (row) r.push(['grid-row', row]);
      return cssBlock(`.item:nth-child(${i + 1})`, r);
    }),
  ]
    .filter(Boolean)
    .join('\n\n');

  // Line positions (px) from the resolved tracks and gaps.
  const lines = (sizes: number[], gap: number) => {
    const out = [0];
    sizes.forEach((s, i) =>
      out.push(out[i] + s + (i < sizes.length - 1 ? gap : 0)),
    );
    return out;
  };
  const colLines = lines(tracks.cols, g.colGap);
  const rowLines = lines(tracks.rows, g.rowGap);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Container</h2>
          <TextField
            label="grid-template-columns"
            value={g.columns}
            onChange={set('columns')}
            placeholder="repeat(3, 1fr)"
            mono
          />
          <TextField
            label="grid-template-rows"
            value={g.rows}
            onChange={set('rows')}
            placeholder="auto or 100px 1fr"
            mono
          />
          <RangeField
            label="row-gap"
            value={g.rowGap}
            onChange={set('rowGap')}
            min={0}
            max={48}
            display={`${g.rowGap}px`}
          />
          <RangeField
            label="column-gap"
            value={g.colGap}
            onChange={set('colGap')}
            min={0}
            max={48}
            display={`${g.colGap}px`}
          />
          <SelectField
            label="justify-items"
            value={g.justifyItems}
            onChange={set('justifyItems')}
            options={opts(['stretch', 'start', 'center', 'end'])}
          />
          <SelectField
            label="align-items"
            value={g.alignItems}
            onChange={set('alignItems')}
            options={opts(['stretch', 'start', 'center', 'end'])}
          />
          <SelectField
            label="justify-content"
            value={g.justifyContent}
            onChange={set('justifyContent')}
            options={opts([
              'normal',
              'start',
              'center',
              'end',
              'space-between',
              'space-around',
              'space-evenly',
            ])}
          />
          <SelectField
            label="align-content"
            value={g.alignContent}
            onChange={set('alignContent')}
            options={opts([
              'normal',
              'start',
              'center',
              'end',
              'space-between',
              'space-around',
              'space-evenly',
            ])}
          />
          <SelectField
            label="grid-auto-flow"
            value={g.autoFlow}
            onChange={set('autoFlow')}
            options={opts(['row', 'column', 'row dense', 'column dense'])}
          />
          <RangeField
            label="Items"
            value={g.count}
            onChange={(n) => {
              set('count')(n);
              setSel((s) => Math.min(s, n - 1));
            }}
            min={1}
            max={16}
          />
        </div>
        <div className="space-y-4">
          <RangeField
            label="Preview width"
            value={width}
            onChange={setWidth}
            min={30}
            max={100}
            display={`${width}%`}
          />
          <div className="relative" style={{ width: `${width}%` }}>
            <div
              ref={ref}
              className="relative min-h-[14rem] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-3"
              style={style}
              aria-label="CSS grid preview"
            >
              {g.items.slice(0, g.count).map((x, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={sel === i}
                  aria-label={`Item ${i + 1}`}
                  className={`${COLORS[i % COLORS.length]} min-h-[2.5rem] rounded-lg px-3 py-2 text-sm font-bold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${sel === i ? 'ring-2 ring-gray-900 ring-offset-2' : ''}`}
                  style={{
                    gridColumn: gridLine(x.colStart, x.colEnd) || undefined,
                    gridRow: gridLine(x.rowStart, x.rowEnd) || undefined,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            {/* Grid line numbers, offset by the container's border + padding. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ left: 14, top: 14 }}
            >
              {colLines.map((x, i) => (
                <span
                  key={`c${i}`}
                  className="absolute -top-3.5 -translate-x-1/2 rounded bg-white px-0.5 font-mono text-[9px] text-gray-500"
                  style={{ left: x }}
                >
                  {i + 1}
                </span>
              ))}
              {rowLines.map((y, i) => (
                <span
                  key={`r${i}`}
                  className="absolute -left-3.5 -translate-y-1/2 rounded bg-white px-0.5 font-mono text-[9px] text-gray-500"
                  style={{ top: y }}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Small numbers along the edges are grid line numbers — use them for
            grid-column and grid-row (e.g. 1 / 3, or span 2).
          </p>
          <div className="space-y-3 rounded-2xl border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Item {sel + 1} placement
              </h2>
              <ItemTabs count={g.count} selected={sel} onSelect={setSel} />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <TextField
                label="grid-column-start"
                value={it.colStart}
                onChange={setItem('colStart')}
                mono
              />
              <TextField
                label="grid-column-end"
                value={it.colEnd}
                onChange={setItem('colEnd')}
                mono
              />
              <TextField
                label="grid-row-start"
                value={it.rowStart}
                onChange={setItem('rowStart')}
                mono
              />
              <TextField
                label="grid-row-end"
                value={it.rowEnd}
                onChange={setItem('rowEnd')}
                mono
              />
            </div>
            <p className="font-mono text-xs text-gray-600">
              grid-column: {gridLine(it.colStart, it.colEnd) || 'auto'};
              grid-row: {gridLine(it.rowStart, it.rowEnd) || 'auto'};
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-700">Examples:</span>
            {Object.entries(EXAMPLES).map(([name, ex]) => (
              <button
                key={name}
                type="button"
                className={`${btnSecondary} !py-1.5 text-xs`}
                onClick={() => {
                  setG(ex);
                  setSel(0);
                }}
              >
                {name}
              </button>
            ))}
            <button
              type="button"
              className={`${btnSecondary} !py-1.5 text-xs`}
              onClick={() => {
                setG(GRID_DEFAULT);
                setSel(0);
                setWidth(100);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <CodePanel css={css} />
      <p className="text-xs text-gray-500">
        One-dimensional rows or columns are often simpler with the{' '}
        <Link
          className="text-indigo-600 underline underline-offset-2"
          href="/online-tool/developer-tools/flexbox-playground"
        >
          Flexbox playground
        </Link>
        .
      </p>
    </div>
  );
}
