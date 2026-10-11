import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji XO (Tic-Tac-Toe) | Emojar Games',
  description:
    'Play emoji tic-tac-toe against the computer or a friend. Choose your emoji pieces and beat your opponent in classic 3×3, 4×4, or 5×5 grids.',
  alternates: { canonical: 'https://emojar.com/games/xo' },
  openGraph: {
    title: 'Emoji XO (Tic-Tac-Toe) | Emojar Games',
    description:
      'Play emoji tic-tac-toe against the computer or a friend. Choose your emoji pieces and compete.',
    url: 'https://emojar.com/games/xo',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji XO (Tic-Tac-Toe)',
      'Play emoji tic-tac-toe against the computer or a friend. Choose your emoji pieces and compete.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji XO (Tic-Tac-Toe) | Emojar Games',
    description: 'Play emoji tic-tac-toe against the computer or a friend.',
    images: ogImages(
      '🎮',
      'Emoji XO (Tic-Tac-Toe)',
      'Play emoji tic-tac-toe against the computer or a friend. Choose your emoji pieces and compete.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function XoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <StaticPageSection slug="xo" />
    </>
  );
}
