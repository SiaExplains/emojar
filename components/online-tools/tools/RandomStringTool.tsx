'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CHARSETS,
  generateRandomString,
} from '@/lib/online-tools/engines/random';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  NumberField,
  TextField,
  ToolOutput,
  btnPrimary,
} from '../ui';

export default function RandomStringTool(_: ToolProps) {
  const [length, setLength] = useState('32');
  const [count, setCount] = useState('5');
  const [sets, setSets] = useState({
    upper: true,
    lower: true,
    digits: true,
    symbols: false,
  });
  const [hexOnly, setHexOnly] = useState(false);
  const [custom, setCustom] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const charset =
    custom ||
    (hexOnly
      ? CHARSETS.hex
      : (Object.keys(sets) as (keyof typeof sets)[])
          .filter((k) => sets[k])
          .map((k) => CHARSETS[k])
          .join(''));
  const unique = new Set(Array.from(charset)).size;

  const generate = useCallback(() => {
    if (!charset) {
      setOutput('');
      return setError(
        'Choose at least one character set or enter custom characters.',
      );
    }
    const n = Math.max(1, Math.min(1000, Math.floor(Number(count)) || 1));
    setOutput(
      Array.from({ length: n }, () =>
        generateRandomString(Number(length) || 1, charset),
      ).join('\n'),
    );
    setError('');
  }, [charset, count, length]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <NumberField
          label="Length"
          value={length}
          onChange={setLength}
          min={1}
          max={4096}
          className="w-32"
        />
        <NumberField
          label="How many"
          value={count}
          onChange={setCount}
          min={1}
          max={1000}
          className="w-32"
        />
        <button type="button" className={btnPrimary} onClick={generate}>
          Generate
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="A–Z"
          checked={sets.upper}
          onChange={(v) => setSets({ ...sets, upper: v })}
        />
        <Checkbox
          label="a–z"
          checked={sets.lower}
          onChange={(v) => setSets({ ...sets, lower: v })}
        />
        <Checkbox
          label="0–9"
          checked={sets.digits}
          onChange={(v) => setSets({ ...sets, digits: v })}
        />
        <Checkbox
          label="Symbols"
          checked={sets.symbols}
          onChange={(v) => setSets({ ...sets, symbols: v })}
        />
        <Checkbox
          label="Hex only (0–9a–f)"
          checked={hexOnly}
          onChange={setHexOnly}
        />
      </div>
      <TextField
        label="Custom characters (overrides the options above)"
        value={custom}
        onChange={setCustom}
        mono
        placeholder="e.g. ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
      />
      <ErrorMessage>{error}</ErrorMessage>
      <ToolOutput
        label="Random strings"
        value={output}
        rows={Math.min(12, Math.max(4, output.split('\n').length))}
        filename="random-strings.txt"
        status={
          unique > 1 ? (
            <p className="text-xs text-gray-500">
              {unique} possible characters · ~
              {Math.round((Number(length) || 1) * Math.log2(unique))} bits of
              entropy each
            </p>
          ) : undefined
        }
      />
    </div>
  );
}
