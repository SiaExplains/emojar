import type { Metadata } from 'next';
import { EMOJI_COUNT_LABEL } from '@/lib/emoji-count';
import Link from 'next/link';
import { ogImages } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Terms of Service | Emojar',
  description:
    'Emojar Terms of Service — permitted use of online tools, emoji search, games, and emoji tools; intellectual property; advertising disclosure; limitation of liability; and governing law.',
  alternates: { canonical: 'https://emojar.com/terms' },
  openGraph: {
    title: 'Terms of Service | Emojar',
    description: 'Terms of Service for Emojar.com.',
    url: 'https://emojar.com/terms',
    siteName: 'Emojar',
    type: 'article',
    images: ogImages(
      '📜',
      'Terms of Service',
      'Terms of Service for Emojar.com.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Emojar',
    description: 'Terms of Service for Emojar.com.',
    images: ogImages(
      '📜',
      'Terms of Service',
      'Terms of Service for Emojar.com.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated: October 9, 2026
      </p>

      <p className="mb-8 leading-7">
        Welcome to <strong>Emojar.com</strong> (&ldquo;Emojar,&rdquo;
        &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing
        or using Emojar.com you agree to be bound by these Terms of Service.
        Please read them carefully. If you do not agree, do not use the website.
      </p>

      {/* 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">1. What Emojar Provides</h2>
        <p className="mb-4 leading-7">
          Emojar is a free, browser-based platform of online tools and emoji
          resources. The following features are currently available — all at no
          cost and without requiring an account:
        </p>
        <ul className="list-disc pl-6 space-y-2 leading-7">
          <li>
            <strong>Online tools</strong> — 200+ utilities at{' '}
            <Link href="/online-tool" className="underline">
              /online-tool
            </Link>
            , including image, PDF, developer, text, and color tools,
            calculators, unit converters, generators, date &amp; time tools,
            audio and video converters, and webcam and microphone tests. These
            tools process files and text locally in your browser; the content
            you use with them is never sent to our servers.
          </li>
          <li>
            <strong>Emoji search &amp; copy</strong> — search, browse, and
            copy-paste any of {EMOJI_COUNT_LABEL} Unicode-standard emojis across
            10 categories.
          </li>
          <li>
            <strong>18 emoji games</strong> — Emoji Wordle, Emoji 2048,
            Whack-a-Mole, Speed Sort, Timeline Challenge, Pictionary, Missing
            Piece, Story Builder, XO (Tic-Tac-Toe), Snake, Minesweeper, Hangman,
            Bubble Shooter, Guess the Flag, Emoji Puzzle, Older or Newer, Guess
            the Animal, and Odd One Out. All games run in your browser with no
            download required.
          </li>
          <li>
            <strong>8 emoji tools</strong> — Emoji to PNG, Personality Quiz,
            Favicon Generator, Color Palette Extractor, Watermark Tool, Social
            Card Generator, Unicode Inspector, and Emoji Kitchen. All tools
            process data locally in your browser; files you upload are never
            sent to our servers.
          </li>
          <li>
            <strong>Emoji collections</strong> — curated themed packs for
            holidays and events (15 collections).
          </li>
          <li>
            <strong>Emoji detail pages</strong> — Unicode metadata, codepoints,
            version history, keywords, and related emojis for each of the{' '}
            {EMOJI_COUNT_LABEL}
            emojis.
          </li>
          <li>
            <strong>Blog</strong> — articles covering emoji tips, platform
            updates, and game/tool guides.
          </li>
        </ul>
        <p className="mt-4 leading-7">
          Features may change at any time. We may add, modify, or discontinue
          any feature without prior notice.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">2. Permitted Use</h2>
        <ul className="list-disc pl-6 space-y-2 leading-7">
          <li>
            You may use Emojar only for lawful, personal, non-commercial
            purposes.
          </li>
          <li>
            You may copy individual emojis for use in messages, social media
            posts, documents, and creative work. Emojis are part of the Unicode
            Standard and are not owned by Emojar.
          </li>
          <li>
            You may download files created with our tools (for example images
            from the online tools, Emoji to PNG, Favicon Generator, Color
            Palette, Watermark Tool, and Social Card Generator) for personal and
            commercial use, subject to any applicable Unicode or third-party
            license terms. You are responsible for having the right to process
            the files and content you use with the tools.
          </li>
          <li>
            You may not scrape, crawl, mirror, or reproduce Emojar&rsquo;s
            website content (design, layout, code, written text, or database) in
            bulk or for commercial purposes without our written consent.
          </li>
          <li>
            You may not use Emojar to distribute malware, engage in phishing, or
            otherwise harm users or third parties.
          </li>
          <li>
            You may not attempt to disrupt, overload, or gain unauthorised
            access to Emojar&rsquo;s servers or infrastructure.
          </li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2 leading-7">
          <li>
            Emojar&rsquo;s website design, code, written content, and branding
            are the property of Emojar.com or its licensors.
          </li>
          <li>
            Emoji characters are part of the Unicode Standard (
            <a
              href="https://unicode.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              unicode.org
            </a>
            ) and are not owned by Emojar. Emoji names and metadata are sourced
            from Unicode CLDR data.
          </li>
          <li>
            Emoji Kitchen combination images are generated using Google&rsquo;s
            publicly accessible Emoji Kitchen asset library. Emojar does not own
            these assets. Google&rsquo;s terms apply.
          </li>
          <li>
            You retain ownership of any files, images, or text you use with our
            tools (including the online tools and the Watermark Tool). Emojar
            does not store, transmit, or use this content — all processing
            occurs client-side in your browser.
          </li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          4. Advertising &amp; Third-Party Services
        </h2>
        <ul className="list-disc pl-6 space-y-2 leading-7">
          <li>
            Emojar is supported by <strong>Google AdSense</strong> display
            advertising. Ads may appear on any page, but never inside a tool or
            styled to look like part of it.
          </li>
          <li>
            Emojar uses <strong>Vercel Web Analytics</strong> (cookieless) to
            collect anonymised page-view data for site improvement.
          </li>
          <li>
            Clicking on third-party ads will direct you to websites we do not
            control. We are not responsible for the content, policies, or
            practices of third-party advertisers or websites.
          </li>
          <li>
            Some category pages link to related free tools on other websites
            (marked &ldquo;External site&rdquo;). Emojar may contain affiliate
            links in the future; any such links will be clearly disclosed.
          </li>
        </ul>
      </section>

      {/* 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          5. Saved Work, Game Scores &amp; Local Storage
        </h2>
        <p className="leading-7">
          Game scores, user preferences and work saved by some tools (for
          example Kanban boards, timelines, pixel art and invoices) are stored
          exclusively in your browser&rsquo;s <code>localStorage</code>. This
          data never leaves your device. Clearing your browser data will erase
          it, and Emojar has no ability to recover it — use a tool&rsquo;s
          export option to keep a copy.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          6. Disclaimer of Warranties
        </h2>
        <p className="leading-7">
          Emojar.com is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, express or implied.
          We make no guarantees about the accuracy, completeness, availability,
          or reliability of emoji data, game logic, tool outputs, or search
          results. We do not guarantee uninterrupted access or error-free
          operation.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          7. Limitation of Liability
        </h2>
        <p className="leading-7">
          To the maximum extent permitted by applicable law, Emojar.com and its
          operators shall not be liable for any direct, indirect, incidental,
          consequential, or punitive damages arising from your use of or
          inability to use the website or its features. This includes but is not
          limited to data loss, tool output errors, game score loss, or damages
          caused by third-party advertisements or links.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">8. Privacy</h2>
        <p className="leading-7">
          Our data practices are described in detail in our{' '}
          <Link href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </Link>
          . By using Emojar, you acknowledge that we collect basic anonymised
          usage data via Vercel Analytics and that Google AdSense may set
          cookies on advertising-supported pages.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          9. Changes to These Terms
        </h2>
        <p className="leading-7">
          We may update these Terms at any time. The &ldquo;Last updated&rdquo;
          date at the top of this page reflects the most recent revision.
          Continued use of Emojar after changes constitutes acceptance of the
          revised Terms.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
        <p className="leading-7">
          These Terms are governed by the laws of Germany, where Emojar is
          operated. Any disputes shall be subject to the jurisdiction of the
          courts in Berlin, Germany, unless applicable consumer-protection law
          in your country of residence requires otherwise.
        </p>
      </section>

      {/* 11 */}
      <section>
        <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
        <p className="leading-7">
          Questions about these Terms can be sent to:{' '}
          <a href="mailto:hi@emojar.com" className="text-blue-600 underline">
            hi@emojar.com
          </a>{' '}
          or via the{' '}
          <Link href="/contact" className="text-blue-600 underline">
            contact form
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
