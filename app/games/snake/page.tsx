'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const COLS = 20;
const ROWS = 20;
const BASE_SPEED = 150; // ms per tick

const FOOD_EMOJIS = [
  '🍎',
  '🍊',
  '🍋',
  '🍇',
  '🍓',
  '🍒',
  '🍑',
  '🥝',
  '🍌',
  '🍉',
];

type Point = { x: number; y: number };
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'running' | 'paused' | 'over';

type ScoreRow = {
  score: number;
  length: number;
  when: string;
};

function randomFood(snake: Point[]): Point {
  const taken = new Set(snake.map((s) => `${s.x},${s.y}`));
  const free: Point[] = [];
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)];
}

function randomFoodEmoji() {
  return FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
}

const OPPOSITE: Record<Dir, Dir> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const INIT_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export default function Page() {
  const [snake, setSnake] = useState<Point[]>(INIT_SNAKE);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [foodEmoji, setFoodEmoji] = useState<string>('🍎');
  const [dir, setDir] = useState<Dir>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<ScoreRow[]>([]);

  const dirRef = useRef<Dir>('RIGHT');
  const snakeRef = useRef<Point[]>(INIT_SNAKE);
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const foodEmojiRef = useRef<string>('🍎');
  const scoreRef = useRef(0);
  const gameStateRef = useRef<GameState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync refs with state
  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    foodEmojiRef.current = foodEmoji;
  }, [foodEmoji]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const tick = useCallback(() => {
    const s = snakeRef.current;
    const d = dirRef.current;
    const f = foodRef.current;

    const head = s[0];
    const next: Point = {
      x: (head.x + (d === 'RIGHT' ? 1 : d === 'LEFT' ? -1 : 0) + COLS) % COLS,
      y: (head.y + (d === 'DOWN' ? 1 : d === 'UP' ? -1 : 0) + ROWS) % ROWS,
    };

    // Self-collision
    if (s.some((p) => p.x === next.x && p.y === next.y)) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGameState('over');
      gameStateRef.current = 'over';
      setHighScores((prev) => {
        const row: ScoreRow = {
          score: scoreRef.current,
          length: snakeRef.current.length,
          when: new Date().toISOString(),
        };
        return [row, ...prev].sort((a, b) => b.score - a.score).slice(0, 10);
      });
      return;
    }

    const ate = next.x === f.x && next.y === f.y;
    const newSnake = ate ? [next, ...s] : [next, ...s.slice(0, -1)];

    snakeRef.current = newSnake;
    setSnake(newSnake);

    if (ate) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      const newFood = randomFood(newSnake);
      const newEmoji = randomFoodEmoji();
      foodRef.current = newFood;
      foodEmojiRef.current = newEmoji;
      setFood(newFood);
      setFoodEmoji(newEmoji);
    }
  }, []);

  const startGame = useCallback(() => {
    const initSnake = INIT_SNAKE;
    const initFood = randomFood(initSnake);
    const initEmoji = randomFoodEmoji();

    snakeRef.current = initSnake;
    dirRef.current = 'RIGHT';
    foodRef.current = initFood;
    foodEmojiRef.current = initEmoji;
    scoreRef.current = 0;

    setSnake(initSnake);
    setDir('RIGHT');
    setFood(initFood);
    setFoodEmoji(initEmoji);
    setScore(0);
    setGameState('running');
    gameStateRef.current = 'running';

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, BASE_SPEED);
  }, [tick]);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGameState('paused');
      gameStateRef.current = 'paused';
    } else if (gameStateRef.current === 'paused') {
      intervalRef.current = setInterval(tick, BASE_SPEED);
      setGameState('running');
      gameStateRef.current = 'running';
    }
  }, [tick]);

  const changeDir = useCallback((d: Dir) => {
    if (d !== OPPOSITE[dirRef.current]) {
      dirRef.current = d;
      setDir(d);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP',
        w: 'UP',
        W: 'UP',
        ArrowDown: 'DOWN',
        s: 'DOWN',
        S: 'DOWN',
        ArrowLeft: 'LEFT',
        a: 'LEFT',
        A: 'LEFT',
        ArrowRight: 'RIGHT',
        d: 'RIGHT',
        D: 'RIGHT',
      };
      const newDir = map[e.key];
      if (newDir) {
        e.preventDefault();
        if (gameStateRef.current === 'idle' || gameStateRef.current === 'over')
          return;
        changeDir(newDir);
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (
          gameStateRef.current === 'running' ||
          gameStateRef.current === 'paused'
        ) {
          togglePause();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDir, togglePause]);

  // Touch / swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDir(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      changeDir(dy > 0 ? 'DOWN' : 'UP');
    }
  }

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`));
  const headKey = `${snake[0].x},${snake[0].y}`;

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🐍 Emoji Snake</h1>
        <div className="flex items-center gap-4 text-sm">
          <span>
            Score: <strong>{score}</strong>
          </span>
          <span>
            Length: <strong>{snake.length}</strong>
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Use arrow keys / WASD to move · Space to pause · Swipe on mobile
      </p>

      {/* Game board */}
      <div
        className="relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        <div
          className="w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const x = i % COLS;
            const y = Math.floor(i / COLS);
            const key = `${x},${y}`;
            const isHead = key === headKey;
            const isBody = !isHead && snakeSet.has(key);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={key}
                className="flex items-center justify-center leading-none"
                style={{ fontSize: 'min(2.2vw, 1.4vh, 18px)' }}
              >
                {isHead ? '🐍' : isBody ? '🟩' : isFood ? foodEmoji : null}
              </div>
            );
          })}
        </div>

        {/* Overlay for idle / paused / game over */}
        {(gameState === 'idle' ||
          gameState === 'paused' ||
          gameState === 'over') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl gap-3">
            {gameState === 'over' && (
              <div className="text-white text-3xl font-bold">Game Over</div>
            )}
            {gameState === 'over' && (
              <div className="text-white text-lg">Score: {score}</div>
            )}
            {gameState === 'paused' && (
              <div className="text-white text-2xl font-bold">Paused</div>
            )}
            <button
              onClick={gameState === 'paused' ? togglePause : startGame}
              className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 text-lg transition"
            >
              {gameState === 'idle'
                ? 'Start Game'
                : gameState === 'over'
                  ? 'Play Again'
                  : 'Resume'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="flex flex-col items-center gap-1 md:hidden">
        <button
          onClick={() => changeDir('UP')}
          className="w-14 h-14 rounded-xl border text-2xl bg-white hover:bg-gray-50 active:bg-gray-100"
        >
          ⬆️
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => changeDir('LEFT')}
            className="w-14 h-14 rounded-xl border text-2xl bg-white hover:bg-gray-50 active:bg-gray-100"
          >
            ⬅️
          </button>
          <button
            onClick={togglePause}
            disabled={gameState === 'idle' || gameState === 'over'}
            className="w-14 h-14 rounded-xl border text-xl bg-white hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30"
          >
            {gameState === 'running' ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={() => changeDir('RIGHT')}
            className="w-14 h-14 rounded-xl border text-2xl bg-white hover:bg-gray-50 active:bg-gray-100"
          >
            ➡️
          </button>
        </div>
        <button
          onClick={() => changeDir('DOWN')}
          className="w-14 h-14 rounded-xl border text-2xl bg-white hover:bg-gray-50 active:bg-gray-100"
        >
          ⬇️
        </button>
      </div>

      {/* High scores */}
      {highScores.length > 0 && (
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">High Scores</h2>
            <button
              onClick={() => setHighScores([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-1 pr-4">#</th>
                <th className="py-1 pr-4">Score</th>
                <th className="py-1 pr-4">Length</th>
                <th className="py-1 pr-4">When</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4 font-semibold">{s.score}</td>
                  <td className="py-2 pr-4">{s.length}</td>
                  <td className="py-2 pr-4 text-gray-500">
                    {new Date(s.when).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Tip: the snake wraps around the edges. Avoid running into yourself!
      </p>
    </div>
  );
}
