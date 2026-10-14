'use client';

// Site-wide search in the header (every page except the homepage, which has
// its own big search). The tool index and Fuse.js load on first focus.

import type Fuse from 'fuse.js';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import type { SearchEntry } from '@/lib/online-tools/registry';

type Index = Fuse<SearchEntry>;
let indexPromise: Promise<Index> | null = null;

function loadIndex(): Promise<Index> {
  if (!indexPromise) {
    indexPromise = Promise.all([
      fetch('/search-index.json').then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<SearchEntry[]>;
      }),
      import('fuse.js'),
    ])
      .then(
        ([entries, { default: FuseCtor }]) =>
          new FuseCtor(entries, {
            keys: [
              { name: 'name', weight: 3 },
              { name: 'keywords', weight: 2 },
              'description',
              'category',
            ],
            threshold: 0.35,
            ignoreLocation: true,
          }),
      )
      .catch((e) => {
        indexPromise = null;
        throw e;
      });
  }
  return indexPromise;
}

const MAX = 8;

export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<Index | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const q = query.trim();
  const results =
    index && q ? index.search(q, { limit: MAX }).map((r) => r.item) : [];
  // Two extra rows after the tool results: all results and emoji search.
  const extra = q
    ? [
        {
          href: `/online-tool?q=${encodeURIComponent(q)}`,
          label: `All tool results for “${q}”`,
        },
        {
          href: `/emoji?q=${encodeURIComponent(q)}`,
          label: `Search emojis for “${q}”`,
        },
      ]
    : [];
  const rowCount = results.length + extra.length;

  const warm = () => {
    if (index || failed) return;
    loadIndex()
      .then(setIndex)
      .catch(() => setFailed(true));
  };

  // Close when navigating, clicking outside, or pressing “/” to focus.
  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
    setQuery('');
  }, [pathname]);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) &&
        !t.isContentEditable
      ) {
        e.preventDefault();
        setMobileOpen(true);
        window.setTimeout(() => input.current?.focus(), 0);
      }
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  if (pathname === '/') return null;

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (rowCount ? (a + 1) % rowCount : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (rowCount ? (a - 1 + rowCount) % rowCount : -1));
    } else if (e.key === 'Enter' && q) {
      e.preventDefault();
      const href =
        active >= 0 && active < results.length
          ? results[active].href
          : active >= results.length
            ? extra[active - results.length].href
            : extra[0].href;
      go(href);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setMobileOpen(false);
      input.current?.blur();
    }
  };

  const listId = `${id}-list`;
  const optionId = (i: number) => `${id}-opt-${i}`;
  const rowClass = (i: number) =>
    `flex items-center gap-3 px-3 py-2 text-left text-sm ${active === i ? 'bg-brand-50' : 'hover:bg-gray-50'}`;

  return (
    <div
      ref={box}
      className="min-w-0 md:relative md:mx-4 md:w-full md:max-w-sm"
    >
      <button
        type="button"
        onClick={() => {
          setMobileOpen((v) => !v);
          window.setTimeout(() => input.current?.focus(), 0);
        }}
        aria-label="Search"
        aria-expanded={mobileOpen}
        className="rounded-lg px-2 py-1 text-lg md:hidden"
      >
        🔎
      </button>
      <div
        className={`${mobileOpen ? 'absolute inset-x-0 top-full z-50 border-b bg-white p-3 shadow-sm' : 'hidden'} md:static md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        <label htmlFor={id} className="sr-only">
          Search tools
        </label>
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
          >
            🔎
          </span>
          <input
            ref={input}
            id={id}
            type="search"
            value={query}
            role="combobox"
            aria-expanded={open && !!q}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            autoComplete="off"
            placeholder="Search tools…  ( / )"
            onFocus={() => {
              warm();
              setOpen(true);
            }}
            onChange={(e) => {
              warm();
              setQuery(e.target.value);
              setActive(-1);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className="w-full rounded-full border border-transparent bg-[#f2f2f7] py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />
        </div>
        {open && q && (
          <div
            id={listId}
            role="listbox"
            aria-label="Search results"
            className="absolute inset-x-3 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white py-1 shadow-lg md:inset-x-0"
          >
            {!index && !failed && (
              <p className="px-3 py-2 text-sm text-gray-500">Loading…</p>
            )}
            {failed && (
              <p className="px-3 py-2 text-sm text-gray-500">
                Search couldn’t load — check your connection.
              </p>
            )}
            {index && results.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">
                No tool matches “{q}”.
              </p>
            )}
            {results.map((r, i) => (
              <Link
                key={r.href}
                id={optionId(i)}
                role="option"
                aria-selected={active === i}
                href={r.href}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setActive(i)}
                className={rowClass(i)}
              >
                <span aria-hidden className="text-lg">
                  {r.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-gray-900">
                    {r.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {r.category}
                  </span>
                </span>
              </Link>
            ))}
            <div className="mt-1 border-t border-gray-100 pt-1">
              {extra.map((x, k) => {
                const i = results.length + k;
                return (
                  <Link
                    key={x.href}
                    id={optionId(i)}
                    role="option"
                    aria-selected={active === i}
                    href={x.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActive(i)}
                    className={`${rowClass(i)} text-brand-700`}
                  >
                    <span aria-hidden>{k === 0 ? '🧰' : '😀'}</span>
                    {x.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
