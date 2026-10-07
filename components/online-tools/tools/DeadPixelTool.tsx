'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PIXEL_TEST_COLORS } from '@/lib/online-tools/engines/device';
import type { ToolProps } from '../ToolRenderer';
import { Checkbox, Notice, btnPrimary, btnSecondary } from '../ui';

const FIXER_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];

export default function DeadPixelTool(_: ToolProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [hints, setHints] = useState(true);
  const [fixerConsent, setFixerConsent] = useState(false);
  const [fixerOn, setFixerOn] = useState(false);
  const [fixerPos, setFixerPos] = useState({ x: 0.5, y: 0.5 });
  const [fixerSize, setFixerSize] = useState(80);
  const [fixerColor, setFixerColor] = useState(0);
  const [fixerSeconds, setFixerSeconds] = useState(0);
  const hideTimer = useRef<number | null>(null);
  const drag = useRef(false);

  const color = PIXEL_TEST_COLORS[index];
  const step = useCallback(
    (d: number) =>
      setIndex(
        (i) => (i + d + PIXEL_TEST_COLORS.length) % PIXEL_TEST_COLORS.length,
      ),
    [],
  );

  const close = useCallback(() => {
    setOpen(false);
    setFixerOn(false);
    if (document.fullscreenElement) void document.exitFullscreen?.();
  }, []);

  const start = async (fixer = false) => {
    setOpen(true);
    setFixerOn(fixer);
    setIndex(fixer ? 0 : index);
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      /* iPhone Safari: the fixed overlay still fills the viewport */
    }
  };

  const poke = useCallback(() => {
    setHints(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setHints(false), 2000);
  }, []);

  useEffect(() => {
    if (!open) return;
    overlay.current?.focus();
    poke();
    const onFs = () => {
      if (!document.fullscreenElement) setOpen(false);
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, [open, poke]);

  useEffect(() => {
    if (!open || !auto || fixerOn) return;
    const t = window.setInterval(() => step(1), 3000);
    return () => window.clearInterval(t);
  }, [open, auto, fixerOn, step]);

  useEffect(() => {
    if (!open || !fixerOn) return;
    const started = Date.now();
    setFixerSeconds(0);
    const t = window.setInterval(() => {
      setFixerColor((c) => (c + 1) % FIXER_COLORS.length);
      setFixerSeconds(Math.floor((Date.now() - started) / 1000));
    }, 100);
    return () => window.clearInterval(t);
  }, [open, fixerOn]);

  useEffect(
    () => () => void (hideTimer.current && clearTimeout(hideTimer.current)),
    [],
  );

  const onKey = (e: React.KeyboardEvent) => {
    poke();
    if (e.key === 'Escape') close();
    else if (fixerOn) return;
    else if (['ArrowRight', 'ArrowDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      step(1);
    } else if (['ArrowLeft', 'ArrowUp', 'Backspace'].includes(e.key)) {
      e.preventDefault();
      step(-1);
    }
  };

  const movePointer = (e: React.PointerEvent) => {
    poke();
    if (!drag.current || !overlay.current) return;
    const r = overlay.current.getBoundingClientRect();
    setFixerPos({
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void start(false)}
          >
            Start full-screen test
          </button>
          <Checkbox
            label="Change colour automatically every 3 s"
            checked={auto}
            onChange={setAuto}
          />
        </div>
        <p className="text-sm text-gray-600">
          Click, or press Space or the arrow keys, to switch colours. Press Esc
          to exit. Look closely at each colour for dots that don’t match.
        </p>
        <ul className="grid gap-2 sm:grid-cols-3">
          {PIXEL_TEST_COLORS.map((c, i) => (
            <li key={c.name}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  void start(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-2 text-left hover:bg-gray-50"
              >
                <span
                  aria-hidden
                  className="h-8 w-8 shrink-0 rounded-md border border-gray-200"
                  style={{ background: c.hex }}
                />
                <span>
                  <span className="block text-sm font-medium text-gray-900">
                    {c.name}
                  </span>
                  <span className="block text-xs text-gray-500">{c.finds}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section
        className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4"
        aria-labelledby="fixer-h"
      >
        <h2 id="fixer-h" className="text-base font-semibold text-gray-900">
          Stuck pixel fixer (optional)
        </h2>
        <p className="text-sm text-gray-700">
          A stuck pixel (always red, green, blue or white) can sometimes be
          revived by flashing colours over it for 10–20 minutes. A dead pixel
          (always black) usually cannot be fixed this way.
        </p>
        <Notice tone="amber">
          Warning: the fixer flashes colours rapidly — about 10 times per
          second. Do not use it, or look at it, if you or anyone nearby has
          photosensitive epilepsy or is sensitive to flashing light.
        </Notice>
        <Checkbox
          label="I understand — show the flashing fixer"
          checked={fixerConsent}
          onChange={setFixerConsent}
        />
        {fixerConsent && (
          <div className="flex flex-wrap items-end gap-3">
            <label className="space-y-1 text-sm text-gray-700">
              <span className="block">Square size: {fixerSize} px</span>
              <input
                type="range"
                min={20}
                max={300}
                step={10}
                value={fixerSize}
                onChange={(e) => setFixerSize(Number(e.target.value))}
              />
            </label>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void start(true)}
            >
              Start fixer
            </button>
          </div>
        )}
      </section>

      {open && (
        <div
          ref={overlay}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label={
            fixerOn ? 'Stuck pixel fixer' : `Dead pixel test: ${color.name}`
          }
          onKeyDown={onKey}
          onPointerMove={movePointer}
          onPointerDown={() => {
            if (fixerOn) drag.current = true;
          }}
          onPointerUp={() => {
            drag.current = false;
          }}
          onClick={() => {
            if (!fixerOn) step(1);
          }}
          className="fixed inset-0 z-[1000] select-none outline-none"
          style={{
            background: fixerOn ? '#000' : color.hex,
            cursor: hints ? 'pointer' : 'none',
            touchAction: 'none',
          }}
        >
          {fixerOn && (
            <div
              aria-hidden
              className="absolute"
              style={{
                width: fixerSize,
                height: fixerSize,
                left: `calc(${fixerPos.x * 100}% - ${fixerSize / 2}px)`,
                top: `calc(${fixerPos.y * 100}% - ${fixerSize / 2}px)`,
                background: FIXER_COLORS[fixerColor],
              }}
            />
          )}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-6 flex justify-center transition-opacity duration-500 ${
              hints ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="rounded-full bg-gray-900/80 px-4 py-2 text-xs text-white">
              {fixerOn
                ? `Drag the flashing square over the stuck pixel · running ${Math.floor(fixerSeconds / 60)}:${String(fixerSeconds % 60).padStart(2, '0')} (10–20 min) · Esc to exit`
                : `${color.name} (${index + 1}/${PIXEL_TEST_COLORS.length}) · click, Space or → next · ← back · Esc to exit`}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className={`absolute right-4 top-4 rounded-full bg-gray-900/80 px-3 py-1.5 text-xs text-white transition-opacity ${
              hints ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Exit ✕
          </button>
        </div>
      )}
    </div>
  );
}
