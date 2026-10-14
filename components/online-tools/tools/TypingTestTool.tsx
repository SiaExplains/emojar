'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import type { ToolProps } from '../ToolRenderer';
import { btnPrimary, btnSecondary } from '../ui';
import { useStoredState } from './playground-shared';
import {
  addToHistory,
  generateText,
  isHistory,
  liveWpm,
  personalBest,
  scoreTest,
  speedLabel,
  type HistoryEntry,
  type TextMode,
  type TypingResult,
} from '@/lib/online-tools/engines/typing';

const DURATIONS = [15, 30, 60, 120, 180, 300];
const KEY = 'emojar:typing-speed-test:v1';

type Run = {
  text: string;
  typed: string;
  /** performance.now() of the first keystroke, or 0 before it. */
  start: number;
  keystrokes: number;
  wrong: number;
  /** Net WPM at each whole second. */
  samples: number[];
};

const durationLabel = (s: number) => (s < 60 ? `${s} s` : `${s / 60} min`);

function newRun(
  mode: TextMode,
  seconds: number,
  punctuation: boolean,
  numbers: boolean,
): Run {
  return {
    // Enough words for ~200 WPM, so fast typists never run out.
    text: generateText({
      mode,
      seed: Math.floor(Math.random() * 2 ** 31),
      words: Math.max(60, Math.ceil((seconds / 60) * 200)),
      punctuation,
      numbers,
    }),
    typed: '',
    start: 0,
    keystrokes: 0,
    wrong: 0,
    samples: [],
  };
}

