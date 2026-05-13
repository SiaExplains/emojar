import type { MetadataRoute } from 'next';
import data from '@/data/emojis.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://emojar.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/categories',
    '/games',
    '/games/xo',
    '/games/hangman',
    '/games/snake',
    '/games/bubble-shooter',
    '/games/minesweeper',
    '/games/guess-the-flag',
    '/table/emoji-alphabet-shaped',
    '/sorted',
    '/sorted/alphabet',
    '/sorted/detail',
    '/about',
    '/contact',
    '/impressum',
    '/privacy',
    '/terms',
    '/blog',
    '/blog/emojar-games-launched',
    '/blog/guess-the-flag-game',
  ].map((path) => ({ url: `${base}${path}`, lastModified: now }));

  const emojiRoutes: MetadataRoute.Sitemap = data.map((e) => ({
    url: `${base}/emoji/${e.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...emojiRoutes];
}
