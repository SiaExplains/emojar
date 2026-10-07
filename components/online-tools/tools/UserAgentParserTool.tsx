'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { parseUserAgent } from '@/lib/online-tools/engines/device';
import { detectBot } from '@/lib/online-tools/engines/network';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, btnSecondary, inputBase, labelBase } from '../ui';

const EXAMPLES: [string, string][] = [
  [
    'Googlebot',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  ],
  [
    'iPhone Safari',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  ],
  [
    'Edge on Windows',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.2849.56',
  ],
  [
    'Samsung Internet',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
  ],
  ['curl', 'curl/8.4.0'],
];

export default function UserAgentParserTool(_: ToolProps) {
  const [ua, setUa] = useState('');
  useEffect(() => setUa(navigator.userAgent), []);

  const results = useMemo(
    () =>
      ua
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 50)
        .map((line) => ({
          line,
          parsed: parseUserAgent(line),
          bot: detectBot(line),
        })),
    [ua],
  );

  const csv = [
    'user_agent,browser,version,engine,os,os_version,device,bot',
    ...results.map(({ line, parsed: p, bot }) =>
      [
        line,
        p.browser,
        p.browserVersion,
        p.engine,
        p.os,
        p.osVersion,
        p.device,
        bot?.name ?? '',
      ]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="ua-in" className={labelBase}>
            User agent string(s) — one per line, up to 50
          </label>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setUa(navigator.userAgent)}
          >
            Use mine
          </button>
        </div>
        <textarea
          id="ua-in"
          rows={4}
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          spellCheck={false}
          className={`${inputBase} font-mono text-[13px]`}
          placeholder="Mozilla/5.0 (…)"
        />
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-500">Examples:</span>
          {EXAMPLES.map(([name, value]) => (
            <button
              key={name}
              type="button"
              onClick={() => setUa(value)}
              className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-700 hover:bg-gray-50"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {results.map(({ line, parsed: p, bot }, i) => (
        <div
          key={i}
          className="space-y-2 rounded-2xl border border-gray-100 p-4"
        >
          {results.length > 1 && (
            <p className="break-all font-mono text-xs text-gray-500">{line}</p>
          )}
          {bot && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              🤖 <strong>{bot.name}</strong> · {bot.kind}. Anyone can send this
              string — verify real search-engine bots with a reverse DNS lookup.
            </p>
          )}
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ['Browser', `${p.browser} ${p.browserVersion}`.trim()],
              ['Engine', p.engine],
              ['Operating system', `${p.os} ${p.osVersion}`.trim()],
              ['Device type', bot ? 'Bot' : p.device],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-gray-50 p-3">
                <dt className="text-xs text-gray-500">{k}</dt>
                <dd className="text-sm font-semibold text-gray-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {results.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton text={csv} label="Copy as CSV" />
          <span className="text-xs text-gray-500">
            Want the exact details of this device, including Client Hints? Use{' '}
            <Link
              href="/online-tool/device-tests/what-is-my-browser"
              className="text-indigo-600 underline underline-offset-2"
            >
              What Is My Browser
            </Link>
            .
          </span>
        </div>
      )}
    </div>
  );
}
