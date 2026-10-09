import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { HeaderLogo } from '@/components/HeaderLogo/HeaderLogo.component';
import BackToTopButton from '@/components/BackToTopButton';
import HeaderSearch from '@/components/HeaderSearch';
import MainMenu from '@/components/MainMenu/MainMenu.compontent';
import { SiteChrome, PageMain } from '@/components/ChromeGate';
import { AdSenseScript } from '@/components/AdSenseScript';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';

const title = 'Emojar — Free Online Tools That Run in Your Browser';
const description = `Free, privacy-friendly online tools: image and PDF converters, JSON formatter, word counter, calculators, unit converters, password and QR generators — plus ${EMOJI_COUNT_LABEL} emojis to copy. No sign-up, no uploads.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'online tools',
    'free online tools',
    'image converter',
    'pdf tools',
    'json formatter',
    'word counter',
    'emoji',
    'emojar',
  ],
  openGraph: {
    title,
    description,
    url: 'https://emojar.com',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon-180x180.png', sizes: '180x180' }],
  },
  manifest: 'manifest.webmanifest',
  robots: { index: true, follow: true },
  metadataBase: new URL('https://emojar.com'),
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
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
  description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://emojar.com/online-tool?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emojar',
  url: 'https://emojar.com',
  logo: 'https://emojar.com/logo.png',
  description:
    'Emojar makes free, privacy-friendly online tools that run entirely in the browser.',
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

        <AdSenseScript clientId={clientId} />

        <SiteChrome>
          <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="logo-container flex-shrink-0">
                <Link href="/" className="font-semibold">
                  <HeaderLogo />
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-end md:justify-center">
                <HeaderSearch />
              </div>
              <div className="flex-shrink-0">
                <MainMenu />
              </div>
            </div>
          </header>
        </SiteChrome>

        <PageMain>{children}</PageMain>

        <SiteChrome>
          <BackToTopButton />

          <footer className="border-t py-8 text-sm">
            <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
              <p>© {new Date().getFullYear()} Emojar</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/online-tool">Online Tools</Link>
                <Link href="/emoji">Emoji</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/impressum">Impressum</Link>
              </div>
            </div>
          </footer>
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
