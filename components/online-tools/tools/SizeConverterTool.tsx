'use client';

import { useState } from 'react';
import {
  CLOTHING_TABLES,
  SHOE_TABLES,
  findRow,
  rowForMeasurement,
} from '@/lib/online-tools/engines/sizes';
import type { ToolProps } from '../ToolRenderer';
import { NumberField, SelectField } from '../ui';

export default function SizeConverterTool({ config }: ToolProps) {
  const shoes = config.kind === 'shoe';
  const tables = shoes ? SHOE_TABLES : CLOTHING_TABLES;
  const [tableId, setTableId] = useState(tables[0].id);
  const table = tables.find((t) => t.id === tableId) ?? tables[0];
  const sizeColumns = table.columns.filter(
    (c) => !['cm', 'in', 'mondo', 'bust', 'chest', 'waist'].includes(c.id),
  );
  const [system, setSystem] = useState('us');
  const [size, setSize] = useState('');
  const [measure, setMeasure] = useState('');
  const [measureUnit, setMeasureUnit] = useState<'cm' | 'in'>('cm');

  const col = sizeColumns.some((c) => c.id === system)
    ? system
    : sizeColumns[0].id;
  const choices = [...new Set(table.rows.map((r) => r[col]))];
  const sizeIndex = size ? findRow(table, col, size) : -1;
  const m = Number(measure);
  const measureCm = measureUnit === 'in' ? m * 2.54 : m;
  const measureIndex = measure ? rowForMeasurement(table, measureCm) : -1;
  const highlight = sizeIndex >= 0 ? sizeIndex : measureIndex;
  const row = highlight >= 0 ? table.rows[highlight] : null;
  const measureLabel = shoes
    ? 'Foot length (heel to longest toe)'
    : table.measureColumn === 'eu' && table.id === 'men-shirts'
      ? 'Neck measurement'
      : table.measureColumn === 'waist'
        ? 'Waist measurement'
        : table.measureColumn === 'chest'
          ? 'Chest measurement'
          : 'Bust measurement';

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={shoes ? 'Shoe type' : 'Clothing type'}
      >
        {tables.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === table.id}
            onClick={() => {
              setTableId(t.id);
              setSize('');
            }}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              t.id === table.id
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Size system"
            value={col}
            onChange={(v) => {
              setSystem(v);
              setSize('');
            }}
            options={sizeColumns.map((c) => ({ value: c.id, label: c.name }))}
          />
          <SelectField
            label="Your size"
            value={size}
            onChange={(v) => {
              setSize(v);
              setMeasure('');
            }}
            options={[
              { value: '', label: 'Choose…' },
              ...choices.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
        {table.measureColumn && (
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <NumberField
              label={`…or enter your ${measureLabel.toLowerCase()}`}
              value={measure}
              onChange={(v) => {
                setMeasure(v);
                setSize('');
              }}
              min={0}
              step="any"
            />
            <SelectField
              label="Unit"
              value={measureUnit}
              onChange={(v) => setMeasureUnit(v as 'cm' | 'in')}
              options={[
                { value: 'cm', label: 'cm' },
                { value: 'in', label: 'in' },
              ]}
            />
          </div>
        )}
      </div>

      {row ? (
        <div
          className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          aria-live="polite"
        >
          <p className="text-sm text-emerald-900">
            {sizeIndex >= 0
              ? `${table.columns.find((c) => c.id === col)?.name} ${size} is:`
              : `Your closest size (round up if between sizes):`}
          </p>
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {table.columns.map((c) => (
              <div key={c.id}>
                <dt className="text-xs text-emerald-800">{c.name}</dt>
                <dd className="text-xl font-semibold tabular-nums text-gray-900">
                  {row[c.id]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        measure &&
        measureIndex < 0 && (
          <p className="text-sm text-amber-700" aria-live="polite">
            That measurement is outside this chart — check the unit, or try
            another category.
          </p>
        )
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-center text-sm">
          <caption className="sr-only">{table.name} size chart</caption>
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              {table.columns.map((c) => (
                <th
                  key={c.id}
                  className="whitespace-nowrap px-3 py-2 font-medium"
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.rows.map((r, i) => (
              <tr
                key={i}
                className={i === highlight ? 'bg-emerald-50 font-semibold' : ''}
              >
                {table.columns.map((c) => (
                  <td
                    key={c.id}
                    className="px-3 py-1.5 tabular-nums text-gray-800"
                  >
                    {r[c.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        {table.note ? `${table.note} ` : ''}
        Sizes are standard conversions — brands cut differently, so check the
        brand’s own chart and measure yourself when you can.
        {shoes &&
          ' Measure your foot in the evening, standing, from heel to longest toe; if you are between sizes, go up.'}
      </p>
    </div>
  );
}
