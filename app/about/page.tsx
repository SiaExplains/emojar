import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Emojar — Free Online Tools & Emoji Search by Siavash Ghanbari',
  description:
    'Emojar is a collection of free, privacy-first online tools built by Siavash Ghanbari in Berlin — 150+ browser-based utilities, plus 3,790 emojis to copy and 18 emoji games. No account needed.',
  alternates: { canonical: 'https://emojar.com/about' },
  openGraph: {
    title: 'About Emojar — Free Online Tools & Emoji Search',
    description:
      'Built by Siavash Ghanbari in Berlin. 150+ private online tools, 3,790 emojis and 18 games. Free, no sign-up.',
    url: 'https://emojar.com/about',
    siteName: 'Emojar',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'About Emojar',
    description:
      'Built by Siavash Ghanbari in Berlin. 150+ online tools, 3,790 emojis, 18 games.',
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About Emojar</h1>

      <section className="mt-8 space-y-6 text-gray-800 leading-7">
        {/* Founder intro */}
        <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg flex-shrink-0">
            SG
          </div>
          <div>
            <p className="font-semibold text-gray-900">Siavash Ghanbari</p>
            <p className="text-sm text-gray-500">
              Founder &amp; sole developer · Berlin, Germany
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Software engineer and product thinker. Built Emojar as a side
              project that grew into a platform used by thousands of people
              every month.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold">The story behind Emojar</h2>
        <p>
          I built the first version of Emojar because the existing emoji
          reference sites were either cluttered with ads, slow on mobile, or
          required an account just to copy a character. I wanted something
          instant — you search, you copy, you go. That original idea still
          defines how every feature on Emojar works: no friction, no sign-up, no
          nonsense.
        </p>
        <p>
          Over time, the site grew beyond search. I added emoji games when I
          realised how much fun it is to play with the Unicode library as a game
          mechanic. Then came the tools — a PNG exporter, a favicon generator, a
          color palette extractor — utilities that I personally needed and that
          fit naturally alongside the emoji data.
        </p>
        <p>
          In October 2026 those utilities became the heart of the site. Emojar
          is now a collection of <strong>150+ free online tools</strong> — image
          and PDF converters, developer utilities, text tools, calculators, unit
          converters and generators — that run entirely in your browser, so your
          files never leave your device. The emoji side is still here too: a
          complete index of <strong>3,790 Unicode emojis</strong>,{' '}
          <strong>18 browser games</strong> and <strong>8 emoji tools</strong>,
          all free and all working without a login.
        </p>

        <h2 className="text-xl font-semibold mt-8">What you can do here</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              🧰 150+ online tools
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Small, fast utilities for everyday tasks:{' '}
              <Link
                href="/online-tool/image-tools/image-converter"
                className="underline"
              >
                Image Converter
              </Link>
              ,{' '}
              <Link
                href="/online-tool/pdf-tools/merge-pdf"
                className="underline"
              >
                Merge PDF
              </Link>
              ,{' '}
              <Link
                href="/online-tool/developer-tools/json-formatter"
                className="underline"
              >
                JSON Formatter
              </Link>
              ,{' '}
              <Link
                href="/online-tool/text-tools/word-counter"
                className="underline"
              >
                Word Counter
              </Link>
              ,{' '}
              <Link
                href="/online-tool/security-generators/password-generator"
                className="underline"
              >
                Password Generator
              </Link>{' '}
              and many more across eleven categories. Every tool processes your
              files and text locally in the browser.{' '}
              <Link href="/online-tool" className="underline">
                Browse all online tools
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              🔍 Search &amp; copy emojis
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Fuzzy-search all 3,790 Unicode emojis by name, keyword, or
              character. Click any result to copy it to your clipboard. Each
              emoji page shows its Unicode codepoint, version, category,
              keywords, and Slack/GitHub shortcodes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              🗂️ Browse by category
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Every emoji is grouped into 10 official Unicode categories —
              Smileys &amp; Emotion, Animals &amp; Nature, Food &amp; Drink,
              Travel &amp; Places, Activities, Objects, Symbols, Flags, People
              &amp; Body, and Component. Browse the full{' '}
              <Link href="/categories" className="underline">
                categories index
              </Link>{' '}
              or go straight to a{' '}
              <Link href="/collection/alphabet" className="underline">
                sorted A–Z view
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">🎮 18 emoji games</h3>
            <p className="text-sm text-gray-600 mt-1">
              All games run in the browser with no install required. Current
              lineup:{' '}
              <Link href="/games/xo" className="underline">
                XO (Tic-Tac-Toe)
              </Link>
              ,{' '}
              <Link href="/games/snake" className="underline">
                Snake
              </Link>
              ,{' '}
              <Link href="/games/minesweeper" className="underline">
                Minesweeper
              </Link>
              ,{' '}
              <Link href="/games/hangman" className="underline">
                Hangman
              </Link>
              ,{' '}
              <Link href="/games/bubble-shooter" className="underline">
                Bubble Shooter
              </Link>
              ,{' '}
              <Link href="/games/emoji-puzzle" className="underline">
                Memory Puzzle
              </Link>
              ,{' '}
              <Link href="/games/older-or-newer" className="underline">
                Older or Newer
              </Link>
              ,{' '}
              <Link href="/games/guess-the-animal" className="underline">
                Guess the Animal
              </Link>
              ,{' '}
              <Link href="/games/guess-the-flag" className="underline">
                Guess the Flag
              </Link>
              ,{' '}
              <Link href="/games/odd-one-out" className="underline">
                Odd One Out
              </Link>
              ,{' '}
              <Link href="/games/emoji-wordle" className="underline">
                Emoji Wordle
              </Link>
              ,{' '}
              <Link href="/games/emoji-2048" className="underline">
                Emoji 2048
              </Link>
              ,{' '}
              <Link href="/games/whack-a-mole" className="underline">
                Whack-a-Mole
              </Link>
              ,{' '}
              <Link href="/games/speed-sort" className="underline">
                Speed Sort
              </Link>
              ,{' '}
              <Link href="/games/emoji-timeline" className="underline">
                Timeline
              </Link>
              ,{' '}
              <Link href="/games/emoji-pictionary" className="underline">
                Pictionary
              </Link>
              ,{' '}
              <Link href="/games/missing-piece" className="underline">
                Missing Piece
              </Link>
              , and{' '}
              <Link href="/games/story-builder" className="underline">
                Story Builder
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">🛠️ 8 emoji tools</h3>
            <p className="text-sm text-gray-600 mt-1">
              Browser-based utilities that run locally on your device — your
              files never leave your computer:{' '}
              <Link href="/emoji-to-png" className="underline">
                Emoji to PNG
              </Link>
              ,{' '}
              <Link href="/emoji-favicon" className="underline">
                Favicon Generator
              </Link>
              ,{' '}
              <Link href="/emoji-color-palette" className="underline">
                Color Palette
              </Link>
              ,{' '}
              <Link href="/emoji-watermark" className="underline">
                Watermark Tool
              </Link>
              ,{' '}
              <Link href="/emoji-card" className="underline">
                Social Card
              </Link>
              ,{' '}
              <Link href="/emoji-inspector" className="underline">
                Unicode Inspector
              </Link>
              ,{' '}
              <Link href="/emoji-kitchen" className="underline">
                Emoji Kitchen
              </Link>
              , and{' '}
              <Link href="/personality" className="underline">
                Personality Quiz
              </Link>
              .
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8">
          Data &amp; editorial standards
        </h2>
        <p>
          All emoji data comes directly from the{' '}
          <strong>Unicode Common Locale Data Repository (CLDR)</strong> and the
          Unicode Consortium&apos;s official emoji test files. Names, keywords,
          and categories reflect the Unicode standard — the same specification
          followed by Apple, Google, Microsoft, and every other major platform.
          There is no user-generated content, no synthetic descriptions, and no
          keyword stuffing on this site.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          Our principles: free, fast, private
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <strong>Free forever</strong> — every game, tool, and emoji is free
            to use with no account required
          </li>
          <li>
            <strong>No ads on tools</strong> — the tools run ad-free; ads only
            appear on content pages where they don&apos;t interfere with
            functionality
          </li>
          <li>
            <strong>Privacy-first</strong> — every online tool, plus the
            watermark and photo tools, processes your files locally in the
            browser; nothing is uploaded to any server
          </li>
          <li>
            <strong>No tracking beyond analytics</strong> — we use Google
            Analytics for aggregate traffic data only; no personal profiling
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">How Emojar is funded</h2>
        <p>
          Emojar runs on <strong>Google AdSense display ads</strong> on content
          pages, and may in future include clearly labelled affiliate links. The
          goal is a clean, unobtrusive ad experience — no interstitials, no
          autoplay video, no pop-ups. A clean, fast page is better for everyone.
        </p>

        <h2 className="text-xl font-semibold mt-8">Get in touch</h2>
        <p>
          Questions, feedback, or a legal matter?{' '}
          <Link href="/contact" className="underline">
            Contact page
          </Link>{' '}
          ·{' '}
          <Link href="/impressum" className="underline">
            Impressum
          </Link>{' '}
          ·{' '}
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
        </p>
      </section>
    </main>
  );
}
