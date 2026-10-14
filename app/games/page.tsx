import Link from 'next/link';
import type { Metadata } from 'next';
import { ogImages } from '@/lib/og';
import { tile } from '@/components/ui/styles';

export const metadata: Metadata = {
  title: 'Emoji Games | Emojar',
  description:
    'Play 18 free emoji-themed mini-games in your browser — Wordle, 2048, Whack-a-Mole, Hangman, Snake, Minesweeper, Guess the Flag, Odd One Out, and more. No download required.',
  alternates: { canonical: 'https://emojar.com/games' },
  openGraph: {
    title: 'Emoji Games | Emojar',
    description:
      'Play 18 free emoji-themed mini-games — Wordle, 2048, Whack-a-Mole, Hangman, Snake, and more. No download required.',
    url: 'https://emojar.com/games',
    siteName: 'Emojar',
    type: 'website',
    images: ogImages(
      '🎮',
      'Emoji Games',
      'Play 18 free emoji-themed mini-games — Wordle, 2048, Whack-a-Mole, Hangman, Snake, and more. No download required.',
    ).openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emoji Games | Emojar',
    description:
      'Play 18 free emoji-themed mini-games — Wordle, 2048, Whack-a-Mole, Hangman, Snake, and more.',
    images: ogImages(
      '🎮',
      'Emoji Games',
      'Play 18 free emoji-themed mini-games — Wordle, 2048, Whack-a-Mole, Hangman, Snake, and more. No download required.',
    ).twitter,
  },
  robots: { index: true, follow: true },
};

const games = [
  {
    name: 'Emopet',
    path: '/games/emopet',
    description: 'Adopt, feed, and care for your own 3D emoji pet.',
    emoji: '🐾✨',
    color: 'from-fuchsia-100 to-purple-200',
  },
  {
    name: 'XO Game',
    path: '/games/xo',
    description: 'Play classic tic-tac-toe using fun emojis.',
    emoji: '❌⭕️',
    color: 'from-violet-100 to-violet-200',
  },
  {
    name: 'Snake Game',
    path: '/games/snake',
    description: 'Guide your emoji snake to eat and grow.',
    emoji: '🐍🍏',
    color: 'from-green-100 to-green-200',
  },
  {
    name: 'Minesweeper',
    path: '/games/minesweeper',
    description: 'Uncover emoji tiles and avoid hidden bombs.',
    emoji: '💣🟦',
    color: 'from-red-100 to-orange-200',
  },
  {
    name: 'Hangman',
    path: '/games/hangman',
    description: 'Guess the emoji word before you run out of tries.',
    emoji: '🤔🔤',
    color: 'from-blue-100 to-blue-200',
  },
  {
    name: 'Bubble Shooter',
    path: '/games/bubble-shooter',
    description: 'Match and pop emoji bubbles for points.',
    emoji: '🫧🎯',
    color: 'from-sky-100 to-cyan-200',
  },
  {
    name: 'Guess the Flag',
    path: '/games/guess-the-flag',
    description: 'Identify country flag emojis from four choices.',
    emoji: '🌍🚩',
    color: 'from-emerald-100 to-teal-200',
  },
  {
    name: 'Emoji Puzzle',
    path: '/games/emoji-puzzle',
    description: 'Flip emoji cards and find every matching pair.',
    emoji: '🃏🧠',
    color: 'from-amber-100 to-yellow-200',
  },
  {
    name: 'Older or Newer',
    path: '/games/older-or-newer',
    description: 'Guess which emoji was added to Unicode first.',
    emoji: '🕰️📅',
    color: 'from-brand-100 to-brand-200',
  },
  {
    name: 'Guess the Animal',
    path: '/games/guess-the-animal',
    description: 'Name the animal emoji and learn a fun fact.',
    emoji: '🐾🦁',
    color: 'from-lime-100 to-green-200',
  },
  {
    name: 'Odd One Out',
    path: '/games/odd-one-out',
    description: "Spot the emoji that doesn't share the theme.",
    emoji: '🔍🤔',
    color: 'from-rose-100 to-pink-200',
  },
  {
    name: 'Emoji Wordle',
    path: '/games/emoji-wordle',
    description: 'Guess the 5-letter emoji name in 6 tries.',
    emoji: '🟩🟨',
    color: 'from-green-100 to-emerald-200',
  },
  {
    name: 'Emoji 2048',
    path: '/games/emoji-2048',
    description: 'Merge emoji tiles to reach the 🏆 2048 tile.',
    emoji: '🌱🏆',
    color: 'from-orange-100 to-amber-200',
  },
  {
    name: 'Whack-a-Mole',
    path: '/games/whack-a-mole',
    description: 'Tap emoji moles before they disappear! 30 seconds.',
    emoji: '🔨🕳️',
    color: 'from-yellow-100 to-orange-200',
  },
  {
    name: 'Speed Sort',
    path: '/games/speed-sort',
    description: 'Sort emojis into categories before time runs out.',
    emoji: '⚡📂',
    color: 'from-blue-100 to-cyan-200',
  },
  {
    name: 'Timeline Challenge',
    path: '/games/emoji-timeline',
    description: 'Arrange emojis from oldest to newest Unicode version.',
    emoji: '📅🕰️',
    color: 'from-purple-100 to-violet-200',
  },
  {
    name: 'Emoji Pictionary',
    path: '/games/emoji-pictionary',
    description: 'Type what the emoji means — 60 seconds on the clock!',
    emoji: '🎨💬',
    color: 'from-pink-100 to-rose-200',
  },
  {
    name: 'Missing Piece',
    path: '/games/missing-piece',
    description: 'Find the hidden emoji in a 3×3 category grid.',
    emoji: '🧩❓',
    color: 'from-teal-100 to-green-200',
  },
  {
    name: 'Story Builder',
    path: '/games/story-builder',
    description: 'Pick emojis for each chapter to build your story.',
    emoji: '📖✨',
    color: 'from-brand-100 to-blue-200',
  },
];

const GamesPage = () => {
  return (
    <section className="space-y-10 py-4">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Emoji Games
        </h1>
        <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
          19 free emoji-themed games, all playable right in your browser — no
          download, no sign-up. From memory puzzles and logic challenges to
          trivia and classic arcade games, there&apos;s something for every kind
          of player.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {games.map((game) => (
          <Link
            key={game.path}
            href={game.path}
            className={`${tile} no-underline`}
          >
            <span
              aria-hidden
              className={`flex h-11 w-fit items-center justify-center rounded-xl bg-gradient-to-br px-2.5 text-xl leading-none ${game.color}`}
            >
              {game.emoji}
            </span>
            <span className="mt-4 block text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-brand-700">
              {game.name}
            </span>
            <span className="mt-1.5 line-clamp-3 block text-[13px] leading-relaxed text-gray-500">
              {game.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GamesPage;
