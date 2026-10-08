'use client';

// Chess position editor: place, move and remove pieces, set the FEN
// metadata and convert between the board and a FEN string. Pieces can be
// dragged (mouse or touch), clicked square-to-square, or moved with the
// keyboard (arrows + Enter), so dragging is never required.

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  PIECES,
  START_FEN,
  castlingPossible,
  colorOf,
  emptyPosition,
  epCandidates,
  movePiece,
  parseFen,
  pieceName,
  squareName,
  startPosition,
  toFen,
  validatePosition,
  type Castling,
  type Color,
  type Piece,
  type Position,
} from '@/lib/online-tools/engines/fen';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  Notice,
  NumberField,
  SelectField,
  btnPrimary,
  btnSecondary,
  inputBase,
  labelBase,
} from '../ui';

type Tool = 'move' | 'delete' | Piece;

/**
 * Solid glyphs for both colours (styled white or black), with U+FE0E so
 * phones don't swap the pawn for an emoji.
 */
const SOLID: Record<string, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};
const glyph = (p: Piece) => `${SOLID[p.toLowerCase()]}︎`;

const WHITE_STYLE = {
  color: '#fff',
  textShadow:
    '0 0 1px #111, 1px 0 0 #111, -1px 0 0 #111, 0 1px 0 #111, 0 -1px 0 #111, 0 2px 3px rgba(0,0,0,.35)',
};
const BLACK_STYLE = {
  color: '#111',
  textShadow: '0 0 1px #fff, 0 2px 3px rgba(0,0,0,.25)',
};

function PieceGlyph({
  piece,
  className = '',
}: {
  piece: Piece;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`select-none leading-none ${className}`}
      style={colorOf(piece) === 'w' ? WHITE_STYLE : BLACK_STYLE}
    >
      {glyph(piece)}
    </span>
  );
}

const CASTLING: { key: keyof Castling; label: string }[] = [
  { key: 'K', label: 'White O-O (K)' },
  { key: 'Q', label: 'White O-O-O (Q)' },
  { key: 'k', label: 'Black O-O (k)' },
  { key: 'q', label: 'Black O-O-O (q)' },
];

