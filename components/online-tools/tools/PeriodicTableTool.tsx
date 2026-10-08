'use client';

import Link from 'next/link';
import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { ELEMENTS, type ElementData } from '@/lib/online-tools/data/elements';
import type { ToolProps } from '../ToolRenderer';
import { btnSecondary } from '../ui';
import {
  CopyChip,
  DetailDialog,
  EmptyState,
  Fact,
  SearchBox,
  SelectChip,
} from './ReferenceUI';

// Category colours, each paired with a short text code so the table never
// relies on colour alone.
const CATEGORIES: Record<string, { tile: string; code: string }> = {
  'Alkali metal': { tile: 'bg-rose-100 border-rose-300', code: 'AM' },
  'Alkaline earth metal': {
    tile: 'bg-orange-100 border-orange-300',
    code: 'AE',
  },
  'Transition metal': { tile: 'bg-amber-50 border-amber-300', code: 'TM' },
  'Post-transition metal': { tile: 'bg-lime-100 border-lime-300', code: 'PT' },
  Metalloid: { tile: 'bg-teal-100 border-teal-300', code: 'MD' },
  Nonmetal: { tile: 'bg-sky-100 border-sky-300', code: 'NM' },
  Halogen: { tile: 'bg-cyan-100 border-cyan-300', code: 'HA' },
  'Noble gas': { tile: 'bg-violet-100 border-violet-300', code: 'NG' },
  Lanthanide: { tile: 'bg-pink-100 border-pink-300', code: 'LA' },
  Actinide: { tile: 'bg-fuchsia-100 border-fuchsia-300', code: 'AC' },
};

const kToC = (k: number) => Math.round((k - 273.15) * 100) / 100;
export const massLabel = (e: ElementData) =>
  e.mn ? `[${e.mn}]` : String(Math.round(e.m * 1000) / 1000);

/** Grid position: 7 periods, a spacer row, then the lanthanide/actinide rows. */
function cell(e: ElementData): { row: number; col: number } {
  if (e.g !== null) return { row: e.p, col: e.g };
  const first = e.p === 6 ? 57 : 89;
  return { row: e.p === 6 ? 9 : 10, col: 3 + (e.z - first) };
}

const STATES = ['solid', 'liquid', 'gas'];

type Filters = {
  period: string;
  group: string;
  block: string;
  category: string;
  state: string;
};
const NO_FILTERS: Filters = {
  period: '',
  group: '',
  block: '',
  category: '',
  state: '',
};

function matches(e: ElementData, q: string, f: Filters) {
  if (f.period && e.p !== Number(f.period)) return false;
  if (f.group && e.g !== Number(f.group)) return false;
  if (f.block && e.b !== f.block) return false;
  if (f.category && e.c !== f.category) return false;
  if (f.state && e.st !== f.state) return false;
  if (!q) return true;
  const s = q.trim().toLowerCase();
  return (
    e.n.toLowerCase().includes(s) ||
    e.s.toLowerCase() === s ||
    String(e.z) === s
  );
}

