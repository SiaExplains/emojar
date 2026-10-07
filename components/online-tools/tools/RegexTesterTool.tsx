'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createRegexWorker,
  type RegexMatch,
} from '@/lib/online-tools/engines/regex-client';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, TextField, ToolInput, inputBase } from '../ui';

const FLAGS = [
  { id: 'g', label: 'global' },
  { id: 'i', label: 'ignore case' },
  { id: 'm', label: 'multiline' },
  { id: 's', label: 'dotAll' },
  { id: 'u', label: 'unicode' },
];

const TIMEOUT_MS = 1500;

type Result = {
  matches: RegexMatch[];
  replaced: string | null;
  truncated: boolean;
};

export default function RegexTesterTool(_: ToolProps) {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+)\\.com');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState(
    'Contact ada@example.com or alan@test.com for details.',
  );
  const [replacement, setReplacement] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const workerRef = useRef<Worker | null>(null);
  const idRef = useRef(0);

  useEffect(() => () => workerRef.current?.terminate(), []);

  useEffect(() => {
    if (!pattern) {
      setResult(null);
      setError('');
      return;
    }
    const id = ++idRef.current;
    const handle = window.setTimeout(() => {
      if (!workerRef.current) workerRef.current = createRegexWorker();
      const worker = workerRef.current;
      const timeout = window.setTimeout(() => {
        // The pattern is stuck (catastrophic backtracking): kill and replace the worker.
        worker.terminate();
        workerRef.current = null;
        if (id === idRef.current) {
          setResult(null);
          setError(
            `The pattern took longer than ${TIMEOUT_MS / 1000}s and was stopped. It probably causes catastrophic backtracking — try making nested quantifiers more specific.`,
          );
        }
      }, TIMEOUT_MS);
      worker.onmessage = (
        e: MessageEvent<{ id: number; error?: string } & Partial<Result>>,
      ) => {
        if (e.data.id !== idRef.current) return;
        window.clearTimeout(timeout);
        if (e.data.error) {
          setResult(null);
          setError(
            `Invalid regular expression: ${e.data.error.replace(/^Invalid regular expression: /, '')}`,
          );
        } else {
          setError('');
          setResult({
            matches: e.data.matches ?? [],
            replaced: e.data.replaced ?? null,
            truncated: !!e.data.truncated,
          });
        }
      };
      worker.postMessage({
        id,
        pattern,
        flags,
        text,
        replacement: replacement ? replacement : null,
      });
    }, 120);
    return () => window.clearTimeout(handle);
  }, [pattern, flags, text, replacement]);

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, '') : cur + f));

  // Build highlighted segments from match positions.
  const segments: { text: string; hit: boolean }[] = [];
  if (result) {
    let pos = 0;
    for (const m of result.matches) {
      if (m.index > pos)
        segments.push({ text: text.slice(pos, m.index), hit: false });
      if (m.match) segments.push({ text: m.match, hit: true });
      pos = Math.max(pos, m.index + m.match.length);
    }
    segments.push({ text: text.slice(pos), hit: false });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="regex-pattern"
          className="block text-sm font-medium text-gray-700"
        >
          Regular expression
        </label>
        <div className="flex items-center gap-1 font-mono">
          <span className="text-gray-400">/</span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            className={`${inputBase} font-mono`}
          />
          <span className="text-gray-400">/{flags}</span>
        </div>
      </div>
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Flags</legend>
        {FLAGS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={flags.includes(f.id)}
            onClick={() => toggleFlag(f.id)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${flags.includes(f.id) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {f.id} <span className="font-sans">{f.label}</span>
          </button>
        ))}
      </fieldset>

      <ToolInput label="Test string" value={text} onChange={setText} rows={6} />
      <ErrorMessage>{error}</ErrorMessage>

      {result && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600" aria-live="polite">
            {result.matches.length === 0
              ? 'No matches.'
              : `${result.matches.length}${result.truncated ? '+' : ''} match${result.matches.length === 1 ? '' : 'es'}`}
          </p>
          <div className="whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[13px]">
            {segments.map((s, i) =>
              s.hit ? (
                <mark key={i} className="rounded bg-amber-200 px-0.5">
                  {s.text}
                </mark>
              ) : (
                <span key={i}>{s.text}</span>
              ),
            )}
          </div>
          {result.matches.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-gray-500">
                  <tr>
                    <th className="py-1 pr-3 font-medium">#</th>
                    <th className="py-1 pr-3 font-medium">Index</th>
                    <th className="py-1 pr-3 font-medium">Match</th>
                    <th className="py-1 font-medium">Groups</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {result.matches.slice(0, 100).map((m, i) => (
                    <tr key={i} className="border-t border-gray-100 align-top">
                      <td className="py-1 pr-3">{i + 1}</td>
                      <td className="py-1 pr-3">{m.index}</td>
                      <td className="py-1 pr-3 break-all">{m.match}</td>
                      <td className="py-1 break-all">
                        {m.named
                          ? Object.entries(m.named)
                              .map(([k, v]) => `${k}: ${v ?? '—'}`)
                              .join(', ')
                          : m.groups
                              .map((g, gi) => `$${gi + 1}: ${g ?? '—'}`)
                              .join(', ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <TextField
        label="Replace with (optional)"
        value={replacement}
        onChange={setReplacement}
        mono
        placeholder="e.g. $1 at $2"
      />
      {result?.replaced != null && (
        <div
          className="whitespace-pre-wrap break-words rounded-xl border border-gray-200 bg-white p-3 font-mono text-[13px]"
          aria-label="Replacement result"
        >
          {result.replaced}
        </div>
      )}
    </div>
  );
}
