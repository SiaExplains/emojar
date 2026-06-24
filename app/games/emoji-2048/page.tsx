'use client';

import { useCallback, useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

const TILE_EMOJIS: Record<number, string> = {
  2: '🌱',
  4: '🌿',
  8: '🍀',
  16: '🌸',
  32: '🌺',
  64: '🌻',
  128: '🎃',
  256: '🎄',
  512: '🌈',
  1024: '⭐',
  2048: '🏆',
};

const TILE_COLORS: Record<number, string> = {
  2: 'bg-green-100',
  4: 'bg-green-200',
  8: 'bg-emerald-200',
  16: 'bg-pink-200',
  32: 'bg-rose-300',
  64: 'bg-yellow-200',
  128: 'bg-orange-300',
  256: 'bg-green-400',
  512: 'bg-indigo-300',
  1024: 'bg-yellow-400',
  2048: 'bg-amber-500',
};

type Grid = (number | 0)[];

function emptyGrid(): Grid {
  return Array(16).fill(0);
}

function addRandom(grid: Grid): Grid {
  const empty = grid.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
  if (!empty.length) return grid;
  const idx = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.slice() as Grid;
  next[idx] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initGame(): { grid: Grid; score: number } {
  let grid = emptyGrid();
  grid = addRandom(grid);
  grid = addRandom(grid);
  return { grid, score: 0 };
}

function slideRow(row: number[]): { row: number[]; gained: number } {
  const filtered = row.filter((v) => v !== 0);
  let gained = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      gained += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, gained };
}

type Direction = 'left' | 'right' | 'up' | 'down';

function move(
  grid: Grid,
  dir: Direction,
): { grid: Grid; score: number; moved: boolean } {
  let totalGained = 0;
  let moved = false;
  const g = grid.slice() as Grid;

  function getRow(r: number): number[] {
    return [g[r * 4], g[r * 4 + 1], g[r * 4 + 2], g[r * 4 + 3]];
  }
  function setRow(r: number, row: number[]) {
    for (let c = 0; c < 4; c++) {
      if (g[r * 4 + c] !== row[c]) moved = true;
      g[r * 4 + c] = row[c];
    }
  }
  function getCol(c: number): number[] {
    return [g[c], g[4 + c], g[8 + c], g[12 + c]];
  }
  function setCol(c: number, col: number[]) {
    for (let r = 0; r < 4; r++) {
      if (g[r * 4 + c] !== col[r]) moved = true;
      g[r * 4 + c] = col[r];
    }
  }

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) {
      const { row, gained } = slideRow(getRow(r));
      setRow(r, row);
      totalGained += gained;
    }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) {
      const { row, gained } = slideRow(getRow(r).reverse());
      setRow(r, row.reverse());
      totalGained += gained;
    }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      const { row, gained } = slideRow(getCol(c));
      setCol(c, row);
      totalGained += gained;
    }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) {
      const { row, gained } = slideRow(getCol(c).reverse());
      setCol(c, row.reverse());
      totalGained += gained;
    }
  }

  return { grid: g, score: totalGained, moved };
}

function hasMovesLeft(grid: Grid): boolean {
  if (grid.some((v) => v === 0)) return true;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = grid[r * 4 + c];
      if (c < 3 && v === grid[r * 4 + c + 1]) return true;
      if (r < 3 && v === grid[(r + 1) * 4 + c]) return true;
    }
  }
  return false;
}

export default function Emoji2048Page() {
  const [grid, setGrid] = useState<Grid>(() => initGame().grid);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(localStorage.getItem('emoji-2048-best') ?? 0);
  });
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [continueAfterWin, setContinueAfterWin] = useState(false);

  // Touch tracking
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleMove = useCallback(
    (dir: Direction) => {
      if (lost) return;
      if (won && !continueAfterWin) return;

      setGrid((prev) => {
        const { grid: next, score: gained, moved } = move(prev, dir);
        if (!moved) return prev;

        const withNew = addRandom(next);
        setScore((s) => {
          const ns = s + gained;
          setBestScore((b) => {
            const nb = Math.max(b, ns);
            localStorage.setItem('emoji-2048-best', String(nb));
            return nb;
          });
          return ns;
        });

        if (!won && withNew.some((v) => v === 2048)) {
          setWon(true);
        }
        if (!hasMovesLeft(withNew)) {
          setLost(true);
        }
        return withNew;
      });
    },
    [lost, won, continueAfterWin],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleMove]);

  function startNew() {
    const { grid: g } = initGame();
    setGrid(g);
    setScore(0);
    setWon(false);
    setLost(false);
    setContinueAfterWin(false);
  }

  return (
    <div className="mx-auto max-w-sm p-4 space-y-4 select-none">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
          { label: 'Emoji 2048' },
        ]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Emoji 2048</h1>
          <p className="text-xs text-gray-400">Merge emojis to reach 🏆</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-amber-100 rounded-xl px-3 py-2 text-center">
            <div className="text-xs text-amber-700 font-medium">SCORE</div>
            <div className="font-bold text-amber-900">{score}</div>
          </div>
          <div className="bg-amber-200 rounded-xl px-3 py-2 text-center">
            <div className="text-xs text-amber-700 font-medium">BEST</div>
            <div className="font-bold text-amber-900">{bestScore}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={startNew}
          className="text-sm px-4 py-1.5 rounded-lg border hover:bg-gray-50"
        >
          New Game
        </button>
      </div>

      {/* Board */}
      <div
        className="bg-amber-100 rounded-xl p-2 touch-none"
        onTouchStart={(e) => {
          const t = e.touches[0];
          setTouchStart({ x: t.clientX, y: t.clientY });
        }}
        onTouchEnd={(e) => {
          if (!touchStart) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStart.x;
          const dy = t.clientY - touchStart.y;
          setTouchStart(null);
          if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
          if (Math.abs(dx) > Math.abs(dy)) {
            handleMove(dx > 0 ? 'right' : 'left');
          } else {
            handleMove(dy > 0 ? 'down' : 'up');
          }
        }}
      >
        <div className="grid grid-cols-4 gap-2">
          {grid.map((val, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all duration-100 ${
                val === 0 ? 'bg-amber-50' : (TILE_COLORS[val] ?? 'bg-amber-300')
              }`}
            >
              {val !== 0 ? (TILE_EMOJIS[val] ?? '💫') : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <p className="text-xs text-center text-gray-400">
        Arrow keys or swipe to move tiles
      </p>

      {/* Win overlay */}
      {won && !continueAfterWin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-3">
          <div className="text-4xl">🏆</div>
          <p className="font-bold text-lg text-amber-900">You reached 2048!</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setContinueAfterWin(true)}
              className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600"
            >
              Keep Going
            </button>
            <button
              onClick={startNew}
              className="px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50"
            >
              New Game
            </button>
          </div>
        </div>
      )}

      {/* Lose overlay */}
      {lost && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center space-y-3">
          <p className="font-bold text-lg text-red-800">No more moves!</p>
          <p className="text-sm text-red-600">Final score: {score}</p>
          <button
            onClick={startNew}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Tile legend */}
      <div className="rounded-xl border p-3">
        <p className="text-xs font-medium text-gray-500 mb-2">Tile guide</p>
        <div className="grid grid-cols-4 gap-1">
          {Object.entries(TILE_EMOJIS).map(([val, em]) => (
            <div key={val} className="flex items-center gap-1 text-xs">
              <span>{em}</span>
              <span className="text-gray-400">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
