'use client';

// Stopwatch, countdown timer and Pomodoro timer. All timing is based on
// performance.now()/Date.now() deltas so background-tab throttling can't drift it.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatCountdown,
  formatStopwatch,
} from '@/lib/online-tools/engines/games';
import type { ToolProps } from '../ToolRenderer';
import { NumberField, btnPrimary, btnSecondary } from '../ui';

function useTicker(active: boolean, fps = 30) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 1000 / fps) {
        last = t;
        setTick((x) => x + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // rAF pauses in background tabs; a slow interval keeps the title updated.
    const iv = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(iv);
    };
  }, [active, fps]);
}

function useKeys(map: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const fn = map[e.code] ?? map[e.key.toLowerCase()];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [map]);
}

/** A short three-tone alarm via WebAudio (no audio files). */
function beep(times = 3) {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    for (let i = 0; i < times; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.45;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    }
    window.setTimeout(() => void ctx.close(), times * 450 + 200);
  } catch {
    // Audio unavailable; the visual alert still shows.
  }
}

function notify(title: string, body: string) {
  try {
    if (
      'Notification' in window &&
      Notification.permission === 'granted' &&
      document.hidden
    )
      new Notification(title, { body });
  } catch {
    // Notifications unsupported (e.g. iOS Safari outside a PWA).
  }
}

function requestNotifications() {
  try {
    if ('Notification' in window && Notification.permission === 'default')
      void Notification.requestPermission();
  } catch {
    // Ignore.
  }
}

const FULLSCREEN_CLASS =
  '[&:fullscreen]:justify-center [&:fullscreen]:overflow-auto [&:fullscreen]:bg-white [&:fullscreen]:p-8';

