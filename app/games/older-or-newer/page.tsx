'use client';

import { useCallback, useMemo, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiEntry = {
  char: string;
  name: string;
  slug: string;
  version: string;
};

const VERSION_YEAR: Record<string, number> = {
  '0.6': 2010,
  '0.7': 2014,
  '1.0': 2015,
  '2.0': 2015,
  '3.0': 2016,
  '4.0': 2016,
  '5.0': 2017,
  '11.0': 2018,
  '12.0': 2019,
  '12.1': 2019,
  '13.0': 2020,
  '13.1': 2020,
  '14.0': 2021,
  '15.0': 2022,
  '15.1': 2023,
  '16.0': 2024,
};

const POOL: EmojiEntry[] = (
  allEmojis as { char: string; name: string; slug: string; version: string }[]
).filter((e) => e.char && e.version && VERSION_YEAR[e.version] !== undefined);

function pickTwo(): [EmojiEntry, EmojiEntry] {
  let a: EmojiEntry, b: EmojiEntry;
  do {
    a = POOL[Math.floor(Math.random() * POOL.length)];
    b = POOL[Math.floor(Math.random() * POOL.length)];
  } while (a.slug === b.slug || a.version === b.version);
  return [a, b];
}

type HistoryRow = {
  emojiA: string;
  nameA: string;
  versionA: string;
  emojiB: string;
  nameB: string;
  versionB: string;
  guess: 'older' | 'newer';
  correct: boolean;
};

export default function OlderOrNewerPage() {
  const [[emojiA, emojiB], setPair] = useState<[EmojiEntry, EmojiEntry]>(() =>
    pickTwo(),
  );
  const [guess, setGuess] = useState<'older' | 'newer' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const yearA = VERSION_YEAR[emojiA.version];
  const yearB = VERSION_YEAR[emojiB.version];

  const correctAnswer: 'older' | 'newer' =
    parseFloat(emojiB.version) < parseFloat(emojiA.version) ? 'older' : 'newer';

  const isCorrect = guess !== null && guess === correctAnswer;
  const revealed = guess !== null;

  const handleGuess = useCallback(
    (choice: 'older' | 'newer') => {
      if (revealed) return;
      setGuess(choice);
      const correct = choice === correctAnswer;
      setTotal((t) => t + 1);
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((b) => Math.max(b, next));
          return next;
        });
      } else {
        setStreak(0);
      }
      setHistory((prev) =>
        [
          {
            emojiA: emojiA.char,
            nameA: emojiA.name,
            versionA: emojiA.version,
            emojiB: emojiB.char,
            nameB: emojiB.name,
            versionB: emojiB.version,
            guess: choice,
            correct,
          },
          ...prev,
        ].slice(0, 15),
      );
    },
    [correctAnswer, emojiA, emojiB, revealed],
  );

  function nextRound() {
    setPair(pickTwo());
    setGuess(null);
  }

  function resetStats() {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotal(0);
    setHistory([]);
    setPair(pickTwo());
    setGuess(null);
  }

  const accuracy = useMemo(
    () => (total > 0 ? Math.round((score / total) * 100) : null),
    [score, total],
  );

  const versionDiff = Math.abs(
    parseFloat(emojiB.version) - parseFloat(emojiA.version),
  );
  const difficulty =
    versionDiff <= 1 ? '🔥 Hard' : versionDiff <= 3 ? '🤔 Tricky' : '😊 Easy';

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Older or Newer' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Older or Newer 🕰️</h1>
        <p className="text-sm text-gray-500 mt-1">
          Was the right emoji added to Unicode <strong>before</strong> or{' '}
          <strong>after</strong> the left one?
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 text-sm flex-wrap">
        <span className="bg-green-50 text-green-700 rounded-lg px-3 py-1.5 font-medium">
          ✅ {score} correct
        </span>
        <span className="bg-orange-50 text-orange-600 rounded-lg px-3 py-1.5 font-medium">
          🔥 Streak: {streak}
        </span>
        <span className="bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 font-medium">
          ⭐ Best: {bestStreak}
        </span>
        {accuracy !== null && (
          <span className="bg-gray-50 text-gray-600 rounded-lg px-3 py-1.5 font-medium">
            🎯 {accuracy}% accuracy
          </span>
        )}
      </div>

      {/* Emoji comparison cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Emoji A — always revealed */}
        <div className="border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-2 bg-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            This emoji…
          </p>
          <div className="text-7xl leading-none select-none my-2">
            {emojiA.char}
          </div>
          <p className="text-sm font-medium text-gray-700 text-center">
            {emojiA.name}
          </p>
          {revealed ? (
            <span className="mt-1 text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-mono">
              v{emojiA.version} · {yearA}
            </span>
          ) : (
            <span className="mt-1 text-xs bg-gray-100 text-gray-400 rounded-full px-3 py-1">
              added: v{emojiA.version}
            </span>
          )}
        </div>

        {/* Emoji B — mystery */}
        <div
          className={`border-2 rounded-2xl p-6 flex flex-col items-center gap-2 shadow-sm transition-colors ${
            !revealed
              ? 'border-blue-300 bg-blue-50'
              : isCorrect
                ? 'border-green-400 bg-green-50'
                : 'border-red-400 bg-red-50'
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            …vs. this one?
          </p>
          <div className="text-7xl leading-none select-none my-2">
            {emojiB.char}
          </div>
          <p className="text-sm font-medium text-gray-700 text-center">
            {emojiB.name}
          </p>
          {revealed ? (
            <span
              className={`mt-1 text-xs rounded-full px-3 py-1 font-mono font-semibold ${
                isCorrect
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              v{emojiB.version} · {yearB}
            </span>
          ) : (
            <span className="mt-1 text-xs bg-blue-100 text-blue-500 rounded-full px-3 py-1">
              {difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleGuess('older')}
            className="rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-sm font-semibold hover:bg-amber-50 hover:border-amber-400 transition flex flex-col items-center gap-1"
          >
            <span className="text-2xl">⬅️</span>
            <span>Older</span>
            <span className="text-xs text-gray-400 font-normal">
              Added before {emojiA.name}
            </span>
          </button>
          <button
            onClick={() => handleGuess('newer')}
            className="rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-sm font-semibold hover:bg-sky-50 hover:border-sky-400 transition flex flex-col items-center gap-1"
          >
            <span className="text-2xl">➡️</span>
            <span>Newer</span>
            <span className="text-xs text-gray-400 font-normal">
              Added after {emojiA.name}
            </span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pt-1">
          <p
            className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Wrong!'}
          </p>
          <p className="text-sm text-gray-500 text-center">
            {emojiB.char} <strong>{emojiB.name}</strong> was added in Unicode{' '}
            {emojiB.version} ({yearB}), which is{' '}
            <strong>
              {parseFloat(emojiB.version) < parseFloat(emojiA.version)
                ? 'older'
                : 'newer'}
            </strong>{' '}
            than {emojiA.char} <strong>{emojiA.name}</strong> (v{emojiA.version}
            , {yearA}).
          </p>
          <button
            onClick={nextRound}
            className="rounded-xl bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700 transition text-sm"
          >
            Next Round →
          </button>
        </div>
      )}

      {/* History table */}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                  <th className="pb-2 pr-3">Left</th>
                  <th className="pb-2 pr-3">Right</th>
                  <th className="pb-2 pr-3">Your guess</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-3">
                      <span className="text-xl">{row.emojiA}</span>
                      <span className="text-xs text-gray-400 ml-1">
                        v{row.versionA}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className="text-xl">{row.emojiB}</span>
                      <span className="text-xs text-gray-400 ml-1">
                        v{row.versionB}
                      </span>
                    </td>
                    <td
                      className={`py-2 pr-3 capitalize ${row.correct ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {row.guess}
                    </td>
                    <td className="py-2">{row.correct ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 pb-4">
        {POOL.length.toLocaleString()} emojis spanning Unicode versions 0.6
        (2010) through 16.0 (2024).
      </p>
    </div>
  );
}
