'use client';

import { useMemo, useState } from 'react';
import {
  BRAILLE_DIGITS,
  BRAILLE_LETTERS,
  BRAILLE_PUNCTUATION,
  CAPITAL,
  LETTER_SIGN,
  NUMBER,
  brailleToText,
  dotsOf,
  isBraille,
  textToBraille,
} from '@/lib/online-tools/engines/braille';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  Notice,
  SelectField,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Direction = 'auto' | 'encode' | 'decode';

/** A braille cell drawn as six dots, so the pattern is readable even without a braille font. */
function Cell({ cell, size = 'md' }: { cell: string; size?: 'sm' | 'md' }) {
  const dots = dotsOf(cell);
  const d = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';
  return (
    <span className="inline-grid grid-cols-2 gap-0.5" aria-hidden>
      {[1, 4, 2, 5, 3, 6].map((n) => (
        <span
          key={n}
          className={`${d} rounded-full ${dots.includes(n) ? 'bg-gray-900' : 'border border-gray-300'}`}
        />
      ))}
    </span>
  );
}

const SPECIAL: [string, string][] = [
  [CAPITAL, 'Capital sign (next letter is a capital)'],
  [NUMBER, 'Number sign (a–j become 1–0)'],
  [LETTER_SIGN, 'Letter sign (back to letters after a number)'],
];

export default function BrailleTool(_: ToolProps) {
  const [input, setInput] = useState('Hello, World! 2026');
  const [direction, setDirection] = useState<Direction>('auto');
  const decode =
    direction === 'decode' || (direction === 'auto' && isBraille(input));
  const result = useMemo(
    () =>
      decode
        ? { output: brailleToText(input), unsupported: [] as string[] }
        : textToBraille(input),
    [input, decode],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="braille-in" className={labelBase}>
            Input ({decode ? 'braille' : 'text'})
          </label>
          <textarea
            id="braille-in"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type text, or paste braille like ⠓⠑⠇⠇⠕"
            className={`${inputBase} ${decode ? 'text-2xl leading-relaxed' : ''}`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="braille-out" className={labelBase}>
            Output ({decode ? 'text' : 'braille'})
          </label>
          <textarea
            id="braille-out"
            rows={6}
            readOnly
            value={result.output}
            className={`${inputBase} bg-gray-50 ${decode ? '' : 'text-2xl leading-relaxed'}`}
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
            { value: 'encode', label: 'Text → Braille' },
            { value: 'decode', label: 'Braille → Text' },
          ]}
        />
        <button
          type="button"
          className={btnSecondary}
          disabled={!result.output}
          onClick={() => {
            setInput(result.output);
            setDirection(decode ? 'encode' : 'decode');
          }}
        >
          ⇄ Swap
        </button>
        <CopyButton text={result.output} label="Copy output" />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setInput('')}
          disabled={!input}
        >
          Clear
        </button>
      </div>
      {result.unsupported.length > 0 && (
        <p className="text-xs text-amber-800">
          Kept as-is (not in the Grade 1 table): {result.unsupported.join(' ')}
        </p>
      )}
      <Notice tone="amber">
        This converts to uncontracted (Grade 1) English braille using Unicode
        braille patterns. It is a learning and reference aid — it does not
        replace formal braille transcription, which usually uses contracted
        Unified English Braille (UEB) and careful formatting.
      </Notice>

      <section aria-labelledby="braille-ref" className="space-y-3">
        <h2 id="braille-ref" className="text-sm font-semibold text-gray-900">
          Braille alphabet
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5">
          {Object.entries(BRAILLE_LETTERS).map(([ch, cell]) => (
            <RefItem
              key={ch}
              label={ch}
              cell={cell}
              onPick={() => setInput((v) => (decode ? cell : v + ch))}
            />
          ))}
        </ul>
        <h3 className="pt-2 text-sm font-semibold text-gray-900">Numbers</h3>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5">
          {Object.entries(BRAILLE_DIGITS).map(([ch, cell]) => (
            <RefItem key={ch} label={ch} cell={cell} prefix={NUMBER} />
          ))}
        </ul>
        <h3 className="pt-2 text-sm font-semibold text-gray-900">
          Punctuation
        </h3>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5">
          {Object.entries(BRAILLE_PUNCTUATION).map(([ch, cell]) => (
            <RefItem key={ch} label={ch} cell={cell} />
          ))}
          <RefItem label="“" cell="⠦" />
          <RefItem label="”" cell="⠴" />
        </ul>
        <h3 className="pt-2 text-sm font-semibold text-gray-900">Signs</h3>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          {SPECIAL.map(([cell, label]) => (
            <li
              key={cell}
              className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700"
            >
              <Cell cell={cell} />
              <span className="text-xl">{cell}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RefItem({
  label,
  cell,
  prefix = '',
  onPick,
}: {
  label: string;
  cell: string;
  prefix?: string;
  onPick?: () => void;
}) {
  const content = (
    <>
      <span className="font-semibold text-gray-900">{label}</span>
      <span className="flex items-center gap-1">
        {[...(prefix + cell)].map((c, i) => (
          <Cell key={i} cell={c} size="sm" />
        ))}
      </span>
    </>
  );
  const cls =
    'flex w-full items-center justify-between gap-2 rounded-lg border border-gray-100 px-2.5 py-2';
  return (
    <li>
      {onPick ? (
        <button
          type="button"
          onClick={onPick}
          aria-label={`${label}: braille ${prefix + cell}, dots ${dotsOf(cell).join('-')}`}
          className={`${cls} hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
        >
          {content}
        </button>
      ) : (
        <div className={cls} aria-label={`${label}: braille ${prefix + cell}`}>
          {content}
        </div>
      )}
    </li>
  );
}