export default function FenChessboardTool(_: ToolProps) {
  const [pos, setPos] = useState<Position>(startPosition);
  const [flipped, setFlipped] = useState(false);
  const [tool, setTool] = useState<Tool>('move');
  const [picked, setPicked] = useState<number | null>(null);
  const [cursor, setCursor] = useState(52); // e2
  const [fenInput, setFenInput] = useState(START_FEN);
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [drag, setDrag] = useState<{
    piece: Piece;
    x: number;
    y: number;
  } | null>(null);
  const squareRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragRef = useRef<{
    from: number;
    id: number;
    x: number;
    y: number;
    active: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const fenId = useId();

  const fen = useMemo(() => toFen(pos), [pos]);
  const warnings = useMemo(() => validatePosition(pos), [pos]);
  const candidates = useMemo(
    () => epCandidates(pos.board, pos.turn),
    [pos.board, pos.turn],
  );
  const possible = useMemo(() => castlingPossible(pos.board), [pos.board]);

  const setBoard = (board: Position['board']) =>
    setPos((p) => ({
      ...p,
      board,
      // An en-passant square stops making sense once the pawns move.
      ep: p.ep && epCandidates(board, p.turn).includes(p.ep) ? p.ep : null,
    }));

  const load = (p: Position, message: string) => {
    setPos(p);
    setPicked(null);
    setFenInput(toFen(p));
    setInputErrors([]);
    setStatus(message);
  };

  const loadFen = (text: string) => {
    const r = parseFen(text);
    if (!r.ok) {
      setInputErrors(r.errors);
      setStatus('FEN not loaded — see the errors below the box.');
      return;
    }
    setPos(r.position);
    setPicked(null);
    setInputErrors([]);
    setStatus('FEN loaded.');
  };

  // Board edits update the FEN box unless the user is mid-way through typing an invalid one.
  useEffect(() => {
    if (!inputErrors.length) setFenInput(fen);
  }, [fen, inputErrors.length]);

  const toDisplay = (index: number) => (flipped ? 63 - index : index);

  const activate = (index: number) => {
    const piece = pos.board[index];
    const name = squareName(index);
    if (tool === 'delete') {
      if (piece) {
        const next = [...pos.board];
        next[index] = null;
        setBoard(next);
        setStatus(`Removed ${pieceName(piece)} from ${name}.`);
      }
      return;
    }
    if (tool !== 'move') {
      const next = [...pos.board];
      const removing = piece === tool;
      next[index] = removing ? null : tool;
      setBoard(next);
      setStatus(
        removing
          ? `Removed ${pieceName(tool)} from ${name}.`
          : `Placed ${pieceName(tool)} on ${name}.`,
      );
      return;
    }
    if (picked === null) {
      if (piece) {
        setPicked(index);
        setStatus(
          `Picked up ${pieceName(piece)} from ${name}. Choose a square to drop it.`,
        );
      }
      return;
    }
    if (picked === index) {
      setPicked(null);
      setStatus('Put the piece back.');
      return;
    }
    const moving = pos.board[picked];
    setBoard(movePiece(pos.board, picked, index));
    setPicked(null);
    if (moving)
      setStatus(
        `Moved ${pieceName(moving)} from ${squareName(picked)} to ${name}${piece ? `, capturing the ${pieceName(piece)}` : ''}.`,
      );
  };

  const onSquareKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const d = toDisplay(index);
    let r = Math.floor(d / 8);
    let c = d % 8;
    if (e.key === 'ArrowUp') r = Math.max(0, r - 1);
    else if (e.key === 'ArrowDown') r = Math.min(7, r + 1);
    else if (e.key === 'ArrowLeft') c = Math.max(0, c - 1);
    else if (e.key === 'ArrowRight') c = Math.min(7, c + 1);
    else if (e.key === 'Home') c = 0;
    else if (e.key === 'End') c = 7;
    else if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      pos.board[index]
    ) {
      e.preventDefault();
      const next = [...pos.board];
      const removed = next[index]!;
      next[index] = null;
      setBoard(next);
      if (picked === index) setPicked(null);
      setStatus(`Removed ${pieceName(removed)} from ${squareName(index)}.`);
      return;
    } else if (e.key === 'Escape' && picked !== null) {
      setPicked(null);
      setStatus('Put the piece back.');
      return;
    } else return;
    e.preventDefault();
    const target = toDisplay(r * 8 + c);
    setCursor(target);
    squareRefs.current[target]?.focus();
  };

  // ------------------------------------------------------------ dragging

  const onPointerDown = (
    e: ReactPointerEvent<HTMLButtonElement>,
    index: number,
  ) => {
    suppressClick.current = false;
    if (tool !== 'move' || !pos.board[index] || e.button !== 0) return;
    dragRef.current = {
      from: index,
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      active: false,
    };
  };

  // Window listeners are attached once; they read the latest board and
  // setter through this ref.
  const latest = useRef({ board: pos.board, setBoard });
  latest.current = { board: pos.board, setBoard };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.id) return;
      if (!d.active && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
      d.active = true;
      const piece = latest.current.board[d.from];
      if (piece) setDrag({ piece, x: e.clientX, y: e.clientY });
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.id) return;
      dragRef.current = null;
      if (!d.active) return;
      setDrag(null);
      // Swallow the click that follows this pointerup, but not later keyboard clicks.
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
      const { board, setBoard: commit } = latest.current;
      const el = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>('[data-square]');
      const to = el ? Number(el.dataset.square) : -1;
      const piece = board[d.from];
      if (to < 0 || to === d.from || !piece) {
        setStatus(piece ? 'Dropped outside the board — nothing moved.' : '');
        return;
      }
      const captured = board[to];
      commit(movePiece(board, d.from, to));
      setPicked(null);
      setCursor(to);
      setStatus(
        `Moved ${pieceName(piece)} from ${squareName(d.from)} to ${squareName(to)}${captured ? `, capturing the ${pieceName(captured)}` : ''}.`,
      );
    };
    const cancel = (e: PointerEvent) => {
      if (dragRef.current?.id !== e.pointerId) return;
      dragRef.current = null;
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, []);

  // ---------------------------------------------------------------- UI

  const pasteFen = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFenInput(text.trim());
      loadFen(text);
    } catch {
      setStatus(
        'Clipboard access was blocked — paste the FEN into the box below instead.',
      );
      document.getElementById(fenId)?.focus();
    }
  };

  const setTurn = (turn: Color) =>
    setPos((p) => ({
      ...p,
      turn,
      ep: p.ep && epCandidates(p.board, turn).includes(p.ep) ? p.ep : null,
    }));

  const epOptions = [
    { value: '-', label: '— none' },
    ...candidates.map((c) => ({ value: c, label: c })),
    ...(pos.ep && !candidates.includes(pos.ep)
      ? [{ value: pos.ep, label: `${pos.ep} (not valid here)` }]
      : []),
  ];

  const order = Array.from({ length: 64 }, (_, d) => toDisplay(d));

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        <div className="space-y-3">
          <div
            role="group"
            aria-label={`Chess board, ${flipped ? 'black' : 'white'} at the bottom. Arrow keys move between squares, Enter picks up or drops a piece, Delete removes one.`}
            className="mx-auto grid aspect-square w-full max-w-[480px] select-none grid-cols-8 overflow-hidden rounded-xl border-2 border-gray-800 shadow"
          >
            {order.map((index, d) => {
              const piece = pos.board[index];
              const r = Math.floor(d / 8);
              const c = d % 8;
              const dark = (Math.floor(index / 8) + (index % 8)) % 2 === 1;
              const name = squareName(index);
              const isPicked = picked === index;
              const dragging = drag && dragRef.current?.from === index;
              return (
                <button
                  key={index}
                  ref={(el) => {
                    squareRefs.current[index] = el;
                  }}
                  type="button"
                  data-square={index}
                  tabIndex={cursor === index ? 0 : -1}
                  aria-label={`${name}, ${piece ? pieceName(piece) : 'empty'}${isPicked ? ', picked up' : ''}`}
                  aria-pressed={isPicked}
                  onFocus={() => setCursor(index)}
                  onKeyDown={(e) => onSquareKey(e, index)}
                  onPointerDown={(e) => onPointerDown(e, index)}
                  onClick={() => {
                    if (suppressClick.current) {
                      suppressClick.current = false;
                      return;
                    }
                    setCursor(index);
                    activate(index);
                  }}
                  className={`relative flex items-center justify-center focus:outline-none focus-visible:z-10 focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-500 ${dark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'}`}
                  style={{
                    touchAction:
                      tool === 'move' && piece ? 'none' : 'manipulation',
                  }}
                >
                  {isPicked && (
                    <span
                      aria-hidden
                      className="absolute inset-0 ring-4 ring-inset ring-amber-400"
                    />
                  )}
                  {c === 0 && (
                    <span
                      aria-hidden
                      className={`absolute left-0.5 top-0 text-[10px] font-semibold sm:text-xs ${dark ? 'text-[#f0d9b5]' : 'text-[#b58863]'}`}
                    >
                      {name[1]}
                    </span>
                  )}
                  {r === 7 && (
                    <span
                      aria-hidden
                      className={`absolute bottom-0 right-1 text-[10px] font-semibold sm:text-xs ${dark ? 'text-[#f0d9b5]' : 'text-[#b58863]'}`}
                    >
                      {name[0]}
                    </span>
                  )}
                  {piece && (
                    <PieceGlyph
                      piece={piece}
                      className={`text-[9vw] sm:text-[2.6rem] lg:text-[2.75rem] ${dragging ? 'opacity-30' : ''}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {drag && (
            <div
              aria-hidden
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
              style={{ left: drag.x, top: drag.y }}
            >
              <PieceGlyph piece={drag.piece} className="text-5xl" />
            </div>
          )}
          <p
            className="min-h-[1.25rem] text-sm text-gray-700"
            aria-live="polite"
          >
            {status}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setFlipped((f) => !f)}
            >
              ⇅ Flip board
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => load(startPosition(), 'Start position set.')}
            >
              Start position
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => load(emptyPosition(), 'Board cleared.')}
            >
              Empty board
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                load(startPosition(), 'Everything reset.');
                setFlipped(false);
                setTool('move');
                setCursor(52);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <fieldset className="space-y-2">
            <legend className={labelBase}>Tool</legend>
            <div className="flex flex-wrap gap-1.5">
              {(['move', 'delete'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tool === t}
                  onClick={() => {
                    setTool(t);
                    setPicked(null);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${tool === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {t === 'move' ? '✥ Move' : '✕ Delete'}
                </button>
              ))}
            </div>
            <div
              className="grid grid-cols-6 gap-1.5"
              role="group"
              aria-label="Place a piece"
            >
              {PIECES.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={tool === p}
                  aria-label={`Place ${pieceName(p)}`}
                  title={pieceName(p)}
                  onClick={() => {
                    setTool(p);
                    setPicked(null);
                  }}
                  className={`flex aspect-square items-center justify-center rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${tool === p ? 'border-indigo-500 bg-indigo-100 ring-2 ring-indigo-400' : 'border-gray-200 bg-[#f0d9b5] hover:brightness-95'}`}
                >
                  <PieceGlyph piece={p} className="text-3xl" />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {tool === 'move'
                ? 'Drag a piece, or click it and then click where it should go.'
                : tool === 'delete'
                  ? 'Click pieces to remove them.'
                  : `Click squares to place a ${pieceName(tool).toLowerCase()}; click it again to remove it.`}
            </p>
          </fieldset>

          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              label="Side to move"
              value={pos.turn}
              onChange={(v) => setTurn(v === 'b' ? 'b' : 'w')}
              options={[
                { value: 'w', label: 'White' },
                { value: 'b', label: 'Black' },
              ]}
            />
            <SelectField
              label="En-passant square"
              value={pos.ep ?? '-'}
              onChange={(v) =>
                setPos((p) => ({ ...p, ep: v === '-' ? null : v }))
              }
              options={epOptions}
            />
            <NumberField
              label="Halfmove clock"
              value={pos.halfmove}
              min={0}
              step={1}
              onChange={(v) =>
                setPos((p) => ({
                  ...p,
                  halfmove: Math.max(0, Math.floor(Number(v)) || 0),
                }))
              }
              help="Moves since the last capture or pawn move (50-move rule)."
            />
            <NumberField
              label="Fullmove number"
              value={pos.fullmove}
              min={1}
              step={1}
              onChange={(v) =>
                setPos((p) => ({
                  ...p,
                  fullmove: Math.max(1, Math.floor(Number(v)) || 1),
                }))
              }
            />
          </div>
          <fieldset>
            <legend className={labelBase}>Castling rights</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CASTLING.map(({ key, label }) => (
                <label
                  key={key}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={pos.castling[key]}
                    onChange={(e) =>
                      setPos((p) => ({
                        ...p,
                        castling: { ...p.castling, [key]: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {label}
                  {!possible[key] && (
                    <span className="text-xs text-gray-400">
                      (pieces not in place)
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900">FEN</h2>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={fen} label="Copy FEN" />
            <button type="button" className={btnSecondary} onClick={pasteFen}>
              Paste FEN
            </button>
          </div>
        </div>
        <output
          className="block break-all rounded-xl bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100"
          aria-label="Current FEN"
        >
          {fen}
        </output>
        {warnings.length > 0 && (
          <Notice tone="amber">
            <p className="font-medium">
              This position couldn’t occur in a real game:
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Notice>
        )}
      </div>

      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          loadFen(fenInput);
        }}
      >
        <label htmlFor={fenId} className={labelBase}>
          Load a FEN
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={fenId}
            value={fenInput}
            onChange={(e) => setFenInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={inputErrors.length > 0}
            className={`${inputBase} font-mono`}
          />
          <button type="submit" className={btnPrimary}>
            Load
          </button>
        </div>
        {inputErrors.length > 0 && (
          <ErrorMessage>
            <ul className="list-disc space-y-0.5 pl-5">
              {inputErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </ErrorMessage>
        )}
      </form>
    </div>
  );
}
