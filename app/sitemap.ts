import type { MetadataRoute } from 'next';
import data from '@/data/emojis.json';
import BLOG_POSTS_DATA from '@/data/blog-posts-data';
import { publishedGuides } from '@/lib/blog/guides';
import {
  CATEGORIES,
  TOOLS,
  TOOLS_UPDATED,
  categoryPath,
  toolPath,
  variantPath,
} from '@/lib/online-tools/registry';

// Stable build date — emoji/static content doesn't change at runtime.
// Using a fixed date avoids Google treating every deploy as a full content refresh.
const SITE_LAUNCH = new Date('2024-01-01');
const LAST_UPDATED = new Date('2026-05-14');

// Re-generated daily so newly published guides appear on their date.
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://emojar.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: new Date(TOOLS_UPDATED),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/emoji`,
      lastModified: new Date(TOOLS_UPDATED),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/categories`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/personality`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-to-png`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-tools`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-favicon`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-color-palette`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-watermark`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-card`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-inspector`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/emoji-kitchen`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/games`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/xo`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/hangman`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/snake`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/bubble-shooter`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/minesweeper`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/guess-the-flag`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/emoji-puzzle`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/older-or-newer`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/guess-the-animal`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/odd-one-out`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/games/emoji-wordle`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/emoji-2048`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/whack-a-mole`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/speed-sort`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/emoji-timeline`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/emoji-pictionary`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/missing-piece`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/games/story-builder`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/emoji-collections/events`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/collection`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/collection/alphabet`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/collection/detail`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/table/emoji-alphabet-shaped`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/about`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${base}/impressum`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const categories = Array.from(new Set(data.map((e) => e.category)));
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/category/${encodeURIComponent(cat)}`,
    lastModified: LAST_UPDATED,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const emojiRoutes: MetadataRoute.Sitemap = data.map((e) => ({
    url: `${base}/emoji/${e.slug}`,
    lastModified: SITE_LAUNCH,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const toolsUpdated = new Date(TOOLS_UPDATED);
  const onlineToolRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/online-tool`,
      lastModified: toolsUpdated,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...CATEGORIES.map((c) => ({
      url: `${base}${categoryPath(c.slug)}`,
      lastModified: toolsUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...TOOLS.map((t) => ({
      url: `${base}${toolPath(t)}`,
      lastModified: toolsUpdated,
      changeFrequency: 'monthly' as const,
      priority: t.popular ? 0.9 : 0.8,
    })),
    ...TOOLS.flatMap((t) =>
      (t.variants ?? []).map((v) => ({
        url: `${base}${variantPath(t, v)}`,
        lastModified: toolsUpdated,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ),
  ];

  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/faq`,
      lastModified: toolsUpdated,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Hand-written MDX posts in app/blog/*, listed in data/blog-posts-data.ts.
    ...Object.entries(BLOG_POSTS_DATA).map(([slug, p]) => ({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...publishedGuides().map((g) => ({
      url: `${base}/blog/${g.slug}`,
      lastModified: new Date(g.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticRoutes,
    ...onlineToolRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...emojiRoutes,
  ];
}
