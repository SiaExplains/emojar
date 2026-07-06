import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { HeaderLogo } from '@/components/HeaderLogo/HeaderLogo.component';
import BackToTopButton from '@/components/BackToTopButton';
import MainMenu from '@/components/MainMenu/MainMenu.compontent';

const description =
  'Your emoji playground — search and copy 3,790 emojis, play 18 emoji games, and use 8 free emoji tools. No sign-up, no ads on tools, free forever.';

export const metadata: Metadata = {
  title: 'Emojar — Emoji Search, Games & Tools',
  description,
  keywords: [
    'emoji',
    'emoji search',
    'copy emoji',
    'emoji games',
    'emoji tools',
    'emoji to png',
    'emoji keyboard',
    'emojar',
  ],
  openGraph: {
    title: 'Emojar — Emoji Search, Games & Tools',
    description,
    url: 'https://emojar.com',
    siteName: 'Emojar',
    type: 'website',
    images: [{ url: 'https://emojar.com/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emojar — Emoji Search, Games & Tools',
    description,
    images: ['https://emojar.com/og-default.png'],
  },
  icons: { icon: 'favicon.ico', apple: 'apple-icon.png' },
  manifest: 'manifest.webmanifest',
  robots: { index: true, follow: true },
  metadataBase: new URL('https://emojar.com'),
  other: {
    'google-adsense-account':
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4461604896559377',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Emojar',
  url: 'https://emojar.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://emojar.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emojar',
  url: 'https://emojar.com',
  logo: 'https://emojar.com/logo-64.png',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-4461604896559377';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

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
        <Analytics />
      </body>
    </html>
  );
}
