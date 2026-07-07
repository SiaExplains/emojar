import type { Metadata } from 'next';
import { StaticPageSection } from '@/components/StaticPageSection';

export const metadata: Metadata = {
  title: 'Emoji Color Palette Extractor — Get Colors from Any Emoji | Emojar',
  description:
    'Extract the dominant colors from any emoji and get a ready-to-use color palette with hex codes. Copy colors or download a swatch strip PNG. Free, instant, no account needed.',
  keywords: [
    'emoji color palette',
    'emoji colors',
    'extract colors from emoji',
    'emoji hex codes',
    'color palette generator',
    'emoji color extractor',
    'emoji swatches',
  ],
  alternates: { canonical: 'https://emojar.com/emoji-color-palette' },
  openGraph: {
    title: 'Emoji Color Palette Extractor — Get Colors from Any Emoji | Emojar',
    description:
      'Extract dominant colors from any emoji and copy hex codes instantly.',
    url: 'https://emojar.com/emoji-color-palette',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Color Palette Extractor — Get Colors from Any Emoji | Emojar',
    description: 'Get a hex color palette from any emoji. Free and instant.',
  },
  robots: { index: true, follow: true },
};

export default function EmojiColorPaletteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StaticPageSection slug="emoji-color-palette" />
    </>
  );
}
