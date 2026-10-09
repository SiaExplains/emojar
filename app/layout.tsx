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
import { CATEGORIES } from '@/lib/online-tools/categories';

const FOOTER_GROUPS: { title: string; links: [string, string][] }[] = [
  {
    title: 'Emoji & games',
    links: [
      ['/emoji', 'Emoji search & copy'],
      ['/categories', 'Emoji categories'],
      ['/emoji-collections/events', 'Events & holidays'],
      ['/emoji-tools', 'Emoji tools'],
      ['/games', 'Games'],
    ],
  },
  {
    title: 'Guides & help',
    links: [
      ['/blog', 'Guides'],
      ['/faq', 'FAQ'],
      ['/about', 'About'],
      ['/contact', 'Contact'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['/privacy', 'Privacy'],
      ['/terms', 'Terms'],
      ['/impressum', 'Impressum'],
    ],
  },
];

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
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
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

          <footer className="mt-12 border-t border-gray-100 bg-gray-50 text-sm">
            <nav
              aria-label="Footer"
              className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]"
            >
              <div>
                <h2 className="font-semibold text-gray-900">
                  <Link href="/online-tool" className="hover:text-brand-700">
                    Online tools
                  </Link>
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/online-tool/${c.slug}`}
                        className="hover:text-brand-700"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {FOOTER_GROUPS.map((g) => (
                <div key={g.title}>
                  <h2 className="font-semibold text-gray-900">{g.title}</h2>
                  <ul className="mt-3 space-y-2 text-gray-600">
                    {g.links.map(([href, label]) => (
                      <li key={href}>
                        <Link href={href} className="hover:text-brand-700">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="border-t border-gray-100">
              <p className="mx-auto max-w-5xl px-4 py-5 text-gray-500">
                © {new Date().getFullYear()} Emojar · Free tools that run in
                your browser
              </p>
            </div>
          </footer>
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
