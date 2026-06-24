import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Social Card Generator — Create 1080×1080 Share Cards | Emojar',
  description:
    'Design a 1080×1080 social media card with emoji background patterns, custom text, and colors. Download as PNG for Instagram, Twitter, or any platform. Free, no account needed.',
  keywords: [
    'emoji social card',
    'social media card generator',
    'instagram post generator',
    'emoji background card',
    '1080x1080 card',
    'quote card generator',
    'emoji card maker',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-card' },
  openGraph: {
    title:
      'Emoji Social Card Generator — Create 1080×1080 Share Cards | Emojar',
    description:
      'Design a 1080×1080 social media card with emoji patterns and custom text.',
    url: 'https://emojar.com/emoji-card',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title:
      'Emoji Social Card Generator — Create 1080×1080 Share Cards | Emojar',
    description:
      'Create 1080×1080 social cards with emoji backgrounds and custom text. Free.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
