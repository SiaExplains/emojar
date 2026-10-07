'use client';

import { useState } from 'react';
import {
  CASE_STYLES,
  convertCase,
  type CaseStyle,
} from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import { ToolInput, ToolOutput } from '../ui';

export default function TextCaseTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<CaseStyle>('title');
  const output = text ? convertCase(text, style) : '';

  return (
    <div className="space-y-4">
      <ToolInput
        label="Your text"
        value={text}
        onChange={setText}
        rows={7}
        mono={false}
        placeholder="Type or paste text to convert…"
      />
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">
          Convert to
        </legend>
        <div className="flex flex-wrap gap-2">
          {CASE_STYLES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={style === c.id}
              onClick={() => setStyle(c.id)}
              className={`rounded-xl border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                style === c.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>
      <ToolOutput
        label="Result"
        value={output}
        rows={7}
        mono={false}
        filename="converted.txt"
      />
    </div>
  );
}
