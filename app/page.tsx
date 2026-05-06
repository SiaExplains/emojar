'use client';

import { useEffect, useMemo, useState } from 'react';
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

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Copy & Paste Emojis</h1>
        <p className="text-gray-600">All the emojis in one jar</p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <CategoryPills categories={categories} />

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
        {results.map((e, index) => (
          <SmallEmojiCard
            key={`${e.slug}-index-${index}`}
            emoji={e}
            onCopied={setCopied}
          />
        ))}
      </div>

      {copied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow">
          Copied {copied}!
        </div>
      )}
    </section>
  );
}
