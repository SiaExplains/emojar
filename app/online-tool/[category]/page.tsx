import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { JsonLd } from '@/components/online-tools/ToolPage';
import { ToolGrid } from '@/components/online-tools/ToolCard';
import { ToolSearch } from '@/components/online-tools/ToolSearch';
import {
  CATEGORIES,
  categoryPath,
  getCategory,
  searchIndex,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';
import { categoryItemList, categoryMetadata } from '@/lib/online-tools/seo';
import { externalToolsIn } from '@/lib/online-tools/external';
import type { CategorySlug } from '@/lib/online-tools/types';

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const c = getCategory((await params).category);
  return c ? categoryMetadata(c) : {};
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  const tools = toolsInCategory(c.slug as CategorySlug);
  const index = searchIndex().filter(
    (e) => e.category === c.name || tools.some((t) => toolPath(t) === e.href),
  );

  return (
    <div className="space-y-10">
      <JsonLd data={categoryItemList(c)} />
      <div>
        <Breadcrumb
          crumbs={[
            { label: 'Online Tools', href: '/online-tool' },
            { label: c.name },
          ]}
        />
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-4xl leading-none">
              {c.icon}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {c.name}
            </h1>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">
            {c.intro}
          </p>
          <p className="text-sm text-gray-500">
            {tools.length} free tools · no sign-up · runs in your browser
          </p>
        </header>
      </div>

      <ToolSearch
        entries={index}
        placeholder={`Search ${c.name.toLowerCase()}…`}
      />

      <section aria-labelledby="all-tools" className="space-y-3">
        <h2 id="all-tools" className="text-xl font-semibold text-gray-900">
          All {c.name.toLowerCase()}
        </h2>
        <ToolGrid
          tools={[
            ...tools.map((t) => ({
              href: toolPath(t),
              name: t.name,
              description: t.shortDescription,
              icon: t.icon,
            })),
            ...externalToolsIn(c.slug as CategorySlug).map((t) => ({
              href: t.url,
              name: t.name,
              description: t.description,
              icon: t.icon,
              external: true,
            })),
          ]}
        />
      </section>

      {tools.some((t) => t.variants?.length) && (
        <section aria-labelledby="popular-conversions" className="space-y-3">
          <h2
            id="popular-conversions"
            className="text-xl font-semibold text-gray-900"
          >
            Popular conversions
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tools.flatMap((t) =>
              (t.variants ?? []).map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`${toolPath(t)}/${v.slug}`}
                    className="inline-block rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {v.name}
                  </Link>
                </li>
              )),
            )}
          </ul>
        </section>
      )}

      <nav aria-labelledby="other-categories" className="space-y-3">
        <h2
          id="other-categories"
          className="text-xl font-semibold text-gray-900"
        >
          More tool categories
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.filter((o) => o.slug !== c.slug).map((o) => (
            <li key={o.slug}>
              <Link
                href={categoryPath(o.slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span aria-hidden>{o.icon}</span> {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
