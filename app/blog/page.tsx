import type { Metadata } from 'next';
import Link from 'next/link';
import { publishedGuides } from '@/lib/blog/guides';
import { getCategory, getTool } from '@/lib/online-tools/registry';

export const metadata: Metadata = {
  title: 'Blog | Emojar',
  description:
    'Practical guides to free online tools — images, PDFs, text, code, calculators and more — plus emoji game tips and updates from Emojar founder Siavash Ghanbari.',
  alternates: { canonical: 'https://emojar.com/blog' },
  openGraph: {
    title: 'Emojar Blog',
    description:
      'Practical guides to free online tools — images, PDFs, text, code, calculators and more — plus emoji game tips and updates from Emojar founder Siavash Ghanbari.',
    url: 'https://emojar.com/blog',
    siteName: 'Emojar',
    type: 'website',
  },
  keywords: [
    'online tools guide',
    'how to convert images',
    'pdf tips',
    'emoji blog',
    'emoji games',
    'emojar updates',
    'emoji tools guide',
  ],
  twitter: {
    card: 'summary',
    title: 'Emojar Blog',
    description: 'Guides, game tips, and updates from the Emojar founder.',
  },
  robots: { index: true, follow: true },
};

const posts = [
  {
    slug: 'emoji-kitchen-tool',
    title: 'Emoji Kitchen on Emojar — Combine Any Two Emojis',
    date: '2026-05-12',
    description:
      'Mix any two emojis using Google Emoji Kitchen and download the mashup. Free, instant, no sign-up required.',
    emoji: '🍳',
    tags: ['Tool Guide', 'Emoji Kitchen', 'Creative'],
  },
  {
    slug: 'emoji-unicode-inspector',
    title: 'Emoji Unicode Inspector — See Every Codepoint Instantly',
    date: '2026-05-09',
    description:
      'Paste any text and instantly see the Unicode codepoints, names, versions, and categories for every character. Built for developers and emoji enthusiasts.',
    emoji: '🔍',
    tags: ['Tool Guide', 'Unicode', 'Developer'],
  },
  {
    slug: 'emoji-social-card',
    title: 'Emoji Social Card Generator — Create Shareable Cards for Free',
    date: '2026-05-05',
    description:
      'Build a custom social media card with any emoji, your own text, and a gradient background. Download as PNG for Twitter, Instagram, or LinkedIn.',
    emoji: '🃏',
    tags: ['Tool Guide', 'Social Media', 'Design'],
  },
  {
    slug: 'emoji-watermark-tool',
    title: 'Add an Emoji Watermark to Any Photo — Free & Private',
    date: '2026-04-28',
    description:
      'Upload a photo, place any emoji as a watermark, adjust size and opacity, then download. Everything runs locally — your photos never leave your device.',
    emoji: '🖼️',
    tags: ['Tool Guide', 'Privacy', 'Design'],
  },
  {
    slug: 'emoji-color-palette',
    title: 'Extract a Color Palette from Any Emoji',
    date: '2026-04-21',
    description:
      'Pick any emoji and instantly extract its color palette. Copy HEX or RGB codes to use in your designs. Free browser tool, no sign-up.',
    emoji: '🎨',
    tags: ['Tool Guide', 'Design', 'Colors'],
  },
  {
    slug: 'emoji-favicon-generator',
    title: 'Turn Any Emoji into a Browser Favicon — Free Download',
    date: '2026-04-14',
    description:
      'Generate a favicon from any of the 3,790 emojis in seconds. Download as ICO or PNG. No design tools needed.',
    emoji: '⭐',
    tags: ['Tool Guide', 'Web Development', 'Design'],
  },
  {
    slug: 'emoji-story-builder',
    title: 'Emoji Story Builder — Create & Share a 6-Chapter Emoji Story',
    date: '2026-06-12',
    description:
      'Pick one emoji per chapter across 6 story stages. The result is a unique, shareable emoji narrative — no two stories are the same.',
    emoji: '📖',
    tags: ['Game Guide', 'Creative', 'Story'],
  },
  {
    slug: 'emoji-missing-piece',
    title: 'Emoji Missing Piece — Spot the Hidden Emoji in the Grid',
    date: '2026-06-09',
    description:
      'A 3×3 emoji grid with one tile hidden behind ❓. Can you identify the missing emoji from four options? 10 rounds of pattern-recognition fun.',
    emoji: '❓',
    tags: ['Game Guide', 'Puzzle', 'Pattern'],
  },
  {
    slug: 'emoji-pictionary',
    title: 'Emoji Pictionary — Guess the Emoji from the Clue',
    date: '2026-06-05',
    description:
      'A text clue appears and you type the matching emoji. 40 clues, 60-second timer, skip option. Test how well you think in emoji.',
    emoji: '🎭',
    tags: ['Game Guide', 'Guess', 'Creative'],
  },
  {
    slug: 'emoji-timeline',
    title: 'Emoji Timeline Challenge — Order Emojis by Unicode Release',
    date: '2026-06-02',
    description:
      'Five emojis out of order — arrange them from oldest to newest by Unicode version. 5 rounds. How well do you know emoji history?',
    emoji: '📅',
    tags: ['Game Guide', 'History', 'Unicode'],
  },
  {
    slug: 'emoji-speed-sort',
    title: 'Emoji Speed Sort — Categorise Emojis Against the Clock',
    date: '2026-05-27',
    description:
      'An emoji pops up and you have 3 seconds to tap the right category. 10 rounds, escalating pressure. How fast is your emoji brain?',
    emoji: '⚡',
    tags: ['Game Guide', 'Speed', 'Categories'],
  },
  {
    slug: 'emoji-whack-a-mole',
    title: 'Emoji Whack-a-Mole — 30 Seconds to Score as High as You Can',
    date: '2026-05-23',
    description:
      'Emojis pop up on a 3×3 grid — tap them before they disappear. 30 seconds on the clock and speed increases as you score. How high can you go?',
    emoji: '🔨',
    tags: ['Game Guide', 'Reflex', 'Speed'],
  },
  {
    slug: 'emoji-2048',
    title: 'Emoji 2048 — Merge Tiles from 🌱 to 🏆',
    date: '2026-05-20',
    description:
      'Slide emoji tiles to merge matching pairs. Work your way from a tiny seedling all the way to the trophy. Best score saved automatically.',
    emoji: '🏆',
    tags: ['Game Guide', 'Strategy', 'Puzzle'],
  },
  {
    slug: 'emoji-wordle',
    title: 'Emoji Wordle — Guess the 5-Letter Emoji Name in 6 Tries',
    date: '2026-05-17',
    description:
      'Guess a hidden emoji Unicode name in six tries. Green means correct position, yellow means right letter wrong place, gray means not in the word.',
    emoji: '🟩',
    tags: ['Game Guide', 'Word Game', 'Strategy'],
  },
  {
    slug: 'emoji-games-batch-2',
    title: '8 New Emoji Games: Wordle, 2048, Whack-a-Mole & More',
    date: '2026-06-24',
    description:
      'Play Emoji Wordle, 2048, Whack-a-Mole, Speed Sort, Timeline, Pictionary, Missing Piece, and Story Builder — all free in your browser.',
    emoji: '🎮',
    tags: ['New Games', 'Update', 'Games'],
  },
  {
    slug: 'emoji-tools-collection-2026',
    title:
      '6 New Free Emoji Tools — Favicon, Palette, Watermark, Card, Inspector & Kitchen',
    date: '2026-06-24',
    description:
      'Six new browser-based emoji tools just launched on Emojar: generate favicons, extract color palettes, add watermarks to photos, build social cards, inspect Unicode, and combine emojis with Emoji Kitchen.',
    emoji: '🛠️',
    tags: ['New Tools', 'Update', 'Design'],
  },
  {
    slug: 'homepage-redesign-june-2026',
    title: 'Emojar Homepage Redesign — Everything in One Place',
    date: '2026-06-20',
    description:
      'The Emojar homepage now shows all 18 games, all 10 colour-coded categories, emoji tools, holiday collections, and the latest blog posts — in one clean layout.',
    emoji: '🏠',
    tags: ['Update', 'Design', 'News'],
  },
  {
    slug: 'emoji-to-png-download',
    title: 'Download Any Emoji as a PNG Image — Free, Instant, No Sign-up',
    date: '2026-06-19',
    description:
      'The Emojar Emoji to PNG tool lets you convert any of the 3,790 emojis to a high-quality image. Choose your size, background, and padding — then download in one click.',
    emoji: '🖼️',
    tags: ['New Tool', 'Download', 'PNG'],
  },
  {
    slug: 'find-your-emoji-personality',
    title:
      'Find Your Emoji Personality — A Character Quiz Backed by Psychology',
    date: '2026-05-25',
    description:
      'Answer 12 personality-science questions and discover which 5 emojis match your character. Then download or share your personalised emoji card.',
    emoji: '🧠',
    tags: ['Quiz', 'Personality', 'New Feature'],
  },
  {
    slug: 'seo-indexation-recovery',
    title: 'How We Recovered Emojar From a Google Indexation Drop',
    date: '2026-05-14',
    description:
      'Emojar lost most of its indexed pages in early 2026. Here is exactly what caused it — server errors, a www redirect conflict, dead sitemap URLs — and how we fixed everything.',
    emoji: '📈',
    tags: ['Technical', 'SEO', 'Updates'],
  },
  {
    slug: 'emoji-events-collection',
    title: 'Emoji Collections for Every Holiday & Event',
    date: '2026-05-14',
    description:
      "Curated emoji packs for 15 major holidays — New Year, Valentine's Day, Halloween, Christmas, Diwali, and more. Copy a single emoji or the whole set.",
    emoji: '🎉',
    tags: ['Collection', 'Holidays', 'Copy & Paste'],
  },
  {
    slug: 'odd-one-out-game',
    title: "Odd One Out — Spot the Emoji That Doesn't Belong",
    date: '2026-05-14',
    description:
      "Five emojis, four share a theme — one doesn't fit. A new emoji logic game with 50+ curated rounds across food, animals, sports, nature, and more.",
    emoji: '🔍',
    tags: ['New Game', 'Logic', 'Quiz'],
  },
  {
    slug: 'guess-the-animal-game',
    title: 'Guess the Animal — Name the Emoji, Learn a Fact',
    date: '2026-05-13',
    description:
      'A new emoji quiz covering all 130 animal emojis — mammals, birds, reptiles, marine life, and more. Every round ends with a fun animal fact.',
    emoji: '🦁',
    tags: ['New Game', 'Animals', 'Quiz'],
  },
  {
    slug: 'older-or-newer-game',
    title: 'Older or Newer — How Well Do You Know Emoji History?',
    date: '2026-05-13',
    description:
      'A new emoji quiz game: two emojis side by side — guess which one was added to Unicode first. 3,700+ emojis spanning 16 versions from 2010 to 2024.',
    emoji: '⏳',
    tags: ['New Game', 'History', 'Unicode'],
  },
  {
    slug: 'emoji-puzzle-game',
    title: 'Emoji Puzzle — Test Your Memory with Emoji Cards',
    date: '2026-05-13',
    description:
      'Flip emoji cards and find every matching pair. Our new memory match game has three difficulty levels — Easy (4×4), Medium (6×6), and Hard (8×8).',
    emoji: '🃏',
    tags: ['New Game', 'Memory', 'Puzzle'],
  },
  {
    slug: 'emojar-may-2026-updates',
    title: "What's New on Emojar — May 2026 Updates",
    date: '2026-05-13',
    description:
      'A roundup of recent improvements: emoji games, category breadcrumbs, a refreshed homepage, an improved About page, and more.',
    emoji: '📋',
    tags: ['Updates', 'News'],
  },
  {
    slug: 'emojar-games-launched',
    title: 'Emojar Games Is Live — Play Emoji Mini-Games Now!',
    date: '2026-05-13',
    description:
      'We just launched the Emojar Games page. Play five emoji-themed mini-games: XO, Snake, Minesweeper, Hangman, and Bubble Shooter — all free, right in your browser.',
    emoji: '🚀',
    tags: ['Launch', 'Games', 'News'],
  },
  {
    slug: 'emoji-xo-game-guide',
    title: 'How to Play Emoji XO (Tic-Tac-Toe) on Emojar',
    date: '2026-05-13',
    description:
      'Rules, board size options, custom emoji pieces, AI opponent strategy, and tips for winning the Emoji XO game.',
    emoji: '❌',
    tags: ['Game Guide', 'XO', 'Strategy'],
  },
  {
    slug: 'emoji-snake-game-guide',
    title: 'How to Play Emoji Snake on Emojar',
    date: '2026-05-13',
    description:
      'Controls, survival tips, and high-score strategy for the Emoji Snake game on Emojar.',
    emoji: '🐍',
    tags: ['Game Guide', 'Snake', 'Tips'],
  },
  {
    slug: 'emoji-minesweeper-game-guide',
    title: 'How to Play Emoji Minesweeper on Emojar',
    date: '2026-05-13',
    description:
      'Number logic, flagging strategy, and pattern-reading tips for clearing the emoji mine field on Emojar.',
    emoji: '💣',
    tags: ['Game Guide', 'Minesweeper', 'Strategy'],
  },
  {
    slug: 'emoji-hangman-game-guide',
    title: 'How to Play Emoji Hangman on Emojar',
    date: '2026-05-13',
    description:
      'Rules, best-first-letter strategy, and tips for guessing emoji Unicode names in the Emojar Hangman game.',
    emoji: '🎯',
    tags: ['Game Guide', 'Hangman', 'Tips'],
  },
  {
    slug: 'emoji-bubble-shooter-game-guide',
    title: 'How to Play Emoji Bubble Shooter on Emojar',
    date: '2026-05-13',
    description:
      'Aiming, wall bounces, chain reactions, and score-maximising tips for the Emoji Bubble Shooter game.',
    emoji: '🫧',
    tags: ['Game Guide', 'Bubble Shooter', 'Tips'],
  },
  {
    slug: 'guess-the-flag-game',
    title: 'Guess the Flag — Match the Emoji Flag to Its Country',
    date: '2026-05-13',
    description:
      'A geography quiz using emoji flags. Identify the country from its flag emoji — 195 flags, multiple difficulty levels.',
    emoji: '🏴',
    tags: ['New Game', 'Flags', 'Geography'],
  },
];

