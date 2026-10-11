import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

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
    images: ogImages(
      '🎮',
      'Emoji Whack-a-Mole',
      'Tap emoji moles before they hide! Fast-paced emoji reflex game.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Whack-a-Mole | Emojar Games',
    description: 'Tap emojis as fast as you can — 30-second reflex challenge!',
    images: ogImages(
      '🎮',
      'Emoji Whack-a-Mole',
      'Tap emoji moles before they hide! Fast-paced emoji reflex game.',
    ).twitter,
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
