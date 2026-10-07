'use client';

import { useMemo, useState } from 'react';
import {
  formatDecimalHours,
  formatHM,
  timeCard,
  workedMinutes,
  type TimeEntry,
} from '@/lib/online-tools/engines/timecard';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  NumberField,
  btnSecondary,
  downloadBlob,
  inputBase,
} from '../ui';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const csvCell = (v: string) =>
  /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
const blank = (): TimeEntry => ({ start: '', end: '', breakMin: '' });
const SAMPLE: TimeEntry[] = [
  { start: '9:00', end: '17:30', breakMin: '30' },
  { start: '8:45', end: '17:15', breakMin: '30' },
  { start: '9:00', end: '18:30', breakMin: '45' },
  { start: '9:15', end: '17:00', breakMin: '30' },
  { start: '9:00', end: '16:00', breakMin: '30' },
  blank(),
  blank(),
];

export default function TimeCardTool(_: ToolProps) {
  const [rows, setRows] = useState<TimeEntry[]>(() => DAYS.map(blank));
  const [rate, setRate] = useState('');
  const [weekly, setWeekly] = useState('40');
  const [daily, setDaily] = useState('');
  const [mult, setMult] = useState('1.5');

  const r = useMemo(
    () =>
      timeCard(rows, {
        rate: Number(rate) || 0,
        weeklyThresholdH: Number(weekly) || 0,
        dailyThresholdH: Number(daily) || 0,
        overtimeMultiplier: Number(mult) || 1,
      }),
    [rows, rate, weekly, daily, mult],
  );
  const set = (i: number, patch: Partial<TimeEntry>) =>
    setRows((rs) => rs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const money = (n: number) =>
    n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const csv = [
    'Day,Start,End,Break (min),Hours,Decimal hours',
    ...rows.map((e, i) => {
      const m = r.days[i];
      return `${DAYS[i]},${csvCell(e.start)},${csvCell(e.end)},${csvCell(e.breakMin)},${m === null ? 'invalid' : formatHM(m)},${m === null ? '' : formatDecimalHours(m)}`;
    }),
    `Total,,,,${formatHM(r.totalMin)},${formatDecimalHours(r.totalMin)}`,
  ].join('\n');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setRows(SAMPLE)}
        >
          Load sample week
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setRows(DAYS.map(blank))}
        >
          Clear
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">Hours worked per day</caption>
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Day</th>
              <th className="px-3 py-2 text-left font-medium">Start</th>
              <th className="px-3 py-2 text-left font-medium">End</th>
              <th className="px-3 py-2 text-left font-medium">Break (min)</th>
              <th className="px-3 py-2 text-right font-medium">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((e, i) => {
              const m = workedMinutes(e);
              const filled = e.start.trim() || e.end.trim();
              return (
                <tr key={DAYS[i]}>
                  <th
                    scope="row"
                    className="px-3 py-1.5 text-left font-medium text-gray-800"
                  >
                    {DAYS[i]}
                  </th>
                  {(['start', 'end'] as const).map((k) => (
                    <td key={k} className="px-2 py-1.5">
                      <input
                        aria-label={`${DAYS[i]} ${k}`}
                        value={e[k]}
                        onChange={(ev) => set(i, { [k]: ev.target.value })}
                        placeholder={k === 'start' ? '9:00' : '17:30'}
                        className={`${inputBase} w-28 ${filled && m === null ? 'border-rose-300' : ''}`}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    <input
                      aria-label={`${DAYS[i]} break minutes`}
                      inputMode="numeric"
                      value={e.breakMin}
                      onChange={(ev) => set(i, { breakMin: ev.target.value })}
                      placeholder="30"
                      className={`${inputBase} w-20`}
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums">
                    {!filled ? (
                      '—'
                    ) : m === null ? (
                      <span className="text-rose-600">check times</span>
                    ) : (
                      `${formatHM(m)} (${formatDecimalHours(m)})`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <NumberField
          label="Hourly rate (optional)"
          value={rate}
          onChange={setRate}
          min={0}
          step="any"
        />
        <NumberField
          label="Overtime after (hours/week)"
          value={weekly}
          onChange={setWeekly}
          min={0}
          step="any"
        />
        <NumberField
          label="…or after (hours/day)"
          value={daily}
          onChange={setDaily}
          min={0}
          step="any"
        />
        <NumberField
          label="Overtime multiplier"
          value={mult}
          onChange={setMult}
          min={1}
          step="any"
        />
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
        {[
          [
            'Total hours',
            `${formatHM(r.totalMin)} (${formatDecimalHours(r.totalMin)} h)`,
          ],
          ['Regular hours', formatDecimalHours(r.regularMin)],
          ['Overtime hours', formatDecimalHours(r.overtimeMin)],
          ['Gross pay', Number(rate) ? money(r.pay) : '—'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-100 p-3">
            <dt className="text-xs text-gray-500">{k}</dt>
            <dd className="text-lg font-semibold tabular-nums text-gray-900">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={csv} label="Copy as CSV" />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => downloadBlob(csv, 'time-card.csv', 'text/csv')}
        >
          Download CSV
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Times can be 24-hour (17:30) or 12-hour (5:30 pm). An end time earlier
        than the start counts as an overnight shift. Pay is before tax; local
        overtime rules vary.
      </p>
    </div>
  );
}
