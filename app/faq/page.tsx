import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { JsonLd } from '@/components/online-tools/ToolPage';
import { FAQ_GROUPS, allFaqItems } from '@/lib/faq';
import { ogImages } from '@/lib/og';

const title = 'Emojar FAQ – Online Tools, Privacy, Emoji & More';
const description =
  'Answers to common questions about Emojar: free browser-based tools, privacy and file handling, image, PDF and developer tools, calculators, generators, emoji and support.';

const share = ogImages('❓', 'Emojar FAQ', description);

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: 'https://emojar.com/faq' },
  openGraph: {
    title,
    description,
    url: 'https://emojar.com/faq',
    siteName: 'Emojar',
    type: 'website',
    images: share.openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: share.twitter,
  },
  robots: { index: true, follow: true },
};

export default function FaqPage() {
  const items = allFaqItems();
  return (
    <div className="space-y-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <div>
        <Breadcrumb crumbs={[{ label: 'FAQ' }]} />
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Frequently asked questions
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Emojar is a free collection of online tools that run in your browser
            — your files are processed on your own device and never uploaded.
            Below are answers to the questions people ask most, grouped by
            topic.
          </p>
        </header>
      </div>

      <nav aria-label="FAQ topics">
        <ul className="flex flex-wrap gap-2">
          {FAQ_GROUPS.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span aria-hidden>{g.icon}</span> {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {FAQ_GROUPS.map((g) => (
        <section
          key={g.id}
          id={g.id}
          aria-labelledby={`${g.id}-h`}
          className="scroll-mt-24 space-y-3"
        >
          <h2 id={`${g.id}-h`} className="text-xl font-semibold text-gray-900">
            <span aria-hidden>{g.icon}</span> {g.title}
          </h2>
          <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
            {g.items.map((f) => (
              <details
                key={f.q}
                className="group px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-gray-900">
                  <h3>{f.q}</h3>
                  <span
                    aria-hidden
                    className="text-gray-400 transition group-open:rotate-180"
                  >
                    ⌄
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {f.a}
                </p>
                {f.links && (
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    <span className="text-gray-400">Related:</span>
                    {f.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="text-brand-700 hover:underline"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </p>
                )}
              </details>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-gray-600">
        Still have a question?{' '}
        <Link href="/contact" className="text-brand-700 hover:underline">
          Contact us
        </Link>{' '}
        or browse{' '}
        <Link href="/online-tool" className="text-brand-700 hover:underline">
          all online tools
        </Link>
        .
      </p>
    </div>
  );
}
