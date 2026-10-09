'use client';

// Shared, accessible building blocks for tool UIs. Kept deliberately small
// and styled like the rest of the site (rounded cards, gray + brand accent).

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { formatBytes } from '@/lib/online-tools/image/core';

import {
  btnPrimary,
  btnSecondary,
  inputBase,
  labelBase,
} from '@/components/ui/styles';

// Re-exported so existing tool imports keep working.
export { btnPrimary, btnSecondary, inputBase, labelBase };

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('error');
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!text}
      className={`${btnSecondary} ${className}`}
      aria-live="polite"
    >
      {state === 'copied'
        ? '✓ Copied'
        : state === 'error'
          ? 'Copy failed'
          : label}
    </button>
  );
}

/** Triggers a download for a Blob or text, releasing the object URL afterwards. */
export function downloadBlob(
  data: Blob | string,
  filename: string,
  type = 'text/plain;charset=utf-8',
) {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadButton({
  data,
  filename,
  type,
  label = 'Download',
  className = '',
}: {
  data: Blob | string | null | undefined;
  filename: string;
  type?: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={!data}
      onClick={() => data && downloadBlob(data, filename, type)}
      className={`${btnSecondary} ${className}`}
    >
      ⬇ {label}
    </button>
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {children}
    </div>
  );
}

export function Notice({
  children,
  tone = 'gray',
}: {
  children: ReactNode;
  tone?: 'gray' | 'amber' | 'green';
}) {
  const tones = {
    gray: 'border-gray-200 bg-gray-50 text-gray-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

/** Turns any thrown value into a message that is safe to show. */
export function friendlyError(
  e: unknown,
  fallback = 'Something went wrong. Please check your input and try again.',
): string {
  if (
    e &&
    typeof e === 'object' &&
    'name' in e &&
    (e as Error).name === 'ToolInputError'
  )
    return (e as Error).message;
  return fallback;
}

export function ToolInput({
  label,
  value,
  onChange,
  rows = 10,
  mono = true,
  actions,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  actions?: ReactNode;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'>) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
        className={`${inputBase} resize-y leading-relaxed ${mono ? 'font-mono text-[13px]' : ''}`}
        {...rest}
      />
    </div>
  );
}

export function ToolOutput({
  label,
  value,
  filename,
  mime,
  rows = 10,
  mono = true,
  status,
}: {
  label: string;
  value: string;
  filename?: string;
  mime?: string;
  rows?: number;
  mono?: boolean;
  status?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={value} />
          {filename && (
            <DownloadButton
              data={value || null}
              filename={filename}
              type={mime}
            />
          )}
        </div>
      </div>
      {status}
      <textarea
        id={id}
        value={value}
        readOnly
        rows={rows}
        spellCheck={false}
        className={`${inputBase} resize-y bg-gray-50 leading-relaxed ${mono ? 'font-mono text-[13px]' : ''}`}
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  className = '',
  help,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  suffix?: string;
  className?: string;
  help?: string;
}) {
  const id = useId();
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={inputBase}
          aria-describedby={help ? `${id}-help` : undefined}
        />
        {suffix && (
          <span className="shrink-0 text-sm text-gray-500">{suffix}</span>
        )}
      </div>
      {help && (
        <p id={`${id}-help`} className="text-xs text-gray-500">
          {help}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  mono = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  mono?: boolean;
  type?: string;
}) {
  const id = useId();
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`${inputBase} ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  display?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={labelBase}>
          {label}
        </label>
        <span className="text-sm tabular-nums text-gray-600">
          {display ?? value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
    </div>
  );
}

export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  label,
  hint,
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const id = useId();

  const handle = useCallback(
    (list: FileList | null) => {
      if (!list || !list.length) return;
      const files = Array.from(list);
      onFiles(multiple ? files : files.slice(0, 1));
    },
    [onFiles, multiple],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      className={`relative rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
        dragging
          ? 'border-brand-400 bg-brand-50'
          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = '';
        }}
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2"
      >
        <span aria-hidden className="text-3xl">
          📂
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {label ??
            (multiple
              ? 'Choose files or drop them here'
              : 'Choose a file or drop it here')}
        </span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
        <span className={`${btnSecondary} mt-1`}>Browse…</span>
      </label>
      <p className="mt-3 text-xs text-gray-400">🔒 Files stay on your device</p>
    </div>
  );
}

export function ConversionProgress({
  done,
  total,
  label = 'Processing',
}: {
  done: number;
  total: number;
  label?: string;
}) {
  if (total <= 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="space-y-1" role="status" aria-live="polite">
      <div className="flex justify-between text-xs text-gray-600">
        <span>
          {label} {done}/{total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Object URL for a Blob that is revoked automatically when it changes or unmounts. */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

export function FileSize({ bytes }: { bytes: number }) {
  return <span className="tabular-nums">{formatBytes(bytes)}</span>;
}

export function ResultRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`min-w-0 break-all text-sm font-medium text-gray-900 ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </span>
        <CopyButton text={value} className="!px-2 !py-1 text-xs" />
      </div>
    </div>
  );
}
