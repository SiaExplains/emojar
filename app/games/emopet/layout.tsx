import type { Metadata, Viewport } from 'next';

// Emopet is a full-viewport 3D pet game. The main-site chrome (header, footer,
// AdSense) is stripped for /games/emopet by the ChromeGate in the root layout;
// this nested layout supplies the game's own full-height surface and overrides
// the viewport/theme for a mobile web-app feel.

export const metadata: Metadata = {
  title: 'Emopet — Your 3D Emoji Pet',
  description: 'Adopt, feed, and care for your own 3D emoji pet.',
  // Keep the game out of the main site's search surface for now.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#0b1020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function EmopetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#0b1020] text-white antialiased">
      {children}
    </div>
  );
}
