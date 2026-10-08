// FEN (Forsyth–Edwards Notation) parsing, serialising and sanity checks for
// the chess board editor. No move legality — only whether the position
// described is self-consistent.

export type Piece =
  | 'K'
  | 'Q'
  | 'R'
  | 'B'
  | 'N'
  | 'P'
  | 'k'
  | 'q'
  | 'r'
  | 'b'
  | 'n'
  | 'p';
export type Color = 'w' | 'b';
export type Castling = { K: boolean; Q: boolean; k: boolean; q: boolean };

/** 64 squares, index 0 = a8, 7 = h8, 56 = a1, 63 = h1 (FEN order). */
export type Board = (Piece | null)[];

export type Position = {
  board: Board;
  turn: Color;
  castling: Castling;
  ep: string | null;
  halfmove: number;
  fullmove: number;
};

export const START_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export const PIECES: Piece[] = [
  'K',
  'Q',
  'R',
  'B',
  'N',
  'P',
  'k',
  'q',
  'r',
  'b',
  'n',
  'p',
];

export const PIECE_GLYPH: Record<Piece, string> = {
  K: '♔',
  Q: '♕',
  R: '♖',
  B: '♗',
  N: '♘',
  P: '♙',
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

const NAMES: Record<string, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
};

export function pieceName(p: Piece): string {
  return `${colorOf(p) === 'w' ? 'White' : 'Black'} ${NAMES[p.toLowerCase()]}`;
}

export function colorOf(p: Piece): Color {
  return p === p.toUpperCase() ? 'w' : 'b';
}

export const FILES = 'abcdefgh';

export function squareName(index: number): string {
  return `${FILES[index % 8]}${8 - Math.floor(index / 8)}`;
}

export function squareIndex(name: string): number {
  const m = /^([a-h])([1-8])$/.exec(name);
  if (!m) return -1;
  return (8 - Number(m[2])) * 8 + FILES.indexOf(m[1]);
}

const isPiece = (c: string): c is Piece => (PIECES as string[]).includes(c);

export type ParseResult =
  | { ok: true; position: Position; warnings: string[] }
  | { ok: false; errors: string[] };

/**
 * Parses a FEN string. Syntax errors make it fail; a position that parses
 * but can't arise in a game (two white kings, pawns on the back rank…) is
 * returned with warnings so it can still be edited. Missing trailing fields
 * get the usual defaults, since many sites shorten FENs.
 */
export function parseFen(fen: string): ParseResult {
  const errors: string[] = [];
  const fields = fen.trim().split(/\s+/);
  if (!fen.trim()) return { ok: false, errors: ['Enter a FEN string.'] };
  if (fields.length > 6)
    errors.push(
      `Expected at most 6 fields separated by spaces, found ${fields.length}.`,
    );
  const [
    placement,
    turn = 'w',
    castling = '-',
    ep = '-',
    half = '0',
    full = '1',
  ] = fields;

  const board: Board = [];
  const ranks = placement.split('/');
  if (ranks.length !== 8)
    errors.push(
      `The board needs 8 ranks separated by “/”, found ${ranks.length}.`,
    );
  ranks.forEach((rank, r) => {
    let width = 0;
    let previousDigit = false;
    for (const c of rank) {
      if (/[1-8]/.test(c)) {
        if (previousDigit)
          errors.push(
            `Rank ${8 - r} has two digits in a row (“${rank}”) — combine them.`,
          );
        width += Number(c);
        for (let i = 0; i < Number(c); i++) board.push(null);
        previousDigit = true;
      } else if (isPiece(c)) {
        width++;
        board.push(c);
        previousDigit = false;
      } else {
        errors.push(`Rank ${8 - r} contains an invalid character “${c}”.`);
        previousDigit = false;
      }
    }
    if (width !== 8)
      errors.push(
        `Rank ${8 - r} (“${rank}”) covers ${width} squares instead of 8.`,
      );
  });

  if (turn !== 'w' && turn !== 'b')
    errors.push(`Side to move must be “w” or “b”, not “${turn}”.`);
  if (castling !== '-' && !/^(?!.*(.).*\1)[KQkq]{1,4}$/.test(castling))
    errors.push(
      `Castling rights “${castling}” must be “-” or a combination of K, Q, k and q.`,
    );
  if (ep !== '-' && !/^[a-h][36]$/.test(ep))
    errors.push(
      `En-passant square “${ep}” must be “-” or a square on rank 3 or 6.`,
    );
  if (!/^\d+$/.test(half))
    errors.push(`Halfmove clock “${half}” must be a whole number.`);
  if (!/^\d+$/.test(full) || Number(full) < 1)
    errors.push(
      `Fullmove number “${full}” must be a whole number of at least 1.`,
    );

  if (errors.length || board.length !== 64) return { ok: false, errors };
  const position: Position = {
    board,
    turn: turn as Color,
    castling: {
      K: castling.includes('K'),
      Q: castling.includes('Q'),
      k: castling.includes('k'),
      q: castling.includes('q'),
    },
    ep: ep === '-' ? null : ep,
    halfmove: Number(half),
    fullmove: Number(full),
  };
  return { ok: true, position, warnings: validatePosition(position) };
}

