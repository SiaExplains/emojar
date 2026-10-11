import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Snake | Emojar Games',
  description:
    'Guide your emoji snake across the grid, eat food emojis to grow, and avoid hitting the walls or yourself. How long can your snake get?',
  alternates: { canonical: 'https://emojar.com/games/snake' },
  openGraph: {
    title: 'Emoji Snake | Emojar Games',
    description:
      'Guide your emoji snake, eat food emojis to grow, and avoid the walls. A classic snake game with emoji flair.',
    url: 'https://emojar.com/games/snake',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Snake',
      'Guide your emoji snake, eat food emojis to grow, and avoid the walls. A classic snake game with emoji flair.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Snake | Emojar Games',
    description: 'Guide your emoji snake and eat food emojis to grow.',
    images: ogImages(
      '🎮',
      'Emoji Snake',
      'Guide your emoji snake, eat food emojis to grow, and avoid the walls. A classic snake game with emoji flair.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function SnakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="snake" />
    </>
  );
}
