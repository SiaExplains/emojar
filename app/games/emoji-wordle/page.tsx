'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category?: string;
};

const EMOJIS: EmojiItem[] = (allEmojis as EmojiItem[]).filter(
  (e) => e.char && e.name,
);

const WORD_LIST: { word: string; emoji: string }[] = Array.from(
  new Map(
    EMOJIS.filter((e) => {
      const parts = e.name.toLowerCase().split(' ');
      return parts.some((p) => p.length === 5 && /^[a-z]+$/.test(p));
    }).flatMap((e) => {
      const parts = e.name.toLowerCase().split(' ');
      return parts
        .filter((p) => p.length === 5 && /^[a-z]+$/.test(p))
        .map(
          (p) =>
            [p, { word: p, emoji: e.char }] as [
              string,
              { word: string; emoji: string },
            ],
        );
    }),
  ).values(),
).slice(0, 2000);

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

function getTileStates(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const used = Array(5).fill(false);

  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }
  return result;
}

const TILE_COLORS: Record<LetterState, string> = {
  correct: 'bg-green-500 text-white border-green-500',
  present: 'bg-yellow-400 text-white border-yellow-400',
  absent: 'bg-gray-500 text-white border-gray-500',
  empty: 'bg-white border-gray-300',
};

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function EmojiWordlePage() {
  const [target, setTarget] = useState<{ word: string; emoji: string }>(() =>
    pickRandom(WORD_LIST),
  );
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('');

  const letterStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    for (const guess of guesses) {
      const states = getTileStates(guess, target.word);
      guess.split('').forEach((ch, i) => {
        const prev = map[ch];
        const next = states[i];
        if (prev === 'correct') return;
        if (next === 'correct' || prev === undefined) {
          map[ch] = next;
        } else if (next === 'present') {
          map[ch] = next;
        }
      });
    }
    return map;
  }, [guesses, target.word]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setMessage('Word must be 5 letters');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === target.word) {
      setWon(true);
      setGameOver(true);
      setMessage('');
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      setMessage('');
    }
  }, [currentGuess, guesses, target.word]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;
      if (key === 'Enter') {
        submitGuess();
      } else if (key === '⌫' || key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key.toLowerCase());
      }
    },
    [gameOver, submitGuess, currentGuess],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => handleKey(e.key);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  function newGame() {
    setTarget(pickRandom(WORD_LIST));
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setMessage('');
  }

  const allRows = [...guesses, ...(gameOver ? [] : [currentGuess])].concat(
    Array(Math.max(0, 6 - guesses.length - (gameOver ? 0 : 1))).fill(''),
  );
  const displayRows = allRows.slice(0, 6);

  return (
    <div className="mx-auto max-w-lg p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Emoji Wordle' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Wordle</h1>
        <p className="text-gray-500 text-sm mt-1">
          Guess the 5-letter emoji name in 6 tries
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="text-center text-sm font-medium text-red-600">
          {message}
        </div>
      )}

      {/* Grid */}
      <div className="flex flex-col gap-1.5 items-center">
        {displayRows.map((row, ri) => {
          const isSubmitted = ri < guesses.length;
          const isCurrent = !gameOver && ri === guesses.length;
          const states = isSubmitted
            ? getTileStates(guesses[ri], target.word)
            : Array(5).fill('empty' as LetterState);
          const letters = row.padEnd(5, ' ').split('');

          return (
            <div
              key={ri}
              className={`flex gap-1.5 ${isCurrent && shake ? 'animate-[wiggle_0.3s_ease]' : ''}`}
            >
              {letters.map((ch, ci) => (
                <div
                  key={ci}
                  className={`w-12 h-12 flex items-center justify-center border-2 text-xl font-bold uppercase transition-all duration-200 ${
                    TILE_COLORS[states[ci] as LetterState]
                  }`}
                >
                  {ch.trim()}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Game over reveal */}
      {gameOver && (
        <div className="text-center p-4 rounded-xl border space-y-2">
          {won ? (
            <p className="text-green-600 font-semibold text-lg">
              Well done! 🎉
            </p>
          ) : (
            <p className="text-red-600 font-semibold text-lg">
              Better luck next time!
            </p>
          )}
          <p className="text-4xl">{target.emoji}</p>
          <p className="text-lg font-bold uppercase tracking-widest">
            {target.word}
          </p>
          <button
            onClick={newGame}
            className="mt-2 px-5 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            New Game
          </button>
        </div>
      )}

      {/* Keyboard */}
      <div className="space-y-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {row.map((key) => {
              const state = letterStates[key] ?? 'empty';
              const isSpecial = key === 'Enter' || key === '⌫';
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`${isSpecial ? 'px-3 text-xs' : 'w-8'} h-10 rounded font-semibold text-sm transition-colors ${
                    state === 'correct'
                      ? 'bg-green-500 text-white'
                      : state === 'present'
                        ? 'bg-yellow-400 text-white'
                        : state === 'absent'
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {!gameOver && (
        <div className="text-center">
          <button
            onClick={newGame}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Skip / New word
          </button>
        </div>
      )}
    </div>
  );
}
