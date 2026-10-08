import { describe, expect, it } from 'vitest';
import {
  DEFAULT_KANBAN,
  addColumn,
  addItem,
  cardMatches,
  deleteColumn,
  emptyEisenhower,
  isEisenhowerState,
  isKanbanState,
  isOverdue,
  itemCount,
  moveColumn,
  moveItem,
  removeItem,
  removeItemsWhere,
  renameColumn,
  shiftItem,
  updateItem,
  type Board,
  type KanbanCard,
} from './task-board';
import { isIsoDate, parseJsonImport, toExportJson } from './local-data';

type T = { id: string };
const board = (): Board<T> => ({
  columns: [
    { id: 'a', title: 'A', items: [{ id: '1' }, { id: '2' }, { id: '3' }] },
    { id: 'b', title: 'B', items: [{ id: '4' }] },
    { id: 'c', title: 'C', items: [] },
  ],
});
const ids = (b: Board<T>) =>
  b.columns.map((c) => c.items.map((i) => i.id).join(''));

describe('moving items', () => {
  it('moves between columns before a given item or to the end', () => {
    expect(ids(moveItem(board(), '1', 'b', '4'))).toEqual(['23', '14', '']);
    expect(ids(moveItem(board(), '1', 'b', null))).toEqual(['23', '41', '']);
    expect(ids(moveItem(board(), '2', 'c', null))).toEqual(['13', '4', '2']);
  });

  it('reorders within a column', () => {
    expect(ids(moveItem(board(), '3', 'a', '1'))).toEqual(['312', '4', '']);
    expect(ids(moveItem(board(), '1', 'a', '3'))).toEqual(['213', '4', '']);
    expect(ids(moveItem(board(), '1', 'a', null))).toEqual(['231', '4', '']);
    expect(ids(shiftItem(board(), '2', -1))).toEqual(['213', '4', '']);
    expect(ids(shiftItem(board(), '2', 1))).toEqual(['132', '4', '']);
  });

  it('ignores impossible moves and leaves the input untouched', () => {
    const b = board();
    expect(moveItem(b, 'nope', 'b', null)).toBe(b);
    expect(moveItem(b, '1', 'zzz', null)).toBe(b);
    expect(moveItem(b, '1', 'a', '1')).toBe(b);
    expect(shiftItem(b, '1', -1)).toBe(b);
    expect(shiftItem(b, '3', 1)).toBe(b);
    moveItem(b, '1', 'b', null);
    expect(ids(b)).toEqual(['123', '4', '']);
  });
});

describe('items and columns', () => {
  it('adds, updates, removes and clears items', () => {
    type D = { id: string; done: boolean };
    let b: Board<D> = { columns: [{ id: 'x', title: 'X', items: [] }] };
    b = addItem(b, 'x', { id: '1', done: false });
    b = addItem(b, 'x', { id: '2', done: false });
    b = updateItem(b, '1', { done: true });
    expect(b.columns[0].items[0].done).toBe(true);
    expect(
      removeItemsWhere(b, (i) => i.done).columns[0].items.map((i) => i.id),
    ).toEqual(['2']);
    expect(itemCount(removeItem(b, '2'))).toBe(1);
  });

  it('adds, renames, reorders and deletes columns', () => {
    let b = addColumn(board(), 'd', 'D');
    expect(b.columns.map((c) => c.id)).toEqual(['a', 'b', 'c', 'd']);
    b = renameColumn(b, 'b', 'Bee');
    expect(b.columns[1].title).toBe('Bee');
    expect(moveColumn(b, 'a', 1).columns.map((c) => c.id)).toEqual([
      'b',
      'a',
      'c',
      'd',
    ]);
    expect(moveColumn(b, 'a', -1)).toBe(b);
    expect(moveColumn(b, 'd', 1)).toBe(b);
    const del = deleteColumn(b, 'a');
    expect(del.columns.map((c) => c.id)).toEqual(['b', 'c', 'd']);
    expect(itemCount(del)).toBe(1);
  });
});

