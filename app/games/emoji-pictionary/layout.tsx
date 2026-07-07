import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Pictionary | Emojar Games',
  description:
    'Guess the word from an emoji clue! 60 seconds to solve as many as you can. 40 emoji clues to decode.',
  alternates: { canonical: 'https://emojar.com/games/emoji-pictionary' },
  openGraph: {
    title: 'Emoji Pictionary | Emojar Games',
    description:
      'What does 🌍 mean? Guess the word from emoji clues — 60 seconds on the clock!',
    url: 'https://emojar.com/games/emoji-pictionary',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Pictionary | Emojar Games',
    description: 'Decode emoji clues as fast as you can — 60-second challenge!',
  },
  robots: { index: true, follow: true },
};

export default function EmojiPictionaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-pictionary" />
    </>
  );
}
