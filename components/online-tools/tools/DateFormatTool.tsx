'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  SelectField,
  ToolInput,
  btnSecondary,
} from '../ui';
import {
  FORMATS,
  MONTHS,
  convertLines,
  formatDate,
  parseDate,
  weekday,
  type DateFormatId,
} from '@/lib/online-tools/engines/date-format';

const INPUTS = [
  { value: 'auto', label: 'Detect (asks when ambiguous)' },
  ...FORMATS.filter((f) => f.input).map((f) => ({
    value: f.id,
    label: `${f.label} — ${f.example}`,
  })),
];
const OUTPUTS = FORMATS.map((f) => ({
  value: f.id,
  label: `${f.label} — ${f.example}`,
}));

export default function DateFormatTool(_: ToolProps) {
  const [input, setInput] = useState('14/10/2026');
  const [from, setFrom] = useState<DateFormatId | 'auto'>('auto');
  const [to, setTo] = useState<DateFormatId>('iso');
  const deferred = useDeferredValue(input);
  const lines = deferred.split(/\r?\n/).filter((l) => l.trim());
  const single = lines.length <= 1;
  const one = single && lines[0] ? parseDate(lines[0], from) : null;
  const many = useMemo(
    () => (single ? [] : convertLines(deferred, from, to)),
    [single, deferred, from, to],
  );
  const output = single
    ? one?.ok
      ? formatDate(one.value, to)
      : ''
    : many
        .map((l) => (l.error ? `# ${l.input.trim()}: ${l.error}` : l.output))
        .join('\n');
  const failed = many.filter((l) => l.error).length;

  return (
    <div className="space-y-5">
      <ToolInput
        label="Date (or one date per line)"
        value={input}
        onChange={setInput}
        rows={single ? 2 : 8}
        actions={
          input ? (
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput('')}
            >
              Clear
            </button>
          ) : undefined
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Input format"
          value={from}
          onChange={(v) => setFrom(v as DateFormatId | 'auto')}
          options={INPUTS}
        />
        <SelectField
          label="Output format"
          value={to}
          onChange={(v) => setTo(v as DateFormatId)}
          options={OUTPUTS}
        />
      </div>

      {single && one && !one.ok && (
        <>
          <ErrorMessage>{one.error}</ErrorMessage>
          {one.candidates && (
            <div className="flex flex-wrap gap-2">
              {one.candidates.map((c) => (
                <button
                  key={c.format}
                  type="button"
                  className={btnSecondary}
                  onClick={() => setFrom(c.format)}
                >
                  Read as{' '}
                  {FORMATS.find((f) => f.id === c.format)!.label.split(' (')[0]}
                  : {c.value.d} {MONTHS[c.value.m - 1]} {c.value.y}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {single && one?.ok && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="font-mono text-2xl font-semibold text-gray-900">
              {output}
            </p>
            <CopyButton text={output} />
          </div>
          <p className="text-sm text-gray-600">
            Read as {weekday(one.value)}, {one.value.d}{' '}
            {MONTHS[one.value.m - 1]} {one.value.y}
            {from === 'auto' &&
              ` (${FORMATS.find((f) => f.id === one.format)!.label.split(' (')[0]})`}
            .
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-100 bg-white">
                {FORMATS.map((f) => {
                  const v = formatDate(one.value, f.id);
                  return (
                    <tr key={f.id}>
                      <th className="px-3 py-1.5 font-normal text-gray-500">
                        {f.label}
                      </th>
                      <td className="px-3 py-1.5 font-mono text-[13px] text-gray-900">
                        {v}
                      </td>
                      <td className="px-2 py-1 text-right">
                        <CopyButton text={v} className="!px-2 !py-1 text-xs" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!single && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-700">
              {many.filter((l) => l.output).length} converted
              {failed ? `, ${failed} couldn’t be read (marked with #)` : ''}
            </p>
            <CopyButton text={output} label="Copy all" />
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            aria-label="Converted dates"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-[13px]"
          />
          {failed > 0 && from === 'auto' && (
            <Notice tone="amber">
              Some lines are ambiguous or unreadable. Choose the input format to
              convert them all the same way.
            </Notice>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Only calendar dates are converted — no times or time zones, so a date
        never moves by a day. Two-digit years (DD/MM/YY) are read as 2000–2049
        or 1950–1999 and only when you pick that format.
      </p>
    </div>
  );
}
