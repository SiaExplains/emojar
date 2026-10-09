'use client';

import { useMemo, useState } from 'react';
import { describeCron, nextCronRuns } from '@/lib/online-tools/engines/cron';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  TextField,
  friendlyError,
} from '../ui';

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Weekdays at 9:00', expr: '0 9 * * 1-5' },
  { label: 'Every Sunday at 3:30', expr: '30 3 * * 0' },
  { label: 'First day of the month', expr: '0 0 1 * *' },
  { label: 'Every quarter', expr: '0 0 1 1,4,7,10 *' },
];

const FIELDS = [
  { label: 'Minute', hint: '0–59' },
  { label: 'Hour', hint: '0–23' },
  { label: 'Day of month', hint: '1–31' },
  { label: 'Month', hint: '1–12 or JAN–DEC' },
  { label: 'Day of week', hint: '0–6 (Sun–Sat) or SUN–SAT' },
];

export default function CronGeneratorTool(_: ToolProps) {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const [utc, setUtc] = useState(false);
  const parts = expr.trim().split(/\s+/);

  const info = useMemo(() => {
    try {
      return {
        description: describeCron(expr),
        runs: nextCronRuns(expr, 5, new Date(), utc),
        error: '',
      };
    } catch (e) {
      return { description: '', runs: [], error: friendlyError(e) };
    }
  }, [expr, utc]);

  const setPart = (i: number, v: string) => {
    const next = parts.length === 5 ? [...parts] : ['*', '*', '*', '*', '*'];
    next[i] = v.trim() || '*';
    setExpr(next.join(' '));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-2">
        <TextField
          label="Cron expression"
          value={expr}
          onChange={setExpr}
          mono
          className="min-w-[240px] flex-1"
        />
        <CopyButton text={expr} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {FIELDS.map((f, i) => (
          <div key={f.label} className="space-y-1">
            <label
              htmlFor={`cron-${i}`}
              className="block text-xs font-medium text-gray-600"
            >
              {f.label}
            </label>
            <input
              id={`cron-${i}`}
              value={parts.length === 5 ? parts[i] : ''}
              onChange={(e) => setPart(i, e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-center font-mono text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              aria-describedby={`cron-${i}-hint`}
            />
            <p id={`cron-${i}-hint`} className="text-xs text-gray-400">
              {f.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            type="button"
            onClick={() => setExpr(p.expr)}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      <ErrorMessage>{info.error}</ErrorMessage>
      {info.description && (
        <Notice tone="green">
          <span className="font-medium">“{info.description}”</span>
        </Notice>
      )}
      {info.runs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Next 5 runs</h3>
            <label className="inline-flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={utc}
                onChange={(e) => setUtc(e.target.checked)}
              />{' '}
              Show in UTC
            </label>
          </div>
          <ol className="space-y-1 font-mono text-sm text-gray-700">
            {info.runs.map((d) => (
              <li key={d.getTime()}>
                {utc
                  ? d.toUTCString()
                  : d.toLocaleString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
