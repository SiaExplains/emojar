// Chemical formula parser and molar-mass calculator. Handles nested
// brackets, Unicode subscripts, hydrates (CuSO4·5H2O) and ignores a trailing
// ionic charge. A light oxidation-state check flags formulas that look
// incomplete (H2SO) without blocking the result.

import { ELEMENTS, type ElementData } from '../data/elements';
import { ToolInputError } from './data';

const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.s, e]));

/** Mass used in calculations: standard atomic weight, else the mass number. */
export const massOf = (e: ElementData) => e.mn ?? e.m;

export type MassRow = {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  mass: number;
  percent: number;
};

export type MolarMassResult = {
  formula: string;
  /** Normalised formula with Unicode subscripts, e.g. H₂O. */
  pretty: string;
  molarMass: number;
  rows: MassRow[];
  notes: string[];
  /** Set when the formula parses but does not balance with common oxidation states. */
  warning?: string;
};

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const toDigits = (s: string) =>
  s.replace(/[₀-₉]/g, (c) => String(SUB.indexOf(c)));

type Counts = Map<string, number>;

function add(into: Counts, from: Counts, times: number) {
  for (const [k, v] of from) into.set(k, (into.get(k) ?? 0) + v * times);
}

function parseGroup(src: string, start: number, close: string | null) {
  const counts: Counts = new Map();
  let i = start;
  const readNumber = () => {
    const m = /^\d+/.exec(src.slice(i));
    if (!m) return 1;
    i += m[0].length;
    const n = Number(m[0]);
    if (n === 0)
      throw new ToolInputError(
        `A count of 0 at position ${i} makes no sense — remove it or use 1 or more.`,
      );
    return n;
  };
  while (i < src.length) {
    const c = src[i];
    if (c === '(' || c === '[' || c === '{') {
      const closing = c === '(' ? ')' : c === '[' ? ']' : '}';
      const inner = parseGroup(src, i + 1, closing);
      i = inner.end + 1;
      add(counts, inner.counts, readNumber());
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      if (c !== close)
        throw new ToolInputError(
          `Unexpected “${c}” — check that every bracket is opened and closed in order.`,
        );
      if (!counts.size)
        throw new ToolInputError('Empty brackets “()” are not allowed.');
      return { counts, end: i };
    }
    const m = /^[A-Z][a-z]?/.exec(src.slice(i));
    if (!m) {
      if (/[a-z]/.test(c))
        throw new ToolInputError(
          `Element symbols start with a capital letter — “${src.slice(i, i + 2)}” at position ${i + 1}. Try “${c.toUpperCase()}${src[i + 1] ?? ''}”.`,
        );
      throw new ToolInputError(`Unexpected “${c}” at position ${i + 1}.`);
    }
    // Prefer a two-letter symbol, fall back to one letter (Co vs C + o).
    let sym = m[0];
    if (!BY_SYMBOL.has(sym) && sym.length === 2 && BY_SYMBOL.has(sym[0]))
      sym = sym[0];
    if (!BY_SYMBOL.has(sym))
      throw new ToolInputError(`“${m[0]}” is not an element symbol.`);
    i += sym.length;
    counts.set(sym, (counts.get(sym) ?? 0) + readNumber());
  }
  if (close) throw new ToolInputError(`Missing a closing “${close}”.`);
  return { counts, end: i };
}

/** Parses a formula into element counts (Hill order is not required). */
export function parseFormula(input: string): {
  counts: Counts;
  notes: string[];
} {
  const notes: string[] = [];
  let s = toDigits(input.trim()).replace(/\s+(?=[·•*.])|(?<=[·•*.])\s+/g, '');
  if (!s) throw new ToolInputError('Enter a chemical formula, e.g. H2O.');
  // Trailing charge: SO4^2-, SO4 2-, NH4+, Fe³⁺.
  const charge = /(\^?\s*[0-9⁰¹²³⁴⁵⁶⁷⁸⁹]*[+\-−⁺⁻])$/.exec(s);
  if (charge && s.length > charge[0].length) {
    s = s.slice(0, -charge[0].length).trim();
    notes.push(
      'The ionic charge is ignored — the mass of the extra or missing electrons is negligible.',
    );
  }
  if (/\s/.test(s))
    throw new ToolInputError(
      'Remove the spaces inside the formula (write CuSO4·5H2O or CuSO4*5H2O for hydrates).',
    );
  const counts: Counts = new Map();
  for (const [idx, part] of s.split(/[·•*.]/).entries()) {
    if (!part)
      throw new ToolInputError(
        'A hydrate separator (· or *) needs a formula on both sides.',
      );
    const lead = /^\d+/.exec(part);
    const coef = lead ? Number(lead[0]) : 1;
    if (coef === 0)
      throw new ToolInputError('A coefficient of 0 makes no sense.');
    const body = lead ? part.slice(lead[0].length) : part;
    if (!body) throw new ToolInputError(`“${part}” has no elements.`);
    const { counts: c } = parseGroup(body, 0, null);
    add(counts, c, coef);
    if (lead && idx === 0)
      notes.push(
        `The leading ${coef} multiplies the whole first part, so this is the mass of ${coef} formula units.`,
      );
  }
  return { counts, notes };
}