function groupByMonth(postList: typeof posts) {
  const groups: Record<string, typeof posts> = {};
  for (const post of postList) {
    const key = post.date.slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function getAllTags(postList: typeof posts) {
  const counts: Record<string, number> = {};
  for (const post of postList) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

const PAGE_SIZE = 20;

/** Published tool guides in the same shape as the hand-written posts. */
function guidePosts(): typeof posts {
  return publishedGuides().map((g) => {
    const tool = g.tool ? getTool(g.tool) : undefined;
    const category = tool ? getCategory(tool.category) : undefined;
    return {
      slug: g.slug,
      title: g.title,
      date: g.publishDate,
      description: g.description,
      emoji: tool?.icon ?? '🧰',
      tags: ['Tool Guide', ...(category ? [category.shortName] : []), ...g.tags]
        .filter((t, i, a) => a.indexOf(t) === i)
        .slice(0, 4),
    };
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const activeTag = sp?.tag ?? null;
  const allPosts = [...guidePosts(), ...posts].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const matching = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(sp?.page) || 1));
  const filtered = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageHref = (n: number) => {
    const q = new URLSearchParams();
    if (activeTag) q.set('tag', activeTag);
    if (n > 1) q.set('page', String(n));
    const qs = q.toString();
    return qs ? `/blog?${qs}` : '/blog';
  };

  const allTags = getAllTags(allPosts).slice(0, 30);

  return (
    <div className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Blog</h1>
        <p className="text-gray-500 text-sm">
          By <span className="font-medium text-gray-700">Siavash Ghanbari</span>
          {' · '}Founder of Emojar
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Posts */}
        <div className="flex-1 min-w-0">
          {activeTag && (
            <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
              <span>
                Showing: <strong className="text-gray-800">{activeTag}</strong>
              </span>
              <Link href="/blog" className="text-blue-600 hover:underline">
                Clear
              </Link>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-gray-400 text-sm">No posts found.</p>
          )}

          <ul className="space-y-3">
            {filtered.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:bg-gray-50 transition-colors no-underline"
                >
                  <time className="text-xs text-gray-400 tracking-wide uppercase">
                    {new Date(post.date + 'T12:00:00').toLocaleDateString(
                      'en-GB',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </time>
                  <h2 className="mt-1 text-base font-semibold leading-snug text-gray-900">
                    {post.emoji && <span className="mr-1.5">{post.emoji}</span>}
                    {post.title}
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm leading-6">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2 hidden sm:block">
                      Siavash Ghanbari
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-between text-sm"
            >
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="text-blue-600 hover:underline"
                >
                  ← Newer posts
                </Link>
              ) : (
                <span />
              )}
              <span className="text-gray-400">
                Page {page} of {pages}
              </span>
              {page < pages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="text-blue-600 hover:underline"
                >
                  Older posts →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0 space-y-8">
          {/* Tags */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={
                    activeTag === tag
                      ? '/blog'
                      : `/blog?tag=${encodeURIComponent(tag)}`
                  }
                  className={`text-xs rounded-full px-2.5 py-1 font-medium transition-colors no-underline ${
                    activeTag === tag
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag} <span className="opacity-60">{count}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Monthly archive */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              Archive
            </h3>
            <ul className="space-y-1.5">
              {groupByMonth(allPosts).map(([key, monthPosts]) => (
                <li key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{formatMonthLabel(key)}</span>
                  <span className="text-gray-400">({monthPosts.length})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                SG
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Siavash Ghanbari
                </p>
                <p className="text-xs text-gray-400">Founder</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-5">
              Building Emojar — free online tools that run in your browser, plus
              emoji search and games.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
