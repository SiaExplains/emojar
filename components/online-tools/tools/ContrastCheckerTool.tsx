'use client';

import { useState } from 'react';
import {
  contrastRatio,
  parseColor,
  rgbToHex,
  wcagResults,
} from '@/lib/online-tools/engines/color';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, TextField, btnSecondary } from '../ui';

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const c = parseColor(value);
  return (
    <div className="flex items-end gap-2">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        mono
        className="flex-1"
      />
      <input
        type="color"
        aria-label={`${label} picker`}
        value={c ? rgbToHex({ ...c, a: undefined }) : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-[38px] w-14 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
      />
    </div>
  );
}

function Check({
  label,
  pass,
  need,
}: {
  label: string;
  pass: boolean;
  need: string;
}) {
  return (
    <li
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${pass ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-900'}`}
    >
      <span>
        {label} <span className="text-xs opacity-70">(≥ {need})</span>
      </span>
      <strong>{pass ? '✓ Pass' : '✗ Fail'}</strong>
    </li>
  );
}

export default function ContrastCheckerTool(_: ToolProps) {
  const [fg, setFg] = useState('#1f2937');
  const [bg, setBg] = useState('#ffffff');
  const f = parseColor(fg);
  const b = parseColor(bg);
  const ratio = f && b ? contrastRatio(f, b) : null;
  const w = ratio ? wcagResults(ratio) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <ColorInput label="Text color" value={fg} onChange={setFg} />
        <button
          type="button"
          className={`${btnSecondary} h-[38px]`}
          onClick={() => {
            setFg(bg);
            setBg(fg);
          }}
          aria-label="Swap colors"
        >
          ⇄
        </button>
        <ColorInput label="Background color" value={bg} onChange={setBg} />
      </div>
      {(!f || !b) && (
        <ErrorMessage>
          Please enter two valid colors, e.g. #1f2937 and #ffffff.
        </ErrorMessage>
      )}
      {ratio && w && f && b && (
        <>
          <div
            className="rounded-2xl border border-gray-200 p-6"
            style={{ background: rgbToHex(b), color: rgbToHex(f) }}
          >
            <p className="text-2xl font-bold">Large text preview (24px bold)</p>
            <p className="mt-2 text-base">
              Normal text preview — the quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <p className="text-center" aria-live="polite">
            <span className="text-sm text-gray-500">Contrast ratio</span>
            <br />
            <span className="text-4xl font-bold tabular-nums text-gray-900">
              {ratio.toFixed(2)}:1
            </span>
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            <Check label="AA · normal text" pass={w.aaNormal} need="4.5:1" />
            <Check label="AA · large text" pass={w.aaLarge} need="3:1" />
            <Check label="AAA · normal text" pass={w.aaaNormal} need="7:1" />
            <Check label="AAA · large text" pass={w.aaaLarge} need="4.5:1" />
            <Check
              label="UI components & icons"
              pass={w.uiComponents}
              need="3:1"
            />
          </ul>
        </>
      )}
    </div>
  );
}
