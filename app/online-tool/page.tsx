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
  featuredTools,
  getCategory,
  searchIndex,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';
import { externalToolsIn } from '@/lib/online-tools/external';
import { faqJsonLd, hubMetadata, itemListJsonLd } from '@/lib/online-tools/seo';

export const metadata: Metadata = hubMetadata(TOOLS.length);

const HUB_FAQS = [
  {
    q: 'Are these online tools really free?',
    a: 'Yes. Every tool is free to use with no account, no sign-up and no usage limits.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. The tools run in your web browser using built-in browser features such as the File API, Canvas, Web Workers and the Web Crypto API, so your files and text stay on your device. The few optional features that contact another service — for example downloading the OCR engine — say so on the tool page.',
  },
  {
    q: 'Do the tools work on my phone?',
    a: 'Yes. Every tool works in modern mobile browsers on iPhone and Android, as well as on tablets and desktop computers.',
  },
  {
    q: 'Do the tools work offline?',
    a: 'Most tools keep working without a connection once the page has loaded, because nothing is sent to a server. A few need a one-time download first — for example the OCR engine in Image to Text and PDF to Text.',
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
          <p className="text-base leading-relaxed text-gray-600">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span aria-hidden>{c.icon}</span> {c.name}
                <span className="text-xs text-gray-500">
                  {toolsInCategory(c.slug).length}
                </span>
              </a>
            ))}
          </nav>
        </header>
      </div>

      <section aria-labelledby="start-here" className="space-y-3">
        <div>
          <h2 id="start-here" className="text-xl font-semibold text-gray-900">
            Start here
          </h2>
          <p className="text-sm text-gray-500">
            Our picks — every tool is listed by category below.
          </p>
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
                className="text-sm text-brand-700 hover:underline"
              >
                All {tools.length} {c.name.toLowerCase()} →
              </Link>
            </div>
            <p className="text-sm text-gray-600">{c.intro}</p>
            <ToolGrid
              tools={[
                ...tools.map((t) => ({
                  href: toolPath(t),
                  name: t.name,
                  description: t.shortDescription,
                  icon: t.icon,
                })),
                ...externalToolsIn(c.slug).map((t) => ({
                  href: t.url,
                  name: t.name,
                  description: t.description,
                  icon: t.icon,
                  external: true,
                })),
              ]}
            />
          </section>
        );
      })}

      <FAQ faqs={HUB_FAQS} heading="About these tools" />
    </div>
  );
}
