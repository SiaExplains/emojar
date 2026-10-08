'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  Notice,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Alarm = {
  id: number;
  time: string; // HH:MM
  label: string;
  sound: SoundId;
  days: number[]; // 0 = Sunday; empty = once
  enabled: boolean;
  /** Next ring time (ms) for one-off alarms and snoozes. */
  snoozeUntil?: number;
  lastFired?: number;
};

type SoundId = 'beep' | 'chime' | 'digital' | 'gentle';
const SOUNDS: { id: SoundId; label: string }[] = [
  { id: 'beep', label: 'Classic beep' },
  { id: 'digital', label: 'Digital alarm' },
  { id: 'chime', label: 'Chime' },
  { id: 'gentle', label: 'Gentle rise' },
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STORE = 'emojar-alarms-v1';
const NOTIFY_STORE = 'emojar-alarms-notify-v1';

/** Next time the alarm should ring after `from` (ms), or null if it can't. */
export function nextRing(a: Alarm, from: number): number | null {
  if (a.snoozeUntil && a.snoozeUntil > from) return a.snoozeUntil;
  const [h, m] = a.time.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  for (let add = 0; add < 8; add++) {
    const d = new Date(from);
    d.setDate(d.getDate() + add);
    d.setHours(h, m, 0, 0);
    if (d.getTime() <= from) continue;
    if (a.days.length && !a.days.includes(d.getDay())) continue;
    return d.getTime();
  }
  return null;
}

function playSound(ctx: AudioContext, sound: SoundId, seconds = 4) {
  const t0 = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.25;
  out.connect(ctx.destination);
  const tone = (
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType = 'sine',
    vol = 1,
  ) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0 + start);
    g.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
    o.connect(g).connect(out);
    o.start(t0 + start);
    o.stop(t0 + start + dur + 0.05);
  };
  for (let s = 0; s < seconds; s += 1) {
    if (sound === 'beep')
      [0, 0.25, 0.5].forEach((d) => tone(880, s + d, 0.15, 'square', 0.6));
    if (sound === 'digital')
      [0, 0.12, 0.24, 0.36].forEach((d) =>
        tone(2000, s + d, 0.08, 'square', 0.5),
      );
    if (sound === 'chime')
      [523, 659, 784].forEach((f, i) =>
        tone(f, s + i * 0.18, 0.7, 'sine', 0.8),
      );
    if (sound === 'gentle')
      tone(440 + s * 40, s, 0.9, 'triangle', Math.min(1, 0.2 + s * 0.2));
  }
}

let nextId = 1;

