import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Games | Emojar',
  description:
    'Play 10 free emoji-themed mini-games in your browser — Hangman, Snake, Minesweeper, Guess the Flag, Odd One Out, and more. No download required.',
  alternates: { canonical: 'https://emojar.com/games' },
  robots: { index: true, follow: true },
};

const games = [
  {
    name: 'XO Game',
    path: '/games/xo',
    description: 'Play classic tic-tac-toe using fun emojis.',
    emoji: '❌⭕️',
  },
  {
    name: 'Snake Game',
    path: '/games/snake',
    description: 'Guide your emoji snake to eat and grow.',
    emoji: '🐍🍏',
  },
  {
    name: 'Minesweeper',
    path: '/games/minesweeper',
    description: 'Uncover emoji tiles and avoid hidden bombs.',
    emoji: '💣🟦',
  },
  {
    name: 'Hangman',
    path: '/games/hangman',
    description: 'Guess the emoji word before you run out of tries.',
    emoji: '🤔🔤',
  },
  {
    name: 'Bubble Shooter',
    path: '/games/bubble-shooter',
    description: 'Match and pop emoji bubbles for points.',
    emoji: '🫧🎯',
  },
  {
    name: 'Guess the Flag',
    path: '/games/guess-the-flag',
    description: 'Identify country flag emojis from four choices.',
    emoji: '🌍🚩',
  },
  {
    name: 'Emoji Puzzle',
    path: '/games/emoji-puzzle',
    description: 'Flip emoji cards and find every matching pair.',
    emoji: '🃏🧠',
  },
  {
    name: 'Older or Newer',
    path: '/games/older-or-newer',
    description: 'Guess which emoji was added to Unicode first.',
    emoji: '🕰️📅',
  },
  {
    name: 'Guess the Animal',
    path: '/games/guess-the-animal',
    description: 'Name the animal emoji and learn a fun fact.',
    emoji: '🐾🦁',
  },
  {
    name: 'Odd One Out',
    path: '/games/odd-one-out',
    description: "Spot the emoji that doesn't share the theme.",
    emoji: '🔍🤔',
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

      <ul className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
        {games.map((game) => (
          <li key={game.path}>
            <Link
              href={game.path}
              className="group flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors no-underline"
            >
              <span className="text-3xl w-12 text-center shrink-0">
                {game.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {game.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {game.description}
                </p>
              </div>
              <span className="text-sm font-medium text-blue-600 shrink-0">
                Play →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GamesPage;
