'use client';

import { useMemo, useState } from 'react';
import {
  MAX_DIFF_CELLS,
  diffLines,
  diffWords,
  type DiffPart,
} from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, SelectField, ToolInput, btnSecondary } from '../ui';

export default function TextDiffTool(_: ToolProps) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [mode, setMode] = useState<'lines' | 'words'>('lines');

  const result = useMemo(():
    | { parts: DiffPart[] }
    | { error: string }
    | null => {
    if (!a && !b) return null;
    const size =
      mode === 'lines'
        ? a.split('\n').length * b.split('\n').length
        : a.split(/\s+/).length * b.split(/\s+/).length * 4;
    if (size > MAX_DIFF_CELLS)
      return {
        error:
          'These texts are too large to compare in word mode. Switch to line mode or compare smaller sections.',
      };
    return { parts: mode === 'lines' ? diffLines(a, b) : diffWords(a, b) };
  }, [a, b, mode]);

  const stats =
    result && 'parts' in result
      ? {
          added: result.parts.filter((p) => p.type === 'added').length,
          removed: result.parts.filter((p) => p.type === 'removed').length,
        }
      : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <ToolInput
          label="Original text"
          value={a}
          onChange={setA}
          rows={10}
          placeholder="Paste the original version…"
        />
        <ToolInput
          label="Changed text"
          value={b}
          onChange={setB}
          rows={10}
          placeholder="Paste the new version…"
        />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Compare by"
          value={mode}
          onChange={(v) => setMode(v as 'lines' | 'words')}
          options={[
            { value: 'lines', label: 'Lines' },
            { value: 'words', label: 'Words' },
          ]}
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setA(b);
            setB(a);
          }}
        >
          ⇄ Swap
        </button>
        {stats && (
          <p className="pb-2 text-sm text-gray-600" aria-live="polite">
            <span className="text-emerald-700">+{stats.added} added</span> ·{' '}
            <span className="text-red-700">−{stats.removed} removed</span>
            {stats.added + stats.removed === 0 && ' — the texts are identical.'}
          </p>
        )}
      </div>
      {result && 'error' in result && (
        <ErrorMessage>{result.error}</ErrorMessage>
      )}
      {result && 'parts' in result && (
        <div
          className="max-h-[480px] overflow-auto rounded-xl border border-gray-200 bg-white p-3 font-mono text-[13px] leading-relaxed"
          aria-label="Differences"
        >
          {mode === 'lines' ? (
            result.parts.map((p, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap break-words px-2 ${p.type === 'added' ? 'bg-emerald-50 text-emerald-900' : p.type === 'removed' ? 'bg-red-50 text-red-900 line-through decoration-red-300' : 'text-gray-700'}`}
              >
                <span aria-hidden className="mr-2 select-none text-gray-400">
                  {p.type === 'added' ? '+' : p.type === 'removed' ? '−' : ' '}
                </span>
                {p.type !== 'equal' && (
                  <span className="sr-only">
                    {p.type === 'added' ? 'Added: ' : 'Removed: '}
                  </span>
                )}
                {p.value || ' '}
              </div>
            ))
          ) : (
            <p className="whitespace-pre-wrap break-words">
              {result.parts.map((p, i) =>
                p.type === 'equal' ? (
                  <span key={i}>{p.value}</span>
                ) : p.type === 'added' ? (
                  <ins
                    key={i}
                    className="rounded bg-emerald-100 text-emerald-900 no-underline"
                  >
                    {p.value}
                  </ins>
                ) : (
                  <del key={i} className="rounded bg-red-100 text-red-900">
                    {p.value}
                  </del>
                ),
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