const card = (p: Partial<KanbanCard> = {}): KanbanCard => ({
  id: 'k',
  title: 'Fix login',
  description: 'Users see a blank page',
  labels: [{ text: 'Bug', color: 'red' }],
  due: '',
  ...p,
});

describe('kanban helpers', () => {
  it('flags overdue cards outside done columns', () => {
    expect(isOverdue(card({ due: '2024-01-01' }), 'To Do', '2024-01-02')).toBe(
      true,
    );
    expect(isOverdue(card({ due: '2024-01-02' }), 'To Do', '2024-01-02')).toBe(
      false,
    );
    expect(isOverdue(card({ due: '2024-01-01' }), 'Done', '2024-01-02')).toBe(
      false,
    );
    expect(isOverdue(card(), 'To Do', '2024-01-02')).toBe(false);
  });

  it('filters by title, description and label', () => {
    expect(cardMatches(card(), 'bug')).toBe(true);
    expect(cardMatches(card(), 'BLANK')).toBe(true);
    expect(cardMatches(card(), 'payments')).toBe(false);
    expect(cardMatches(card(), '  ')).toBe(true);
  });
});

describe('validation and import', () => {
  it('validates kanban data strictly', () => {
    expect(isKanbanState(DEFAULT_KANBAN)).toBe(true);
    expect(isKanbanState({ version: 1, columns: [] })).toBe(true);
    const col = (items: unknown[]) => ({
      version: 1,
      columns: [{ id: 'a', title: 'A', items }],
    });
    expect(isKanbanState(col([card()]))).toBe(true);
    expect(isKanbanState(col([card({ due: '2024-02-30' })]))).toBe(false);
    expect(
      isKanbanState(
        col([
          { ...card(), labels: [{ text: 'x', color: 'url(javascript:)' }] },
        ]),
      ),
    ).toBe(false);
    expect(isKanbanState(col([card(), card()]))).toBe(false);
    expect(isKanbanState(col([{ id: 'x', title: 5 }]))).toBe(false);
    expect(isKanbanState({ version: 2, columns: [] })).toBe(false);
  });

  it('validates the four Eisenhower quadrants', () => {
    const s = emptyEisenhower();
    expect(isEisenhowerState(s)).toBe(true);
    s.columns[0].items.push({ id: 't', text: 'Call bank', done: false });
    expect(isEisenhowerState(s)).toBe(true);
    expect(isEisenhowerState({ ...s, columns: s.columns.slice(0, 3) })).toBe(
      false,
    );
    expect(isEisenhowerState({ ...s, columns: [...s.columns].reverse() })).toBe(
      false,
    );
    const bad = emptyEisenhower();
    bad.columns[1].items.push({ id: 't', text: 'x', done: 'yes' } as never);
    expect(isEisenhowerState(bad)).toBe(false);
  });

  it('imports exported JSON and reports errors', () => {
    const json = toExportJson('kanban-board', DEFAULT_KANBAN);
    const ok = parseJsonImport(json, 'kanban-board', isKanbanState);
    expect(ok).toEqual({ ok: true, value: DEFAULT_KANBAN });
    expect(parseJsonImport('{oops', 'kanban-board', isKanbanState).ok).toBe(
      false,
    );
    expect(parseJsonImport('[]', 'kanban-board', isKanbanState).ok).toBe(false);
    const wrong = parseJsonImport(json, 'timeline-maker', isKanbanState);
    expect(wrong.ok === false && wrong.error).toMatch(/kanban-board/);
    expect(
      parseJsonImport('{"version":1}', 'kanban-board', isKanbanState).ok,
    ).toBe(false);
    // Files without the tool tag are accepted when the data is valid.
    expect(
      parseJsonImport(
        JSON.stringify(DEFAULT_KANBAN),
        'kanban-board',
        isKanbanState,
      ).ok,
    ).toBe(true);
  });

  it('checks real calendar dates', () => {
    expect(isIsoDate('2024-02-29')).toBe(true);
    expect(isIsoDate('1900-02-29')).toBe(false);
    expect(isIsoDate('2000-02-29')).toBe(true);
    expect(isIsoDate('2024-1-01')).toBe(false);
  });
});
