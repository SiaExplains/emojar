'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import allEmojis from '../../../data/emojis.json';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiItem = { char: string; name: string; slug: string };

const EMOJIS: string[] = (allEmojis as EmojiItem[])
  .filter((e) => e.char && e.name)
  .map((e) => e.char)
  .filter((c) => [...c].length === 2 || [...c].length === 1)
  .slice(0, 300);

const TOTAL_HOLES = 9;
const GAME_DURATION = 30;
const VISIBLE_MS = 800;

function randomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

type HoleState = {
  emoji: string;
  visible: boolean;
};

export default function WhackAMolePage() {
  const [holes, setHoles] = useState<HoleState[]>(() =>
    Array(TOTAL_HOLES)
      .fill(null)
      .map(() => ({ emoji: randomEmoji(), visible: false })),
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('whack-a-mole-best') ?? 0);
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const moleTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const timeElapsedRef = useRef(0);

  const clearAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    moleTimersRef.current.forEach((t) => clearTimeout(t));
    moleTimersRef.current.clear();
  }, []);

  const endGame = useCallback(() => {
    clearAll();
    setRunning(false);
    setFinished(true);
    setHoles((prev) => prev.map((h) => ({ ...h, visible: false })));
    setHighScore((prev) => {
      const ns = Math.max(prev, scoreRef.current);
      localStorage.setItem('whack-a-mole-best', String(ns));
      return ns;
    });
  }, [clearAll]);

  const spawnMole = useCallback(() => {
    const idx = Math.floor(Math.random() * TOTAL_HOLES);
    setHoles((prev) => {
      if (prev[idx].visible) return prev;
      const next = prev.slice();
      next[idx] = { emoji: randomEmoji(), visible: true };
      return next;
    });
    const t = setTimeout(() => {
      setHoles((prev) => {
        const next = prev.slice();
        next[idx] = { ...next[idx], visible: false };
        return next;
      });
      moleTimersRef.current.delete(idx);
    }, VISIBLE_MS);
    moleTimersRef.current.set(idx, t);
  }, []);

  function startGame() {
    clearAll();
    scoreRef.current = 0;
    timeElapsedRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setFinished(false);
    setRunning(true);
    setHoles(
      Array(TOTAL_HOLES)
        .fill(null)
        .map(() => ({ emoji: randomEmoji(), visible: false })),
    );
  }

  useEffect(() => {
    if (!running) return;

    // Countdown timer
    timerRef.current = setInterval(() => {
      timeElapsedRef.current += 1;
      setTimeLeft(GAME_DURATION - timeElapsedRef.current);
      if (timeElapsedRef.current >= GAME_DURATION) {
        endGame();
      }
    }, 1000);

    // Spawn moles — speed up over time
    const getInterval = () => Math.max(400, 1000 - timeElapsedRef.current * 20);

    let spawnInterval = getInterval();
    const scheduleSpawn = () => {
      spawnRef.current = setTimeout(() => {
        if (!running) return;
        spawnMole();
        scheduleSpawn();
      }, getInterval()) as unknown as ReturnType<typeof setInterval>;
    };
    scheduleSpawn();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, endGame, spawnMole]);

  function whack(idx: number) {
    if (!running) return;
    setHoles((prev) => {
      if (!prev[idx].visible) return prev;
      const next = prev.slice();
      next[idx] = { ...next[idx], visible: false };
      if (moleTimersRef.current.has(idx)) {
        clearTimeout(moleTimersRef.current.get(idx));
        moleTimersRef.current.delete(idx);
      }
      scoreRef.current += 1;
      setScore(scoreRef.current);
      return next;
    });
  }

  const progressPct = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="mx-auto max-w-md p-4 space-y-5">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Whack-a-Mole' },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Emoji Whack-a-Mole</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tap the emojis before they hide! 30 seconds.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-2 text-center">
          <div className="text-xs text-yellow-600 font-medium">SCORE</div>
          <div className="text-2xl font-bold text-yellow-800">{score}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-2 text-center">
          <div className="text-xs text-orange-600 font-medium">BEST</div>
          <div className="text-2xl font-bold text-orange-800">{highScore}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-2 text-center">
          <div className="text-xs text-red-600 font-medium">TIME</div>
          <div className="text-2xl font-bold text-red-800">{timeLeft}s</div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="bg-orange-400 h-2.5 rounded-full transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {holes.map((hole, idx) => (
          <button
            key={idx}
            onClick={() => whack(idx)}
            className={`aspect-square rounded-2xl border-2 text-4xl flex items-center justify-center transition-all duration-150 select-none ${
              hole.visible
                ? 'bg-yellow-100 border-yellow-400 scale-105 cursor-pointer hover:scale-110 active:scale-95'
                : 'bg-gray-100 border-gray-200 cursor-default'
            }`}
          >
            {hole.visible ? hole.emoji : '🕳️'}
          </button>
        ))}
      </div>

      {/* CTA */}
      {!running && !finished && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 active:scale-95 transition-all"
          >
            Start Game
          </button>
        </div>
      )}

      {finished && (
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center space-y-2">
          <p className="text-2xl">🎉</p>
          <p className="font-bold text-lg">Time&apos;s up!</p>
          <p className="text-gray-600">
            You scored{' '}
            <span className="font-bold text-orange-600">{score}</span> hits
            {score > 0 && score >= highScore && score === highScore
              ? ' — new high score!'
              : ''}
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
