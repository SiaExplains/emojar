import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Puzzle (Memory Match) | Emojar Games',
  description:
    'Flip cards to find matching emoji pairs. Choose easy (4×4), medium (6×6), or hard (8×8) difficulty and train your memory with hundreds of different emojis.',
  alternates: { canonical: 'https://emojar.com/games/emoji-puzzle' },
  openGraph: {
    title: 'Emoji Puzzle (Memory Match) | Emojar Games',
    description:
      'Flip cards and find matching emoji pairs. Three difficulty levels — easy, medium, or hard.',
    url: 'https://emojar.com/games/emoji-puzzle',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Puzzle (Memory Match) | Emojar Games',
    description: 'Flip cards and match emoji pairs to clear the board.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiPuzzleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-puzzle" />
    </>
  );
}