export default function AlarmClockTool(_: ToolProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [ringing, setRinging] = useState<Alarm | null>(null);
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [sound, setSound] = useState<SoundId>('beep');
  const [days, setDays] = useState<number[]>([]);
  const [notify, setNotify] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  const loop = useRef<number | null>(null);

  // Load and save alarms (the only thing this page stores, locally).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) {
        const list = JSON.parse(raw) as Alarm[];
        nextId = Math.max(1, ...list.map((a) => a.id + 1));
        setAlarms(list);
      }
      setNotify(localStorage.getItem(NOTIFY_STORE) === '1');
    } catch {
      /* storage unavailable */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE, JSON.stringify(alarms));
      localStorage.setItem(NOTIFY_STORE, notify ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
  }, [alarms, loaded, notify]);

  const unlockAudio = () => {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx.current ??= new AC();
    void ctx.current.resume();
  };

  const startRinging = useCallback(
    (a: Alarm) => {
      setRinging(a);
      unlockAudio();
      const play = () => ctx.current && playSound(ctx.current, a.sound);
      play();
      if (loop.current) window.clearInterval(loop.current);
      loop.current = window.setInterval(play, 4000);
      if (
        notify &&
        'Notification' in window &&
        Notification.permission === 'granted'
      )
        try {
          new Notification(a.label || 'Alarm', {
            body: `It’s ${a.time}`,
            tag: `alarm-${a.id}`,
          });
        } catch {
          // Android Chrome only allows notifications from a service worker;
          // the sound and the on-page banner still work.
        }
    },
    [notify],
  );

  const stopRinging = () => {
    if (loop.current) window.clearInterval(loop.current);
    loop.current = null;
    setRinging(null);
  };

  // Tick every second and fire due alarms. A precise timeout for the next
  // alarm helps in background tabs, where intervals are throttled.
  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      setAlarms((list) => {
        let changed = false;
        const next = list.map((a) => {
          if (!a.enabled) return a;
          // Look back at most 61 s, so a missed ring (closed tab, sleep) never
          // blocks later ones.
          const due = nextRing(a, Math.max(a.lastFired ?? 0, t - 61_000));
          if (due && due <= t && t - due < 60_000) {
            changed = true;
            queueMicrotask(() => startRinging(a));
            return {
              ...a,
              lastFired: t,
              snoozeUntil: undefined,
              enabled: a.days.length ? true : false,
            };
          }
          return a;
        });
        return changed ? next : list;
      });
    };
    const i = window.setInterval(tick, 1000);
    const upcoming = alarms
      .filter((a) => a.enabled)
      .map((a) => nextRing(a, Date.now()))
      .filter((x): x is number => x !== null)
      .sort((a, b) => a - b)[0];
    const to = upcoming
      ? window.setTimeout(tick, Math.max(0, upcoming - Date.now() + 50))
      : undefined;
    return () => {
      window.clearInterval(i);
      if (to) window.clearTimeout(to);
    };
  }, [alarms, startRinging]);

  useEffect(
    () => () => {
      if (loop.current) window.clearInterval(loop.current);
      void ctx.current?.close();
    },
    [],
  );

  const add = async () => {
    unlockAudio();
    if (
      notify &&
      'Notification' in window &&
      Notification.permission === 'default'
    )
      await Notification.requestPermission();
    setAlarms((l) => [
      ...l,
      { id: nextId++, time, label: label.trim(), sound, days, enabled: true },
    ]);
    setLabel('');
  };

  const snooze = (min: number) => {
    if (!ringing) return;
    const until = Date.now() + min * 60_000;
    setAlarms((l) =>
      l.map((a) =>
        a.id === ringing.id ? { ...a, enabled: true, snoozeUntil: until } : a,
      ),
    );
    stopRinging();
  };

  const clock = new Date(now);
  const upcoming = alarms
    .filter((a) => a.enabled)
    .map((a) => ({ a, at: nextRing(a, now) }))
    .filter((x): x is { a: Alarm; at: number } => x.at !== null)
    .sort((x, y) => x.at - y.at)[0];
  const inText = (ms: number) => {
    const m = Math.round(ms / 60000);
    const h = Math.floor(m / 60);
    return h ? `${h} h ${m % 60} min` : `${m} min`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-gray-900 px-6 py-8 text-center text-white">
        <p
          className="font-mono text-6xl font-semibold tabular-nums sm:text-7xl"
          aria-live="off"
        >
          {clock.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
        <p className="mt-2 text-sm text-gray-300">
          {clock.toLocaleDateString([], {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
          {upcoming && ` · next alarm in ${inText(upcoming.at - now)}`}
        </p>
      </div>

      {ringing && (
        <div
          className="space-y-3 rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 text-center"
          role="alert"
        >
          <p className="text-2xl font-semibold text-rose-900">
            ⏰ {ringing.label || 'Alarm'} — {ringing.time}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={btnPrimary} onClick={stopRinging}>
              Stop
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => snooze(5)}
            >
              Snooze 5 min
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => snooze(10)}
            >
              Snooze 10 min
            </button>
          </div>
        </div>
      )}

      <section
        className="space-y-4 rounded-2xl border border-gray-100 p-4"
        aria-labelledby="new-alarm"
      >
        <h2 id="new-alarm" className="text-base font-semibold text-gray-900">
          Set an alarm
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="alarm-time" className={labelBase}>
              Time
            </label>
            <input
              id="alarm-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputBase} text-lg`}
            />
          </div>
          <TextField
            label="Label (optional)"
            value={label}
            onChange={setLabel}
            placeholder="Wake up, meeting…"
          />
          <SelectField
            label="Sound"
            value={sound}
            onChange={(v) => setSound(v as SoundId)}
            options={SOUNDS.map((s) => ({ value: s.id, label: s.label }))}
          />
        </div>
        <fieldset>
          <legend className={labelBase}>Repeat (leave empty for once)</legend>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {DAY_NAMES.map((d, i) => (
              <button
                key={d}
                type="button"
                aria-pressed={days.includes(i)}
                onClick={() =>
                  setDays((x) =>
                    x.includes(i) ? x.filter((y) => y !== i) : [...x, i],
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs ${days.includes(i) ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void add()}
          >
            Add alarm
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              unlockAudio();
              if (ctx.current) playSound(ctx.current, sound, 1);
            }}
          >
            ▶ Test sound
          </button>
          <Checkbox
            label="Also show a notification"
            checked={notify}
            onChange={setNotify}
          />
        </div>
      </section>

      {alarms.length > 0 && (
        <ul className="space-y-2">
          {alarms
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((a) => {
              const at = a.enabled ? nextRing(a, now) : null;
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 px-4 py-3"
                >
                  <span
                    className={`font-mono text-2xl tabular-nums ${a.enabled ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    {a.time}
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-gray-600">
                    {a.label || 'Alarm'} ·{' '}
                    {a.days.length
                      ? [...a.days]
                          .sort((x, y) => x - y)
                          .map((d) => DAY_NAMES[d])
                          .join(', ')
                      : 'Once'}{' '}
                    · {SOUNDS.find((s) => s.id === a.sound)?.label}
                    {at && (
                      <span className="block text-xs text-gray-400">
                        rings in {inText(at - now)}
                      </span>
                    )}
                  </span>
                  <Checkbox
                    label="On"
                    checked={a.enabled}
                    onChange={(v) =>
                      setAlarms((l) =>
                        l.map((x) =>
                          x.id === a.id
                            ? { ...x, enabled: v, snoozeUntil: undefined }
                            : x,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={() =>
                      setAlarms((l) => l.filter((x) => x.id !== a.id))
                    }
                    aria-label={`Delete alarm ${a.time}`}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
        </ul>
      )}

      <Notice tone="amber">
        Keep this tab open and your device awake — browsers can’t ring an alarm
        from a closed tab, and phones may pause pages when the screen locks.
        Click “Test sound” once so your browser allows audio. Alarms are saved
        only in this browser.
      </Notice>
    </div>
  );
}
