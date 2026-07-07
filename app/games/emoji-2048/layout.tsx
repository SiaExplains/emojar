import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji 2048 | Emojar Games',
  description:
    'Classic 2048 with emoji tiles! Slide and merge emojis on a 4×4 grid to reach the 🏆 tile. Track your best score locally.',
  alternates: { canonical: 'https://emojar.com/games/emoji-2048' },
  openGraph: {
    title: 'Emoji 2048 | Emojar Games',
    description:
      'Slide and merge emoji tiles — can you reach the 🏆 2048 tile?',
    url: 'https://emojar.com/games/emoji-2048',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji 2048 | Emojar Games',
    description: 'Merge emoji tiles until you reach 🏆 — the emoji 2048 game!',
  },
  robots: { index: true, follow: true },
};

export default function Emoji2048Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-2048" />
    </>
  );
}
