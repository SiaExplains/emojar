'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import data from '@/data/emojis.json';
import { btnSecondary } from '@/components/ui/styles';

type Emoji = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
};

const KITCHEN_DATES = [
  '20230522',
  '20230418',
  '20230301',
  '20230126',
  '20221107',
  '20221101',
  '20221010',
  '20220815',
  '20220406',
  '20220203',
  '20220110',
  '20211115',
  '20210831',
  '20210218',
  '20201001',
] as const;

const EXAMPLE_COMBOS: [string, string][] = [
  ['😀', '🔥'],
  ['😎', '⭐'],
  ['🥺', '💧'],
  ['🎉', '🌈'],
];

function toHex(emojiChar: string): string {
  const cp = emojiChar.codePointAt(0);
  return cp !== undefined ? cp.toString(16) : '';
}

function tryLoad(url: string): Promise<boolean> {
  return new Promise((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(true);
    img.onerror = () => res(false);
    img.src = url;
  });
}

async function findKitchenUrl(
  hex1: string,
  hex2: string,
): Promise<string | null> {
  const base = 'https://www.gstatic.com/android/keyboard/emojikitchen';
  for (const date of KITCHEN_DATES) {
    for (const [a, b] of [
      [hex1, hex2],
      [hex2, hex1],
    ] as [string, string][]) {
      const url = `${base}/${date}/u${a}/u${a}_u${b}.png`;
      if (await tryLoad(url)) return url;
    }
  }
  return null;
}