export default function TypingTestTool({ config }: ToolProps) {
  const initial = Number(config.duration) || 60;
  const [seconds, setSeconds] = useState(
    DURATIONS.includes(initial) ? initial : 60,
  );
  const [mode, setMode] = useState<TextMode>('words');
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);
  const [run, setRun] = useState<Run>(() =>
    newRun('words', initial, false, false),
  );
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [history, setHistory] = useStoredState<HistoryEntry[]>(
    KEY,
    [],
    isHistory,
  );
  const [focused, setFocused] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const runRef = useRef(run);
  runRef.current = run;

  const restart = useCallback(
    (next?: {
      seconds?: number;
      mode?: TextMode;
      punctuation?: boolean;
      numbers?: boolean;
    }) => {
      const s = next?.seconds ?? seconds;
      const m = next?.mode ?? mode;
      const p = next?.punctuation ?? punctuation;
      const n = next?.numbers ?? numbers;
      setRun(newRun(m, s, p, n));
      setElapsed(0);
      setResult(null);
      window.setTimeout(() => input.current?.focus(), 0);
    },
    [seconds, mode, punctuation, numbers],
  );

  const finish = useCallback(() => {
    const r = runRef.current;
    const res = scoreTest({
      target: r.text,
      typed: r.typed,
      seconds,
      keystrokes: r.keystrokes,
      wrongKeystrokes: r.wrong,
    });
    setResult(res);
    setHistory((h) =>
      addToHistory(h, {
        wpm: res.wpm,
        accuracy: res.accuracy,
        seconds,
        mode,
        at: Date.now(),
      }),
    );
  }, [seconds, mode, setHistory]);

  // Clock: ticks while a test is running, samples WPM every second.
  const running = run.start > 0 && !result;
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const r = runRef.current;
      const t = (performance.now() - r.start) / 1000;
      if (t >= seconds) {
        setElapsed(seconds);
        window.clearInterval(id);
        finish();
        return;
      }
      setElapsed(t);
      const whole = Math.floor(t);
      if (whole > r.samples.length) {
        let correct = 0;
        for (let i = 0; i < r.typed.length; i++)
          if (r.typed[i] === r.text[i]) correct++;
        setRun((cur) => ({
          ...cur,
          samples: [...cur.samples, liveWpm(correct, whole)],
        }));
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [running, seconds, finish]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (result) return;
    const value = e.target.value;
    setRun((r) => {
      if (value.length > r.text.length) return r;
      const added = value.length - r.typed.length;
      let wrong = 0;
      for (let i = r.typed.length; i < value.length; i++)
        if (value[i] !== r.text[i]) wrong++;
      return {
        ...r,
        typed: value,
        start: r.start || (added > 0 ? performance.now() : 0),
        keystrokes: r.keystrokes + Math.max(0, added),
        wrong: r.wrong + wrong,
      };
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      restart();
    }
  };

  // Show a window of text around the caret so long tests stay fast.
  const view = useMemo(() => {
    const { text, typed } = run;
    let from = Math.max(0, typed.length - 120);
    if (from > 0) from = text.lastIndexOf(' ', from) + 1;
    const to = Math.min(text.length, typed.length + 260);
    return { from, chars: text.slice(from, to).split('') };
  }, [run]);

  const correctSoFar = useMemo(() => {
    let c = 0;
    for (let i = 0; i < run.typed.length; i++)
      if (run.typed[i] === run.text[i]) c++;
    return c;
  }, [run.typed, run.text]);

  const remaining = Math.max(0, Math.ceil(seconds - elapsed));
  const best = personalBest(history, seconds);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
        <fieldset className="flex flex-wrap items-center gap-1.5">
          <legend className="sr-only">Test length</legend>
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={seconds === d}
              onClick={() => {
                setSeconds(d);
                restart({ seconds: d });
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${seconds === d ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {durationLabel(d)}
            </button>
          ))}
        </fieldset>
        <label className="flex items-center gap-2">
          <span className="text-gray-600">Text</span>
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as TextMode;
              setMode(m);
              restart({ mode: m });
            }}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5"
          >
            <option value="words">Common words</option>
            <option value="sentences">Sentences</option>
          </select>
        </label>
        {mode === 'words' && (
          <>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={punctuation}
                onChange={(e) => {
                  setPunctuation(e.target.checked);
                  restart({ punctuation: e.target.checked });
                }}
              />
              Punctuation
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => {
                  setNumbers(e.target.checked);
                  restart({ numbers: e.target.checked });
                }}
              />
              Numbers
            </label>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <Stat label="Time left" value={`${remaining}s`} big />
        <Stat
          label="WPM"
          // The first seconds swing wildly, so wait before showing a pace.
          value={
            result
              ? String(result.wpm)
              : elapsed >= 3
                ? String(liveWpm(correctSoFar, elapsed))
                : '—'
          }
          big
        />
        <Stat label="Best" value={best ? `${best} WPM` : '—'} />
      </div>

      {!result ? (
        <div
          className={`relative cursor-text rounded-2xl border bg-white p-5 font-mono text-xl leading-[2.2rem] sm:text-2xl sm:leading-[2.6rem] ${focused ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-200'}`}
          onClick={() => input.current?.focus()}
        >
          <input
            ref={input}
            value={run.typed}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onPaste={(e) => e.preventDefault()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Type the text shown here"
            className="absolute inset-0 h-full w-full cursor-text opacity-0"
          />
          <p
            aria-hidden
            className="h-[6.6rem] overflow-hidden break-words sm:h-[7.8rem]"
          >
            {view.chars.map((ch, j) => {
              const i = view.from + j;
              const typed = run.typed[i];
              const isCaret = i === run.typed.length;
              const cls =
                typed === undefined
                  ? 'text-gray-400'
                  : typed === ch
                    ? 'text-gray-900'
                    : ch === ' '
                      ? 'bg-red-100'
                      : 'text-red-600 underline decoration-red-300';
              return (
                <span
                  key={i}
                  className={`${cls} ${isCaret && focused ? 'border-l-2 border-brand-500 -ml-[2px]' : ''}`}
                >
                  {ch}
                </span>
              );
            })}
          </p>
          {!focused && (
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-sans text-xs text-gray-500">
              Click or tap here and start typing
            </p>
          )}
        </div>
      ) : (
        <Results result={result} samples={run.samples} seconds={seconds} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btnPrimary} onClick={() => restart()}>
          ↻ {result ? 'Try again' : 'Restart'}
        </button>
        <span className="text-xs text-gray-500">
          The timer starts with your first key. Tab or Esc restarts.
        </span>
      </div>

      {history.length > 0 && (
        <section aria-labelledby="typing-history" className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3
              id="typing-history"
              className="text-sm font-semibold text-gray-900"
            >
              {history.length === 1
                ? 'Your last result'
                : `Your last ${history.length} results`}
            </h3>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                if (window.confirm('Delete your saved typing results?'))
                  setHistory([]);
              }}
            >
              Clear history
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="py-1 pr-4 font-medium">When</th>
                  <th className="py-1 pr-4 font-medium">Length</th>
                  <th className="py-1 pr-4 font-medium">WPM</th>
                  <th className="py-1 font-medium">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h) => (
                  <tr key={h.at}>
                    <td className="py-1.5 pr-4 text-gray-600">
                      {new Date(h.at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-1.5 pr-4">{durationLabel(h.seconds)}</td>
                    <td className="py-1.5 pr-4 font-semibold">{h.wpm}</td>
                    <td className="py-1.5">{h.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            🔒 Results are saved only in this browser.
          </p>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p
        className={`font-bold tabular-nums text-gray-900 ${big ? 'text-3xl' : 'text-lg'}`}
        aria-live={label === 'Time left' ? 'off' : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function Results({
  result,
  samples,
  seconds,
}: {
  result: TypingResult;
  samples: number[];
  seconds: number;
}) {
  const max = Math.max(10, ...samples, result.wpm);
  const w = 600;
  const h = 120;
  const pts = samples
    .map(
      (v, i) =>
        `${((i + 1) / Math.max(1, seconds)) * w},${h - (v / max) * (h - 10)}`,
    )
    .join(' ');
  return (
    <div
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <p>
          <span className="text-5xl font-extrabold text-brand-700">
            {result.wpm}
          </span>{' '}
          <span className="text-lg font-semibold text-gray-700">WPM</span>
        </p>
        <p className="text-sm text-gray-600">{speedLabel(result.wpm)}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          ['Accuracy', `${result.accuracy}%`],
          ['Raw WPM', String(result.rawWpm)],
          ['Correct characters', String(result.chars.correct)],
          ['Errors left', String(result.errors)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-gray-50 px-3 py-2">
            <dt className="text-xs text-gray-500">{k}</dt>
            <dd className="text-lg font-semibold text-gray-900">{v}</dd>
          </div>
        ))}
      </dl>
      {samples.length > 1 && (
        <figure>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="h-28 w-full"
            role="img"
            aria-label={`Words per minute over the ${durationLabel(seconds)} test`}
          >
            <line x1="0" y1={h} x2={w} y2={h} stroke="#e5e7eb" />
            <polyline
              points={pts}
              fill="none"
              stroke="#d1105a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <figcaption className="text-xs text-gray-500">
            WPM second by second — a flat line means a steady pace.
          </figcaption>
        </figure>
      )}
    </div>
  );
}
