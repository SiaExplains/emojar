import './globals.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Script from 'next/script'
import Link from 'next/link'
import ConsentBanner from '@/components/ConsentBanner'

export const metadata: Metadata = {
  title: 'Emojar — Copy & Paste Emojis Fast',
  description: 'Search, copy and paste emojis instantly. Fast, clean, mobile-friendly.',
  keywords: ['emoji', 'copy emoji', 'paste emoji', 'emoji keyboard', 'smileys', 'emojar'],
  openGraph: {
    title: 'Emojar — Copy & Paste Emojis Fast',
    description: 'Search, copy and paste emojis instantly. Fast, clean, mobile-friendly.',
    url: 'https://emojar.com',
    siteName: 'Emojar',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-0000000000000000';

  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Consent gating: Only loads AdSense after consent (set by ConsentBanner) */}
        <Script id="adsense-loader" strategy="afterInteractive">
          {`
            try {
              const consent = typeof window !== 'undefined' ? localStorage.getItem('emojar-consent') : null;
              if (consent === 'granted') {
                const s = document.createElement('script');
                s.setAttribute('data-ad-client', '${clientId}');
                s.async = true;
                s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
                document.head.appendChild(s);
              }
            } catch (e) {}
          `}
        </Script>

        <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className='logo-container'>

              <Link href="/" className="font-semibold">              <Image src="/logo-64.png" alt="Emojar Logo" width={138} height={64} /></Link>
            </div>
            <nav className="text-sm flex gap-4">
              <Link href="/categories">Categories</Link>
              <Link href="https://github.com/SiaExplains/emojar" target="_blank">GitHub</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="border-t py-8 text-sm">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <p>© {new Date().getFullYear()} Emojar</p>
            <div className="flex gap-4">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </footer>

        <ConsentBanner />
      </body>
    </html>
  )
}
