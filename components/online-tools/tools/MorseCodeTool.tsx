'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MORSE,
  isMorse,
  morseToText,
  textToMorse,
} from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Direction = 'auto' | 'encode' | 'decode';
type PlayState = 'idle' | 'playing' | 'paused';

/** On/off timeline in dot units for a Morse string (“.-- / ...”). */
function timeline(morse: string): { on: boolean; units: number }[] {
  const out: { on: boolean; units: number }[] = [];
  const words = morse.trim().split(/\s*\/\s*/);
  words.forEach((word, wi) => {
    if (wi) out.push({ on: false, units: 7 });
    word
      .split(/\s+/)
      .filter(Boolean)
      .forEach((letter, li) => {
        if (li) out.push({ on: false, units: 3 });
        [...letter].forEach((sym, si) => {
          if (si) out.push({ on: false, units: 1 });
          if (sym === '.') out.push({ on: true, units: 1 });
          else if (sym === '-') out.push({ on: true, units: 3 });
        });
      });
  });
  return out;
}

const SAMPLE = 'SOS Hello World';

export default function MorseCodeTool(_: ToolProps) {
  const [input, setInput] = useState(SAMPLE);
  const [direction, setDirection] = useState<Direction>('auto');
  const [wpm, setWpm] = useState(18);
  const [tone, setTone] = useState(600);
  const [play, setPlay] = useState<PlayState>('idle');
  const ctxRef = useRef<AudioContext | null>(null);
  const endTimer = useRef<number | null>(null);

  const decode =
    direction === 'decode' || (direction === 'auto' && isMorse(input));
  const output = useMemo(
    () => (decode ? morseToText(input) : textToMorse(input)),
    [input, decode],
  );
  const morse = decode ? input : output;
  const unsupported = useMemo(
    () =>
      decode
        ? []
        : [
            ...new Set(
              [...input.toUpperCase()].filter(
                (c) => !/\s/.test(c) && !MORSE[c],
              ),
            ),
          ],
    [input, decode],
  );

  const stop = () => {
    if (endTimer.current) window.clearTimeout(endTimer.current);
    void ctxRef.current?.close();
    ctxRef.current = null;
    setPlay('idle');
  };
  useEffect(() => stop, []);

  const start = () => {
    stop();
    const steps = timeline(morse);
    if (!steps.length) return;
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    ctxRef.current = ctx;
    const unit = 1.2 / wpm; // seconds per dot (PARIS standard)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = tone;
    osc.type = 'sine';
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    let t = ctx.currentTime + 0.05;
    for (const s of steps) {
      const d = s.units * unit;
      if (s.on) {
        // Short ramps avoid clicks at each tone edge.
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.005);
        gain.gain.setValueAtTime(0.4, t + d - 0.005);
        gain.gain.linearRampToValueAtTime(0, t + d);
      }
      t += d;
    }
    osc.start();
    osc.stop(t + 0.05);
    osc.onended = () => {
      if (ctxRef.current === ctx) stop();
    };
    setPlay('playing');
  };

  const togglePause = async () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (play === 'playing') {
      await ctx.suspend();
      setPlay('paused');
    } else {
      await ctx.resume();
      setPlay('playing');
    }
  };

  const swap = () => {
    stop();
    setInput(output);
    setDirection(decode ? 'encode' : 'decode');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="morse-in" className={labelBase}>
            {decode ? 'Morse code' : 'Text'}
          </label>
          <textarea
            id="morse-in"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="Type text, or paste Morse like .... . .-.. .-.. ---"
            className={`${inputBase} ${decode ? 'font-mono' : ''}`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="morse-out" className={labelBase}>
            {decode ? 'Text' : 'Morse code'}
          </label>
          <textarea
            id="morse-out"
            rows={6}
            readOnly
            value={output}
            className={`${inputBase} bg-gray-50 ${decode ? '' : 'font-mono'}`}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: 'auto', label: 'Detect automatically' },
            { value: 'encode', label: 'Text → Morse' },
            { value: 'decode', label: 'Morse → Text' },
          ]}
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={swap}
          disabled={!output}
        >
          ⇄ Swap
        </button>
        <CopyButton text={output} label="Copy result" />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            stop();
            setInput('');
          }}
          disabled={!input}
        >
          Clear
        </button>
      </div>
      {unsupported.length > 0 && (
        <p className="text-xs text-amber-800">
          Skipped (no Morse code): {unsupported.join(' ')}
        </p>
      )}

      {morse.trim() && (
        <section
          aria-labelledby="morse-visual"
          className="space-y-3 rounded-2xl border border-gray-100 p-4"
        >
          <h2 id="morse-visual" className="text-sm font-semibold text-gray-900">
            Listen and see
          </h2>
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
            aria-label={`Visual Morse: ${morse}`}
            role="img"
          >
            {morse
              .trim()
              .split(/\s+/)
              .slice(0, 120)
              .map((code, i) =>
                code === '/' ? (
                  <span key={i} className="w-3" />
                ) : (
                  <span key={i} className="flex items-center gap-1">
                    {[...code].map((s, j) => (
                      <span
                        key={j}
                        className={
                          s === '.'
                            ? 'h-2.5 w-2.5 rounded-full bg-gray-900'
                            : 'h-2.5 w-7 rounded-full bg-gray-900'
                        }
                      />
                    ))}
                  </span>
                ),
              )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RangeField
              label="Speed"
              value={wpm}
              onChange={setWpm}
              min={5}
              max={40}
              display={`${wpm} WPM`}
            />
            <RangeField
              label="Tone"
              value={tone}
              onChange={setTone}
              min={300}
              max={1000}
              step={10}
              display={`${tone} Hz`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={start}>
              ▶ {play === 'idle' ? 'Play' : 'Restart'}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void togglePause()}
              disabled={play === 'idle'}
            >
              {play === 'paused' ? '▶ Resume' : '❚❚ Pause'}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={stop}
              disabled={play === 'idle'}
            >
              ■ Stop
            </button>
          </div>
          <p className="text-xs text-gray-500" aria-live="polite">
            {play === 'playing'
              ? 'Playing…'
              : play === 'paused'
                ? 'Paused'
                : 'Speed uses the PARIS standard: a dot lasts 1.2 ÷ WPM seconds.'}
          </p>
        </section>
      )}

      <section aria-labelledby="morse-alpha" className="space-y-2">
        <h2 id="morse-alpha" className="text-sm font-semibold text-gray-900">
          Morse alphabet
        </h2>
        <p className="text-xs text-gray-500">
          Click a character to add it to the text.
        </p>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1.5">
          {Object.entries(MORSE).map(([ch, code]) => (
            <li key={ch}>
              <button
                type="button"
                onClick={() => {
                  if (decode) setDirection('encode');
                  setInput((v) => (decode ? ch : v + ch));
                }}
                aria-label={`${ch}: ${code.replace(/\./g, 'dot ').replace(/-/g, 'dash ').trim()}`}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-100 px-2.5 py-1.5 text-left hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="font-semibold text-gray-900">{ch}</span>
                <span className="font-mono text-sm tracking-wider text-gray-700">
                  {code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
