'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { btnPrimary, btnSecondary, inputBase, labelBase } from '../ui';
import { newId, useStoredState } from './playground-shared';
import { DropLine, LocalDataBar, useCardDrag } from './productivity-shared';
import {
  DEFAULT_KANBAN,
  KANBAN_LIMITS,
  LABEL_COLORS,
  addColumn,
  addItem,
  cardMatches,
  deleteColumn,
  isKanbanState,
  isOverdue,
  moveColumn,
  moveItem,
  removeItem,
  renameColumn,
  shiftItem,
  updateItem,
  type KanbanCard,
  type Board,
  type KanbanState,
  type LabelColor,
} from '@/lib/online-tools/engines/task-board';
import { isIsoDate, todayIso } from '@/lib/online-tools/engines/local-data';

const KEY = 'emojar:kanban-board:v1';
const iconBtn =
  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-30';
const LABEL_CLASS: Record<LabelColor, string> = {
  gray: 'bg-gray-100 text-gray-800 border-gray-300',
  red: 'bg-red-100 text-red-800 border-red-300',
  amber: 'bg-amber-100 text-amber-900 border-amber-300',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  blue: 'bg-sky-100 text-sky-800 border-sky-300',
  violet: 'bg-violet-100 text-violet-800 border-violet-300',
  pink: 'bg-pink-100 text-pink-800 border-pink-300',
};

const emptyBoard = (): KanbanState => ({
  version: 1,
  columns: [
    { id: newId(), title: 'To Do', items: [] },
    { id: newId(), title: 'In Progress', items: [] },
    { id: newId(), title: 'Done', items: [] },
  ],
});

function formatDue(iso: string): string {
  if (!isIsoDate(iso)) return iso;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Modal editor for one card, using the native <dialog> for focus handling. */
function CardDialog({
  card,
  onSave,
  onDelete,
  onClose,
}: {
  card: KanbanCard;
  onSave: (c: KanbanCard) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const [draft, setDraft] = useState(card);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  const set = (patch: Partial<KanbanCard>) =>
    setDraft((c) => ({ ...c, ...patch }));
  const save = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...draft,
      title: draft.title.trim() || 'Untitled',
      labels: draft.labels
        .map((l) => ({ ...l, text: l.text.trim() }))
        .filter((l) => l.text),
    });
  };
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="kb-dialog-title"
      className="w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 p-0 shadow-xl backdrop:bg-gray-900/40"
    >
      <form onSubmit={save} className="space-y-4 p-5">
        <h2 id="kb-dialog-title" className="text-lg font-semibold">
          Edit card
        </h2>
        <div className="space-y-1.5">
          <label htmlFor="kb-title" className={labelBase}>
            Title
          </label>
          <input
            id="kb-title"
            value={draft.title}
            maxLength={KANBAN_LIMITS.title}
            onChange={(e) => set({ title: e.target.value })}
            className={inputBase}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="kb-desc" className={labelBase}>
            Description (optional)
          </label>
          <textarea
            id="kb-desc"
            rows={4}
            value={draft.description}
            maxLength={KANBAN_LIMITS.description}
            onChange={(e) => set({ description: e.target.value })}
            className={`${inputBase} resize-y`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="kb-due" className={labelBase}>
            Due date (optional)
          </label>
          <div className="flex gap-2">
            <input
              id="kb-due"
              type="date"
              value={draft.due}
              onChange={(e) =>
                set({ due: isIsoDate(e.target.value) ? e.target.value : '' })
              }
              className={inputBase}
            />
            {draft.due && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => set({ due: '' })}
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <fieldset className="space-y-2">
          <legend className={labelBase}>Labels (optional)</legend>
          {draft.labels.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={l.text}
                maxLength={KANBAN_LIMITS.label}
                aria-label={`Label ${i + 1} text`}
                placeholder="e.g. Bug"
                onChange={(e) =>
                  set({
                    labels: draft.labels.map((x, j) =>
                      j === i ? { ...x, text: e.target.value } : x,
                    ),
                  })
                }
                className={inputBase}
              />
              <select
                value={l.color}
                aria-label={`Label ${i + 1} colour`}
                onChange={(e) =>
                  set({
                    labels: draft.labels.map((x, j) =>
                      j === i
                        ? { ...x, color: e.target.value as LabelColor }
                        : x,
                    ),
                  })
                }
                className={`${inputBase} !w-28`}
              >
                {LABEL_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={`${iconBtn} !h-10 !w-10`}
                aria-label={`Remove label ${l.text || i + 1}`}
                onClick={() =>
                  set({ labels: draft.labels.filter((_, j) => j !== i) })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnSecondary}
            disabled={draft.labels.length >= KANBAN_LIMITS.labels}
            onClick={() =>
              set({
                labels: [
                  ...draft.labels,
                  {
                    text: '',
                    color:
                      LABEL_COLORS[draft.labels.length % LABEL_COLORS.length],
                  },
                ],
              })
            }
          >
            + Add label
          </button>
        </fieldset>
        <div className="flex flex-wrap justify-between gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            className={`${btnSecondary} text-red-700`}
            onClick={() => {
              if (window.confirm('Delete this card?')) onDelete();
            }}
          >
            Delete card
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => ref.current?.close()}
            >
              Cancel
            </button>
            <button type="submit" className={btnPrimary}>
              Save
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

function AddCard({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        onAdd(t);
        setTitle('');
      }}
      className="no-print mt-2 flex gap-1.5"
    >
      <input
        value={title}
        maxLength={KANBAN_LIMITS.title}
        placeholder="New card…"
        aria-label="New card title"
        onChange={(e) => setTitle(e.target.value)}
        className={`${inputBase} !py-1.5`}
      />
      <button type="submit" className={`${btnSecondary} !px-3`}>
        Add
      </button>
    </form>
  );
}

