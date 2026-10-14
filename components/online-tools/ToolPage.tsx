import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import type { CSSProperties } from 'react';
import AdSlot from '@/components/AdSlot';
import {
  card,
  pill,
  sectionTitle,
  textLink,
  tileIcon,
} from '@/components/ui/styles';
import { tintFor } from '@/lib/online-tools/category-style';
import TOOL_HEIGHTS from '@/lib/online-tools/data/tool-heights.json';
import {
  TOOLS,
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
      <h2 id="faq-heading" className={sectionTitle}>
        {heading}
      </h2>
      <div className={`${card} divide-y divide-[#eeeef4]`}>
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
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
        <h2 id="related-heading" className={sectionTitle}>
          Related tools
        </h2>
        {cat && (
          <Link
            href={categoryPath(cat.slug)}
            className="text-sm font-semibold text-brand-700 hover:underline"
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
          tint: t.category,
        }))}
      />
    </section>
  );
}

export function ToolHeader({
  icon,
  tint,
  name,
  description,
  handlesFiles,
}: {
  icon: string;
  /** Category slug, which tints the icon square. */
  tint?: string;
  name: string;
  description: string;
  handlesFiles?: boolean;
}) {
  return (
    <header className="mx-auto max-w-3xl space-y-3 text-center">
      <span
        aria-hidden
        className={`${tileIcon} mx-auto h-14 w-14 text-3xl ${tintFor(tint)}`}
      >
        {icon}
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        {name}
      </h1>
      <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
        {description}
      </p>
      <PrivacyNotice handlesFiles={handlesFiles} />
    </header>
  );
}

/**
 * Height each tool has when it first renders, measured at 375 / 800 / 1280 /
 * 1920 px
 * wide by `npm run measure:tool-heights`. Tools render client-side, so
 * reserving this space stops the page below from jumping when the tool
 * appears; unmeasured tools fall back to a generic height.
 */
function reservedHeight(slug: string): CSSProperties | undefined {
  const h = (TOOL_HEIGHTS as Record<string, number[] | undefined>)[slug];
  if (!h) return undefined;
  const [sm, md, lg, xl = lg] = h;
  return {
    '--tool-h': `${sm}px`,
    '--tool-h-md': `${md}px`,
    '--tool-h-lg': `${lg}px`,
    '--tool-h-2xl': `${xl}px`,
  } as CSSProperties;
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
    <>
      <JsonLd data={webApplicationJsonLd(tool, variant)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd(name, tool.howTo)} />
      <article className="space-y-10">
        <div>
          <Breadcrumb crumbs={crumbs} />
          <ToolHeader
            icon={tool.icon}
            tint={tool.category}
            name={name}
            description={variant?.description ?? tool.description}
            handlesFiles={tool.handlesFiles}
          />
        </div>

        <section
          aria-label={`${name} tool`}
          style={reservedHeight(tool.slug)}
          className="min-h-[var(--tool-h,300px)] rounded-2xl border border-[#e8e8f0] bg-white p-4 shadow-[0_2px_12px_-6px_rgba(30,30,60,0.12)] sm:min-h-[var(--tool-h-md,360px)] sm:p-6 lg:min-h-[var(--tool-h-lg,360px)] 2xl:min-h-[var(--tool-h-2xl,360px)]"
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

        <AdSlot placement="tool" />

        {siblings && siblings.length > 0 && (
          <nav aria-labelledby="variants-heading" className="space-y-3">
            <h2 id="variants-heading" className={sectionTitle}>
              {variant
                ? `More ${tool.name.toLowerCase()} options`
                : 'Popular conversions'}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {variant && (
                <li>
                  <Link href={toolPath(tool)} className={pill}>
                    All formats
                  </Link>
                </li>
              )}
              {siblings.map((v) => (
                <li key={v.slug}>
                  <Link href={variantPath(tool, v)} className={pill}>
                    {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className={`${card} grid gap-8 p-5 sm:p-7 lg:grid-cols-2 lg:gap-12 [&>*]:min-w-0`}
        >
          <section aria-labelledby="howto-heading" className="space-y-3">
            <h2
              id="howto-heading"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              How to use the {name}
            </h2>
            <ol className="space-y-2">
              {tool.howTo.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm leading-relaxed text-gray-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="about-heading" className="space-y-3">
            <h2
              id="about-heading"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              What is the {tool.name}?
            </h2>
            {tool.about.map((p) => (
              <p
                key={p}
                className="break-words text-sm leading-relaxed text-gray-700"
              >
                {p}
              </p>
            ))}
          </section>
        </div>

        {guide && (
          <section aria-labelledby="guide-heading" className={`${card} p-5`}>
            <h2
              id="guide-heading"
              className="text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              In-depth guide
            </h2>
            <Link
              href={`/blog/${guide.slug}`}
              className="mt-1 block text-lg font-semibold text-brand-700 hover:underline"
            >
              {guide.title} →
            </Link>
          </section>
        )}

        <FAQ faqs={faqs} />
        <RelatedTools tool={tool} />

        <nav
          aria-label="Keep exploring"
          className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e8e8f0] pt-6 text-sm"
        >
          <Link href={categoryPath(category.slug)} className={textLink}>
            All {category.name.toLowerCase()}
          </Link>
          <Link href="/online-tool" className={textLink}>
            All {TOOLS.length} online tools
          </Link>
          <Link href="/blog" className={textLink}>
            Guides
          </Link>
        </nav>
      </article>
    </>
  );
}
