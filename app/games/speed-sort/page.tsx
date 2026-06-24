'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category: string;
};

const TARGET_CATEGORIES = [
  'Smileys & Emotion',
  'Animals & Nature',
  'Food & Drink',
  'Travel & Places',
];

const POOL: EmojiItem[] = (allEmojis as EmojiItem[]).filter(
  (e) => e.char && e.name && TARGET_CATEGORIES.includes(e.category),
);

const TOTAL_ROUNDS = 10;
const ROUND_TIME = 3;

function pickRandom(pool: EmojiItem[]): EmojiItem {
  return pool[Math.floor(Math.random() * pool.length)];
}

type RoundResult = {
  emoji: EmojiItem;
  chosen: string;
  correct: boolean;
};

export default function SpeedSortPage() {
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState<EmojiItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>(
    'idle',
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(ROUND_TIME);

  const advanceRound = useCallback(
    (chosen: string | null) => {
      if (!current) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const correct = chosen === current.category;
      const result: RoundResult = {
        emoji: current,
        chosen: chosen ?? '(no answer)',
        correct,
      };
      const newResults = [...results, result];
      setResults(newResults);

      const newStreak = correct ? streak + 1 : 0;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      if (!correct) {
        setShowAnswer(current.category);
        setTimeout(() => {
          setShowAnswer(null);
          if (newResults.length >= TOTAL_ROUNDS) {
            setGameState('done');
          } else {
            nextRound(newResults.length);
          }
        }, 1200);
      } else {
        setShowAnswer(null);
        if (newResults.length >= TOTAL_ROUNDS) {
          setGameState('done');
        } else {
          nextRound(newResults.length);
        }
      }
    },
    [current, results, streak],
  );

  function nextRound(completedCount: number) {
    const next = pickRandom(POOL);
    setCurrent(next);
    setRound(completedCount + 1);
    timeLeftRef.current = ROUND_TIME;
    setTimeLeft(ROUND_TIME);
  }

  useEffect(() => {
    if (gameState !== 'playing' || !current || showAnswer !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        advanceRound(null);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, gameState, showAnswer, advanceRound]);

  function startGame() {
    setResults([]);
    setStreak(0);
    setBestStreak(0);
    setShowAnswer(null);
    setGameState('playing');
    const first = pickRandom(POOL);
    setCurrent(first);
    setRound(1);
    timeLeftRef.current = ROUND_TIME;
    setTimeLeft(ROUND_TIME);
  }

  const score = results.filter((r) => r.correct).length;
  const progressPct = (timeLeft / ROUND_TIME) * 100;

  const catColors: Record<string, string> = {
    'Smileys & Emotion':
      'bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-900',
    'Animals & Nature':
      'bg-green-100 border-green-300 hover:bg-green-200 text-green-900',
    'Food & Drink':
      'bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-900',
    'Travel & Places':
      'bg-cyan-100 border-cyan-300 hover:bg-cyan-200 text-cyan-900',
  };

  return (
    <div className="mx-auto max-w-md p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Speed Sort' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Speed Sort</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pick the right category before 3 seconds run out!
        </p>
      </div>

      {gameState === 'idle' && (
        <div className="text-center space-y-4 py-8">
          <p className="text-4xl">⚡</p>
          <p className="text-gray-600">
            10 rounds · 3 seconds each · Build your streak!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      )}

      {gameState === 'playing' && current && (
        <div className="space-y-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Round {round} / {TOTAL_ROUNDS}
            </span>
            <span>
              Score: {score} · Streak: {streak} 🔥
            </span>
          </div>

          {/* Timer bar */}
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft <= 1 ? 'bg-red-500' : 'bg-blue-400'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Emoji display */}
          <div className="text-center py-8 border rounded-2xl bg-gray-50">
            <div className="text-7xl mb-3">{current.char}</div>
            <div className="text-sm text-gray-400">{current.name}</div>
            <div className="text-2xl font-bold mt-1 text-gray-300">
              {timeLeft}s
            </div>
          </div>

          {/* Answer reveal */}
          {showAnswer && (
            <div className="text-center text-sm font-medium text-red-600 animate-pulse">
              Answer: {showAnswer}
            </div>
          )}

          {/* Category buttons */}
          <div className="grid grid-cols-2 gap-2">
            {TARGET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => advanceRound(cat)}
                disabled={showAnswer !== null}
                className={`px-3 py-3 rounded-xl border-2 font-medium text-sm transition-all active:scale-95 disabled:opacity-50 ${catColors[cat]}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'done' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-2">
            <p className="text-3xl">⚡</p>
            <p className="font-bold text-xl">
              {score} / {TOTAL_ROUNDS} correct
            </p>
            <p className="text-gray-500 text-sm">
              Best streak: {bestStreak} 🔥
            </p>
            <button
              onClick={startGame}
              className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>

          {/* Results list */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-500">Round results</p>
            {results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                  r.correct ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <span className="text-xl">{r.emoji.char}</span>
                <span className="flex-1 text-gray-600">{r.emoji.category}</span>
                <span
                  className={`font-semibold ${r.correct ? 'text-green-600' : 'text-red-500'}`}
                >
                  {r.correct ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
