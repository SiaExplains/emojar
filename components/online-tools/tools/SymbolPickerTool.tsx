'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  SYMBOL_GROUPS,
  codePointLabel,
  cssEscape,
  htmlEntity,
  searchSymbols,
} from '@/lib/online-tools/engines/symbols';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, TextField, btnSecondary } from '../ui';

type Picked = { char: string; name: string };

export default function SymbolPickerTool({ config }: ToolProps) {
  const initial = String(config.init_group ?? 'all');
  const [group, setGroup] = useState(
    SYMBOL_GROUPS.some((g) => g.id === initial) ? initial : 'all',
  );
  const [query, setQuery] = useState('');
  const [tray, setTray] = useState('');
  const [picked, setPicked] = useState<Picked | null>(null);
  const [flash, setFlash] = useState('');
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  const q = useDeferredValue(query);
  const results = useMemo(() => searchSymbols(q, group), [q, group]);
  const total = results.reduce((n, g) => n + g.symbols.length, 0);

  const pick = async (s: Picked) => {
    setPicked(s);
    setTray((t) => t + s.char);
    let msg = `Copied ${s.char}`;
    try {
      await navigator.clipboard.writeText(s.char);
    } catch {
      msg = `Added ${s.char} to the tray`;
    }
    setFlash(msg);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(''), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          label="Search symbols"
          value={query}
          onChange={setQuery}
          placeholder="arrow, check, euro, degree, U+2713…"
          className="min-w-[220px] flex-1"
        />
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Symbol groups"
      >
        {[{ id: 'all', name: 'All' }, ...SYMBOL_GROUPS].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id)}
            aria-pressed={group === g.id}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              group === g.id
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="sticky top-2 z-10 space-y-2 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor="symbol-tray"
            className="text-xs font-medium text-gray-600"
          >
            Your symbols
          </label>
          <input
            id="symbol-tray"
            value={tray}
            onChange={(e) => setTray(e.target.value)}
            placeholder="Click symbols to collect them here"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-lg"
          />
          <CopyButton text={tray} label="Copy all" />
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setTray('')}
            disabled={!tray}
          >
            Clear
          </button>
        </div>
        <p className="min-h-[1.25rem] text-xs text-gray-600" aria-live="polite">
          {flash ||
            (picked
              ? `${picked.char} ${picked.name} · ${codePointLabel(picked.char)} · HTML ${htmlEntity(picked.char)} · CSS ${cssEscape(picked.char)}`
              : 'Click a symbol to copy it. It is also added to the tray above.')}
        </p>
      </div>

      {total === 0 ? (
        <p className="text-sm text-gray-500">
          No symbols match “{q}”. Try a shorter word, or the{' '}
          <Link
            href="/emoji"
            className="text-brand-600 underline underline-offset-2"
          >
            emoji search
          </Link>
          .
        </p>
      ) : (
        results.map((g) => (
          <section key={g.id} aria-labelledby={`sym-${g.id}`}>
            <h2
              id={`sym-${g.id}`}
              className="mb-2 text-sm font-semibold text-gray-800"
            >
              {g.name}{' '}
              <span className="font-normal text-gray-400">
                ({g.symbols.length})
              </span>
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
              {g.symbols.map((s) => (
                <li key={s.char}>
                  <button
                    type="button"
                    onClick={() => void pick(s)}
                    title={`${s.name} (${codePointLabel(s.char)})`}
                    aria-label={`Copy ${s.name}`}
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-gray-100 bg-white text-xl text-gray-900 transition hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    {s.char}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
