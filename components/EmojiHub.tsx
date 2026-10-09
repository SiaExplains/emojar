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
  {
    emoji: '🟩',
    title: 'Emoji Wordle',
    sub: 'Guess the name',
    href: '/games/emoji-wordle',
    bg: 'bg-green-50 border-green-100 hover:bg-green-100',
  },
  {
    emoji: '🏆',
    title: 'Emoji 2048',
    sub: 'Merge tiles',
    href: '/games/emoji-2048',
    bg: 'bg-amber-50 border-amber-100 hover:bg-amber-100',
  },
  {
    emoji: '🔨',
    title: 'Whack-a-Mole',
    sub: 'Tap fast!',
    href: '/games/whack-a-mole',
    bg: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100',
  },
  {
    emoji: '⚡',
    title: 'Speed Sort',
    sub: 'Categorize!',
    href: '/games/speed-sort',
    bg: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100',
  },
  {
    emoji: '📅',
    title: 'Timeline',
    sub: 'Oldest → newest',
    href: '/games/emoji-timeline',
    bg: 'bg-violet-50 border-violet-100 hover:bg-violet-100',
  },
  {
    emoji: '🎨',
    title: 'Pictionary',
    sub: 'Decode emojis',
    href: '/games/emoji-pictionary',
    bg: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
  },
  {
    emoji: '🧩',
    title: 'Missing Piece',
    sub: 'Find the emoji',
    href: '/games/missing-piece',
    bg: 'bg-teal-50 border-teal-100 hover:bg-teal-100',
  },
  {
    emoji: '📖',
    title: 'Story Builder',
    sub: 'Build your tale',
    href: '/games/story-builder',
    bg: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
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

/**
 * The emoji search & browse hub, served at /emoji. This was the homepage
 * before the site became an online-tools platform.
 */
export default function EmojiHub() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Emoji[]>([]);

  // The header search links here as /emoji?q=…; start with that query.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, []);
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

  const categoryEmojis = useMemo(() => {
    const map: Record<string, Emoji[]> = {};
    (data as Emoji[]).forEach((e) => {
      if (!map[e.category]) map[e.category] = [];
      if (map[e.category].length < 6) map[e.category].push(e);
    });
    return map;
  }, []);

  const isSearching = query.trim() !== '';
  const totalEmojis = (data as Emoji[]).length;

  return (
    <section className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/* HERO                                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="text-center space-y-5 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          Emoji Search — Copy &amp; Paste
          <br className="hidden sm:block" /> Any Emoji Instantly
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
          {totalEmojis.toLocaleString()} Unicode emojis to search and copy, 18
          games to play, and 8 free tools to create — all in one place.
        </p>

        {/* Feature pillars — visible above the fold so every visitor sees the full platform */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-1">
          <Link
            href="/categories"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-4 hover:border-amber-200 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-xs font-bold text-amber-900">
              Search &amp; Copy
            </span>
            <span className="text-xs text-amber-700 leading-tight">
              {totalEmojis.toLocaleString()} emojis · 10 categories
            </span>
          </Link>
          <Link
            href="/games"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-violet-100 bg-violet-50 px-3 py-4 hover:border-violet-200 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🎮</span>
            <span className="text-xs font-bold text-violet-900">18 Games</span>
            <span className="text-xs text-violet-700 leading-tight">
              XO · Snake · Wordle · more
            </span>
          </Link>
          <Link
            href="/emoji-tools"
            className="group flex flex-col items-center gap-1.5 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-4 hover:border-indigo-200 hover:shadow-sm transition-all"
          >
            <span className="text-2xl">🛠️</span>
            <span className="text-xs font-bold text-indigo-900">8 Tools</span>
            <span className="text-xs text-indigo-700 leading-tight">
              PNG · Cards · Kitchen · more
            </span>
          </Link>
        </div>

        {/* Free badge */}
        <p className="text-xs text-gray-400 font-medium">
          💚 Free forever · No account required · Works in your browser
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🛠️ Emoji Tools</h2>
              <Link
                href="/emoji-tools"
                className="text-sm text-blue-600 hover:underline"
              >
                See all tools →
              </Link>
            </div>

            {/* Featured tools — 2-column strip */}
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

            {/* Additional tools — 3-column grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link
                href="/emoji-favicon"
                className="group flex flex-col gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3.5 hover:bg-orange-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-semibold text-sm text-orange-900">
                    Favicon Generator
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5 leading-snug">
                    Turn any emoji into a website favicon
                  </p>
                </div>
              </Link>

              <Link
                href="/emoji-color-palette"
                className="group flex flex-col gap-2 rounded-xl border border-pink-100 bg-pink-50 px-4 py-3.5 hover:bg-pink-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold text-sm text-pink-900">
                    Color Palette
                  </p>
                  <p className="text-xs text-pink-600 mt-0.5 leading-snug">
                    Extract the colors from any emoji
                  </p>
                </div>
              </Link>

              <Link
                href="/emoji-watermark"
                className="group flex flex-col gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3.5 hover:bg-cyan-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">💧</span>
                <div>
                  <p className="font-semibold text-sm text-cyan-900">
                    Watermark Tool
                  </p>
                  <p className="text-xs text-cyan-600 mt-0.5 leading-snug">
                    Add an emoji watermark to your photo
                  </p>
                </div>
              </Link>

              <Link
                href="/emoji-card"
                className="group flex flex-col gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3.5 hover:bg-yellow-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">🃏</span>
                <div>
                  <p className="font-semibold text-sm text-yellow-900">
                    Social Card
                  </p>
                  <p className="text-xs text-yellow-600 mt-0.5 leading-snug">
                    Create a 1080×1080 shareable card
                  </p>
                </div>
              </Link>

              <Link
                href="/emoji-inspector"
                className="group flex flex-col gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3.5 hover:bg-teal-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-semibold text-sm text-teal-900">
                    Unicode Inspector
                  </p>
                  <p className="text-xs text-teal-600 mt-0.5 leading-snug">
                    Inspect any text character by character
                  </p>
                </div>
              </Link>

              <Link
                href="/emoji-kitchen"
                className="group flex flex-col gap-2 rounded-xl border border-lime-100 bg-lime-50 px-4 py-3.5 hover:bg-lime-100 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">🍳</span>
                <div>
                  <p className="font-semibold text-sm text-lime-900">
                    Emoji Kitchen
                  </p>
                  <p className="text-xs text-lime-600 mt-0.5 leading-snug">
                    Combine two emojis into one mashup
                  </p>
                </div>
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
                See all 18 →
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
          {/* CATEGORIES — directory list with emoji previews                  */}
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
            <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat] ?? {
                  icon: '📁',
                  bg: 'bg-gray-50',
                  border: 'border-gray-200',
                  text: 'text-gray-900',
                };
                const previews = categoryEmojis[cat] ?? [];
                return (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    className="group flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl shrink-0 w-7 text-center">
                      {meta.icon}
                    </span>
                    <span
                      className={`text-sm font-semibold w-36 shrink-0 ${meta.text}`}
                    >
                      {cat}
                    </span>
                    <span className="flex-1 flex gap-1 overflow-hidden">
                      {previews.map((e) => (
                        <span
                          key={e.slug}
                          className="text-lg leading-none"
                          title={e.name}
                        >
                          {e.char}
                        </span>
                      ))}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 w-20 text-right">
                      {(categoryCounts[cat] ?? 0).toLocaleString()} emojis
                    </span>
                    <span className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 ml-1">
                      →
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
          {/* BLOG — featured hero + compact list                              */}
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

            {/* Featured first post */}
            {LATEST_POSTS[0] && (
              <Link
                href={`/blog/${LATEST_POSTS[0].slug}`}
                className="group block rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-6 text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="text-5xl leading-none shrink-0 mt-0.5">
                    {LATEST_POSTS[0].emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 bg-white/20 text-white`}
                    >
                      {LATEST_POSTS[0].tag}
                    </span>
                    <p className="font-bold text-lg leading-snug">
                      {LATEST_POSTS[0].title}
                    </p>
                    <time className="text-indigo-200 text-xs mt-1 block">
                      {new Date(LATEST_POSTS[0].date).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        },
                      )}
                    </time>
                  </div>
                  <span className="text-indigo-300 group-hover:text-white transition-colors shrink-0 text-lg mt-1">
                    →
                  </span>
                </div>
              </Link>
            )}

            {/* Remaining posts as compact list */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {LATEST_POSTS.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl shrink-0">{post.emoji}</span>
                  <span
                    className={`hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${post.tagColor}`}
                  >
                    {post.tag}
                  </span>
                  <p className="flex-1 text-sm font-semibold leading-snug min-w-0 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </p>
                  <time className="text-xs text-gray-400 shrink-0">
                    {new Date(post.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0 ml-1">
                    →
                  </span>
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
