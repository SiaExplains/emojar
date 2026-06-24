'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

type PictionaryItem = {
  emoji: string;
  answers: string[];
  hint?: string;
};

const DATASET: PictionaryItem[] = [
  { emoji: '🌍', answers: ['world', 'earth', 'globe'] },
  { emoji: '❤️', answers: ['love', 'heart'] },
  { emoji: '🔥', answers: ['fire', 'hot', 'flame'] },
  { emoji: '🎵', answers: ['music', 'song', 'note'] },
  { emoji: '📚', answers: ['books', 'read', 'library', 'book'] },
  { emoji: '🌙', answers: ['moon', 'night'] },
  { emoji: '⭐', answers: ['star'] },
  { emoji: '🎂', answers: ['birthday', 'cake'] },
  { emoji: '🚀', answers: ['rocket', 'space', 'launch'] },
  { emoji: '🌈', answers: ['rainbow'] },
  { emoji: '🏆', answers: ['trophy', 'win', 'winner', 'champion'] },
  { emoji: '🌸', answers: ['blossom', 'cherry', 'flower', 'spring'] },
  { emoji: '🍕', answers: ['pizza'] },
  { emoji: '🐶', answers: ['dog', 'puppy'] },
  { emoji: '🐱', answers: ['cat', 'kitten'] },
  { emoji: '🌊', answers: ['wave', 'ocean', 'sea', 'water'] },
  { emoji: '⚽', answers: ['soccer', 'football', 'ball'] },
  { emoji: '🎸', answers: ['guitar', 'music', 'rock'] },
  { emoji: '🍎', answers: ['apple', 'fruit'] },
  { emoji: '🏠', answers: ['house', 'home'] },
  { emoji: '🌺', answers: ['flower', 'hibiscus'] },
  { emoji: '🦁', answers: ['lion'] },
  { emoji: '🍦', answers: ['ice cream', 'icecream', 'gelato'] },
  { emoji: '🎃', answers: ['halloween', 'pumpkin', 'jack'] },
  { emoji: '❄️', answers: ['snow', 'snowflake', 'cold', 'winter'] },
  { emoji: '🌴', answers: ['palm', 'tree', 'tropical'] },
  { emoji: '🎹', answers: ['piano', 'keyboard', 'music'] },
  { emoji: '🦋', answers: ['butterfly'] },
  { emoji: '🍔', answers: ['burger', 'hamburger'] },
  { emoji: '✈️', answers: ['airplane', 'plane', 'flight', 'travel'] },
  { emoji: '🎭', answers: ['theater', 'theatre', 'drama', 'masks'] },
  { emoji: '🌻', answers: ['sunflower', 'flower'] },
  { emoji: '🐬', answers: ['dolphin', 'fish', 'ocean'] },
  { emoji: '🎯', answers: ['target', 'bullseye', 'aim'] },
  { emoji: '🍓', answers: ['strawberry', 'berry', 'fruit'] },
  { emoji: '🏔️', answers: ['mountain', 'peak', 'summit'] },
  { emoji: '🎨', answers: ['art', 'paint', 'palette', 'painting'] },
  { emoji: '🦅', answers: ['eagle', 'bird', 'hawk'] },
  { emoji: '🍁', answers: ['maple', 'leaf', 'autumn', 'fall', 'canada'] },
  { emoji: '🔮', answers: ['crystal', 'ball', 'magic', 'fortune'] },
];

const GAME_DURATION = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EmojiPictionaryPage() {
  const [queue, setQueue] = useState<PictionaryItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'done'>(
    'idle',
  );
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('done');
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  function startGame() {
    setQueue(shuffle(DATASET));
    setCurrentIdx(0);
    setScore(0);
    setInput('');
    setTimeLeft(GAME_DURATION);
    setFlash(null);
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const current = queue[currentIdx];

  function checkAnswer(value: string) {
    if (!current || gameState !== 'playing') return;
    const norm = value.trim().toLowerCase();
    if (!norm) return;

    if (current.answers.includes(norm)) {
      setFlash('correct');
      setScore((s) => s + 1);
      setInput('');
      setTimeout(() => {
        setFlash(null);
        setCurrentIdx((i) => {
          const next = i + 1;
          if (next >= queue.length) {
            endGame();
          }
          return next;
        });
        inputRef.current?.focus();
      }, 400);
    } else {
      setFlash('wrong');
      setTimeout(() => setFlash(null), 300);
    }
  }

  function skipCurrent() {
    if (gameState !== 'playing') return;
    setInput('');
    setFlash(null);
    setCurrentIdx((i) => {
      const next = i + 1;
      if (next >= queue.length) {
        endGame();
      }
      return next;
    });
    inputRef.current?.focus();
  }

  const progressPct = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="mx-auto max-w-md p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Emoji Pictionary' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Pictionary</h1>
        <p className="text-gray-500 text-sm mt-1">
          Type what the emoji means — 60 seconds!
        </p>
      </div>

      {gameState === 'idle' && (
        <div className="text-center space-y-4 py-8">
          <div className="text-5xl">🎨</div>
          <p className="text-gray-600">
            40 emoji clues · Type the answer · 60 seconds on the clock
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600"
          >
            Start
          </button>
        </div>
      )}

      {gameState === 'playing' && current && (
        <div className="space-y-4">
          {/* Timer bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-red-500' : 'bg-pink-400'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span
              className={`font-mono font-bold w-10 text-right ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-500'}`}
            >
              {timeLeft}s
            </span>
          </div>

          {/* Score + progress */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {currentIdx + 1} / {queue.length}
            </span>
            <span className="font-medium text-pink-600">Score: {score}</span>
          </div>

          {/* Emoji clue */}
          <div
            className={`text-center py-10 rounded-2xl border-2 transition-all ${
              flash === 'correct'
                ? 'bg-green-50 border-green-400'
                : flash === 'wrong'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="text-8xl">{current.emoji}</div>
          </div>

          {/* Input */}
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                checkAnswer(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') checkAnswer(input);
              }}
              placeholder="Type your answer…"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-400 outline-none text-lg text-center"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <div className="flex gap-2">
              <button
                onClick={() => checkAnswer(input)}
                className="flex-1 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600"
              >
                Submit
              </button>
              <button
                onClick={skipCurrent}
                className="px-4 py-2 border rounded-xl text-gray-500 hover:bg-gray-50"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'done' && (
        <div className="text-center space-y-4 py-4">
          <div className="text-5xl">🎨</div>
          <p className="text-2xl font-bold">
            {score} / {queue.length} correct
          </p>
          <p className="text-gray-500">
            {score >= 30
              ? 'Emoji genius! 🧠'
              : score >= 20
                ? 'Excellent! ⭐'
                : score >= 10
                  ? 'Good job! 👍'
                  : 'Keep practicing! 💪'}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