const EXTRA_STATES: Record<string, number[]> = {
  // Organic carbon takes every state between −4 and +4.
  C: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
  // −1 in peroxides, +1/+2 with fluorine (O2F2, OF2).
  O: [-2, -1, 1, 2],
  Xe: [2, 4, 6, 8],
  Kr: [2],
  N: [-3, -2, -1, 1, 2, 3, 4, 5],
  P: [-3, 1, 3, 5],
  S: [-2, 4, 6],
};

const isMetal = (category: string) =>
  category !== 'Nonmetal' && /metal$|Lanthanide|Actinide/.test(category);

/** True when some mix of common oxidation states sums to zero. */
export function balancesOxidation(counts: Counts): boolean {
  const entries = [...counts];
  if (entries.length < 2) return true;
  const hydride = entries.every(
    ([sym]) =>
      sym === 'H' ||
      isMetal(BY_SYMBOL.get(sym)!.c) ||
      BY_SYMBOL.get(sym)!.c === 'Metalloid',
  );
  let sums = new Set<number>([0]);
  for (const [sym, n] of entries) {
    const el = BY_SYMBOL.get(sym)!;
    // Hydrogen is −1 in hydrides of metals and metalloids (NaH, B2H6), otherwise +1.
    const states =
      sym === 'H' ? (hydride ? [-1] : [1]) : (EXTRA_STATES[sym] ?? el.ox);
    if (!states.length || n > 40) return true; // unknown or too large to check
    // Reachable totals for n atoms, each picking any listed state.
    let reach = new Set<number>([0]);
    for (let k = 0; k < n; k++) {
      const next = new Set<number>();
      for (const r of reach) for (const st of states) next.add(r + st);
      reach = next;
    }
    const combined = new Set<number>();
    for (const a of sums) for (const b of reach) combined.add(a + b);
    sums = combined;
    if (sums.size > 20000) return true;
  }
  return sums.has(0);
}

const toSub = (n: number) => String(n).replace(/\d/g, (d) => SUB[Number(d)]);

export function prettyFormula(input: string): string {
  return toDigits(input.trim())
    .replace(/\*/g, '·')
    .replace(/(^|[·•.])(\d+)/g, '$1§$2')
    .replace(/(?<=[A-Za-z)\]}])(\d+)/g, (_, d: string) => toSub(Number(d)))
    .replace(/§/g, '');
}

export function molarMass(input: string): MolarMassResult {
  const { counts, notes } = parseFormula(input);
  let total = 0;
  const rows = [...counts].map(([sym, count]) => {
    const el = BY_SYMBOL.get(sym)!;
    const mass = massOf(el) * count;
    total += mass;
    return {
      symbol: sym,
      name: el.n,
      count,
      atomicMass: massOf(el),
      mass,
      percent: 0,
    };
  });
  for (const r of rows) r.percent = (r.mass / total) * 100;
  if (rows.some((r) => BY_SYMBOL.get(r.symbol)!.mn))
    notes.push(
      'Radioactive elements without a standard atomic weight use the mass number of their longest-lived isotope.',
    );
  const warning = balancesOxidation(counts)
    ? undefined
    : 'Invalid or incomplete chemical formula? It doesn’t balance with the common oxidation states of its elements — check for a missing atom or count.';
  return {
    formula: input.trim(),
    pretty: prettyFormula(input),
    molarMass: total,
    rows,
    notes,
    warning,
  };
}
