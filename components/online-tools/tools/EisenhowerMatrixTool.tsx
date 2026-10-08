'use client';

import { useState, type FormEvent } from 'react';
import type { ToolProps } from '../ToolRenderer';
import { btnPrimary, btnSecondary, inputBase, labelBase } from '../ui';
import { newId, useStoredState } from './playground-shared';
import { DropLine, LocalDataBar, useCardDrag } from './productivity-shared';
import {
  MATRIX_TASK_MAX,
  QUADRANTS,
  addItem,
  emptyEisenhower,
  isEisenhowerState,
  moveItem,
  removeItem,
  removeItemsWhere,
  shiftItem,
  updateItem,
  type Board,
  type EisenhowerState,
  type MatrixTask,
  type QuadrantId,
} from '@/lib/online-tools/engines/task-board';

const KEY = 'emojar:eisenhower-matrix:v1';
const iconBtn =
  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-30';
const TONE: Record<QuadrantId, string> = {
  do: 'border-red-200 bg-red-50/40',
  schedule: 'border-emerald-200 bg-emerald-50/40',
  delegate: 'border-amber-200 bg-amber-50/40',
  eliminate: 'border-gray-200 bg-gray-50',
};

export default function EisenhowerMatrixTool(_: ToolProps) {
  const [state, setState] = useStoredState<EisenhowerState>(
    KEY,
    emptyEisenhower,
    isEisenhowerState,
  );
  const [text, setText] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantId>('do');
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(
    null,
  );
  const [status, setStatus] = useState('');
  // Board helpers return a plain board; re-add the version tag.
  const apply = (f: (s: EisenhowerState) => Board<MatrixTask>) =>
    setState((s) => ({ ...f(s), version: 1 }));

  const drag = useCardDrag({
    onDrop: (id, zone, before) => apply((s) => moveItem(s, id, zone, before)),
  });

  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    apply((s) => addItem(s, quadrant, { id: newId(), text: t, done: false }));
    setText('');
    setStatus(
      `Added to ${QUADRANTS.find((q) => q.id === quadrant)?.title ?? ''}.`,
    );
  };

  const saveEdit = () => {
    if (!editing) return;
    const t = editing.text.trim();
    if (t) apply((s) => updateItem(s, editing.id, { text: t }));
    setEditing(null);
  };

  const doneCount = state.columns.reduce(
    (n, c) => n + c.items.filter((i) => i.done).length,
    0,
  );

  const task = (t: MatrixTask, qi: number, index: number, total: number) => {
    const q = QUADRANTS[qi];
    const isEditing = editing?.id === t.id;
    const dragged = drag.dragId === t.id;
    return (
      <div
        role="listitem"
        {...drag.itemProps(t.id)}
        className={`rounded-xl border border-gray-200 bg-white p-2 shadow-sm ${dragged ? 'opacity-40' : ''}`}
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            {...drag.handleProps(t.id)}
            className="mt-0.5 cursor-grab select-none rounded px-1 text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Drag “${t.text}” (or use “Move to”)`}
            tabIndex={-1}
          >
            ⠿
          </button>
          <input
            type="checkbox"
            checked={t.done}
            onChange={(e) =>
              apply((s) => updateItem(s, t.id, { done: e.target.checked }))
            }
            aria-label={`Mark “${t.text}” as done`}
            className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          {isEditing ? (
            <input
              autoFocus
              value={editing.text}
              maxLength={MATRIX_TASK_MAX}
              aria-label="Edit task"
              onChange={(e) => setEditing({ id: t.id, text: e.target.value })}
              onBlur={saveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') setEditing(null);
              }}
              className={`${inputBase} !py-1`}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditing({ id: t.id, text: t.text })}
              className={`min-w-0 flex-1 break-words rounded text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${t.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}
              aria-label={`Edit “${t.text}”`}
            >
              {t.text}
              {t.done && (
                <span className="ml-2 rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 no-underline">
                  done
                </span>
              )}
            </button>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-end gap-1">
          <select
            value={q.id}
            aria-label={`Move “${t.text}” to quadrant`}
            onChange={(e) =>
              apply((s) => moveItem(s, t.id, e.target.value, null))
            }
            className="h-7 rounded-lg border border-gray-200 bg-white px-1.5 text-xs text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {QUADRANTS.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id === q.id ? `In: ${x.title}` : `Move to ${x.title}`}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={iconBtn}
            disabled={index === 0}
            aria-label={`Move “${t.text}” up`}
            onClick={() => apply((s) => shiftItem(s, t.id, -1))}
          >
            ↑
          </button>
          <button
            type="button"
            className={iconBtn}
            disabled={index === total - 1}
            aria-label={`Move “${t.text}” down`}
            onClick={() => apply((s) => shiftItem(s, t.id, 1))}
          >
            ↓
          </button>
          <button
            type="button"
            className={iconBtn}
            aria-label={`Delete “${t.text}”`}
            onClick={() => apply((s) => removeItem(s, t.id))}
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="space-y-1.5">
          <label htmlFor="em-task" className={labelBase}>
            New task
          </label>
          <input
            id="em-task"
            value={text}
            maxLength={MATRIX_TASK_MAX}
            placeholder="e.g. Reply to the landlord"
            onChange={(e) => setText(e.target.value)}
            className={inputBase}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="em-quadrant" className={labelBase}>
            Quadrant
          </label>
          <select
            id="em-quadrant"
            value={quadrant}
            onChange={(e) => setQuadrant(e.target.value as QuadrantId)}
            className={inputBase}
          >
            {QUADRANTS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} — {q.subtitle}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={`${btnPrimary} self-end`}>
          Add task
        </button>
      </form>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {state.columns.map((col, qi) => {
          const q = QUADRANTS[qi];
          const open = col.items.filter((i) => !i.done).length;
          const over = drag.target?.zone === col.id;
          return (
            <section
              key={col.id}
              aria-labelledby={`em-${col.id}`}
              className={`flex min-h-[180px] flex-col rounded-2xl border-2 p-3 ${TONE[q.id]} ${over ? 'ring-2 ring-indigo-400' : ''}`}
            >
              <header className="mb-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2
                    id={`em-${col.id}`}
                    className="text-base font-semibold text-gray-900"
                  >
                    {qi + 1}. {q.title}
                  </h2>
                  <span className="shrink-0 text-xs tabular-nums text-gray-600">
                    {open} open
                    {col.items.length > open &&
                      ` · ${col.items.length - open} done`}
                  </span>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                  {q.subtitle}
                </p>
                <p className="text-xs text-gray-500">{q.hint}</p>
              </header>
              <div
                role="list"
                {...drag.zoneProps(col.id)}
                className="flex-1 space-y-2"
              >
                {col.items.map((t, i) => (
                  <div key={t.id}>
                    <DropLine show={over && drag.target?.beforeId === t.id} />
                    {task(t, qi, i, col.items.length)}
                  </div>
                ))}
                <DropLine show={over && drag.target?.beforeId === null} />
                {!col.items.length && (
                  <p className="rounded-xl border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-500">
                    No tasks. Add one above or drag one here.
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={!doneCount}
          onClick={() => {
            apply((s) => removeItemsWhere(s, (t) => t.done));
            setStatus(
              `Removed ${doneCount} completed task${doneCount === 1 ? '' : 's'}.`,
            );
          }}
        >
          Clear completed ({doneCount})
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Drag tasks with the mouse, or drag the ⠿ handle on a touch screen.
        Without dragging, use each task’s “Move to” menu and ↑ ↓ buttons. Click
        a task to edit it.
      </p>

      <LocalDataBar
        tool="eisenhower-matrix"
        state={state}
        guard={isEisenhowerState}
        onImport={setState}
        onClear={() => setState(emptyEisenhower())}
        clearConfirm="Delete every task in all four quadrants? This can’t be undone."
      />
    </div>
  );
}