export default function KanbanBoardTool(_: ToolProps) {
  const [state, setState] = useStoredState<KanbanState>(
    KEY,
    DEFAULT_KANBAN,
    isKanbanState,
  );
  const [query, setQuery] = useState('');
  const [newCol, setNewCol] = useState('');
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [status, setStatus] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const today = todayIso();
  // Board helpers return a plain board; re-add the version tag.
  const apply = (f: (s: KanbanState) => Board<KanbanCard>) =>
    setState((s) => ({ ...f(s), version: 1 }));
  const drag = useCardDrag({
    scrollRef,
    onDrop: (id, zone, before) => apply((s) => moveItem(s, id, zone, before)),
  });
  const editCard = editingCard
    ? state.columns.flatMap((c) => c.items).find((c) => c.id === editingCard)
    : undefined;

  const addCol = (e: FormEvent) => {
    e.preventDefault();
    const t = newCol.trim();
    if (!t || state.columns.length >= KANBAN_LIMITS.columns) return;
    apply((s) => addColumn(s, newId(), t.slice(0, KANBAN_LIMITS.column)));
    setNewCol('');
    setStatus(`Added column “${t}”.`);
  };

  const saveRename = () => {
    if (!renaming) return;
    const t = renaming.title.trim();
    if (t) apply((s) => renameColumn(s, renaming.id, t));
    setRenaming(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="kb-search" className={labelBase}>
            Filter cards
          </label>
          <input
            id="kb-search"
            type="search"
            value={query}
            placeholder="Title, description or label"
            onChange={(e) => setQuery(e.target.value)}
            className={inputBase}
          />
        </div>
        <form onSubmit={addCol} className="space-y-1.5">
          <label htmlFor="kb-newcol" className={labelBase}>
            New column
          </label>
          <div className="flex gap-2">
            <input
              id="kb-newcol"
              value={newCol}
              maxLength={KANBAN_LIMITS.column}
              placeholder="e.g. Review"
              onChange={(e) => setNewCol(e.target.value)}
              className={inputBase}
            />
            <button
              type="submit"
              className={btnSecondary}
              disabled={state.columns.length >= KANBAN_LIMITS.columns}
            >
              Add column
            </button>
          </div>
        </form>
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div
        ref={scrollRef}
        className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3"
        aria-label="Kanban board"
        role="region"
      >
        {!state.columns.length && (
          <p className="w-full rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
            No columns yet. Add one above.
          </p>
        )}
        {state.columns.map((col, ci) => {
          const visible = col.items.filter((c) => cardMatches(c, query));
          const over = drag.target?.zone === col.id;
          return (
            <section
              key={col.id}
              aria-labelledby={`kb-col-${col.id}`}
              className={`flex w-[82vw] max-w-[18rem] shrink-0 snap-start flex-col rounded-2xl border border-gray-200 bg-gray-50 p-2.5 sm:w-72 ${over ? 'ring-2 ring-brand-400' : ''}`}
            >
              <header className="mb-2 flex items-center gap-1">
                {renaming?.id === col.id ? (
                  <input
                    autoFocus
                    value={renaming.title}
                    maxLength={KANBAN_LIMITS.column}
                    aria-label="Column name"
                    onChange={(e) =>
                      setRenaming({ id: col.id, title: e.target.value })
                    }
                    onBlur={saveRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename();
                      if (e.key === 'Escape') setRenaming(null);
                    }}
                    className={`${inputBase} !py-1`}
                  />
                ) : (
                  <h2
                    id={`kb-col-${col.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900"
                  >
                    <button
                      type="button"
                      className="max-w-full truncate rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      title="Rename column"
                      aria-label={`${col.title} — rename column`}
                      onClick={() =>
                        setRenaming({ id: col.id, title: col.title })
                      }
                    >
                      {col.title}
                    </button>
                    <span className="ml-1.5 text-xs font-normal tabular-nums text-gray-500">
                      {query
                        ? `${visible.length}/${col.items.length}`
                        : col.items.length}
                    </span>
                  </h2>
                )}
                <button
                  type="button"
                  className={iconBtn}
                  disabled={ci === 0}
                  aria-label={`Move column ${col.title} left`}
                  onClick={() => apply((s) => moveColumn(s, col.id, -1))}
                >
                  ←
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={ci === state.columns.length - 1}
                  aria-label={`Move column ${col.title} right`}
                  onClick={() => apply((s) => moveColumn(s, col.id, 1))}
                >
                  →
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label={`Delete column ${col.title}`}
                  onClick={() => {
                    if (
                      col.items.length &&
                      !window.confirm(
                        `Delete “${col.title}” and its ${col.items.length} card${col.items.length === 1 ? '' : 's'}?`,
                      )
                    )
                      return;
                    apply((s) => deleteColumn(s, col.id));
                    setStatus(`Deleted column “${col.title}”.`);
                  }}
                >
                  ✕
                </button>
              </header>

              <div
                role="list"
                {...drag.zoneProps(col.id)}
                className="min-h-[64px] flex-1 space-y-2"
              >
                {visible.map((card) => {
                  const index = col.items.indexOf(card);
                  const overdue = isOverdue(card, col.title, today);
                  return (
                    <div key={card.id}>
                      <DropLine
                        show={over && drag.target?.beforeId === card.id}
                      />
                      <article
                        role="listitem"
                        {...drag.itemProps(card.id)}
                        aria-label={card.title}
                        className={`rounded-xl border bg-white p-2.5 shadow-sm ${overdue ? 'border-red-300' : 'border-gray-200'} ${drag.dragId === card.id ? 'opacity-40' : ''}`}
                      >
                        <div className="flex items-start gap-1.5">
                          <button
                            type="button"
                            {...drag.handleProps(card.id)}
                            tabIndex={-1}
                            aria-label={`Drag “${card.title}” (or use “Move to”)`}
                            className="cursor-grab select-none rounded px-0.5 text-gray-400 hover:text-gray-700"
                          >
                            ⠿
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCard(card.id)}
                            className="min-w-0 flex-1 break-words rounded text-left text-sm font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                            aria-label={`Edit “${card.title}”`}
                          >
                            {card.title}
                          </button>
                        </div>
                        {card.labels.length > 0 && (
                          <ul className="mt-1.5 flex flex-wrap gap-1">
                            {card.labels.map((l, li) => (
                              <li
                                key={li}
                                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${LABEL_CLASS[l.color]}`}
                              >
                                {l.text}
                              </li>
                            ))}
                          </ul>
                        )}
                        {card.description && (
                          <p className="mt-1.5 line-clamp-3 whitespace-pre-line break-words text-xs text-gray-600">
                            {card.description}
                          </p>
                        )}
                        {card.due && (
                          <p
                            className={`mt-1.5 text-xs ${overdue ? 'font-semibold text-red-700' : 'text-gray-600'}`}
                          >
                            {overdue ? '⚠ Overdue · ' : '📅 Due '}
                            {formatDue(card.due)}
                          </p>
                        )}
                        <div className="no-print mt-2 flex flex-wrap items-center justify-end gap-1">
                          <select
                            value={col.id}
                            aria-label={`Move “${card.title}” to column`}
                            onChange={(e) => {
                              const to = e.target.value;
                              apply((s) => moveItem(s, card.id, to, null));
                              setStatus(
                                `Moved “${card.title}” to ${state.columns.find((c) => c.id === to)?.title ?? ''}.`,
                              );
                            }}
                            className="h-7 max-w-[9rem] rounded-lg border border-gray-200 bg-white px-1.5 text-xs text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          >
                            {state.columns.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.id === col.id
                                  ? `In: ${c.title}`
                                  : `Move to ${c.title}`}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className={iconBtn}
                            disabled={index === 0}
                            aria-label={`Move “${card.title}” up`}
                            onClick={() =>
                              apply((s) => shiftItem(s, card.id, -1))
                            }
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={iconBtn}
                            disabled={index === col.items.length - 1}
                            aria-label={`Move “${card.title}” down`}
                            onClick={() =>
                              apply((s) => shiftItem(s, card.id, 1))
                            }
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className={iconBtn}
                            aria-label={`Delete “${card.title}”`}
                            onClick={() => {
                              if (window.confirm(`Delete “${card.title}”?`))
                                apply((s) => removeItem(s, card.id));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </article>
                    </div>
                  );
                })}
                <DropLine show={over && drag.target?.beforeId === null} />
                {!visible.length && (
                  <p className="rounded-xl border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500">
                    {query && col.items.length
                      ? 'No matching cards'
                      : 'Drop cards here'}
                  </p>
                )}
              </div>
              <AddCard
                onAdd={(title) => {
                  if (col.items.length >= KANBAN_LIMITS.cards) return;
                  apply((s) =>
                    addItem(s, col.id, {
                      id: newId(),
                      title,
                      description: '',
                      labels: [],
                      due: '',
                    }),
                  );
                  setStatus(`Added “${title}” to ${col.title}.`);
                }}
              />
            </section>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        Drag cards with the mouse, or drag the ⠿ handle on a touch screen.
        Without dragging, use a card’s “Move to” menu and ↑ ↓ buttons. Click a
        card title to edit its description, labels and due date; click a column
        name to rename it.
      </p>

      {editCard && (
        <CardDialog
          key={editCard.id}
          card={editCard}
          onClose={() => setEditingCard(null)}
          onSave={(c) => {
            apply((s) => updateItem(s, c.id, c));
            setEditingCard(null);
          }}
          onDelete={() => {
            apply((s) => removeItem(s, editCard.id));
            setEditingCard(null);
          }}
        />
      )}

      <LocalDataBar
        tool="kanban-board"
        state={state}
        guard={isKanbanState}
        onImport={setState}
        onClear={() => setState(emptyBoard())}
        clearConfirm="Delete every card and reset the board to To Do / In Progress / Done? This can’t be undone."
      />
    </div>
  );
}
