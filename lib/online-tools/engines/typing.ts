// Typing Speed Test: test text generation and scoring. WPM uses the standard
// definition of a "word" as 5 characters (spaces included), so results are
// comparable with other typing tests regardless of word length.

/** The ~300 most common English words, all lowercase letters only. */
export const COMMON_WORDS =
  'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is was are been has had were said did made find long down may part number sound place where help through much before line right too mean old same tell boy follow came show around form three small set put end does another large must big such turn here why ask went men read need land different home move try kind hand picture again change off play spell air away animal house point page letter mother answer found study still learn should world high every near add food between own below country plant last school father keep tree never start city earth eye light thought head under story saw left few while along might close something seem next hard open example begin life always those both paper together got group often run important until children side feet car mile night walk white sea began grow took river four carry state once book hear stop without second later miss idea enough eat face watch far real almost let above girl sometimes mountain cut young talk soon list song being leave family body music color stand sun question fish area mark dog horse birds problem complete room knew since ever piece told usually friends easy heard order red door sure become top ship across today during short better best however low hours black happened whole measure remember early waves reached listen wind rock space covered fast several hold himself toward five step morning passed true hundred against pattern table north slowly money map farm pulled draw voice power town fine drive'.split(
    ' ',
  );

/** Short passages written for this tool (plain ASCII punctuation). */
export const PASSAGES = [
  'The best way to get faster at typing is to slow down first. Accuracy builds the habit, and speed follows once your fingers know where every key lives.',
  'A small garden can feed a family through the summer. Tomatoes, beans and a few herbs need little more than sun, water and a patient gardener.',
  'Rivers rarely run in straight lines. Over thousands of years they carve wide loops across the land, leaving lakes behind when a bend is cut off.',
  'Good notes are short and specific. Write the decision, who owns the next step and when it is due, and the meeting will not have to happen twice.',
  'The first computers filled entire rooms and used more power than a small town. Today a phone in your pocket is millions of times faster.',
  'Bread needs only flour, water, salt and time. The long rest lets the dough develop flavour and structure that no machine can rush.',
  'When you learn a new language, the first hundred words matter most. They cover a surprising share of everyday conversation.',
  'Lighthouses once needed a keeper to trim the wick every night. Most now run on their own, but the light still sweeps the dark water.',
  'A good password is long rather than clever. Four random words are easier to remember and much harder to guess than a short mix of symbols.',
  'Bees visit millions of flowers to make a single jar of honey. Along the way they carry pollen that helps the plants produce fruit and seeds.',
  'Maps are always a little wrong. Turning a round planet into a flat sheet stretches some places and shrinks others, so every map makes a choice.',
  'The night sky looks still, but it moves all the time. Stars rise in the east and set in the west as the earth turns beneath them.',
  'Walking for twenty minutes a day is one of the simplest habits that pays off. It clears the head and gives ideas room to settle.',
  'Every spreadsheet starts neat and ends crowded. Naming your columns clearly on the first day saves hours of guessing later on.',
  'Snow is mostly air. A fresh layer can be ninety percent empty space, which is why it muffles sound and keeps the ground beneath it warm.',
  'The printing press made books cheap enough for ordinary people. Within a few decades, ideas that once took years to spread travelled in weeks.',
  'Cooking rice well comes down to the ratio of water and a lid you do not lift. Let it rest for a few minutes before you fluff it with a fork.',
  'Clear writing respects the reader. Put the main point first, use short sentences and cut any word that does not earn its place.',
  'Trains changed how people thought about time. Towns that once kept their own local hours agreed on standard time so timetables made sense.',
  'Learning to touch type takes a few weeks of steady practice. After that, you stop thinking about the keys and start thinking about the words.',
];

export type TextMode = 'words' | 'sentences';

/** Small seeded PRNG (mulberry32), so a test can be regenerated exactly. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PUNCT = [',', '.', '?', '!', ';', ':'];

/**
 * Builds the text to type. Word mode draws random common words, optionally
 * adding punctuation and numbers; sentence mode joins random passages.
 */
