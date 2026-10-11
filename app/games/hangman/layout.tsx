import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Hangman | Emojar Games',
  description:
    'Guess the hidden emoji name letter by letter before you run out of tries. A fun word-guessing game powered by 3,700+ real emoji names.',
  alternates: { canonical: 'https://emojar.com/games/hangman' },
  openGraph: {
    title: 'Emoji Hangman | Emojar Games',
    description:
      'Guess the hidden emoji name letter by letter. A fun word-guessing game powered by real emoji names.',
    url: 'https://emojar.com/games/hangman',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Hangman',
      'Guess the hidden emoji name letter by letter. A fun word-guessing game powered by real emoji names.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Hangman | Emojar Games',
    description: 'Guess the emoji name letter by letter before you run out.',
    images: ogImages(
      '🎮',
      'Emoji Hangman',
      'Guess the hidden emoji name letter by letter. A fun word-guessing game powered by real emoji names.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function HangmanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="hangman" />
    </>
  );
}
