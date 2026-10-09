'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { diffJson, type JsonChange } from '@/lib/online-tools/engines/network';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  ToolInput,
  btnSecondary,
} from '../ui';

const A = `{
  "name": "Emojar",
  "version": "0.8.0",
  "features": ["tools", "emoji", "games"],
  "settings": { "theme": "light", "ads": true },
  "maintainers": [{ "name": "Sia", "role": "owner" }]
}`;
const B = `{
  "name": "Emojar",
  "version": "0.9.0",
  "features": ["tools", "emoji", "games", "guides"],
  "settings": { "theme": "dark" },
  "maintainers": [{ "name": "Sia", "role": "maintainer" }],
  "license": "MIT"
}`;

function parse(
  label: string,
  text: string,
): { value?: unknown; error?: string } {
  if (!text.trim()) return {};
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: `${label}: ${(e as Error).message}` };
  }
}

const show = (v: unknown) => {
  const s = JSON.stringify(v);
  return s === undefined
    ? 'undefined'
    : s.length > 120
      ? `${s.slice(0, 117)}…`
      : s;
};

const STYLE: Record<JsonChange['type'], [string, string]> = {
  added: ['bg-emerald-50 border-emerald-100', 'Added'],
  removed: ['bg-rose-50 border-rose-100', 'Removed'],
  changed: ['bg-amber-50 border-amber-100', 'Changed'],
};

export default function JsonDiffTool(_: ToolProps) {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [ignoreOrder, setIgnoreOrder] = useState(false);
  const l = useDeferredValue(left);
  const r = useDeferredValue(right);

  const { changes, error } = useMemo(() => {
    const a = parse('Original JSON', l);
    const b = parse('Changed JSON', r);
    const err = a.error ?? b.error;
    if (err || !('value' in a) || !('value' in b))
      return { changes: null, error: err ?? '' };
    return {
      changes: diffJson(a.value, b.value, { ignoreArrayOrder: ignoreOrder }),
      error: '',
    };
  }, [l, r, ignoreOrder]);

  const counts = changes
    ? (['added', 'removed', 'changed'] as const).map(
        (t) => [t, changes.filter((c) => c.type === t).length] as const,
      )
    : [];
  const report = changes
    ?.map((c) =>
      c.type === 'changed'
        ? `~ ${c.path}: ${show(c.from)} → ${show(c.to)}`
        : `${c.type === 'added' ? '+' : '-'} ${c.path}: ${show(c.value)}`,
    )
    .join('\n');

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="Original JSON"
          value={left}
          onChange={setLeft}
          rows={12}
          placeholder='{"a": 1}'
          actions={
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setLeft(A);
                setRight(B);
              }}
            >
              Load sample
            </button>
          }
        />
        <ToolInput
          label="Changed JSON"
          value={right}
          onChange={setRight}
          rows={12}
          placeholder='{"a": 2}'
          actions={
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setLeft(right);
                setRight(left);
              }}
              disabled={!left && !right}
            >
              ⇄ Swap
            </button>
          }
        />
      </div>
      <Checkbox
        label="Ignore the order of items in arrays"
        checked={ignoreOrder}
        onChange={setIgnoreOrder}
      />
      <ErrorMessage>{error}</ErrorMessage>
      {changes && (
        <div className="space-y-3" aria-live="polite">
          <div className="flex flex-wrap items-center gap-3">
            {changes.length === 0 ? (
              <p className="text-sm font-medium text-emerald-700">
                ✓ The two JSON documents are equivalent (key order and
                whitespace don’t matter).
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  {changes.length} difference{changes.length === 1 ? '' : 's'}:{' '}
                  {counts
                    .filter(([, n]) => n)
                    .map(([t, n]) => `${n} ${t}`)
                    .join(', ')}
                </p>
                <CopyButton text={report ?? ''} label="Copy report" />
              </>
            )}
          </div>
          <ul className="space-y-1.5">
            {changes.slice(0, 1000).map((c, i) => (
              <li
                key={i}
                className={`rounded-lg border px-3 py-2 font-mono text-xs ${STYLE[c.type][0]}`}
              >
                <span className="mr-2 font-sans text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {STYLE[c.type][1]}
                </span>
                <span className="font-semibold text-gray-900">{c.path}</span>
                <span className="block break-all text-gray-700">
                  {c.type === 'changed'
                    ? `${show(c.from)} → ${show(c.to)}`
                    : show(c.value)}
                </span>
              </li>
            ))}
          </ul>
          {changes.length > 1000 && (
            <p className="text-xs text-gray-500">
              Showing the first 1,000 of {changes.length} differences; Copy
              report includes all of them.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