export function generateText(opts: {
  mode: TextMode;
  seed: number;
  words?: number;
  punctuation?: boolean;
  numbers?: boolean;
}): string {
  const r = rng(opts.seed);
  const pick = <T>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  if (opts.mode === 'sentences') {
    const target = opts.words ?? 120;
    const out: string[] = [];
    let count = 0;
    let last = -1;
    while (count < target) {
      let i = Math.floor(r() * PASSAGES.length);
      if (i === last) i = (i + 1) % PASSAGES.length;
      last = i;
      out.push(PASSAGES[i]);
      count += PASSAGES[i].split(' ').length;
    }
    return out.join(' ');
  }
  const n = opts.words ?? 120;
  const out: string[] = [];
  let capitalise = !!opts.punctuation;
  for (let i = 0; i < n; i++) {
    let w: string =
      opts.numbers && r() < 0.12
        ? String(Math.floor(r() * (r() < 0.5 ? 100 : 10000)))
        : pick(COMMON_WORDS);
    if (capitalise) {
      w = w.charAt(0).toUpperCase() + w.slice(1);
      capitalise = false;
    }
    if (opts.punctuation && i < n - 1 && r() < 0.15) {
      const p = pick(PUNCT);
      w += p;
      capitalise = p === '.' || p === '?' || p === '!';
    }
    out.push(w);
  }
  if (opts.punctuation) out[out.length - 1] += '.';
  return out.join(' ');
}

export type CharCounts = {
  correct: number;
  incorrect: number;
  /** Typed past the end of the text. */
  extra: number;
};

/** Compares the typed string with the target, position by position. */
export function compareText(target: string, typed: string): CharCounts {
  let correct = 0;
  let incorrect = 0;
  const n = Math.min(target.length, typed.length);
  for (let i = 0; i < n; i++) {
    if (typed[i] === target[i]) correct++;
    else incorrect++;
  }
  return {
    correct,
    incorrect,
    extra: Math.max(0, typed.length - target.length),
  };
}

export type TypingResult = {
  /** Net words per minute: correct characters ÷ 5 per minute. */
  wpm: number;
  /** All typed characters ÷ 5 per minute, errors included. */
  rawWpm: number;
  /** Share of keystrokes that were right, 0–100. */
  accuracy: number;
  /** Uncorrected wrong characters left in the text. */
  errors: number;
  chars: CharCounts;
  seconds: number;
};

/**
 * Scores a test. `keystrokes` and `wrongKeystrokes` count every key press,
 * including ones later deleted, so accuracy reflects corrected mistakes too.
 */
export function scoreTest(opts: {
  target: string;
  typed: string;
  seconds: number;
  keystrokes: number;
  wrongKeystrokes: number;
}): TypingResult {
  const chars = compareText(opts.target, opts.typed);
  const minutes = opts.seconds / 60;
  const per = (n: number) => (minutes > 0 ? n / 5 / minutes : 0);
  const accuracy =
    opts.keystrokes > 0
      ? Math.max(
          0,
          ((opts.keystrokes - opts.wrongKeystrokes) / opts.keystrokes) * 100,
        )
      : 0;
  return {
    wpm: Math.round(per(chars.correct)),
    rawWpm: Math.round(per(opts.typed.length)),
    accuracy: Math.round(accuracy * 10) / 10,
    errors: chars.incorrect + chars.extra,
    chars,
    seconds: opts.seconds,
  };
}

/** Net WPM after `seconds`, for the live readout and the per-second chart. */
export function liveWpm(correctChars: number, seconds: number): number {
  return seconds > 0 ? Math.round(correctChars / 5 / (seconds / 60)) : 0;
}

export type HistoryEntry = {
  wpm: number;
  accuracy: number;
  seconds: number;
  mode: TextMode;
  /** Unix ms. */
  at: number;
};

export const MAX_HISTORY = 10;

export function isHistory(v: unknown): v is HistoryEntry[] {
  return (
    Array.isArray(v) &&
    v.length <= 50 &&
    v.every(
      (e) =>
        typeof e === 'object' &&
        e !== null &&
        Number.isFinite((e as HistoryEntry).wpm) &&
        Number.isFinite((e as HistoryEntry).accuracy) &&
        Number.isFinite((e as HistoryEntry).seconds) &&
        Number.isFinite((e as HistoryEntry).at) &&
        ((e as HistoryEntry).mode === 'words' ||
          (e as HistoryEntry).mode === 'sentences'),
    )
  );
}

/** Adds a result to the front of the history, keeping the last 10. */
export function addToHistory(
  list: HistoryEntry[],
  e: HistoryEntry,
): HistoryEntry[] {
  return [e, ...list].slice(0, MAX_HISTORY);
}

/** Best WPM for a given duration, or 0. */
export function personalBest(list: HistoryEntry[], seconds: number): number {
  return list
    .filter((e) => e.seconds === seconds)
    .reduce((m, e) => Math.max(m, e.wpm), 0);
}

/** Rough label for a net WPM, used in the result summary. */
export function speedLabel(wpm: number): string {
  if (wpm < 25) return 'Beginner — keep practising accuracy first.';
  if (wpm < 40) return 'Average — about the speed of most people.';
  if (wpm < 60) return 'Above average — comfortable for most office work.';
  if (wpm < 80) return 'Fast — quicker than most professional typists.';
  return 'Very fast — competitive typing territory.';
}
