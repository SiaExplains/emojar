import type { Metadata } from 'next';
import Link from 'next/link';

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
  robots: { index: true, follow: true },
};

const posts = [
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
      <p className="text-gray-500 mb-10">
        News, updates, and emoji tips from the Emojar team.
      </p>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:bg-gray-50 transition-colors no-underline hover:no-underline"
            >
              <time className="text-xs text-gray-400 tracking-wide uppercase">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-gray-500 text-sm leading-6">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
