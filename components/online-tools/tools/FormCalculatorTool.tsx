'use client';

import { useId, useMemo, useState } from 'react';
import {
  CALCULATORS,
  initialValues,
  type CalcField,
} from '@/lib/online-tools/engines/calculators';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  NumberField,
  SelectField,
  inputBase,
  labelBase,
} from '../ui';

function Field({
  field,
  value,
  onChange,
}: {
  field: CalcField;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  if (field.type === 'select')
    return (
      <SelectField
        label={field.label}
        value={value}
        onChange={onChange}
        options={field.choices ?? []}
      />
    );
  if (field.type === 'number')
    return (
      <NumberField
        label={field.label}
        value={value}
        onChange={onChange}
        min={field.min}
        step={field.step ?? 'any'}
        suffix={field.suffix}
        help={field.help}
      />
    );
  if (field.type === 'textarea')
    return (
      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor={id} className={labelBase}>
          {field.label}
        </label>
        <textarea
          id={id}
          rows={4}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        />
      </div>
    );
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelBase}>
        {field.label}
      </label>
      <input
        id={id}
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </div>
  );
}

export default function FormCalculatorTool({ config }: ToolProps) {
  const def = CALCULATORS[String(config.calculator)];
  const [values, setValues] = useState<Record<string, string>>(() =>
    def ? initialValues(def) : {},
  );
  const out = useMemo(() => (def ? def.compute(values) : null), [def, values]);

  if (!def || !out)
    return <ErrorMessage>This calculator is not available.</ErrorMessage>;

  const visible = def.fields.filter(
    (f) => !f.showIf || f.showIf.values.includes(values[f.showIf.field]),
  );
  const primary = out.ok ? out.results.find((r) => r.primary) : undefined;

  return (
    <div className="space-y-5">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {visible.map((f) => (
          <Field
            key={f.id}
            field={f}
            value={values[f.id] ?? ''}
            onChange={(v) => setValues((cur) => ({ ...cur, [f.id]: v }))}
          />
        ))}
      </form>

      <div aria-live="polite">
        {!out.ok ? (
          <ErrorMessage>{out.error}</ErrorMessage>
        ) : (
          <div className="space-y-3">
            {primary && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
                <div>
                  <p className="text-sm text-emerald-800">{primary.label}</p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-950 sm:text-3xl">
                    {primary.value}
                  </p>
                </div>
                <CopyButton text={primary.value} />
              </div>
            )}
            <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-100 px-4">
              {out.results
                .filter((r) => !r.primary)
                .map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between sm:gap-4"
                  >
                    <dt className="text-sm text-gray-500">{r.label}</dt>
                    <dd className="text-sm font-medium tabular-nums text-gray-900 sm:text-right">
                      {r.value}
                    </dd>
                  </div>
                ))}
            </dl>
            {out.note && (
              <p className="text-xs leading-relaxed text-gray-500">
                {out.note}
              </p>
            )}
            {out.table && (
              <details className="rounded-2xl border border-gray-100">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">
                  {out.table.caption}
                </summary>
                <div className="max-h-96 overflow-auto px-4 pb-4">
                  <table className="w-full text-right text-xs tabular-nums">
                    <thead className="sticky top-0 bg-white text-gray-500">
                      <tr>
                        {out.table.columns.map((c) => (
                          <th
                            key={c}
                            scope="col"
                            className="py-2 pl-3 font-medium first:pl-0 first:text-left"
                          >
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {out.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-gray-50">
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className="py-1.5 pl-3 first:pl-0 first:text-left"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
