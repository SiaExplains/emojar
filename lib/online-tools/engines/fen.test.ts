import { describe, expect, it } from 'vitest';
import {
  EMPTY_FEN,
  START_FEN,
  castlingPossible,
  epCandidates,
  movePiece,
  parseFen,
  squareIndex,
  squareName,
  startPosition,
  toFen,
} from './fen';

const roundTrip = (fen: string) => {
  const r = parseFen(fen);
  if (!r.ok) throw new Error(r.errors.join(' '));
  return toFen(r.position);
};

describe('squares', () => {
  it('maps names and indexes in FEN order', () => {
    expect(squareName(0)).toBe('a8');
    expect(squareName(63)).toBe('h1');
    expect(squareIndex('e4')).toBe(36);
    expect(squareName(squareIndex('c6'))).toBe('c6');
    expect(squareIndex('i9')).toBe(-1);
  });
});

describe('parse and serialise', () => {
  it('round-trips the start position and other positions', () => {
    for (const fen of [
      START_FEN,
      EMPTY_FEN,
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
      '4k3/8/8/8/8/8/8/4K3 b - - 49 120',
    ])
      expect(roundTrip(fen)).toBe(fen);
  });

  it('parses the start position', () => {
    const r = parseFen(START_FEN);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.warnings).toEqual([]);
    expect(r.position.board[squareIndex('e1')]).toBe('K');
    expect(r.position.board[squareIndex('d8')]).toBe('q');
    expect(r.position.castling).toEqual({ K: true, Q: true, k: true, q: true });
  });

  it('fills in missing trailing fields', () => {
    expect(roundTrip('4k3/8/8/8/8/8/8/4K3')).toBe(
      '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
    );
    expect(roundTrip('4k3/8/8/8/8/8/8/4K3 b')).toBe(
      '4k3/8/8/8/8/8/8/4K3 b - - 0 1',
    );
  });
});

describe('invalid FENs', () => {
  const errorsOf = (fen: string) => {
    const r = parseFen(fen);
    return r.ok ? [] : r.errors;
  };

  it('rejects broken syntax with a reason', () => {
    expect(errorsOf('')).toEqual(['Enter a FEN string.']);
    expect(errorsOf('8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(/8 ranks/);
    expect(errorsOf('9/8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(
      /invalid character “9”/,
    );
    expect(errorsOf('7/8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(
      /covers 7 squares/,
    );
    expect(errorsOf('ppppppppp/8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(
      /9 squares/,
    );
    expect(errorsOf('x7/8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(/“x”/);
    expect(errorsOf('44/8/8/8/8/8/8/8 w - - 0 1').join()).toMatch(/two digits/);
    expect(errorsOf(`${EMPTY_FEN.split(' ')[0]} x - - 0 1`).join()).toMatch(
      /Side to move/,
    );
    expect(errorsOf(`${EMPTY_FEN.split(' ')[0]} w KK - 0 1`).join()).toMatch(
      /Castling/,
    );
    expect(errorsOf(`${EMPTY_FEN.split(' ')[0]} w - e4 0 1`).join()).toMatch(
      /En-passant/,
    );
    expect(errorsOf(`${EMPTY_FEN.split(' ')[0]} w - - x 0`)).toHaveLength(2);
    expect(errorsOf(`${START_FEN} extra`).join()).toMatch(/at most 6/);
  });

  it('warns about impossible positions but still loads them', () => {
    const warn = (fen: string) => {
      const r = parseFen(fen);
      if (!r.ok) throw new Error(r.errors.join(' '));
      return r.warnings.join(' ');
    };
    expect(warn(EMPTY_FEN)).toMatch(/White needs exactly one king \(found 0\)/);
    expect(warn('KK2k3/8/8/8/8/8/8/8 w - - 0 1')).toMatch(/found 2/);
    expect(warn('P3k3/8/8/8/8/8/8/4K2p w - - 0 1')).toMatch(
      /1st or 8th rank \(a8, h1\)/,
    );
    expect(warn('4k3/8/8/8/8/8/8/4K3 w K - 0 1')).toMatch(/rook on h1/);
    expect(warn('4k3/8/8/8/4P3/8/8/4K3 w - e3 0 1')).toMatch(/rank 6/);
    expect(warn('4k3/8/8/8/8/8/8/4K3 w - e6 0 1')).toMatch(/black pawn/);
    expect(
      warn('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'),
    ).toBe('');
  });
});

describe('board helpers', () => {
  it('finds castling rights and en-passant candidates', () => {
    expect(castlingPossible(startPosition().board)).toEqual({
      K: true,
      Q: true,
      k: true,
      q: true,
    });
    const r = parseFen('4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1');
    if (!r.ok) throw new Error();
    expect(epCandidates(r.position.board, 'w')).toEqual(['d6']);
    expect(epCandidates(r.position.board, 'b')).toEqual([]);
  });

  it('moves pieces, capturing on the target', () => {
    const b = startPosition().board;
    const moved = movePiece(b, squareIndex('e2'), squareIndex('e7'));
    expect(moved[squareIndex('e7')]).toBe('P');
    expect(moved[squareIndex('e2')]).toBeNull();
    expect(movePiece(b, squareIndex('e4'), squareIndex('e5'))).toBe(b);
  });
});
