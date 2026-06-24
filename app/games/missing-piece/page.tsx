'use client';

import { useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category: string;
};

const EMOJIS: EmojiItem[] = (allEmojis as EmojiItem[]).filter(
  (e) => e.char && e.name && e.category,
);

// Group by category
const BY_CATEGORY: Record<string, EmojiItem[]> = {};
for (const e of EMOJIS) {
  if (!BY_CATEGORY[e.category]) BY_CATEGORY[e.category] = [];
  BY_CATEGORY[e.category].push(e);
}

// Only categories with 12+ emojis (need 9 grid + 3 distractors)
const VALID_CATEGORIES = Object.entries(BY_CATEGORY)
  .filter(([, arr]) => arr.length >= 12)
  .map(([cat]) => cat);

const TOTAL_ROUNDS = 10;

type RoundData = {
  grid: EmojiItem[];
  hiddenIdx: number;
  options: EmojiItem[];
  correct: EmojiItem;
};

function buildRound(): RoundData {
  const cat =
    VALID_CATEGORIES[Math.floor(Math.random() * VALID_CATEGORIES.length)];
  const pool = BY_CATEGORY[cat].slice().sort(() => Math.random() - 0.5);
  const grid = pool.slice(0, 9);
  const distractors = pool.slice(9, 12);

  const hiddenIdx = Math.floor(Math.random() * 9);
  const correct = grid[hiddenIdx];

  // 4 options: correct + 3 distractors, shuffled
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

  return { grid, hiddenIdx, options, correct };
}

export default function MissingPiecePage() {
  const [round, setRound] = useState(1);
  const [roundData, setRoundData] = useState<RoundData>(() => buildRound());
  const [chosen, setChosen] = useState<EmojiItem | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const isCorrect = chosen?.char === roundData.correct.char;

  function handlePick(e: EmojiItem) {
    if (chosen) return;
    setChosen(e);
    const correct = e.char === roundData.correct.char;
    if (correct) setScore((s) => s + 1);
    setResults((prev) => [...prev, correct]);
  }

  function nextRound() {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setRoundData(buildRound());
    setChosen(null);
  }

  function restart() {
    setRound(1);
    setRoundData(buildRound());
    setChosen(null);
    setScore(0);
    setResults([]);
    setGameOver(false);
  }

  if (gameOver) {
    return (
      <div className="mx-auto max-w-md p-4 space-y-6 text-center">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Games', href: '/games' },
            { label: 'Missing Piece' },
          ]}
        />
        <h1 className="text-2xl font-semibold">Missing Piece</h1>
        <div className="text-5xl">🧩</div>
        <p className="text-2xl font-bold">
          {score} / {TOTAL_ROUNDS} correct
        </p>
        <div className="flex justify-center gap-1 flex-wrap">
          {results.map((r, i) => (
            <span key={i} className={r ? 'text-green-500' : 'text-red-400'}>
              {r ? '✓' : '✗'}
            </span>
          ))}
        </div>
        <p className="text-gray-500">
          {score === 10
            ? 'Perfect! 🏆'
            : score >= 7
              ? 'Great job! ⭐'
              : score >= 5
                ? 'Nice try! 👍'
                : 'Keep playing! 💪'}
        </p>
        <button
          onClick={restart}
          className="px-6 py-2 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Missing Piece' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Missing Piece</h1>
        <p className="text-gray-500 text-sm mt-1">
          Find the missing emoji from the grid!
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Round {round} / {TOTAL_ROUNDS}
        </span>
        <span>Score: {score}</span>
      </div>

      {/* 3×3 Grid */}
      <div className="grid grid-cols-3 gap-2">
        {roundData.grid.map((e, idx) => {
          const isHidden = idx === roundData.hiddenIdx;
          const revealed = chosen !== null && isHidden;
          return (
            <div
              key={idx}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center text-3xl ${
                isHidden
                  ? revealed
                    ? 'border-green-400 bg-green-50'
                    : 'border-dashed border-gray-300 bg-gray-50'
                  : 'border-gray-200 bg-white'
              }`}
              title={!isHidden ? e.name : undefined}
            >
              {isHidden ? (revealed ? e.char : '❓') : e.char}
            </div>
          );
        })}
      </div>

      {/* Category hint */}
      <p className="text-center text-xs text-gray-400">
        All emojis are from the same category
      </p>

      {/* Options */}
      <div className="grid grid-cols-4 gap-2">
        {roundData.options.map((opt) => {
          const picked = chosen?.char === opt.char;
          const isRight = opt.char === roundData.correct.char;
          let cls =
            'aspect-square rounded-xl border-2 text-3xl flex items-center justify-center transition-all hover:scale-105 active:scale-95';
          if (chosen) {
            if (isRight) cls += ' border-green-400 bg-green-100';
            else if (picked) cls += ' border-red-400 bg-red-100';
            else cls += ' border-gray-200 bg-gray-50 opacity-60';
          } else {
            cls +=
              ' border-gray-200 bg-white cursor-pointer hover:border-teal-400';
          }
          return (
            <button
              key={opt.char}
              onClick={() => handlePick(opt)}
              disabled={chosen !== null}
              className={cls}
              title={opt.name}
            >
              {opt.char}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {chosen && (
        <div
          className={`text-center p-3 rounded-xl ${
            isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          <p className="font-semibold">
            {isCorrect
              ? '✓ Correct!'
              : `✗ The answer was ${roundData.correct.char}`}
          </p>
          <p className="text-xs mt-0.5 opacity-75">{roundData.correct.name}</p>
        </div>
      )}

      {chosen && (
        <div className="text-center">
          <button
            onClick={nextRound}
            className="px-6 py-2 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600"
          >
            {round >= TOTAL_ROUNDS ? 'See Results' : 'Next Round'}
          </button>
        </div>
      )}
    </div>
  );
}
