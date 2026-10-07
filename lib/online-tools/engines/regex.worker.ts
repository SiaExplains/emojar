// Runs user-supplied regular expressions off the main thread so a
// catastrophic-backtracking pattern can be killed instead of freezing the tab.

import type { RegexMatch } from './regex-client';

type Request = {
  id: number;
  pattern: string;
  flags: string;
  text: string;
  replacement: string | null;
};

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

const MAX_MATCHES = 5000;

scope.onmessage = (e) => {
  const { id, pattern, flags, text, replacement } = e.data;
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
  } catch (err) {
    scope.postMessage({
      id,
      error: err instanceof Error ? err.message : 'Invalid pattern',
    });
    return;
  }
  const matches: RegexMatch[] = [];
  const global = flags.includes('g');
  for (const m of text.matchAll(re)) {
    matches.push({
      index: m.index ?? 0,
      match: m[0],
      groups: m.slice(1),
      named: m.groups ? { ...m.groups } : null,
    });
    if (!global || matches.length >= MAX_MATCHES) break;
  }
  let replaced: string | null = null;
  if (replacement !== null) {
    replaced = text.replace(new RegExp(pattern, flags), replacement);
  }
  scope.postMessage({
    id,
    matches,
    replaced,
    truncated: matches.length >= MAX_MATCHES,
  });
};
