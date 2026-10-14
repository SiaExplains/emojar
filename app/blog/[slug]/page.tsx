import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/online-tools/ToolPage';
import {
  guideBySlug,
  isPublished,
  publishedGuides,
  wordCount,
} from '@/lib/blog/guides';
import { extractFaq, renderMarkdown } from '@/lib/blog/render';
import { getCategory, getTool, toolPath } from '@/lib/online-tools/registry';
import { brandedTitle } from '@/lib/og';

type Params = { slug: string };

// Guides go live on their scheduled date; re-check once a day.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): Params[] {
  return publishedGuides().map((g) => ({ slug: g.slug }));
}

function resolve(slug: string) {
  const g = guideBySlug(slug);
  return g && isPublished(g) ? g : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const g = resolve((await params).slug);
  if (!g) return {};
  const tool = g.tool ? getTool(g.tool) : undefined;
  const url = `https://emojar.com/blog/${g.slug}`;
  const og = `https://emojar.com/api/og?${new URLSearchParams({ type: 'tool', emoji: tool?.icon ?? '🧰', name: g.title.slice(0, 60), desc: g.description.slice(0, 120) })}`;
  return {
    title: { absolute: brandedTitle(g.title, 'Emojar Blog') },
    description: g.description,
    keywords: g.tags,
    alternates: { canonical: url },
    openGraph: {
      title: g.title,
      description: g.description,
      url,
      siteName: 'Emojar',
      type: 'article',
      publishedTime: g.publishDate,
      authors: ['Siavash Ghanbari'],
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: g.title,
      description: g.description,
      images: [og],
    },
    robots: { index: true, follow: true },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const g = resolve((await params).slug);
  if (!g) notFound();
  const tool = g.tool ? getTool(g.tool) : undefined;
  const category = tool ? getCategory(tool.category) : undefined;
  const related = publishedGuides()
    .filter(
      (x) =>
        x.slug !== g.slug &&
        x.tool &&
        tool &&
        getTool(x.tool)?.category === tool.category,
    )
    .slice(0, 4);
  const faq = extractFaq(g.body);
  const url = `https://emojar.com/blog/${g.slug}`;
  const words = wordCount(g.body);

  const posting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: g.title,
    description: g.description,
    datePublished: g.publishDate,
    dateModified: g.publishDate,
    wordCount: words,
    keywords: g.tags.join(', '),
    author: {
      '@type': 'Person',
      name: 'Siavash Ghanbari',
      url: 'https://emojar.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Emojar',
      url: 'https://emojar.com',
      logo: { '@type': 'ImageObject', url: 'https://emojar.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(tool
      ? {
          about: {
            '@type': 'WebApplication',
            name: tool.name,
            url: `https://emojar.com${toolPath(tool)}`,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={posting} />
      {faq.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}
      <div className="not-prose mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600">
          {category ? `${category.name} guide` : (g.tags[0] ?? 'Guide')}
        </p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl tracking-tight text-gray-900">
          {g.title}
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          <time dateTime={g.publishDate}>
            {new Date(`${g.publishDate}T12:00:00Z`).toLocaleDateString(
              'en-GB',
              { day: 'numeric', month: 'long', year: 'numeric' },
            )}
          </time>{' '}
          · {Math.max(1, Math.round(words / 230))} min read
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {g.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(g.body) }} />

      {tool && (
        <aside className="not-prose mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5">
          <span aria-hidden className="text-3xl">
            {tool.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-brand-950">Try the {tool.name}</p>
            <p className="text-sm text-brand-900/80">
              {tool.shortDescription} Free, no sign-up, runs in your browser.
            </p>
          </div>
          <Link
            href={toolPath(tool)}
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Open the tool →
          </Link>
        </aside>
      )}

      {related.length > 0 && (
        <nav aria-labelledby="related-guides" className="not-prose mt-10">
          <h2
            id="related-guides"
            className="mb-3 text-lg font-semibold text-gray-900"
          >
            More {category?.name.toLowerCase()} guides
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blog/${r.slug}`}
                  className="block rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
