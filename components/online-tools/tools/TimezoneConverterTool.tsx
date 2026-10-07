'use client';

import { useMemo, useState } from 'react';
import {
  formatOffset,
  timeZoneOffset,
  zonedTimeToUtc,
} from '@/lib/online-tools/engines/dates';
import type { ToolProps } from '../ToolRenderer';
import { allTimeZones, cityName, localTimeZone } from '../timezones';
import {
  ErrorMessage,
  SelectField,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

function nowLocalInput() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TimezoneConverterTool(_: ToolProps) {
  const zones = useMemo(() => allTimeZones(), []);
  const [when, setWhen] = useState(nowLocalInput);
  const [from, setFrom] = useState(localTimeZone);
  const [targets, setTargets] = useState([
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ]);
  const [adding, setAdding] = useState('Asia/Kolkata');

  const instant = zonedTimeToUtc(when, from);
  const fromDay = instant
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: from,
        dateStyle: 'short',
      }).format(instant)
    : '';

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="tz-when" className={labelBase}>
            Date and time
          </label>
          <input
            id="tz-when"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className={inputBase}
          />
        </div>
        <SelectField
          label="In time zone"
          value={from}
          onChange={setFrom}
          options={zones}
        />
      </div>
      {!instant && (
        <ErrorMessage>Please enter a valid date and time.</ErrorMessage>
      )}
      {instant && (
        <ul
          className="divide-y divide-gray-100 rounded-2xl border border-gray-100"
          aria-live="polite"
        >
          {targets.map((tz) => {
            const day = new Intl.DateTimeFormat('en-CA', {
              timeZone: tz,
              dateStyle: 'short',
            }).format(instant);
            const shift =
              day > fromDay ? '+1 day' : day < fromDay ? '−1 day' : '';
            return (
              <li
                key={tz}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {cityName(tz)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tz} · {formatOffset(timeZoneOffset(instant, tz))}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-right">
                    <span className="text-lg font-semibold tabular-nums text-gray-900">
                      {instant.toLocaleTimeString('en-GB', {
                        timeZone: tz,
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {instant.toLocaleDateString('en-US', {
                        timeZone: tz,
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {shift && (
                        <span className="ml-1 font-medium text-amber-700">
                          {shift}
                        </span>
                      )}
                    </span>
                  </p>
                  <button
                    type="button"
                    className={`${btnSecondary} !px-2 !py-1`}
                    aria-label={`Remove ${cityName(tz)}`}
                    onClick={() => setTargets((t) => t.filter((x) => x !== tz))}
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex flex-wrap items-end gap-2">
        <SelectField
          label="Add a time zone"
          value={adding}
          onChange={setAdding}
          options={zones}
          className="min-w-[240px] flex-1"
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() =>
            setTargets((t) => (t.includes(adding) ? t : [...t, adding]))
          }
        >
          + Add
        </button>
      </div>
    </div>
  );
}
