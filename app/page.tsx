'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import data from '@/data/emojis.json';
import SmallEmojiCard from '@/components/SmallEmojiCard';
import SearchBar from '@/components/SearchBar';
import CategoryPills from '@/components/CategoryPills';

export type Emoji = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
  version?: string;
};

// ---------------------------------------------------------------------------
// Static data for below-fold sections
// ---------------------------------------------------------------------------

const ALL_GAMES = [
  {
    emoji: '⭕',
    title: 'XO',
    sub: 'Tic-Tac-Toe',
    href: '/games/xo',
    bg: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
  },
  {
    emoji: '🐍',
    title: 'Snake',
    sub: 'Eat the fruit',
    href: '/games/snake',
    bg: 'bg-green-50 border-green-100 hover:bg-green-100',
  },
  {
    emoji: '💣',
    title: 'Minesweeper',
    sub: 'Clear the field',
    href: '/games/minesweeper',
    bg: 'bg-slate-50 border-slate-100 hover:bg-slate-100',
  },
  {
    emoji: '🪤',
    title: 'Hangman',
    sub: 'Guess the name',
    href: '/games/hangman',
    bg: 'bg-amber-50 border-amber-100 hover:bg-amber-100',
  },
  {
    emoji: '🫧',
    title: 'Bubble Shooter',
    sub: 'Pop to win',
    href: '/games/bubble-shooter',
    bg: 'bg-sky-50 border-sky-100 hover:bg-sky-100',
  },
  {
    emoji: '🚩',
    title: 'Guess the Flag',
    sub: 'Country quiz',
    href: '/games/guess-the-flag',
    bg: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
  },
  {
    emoji: '🧩',
    title: 'Emoji Puzzle',
    sub: 'Memory match',
    href: '/games/emoji-puzzle',
    bg: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
  },
  {
    emoji: '⏳',
    title: 'Older or Newer',
    sub: 'Emoji history',
    href: '/games/older-or-newer',
    bg: 'bg-orange-50 border-orange-100 hover:bg-orange-100',
  },
  {
    emoji: '🐾',
    title: 'Guess the Animal',
    sub: 'Animal quiz',
    href: '/games/guess-the-animal',
    bg: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100',
  },
  {
    emoji: '🎯',
    title: 'Odd One Out',
    sub: 'Logic & trivia',
    href: '/games/odd-one-out',
    bg: 'bg-red-50 border-red-100 hover:bg-red-100',
  },
];

const CATEGORY_META: Record<
  string,
  { icon: string; bg: string; border: string; text: string }
> = {
  'Smileys & Emotion': {
    icon: '😀',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
  },
  'People & Body': {
    icon: '👋',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
  },
  'Animals & Nature': {
    icon: '🐾',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
  },
  'Food & Drink': {
    icon: '🍕',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
  },
  'Travel & Places': {
    icon: '✈️',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-900',
  },
  Activities: {
    icon: '⚽',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-900',
  },
  Objects: {
    icon: '💡',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-900',
  },
  Symbols: {
    icon: '♾️',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-900',
  },
  Flags: {
    icon: '🚩',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
  },
  Component: {
    icon: '🎨',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
  },
};

