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

const FEATURE_CARDS = [
  {
    icon: '🎮',
    title: 'Emoji Games',
    description: 'Hangman, Snake, Minesweeper & more',
    href: '/games',
  },
  {
    icon: '📂',
    title: 'Browse Categories',
    description: 'Explore emojis by category',
    href: '/categories',
  },
  {
    icon: '🔤',
    title: 'A–Z Sorted',
    description: 'Browse all emojis alphabetically',
    href: '/sorted/alphabet',
  },
  {
    icon: '📖',
    title: 'Blog',
    description: 'Articles, tips & emoji culture',
    href: '/blog',
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {FEATURE_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col gap-1"
                >
                  <span className="text-3xl">{card.icon}</span>
                  <span className="font-semibold">{card.title}</span>
                  <span className="text-sm text-gray-500">
                    {card.description}
                  </span>
                </Link>
              ))}
            </div>
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
