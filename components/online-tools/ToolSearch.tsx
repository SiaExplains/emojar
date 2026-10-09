'use client';

import Fuse from 'fuse.js';
import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';
import type { SearchEntry } from '@/lib/online-tools/registry';

/**
 * Filters the tools rendered on the page. The full server-rendered lists stay
 * in the HTML for crawlers; this only adds a results panel while typing.
 */
export function ToolSearch({
  entries,
  placeholder = 'Search tools… e.g. “jpg to png”, “json”, “password”',
  syncUrl = false,
  autoFocus = false,
}: {
  entries: SearchEntry[];
  placeholder?: string;
  syncUrl?: boolean;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState('');
  const id = useId();

  useEffect(() => {
    if (!syncUrl) return;
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, [syncUrl]);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: 'name', weight: 3 },
          { name: 'keywords', weight: 2 },
          'description',
          'category',
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [entries],
  );
  const results = useMemo(
    () =>
      query.trim()
        ? fuse
            .search(query.trim())
            .slice(0, 12)
            .map((r) => r.item)
        : [],
    [fuse, query],
  );

  return (
    <div className="mx-auto w-full max-w-xl text-left">
      <label htmlFor={id} className="sr-only">
        Search tools
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        >
          🔎
        </span>
        <input
          id={id}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-controls={`${id}-results`}
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div id={`${id}-results`} aria-live="polite">
        {query.trim() && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">
                No tools match “{query}”.
              </p>
            ) : (
              <ul className="max-h-96 divide-y divide-gray-50 overflow-auto">
                {results.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <span aria-hidden className="text-xl">
                        {r.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-gray-900">
                          {r.name}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {r.category} · {r.description}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
