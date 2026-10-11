import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Favicon Generator — Create Tiny Emoji Icons | Emojar',
  description:
    'Generate a favicon from any emoji. Choose 16×16, 32×32, 48×48, or 64×64 px and download a PNG ready to use as your website icon. Free, instant, no account needed.',
  keywords: [
    'emoji favicon',
    'favicon generator',
    'emoji icon',
    'website favicon',
    'favicon png',
    'emoji to favicon',
    'site icon emoji',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-favicon' },
  openGraph: {
    title: 'Emoji Favicon Generator — Create Tiny Emoji Icons | Emojar',
    description:
      'Generate a PNG favicon from any emoji in seconds. Pick a size and download.',
    url: 'https://emojar.com/emoji-favicon',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '😀',
      'Emoji Favicon Generator — Create Tiny Emoji Icons',
      'Generate a PNG favicon from any emoji in seconds. Pick a size and download.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Favicon Generator — Create Tiny Emoji Icons | Emojar',
    description:
      'Generate a PNG favicon from any emoji. Free, instant download.',
    images: ogImages(
      '😀',
      'Emoji Favicon Generator — Create Tiny Emoji Icons',
      'Generate a PNG favicon from any emoji in seconds. Pick a size and download.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function EmojieFaviconLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-favicon" />
    </>
  );
}
