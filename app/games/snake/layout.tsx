import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Snake | Emojar Games',
  description:
    'Guide your emoji snake across the grid, eat food emojis to grow, and avoid hitting the walls or yourself. How long can your snake get?',
  alternates: { canonical: 'https://emojar.com/games/snake' },
  openGraph: {
    title: 'Emoji Snake | Emojar Games',
    description:
      'Guide your emoji snake, eat food emojis to grow, and avoid the walls. A classic snake game with emoji flair.',
    url: 'https://emojar.com/games/snake',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Snake | Emojar Games',
    description: 'Guide your emoji snake and eat food emojis to grow.',
  },
  robots: { index: true, follow: true },
};

export default function SnakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
