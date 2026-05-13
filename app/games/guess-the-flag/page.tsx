'use client';

import { useCallback, useMemo, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type FlagItem = {
  char: string;
  country: string;
  slug: string;
};

type HistoryRow = {
  flag: string;
  country: string;
  guessed: string;
  correct: boolean;
};

const FLAGS: FlagItem[] = (
  allEmojis as { char: string; name: string; slug: string; subgroup: string }[]
)
  .filter(
    (e) =>
      e.subgroup === 'country-flag' && e.char && e.name.startsWith('flag: '),
  )
  .map((e) => ({
    char: e.char,
    country: e.name.replace('flag: ', ''),
    slug: e.slug,
  }));

function pickRandom(exclude?: FlagItem): FlagItem {
  const pool = exclude ? FLAGS.filter((f) => f.slug !== exclude.slug) : FLAGS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildChoices(correct: FlagItem): string[] {
  const wrong = new Set<string>();
  while (wrong.size < 3) {
    const candidate = pickRandom(correct);
    wrong.add(candidate.country);
  }
  const choices = [correct.country, ...wrong];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}

function newRound(exclude?: FlagItem): {
  current: FlagItem;
  choices: string[];
} {
  const current = pickRandom(exclude);
  return { current, choices: buildChoices(current) };
}

export default function GuessFlagPage() {
  const [{ current, choices }, setRound] = useState(() => newRound());
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const gameOver = selected !== null;
  const isCorrect = selected === current.country;

  const handleGuess = useCallback(
    (choice: string) => {
      if (gameOver) return;
      setSelected(choice);
      const correct = choice === current.country;
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
            flag: current.char,
            country: current.country,
            guessed: choice,
            correct,
          },
          ...prev,
        ].slice(0, 15),
      );
    },
    [gameOver, current],
  );

  function nextRound() {
    setRound(newRound(current));
    setSelected(null);
  }

  function resetStats() {
    setHistory([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotal(0);
    setRound(newRound());
    setSelected(null);
  }

  const accuracy = useMemo(
    () => (total > 0 ? Math.round((score / total) * 100) : null),
    [score, total],
  );

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Guess the Flag' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-semibold">Guess the Flag 🌍</h1>
        <p className="text-sm text-gray-500 mt-1">
          Which country does this flag belong to? Choose from 4 options.
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

      {/* Flag display */}
      <div className="border rounded-2xl p-10 flex flex-col items-center gap-3 bg-white shadow-sm">
        <div className="text-9xl leading-none select-none">{current.char}</div>
        <p className="text-sm text-gray-400 mt-2">Which country is this?</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          let cls =
            'rounded-xl border-2 px-4 py-3 text-sm font-medium transition text-left w-full ';
          if (!gameOver) {
            cls += 'hover:bg-gray-50 border-gray-200 cursor-pointer';
          } else if (choice === current.country) {
            cls += 'border-green-500 bg-green-50 text-green-700';
          } else if (choice === selected) {
            cls += 'border-red-400 bg-red-50 text-red-600';
          } else {
            cls += 'border-gray-100 text-gray-400 bg-gray-50';
          }
          return (
            <button
              key={choice}
              className={cls}
              onClick={() => handleGuess(choice)}
              disabled={gameOver}
            >
              {gameOver && choice === current.country && '✅ '}
              {gameOver &&
                choice === selected &&
                choice !== current.country &&
                '❌ '}
              {choice}
            </button>
          );
        })}
      </div>

      {/* Result + next button */}
      {gameOver && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <p
            className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
          >
            {isCorrect ? '🎉 Correct!' : `The answer was: ${current.country}`}
          </p>
          <button
            onClick={nextRound}
            className="rounded-xl bg-blue-600 text-white px-6 py-2.5 font-medium hover:bg-blue-700 transition text-sm"
          >
            Next Flag →
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
                  <th className="pb-2 pr-4">Flag</th>
                  <th className="pb-2 pr-4">Country</th>
                  <th className="pb-2 pr-4">Your answer</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4 text-2xl">{row.flag}</td>
                    <td className="py-2 pr-4">{row.country}</td>
                    <td
                      className={`py-2 pr-4 ${row.correct ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {row.guessed}
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
        {FLAGS.length} country flags from the Unicode emoji standard.
      </p>
    </div>
  );
}
