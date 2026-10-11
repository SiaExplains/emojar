import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Bubble Shooter | Emojar Games',
  description:
    'Aim and shoot colourful emoji bubbles to clear the board. Match three or more of the same emoji to pop them before they reach the bottom.',
  alternates: { canonical: 'https://emojar.com/games/bubble-shooter' },
  openGraph: {
    title: 'Emoji Bubble Shooter | Emojar Games',
    description:
      'Aim and shoot emoji bubbles to clear the board. Match three or more to pop them.',
    url: 'https://emojar.com/games/bubble-shooter',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Bubble Shooter',
      'Aim and shoot emoji bubbles to clear the board. Match three or more to pop them.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Bubble Shooter | Emojar Games',
    description: 'Shoot emoji bubbles, match three or more to pop them.',
    images: ogImages(
      '🎮',
      'Emoji Bubble Shooter',
      'Aim and shoot emoji bubbles to clear the board. Match three or more to pop them.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function BubbleShooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="bubble-shooter" />
    </>
  );
}
