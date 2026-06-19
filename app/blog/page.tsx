import type { Metadata } from 'next';
import Link from 'next/link';
import { POST_TAGS } from '@/data/post-tags';

export const metadata: Metadata = {
  title: 'Blog | Emojar',
  description: 'News, updates, and emoji tips from the Emojar team.',
  alternates: { canonical: 'https://emojar.com/blog' },
  openGraph: {
    title: 'Emojar Blog',
    description: 'News, updates, and emoji tips from the Emojar team.',
    url: 'https://emojar.com/blog',
    siteName: 'Emojar',
    type: 'website',
  },
  keywords: [
    'emoji blog',
    'emoji tips',
    'emoji games',
    'emojar updates',
    'emoji news',
  ],
  twitter: {
    card: 'summary',
    title: 'Emojar Blog',
    description: 'News, updates, and emoji tips from the Emojar team.',
  },
  robots: { index: true, follow: true },
};

const posts = [
  {
    slug: 'emoji-to-png-download',
    title: 'Download Any Emoji as a PNG Image — Free, Instant, No Sign-up',
    date: '2026-06-19',
    description:
      'The Emojar Emoji to PNG tool lets you convert any of the 3,790 emojis to a high-quality image. Choose your size, background, and padding — then download in one click.',
  },
  {
    slug: 'find-your-emoji-personality',
    title:
      'Find Your Emoji Personality — A Character Quiz Backed by Psychology',
    date: '2026-05-25',
    description:
      'Answer 12 personality-science questions and discover which 5 emojis match your character. Then download or share your personalised emoji card.',
  },
  {
    slug: 'seo-indexation-recovery',
    title: 'How We Recovered Emojar From a Google Indexation Drop',
    date: '2026-05-14',
    description:
      'Emojar lost most of its indexed pages in early 2026. Here is exactly what caused it — server errors, a www redirect conflict, dead sitemap URLs — and how we fixed everything.',
  },
  {
    slug: 'emoji-events-collection',
    title: 'Emoji Collections for Every Holiday & Event',
    date: '2026-05-14',
    description:
      "Curated emoji packs for 15 major holidays — New Year, Valentine's Day, Halloween, Christmas, Diwali, and more. Copy a single emoji or the whole set.",
  },
  {
    slug: 'odd-one-out-game',
    title: "Odd One Out — Spot the Emoji That Doesn't Belong",
    date: '2026-05-14',
    description:
      "Five emojis, four share a theme — one doesn't fit. A new emoji logic game with 50+ curated rounds across food, animals, sports, nature, and more.",
  },
  {
    slug: 'guess-the-animal-game',
    title: 'Guess the Animal — Name the Emoji, Learn a Fact',
    date: '2026-05-13',
    description:
      'A new emoji quiz covering all 130 animal emojis — mammals, birds, reptiles, marine life, and more. Every round ends with a fun animal fact.',
  },
  {
    slug: 'older-or-newer-game',
    title: 'Older or Newer — How Well Do You Know Emoji History?',
    date: '2026-05-13',
    description:
      'A new emoji quiz game: two emojis side by side — guess which one was added to Unicode first. 3,700+ emojis spanning 16 versions from 2010 to 2024.',
  },
  {
    slug: 'emoji-puzzle-game',
    title: 'Emoji Puzzle — Test Your Memory with Emoji Cards',
    date: '2026-05-13',
    description:
      'Flip emoji cards and find every matching pair. Our new memory match game has three difficulty levels — Easy (4×4), Medium (6×6), and Hard (8×8).',
  },
  {
    slug: 'emojar-may-2026-updates',
    title: "What's New on Emojar — May 2026 Updates",
    date: '2026-05-13',
    description:
      'A roundup of recent improvements: emoji games, category breadcrumbs, a refreshed homepage, an improved About page, and more.',
  },
  {
    slug: 'emojar-games-launched',
    title: 'Emojar Games Is Live — Play Emoji Mini-Games Now!',
    date: '2026-05-13',
    description:
      'We just launched the Emojar Games page. Play five emoji-themed mini-games: XO, Snake, Minesweeper, Hangman, and Bubble Shooter — all free, right in your browser.',
  },
  {
    slug: 'emoji-xo-game-guide',
    title: 'How to Play Emoji XO (Tic-Tac-Toe) on Emojar',
    date: '2026-05-13',
    description:
      'Rules, board size options, custom emoji pieces, AI opponent strategy, and tips for winning the Emoji XO game.',
  },
  {
    slug: 'emoji-snake-game-guide',
    title: 'How to Play Emoji Snake on Emojar',
    date: '2026-05-13',
    description:
      'Controls, survival tips, and high-score strategy for the Emoji Snake game on Emojar.',
  },
  {
    slug: 'emoji-minesweeper-game-guide',
    title: 'How to Play Emoji Minesweeper on Emojar',
    date: '2026-05-13',
    description:
      'Number logic, flagging strategy, and pattern-reading tips for clearing the emoji mine field on Emojar.',
  },
  {
    slug: 'emoji-hangman-game-guide',
    title: 'How to Play Emoji Hangman on Emojar',
    date: '2026-05-13',
    description:
      'Rules, best-first-letter strategy, and tips for guessing emoji Unicode names in the Emojar Hangman game.',
  },
  {
    slug: 'emoji-bubble-shooter-game-guide',
    title: 'How to Play Emoji Bubble Shooter on Emojar',
    date: '2026-05-13',
    description:
      'Aiming, wall bounces, chain reactions, and score-maximising tips for the Emoji Bubble Shooter game.',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Blog</h1>
      <p className="text-gray-500 mb-8">
        News, updates, and emoji tips from the Emojar team.
      </p>

      <ul className="space-y-3">
        {posts.map((post) => {
          const tags = POST_TAGS[post.slug] ?? [];
          return (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:bg-gray-50 transition-colors no-underline hover:no-underline"
              >
                <time className="text-xs text-gray-400 tracking-wide uppercase">
                  {new Date(post.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <h2 className="mt-1 text-lg font-semibold leading-snug">
                  {post.title}
                </h2>
                <p className="mt-1 text-gray-500 text-sm leading-6">
                  {post.description}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
