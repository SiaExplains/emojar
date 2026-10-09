'use client';

import { useDeferredValue, useState } from 'react';
import {
  STATUS_CLASSES,
  searchStatuses,
} from '@/lib/online-tools/engines/http-status';
import type { ToolProps } from '../ToolRenderer';
import { Checkbox, TextField } from '../ui';
import { useCopyFlash } from './ReferenceUI';

const CLASS_STYLE: Record<number, string> = {
  1: 'bg-sky-100 text-sky-900',
  2: 'bg-emerald-100 text-emerald-900',
  3: 'bg-brand-100 text-brand-900',
  4: 'bg-amber-100 text-amber-900',
  5: 'bg-rose-100 text-rose-900',
};

export default function HttpStatusTool(_: ToolProps) {
  const [query, setQuery] = useState('');
  const [cls, setCls] = useState(0);
  const [commonOnly, setCommonOnly] = useState(false);
  const q = useDeferredValue(query);
  const list = searchStatuses(q, cls, commonOnly);
  const { copy, region } = useCopyFlash();

  // Jump to a related code even if filters currently hide it.
  const goTo = (code: number) => {
    setQuery('');
    setCls(0);
    setCommonOnly(false);
    // Wait one tick for the filters to re-render the full list.
    window.setTimeout(() => {
      const el = document.getElementById(`status-${code}`);
      el?.scrollIntoView({ block: 'start' });
      el?.focus();
    }, 0);
  };

  return (
    <div className="space-y-5">
      <TextField
        label="Search by code or name"
        value={query}
        onChange={setQuery}
        placeholder="404, redirect, timeout, rate limit…"
      />
      <Checkbox
        label="Only codes you commonly see"
        checked={commonOnly}
        onChange={setCommonOnly}
      />
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by class"
      >
        {[0, 1, 2, 3, 4, 5].map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cls === c}
            onClick={() => setCls(c)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              cls === c
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {c ? STATUS_CLASSES[c] : 'All'}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500" aria-live="polite">
        {list.length} status code{list.length === 1 ? '' : 's'}
      </p>
      {region}
      {!list.length && (
        <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          No status code matches “{q}”. Try a number like 404 or a word like
          “redirect”.
        </p>
      )}
      <ul className="space-y-2">
        {list.map((s) => (
          <li
            key={s.code}
            id={`status-${s.code}`}
            tabIndex={-1}
            className="scroll-mt-24 rounded-2xl border border-gray-100 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`rounded-lg px-2 py-0.5 font-mono text-sm font-bold ${CLASS_STYLE[Math.floor(s.code / 100)]}`}
              >
                {s.code}
              </span>
              <h2 className="text-base font-semibold text-gray-900">
                {s.name}
              </h2>
              {s.common && (
                <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                  Commonly seen
                </span>
              )}
              <span className="text-xs text-gray-400">{s.ref}</span>
              <button
                type="button"
                onClick={() => void copy(`${s.code} ${s.name}`)}
                aria-label={`Copy ${s.code} ${s.name}`}
                className="ml-auto rounded-lg border border-gray-200 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Copy
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-700">{s.meaning}</p>
            {s.usage && (
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">Typical use: </span>
                {s.usage}
              </p>
            )}
            {s.seo && (
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">SEO: </span>
                {s.seo}
              </p>
            )}
            {s.related.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                Related:
                {s.related.map((r) => (
                  <a
                    key={r}
                    href={`#status-${r}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(r);
                    }}
                    className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-gray-800 hover:bg-gray-200"
                  >
                    {r}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
