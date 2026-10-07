// Single source of truth for the Online Tools section: routes, names,
// metadata, navigation, sitemap and llms.txt are all derived from here.

import { CATEGORIES } from './categories';
import { CALCULATOR_TOOLS } from './tools/calculators';
import { COLOR_TOOLS } from './tools/color-tools';
import { DATE_TIME_TOOLS } from './tools/date-time-tools';
import { DEVELOPER_TOOLS } from './tools/developer-tools';
import { IMAGE_TOOLS } from './tools/image-tools';
import { PDF_TOOLS } from './tools/pdf-tools';
import { SECURITY_TOOLS } from './tools/security-generators';
import { TEXT_TOOLS } from './tools/text-tools';
import { UNIT_CONVERTERS } from './tools/unit-converters';
import { AUDIO_VIDEO_TOOLS } from './tools/audio-video-tools';
import { DEVICE_TESTS } from './tools/device-tests';
import type {
  CategoryDefinition,
  CategorySlug,
  ToolDefinition,
  ToolVariant,
} from './types';

export const SITE_URL = 'https://emojar.com';
export const TOOLS_BASE = '/online-tool';
/** Bump when tool content changes meaningfully; used for sitemap lastModified. */
export const TOOLS_UPDATED = '2026-10-07';

export const TOOLS: ToolDefinition[] = [
  ...IMAGE_TOOLS,
  ...PDF_TOOLS,
  ...DEVELOPER_TOOLS,
  ...TEXT_TOOLS,
  ...COLOR_TOOLS,
  ...CALCULATOR_TOOLS,
  ...UNIT_CONVERTERS,
  ...SECURITY_TOOLS,
  ...DATE_TIME_TOOLS,
  ...AUDIO_VIDEO_TOOLS,
  ...DEVICE_TESTS,
];

export { CATEGORIES };

const toolBySlug = new Map(TOOLS.map((t) => [t.slug, t]));
const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categoryBySlug.get(slug as CategorySlug);
}

export function getTool(slug: string): ToolDefinition | undefined {
  return toolBySlug.get(slug);
}

/** Tool lookup by URL segments. Only the canonical category matches, so cross-listed tools have one URL. */
export function getToolInCategory(
  category: string,
  slug: string,
): ToolDefinition | undefined {
  const tool = toolBySlug.get(slug);
  return tool && tool.category === category ? tool : undefined;
}

export function getVariant(
  tool: ToolDefinition,
  slug: string,
): ToolVariant | undefined {
  return tool.variants?.find((v) => v.slug === slug);
}

/** Tools listed in a category: its own tools first, then cross-listed ones. */
export function toolsInCategory(slug: CategorySlug): ToolDefinition[] {
  return [
    ...TOOLS.filter((t) => t.category === slug),
    ...TOOLS.filter((t) => t.alsoIn?.includes(slug)),
  ];
}

export function relatedTools(
  tool: ToolDefinition,
  limit = 6,
): ToolDefinition[] {
  const explicit = tool.relatedTools
    .map((s) => toolBySlug.get(s))
    .filter((t): t is ToolDefinition => !!t && t.slug !== tool.slug);
  const fill = toolsInCategory(tool.category).filter(
    (t) => t.slug !== tool.slug && !explicit.includes(t),
  );
  return [...explicit, ...fill].slice(0, limit);
}

export function popularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}

export const categoryPath = (slug: string) => `${TOOLS_BASE}/${slug}`;
export const toolPath = (tool: Pick<ToolDefinition, 'category' | 'slug'>) =>
  `${TOOLS_BASE}/${tool.category}/${tool.slug}`;
export const variantPath = (tool: ToolDefinition, variant: ToolVariant) =>
  `${toolPath(tool)}/${variant.slug}`;
export const absolute = (path: string) => `${SITE_URL}${path}`;

/** Compact, serialisable entries for client-side search. */
export type SearchEntry = {
  name: string;
  description: string;
  href: string;
  icon: string;
  category: string;
  keywords: string;
};

export function searchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = TOOLS.map((t) => ({
    name: t.name,
    description: t.shortDescription,
    href: toolPath(t),
    icon: t.icon,
    category: getCategory(t.category)?.name ?? '',
    keywords: t.keywords.join(' '),
  }));
  for (const t of TOOLS) {
    for (const v of t.variants ?? []) {
      entries.push({
        name: v.name,
        description: v.metaDescription,
        href: variantPath(t, v),
        icon: t.icon,
        category: getCategory(t.category)?.name ?? '',
        keywords: (v.keywords ?? []).join(' '),
      });
    }
  }
  return entries;
}
