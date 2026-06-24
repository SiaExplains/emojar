'use client';

import { useMemo, useState } from 'react';
import data from '@/data/emojis.json';

type EmojiData = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
  version?: string;
};

type CharInfo = {
  char: string;
  codepoint: string;
  name: string;
  category: string;
  version: string;
  bytes: number;
  isEmoji: boolean;
};

const emojiMap = new Map<string, EmojiData>(
  (data as EmojiData[]).map((e) => [e.char, e]),
);

type IntlSegmenter = { segment(text: string): Iterable<{ segment: string }> };

function segmentText(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const SegmenterCtor = (
      Intl as unknown as {
        Segmenter: new (locale: string, opts: object) => IntlSegmenter;
      }
    ).Segmenter;
    const seg = new SegmenterCtor('en', { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function analyzeText(text: string): CharInfo[] {
  const segments = segmentText(text);
  return segments.map((seg) => {
    const cp = seg.codePointAt(0);
    const codepoint =
      cp !== undefined
        ? `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
        : 'U+????';
    const emojiEntry = emojiMap.get(seg);
    const bytes = new TextEncoder().encode(seg).length;
    return {
      char: seg,
      codepoint,
      name: emojiEntry
        ? emojiEntry.name
        : seg.trim() === ''
          ? 'Whitespace'
          : 'Unknown',
      category: emojiEntry ? emojiEntry.category : 'Text',
      version: emojiEntry?.version ?? '—',
      bytes,
      isEmoji: Boolean(emojiEntry),
    };
  });
}

export default function EmojiInspectorPage() {
  const [inputText, setInputText] = useState('Hello 👋 World 🌍✨');

  const chars = useMemo(() => analyzeText(inputText), [inputText]);

  const totalEmojis = chars.filter((c) => c.isEmoji).length;
  const totalBytes = chars.reduce((sum, c) => sum + c.bytes, 0);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Unicode Inspector</h1>
        <p className="text-gray-500">
          Paste any text to inspect each character — Unicode codepoints, names,
          categories, emoji version, and byte sizes.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">
            Paste or type text
          </label>
          <button
            onClick={() => setInputText('')}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          placeholder="Paste emoji, text, or a mix… e.g. Hello 👋"
          className="w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        />

        {/* Stats */}
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Characters', value: chars.length },
            { label: 'Emojis', value: totalEmojis },
            { label: 'Total bytes', value: totalBytes },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-gray-50 px-4 py-2 flex gap-3 items-baseline"
            >
              <span className="text-xl font-bold">{s.value}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      {chars.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Char
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Codepoint
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                  Version
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Bytes
                </th>
              </tr>
            </thead>
            <tbody>
              {chars.map((c, i) => (
                <tr
                  key={i}
                  className={[
                    'border-b last:border-0 transition-colors',
                    c.isEmoji ? 'hover:bg-yellow-50' : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  <td className="px-4 py-3">
                    <span className="text-2xl leading-none">{c.char}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {c.codepoint}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {c.category}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {c.version}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{c.bytes}B</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">
          How to use the Unicode Inspector
        </h2>
        <ol className="space-y-4">
          {[
            [
              '📋 Paste your text',
              'Type or paste any text into the input box — emoji, plain text, or a mixture of both. The analysis updates instantly as you type.',
            ],
            [
              '🔍 Read the table',
              'Each row shows one grapheme (visual character). The table shows the raw character, its Unicode codepoint, name, category, emoji version (if applicable), and UTF-8 byte size.',
            ],
            [
              '🧮 Check the stats',
              'The summary line shows total character count, how many are emoji, and total byte count — useful for API limits, database column sizes, or SMS encoding checks.',
            ],
            [
              '🗑️ Clear and repeat',
              'Hit the Clear button to start fresh with new text.',
            ],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex gap-4">
              <span className="text-lg">{(title as string).split(' ')[0]}</span>
              <div>
                <p className="font-semibold text-sm">
                  {(title as string).split(' ').slice(1).join(' ')}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">{desc as string}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold">Why inspect emoji Unicode?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Emoji are notoriously tricky for developers. A single visible emoji
            can be composed of multiple Unicode codepoints joined by zero-width
            joiners (ZWJ). For example, the family emoji 👨‍👩‍👧 is actually five
            separate codepoints joined together, yet it displays as one
            character. This makes it essential to understand the difference
            between string length (codepoints), grapheme count (visible
            characters), and byte count (storage size) — they can differ by
            orders of magnitude.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            This tool uses the{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">
              Intl.Segmenter
            </code>{' '}
            API (with an{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">
              Array.from()
            </code>{' '}
            fallback) to correctly split text into grapheme clusters, giving you
            accurate per-character analysis. It is especially useful when
            debugging truncation bugs, validating form field lengths, working
            with SMS character limits, or understanding emoji version
            compatibility across platforms.
          </p>
        </div>
      </div>
    </div>
  );
}
