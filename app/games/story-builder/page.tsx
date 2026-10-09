'use client';

import { useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category: string;
};

const EMOJIS: EmojiItem[] = (allEmojis as EmojiItem[]).filter(
  (e) => e.char && e.name && e.category,
);

const CHAPTERS = 6;

const STORY_TEMPLATES = [
  (name: string) => `Once upon a time, there was a ${name}.`,
  (name: string) => `Suddenly, a ${name} appeared out of nowhere!`,
  (name: string) => `Our hero encountered a mysterious ${name} on the path.`,
  (name: string) =>
    `Things got interesting when a ${name} joined the adventure.`,
  (name: string) => `With the help of a ${name}, everything changed.`,
  (name: string) => `And so, they lived happily with their ${name} ever after.`,
];

const CATEGORIES_POOL = [
  'Smileys & Emotion',
  'Animals & Nature',
  'Food & Drink',
  'Travel & Places',
  'Activities',
  'Objects',
];

function pickOptions(): EmojiItem[] {
  // Pick 4 emojis from 4 different categories
  const shuffledCats = CATEGORIES_POOL.slice().sort(() => Math.random() - 0.5);
  const options: EmojiItem[] = [];
  for (const cat of shuffledCats.slice(0, 4)) {
    const pool = EMOJIS.filter((e) => e.category === cat);
    if (!pool.length) continue;
    options.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return options;
}

function buildChapterOptions(): EmojiItem[][] {
  return Array(CHAPTERS)
    .fill(null)
    .map(() => pickOptions());
}

export default function StoryBuilderPage() {
  const [chapterOptions, setChapterOptions] = useState<EmojiItem[][]>(() =>
    buildChapterOptions(),
  );
  const [picks, setPicks] = useState<(EmojiItem | null)[]>(
    Array(CHAPTERS).fill(null),
  );
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentChapter = picks.findIndex((p) => p === null);
  const allPicked = picks.every((p) => p !== null);

  function pickEmoji(chapterIdx: number, emoji: EmojiItem) {
    if (done) return;
    if (chapterIdx !== currentChapter) return;
    setPicks((prev) => {
      const next = prev.slice();
      next[chapterIdx] = emoji;
      return next;
    });
  }

  function finish() {
    setDone(true);
  }

  function reset() {
    setChapterOptions(buildChapterOptions());
    setPicks(Array(CHAPTERS).fill(null));
    setDone(false);
    setCopied(false);
  }

  async function shareStory() {
    const story = picks.map((p) => p?.char ?? '').join('');
    try {
      await navigator.clipboard.writeText(story);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="mx-auto max-w-lg p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Story Builder' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Story Builder</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pick one emoji for each chapter to build your story!
        </p>
      </div>

      {/* Story progress bar */}
      <div className="flex gap-2 justify-center">
        {picks.map((pick, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
              pick
                ? 'border-brand-400 bg-brand-50'
                : i === currentChapter && !done
                  ? 'border-dashed border-brand-300 bg-brand-50 animate-pulse'
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            {pick ? pick.char : i === currentChapter && !done ? '✍️' : ''}
          </div>
        ))}
      </div>

      {/* Chapter selection */}
      {!done && (
        <div className="space-y-4">
          {chapterOptions.map((options, ci) => {
            const picked = picks[ci];
            const isCurrent = ci === currentChapter;
            const isPast = ci < currentChapter;
            const isFuture = ci > currentChapter;

            return (
              <div
                key={ci}
                className={`rounded-xl border-2 p-3 transition-all ${
                  isCurrent
                    ? 'border-brand-400 bg-brand-50'
                    : isPast
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                }`}
              >
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Chapter {ci + 1}
                  {picked && (
                    <span className="ml-2 text-green-600">
                      — {picked.char} {picked.name}
                    </span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {options.map((opt) => (
                    <button
                      key={opt.char}
                      onClick={() => pickEmoji(ci, opt)}
                      disabled={!isCurrent}
                      className={`text-3xl p-2 rounded-xl border-2 transition-all ${
                        picked?.char === opt.char
                          ? 'border-green-400 bg-green-100'
                          : isCurrent
                            ? 'border-gray-200 bg-white hover:border-brand-400 hover:bg-brand-50 cursor-pointer active:scale-95'
                            : 'border-gray-100 bg-white cursor-default'
                      }`}
                      title={opt.name}
                    >
                      {opt.char}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Finish button */}
      {allPicked && !done && (
        <div className="text-center">
          <button
            onClick={finish}
            className="px-8 py-3 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600"
          >
            Finish My Story!
          </button>
        </div>
      )}

      {/* Story reveal */}
      {done && (
        <div className="space-y-4">
          <div className="text-center text-5xl tracking-widest py-3">
            {picks.map((p) => p?.char ?? '').join('')}
          </div>

          <div className="border rounded-2xl p-4 space-y-3 bg-gradient-to-br from-brand-50 to-violet-50">
            <h2 className="font-bold text-lg text-brand-900">
              Your Emoji Story
            </h2>
            {picks.map((pick, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-3xl shrink-0">{pick?.char}</span>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {STORY_TEMPLATES[i](pick?.name ?? 'mysterious emoji')}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={shareStory}
              className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-500 text-white hover:bg-brand-600'
              }`}
            >
              {copied ? '✓ Copied!' : 'Share Story (Copy)'}
            </button>
            <button
              onClick={reset}
              className="px-5 py-2 rounded-xl border font-semibold hover:bg-gray-50"
            >
              New Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
