import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Story Builder | Emojar Games',
  description:
    'Pick 6 emojis to build a unique story! Choose from emoji options for each chapter, then share your 6-emoji tale.',
  alternates: { canonical: 'https://emojar.com/games/story-builder' },
  openGraph: {
    title: 'Emoji Story Builder | Emojar Games',
    description:
      'Build a 6-chapter emoji story by picking emojis — then share your unique tale!',
    url: 'https://emojar.com/games/story-builder',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Story Builder',
      'Build a 6-chapter emoji story by picking emojis — then share your unique tale!',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Story Builder | Emojar Games',
    description:
      'Pick emojis for each chapter and build your unique emoji story!',
    images: ogImages(
      '🎮',
      'Emoji Story Builder',
      'Build a 6-chapter emoji story by picking emojis — then share your unique tale!',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function StoryBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="story-builder" />
    </>
  );
}
