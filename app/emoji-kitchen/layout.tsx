import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Kitchen — Mix Two Emoji Together | Emojar',
  description:
    "Combine any two emoji using Google Emoji Kitchen to create fun mashups. Search for two emoji, see the combined result, and download it. Free, powered by Google's emoji blending API.",
  keywords: [
    'emoji kitchen',
    'emoji mashup',
    'combine emoji',
    'emoji mixer',
    'google emoji kitchen',
    'emoji blend',
    'emoji combination',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-kitchen' },
  openGraph: {
    title: 'Emoji Kitchen — Mix Two Emoji Together | Emojar',
    description:
      'Combine two emoji using Google Emoji Kitchen. Search, mix, and download the result.',
    url: 'https://emojar.com/emoji-kitchen',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Kitchen — Mix Two Emoji Together | Emojar',
    description:
      'Mix two emoji together with Google Emoji Kitchen. Free and fun.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiKitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-kitchen" />
    </>
  );
}
