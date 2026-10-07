'use client';

import { useState } from 'react';
import { FANCY_STYLES, toFancy } from '@/lib/online-tools/engines/fancy-text';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, ToolInput } from '../ui';

export default function FancyTextTool(_: ToolProps) {
  const [text, setText] = useState('Emojar tools');
  const source = text || 'Type something';

  return (
    <div className="space-y-5">
      <ToolInput
        label="Your text"
        value={text}
        onChange={setText}
        rows={3}
        mono={false}
        placeholder="Type something…"
      />
      <ul
        className="divide-y divide-gray-100 rounded-2xl border border-gray-100"
        aria-label="Styled versions"
      >
        {FANCY_STYLES.map((s) => {
          const out = toFancy(source, s.id);
          return (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3"
            >
              <span className="w-36 shrink-0 text-xs font-medium text-gray-500">
                {s.name}
              </span>
              <span
                className="min-w-0 flex-1 break-words text-lg text-gray-900"
                lang="und"
              >
                {out}
              </span>
              <CopyButton
                text={text ? out : ''}
                className="!px-2.5 !py-1 text-xs"
              />
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-gray-500">
        Tip: use styled text for short accents — names, bios and headlines — and
        keep important information in plain text for screen readers.
      </p>
    </div>
  );
}
