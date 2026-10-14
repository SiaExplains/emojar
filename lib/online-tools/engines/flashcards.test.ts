import { describe, expect, it } from 'vitest';
import {
  boxCounts,
  buildQuiz,
  cardsToCsv,
  demote,
  dueCards,
  isCorrect,
  isDue,
  isFlashcardsState,
  parseCards,
  promote,
  type Card,
} from './flashcards';
import { rng } from './typing';

const card = (id: string, box = 1, front = id, back = `${id}-back`): Card => ({
  id,
  front,
  back,
  box,
});

describe('flashcards', () => {
  it('schedules Leitner boxes', () => {
    expect([0, 1, 2, 3, 4].map((s) => isDue(1, s))).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
    expect([0, 1, 2, 3, 4].map((s) => isDue(2, s))).toEqual([
      true,
      false,
      true,
      false,
      true,
    ]);
    expect(isDue(3, 4)).toBe(true);
    expect(isDue(3, 2)).toBe(false);
    const deck = {
      id: 'd',
      name: 'D',
      sessions: 1,
      cards: [card('a', 1), card('b', 2), card('c', 3)],
    };
    expect(dueCards(deck).map((c) => c.id)).toEqual(['a']);
    // Nothing due: fall back to the lowest box present.
    expect(
      dueCards({ ...deck, cards: [card('b', 2), card('c', 3)] }).map(
        (c) => c.id,
      ),
    ).toEqual(['b']);
    expect(promote(card('a', 5)).box).toBe(5);
    expect(promote(card('a', 2)).box).toBe(3);
    expect(demote(card('a', 4)).box).toBe(1);
    expect(boxCounts([card('a', 1), card('b', 1), card('c', 5)])).toEqual([
      2, 0, 0, 0, 1,
    ]);
  });

  it('parses tab-separated text with a header and skips bad lines', () => {
    const r = parseCards(
      'term\tdefinition\nhola\thello\nbad line\ngato\tcat "pet"\n',
    );
    expect(r.cards).toEqual([
      { front: 'hola', back: 'hello' },
      { front: 'gato', back: 'cat "pet"' },
    ]);
    expect(r.skipped).toBe(1);
  });

  it('parses CSV with quotes, commas and newlines', () => {
    const r = parseCards(
      'front,back\n"Paris, France","Capital, ""City of Light"""\nH2O,"water\nmolecule"',
    );
    expect(r.cards).toEqual([
      { front: 'Paris, France', back: 'Capital, "City of Light"' },
      { front: 'H2O', back: 'water\nmolecule' },
    ]);
  });

  it('exports CSV that round-trips and is formula-safe', () => {
    const cards = [
      card('1', 1, 'a,b', 'say "hi"'),
      card('2', 1, '=SUM(A1)', 'x'),
    ];
    const csv = cardsToCsv(cards);
    expect(csv.split('\r\n')).toEqual([
      'front,back',
      '"a,b","say ""hi"""',
      "'=SUM(A1),x",
    ]);
    const back = parseCards(csv).cards;
    expect(back[0]).toEqual({ front: 'a,b', back: 'say "hi"' });
    expect(back[1].front).toBe(`'=SUM(A1)`);
  });

  it('builds quizzes with distinct options', () => {
    const cards = ['a', 'b', 'c', 'd', 'e'].map((id) => card(id));
    const q = buildQuiz(cards, { choices: true, random: rng(4) });
    expect(q).toHaveLength(5);
    for (const x of q) {
      expect(x.options).toHaveLength(4);
      expect(new Set(x.options).size).toBe(4);
      expect(x.options).toContain(x.answer);
    }
    const two = buildQuiz(cards.slice(0, 2), { choices: true, random: rng(1) });
    expect(two[0].options).toHaveLength(2);
    const rev = buildQuiz([card('a')], { reverse: true });
    expect(rev[0]).toMatchObject({
      prompt: 'a-back',
      answer: 'a',
      options: [],
    });
  });

  it('checks typed answers loosely', () => {
    expect(isCorrect('  Cafe. ', 'café')).toBe(true);
    expect(isCorrect('cats', 'cat')).toBe(false);
  });

  it('validates saved state', () => {
    const s = {
      version: 1,
      activeDeck: 'd',
      decks: [{ id: 'd', name: 'D', sessions: 0, cards: [card('a')] }],
    };
    expect(isFlashcardsState(s)).toBe(true);
    expect(
      isFlashcardsState({
        ...s,
        decks: [{ ...s.decks[0], cards: [card('a', 9)] }],
      }),
    ).toBe(false);
  });
});
