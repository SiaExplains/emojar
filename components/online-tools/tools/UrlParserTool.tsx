'use client';

import { useMemo, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Param = { id: number; key: string; value: string };

const SAMPLE =
  'https://shop.example.com:8443/search/results?q=red+shoes&size=42&sort=price_asc&utm_source=newsletter&utm_medium=email#reviews';

let nextId = 1;

/** Decodes percent-escapes for display; a stray % (100%/off) stays as-is. */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function splitUrl(raw: string) {
  const url = new URL(raw.trim());
  const params: Param[] = [];
  url.searchParams.forEach((value, key) =>
    params.push({ id: nextId++, key, value }),
  );
  return { url, params };
}

export default function UrlParserTool(_: ToolProps) {
  const [raw, setRaw] = useState('');
  const [params, setParams] = useState<Param[]>([]);
  const [error, setError] = useState('');

  const load = (text: string) => {
    setRaw(text);
    if (!text.trim()) {
      setParams([]);
      setError('');
      return;
    }
    try {
      setParams(splitUrl(text).params);
      setError('');
    } catch {
      setError(
        'That isn’t a complete URL — include the scheme, like https://example.com/page.',
      );
    }
  };

  const parsed = useMemo(() => {
    try {
      return raw.trim() ? new URL(raw.trim()) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const built = useMemo(() => {
    if (!parsed) return '';
    const u = new URL(parsed.href);
    const sp = new URLSearchParams();
    for (const p of params) if (p.key) sp.append(p.key, p.value);
    u.search = sp.toString();
    return u.href;
  }, [parsed, params]);

  const update = (id: number, patch: Partial<Param>) =>
    setParams((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const move = (i: number, d: number) =>
    setParams((ps) => {
      const j = i + d;
      if (j < 0 || j >= ps.length) return ps;
      const next = [...ps];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const parts: [string, string][] = parsed
    ? [
        ['Protocol', parsed.protocol],
        ['Username', safeDecode(parsed.username)],
        ['Password', parsed.password ? '••••••' : ''],
        ['Host name', parsed.hostname],
        [
          'Port',
          parsed.port ||
            ({ 'https:': '443 (default)', 'http:': '80 (default)' }[
              parsed.protocol
            ] ??
              ''),
        ],
        ['Origin', parsed.origin === 'null' ? '' : parsed.origin],
        ['Path', safeDecode(parsed.pathname)],
        ['Query string', parsed.search],
        ['Fragment (hash)', safeDecode(parsed.hash)],
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="url-in" className={labelBase}>
            URL
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => load(SAMPLE)}
            >
              Load sample
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => load('')}
              disabled={!raw}
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          id="url-in"
          rows={3}
          value={raw}
          onChange={(e) => load(e.target.value)}
          spellCheck={false}
          placeholder="https://example.com/path?key=value#section"
          className={`${inputBase} font-mono text-[13px]`}
        />
      </div>
      <ErrorMessage>{error}</ErrorMessage>

      {parsed && (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">URL parts</caption>
              <tbody className="divide-y divide-gray-100">
                {parts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <tr key={k}>
                      <th
                        scope="row"
                        className="w-1/3 px-4 py-2 font-normal text-gray-600"
                      >
                        {k}
                      </th>
                      <td className="break-all px-4 py-2 font-mono text-[13px] text-gray-900">
                        {v}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Query parameters ({params.length}) — edit to build a new URL
            </h2>
            {params.map((p, i) => (
              <div key={p.id} className="flex flex-wrap items-center gap-2">
                <input
                  aria-label={`Parameter ${i + 1} name`}
                  value={p.key}
                  onChange={(e) => update(p.id, { key: e.target.value })}
                  className={`${inputBase} w-40 flex-none font-mono`}
                  placeholder="key"
                />
                <span className="text-gray-400">=</span>
                <input
                  aria-label={`Parameter ${i + 1} value`}
                  value={p.value}
                  onChange={(e) => update(p.id, { value: e.target.value })}
                  className={`${inputBase} min-w-0 flex-1 font-mono`}
                  placeholder="value"
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() => move(i, 1)}
                    disabled={i === params.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      setParams((ps) => ps.filter((x) => x.id !== p.id))
                    }
                    aria-label={`Remove ${p.key || 'parameter'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() =>
                  setParams((ps) => [
                    ...ps,
                    { id: nextId++, key: '', value: '' },
                  ])
                }
              >
                + Add parameter
              </button>
              {params.some((p) => /^utm_|^fbclid$|^gclid$/.test(p.key)) && (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() =>
                    setParams((ps) =>
                      ps.filter((p) => !/^utm_|^fbclid$|^gclid$/.test(p.key)),
                    )
                  }
                >
                  Remove tracking (utm_, gclid, fbclid)
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={labelBase}>Built URL</span>
              <CopyButton text={built} />
            </div>
            <p className="break-all rounded-xl border border-gray-100 bg-gray-50 p-3 font-mono text-[13px] text-gray-900">
              {built}
            </p>
            <p className="text-xs text-gray-500">
              Values are percent-encoded for you (spaces become +, & becomes
              %26). The host name is shown in its punycode form if it contains
              non-ASCII characters.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
