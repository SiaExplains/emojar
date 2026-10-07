'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  entropyBits,
  generatePassword,
  passwordCharset,
  strengthLabel,
} from '@/lib/online-tools/engines/random';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  NumberField,
  RangeField,
  btnPrimary,
} from '../ui';

const BAR = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-400',
  'bg-emerald-500',
  'bg-emerald-600',
];

export function StrengthMeter({ bits }: { bits: number }) {
  const s = strengthLabel(bits);
  return (
    <div className="space-y-1">
      <div className="flex gap-1" aria-hidden>
        {BAR.map((c, i) => (
          <div
            key={c}
            className={`h-1.5 flex-1 rounded-full ${i <= s.level ? BAR[s.level] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Strength: <strong>{s.label}</strong> · ~{Math.round(bits)} bits of
        entropy
      </p>
    </div>
  );
}

export default function PasswordGeneratorTool(_: ToolProps) {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExclude] = useState(false);
  const [count, setCount] = useState('1');
  const [passwords, setPasswords] = useState<string[]>([]);
  const [error, setError] = useState('');

  const opts = { length, upper, lower, digits, symbols, excludeAmbiguous };
  const pool = passwordCharset(opts).join('').length;

  const generate = useCallback(() => {
    try {
      const n = Math.max(1, Math.min(50, Math.floor(Number(count)) || 1));
      setPasswords(
        Array.from({ length: n }, () =>
          generatePassword({
            length,
            upper,
            lower,
            digits,
            symbols,
            excludeAmbiguous,
          }),
        ),
      );
      setError('');
    } catch {
      setPasswords([]);
      setError('Choose at least one character type.');
    }
  }, [count, length, upper, lower, digits, symbols, excludeAmbiguous]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-5">
      {passwords[0] && (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <output
              className="min-w-0 flex-1 break-all font-mono text-lg text-gray-900"
              aria-live="polite"
            >
              {passwords[0]}
            </output>
            <CopyButton text={passwords[0]} />
            <button type="button" className={btnPrimary} onClick={generate}>
              ↻ New
            </button>
          </div>
          <StrengthMeter bits={entropyBits(pool, length)} />
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>

      <RangeField
        label="Length"
        value={length}
        onChange={setLength}
        min={6}
        max={128}
        display={`${length} characters`}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Checkbox label="Uppercase (A–Z)" checked={upper} onChange={setUpper} />
        <Checkbox label="Lowercase (a–z)" checked={lower} onChange={setLower} />
        <Checkbox label="Numbers (0–9)" checked={digits} onChange={setDigits} />
        <Checkbox
          label="Symbols (!@#$…)"
          checked={symbols}
          onChange={setSymbols}
        />
        <Checkbox
          label="Exclude look-alikes (I, l, 1, O, 0)"
          checked={excludeAmbiguous}
          onChange={setExclude}
        />
      </div>
      <NumberField
        label="How many passwords"
        value={count}
        onChange={setCount}
        min={1}
        max={50}
        className="w-40"
      />

      {passwords.length > 1 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              All passwords
            </span>
            <CopyButton text={passwords.join('\n')} label="Copy all" />
          </div>
          <pre className="max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white p-3 font-mono text-sm">
            {passwords.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}
