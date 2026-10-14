'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  Notice,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
  labelBase,
} from '../ui';
import { newId, useStoredState } from './playground-shared';
import { LocalDataBar } from './productivity-shared';
import { MAX_IMPORT_BYTES } from '@/lib/online-tools/engines/local-data';
import {
  BOXES,
  FLASH_LIMITS,
  boxCounts,
  buildQuiz,
  cardsToCsv,
  demote,
  dueCards,
  isCorrect,
  isFlashcardsState,
  parseCards,
  promote,
  shuffle,
  type Deck,
  type FlashcardsState,
  type QuizQuestion,
} from '@/lib/online-tools/engines/flashcards';

const KEY = 'emojar:flashcard-maker:v1';
const TOOL = 'flashcard-maker';

function starterState(): FlashcardsState {
  const id = newId();
  const cards: [string, string][] = [
    ['hola', 'hello'],
    ['gracias', 'thank you'],
    ['por favor', 'please'],
    ['adiós', 'goodbye'],
    ['buenos días', 'good morning'],
    ['¿cómo estás?', 'how are you?'],
  ];
  return {
    version: 1,
    activeDeck: id,
    decks: [
      {
        id,
        name: 'Spanish basics (example)',
        sessions: 0,
        cards: cards.map(([front, back]) => ({
          id: newId(),
          front,
          back,
          box: 1,
        })),
      },
    ],
  };
}

type Mode = 'edit' | 'study' | 'quiz';

