import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { HeaderLogo } from '@/components/HeaderLogo/HeaderLogo.component';
import BackToTopButton from '@/components/BackToTopButton';
import MainMenu from '@/components/MainMenu/MainMenu.compontent';

const description =
  'Search, copy and paste emojis instantly. Fast, clean, mobile-friendly.';

export const metadata: Metadata = {
  title: 'Emojar | All the emojis in one jar.',
  description,
  keywords: [
    'emoji',
    'copy emoji',
    'paste emoji',
    'emoji keyboard',
    'smileys',
    'emojar',
  ],
  openGraph: {
    title: 'Emojar | All the emojis in one jar.',
    description,
    url: 'https://emojar.com',
    siteName: 'Emojar',
    type: 'website',
  },
  icons: { icon: 'favicon.ico' },
  manifest: 'manifest.webmanifest',
  robots: { index: true, follow: true },
  metadataBase: new URL('https://emojar.com'),
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4461604896559377',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4461604896559377';

  return (
    <html lang="en">
      <body className="min-h-screen">
        {/*
          AdSense + Google Funding Choices:
          Always load adsbygoogle.js unconditionally. Funding Choices (configured
          in the AdSense / Google Ad Manager UI) intercepts this script for
          EEA/UK/Swiss visitors and handles TCF v2.2 consent automatically.
          No localStorage gating needed — Google controls consent enforcement.
        */}
        {clientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="logo-container flex-shrink-0">
              <Link href="/" className="font-semibold">
                <HeaderLogo />
              </Link>
            </div>
            <div className="flex-1" />
            <div className="flex-shrink-0">
              <MainMenu />
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        <BackToTopButton />

        <footer className="border-t py-8 text-sm">
          <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Emojar</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/impressum">Impressum</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