export default function PeriodicTableTool(_: ToolProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [view, setView] = useState<'table' | 'list'>('table');
  const q = useDeferredValue(query);
  const gridRef = useRef<HTMLDivElement>(null);

  const active = q.trim() !== '' || Object.values(filters).some(Boolean);
  const hits = useMemo(
    () => ELEMENTS.filter((e) => matches(e, q, filters)),
    [q, filters],
  );
  const hitSet = useMemo(() => new Set(hits.map((e) => e.z)), [hits]);
  const set = (k: keyof Filters) => (v: string) =>
    setFilters((f) => ({ ...f, [k]: v }));

  // Arrow keys move between neighbouring tiles.
  const onGridKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const dir = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    }[ev.key];
    if (!dir) return;
    const z = Number((document.activeElement as HTMLElement | null)?.dataset.z);
    const from = ELEMENTS[z - 1];
    if (!from) return;
    ev.preventDefault();
    const { row, col } = cell(from);
    for (let step = 1; step < 19; step++) {
      const r = row + dir[0] * step;
      const c = col + dir[1] * step;
      if (r < 1 || r > 10 || c < 1 || c > 18) break;
      const next = ELEMENTS.find((e) => {
        const p = cell(e);
        return p.row === r && p.col === c;
      });
      if (next) {
        gridRef.current
          ?.querySelector<HTMLButtonElement>(`[data-z="${next.z}"]`)
          ?.focus();
        break;
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
        <SearchBox
          label="Search elements"
          value={query}
          onChange={setQuery}
          placeholder="Name, symbol or atomic number — e.g. iron, Fe, 26"
          count={active ? hits.length : undefined}
          noun="element"
        />
        <div className="flex items-end gap-2">
          <button
            type="button"
            className={btnSecondary}
            aria-pressed={view === 'list'}
            onClick={() => setView(view === 'table' ? 'list' : 'table')}
          >
            {view === 'table' ? '☰ List view' : '▦ Table view'}
          </button>
          {active && (
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setQuery('');
                setFilters(NO_FILTERS);
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <SelectChip
          label="Period"
          value={filters.period}
          onChange={set('period')}
          options={[
            { value: '', label: 'All' },
            ...[1, 2, 3, 4, 5, 6, 7].map((p) => ({
              value: String(p),
              label: `Period ${p}`,
            })),
          ]}
        />
        <SelectChip
          label="Group"
          value={filters.group}
          onChange={set('group')}
          options={[
            { value: '', label: 'All' },
            ...Array.from({ length: 18 }, (_, i) => ({
              value: String(i + 1),
              label: `Group ${i + 1}`,
            })),
          ]}
        />
        <SelectChip
          label="Block"
          value={filters.block}
          onChange={set('block')}
          options={[
            { value: '', label: 'All' },
            ...['s', 'p', 'd', 'f'].map((b) => ({
              value: b,
              label: `${b}-block`,
            })),
          ]}
        />
        <SelectChip
          label="Category"
          value={filters.category}
          onChange={set('category')}
          options={[
            { value: '', label: 'All' },
            ...Object.keys(CATEGORIES).map((c) => ({ value: c, label: c })),
          ]}
        />
        <SelectChip
          label="State at 20 °C"
          value={filters.state}
          onChange={set('state')}
          options={[
            { value: '', label: 'All' },
            ...STATES.map((s) => ({
              value: s,
              label: s[0].toUpperCase() + s.slice(1),
            })),
          ]}
        />
      </div>

      {view === 'table' ? (
        <div className="-mx-1 overflow-x-auto pb-2">
          <div
            ref={gridRef}
            onKeyDown={onGridKey}
            className="grid min-w-[56rem] gap-1 px-1"
            style={{
              gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(7, auto) 0.75rem repeat(2, auto)',
            }}
            aria-label="Periodic table. Use the arrow keys to move between elements."
            role="group"
          >
            {[6, 7].map((p) => (
              <div
                key={`ph${p}`}
                aria-hidden
                style={{ gridRow: p, gridColumn: 3 }}
                className="flex items-center justify-center rounded-md border border-dashed border-gray-300 text-[10px] text-gray-500"
              >
                {p === 6 ? '57–71' : '89–103'}
              </div>
            ))}
            {ELEMENTS.map((e) => {
              const { row, col } = cell(e);
              const style = CATEGORIES[e.c];
              const dim = active && !hitSet.has(e.z);
              const hit = active && hitSet.has(e.z);
              return (
                <button
                  key={e.z}
                  type="button"
                  data-z={e.z}
                  onClick={() => setSelected(e)}
                  style={{ gridRow: row, gridColumn: col }}
                  aria-label={`${e.n}, ${e.s}, atomic number ${e.z}, ${e.c}`}
                  className={`relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-md border p-0.5 text-center leading-tight transition hover:z-10 hover:scale-110 hover:shadow-md focus:z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${style.tile} ${
                    dim ? 'opacity-25' : ''
                  } ${hit ? 'ring-2 ring-gray-900' : ''} ${
                    selected?.z === e.z ? 'ring-2 ring-indigo-600' : ''
                  }`}
                >
                  <span className="absolute left-1 top-0.5 text-[9px] text-gray-600">
                    {e.z}
                  </span>
                  <span
                    className="absolute right-1 top-0.5 text-[8px] font-medium text-gray-500"
                    aria-hidden
                  >
                    {style.code}
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    {e.s}
                  </span>
                  <span className="w-full truncate text-[8px] text-gray-700">
                    {e.n}
                  </span>
                  <span className="text-[8px] tabular-nums text-gray-500">
                    {massLabel(e)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : hits.length ? (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map((e) => (
            <li key={e.z}>
              <button
                type="button"
                onClick={() => setSelected(e)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${CATEGORIES[e.c].tile}`}
              >
                <span className="w-12 text-center text-2xl font-bold">
                  {e.s}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-gray-900">
                    {e.z}. {e.n}
                  </span>
                  <span className="block text-xs text-gray-600">
                    {e.c} · {massLabel(e)} u
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState>
          No element matches — try a name like “neon” or a number like 10.
        </EmptyState>
      )}

      <section aria-labelledby="pt-legend" className="space-y-2">
        <h2 id="pt-legend" className="text-sm font-semibold text-gray-800">
          Element categories
        </h2>
        <ul className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([name, s]) => (
            <li key={name}>
              <button
                type="button"
                aria-pressed={filters.category === name}
                onClick={() =>
                  set('category')(filters.category === name ? '' : name)
                }
                className={`rounded-full border px-2.5 py-1 text-xs text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${s.tile} ${
                  filters.category === name ? 'ring-2 ring-gray-900' : ''
                }`}
              >
                <span className="mr-1 font-semibold">{s.code}</span>
                {name}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500">
          Masses are standard atomic weights; values in [brackets] are the mass
          number of the longest-lived isotope. Need a compound’s mass? Use the{' '}
          <Link
            className="text-indigo-600 underline underline-offset-2"
            href="/online-tool/calculators/molar-mass-calculator"
          >
            molar mass calculator
          </Link>
          .
        </p>
      </section>

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          selected && (
            <span className="flex items-center gap-3">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-lg border text-2xl font-bold ${CATEGORIES[selected.c].tile}`}
              >
                {selected.s}
              </span>
              <span>
                {selected.n}
                <span className="block text-sm font-normal text-gray-500">
                  Atomic number {selected.z} · {selected.c}
                </span>
              </span>
            </span>
          )
        }
      >
        {selected && <ElementDetails e={selected} />}
      </DetailDialog>
    </div>
  );
}

function ElementDetails({ e }: { e: ElementData }) {
  const temp = (k: number | null) =>
    k === null ? 'Unknown' : `${k} K (${kToC(k)} °C)`;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <CopyChip label="Symbol" value={e.s} />
        <CopyChip label="Atomic mass" value={massLabel(e)} />
        <CopyChip label="Electron config." value={e.e} />
      </div>
      <dl>
        <Fact label="Name" value={e.n} />
        <Fact label="Symbol" value={e.s} />
        <Fact label="Atomic number" value={e.z} />
        <Fact
          label="Atomic mass"
          value={e.mn ? `[${e.mn}] (longest-lived isotope)` : `${e.m} u`}
        />
        <Fact label="Period" value={e.p} />
        <Fact
          label="Group"
          value={
            e.g ?? (e.p === 6 ? 'Lanthanides (f-block)' : 'Actinides (f-block)')
          }
        />
        <Fact label="Block" value={`${e.b}-block`} />
        <Fact label="Category" value={e.c} />
        <Fact
          label="Electron configuration"
          value={`${e.e}${e.ep ? ' (predicted)' : ''}`}
        />
        <Fact
          label="Electronegativity (Pauling)"
          value={e.en ?? 'Not available'}
        />
        <Fact label="Melting point" value={temp(e.mp)} />
        <Fact label="Boiling point" value={temp(e.bp)} />
        <Fact
          label="Density"
          value={
            e.d === null
              ? 'Unknown'
              : e.st === 'gas'
                ? `${Math.round(e.d * 1e6) / 1000} g/L (at 0 °C, 1 atm)`
                : `${e.d} g/cm³`
          }
        />
        <Fact
          label="State at room temperature"
          value={`${e.st[0].toUpperCase()}${e.st.slice(1)}${e.se ? ' (expected)' : ''}`}
        />
        <Fact
          label="Discovered"
          value={e.y === 'Ancient' ? 'Ancient times' : e.y}
        />
        <Fact label="Discovered by" value={e.by} />
      </dl>
    </div>
  );
}