const LATEST_POSTS = [
  {
    slug: 'emoji-to-png-download',
    title: 'Download Any Emoji as a PNG',
    date: '2026-06-19',
    tag: 'New Tool',
    tagColor: 'bg-indigo-100 text-indigo-700',
    emoji: '🖼️',
  },
  {
    slug: 'find-your-emoji-personality',
    title: 'Find Your Emoji Personality',
    date: '2026-05-25',
    tag: 'Quiz',
    tagColor: 'bg-violet-100 text-violet-700',
    emoji: '🪞',
  },
  {
    slug: 'emoji-events-collection',
    title: 'Emoji Collections for Every Holiday',
    date: '2026-05-14',
    tag: 'Collection',
    tagColor: 'bg-amber-100 text-amber-700',
    emoji: '🎉',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Emoji[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: ['name', 'keywords', 'char'],
        threshold: 0.3,
        includeScore: false,
      }),
    [],
  );

  useEffect(() => {
    if (query.trim()) {
      setSearchResults(fuse.search(query).map((x) => x.item as Emoji));
    } else {
      setSearchResults([]);
    }
  }, [query, fuse]);

  const categories = useMemo(() => {
    const s = new Set((data as Emoji[]).map((e) => e.category));
    return Array.from(s).sort();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (data as Emoji[]).forEach((e) => {
      counts[e.category] = (counts[e.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  const popularEmojis = useMemo(() => (data as Emoji[]).slice(0, 120), []);

  const isSearching = query.trim() !== '';
  const totalEmojis = (data as Emoji[]).length;

  return (
    <section className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="text-center space-y-4 pt-2">
        {/* Stats strip */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-400 font-medium">
          <span>✨ {totalEmojis.toLocaleString()} emojis</span>
          <span aria-hidden>·</span>
          <span>📂 {categories.length} categories</span>
          <span aria-hidden>·</span>
          <span>🎮 10 games</span>
          <span aria-hidden>·</span>
          <span>🛠️ 2 tools</span>
          <span aria-hidden>·</span>
          <span>💚 Free forever</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          Copy &amp; Paste Any Emoji,
          <br className="hidden sm:block" /> Instantly
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
          Search {totalEmojis.toLocaleString()}+ emojis, copy with one tap. Plus
          games, tools, and collections — all free.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SEARCH + CATEGORY PILLS                                             */}
      {/* ------------------------------------------------------------------ */}
      <SearchBar value={query} onChange={setQuery} />
      <CategoryPills categories={categories} />

      {/* ------------------------------------------------------------------ */}
      {/* EMOJI GRID  (search results OR popular)                             */}
      {/* ------------------------------------------------------------------ */}
      {isSearching ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            {searchResults.length === 0
              ? `No results for "${query}"`
              : `${searchResults.length.toLocaleString()} result${searchResults.length === 1 ? '' : 's'} for "${query}"`}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
            {searchResults.map((e, i) => (
              <SmallEmojiCard
                key={`${e.slug}-sr-${i}`}
                emoji={e}
                onCopied={setCopied}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Popular emojis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">⭐ Popular Emojis</h2>
              <Link
                href="/collection/detail"
                className="text-sm text-blue-600 hover:underline"
              >
                Browse all {totalEmojis.toLocaleString()} →
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
              {popularEmojis.map((e, i) => (
                <SmallEmojiCard
                  key={`${e.slug}-pop-${i}`}
                  emoji={e}
                  onCopied={setCopied}
                />
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* ---------------------------------------------------------------- */}
          {/* EMOJI TOOLS                                                       */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">🛠️ Emoji Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/emoji-to-png"
                className="group flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-violet-600 to-indigo-600 px-5 py-4 text-white shadow-sm transition-all hover:from-violet-500 hover:to-indigo-500"
              >
                <span className="text-3xl shrink-0">🖼️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Emoji to PNG</p>
                  <p className="text-violet-200 text-xs mt-0.5">
                    Download any emoji as a high-quality image
                  </p>
                </div>
                <span className="text-violet-300 transition-colors group-hover:text-white shrink-0">
                  →
                </span>
              </Link>

              <Link
                href="/personality"
                className="group flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-700 px-5 py-4 text-white shadow-sm transition-all hover:from-gray-800 hover:to-gray-600"
              >
                <span className="text-3xl shrink-0">🪞</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    Emoji Personality Quiz
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    12 questions → discover your 5 emoji matches
                  </p>
                </div>
                <span className="text-gray-500 transition-colors group-hover:text-white shrink-0">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* GAMES — all 10                                                    */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🎮 Emoji Games</h2>
              <Link
                href="/games"
                className="text-sm text-blue-600 hover:underline"
              >
                See all 10 →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {ALL_GAMES.map((game) => (
                <Link
                  key={game.href}
                  href={game.href}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border ${game.bg} px-3 py-3.5 text-center transition-all hover:shadow-sm`}
                >
                  <span className="text-3xl">{game.emoji}</span>
                  <span className="font-semibold text-sm leading-tight">
                    {game.title}
                  </span>
                  <span className="text-xs text-gray-400">{game.sub}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* CATEGORIES — all 10 with colors + counts                         */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">📂 Browse by Category</h2>
              <Link
                href="/categories"
                className="text-sm text-blue-600 hover:underline"
              >
                All categories →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat] ?? {
                  icon: '📁',
                  bg: 'bg-gray-50',
                  border: 'border-gray-200',
                  text: 'text-gray-900',
                };
                return (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    className={`flex flex-col gap-1 rounded-xl border ${meta.bg} ${meta.border} px-3 py-3 transition-all hover:shadow-sm`}
                  >
                    <span className="text-2xl">{meta.icon}</span>
                    <span
                      className={`text-xs font-semibold leading-tight ${meta.text}`}
                    >
                      {cat}
                    </span>
                    <span className="text-xs text-gray-400">
                      {(categoryCounts[cat] ?? 0).toLocaleString()} emojis
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* HOLIDAY COLLECTIONS                                               */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🎉 Emoji Collections</h2>
              <Link
                href="/emoji-collections/events"
                className="text-sm text-blue-600 hover:underline"
              >
                All 15 collections →
              </Link>
            </div>
            <Link
              href="/emoji-collections/events"
              className="group flex items-center gap-5 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-fuchsia-50 px-6 py-5 transition-all hover:shadow-md"
            >
              <div className="shrink-0 text-4xl sm:text-5xl tracking-wide select-none leading-none">
                🌈❤️🧡💛💚💙💜
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-purple-900">
                  Holiday &amp; Event Collections
                </p>
                <p className="text-sm text-purple-600 mt-1 leading-relaxed">
                  15 curated emoji packs — New Year, Valentine&apos;s, Pride,
                  Halloween, Christmas, Diwali &amp; more. Copy the whole set in
                  one tap.
                </p>
              </div>
              <span className="text-purple-300 transition-colors group-hover:text-purple-600 shrink-0 text-lg">
                →
              </span>
            </Link>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BROWSE MORE                                                       */}
          {/* ---------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/collection/alphabet"
              className="flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3.5 hover:bg-gray-100 hover:shadow-sm transition-all"
            >
              <span className="text-2xl shrink-0">🔤</span>
              <div>
                <p className="font-semibold text-sm">A–Z Browse</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  All emojis in alphabetical order
                </p>
              </div>
            </Link>
            <Link
              href="/collection/detail"
              className="flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3.5 hover:bg-gray-100 hover:shadow-sm transition-all"
            >
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <p className="font-semibold text-sm">Detail View</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Names, categories &amp; metadata visible
                </p>
              </div>
            </Link>
            <Link
              href="/table/emoji-alphabet-shaped"
              className="flex items-center gap-3 rounded-xl border bg-gray-50 px-4 py-3.5 hover:bg-gray-100 hover:shadow-sm transition-all"
            >
              <span className="text-2xl shrink-0">🅰️</span>
              <div>
                <p className="font-semibold text-sm">Letter-Shaped Emojis</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Emojis that look like A–Z
                </p>
              </div>
            </Link>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BLOG                                                              */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">📖 From the Blog</h2>
              <Link
                href="/blog"
                className="text-sm text-blue-600 hover:underline"
              >
                All posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LATEST_POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 rounded-xl border bg-white px-4 py-4 hover:bg-gray-50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{post.emoji}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.tagColor}`}
                    >
                      {post.tag}
                    </span>
                  </div>
                  <p className="font-semibold text-sm leading-snug group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </p>
                  <time className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Copy toast */}
      {copied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg">
          Copied {copied}!
        </div>
      )}
    </section>
  );
}
