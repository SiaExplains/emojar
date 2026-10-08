// Turns a JavaScript regular expression into a tree of tokens with a
// plain-English explanation for each, for the regex tester's "Pattern
// breakdown". The pattern is validated with the real RegExp constructor
// first, so the tokenizer only has to understand valid syntax.

export type RegexToken = {
  kind:
    | 'literal'
    | 'any'
    | 'class-escape'
    | 'unicode-property'
    | 'escape'
    | 'anchor'
    | 'class'
    | 'range'
    | 'group'
    | 'lookaround'
    | 'backreference'
    | 'quantifier'
    | 'alternation'
    | 'alternative';
  /** Source text of the token, e.g. "[a-z]" or "(?<year>\d{4})". */
  raw: string;
  start: number;
  end: number;
  description: string;
  children?: RegexToken[];
};

export type RegexGroup = { number: number; name: string | null };

export type RegexExplanation =
  | { ok: true; tokens: RegexToken[]; groups: RegexGroup[]; flags: string[] }
  | { ok: false; error: string };

const FLAG_TEXT: Record<string, string> = {
  g: 'g — global: find every match, not just the first',
  i: 'i — ignore case: letters match in upper or lower case',
  m: 'm — multiline: ^ and $ match at the start and end of each line',
  s: 's — dotAll: . also matches line breaks',
  u: 'u — unicode: treat the pattern as Unicode code points and allow \\p{…}',
  v: 'v — unicode sets: Unicode mode with set operations in classes',
  y: 'y — sticky: only match starting exactly at lastIndex',
  d: 'd — indices: record start and end positions of groups',
};

const CLASS_ESCAPES: Record<string, string> = {
  d: 'a digit (0–9)',
  D: 'any character that is not a digit',
  w: 'a word character (letter, digit or underscore)',
  W: 'any character that is not a word character',
  s: 'a whitespace character (space, tab, line break…)',
  S: 'any character that is not whitespace',
};

const CONTROL_ESCAPES: Record<string, string> = {
  n: 'a line feed (\\n)',
  r: 'a carriage return (\\r)',
  t: 'a tab',
  v: 'a vertical tab',
  f: 'a form feed',
  0: 'the NUL character',
};

const PROPERTIES: Record<string, string> = {
  L: 'letter',
  Letter: 'letter',
  Lu: 'uppercase letter',
  Uppercase_Letter: 'uppercase letter',
  Ll: 'lowercase letter',
  Lowercase_Letter: 'lowercase letter',
  N: 'number',
  Nd: 'decimal digit',
  P: 'punctuation',
  S: 'symbol',
  Sc: 'currency symbol',
  Z: 'separator',
  Zs: 'space separator',
  M: 'combining mark',
  Emoji: 'emoji',
  Emoji_Presentation: 'emoji shown as a picture',
  Extended_Pictographic: 'pictographic symbol (most emoji)',
  Alphabetic: 'alphabetic character',
  White_Space: 'whitespace character',
  ASCII: 'ASCII character',
  Any: 'any code point',
};

function describeProperty(body: string): string {
  const [name, value] = body.includes('=') ? body.split('=') : [body, ''];
  if (value) {
    const what =
      name === 'Script' || name === 'sc'
        ? 'script'
        : name === 'Script_Extensions' || name === 'scx'
          ? 'script (including shared characters)'
          : name === 'General_Category' || name === 'gc'
            ? 'category'
            : name;
    return `${what} ${PROPERTIES[value] ?? value.replace(/_/g, ' ')}`;
  }
  return PROPERTIES[name] ?? `Unicode property ${name.replace(/_/g, ' ')}`;
}

function showChar(ch: string): string {
  if (ch === ' ') return 'a space';
  if (ch === '\n') return 'a line feed';
  if (ch === '\t') return 'a tab';
  return `“${ch}”`;
}

