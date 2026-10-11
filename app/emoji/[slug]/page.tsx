import data from '@/data/emojis.json';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CopyButton from '@/components/CopyButton';

type EmojiEntry = (typeof data)[number];

const CATEGORY_CONTEXT: Record<string, string> = {
  'Smileys & Emotion':
    'expressing feelings, reactions, and emotions in messages and social media posts',
  'People & Body':
    'representing people, gestures, and human actions in everyday communication',
  'Animals & Nature':
    'talking about animals, plants, weather, and the natural world',
  'Food & Drink':
    'sharing food experiences, recipes, restaurant visits, and culinary moments',
  'Travel & Places':
    'discussing travel destinations, vehicles, buildings, and geographic locations',
  Activities:
    'sharing sports, hobbies, celebrations, and recreational activities',
  Objects: 'referencing tools, clothing, technology, and everyday items',
  Symbols:
    'conveying abstract concepts, directions, warnings, and universal signs',
  Flags: 'representing countries, regions, and international topics',
  Component: 'modifying skin tone or hair style on supported people emojis',
};

export function generateStaticParams() {
  return data.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const emoji = data.find((e) => e.slug === slug) as EmojiEntry | undefined;
  if (!emoji) return { title: 'Emoji not found | Emojar' };

  const canonical = new URL(`/emoji/${emoji.slug}`, 'https://emojar.com');
  const ogImageUrl = `https://emojar.com/api/og?emoji=${encodeURIComponent(emoji.char)}&name=${encodeURIComponent(emoji.name)}`;
  const metaDescription = `${emoji.char} ${emoji.name} emoji — copy and paste instantly. Meaning, Unicode ${emoji.version}, category: ${emoji.category}. Works on iOS, Android, Windows, macOS.`;

  return {
    title: `${emoji.char} ${emoji.name} Emoji — Copy, Meaning & Details | Emojar`,
    description: metaDescription,
    keywords: emoji.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${emoji.name} Emoji — Copy & Paste`,
      description: metaDescription,
      url: canonical.toString(),
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      title: `${emoji.name} Emoji — Copy & Paste`,
      description: metaDescription,
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function EmojiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const emoji = data.find((e) => e.slug === slug) as EmojiEntry | undefined;
  if (!emoji) notFound();

  const relatedEmojis = (emoji.relatedSlugs ?? [])
    .map((s) => data.find((e) => e.slug === s))
    .filter(Boolean) as EmojiEntry[];

  const excludedSlugs = new Set([emoji.slug, ...(emoji.relatedSlugs ?? [])]);
  const categoryEmojis = data
    .filter((e) => e.category === emoji.category && !excludedSlugs.has(e.slug))
    .slice(0, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${emoji.name} Emoji`,
    description: emoji.description,
    url: `https://emojar.com/emoji/${emoji.slug}`,
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://emojar.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://emojar.com/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: emoji.category,
          item: `https://emojar.com/category/${encodeURIComponent(emoji.category)}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: emoji.name,
          item: `https://emojar.com/emoji/${emoji.slug}`,
        },
      ],
    },
  };

  const emojiSchema = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: emoji.name,
    description: emoji.description,
    url: `https://emojar.com/emoji/${emoji.slug}`,
    identifier: (emoji.codepoints ?? []).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(emojiSchema) }}
      />

      <article className="space-y-10 py-6 px-2">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm text-gray-500 flex flex-wrap gap-1"
        >
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>›</span>
          <Link href="/categories" className="hover:underline">
            Categories
          </Link>
          <span>›</span>
          <Link
            href={`/category/${encodeURIComponent(emoji.category)}`}
            className="hover:underline"
          >
            {emoji.category}
          </Link>
          <span>›</span>
          <span className="text-gray-800">{emoji.name}</span>
        </nav>

        {/* Hero */}
        <section className="text-center space-y-3">
          <div className="text-8xl leading-none select-none">{emoji.char}</div>
          <h1 className="text-3xl font-semibold capitalize">{emoji.name}</h1>
          <CopyButton text={emoji.char} />
        </section>

        {/* Description */}
        <section>
          <h2 className="text-xl font-semibold mb-2">About this emoji</h2>
          <p className="text-gray-700 leading-7">{emoji.description}</p>
          <p className="mt-3 text-gray-700 leading-7">
            The <strong>{emoji.name}</strong> emoji belongs to the{' '}
            <Link
              href={`/category/${encodeURIComponent(emoji.category)}`}
              className="underline underline-offset-2"
            >
              {emoji.category}
            </Link>{' '}
            category, specifically the <em>{emoji.subgroup}</em> subgroup. It
            was introduced in Unicode {emoji.version} and is supported across
            all major platforms including iOS, Android, Windows, and macOS.
          </p>
          {CATEGORY_CONTEXT[emoji.category] && (
            <p className="mt-3 text-gray-700 leading-7">
              People commonly use the {emoji.char} {emoji.name} emoji for{' '}
              {CATEGORY_CONTEXT[emoji.category]}.
              {(emoji.keywords ?? []).length > 2 && (
                <>
                  {' '}
                  It is often associated with{' '}
                  {(emoji.keywords ?? []).slice(0, 4).join(', ')}.
                </>
              )}
            </p>
          )}
        </section>

        {/* Quick facts */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Quick facts</h2>
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <tbody>
              {[
                ['Emoji', emoji.char],
                ['Name', emoji.name],
                ['Category', emoji.category],
                ['Subgroup', emoji.subgroup ?? '—'],
                ['Unicode version', emoji.version],
                ['Codepoint(s)', (emoji.codepoints ?? []).join(', ')],
                ['Shortcode alias', (emoji.aliases ?? []).join(', ')],
              ].map(([label, value]) => (
                <tr key={label} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium text-gray-600 bg-gray-50 w-40 shrink-0">
                    {label}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* How to use */}
        <section>
          <h2 className="text-xl font-semibold mb-3">How to use</h2>
          <div className="space-y-3 text-gray-700 leading-7">
            <p>
              <strong>Copy and paste:</strong> Click the &ldquo;Copy to
              clipboard&rdquo; button above and paste the emoji anywhere —
              messages, social media posts, emails, or documents.
            </p>
            <p>
              <strong>Shortcode:</strong> On platforms that support emoji
              shortcodes (Slack, GitHub, Discord), type{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                {(emoji.aliases ?? [])[0] ?? `:${emoji.slug}:`}
              </code>{' '}
              and the emoji will auto-complete.
            </p>
            <p>
              <strong>Mobile keyboard:</strong> Open your device&apos;s emoji
              keyboard (🌐 or 😊 key) and search for &ldquo;{emoji.name}
              &rdquo; to find it quickly.
            </p>
            <p>
              <strong>Windows:</strong> Press{' '}
              <kbd className="border rounded px-1.5 py-0.5 text-sm font-mono">
                Win
              </kbd>
              {' + '}
              <kbd className="border rounded px-1.5 py-0.5 text-sm font-mono">
                .
              </kbd>{' '}
              to open the emoji picker, then search by name.
            </p>
            <p>
              <strong>macOS:</strong> Press{' '}
              <kbd className="border rounded px-1.5 py-0.5 text-sm font-mono">
                ⌃ Control
              </kbd>
              {' + '}
              <kbd className="border rounded px-1.5 py-0.5 text-sm font-mono">
                ⌘ Cmd
              </kbd>
              {' + '}
              <kbd className="border rounded px-1.5 py-0.5 text-sm font-mono">
                Space
              </kbd>{' '}
              to open the Character Viewer.
            </p>
          </div>
        </section>

        {/* Keywords */}
        {(emoji.keywords ?? []).length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {(emoji.keywords ?? []).map((k) => (
                <span
                  key={k}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related emojis */}
        {relatedEmojis.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Related emojis</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {relatedEmojis.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/emoji/${rel.slug}`}
                  className="border rounded-xl p-3 flex flex-col items-center gap-1 hover:bg-gray-50 transition text-center"
                >
                  <span className="text-3xl">{rel.char}</span>
                  <span className="text-xs text-gray-600 leading-tight">
                    {rel.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Also in this category */}
        {categoryEmojis.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">
              More in {emoji.category}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-4">
              {categoryEmojis.map((e) => (
                <Link
                  key={e.slug}
                  href={`/emoji/${e.slug}`}
                  className="border rounded-xl p-2 flex flex-col items-center gap-1 hover:bg-gray-50 transition text-center"
                  title={e.name}
                >
                  <span className="text-2xl">{e.char}</span>
                  <span className="text-xs text-gray-500 leading-tight line-clamp-1">
                    {e.name}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href={`/category/${encodeURIComponent(emoji.category)}`}
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              Browse all {emoji.category} emojis →
            </Link>
          </section>
        )}

        {/* Back link */}
        <div>
          <Link
            href={`/category/${encodeURIComponent(emoji.category)}`}
            className="inline-flex items-center gap-1 text-sm border rounded-lg px-4 py-2 hover:bg-gray-50 transition"
          >
            ← Back to {emoji.category}
          </Link>
        </div>
      </article>
    </>
  );
}
