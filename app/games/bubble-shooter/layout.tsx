import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

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
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Bubble Shooter | Emojar Games',
    description: 'Shoot emoji bubbles, match three or more to pop them.',
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
