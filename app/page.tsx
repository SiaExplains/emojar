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

const CATEGORIES = [
  {
    icon: '😀',
    title: 'Smileys & Emotion',
    href: '/category/Smileys%20%26%20Emotion',
  },
  { icon: '👥', title: 'People & Body', href: '/category/People%20%26%20Body' },
  {
    icon: '🐾',
    title: 'Animals & Nature',
    href: '/category/Animals%20%26%20Nature',
  },
  { icon: '🍕', title: 'Food & Drink', href: '/category/Food%20%26%20Drink' },
  {
    icon: '✈️',
    title: 'Travel & Places',
    href: '/category/Travel%20%26%20Places',
  },
  { icon: '⚽', title: 'Activities', href: '/category/Activities' },
  { icon: '💡', title: 'Objects', href: '/category/Objects' },
  { icon: '♾️', title: 'Symbols', href: '/category/Symbols' },
];

const GAMES = [
  { icon: '🪤', title: 'Hangman', href: '/games/hangman' },
  { icon: '🐍', title: 'Snake', href: '/games/snake' },
  { icon: '💣', title: 'Minesweeper', href: '/games/minesweeper' },
  { icon: '⭕', title: 'Tic-Tac-Toe', href: '/games/xo' },
  { icon: '🫧', title: 'Bubble Shooter', href: '/games/bubble-shooter' },
  { icon: '🚩', title: 'Guess the Flag', href: '/games/guess-the-flag' },
];

const FEATURE_CARDS = [
  {
    icon: '🎮',
    title: 'Emoji Games',
    detail:
      'Put your emoji knowledge to the test with a growing collection of mini-games. Guess the hidden emoji in Hangman, dodge walls in Snake, or carefully flag mines in Minesweeper — every game is emoji-themed and playable right in your browser.',
    href: '/games',
    cta: 'Play games →',
    games: GAMES,
  },
  {
    icon: '📂',
    title: 'Browse Categories',
    detail:
      'Every one of the 3,600+ emojis is sorted into groups — Smileys & Emotion, Animals & Nature, Food & Drink, Travel & Places, and more. Tap any category to jump straight to the emojis you need.',
    href: '/categories',
    cta: 'Explore categories →',
    categories: CATEGORIES,
  },
  {
    icon: '🔤',
    title: 'A–Z Sorted',
    detail:
      "Browse the entire emoji library in strict alphabetical order. Handy when you remember part of an emoji name but can't find it in search — just scan the list and copy with one click.",
    href: '/sorted/alphabet',
    cta: 'Browse A–Z →',
  },
  {
    icon: '📖',
    title: 'Blog',
    detail:
      'Dig into emoji culture with articles about origin stories, trending combos, creative use-cases, and tips for getting the most out of every emoji. New posts added regularly.',
    href: '/blog',
    cta: 'Read articles →',
    latestPosts: [
      {
        title: 'Emoji Collections for Every Holiday & Event',
        date: '2026-05-14',
        description:
          'Curated emoji packs for 15 major holidays — New Year, Halloween, Christmas, Diwali, and more. Copy a single emoji or the whole set.',
        href: '/blog/emoji-events-collection',
      },
      {
        title: "Odd One Out — Spot the Emoji That Doesn't Belong",
        date: '2026-05-14',
        description:
          "Five emojis, four share a theme — one doesn't fit. A new emoji logic game with 50+ curated rounds.",
        href: '/blog/odd-one-out-game',
      },
      {
        title: "What's New on Emojar — May 2026 Updates",
        date: '2026-05-13',
        description:
          'Games, category breadcrumbs, a refreshed homepage, and more — here is everything that landed on Emojar this month.',
        href: '/blog/emojar-may-2026-updates',
      },
    ],
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Emoji[]>(data as Emoji[]);
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
    if (!query.trim()) {
      setResults(data as Emoji[]);
    } else {
      const r = fuse.search(query).map((x) => x.item as Emoji);
      setResults(r);
    }
  }, [query, fuse]);

  const categories = useMemo(() => {
    const s = new Set((data as Emoji[]).map((e) => e.category));
    return Array.from(s).sort();
  }, []);

  const popularEmojis = useMemo(() => (data as Emoji[]).slice(0, 100), []);

  const isSearching = query.trim() !== '';

  const gamesCard = FEATURE_CARDS[0];
  const otherCards = FEATURE_CARDS.slice(1);

  return (
    <section className="space-y-10">
      {/* Emoji Games — frameless strip above the fold */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <span>{gamesCard.icon}</span>
          <span className="font-semibold">{gamesCard.title}</span>
          <span className="text-gray-400 text-sm">
            — play free in your browser
          </span>
        </div>
        {'games' in gamesCard && gamesCard.games && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {gamesCard.games.map((game) => (
              <Link
                key={game.href}
                href={game.href}
                className="flex flex-col items-center gap-0.5 rounded-lg bg-gray-50 border hover:bg-gray-100 hover:shadow-sm transition-all py-2 px-1"
              >
                <span className="text-2xl">{game.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {game.title}
                </span>
              </Link>
            ))}
          </div>
        )}
        <div className="text-right mt-1.5">
          <Link
            href={gamesCard.href}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            {gamesCard.cta}
          </Link>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Copy &amp; Paste Emojis</h1>
        <p className="text-gray-600">All the emojis in one jar 🫙</p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <CategoryPills categories={categories} />

      {isSearching ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
          {results.map((e, index) => (
            <SmallEmojiCard
              key={`${e.slug}-index-${index}`}
              emoji={e}
              onCopied={setCopied}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Popular Emojis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">⭐ Popular Emojis</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
              {popularEmojis.map((e, index) => (
                <SmallEmojiCard
                  key={`${e.slug}-popular-${index}`}
                  emoji={e}
                  onCopied={setCopied}
                />
              ))}
            </div>
            <div className="text-right">
              <Link
                href="/sorted/detail"
                className="text-sm text-blue-600 hover:underline"
              >
                Browse All Emojis →
              </Link>
            </div>
          </div>

          {/* Remaining Feature Cards */}
          <div className="space-y-4">
            {otherCards.map((card) => (
              <div
                key={card.href}
                className="border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <span className="text-4xl shrink-0">{card.icon}</span>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-lg font-semibold">{card.title}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.detail}
                  </p>
                  {'categories' in card && card.categories && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {card.categories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm hover:bg-gray-100 transition-colors"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {'latestPosts' in card && card.latestPosts && (
                    <div className="mt-1 flex flex-col gap-2">
                      {card.latestPosts.map((post) => (
                        <Link
                          key={post.href}
                          href={post.href}
                          className="block rounded-lg border bg-gray-50 p-3 hover:bg-gray-100 transition-colors"
                        >
                          <time className="text-xs text-gray-400 uppercase tracking-wide">
                            {new Date(post.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </time>
                          <p className="mt-0.5 text-sm font-semibold leading-snug">
                            {post.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {post.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href={card.href}
                    className="text-sm font-medium text-blue-600 hover:underline self-start"
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {copied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow">
          Copied {copied}!
        </div>
      )}
    </section>
  );
}
