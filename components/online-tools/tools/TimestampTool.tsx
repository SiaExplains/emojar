'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseAnyDate, relativeTime } from '@/lib/online-tools/engines/dates';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  ResultRow,
  TextField,
  btnSecondary,
} from '../ui';

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampTool({ config }: ToolProps) {
  const unixMode = config.mode === 'unix';
  const [now, setNow] = useState(() => Date.now());
  const [input, setInput] = useState(() =>
    unixMode ? String(Math.floor(Date.now() / 1000)) : new Date().toISOString(),
  );
  const [local, setLocal] = useState(() => toLocalInput(new Date()));

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const date = useMemo(() => parseAnyDate(input), [input]);
  const isMs = /^-?\d{12,}$/.test(input.trim());
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fromLocal = local ? new Date(local) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium text-brand-700">
            Current Unix time
          </p>
          <p
            className="font-mono text-2xl font-bold tabular-nums text-brand-900"
            aria-live="off"
          >
            {Math.floor(now / 1000)}
          </p>
        </div>
        <div className="flex gap-2">
          <CopyButton
            text={String(Math.floor(now / 1000))}
            label="Copy seconds"
          />
          <CopyButton text={String(now)} label="Copy ms" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-2">
          <TextField
            label={
              unixMode
                ? 'Unix timestamp (seconds or milliseconds)'
                : 'Date, time or timestamp'
            }
            value={input}
            onChange={setInput}
            mono
            className="min-w-[260px] flex-1"
            placeholder={
              unixMode
                ? '1767225600'
                : '2026-10-07T14:30:00Z, Wed, 07 Oct 2026 14:30:00 GMT, 1767225600…'
            }
          />
          <button
            type="button"
            className={btnSecondary}
            onClick={() =>
              setInput(
                unixMode
                  ? String(Math.floor(Date.now() / 1000))
                  : new Date().toISOString(),
              )
            }
          >
            Now
          </button>
        </div>
        {input.trim() && !date && (
          <ErrorMessage>
            This value could not be read as a date. Try ISO 8601
            (2026-10-07T14:30:00Z) or a Unix timestamp.
          </ErrorMessage>
        )}
        {date && (
          <div className="rounded-2xl border border-gray-100 px-4">
            {unixMode && /^-?\d+(\.\d+)?$/.test(input.trim()) && (
              <ResultRow
                label="Detected unit"
                value={isMs ? 'Milliseconds' : 'Seconds'}
              />
            )}
            <ResultRow
              label={`Local time (${tz})`}
              value={date.toLocaleString(undefined, {
                dateStyle: 'full',
                timeStyle: 'long',
              })}
            />
            <ResultRow label="UTC" value={date.toUTCString()} />
            <ResultRow label="ISO 8601" value={date.toISOString()} mono />
            <ResultRow
              label="Unix seconds"
              value={String(Math.floor(date.getTime() / 1000))}
              mono
            />
            <ResultRow
              label="Unix milliseconds"
              value={String(date.getTime())}
              mono
            />
            <ResultRow
              label="Relative"
              value={relativeTime(date, new Date(now))}
            />
          </div>
        )}
      </div>

      {unixMode && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Date → Unix timestamp
          </h3>
          <div className="space-y-1.5">
            <label
              htmlFor="ts-local"
              className="block text-sm font-medium text-gray-700"
            >
              Date and time ({tz})
            </label>
            <input
              id="ts-local"
              type="datetime-local"
              step={1}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          {fromLocal && !Number.isNaN(fromLocal.getTime()) && (
            <div className="rounded-2xl border border-gray-100 px-4">
              <ResultRow
                label="Unix seconds"
                value={String(Math.floor(fromLocal.getTime() / 1000))}
                mono
              />
              <ResultRow
                label="Unix milliseconds"
                value={String(fromLocal.getTime())}
                mono
              />
              <ResultRow
                label="ISO 8601 (UTC)"
                value={fromLocal.toISOString()}
                mono
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
