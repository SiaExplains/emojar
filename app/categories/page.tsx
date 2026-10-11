import Link from 'next/link';
import type { Metadata } from 'next';
import data from '@/data/emojis.json';
import { ogImages } from '@/lib/og';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Emoji Categories | Emojar',
  description:
    'Browse 3,700+ emojis by category — Smileys & Emotion, Animals & Nature, Food & Drink, Travel & Places, Activities, Objects, Symbols, Flags, and more.',
  alternates: { canonical: 'https://emojar.com/categories' },
  openGraph: {
    title: 'Emoji Categories | Emojar',
    description:
      'Browse 3,700+ emojis by category — Smileys & Emotion, Animals & Nature, Food & Drink, and more.',
    url: 'https://emojar.com/categories',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '📂',
      'Emoji Categories',
      'Browse 3,700+ emojis by category — Smileys & Emotion, Animals & Nature, Food & Drink, and more.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Categories | Emojar',
    description:
      'Browse 3,700+ emojis by category — Smileys & Emotion, Animals & Nature, Food & Drink, and more.',
    images: ogImages(
      '📂',
      'Emoji Categories',
      'Browse 3,700+ emojis by category — Smileys & Emotion, Animals & Nature, Food & Drink, and more.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

const CATEGORY_META: Record<string, { description: string; icon: string }> = {
  'Smileys & Emotion': {
    icon: '😀',
    description:
      'Faces, gestures, and feelings — from wide grins to angry frowns, love hearts to skull-and-crossbones. The go-to category for expressing mood in any message.',
  },
  'People & Body': {
    icon: '👤',
    description:
      'People of all ages, genders, skin tones, and roles — plus individual body parts like hands, eyes, and ears. The largest category with over 2,200 emojis including family and couple variations.',
  },
  'Animals & Nature': {
    icon: '🐾',
    description:
      'Mammals, birds, reptiles, insects, plants, weather, and natural phenomena. From household pets to exotic wildlife and everything the natural world has to offer.',
  },
  'Food & Drink': {
    icon: '🍕',
    description:
      "Fruits, vegetables, cooked dishes, snacks, beverages, and condiments. Whether you're planning a meal, reviewing a restaurant, or just craving something sweet — it's in here.",
  },
  'Travel & Places': {
    icon: '✈️',
    description:
      'Transport of every kind — planes, trains, cars, boats, and rockets — plus buildings, landmarks, maps, and natural landscapes from mountains to beaches.',
  },
  Activities: {
    icon: '⚽',
    description:
      'Sports, games, hobbies, arts, and celebrations. Covering everything from football and chess to music, painting, and party poppers.',
  },
  Objects: {
    icon: '💡',
    description:
      "Tools, household items, clothing, technology, medical equipment, and everyday objects. If you can hold it or use it, there's probably an emoji for it here.",
  },
  Symbols: {
    icon: '♾️',
    description:
      'Arrows, signs, warning markers, religious symbols, currency, zodiac signs, and abstract shapes. Useful for adding visual punctuation or universal meaning to any message.',
  },
  Flags: {
    icon: '🚩',
    description:
      'Country flags for every nation recognised by Unicode, plus regional flags, themed flags, and special banners. 270 flags covering the globe.',
  },
  Component: {
    icon: '🔣',
    description:
      'Skin-tone modifiers and hair components used to build personalised people emojis. These combine with other emojis rather than being used on their own.',
  },
};

export default function CategoriesPage() {
  const categoryMap = data.reduce<Record<string, string[]>>((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    if (acc[e.category].length < 8) acc[e.category].push(e.char);
    return acc;
  }, {});

  const countMap = data.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoryMap).sort();
  const total = data.length;

  return (
    <section className="space-y-10 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Emoji Categories
        </h1>
        <p className="text-gray-500">
          All {total.toLocaleString()} emojis organised into {categories.length}{' '}
          categories — from expressive faces and animal companions to flags from
          every nation. Tap a category to browse and copy the emojis inside.
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const meta = CATEGORY_META[c];
          const count = countMap[c] ?? 0;
          return (
            <li key={c}>
              <Link
                className="group flex flex-col h-full border border-gray-100 rounded-xl bg-white p-5 hover:shadow-md hover:bg-gray-50 transition-all no-underline"
                href={`/category/${encodeURIComponent(c)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{meta?.icon ?? '🔣'}</span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 rounded-full px-2.5 py-1">
                    {count.toLocaleString()} emojis
                  </span>
                </div>

                <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {c}
                </h2>

                {meta?.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-3">
                    {meta.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-auto">
                  {categoryMap[c].map((char, i) => (
                    <span key={i} className="text-xl">
                      {char}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 self-end ml-1">
                    +{(count - categoryMap[c].length).toLocaleString()} more
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
