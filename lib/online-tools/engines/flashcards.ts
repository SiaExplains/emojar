// Flashcards / Quiz Maker: decks and cards, Leitner-box scheduling,
// CSV / tab-separated import and export, and quiz generation. Everything is
// stored in the browser; imports are parsed as text only.

import {
  isArrayOf,
  isFiniteNum,
  isId,
  isObj,
  isStr,
  uniqueIds,
} from './local-data';

export type Card = {
  id: string;
  front: string;
  back: string;
  /** Leitner box 1–5: 1 = review every session, 5 = rarely. */
  box: number;
};

export type Deck = {
  id: string;
  name: string;
  cards: Card[];
  /** Completed study sessions, used to decide which boxes are due. */
  sessions: number;
};

export type FlashcardsState = {
  version: 1;
  decks: Deck[];
  activeDeck: string;
};

export const FLASH_LIMITS = {
  decks: 50,
  cards: 1000,
  side: 1000,
  name: 80,
};

export const BOXES = 5;

const isCard = (v: unknown): v is Card =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.front, FLASH_LIMITS.side) &&
  isStr(v.back, FLASH_LIMITS.side) &&
  isFiniteNum(v.box) &&
  Number.isInteger(v.box) &&
  v.box >= 1 &&
  v.box <= BOXES;

const isDeck = (v: unknown): v is Deck =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.name, FLASH_LIMITS.name) &&
  isArrayOf(v.cards, isCard, FLASH_LIMITS.cards) &&
  uniqueIds(v.cards) &&
  isFiniteNum(v.sessions) &&
  v.sessions >= 0;

export function isFlashcardsState(v: unknown): v is FlashcardsState {
  return (
    isObj(v) &&
    v.version === 1 &&
    isArrayOf(v.decks, isDeck, FLASH_LIMITS.decks) &&
    v.decks.length > 0 &&
    uniqueIds(v.decks) &&
    typeof v.activeDeck === 'string'
  );
}

/* ------------------------------------------------------------------ */
/* Leitner scheduling                                                   */
/* ------------------------------------------------------------------ */

/**
 * A box is due every 2^(box−1) sessions: box 1 every session, box 2 every
 * second, box 3 every fourth, and so on.
 */
export function isDue(box: number, session: number): boolean {
  return session % 2 ** (box - 1) === 0;
}

/** Cards due in the deck's next session; never empty if the deck has cards. */
export function dueCards(deck: Deck): Card[] {
  const due = deck.cards.filter((c) => isDue(c.box, deck.sessions));
  if (due.length || !deck.cards.length) return due;
  // Everything is in high boxes: review the lowest box rather than nothing.
  const low = Math.min(...deck.cards.map((c) => c.box));
  return deck.cards.filter((c) => c.box === low);
}

export const promote = (c: Card): Card => ({
  ...c,
  box: Math.min(BOXES, c.box + 1),
});
export const demote = (c: Card): Card => ({ ...c, box: 1 });

/** Cards per box, index 0 = box 1. */
export function boxCounts(cards: Card[]): number[] {
  const out = Array<number>(BOXES).fill(0);
  for (const c of cards) out[c.box - 1]++;
  return out;
}

/* ------------------------------------------------------------------ */
/* Import / export                                                      */
/* ------------------------------------------------------------------ */

/** Splits one CSV line, honouring double-quoted fields with "" escapes. */
function splitCsvLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"' && cur === '') q = true;
    else if (ch === sep) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Joins CSV records, keeping newlines that sit inside quoted fields. */
function csvRecords(text: string): string[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  let buf = '';
  for (const l of lines) {
    buf = buf ? `${buf}\n${l}` : l;
    if ((buf.match(/"/g)?.length ?? 0) % 2 === 0) {
      out.push(buf);
      buf = '';
    }
  }
  if (buf) out.push(buf);
  return out;
}

export type ParsedCards = {
  cards: { front: string; back: string }[];
  /** Lines that had no separator or an empty side. */
  skipped: number;
};

/**
 * Parses pasted or uploaded cards: one card per line, "front<TAB>back"
 * (Quizlet's default export) or "front,back" CSV. A first row reading
 * term/definition or front/back is treated as a header.
 */
export function parseCards(text: string): ParsedCards {
  const lines = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((l) => l.trim());
  // Tab-separated text (Quizlet, spreadsheets) has no quoting rules, so a
  // stray " in a card can't swallow the following lines.
  const tabbed = lines.filter((l) => l.includes('\t')).length;
  const rows: string[][] =
    tabbed >= lines.length / 2
      ? lines.map((l) => {
          const i = l.indexOf('\t');
          return i === -1 ? [l] : [l.slice(0, i), l.slice(i + 1)];
        })
      : csvRecords(text.trim())
          .filter((l) => l.trim())
          .map((r) => {
            const [a = '', ...rest] = splitCsvLine(r, ',');
            return [a, rest.join(',')];
          });
  const cards: { front: string; back: string }[] = [];
  let skipped = 0;
  rows.forEach(([a = '', b = ''], i) => {
    const front = a.trim();
    const back = b.replace(/\t/g, ' ').trim();
    if (
      i === 0 &&
      /^(term|front|question|word)$/i.test(front) &&
      /^(definition|back|answer|meaning)$/i.test(back)
    )
      return;
    if (!front || !back) {
      skipped++;
      return;
    }
    if (cards.length < FLASH_LIMITS.cards)
      cards.push({
        front: front.slice(0, FLASH_LIMITS.side),
        back: back.slice(0, FLASH_LIMITS.side),
      });
  });
  return { cards, skipped };
}

/** Quotes a CSV field and stops spreadsheets running it as a formula. */
function csvField(s: string): string {
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function cardsToCsv(cards: Card[]): string {
  return [
    'front,back',
    ...cards.map((c) => `${csvField(c.front)},${csvField(c.back)}`),
  ].join('\r\n');
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                 */
/* ------------------------------------------------------------------ */

/** Fisher–Yates shuffle with an injectable random source. */
export function shuffle<T>(arr: T[], random: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type QuizQuestion = {
  cardId: string;
  prompt: string;
  answer: string;
  /** Multiple-choice options including the answer; empty for typed mode. */
  options: string[];
};

/**
 * One question per card. Options are the right answer plus up to three
 * different answers from other cards in the deck.
 */
export function buildQuiz(
  cards: Card[],
  opts: { reverse?: boolean; choices?: boolean; random?: () => number } = {},
): QuizQuestion[] {
  const random = opts.random ?? Math.random;
  const side = (c: Card) => (opts.reverse ? c.front : c.back);
  const ask = (c: Card) => (opts.reverse ? c.back : c.front);
  return shuffle(cards, random).map((c) => {
    if (!opts.choices)
      return { cardId: c.id, prompt: ask(c), answer: side(c), options: [] };
    const others = [
      ...new Set(
        cards
          .filter((o) => o.id !== c.id)
          .map(side)
          .filter((s) => normalizeAnswer(s) !== normalizeAnswer(side(c))),
      ),
    ];
    const wrong = shuffle(others, random).slice(0, 3);
    return {
      cardId: c.id,
      prompt: ask(c),
      answer: side(c),
      options: shuffle([side(c), ...wrong], random),
    };
  });
}

/** Lowercase, no accents, single spaces, no trailing punctuation. */
export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.!?;:,]+$/, '');
}

export function isCorrect(given: string, answer: string): boolean {
  return normalizeAnswer(given) === normalizeAnswer(answer);
}
