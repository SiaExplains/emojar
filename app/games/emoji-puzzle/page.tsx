'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type Difficulty = 'easy' | 'medium' | 'hard';

const GRID: Record<Difficulty, { cols: number; pairs: number; label: string }> =
  {
    easy: { cols: 4, pairs: 8, label: '4×4' },
    medium: { cols: 6, pairs: 18, label: '6×6' },
    hard: { cols: 8, pairs: 32, label: '8×8' },
  };

const EMOJI_POOL = (allEmojis as { char: string }[])
  .filter((e) => e.char && [...e.char].length <= 2)
  .map((e) => e.char);

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function buildDeck(pairs: number): Card[] {
  const pool = [...EMOJI_POOL].sort(() => Math.random() - 0.5).slice(0, pairs);
  const doubled = [...pool, ...pool];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled.map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function EmojiPuzzlePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>(() => buildDeck(GRID.easy.pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const matched = cards.filter((c) => c.isMatched).length;
  const complete = matched === cards.length;
  const { cols, pairs } = GRID[difficulty];

  useEffect(() => {
    if (started && !complete) {
      timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, complete]);

  const startNew = useCallback((diff: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDifficulty(diff);
    setCards(buildDeck(GRID[diff].pairs));
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setStarted(false);
    setBlocked(false);
  }, []);

  const handleFlip = useCallback(
    (cardId: number) => {
      if (blocked || complete) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return;
      if (!started) setStarted(true);

      const nowFlipped = [...flipped, cardId];
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)),
      );

      if (nowFlipped.length < 2) {
        setFlipped(nowFlipped);
        return;
      }

      setFlipped([]);
      setMoves((m) => m + 1);

      const firstCard = cards.find((c) => c.id === nowFlipped[0])!;
      if (firstCard.emoji === card.emoji) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === nowFlipped[0] || c.id === cardId
              ? { ...c, isFlipped: true, isMatched: true }
              : c,
          ),
        );
      } else {
        setBlocked(true);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === nowFlipped[0] || c.id === cardId
                ? { ...c, isFlipped: false }
                : c,
            ),
          );
          setBlocked(false);
        }, 800);
      }
    },
    [blocked, cards, complete, flipped, started],
  );

  const cardText = cols === 8 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl';

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Emoji Puzzle' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Emoji Puzzle 🃏</h1>
        <p className="text-sm text-gray-500 mt-1">
          Flip cards to find matching emoji pairs. Remember where they are!
        </p>
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(GRID) as Difficulty[]).map((key) => (
          <button
            key={key}
            onClick={() => startNew(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              difficulty === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {key === 'easy' ? '😊' : key === 'medium' ? '🤔' : '🔥'}{' '}
            {key.charAt(0).toUpperCase() + key.slice(1)} ({GRID[key].label})
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 text-sm flex-wrap">
        <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 font-medium">
          🎯 {matched / 2}/{pairs} pairs
        </span>
        <span className="bg-orange-50 text-orange-600 rounded-lg px-3 py-1.5 font-medium">
          🔄 {moves} moves
        </span>
        <span className="bg-gray-50 text-gray-600 rounded-lg px-3 py-1.5 font-medium">
          ⏱ {formatTime(elapsed)}
        </span>
      </div>

      {/* Completion banner */}
      {complete && (
        <div className="border-2 border-green-400 rounded-2xl p-8 text-center space-y-3 bg-green-50">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold text-green-700">Puzzle Complete!</h2>
          <p className="text-gray-600">
            You matched all <strong>{pairs} pairs</strong> in{' '}
            <strong>{moves} moves</strong> and{' '}
            <strong>{formatTime(elapsed)}</strong>.
          </p>
          <button
            onClick={() => startNew(difficulty)}
            className="mt-2 rounded-xl bg-green-600 text-white px-6 py-2.5 font-medium hover:bg-green-700 transition text-sm"
          >
            Play Again →
          </button>
        </div>
      )}

      {/* Card grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => {
          const show = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={show || blocked || complete}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all select-none ${cardText} ${
                card.isMatched
                  ? 'border-green-300 bg-green-50 opacity-50 cursor-default'
                  : card.isFlipped
                    ? 'border-blue-400 bg-blue-50 cursor-default'
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 cursor-pointer active:scale-95'
              }`}
            >
              {show ? card.emoji : <span className="text-gray-300">?</span>}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 pb-4 text-center">
        Click any card to flip it — find all {pairs} matching pairs to win!
      </p>
    </div>
  );
}
