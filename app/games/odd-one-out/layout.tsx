import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Odd One Out — Emoji Edition | Emojar Games',
  description:
    'Four emojis belong to the same group — one does not. Can you spot the odd one out? A quick-fire emoji quiz that tests your pattern recognition.',
  alternates: { canonical: 'https://emojar.com/games/odd-one-out' },
  openGraph: {
    title: 'Odd One Out — Emoji Edition | Emojar Games',
    description:
      'Four emojis, one does not belong. Find the odd one out in this quick emoji quiz.',
    url: 'https://emojar.com/games/odd-one-out',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Odd One Out — Emoji Edition',
      'Four emojis, one does not belong. Find the odd one out in this quick emoji quiz.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odd One Out — Emoji Edition | Emojar Games',
    description: 'Find the emoji that does not belong in each group.',
    images: ogImages(
      '🎮',
      'Odd One Out — Emoji Edition',
      'Four emojis, one does not belong. Find the odd one out in this quick emoji quiz.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function OddOneOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="odd-one-out" />
    </>
  );
}
