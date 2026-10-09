'use client';

// Shared UI for the local-only productivity tools (decision matrix,
// Eisenhower matrix, Kanban board, timeline): the "saved in this browser"
// bar with JSON export/import and Clear all, a print stylesheet that prints
// only one element, and card drag-and-drop for mouse (HTML5) and touch/pen
// (pointer events).

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { ErrorMessage, Notice, btnSecondary, downloadBlob } from '../ui';
import {
  MAX_IMPORT_BYTES,
  parseJsonImport,
  toExportJson,
} from '@/lib/online-tools/engines/local-data';

/**
 * Privacy note plus Export JSON / Import JSON / Clear all. Imported files are
 * parsed and validated, never executed; a bad file changes nothing.
 */
export function LocalDataBar<T extends object>({
  tool,
  state,
  guard,
  onImport,
  onClear,
  clearLabel = 'Clear all',
  clearConfirm,
  extra,
}: {
  tool: string;
  state: T;
  guard: (v: unknown) => v is T;
  onImport: (v: T) => void;
  onClear: () => void;
  clearLabel?: string;
  clearConfirm: string;
  extra?: ReactNode;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const importFile = async (file: File) => {
    setError('');
    setStatus('');
    if (file.size > MAX_IMPORT_BYTES) {
      setError('That file is too large to import (max 2 MB).');
      return;
    }
    let text = '';
    try {
      text = await file.text();
    } catch {
      setError('The file couldn’t be read.');
      return;
    }
    const res = parseJsonImport(text, tool, guard);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onImport(res.value);
    setStatus(`Imported “${file.name}”.`);
  };

  return (
    <div className="no-print space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            downloadBlob(
              toExportJson(tool, state),
              `${tool}.json`,
              'application/json',
            );
            setStatus('Exported as JSON.');
          }}
        >
          ⬇ Export JSON
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => fileRef.current?.click()}
        >
          ⬆ Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Import a JSON file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) void importFile(f);
          }}
        />
        {extra}
        <button
          type="button"
          className={`${btnSecondary} text-red-700`}
          onClick={() => {
            if (window.confirm(clearConfirm)) {
              onClear();
              setError('');
              setStatus('Cleared.');
            }
          }}
        >
          {clearLabel}
        </button>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <p className="text-xs text-gray-500" aria-live="polite">
        🔒 Saved only in this browser (localStorage) — nothing is uploaded.
        Clearing site data deletes it, so export a JSON backup to keep it or
        move it to another device.
        {status && <span className="ml-1 text-gray-700">{status}</span>}
      </p>
    </div>
  );
}

/**
 * Print stylesheet that hides the rest of the page and prints only the
 * element with `id`. Inside it, `.no-print` is hidden and `.print-overflow`
 * boxes drop their scrolling so wide tables print in full.
 */
export function PrintOnly({ id }: { id: string }) {
  const css = `@media print{body *{visibility:hidden!important}#${id},#${id} *{visibility:visible!important}#${id}{position:absolute;left:0;top:0;width:100%;}#${id} .no-print{display:none!important}#${id} .print-overflow{overflow:visible!important;max-height:none!important}}`;
  return <style>{css}</style>;
}

