'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Notice,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
} from '../ui';
import { newId, useStoredState } from './playground-shared';
import { LocalDataBar, PrintOnly } from './productivity-shared';
import {
  NOTE_LIMITS,
  STORAGE_WARN_BYTES,
  countText,
  deleteNote,
  initialNotes,
  isNotesState,
  newNote,
  noteFileName,
  noteTitle,
  relativeTime,
  searchNotes,
  storageBytes,
  type Note,
  type NotesState,
} from '@/lib/online-tools/engines/notes';

const KEY = 'emojar:online-notepad:v1';
const TOOL = 'online-notepad';
const SIZES = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const;

export default function NotepadTool(_props: ToolProps) {
  const [state, setState, ready] = useStoredState<NotesState>(
    KEY,
    () => initialNotes(newId(), Date.now()),
    isNotesState,
  );
  const [query, setQuery] = useState('');
  const [undo, setUndo] = useState<Note | null>(null);
  const [focus, setFocus] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const area = useRef<HTMLTextAreaElement>(null);

  // Keep "edited 5 min ago" labels fresh.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFocus(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [focus]);

  const active =
    state.notes.find((n) => n.id === state.activeId) ?? state.notes[0];
  const list = useMemo(
    () => searchNotes(state.notes, query),
    [state.notes, query],
  );
  const counts = countText(active.text);
  const bytes = storageBytes(state);

  const update = (text: string) =>
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) =>
        n.id === active.id
          ? {
              ...n,
              text: text.slice(0, NOTE_LIMITS.chars),
              updated: Date.now(),
            }
          : n,
      ),
    }));

  const add = () => {
    if (state.notes.length >= NOTE_LIMITS.notes) return;
    const n = newNote(newId(), Date.now());
    setState((s) => ({ ...s, notes: [n, ...s.notes], activeId: n.id }));
    setQuery('');
    window.setTimeout(() => area.current?.focus(), 0);
  };

  const remove = () => {
    if (
      active.text.trim() &&
      !window.confirm(`Delete “${noteTitle(active.text)}”?`)
    )
      return;
    setUndo(active);
    setState((s) =>
      deleteNote(s, active.id, () => newNote(newId(), Date.now())),
    );
  };

  const restore = () => {
    if (!undo) return;
    setState((s) => ({
      ...s,
      notes: [
        undo,
        ...s.notes.filter((n) => n.text.trim() || n.id === undo.id),
      ],
      activeId: undo.id,
    }));
    setUndo(null);
  };

  const editor = (
    <textarea
      ref={area}
      value={active.text}
      onChange={(e) => update(e.target.value)}
      placeholder="Start typing… Your note saves automatically in this browser."
      aria-label={`Note: ${noteTitle(active.text)}`}
      spellCheck
      className={`${focus ? 'h-full' : 'min-h-[420px]'} w-full resize-y rounded-xl border border-gray-200 bg-white p-4 leading-relaxed text-gray-900 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 ${SIZES[state.size]} ${state.mono ? 'font-mono' : ''}`}
    />
  );

  if (focus)
    return (
      <div className="fixed inset-0 z-50 flex flex-col gap-3 bg-[#f5f5fa] p-4 sm:p-8">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-700">
            {noteTitle(active.text)} · {counts.words} words
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setFocus(false)}
          >
            Exit focus mode (Esc)
          </button>
        </div>
        <div className="min-h-0 flex-1">{editor}</div>
      </div>
    );

  return (
    <div className="space-y-4">
      <PrintOnly id="notepad-print" />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="no-print space-y-2" aria-label="Your notes">
          <div className="flex gap-2">
            <button
              type="button"
              className={`${btnPrimary} flex-1`}
              onClick={add}
              disabled={state.notes.length >= NOTE_LIMITS.notes}
            >
              ＋ New note
            </button>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes"
            className={inputBase}
          />
          <ul className="max-h-[200px] space-y-1 overflow-y-auto lg:max-h-[440px]">
            {list.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  aria-current={n.id === active.id ? 'true' : undefined}
                  onClick={() => setState((s) => ({ ...s, activeId: n.id }))}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${n.id === active.id ? 'bg-brand-50 text-brand-900' : 'hover:bg-gray-50'}`}
                >
                  <span className="block truncate font-medium">
                    {noteTitle(n.text, 40)}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {ready ? relativeTime(n.updated, now) : ''}
                  </span>
                </button>
              </li>
            ))}
            {!list.length && (
              <li className="px-3 py-2 text-sm text-gray-500">
                No notes match.
              </li>
            )}
          </ul>
          <p className="text-xs text-gray-500">
            {state.notes.length} of {NOTE_LIMITS.notes} notes
          </p>
        </aside>

        <div className="min-w-0 space-y-2">
          <div className="no-print flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              className={btnSecondary}
              onClick={() =>
                downloadBlob(active.text, noteFileName(active.text, 'txt'))
              }
            >
              ⬇ .txt
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() =>
                downloadBlob(
                  active.text,
                  noteFileName(active.text, 'md'),
                  'text/markdown;charset=utf-8',
                )
              }
            >
              ⬇ .md
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
              onClick={() => setFocus(true)}
            >
              ⤢ Focus mode
            </button>
            <label className="flex items-center gap-1.5 text-gray-700">
              <input
                type="checkbox"
                checked={state.mono}
                onChange={(e) =>
                  setState((s) => ({ ...s, mono: e.target.checked }))
                }
              />
              Monospace
            </label>
            <label className="flex items-center gap-1.5 text-gray-700">
              Size
              <select
                value={state.size}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    size: e.target.value as NotesState['size'],
                  }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
            <button
              type="button"
              className={`${btnSecondary} ml-auto text-red-700`}
              onClick={remove}
            >
              Delete note
            </button>
          </div>
          {undo && (
            <Notice>
              Deleted “{noteTitle(undo.text)}”.{' '}
              <button
                type="button"
                className="font-semibold underline"
                onClick={restore}
              >
                Undo
              </button>
            </Notice>
          )}
          {editor}
          <div
            id="notepad-print"
            className="hidden whitespace-pre-wrap print:block"
          >
            {active.text}
          </div>
          <p className="text-xs text-gray-500" aria-live="polite">
            {counts.words.toLocaleString()} words ·{' '}
            {counts.chars.toLocaleString()} characters ·{' '}
            {counts.lines.toLocaleString()} lines
            {ready && ` · saved ${relativeTime(active.updated, now)}`}
          </p>
          {bytes > STORAGE_WARN_BYTES && (
            <Notice tone="amber">
              Your notes are using about {(bytes / 1_000_000).toFixed(1)} MB of
              the roughly 5 MB this browser allows. Export a backup and delete
              notes you no longer need.
            </Notice>
          )}
        </div>
      </div>

      <LocalDataBar
        tool={TOOL}
        state={state}
        guard={isNotesState}
        onImport={setState}
        onClear={() => setState(initialNotes(newId(), Date.now()))}
        clearLabel="Delete all notes"
        clearConfirm="Delete all notes in this browser? Export a backup first if you want to keep them."
      />
    </div>
  );
}
