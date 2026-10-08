// Pure state helpers shared by the Kanban board and the Eisenhower matrix:
// a board is a list of columns, each holding an ordered list of items.
// Every function returns a new board and leaves the input untouched.

import {
  isArrayOf,
  isId,
  isIsoDate,
  isObj,
  isStr,
  uniqueIds,
} from './local-data';

export type BoardItem = { id: string };
export type BoardColumn<T extends BoardItem> = {
  id: string;
  title: string;
  items: T[];
};
export type Board<T extends BoardItem> = { columns: BoardColumn<T>[] };

export function findItem<T extends BoardItem>(
  board: Board<T>,
  itemId: string,
): { col: number; index: number; item: T } | null {
  for (let c = 0; c < board.columns.length; c++) {
    const index = board.columns[c].items.findIndex((i) => i.id === itemId);
    if (index >= 0)
      return { col: c, index, item: board.columns[c].items[index] };
  }
  return null;
}

/**
 * Moves an item to column `toColId`, placed before `beforeId` (or at the
 * end when it is null or not in that column). Identifying the target by
 * neighbour id rather than index keeps drops correct while a filter hides
 * some cards.
 */
export function moveItem<T extends BoardItem>(
  board: Board<T>,
  itemId: string,
  toColId: string,
  beforeId: string | null,
): Board<T> {
  const found = findItem(board, itemId);
  if (!found || !board.columns.some((c) => c.id === toColId)) return board;
  if (beforeId === itemId) return board;
  const columns = board.columns.map((c, ci) => ({
    ...c,
    items: ci === found.col ? c.items.filter((i) => i.id !== itemId) : c.items,
  }));
  const target = columns.find((c) => c.id === toColId);
  if (!target) return board;
  const at = beforeId ? target.items.findIndex((i) => i.id === beforeId) : -1;
  const items = [...target.items];
  items.splice(at < 0 ? items.length : at, 0, found.item);
  target.items = items;
  return { ...board, columns };
}

/** Moves an item up (-1) or down (+1) inside its column. */
export function shiftItem<T extends BoardItem>(
  board: Board<T>,
  itemId: string,
  delta: number,
): Board<T> {
  const found = findItem(board, itemId);
  if (!found) return board;
  const items = [...board.columns[found.col].items];
  const to = found.index + delta;
  if (to < 0 || to >= items.length) return board;
  items.splice(found.index, 1);
  items.splice(to, 0, found.item);
  return {
    ...board,
    columns: board.columns.map((c, ci) =>
      ci === found.col ? { ...c, items } : c,
    ),
  };
}

export function addItem<T extends BoardItem>(
  board: Board<T>,
  colId: string,
  item: T,
): Board<T> {
  return {
    ...board,
    columns: board.columns.map((c) =>
      c.id === colId ? { ...c, items: [...c.items, item] } : c,
    ),
  };
}

export function updateItem<T extends BoardItem>(
  board: Board<T>,
  itemId: string,
  patch: Partial<Omit<T, 'id'>>,
): Board<T> {
  return {
    ...board,
    columns: board.columns.map((c) => ({
      ...c,
      items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    })),
  };
}

export function removeItem<T extends BoardItem>(
  board: Board<T>,
  itemId: string,
): Board<T> {
  return removeItemsWhere(board, (i) => i.id === itemId);
}

export function removeItemsWhere<T extends BoardItem>(
  board: Board<T>,
  pred: (item: T) => boolean,
): Board<T> {
  return {
    ...board,
    columns: board.columns.map((c) => ({
      ...c,
      items: c.items.filter((i) => !pred(i)),
    })),
  };
}

export function addColumn<T extends BoardItem>(
  board: Board<T>,
  id: string,
  title: string,
): Board<T> {
  return { ...board, columns: [...board.columns, { id, title, items: [] }] };
}

export function renameColumn<T extends BoardItem>(
  board: Board<T>,
  colId: string,
  title: string,
): Board<T> {
  return {
    ...board,
    columns: board.columns.map((c) => (c.id === colId ? { ...c, title } : c)),
  };
}

/** Deletes a column together with its items (the UI confirms first). */
export function deleteColumn<T extends BoardItem>(
  board: Board<T>,
  colId: string,
): Board<T> {
  return { ...board, columns: board.columns.filter((c) => c.id !== colId) };
}

/** Moves a column left (-1) or right (+1). */
export function moveColumn<T extends BoardItem>(
  board: Board<T>,
  colId: string,
  delta: number,
): Board<T> {
  const from = board.columns.findIndex((c) => c.id === colId);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= board.columns.length) return board;
  const columns = [...board.columns];
  const [col] = columns.splice(from, 1);
  columns.splice(to, 0, col);
  return { ...board, columns };
}

export const itemCount = <T extends BoardItem>(board: Board<T>) =>
  board.columns.reduce((n, c) => n + c.items.length, 0);

