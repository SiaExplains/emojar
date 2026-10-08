// Whole-number conversion between any bases 2–36, using BigInt so long
// binary and hex values stay exact. Also explains the positional value of
// each digit (255 = 15×16¹ + 15×16⁰).

import { ToolInputError } from './data';

/** BigInt(0); the project targets ES2017, so no 0n literals. */
export const ZERO = BigInt(0);

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';
export const BASE_NAMES: Record<number, string> = {
  2: 'binary',
  3: 'ternary',
  4: 'quaternary',
  5: 'quinary',
  6: 'senary',
  7: 'septenary',
  8: 'octal',
  9: 'nonary',
  10: 'decimal',
  12: 'duodecimal',
  16: 'hexadecimal',
  20: 'vigesimal',
  32: 'base-32',
  36: 'base-36',
};
export const baseName = (b: number) => BASE_NAMES[b] ?? `base-${b}`;

const PREFIX: Record<string, number> = { '0x': 16, '0b': 2, '0o': 8 };

/** Strips separators and an optional sign; detects 0x/0b/0o when base is 0. */
export function parseInBase(
  input: string,
  base: number,
): { value: bigint; base: number } {
  let s = input
    .trim()
    .toLowerCase()
    .replace(/[\s_,']/g, '');
  if (!s) throw new ToolInputError('Enter a number.');
  let neg = false;
  if (s[0] === '-' || s[0] === '+') {
    neg = s[0] === '-';
    s = s.slice(1);
  }
  let b = base;
  const pre = s.slice(0, 2);
  if (PREFIX[pre] && (base === 0 || base === PREFIX[pre])) {
    b = PREFIX[pre];
    s = s.slice(2);
  }
  if (b === 0) b = 10;
  if (b < 2 || b > 36) throw new ToolInputError('Bases go from 2 to 36.');
  if (/[.]/.test(s))
    throw new ToolInputError(
      'Only whole numbers are supported — fractions don’t convert exactly between most bases.',
    );
  if (!s) throw new ToolInputError('Enter digits after the prefix.');
  let v = ZERO;
  const B = BigInt(b);
  for (const ch of s) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= b)
      throw new ToolInputError(
        `${input.trim()} is not a valid ${baseName(b)} number${
          d >= b
            ? ` — “${ch}” is not a ${baseName(b)} digit (use ${b <= 10 ? `0–${b - 1}` : `0–9 and a–${DIGITS[b - 1]}`}).`
            : '.'
        }`,
      );
    v = v * B + BigInt(d);
  }
  return { value: neg ? -v : v, base: b };
}

export function formatInBase(
  value: bigint,
  base: number,
  opts: { upper?: boolean; group?: boolean } = {},
): string {
  const neg = value < ZERO;
  let s = (neg ? -value : value).toString(base);
  if (opts.upper) s = s.toUpperCase();
  if (opts.group) {
    const size = base === 2 ? 4 : base === 16 ? 2 : base === 10 ? 3 : 0;
    if (size) {
      const pad =
        base === 10 ? s : s.padStart(Math.ceil(s.length / size) * size, '0');
      const parts: string[] = [];
      for (let i = pad.length; i > 0; i -= size)
        parts.unshift(pad.slice(Math.max(0, i - size), i));
      s = parts.join(base === 10 ? ',' : ' ');
    }
  }
  return (neg ? '-' : '') + s;
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const superscript = (n: number) =>
  String(n).replace(/\d/g, (d) => SUP[Number(d)]);

export type Term = {
  digit: string;
  value: number;
  power: number;
  place: bigint;
};

/** Positional terms of a non-negative value, most significant first. */
export function decompose(value: bigint, base: number): Term[] {
  const s = (value < ZERO ? -value : value).toString(base).toUpperCase();
  const B = BigInt(base);
  return [...s].map((digit, i) => {
    const power = s.length - 1 - i;
    return {
      digit,
      value: parseInt(digit, 36),
      power,
      place: B ** BigInt(power),
    };
  });
}

/** “255 = 15×16¹ + 15×16⁰”, skipping zero digits when the number is long. */
export function decompositionText(value: bigint, base: number): string {
  const terms = decompose(value, base);
  const shown = terms.length > 12 ? terms.filter((t) => t.value !== 0) : terms;
  const body = shown
    .map((t) => `${t.value}×${base}${superscript(t.power)}`)
    .join(' + ');
  return `${value.toString(10)} = ${body || '0'}`;
}

/** Bits needed to store the value as unsigned. */
export const bitLength = (v: bigint) =>
  v === ZERO ? 1 : (v < ZERO ? -v : v).toString(2).length;
