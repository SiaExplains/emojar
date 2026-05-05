'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import allEmojis from '../../../data/emojis.json';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
};

type ScoreRow = {
  when: string;
  emoji: string;
  word: string;
  result: 'win' | 'loss';
  wrongGuesses: number;
  duration: number; // seconds
};

const MAX_WRONG = 6;

const EMOJIS: EmojiItem[] = (allEmojis as EmojiItem[])
  .filter((e) => {
    if (!e.char || !e.name) return false;
    const letters = e.name.replace(/[^a-z]/gi, '');
    return letters.length >= 4 && letters.length <= 16;
  })
  .reduce((acc: EmojiItem[], e) => {
    if (!acc.find((x) => x.char === e.char)) acc.push(e);
    return acc;
  }, []);

function pickRandom(exclude?: string): EmojiItem {
  const pool = exclude ? EMOJIS.filter((e) => e.char !== exclude) : EMOJIS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function normalizeWord(name: string): string {
  return name.toLowerCase().replace(/[^a-z ]/g, '');
}

// SVG hangman drawing — stages 0..6
function HangmanSVG({ wrong }: { wrong: number }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className="w-36 h-48 mx-auto"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Gallows */}
      <line x1="10" y1="150" x2="110" y2="150" stroke="#334155" strokeWidth="4" />
      <line x1="30" y1="150" x2="30" y2="10" stroke="#334155" strokeWidth="4" />
      <line x1="30" y1="10" x2="75" y2="10" stroke="#334155" strokeWidth="4" />
      <line x1="75" y1="10" x2="75" y2="30" stroke="#334155" strokeWidth="3" />

      {/* Head */}
      {wrong >= 1 && (
        <circle cx="75" cy="42" r="12" stroke="#ef4444" strokeWidth="3" fill="none" />
      )}
      {/* Body */}
      {wrong >= 2 && (
        <line x1="75" y1="54" x2="75" y2="100" stroke="#ef4444" strokeWidth="3" />
      )}
      {/* Left arm */}
      {wrong >= 3 && (
        <line x1="75" y1="65" x2="52" y2="85" stroke="#ef4444" strokeWidth="3" />
      )}
      {/* Right arm */}
      {wrong >= 4 && (
        <line x1="75" y1="65" x2="98" y2="85" stroke="#ef4444" strokeWidth="3" />
      )}
      {/* Left leg */}
      {wrong >= 5 && (
        <line x1="75" y1="100" x2="52" y2="128" stroke="#ef4444" strokeWidth="3" />
      )}
      {/* Right leg */}
      {wrong >= 6 && (
        <line x1="75" y1="100" x2="98" y2="128" stroke="#ef4444" strokeWidth="3" />
      )}
    </svg>
  );
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function Page() {
  const [current, setCurrent] = useState<EmojiItem>(() => pickRandom());
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [startAt, setStartAt] = useState<number>(Date.now());
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [revealed, setRevealed] = useState(false);

  const word = useMemo(() => normalizeWord(current.name), [current]);

  const wrongGuesses = useMemo(
    () => [...guessed].filter((l) => !word.includes(l)).length,
    [guessed, word],
  );

  const won = useMemo(
    () =>
      word
        .split('')
        .every((ch) => ch === ' ' || guessed.has(ch)),
    [word, guessed],
  );

  const lost = wrongGuesses >= MAX_WRONG;
  const gameOver = won || lost;

  const handleGuess = useCallback(
    (letter: string) => {
      if (gameOver || guessed.has(letter)) return;
      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);

      const newWrong = [...next].filter((l) => !word.includes(l)).length;
      const newWon = word
        .split('')
        .every((ch) => ch === ' ' || next.has(ch));
      const newLost = newWrong >= MAX_WRONG;

      if (newWon || newLost) {
        const duration = Math.round((Date.now() - startAt) / 1000);
        setScores((prev) => {
          const row: ScoreRow = {
            when: new Date().toISOString(),
            emoji: current.char,
            word: current.name,
            result: newWon ? 'win' : 'loss',
            wrongGuesses: newWrong,
            duration,
          };
          return [row, ...prev].slice(0, 20);
        });
      }
    },
    [gameOver, guessed, word, startAt, current],
  );

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const l = e.key.toLowerCase();
      if (/^[a-z]$/.test(l)) handleGuess(l);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleGuess]);

  function nextGame() {
    setCurrent(pickRandom(current.char));
    setGuessed(new Set());
    setStartAt(Date.now());
    setRevealed(false);
  }

  const winsCount = scores.filter((s) => s.result === 'win').length;
  const lossCount = scores.filter((s) => s.result === 'loss').length;

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Emoji Hangman</h1>
      <p className="text-sm text-gray-500">Guess the emoji name letter by letter. You have {MAX_WRONG} wrong guesses.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: hangman + emoji */}
        <div className="border rounded-xl p-4 flex flex-col items-center gap-3">
          <HangmanSVG wrong={wrongGuesses} />

          <div className="text-6xl leading-none select-none">
            {lost && !won ? (revealed ? current.char : '❓') : current.char}
          </div>

          <div className="text-sm text-gray-500">
            Wrong: <span className="font-semibold text-red-500">{wrongGuesses}</span> / {MAX_WRONG}
          </div>

          {gameOver && (
            <div className={`text-center font-semibold ${won ? 'text-green-600' : 'text-red-600'}`}>
              {won ? '🎉 You got it!' : `💀 The word was: "${current.name}"`}
            </div>
          )}

          <div className="flex gap-2 flex-wrap justify-center">
            {gameOver && (
              <button
                onClick={nextGame}
                className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 text-sm font-medium"
              >
                Next word
              </button>
            )}
            {lost && !revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50 text-sm"
              >
                Reveal emoji
              </button>
            )}
          </div>
        </div>

        {/* Right: word + keyboard */}
        <div className="border rounded-xl p-4 flex flex-col gap-4">
          {/* Word blanks */}
          <div className="flex flex-wrap gap-2 justify-center">
            {word.split(' ').map((chunk, wi) => (
              <div key={wi} className="flex gap-1">
                {chunk.split('').map((letter, li) => (
                  <div
                    key={li}
                    className="w-8 h-10 border-b-2 border-gray-400 flex items-end justify-center pb-1 text-lg font-bold"
                  >
                    {guessed.has(letter) || gameOver ? letter : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-400 text-center">
            {word.split(' ').length > 1
              ? `${word.split(' ').length} words · ${word.replace(/ /g, '').length} letters`
              : `${word.length} letters`}
          </div>

          {/* Keyboard */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
            {ALPHABET.map((l) => {
              const isGuessed = guessed.has(l);
              const isCorrect = isGuessed && word.includes(l);
              const isWrong = isGuessed && !word.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => handleGuess(l)}
                  disabled={isGuessed || gameOver}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition
                    ${isCorrect ? 'bg-green-500 text-white border-green-500' : ''}
                    ${isWrong ? 'bg-red-200 text-red-400 border-red-200' : ''}
                    ${!isGuessed ? 'border hover:bg-gray-100' : ''}
                    disabled:cursor-default`}
                >
                  {l}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-4 justify-center text-sm mt-2">
            <span className="text-green-600 font-medium">✅ {winsCount} won</span>
            <span className="text-red-500 font-medium">💀 {lossCount} lost</span>
          </div>
        </div>
      </div>

      {/* Score history */}
      {scores.length > 0 && (
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent games</h2>
            <button
              onClick={() => setScores([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-1 pr-4">Emoji</th>
                  <th className="py-1 pr-4">Word</th>
                  <th className="py-1 pr-4">Result</th>
                  <th className="py-1 pr-4">Wrong</th>
                  <th className="py-1 pr-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4 text-xl">{s.emoji}</td>
                    <td className="py-2 pr-4">{s.word}</td>
                    <td className={`py-2 pr-4 font-medium ${s.result === 'win' ? 'text-green-600' : 'text-red-500'}`}>
                      {s.result === 'win' ? '✅ Win' : '💀 Loss'}
                    </td>
                    <td className="py-2 pr-4">{s.wrongGuesses}</td>
                    <td className="py-2 pr-4">{s.duration}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">Tip: you can also use your keyboard to guess letters.</p>
    </div>
  );
}