export default function FlashcardsTool(_props: ToolProps) {
  const [state, setState] = useStoredState<FlashcardsState>(
    KEY,
    starterState,
    isFlashcardsState,
  );
  const [mode, setMode] = useState<Mode>('edit');
  const deck =
    state.decks.find((d) => d.id === state.activeDeck) ?? state.decks[0];

  const setDeck = (fn: (d: Deck) => Deck) =>
    setState((s) => ({
      ...s,
      decks: s.decks.map((d) => (d.id === deck.id ? fn(d) : d)),
    }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[200px] flex-1">
          <span className={labelBase}>Deck</span>
          <select
            value={deck.id}
            onChange={(e) => {
              setState((s) => ({ ...s, activeDeck: e.target.value }));
              setMode('edit');
            }}
            className={`${inputBase} mt-1`}
          >
            {state.decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name || 'Untitled deck'} ({d.cards.length})
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={btnSecondary}
          disabled={state.decks.length >= FLASH_LIMITS.decks}
          onClick={() => {
            const id = newId();
            setState((s) => ({
              ...s,
              activeDeck: id,
              decks: [
                ...s.decks,
                { id, name: 'New deck', sessions: 0, cards: [] },
              ],
            }));
            setMode('edit');
          }}
        >
          ＋ New deck
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Mode"
        className="flex gap-1 rounded-xl bg-gray-100 p-1"
      >
        {(
          [
            ['edit', '✏️ Edit cards'],
            ['study', '🧠 Study'],
            ['quiz', '✅ Quiz'],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            disabled={
              m !== 'edit' && deck.cards.length < (m === 'quiz' ? 2 : 1)
            }
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:opacity-40 ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'edit' && (
        <EditDeck
          deck={deck}
          canDelete={state.decks.length > 1}
          setDeck={setDeck}
          onDelete={() =>
            setState((s) => {
              const decks = s.decks.filter((d) => d.id !== deck.id);
              return { ...s, decks, activeDeck: decks[0].id };
            })
          }
        />
      )}
      {mode === 'study' && (
        <Study key={deck.id} deck={deck} setDeck={setDeck} />
      )}
      {mode === 'quiz' && <Quiz key={deck.id} deck={deck} />}

      <LocalDataBar
        tool={TOOL}
        state={state}
        guard={isFlashcardsState}
        onImport={setState}
        onClear={() => setState(starterState())}
        clearLabel="Delete all decks"
        clearConfirm="Delete every deck and card in this browser? Export a backup first if you want to keep them."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EditDeck({
  deck,
  canDelete,
  setDeck,
  onDelete,
}: {
  deck: Deck;
  canDelete: boolean;
  setDeck: (fn: (d: Deck) => Deck) => void;
  onDelete: () => void;
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [paste, setPaste] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const frontRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const full = deck.cards.length >= FLASH_LIMITS.cards;

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim() || full) return;
    setDeck((d) => ({
      ...d,
      cards: [
        ...d.cards,
        {
          id: newId(),
          front: front.trim().slice(0, FLASH_LIMITS.side),
          back: back.trim().slice(0, FLASH_LIMITS.side),
          box: 1,
        },
      ],
    }));
    setFront('');
    setBack('');
    frontRef.current?.focus();
  };

  const importText = (text: string, source: string) => {
    setError('');
    const { cards, skipped } = parseCards(text);
    const room = FLASH_LIMITS.cards - deck.cards.length;
    if (!cards.length) {
      setError(
        'No cards found. Put one card per line as “front<Tab>back” or “front,back”.',
      );
      return;
    }
    const taken = cards.slice(0, room);
    setDeck((d) => ({
      ...d,
      cards: [...d.cards, ...taken.map((c) => ({ ...c, id: newId(), box: 1 }))],
    }));
    setMsg(
      `Added ${taken.length} card${taken.length === 1 ? '' : 's'} from ${source}` +
        (skipped
          ? `, skipped ${skipped} line${skipped === 1 ? '' : 's'} without both sides`
          : '') +
        (cards.length > room
          ? `, ${cards.length - room} over the ${FLASH_LIMITS.cards}-card limit`
          : '') +
        '.',
    );
    setPaste('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1">
          <span className={labelBase}>Deck name</span>
          <input
            value={deck.name}
            maxLength={FLASH_LIMITS.name}
            onChange={(e) => setDeck((d) => ({ ...d, name: e.target.value }))}
            className={`${inputBase} mt-1`}
          />
        </label>
        <button
          type="button"
          className={btnSecondary}
          disabled={!deck.cards.length}
          onClick={() =>
            downloadBlob(
              cardsToCsv(deck.cards),
              `${(deck.name || 'flashcards').replace(/[\\/:*?"<>|]+/g, '')}.csv`,
              'text/csv;charset=utf-8',
            )
          }
        >
          ⬇ Export CSV
        </button>
        {canDelete && (
          <button
            type="button"
            className={`${btnSecondary} text-red-700`}
            onClick={() => {
              if (
                window.confirm(`Delete the deck “${deck.name}” and its cards?`)
              )
                onDelete();
            }}
          >
            Delete deck
          </button>
        )}
      </div>

      <form
        onSubmit={add}
        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <label>
          <span className={labelBase}>Front (question or term)</span>
          <input
            ref={frontRef}
            value={front}
            onChange={(e) => setFront(e.target.value)}
            className={`${inputBase} mt-1`}
          />
        </label>
        <label>
          <span className={labelBase}>Back (answer or definition)</span>
          <input
            value={back}
            onChange={(e) => setBack(e.target.value)}
            className={`${inputBase} mt-1`}
          />
        </label>
        <button
          type="submit"
          className={btnPrimary}
          disabled={!front.trim() || !back.trim() || full}
        >
          Add card
        </button>
      </form>

      <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
          Import many cards at once (paste or CSV file)
        </summary>
        <div className="mt-3 space-y-2">
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={5}
            placeholder={'One card per line:\nperro\tdog\ngato,cat'}
            aria-label="Cards to import"
            className={`${inputBase} font-mono`}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              disabled={!paste.trim() || full}
              onClick={() => importText(paste, 'the pasted text')}
            >
              Add pasted cards
            </button>
            <button
              type="button"
              className={btnSecondary}
              disabled={full}
              onClick={() => fileRef.current?.click()}
            >
              ⬆ Import CSV / TSV file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/plain,text/tab-separated-values"
              className="sr-only"
              tabIndex={-1}
              aria-label="Import a CSV or TSV file"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                if (f.size > MAX_IMPORT_BYTES) {
                  setError('That file is too large (max 2 MB).');
                  return;
                }
                importText(await f.text(), `“${f.name}”`);
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Works with Quizlet’s export (tab between term and definition) and
            any spreadsheet saved as CSV. A first row “term, definition” is
            skipped.
          </p>
        </div>
      </details>
      <ErrorMessage>{error}</ErrorMessage>
      {msg && <Notice tone="green">{msg}</Notice>}

      {deck.cards.length ? (
        <ol className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {deck.cards.map((c, i) => (
            <li
              key={c.id}
              className="grid gap-2 p-3 sm:grid-cols-[2rem_1fr_1fr_auto] sm:items-center"
            >
              <span className="text-xs text-gray-400">{i + 1}</span>
              <input
                value={c.front}
                aria-label={`Card ${i + 1} front`}
                maxLength={FLASH_LIMITS.side}
                onChange={(e) =>
                  setDeck((d) => ({
                    ...d,
                    cards: d.cards.map((x) =>
                      x.id === c.id ? { ...x, front: e.target.value } : x,
                    ),
                  }))
                }
                className={inputBase}
              />
              <input
                value={c.back}
                aria-label={`Card ${i + 1} back`}
                maxLength={FLASH_LIMITS.side}
                onChange={(e) =>
                  setDeck((d) => ({
                    ...d,
                    cards: d.cards.map((x) =>
                      x.id === c.id ? { ...x, back: e.target.value } : x,
                    ),
                  }))
                }
                className={inputBase}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500" title="Leitner box">
                  Box {c.box}
                </span>
                <button
                  type="button"
                  aria-label={`Delete card ${i + 1}`}
                  className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() =>
                    setDeck((d) => ({
                      ...d,
                      cards: d.cards.filter((x) => x.id !== c.id),
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-gray-500">
          This deck is empty. Add a card above or import a list.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Study({
  deck,
  setDeck,
}: {
  deck: Deck;
  setDeck: (fn: (d: Deck) => Deck) => void;
}) {
  const [reverse, setReverse] = useState(false);
  const [queue, setQueue] = useState<string[]>(() =>
    shuffle(dueCards(deck)).map((c) => c.id),
  );
  const [total] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck.cards.find((c) => c.id === queue[0]);
  const finished = !card;

  const answer = (ok: boolean) => {
    if (!card) return;
    setDeck((d) => {
      const cards = d.cards.map((c) =>
        c.id === card.id ? (ok ? promote(c) : demote(c)) : c,
      );
      // Last card of the session: count the session so higher boxes come due.
      const last = ok && queue.length === 1;
      return { ...d, cards, sessions: last ? d.sessions + 1 : d.sessions };
    });
    setQueue((q) => (ok ? q.slice(1) : [...q.slice(1), q[0]]));
    if (ok) setDone((n) => n + 1);
    setFlipped(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('input, textarea, select')) return;
      if (e.key === ' ') {
        // A focused button already reacts to Space on its own.
        if (t?.closest('button')) return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && e.key === '1') answer(false);
      else if (flipped && e.key === '2') answer(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const counts = boxCounts(deck.cards);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-gray-600">
          Session {deck.sessions + 1} · {done} of {total} cards learned
        </p>
        <label className="flex items-center gap-1.5 text-gray-700">
          <input
            type="checkbox"
            checked={reverse}
            onChange={(e) => setReverse(e.target.checked)}
          />
          Show the back first
        </label>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Session progress"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </div>

      {finished ? (
        <Notice tone="green">
          🎉 Session complete — {total} card{total === 1 ? '' : 's'} reviewed.
          Cards you knew moved up a box and will come back less often. Start
          another session tomorrow, or switch to the quiz.
        </Notice>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Show the question' : 'Show the answer'}
            className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {flipped ? 'Answer' : 'Question'} · box {card.box}
            </span>
            <span className="mt-3 whitespace-pre-wrap break-words text-2xl font-semibold text-gray-900 sm:text-3xl">
              {flipped !== reverse ? card.back : card.front}
            </span>
            {!flipped && (
              <span className="mt-4 text-xs text-gray-500">
                Click or press Space to flip
              </span>
            )}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`${btnSecondary} py-3`}
              disabled={!flipped}
              onClick={() => answer(false)}
            >
              ↺ Again <span className="text-xs text-gray-400">(1)</span>
            </button>
            <button
              type="button"
              className={`${btnPrimary} py-3`}
              disabled={!flipped}
              onClick={() => answer(true)}
            >
              ✓ Got it <span className="text-xs opacity-70">(2)</span>
            </button>
          </div>
        </>
      )}

      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {counts.map((n, i) => (
          <div key={i} className="rounded-lg bg-gray-50 px-2 py-2">
            <p className="font-semibold text-gray-900">{n}</p>
            <p className="text-gray-500">
              Box {i + 1}
              {i === 0 ? ' · daily' : i === BOXES - 1 ? ' · mastered' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Quiz({ deck }: { deck: Deck }) {
  const [choices, setChoices] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [i, setI] = useState(0);
  const [given, setGiven] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [wrong, setWrong] = useState<(QuizQuestion & { given: string })[]>([]);
  const [score, setScore] = useState(0);

  const start = () => {
    setQuestions(buildQuiz(deck.cards, { choices, reverse }));
    setI(0);
    setGiven(null);
    setTyped('');
    setWrong([]);
    setScore(0);
  };

  const q = questions?.[i];
  const submit = (answer: string) => {
    if (!q || given !== null) return;
    setGiven(answer);
    if (isCorrect(answer, q.answer)) setScore((s) => s + 1);
    else setWrong((w) => [...w, { ...q, given: answer }]);
  };
  const next = () => {
    setI((n) => n + 1);
    setGiven(null);
    setTyped('');
  };

  useEffect(() => {
    if (!q || !q.options.length) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (given === null && n >= 1 && n <= q.options.length)
        submit(q.options[n - 1]);
      else if (given !== null && e.key === 'Enter') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!questions)
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={choices}
              onChange={() => setChoices(true)}
            />
            Multiple choice
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={!choices}
              onChange={() => setChoices(false)}
            />
            Type the answer
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
            />
            Ask with the back
          </label>
        </div>
        <button type="button" className={btnPrimary} onClick={start}>
          Start a {deck.cards.length}-question quiz
        </button>
      </div>
    );

  if (!q)
    return (
      <div className="space-y-4" role="status">
        <p className="text-3xl font-extrabold text-gray-900">
          {score} / {questions.length}{' '}
          <span className="text-lg font-semibold text-gray-500">
            ({Math.round((score / questions.length) * 100)}%)
          </span>
        </p>
        {wrong.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Review your mistakes
            </h3>
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white text-sm">
              {wrong.map((w) => (
                <li key={w.cardId} className="p-3">
                  <p className="font-medium text-gray-900">{w.prompt}</p>
                  <p className="text-emerald-700">✓ {w.answer}</p>
                  <p className="text-red-700">✗ {w.given || '(no answer)'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" className={btnPrimary} onClick={start}>
          ↻ New quiz
        </button>
      </div>
    );

  const right = given !== null && isCorrect(given, q.answer);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Question {i + 1} of {questions.length} · score {score}
      </p>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
        <p className="whitespace-pre-wrap break-words text-2xl font-semibold text-gray-900">
          {q.prompt}
        </p>
      </div>
      {q.options.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((o, n) => {
            const state =
              given === null
                ? ''
                : isCorrect(o, q.answer)
                  ? 'border-emerald-400 bg-emerald-50'
                  : o === given
                    ? 'border-red-400 bg-red-50'
                    : 'opacity-60';
            return (
              <button
                key={o}
                type="button"
                disabled={given !== null}
                onClick={() => submit(o)}
                className={`rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-50 ${state}`}
              >
                <span className="mr-2 text-xs text-gray-400">{n + 1}</span>
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (given === null) submit(typed);
            else next();
          }}
          className="flex gap-2"
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={given !== null}
            autoFocus
            aria-label="Your answer"
            className={inputBase}
          />
          <button type="submit" className={btnPrimary}>
            {given === null ? 'Check' : 'Next'}
          </button>
        </form>
      )}
      {given !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className={`text-sm font-semibold ${right ? 'text-emerald-700' : 'text-red-700'}`}
            role="status"
          >
            {right ? '✓ Correct' : `✗ The answer is “${q.answer}”`}
          </p>
          {q.options.length > 0 && (
            <button type="button" className={btnPrimary} onClick={next}>
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
