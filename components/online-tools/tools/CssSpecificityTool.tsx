'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  analyzeSelectors,
  compareSpecificity,
  formatSpecificity,
  rankEntries,
  type SelectorPart,
  type SpecificityEntry,
} from '@/lib/online-tools/engines/css-specificity';
import type { ToolProps } from '../ToolRenderer';
import { Notice, ToolInput, btnSecondary } from '../ui';

const EXAMPLES: Record<string, string> = {
  Basics: [
    '#app .card:hover > button',
    '.nav a',
    'ul li:first-child',
    'a[href^="https"]::after',
    '.btn.btn-primary',
  ].join('\n'),
  'Level 4': [
    ':is(#main, .content) p',
    ':where(#main, .content) p',
    'li:not(.done, #pinned)',
    'figure:has(> img.wide)',
    'li:nth-child(2n+1 of .visible)',
  ].join('\n'),
  'Which wins?': [
    '.card .title',
    'div.card h2',
    'h2.title',
    '.card .title',
  ].join('\n'),
};

const CAT = [
  {
    key: 0,
    letter: 'A',
    name: 'IDs',
    chip: 'border-rose-300 bg-rose-50 text-rose-900',
    mark: 'bg-rose-100 text-rose-900 underline decoration-rose-500 decoration-2',
    block: 'bg-rose-500',
  },
  {
    key: 1,
    letter: 'B',
    name: 'Classes, attributes & pseudo-classes',
    chip: 'border-amber-300 bg-amber-50 text-amber-900',
    mark: 'bg-amber-100 text-amber-900 underline decoration-amber-500 decoration-dotted decoration-2',
    block: 'bg-amber-500',
  },
  {
    key: 2,
    letter: 'C',
    name: 'Elements & pseudo-elements',
    chip: 'border-sky-300 bg-sky-50 text-sky-900',
    mark: 'bg-sky-100 text-sky-900 underline decoration-sky-500 decoration-wavy decoration-1',
    block: 'bg-sky-500',
  },
] as const;

const KIND_LABEL: Record<SelectorPart['kind'], string> = {
  id: 'ID',
  class: 'class',
  attribute: 'attribute',
  'pseudo-class': 'pseudo-class',
  'pseudo-element': 'pseudo-element',
  type: 'element',
  universal: 'universal (counts 0)',
  combinator: 'combinator (counts 0)',
  nesting: 'nesting & (counts 0 here)',
};

/** Category a part mostly belongs to, for colouring: its highest non-zero column. */
const mainCategory = (p: SelectorPart) => p.specificity.findIndex((n) => n > 0);

function Highlighted({ e }: { e: SpecificityEntry }) {
  const out: ReactNode[] = [];
  let at = 0;
  e.parts.forEach((p, i) => {
    if (p.start > at) out.push(e.selector.slice(at, p.start));
    const c = mainCategory(p);
    out.push(
      <span
        key={i}
        className={`rounded px-0.5 ${c >= 0 ? CAT[c].mark : 'text-gray-500'}`}
        title={`${KIND_LABEL[p.kind]} ${formatSpecificity(p.specificity)}`}
      >
        {p.text}
      </span>,
    );
    at = p.end;
  });
  if (at < e.selector.length) out.push(e.selector.slice(at));
  return <code className="break-all font-mono text-sm leading-7">{out}</code>;
}

function Blocks({ n, cls }: { n: number; cls: string }) {
  const shown = Math.min(n, 10);
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: shown }, (_, i) => (
        <span key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
      ))}
      {n > 10 && <span className="text-xs text-gray-500">+{n - 10}</span>}
    </span>
  );
}

