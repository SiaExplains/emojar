'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import {
  SHORTCUTS,
  SHORTCUT_CATEGORIES,
  type Shortcut,
  type ShortcutApp,
  type ShortcutCategory,
  type ShortcutPlatform,
} from '@/lib/online-tools/data/keyboard-shortcuts';
import type { ToolProps } from '../ToolRenderer';
import { Chips, EmptyState, SearchBox, useCopyFlash } from './ReferenceUI';

const PLATFORMS: { value: ShortcutPlatform; label: string }[] = [
  { value: 'windows', label: 'Windows' },
  { value: 'macos', label: 'macOS' },
  { value: 'linux', label: 'Linux' },
];
const APPS: { value: 'all' | ShortcutApp; label: string }[] = [
  { value: 'all', label: 'Everything' },
  { value: 'system', label: 'System & apps' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'edge', label: 'Edge' },
  { value: 'safari', label: 'Safari' },
];
const APP_NAME: Record<ShortcutApp, string> = {
  system: '',
  chrome: 'Chrome',
  firefox: 'Firefox',
  edge: 'Edge',
  safari: 'Safari',
};

function guessPlatform(): ShortcutPlatform {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent;
  if (/Mac|iPhone|iPad/.test(ua)) return 'macos';
  if (/Linux|X11|CrOS/.test(ua) && !/Android/.test(ua)) return 'linux';
  return 'windows';
}

/** Renders “Ctrl + Shift + T or F5” as keycaps. */
function Keys({ combo }: { combo: string }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      {combo.split(' or ').map((alt, i) => (
        <span key={i} className="flex flex-wrap items-center gap-1">
          {i > 0 && <span className="px-0.5 text-xs text-gray-400">or</span>}
          {alt.split(' + ').map((k, j) => (
            <span key={j} className="flex items-center gap-1">
              {j > 0 && (
                <span className="text-xs text-gray-400" aria-hidden>
                  +
                </span>
              )}
              <kbd className="min-w-[1.75rem] rounded-md border border-gray-300 border-b-[3px] bg-white px-1.5 py-0.5 text-center font-sans text-xs font-semibold text-gray-800 shadow-sm">
                {k}
              </kbd>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function matches(s: Shortcut, q: string) {
  if (!q) return true;
  const hay = [
    s.action,
    ...(s.keywords ?? []),
    APP_NAME[s.app],
    ...Object.values(s.keys),
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export default function KeyboardShortcutsTool(_: ToolProps) {
  const [platform, setPlatform] = useState<ShortcutPlatform>(guessPlatform);
  const [app, setApp] = useState<'all' | ShortcutApp>('all');
  const [cat, setCat] = useState<'all' | ShortcutCategory>('all');
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query);
  const { copy, region } = useCopyFlash();

  const list = useMemo(
    () =>
      SHORTCUTS.filter(
        (s) =>
          s.keys[platform] &&
          (app === 'all' || s.app === app) &&
          (cat === 'all' || s.category === cat) &&
          matches(s, q.trim()),
      ),
    [platform, app, cat, q],
  );
  const groups = SHORTCUT_CATEGORIES.map((c) => ({
    ...c,
    items: list.filter((s) => s.category === c.id),
  })).filter((g) => g.items.length);

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search shortcuts"
        value={query}
        onChange={setQuery}
        placeholder="copy, screenshot, new tab, incognito, console…"
        count={list.length}
        noun="shortcut"
      />
      <div className="space-y-2">
        <Chips
          label="Platform"
          value={platform}
          onChange={setPlatform}
          options={PLATFORMS}
        />
        <Chips label="App" value={app} onChange={setApp} options={APPS} />
        <Chips
          label="Category"
          value={cat}
          onChange={setCat}
          options={[
            { value: 'all', label: 'All categories' },
            ...SHORTCUT_CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
      </div>
      {app === 'safari' && platform !== 'macos' && (
        <p className="text-sm text-amber-800">
          Safari is only available on macOS — switch the platform to macOS to
          see its shortcuts.
        </p>
      )}
      {region}
      {groups.length === 0 ? (
        <EmptyState>
          No {PLATFORMS.find((p) => p.value === platform)!.label} shortcut
          matches
          {q.trim() ? ` “${q}”` : ' these filters'}. Try another platform or a
          shorter word.
        </EmptyState>
      ) : (
        groups.map((g) => (
          <section key={g.id} aria-labelledby={`ks-${g.id}`}>
            <h2
              id={`ks-${g.id}`}
              className="mb-2 text-sm font-semibold text-gray-800"
            >
              {g.name}{' '}
              <span className="font-normal text-gray-400">
                ({g.items.length})
              </span>
            </h2>
            <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {g.items.map((s, i) => {
                const combo = s.keys[platform]!;
                return (
                  <li
                    key={`${s.app}-${s.action}-${i}`}
                    className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900">
                        {s.action}
                        {s.app !== 'system' && (
                          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                            {APP_NAME[s.app]}
                          </span>
                        )}
                      </p>
                      {s.note && (
                        <p className="text-xs text-gray-500">{s.note}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void copy(combo)}
                      aria-label={`${s.action}: ${combo}. Copy`}
                      className="shrink-0 rounded-lg p-1 text-left hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Keys combo={combo} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
