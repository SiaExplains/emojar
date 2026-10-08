'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createRegexWorker,
  type RegexMatch,
} from '@/lib/online-tools/engines/regex-client';
import {
  explainRegex,
  type RegexToken,
} from '@/lib/online-tools/engines/regex-explain';
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

const KIND_STYLE: Partial<Record<RegexToken['kind'], string>> = {
  group: 'bg-indigo-50 text-indigo-800',
  lookaround: 'bg-purple-50 text-purple-800',
  class: 'bg-emerald-50 text-emerald-800',
  range: 'bg-emerald-50 text-emerald-800',
  'class-escape': 'bg-emerald-50 text-emerald-800',
  'unicode-property': 'bg-emerald-50 text-emerald-800',
  quantifier: 'bg-amber-50 text-amber-900',
  anchor: 'bg-rose-50 text-rose-800',
  alternation: 'bg-sky-50 text-sky-800',
  alternative: 'bg-sky-50 text-sky-800',
  backreference: 'bg-orange-50 text-orange-800',
};

const KIND_LABEL: Record<RegexToken['kind'], string> = {
  literal: 'text',
  any: 'any char',
  'class-escape': 'shorthand',
  'unicode-property': 'unicode',
  escape: 'escape',
  anchor: 'anchor',
  class: 'class',
  range: 'range',
  group: 'group',
  lookaround: 'lookaround',
  backreference: 'backref',
  quantifier: 'quantifier',
  alternation: 'or',
  alternative: 'option',
};

function TokenList({
  tokens,
  depth = 0,
}: {
  tokens: RegexToken[];
  depth?: number;
}) {
  return (
    <ul
      className={
        depth
          ? 'mt-1.5 space-y-1.5 border-l-2 border-gray-100 pl-3'
          : 'space-y-1.5'
      }
    >
      {tokens.map((t) => (
        <li key={`${t.start}-${t.end}-${t.kind}`}>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <code
              className={`max-w-full break-all rounded px-1.5 py-0.5 font-mono text-[13px] ${KIND_STYLE[t.kind] ?? 'bg-gray-100 text-gray-800'}`}
            >
              {t.raw || '(empty)'}
            </code>
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              {KIND_LABEL[t.kind]}
            </span>
            <span className="text-sm text-gray-700">{t.description}</span>
          </div>
          {t.children && t.children.length > 0 && (
            <TokenList tokens={t.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

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

  const explanation = useMemo(
    () => (pattern ? explainRegex(pattern, flags) : null),
    [pattern, flags],
  );
  // Column headers for the match table: group number plus name when it has one.
  const groupCols =
    explanation?.ok && explanation.groups.length
      ? explanation.groups
      : (result?.matches[0]?.groups ?? []).map((_, i) => ({
          number: i + 1,
          name: null,
        }));

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
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">
                  Matches with their positions and capture groups
                </caption>
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th scope="col" className="px-2 py-1.5 font-medium">
                      #
                    </th>
                    <th scope="col" className="px-2 py-1.5 font-medium">
                      Index (start–end)
                    </th>
                    <th scope="col" className="px-2 py-1.5 font-medium">
                      Match
                    </th>
                    {groupCols.map((g) => (
                      <th
                        key={g.number}
                        scope="col"
                        className="whitespace-nowrap px-2 py-1.5 font-medium"
                      >
                        ${g.number}
                        {g.name ? ` ${g.name}` : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {result.matches.slice(0, 100).map((m, i) => (
                    <tr key={i} className="border-t border-gray-100 align-top">
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="whitespace-nowrap px-2 py-1 tabular-nums">
                        {m.index}–{m.index + m.match.length}
                      </td>
                      <td className="break-all px-2 py-1">
                        {m.match === '' ? (
                          <span className="text-gray-400">(empty)</span>
                        ) : (
                          m.match
                        )}
                      </td>
                      {groupCols.map((g) => {
                        const v = m.groups[g.number - 1];
                        return (
                          <td key={g.number} className="break-all px-2 py-1">
                            {v === undefined ? (
                              <span
                                className="text-gray-400"
                                aria-label="not matched"
                              >
                                —
                              </span>
                            ) : (
                              v
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.matches.length > 100 && (
                <p className="border-t border-gray-100 px-2 py-1.5 text-xs text-gray-500">
                  Showing the first 100 matches.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {explanation && (
        <section
          aria-labelledby="regex-breakdown"
          className="space-y-3 rounded-2xl border border-gray-100 p-4"
        >
          <h2
            id="regex-breakdown"
            className="text-sm font-semibold text-gray-900"
          >
            Pattern breakdown
          </h2>
          {explanation.ok ? (
            <>
              {explanation.tokens.length ? (
                <TokenList tokens={explanation.tokens} />
              ) : (
                <p className="text-sm text-gray-500">
                  The empty pattern matches at every position.
                </p>
              )}
              {explanation.flags.length > 0 && (
                <ul className="space-y-0.5 border-t border-gray-100 pt-2 text-xs text-gray-600">
                  {explanation.flags.map((f) => (
                    <li key={f}>
                      <span className="font-mono">{f.slice(0, 1)}</span>
                      {f.slice(1)}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-sm text-red-700">
              Can’t break down an invalid pattern: {explanation.error}
            </p>
          )}
        </section>
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