/** Full-screen toggle for the whole tool, where the browser supports it. */
function FullscreenButton({
  target,
}: {
  target: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(Boolean(document.fullscreenEnabled));
    const onChange = () =>
      setActive(document.fullscreenElement === target.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [target]);
  if (!supported) return null;
  return (
    <button
      type="button"
      className={btnSecondary}
      onClick={() =>
        active
          ? void document.exitFullscreen()
          : void target.current?.requestFullscreen().catch(() => undefined)
      }
    >
      {active ? 'Exit full screen' : '⛶ Full screen'}
    </button>
  );
}

function useTitle(text: string | null) {
  useEffect(() => {
    if (!text) return;
    const original = document.title;
    document.title = text;
    return () => {
      document.title = original;
    };
  }, [text]);
}

export function StopwatchTool(_: ToolProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [carried, setCarried] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const running = startedAt !== null;
  useTicker(running);
  const elapsed = carried + (running ? performance.now() - startedAt : 0);

  const startStop = useCallback(() => {
    if (running) {
      setCarried((c) => c + performance.now() - (startedAt ?? 0));
      setStartedAt(null);
    } else setStartedAt(performance.now());
  }, [running, startedAt]);
  const lap = useCallback(() => {
    if (running)
      setLaps((l) => [...l, carried + performance.now() - (startedAt ?? 0)]);
  }, [running, carried, startedAt]);
  const reset = useCallback(() => {
    if (running) return;
    setCarried(0);
    setLaps([]);
  }, [running]);
  const keyMap = useRef<Record<string, () => void>>({});
  keyMap.current = { Space: startStop, l: lap, r: reset };
  useKeys(
    useRef({
      Space: () => keyMap.current.Space(),
      l: () => keyMap.current.l(),
      r: () => keyMap.current.r(),
    }).current,
  );
  useTitle(
    running ? `⏱ ${formatStopwatch(elapsed).slice(0, -3)} — Stopwatch` : null,
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const lapTimes = laps.map((t, i) => t - (i ? laps[i - 1] : 0));
  const fastest = lapTimes.length > 1 ? Math.min(...lapTimes) : -1;
  const slowest = lapTimes.length > 1 ? Math.max(...lapTimes) : -1;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col items-center gap-5 ${FULLSCREEN_CLASS}`}
    >
      <output
        className="font-mono text-6xl font-semibold tabular-nums text-gray-900 sm:text-8xl"
        aria-live="off"
        aria-label={`Elapsed ${formatStopwatch(elapsed)}`}
      >
        {formatStopwatch(elapsed)}
      </output>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${btnPrimary} min-w-[110px]`}
          onClick={startStop}
        >
          {running ? 'Stop' : elapsed ? 'Resume' : 'Start'}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={running ? lap : reset}
          disabled={!running && !elapsed}
        >
          {running ? 'Lap' : 'Reset'}
        </button>
        <FullscreenButton target={rootRef} />
      </div>
      <p className="text-xs text-gray-500">
        Shortcuts: Space start/stop · L lap · R reset
      </p>
      {laps.length > 0 && (
        <table className="w-full max-w-md text-sm tabular-nums">
          <thead className="text-left text-xs text-gray-500">
            <tr>
              <th className="py-1 font-medium">Lap</th>
              <th className="py-1 text-right font-medium">Lap time</th>
              <th className="py-1 text-right font-medium">Split</th>
            </tr>
          </thead>
          <tbody>
            {laps
              .map((t, i) => ({ t, i, lt: lapTimes[i] }))
              .reverse()
              .map(({ t, i, lt }) => (
                <tr
                  key={i}
                  className={`border-t border-gray-100 ${lt === fastest ? 'text-emerald-700' : lt === slowest ? 'text-red-700' : ''}`}
                >
                  <td className="py-1.5">
                    {i + 1}
                    {lt === fastest
                      ? ' · fastest'
                      : lt === slowest
                        ? ' · slowest'
                        : ''}
                  </td>
                  <td className="py-1.5 text-right font-mono">
                    {formatStopwatch(lt)}
                  </td>
                  <td className="py-1.5 text-right font-mono">
                    {formatStopwatch(t)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

type Phase = 'focus' | 'short' | 'long';
const PHASE_LABEL: Record<Phase, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
};

export function TimerTool({ config }: ToolProps) {
  const pomodoro = config.mode === 'pomodoro';
  const [lengths, setLengths] = useState({
    focus: '25',
    short: '5',
    long: '15',
  });
  const [phase, setPhase] = useState<Phase>('focus');
  const [round, setRound] = useState(1);
  const [h, setH] = useState('0');
  const [m, setM] = useState('5');
  const [s, setS] = useState('0');
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(
    pomodoro ? 25 * 60_000 : 5 * 60_000,
  );
  const [ringing, setRinging] = useState(false);
  const running = endAt !== null;
  useTicker(running, 10);
  const phaseMs = useCallback(
    (p: Phase) => Math.max(1, Number(lengths[p]) || 1) * 60_000,
    [lengths],
  );
  const customMs = () =>
    ((Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0)) * 1000;
  // When idle with nothing pending, show what Start would run.
  const left = running
    ? Math.max(0, endAt - Date.now())
    : remaining > 0 || ringing
      ? remaining
      : pomodoro
        ? phaseMs(phase)
        : customMs();

  // Finish detection.
  useEffect(() => {
    if (!running || left > 0) return;
    setEndAt(null);
    setRemaining(0);
    setRinging(true);
    beep(pomodoro ? 2 : 4);
    if (pomodoro) {
      const next: Phase =
        phase === 'focus' ? (round % 4 === 0 ? 'long' : 'short') : 'focus';
      notify(
        `${PHASE_LABEL[phase]} finished`,
        `Time for: ${PHASE_LABEL[next].toLowerCase()}.`,
      );
      if (phase !== 'focus') setRound((r) => r + 1);
      setPhase(next);
      setRemaining(phaseMs(next));
    } else notify('Timer finished', 'Your countdown has ended.');
  }, [running, left, pomodoro, phase, round, phaseMs]);

  const start = () => {
    requestNotifications();
    setRinging(false);
    const base =
      remaining > 0 ? remaining : pomodoro ? phaseMs(phase) : customMs();
    if (base <= 0) return;
    setEndAt(Date.now() + base);
  };
  const pause = () => {
    setRemaining(left);
    setEndAt(null);
  };
  const reset = () => {
    setEndAt(null);
    setRinging(false);
    setRemaining(pomodoro ? phaseMs(phase) : customMs());
  };
  const setPreset = (minutes: number) => {
    setH(String(Math.floor(minutes / 60)));
    setM(String(minutes % 60));
    setS('0');
    setEndAt(null);
    setRinging(false);
    setRemaining(minutes * 60_000);
  };

  const toggleRef = useRef<() => void>(() => undefined);
  toggleRef.current = running ? pause : start;
  useKeys(useRef({ Space: () => toggleRef.current() }).current);
  useTitle(
    running
      ? `${pomodoro ? (phase === 'focus' ? '🍅' : '☕') : '⏲'} ${formatCountdown(left)}`
      : null,
  );

  const rootRef = useRef<HTMLDivElement | null>(null);
  const total = pomodoro ? phaseMs(phase) : Math.max(remaining, customMs(), 1);
  const progress = 1 - left / total;

  return (
    <div
      ref={rootRef}
      className={`flex flex-col items-center gap-5 ${FULLSCREEN_CLASS}`}
    >
      {pomodoro && (
        <div
          role="tablist"
          aria-label="Phase"
          className="inline-flex rounded-xl border border-gray-200 p-1"
        >
          {(['focus', 'short', 'long'] as Phase[]).map((p) => (
            <button
              key={p}
              role="tab"
              type="button"
              aria-selected={phase === p}
              onClick={() => {
                setPhase(p);
                setEndAt(null);
                setRemaining(phaseMs(p));
              }}
              className={`rounded-lg px-3 py-1.5 text-sm ${phase === p ? (p === 'focus' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white') : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {PHASE_LABEL[p]}
            </button>
          ))}
        </div>
      )}
      <div className="relative flex h-64 w-64 items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              pomodoro && phase !== 'focus'
                ? '#059669'
                : pomodoro
                  ? '#dc2626'
                  : '#4f46e5'
            }
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(0, Math.min(1, progress)) * 282.7} 282.7`}
          />
        </svg>
        <output
          className={`font-mono text-5xl font-semibold tabular-nums ${ringing ? 'animate-pulse text-red-600' : 'text-gray-900'}`}
          aria-live="off"
        >
          {formatCountdown(left)}
        </output>
      </div>
      {pomodoro && (
        <p className="text-sm text-gray-600">
          Round {round} · {PHASE_LABEL[phase]}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className={`${btnPrimary} min-w-[110px]`}
          onClick={running ? pause : start}
        >
          {running
            ? 'Pause'
            : remaining > 0 && remaining < total
              ? 'Resume'
              : 'Start'}
        </button>
        {running && !pomodoro && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setEndAt((e) => (e ?? Date.now()) + 60_000)}
          >
            +1 min
          </button>
        )}
        <button type="button" className={btnSecondary} onClick={reset}>
          Reset
        </button>
        {ringing && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setRinging(false)}
          >
            Dismiss
          </button>
        )}
        <FullscreenButton target={rootRef} />
      </div>
      <p aria-live="assertive" className="sr-only">
        {ringing ? 'Time is up.' : ''}
      </p>

      {pomodoro ? (
        <fieldset className="grid w-full max-w-md grid-cols-3 gap-3">
          <legend className="mb-2 text-sm font-semibold text-gray-900">
            Lengths (minutes)
          </legend>
          <NumberField
            label="Focus"
            value={lengths.focus}
            onChange={(v) => setLengths({ ...lengths, focus: v })}
            min={1}
            max={180}
          />
          <NumberField
            label="Short break"
            value={lengths.short}
            onChange={(v) => setLengths({ ...lengths, short: v })}
            min={1}
            max={60}
          />
          <NumberField
            label="Long break"
            value={lengths.long}
            onChange={(v) => setLengths({ ...lengths, long: v })}
            min={1}
            max={90}
          />
        </fieldset>
      ) : (
        !running && (
          <div className="w-full max-w-md space-y-3">
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 3, 5, 10, 15, 20, 30, 45, 60].map((min) => (
                <button
                  key={min}
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPreset(min)}
                >
                  {min < 60 ? `${min} min` : '1 hour'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <NumberField
                label="Hours"
                value={h}
                onChange={(v) => (setH(v), setRemaining(0))}
                min={0}
                max={99}
              />
              <NumberField
                label="Minutes"
                value={m}
                onChange={(v) => (setM(v), setRemaining(0))}
                min={0}
                max={59}
              />
              <NumberField
                label="Seconds"
                value={s}
                onChange={(v) => (setS(v), setRemaining(0))}
                min={0}
                max={59}
              />
            </div>
          </div>
        )
      )}
      <p className="text-xs text-gray-500">
        Space to start/pause. Allow notifications to be alerted when this tab is
        in the background.
      </p>
    </div>
  );
}

export default StopwatchTool;
