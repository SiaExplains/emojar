'use client';

import { useMemo, useState, type FormEvent } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
  labelBase,
} from '../ui';
import { newId, useStoredState } from './playground-shared';
import { LocalDataBar, PrintOnly } from './productivity-shared';
import {
  SAMPLE_TIMELINE,
  TL_COLORS,
  TL_LIMITS,
  canMove,
  emptyTimeline,
  eventError,
  formatEventDate,
  isTimelineState,
  moveEvent,
  renderTimeline,
  safeColor,
  sortEvents,
  type TLEvent,
  type TLState,
} from '@/lib/online-tools/engines/timeline';

const KEY = 'emojar:timeline-maker:v1';
const PRINT_ID = 'timeline-print';
const iconBtn =
  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-30';
// Browsers cap canvas size (~16k px per side in Safari); larger timelines
// are rendered at a lower scale instead of failing.
const MAX_CANVAS = 16000;

type Draft = Omit<TLEvent, 'id'>;
const blankDraft = (color = TL_COLORS[0]): Draft => ({
  title: '',
  date: '',
  time: '',
  description: '',
  category: '',
  color,
});

async function svgToPng(
  svg: string,
  width: number,
  height: number,
): Promise<{ blob: Blob; scale: number }> {
  const scale = Math.min(2, MAX_CANVAS / width, MAX_CANVAS / height);
  const url = URL.createObjectURL(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
  );
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('svg'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, 'image/png'),
    );
    if (!blob) throw new Error('png');
    return { blob, scale };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const fileBase = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'timeline';

