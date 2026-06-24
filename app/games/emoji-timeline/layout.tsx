import type { Metadata } from 'next';

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
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Timeline Challenge | Emojar Games',
    description: 'Can you sort emojis by their Unicode release date?',
  },
  robots: { index: true, follow: true },
};

export default function EmojiTimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
