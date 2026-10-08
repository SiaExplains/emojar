'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import { molarMass } from '@/lib/online-tools/engines/chemistry';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  TextField,
  btnSecondary,
  friendlyError,
} from '../ui';

const EXAMPLES = [
  'H2O',
  'CO2',
  'NaCl',
  'H2SO4',
  'CaCO3',
  'C6H12O6',
  'Ca(OH)2',
  'CuSO4·5H2O',
  'K4[Fe(CN)6]',
];

const fmt = (n: number, d = 3) =>
  n.toLocaleString('en-US', {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });

export default function MolarMassTool(_: ToolProps) {
  const [formula, setFormula] = useState('C6H12O6');
  const [grams, setGrams] = useState('');
  const f = useDeferredValue(formula);

  const result = useMemo(() => {
    if (!f.trim()) return null;
    try {
      return { ok: molarMass(f) };
    } catch (e) {
      return {
        error: friendlyError(e, 'Invalid or incomplete chemical formula.'),
      };
    }
  }, [f]);
  const r = result && 'ok' in result ? result.ok : null;
  const g = Number(grams);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <TextField
          label="Chemical formula"
          value={formula}
          onChange={setFormula}
          placeholder="e.g. H2O, Ca(OH)2, CuSO4·5H2O"
          mono
        />
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Example formulas"
        >
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setFormula(ex)}
              className="rounded-full border border-gray-200 px-2.5 py-1 font-mono text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {ex}
            </button>
          ))}
          <button
            type="button"
            className={`${btnSecondary} !px-2.5 !py-1 text-xs`}
            onClick={() => setFormula('')}
            disabled={!formula}
          >
            Clear
          </button>
        </div>
      </div>

      {!formula.trim() && (
        <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          Type a formula. Element symbols are case-sensitive: Co is cobalt, CO
          is carbon monoxide.
        </p>
      )}
      {result && 'error' in result && (
        <ErrorMessage>{result.error}</ErrorMessage>
      )}

      {r && (
        <>
          {r.warning && <Notice tone="amber">{r.warning}</Notice>}
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
            aria-live="polite"
          >
            <p className="text-emerald-950">
              <span className="text-sm text-emerald-800">
                Molar mass of <span className="font-semibold">{r.pretty}</span>
              </span>
              <br />
              <span className="text-3xl font-semibold tabular-nums">
                {fmt(r.molarMass)} g/mol
              </span>
            </p>
            <CopyButton text={r.molarMass.toFixed(3)} label="Copy value" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">
                Element breakdown of {r.formula}
              </caption>
              <thead className="text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="py-2">
                    Element
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Count
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Atomic mass
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Mass contribution
                  </th>
                  <th scope="col" className="py-2 pl-4">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((row) => (
                  <tr key={row.symbol} className="border-t border-gray-100">
                    <th scope="row" className="py-2 font-medium text-gray-900">
                      {row.symbol}{' '}
                      <span className="font-normal text-gray-500">
                        {row.name}
                      </span>
                    </th>
                    <td className="py-2 text-right tabular-nums">
                      {row.count}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {fmt(row.atomicMass)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {fmt(row.mass)} g/mol
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-24 overflow-hidden rounded-full bg-gray-100"
                          aria-hidden
                        >
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="tabular-nums">
                          {row.percent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 rounded-2xl border border-gray-100 p-4 sm:grid-cols-[1fr_2fr] sm:items-end">
            <TextField
              label="Grams → moles"
              value={grams}
              onChange={setGrams}
              placeholder="e.g. 100"
              type="number"
            />
            <p className="text-sm text-gray-700" aria-live="polite">
              {grams && Number.isFinite(g) && g > 0
                ? `${fmt(g, 2)} g of ${r.pretty} = ${(g / r.molarMass).toPrecision(4)} mol (${((g / r.molarMass) * 6.02214076e23).toExponential(3)} formula units)`
                : 'Enter a mass in grams to get the amount of substance.'}
            </p>
          </div>
          {r.notes.map((n) => (
            <p key={n} className="text-xs text-gray-500">
              {n}
            </p>
          ))}
        </>
      )}
      <p className="text-xs text-gray-500">
        Uses IUPAC standard atomic weights. Look up any element in the{' '}
        <Link
          className="text-indigo-600 underline underline-offset-2"
          href="/online-tool/reference-tools/periodic-table"
        >
          interactive periodic table
        </Link>
        .
      </p>
    </div>
  );
}