export default function TimelineMakerTool(_: ToolProps) {
  const [state, setState] = useStoredState<TLState>(
    KEY,
    SAMPLE_TIMELINE,
    isTimelineState,
  );
  const [draft, setDraft] = useState<Draft>(() => blankDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<TLState>) =>
    setState((s) => ({ ...s, ...patch }));
  const setD = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  // The engine escapes all user text and validates colours, so the string is
  // safe to inject; it is the same markup that the SVG download contains.
  const rendered = useMemo(() => renderTimeline(state), [state]);
  const { sorted, invalid } = useMemo(
    () => sortEvents(state.events),
    [state.events],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const candidate: TLEvent = {
      ...draft,
      id: editingId ?? newId(),
      title: draft.title.trim(),
      category: draft.category.trim(),
    };
    if (!candidate.title) {
      setFormError('Give the event a title.');
      return;
    }
    const err = eventError(candidate);
    if (err) {
      setFormError(err);
      return;
    }
    if (!editingId && state.events.length >= TL_LIMITS.events) {
      setFormError(`A timeline can hold up to ${TL_LIMITS.events} events.`);
      return;
    }
    setFormError('');
    setState((s) => ({
      ...s,
      events: editingId
        ? s.events.map((x) => (x.id === editingId ? candidate : x))
        : [...s.events, candidate],
    }));
    setStatus(
      editingId
        ? `Updated “${candidate.title}”.`
        : `Added “${candidate.title}”.`,
    );
    setEditingId(null);
    setDraft(blankDraft(candidate.color));
  };

  const startEdit = (ev: TLEvent) => {
    setEditingId(ev.id);
    setFormError(eventError(ev) ?? '');
    setDraft({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      description: ev.description,
      category: ev.category,
      color: ev.color,
    });
    document
      .getElementById('tl-form')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const downloadPng = async () => {
    setBusy(true);
    setStatus('');
    try {
      const { blob, scale } = await svgToPng(
        rendered.svg,
        rendered.width,
        rendered.height,
      );
      downloadBlob(blob, `${fileBase(state.title)}.png`);
      setStatus(
        scale < 2
          ? `PNG saved at ${scale.toFixed(2)}× because the timeline is very large.`
          : 'PNG saved at 2× resolution.',
      );
    } catch {
      setStatus(
        'This browser couldn’t create the PNG. Download the SVG instead.',
      );
    } finally {
      setBusy(false);
    }
  };

  const row = (ev: TLEvent, valid: boolean) => {
    const err = eventError(ev);
    return (
      <li
        key={ev.id}
        className={`flex flex-wrap items-start gap-2 rounded-xl border p-2.5 ${err ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} ${editingId === ev.id ? 'ring-2 ring-brand-400' : ''}`}
      >
        <span
          aria-hidden
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ background: safeColor(ev.color) }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {ev.title || 'Untitled'}
          </p>
          <p className="text-xs text-gray-600">
            {formatEventDate(ev.date, ev.time)}
            {ev.category && ` · ${ev.category}`}
          </p>
          {err && (
            <p className="mt-0.5 text-xs font-medium text-red-700">
              ⚠ {err} This event is hidden from the timeline until you fix it.
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          {valid && (
            <>
              <button
                type="button"
                className={iconBtn}
                disabled={!canMove(state.events, ev.id, -1)}
                aria-label={`Move “${ev.title}” before the other event on the same date`}
                title="Reorder events on the same date"
                onClick={() =>
                  set({ events: moveEvent(state.events, ev.id, -1) })
                }
              >
                ↑
              </button>
              <button
                type="button"
                className={iconBtn}
                disabled={!canMove(state.events, ev.id, 1)}
                aria-label={`Move “${ev.title}” after the other event on the same date`}
                title="Reorder events on the same date"
                onClick={() =>
                  set({ events: moveEvent(state.events, ev.id, 1) })
                }
              >
                ↓
              </button>
            </>
          )}
          <button
            type="button"
            className={`${btnSecondary} !px-2.5 !py-1 text-xs`}
            onClick={() => startEdit(ev)}
          >
            Edit
          </button>
          <button
            type="button"
            className={iconBtn}
            aria-label={`Delete “${ev.title}”`}
            onClick={() => {
              if (!window.confirm(`Delete “${ev.title || 'this event'}”?`))
                return;
              set({ events: state.events.filter((x) => x.id !== ev.id) });
              if (editingId === ev.id) {
                setEditingId(null);
                setDraft(blankDraft());
              }
            }}
          >
            ✕
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <PrintOnly id={PRINT_ID} />
      <style>{`@media print{#${PRINT_ID} svg{max-width:100%;height:auto}}`}</style>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="tl-title" className={labelBase}>
            Timeline title
          </label>
          <input
            id="tl-title"
            value={state.title}
            maxLength={TL_LIMITS.title}
            onChange={(e) => set({ title: e.target.value })}
            className={inputBase}
          />
        </div>
        <SelectField
          label="View"
          value={state.view}
          onChange={(v) => set({ view: v as TLState['view'] })}
          options={[
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' },
          ]}
        />
        {state.view === 'horizontal' && (
          <SelectField
            label="Spacing"
            value={state.spacing}
            onChange={(v) => set({ spacing: v as TLState['spacing'] })}
            options={[
              { value: 'proportional', label: 'Proportional to time' },
              { value: 'even', label: 'Evenly spaced' },
            ]}
          />
        )}
      </div>

      <div
        id={PRINT_ID}
        className="print-overflow overflow-auto rounded-2xl border border-gray-200 bg-white"
        style={{ maxHeight: state.view === 'vertical' ? '70vh' : undefined }}
        tabIndex={0}
        role="region"
        aria-label="Timeline preview (scrollable)"
        dangerouslySetInnerHTML={{ __html: rendered.svg }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            downloadBlob(
              rendered.svg,
              `${fileBase(state.title)}.svg`,
              'image/svg+xml;charset=utf-8',
            );
            setStatus('SVG saved.');
          }}
        >
          ⬇ Download SVG
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={busy}
          onClick={() => void downloadPng()}
        >
          {busy ? 'Creating PNG…' : '⬇ Download PNG'}
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => window.print()}
        >
          🖨 Print
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            if (
              !state.events.length ||
              window.confirm('Replace your timeline with the sample?')
            ) {
              setState(SAMPLE_TIMELINE);
              setEditingId(null);
              setDraft(blankDraft());
            }
          }}
        >
          Load sample timeline
        </button>
      </div>
      <p className="text-sm text-gray-600" aria-live="polite">
        {status}
      </p>

      <form
        id="tl-form"
        onSubmit={submit}
        className="space-y-3 rounded-2xl border border-gray-200 p-4"
        noValidate
      >
        <h2 className="text-sm font-semibold text-gray-900">
          {editingId ? 'Edit event' : 'Add an event'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="tl-ev-title" className={labelBase}>
              Title
            </label>
            <input
              id="tl-ev-title"
              value={draft.title}
              maxLength={TL_LIMITS.title}
              placeholder="e.g. Company founded"
              onChange={(e) => setD({ title: e.target.value })}
              className={inputBase}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tl-ev-date" className={labelBase}>
              Date
            </label>
            <input
              id="tl-ev-date"
              type="date"
              value={draft.date}
              onChange={(e) => setD({ date: e.target.value })}
              className={inputBase}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tl-ev-time" className={labelBase}>
              Time (optional)
            </label>
            <input
              id="tl-ev-time"
              type="time"
              value={draft.time}
              onChange={(e) => setD({ time: e.target.value.slice(0, 5) })}
              className={inputBase}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="tl-ev-cat" className={labelBase}>
              Category (optional)
            </label>
            <input
              id="tl-ev-cat"
              value={draft.category}
              maxLength={TL_LIMITS.category}
              placeholder="e.g. Milestone"
              onChange={(e) => setD({ category: e.target.value })}
              className={inputBase}
            />
          </div>
          <fieldset className="space-y-1.5">
            <legend className={labelBase}>Colour</legend>
            <div className="flex flex-wrap items-center gap-1.5">
              {TL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Colour ${c}`}
                  aria-pressed={draft.color === c}
                  onClick={() => setD({ color: c })}
                  className={`h-7 w-7 rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${draft.color === c ? 'border-gray-900' : 'border-white'}`}
                  style={{ background: c }}
                />
              ))}
              <input
                type="color"
                value={safeColor(draft.color)}
                aria-label="Custom colour"
                onChange={(e) => setD({ color: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-gray-200"
              />
            </div>
          </fieldset>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="tl-ev-desc" className={labelBase}>
              Description (optional)
            </label>
            <textarea
              id="tl-ev-desc"
              rows={2}
              value={draft.description}
              maxLength={TL_LIMITS.description}
              onChange={(e) => setD({ description: e.target.value })}
              className={`${inputBase} resize-y`}
            />
          </div>
        </div>
        <ErrorMessage>{formError}</ErrorMessage>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={btnPrimary}>
            {editingId ? 'Save event' : 'Add event'}
          </button>
          {editingId && (
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setEditingId(null);
                setFormError('');
                setDraft(blankDraft());
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section aria-labelledby="tl-list" className="space-y-2">
        <h2 id="tl-list" className="text-sm font-semibold text-gray-900">
          Events ({state.events.length})
        </h2>
        <p className="text-xs text-gray-500">
          Events are ordered by date and time automatically. Use ↑ ↓ to reorder
          events that share the same date and time.
        </p>
        {!state.events.length && (
          <p className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
            No events yet. Add one above or load the sample.
          </p>
        )}
        <ol className="space-y-2">
          {sorted.map((ev) => row(ev, true))}
          {invalid.map((ev) => row(ev, false))}
        </ol>
      </section>

      <LocalDataBar
        tool="timeline-maker"
        state={state}
        guard={isTimelineState}
        onImport={(v) => {
          setState(v);
          setEditingId(null);
          setDraft(blankDraft());
        }}
        onClear={() => {
          setState(emptyTimeline());
          setEditingId(null);
          setDraft(blankDraft());
        }}
        clearConfirm="Delete the title and every event? This can’t be undone."
      />
    </div>
  );
}
