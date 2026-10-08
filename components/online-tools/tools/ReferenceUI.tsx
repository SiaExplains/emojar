'use client';

// Small building blocks shared by the reference tools (periodic table,
// countries, flags, Unicode, entities, ASCII, math symbols, shortcuts).

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { inputBase, labelBase } from '../ui';

export function SearchBox({
  label,
  value,
  onChange,
  placeholder,
  count,
  noun = 'result',
  plural,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  count?: number;
  noun?: string;
  plural?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className={`${inputBase} pr-9`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-1.5 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            ✕
          </button>
        )}
      </div>
      {count !== undefined && (
        <p className="text-xs text-gray-500" aria-live="polite">
          {count.toLocaleString('en-US')}{' '}
          {count === 1 ? noun : (plural ?? `${noun}s`)}
        </p>
      )}
    </div>
  );
}

export function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-3 py-1 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            value === o.value
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A labelled value with a compact copy button, e.g. “ISO code  DE  [Copy]”. */
export function CopyChip({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  if (!value) return null;
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div
          className={`truncate text-sm text-gray-900 ${mono ? 'font-mono' : ''}`}
          title={value}
        >
          {value}
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1500);
          } catch {
            // Clipboard blocked; the value is still selectable.
          }
        }}
        aria-label={`Copy ${label}: ${value}`}
        className="shrink-0 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <span aria-live="polite">{copied ? '✓ Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
}

/** Copies text and reports it in a polite live region (“Copied ∑”). */
export function useCopyFlash() {
  const [flash, setFlash] = useState('');
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => void (timer.current && window.clearTimeout(timer.current)),
    [],
  );
  const copy = async (text: string, label = text) => {
    let msg = `Copied! ${label}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      msg = 'Copy failed — select the text and copy it manually.';
    }
    setFlash(msg);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(''), 1600);
  };
  const region = (
    <p className="min-h-[1.25rem] text-xs text-gray-600" aria-live="polite">
      {flash}
    </p>
  );
  return { copy, flash, region };
}

/**
 * Modal detail panel on a native <dialog>: focus moves in, Esc closes, and
 * focus returns to the element that opened it.
 */
export function DetailDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={() => {
        onClose();
        (opener.current as HTMLElement | null)?.focus?.();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-gray-900/40"
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}

/** A definition list row used inside detail panels. */
export function Fact({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 py-1.5 text-sm last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function SelectChip({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} !py-1.5`}
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
