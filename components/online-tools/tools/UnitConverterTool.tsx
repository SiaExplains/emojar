'use client';

import { useState } from 'react';
import {
  QUANTITIES,
  convertUnit,
  formatNumber,
} from '@/lib/online-tools/engines/units';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  NumberField,
  SelectField,
  btnSecondary,
} from '../ui';

export default function UnitConverterTool({ config }: ToolProps) {
  const q = QUANTITIES[String(config.quantity)];
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(q?.defaultFrom ?? '');
  const [to, setTo] = useState(q?.defaultTo ?? '');

  if (!q) return <ErrorMessage>This converter is not available.</ErrorMessage>;

  const n = Number(value);
  const valid = value.trim() !== '' && Number.isFinite(n);
  const result = valid ? convertUnit(n, q.id, from, to) : NaN;
  const options = q.units.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.symbol})`,
  }));
  const sym = (id: string) => q.units.find((u) => u.id === id)?.symbol ?? '';

  return (
    <div className="space-y-5">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto_1fr]">
        <NumberField
          label="Value"
          value={value}
          onChange={setValue}
          step="any"
        />
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={options}
        />
        <button
          type="button"
          className={`${btnSecondary} h-[38px]`}
          aria-label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄
        </button>
        <SelectField label="To" value={to} onChange={setTo} options={options} />
      </div>

      {!valid && value.trim() !== '' && (
        <ErrorMessage>Please enter a valid number.</ErrorMessage>
      )}

      {valid && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          aria-live="polite"
        >
          <p className="text-lg text-emerald-950">
            {formatNumber(n)} {sym(from)} ={' '}
            <strong className="text-2xl tabular-nums">
              {formatNumber(result)}
            </strong>{' '}
            {sym(to)}
          </p>
          <CopyButton text={formatNumber(result).replace(/,/g, '')} />
        </div>
      )}

      {valid && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="mb-2 text-left text-sm font-semibold text-gray-900">
              {formatNumber(n)} {sym(from)} in every unit
            </caption>
            <tbody>
              {q.units.map((u) => (
                <tr
                  key={u.id}
                  className={`border-t border-gray-100 ${u.id === to ? 'bg-gray-50' : ''}`}
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 text-left font-normal text-gray-600"
                  >
                    {u.name}
                  </th>
                  <td className="py-2 text-right font-mono tabular-nums text-gray-900">
                    {formatNumber(convertUnit(n, q.id, from, u.id))} {u.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
