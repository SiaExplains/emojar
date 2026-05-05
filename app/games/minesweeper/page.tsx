'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

const CONFIGS: Record<
  Difficulty,
  { cols: number; rows: number; mines: number }
> = {
  easy: { cols: 9, rows: 9, mines: 10 },
  medium: { cols: 16, rows: 16, mines: 40 },
  hard: { cols: 30, rows: 16, mines: 99 },
};

type CellState = 'hidden' | 'revealed' | 'flagged';
type GameState = 'idle' | 'playing' | 'won' | 'lost';

type Cell = {
  mine: boolean;
  adjacent: number;
  state: CellState;
};

const NUM_COLOR = [
  '',
  'text-blue-600',
  'text-green-700',
  'text-red-600',
  'text-blue-900',
  'text-red-800',
  'text-teal-600',
  'text-black',
  'text-gray-600',
];

function makeGrid(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      adjacent: 0,
      state: 'hidden' as CellState,
    })),
  );
}

function placeMines(
  grid: Cell[][],
  cols: number,
  rows: number,
  mineCount: number,
  safeR: number,
  safeC: number,
): Cell[][] {
  const g = grid.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (g[r][c].mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    g[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (g[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc].mine)
            n++;
        }
      }
      g[r][c].adjacent = n;
    }
  }
  return g;
}

function floodReveal(
  grid: Cell[][],
  cols: number,
  rows: number,
  startR: number,
  startC: number,
): Cell[][] {
  const g = grid.map((row) => row.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[startR, startC]];
  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (g[r][c].state !== 'hidden') continue;
    g[r][c].state = 'revealed';
    if (g[r][c].adjacent === 0 && !g[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          queue.push([r + dr, c + dc]);
        }
      }
    }
  }
  return g;
}

export default function Page() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const { cols, rows, mines } = CONFIGS[difficulty];

  const [grid, setGrid] = useState<Cell[][]>(() =>
    makeGrid(CONFIGS.easy.cols, CONFIGS.easy.rows),
  );
  const [gameState, setGameState] = useState<GameState>('idle');
  const [minesLeft, setMinesLeft] = useState(CONFIGS.easy.mines);
  const [time, setTime] = useState(0);
  const gameStateRef = useRef<GameState>('idle');

  useEffect(() => {
    setGrid(makeGrid(cols, rows));
    setGameState('idle');
    gameStateRef.current = 'idle';
    setMinesLeft(mines);
    setTime(0);
  }, [difficulty, cols, rows, mines]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [gameState]);

  const handleReveal = useCallback(
    (r: number, c: number) => {
      const gs = gameStateRef.current;
      if (gs === 'won' || gs === 'lost') return;

      setGrid((prev) => {
        if (prev[r][c].state !== 'hidden') return prev;

        let g = prev;
        if (gs === 'idle') {
          g = placeMines(prev, cols, rows, mines, r, c);
          setGameState('playing');
          gameStateRef.current = 'playing';
        }

        if (g[r][c].mine) {
          const blasted = g.map((row) =>
            row.map((cell) =>
              cell.mine ? { ...cell, state: 'revealed' as CellState } : cell,
            ),
          );
          setGameState('lost');
          gameStateRef.current = 'lost';
          return blasted;
        }

        const revealed = floodReveal(g, cols, rows, r, c);
        const won = revealed.every((row) =>
          row.every((cell) => cell.mine || cell.state === 'revealed'),
        );
        if (won) {
          setGameState('won');
          gameStateRef.current = 'won';
        }
        return revealed;
      });
    },
    [cols, rows, mines],
  );

  const handleFlag = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      const gs = gameStateRef.current;
      if (gs === 'won' || gs === 'lost') return;
      setGrid((prev) => {
        const cell = prev[r][c];
        if (cell.state === 'revealed') return prev;
        const g = prev.map((row) => row.map((cl) => ({ ...cl })));
        if (g[r][c].state === 'hidden') {
          g[r][c].state = 'flagged';
          setMinesLeft((m) => m - 1);
        } else {
          g[r][c].state = 'hidden';
          setMinesLeft((m) => m + 1);
        }
        return g;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setGrid(makeGrid(cols, rows));
    setGameState('idle');
    gameStateRef.current = 'idle';
    setMinesLeft(mines);
    setTime(0);
  }, [cols, rows, mines]);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">💣 Minesweeper</h1>
        <div className="flex items-center gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-lg text-sm capitalize border transition ${
                difficulty === d
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={reset}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm bg-white hover:bg-gray-50"
          >
            🔄 New
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium">
        <span>💣 {minesLeft}</span>
        <span>⏱ {time}s</span>
        {gameState === 'won' && (
          <span className="text-green-600 font-semibold">🎉 You won!</span>
        )}
        {gameState === 'lost' && (
          <span className="text-red-600 font-semibold">💥 Game over!</span>
        )}
      </div>

      <div className="overflow-auto">
        <div
          className="gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 2rem)`,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const revealed = cell.state === 'revealed';
              const flagged = cell.state === 'flagged';
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleReveal(r, c)}
                  onContextMenu={(e) => handleFlag(e, r, c)}
                  className={`w-8 h-8 text-xs font-bold flex items-center justify-center select-none transition ${
                    revealed
                      ? cell.mine
                        ? 'bg-red-100'
                        : 'bg-white'
                      : 'bg-gray-100 hover:bg-gray-50 active:bg-gray-200 cursor-pointer'
                  } ${revealed && cell.adjacent > 0 && !cell.mine ? NUM_COLOR[cell.adjacent] : ''}`}
                >
                  {flagged
                    ? '🚩'
                    : revealed && cell.mine
                      ? '💣'
                      : revealed && cell.adjacent > 0
                        ? cell.adjacent
                        : ''}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Left-click to reveal · Right-click to flag · First click is always safe
      </p>
    </div>
  );
}
