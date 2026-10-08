// CSS selector specificity (Selectors Level 4), computed by a small
// recursive-descent parser so that :is(), :not(), :has(), :where() and
// :nth-child(An+B of S) get their real rules instead of a regex guess.

/** (a, b, c): IDs; classes, attributes and pseudo-classes; elements and pseudo-elements. */
export type Specificity = [number, number, number];

export type PartKind =
  | 'id'
  | 'class'
  | 'attribute'
  | 'pseudo-class'
  | 'pseudo-element'
  | 'type'
  | 'universal'
  | 'combinator'
  | 'nesting';

export type SelectorPart = {
  text: string;
  kind: PartKind;
  /** Offsets into the selector text, for highlighting. */
  start: number;
  end: number;
  specificity: Specificity;
  /** Why the part counts the way it does, for the less obvious rules. */
  note?: string;
};

export type SpecificityEntry = {
  /** 1-based line of the input the selector came from. */
  line: number;
  selector: string;
  specificity: Specificity | null;
  parts: SelectorPart[];
  error: string | null;
};

class SelectorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SelectorError';
  }
}

const ZERO: Specificity = [0, 0, 0];
const add = (x: Specificity, y: Specificity): Specificity => [
  x[0] + y[0],
  x[1] + y[1],
  x[2] + y[2],
];

