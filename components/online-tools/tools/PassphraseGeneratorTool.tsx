'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  generatePassphrase,
  passphraseEntropy,
} from '@/lib/online-tools/engines/random';
import { WORDLIST } from '@/lib/online-tools/engines/wordlist';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  RangeField,
  SelectField,
  btnPrimary,
} from '../ui';
import { StrengthMeter } from './PasswordGeneratorTool';

export default function PassphraseGeneratorTool(_: ToolProps) {
  const [words, setWords] = useState(6);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(false);
  const [addNumber, setAddNumber] = useState(false);
  const [phrase, setPhrase] = useState('');

  const generate = useCallback(
    () =>
      setPhrase(
        generatePassphrase({ words, separator, capitalize, addNumber }),
      ),
    [words, separator, capitalize, addNumber],
  );
  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <output
            className="min-w-0 flex-1 break-all font-mono text-lg text-gray-900"
            aria-live="polite"
          >
            {phrase}
          </output>
          <CopyButton text={phrase} />
          <button type="button" className={btnPrimary} onClick={generate}>
            ↻ New
          </button>
        </div>
        <StrengthMeter
          bits={passphraseEntropy({ words, separator, capitalize, addNumber })}
        />
      </div>
      <RangeField
        label="Number of words"
        value={words}
        onChange={setWords}
        min={3}
        max={12}
        display={`${words} words`}
      />
      <div className="flex flex-wrap items-end gap-4">
        <SelectField
          label="Separator"
          value={separator}
          onChange={setSeparator}
          options={[
            { value: '-', label: 'Hyphen (-)' },
            { value: ' ', label: 'Space' },
            { value: '.', label: 'Dot (.)' },
            { value: '_', label: 'Underscore (_)' },
            { value: '', label: 'None' },
          ]}
        />
        <div className="flex flex-wrap gap-4 pb-2">
          <Checkbox
            label="Capitalize words"
            checked={capitalize}
            onChange={setCapitalize}
          />
          <Checkbox
            label="Add a number"
            checked={addNumber}
            onChange={setAddNumber}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Words are drawn from a list of {WORDLIST.length.toLocaleString('en-US')}{' '}
        short, common English words.
      </p>
    </div>
  );
}
