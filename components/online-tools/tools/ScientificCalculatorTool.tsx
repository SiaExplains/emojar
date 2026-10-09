'use client';

import { useEffect, useRef, useState } from 'react';
import {
  evaluate,
  formatResult,
  type AngleMode,
} from '@/lib/online-tools/engines/expression';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, friendlyError } from '../ui';

type Key = {
  label: string;
  insert?: string;
  action?: 'clear' | 'back' | 'equals' | 'ans';
  kind?: 'fn' | 'op' | 'num' | 'eq';
};

const KEYS: Key[][] = [
  [
    { label: 'sin', insert: 'sin(', kind: 'fn' },
    { label: 'cos', insert: 'cos(', kind: 'fn' },
    { label: 'tan', insert: 'tan(', kind: 'fn' },
    { label: '(', insert: '(', kind: 'op' },
    { label: ')', insert: ')', kind: 'op' },
    { label: 'AC', action: 'clear', kind: 'op' },
  ],
  [
    { label: 'sin⁻¹', insert: 'asin(', kind: 'fn' },
    { label: 'cos⁻¹', insert: 'acos(', kind: 'fn' },
    { label: 'tan⁻¹', insert: 'atan(', kind: 'fn' },
    { label: 'xʸ', insert: '^', kind: 'op' },
    { label: 'x²', insert: '^2', kind: 'op' },
    { label: '⌫', action: 'back', kind: 'op' },
  ],
  [
    { label: 'ln', insert: 'ln(', kind: 'fn' },
    { label: 'log', insert: 'log(', kind: 'fn' },
    { label: '√', insert: 'sqrt(', kind: 'fn' },
    { label: '7', insert: '7', kind: 'num' },
    { label: '8', insert: '8', kind: 'num' },
    { label: '9', insert: '9', kind: 'num' },
  ],
  [
    { label: 'π', insert: 'π', kind: 'fn' },
    { label: 'e', insert: 'e', kind: 'fn' },
    { label: 'n!', insert: '!', kind: 'fn' },
    { label: '4', insert: '4', kind: 'num' },
    { label: '5', insert: '5', kind: 'num' },
    { label: '6', insert: '6', kind: 'num' },
  ],
  [
    { label: '%', insert: '%', kind: 'fn' },
    { label: 'Ans', action: 'ans', kind: 'fn' },
    { label: '÷', insert: '÷', kind: 'op' },
    { label: '1', insert: '1', kind: 'num' },
    { label: '2', insert: '2', kind: 'num' },
    { label: '3', insert: '3', kind: 'num' },
  ],
  [
    { label: '×', insert: '×', kind: 'op' },
    { label: '−', insert: '-', kind: 'op' },
    { label: '+', insert: '+', kind: 'op' },
    { label: '0', insert: '0', kind: 'num' },
    { label: '.', insert: '.', kind: 'num' },
    { label: '=', action: 'equals', kind: 'eq' },
  ],
];

const STYLE: Record<string, string> = {
  fn: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  op: 'bg-brand-50 text-brand-900 hover:bg-brand-100',
  num: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50',
  eq: 'bg-gray-900 text-white hover:bg-gray-700',
};

export default function ScientificCalculatorTool(_: ToolProps) {
  const [expr, setExpr] = useState('');
  const [mode, setMode] = useState<AngleMode>('deg');
  const [ans, setAns] = useState(0);
  const [result, setResult] = useState('0');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<{ expr: string; result: string }[]>(
    [],
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Live preview of the result while typing.
  useEffect(() => {
    if (!expr.trim()) return setError('');
    try {
      setResult(formatResult(evaluate(expr, mode, ans)));
      setError('');
    } catch {
      // Incomplete expressions are normal while typing; show errors on “=”.
    }
  }, [expr, mode, ans]);

  const equals = () => {
    if (!expr.trim()) return;
    try {
      const v = evaluate(expr, mode, ans);
      const r = formatResult(v);
      setResult(r);
      setAns(v);
      setHistory((h) => [{ expr, result: r }, ...h].slice(0, 20));
      setExpr('');
      setError('');
    } catch (e) {
      setError(friendlyError(e, 'That expression could not be calculated.'));
    }
  };

  const press = (k: Key) => {
    if (k.action === 'clear') {
      setExpr('');
      setResult('0');
      setError('');
    } else if (k.action === 'back') setExpr((x) => x.slice(0, -1));
    else if (k.action === 'equals') equals();
    else if (k.action === 'ans') setExpr((x) => x + 'ans');
    else if (k.insert) setExpr((x) => x + k.insert);
    inputRef.current?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <div className="mx-auto w-full max-w-md space-y-3">
        <div className="rounded-2xl bg-gray-900 p-4 text-right text-white">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div
              role="radiogroup"
              aria-label="Angle unit"
              className="inline-flex gap-1"
            >
              {(['deg', 'rad'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className={`rounded px-2 py-0.5 uppercase ${mode === m ? 'bg-white/20 text-white' : 'hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <span>Ans = {formatResult(ans)}</span>
          </div>
          <label htmlFor="sci-expr" className="sr-only">
            Expression
          </label>
          <input
            id="sci-expr"
            ref={inputRef}
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                equals();
              } else if (e.key === 'Escape') setExpr('');
            }}
            placeholder="e.g. sin(30) + 2^10"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            className="mt-2 w-full bg-transparent text-right font-mono text-lg text-gray-200 placeholder:text-gray-500 focus:outline-none"
          />
          <output
            className="mt-1 block break-all font-mono text-3xl font-semibold tabular-nums"
            aria-live="polite"
          >
            {result}
          </output>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="grid grid-cols-6 gap-1.5">
          {KEYS.flat().map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={() => press(k)}
              className={`h-11 rounded-xl text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${STYLE[k.kind ?? 'num']}`}
              aria-label={
                k.label === '⌫'
                  ? 'Backspace'
                  : k.label === 'AC'
                    ? 'All clear'
                    : undefined
              }
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <CopyButton text={result} label="Copy result" />
        </div>
      </div>
      <aside aria-label="History" className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">History</h3>
        {history.length === 0 ? (
          <p className="text-xs text-gray-500">
            Results appear here. Click one to reuse it.
          </p>
        ) : (
          <ol className="space-y-1">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setExpr((x) => x + h.result)}
                  className="w-full rounded-lg px-2 py-1 text-right font-mono text-xs hover:bg-gray-50"
                >
                  <span className="block text-gray-500">{h.expr}</span>
                  <span className="block text-sm text-gray-900">
                    = {h.result}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}
