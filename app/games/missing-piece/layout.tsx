import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Missing Piece | Emojar Games',
  description:
    'A 3×3 emoji grid with one missing piece. Can you spot which emoji belongs? 10 rounds of emoji logic puzzles.',
  alternates: { canonical: 'https://emojar.com/games/missing-piece' },
  openGraph: {
    title: 'Emoji Missing Piece | Emojar Games',
    description:
      'Find the missing emoji from a 3×3 category grid — 10 rounds of puzzle fun!',
    url: 'https://emojar.com/games/missing-piece',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Missing Piece | Emojar Games',
    description: 'Which emoji is missing from the grid? A 10-round emoji quiz!',
  },
  robots: { index: true, follow: true },
};

export default function MissingPieceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
