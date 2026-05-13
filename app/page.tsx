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

const GAMES = [
  { icon: '🪤', title: 'Hangman', href: '/games/hangman' },
  { icon: '🐍', title: 'Snake', href: '/games/snake' },
  { icon: '💣', title: 'Minesweeper', href: '/games/minesweeper' },
  { icon: '⭕', title: 'Tic-Tac-Toe', href: '/games/xo' },
  { icon: '🫧', title: 'Bubble Shooter', href: '/games/bubble-shooter' },
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

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    (data as Emoji[]).forEach((e) => {
      counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([cat]) => cat);
  }, []);

  const popularEmojis = useMemo(() => (data as Emoji[]).slice(0, 100), []);

  const isSearching = query.trim() !== '';

  return (
    <section className="space-y-10">
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
                href="/categories"
                className="text-sm text-blue-600 hover:underline"
              >
                Browse All Emojis →
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            {FEATURE_CARDS.map((card) => (
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
                  {'games' in card && card.games && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {card.games.map((game) => (
                        <Link
                          key={game.href}
                          href={game.href}
                          className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm hover:bg-gray-100 transition-colors"
                        >
                          <span>{game.icon}</span>
                          <span>{game.title}</span>
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

          {/* Category Quick Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">📂 Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {topCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${encodeURIComponent(cat)}`}
                  className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
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