/** Positive when `x` is more specific than `y`. */
export function compareSpecificity(x: Specificity, y: Specificity): number {
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

const maxOf = (list: Specificity[]): Specificity =>
  list.reduce((m, s) => (compareSpecificity(s, m) > 0 ? s : m), ZERO);

export const formatSpecificity = (s: Specificity) => `(${s.join(', ')})`;

// Pseudo-elements that CSS2 allowed with a single colon; they still count
// as elements (c), not pseudo-classes.
const LEGACY_PSEUDO_ELEMENTS = new Set([
  'before',
  'after',
  'first-line',
  'first-letter',
]);
const MATCHES_ANY = new Set([
  'is',
  'not',
  'has',
  'matches',
  '-webkit-any',
  '-moz-any',
]);
const NTH_OF = new Set(['nth-child', 'nth-last-child']);
const NTH_PLAIN = new Set([
  'nth-of-type',
  'nth-last-of-type',
  'nth-col',
  'nth-last-col',
]);
const WITH_SELECTOR_ARG = new Set(['host', 'host-context']);

const isWs = (c: string | undefined) =>
  c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f';
const isHex = (c: string | undefined) => !!c && /^[0-9a-fA-F]$/.test(c);
const isNameStart = (c: string | undefined) =>
  !!c && (/^[a-zA-Z_]$/.test(c) || c.charCodeAt(0) >= 0x80);
const isNameChar = (c: string | undefined) =>
  !!c && (isNameStart(c) || /^[0-9-]$/.test(c));

const ANB =
  /^\s*(?:odd|even|[+-]?\d+|[+-]?\d*n(?:\s*[+-]\s*\d+)?|[+-]?\d*n\s*-\d+)\s*$/i;

class Parser {
  i = 0;
  constructor(readonly s: string) {}

  /** End of an escape starting at `i` (which must be a backslash). */
  private escapeEnd(i: number): number {
    const next = this.s[i + 1];
    if (next === undefined || next === '\n' || next === '\r' || next === '\f')
      throw new SelectorError('A backslash at the end escapes nothing.');
    if (isHex(next)) {
      let j = i + 1;
      while (j < i + 7 && isHex(this.s[j])) j++;
      if (isWs(this.s[j])) j++;
      return j;
    }
    const cp = this.s.codePointAt(i + 1) ?? 0;
    return i + 1 + (cp > 0xffff ? 2 : 1);
  }

  private startsIdent(i: number): boolean {
    const c = this.s[i];
    if (c === '\\') return this.s[i + 1] !== undefined;
    if (c === '-') {
      const n = this.s[i + 1];
      return n === '-' || isNameStart(n) || n === '\\';
    }
    return isNameStart(c);
  }

  /** Reads an identifier at `i`; returns its end, or `i` when there is none. */
  private ident(i: number): number {
    if (!this.startsIdent(i)) return i;
    let j = i;
    while (j < this.s.length) {
      const c = this.s[j];
      if (c === '\\') j = this.escapeEnd(j);
      else if (isNameChar(c)) j++;
      else break;
    }
    return j;
  }

  private skipWs() {
    while (isWs(this.s[this.i])) this.i++;
  }

  /** Index after a quoted string starting at `i`. */
  private stringEnd(i: number): number {
    const q = this.s[i];
    let j = i + 1;
    while (j < this.s.length) {
      const c = this.s[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === '\n') break;
      if (c === q) return j + 1;
      j++;
    }
    throw new SelectorError(`A quoted value is missing its closing ${q}.`);
  }

  /** Index of the ")" matching the "(" at `i`. */
  private closeParen(i: number): number {
    const stack: string[] = [];
    let j = i;
    while (j < this.s.length) {
      const c = this.s[j];
      if (c === '\\') j = this.escapeEnd(j);
      else if (c === '"' || c === "'") j = this.stringEnd(j);
      else {
        if (c === '(' || c === '[') stack.push(c === '(' ? ')' : ']');
        else if (c === ')' || c === ']') {
          if (stack.pop() !== c)
            throw new SelectorError(`Unbalanced brackets near “${c}”.`);
          if (!stack.length) return j;
        }
        j++;
      }
    }
    throw new SelectorError('A “(” is never closed — add the missing “)”.');
  }

  /**
   * A comma-separated selector list, stopping at the end of input or at a
   * ")" when parsing a function's argument.
   */
  list(inParens: boolean, relative: boolean) {
    const items: { specificity: Specificity; parts: SelectorPart[] }[] = [];
    for (;;) {
      items.push(this.complex(inParens, relative));
      if (this.s[this.i] === ',') {
        this.i++;
        continue;
      }
      break;
    }
    return items;
  }

  private complex(inParens: boolean, relative: boolean) {
    const parts: SelectorPart[] = [];
    let spec: Specificity = ZERO;
    let sawCompound = false;
    let needCompound = false;
    let compoundOpen = false;
    this.skipWs();
    const startAt = this.i;

    const combinator = (len: number) => {
      if (needCompound)
        throw new SelectorError('Two combinators in a row — remove one.');
      if (!sawCompound && !(relative && this.i === startAt))
        throw new SelectorError(
          `The selector can’t start with the “${this.s.slice(this.i, this.i + len)}” combinator.`,
        );
      parts.push({
        text: this.s.slice(this.i, this.i + len),
        kind: 'combinator',
        start: this.i,
        end: this.i + len,
        specificity: ZERO,
      });
      this.i += len;
      needCompound = true;
      compoundOpen = false;
    };

    for (;;) {
      const c = this.s[this.i];
      if (c === undefined || c === ',') break;
      if (c === ')') {
        if (inParens) break;
        throw new SelectorError('There is a “)” without a matching “(”.');
      }
      if (c === ']')
        throw new SelectorError('There is a “]” without a matching “[”.');
      if (isWs(c)) {
        this.skipWs();
        compoundOpen = false;
        continue;
      }
      if (c === '>' || c === '+' || c === '~') {
        combinator(1);
        continue;
      }
      if (c === '|' && this.s[this.i + 1] === '|') {
        combinator(2);
        continue;
      }
      const part = this.simple(compoundOpen);
      parts.push(part);
      spec = add(spec, part.specificity);
      sawCompound = true;
      needCompound = false;
      compoundOpen = true;
    }
    if (needCompound)
      throw new SelectorError(
        'The selector ends with a combinator — add what it should select after it.',
      );
    if (!sawCompound)
      throw new SelectorError(
        inParens
          ? 'A selector inside “( )” is empty.'
          : 'The selector is empty.',
      );
    return { specificity: spec, parts };
  }

  /** One simple selector: #id, .class, [attr], :pseudo, ::pseudo, type, *, &. */
  private simple(inCompound: boolean): SelectorPart {
    const s = this.s;
    const start = this.i;
    const c = s[start];
    const done = (
      kind: PartKind,
      specificity: Specificity,
      note?: string,
    ): SelectorPart => ({
      text: s.slice(start, this.i),
      kind,
      start,
      end: this.i,
      specificity,
      ...(note ? { note } : {}),
    });

    if (c === '#') {
      const end = this.ident(start + 1);
      if (end === start + 1)
        throw new SelectorError(
          /\d/.test(s[start + 1] ?? '')
            ? `An ID can’t start with a digit — escape it, e.g. #\\3${s[start + 1]} .`
            : 'A “#” must be followed by an ID name.',
        );
      this.i = end;
      return done('id', [1, 0, 0]);
    }
    if (c === '.') {
      const end = this.ident(start + 1);
      if (end === start + 1)
        throw new SelectorError('A “.” must be followed by a class name.');
      this.i = end;
      return done('class', [0, 1, 0]);
    }
    if (c === '[') {
      this.attribute();
      return done('attribute', [0, 1, 0]);
    }
    if (c === '&') {
      this.i++;
      return done(
        'nesting',
        ZERO,
        'The nesting selector takes the specificity of its parent rule, which isn’t known here.',
      );
    }
    if (c === ':') return this.pseudo(start);
    if (c === '*' || c === '|' || this.startsIdent(start)) {
      if (inCompound)
        throw new SelectorError(
          'An element name or * must come first in a compound selector (write div.card, not .carddiv).',
        );
      return this.typeSelector(start, done);
    }
    throw new SelectorError(`Unexpected character “${c}”.`);
  }

  private typeSelector(
    start: number,
    done: (kind: PartKind, s: Specificity) => SelectorPart,
  ) {
    const s = this.s;
    // Optional namespace prefix: ns|, *| or a bare |.
    let j = start;
    if (s[j] === '*') j++;
    else j = this.ident(j);
    if (s[j] === '|' && s[j + 1] !== '|' && s[j + 1] !== '=') {
      const k = j + 1;
      if (s[k] === '*') {
        this.i = k + 1;
        return done('universal', ZERO);
      }
      const end = this.ident(k);
      if (end === k)
        throw new SelectorError(
          'A namespace “|” must be followed by an element name or *.',
        );
      this.i = end;
      return done('type', [0, 0, 1]);
    }
    if (s[start] === '|')
      throw new SelectorError('A “|” must be followed by an element name.');
    this.i = j;
    return s[start] === '*' ? done('universal', ZERO) : done('type', [0, 0, 1]);
  }

  private attribute() {
    const s = this.s;
    this.i++;
    this.skipWs();
    // Optional namespace: ns|attr, *|attr, |attr.
    let j = this.i;
    if (s[j] === '*' && s[j + 1] === '|') j += 2;
    else if (s[j] === '|' && s[j + 1] !== '=') j += 1;
    else {
      const e = this.ident(j);
      if (s[e] === '|' && s[e + 1] !== '=' && e > j) j = e + 1;
    }
    const nameEnd = this.ident(j);
    if (nameEnd === j)
      throw new SelectorError(
        s[j] === undefined
          ? 'A “[” is never closed — add the missing “]”.'
          : 'An attribute selector needs an attribute name, e.g. [type="text"].',
      );
    this.i = nameEnd;
    this.skipWs();
    const op = s.slice(this.i, this.i + 2);
    if (s[this.i] === '=' || /^[~|^$*]=$/.test(op)) {
      this.i += s[this.i] === '=' ? 1 : 2;
      this.skipWs();
      const v = s[this.i];
      if (v === '"' || v === "'") this.i = this.stringEnd(this.i);
      else {
        const e = this.ident(this.i);
        if (e === this.i) {
          // Unquoted values must be identifiers; digits need quotes.
          throw new SelectorError(
            v === undefined || v === ']'
              ? 'The attribute selector has an operator but no value.'
              : 'Put the attribute value in quotes, e.g. [data-id="1"].',
          );
        }
        this.i = e;
      }
      this.skipWs();
      if (/^[iIsS]$/.test(s[this.i] ?? '') && !isNameChar(s[this.i + 1])) {
        this.i++;
        this.skipWs();
      }
    }
    if (s[this.i] !== ']')
      throw new SelectorError(
        s[this.i] === undefined
          ? 'A “[” is never closed — add the missing “]”.'
          : `Unexpected “${s[this.i]}” inside an attribute selector.`,
      );
    this.i++;
  }

  private pseudo(start: number): SelectorPart {
    const s = this.s;
    const element = s[start + 1] === ':';
    const nameStart = start + (element ? 2 : 1);
    const nameEnd = this.ident(nameStart);
    if (nameEnd === nameStart)
      throw new SelectorError(
        `A “${element ? '::' : ':'}” must be followed by a pseudo-${element ? 'element' : 'class'} name.`,
      );
    const name = s.slice(nameStart, nameEnd).toLowerCase();
    this.i = nameEnd;
    const fn = s[this.i] === '(';
    const make = (
      kind: PartKind,
      specificity: Specificity,
      note?: string,
    ): SelectorPart => ({
      text: s.slice(start, this.i),
      kind,
      start,
      end: this.i,
      specificity,
      ...(note ? { note } : {}),
    });

    /** Parses "(list)" and returns the most specific item. */
    const argList = (relative: boolean, allowEmpty: boolean) => {
      this.i++;
      this.skipWs();
      if (s[this.i] === ')') {
        if (!allowEmpty)
          throw new SelectorError(`:${name}() needs at least one selector.`);
        this.i++;
        return { max: ZERO, best: '' };
      }
      const from = this.i;
      const items = this.list(true, relative);
      if (s[this.i] !== ')')
        throw new SelectorError(
          `:${name}( is never closed — add the missing “)”.`,
        );
      const max = maxOf(items.map((x) => x.specificity));
      const best = items.find((x) => x.specificity === max);
      const bestText = best?.parts.length
        ? s
            .slice(best.parts[0].start, best.parts[best.parts.length - 1].end)
            .trim()
        : s.slice(from, this.i).trim();
      this.i++;
      return { max, best: bestText };
    };

    if (element) {
      if (fn && name === 'slotted') {
        const { max, best } = argList(false, false);
        return make(
          'pseudo-element',
          add([0, 0, 1], max),
          `::slotted() counts as a pseudo-element plus its argument (${best}).`,
        );
      }
      if (fn) this.i = this.closeParen(this.i) + 1;
      return make('pseudo-element', [0, 0, 1]);
    }

    if (!fn) {
      if (LEGACY_PSEUDO_ELEMENTS.has(name))
        return make(
          'pseudo-element',
          [0, 0, 1],
          `:${name} is a pseudo-element written with the old single colon, so it counts as an element.`,
        );
      return make('pseudo-class', [0, 1, 0]);
    }

    if (MATCHES_ANY.has(name)) {
      const { max, best } = argList(
        name === 'has',
        name !== 'not' && name !== 'has',
      );
      return make(
        'pseudo-class',
        max,
        best
          ? `:${name}() takes the specificity of its most specific argument: ${best} ${formatSpecificity(max)}.`
          : `:${name}() with no arguments counts 0.`,
      );
    }
    if (name === 'where') {
      argList(false, true);
      return make('pseudo-class', ZERO, ':where() always counts 0.');
    }
    if (NTH_OF.has(name) || NTH_PLAIN.has(name)) {
      const close = this.closeParen(this.i);
      const inner = s.slice(this.i + 1, close);
      const of = NTH_OF.has(name) ? inner.match(/^([\s\S]*?)\s+of\s+/i) : null;
      const anb = of ? of[1] : inner;
      if (!ANB.test(anb))
        throw new SelectorError(
          `:${name}(${anb.trim()}) isn’t a valid An+B value — try 2n+1, odd or 3.`,
        );
      if (!of) {
        this.i = close + 1;
        return make('pseudo-class', [0, 1, 0]);
      }
      // Re-use argList for "S)" by stepping to just before S.
      this.i = this.i + of[0].length;
      const { max, best } = argList(false, false);
      return make(
        'pseudo-class',
        add([0, 1, 0], max),
        `:${name}(… of S) counts the pseudo-class plus the most specific selector in S: ${best} ${formatSpecificity(max)}.`,
      );
    }
    if (WITH_SELECTOR_ARG.has(name)) {
      const { max, best } = argList(false, false);
      return make(
        'pseudo-class',
        add([0, 1, 0], max),
        `:${name}() counts the pseudo-class plus its argument (${best}).`,
      );
    }
    this.i = this.closeParen(this.i) + 1;
    return make('pseudo-class', [0, 1, 0]);
  }
}

/** Specificity of one selector (no top-level commas). Throws on bad input. */
function analyzeOne(selector: string): {
  specificity: Specificity;
  parts: SelectorPart[];
} {
  const p = new Parser(selector);
  const items = p.list(false, false);
  if (items.length !== 1 || p.i < selector.length)
    throw new SelectorError('Unexpected text after the selector.');
  return items[0];
}

/** Specificity of a single selector, or an error message. */
export function calculateSpecificity(selector: string): {
  specificity: Specificity | null;
  parts: SelectorPart[];
  error: string | null;
} {
  try {
    const r = analyzeOne(selector);
    return { ...r, error: null };
  } catch (e) {
    return {
      specificity: null,
      parts: [],
      error:
        e instanceof SelectorError ? e.message : 'This selector can’t be read.',
    };
  }
}

/**
 * Splits a selector list at top-level commas, ignoring commas inside
 * ( ), [ ], quotes and escapes. Unbalanced input still splits; the parser
 * reports the problem per selector.
 */
export function splitSelectorList(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote = '';
  let cur = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '\\') {
      cur += c + (input[i + 1] ?? '');
      i++;
      continue;
    }
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth = Math.max(0, depth - 1);
    else if (c === ',' && depth === 0) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

/** Drops comments and a pasted "{ declarations }" block. */
function cleanLine(line: string): string {
  let s = line.replace(/\/\*[\s\S]*?\*\//g, '');
  let quote = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\') {
      i++;
      continue;
    }
    if (quote) {
      if (c === quote) quote = '';
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '{') {
      s = s.slice(0, i);
      break;
    }
  }
  return s.trim();
}

