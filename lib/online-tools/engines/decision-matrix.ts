// Weighted decision matrix: options are scored against weighted criteria and
// ranked by their weighted average. Weights are normalised, so they can be
// typed as percentages or as any relative points.

import {
  isArrayOf,
  isFiniteNum,
  isId,
  isObj,
  isStr,
  uniqueIds,
} from './local-data';

export type Scale = 5 | 10;
export type DMOption = { id: string; name: string };
export type DMCriterion = {
  id: string;
  name: string;
  weight: number;
  /** For costs, distance, risk…: a low score is good, so it is inverted. */
  lowerIsBetter: boolean;
};
export type DMState = {
  version: 1;
  title: string;
  scale: Scale;
  weightMode: 'percent' | 'raw';
  options: DMOption[];
  criteria: DMCriterion[];
  /** scores[criterionId][optionId]; a missing entry means "not scored yet". */
  scores: Record<string, Record<string, number>>;
};

export const DM_LIMITS = { options: 12, criteria: 30, name: 80 };

export const EXAMPLE_MATRIX: DMState = {
  version: 1,
  title: 'Which apartment?',
  scale: 10,
  weightMode: 'percent',
  options: [
    { id: 'a', name: 'Option A' },
    { id: 'b', name: 'Option B' },
  ],
  criteria: [
    { id: 'price', name: 'Price', weight: 30, lowerIsBetter: false },
    { id: 'quality', name: 'Quality', weight: 40, lowerIsBetter: false },
    { id: 'location', name: 'Location', weight: 30, lowerIsBetter: false },
  ],
  scores: {
    price: { a: 8, b: 6 },
    quality: { a: 7, b: 9 },
    location: { a: 9, b: 7 },
  },
};

export const isValidScore = (n: number, scale: Scale) =>
  Number.isFinite(n) && n >= 1 && n <= scale;

export const isValidWeight = (n: number) =>
  Number.isFinite(n) && n >= 0 && n <= 1_000_000;

export const weightTotal = (criteria: DMCriterion[]) =>
  criteria.reduce((s, c) => s + (isValidWeight(c.weight) ? c.weight : 0), 0);

/** Each weight as a fraction of the total (all 0 when the total is 0). */
export function normalisedWeights(criteria: DMCriterion[]): number[] {
  const total = weightTotal(criteria);
  return criteria.map((c) =>
    total > 0 && isValidWeight(c.weight) ? c.weight / total : 0,
  );
}

const round = (n: number, dp: number) => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};

/**
 * Rescales the weights so they add up to exactly 100, rounded to one
 * decimal; the rounding remainder goes to the largest weight.
 */
export function normaliseTo100(criteria: DMCriterion[]): DMCriterion[] {
  const fr = normalisedWeights(criteria);
  if (!criteria.length || weightTotal(criteria) <= 0) return criteria;
  const next = criteria.map((c, i) => ({
    ...c,
    weight: round(fr[i] * 100, 1),
  }));
  const sum = round(
    next.reduce((s, c) => s + c.weight, 0),
    1,
  );
  if (sum !== 100) {
    let big = 0;
    next.forEach((c, i) => {
      if (c.weight > next[big].weight) big = i;
    });
    next[big] = {
      ...next[big],
      weight: round(next[big].weight + 100 - sum, 1),
    };
  }
  return next;
}

/** The score used in the total: inverted on the scale when lower is better. */
export const effectiveScore = (
  score: number,
  scale: Scale,
  lowerIsBetter: boolean,
) => (lowerIsBetter ? 1 + scale - score : score);

export type OptionResult = {
  id: string;
  name: string;
  /** Weighted average on the score scale (0 when nothing is scored). */
  total: number;
  /** Competition ranking: equal totals share a rank (1, 1, 3). */
  rank: number;
  /** Criteria with a weight that this option has no score for. */
  missing: number;
};

export type MatrixResults = {
  /** Options sorted by total, best first. */
  ranked: OptionResult[];
  /** Ids of the best option(s); several when tied. */
  winners: string[];
  /** Lead of the winner over the runner-up, or null when tied / < 2 options. */
  margin: number | null;
  missingCells: number;
  weightTotal: number;
};

// Totals are sums of products of decimals; compare them with a tolerance so
// 7.9 and 7.8999999 tie.
const EPS = 1e-9;

export function computeResults(state: DMState): MatrixResults {
  const w = normalisedWeights(state.criteria);
  let missingCells = 0;
  const results = state.options.map((o, oi) => {
    let total = 0;
    let missing = 0;
    state.criteria.forEach((c, ci) => {
      const s = state.scores[c.id]?.[o.id];
      if (s === undefined || !isValidScore(s, state.scale)) {
        missing++;
        return;
      }
      total += w[ci] * effectiveScore(s, state.scale, c.lowerIsBetter);
    });
    missingCells += missing;
    return { id: o.id, name: o.name, total, rank: 0, missing, order: oi };
  });
  // Stable: tied options keep their column order.
  results.sort((a, b) =>
    Math.abs(b.total - a.total) < EPS ? a.order - b.order : b.total - a.total,
  );
  results.forEach((r, i) => {
    r.rank =
      i > 0 && Math.abs(results[i - 1].total - r.total) < EPS
        ? results[i - 1].rank
        : i + 1;
  });
  const ranked: OptionResult[] = results.map((r) => ({
    id: r.id,
    name: r.name,
    total: r.total,
    rank: r.rank,
    missing: r.missing,
  }));
  const winners = ranked.filter((r) => r.rank === 1).map((r) => r.id);
  const margin =
    ranked.length >= 2 && winners.length === 1
      ? ranked[0].total - ranked[1].total
      : null;
  return {
    ranked,
    winners,
    margin,
    missingCells,
    weightTotal: weightTotal(state.criteria),
  };
}

