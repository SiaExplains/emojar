'use client';

import { useMemo, useState } from 'react';
import {
  COOKING_UNITS,
  INGREDIENTS,
  OVEN_TEMPS,
  convertCooking,
  kitchenFraction,
} from '@/lib/online-tools/engines/cooking';
import { formatNumber } from '@/lib/online-tools/engines/units';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  NumberField,
  SelectField,
  btnSecondary,
} from '../ui';

const QUICK = ['cup', 'tbsp', 'tsp', 'ml', 'floz', 'g', 'oz'];

export default function CookingConverterTool({ config }: ToolProps) {
  const valid = (id: unknown, fb: string) =>
    typeof id === 'string' && COOKING_UNITS.some((u) => u.id === id) ? id : fb;
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState(() => valid(config.init_from, 'cup'));
  const [to, setTo] = useState(() => valid(config.init_to, 'g'));
  const [ingredient, setIngredient] = useState(() =>
    typeof config.init_ingredient === 'string'
      ? config.init_ingredient
      : 'ap-flour',
  );

  const n = Number(amount);
  const ok = amount.trim() !== '' && Number.isFinite(n) && n >= 0;
  const fromU = COOKING_UNITS.find((u) => u.id === from)!;
  const toU = COOKING_UNITS.find((u) => u.id === to)!;
  const crossKind = fromU.kind !== toU.kind;
  const result = ok ? convertCooking(n, from, to, ingredient) : NaN;
  const ing = INGREDIENTS.find((i) => i.id === ingredient);
  const frac =
    toU.kind === 'volume' && !/ml|^l$/.test(to) ? kitchenFraction(result) : '';

  const table = useMemo(
    () =>
      ok
        ? COOKING_UNITS.filter(
            (u) => QUICK.includes(u.id) && u.id !== from,
          ).map((u) => ({
            u,
            value: convertCooking(n, from, u.id, ingredient),
          }))
        : [],
    [ok, n, from, ingredient],
  );

  const unitOptions = [
    { group: 'Volume', kind: 'volume' },
    { group: 'Weight', kind: 'weight' },
  ].flatMap(({ group, kind }) =>
    COOKING_UNITS.filter((u) => u.kind === kind).map((u) => ({
      value: u.id,
      label: `${group}: ${u.name}`,
    })),
  );

  return (
    <div className="space-y-6">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1.5fr_auto_1.5fr]">
        <NumberField
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={0}
          step="any"
        />
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={unitOptions}
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
        <SelectField
          label="To"
          value={to}
          onChange={setTo}
          options={unitOptions}
        />
      </div>
      <SelectField
        label={
          crossKind
            ? 'Ingredient (needed to convert volume ↔ weight)'
            : 'Ingredient (only matters for cups ↔ grams)'
        }
        value={ingredient}
        onChange={setIngredient}
        options={INGREDIENTS.map((i) => ({
          value: i.id,
          label: `${i.name} — ${i.gramsPerCup} g per cup`,
        }))}
        className="max-w-md"
      />

      {!ok && amount.trim() !== '' && (
        <ErrorMessage>Enter an amount of 0 or more.</ErrorMessage>
      )}

      {ok && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          aria-live="polite"
        >
          <p className="text-lg text-emerald-950">
            {formatNumber(n)} {fromU.symbol}
            {crossKind && ing ? ` ${ing.name.toLowerCase()}` : ''} ={' '}
            <strong className="text-2xl tabular-nums">
              {formatNumber(Number(result.toPrecision(4)))}
            </strong>{' '}
            {toU.symbol}
            {frac && (
              <span className="ml-2 text-base text-emerald-800">
                ({frac} {toU.symbol})
              </span>
            )}
          </p>
          <CopyButton text={String(Number(result.toPrecision(4)))} />
        </div>
      )}

      {ok && table.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="mb-2 text-left text-sm font-semibold text-gray-900">
              {formatNumber(n)} {fromU.symbol} of {ing?.name.toLowerCase()} is
              also…
            </caption>
            <tbody>
              {table.map(({ u, value }) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <th
                    scope="row"
                    className="py-2 pr-4 text-left font-normal text-gray-600"
                  >
                    {u.name}
                  </th>
                  <td className="py-2 text-right font-mono tabular-nums text-gray-900">
                    {formatNumber(Number(value.toPrecision(4)))} {u.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-base font-semibold text-gray-900">
          Oven temperatures
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-center text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Gas mark</th>
                <th className="px-3 py-2 font-medium">°C</th>
                <th className="px-3 py-2 font-medium">°C fan</th>
                <th className="px-3 py-2 font-medium">°F</th>
                <th className="px-3 py-2 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {OVEN_TEMPS.map((t) => (
                <tr key={t.gas}>
                  <td className="px-3 py-1.5 font-semibold">{t.gas}</td>
                  <td className="px-3 py-1.5 tabular-nums">{t.c}</td>
                  <td className="px-3 py-1.5 tabular-nums">{t.fan}</td>
                  <td className="px-3 py-1.5 tabular-nums">{t.f}</td>
                  <td className="px-3 py-1.5 text-left text-gray-600">
                    {t.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Cup-to-gram conversions use typical weights for a level, spooned cup.
        Scooping flour straight from the bag packs it and can add 20 % or more,
        which is why bakers weigh ingredients. US cups are 236.6 ml; metric cups
        are 250 ml.
      </p>
    </div>
  );
}
