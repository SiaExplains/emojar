'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import ENTITIES from '@/lib/online-tools/data/html-entities.json';
import {
  MATH_CATEGORIES,
  MATH_SYMBOLS,
  type MathCategory,
  type MathSymbol,
} from '@/lib/online-tools/data/math-symbols';
import type { ToolProps } from '../ToolRenderer';
import { Chips, EmptyState, SearchBox, useCopyFlash } from './ReferenceUI';

const ENTITY_OF = new Map(
  (ENTITIES as [string, string[], string][]).map(([c, names]) => [c, names[0]]),
);
const uplus = (c: string) =>
  `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`;

type Cat = 'all' | MathCategory;

function search(q: string, cat: Cat): MathSymbol[] {
  const s = q.trim().toLowerCase();
  const cp = /^(?:u\+|0x)([0-9a-f]{2,6})$/i.exec(s);
  return MATH_SYMBOLS.filter((m) => {
    if (cat !== 'all' && m.category !== cat) return false;
    if (!s) return true;
    if (cp) return m.char.codePointAt(0) === parseInt(cp[1], 16);
    return (
      m.char === q.trim() ||
      m.name.toLowerCase().includes(s) ||
      (s.length > 1 && m.latex.toLowerCase().includes(s)) ||
      (m.meaning?.toLowerCase().includes(s) ?? false)
    );
  });
}

export default function MathSymbolsTool({ config }: ToolProps) {
  const init = String(config.init_category ?? 'all') as Cat;
  const [cat, setCat] = useState<Cat>(
    init === 'all' || MATH_CATEGORIES.some((c) => c.id === init) ? init : 'all',
  );
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query);
  const list = useMemo(() => {
    const found = search(q, cat);
    // A symbol listed in several categories shows once in “All”.
    if (cat !== 'all') return found;
    const seen = new Set<string>();
    return found.filter((m) => !seen.has(m.char) && seen.add(m.char));
  }, [q, cat]);
  const { copy, region } = useCopyFlash();

  const small =
    'rounded-md border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search math symbols"
        value={query}
        onChange={setQuery}
        placeholder="sum, integral, \in, not equal, ℝ, U+2211…"
        count={list.length}
        noun="symbol"
      />
      <Chips
        label="Category"
        value={cat}
        onChange={setCat}
        options={[
          { value: 'all', label: 'All' },
          ...MATH_CATEGORIES.map((c) => ({
            value: c.id as Cat,
            label: c.name,
          })),
        ]}
      />
      <div className="sticky top-2 z-10 rounded-xl bg-white/95 px-1 backdrop-blur">
        {region}
      </div>
      {list.length === 0 ? (
        <EmptyState>
          No symbol matches “{q}”. Try a plain word like “sum”, a LaTeX command
          like \leq, or paste the symbol itself.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => {
            const ent = ENTITY_OF.get(m.char);
            return (
              <li
                key={`${m.category}-${m.char}`}
                className="flex gap-3 rounded-2xl border border-gray-100 p-3"
              >
                <button
                  type="button"
                  onClick={() => void copy(m.char, m.char)}
                  aria-label={`Copy ${m.name} symbol ${m.char}`}
                  title="Copy symbol"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 font-serif text-3xl text-gray-900 hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {m.char}
                </button>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {m.name}
                  </p>
                  {m.meaning && (
                    <p className="text-xs text-gray-500">{m.meaning}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className={small}
                      onClick={() => void copy(uplus(m.char))}
                      aria-label={`Copy Unicode ${uplus(m.char)}`}
                    >
                      {uplus(m.char)}
                    </button>
                    {m.latex && (
                      <button
                        type="button"
                        className={small}
                        onClick={() => void copy(m.latex)}
                        aria-label={`Copy LaTeX ${m.latex}`}
                      >
                        {m.latex}
                      </button>
                    )}
                    <button
                      type="button"
                      className={small}
                      onClick={() =>
                        void copy(
                          ent ? `&${ent};` : `&#${m.char.codePointAt(0)};`,
                        )
                      }
                      aria-label="Copy HTML entity"
                    >
                      {ent ? `&${ent};` : `&#${m.char.codePointAt(0)};`}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