export function placementToFen(board: Board): string {
  const ranks: string[] = [];
  for (let r = 0; r < 8; r++) {
    let s = '';
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const p = board[r * 8 + f];
      if (!p) empty++;
      else {
        if (empty) s += empty;
        empty = 0;
        s += p;
      }
    }
    if (empty) s += empty;
    ranks.push(s);
  }
  return ranks.join('/');
}

export function castlingToFen(c: Castling): string {
  const s = `${c.K ? 'K' : ''}${c.Q ? 'Q' : ''}${c.k ? 'k' : ''}${c.q ? 'q' : ''}`;
  return s || '-';
}

export function toFen(p: Position): string {
  return [
    placementToFen(p.board),
    p.turn,
    castlingToFen(p.castling),
    p.ep ?? '-',
    Math.max(0, Math.floor(p.halfmove)),
    Math.max(1, Math.floor(p.fullmove)),
  ].join(' ');
}

/** Which castling rights the king and rook placement still allows. */
export function castlingPossible(board: Board): Castling {
  const at = (sq: string) => board[squareIndex(sq)];
  return {
    K: at('e1') === 'K' && at('h1') === 'R',
    Q: at('e1') === 'K' && at('a1') === 'R',
    k: at('e8') === 'k' && at('h8') === 'r',
    q: at('e8') === 'k' && at('a8') === 'r',
  };
}

/**
 * Squares that could be the en-passant target for the side to move: the
 * opponent's pawn stands where a double step would have left it, and the
 * square it skipped and its start square are empty.
 */
export function epCandidates(board: Board, turn: Color): string[] {
  const out: string[] = [];
  // White to move → black just pushed from rank 7 to 5, target on rank 6.
  const pawn: Piece = turn === 'w' ? 'p' : 'P';
  const pawnRank = turn === 'w' ? 5 : 4;
  const targetRank = turn === 'w' ? 6 : 3;
  const startRank = turn === 'w' ? 7 : 2;
  for (const f of FILES) {
    if (
      board[squareIndex(`${f}${pawnRank}`)] === pawn &&
      !board[squareIndex(`${f}${targetRank}`)] &&
      !board[squareIndex(`${f}${startRank}`)]
    )
      out.push(`${f}${targetRank}`);
  }
  return out;
}

export function validatePosition(p: Position): string[] {
  const w: string[] = [];
  const count = (piece: Piece) => p.board.filter((x) => x === piece).length;
  for (const [king, side] of [
    ['K', 'White'],
    ['k', 'Black'],
  ] as const) {
    const n = count(king);
    if (n !== 1) w.push(`${side} needs exactly one king (found ${n}).`);
  }
  for (const [pawn, side] of [
    ['P', 'White'],
    ['p', 'Black'],
  ] as const) {
    if (count(pawn) > 8) w.push(`${side} has more than 8 pawns.`);
  }
  for (const side of ['w', 'b'] as const) {
    const n = p.board.filter((x) => x && colorOf(x) === side).length;
    if (n > 16)
      w.push(`${side === 'w' ? 'White' : 'Black'} has more than 16 pieces.`);
  }
  const backRank = p.board
    .map((x, i) => ({ x, i }))
    .filter(({ x, i }) => (x === 'P' || x === 'p') && (i < 8 || i >= 56))
    .map(({ i }) => squareName(i));
  if (backRank.length)
    w.push(
      `Pawns can’t stand on the 1st or 8th rank (${backRank.join(', ')}).`,
    );
  const possible = castlingPossible(p.board);
  const labels: Record<keyof Castling, string> = {
    K: 'White kingside (K) needs the king on e1 and a rook on h1',
    Q: 'White queenside (Q) needs the king on e1 and a rook on a1',
    k: 'Black kingside (k) needs the king on e8 and a rook on h8',
    q: 'Black queenside (q) needs the king on e8 and a rook on a8',
  };
  for (const k of ['K', 'Q', 'k', 'q'] as const)
    if (p.castling[k] && !possible[k]) w.push(`Castling ${labels[k]}.`);
  if (p.ep) {
    const rank = p.ep[1];
    if ((p.turn === 'w' && rank !== '6') || (p.turn === 'b' && rank !== '3'))
      w.push(
        `En-passant square ${p.ep} doesn’t fit ${p.turn === 'w' ? 'White' : 'Black'} to move (it must be on rank ${p.turn === 'w' ? 6 : 3}).`,
      );
    else if (!epCandidates(p.board, p.turn).includes(p.ep))
      w.push(
        `En-passant square ${p.ep} needs a ${p.turn === 'w' ? 'black' : 'white'} pawn that has just moved two squares past it.`,
      );
  }
  return w;
}

export function emptyPosition(): Position {
  const r = parseFen(EMPTY_FEN);
  if (!r.ok) throw new Error('EMPTY_FEN is invalid');
  return r.position;
}

export function startPosition(): Position {
  const r = parseFen(START_FEN);
  if (!r.ok) throw new Error('START_FEN is invalid');
  return r.position;
}

/** Moves a piece (capturing whatever is on the target) and returns a new board. */
export function movePiece(board: Board, from: number, to: number): Board {
  if (from === to || !board[from]) return board;
  const next = [...board];
  next[to] = next[from];
  next[from] = null;
  return next;
}