/** One entry per selector: one per line, with selector lists split apart. */
export function analyzeSelectors(input: string): SpecificityEntry[] {
  const entries: SpecificityEntry[] = [];
  input.split(/\r?\n/).forEach((raw, idx) => {
    const line = cleanLine(raw);
    if (!line) return;
    const pieces = splitSelectorList(line);
    pieces.forEach((piece, k) => {
      const selector = piece.trim();
      if (!selector) {
        entries.push({
          line: idx + 1,
          selector: line,
          specificity: null,
          parts: [],
          error:
            k === pieces.length - 1
              ? 'The selector list ends with a comma — remove it or add a selector.'
              : 'There is an empty selector between two commas.',
        });
        return;
      }
      entries.push({
        line: idx + 1,
        selector,
        ...calculateSpecificity(selector),
      });
    });
  });
  return entries;
}

/**
 * Valid entries sorted from most to least specific. Among equal ones the
 * one written later comes first, because it wins in the cascade.
 */
export function rankEntries(entries: SpecificityEntry[]) {
  return entries
    .map((e, order) => ({ e, order }))
    .filter(
      (
        x,
      ): x is {
        e: SpecificityEntry & { specificity: Specificity };
        order: number;
      } => x.e.specificity !== null,
    )
    .sort(
      (x, y) =>
        compareSpecificity(y.e.specificity, x.e.specificity) ||
        y.order - x.order,
    );
}
