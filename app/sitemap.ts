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
    '/games/emoji-puzzle',
    '/games/older-or-newer',
    '/games/guess-the-animal',
    '/games/odd-one-out',
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
    '/blog/emojar-may-2026-updates',
    '/blog/emoji-bubble-shooter-game-guide',
    '/blog/emoji-hangman-game-guide',
    '/blog/emoji-minesweeper-game-guide',
    '/blog/emoji-puzzle-game',
    '/blog/emoji-snake-game-guide',
    '/blog/emoji-xo-game-guide',
    '/blog/guess-the-flag-game',
    '/blog/older-or-newer-game',
    '/blog/guess-the-animal-game',
    '/blog/odd-one-out-game',
  ].map((path) => ({ url: `${base}${path}`, lastModified: now }));

  const categories = Array.from(new Set(data.map((e) => e.category)));
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${base}/category/${encodeURIComponent(cat)}`,
    lastModified: now,
  }));

  const emojiRoutes: MetadataRoute.Sitemap = data.map((e) => ({
    url: `${base}/emoji/${e.slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...categoryRoutes, ...emojiRoutes];
}