export function StatusNotice({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <Notice tone="amber">{children}</Notice>;
}

// ---------------------------------------------------------------- drag

export type DropTarget = { zone: string; beforeId: string | null };

/**
 * Finds the drop zone under a point and the item the dragged one would be
 * inserted before. Zones are elements with `data-drop-zone`, items inside
 * them have `data-drag-item`; items are assumed to be stacked vertically.
 */
function targetAt(x: number, y: number, dragId: string): DropTarget | null {
  const el = document.elementFromPoint(x, y);
  const zone = el?.closest<HTMLElement>('[data-drop-zone]');
  if (!zone) return null;
  const items = Array.from(
    zone.querySelectorAll<HTMLElement>('[data-drag-item]'),
  ).filter((i) => i.dataset.dragItem !== dragId);
  const before = items.find((i) => {
    const r = i.getBoundingClientRect();
    return y < r.top + r.height / 2;
  });
  return {
    zone: zone.dataset.dropZone ?? '',
    beforeId: before?.dataset.dragItem ?? null,
  };
}

/**
 * Drag-and-drop for cards between and within zones. Mouse uses native
 * HTML5 drag; touch and pen use pointer events on a drag handle (native
 * drag doesn't work on most touch browsers). Every use must also offer a
 * non-drag way to move items.
 */
export function useCardDrag({
  onDrop,
  scrollRef,
}: {
  onDrop: (itemId: string, zone: string, beforeId: string | null) => void;
  /** Horizontal scroller to auto-scroll while touch-dragging near its edges. */
  scrollRef?: RefObject<HTMLElement | null>;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);
  const drop = useRef(onDrop);
  drop.current = onDrop;
  const live = useRef<{ id: string; pointer: number } | null>(null);
  const targetRef = useRef<DropTarget | null>(null);

  const update = useCallback((t: DropTarget | null) => {
    const prev = targetRef.current;
    if (prev?.zone === t?.zone && prev?.beforeId === t?.beforeId) return;
    targetRef.current = t;
    setTarget(t);
  }, []);

  const finish = useCallback(
    (commit: boolean) => {
      const id = live.current?.id ?? dragId;
      const t = targetRef.current;
      if (commit && id && t) drop.current(id, t.zone, t.beforeId);
      live.current = null;
      targetRef.current = null;
      setDragId(null);
      setTarget(null);
    },
    [dragId],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const l = live.current;
      if (!l || e.pointerId !== l.pointer) return;
      e.preventDefault();
      update(targetAt(e.clientX, e.clientY, l.id));
      const sc = scrollRef?.current;
      if (sc) {
        const r = sc.getBoundingClientRect();
        if (e.clientX < r.left + 40) sc.scrollLeft -= 14;
        else if (e.clientX > r.right - 40) sc.scrollLeft += 14;
      }
    };
    const up = (e: PointerEvent) => {
      if (live.current?.pointer === e.pointerId) finish(true);
    };
    const cancel = (e: PointerEvent) => {
      if (live.current?.pointer === e.pointerId) finish(false);
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [finish, update, scrollRef]);

  /** Spread on each draggable item (mouse / HTML5 drag). */
  const itemProps = (id: string) => ({
    'data-drag-item': id,
    draggable: true,
    onDragStart: (e: DragEvent) => {
      // Let text inputs inside the card keep normal text selection.
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = 'move';
      // Firefox only starts a drag when some data is set.
      e.dataTransfer.setData('text/plain', id);
      setDragId(id);
    },
    onDragEnd: () => finish(false),
  });

  /** Spread on each drop zone (column / quadrant). */
  const zoneProps = (zone: string) => ({
    'data-drop-zone': zone,
    onDragOver: (e: DragEvent) => {
      if (!dragId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      update(targetAt(e.clientX, e.clientY, dragId));
    },
    onDrop: (e: DragEvent) => {
      if (!dragId) return;
      e.preventDefault();
      update(targetAt(e.clientX, e.clientY, dragId));
      finish(true);
    },
  });

  /** Spread on a drag handle button for touch and pen. */
  const handleProps = (id: string) => ({
    style: { touchAction: 'none' as const },
    onPointerDown: (e: ReactPointerEvent) => {
      if (e.pointerType === 'mouse') return;
      e.preventDefault();
      live.current = { id, pointer: e.pointerId };
      setDragId(id);
    },
  });

  return { dragId, target, itemProps, zoneProps, handleProps };
}

/** Thin line showing where a dragged card will land. */
export function DropLine({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      aria-hidden
      className="my-1 h-1 rounded-full bg-brand-500 motion-safe:animate-pulse"
    />
  );
}
