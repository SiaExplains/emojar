import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Speed Sort | Emojar Games',
  description:
    'Sort emojis into the right category before time runs out! 10 rounds, 3 seconds each. How long can you keep your streak?',
  alternates: { canonical: 'https://emojar.com/games/speed-sort' },
  openGraph: {
    title: 'Emoji Speed Sort | Emojar Games',
    description:
      'Categorize emojis fast! 3-second timer per round, 10 rounds total.',
    url: 'https://emojar.com/games/speed-sort',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Speed Sort',
      'Categorize emojis fast! 3-second timer per round, 10 rounds total.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Speed Sort | Emojar Games',
    description:
      'Sort emojis into categories before the timer runs out — 10 rounds!',
    images: ogImages(
      '🎮',
      'Emoji Speed Sort',
      'Categorize emojis fast! 3-second timer per round, 10 rounds total.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function SpeedSortLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="speed-sort" />
    </>
  );
}
