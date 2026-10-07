'use client';

import { useCallback, useEffect, useState } from 'react';
import { NIL_UUID, uuidV4, uuidV7 } from '@/lib/online-tools/engines/random';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  NumberField,
  SelectField,
  ToolOutput,
  btnPrimary,
} from '../ui';

export default function UuidGeneratorTool(_: ToolProps) {
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState('5');
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [output, setOutput] = useState('');

  const generate = useCallback(() => {
    const n = Math.max(1, Math.min(10_000, Math.floor(Number(count)) || 1));
    const base = Date.now();
    const list = Array.from({ length: n }, (_, i) =>
      version === 'v7'
        ? uuidV7(base + i)
        : version === 'nil'
          ? NIL_UUID
          : uuidV4(),
    ).map((u) => {
      let s = hyphens ? u : u.replace(/-/g, '');
      if (upper) s = s.toUpperCase();
      return braces ? `{${s}}` : s;
    });
    setOutput(list.join('\n'));
  }, [count, version, upper, hyphens, braces]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <SelectField
          label="Version"
          value={version}
          onChange={setVersion}
          options={[
            { value: 'v4', label: 'UUID v4 (random)' },
            { value: 'v7', label: 'UUID v7 (time-ordered)' },
            { value: 'nil', label: 'Nil UUID' },
          ]}
        />
        <NumberField
          label="How many"
          value={count}
          onChange={setCount}
          min={1}
          max={10000}
          className="w-32"
        />
        <button type="button" className={btnPrimary} onClick={generate}>
          Generate
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox label="Uppercase" checked={upper} onChange={setUpper} />
        <Checkbox label="Hyphens" checked={hyphens} onChange={setHyphens} />
        <Checkbox label="Braces { }" checked={braces} onChange={setBraces} />
      </div>
      <ToolOutput
        label="UUIDs"
        value={output}
        rows={Math.min(12, Math.max(4, output.split('\n').length))}
        filename="uuids.txt"
      />
    </div>
  );
}
