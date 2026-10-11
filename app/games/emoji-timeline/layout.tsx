import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Timeline Challenge | Emojar Games',
  description:
    'Arrange 5 emojis from oldest to newest by Unicode version. Do you know your emoji history? 5 rounds, score up to 25 points.',
  alternates: { canonical: 'https://emojar.com/games/emoji-timeline' },
  openGraph: {
    title: 'Emoji Timeline Challenge | Emojar Games',
    description:
      'Sort emojis from oldest to newest Unicode version — test your emoji history knowledge!',
    url: 'https://emojar.com/games/emoji-timeline',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Timeline Challenge',
      'Sort emojis from oldest to newest Unicode version — test your emoji history knowledge!',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Timeline Challenge | Emojar Games',
    description: 'Can you sort emojis by their Unicode release date?',
    images: ogImages(
      '🎮',
      'Emoji Timeline Challenge',
      'Sort emojis from oldest to newest Unicode version — test your emoji history knowledge!',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function EmojiTimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-timeline" />
    </>
  );
}
