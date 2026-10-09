'use client';

import { useEffect, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, TextField, inputBase, labelBase } from '../ui';

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultTarget() {
  const d = new Date();
  return new Date(d.getFullYear() + 1, 0, 1, 0, 0);
}

export default function CountdownTool(_: ToolProps) {
  // The event lives in the URL (?title=…&to=ISO) so a link reproduces it without a server.
  const [title, setTitle] = useState(
    () =>
      new URLSearchParams(window.location.search).get('title') ?? 'New Year',
  );
  const [target, setTarget] = useState(() => {
    const to = new URLSearchParams(window.location.search).get('to');
    const d = to ? new Date(to) : null;
    return toLocalInput(d && !Number.isNaN(d.getTime()) ? d : defaultTarget());
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const targetDate = new Date(target);
  const valid = !Number.isNaN(targetDate.getTime());
  const diff = valid ? targetDate.getTime() - now : 0;
  const abs = Math.abs(diff);
  const units = [
    { label: 'Days', value: Math.floor(abs / 86_400_000) },
    { label: 'Hours', value: Math.floor(abs / 3_600_000) % 24 },
    { label: 'Minutes', value: Math.floor(abs / 60_000) % 60 },
    { label: 'Seconds', value: Math.floor(abs / 1000) % 60 },
  ];

  const shareUrl = valid
    ? `${window.location.origin}${window.location.pathname}?${new URLSearchParams({ title, to: targetDate.toISOString() }).toString()}`
    : '';

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Event name"
          value={title}
          onChange={setTitle}
          placeholder="My launch"
        />
        <div className="space-y-1.5">
          <label htmlFor="cd-target" className={labelBase}>
            Date and time
          </label>
          <input
            id="cd-target"
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={inputBase}
          />
        </div>
      </div>

      {valid && (
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 px-4 py-8 text-center text-white">
          <p className="text-sm font-medium text-brand-100">
            {diff >= 0
              ? `Countdown to ${title || 'your event'}`
              : `${title || 'The event'} started`}
          </p>
          <div
            className="mt-4 grid grid-cols-4 gap-2 sm:gap-4"
            role="timer"
            aria-live="off"
          >
            {units.map((u) => (
              <div key={u.label}>
                <p className="text-3xl font-bold tabular-nums sm:text-5xl">
                  {String(u.value).padStart(2, '0')}
                </p>
                <p className="text-xs uppercase tracking-wide text-brand-100">
                  {u.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-brand-100">
            {diff >= 0 ? '' : 'ago · '}
            {targetDate.toLocaleString(undefined, {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </p>
        </div>
      )}

      {shareUrl && (
        <div className="space-y-1.5">
          <span className={labelBase}>Share link</span>
          <div className="flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 break-all rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs">
              {shareUrl}
            </code>
            <CopyButton text={shareUrl} label="Copy link" />
          </div>
        </div>
      )}
    </div>
  );
}
