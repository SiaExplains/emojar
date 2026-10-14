import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ, JsonLd } from '@/components/online-tools/ToolPage';
import { ToolSearch } from '@/components/online-tools/ToolSearch';
import {
  SectionHeader,
  ToolDirectory,
} from '@/components/online-tools/ToolDirectory';
import {
  TOOLS,
  getCategory,
  getTool,
  searchIndex,
  toolPath,
} from '@/lib/online-tools/registry';
import { faqJsonLd, itemListJsonLd } from '@/lib/online-tools/seo';
import { publishedGuides } from '@/lib/blog/guides';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
import { textLink, tile, tileIcon } from '@/components/ui/styles';
import { DEFAULT_TINT } from '@/lib/online-tools/category-style';

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

const HOME_FAQS = [
  {
    q: 'Are Emojar tools free?',
    a: `Yes. All ${TOOLS.length} tools are free to use, with no account, no watermarks and no usage limits.`,
  },
  {
    q: 'Are my files uploaded anywhere?',
    a: 'No. Files and text are processed by your own browser, so they never leave your device. The few tools that contact another service, such as downloading the OCR engine once, say so on their page.',
  },
  {
    q: 'Do I need to install anything or sign up?',
    a: 'No. Open a tool and use it straight away — there is nothing to install and no sign-up.',
  },
  {
    q: 'Which devices and browsers are supported?',
    a: 'Every tool works in current versions of Chrome, Edge, Firefox and Safari on Windows, macOS, Linux, Android and iPhone.',
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
    <>
      <JsonLd
        data={itemListJsonLd(
          'Emojar online tools',
          '/',
          TOOLS.map((t) => ({ name: t.name, path: toolPath(t) })),
        )}
      />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
      <div className="space-y-16">
        <div className="space-y-5">
          <header className="mx-auto max-w-4xl space-y-3 text-center">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              {TOOLS.length} free online tools that run in your browser
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Convert images and PDFs, format JSON, count words, generate
              passwords and QR codes, and calculate almost anything — small,
              fast utilities that keep your files on your device.
            </p>
            <ToolSearch entries={searchIndex()} />
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-medium text-gray-500">
              <li>🔒 No uploads</li>
              <li>💚 Free, no sign-up</li>
              <li>📱 Works on any device</li>
            </ul>
          </header>

          <ToolDirectory />
        </div>

        <section aria-labelledby="more" className="space-y-4">
          <SectionHeader
            id="more"
            icon="😀"
            title="Emoji, games & collections"
            subtitle="Where Emojar started: emoji search, quick games and themed sets."
          />
          <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {MORE_SECTIONS.map((m) => (
              <li key={m.href} className={`${tile} hover:translate-y-0`}>
                <Link
                  href={m.href}
                  className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span aria-hidden className={`${tileIcon} ${DEFAULT_TINT}`}>
                    {m.icon}
                  </span>
                  <span className="text-[15px] font-semibold text-gray-900 hover:text-brand-700">
                    {m.title}
                  </span>
                </Link>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-gray-500">
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
          <section aria-labelledby="guides" className="space-y-4">
            <SectionHeader
              id="guides"
              icon="📘"
              title="Latest guides"
              subtitle="Step-by-step walkthroughs for getting more out of the tools."
              link={{ href: '/blog', label: 'All guides' }}
            />
            <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {latestGuides.map((g) => {
                const t = g.tool ? getTool(g.tool) : undefined;
                const cat = t ? getCategory(t.category) : undefined;
                return (
                  <li key={g.slug}>
                    <Link href={`/blog/${g.slug}`} className={tile}>
                      <span className="flex items-center justify-between gap-2 text-xs text-gray-500">
                        <time dateTime={g.publishDate}>
                          {dateLabel(g.publishDate)}
                        </time>
                        {cat && <span>{cat.shortName}</span>}
                      </span>
                      <span className="mt-2 block text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-brand-700">
                        {g.title}
                      </span>
                      <span className="mt-1.5 line-clamp-3 block text-[13px] leading-relaxed text-gray-500">
                        {g.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="why" className="space-y-4">
          <SectionHeader id="why" icon="🔒" title="Why use Emojar tools?" />
          <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className={`${tile} hover:translate-y-0`}>
                <span aria-hidden className={`${tileIcon} ${DEFAULT_TINT}`}>
                  {p.icon}
                </span>
                <p className="mt-4 text-[15px] font-semibold text-gray-900">
                  {p.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
                  {p.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="max-w-4xl text-sm leading-relaxed text-gray-600">
            Most online converters upload your files to their servers. Emojar
            tools use features built into your browser — the File API, Canvas,
            Web Workers and the Web Crypto API — so the work happens on your own
            device. That makes them safe for contracts, IDs, private photos, API
            keys and anything else you would rather not share.
          </p>
        </section>

        <FAQ faqs={HOME_FAQS} />
      </div>
    </>
  );
}
