import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Guess the Animal | Emojar Games',
  description:
    'An animal emoji appears — can you name it correctly before time runs out? Identify mammals, birds, reptiles, sea creatures, and insects from their emojis.',
  alternates: { canonical: 'https://emojar.com/games/guess-the-animal' },
  openGraph: {
    title: 'Guess the Animal | Emojar Games',
    description:
      'Can you name the animal emoji? Identify mammals, birds, reptiles, and more.',
    url: 'https://emojar.com/games/guess-the-animal',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Guess the Animal',
      'Can you name the animal emoji? Identify mammals, birds, reptiles, and more.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guess the Animal | Emojar Games',
    description: 'Name the animal from its emoji. How many can you get right?',
    images: ogImages(
      '🎮',
      'Guess the Animal',
      'Can you name the animal emoji? Identify mammals, birds, reptiles, and more.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function GuessAnimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="guess-the-animal" />
    </>
  );
}
