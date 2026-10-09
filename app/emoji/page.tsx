import type { Metadata } from 'next';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
import EmojiHub from '@/components/EmojiHub';

const title = `Emoji Search — Copy & Paste ${EMOJI_COUNT_LABEL} Emojis | Emojar`;
const description = `Search and copy any of ${EMOJI_COUNT_LABEL} Unicode emojis with one click. Browse by category, holiday collections and A–Z lists. Free, no sign-up.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: 'https://emojar.com/emoji' },
  openGraph: {
    title,
    description,
    url: 'https://emojar.com/emoji',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
};

export default function EmojiPage() {
  return <EmojiHub />;
}
