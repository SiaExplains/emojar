'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import allEmojis from '../../../data/emojis.json';

type EmojiItem = {
  char: string;
  name: string;
  slug: string;
  category?: string;
  keywords?: string[];
};

type Mode = 'vs-computer' | 'vs-human';

type ScoreRow = {
  when: string;              // ISO date
  size: number;              // 3 | 4 | 5
  mode: Mode;
  winner: string;            // player name
  winnerEmoji: string;       // char
  loser: string;             // player name
  timeMs: number;
  moves: number;
};

const ROBOT = '🤖';

function msToClock(ms: number) {
  if (ms <= 0) return '00:00.0';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const remS = s % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, '0')}:${String(remS).padStart(2, '0')}.${tenths}`;
}

function dedupeByChar(emojis: EmojiItem[]) {
  const map = new Map<string, EmojiItem>();
  for (const e of emojis) {
    if (!e?.char) continue;
    if (!map.has(e.char)) map.set(e.char, e);
  }
  return Array.from(map.values());
}

const EMOJIS: EmojiItem[] = dedupeByChar(
  (allEmojis as any[]).map((e: any) => ({
    char: e.char, name: e.name, slug: e.slug, category: e.category, keywords: e.keywords ?? [],
  }))
).filter(e => e.char && e.name);

function useLines(size: number) {
  return useMemo(() => {
    const lines: number[][] = [];
    // rows
    for (let r = 0; r < size; r++) {
      lines.push(Array.from({ length: size }, (_, c) => r * size + c));
    }
    // cols
    for (let c = 0; c < size; c++) {
      lines.push(Array.from({ length: size }, (_, r) => r * size + c));
    }
    // main diag
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    // anti diag
    lines.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));
    return lines;
  }, [size]);
}

function checkWin(board: string[], size: number, who: string, lines: number[][]) {
  return lines.some(line => line.every(idx => board[idx] === who));
}

function emptyIndices(board: string[]) {
  const out: number[] = [];
  for (let i = 0; i < board.length; i++) if (!board[i]) out.push(i);
  return out;
}

function pickCenter(size: number, board: string[]) {
  if (size % 2 === 1) {
    const mid = Math.floor(size / 2);
    const idx = mid * size + mid;
    if (!board[idx]) return idx;
  } else {
    // pick one of the 4 near-centers for even boards
    const mids = [size / 2 - 1, size / 2];
    for (const r of mids) for (const c of mids) {
      const idx = r * size + c;
      if (!board[idx]) return idx;
    }
  }
  return -1;
}

function pickCorner(size: number, board: string[]) {
  const corners = [0, size - 1, size * (size - 1), size * size - 1];
  const empties = corners.filter(i => !board[i]);
  if (empties.length) return empties[Math.floor(Math.random() * empties.length)];
  return -1;
}

// Simple but effective AI: win → block → center → corner → random
function computerMove(board: string[], size: number, me: string, opp: string, lines: number[][]) {
  const empties = emptyIndices(board);
  if (!empties.length) return -1;

  // try to win
  for (const idx of empties) {
    const b = board.slice();
    b[idx] = me;
    if (checkWin(b, size, me, lines)) return idx;
  }
  // try to block
  for (const idx of empties) {
    const b = board.slice();
    b[idx] = opp;
    if (checkWin(b, size, opp, lines)) return idx;
  }
  // center
  const center = pickCenter(size, board);
  if (center !== -1) return center;
  // corner
  const corner = pickCorner(size, board);
  if (corner !== -1) return corner;
  // random
  return empties[Math.floor(Math.random() * empties.length)];
}

function EmojiSelect({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const list = useMemo(() => {
    if (!query.trim()) return EMOJIS.slice(0, 10);
    const q = query.toLowerCase();
    const filtered = EMOJIS.filter(e =>
      e.char.includes(q) ||
      e.name.toLowerCase().includes(q) ||
      (e.keywords?.some(k => String(k).toLowerCase().includes(q)))
    );
    return filtered.slice(0, 40);
  }, [query]);

  return (
    <div className="w-full" ref={wrapRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between rounded-lg border px-3 py-2 bg-white disabled:opacity-50"
        >
          <span className="text-2xl leading-none">{value || '⬇️'}</span>
          <span className="text-gray-500 text-sm">{value ? 'Change' : 'Choose'}</span>
        </button>

        {open && !disabled && (
          <div className="absolute z-20 mt-2 w-full rounded-lg border bg-white shadow-lg">
            <div className="p-2 border-b">
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search emojis…"
                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring"
              />
              <div className="text-xs text-gray-500 mt-1">
                Showing {list.length} {query ? 'results' : 'popular'} (choose one)
              </div>
            </div>
            <ul className="max-h-64 overflow-auto p-2 grid grid-cols-5 gap-2">
              {list.map(e => (
                <li key={e.char}>
                  <button
                    type="button"
                    onClick={() => { onChange(e.char); setOpen(false); }}
                    className="w-full aspect-square flex items-center justify-center rounded-md border hover:bg-gray-50 text-2xl"
                    title={e.name}
                  >
                    {e.char}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>('vs-computer');
  const [size, setSize] = useState<number>(3);

  const [p1Name, setP1Name] = useState<string>('Player 1');
  const [p2Name, setP2Name] = useState<string>('Computer');

  const [p1Emoji, setP1Emoji] = useState<string>('🙂');
  const [p2Emoji, setP2Emoji] = useState<string>(ROBOT);

  const [board, setBoard] = useState<string[]>(() => Array(3 * 3).fill(''));
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<null | 1 | 2>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);

  // Timer
  const [startAt, setStartAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const tickRef = useRef<number | null>(null);

  // Scoreboard (in-memory)
  const [scores, setScores] = useState<ScoreRow[]>([]);

  const lines = useLines(size);

  // When size changes → reset board
  useEffect(() => {
    setBoard(Array(size * size).fill(''));
    setTurn(1);
    setWinner(null);
    setDraw(false);
    setMoves(0);
    setStartAt(null);
    setElapsed(0);
  }, [size]);

  // When mode changes → set computer defaults
  useEffect(() => {
    if (mode === 'vs-computer') {
      setP2Name('Computer');
      setP2Emoji(ROBOT);
    } else {
      setP2Name('Player 2');
      if (p2Emoji === ROBOT) setP2Emoji('😎');
    }
    // reset game
    setBoard(Array(size * size).fill(''));
    setTurn(1);
    setWinner(null);
    setDraw(false);
    setMoves(0);
    setStartAt(null);
    setElapsed(0);
  }, [mode]);

  // Timer tick
  useEffect(() => {
    if (startAt && winner === null && !draw) {
      tickRef.current = window.setInterval(() => {
        setElapsed(Date.now() - startAt);
      }, 100);
      return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }
    if (!startAt || winner !== null || draw) {
      if (tickRef.current) clearInterval(tickRef.current);
    }
  }, [startAt, winner, draw]);

  // Computer auto move
  useEffect(() => {
    if (mode !== 'vs-computer') return;
    if (winner !== null || draw) return;
    if (turn !== 2) return;

    const me = p2Emoji;
    const opp = p1Emoji;

    const idx = computerMove(board, size, me, opp, lines);
    if (idx === -1) return;

    // small delay for UX
    const t = setTimeout(() => handleMove(idx), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, board, winner, draw, mode, p1Emoji, p2Emoji, size]);

  function handleMove(i: number) {
    if (winner !== null || draw) return;
    if (board[i]) return;

    const me = turn === 1 ? p1Emoji : p2Emoji;
    const nextBoard = board.slice();
    nextBoard[i] = me;
    if (!startAt) setStartAt(Date.now());
    const nextMoves = moves + 1;

    // Check outcome
    let nextWinner: null | 1 | 2 = null;
    if (checkWin(nextBoard, size, me, lines)) {
      nextWinner = turn;
    } else if (nextMoves === size * size) {
      setBoard(nextBoard);
      setMoves(nextMoves);
      setDraw(true);
      return;
    }

    setBoard(nextBoard);
    setMoves(nextMoves);

    if (nextWinner !== null) {
      setWinner(nextWinner);
      if (startAt) {
        const finalMs = Date.now() - startAt;
        setElapsed(finalMs);
        // record score
        const row: ScoreRow = {
          when: new Date().toISOString(),
          size,
          mode,
          winner: nextWinner === 1 ? p1Name : p2Name,
          winnerEmoji: nextWinner === 1 ? p1Emoji : p2Emoji,
          loser: nextWinner === 1 ? p2Name : p1Name,
          timeMs: finalMs,
          moves: nextMoves,
        };
        setScores(prev => {
          const next = [...prev, row].sort((a, b) => a.timeMs - b.timeMs);
          return next.slice(0, 50); // keep top 50 overall
        });
      }
      return;
    }

    setTurn(turn === 1 ? 2 : 1);
  }

  function newGame() {
    setBoard(Array(size * size).fill(''));
    setTurn(1);
    setWinner(null);
    setDraw(false);
    setMoves(0);
    setStartAt(null);
    setElapsed(0);
  }

  const boardCols = `grid grid-cols-${size} gap-2`;
  const sizeClass =
    size === 3 ? 'text-5xl' :
    size === 4 ? 'text-4xl' :
                 'text-3xl';

  const invalidSameEmoji = p1Emoji === p2Emoji;

  const filteredScores = useMemo(() => {
    // fastest wins for current size & mode
    return scores
      .filter(s => s.size === size && s.mode === mode)
      .sort((a, b) => a.timeMs - b.timeMs)
      .slice(0, 10);
  }, [scores, size, mode]);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Emoji XO (Tic-Tac-Toe)</h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Mode</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'vs-computer'}
                  onChange={() => setMode('vs-computer')}
                />
                <span>Play vs Computer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'vs-human'}
                  onChange={() => setMode('vs-human')}
                />
                <span>2 Players (local)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Board size</label>
            <select
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="rounded-lg border px-3 py-2 bg-white"
            >
              <option value={3}>3 × 3</option>
              <option value={4}>4 × 4</option>
              <option value={5}>5 × 5</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Player 1 name</label>
              <input
                value={p1Name}
                onChange={e => setP1Name(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Player 2 name</label>
              <input
                value={p2Name}
                onChange={e => setP2Name(e.target.value)}
                disabled={mode === 'vs-computer'}
                className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <EmojiSelect
              label="Player 1 emoji"
              value={p1Emoji}
              onChange={(v) => {
                setP1Emoji(v);
                if (mode === 'vs-human' && v === p2Emoji) setP2Emoji('😎');
              }}
            />
            <EmojiSelect
              label={mode === 'vs-computer' ? 'Computer emoji' : 'Player 2 emoji'}
              value={p2Emoji}
              onChange={setP2Emoji}
              disabled={mode === 'vs-computer'}
            />
          </div>

          {invalidSameEmoji && (
            <div className="text-sm text-red-600">Players must use different emojis.</div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={newGame}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              New game
            </button>
            <button
              onClick={() => {
                setScores([]);
              }}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Clear scoreboard
            </button>
          </div>
        </div>

        {/* Game board */}
        <div className="md:col-span-2 p-4 border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="font-medium">Turn:</span>{' '}
              {turn === 1 ? `${p1Name} ${p1Emoji}` : `${p2Name} ${p2Emoji}`}
            </div>
            <div className="text-sm">
              <span className="font-medium">Timer:</span>{' '}
              {msToClock(winner === null && !draw ? elapsed : elapsed)}
            </div>
            <div className="text-sm">
              <span className="font-medium">Moves:</span> {moves}
            </div>
          </div>

          <div className={`${boardCols} select-none`}>
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleMove(idx)}
                disabled={!!cell || invalidSameEmoji || winner !== null || draw}
                className={`aspect-square rounded-xl border flex items-center justify-center bg-white hover:bg-gray-50 disabled:opacity-50 ${sizeClass}`}
              >
                {cell || ''}
              </button>
            ))}
          </div>

          <div className="mt-4 min-h-[2rem]">
            {winner !== null && (
              <div className="text-green-700 font-medium">
                {winner === 1 ? p1Name : p2Name} wins in {msToClock(elapsed)}! 🎉
              </div>
            )}
            {draw && (
              <div className="text-gray-700 font-medium">It’s a draw. 😐</div>
            )}
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="p-4 border rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fastest wins</h2>
          <div className="text-sm text-gray-600">
            Showing top {filteredScores.length} — Mode: <span className="font-medium">{mode === 'vs-computer' ? 'vs Computer' : '2 Players'}</span>, Size: <span className="font-medium">{size}×{size}</span>
          </div>
        </div>

        {filteredScores.length === 0 ? (
          <div className="text-sm text-gray-500 mt-2">No wins recorded yet. Play a game!</div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Winner</th>
                  <th className="py-2 pr-4">Emoji</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Moves</th>
                  <th className="py-2 pr-4">When</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((s, i) => (
                  <tr key={s.when + i} className="border-t">
                    <td className="py-2 pr-4">{i + 1}</td>
                    <td className="py-2 pr-4">{s.winner}</td>
                    <td className="py-2 pr-4 text-xl">{s.winnerEmoji}</td>
                    <td className="py-2 pr-4 font-mono">{msToClock(s.timeMs)}</td>
                    <td className="py-2 pr-4">{s.moves}</td>
                    <td className="py-2 pr-4">{new Date(s.when).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Tip: for larger boards (4×4/5×5), the win condition is a full row, column, or diagonal of your emoji.
      </p>
    </div>
  );
}
