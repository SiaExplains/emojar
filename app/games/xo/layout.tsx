import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

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
  },
  twitter: {
    card: 'summary',
    title: 'Emoji XO (Tic-Tac-Toe) | Emojar Games',
    description: 'Play emoji tic-tac-toe against the computer or a friend.',
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
