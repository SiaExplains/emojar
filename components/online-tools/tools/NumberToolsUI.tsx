'use client';

// Number to words + Roman numeral converter.

import { useMemo, useState } from 'react';
import {
  fromRoman,
  numberToWords,
  toRoman,
  type WordsMode,
} from '@/lib/online-tools/engines/number-words';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  SelectField,
  TextField,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

function caseOf(s: string, style: string) {
  if (style === 'upper') return s.toUpperCase();
  if (style === 'sentence') return s.charAt(0).toUpperCase() + s.slice(1);
  if (style === 'title') return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
  return s;
}

export function NumberToWordsTool(_: ToolProps) {
  const [input, setInput] = useState('1250.50');
  const [mode, setMode] = useState<WordsMode>('cardinal');
  const [british, setBritish] = useState(false);
  const [style, setStyle] = useState('sentence');
  const [currency, setCurrency] = useState('dollars');
  const [subunit, setSubunit] = useState('cents');

  const out = useMemo(() => {
    if (!input.trim()) return { text: '', error: '' };
    try {
      return {
        text: caseOf(
          numberToWords(input, { mode, and: british, currency, subunit }),
          mode === 'cheque' ? 'none' : style,
        ),
        error: '',
      };
    } catch (e) {
      return { text: '', error: friendlyError(e) };
    }
  }, [input, mode, british, style, currency, subunit]);

  return (
    <div className="space-y-5">
      <TextField
        label="Number"
        value={input}
        onChange={setInput}
        placeholder="e.g. 1,234,567.89"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectField
          label="Write as"
          value={mode}
          onChange={(v) => setMode(v as WordsMode)}
          options={[
            { value: 'cardinal', label: 'Words (one hundred five)' },
            { value: 'ordinal', label: 'Ordinal (one hundred fifth)' },
            { value: 'cheque', label: 'Cheque / check amount' },
          ]}
        />
        {mode !== 'cheque' && (
          <SelectField
            label="Capitalisation"
            value={style}
            onChange={setStyle}
            options={[
              { value: 'sentence', label: 'Sentence case' },
              { value: 'none', label: 'lowercase' },
              { value: 'title', label: 'Title Case' },
              { value: 'upper', label: 'UPPERCASE' },
            ]}
          />
        )}
        {mode === 'cheque' && (
          <>
            <TextField
              label="Currency (plural)"
              value={currency}
              onChange={setCurrency}
            />
            <TextField
              label="Sub-unit (plural)"
              value={subunit}
              onChange={setSubunit}
            />
          </>
        )}
      </div>
      <Checkbox
        label="British style (“one hundred and five”)"
        checked={british}
        onChange={setBritish}
      />
      <ErrorMessage>{out.error}</ErrorMessage>
      {out.text && (
        <div
          className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
          aria-live="polite"
        >
          <p className="text-lg leading-relaxed text-emerald-950">{out.text}</p>
          <CopyButton text={out.text} />
        </div>
      )}
    </div>
  );
}

export function RomanNumeralTool(_: ToolProps) {
  const [input, setInput] = useState('2026');
  const [date, setDate] = useState('');

  const out = useMemo(() => {
    const s = input.trim();
    if (!s) return null;
    try {
      if (/^\d[\d,\s]*$/.test(s)) {
        const n = Number(s.replace(/[,\s]/g, ''));
        return {
          kind: 'roman' as const,
          value: toRoman(n),
          from: n.toLocaleString('en-US'),
        };
      }
      return {
        kind: 'number' as const,
        value: fromRoman(s).toLocaleString('en-US'),
        from: s.toUpperCase(),
      };
    } catch (e) {
      return { kind: 'error' as const, value: friendlyError(e) };
    }
  }, [input]);

  const dateRoman = useMemo(() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!m) return null;
    const [d, mo, y] = [Number(m[3]), Number(m[2]), Number(m[1])];
    try {
      return {
        dmy: `${toRoman(d)}.${toRoman(mo)}.${toRoman(y)}`,
        mdy: `${toRoman(mo)}.${toRoman(d)}.${toRoman(y)}`,
      };
    } catch {
      return null;
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <TextField
        label="Number (1–3999) or Roman numeral"
        value={input}
        onChange={setInput}
        placeholder="2026 or MMXXVI"
        mono
      />
      {out?.kind === 'error' && <ErrorMessage>{out.value}</ErrorMessage>}
      {out && out.kind !== 'error' && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          aria-live="polite"
        >
          <p className="text-emerald-950">
            <span className="text-sm text-emerald-800">{out.from} =</span>
            <br />
            <span className="font-serif text-3xl font-semibold tracking-wide">
              {out.value}
            </span>
          </p>
          <CopyButton text={out.value} />
        </div>
      )}
      <div className="space-y-3">
        <label htmlFor="roman-date" className={labelBase}>
          Date in Roman numerals (for tattoos, invitations, engravings)
        </label>
        <input
          id="roman-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`${inputBase} max-w-xs`}
        />
        {dateRoman && (
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ['Day.Month.Year', dateRoman.dmy],
              ['Month.Day.Year (US)', dateRoman.mdy],
            ].map(([label, v]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-serif text-lg">{v}</p>
                </div>
                <CopyButton text={v} className="!px-2 !py-1 text-xs" />
              </div>
            ))}
          </div>
        )}
      </div>
      <section aria-labelledby="roman-ref" className="space-y-3">
        <h2 id="roman-ref" className="text-sm font-semibold text-gray-900">
          Roman numeral reference
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: 'Symbols',
              rows: [
                ['I', 1],
                ['V', 5],
                ['X', 10],
                ['L', 50],
                ['C', 100],
                ['D', 500],
                ['M', 1000],
              ],
            },
            {
              title: 'Subtractive pairs',
              rows: [
                ['IV', 4],
                ['IX', 9],
                ['XL', 40],
                ['XC', 90],
                ['CD', 400],
                ['CM', 900],
              ],
            },
            {
              title: 'Common numbers',
              rows: [12, 14, 19, 24, 49, 99, 100, 500, 1999, 2000, 2026].map(
                (n) => [toRoman(n), n] as [string, number],
              ),
            },
          ].map((t) => (
            <table
              key={t.title}
              className="w-full rounded-2xl border border-gray-100 text-left text-sm"
            >
              <caption className="px-3 pt-2 text-left text-xs font-medium text-gray-500">
                {t.title}
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Roman numeral</th>
                </tr>
              </thead>
              <tbody>
                {t.rows.map(([r, n]) => (
                  <tr key={String(r)} className="border-t border-gray-50">
                    <td className="px-3 py-1 tabular-nums text-gray-600">
                      {Number(n).toLocaleString('en-US')}
                    </td>
                    <td className="px-3 py-1 text-right">
                      <button
                        type="button"
                        onClick={() => setInput(String(r))}
                        aria-label={`Convert ${r}`}
                        className="rounded-md px-1.5 font-serif text-base font-semibold text-gray-900 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        {r}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Rules: write the largest values first and add them up (XVI = 10 + 5 +
          1). A smaller symbol before a larger one is subtracted, but only I, X
          and C, and only before the next two symbols up (IV, IX, XL, XC, CD,
          CM). I, X, C and M repeat at most three times in a row, so IIII and VV
          are invalid.
        </p>
      </section>
    </div>
  );
}

export default NumberToWordsTool;
