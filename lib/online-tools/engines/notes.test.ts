import { describe, expect, it } from 'vitest';
import {
  countText,
  deleteNote,
  initialNotes,
  isNotesState,
  newNote,
  noteFileName,
  noteTitle,
  relativeTime,
  searchNotes,
} from './notes';

describe('online notepad', () => {
  it('validates saved state', () => {
    const s = initialNotes('a', 1);
    expect(isNotesState(s)).toBe(true);
    expect(isNotesState({ ...s, notes: [] })).toBe(false);
    expect(isNotesState({ ...s, notes: [s.notes[0], s.notes[0]] })).toBe(false);
    expect(isNotesState({ ...s, size: 'xl' })).toBe(false);
  });

  it('titles a note from its first non-empty line', () => {
    expect(noteTitle('\n\n# Shopping list\nmilk')).toBe('Shopping list');
    expect(noteTitle('   ')).toBe('Untitled note');
    expect(noteTitle('x'.repeat(80), 10)).toBe(`${'x'.repeat(9)}…`);
    expect(noteFileName('Ideas: Q4/Q1\nmore', 'md')).toBe('Ideas Q4Q1.md');
    expect(noteFileName('', 'txt')).toBe('Untitled note.txt');
  });

  it('counts words, characters and lines', () => {
    expect(countText('')).toEqual({ words: 0, chars: 0, lines: 0 });
    expect(countText('one two\nthree 🙂')).toEqual({
      words: 4,
      chars: 15,
      lines: 2,
    });
  });

  it('searches every term, newest first', () => {
    const notes = [
      newNote('1', 10, 'Milk and eggs'),
      newNote('2', 30, 'eggs, flour, MILK'),
      newNote('3', 20, 'Meeting notes'),
    ];
    expect(searchNotes(notes, 'milk eggs').map((n) => n.id)).toEqual([
      '2',
      '1',
    ]);
    expect(searchNotes(notes, '').map((n) => n.id)).toEqual(['2', '3', '1']);
  });

  it('deletes a note and keeps one note available', () => {
    const s = {
      ...initialNotes('a', 1),
      notes: [newNote('a', 1), newNote('b', 2), newNote('c', 3)],
      activeId: 'b',
    };
    expect(deleteNote(s, 'b', () => newNote('z', 9)).activeId).toBe('c');
    expect(deleteNote(s, 'a', () => newNote('z', 9)).activeId).toBe('b');
    const one = initialNotes('a', 1);
    const after = deleteNote(one, 'a', () => newNote('z', 9));
    expect(after.notes.map((n) => n.id)).toEqual(['z']);
    expect(after.activeId).toBe('z');
  });

  it('formats relative times', () => {
    expect(relativeTime(0, 10_000)).toBe('just now');
    expect(relativeTime(0, 5 * 60_000)).toBe('5 min ago');
    expect(relativeTime(0, 3 * 3_600_000)).toBe('3 h ago');
  });
});
