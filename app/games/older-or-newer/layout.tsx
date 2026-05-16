import type { Metadata } from 'next';

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
  },
  twitter: {
    card: 'summary',
    title: 'Older or Newer — Emoji Edition | Emojar Games',
    description: 'Which emoji is older? Guess and test your emoji history.',
  },
  robots: { index: true, follow: true },
};

export default function OlderOrNewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