/** Counts capturing groups so \N can be told apart from an octal escape. */
function countGroups(p: string): number {
  let n = 0;
  let inClass = false;
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '\\') i++;
    else if (inClass) {
      if (c === ']') inClass = false;
    } else if (c === '[') inClass = true;
    else if (c === '(') {
      if (p[i + 1] !== '?') n++;
      else if (p[i + 2] === '<' && p[i + 3] !== '=' && p[i + 3] !== '!') n++;
    }
  }
  return n;
}

class Parser {
  i = 0;
  groupNo = 0;
  groups: RegexGroup[] = [];
  constructor(
    readonly src: string,
    readonly flags: string,
    readonly totalGroups: number,
  ) {}

  get unicode() {
    return this.flags.includes('u') || this.flags.includes('v');
  }

  peek(offset = 0) {
    return this.src[this.i + offset];
  }

  /** Disjunction: alternatives separated by | until `)` or the end. */
  parseAlternation(): RegexToken[] {
    const start = this.i;
    const alternatives: RegexToken[][] = [this.parseSequence()];
    const starts = [start];
    const ends = [this.i];
    while (this.peek() === '|') {
      this.i++;
      starts.push(this.i);
      alternatives.push(this.parseSequence());
      ends.push(this.i);
    }
    if (alternatives.length === 1) return alternatives[0];
    return [
      {
        kind: 'alternation',
        raw: this.src.slice(start, this.i),
        start,
        end: this.i,
        description: `Either of ${alternatives.length} alternatives (|) — the first one that matches wins`,
        children: alternatives.map((seq, k) => ({
          kind: 'alternative',
          raw: this.src.slice(starts[k], ends[k]),
          start: starts[k],
          end: ends[k],
          description: seq.length
            ? `Alternative ${k + 1}`
            : `Alternative ${k + 1}: empty (matches nothing, always succeeds)`,
          children: seq,
        })),
      },
    ];
  }

  parseSequence(): RegexToken[] {
    const out: RegexToken[] = [];
    while (
      this.i < this.src.length &&
      this.peek() !== '|' &&
      this.peek() !== ')'
    ) {
      const atom = this.parseAtom();
      const q = this.parseQuantifier(atom);
      const prev = out[out.length - 1];
      // Merge runs of plain characters into one readable literal.
      if (
        !q &&
        atom.kind === 'literal' &&
        prev?.kind === 'literal' &&
        prev.end === atom.start
      ) {
        this.mergeLiteral(prev, atom);
        prev.raw += atom.raw;
        prev.end = atom.end;
        prev.description = this.literalText(prev);
      } else out.push(q ?? atom);
    }
    return out;
  }

  /** The characters a merged literal matches, kept on the token for re-describing. */
  private literalValues = new WeakMap<RegexToken, string>();

  private literalText(token: RegexToken): string {
    const value = this.literalValues.get(token) ?? '';
    const ci = this.flags.includes('i') ? ' (any case)' : '';
    return value.length === 1
      ? `Matches ${showChar(value)} literally${ci}`
      : `Matches the text “${value}” literally${ci}`;
  }

  private literal(start: number, value: string): RegexToken {
    const token: RegexToken = {
      kind: 'literal',
      raw: this.src.slice(start, this.i),
      start,
      end: this.i,
      description: '',
    };
    this.literalValues.set(token, value);
    token.description = this.literalText(token);
    return token;
  }

  private mergeLiteral(prev: RegexToken, next: RegexToken) {
    this.literalValues.set(
      prev,
      (this.literalValues.get(prev) ?? '') +
        (this.literalValues.get(next) ?? ''),
    );
  }

