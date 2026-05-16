import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Games | Emojar',
  description:
    'Play 10 free emoji-themed mini-games in your browser — Hangman, Snake, Minesweeper, Guess the Flag, Odd One Out, and more. No download required.',
  alternates: { canonical: 'https://emojar.com/games' },
  openGraph: {
    title: 'Emoji Games | Emojar',
    description:
      'Play 10 free emoji-themed mini-games — Hangman, Snake, Minesweeper, Guess the Flag, and more. No download required.',
    url: 'https://emojar.com/games',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Emoji Games | Emojar',
    description:
      'Play 10 free emoji-themed mini-games — Hangman, Snake, Minesweeper, Guess the Flag, and more.',
  },
  robots: { index: true, follow: true },
};

const games = [
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
    color: 'from-indigo-100 to-indigo-200',
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
];

const GamesPage = () => {
  return (
    <section className="space-y-10 py-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Emoji Games
        </h1>
        <p className="text-gray-500 max-w-2xl">
          {games.length} free emoji-themed games, all playable right in your
          browser — no download, no sign-up. From memory puzzles and logic
          challenges to trivia and classic arcade games, there&apos;s something
          for every kind of player.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {games.map((game) => (
          <Link
            key={game.path}
            href={game.path}
            className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 no-underline bg-white"
          >
            <div
              className={`bg-gradient-to-br ${game.color} flex items-center justify-center py-6 text-4xl`}
            >
              {game.emoji}
            </div>
            <div className="px-3 py-3 flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {game.name}
              </p>
              <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                {game.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GamesPage;