function EntryCard({ e, wins }: { e: SpecificityEntry; wins: boolean }) {
  const s = e.specificity;
  return (
    <li className="space-y-3 rounded-2xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">Line {e.line}</p>
          {s ? (
            <Highlighted e={e} />
          ) : (
            <code className="break-all font-mono text-sm">{e.selector}</code>
          )}
        </div>
        {s && (
          <div className="text-right">
            <p className="font-mono text-2xl font-bold tabular-nums text-gray-900">
              {formatSpecificity(s)}
            </p>
            {wins && (
              <p className="text-xs font-semibold text-emerald-700">
                ★ Most specific
              </p>
            )}
          </div>
        )}
      </div>
      {e.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          ⚠ {e.error}
        </p>
      ) : (
        s && (
          <div className="grid gap-2 sm:grid-cols-3">
            {CAT.map((c) => {
              const parts = e.parts.filter((p) => p.specificity[c.key] > 0);
              return (
                <div key={c.key} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-700">
                    {c.letter} · {c.name}:{' '}
                    <span className="text-base tabular-nums">{s[c.key]}</span>
                  </p>
                  {parts.length ? (
                    <ul className="mt-1.5 flex flex-wrap gap-1">
                      {parts.map((p, i) => (
                        <li
                          key={i}
                          className={`rounded-md border px-1.5 py-0.5 font-mono text-xs ${c.chip}`}
                          title={p.note}
                        >
                          {p.text}
                          {p.specificity[c.key] > 1 &&
                            ` ×${p.specificity[c.key]}`}
                          <span className="sr-only">
                            {' '}
                            ({KIND_LABEL[p.kind]})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">none</p>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
      {e.parts.some((p) => p.note) && (
        <ul className="space-y-1 text-xs text-gray-600">
          {e.parts
            .filter((p) => p.note)
            .map((p, i) => (
              <li key={i}>
                <code className="font-mono text-gray-900">{p.text}</code> —{' '}
                {p.note}
              </li>
            ))}
        </ul>
      )}
    </li>
  );
}

export default function CssSpecificityTool(_: ToolProps) {
  const [input, setInput] = useState(EXAMPLES.Basics);
  const entries = useMemo(() => analyzeSelectors(input), [input]);
  const ranked = useMemo(() => rankEntries(entries), [entries]);
  const top = ranked[0];
  const tiedWithTop = top
    ? ranked.filter(
        (x) => compareSpecificity(x.e.specificity, top.e.specificity) === 0,
      ).length
    : 0;
  const errors = entries.filter((e) => e.error).length;

  return (
    <div className="space-y-6">
      <ToolInput
        label="Selectors — one per line (comma-separated lists are split)"
        value={input}
        onChange={setInput}
        rows={6}
        placeholder="#app .card:hover > button"
        actions={
          <>
            {Object.keys(EXAMPLES).map((k) => (
              <button
                key={k}
                type="button"
                className={btnSecondary}
                onClick={() => setInput(EXAMPLES[k])}
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput('')}
            >
              Clear
            </button>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 text-xs text-gray-700" aria-hidden>
        {CAT.map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1.5">
            <span className={`rounded px-1 font-mono ${c.mark}`}>
              {c.letter}
            </span>
            {c.name}
          </span>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {entries.length
          ? `${entries.length} selector${entries.length === 1 ? '' : 's'}${errors ? `, ${errors} with errors` : ''}.${top ? ` Most specific: ${top.e.selector} ${formatSpecificity(top.e.specificity)}.` : ''}`
          : 'No selectors.'}
      </p>

      {!entries.length ? (
        <Notice>Type a selector such as #app .card:hover &gt; button.</Notice>
      ) : (
        <>
          {ranked.length > 1 && (
            <section className="space-y-3 rounded-2xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Ranking — most specific first
              </h2>
              <ol className="space-y-2">
                {ranked.map(({ e }, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[1.75rem_1fr] items-start gap-2 sm:grid-cols-[1.75rem_1fr_auto_auto] sm:items-center"
                  >
                    <span className="text-sm font-bold tabular-nums text-gray-500">
                      {i + 1}.
                    </span>
                    <code className="min-w-0 break-all font-mono text-sm text-gray-900">
                      {e.selector}
                      <span className="ml-1 text-xs text-gray-400">
                        (line {e.line})
                      </span>
                    </code>
                    <span className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto">
                      {CAT.map((c) => (
                        <Blocks
                          key={c.key}
                          n={e.specificity[c.key]}
                          cls={c.block}
                        />
                      ))}
                    </span>
                    <span className="col-start-2 font-mono text-sm font-semibold tabular-nums sm:col-start-auto">
                      {formatSpecificity(e.specificity)}
                      {i === 0 && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 font-sans text-xs text-emerald-800">
                          wins
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              {tiedWithTop > 1 && (
                <p className="text-xs text-gray-600">
                  {tiedWithTop} selectors tie for the highest specificity. When
                  they match the same element, the rule written later in the
                  stylesheet wins — here that is the one on line {top?.e.line}.
                </p>
              )}
              <p className="text-xs text-gray-500">
                Columns are compared left to right: one ID beats any number of
                classes, and one class beats any number of elements. Inline
                styles and !important sit above all of these.
              </p>
            </section>
          )}
          <ul className="space-y-3">
            {entries.map((e, i) => (
              <EntryCard
                key={i}
                e={e}
                wins={ranked.length > 1 && !!top && top.e === e}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
