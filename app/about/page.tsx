import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Emojar | Emoji search, copy, games and more',
  description:
    'Learn about Emojar — a free, fast emoji search, copy, browse, and play platform with 3,700+ emojis, emoji games, and category browsing, built by a solo developer in Berlin.',
  alternates: { canonical: 'https://emojar.com/about' },
  openGraph: {
    title: 'About Emojar',
    description: 'Learn about Emojar — a free emoji search and copy tool.',
    url: 'https://emojar.com/about',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About Emojar',
    description: 'Learn about Emojar — a free emoji search and copy tool.',
  },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About Emojar</h1>

      <section className="mt-8 space-y-6 text-gray-800 leading-7">
        <h2 className="text-xl font-semibold">What is Emojar?</h2>
        <p>
          Emojar is a free, fast, and mobile-friendly emoji platform. You can
          search across all <strong>3,700+ Unicode-standard emojis</strong>,
          read their official names, keywords, and Unicode codepoints — and copy
          any emoji to your clipboard with a single tap. No account, no app
          install, no friction.
        </p>
        <p>
          Whether you&apos;re writing a caption, replying to a message, or just
          curious what that symbol means, Emojar gives you the answer instantly.
          Each emoji page lists the character, its Unicode version, category,
          related emojis, and shortcode aliases for platforms like Slack and
          GitHub.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          What can you do on Emojar?
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Search &amp; copy</strong> — Fuzzy-search all 3,700+ emojis
            by name, keyword, or character. Click any emoji to copy it to your
            clipboard instantly.
          </li>
          <li>
            <strong>Browse by category</strong> — Every emoji is grouped into
            categories like Smileys &amp; Emotion, Animals &amp; Nature, Food
            &amp; Drink, Travel &amp; Places, Activities, Objects, and Symbols.
            Browse the full{' '}
            <Link href="/categories" className="underline">
              categories index
            </Link>{' '}
            to find exactly what you need.
          </li>
          <li>
            <strong>A–Z sorted browser</strong> — Scan the entire emoji library
            in strict alphabetical order, useful when you remember part of a
            name but can&apos;t pin it down in search.
          </li>
          <li>
            <strong>Emoji Games 🎮</strong> — Play five free, emoji-themed
            mini-games right in your browser on the{' '}
            <Link href="/games" className="underline">
              games page
            </Link>
            :
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>XO (Tic-Tac-Toe)</strong> — Classic tic-tac-toe with
                custom emoji pieces, configurable board sizes (3×3, 4×4, 5×5),
                and a built-in computer opponent.
              </li>
              <li>
                <strong>Snake</strong> — Guide your emoji snake around the
                board, eat the food, and grow as long as you can.
              </li>
              <li>
                <strong>Minesweeper</strong> — Uncover emoji tiles and flag the
                hidden mines without triggering them.
              </li>
              <li>
                <strong>Hangman</strong> — Guess the mystery emoji word letter
                by letter before you run out of tries.
              </li>
              <li>
                <strong>Bubble Shooter</strong> — Match and pop emoji bubbles to
                clear the board and rack up points.
              </li>
            </ul>
          </li>
          <li>
            <strong>Blog</strong> — Articles about emoji culture, game guides,
            and Emojar updates. New posts added regularly.{' '}
            <Link href="/blog" className="underline">
              Read the blog →
            </Link>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Who runs it?</h2>
        <p>
          Emojar is built and maintained by a single developer based in{' '}
          <strong>Berlin, Germany</strong>. It started as a personal side
          project — a minimal alternative to overloaded emoji databases — and
          has grown into a small but useful reference site for people who work
          with text and communication every day.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          Our data and editorial principles
        </h2>
        <p>
          All emoji data on Emojar is derived directly from the{' '}
          <strong>Unicode Common Locale Data Repository (CLDR)</strong> and the
          Unicode Consortium&apos;s official emoji test files. We do not
          generate creative or fictional descriptions — every name, keyword, and
          categorisation reflects the Unicode standard. There is no
          user-generated content on this site.
        </p>
        <p>
          This means you can trust the data here as a factual representation of
          the emoji as defined by the Unicode Consortium — the same body whose
          specifications Apple, Google, Microsoft, and every other major
          platform follow when rendering emoji characters.
        </p>

        <h2 className="text-xl font-semibold mt-8">How is Emojar funded?</h2>
        <p>
          Emojar is funded through <strong>display advertising</strong> (Google
          AdSense) and may in future include affiliate links to relevant
          products. We aim to keep the ad experience unobtrusive — no
          interstitials, no autoplay video, no pop-ups. We believe a clean, fast
          page is better for everyone, including advertisers.
        </p>
        <p>
          We are transparent about this: if you see an ad on Emojar, it helps
          keep the site free and the server lights on.
        </p>

        <h2 className="text-xl font-semibold mt-8">Get in touch</h2>
        <p>
          Questions, feedback, or a legal matter?{' '}
          <Link href="/contact" className="underline">
            Visit the contact page
          </Link>{' '}
          or check our{' '}
          <Link href="/impressum" className="underline">
            Impressum
          </Link>{' '}
          for legal details.
        </p>
      </section>
    </main>
  );
}
