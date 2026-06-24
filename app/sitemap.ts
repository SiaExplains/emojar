import type { MetadataRoute } from 'next';
import data from '@/data/emojis.json';

// Stable build date — emoji/static content doesn't change at runtime.
// Using a fixed date avoids Google treating every deploy as a full content refresh.
const SITE_LAUNCH = new Date('2024-01-01');
const LAST_UPDATED = new Date('2026-05-14');

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://emojar.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 1.0,
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
    // Blog posts
    {
      url: `${base}/blog/emoji-events-collection`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/odd-one-out-game`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/guess-the-animal-game`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/older-or-newer-game`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-puzzle-game`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emojar-may-2026-updates`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emojar-games-launched`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-tools-collection-2026`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-xo-game-guide`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-snake-game-guide`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-minesweeper-game-guide`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-hangman-game-guide`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-bubble-shooter-game-guide`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/guess-the-flag-game`,
      lastModified: new Date('2026-05-13'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/seo-indexation-recovery`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/blog/find-your-emoji-personality`,
      lastModified: new Date('2026-05-25'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/emoji-to-png-download`,
      lastModified: new Date('2026-06-19'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/homepage-redesign-june-2026`,
      lastModified: new Date('2026-06-20'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/blog/emoji-games-batch-2`,
      lastModified: new Date('2026-06-24'),
      changeFrequency: 'monthly',
      priority: 0.7,
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

  return [...staticRoutes, ...categoryRoutes, ...emojiRoutes];
}
