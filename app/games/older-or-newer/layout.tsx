import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Older or Newer — Emoji Edition | Emojar Games',
  description:
    'Guess which emoji is older — two emojis appear side by side and you pick which came first in the Unicode standard. How well do you know emoji history?',
  alternates: { canonical: 'https://emojar.com/games/older-or-newer' },
  openGraph: {
    title: 'Older or Newer — Emoji Edition | Emojar Games',
    description:
      'Pick which of two emojis was added to Unicode first. Test your knowledge of emoji history.',
    url: 'https://emojar.com/games/older-or-newer',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Older or Newer — Emoji Edition',
      'Pick which of two emojis was added to Unicode first. Test your knowledge of emoji history.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Older or Newer — Emoji Edition | Emojar Games',
    description: 'Which emoji is older? Guess and test your emoji history.',
    images: ogImages(
      '🎮',
      'Older or Newer — Emoji Edition',
      'Pick which of two emojis was added to Unicode first. Test your knowledge of emoji history.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function OlderOrNewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="older-or-newer" />
    </>
  );
}
