'use client';

import { useCallback, useMemo, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { useRandomState } from '@/lib/games/use-random-state';

type Round = {
  emojis: string[];
  oddIndex: number;
  theme: string;
  explanation: string;
};

const ROUNDS: Round[] = [
  // ── Food ──────────────────────────────────────────────────────────────────
  {
    emojis: ['🍎', '🍊', '🍋', '🍇', '🥕'],
    oddIndex: 4,
    theme: 'Fruits',
    explanation: '🥕 Carrot is a vegetable — the rest are all fruits.',
  },
  {
    emojis: ['🥕', '🥦', '🧅', '🥬', '🍓'],
    oddIndex: 4,
    theme: 'Vegetables',
    explanation: '🍓 Strawberry is a fruit — the rest are all vegetables.',
  },
  {
    emojis: ['🍔', '🌮', '🍟', '🌯', '🍰'],
    oddIndex: 4,
    theme: 'Savoury fast food',
    explanation: '🍰 Cake is a dessert — the rest are all savoury fast food.',
  },
  {
    emojis: ['🍰', '🎂', '🍩', '🍪', '🌮'],
    oddIndex: 4,
    theme: 'Desserts & sweets',
    explanation: '🌮 Taco is savoury — the rest are all sweet desserts.',
  },
  {
    emojis: ['☕', '🍵', '🧃', '🥤', '🍕'],
    oddIndex: 4,
    theme: 'Drinks',
    explanation: '🍕 Pizza is food, not a drink — the rest are all beverages.',
  },
  {
    emojis: ['🦞', '🦀', '🦐', '🦑', '🐄'],
    oddIndex: 4,
    theme: 'Seafood',
    explanation: '🐄 Cow is a land animal — the rest are all seafood.',
  },
  {
    emojis: ['🥞', '🧇', '🍳', '🥓', '🍣'],
    oddIndex: 4,
    theme: 'Breakfast foods',
    explanation: '🍣 Sushi is not a breakfast food — the rest all are.',
  },
  {
    emojis: ['🍕', '🍝', '🧀', '🥖', '🌮'],
    oddIndex: 4,
    theme: 'Italian food',
    explanation: '🌮 Taco is Mexican cuisine — the rest are all Italian.',
  },
  {
    emojis: ['🍇', '🍓', '🫐', '🍒', '🍋'],
    oddIndex: 4,
    theme: 'Red/purple berries & small fruits',
    explanation:
      '🍋 Lemon is yellow and a citrus — the rest are red or purple.',
  },
  {
    emojis: ['🌽', '🍠', '🥔', '🧅', '🍓'],
    oddIndex: 4,
    theme: 'Root vegetables & starchy crops',
    explanation:
      '🍓 Strawberry is a fruit — the rest all grow in or near the soil.',
  },
  // ── Animals ───────────────────────────────────────────────────────────────
  {
    emojis: ['🦁', '🐯', '🐆', '🐅', '🐻'],
    oddIndex: 4,
    theme: 'Big cats',
    explanation:
      '🐻 Bear is not a cat — the rest are all members of the cat family.',
  },
  {
    emojis: ['🐄', '🐷', '🐑', '🐓', '🦁'],
    oddIndex: 4,
    theme: 'Farm animals',
    explanation: '🦁 Lion is a wild animal — the rest are all farm animals.',
  },
  {
    emojis: ['🐬', '🦈', '🐙', '🦑', '🐘'],
    oddIndex: 4,
    theme: 'Ocean animals',
    explanation: '🐘 Elephant lives on land — the rest are all ocean animals.',
  },
  {
    emojis: ['🦅', '🦜', '🦢', '🦩', '🐟'],
    oddIndex: 4,
    theme: 'Birds',
    explanation:
      '🐟 Fish is not a bird — the rest all have feathers and wings.',
  },
  {
    emojis: ['🐝', '🦋', '🐛', '🐜', '🐸'],
    oddIndex: 4,
    theme: 'Insects',
    explanation: '🐸 Frog is an amphibian — the rest are all insects.',
  },
  {
    emojis: ['🐊', '🦎', '🐍', '🐢', '🐶'],
    oddIndex: 4,
    theme: 'Reptiles',
    explanation: '🐶 Dog is a mammal — the rest are all reptiles.',
  },
  {
    emojis: ['🐘', '🦏', '🦛', '🐃', '🐇'],
    oddIndex: 4,
    theme: 'Large heavy mammals',
    explanation:
      '🐇 Rabbit is tiny and lightweight — the rest are all massive animals.',
  },
  {
    emojis: ['🦊', '🐺', '🦝', '🐕', '🐟'],
    oddIndex: 4,
    theme: 'Canine family & relatives',
    explanation: '🐟 Fish is not a canine — the rest are all dog-like animals.',
  },
  {
    emojis: ['🐧', '🦆', '🦅', '🦉', '🐠'],
    oddIndex: 4,
    theme: 'Birds',
    explanation: '🐠 Tropical fish is not a bird — the rest all are.',
  },
  {
    emojis: ['🦁', '🐘', '🦒', '🦓', '🐧'],
    oddIndex: 4,
    theme: 'African savanna animals',
    explanation:
      '🐧 Penguin lives in Antarctica — the rest are all African savanna animals.',
  },
  // ── Sports & Games ────────────────────────────────────────────────────────
  {
    emojis: ['⚽', '🏀', '🎾', '🏈', '🎸'],
    oddIndex: 4,
    theme: 'Sports balls',
    explanation:
      '🎸 Guitar is a musical instrument — the rest are all sports balls.',
  },
  {
    emojis: ['🎸', '🎹', '🎺', '🥁', '⚽'],
    oddIndex: 4,
    theme: 'Musical instruments',
    explanation:
      '⚽ Football is a sport — the rest are all musical instruments.',
  },
  {
    emojis: ['🏊', '🚴', '🏋️', '🤸', '🎲'],
    oddIndex: 4,
    theme: 'Physical sports',
    explanation: '🎲 Dice is a board game — the rest are all physical sports.',
  },
  {
    emojis: ['⛷️', '🏂', '🛷', '⛸️', '🏄'],
    oddIndex: 4,
    theme: 'Winter / snow & ice sports',
    explanation:
      '🏄 Surfing is a summer water sport — the rest are all winter snow or ice sports.',
  },
  // ── Transport ─────────────────────────────────────────────────────────────
  {
    emojis: ['🚗', '🚌', '🚂', '🛵', '🚀'],
    oddIndex: 4,
    theme: 'Ground transport',
    explanation:
      '🚀 Rocket travels through space — the rest all travel on the ground.',
  },
  {
    emojis: ['✈️', '🚁', '🛸', '🪂', '🚢'],
    oddIndex: 4,
    theme: 'Things that fly',
    explanation: '🚢 Ship travels on water — the rest all fly through the air.',
  },
  {
    emojis: ['⛵', '🚢', '🛥️', '🚤', '🚂'],
    oddIndex: 4,
    theme: 'Water vehicles',
    explanation: '🚂 Train travels on tracks — the rest are all water vessels.',
  },
  // ── Nature & Weather ──────────────────────────────────────────────────────
  {
    emojis: ['🌸', '🌺', '🌻', '🌹', '🌵'],
    oddIndex: 4,
    theme: 'Flowers',
    explanation: '🌵 Cactus is a succulent plant — the rest are all flowers.',
  },
  {
    emojis: ['🌲', '🌴', '🌳', '🎋', '🌸'],
    oddIndex: 4,
    theme: 'Trees',
    explanation: '🌸 Cherry blossom is a flower — the rest are all trees.',
  },
  {
    emojis: ['⛈️', '🌪️', '🌊', '🌋', '☀️'],
    oddIndex: 4,
    theme: 'Extreme / dramatic weather & nature events',
    explanation:
      '☀️ Sunshine is calm and pleasant — the rest are all extreme or destructive natural events.',
  },
  {
    emojis: ['🌧️', '⛈️', '🌨️', '🌪️', '🌈'],
    oddIndex: 4,
    theme: 'Stormy / wet weather',
    explanation:
      '🌈 Rainbow appears after rain — the rest are all types of stormy or wet weather.',
  },
  {
    emojis: ['🌍', '🌎', '🌏', '🪐', '🗺️'],
    oddIndex: 3,
    theme: 'Earth / world',
    explanation:
      '🪐 Saturn is a planet, not Earth — the rest all represent Earth or world maps.',
  },
  // ── Space ─────────────────────────────────────────────────────────────────
  {
    emojis: ['🚀', '⭐', '🌙', '🪐', '🌊'],
    oddIndex: 4,
    theme: 'Space',
    explanation:
      '🌊 Wave is an ocean feature — the rest are all things found in space.',
  },
  {
    emojis: ['🌙', '⭐', '💫', '✨', '☀️'],
    oddIndex: 4,
    theme: 'Night sky / stars',
    explanation:
      '☀️ Sun is daytime — the rest are all associated with the night sky or stars.',
  },
  // ── Faces & Emotions ──────────────────────────────────────────────────────
  {
    emojis: ['😊', '😂', '🥰', '😎', '😡'],
    oddIndex: 4,
    theme: 'Positive / happy emotions',
    explanation:
      '😡 Angry face is a negative emotion — the rest are all positive or happy.',
  },
  {
    emojis: ['😢', '😭', '😔', '😞', '😂'],
    oddIndex: 4,
    theme: 'Sad / negative emotions',
    explanation:
      '😂 Laughing face is positive — the rest are all sad or negative emotions.',
  },
  {
    emojis: ['😴', '🥱', '😪', '💤', '😤'],
    oddIndex: 4,
    theme: 'Tired / sleepy',
    explanation:
      '😤 Huffing face shows frustration — the rest all express tiredness or sleep.',
  },
  // ── Hand gestures ─────────────────────────────────────────────────────────
  {
    emojis: ['👍', '🤙', '✌️', '🤞', '👃'],
    oddIndex: 4,
    theme: 'Hand gestures',
    explanation:
      '👃 Nose is a body part, not a hand gesture — the rest are all hand gestures.',
  },
  {
    emojis: ['👏', '🤝', '🙌', '💪', '👣'],
    oddIndex: 4,
    theme: 'Hands / arms',
    explanation:
      '👣 Footprints are made by feet — the rest are all hands or arms.',
  },
  // ── Objects & Tools ───────────────────────────────────────────────────────
  {
    emojis: ['🔨', '🪛', '🔧', '🪚', '🎸'],
    oddIndex: 4,
    theme: 'Tools',
    explanation: '🎸 Guitar is a musical instrument — the rest are all tools.',
  },
  {
    emojis: ['📱', '💻', '🖥️', '⌨️', '📚'],
    oddIndex: 4,
    theme: 'Computer / tech devices',
    explanation:
      '📚 Books are not tech devices — the rest are all computers or electronics.',
  },
  {
    emojis: ['📖', '📕', '📗', '📘', '📱'],
    oddIndex: 4,
    theme: 'Books',
    explanation: '📱 Phone is a device — the rest are all books.',
  },
  {
    emojis: ['🔑', '🗝️', '🔐', '🔒', '🎸'],
    oddIndex: 4,
    theme: 'Locks & keys',
    explanation:
      '🎸 Guitar has nothing to do with locking — the rest are all locks or keys.',
  },
  {
    emojis: ['💡', '🕯️', '🔦', '🪔', '🌊'],
    oddIndex: 4,
    theme: 'Sources of light',
    explanation: '🌊 Wave produces no light — the rest are all light sources.',
  },
  // ── Clothing & Accessories ────────────────────────────────────────────────
  {
    emojis: ['👒', '🎩', '⛑️', '🪖', '👟'],
    oddIndex: 4,
    theme: 'Hats & headwear',
    explanation:
      '👟 Sneaker is worn on the foot — the rest are all hats or headwear.',
  },
  {
    emojis: ['👟', '👠', '🥾', '🩴', '🎩'],
    oddIndex: 4,
    theme: 'Footwear',
    explanation:
      '🎩 Top hat is worn on the head — the rest are all types of footwear.',
  },
  // ── Flags & Countries ─────────────────────────────────────────────────────
  {
    emojis: ['🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🏴‍☠️'],
    oddIndex: 4,
    theme: 'Country flags',
    explanation:
      '🏴‍☠️ Pirate flag is not a country — the rest are all national flags.',
  },
  // ── Symbols ───────────────────────────────────────────────────────────────
  {
    emojis: ['❤️', '🧡', '💛', '💚', '⭐'],
    oddIndex: 4,
    theme: 'Coloured hearts',
    explanation:
      '⭐ Star is not a heart — the rest are all different coloured hearts.',
  },
  {
    emojis: ['♠️', '♥️', '♦️', '♣️', '⭐'],
    oddIndex: 4,
    theme: 'Playing card suits',
    explanation:
      '⭐ Star is not a card suit — the rest are all the four playing card suits.',
  },
  // ── Holiday & Celebration ─────────────────────────────────────────────────
  {
    emojis: ['🎄', '🎅', '⛄', '🦌', '🎃'],
    oddIndex: 4,
    theme: 'Christmas',
    explanation:
      '🎃 Jack-o-lantern is Halloween — the rest are all associated with Christmas.',
  },
  {
    emojis: ['🎃', '👻', '🕷️', '🦇', '🎄'],
    oddIndex: 4,
    theme: 'Halloween',
    explanation:
      '🎄 Christmas tree is a Christmas symbol — the rest are all Halloween themed.',
  },
  {
    emojis: ['🎉', '🎊', '🎈', '🥳', '😢'],
    oddIndex: 4,
    theme: 'Celebration & party',
    explanation:
      '😢 Crying face is not celebratory — the rest are all party or celebration symbols.',
  },
  // ── Math & Numbers ────────────────────────────────────────────────────────
  {
    emojis: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '🔤'],
    oddIndex: 4,
    theme: 'Number buttons',
    explanation:
      '🔤 Letters button shows letters, not a number — the rest are all number buttons.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GameRound = Round & { shuffledEmojis: string[]; shuffledOddIndex: number };

function buildQueue(): GameRound[] {
  return shuffle(ROUNDS).map((r) => {
    const indexed = r.emojis.map((e, i) => ({ e, isOdd: i === r.oddIndex }));
    const shuffled = shuffle(indexed);
    return {
      ...r,
      shuffledEmojis: shuffled.map((x) => x.e),
      shuffledOddIndex: shuffled.findIndex((x) => x.isOdd),
    };
  });
}

type HistoryRow = {
  emojis: string[];
  picked: number;
  oddIndex: number;
  theme: string;
  correct: boolean;
};

export default function OddOneOutPage() {
  const [queue, setQueue] = useRandomState<GameRound[]>(buildQueue);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const round = queue[qIndex % queue.length];
  const revealed = picked !== null;
  const isCorrect = picked === round.shuffledOddIndex;

  const handlePick = useCallback(
    (idx: number) => {
      if (revealed) return;
      const correct = idx === round.shuffledOddIndex;
      setPicked(idx);
      setTotal((t) => t + 1);
      if (correct) setScore((s) => s + 1);
      setHistory((prev) =>
        [
          {
            emojis: round.shuffledEmojis,
            picked: idx,
            oddIndex: round.shuffledOddIndex,
            theme: round.theme,
            correct,
          },
          ...prev,
        ].slice(0, 15),
      );
    },
    [revealed, round],
  );

  function nextRound() {
    if (qIndex + 1 >= queue.length) {
      setQueue(buildQueue());
      setQIndex(0);
    } else {
      setQIndex((i) => i + 1);
    }
    setPicked(null);
  }

  function resetStats() {
    setScore(0);
    setTotal(0);
    setHistory([]);
    setQueue(buildQueue());
    setQIndex(0);
    setPicked(null);
  }

  const accuracy = useMemo(
    () => (total > 0 ? Math.round((score / total) * 100) : null),
    [score, total],
  );

  const roundNumber = (qIndex % ROUNDS.length) + 1;

  return (
    <div className="mx-auto max-w-xl p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Odd One Out' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Odd One Out 🔍</h1>
        <p className="text-sm text-gray-500 mt-1">
          Four emojis share a theme — one doesn't fit. Tap the odd one out.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 text-sm flex-wrap">
        <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1.5 font-medium">
          ✅ {score} correct
        </span>
        <span className="bg-gray-50 text-gray-600 rounded-lg px-3 py-1.5 font-medium">
          📋 Round {roundNumber}/{ROUNDS.length}
        </span>
        {accuracy !== null && (
          <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 font-medium">
            🎯 {accuracy}% accuracy
          </span>
        )}
      </div>

      {/* Theme hint (revealed after guess) */}
      <div
        className={`text-center text-sm font-medium transition-all ${
          revealed ? 'text-gray-500' : 'text-transparent select-none'
        }`}
      >
        Theme: <span className="font-semibold">{round.theme}</span>
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-5 gap-3">
        {round.shuffledEmojis.map((emoji, idx) => {
          const isOdd = idx === round.shuffledOddIndex;
          const isPicked = idx === picked;

          let cls =
            'aspect-square rounded-2xl border-2 flex items-center justify-center text-4xl sm:text-5xl transition-all select-none ';

          if (!revealed) {
            cls +=
              'border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 cursor-pointer active:scale-95';
          } else if (isOdd) {
            cls += 'border-green-400 bg-green-50 scale-105';
          } else if (isPicked && !isOdd) {
            cls += 'border-red-400 bg-red-50';
          } else {
            cls += 'border-gray-100 bg-gray-50 opacity-50';
          }

          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={revealed}
              className={cls}
              aria-label={`Emoji ${emoji}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>

      {/* Result & explanation */}
      {revealed && (
        <div
          className={`rounded-2xl p-5 space-y-2 border ${
            isCorrect
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Not quite!'}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {round.explanation}
          </p>
          <button
            onClick={nextRound}
            className="mt-1 rounded-xl bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700 transition text-sm"
          >
            Next Round →
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base">Recent rounds</h2>
            <button
              onClick={resetStats}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          </div>
          <div className="space-y-2">
            {history.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm border-t pt-2"
              >
                <span className="text-lg">{row.correct ? '✅' : '❌'}</span>
                <div className="flex gap-1 flex-wrap">
                  {row.emojis.map((e, j) => (
                    <span
                      key={j}
                      className={`text-xl ${j === row.oddIndex ? 'opacity-100' : 'opacity-40'}`}
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <span className="text-gray-400 text-xs ml-auto shrink-0">
                  {row.theme}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 pb-4 text-center">
        {ROUNDS.length} curated rounds — reshuffled after every complete run.
      </p>
    </div>
  );
}
