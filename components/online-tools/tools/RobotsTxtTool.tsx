'use client';

import { useMemo, useState } from 'react';
import { AI_CRAWLERS, robotsAllowed } from '@/lib/online-tools/engines/network';
import {
  buildRobotsTxt,
  type RobotsRule,
} from '@/lib/online-tools/engines/web-meta';
import type { ToolProps } from '../ToolRenderer';
import {
  TextField,
  ToolOutput,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Rule = RobotsRule & {
  id: number;
  allowText: string;
  disallowText: string;
};
let nextId = 1;
const rule = (agent: string, disallow = '', allow = ''): Rule => ({
  id: nextId++,
  agent,
  allow: [],
  disallow: [],
  allowText: allow,
  disallowText: disallow,
});

const PRESETS: Record<string, () => Rule[]> = {
  'Allow everything': () => [rule('*')],
  'Block everything': () => [rule('*', '/')],
  'Block AI crawlers': () => [rule('*'), rule(AI_CRAWLERS.join(', '), '/')],
  WordPress: () => [
    rule('*', '/wp-admin/\n/?s=\n/search/', '/wp-admin/admin-ajax.php'),
  ],
  'Hide admin & private pages': () => [
    rule('*', '/admin/\n/private/\n/cart\n/checkout'),
  ],
};

export default function RobotsTxtTool(_: ToolProps) {
  const [rules, setRules] = useState<Rule[]>(() => [rule('*', '/admin/')]);
  const [sitemaps, setSitemaps] = useState('https://example.com/sitemap.xml');
  const [testAgent, setTestAgent] = useState('Googlebot');
  const [testPath, setTestPath] = useState('/admin/settings');

  const txt = useMemo(
    () =>
      buildRobotsTxt(
        rules.map((r) => ({
          agent: r.agent,
          allow: r.allowText.split('\n'),
          disallow: r.disallowText.split('\n'),
        })),
        sitemaps.split('\n'),
      ),
    [rules, sitemaps],
  );
  const test = useMemo(
    () => robotsAllowed(txt, testAgent, testPath),
    [txt, testAgent, testPath],
  );

  const update = (id: number, patch: Partial<Rule>) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="self-center text-xs text-gray-500">Start from:</span>
        {Object.keys(PRESETS).map((name) => (
          <button
            key={name}
            type="button"
            className={btnSecondary}
            onClick={() => setRules(PRESETS[name]())}
          >
            {name}
          </button>
        ))}
      </div>

      {rules.map((r, i) => (
        <fieldset
          key={r.id}
          className="space-y-3 rounded-2xl border border-gray-100 p-4"
        >
          <legend className="px-1 text-sm font-semibold text-gray-800">
            Rule group {i + 1}
          </legend>
          <TextField
            label="User agent(s) — * means all crawlers; separate several with commas"
            value={r.agent}
            onChange={(v) => update(r.id, { agent: v })}
            mono
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {(['disallowText', 'allowText'] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <label htmlFor={`${k}-${r.id}`} className={labelBase}>
                  {k === 'disallowText'
                    ? 'Disallow (one path per line)'
                    : 'Allow (exceptions)'}
                </label>
                <textarea
                  id={`${k}-${r.id}`}
                  rows={3}
                  value={r[k]}
                  onChange={(e) => update(r.id, { [k]: e.target.value })}
                  placeholder={
                    k === 'disallowText'
                      ? '/private/\n/*.pdf$'
                      : '/private/public-page'
                  }
                  className={`${inputBase} font-mono text-[13px]`}
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
          {rules.length > 1 && (
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setRules((rs) => rs.filter((x) => x.id !== r.id))}
            >
              Remove group
            </button>
          )}
        </fieldset>
      ))}
      <button
        type="button"
        className={btnSecondary}
        onClick={() => setRules((rs) => [...rs, rule('')])}
      >
        + Add rule group
      </button>

      <div className="space-y-1.5">
        <label htmlFor="sitemaps" className={labelBase}>
          Sitemap URL(s), one per line
        </label>
        <textarea
          id="sitemaps"
          rows={2}
          value={sitemaps}
          onChange={(e) => setSitemaps(e.target.value)}
          className={`${inputBase} font-mono text-[13px]`}
          spellCheck={false}
        />
      </div>

      <ToolOutput
        label="robots.txt"
        value={txt}
        rows={10}
        filename="robots.txt"
        mime="text/plain"
      />

      <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Test a URL against these rules
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Crawler (user agent)"
            value={testAgent}
            onChange={setTestAgent}
            mono
          />
          <TextField
            label="Path"
            value={testPath}
            onChange={setTestPath}
            mono
          />
        </div>
        <p
          className={`text-sm font-medium ${test.allowed ? 'text-emerald-700' : 'text-rose-700'}`}
          aria-live="polite"
        >
          {test.allowed ? '✓ Allowed' : '✗ Blocked'} for{' '}
          {testAgent || 'this crawler'}
          <span className="font-normal text-gray-600">
            {' '}
            —{' '}
            {test.rule
              ? `matched “${test.rule}”`
              : 'no rule matches, so crawling is allowed'}{' '}
            (group: {test.group})
          </span>
        </p>
      </div>
      <p className="text-xs text-gray-500">
        robots.txt goes in the root of your site
        (https://example.com/robots.txt). It asks well-behaved crawlers not to
        fetch pages; it doesn’t hide or protect them, and a blocked page can
        still appear in search results if other sites link to it — use a noindex
        meta tag for that.
      </p>
    </div>
  );
}
