import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Wordle | Emojar Games',
  description:
    'Guess the 5-letter emoji name in 6 tries. Green = right spot, yellow = wrong spot, gray = not in word. A new emoji name every game!',
  alternates: { canonical: 'https://emojar.com/games/emoji-wordle' },
  openGraph: {
    title: 'Emoji Wordle | Emojar Games',
    description:
      'Guess the 5-letter emoji name in 6 tries. A fun word puzzle powered by real emoji names.',
    url: 'https://emojar.com/games/emoji-wordle',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Wordle',
      'Guess the 5-letter emoji name in 6 tries. A fun word puzzle powered by real emoji names.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Wordle | Emojar Games',
    description: 'Guess the emoji name in 6 tries — Wordle with emojis!',
    images: ogImages(
      '🎮',
      'Emoji Wordle',
      'Guess the 5-letter emoji name in 6 tries. A fun word puzzle powered by real emoji names.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function EmojiWordleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-wordle" />
    </>
  );
}
