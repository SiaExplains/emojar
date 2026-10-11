import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/online-tools/ToolPage';
import { ToolGrid } from '@/components/online-tools/ToolCard';
import { ToolSearch } from '@/components/online-tools/ToolSearch';
import {
  CATEGORIES,
  TOOLS,
  categoryPath,
  featuredTools,
  getCategory,
  searchIndex,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';
import { itemListJsonLd } from '@/lib/online-tools/seo';
import { publishedGuides } from '@/lib/blog/guides';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
import { textLink } from '@/components/ui/styles';

// The "Latest guides" list changes as guides are drip-published.
export const revalidate = 86400;

const title = 'Emojar — Free Online Tools That Run in Your Browser';
const description = `${Math.floor(TOOLS.length / 10) * 10}+ free online tools: image converter, PDF merger, JSON formatter, word counter, calculators, unit converters and more. Private by design — your files never leave your device.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: 'https://emojar.com' },
  openGraph: {
    title,
    description,
    url: 'https://emojar.com',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, description },
};

const PRINCIPLES = [
  {
    icon: '🔒',
    title: 'Private by design',
    text: 'Files and text are processed on your device. Nothing is uploaded, stored or logged.',
  },
  {
    icon: '⚡',
    title: 'Fast',
    text: 'No upload queue and no waiting for a server — results appear in seconds, even for large files.',
  },
  {
    icon: '💚',
    title: 'Free, no account',
    text: 'Every tool is free to use without signing up — no watermarks, no quotas and no paywalled features.',
  },
];

const MORE_SECTIONS = [
  {
    href: '/emoji',
    icon: '😀',
    title: 'Emoji search & copy',
    text: `Search and copy ${EMOJI_COUNT_LABEL} emojis with their meanings, browse 10 categories and the A–Z lists.`,
    links: [
      { href: '/categories', label: 'Categories' },
      { href: '/collection/alphabet', label: 'Emojis A–Z' },
      { href: '/emoji-tools', label: 'Emoji tools' },
    ],
  },
  {
    href: '/games',
    icon: '🎮',
    title: 'Emoji games',
    text: '18 quick browser games — Wordle, 2048, Snake, Minesweeper, Hangman, Guess the Flag and more.',
    links: [
      { href: '/games/emoji-wordle', label: 'Emoji Wordle' },
      { href: '/games/emoji-2048', label: 'Emoji 2048' },
      { href: '/games/snake', label: 'Snake' },
    ],
  },
  {
    href: '/emoji-collections/events',
    icon: '🎉',
    title: 'Holiday & themed collections',
    text: 'Ready-made emoji sets for holidays and events, plus letter-shaped and detailed emoji tables.',
    links: [
      { href: '/table/emoji-alphabet-shaped', label: 'Letter-shaped emojis' },
      { href: '/collection/detail', label: 'Emojis with details' },
    ],
  },
];

const dateLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function Home() {
  const latestGuides = [...publishedGuides()]
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
    .slice(0, 3);
  return (
    <div className="space-y-14">
      <JsonLd
        data={itemListJsonLd(
          'Emojar online tools',
          '/',
          CATEGORIES.map((c) => ({ name: c.name, path: categoryPath(c.slug) })),
        )}
      />

      <header className="space-y-5 pt-2 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
          {TOOLS.length} free online tools that
          <br className="hidden sm:block" /> run in your browser
        </h1>
        <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
          Convert images and PDFs, format JSON, count words, generate passwords
          and QR codes, and calculate almost anything — {TOOLS.length} small,
          fast utilities that keep your files on your device.
        </p>
        <ToolSearch entries={searchIndex()} />
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-medium text-gray-500">
          <li>🔒 No uploads</li>
          <li>💚 Free, no sign-up</li>
          <li>📱 Works on any device</li>
        </ul>
      </header>

      <section aria-labelledby="start-here" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 id="start-here" className="text-xl font-semibold text-gray-900">
              Start here
            </h2>
            <p className="text-sm text-gray-500">
              Our picks of the tools people reach for most often.
            </p>
          </div>
          <Link href="/online-tool" className={textLink}>
            Browse all {TOOLS.length} tools →
          </Link>
        </div>
        <ToolGrid
          tools={featuredTools().map((t) => ({
            href: toolPath(t),
            name: t.name,
            description: t.shortDescription,
            icon: t.icon,
            category: getCategory(t.category)?.shortName,
          }))}
        />
      </section>

      <section aria-labelledby="categories" className="space-y-3">
        <h2 id="categories" className="text-xl font-semibold text-gray-900">
          Browse by category
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {CATEGORIES.map((c) => {
            const tools = toolsInCategory(c.slug);
            return (
              <li
                key={c.slug}
                className="rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:shadow-sm"
              >
                <Link
                  href={categoryPath(c.slug)}
                  className="group flex items-center gap-3 rounded-lg font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl"
                  >
                    {c.icon}
                  </span>
                  <span className="group-hover:text-brand-700">{c.name}</span>
                  <span className="ml-auto text-xs font-normal text-gray-500">
                    {tools.length} tools
                  </span>
                </Link>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {tools.slice(0, 4).map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={toolPath(t)}
                        className="inline-block rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs text-gray-700 hover:border-gray-200 hover:bg-white"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="more" className="space-y-3">
        <h2 id="more" className="text-xl font-semibold text-gray-900">
          Emoji, games & collections
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {MORE_SECTIONS.map((m) => (
            <li
              key={m.href}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5"
            >
              <Link
                href={m.href}
                className="group flex items-center gap-3 rounded-lg font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl"
                >
                  {m.icon}
                </span>
                <span className="group-hover:text-brand-700">{m.title}</span>
              </Link>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                {m.text}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {m.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={textLink}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {latestGuides.length > 0 && (
        <section aria-labelledby="guides" className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="guides" className="text-xl font-semibold text-gray-900">
              Latest guides
            </h2>
            <Link href="/blog" className={textLink}>
              All guides →
            </Link>
          </div>
          <ul className="grid gap-3 md:grid-cols-3">
            {latestGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/blog/${g.slug}`}
                  className="group block h-full rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-gray-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <time
                    dateTime={g.publishDate}
                    className="text-xs text-gray-500"
                  >
                    {dateLabel(g.publishDate)}
                  </time>
                  <span className="mt-1 block font-semibold leading-snug text-gray-900 group-hover:text-brand-700">
                    {g.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-gray-600">
                    {g.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="why" className="space-y-4">
        <h2 id="why" className="text-xl font-semibold text-gray-900">
          Why use Emojar tools?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <p className="font-semibold text-gray-900">
                <span aria-hidden>{p.icon}</span> {p.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {p.text}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed text-gray-600">
          Most online converters upload your files to their servers. Emojar
          tools use features built into your browser — the File API, Canvas, Web
          Workers and the Web Crypto API — so the work happens on your own
          device. That makes them safe for contracts, IDs, private photos, API
          keys and anything else you would rather not share.
        </p>
      </section>
    </div>
  );
}