export default function EmojiKitchenPage() {
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');
  const [emojiA, setEmojiA] = useState<Emoji | null>(null);
  const [emojiB, setEmojiB] = useState<Emoji | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [focusedPicker, setFocusedPicker] = useState<'a' | 'b' | null>('a');
  const imgRef = useRef<HTMLImageElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(data as Emoji[], {
        keys: ['name', 'keywords', 'char'],
        threshold: 0.3,
      }),
    [],
  );

  const resultsA = useMemo(() => {
    if (!queryA.trim()) return (data as Emoji[]).slice(0, 48);
    return fuse.search(queryA).map((r) => r.item);
  }, [queryA, fuse]);

  const resultsB = useMemo(() => {
    if (!queryB.trim()) return (data as Emoji[]).slice(0, 48);
    return fuse.search(queryB).map((r) => r.item);
  }, [queryB, fuse]);

  const search = useCallback(async (a: Emoji, b: Emoji) => {
    setLoading(true);
    setResultUrl(null);
    setNotFound(false);
    const hex1 = toHex(a.char);
    const hex2 = toHex(b.char);
    if (!hex1 || !hex2) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    const url = await findKitchenUrl(hex1, hex2);
    setLoading(false);
    if (url) {
      setResultUrl(url);
    } else {
      setNotFound(true);
    }
  }, []);

  useEffect(() => {
    if (emojiA && emojiB) {
      search(emojiA, emojiB);
    }
  }, [emojiA, emojiB, search]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `emoji-kitchen-${emojiA?.slug ?? 'a'}-${emojiB?.slug ?? 'b'}.png`;
    a.click();
  };

  const loadExample = (charA: string, charB: string) => {
    const findEmoji = (c: string) =>
      (data as Emoji[]).find((e) => e.char === c) ?? null;
    setEmojiA(findEmoji(charA));
    setEmojiB(findEmoji(charB));
    setQueryA('');
    setQueryB('');
    setFocusedPicker(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Kitchen</h1>
        <p className="text-gray-500">
          Mix two emoji together using Google Emoji Kitchen. Search for both,
          see the mashup, and download it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left — pickers */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Picker A */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Emoji A
                </span>
                {emojiA && (
                  <span className="text-base" title={emojiA.name}>
                    {emojiA.char}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                onFocus={() => setFocusedPicker('a')}
                placeholder="Search… e.g. grinning face"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <div
                className="grid gap-1 max-h-52 overflow-y-auto rounded-xl border bg-gray-50 p-2"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                }}
              >
                {resultsA.slice(0, 96).map((e) => (
                  <button
                    key={e.slug}
                    title={e.name}
                    onClick={() => {
                      setEmojiA(e);
                      setFocusedPicker('b');
                    }}
                    className={[
                      'flex items-center justify-center rounded-lg text-xl h-10 w-10 transition-all',
                      emojiA?.slug === e.slug
                        ? 'bg-blue-600 shadow-md scale-110'
                        : 'hover:bg-white hover:shadow-sm',
                    ].join(' ')}
                  >
                    {e.char}
                  </button>
                ))}
              </div>
            </div>

            {/* Picker B */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Emoji B
                </span>
                {emojiB && (
                  <span className="text-base" title={emojiB.name}>
                    {emojiB.char}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                onFocus={() => setFocusedPicker('b')}
                placeholder="Search… e.g. fire"
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <div
                className={[
                  'grid gap-1 max-h-52 overflow-y-auto rounded-xl border p-2 transition-colors',
                  focusedPicker === 'b'
                    ? 'bg-purple-50 border-purple-200'
                    : 'bg-gray-50',
                ].join(' ')}
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                }}
              >
                {resultsB.slice(0, 96).map((e) => (
                  <button
                    key={e.slug}
                    title={e.name}
                    onClick={() => {
                      setEmojiB(e);
                      setFocusedPicker(null);
                    }}
                    className={[
                      'flex items-center justify-center rounded-lg text-xl h-10 w-10 transition-all',
                      emojiB?.slug === e.slug
                        ? 'bg-purple-600 shadow-md scale-110'
                        : 'hover:bg-white hover:shadow-sm',
                    ].join(' ')}
                  >
                    {e.char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Example combos */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_COMBOS.map(([a, b]) => (
                <button
                  key={`${a}${b}`}
                  onClick={() => loadExample(a, b)}
                  className={btnSecondary}
                >
                  <span>{a}</span>
                  <span className="text-gray-400 text-xs">+</span>
                  <span>{b}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — result */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <p className="text-sm font-semibold text-gray-700">Result</p>

            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 p-8 min-h-48">
              {loading && (
                <div className="text-center space-y-2">
                  <p className="text-3xl animate-spin">🍳</p>
                  <p className="text-sm text-gray-400">Cooking…</p>
                </div>
              )}
              {!loading && resultUrl && (
                <img
                  ref={imgRef}
                  src={resultUrl}
                  alt={`${emojiA?.name} + ${emojiB?.name} emoji kitchen`}
                  className="w-40 h-40 object-contain"
                />
              )}
              {!loading && notFound && (
                <div className="text-center space-y-2 px-4">
                  <p className="text-3xl">😞</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    This combination doesn&apos;t exist in Emoji Kitchen yet.
                    Try a different pair!
                  </p>
                </div>
              )}
              {!loading && !resultUrl && !notFound && (
                <div className="text-center space-y-2">
                  <p className="text-3xl">🍽️</p>
                  <p className="text-sm text-gray-400">Pick two emoji to mix</p>
                </div>
              )}
            </div>

            {emojiA && emojiB && (
              <div className="flex items-center justify-center gap-2 text-lg">
                <span title={emojiA.name}>{emojiA.char}</span>
                <span className="text-gray-300 text-sm">+</span>
                <span title={emojiB.name}>{emojiB.char}</span>
                <span className="text-gray-300 text-sm">=</span>
                <span>{resultUrl ? '🎉' : notFound ? '❓' : '⏳'}</span>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!resultUrl}
              className={[
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-sm',
                !resultUrl
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95',
              ].join(' ')}
            >
              ⬇️ Download Mashup
            </button>

            <p className="text-center text-xs text-gray-400">
              Powered by Google Emoji Kitchen
            </p>
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">How to use Emoji Kitchen</h2>
        <ol className="space-y-4">
          {[
            [
              '🅰️ Pick Emoji A',
              'Search or scroll to choose your first emoji. Click it to select — the picker will automatically move focus to Emoji B.',
            ],
            [
              '🅱️ Pick Emoji B',
              'Choose your second emoji from the right picker. The combination is sent to Google Emoji Kitchen as soon as both are selected.',
            ],
            [
              '🍳 Wait for the result',
              'The tool tries multiple date variants of the Emoji Kitchen API to find the best available combination image.',
            ],
            [
              '⬇️ Download',
              'If a combination exists, click Download Mashup to save the blended emoji PNG to your device.',
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
          <h2 className="text-xl font-semibold">What is Emoji Kitchen?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Emoji Kitchen is a Google product originally built into the Gboard
            keyboard app on Android. It blends two emoji together into a single
            fun mashup image — for example, a smiling face combined with a fire
            emoji creates a flaming grinning character. Google&apos;s team of
            illustrators hand-drew thousands of these combinations, covering a
            huge range of emoji pairs across multiple release dates.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Not every emoji pair has a combination — Google focused on the most
            popular and expressive emoji. If your combination shows "not found,"
            try swapping the two emoji or choosing a different pair. Popular
            starting points include face emoji (😀 😂 🥺 😎), nature emoji (🌸
            🔥 💧 ⭐), and symbol emoji (💀 👑 💯 ✨).
          </p>
        </div>
      </div>
    </div>
  );
}
