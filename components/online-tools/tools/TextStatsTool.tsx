'use client';

import { useMemo, useState } from 'react';
import { textStats } from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import { ToolInput, btnSecondary } from '../ui';

const LIMITS = [
  { name: 'X / Twitter post', max: 280 },
  { name: 'SMS (1 message, GSM)', max: 160 },
  { name: 'Meta description', max: 160 },
  { name: 'Instagram caption', max: 2200 },
  { name: 'LinkedIn post', max: 3000 },
];

function minutes(m: number) {
  if (m === 0) return '0 sec';
  if (m < 1) return `${Math.max(1, Math.round(m * 60))} sec`;
  const whole = Math.floor(m);
  const sec = Math.round((m - whole) * 60);
  return sec ? `${whole} min ${sec} sec` : `${whole} min`;
}

export default function TextStatsTool({ config }: ToolProps) {
  const focus = String(config.focus ?? 'words');
  const [text, setText] = useState('');
  const s = useMemo(() => textStats(text), [text]);

  const primary =
    focus === 'characters'
      ? [
          { label: 'Characters', value: s.characters },
          { label: 'Without spaces', value: s.charactersNoSpaces },
          { label: 'Words', value: s.words },
          { label: 'Letters', value: s.letters },
        ]
      : focus === 'sentences'
        ? [
            { label: 'Sentences', value: s.sentences },
            { label: 'Paragraphs', value: s.paragraphs },
            {
              label: 'Words per sentence',
              value: s.sentences
                ? Math.round((s.words / s.sentences) * 10) / 10
                : 0,
            },
            { label: 'Words', value: s.words },
          ]
        : [
            { label: 'Words', value: s.words },
            { label: 'Characters', value: s.characters },
            { label: 'Sentences', value: s.sentences },
            { label: 'Paragraphs', value: s.paragraphs },
          ];

  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
        {primary.map((p, i) => (
          <div
            key={p.label}
            className={`rounded-2xl border px-4 py-3 ${i === 0 ? 'border-indigo-100 bg-indigo-50' : 'border-gray-100 bg-gray-50'}`}
          >
            <dt className="text-xs font-medium text-gray-500">{p.label}</dt>
            <dd
              className={`text-2xl font-bold tabular-nums ${i === 0 ? 'text-indigo-900' : 'text-gray-900'}`}
            >
              {p.value.toLocaleString('en-US')}
            </dd>
          </div>
        ))}
      </dl>

      <ToolInput
        label="Your text"
        value={text}
        onChange={setText}
        rows={12}
        mono={false}
        placeholder="Start typing or paste your text here…"
        actions={
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setText('')}
            disabled={!text}
          >
            Clear
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 p-4 text-sm">
          <h3 className="mb-2 font-semibold text-gray-900">More details</h3>
          <ul className="space-y-1 text-gray-600">
            <li>
              Characters without spaces:{' '}
              {s.charactersNoSpaces.toLocaleString('en-US')}
            </li>
            <li>Lines: {s.lines.toLocaleString('en-US')}</li>
            <li>Reading time: {minutes(s.readingTimeMin)}</li>
            <li>Speaking time: {minutes(s.speakingTimeMin)}</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-100 p-4 text-sm">
          {focus === 'characters' ? (
            <>
              <h3 className="mb-2 font-semibold text-gray-900">
                Common limits
              </h3>
              <ul className="space-y-1">
                {LIMITS.map((l) => (
                  <li
                    key={l.name}
                    className={
                      s.characters > l.max ? 'text-red-700' : 'text-gray-600'
                    }
                  >
                    {l.name}: {s.characters.toLocaleString('en-US')} /{' '}
                    {l.max.toLocaleString('en-US')}{' '}
                    {s.characters > l.max ? '— over limit' : ''}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className="mb-2 font-semibold text-gray-900">
                Most used words
              </h3>
              {s.topWords.length ? (
                <ol className="flex flex-wrap gap-1.5">
                  {s.topWords.map((w) => (
                    <li
                      key={w.word}
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                    >
                      {w.word} <span className="text-gray-400">×{w.count}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-400">
                  Type some text to see keyword frequency.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
