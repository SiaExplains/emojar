'use client';

// Wheel spinner, dice roller and coin flip.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  flipCoin,
  pickIndex,
  rollDice,
  wheelRotation,
  type DiceRoll,
} from '@/lib/online-tools/engines/games';
import {
  addToSession,
  diceRange,
  expectedValue,
  formatStat,
  rollStats,
  type SessionStats,
} from '@/lib/online-tools/engines/dice-stats';
import { shuffle } from '@/lib/online-tools/engines/random';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  Notice,
  NumberField,
  TextField,
  ToolInput,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

const COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#84cc16',
];
const WHEEL_KEY = 'emojar-wheel-entries';
const DEFAULT_ENTRIES = 'Ada\nAlan\nGrace\nLinus\nMargaret\nTim';

/** Skip animations for people who prefer reduced motion. */
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Space bar triggers the main action, unless the user is typing in a field. */
function useSpaceKey(action: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        e.code !== 'Space' ||
        /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName) ||
        t.isContentEditable
      )
        return;
      e.preventDefault();
      action();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [action]);
}

export function WheelSpinnerTool(_: ToolProps) {
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(WHEEL_KEY) ?? DEFAULT_ENTRIES;
    } catch {
      return DEFAULT_ENTRIES;
    }
  });
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<{ name: string; index: number } | null>(
    null,
  );
  const [history, setHistory] = useState<string[]>([]);
  const entries = text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);

  useEffect(() => {
    try {
      localStorage.setItem(WHEEL_KEY, text);
    } catch {
      // Storage unavailable — the list just won't persist.
    }
  }, [text]);

  const spin = useCallback(() => {
    if (spinning || entries.length < 2) return;
    const index = pickIndex(entries.length);
    setWinner(null);
    setSpinning(true);
    const duration = prefersReducedMotion() ? 0 : 4500;
    setRotation((r) =>
      wheelRotation(
        index,
        entries.length,
        r,
        prefersReducedMotion() ? 1 : 6,
        0.2 + Math.random() * 0.6,
      ),
    );
    window.setTimeout(() => {
      setSpinning(false);
      setWinner({ name: entries[index], index });
      setHistory((h) => [entries[index], ...h].slice(0, 10));
    }, duration + 50);
  }, [spinning, entries]);

  useSpaceKey(spin);

  const n = entries.length;
  const seg = 360 / Math.max(n, 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-[420px]">
          <div
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-3xl"
            aria-hidden
          >
            ▼
          </div>
          <svg
            viewBox="-100 -100 200 200"
            className="w-full drop-shadow"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'none',
            }}
            role="img"
            aria-label={`Wheel with ${n} entries`}
          >
            {n < 2 ? (
              <circle r="98" fill="#e5e7eb" />
            ) : (
              entries.map((name, i) => {
                const a0 = ((i * seg - 90) * Math.PI) / 180;
                const a1 = (((i + 1) * seg - 90) * Math.PI) / 180;
                const large = seg > 180 ? 1 : 0;
                const mid = ((i + 0.5) * seg - 90) * (Math.PI / 180);
                const label = name.length > 16 ? `${name.slice(0, 15)}…` : name;
                return (
                  <g key={i}>
                    <path
                      d={`M0 0 L${98 * Math.cos(a0)} ${98 * Math.sin(a0)} A98 98 0 ${large} 1 ${98 * Math.cos(a1)} ${98 * Math.sin(a1)} Z`}
                      fill={COLORS[i % COLORS.length]}
                      stroke="#fff"
                      strokeWidth="0.8"
                    />
                    <text
                      x={60 * Math.cos(mid)}
                      y={60 * Math.sin(mid)}
                      fill="#fff"
                      fontSize={n > 24 ? 5 : n > 12 ? 7 : 9}
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${(i + 0.5) * seg} ${60 * Math.cos(mid)} ${60 * Math.sin(mid)})`}
                    >
                      {label}
                    </text>
                  </g>
                );
              })
            )}
            <circle r="10" fill="#fff" stroke="#e5e7eb" />
          </svg>
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={spin}
          disabled={spinning || n < 2}
        >
          {spinning ? 'Spinning…' : 'Spin (space)'}
        </button>
        <div aria-live="polite" className="min-h-[3rem] text-center">
          {winner && (
            <p className="text-2xl font-bold text-gray-900">🎉 {winner.name}</p>
          )}
        </div>
        {winner && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              const lines = text.split('\n');
              let seen = -1;
              setText(
                lines
                  .filter((l) => (l.trim() ? ++seen !== winner.index : true))
                  .join('\n'),
              );
              setWinner(null);
            }}
          >
            Remove “{winner.name}”
          </button>
        )}
      </div>
      <div className="space-y-3">
        <ToolInput
          label={`Entries (${n})`}
          value={text}
          onChange={setText}
          rows={10}
          mono={false}
          placeholder="One name per line"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setText(shuffle(entries).join('\n'))}
          >
            Shuffle
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() =>
              setText(
                [...entries].sort((a, b) => a.localeCompare(b)).join('\n'),
              )
            }
          >
            Sort
          </button>
        </div>
        {n < 2 && <Notice>Add at least two entries to spin.</Notice>}
        {history.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Previous winners
            </h3>
            <ol className="mt-1 list-decimal pl-5 text-sm text-gray-600">
              {history.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2.5 text-center">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="text-lg font-bold tabular-nums text-gray-900">{value}</dd>
    </div>
  );
}

export function DiceRollerTool(_: ToolProps) {
  const [notation, setNotation] = useState('2d6');
  const [roll, setRoll] = useState<DiceRoll | null>(null);
  const [history, setHistory] = useState<DiceRoll[]>([]);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [session, setSession] = useState<SessionStats>({ rolls: 0, sum: 0 });
  const [customCount, setCustomCount] = useState('1');
  const [customSides, setCustomSides] = useState('7');

  const doRoll = useCallback(
    (n = notation) => {
      try {
        const r = rollDice(n);
        setError('');
        setShaking(!prefersReducedMotion());
        window.setTimeout(() => setShaking(false), 350);
        setRoll(r);
        setHistory((h) => [r, ...h].slice(0, 12));
        setSession((s) => addToSession(s, r));
      } catch (e) {
        setError(friendlyError(e));
      }
    },
    [notation],
  );
  useSpaceKey(useCallback(() => doRoll(), [doRoll]));

  const sides = roll
    ? Number(/d(\d+|%)/i.exec(roll.notation)?.[1].replace('%', '100'))
    : 6;
  const stats = roll ? rollStats(roll) : null;
  const range = roll ? diceRange(roll.notation) : null;
  const expected = roll ? expectedValue(roll.notation) : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[4, 6, 8, 10, 12, 20, 100].map((s) => (
          <button
            key={s}
            type="button"
            className={btnSecondary}
            onClick={() => {
              const n = `1d${s}`;
              setNotation(n);
              doRoll(n);
            }}
          >
            d{s}
          </button>
        ))}
      </div>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          doRoll();
        }}
      >
        <TextField
          label="Dice notation"
          value={notation}
          onChange={setNotation}
          mono
          placeholder="2d6+3, 4d6kh3, d20"
          className="w-56"
        />
        <button type="submit" className={btnPrimary}>
          🎲 Roll
        </button>
      </form>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const n = `${customCount || 1}d${customSides}`;
          setNotation(n);
          doRoll(n);
        }}
      >
        <NumberField
          label="Dice"
          value={customCount}
          onChange={setCustomCount}
          min={1}
          max={100}
          step={1}
          className="w-24"
        />
        <NumberField
          label="Custom sides (2–1000)"
          value={customSides}
          onChange={setCustomSides}
          min={2}
          max={1000}
          step={1}
          className="w-44"
        />
        <button type="submit" className={btnSecondary}>
          Roll {customCount || 1}d{customSides || '?'}
        </button>
      </form>
      <ErrorMessage>{error}</ErrorMessage>
      {roll && (
        <div
          className="space-y-3 rounded-2xl border border-gray-100 p-5 text-center"
          aria-live="polite"
        >
          <div
            className={`flex flex-wrap justify-center gap-2 ${shaking ? 'animate-bounce' : ''}`}
          >
            {roll.rolls.map((v, i) => {
              const kept =
                roll.kept.includes(v) &&
                roll.rolls.slice(0, i).filter((x) => x === v).length <
                  roll.kept.filter((x) => x === v).length;
              return (
                <span
                  key={i}
                  className={`flex h-14 min-w-14 items-center justify-center rounded-xl border px-2 text-2xl font-bold tabular-nums ${kept ? 'border-gray-900 bg-white' : 'border-gray-200 bg-gray-50 text-gray-400 line-through'}`}
                >
                  {sides === 6 ? (
                    <span
                      className="text-4xl leading-none"
                      aria-label={String(v)}
                    >
                      {FACES[v - 1]}
                    </span>
                  ) : (
                    v
                  )}
                </span>
              );
            })}
          </div>
          <p className="text-4xl font-bold tabular-nums text-gray-900">
            {roll.total}
          </p>
          <p className="text-sm text-gray-500">
            {roll.notation}: {roll.kept.join(' + ')}
            {roll.modifier
              ? ` ${roll.modifier > 0 ? '+' : '−'} ${Math.abs(roll.modifier)}`
              : ''}{' '}
            = {roll.total}
          </p>
          {stats && range && expected !== null && (
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <Stat label="Lowest die" value={String(stats.lowest)} />
              <Stat label="Highest die" value={String(stats.highest)} />
              <Stat label="Average die" value={formatStat(stats.average)} />
              <Stat
                label="Possible total"
                value={`${range.min}–${range.max}`}
              />
              <Stat label="Expected total" value={formatStat(expected)} />
            </dl>
          )}
        </div>
      )}
      {session.rolls > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
          <span>
            This session: <strong>{session.rolls}</strong> roll
            {session.rolls === 1 ? '' : 's'}, average total{' '}
            <strong>{formatStat(session.sum / session.rolls)}</strong>
          </span>
          <button
            type="button"
            className="text-xs text-gray-500 underline"
            onClick={() => {
              setSession({ rolls: 0, sum: 0 });
              setHistory([]);
              setRoll(null);
            }}
          >
            Reset session
          </button>
        </div>
      )}
      {history.length > 1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recent rolls</h3>
          <ul className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
            {history.slice(1).map((h, i) => (
              <li key={i} className="rounded-full bg-gray-100 px-2.5 py-1">
                {h.notation} → <strong>{h.total}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function CoinFlipTool(_: ToolProps) {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [counts, setCounts] = useState({ heads: 0, tails: 0 });
  const [streak, setStreak] = useState({ side: '', n: 0, best: 0 });
  const [batch, setBatch] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const record = (side: 'heads' | 'tails') => {
    setCounts((c) => ({ ...c, [side]: c[side] + 1 }));
    setStreak((s) => {
      const n = s.side === side ? s.n + 1 : 1;
      return { side, n, best: Math.max(s.best, n) };
    });
  };

  const flip = useCallback(() => {
    if (flipping) return;
    const side = flipCoin();
    setBatch(null);
    if (prefersReducedMotion()) {
      setResult(side);
      record(side);
      return;
    }
    setFlipping(true);
    timer.current = window.setTimeout(() => {
      setResult(side);
      setFlipping(false);
      record(side);
    }, 700);
  }, [flipping]);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  useSpaceKey(flip);

  const flipMany = (n: number) => {
    let h = 0;
    for (let i = 0; i < n; i++) {
      const s = flipCoin();
      if (s === 'heads') h++;
      record(s);
    }
    setBatch(
      `${n} flips: ${h} heads (${Math.round((h / n) * 100)}%) · ${n - h} tails`,
    );
  };

  const total = counts.heads + counts.tails;

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className={`flex h-40 w-40 items-center justify-center rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-200 to-amber-400 text-3xl font-bold text-amber-900 shadow-lg ${flipping ? 'animate-spin' : ''}`}
        aria-hidden
      >
        {flipping
          ? ''
          : result === 'tails'
            ? 'TAILS'
            : result === 'heads'
              ? 'HEADS'
              : '?'}
      </div>
      <p className="h-8 text-2xl font-bold text-gray-900" aria-live="polite">
        {!flipping && result ? (result === 'heads' ? 'Heads!' : 'Tails!') : ''}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={flip}
          disabled={flipping}
        >
          🪙 Flip (space)
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => flipMany(10)}
        >
          Flip 10
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => flipMany(100)}
        >
          Flip 100
        </button>
      </div>
      {batch && <Notice>{batch}</Notice>}
      {total > 0 && (
        <dl className="grid w-full max-w-md grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-gray-50 p-3">
            <dt className="text-xs text-gray-500">Heads</dt>
            <dd className="text-xl font-bold tabular-nums">
              {counts.heads}{' '}
              <span className="text-xs font-normal text-gray-500">
                ({Math.round((counts.heads / total) * 100)}%)
              </span>
            </dd>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <dt className="text-xs text-gray-500">Tails</dt>
            <dd className="text-xl font-bold tabular-nums">
              {counts.tails}{' '}
              <span className="text-xs font-normal text-gray-500">
                ({Math.round((counts.tails / total) * 100)}%)
              </span>
            </dd>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <dt className="text-xs text-gray-500">Longest streak</dt>
            <dd className="text-xl font-bold tabular-nums">{streak.best}</dd>
          </div>
        </dl>
      )}
      {total > 0 && (
        <button
          type="button"
          className="text-xs text-gray-500 underline"
          onClick={() => {
            setCounts({ heads: 0, tails: 0 });
            setStreak({ side: '', n: 0, best: 0 });
            setResult(null);
            setBatch(null);
          }}
        >
          Reset tally
        </button>
      )}
    </div>
  );
}

export default WheelSpinnerTool;
