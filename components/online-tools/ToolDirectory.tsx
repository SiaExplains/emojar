import Link from 'next/link';
import { sectionTitle, tileIcon } from '@/components/ui/styles';
import { tintFor } from '@/lib/online-tools/category-style';
import { externalToolsIn } from '@/lib/online-tools/external';
import {
  CATEGORIES,
  categoryPath,
  featuredTools,
  getCategory,
  toolPath,
  toolsInCategory,
} from '@/lib/online-tools/registry';
import { CategoryFilter } from './CategoryFilter';
import { ToolGrid } from './ToolCard';

/** First sentence of a category intro, for a one-line section subtitle. */
const firstSentence = (text: string) => {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
};

/**
 * Every tool as a tile, grouped by category, under filter pills. Used by the
 * homepage and the /online-tool hub. All sections are server-rendered, so each
 * tool page gets a crawlable link from here.
 */
export function ToolDirectory({
  fullIntro = false,
}: {
  /** Show the whole category intro instead of its first sentence. */
  fullIntro?: boolean;
}) {
  return (
    <CategoryFilter
      options={CATEGORIES.map((c) => ({ slug: c.slug, label: c.shortName }))}
    >
      <section
        data-cat="popular"
        aria-labelledby="popular"
        className="space-y-4"
      >
        <SectionHeader
          id="popular"
          icon="⭐"
          title="Popular tools"
          subtitle="The tools people reach for most often."
        />
        <ToolGrid
          tools={featuredTools().map((t) => ({
            href: toolPath(t),
            name: t.name,
            description: t.shortDescription,
            icon: t.icon,
            tint: t.category,
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
            data-cat={c.slug}
            aria-labelledby={`h-${c.slug}`}
            className="scroll-mt-24 space-y-4"
          >
            <SectionHeader
              id={`h-${c.slug}`}
              icon={c.icon}
              tint={c.slug}
              title={c.name}
              subtitle={fullIntro ? c.intro : firstSentence(c.intro)}
              link={{
                href: categoryPath(c.slug),
                label: `All ${tools.length} ${c.shortName.toLowerCase()} tools`,
              }}
            />
            <ToolGrid
              tools={[
                ...tools.map((t) => ({
                  href: toolPath(t),
                  name: t.name,
                  description: t.shortDescription,
                  icon: t.icon,
                  tint: c.slug,
                })),
                ...externalToolsIn(c.slug).map((t) => ({
                  href: t.url,
                  name: t.name,
                  description: t.description,
                  icon: t.icon,
                  tint: c.slug,
                  external: true,
                })),
              ]}
            />
          </section>
        );
      })}
    </CategoryFilter>
  );
}

export function SectionHeader({
  id,
  icon,
  tint,
  title,
  subtitle,
  link,
}: {
  id: string;
  icon?: string;
  tint?: string;
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-[#e8e8f0] pb-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span aria-hidden className={`${tileIcon} ${tintFor(tint)}`}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 id={id} className={sectionTitle}>
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 max-w-3xl text-sm leading-relaxed text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {link && (
        <Link
          href={link.href}
          className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
