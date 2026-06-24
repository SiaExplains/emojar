'use client';

import { useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category?: string;
  version: string;
};

const EMOJIS: EmojiItem[] = (allEmojis as EmojiItem[]).filter(
  (e) => e.char && e.name && e.version && parseFloat(e.version) > 0,
);

const TOTAL_ROUNDS = 5;
const ITEMS_PER_ROUND = 5;

function pickRound(): EmojiItem[] {
  const shuffled = EMOJIS.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, ITEMS_PER_ROUND);
}

function countCorrectPositions(
  order: EmojiItem[],
  sorted: EmojiItem[],
): number {
  return order.filter((e, i) => e.char === sorted[i].char).length;
}

export default function EmojiTimelinePage() {
  const [round, setRound] = useState(1);
  const [emojis, setEmojis] = useState<EmojiItem[]>(() => pickRound());
  const [order, setOrder] = useState<EmojiItem[]>(() => [...emojis]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [allResults, setAllResults] = useState<
    { correct: number; items: EmojiItem[]; order: EmojiItem[] }[]
  >([]);

  const sorted = emojis
    .slice()
    .sort((a, b) => parseFloat(a.version) - parseFloat(b.version));

  function handleSlotClick(slotIdx: number) {
    if (submitted) return;
    if (selected === null) {
      // Select this slot
      setSelected(slotIdx);
    } else {
      // Swap selected with this slot
      const newOrder = order.slice();
      const tmp = newOrder[selected];
      newOrder[selected] = newOrder[slotIdx];
      newOrder[slotIdx] = tmp;
      setOrder(newOrder);
      setSelected(null);
    }
  }

  function handleSubmit() {
    const correct = countCorrectPositions(order, sorted);
    setRoundScore(correct);
    setTotalScore((prev) => prev + correct);
    setSubmitted(true);
    setAllResults((prev) => [...prev, { correct, items: sorted, order }]);
  }

  function nextRound() {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }
    const newEmojis = pickRound();
    setEmojis(newEmojis);
    setOrder(newEmojis);
    setRound((r) => r + 1);
    setSelected(null);
    setSubmitted(false);
    setRoundScore(0);
  }

  function restartGame() {
    const newEmojis = pickRound();
    setEmojis(newEmojis);
    setOrder(newEmojis);
    setRound(1);
    setSelected(null);
    setSubmitted(false);
    setRoundScore(0);
    setTotalScore(0);
    setGameOver(false);
    setAllResults([]);
  }

  if (gameOver) {
    return (
      <div className="mx-auto max-w-lg p-4 space-y-6">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Games', href: '/games' },
            { label: 'Timeline Challenge' },
          ]}
        />
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold">Timeline Challenge</h1>
          <div className="text-5xl">📅</div>
          <p className="text-xl font-bold">
            Final Score: {totalScore} / {TOTAL_ROUNDS * ITEMS_PER_ROUND}
          </p>
          <p className="text-gray-500">
            {totalScore >= 20
              ? 'Emoji historian! 🏆'
              : totalScore >= 15
                ? 'Great knowledge! ⭐'
                : totalScore >= 10
                  ? 'Good effort! 👍'
                  : 'Keep practicing! 💪'}
          </p>
          <button
            onClick={restartGame}
            className="px-6 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600"
          >
            Play Again
          </button>
        </div>

        {/* Round summaries */}
        <div className="space-y-3">
          {allResults.map((res, ri) => (
            <div key={ri} className="border rounded-xl p-3 space-y-2">
              <p className="text-sm font-medium text-gray-500">
                Round {ri + 1} — {res.correct}/{ITEMS_PER_ROUND} correct
              </p>
              <div className="flex flex-col gap-1">
                {res.items.map((e, i) => (
                  <div key={e.char} className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        res.order[i]?.char === e.char
                          ? 'text-green-600 font-bold'
                          : 'text-red-500'
                      }
                    >
                      {i + 1}.
                    </span>
                    <span className="text-xl">{e.char}</span>
                    <span className="text-gray-400 text-xs">v{e.version}</span>
                    {res.order[i]?.char !== e.char && (
                      <span className="text-red-400 text-xs">
                        (you had: {res.order[i]?.char})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Timeline Challenge' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Timeline Challenge</h1>
        <p className="text-gray-500 text-sm mt-1">
          Arrange emojis from oldest to newest (by Unicode version)
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Round {round} / {TOTAL_ROUNDS}
        </span>
        <span>Total score: {totalScore}</span>
      </div>

      {/* Instructions */}
      {!submitted && (
        <div className="text-xs text-gray-400 text-center bg-purple-50 rounded-xl p-2">
          Click an emoji to select it (highlighted), then click another slot to
          swap
        </div>
      )}

      {/* Sortable slots */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>← Oldest</span>
          <span>Newest →</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {order.map((e, i) => {
            const isSelected = selected === i;
            const correctHere = submitted && sorted[i].char === e.char;
            const wrongHere = submitted && sorted[i].char !== e.char;
            return (
              <button
                key={`slot-${i}`}
                onClick={() => handleSlotClick(i)}
                disabled={submitted}
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 text-3xl transition-all aspect-square ${
                  isSelected
                    ? 'border-purple-500 bg-purple-100 scale-105'
                    : correctHere
                      ? 'border-green-400 bg-green-50'
                      : wrongHere
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                } disabled:cursor-default`}
              >
                {e.char}
                <span className="text-xs text-gray-400 mt-1">#{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {!submitted ? (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600"
          >
            Submit Order
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center p-3 rounded-xl bg-purple-50 border border-purple-200">
            <p className="font-bold text-lg text-purple-800">
              {roundScore} / {ITEMS_PER_ROUND} correct positions
            </p>
          </div>

          {/* Correct order reveal */}
          <div className="border rounded-xl p-3 space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Correct order (oldest → newest):
            </p>
            {sorted.map((e, i) => (
              <div key={e.char} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-4">{i + 1}.</span>
                <span className="text-2xl">{e.char}</span>
                <span className="text-gray-600 flex-1">{e.name}</span>
                <span className="text-purple-500 font-mono text-xs">
                  v{e.version}
                </span>
                {order[i]?.char === e.char ? (
                  <span className="text-green-500 font-bold">✓</span>
                ) : (
                  <span className="text-red-400">✗</span>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={nextRound}
              className="px-6 py-2 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600"
            >
              {round >= TOTAL_ROUNDS ? 'See Results' : 'Next Round'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