  parseQuantifier(atom: RegexToken): RegexToken | null {
    const c = this.peek();
    let min = 0;
    let max: number | null = null;
    if (c === '*') {
      this.i++;
    } else if (c === '+') {
      min = 1;
      this.i++;
    } else if (c === '?') {
      max = 1;
      this.i++;
    } else if (c === '{') {
      const m = /^\{(\d+)(,(\d*))?\}/.exec(this.src.slice(this.i));
      if (!m) return null;
      min = Number(m[1]);
      max = m[2] === undefined ? min : m[3] ? Number(m[3]) : null;
      this.i += m[0].length;
    } else return null;
    const lazy = this.peek() === '?';
    if (lazy) this.i++;
    let count: string;
    if (c === '*') count = 'zero or more times';
    else if (c === '+') count = 'one or more times';
    else if (c === '?') count = 'optionally (zero or one time)';
    else if (max === min) count = `exactly ${min} time${min === 1 ? '' : 's'}`;
    else if (max === null) count = `${min} or more times`;
    else count = `between ${min} and ${max} times`;
    const fixed = c === '{' && max === min;
    const mode = fixed
      ? ''
      : lazy
        ? ' — as few as possible (lazy)'
        : ' — as many as possible (greedy)';
    return {
      kind: 'quantifier',
      raw: this.src.slice(atom.start, this.i),
      start: atom.start,
      end: this.i,
      description: `Repeat the item below ${count}${mode}`,
      children: [atom],
    };
  }

  parseAtom(): RegexToken {
    const start = this.i;
    const c = this.src[this.i];
    if (c === '(') return this.parseGroup();
    if (c === '[') return this.parseClass();
    if (c === '\\') return this.parseEscape(false);
    this.i++;
    if (c === '.')
      return {
        kind: 'any',
        raw: '.',
        start,
        end: this.i,
        description: this.flags.includes('s')
          ? 'Any single character, including line breaks (s flag)'
          : 'Any single character except a line break',
      };
    if (c === '^' || c === '$') {
      const m = this.flags.includes('m');
      const where = c === '^' ? 'start' : 'end';
      return {
        kind: 'anchor',
        raw: c,
        start,
        end: this.i,
        description: m
          ? `Anchor: the ${where} of a line (m flag)`
          : `Anchor: the ${where} of the text`,
      };
    }
    // A code point outside the BMP is one character in u mode.
    if (this.unicode) {
      const cp = this.src.codePointAt(start)!;
      if (cp > 0xffff) this.i++;
    }
    return this.literal(start, this.src.slice(start, this.i));
  }

  parseGroup(): RegexToken {
    const start = this.i;
    this.i++; // (
    let kind: RegexToken['kind'] = 'group';
    let description: string;
    if (this.src.startsWith('?:', this.i)) {
      this.i += 2;
      description =
        'Non-capturing group — groups the items without saving the match';
    } else if (this.src.startsWith('?=', this.i)) {
      this.i += 2;
      kind = 'lookaround';
      description =
        'Lookahead — the following text must match this, without consuming it';
    } else if (this.src.startsWith('?!', this.i)) {
      this.i += 2;
      kind = 'lookaround';
      description =
        'Negative lookahead — the following text must NOT match this';
    } else if (this.src.startsWith('?<=', this.i)) {
      this.i += 3;
      kind = 'lookaround';
      description = 'Lookbehind — the preceding text must match this';
    } else if (this.src.startsWith('?<!', this.i)) {
      this.i += 3;
      kind = 'lookaround';
      description =
        'Negative lookbehind — the preceding text must NOT match this';
    } else if (this.src.startsWith('?<', this.i)) {
      const close = this.src.indexOf('>', this.i);
      const name = this.src.slice(this.i + 2, close);
      this.i = close + 1;
      const number = ++this.groupNo;
      this.groups.push({ number, name });
      description = `Capturing group ${number} named “${name}”`;
    } else if (this.peek() === '?') {
      // Modifier groups such as (?i:…) — newer syntax.
      const m = /^\?([a-z]*)(?:-([a-z]*))?:/.exec(this.src.slice(this.i));
      this.i += m ? m[0].length : 1;
      description = m
        ? `Modifier group — ${m[1] ? `turns on ${m[1]}` : ''}${m[1] && m[2] ? ', ' : ''}${m[2] ? `turns off ${m[2]}` : ''} for its contents`
        : 'Group';
    } else {
      const number = ++this.groupNo;
      this.groups.push({ number, name: null });
      description = `Capturing group ${number} — saves what it matches as $${number}`;
    }
    const children = this.parseAlternation();
    if (this.peek() === ')') this.i++;
    return {
      kind,
      raw: this.src.slice(start, this.i),
      start,
      end: this.i,
      description,
      children,
    };
  }

