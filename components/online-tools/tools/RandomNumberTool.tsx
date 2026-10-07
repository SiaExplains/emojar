'use client';

import { useState } from 'react';
import { generateRandomNumbers } from '@/lib/online-tools/engines/random';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  NumberField,
  btnPrimary,
} from '../ui';

export default function RandomNumberTool(_: ToolProps) {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [decimals, setDecimals] = useState('0');
  const [unique, setUnique] = useState(true);
  const [sort, setSort] = useState(false);
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    const lo = Number(min);
    const hi = Number(max);
    if (!Number.isFinite(lo) || !Number.isFinite(hi))
      return setError('Please enter a valid minimum and maximum.');
    try {
      const nums = generateRandomNumbers({
        min: lo,
        max: hi,
        count: Number(count) || 1,
        unique,
        decimals: Number(decimals) || 0,
      });
      setResult(sort ? [...nums].sort((a, b) => a - b) : nums);
      setError('');
    } catch (e) {
      setResult([]);
      setError(e instanceof Error ? e.message : 'Could not generate numbers.');
    }
  };

  const text = result.join(result.length > 20 ? '\n' : ', ');

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <NumberField label="Minimum" value={min} onChange={setMin} step="any" />
        <NumberField label="Maximum" value={max} onChange={setMax} step="any" />
        <NumberField
          label="How many"
          value={count}
          onChange={setCount}
          min={1}
          max={10000}
        />
        <NumberField
          label="Decimal places"
          value={decimals}
          onChange={setDecimals}
          min={0}
          max={10}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox label="No repeats" checked={unique} onChange={setUnique} />
        <Checkbox label="Sort results" checked={sort} onChange={setSort} />
        <button type="button" className={btnPrimary} onClick={generate}>
          🎲 Generate
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {result.length > 0 && (
        <div className="space-y-2" aria-live="polite">
          {result.length === 1 ? (
            <p className="text-center text-5xl font-bold tabular-nums text-gray-900">
              {result[0]}
            </p>
          ) : (
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-sm">
              {text}
            </pre>
          )}
          <div className="flex justify-center">
            <CopyButton text={text} />
          </div>
        </div>
      )}
    </div>
  );
}
