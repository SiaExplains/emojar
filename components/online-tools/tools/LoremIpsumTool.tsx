'use client';

import { useState } from 'react';
import { loremIpsum, type LoremUnit } from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  NumberField,
  SelectField,
  ToolOutput,
  btnPrimary,
} from '../ui';

export default function LoremIpsumTool(_: ToolProps) {
  const [count, setCount] = useState('3');
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [startWithLorem, setStart] = useState(true);
  // Tools render client-side only, so random initial text cannot mismatch SSR.
  const [{ text, generatedAs }, setResult] = useState(() => ({
    text: loremIpsum(3, 'paragraphs'),
    generatedAs: 'paragraphs' as LoremUnit,
  }));

  const generate = () =>
    setResult({
      text: loremIpsum(Number(count), unit, { startWithLorem }),
      generatedAs: unit,
    });

  const html =
    generatedAs === 'paragraphs'
      ? text
          .split('\n\n')
          .map((p) => `<p>${p}</p>`)
          .join('\n')
      : `<p>${text}</p>`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <NumberField
          label="Amount"
          value={count}
          onChange={setCount}
          min={1}
          max={500}
          className="w-32"
        />
        <SelectField
          label="Unit"
          value={unit}
          onChange={(v) => setUnit(v as LoremUnit)}
          options={[
            { value: 'paragraphs', label: 'Paragraphs' },
            { value: 'sentences', label: 'Sentences' },
            { value: 'words', label: 'Words' },
          ]}
        />
        <div className="pb-2">
          <Checkbox
            label="Start with “Lorem ipsum…”"
            checked={startWithLorem}
            onChange={setStart}
          />
        </div>
        <button type="button" className={btnPrimary} onClick={generate}>
          Generate
        </button>
      </div>
      <ToolOutput
        label="Placeholder text"
        value={text}
        rows={12}
        mono={false}
        filename="lorem-ipsum.txt"
      />
      <div>
        <CopyButton text={html} label="Copy as HTML" />
      </div>
    </div>
  );
}
