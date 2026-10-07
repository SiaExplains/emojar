'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatOffset, timeZoneOffset } from '@/lib/online-tools/engines/dates';
import type { ToolProps } from '../ToolRenderer';
import { allTimeZones, cityName, localTimeZone } from '../timezones';
import { SelectField, btnSecondary } from '../ui';

const STORAGE_KEY = 'emojar-world-clock';
const DEFAULT = [
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export default function WorldClockTool(_: ToolProps) {
  const zones = useMemo(() => allTimeZones(), []);
  const [now, setNow] = useState(() => new Date());
  const [cities, setCities] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved) && saved.every((s) => typeof s === 'string'))
        return saved;
    } catch {
      // Storage unavailable (private mode) — use defaults.
    }
    return DEFAULT;
  });
  const [adding, setAdding] = useState('Asia/Singapore');
  const here = localTimeZone();

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch {
      // Ignore storage errors; the selection simply won't persist.
    }
  }, [cities]);

  const all = [here, ...cities.filter((c) => c !== here)];

  return (
    <div className="space-y-5">
      <ul className="grid gap-2 sm:grid-cols-2">
        {all.map((tz) => {
          const hour = Number(
            now.toLocaleString('en-GB', {
              timeZone: tz,
              hour: '2-digit',
              hourCycle: 'h23',
            }),
          );
          const day = hour >= 6 && hour < 19;
          return (
            <li
              key={tz}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${tz === here ? 'border-indigo-100 bg-indigo-50' : 'border-gray-100'}`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  <span aria-hidden>{day ? '☀️' : '🌙'}</span> {cityName(tz)}
                  {tz === here && (
                    <span className="ml-1 text-xs font-normal text-indigo-700">
                      (your time)
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {now.toLocaleDateString('en-US', {
                    timeZone: tz,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  · {formatOffset(timeZoneOffset(now, tz))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <time className="font-mono text-xl font-semibold tabular-nums text-gray-900">
                  {now.toLocaleTimeString('en-GB', { timeZone: tz })}
                </time>
                {tz !== here && (
                  <button
                    type="button"
                    className={`${btnSecondary} !px-2 !py-1`}
                    aria-label={`Remove ${cityName(tz)}`}
                    onClick={() => setCities((c) => c.filter((x) => x !== tz))}
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-end gap-2">
        <SelectField
          label="Add a city or time zone"
          value={adding}
          onChange={setAdding}
          options={zones}
          className="min-w-[240px] flex-1"
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() =>
            setCities((c) => (c.includes(adding) ? c : [...c, adding]))
          }
        >
          + Add
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setCities(DEFAULT)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
