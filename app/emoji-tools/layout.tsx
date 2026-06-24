import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Tools — Free Online Emoji Utilities | Emojar',
  description:
    '8 free emoji tools: download emoji as PNG, generate favicons, extract color palettes, add watermarks, create social cards, inspect Unicode, and more.',
  alternates: { canonical: 'https://emojar.com/emoji-tools' },
  openGraph: {
    title: 'Emoji Tools — Free Online Emoji Utilities | Emojar',
    description:
      '8 free emoji tools: download emoji as PNG, generate favicons, extract color palettes, add watermarks, create social cards, inspect Unicode, and more.',
    url: 'https://emojar.com/emoji-tools',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Tools — Free Online Emoji Utilities | Emojar',
    description:
      '8 free emoji tools: PNG download, favicon generator, color palette, watermark, social card, Unicode inspector, and more.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
