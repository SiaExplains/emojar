'use client';

import { useMemo, useState } from 'react';
import {
  monthGrid,
  monthName,
  weekdayNames,
} from '@/lib/online-tools/engines/timecard';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  SelectField,
  TextField,
  btnPrimary,
  downloadBlob,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

// Latin-script languages only: the PDF uses the built-in Helvetica font.
const LOCALES = [
  ['en-US', 'English (US)'],
  ['en-GB', 'English (UK)'],
  ['de-DE', 'Deutsch'],
  ['fr-FR', 'Français'],
  ['es-ES', 'Español'],
  ['it-IT', 'Italiano'],
  ['pt-PT', 'Português'],
  ['nl-NL', 'Nederlands'],
  ['sv-SE', 'Svenska'],
  ['da-DK', 'Dansk'],
  ['nb-NO', 'Norsk'],
  ['fi-FI', 'Suomi'],
] as const;

export default function CalendarMakerTool(_: ToolProps) {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth()));
  const [yearLayout, setYearLayout] = useState<'pages' | 'single'>('single');
  const [weekStart, setWeekStart] = useState<0 | 1>(1);
  const [locale, setLocale] = useState('en-US');
  const [paper, setPaper] = useState<'a4' | 'letter'>('a4');
  const [landscape, setLandscape] = useState(true);
  const [weekNumbers, setWeekNumbers] = useState(false);
  const [notes, setNotes] = useState(true);
  const [accent, setAccent] = useState('#4f46e5');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const y = Math.min(
    2200,
    Math.max(1900, Math.floor(Number(year)) || now.getFullYear()),
  );
  const previewMonth = month === 'year' ? now.getMonth() : Number(month);
  const grid = useMemo(
    () => monthGrid(y, previewMonth, weekStart),
    [y, previewMonth, weekStart],
  );
  const days = useMemo(
    () => weekdayNames(locale, weekStart),
    [locale, weekStart],
  );

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const { calendarPdf } = await import('@/lib/online-tools/pdf/documents');
      const bytes = await calendarPdf({
        year: y,
        month: month === 'year' ? 'year' : Number(month),
        yearLayout,
        weekStart,
        locale,
        paper,
        landscape,
        weekNumbers,
        notes,
        accent,
        title: title.trim() || undefined,
      });
      const name =
        month === 'year'
          ? `calendar-${y}.pdf`
          : `calendar-${y}-${String(Number(month) + 1).padStart(2, '0')}.pdf`;
      downloadBlob(
        new Blob([bytes as BlobPart], { type: 'application/pdf' }),
        name,
      );
    } catch (e) {
      setError(friendlyError(e, 'The calendar could not be created.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TextField label="Year" value={year} onChange={setYear} type="number" />
        <SelectField
          label="Month"
          value={month}
          onChange={setMonth}
          options={[
            { value: 'year', label: 'Whole year' },
            ...Array.from({ length: 12 }, (_, m) => ({
              value: String(m),
              label: monthName('en-US', m),
            })),
          ]}
        />
        {month === 'year' && (
          <SelectField
            label="Year layout"
            value={yearLayout}
            onChange={(v) => setYearLayout(v as 'pages' | 'single')}
            options={[
              { value: 'single', label: 'All 12 months on one page' },
              { value: 'pages', label: 'One month per page (12 pages)' },
            ]}
          />
        )}
        <SelectField
          label="Week starts on"
          value={String(weekStart)}
          onChange={(v) => setWeekStart(Number(v) as 0 | 1)}
          options={[
            { value: '1', label: 'Monday' },
            { value: '0', label: 'Sunday' },
          ]}
        />
        <SelectField
          label="Language"
          value={locale}
          onChange={setLocale}
          options={LOCALES.map(([v, l]) => ({ value: v, label: l }))}
        />
        <SelectField
          label="Paper"
          value={paper}
          onChange={(v) => setPaper(v as 'a4' | 'letter')}
          options={[
            { value: 'a4', label: 'A4' },
            { value: 'letter', label: 'US Letter' },
          ]}
        />
        <SelectField
          label="Orientation"
          value={landscape ? 'landscape' : 'portrait'}
          onChange={(v) => setLandscape(v === 'landscape')}
          options={[
            { value: 'landscape', label: 'Landscape' },
            { value: 'portrait', label: 'Portrait' },
          ]}
        />
        <div className="space-y-1.5">
          <label htmlFor="cal-accent" className={labelBase}>
            Accent colour
          </label>
          <input
            id="cal-accent"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className={`${inputBase} h-[38px] p-1`}
          />
        </div>
        {month === 'year' && yearLayout === 'single' && (
          <TextField
            label="Title (optional)"
            value={title}
            onChange={setTitle}
            placeholder={String(y)}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="Week numbers (ISO)"
          checked={weekNumbers}
          onChange={setWeekNumbers}
        />
        <Checkbox
          label="Notes lines (monthly pages)"
          checked={notes}
          onChange={setNotes}
        />
      </div>

      <figure className="rounded-2xl border border-gray-100 p-4">
        <figcaption
          className="mb-2 text-lg font-semibold"
          style={{ color: accent }}
        >
          {monthName(locale, previewMonth).replace(/^\w/, (c) =>
            c.toUpperCase(),
          )}{' '}
          {y}
          <span className="ml-2 text-xs font-normal text-gray-400">
            preview
          </span>
        </figcaption>
        <table className="w-full table-fixed text-center text-sm">
          <thead>
            <tr>
              {days.map((d) => (
                <th
                  key={d}
                  className="pb-1 text-xs font-semibold text-gray-500"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {row.map((d, c) => {
                  const weekend =
                    (c + weekStart) % 7 === 0 || (c + weekStart) % 7 === 6;
                  return (
                    <td
                      key={c}
                      className="h-10 border border-gray-100 align-top text-xs"
                      style={{ color: weekend ? accent : undefined }}
                    >
                      <span className="block p-1 text-left font-semibold">
                        {d ?? ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <ErrorMessage>{error}</ErrorMessage>
      <button
        type="button"
        className={btnPrimary}
        onClick={() => void download()}
        disabled={busy}
      >
        {busy ? 'Creating PDF…' : 'Download PDF'}
      </button>
      <p className="text-xs text-gray-500">
        Print at 100 % (“Actual size”) for correct margins. Month and weekday
        names are available in Latin-script languages because the PDF uses a
        standard built-in font.
      </p>
    </div>
  );
}