// ---------------------------------------------------------------- Kanban

export const LABEL_COLORS = [
  'gray',
  'red',
  'amber',
  'green',
  'blue',
  'violet',
  'pink',
] as const;
export type LabelColor = (typeof LABEL_COLORS)[number];
export type CardLabel = { text: string; color: LabelColor };
export type KanbanCard = {
  id: string;
  title: string;
  description: string;
  labels: CardLabel[];
  /** YYYY-MM-DD, or '' for no due date. */
  due: string;
};
export type KanbanState = { version: 1; columns: BoardColumn<KanbanCard>[] };

export const KANBAN_LIMITS = {
  columns: 30,
  cards: 500,
  title: 200,
  description: 5000,
  labels: 10,
  label: 40,
  column: 80,
};

const isLabel = (v: unknown): v is CardLabel =>
  isObj(v) &&
  isStr(v.text, KANBAN_LIMITS.label) &&
  (LABEL_COLORS as readonly string[]).includes(v.color as string);

const isCard = (v: unknown): v is KanbanCard =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.title, KANBAN_LIMITS.title) &&
  isStr(v.description, KANBAN_LIMITS.description) &&
  isArrayOf(v.labels, isLabel, KANBAN_LIMITS.labels) &&
  isStr(v.due, 10) &&
  (v.due === '' || isIsoDate(v.due));

const isKanbanColumn = (v: unknown): v is BoardColumn<KanbanCard> =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.title, KANBAN_LIMITS.column) &&
  isArrayOf(v.items, isCard, KANBAN_LIMITS.cards);

export function isKanbanState(v: unknown): v is KanbanState {
  if (!isObj(v) || v.version !== 1) return false;
  if (!isArrayOf(v.columns, isKanbanColumn, KANBAN_LIMITS.columns))
    return false;
  const cards = v.columns.flatMap((c) => c.items);
  return uniqueIds(v.columns) && uniqueIds(cards);
}

export const DEFAULT_KANBAN: KanbanState = {
  version: 1,
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      items: [
        {
          id: 'c1',
          title: 'Drag me to “In Progress”',
          description:
            'Or use “Move to…” below. Everything is saved in this browser only.',
          labels: [{ text: 'Example', color: 'blue' }],
          due: '',
        },
      ],
    },
    { id: 'doing', title: 'In Progress', items: [] },
    { id: 'done', title: 'Done', items: [] },
  ],
};

/** A due date is overdue when it is before today and the card isn’t in a “done” column. */
export function isOverdue(
  card: KanbanCard,
  columnTitle: string,
  today: string,
): boolean {
  return card.due !== '' && card.due < today && !/\bdone\b/i.test(columnTitle);
}

/** Case-insensitive match on title, description and label text. */
export function cardMatches(card: KanbanCard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [card.title, card.description, ...card.labels.map((l) => l.text)]
    .join('\n')
    .toLowerCase()
    .includes(q);
}

// ------------------------------------------------------------ Eisenhower

export const QUADRANTS = [
  {
    id: 'do',
    title: 'Do first',
    subtitle: 'Urgent + important',
    hint: 'Crises, deadlines, things only you can do today.',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    subtitle: 'Not urgent + important',
    hint: 'Planning, learning, health — put a time on the calendar.',
  },
  {
    id: 'delegate',
    title: 'Delegate',
    subtitle: 'Urgent + not important',
    hint: 'Interruptions and requests someone else can handle.',
  },
  {
    id: 'eliminate',
    title: 'Eliminate',
    subtitle: 'Not urgent + not important',
    hint: 'Time-wasters — drop them or do them last.',
  },
] as const;
export type QuadrantId = (typeof QUADRANTS)[number]['id'];

export type MatrixTask = { id: string; text: string; done: boolean };
export type EisenhowerState = {
  version: 1;
  columns: BoardColumn<MatrixTask>[];
};

export const MATRIX_TASK_MAX = 500;

const isTask = (v: unknown): v is MatrixTask =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.text, MATRIX_TASK_MAX) &&
  typeof v.done === 'boolean';

export function isEisenhowerState(v: unknown): v is EisenhowerState {
  if (!isObj(v) || v.version !== 1 || !Array.isArray(v.columns)) return false;
  const cols: unknown[] = v.columns;
  if (cols.length !== QUADRANTS.length) return false;
  // The four quadrants are fixed and must appear in the standard order.
  const ok = cols.every(
    (c, i) =>
      isObj(c) &&
      c.id === QUADRANTS[i].id &&
      isStr(c.title, 80) &&
      isArrayOf(c.items, isTask, 1000),
  );
  if (!ok) return false;
  const state = v as EisenhowerState;
  return uniqueIds(state.columns.flatMap((c) => c.items));
}

export const emptyEisenhower = (): EisenhowerState => ({
  version: 1,
  columns: QUADRANTS.map((q) => ({ id: q.id, title: q.title, items: [] })),
});
