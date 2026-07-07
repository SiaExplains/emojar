import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Guess the Flag | Emojar Games',
  description:
    'Test your world geography knowledge — pick the correct country name for each flag emoji. How many of 250+ country flags can you identify?',
  alternates: { canonical: 'https://emojar.com/games/guess-the-flag' },
  openGraph: {
    title: 'Guess the Flag | Emojar Games',
    description:
      'Pick the correct country for each flag emoji. Test your world geography with 250+ flags.',
    url: 'https://emojar.com/games/guess-the-flag',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Guess the Flag | Emojar Games',
    description: 'Identify 250+ country flags from their emoji.',
  },
  robots: { index: true, follow: true },
};

export default function GuessFlagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="guess-the-flag" />
    </>
  );
}
