import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

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
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Favicon Generator — Create Tiny Emoji Icons | Emojar',
    description:
      'Generate a PNG favicon from any emoji. Free, instant download.',
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