  parseClass(): RegexToken {
    const start = this.i;
    this.i++; // [
    const negated = this.peek() === '^';
    if (negated) this.i++;
    const items: RegexToken[] = [];
    while (this.i < this.src.length && this.peek() !== ']') {
      const itemStart = this.i;
      const from = this.classAtom();
      if (
        this.peek() === '-' &&
        this.peek(1) !== ']' &&
        this.peek(1) !== undefined &&
        from.kind === 'literal'
      ) {
        this.i++; // -
        const to = this.classAtom();
        if (to.kind === 'literal') {
          items.push({
            kind: 'range',
            raw: this.src.slice(itemStart, this.i),
            start: itemStart,
            end: this.i,
            description: `Range: any character from ${showChar(this.literalValues.get(from) ?? from.raw)} to ${showChar(this.literalValues.get(to) ?? to.raw)}`,
          });
          continue;
        }
        // "[\w-x]"-style: the hyphen is literal (only valid without u).
        items.push(from);
        const dashAt = to.start - 1;
        items.push({
          kind: 'literal',
          raw: '-',
          start: dashAt,
          end: dashAt + 1,
          description: 'Matches “-” literally',
        });
        items.push(to);
        continue;
      }
      items.push(from);
    }
    if (this.peek() === ']') this.i++;
    const raw = this.src.slice(start, this.i);
    const description =
      items.length === 0
        ? negated
          ? 'Any single character at all ([^] matches everything)'
          : 'An empty class — never matches'
        : negated
          ? 'Any one character that is NOT listed below'
          : 'Any one of the characters listed below';
    return {
      kind: 'class',
      raw,
      start,
      end: this.i,
      description,
      children: items,
    };
  }

  private classAtom(): RegexToken {
    const start = this.i;
    if (this.peek() === '\\') return this.parseEscape(true);
    this.i++;
    if (this.unicode) {
      const cp = this.src.codePointAt(start)!;
      if (cp > 0xffff) this.i++;
    }
    const value = this.src.slice(start, this.i);
    const token: RegexToken = {
      kind: 'literal',
      raw: value,
      start,
      end: this.i,
      description: `The character ${showChar(value)}`,
    };
    this.literalValues.set(token, value);
    return token;
  }

