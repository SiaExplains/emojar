'use client';

import { useMemo, useState } from 'react';
import { findAndReplace } from '@/lib/online-tools/engines/text';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  TextField,
  ToolInput,
  ToolOutput,
} from '../ui';

export default function FindReplaceTool(_: ToolProps) {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        ...findAndReplace(text, find, replace, {
          caseSensitive,
          wholeWord,
          useRegex,
        }),
        error: '',
      };
    } catch {
      return {
        output: '',
        count: 0,
        error:
          'The regular expression is not valid. Check brackets, parentheses and escape characters.',
      };
    }
  }, [text, find, replace, caseSensitive, wholeWord, useRegex]);

  return (
    <div className="space-y-4">
      <ToolInput
        label="Text"
        value={text}
        onChange={setText}
        rows={8}
        mono={false}
        placeholder="Paste the text to search in…"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Find"
          value={find}
          onChange={setFind}
          mono
          placeholder={useRegex ? 'e.g. (\\d{4})-(\\d{2})' : 'Text to find'}
        />
        <TextField
          label="Replace with"
          value={replace}
          onChange={setReplace}
          mono
          placeholder={useRegex ? 'e.g. $2/$1' : 'Replacement (can be empty)'}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="Case sensitive"
          checked={caseSensitive}
          onChange={setCaseSensitive}
        />
        <Checkbox
          label="Whole words only"
          checked={wholeWord}
          onChange={setWholeWord}
        />
        <Checkbox
          label="Regular expression"
          checked={useRegex}
          onChange={setUseRegex}
        />
      </div>
      <ErrorMessage>{result.error}</ErrorMessage>
      <ToolOutput
        label="Result"
        value={find ? result.output : text}
        rows={8}
        mono={false}
        filename="replaced.txt"
        status={
          find ? (
            <p className="text-xs text-gray-500" aria-live="polite">
              {result.count} replacement{result.count === 1 ? '' : 's'} made
            </p>
          ) : undefined
        }
      />
    </div>
  );
}
