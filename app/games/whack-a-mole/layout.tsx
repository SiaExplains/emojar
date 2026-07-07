import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Whack-a-Mole | Emojar Games',
  description:
    'Tap emoji moles before they disappear! 30 seconds to get the highest score. A fast-paced emoji reflex game.',
  alternates: { canonical: 'https://emojar.com/games/whack-a-mole' },
  openGraph: {
    title: 'Emoji Whack-a-Mole | Emojar Games',
    description:
      'Tap emoji moles before they hide! Fast-paced emoji reflex game.',
    url: 'https://emojar.com/games/whack-a-mole',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Whack-a-Mole | Emojar Games',
    description: 'Tap emojis as fast as you can — 30-second reflex challenge!',
  },
  robots: { index: true, follow: true },
};

export default function WhackAMoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="whack-a-mole" />
    </>
  );
}
