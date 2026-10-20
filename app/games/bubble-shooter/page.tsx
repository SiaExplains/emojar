'use client';

import { useCallback, useMemo, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { useRandomState } from '@/lib/games/use-random-state';

const COLS = 10;
const ROWS = 12;
const INITIAL_ROWS = 4;
const SHOTS_PER_NEW_ROW = 5;

const BUBBLE_EMOJIS = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'];

type Grid = (string | null)[][];
type GameState = 'idle' | 'playing' | 'won' | 'lost';

function randomEmoji(): string {
  return BUBBLE_EMOJIS[Math.floor(Math.random() * BUBBLE_EMOJIS.length)];
}

function makeInitialGrid(): Grid {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, () =>
      r < INITIAL_ROWS ? randomEmoji() : null,
    ),
  );
}

function makeNewRow(): (string | null)[] {
  return Array.from({ length: COLS }, () => randomEmoji());
}

function findGroup(
  grid: Grid,
  startR: number,
  startC: number,
  emoji: string,
): [number, number][] {
  const visited = new Set<string>();
  const group: [number, number][] = [];
  const queue: [number, number][] = [[startR, startC]];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    if (grid[r][c] !== emoji) continue;
    visited.add(key);
    group.push([r, c]);
    queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }
  return group;
}

function findFloating(grid: Grid): [number, number][] {
  const anchored = new Set<string>();
  const queue: [number, number][] = [];
  for (let c = 0; c < COLS; c++) {
    if (grid[0][c] !== null) {
      queue.push([0, c]);
      anchored.add(`0,${c}`);
    }
  }
  while (queue.length) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ] as [number, number][]) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nr < ROWS &&
        nc >= 0 &&
        nc < COLS &&
        !anchored.has(key) &&
        grid[nr][nc] !== null
      ) {
        anchored.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  const floating: [number, number][] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== null && !anchored.has(`${r},${c}`)) {
        floating.push([r, c]);
      }
    }
  }
  return floating;
}

export default function Page() {
  const [grid, setGrid] = useRandomState<Grid>(makeInitialGrid);
  const [current, setCurrent] = useRandomState(randomEmoji);
  const [next, setNext] = useRandomState(randomEmoji);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const landingRow = useMemo(() => {
    if (hoverCol === null) return null;
    for (let r = 0; r < ROWS; r++) {
      if (grid[r][hoverCol] === null) return r;
    }
    return null;
  }, [hoverCol, grid]);

  const shoot = useCallback(
    (col: number) => {
      if (gameState === 'lost' || gameState === 'won') return;

      let landRow = -1;
      for (let r = 0; r < ROWS; r++) {
        if (grid[r][col] === null) {
          landRow = r;
          break;
        }
      }

      let g = grid.map((row) => [...row]);
      let scoreGain = 0;

      if (landRow !== -1) {
        g[landRow][col] = current;

        const group = findGroup(g, landRow, col, current);
        if (group.length >= 3) {
          for (const [r, c] of group) g[r][c] = null;
          scoreGain += group.length * 10;
        }

        const floating = findFloating(g);
        for (const [r, c] of floating) {
          g[r][c] = null;
          scoreGain += 5;
        }
      }

      const newShots = shots + 1;
      if (newShots % SHOTS_PER_NEW_ROW === 0) {
        g = [makeNewRow(), ...g.slice(0, ROWS - 1)];
      }

      const anyLeft = g.some((row) => row.some((cell) => cell !== null));
      let newGameState: GameState = 'playing';
      if (!anyLeft) {
        newGameState = 'won';
      } else if (g[ROWS - 1].some((cell) => cell !== null)) {
        newGameState = 'lost';
      }

      setGrid(g);
      setScore((s) => s + scoreGain);
      setShots(newShots);
      setCurrent(next);
      setNext(randomEmoji());
      setGameState(newGameState);
    },
    [gameState, current, next, shots, grid],
  );

  const reset = useCallback(() => {
    setGrid(makeInitialGrid());
    setCurrent(randomEmoji());
    setNext(randomEmoji());
    setScore(0);
    setShots(0);
    setGameState('idle');
    setHoverCol(null);
  }, []);

  return (
    <div className="mx-auto max-w-xl p-4 space-y-4">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Bubble Shooter' },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🫧 Bubble Shooter</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span>
            Score: <strong>{score}</strong>
          </span>
          <span className="text-gray-400">Shots: {shots}</span>
          <button
            onClick={reset}
            className="px-3 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            🔄 New
          </button>
        </div>
      </div>

      {gameState === 'won' && (
        <div className="text-center text-green-600 font-semibold text-lg py-1">
          🎉 Board cleared! Amazing!
        </div>
      )}
      {gameState === 'lost' && (
        <div className="text-center text-red-600 font-semibold text-lg py-1">
          💥 Bubbles reached the bottom!
        </div>
      )}

      {/* Grid */}
      <div
        className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 select-none"
        onMouseLeave={() => setHoverCol(null)}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => {
              const isLanding =
                hoverCol === c &&
                landingRow === r &&
                gameState !== 'lost' &&
                gameState !== 'won';
              const isHoverCol =
                hoverCol === c && gameState !== 'lost' && gameState !== 'won';
              return (
                <button
                  key={c}
                  onClick={() => shoot(c)}
                  onMouseEnter={() => setHoverCol(c)}
                  className={`flex-1 h-9 flex items-center justify-center text-xl transition-colors ${
                    isLanding
                      ? 'bg-yellow-100 ring-2 ring-inset ring-yellow-300'
                      : isHoverCol
                        ? 'bg-blue-50'
                        : r % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50'
                  }`}
                >
                  {isLanding && !cell ? (
                    <span className="opacity-40">{current}</span>
                  ) : (
                    (cell ?? '')
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Shooter tray */}
      <div className="flex items-center justify-center gap-8 py-2 border border-gray-200 rounded-xl bg-white">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Next</div>
          <div className="text-3xl">{next}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Shoot</div>
          <div className="text-4xl">{current}</div>
        </div>
        <div className="text-xs text-gray-400 max-w-28 text-center leading-tight">
          Hover a column, click to shoot
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Match 3+ of the same emoji to pop them · New row every{' '}
        {SHOTS_PER_NEW_ROW} shots · Floating bubbles drop for bonus points
      </p>
    </div>
  );
}
