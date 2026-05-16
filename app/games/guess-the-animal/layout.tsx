import type { Metadata } from 'next';

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
  },
  twitter: {
    card: 'summary',
    title: 'Guess the Animal | Emojar Games',
    description: 'Name the animal from its emoji. How many can you get right?',
  },
  robots: { index: true, follow: true },
};

export default function GuessAnimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
