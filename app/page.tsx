import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/online-tools/ToolPage';
import { ToolGrid } from '@/components/online-tools/ToolCard';
import { ToolSearch } from '@/components/online-tools/ToolSearch';
import {
  CATEGORIES,
  TOOLS,
  categoryPath,
  popularTools,
  searchIndex,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';
import { itemListJsonLd } from '@/lib/online-tools/seo';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';

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
    text: 'Every tool is free to use without signing up, with no watermarks and no usage limits.',
  },
];

const EMOJI_LINKS = [
  { href: '/emoji', icon: '😀', label: 'Emoji search & copy' },
  { href: '/categories', icon: '📂', label: 'Emoji categories' },
  {
    href: '/emoji-collections/events',
    icon: '🎉',
    label: 'Holiday collections',
  },
  { href: '/emoji-tools', icon: '🛠️', label: 'Emoji tools' },
  { href: '/games', icon: '🎮', label: 'Emoji games' },
];

export default function Home() {
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
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
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

      <section aria-labelledby="popular-tools" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2
            id="popular-tools"
            className="text-xl font-semibold text-gray-900"
          >
            Popular tools
          </h2>
          <Link
            href="/online-tool"
            className="text-sm text-brand-700 hover:underline"
          >
            All {TOOLS.length} tools →
          </Link>
        </div>
        <ToolGrid
          tools={popularTools().map((t) => ({
            href: toolPath(t),
            name: t.name,
            description: t.shortDescription,
            icon: t.icon,
          }))}
        />
      </section>

      <section aria-labelledby="categories" className="space-y-3">
        <h2 id="categories" className="text-xl font-semibold text-gray-900">
          Browse by category
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const tools = toolsInCategory(c.slug);
            return (
              <li key={c.slug} className={`rounded-2xl border p-4 ${c.accent}`}>
                <Link
                  href={categoryPath(c.slug)}
                  className="group flex items-center gap-2 font-semibold hover:underline"
                >
                  <span aria-hidden className="text-2xl">
                    {c.icon}
                  </span>
                  {c.name}
                  <span className="ml-auto text-xs font-normal opacity-70">
                    {tools.length} tools
                  </span>
                </Link>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {tools.slice(0, 4).map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={toolPath(t)}
                        className="inline-block rounded-full bg-white/80 px-2.5 py-1 text-xs text-gray-700 hover:bg-white"
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

      <aside
        aria-labelledby="emoji-corner"
        className="rounded-2xl border border-gray-100 px-4 py-4"
      >
        <h2 id="emoji-corner" className="text-sm font-semibold text-gray-700">
          Looking for emojis?{' '}
          <span className="font-normal text-gray-500">
            Emojar still has {EMOJI_COUNT_LABEL} emojis to copy and paste.
          </span>
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {EMOJI_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              >
                <span aria-hidden>{l.icon}</span> {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
