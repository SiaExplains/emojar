'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import ENTITIES from '@/lib/online-tools/data/html-entities.json';
import type { ToolProps } from '../ToolRenderer';
import {
  Chips,
  CopyChip,
  DetailDialog,
  EmptyState,
  SearchBox,
} from './ReferenceUI';

type Cat =
  | 'all'
  | 'symbols'
  | 'currency'
  | 'arrows'
  | 'math'
  | 'punctuation'
  | 'latin'
  | 'greek'
  | 'cyrillic';
/** [character(s), entity names (shortest first), category] */
type Raw = [string, string[], Exclude<Cat, 'all'>];
type Entity = {
  char: string;
  names: string[];
  cat: Exclude<Cat, 'all'>;
  cps: number[];
};

const LIST: Entity[] = (ENTITIES as Raw[]).map(([char, names, cat]) => ({
  char,
  names,
  cat,
  cps: [...char].map((c) => c.codePointAt(0)!),
}));

const CATS: { value: Cat; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'symbols', label: 'Symbols' },
  { value: 'currency', label: 'Currency' },
  { value: 'arrows', label: 'Arrows' },
  { value: 'math', label: 'Mathematical' },
  { value: 'punctuation', label: 'Punctuation' },
  { value: 'latin', label: 'Latin' },
  { value: 'greek', label: 'Greek' },
  { value: 'cyrillic', label: 'Cyrillic' },
];

const uplus = (cp: number) =>
  `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
const dec = (e: Entity) => e.cps.map((c) => `&#${c};`).join('');
const hexEnt = (e: Entity) =>
  e.cps.map((c) => `&#x${c.toString(16).toUpperCase()};`).join('');
/** Characters that need a visible stand-in (spaces, invisible marks). */
const shown = (e: Entity) => (/^[\s­​-‏⁠-⁤]$/.test(e.char) ? '⎵' : e.char);

function search(q: string, cat: Cat) {
  const s = q.trim();
  const lower = s.toLowerCase().replace(/^&|;$/g, '');
  const cp = /^(?:u\+|0x|&#x)([0-9a-f]{2,6});?$/i.exec(s);
  const decM = /^&#(\d+);?$/.exec(s);
  return LIST.filter((e) => {
    if (cat !== 'all' && e.cat !== cat) return false;
    if (!s) return true;
    if (e.char === s) return true;
    if (cp) return e.cps[0] === parseInt(cp[1], 16);
    if (decM) return e.cps[0] === Number(decM[1]);
    return e.names.some((n) => n.toLowerCase().includes(lower));
  }).sort((a, b) => {
    if (!s) return 0;
    // Exact name matches first (“&copy;” before “&copysr;”).
    const ea = a.names.some((n) => n.toLowerCase() === lower) ? 0 : 1;
    const eb = b.names.some((n) => n.toLowerCase() === lower) ? 0 : 1;
    return ea - eb;
  });
}

export default function HtmlEntityTool({ config }: ToolProps) {
  const init = String(config.init_category ?? 'all') as Cat;
  const [cat, setCat] = useState<Cat>(
    CATS.some((c) => c.value === init) ? init : 'all',
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Entity | null>(null);
  const q = useDeferredValue(query);
  const list = useMemo(() => search(q, cat), [q, cat]);
  const LIMIT = 600;

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search HTML entities"
        value={query}
        onChange={setQuery}
        placeholder="copy, nbsp, rarr, €, U+00A9, &#169;…"
        count={list.length}
        noun="entity"
        plural="entities"
      />
      <Chips label="Category" value={cat} onChange={setCat} options={CATS} />
      {list.length === 0 ? (
        <EmptyState>
          No named entity matches “{q}”. Any character can still be written as a
          numeric reference — find it in the Unicode Character Explorer.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-2">
          {list.slice(0, LIMIT).map((e) => (
            <li key={e.char}>
              <button
                type="button"
                onClick={() => setSelected(e)}
                aria-label={`${e.char.trim() ? e.char : 'space character'}: &${e.names[0]};`}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 px-3 py-2 text-left transition hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="w-8 shrink-0 text-center text-2xl text-gray-900">
                  {shown(e)}
                </span>
                <span className="min-w-0 truncate font-mono text-xs text-gray-700">
                  &amp;{e.names[0]};
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {list.length > LIMIT && (
        <p className="text-xs text-gray-500">
          Showing the first {LIMIT} of {list.length}. Search or pick a category
          to narrow it down.
        </p>
      )}

      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={
          selected && (
            <span className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 text-3xl">
                {shown(selected)}
              </span>
              <span className="font-mono">&amp;{selected.names[0]};</span>
            </span>
          )
        }
      >
        {selected && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CopyChip label="Character" value={selected.char} mono={false} />
              <CopyChip label="Named entity" value={`&${selected.names[0]};`} />
              <CopyChip label="Decimal" value={dec(selected)} />
              <CopyChip label="Hexadecimal" value={hexEnt(selected)} />
              <CopyChip
                label="Unicode"
                value={selected.cps.map(uplus).join(' ')}
              />
              <CopyChip
                label="CSS escape"
                value={selected.cps
                  .map((c) => `\\${c.toString(16).toUpperCase()}`)
                  .join('')}
              />
            </div>
            {selected.names.length > 1 && (
              <p className="text-xs text-gray-500">
                Also written as:{' '}
                {selected.names.slice(1).map((n) => (
                  <code
                    key={n}
                    className="mr-1.5 rounded bg-gray-100 px-1 py-0.5"
                  >
                    &amp;{n};
                  </code>
                ))}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Named entities come from the WHATWG HTML standard. In UTF-8 pages
              you can usually type the character directly; entities are needed
              for &lt;, &gt; and &amp; in text, and quotes inside attributes.
            </p>
          </div>
        )}
      </DetailDialog>
    </div>
  );
}
