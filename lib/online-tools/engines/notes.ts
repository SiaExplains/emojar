// Online Notepad: the saved notes model, its validation guard, titles,
// search and counts. Notes live only in the browser's localStorage.

import {
  isArrayOf,
  isFiniteNum,
  isId,
  isObj,
  isStr,
  uniqueIds,
} from './local-data';

export type Note = {
  id: string;
  text: string;
  /** Unix ms of the last edit. */
  updated: number;
};

export type NotesState = {
  version: 1;
  notes: Note[];
  activeId: string;
  /** Editor preferences. */
  mono: boolean;
  size: 'sm' | 'md' | 'lg';
};

export const NOTE_LIMITS = {
  notes: 200,
  /** Per note; localStorage holds about 5 MB for the whole site. */
  chars: 200_000,
};

/** localStorage is typically 5 MB per site; warn well before it fills. */
export const STORAGE_WARN_BYTES = 3_500_000;

const isNote = (v: unknown): v is Note =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.text, NOTE_LIMITS.chars) &&
  isFiniteNum(v.updated);

export function isNotesState(v: unknown): v is NotesState {
  return (
    isObj(v) &&
    v.version === 1 &&
    isArrayOf(v.notes, isNote, NOTE_LIMITS.notes) &&
    v.notes.length > 0 &&
    uniqueIds(v.notes) &&
    typeof v.activeId === 'string' &&
    typeof v.mono === 'boolean' &&
    (v.size === 'sm' || v.size === 'md' || v.size === 'lg')
  );
}

export function newNote(id: string, now: number, text = ''): Note {
  return { id, text, updated: now };
}

export function initialNotes(id: string, now: number): NotesState {
  return {
    version: 1,
    notes: [newNote(id, now)],
    activeId: id,
    mono: false,
    size: 'md',
  };
}

/** The note's first non-empty line, trimmed, as its title. */
export function noteTitle(text: string, max = 60): string {
  const line = text.split(/\r?\n/).find((l) => l.trim()) ?? '';
  const t = line.trim().replace(/^#+\s*/, '');
  if (!t) return 'Untitled note';
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

/** File name for a download, from the title: "Shopping list.txt". */
export function noteFileName(text: string, ext: 'txt' | 'md'): string {
  const base =
    noteTitle(text, 50)
      .replace(/…$/, '')
      .replace(/[\\/:*?"<>|]+/g, '')
      .trim() || 'note';
  return `${base}.${ext}`;
}

export type TextCounts = {
  words: number;
  chars: number;
  lines: number;
};

export function countText(text: string): TextCounts {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    words,
    chars: [...text].length,
    lines: text ? text.split(/\r?\n/).length : 0,
  };
}

/** Notes whose text contains every word of the query, newest first. */
export function searchNotes(notes: Note[], query: string): Note[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return [...notes]
    .filter((n) => {
      const t = n.text.toLowerCase();
      return terms.every((q) => t.includes(q));
    })
    .sort((a, b) => b.updated - a.updated);
}

/** Approximate localStorage bytes for the state (UTF-16 = 2 bytes/char). */
export function storageBytes(state: NotesState): number {
  return JSON.stringify(state).length * 2;
}

/** Removes a note and picks a neighbour as the new active note. */
export function deleteNote(
  state: NotesState,
  id: string,
  makeNote: () => Note,
): NotesState {
  const idx = state.notes.findIndex((n) => n.id === id);
  if (idx === -1) return state;
  const notes = state.notes.filter((n) => n.id !== id);
  if (!notes.length) {
    const fresh = makeNote();
    return { ...state, notes: [fresh], activeId: fresh.id };
  }
  const activeId =
    state.activeId === id
      ? notes[Math.min(idx, notes.length - 1)].id
      : state.activeId;
  return { ...state, notes, activeId };
}

/** "just now", "5 min ago", "3 h ago", or a date. */
export function relativeTime(ms: number, now: number): string {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(ms).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
