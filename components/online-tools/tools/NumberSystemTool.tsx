'use client';

import { useMemo, useState } from 'react';
import {
  baseName,
  bitLength,
  decompose,
  formatInBase,
  parseInBase,
  superscript,
  ZERO,
} from '@/lib/online-tools/engines/number-system';
import type { ToolProps } from '../ToolRenderer';
import TextTransformTool from './TextTransformTool';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  NumberField,
  SelectField,
  TextField,
  btnSecondary,
  friendlyError,
} from '../ui';

const MAIN_BASES = [2, 8, 10, 16];
const BASE_OPTIONS = [
  { value: '0', label: 'Auto-detect (0x, 0b, 0o, else decimal)' },
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 32, 36].map((b) => ({
    value: String(b),
    label: `Base ${b} (${baseName(b)})`,
  })),
];

export default function NumberSystemTool({ config }: ToolProps) {
  const initFrom = String(config.init_from ?? '0');
  const initTo = Number(config.init_to ?? 0);
  const [input, setInput] = useState(
    initFrom === '2' ? '11111111' : initFrom === '16' ? 'FF' : '255',
  );
  const [from, setFrom] = useState(initFrom);
  const [custom, setCustom] = useState(
    initTo && !MAIN_BASES.includes(initTo) ? String(initTo) : '36',
  );
  const [upper, setUpper] = useState(true);
  const [group, setGroup] = useState(false);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseInBase(input, Number(from));
    } catch (e) {
      return { error: friendlyError(e) };
    }
  }, [input, from]);

  const customBase = Math.min(
    36,
    Math.max(2, Math.round(Number(custom) || 36)),
  );
  const outBases = [
    ...MAIN_BASES,
    ...(MAIN_BASES.includes(customBase) ? [] : [customBase]),
  ];
  const ok = parsed && 'value' in parsed ? parsed : null;
  const abs = ok ? (ok.value < ZERO ? -ok.value : ok.value) : ZERO;

  const swapTo = (b: number) => {
    if (!ok) return;
    setInput(formatInBase(ok.value, b, { upper }));
    setFrom(String(b));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1.4fr]">
        <TextField
          label="Number"
          value={input}
          onChange={setInput}
          placeholder="255, 0xFF, 0b1010, 777…"
          mono
        />
        <SelectField
          label="Input base"
          value={from}
          onChange={setFrom}
          options={BASE_OPTIONS}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox
          label="Uppercase letters"
          checked={upper}
          onChange={setUpper}
        />
        <Checkbox label="Group digits" checked={group} onChange={setGroup} />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setInput('')}
          disabled={!input}
        >
          Clear
        </button>
      </div>

      {parsed && 'error' in parsed && (
        <ErrorMessage>{parsed.error}</ErrorMessage>
      )}
      {!input.trim() && (
        <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          Type a number to see it in binary, octal, decimal, hexadecimal and any
          base up to 36.
        </p>
      )}

      {ok && (
        <>
          <ul className="space-y-2" aria-live="polite">
            {outBases.map((b) => {
              const v = formatInBase(ok.value, b, { upper, group });
              const isInput = b === ok.base;
              return (
                <li
                  key={b}
                  className={`flex flex-col gap-2 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center ${
                    b === initTo
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="w-40 shrink-0 text-sm">
                    <span className="font-semibold text-gray-900">
                      {baseName(b)[0].toUpperCase() + baseName(b).slice(1)}
                    </span>
                    <span className="text-gray-500"> · base {b}</span>
                    {isInput && (
                      <span className="ml-1 rounded bg-gray-100 px-1 text-[11px] text-gray-600">
                        input
                      </span>
                    )}
                  </div>
                  <code className="min-w-0 flex-1 break-all font-mono text-base text-gray-900">
                    {v}
                  </code>
                  <div className="flex gap-2">
                    <CopyButton text={v} className="!px-2 !py-1 text-xs" />
                    {!isInput && (
                      <button
                        type="button"
                        onClick={() => swapTo(b)}
                        className={`${btnSecondary} !px-2 !py-1 text-xs`}
                        aria-label={`Use base ${b} as the input base`}
                      >
                        ⇄ Swap
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="max-w-xs">
            <NumberField
              label="Custom output base (2–36)"
              value={custom}
              onChange={setCustom}
              min={2}
              max={36}
              step={1}
            />
          </div>

          <section
            aria-labelledby="ns-explain"
            className="space-y-3 rounded-2xl border border-gray-100 p-4"
          >
            <h2 id="ns-explain" className="text-sm font-semibold text-gray-900">
              How it works: place values in base {ok.base}
            </h2>
            <Decomposition value={abs} base={ok.base} />
            {ok.base !== 10 && <Decomposition value={abs} base={10} />}
            <p className="text-xs text-gray-500">
              {abs.toLocaleString('en-US')} needs {bitLength(ok.value)} bit
              {bitLength(ok.value) === 1 ? '' : 's'}
              {ok.value < ZERO ? ' (plus a sign)' : ''} ·{' '}
              {Math.ceil(bitLength(ok.value) / 8)} byte
              {Math.ceil(bitLength(ok.value) / 8) === 1 ? '' : 's'}
            </p>
          </section>
        </>
      )}

      <details className="rounded-2xl border border-gray-100 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
          Convert many numbers at once
        </summary>
        <div className="mt-4">
          <TextTransformTool
            config={{
              transform: 'number-base',
              ...(config.init_from ? { init_from: config.init_from } : {}),
              ...(config.init_to ? { init_to: config.init_to } : {}),
            }}
            toolName="Batch number base converter"
          />
        </div>
      </details>
    </div>
  );
}

function Decomposition({ value, base }: { value: bigint; base: number }) {
  const terms = decompose(value, base);
  const long = terms.length > 16;
  const shown = long ? terms.filter((t) => t.value !== 0) : terms;
  return (
    <div className="space-y-2">
      {!long && (
        <div className="flex flex-wrap gap-1" aria-hidden>
          {terms.map((t, i) => (
            <div
              key={i}
              className="flex min-w-[2.5rem] flex-col items-center rounded-lg border border-gray-100 bg-gray-50 px-1.5 py-1"
            >
              <span className="font-mono text-base font-semibold text-gray-900">
                {t.digit}
              </span>
              <span className="text-[10px] text-gray-500">
                {base}
                {superscript(t.power)}
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="break-all font-mono text-sm text-gray-800">
        {value.toString(10)} ={' '}
        {shown.length
          ? shown
              .map((t) => `${t.value}×${base}${superscript(t.power)}`)
              .join(' + ')
          : '0'}
      </p>
    </div>
  );
}
