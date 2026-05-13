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
    slug: 'emojar-games-launched',
    title: 'Emojar Games Is Live — Play Emoji Mini-Games Now!',
    date: '2026-05-13',
    description:
      'We just launched the Emojar Games page. Play five emoji-themed mini-games: XO, Snake, Minesweeper, Hangman, and Bubble Shooter — all free, right in your browser.',
  },
];

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">
        News, updates, and emoji tips from the Emojar team.
      </p>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <time className="text-xs text-gray-400 tracking-wide uppercase">
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h2 className="mt-1 text-xl font-semibold">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-500 text-sm leading-6">
                {post.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
