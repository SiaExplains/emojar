import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import {
  categoryPath,
  getCategory,
  relatedTools,
  toolPath,
  variantPath,
} from '@/lib/online-tools/registry';
import {
  faqJsonLd,
  howToJsonLd,
  privacyFaq,
  webApplicationJsonLd,
} from '@/lib/online-tools/seo';
import type {
  FAQItem,
  ToolConfig,
  ToolDefinition,
  ToolVariant,
} from '@/lib/online-tools/types';
import { ToolGrid } from './ToolCard';
import { ToolRenderer } from './ToolRenderer';

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function PrivacyNotice({ handlesFiles }: { handlesFiles?: boolean }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
      <span aria-hidden>🔒</span>
      {handlesFiles
        ? 'Your files never leave your device.'
        : 'This tool runs entirely in your browser.'}
    </p>
  );
}

export function FAQ({
  faqs,
  heading = 'Frequently asked questions',
}: {
  faqs: FAQItem[];
  heading?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className="space-y-3">
      <h2 id="faq-heading" className="text-xl font-semibold text-gray-900">
        {heading}
      </h2>
      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
            open
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
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({ tool }: { tool: ToolDefinition }) {
  const related = relatedTools(tool);
  const cat = getCategory(tool.category);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related-heading" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="related-heading"
          className="text-xl font-semibold text-gray-900"
        >
          Related tools
        </h2>
        {cat && (
          <Link
            href={categoryPath(cat.slug)}
            className="text-sm text-indigo-700 hover:underline"
          >
            All {cat.name.toLowerCase()} →
          </Link>
        )}
      </div>
      <ToolGrid
        tools={related.map((t) => ({
          href: toolPath(t),
          name: t.name,
          description: t.shortDescription,
          icon: t.icon,
        }))}
      />
    </section>
  );
}

export function ToolHeader({
  icon,
  name,
  description,
  handlesFiles,
}: {
  icon: string;
  name: string;
  description: string;
  handlesFiles?: boolean;
}) {
  return (
    <header className="space-y-3">
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-4xl leading-none">
          {icon}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {name}
        </h1>
      </div>
      <p className="max-w-3xl text-base leading-relaxed text-gray-600">
        {description}
      </p>
      <PrivacyNotice handlesFiles={handlesFiles} />
    </header>
  );
}

/**
 * Shared layout for every tool and tool variant page. Everything except the
 * interactive widget is server-rendered so crawlers and AI assistants can
 * read the explanation, steps and FAQ without running JavaScript.
 */
export function ToolPage({
  tool,
  variant,
  guide,
}: {
  tool: ToolDefinition;
  variant?: ToolVariant;
  /** Published blog guide for this tool, if any. */
  guide?: { slug: string; title: string };
}) {
  const category = getCategory(tool.category)!;
  const name = variant?.name ?? tool.name;
  const faqs = [
    ...tool.faqs,
    privacyFaq({ name: tool.name, handlesFiles: tool.handlesFiles }),
  ];
  const config: ToolConfig = {
    ...(tool.config ?? {}),
    ...(variant?.config ?? {}),
  };
  const crumbs = [
    { label: 'Online Tools', href: '/online-tool' },
    { label: category.name, href: categoryPath(category.slug) },
    ...(variant
      ? [{ label: tool.name, href: toolPath(tool) }, { label: variant.name }]
      : [{ label: tool.name }]),
  ];
  const siblings = variant
    ? tool.variants?.filter((v) => v.slug !== variant.slug)
    : tool.variants;

  return (
    <article className="space-y-10">
      <JsonLd data={webApplicationJsonLd(tool, variant)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd(name, tool.howTo)} />

      <div>
        <Breadcrumb crumbs={crumbs} />
        <ToolHeader
          icon={tool.icon}
          name={name}
          description={variant?.description ?? tool.description}
          handlesFiles={tool.handlesFiles}
        />
      </div>

      <section
        aria-label={`${name} tool`}
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
      >
        <ToolRenderer
          component={tool.component}
          config={config}
          toolName={name}
        />
        {tool.limitation && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-semibold">Good to know: </strong>
            {tool.limitation}
          </p>
        )}
      </section>

      {siblings && siblings.length > 0 && (
        <nav aria-labelledby="variants-heading" className="space-y-3">
          <h2
            id="variants-heading"
            className="text-xl font-semibold text-gray-900"
          >
            {variant
              ? `More ${tool.name.toLowerCase()} options`
              : 'Popular conversions'}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {variant && (
              <li>
                <Link
                  href={toolPath(tool)}
                  className="inline-block rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  All formats
                </Link>
              </li>
            )}
            {siblings.map((v) => (
              <li key={v.slug}>
                <Link
                  href={variantPath(tool, v)}
                  className="inline-block rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="howto-heading" className="space-y-3">
          <h2
            id="howto-heading"
            className="text-xl font-semibold text-gray-900"
          >
            How to use the {name}
          </h2>
          <ol className="space-y-2">
            {tool.howTo.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 text-sm leading-relaxed text-gray-700"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="about-heading" className="space-y-3">
          <h2
            id="about-heading"
            className="text-xl font-semibold text-gray-900"
          >
            What is the {tool.name}?
          </h2>
          {tool.about.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </section>
      </div>

      {guide && (
        <section
          aria-labelledby="guide-heading"
          className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
        >
          <h2
            id="guide-heading"
            className="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >
            In-depth guide
          </h2>
          <Link
            href={`/blog/${guide.slug}`}
            className="mt-1 block text-lg font-semibold text-indigo-700 hover:underline"
          >
            {guide.title} →
          </Link>
        </section>
      )}

      <FAQ faqs={faqs} />
      <RelatedTools tool={tool} />
    </article>
  );
}
