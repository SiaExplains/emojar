import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji to PNG — Download Any Emoji as an Image | Emojar',
  description:
    'Convert any emoji to a high-quality PNG image. Choose size up to 1024×1024, transparent or coloured background, and download in one click. Free, no account needed.',
  keywords: [
    'emoji to png',
    'emoji image download',
    'emoji png download',
    'emoji as image',
    'download emoji',
    'emoji transparent background',
    'emoji sticker',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-to-png' },
  openGraph: {
    title: 'Emoji to PNG — Download Any Emoji as an Image | Emojar',
    description:
      'Convert any emoji to a PNG image. Pick size, background colour, and download in one click.',
    url: 'https://emojar.com/emoji-to-png',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '😀',
      'Emoji to PNG — Download Any Emoji as an Image',
      'Convert any emoji to a PNG image. Pick size, background colour, and download in one click.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji to PNG — Download Any Emoji as an Image | Emojar',
    description:
      'Convert any emoji to a PNG image. Pick size, background colour, and download free.',
    images: ogImages(
      '😀',
      'Emoji to PNG — Download Any Emoji as an Image',
      'Convert any emoji to a PNG image. Pick size, background colour, and download in one click.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function EmojiToPngLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-to-png" />
    </>
  );
}
