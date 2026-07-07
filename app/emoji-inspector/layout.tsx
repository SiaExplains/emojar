import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Unicode Inspector — Analyze Codepoints & Bytes | Emojar',
  description:
    'Paste any text or emoji to inspect Unicode codepoints, character names, categories, emoji version, and byte sizes. Great for developers working with encoding and text processing.',
  keywords: [
    'emoji unicode inspector',
    'unicode codepoint lookup',
    'emoji codepoint',
    'character inspector',
    'unicode analyzer',
    'emoji byte size',
    'text unicode tool',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-inspector' },
  openGraph: {
    title: 'Emoji Unicode Inspector — Analyze Codepoints & Bytes | Emojar',
    description:
      'Paste text or emoji to inspect Unicode codepoints, names, categories, and byte sizes.',
    url: 'https://emojar.com/emoji-inspector',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Unicode Inspector — Analyze Codepoints & Bytes | Emojar',
    description:
      'Inspect Unicode codepoints, names, and byte sizes for any emoji or text.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiInspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-inspector" />
    </>
  );
}
