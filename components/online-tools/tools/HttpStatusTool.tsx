'use client';

import { useDeferredValue, useState } from 'react';
import {
  STATUS_CLASSES,
  searchStatuses,
} from '@/lib/online-tools/engines/http-status';
import type { ToolProps } from '../ToolRenderer';
import { TextField } from '../ui';

const CLASS_STYLE: Record<number, string> = {
  1: 'bg-sky-100 text-sky-900',
  2: 'bg-emerald-100 text-emerald-900',
  3: 'bg-indigo-100 text-indigo-900',
  4: 'bg-amber-100 text-amber-900',
  5: 'bg-rose-100 text-rose-900',
};

export default function HttpStatusTool(_: ToolProps) {
  const [query, setQuery] = useState('');
  const [cls, setCls] = useState(0);
  const q = useDeferredValue(query);
  const list = searchStatuses(q, cls);

  return (
    <div className="space-y-5">
      <TextField
        label="Search by code or name"
        value={query}
        onChange={setQuery}
        placeholder="404, redirect, timeout, rate limit…"
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
      <ul className="space-y-2">
        {list.map((s) => (
          <li
            key={s.code}
            id={`status-${s.code}`}
            className="scroll-mt-24 rounded-2xl border border-gray-100 p-4"
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
              <span className="text-xs text-gray-400">{s.ref}</span>
            </div>
            <p className="mt-1 text-sm text-gray-700">{s.meaning}</p>
            {s.seo && (
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">SEO: </span>
                {s.seo}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