  parseEscape(inClass: boolean): RegexToken {
    const start = this.i;
    this.i++; // backslash
    const c = this.src[this.i];
    this.i++;
    const make = (
      kind: RegexToken['kind'],
      description: string,
    ): RegexToken => ({
      kind,
      raw: this.src.slice(start, this.i),
      start,
      end: this.i,
      description,
    });
    const lit = (value: string, what?: string): RegexToken => {
      const token = this.literal(start, value);
      if (what)
        token.description = inClass
          ? `The character ${what}`
          : `Matches ${what}`;
      else if (inClass) token.description = `The character ${showChar(value)}`;
      return token;
    };
    if (c === undefined) return lit('\\');
    if (c in CLASS_ESCAPES)
      return make(
        'class-escape',
        `${inClass ? '' : 'Matches '}${CLASS_ESCAPES[c]} (\\${c})`,
      );
    if (c === 'b')
      return inClass
        ? lit('\b', 'a backspace')
        : make(
            'anchor',
            'Word boundary (\\b) — between a word character and a non-word character',
          );
    if (c === 'B') return make('anchor', 'Not a word boundary (\\B)');
    if ((c === 'p' || c === 'P') && this.unicode && this.peek() === '{') {
      const close = this.src.indexOf('}', this.i);
      const body = this.src.slice(this.i + 1, close);
      this.i = close + 1;
      const what = describeProperty(body);
      const article = /^[aeiou]/i.test(what) ? 'an' : 'a';
      return make(
        'unicode-property',
        `${c === 'P' ? `Any character that is NOT ${article}` : article === 'an' ? 'An' : 'A'} ${what} (\\${c}{${body}})`,
      );
    }
    if (
      c === 'k' &&
      this.peek() === '<' &&
      (this.unicode || this.src.includes('(?<'))
    ) {
      const close = this.src.indexOf('>', this.i);
      const name = this.src.slice(this.i + 1, close);
      this.i = close + 1;
      return make(
        'backreference',
        `Backreference — the same text group “${name}” matched`,
      );
    }
    if (c in CONTROL_ESCAPES && !(c === '0' && /[0-9]/.test(this.peek() ?? '')))
      return lit(
        c === '0'
          ? '\0'
          : (JSON.parse(`"\\${c === 'v' ? 'u000b' : c}"`) as string),
        CONTROL_ESCAPES[c],
      );
    if (/[1-9]/.test(c) && !inClass) {
      const m = /^\d*/.exec(this.src.slice(this.i))!;
      const n = Number(c + m[0]);
      if (n <= this.totalGroups) {
        this.i += m[0].length;
        return make(
          'backreference',
          `Backreference — the same text group ${n} matched`,
        );
      }
    }
    if (c === 'x' && /^[0-9a-fA-F]{2}/.test(this.src.slice(this.i))) {
      this.i += 2;
      const ch = String.fromCharCode(
        parseInt(this.src.slice(this.i - 2, this.i), 16),
      );
      return lit(ch, `${showChar(ch)} (hex ${this.src.slice(start, this.i)})`);
    }
    if (c === 'u') {
      const braced = /^\{([0-9a-fA-F]+)\}/.exec(this.src.slice(this.i));
      if (braced && this.unicode) {
        this.i += braced[0].length;
        const ch = String.fromCodePoint(parseInt(braced[1], 16));
        return lit(ch, `${showChar(ch)} (U+${braced[1].toUpperCase()})`);
      }
      const hex = /^[0-9a-fA-F]{4}/.exec(this.src.slice(this.i));
      if (hex) {
        this.i += 4;
        const ch = String.fromCharCode(parseInt(hex[0], 16));
        return lit(ch, `${showChar(ch)} (U+${hex[0].toUpperCase()})`);
      }
    }
    if (c === 'c' && /^[A-Za-z]/.test(this.src.slice(this.i))) {
      const letter = this.src[this.i];
      this.i++;
      return lit(
        String.fromCharCode(letter.toUpperCase().charCodeAt(0) % 32),
        `the control character Ctrl+${letter.toUpperCase()}`,
      );
    }
    if (/[0-7]/.test(c) && !this.unicode) {
      // Legacy octal escape, only outside unicode mode.
      const m = /^[0-7]{0,2}/.exec(this.src.slice(this.i))!;
      this.i += m[0].length;
      const ch = String.fromCharCode(parseInt(c + m[0], 8));
      return lit(ch, `${showChar(ch)} (octal escape)`);
    }
    // Escaped punctuation like \. \* \( — or an identity escape.
    return lit(c);
  }
}

/** Explains `pattern` with `flags`; invalid patterns return the engine's error. */
export function explainRegex(pattern: string, flags = ''): RegexExplanation {
  try {
    new RegExp(pattern, flags);
  } catch (e) {
    return {
      ok: false,
      error: (e instanceof Error ? e.message : 'Invalid pattern').replace(
        /^Invalid regular expression: /,
        '',
      ),
    };
  }
  const parser = new Parser(pattern, flags, countGroups(pattern));
  const tokens = parser.parseAlternation();
  return {
    ok: true,
    tokens,
    groups: parser.groups,
    flags: [...flags].filter((f) => f in FLAG_TEXT).map((f) => FLAG_TEXT[f]),
  };
}
