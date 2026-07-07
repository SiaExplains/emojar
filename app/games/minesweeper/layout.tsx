import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Minesweeper | Emojar Games',
  description:
    'Uncover safe emoji tiles and flag hidden mines. Choose easy, medium, or hard difficulty — the classic minesweeper logic game with an emoji twist.',
  alternates: { canonical: 'https://emojar.com/games/minesweeper' },
  openGraph: {
    title: 'Emoji Minesweeper | Emojar Games',
    description:
      'Uncover safe emoji tiles and flag hidden mines. Classic minesweeper with an emoji twist.',
    url: 'https://emojar.com/games/minesweeper',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Minesweeper | Emojar Games',
    description: 'Uncover safe emoji tiles and flag the mines.',
  },
  robots: { index: true, follow: true },
};

export default function MinesweeperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="minesweeper" />
    </>
  );
}
