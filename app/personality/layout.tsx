import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Personality Quiz | Find Your Emoji Match | Emojar',
  description:
    'Answer 12 psychology-based questions and discover which 5 emojis match your personality. Share your emoji character card with friends!',
  keywords: [
    'emoji personality quiz',
    'which emoji am i',
    'emoji character test',
    'emoji personality test',
    'find your emoji',
    'emoji match',
  ],
  alternates: { canonical: 'https://emojar.com/personality' },
  openGraph: {
    title: 'Emoji Personality Quiz | Find Your Emoji Match | Emojar',
    description:
      'Answer 12 psychology-based questions and discover which 5 emojis match your personality. Share your emoji character card!',
    url: 'https://emojar.com/personality',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Personality Quiz | Find Your Emoji Match | Emojar',
    description:
      'Answer 12 psychology-based questions and discover which 5 emojis match your personality.',
  },
  robots: { index: true, follow: true },
};

export default function PersonalityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="personality" />
    </>
  );
}
