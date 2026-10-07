'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ALL_KEY_CODES,
  MAIN_KEYS,
  NAV_KEYS,
  NUMPAD_KEYS,
  keyLocationName,
  type KeyRow,
} from '@/lib/online-tools/engines/device';
import type { ToolProps } from '../ToolRenderer';
import { Checkbox, btnSecondary } from '../ui';

type LastKey = {
  key: string;
  code: string;
  keyCode: number;
  location: number;
  repeat: boolean;
  mods: string;
};

const KNOWN = new Set(ALL_KEY_CODES);
// Keys whose default action would scroll or leave the page while testing.
const BLOCK_DEFAULT =
  /^(Tab|Space|Arrow|Page|Home|End|Backspace|F\d+|Quote|Slash|Alt|ContextMenu)/;

export default function KeyboardTesterTool(_: ToolProps) {
  const area = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [down, setDown] = useState<Set<string>>(() => new Set());
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [extra, setExtra] = useState<Set<string>>(() => new Set());
  const [last, setLast] = useState<LastKey | null>(null);
  const [maxHeld, setMaxHeld] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);

  const click = useCallback(() => {
    if (!sound) return;
    try {
      const ctx = (audio.current ??= new AudioContext());
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 900;
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.05);
    } catch {
      /* audio is optional */
    }
  }, [sound]);

  useEffect(() => () => void audio.current?.close(), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const code = e.code || e.key;
    if (BLOCK_DEFAULT.test(code) || e.key === ' ') e.preventDefault();
    if (!e.repeat) click();
    setDown((prev) => {
      const next = new Set(prev).add(code);
      setMaxHeld((m) => Math.max(m, next.size));
      return next;
    });
    setTested((prev) => (prev.has(code) ? prev : new Set(prev).add(code)));
    if (!KNOWN.has(code))
      setExtra((prev) => (prev.has(code) ? prev : new Set(prev).add(code)));
    const mods = [
      e.ctrlKey && 'Ctrl',
      e.shiftKey && 'Shift',
      e.altKey && 'Alt',
      e.metaKey && 'Meta',
    ]
      .filter(Boolean)
      .join(' + ');
    setLast({
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      location: e.location,
      repeat: e.repeat,
      mods,
    });
    if (!e.repeat)
      setLog((l) =>
        [
          `${e.code || '(no code)'} → “${e.key === ' ' ? 'Space' : e.key}”`,
          ...l,
        ].slice(0, 12),
      );
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    const code = e.code || e.key;
    if (BLOCK_DEFAULT.test(code)) e.preventDefault();
    setDown((prev) => {
      if (!prev.has(code)) return prev;
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
    // PrintScreen often only fires keyup.
    setTested((prev) => (prev.has(code) ? prev : new Set(prev).add(code)));
  };

  const reset = () => {
    setDown(new Set());
    setTested(new Set());
    setExtra(new Set());
    setLast(null);
    setMaxHeld(0);
    setLog([]);
    area.current?.focus();
  };

  const testedKnown = ALL_KEY_CODES.filter((c) => tested.has(c)).length;

  const renderRows = (rows: KeyRow[], cols?: string) => (
    <div className="space-y-1" style={cols ? { width: cols } : undefined}>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((item, j) =>
            'gap' in item ? (
              <span
                key={j}
                aria-hidden
                style={{ flex: `${item.gap} 0 0` }}
                className="h-9"
              />
            ) : (
              <span
                key={item.code}
                title={item.code}
                style={{ flex: `${item.w ?? 1} 0 0` }}
                className={`flex h-9 min-w-0 items-center justify-center truncate rounded-md border px-1 text-[11px] font-medium transition-colors ${
                  down.has(item.code)
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : tested.has(item.code)
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
                      : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                {item.label}
              </span>
            ),
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div
        ref={area}
        tabIndex={0}
        role="application"
        aria-label="Keyboard test area. Press any key."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setDown(new Set());
        }}
        className={`cursor-pointer rounded-2xl border-2 p-3 outline-none transition sm:p-4 ${
          focused
            ? 'border-indigo-400 bg-indigo-50/40'
            : 'border-dashed border-gray-300 bg-gray-50'
        }`}
      >
        <p className="mb-3 text-center text-sm font-medium text-gray-700">
          {focused
            ? 'Press keys — each one turns green once it works.'
            : 'Click here, then press any key to start.'}
        </p>
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[880px] gap-4">
            <div className="flex-[15_0_0]">{renderRows(MAIN_KEYS)}</div>
            <div className="w-[7.5rem] shrink-0">{renderRows(NAV_KEYS)}</div>
            <div className="w-[10rem] shrink-0">{renderRows(NUMPAD_KEYS)}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btnSecondary} onClick={reset}>
          Reset
        </button>
        <Checkbox label="Click sound" checked={sound} onChange={setSound} />
        <span className="text-sm text-gray-600" aria-live="polite">
          Tested {testedKnown} of {ALL_KEY_CODES.length} keys
          {extra.size > 0 &&
            ` · ${extra.size} extra (media, ISO/JIS keys, F13+…)`}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['Key', last ? (last.key === ' ' ? 'Space' : last.key) : '—'],
          ['Code', last?.code || '—'],
          ['keyCode (legacy)', last ? String(last.keyCode) : '—'],
          ['Location', last ? keyLocationName(last.location) : '—'],
          ['Modifiers', last?.mods || '—'],
          ['Auto-repeat', last ? (last.repeat ? 'Yes' : 'No') : '—'],
          ['Keys held now', String(down.size)],
          ['Most keys at once', String(maxHeld)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-100 p-3">
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="truncate font-mono text-sm font-semibold text-gray-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {log.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-gray-800">
            Recent key presses
          </h3>
          <ol className="flex flex-wrap gap-1.5 font-mono text-xs text-gray-700">
            {log.map((l, i) => (
              <li key={i} className="rounded bg-gray-100 px-2 py-1">
                {l}
              </li>
            ))}
          </ol>
        </div>
      )}

      {extra.size > 0 && (
        <p className="text-xs text-gray-600">
          Extra keys detected: {[...extra].join(', ')}
        </p>
      )}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-gray-700">
          On a phone or tablet? Type here to test the on-screen keyboard
        </span>
        <textarea
          rows={2}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder="Type to check letters, emoji and autocorrect…"
        />
      </label>

      <p className="text-xs text-gray-500">
        Some keys never reach a web page: the Fn key, and shortcuts the
        operating system keeps for itself (such as Win + L, ⌘ + Tab, or Print
        Screen on some systems). If one of those does nothing here, that does
        not mean the key is broken.
      </p>
    </div>
  );
}
