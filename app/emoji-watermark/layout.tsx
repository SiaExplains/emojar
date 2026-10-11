import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Emoji Watermark Tool — Add Emoji to Photos | Emojar',
  description:
    'Upload any photo and add an emoji watermark. Choose position, size, and opacity. Download the composited image as PNG. Free, in-browser, no upload to server.',
  keywords: [
    'emoji watermark',
    'add emoji to photo',
    'image watermark tool',
    'emoji overlay',
    'photo emoji stamp',
    'watermark generator',
    'emoji on image',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-watermark' },
  openGraph: {
    title: 'Emoji Watermark Tool — Add Emoji to Photos | Emojar',
    description:
      'Add an emoji watermark to any photo. Pick position, size, opacity and download.',
    url: 'https://emojar.com/emoji-watermark',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '😀',
      'Emoji Watermark Tool — Add Emoji to Photos',
      'Add an emoji watermark to any photo. Pick position, size, opacity and download.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Watermark Tool — Add Emoji to Photos | Emojar',
    description:
      'Add emoji watermarks to photos. Free, in-browser, no upload required.',
    images: ogImages(
      '😀',
      'Emoji Watermark Tool — Add Emoji to Photos',
      'Add an emoji watermark to any photo. Pick position, size, opacity and download.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function EmojiWatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-watermark" />
    </>
  );
}