/**
 * Converts scores when the scale changes so 10/10 becomes 5/5 and 1 stays
 * 1, keeping one decimal.
 */
export function rescaleScores(state: DMState, scale: Scale): DMState {
  if (scale === state.scale) return state;
  const k = (scale - 1) / (state.scale - 1);
  const scores: DMState['scores'] = {};
  for (const [cid, row] of Object.entries(state.scores)) {
    scores[cid] = {};
    for (const [oid, s] of Object.entries(row))
      scores[cid][oid] = round(1 + (s - 1) * k, 1);
  }
  return { ...state, scale, scores };
}

/** Drops scores of deleted options/criteria so the saved data stays tidy. */
export function pruneScores(state: DMState): DMState {
  const scores: DMState['scores'] = {};
  const optionIds = new Set(state.options.map((o) => o.id));
  for (const c of state.criteria) {
    const row = state.scores[c.id];
    if (!row) continue;
    scores[c.id] = {};
    for (const [oid, s] of Object.entries(row))
      if (optionIds.has(oid)) scores[c.id][oid] = s;
  }
  return { ...state, scores };
}

// --------------------------------------------------------------- export

/**
 * One CSV field. Quotes fields containing separators, quotes or line
 * breaks, and prefixes text starting with = + - @ so spreadsheets don’t
 * run it as a formula.
 */
export function csvCell(v: string | number): string {
  if (typeof v === 'number') return String(v);
  let s = v;
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** One TSV field: tabs and line breaks would split the cell, so they become spaces. */
export function tsvCell(v: string | number): string {
  if (typeof v === 'number') return String(v);
  const s = v.replace(/[\t\r\n]+/g, ' ');
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
}

export const fmt = (n: number, dp = 2) => String(round(n, dp));

function tableRows(state: DMState): (string | number)[][] {
  const res = computeResults(state);
  const w = normalisedWeights(state.criteria);
  const totals = new Map(res.ranked.map((r) => [r.id, r]));
  const head = [
    'Criterion',
    'Weight (%)',
    'Lower is better',
    ...state.options.map((o) => o.name),
  ];
  const rows = state.criteria.map((c, i) => [
    c.name,
    round(w[i] * 100, 2),
    c.lowerIsBetter ? 'yes' : 'no',
    ...state.options.map((o) => {
      const s = state.scores[c.id]?.[o.id];
      return s === undefined ? '' : s;
    }),
  ]);
  return [
    head,
    ...rows,
    [
      `Weighted total (out of ${state.scale})`,
      '',
      '',
      ...state.options.map((o) => round(totals.get(o.id)?.total ?? 0, 2)),
    ],
    ['Rank', '', '', ...state.options.map((o) => totals.get(o.id)?.rank ?? '')],
  ];
}

export const toCsv = (state: DMState) =>
  tableRows(state)
    .map((r) => r.map(csvCell).join(','))
    .join('\r\n');

export const toTsv = (state: DMState) =>
  tableRows(state)
    .map((r) => r.map(tsvCell).join('\t'))
    .join('\n');

// ------------------------------------------------------------- validate

const isOption = (v: unknown): v is DMOption =>
  isObj(v) && isId(v.id) && isStr(v.name, DM_LIMITS.name);

const isCriterion = (v: unknown): v is DMCriterion =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.name, DM_LIMITS.name) &&
  isFiniteNum(v.weight) &&
  isValidWeight(v.weight) &&
  typeof v.lowerIsBetter === 'boolean';

export function isDecisionMatrixState(v: unknown): v is DMState {
  if (!isObj(v) || v.version !== 1) return false;
  if (v.scale !== 5 && v.scale !== 10) return false;
  if (v.weightMode !== 'percent' && v.weightMode !== 'raw') return false;
  if (!isStr(v.title, 200)) return false;
  if (!isArrayOf(v.options, isOption, DM_LIMITS.options)) return false;
  if (!isArrayOf(v.criteria, isCriterion, DM_LIMITS.criteria)) return false;
  if (!uniqueIds(v.options) || !uniqueIds(v.criteria)) return false;
  if (!isObj(v.scores)) return false;
  const scale = v.scale;
  return Object.values(v.scores).every(
    (row) =>
      isObj(row) &&
      Object.values(row).every((s) => isFiniteNum(s) && isValidScore(s, scale)),
  );
}
