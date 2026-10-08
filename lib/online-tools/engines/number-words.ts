// Number → English words (cardinal, ordinal, cheque style) and Roman numerals.

import { ToolInputError } from './data';

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];
const SCALES = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
  'sextillion',
];

function belowThousand(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) parts.push(`${ONES[h]} hundred`);
  if (rest) {
    if (rest < 20) parts.push(ONES[rest]);
    else
      parts.push(
        TENS[Math.floor(rest / 10)] + (rest % 10 ? `-${ONES[rest % 10]}` : ''),
      );
  }
  return parts.join(' ');
}

/** Integer words for a non-negative integer given as a digit string (BigInt-safe). */
function integerWords(digits: string, opts: { and?: boolean } = {}): string {
  const clean = digits.replace(/^0+(?=\d)/, '');
  if (clean === '0') return 'zero';
  if (clean.length > SCALES.length * 3)
    throw new ToolInputError(
      `Numbers up to ${SCALES.length * 3} digits are supported.`,
    );
  const groups: number[] = [];
  for (let end = clean.length; end > 0; end -= 3)
    groups.unshift(Number(clean.slice(Math.max(0, end - 3), end)));
  const words: string[] = [];
  groups.forEach((g, i) => {
    if (!g) return;
    const scale = SCALES[groups.length - 1 - i];
    let w = belowThousand(g);
    // British style "one hundred and five".
    if (
      opts.and &&
      g % 100 &&
      (g >= 100 || (i === groups.length - 1 && groups.length > 1))
    ) {
      w = g >= 100 ? w.replace(/ hundred /, ' hundred and ') : `and ${w}`;
    }
    words.push(scale ? `${w} ${scale}` : w);
  });
  return words.join(' ');
}

const ORDINAL_EXCEPTIONS: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
};

function toOrdinal(words: string): string {
  return words.replace(
    /(\w+)$/,
    (w) =>
      ORDINAL_EXCEPTIONS[w] ??
      (w.endsWith('y') ? w.slice(0, -1) + 'ieth' : w + 'th'),
  );
}

export type WordsMode = 'cardinal' | 'ordinal' | 'cheque';

export function parseNumberInput(input: string): {
  negative: boolean;
  int: string;
  frac: string;
} {
  const s = input.trim().replace(/[,\s_]/g, '');
  const m = /^(-)?(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m)
    throw new ToolInputError(
      'Please enter a number such as 1234 or 1234.56 (commas are fine).',
    );
  return { negative: !!m[1], int: m[2], frac: m[3] ?? '' };
}

export function numberToWords(
  input: string,
  opts: {
    mode?: WordsMode;
    and?: boolean;
    currency?: string;
    subunit?: string;
  } = {},
): string {
  const { mode = 'cardinal', and = false } = opts;
  const { negative, int, frac } = parseNumberInput(input);
  if (mode === 'ordinal') {
    if (frac || negative)
      throw new ToolInputError('Ordinals need a positive whole number.');
    return toOrdinal(integerWords(int, { and }));
  }
  if (mode === 'cheque') {
    if (negative)
      throw new ToolInputError('Cheque amounts cannot be negative.');
    const cents = Math.round(Number(`0.${frac || '0'}`) * 100);
    const carry = cents === 100;
    const whole = carry ? (BigInt(int) + BigInt(1)).toString() : int;
    const unit = opts.currency ?? 'dollars';
    const sub = opts.subunit ?? 'cents';
    const main = integerWords(whole, { and });
    const cc = String(carry ? 0 : cents).padStart(2, '0');
    const words = `${main} ${unit} and ${cc}/100`;
    return (
      words.charAt(0).toUpperCase() +
      words.slice(1) +
      (sub ? ` (${carry ? 0 : cents} ${sub})` : '')
    );
  }
  let words = integerWords(int, { and });
  if (frac)
    words += ` point ${Array.from(frac, (d) => ONES[Number(d)]).join(' ')}`;
  return negative ? `minus ${words}` : words;
}

// ── Roman numerals ─────────────────────────────────────────────────────────

const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999)
    throw new ToolInputError(
      'Roman numerals cover whole numbers from 1 to 3999.',
    );
  let rest = n;
  let out = '';
  for (const [v, s] of ROMAN) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}

export function fromRoman(input: string): number {
  const s = input.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(s))
    throw new ToolInputError(
      'Invalid Roman numeral: use only the letters I, V, X, L, C, D and M (or type a number from 1 to 3999).',
    );
  const val: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = val[s[i]];
    const next = val[s[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  // Only accept the canonical form (rejects IIII, VX, IC …).
  if (total < 1 || total > 3999 || toRoman(total) !== s) {
    throw new ToolInputError(
      `Invalid Roman numeral: “${input.trim()}” is not written the standard way${total >= 1 && total <= 3999 ? ` — did you mean ${toRoman(total)} (${total})?` : '.'}`,
    );
  }
  return total;
}
