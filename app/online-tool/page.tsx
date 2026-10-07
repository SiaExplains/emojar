import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { FAQ, JsonLd } from '@/components/online-tools/ToolPage';
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
import { faqJsonLd, hubMetadata, itemListJsonLd } from '@/lib/online-tools/seo';

export const metadata: Metadata = hubMetadata(TOOLS.length);

const HUB_FAQS = [
  {
    q: 'Are these online tools really free?',
    a: 'Yes. Every tool is free to use with no account, no sign-up and no usage limits.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. The tools run entirely in your web browser using built-in browser features such as the File API, Canvas, Web Workers and the Web Crypto API. Your files and text never leave your device.',
  },
  {
    q: 'Do the tools work on my phone?',
    a: 'Yes. Every tool works in modern mobile browsers on iPhone and Android, as well as on tablets and desktop computers.',
  },
  {
    q: 'Do the tools work offline?',
    a: 'Once a tool page has loaded, the processing itself needs no internet connection, because nothing is sent to a server.',
  },
];

export default function OnlineToolsHub() {
  return (
    <div className="space-y-12">
      <JsonLd
        data={itemListJsonLd(
          'Online Tools',
          '/online-tool',
          CATEGORIES.map((c) => ({ name: c.name, path: categoryPath(c.slug) })),
        )}
      />
      <JsonLd data={faqJsonLd(HUB_FAQS)} />

      <div>
        <Breadcrumb crumbs={[{ label: 'Online Tools' }]} />
        <header className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Online Tools
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600">
            {TOOLS.length} free, fast and privacy-friendly tools that run
            directly in your browser — image and PDF converters, developer
            utilities, text tools, calculators and more. No sign-up, and your
            files never leave your device.
          </p>
          <ToolSearch entries={searchIndex()} syncUrl />
          <nav
            aria-label="Tool categories"
            className="flex flex-wrap justify-center gap-2 pt-2"
          >
            {CATEGORIES.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span aria-hidden>{c.icon}</span> {c.name}
              </a>
            ))}
          </nav>
        </header>
      </div>

      <section aria-labelledby="popular" className="space-y-3">
        <h2 id="popular" className="text-xl font-semibold text-gray-900">
          ⭐ Most popular
        </h2>
        <ToolGrid
          tools={popularTools().map((t) => ({
            href: toolPath(t),
            name: t.name,
            description: t.shortDescription,
            icon: t.icon,
          }))}
        />
      </section>

      {CATEGORIES.map((c) => {
        const tools = toolsInCategory(c.slug);
        return (
          <section
            key={c.slug}
            id={c.slug}
            aria-labelledby={`h-${c.slug}`}
            className="scroll-mt-24 space-y-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 pb-2">
              <h2
                id={`h-${c.slug}`}
                className="text-xl font-semibold text-gray-900"
              >
                <span aria-hidden>{c.icon}</span> {c.name}
              </h2>
              <Link
                href={categoryPath(c.slug)}
                className="text-sm text-indigo-700 hover:underline"
              >
                All {tools.length} {c.name.toLowerCase()} →
              </Link>
            </div>
            <p className="max-w-3xl text-sm text-gray-600">{c.intro}</p>
            <ToolGrid
              tools={tools.map((t) => ({
                href: toolPath(t),
                name: t.name,
                description: t.shortDescription,
                icon: t.icon,
              }))}
            />
          </section>
        );
      })}

      <FAQ faqs={HUB_FAQS} heading="About these tools" />
    </div>
  );
}
