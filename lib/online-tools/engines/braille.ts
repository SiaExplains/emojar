// Uncontracted (Grade 1) English braille using Unicode braille patterns.
// A conversion aid and reference, not a certified transcription: real-world
// braille is usually contracted (Grade 2 / UEB) and formatted by hand.

const LETTERS = '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵';
export const CAPITAL = '⠠';
export const NUMBER = '⠼';
/** Letter sign: says the next a–j is a letter, not a digit (after numbers). */
export const LETTER_SIGN = '⠰';

export const BRAILLE_LETTERS: Record<string, string> = Object.fromEntries(
  [...'abcdefghijklmnopqrstuvwxyz'].map((c, i) => [c, LETTERS[i]]),
);
// Digits 1–9, 0 use the letters a–j after the number sign.
export const BRAILLE_DIGITS: Record<string, string> = Object.fromEntries(
  [...'1234567890'].map((d, i) => [d, LETTERS[i]]),
);
export const BRAILLE_PUNCTUATION: Record<string, string> = {
  ',': '⠂',
  ';': '⠆',
  ':': '⠒',
  '.': '⠲',
  '!': '⠖',
  '?': '⠦',
  "'": '⠄',
  '-': '⠤',
  '(': '⠐⠣',
  ')': '⠐⠜',
  '/': '⠸⠌',
};

const LETTER_OF = Object.fromEntries(
  Object.entries(BRAILLE_LETTERS).map(([k, v]) => [v, k]),
);
const DIGIT_OF = Object.fromEntries(
  Object.entries(BRAILLE_DIGITS).map(([k, v]) => [v, k]),
);
const PUNCT_OF: Record<string, string> = {
  '⠂': ',',
  '⠆': ';',
  '⠒': ':',
  '⠲': '.',
  '⠖': '!',
  '⠦': '?',
  '⠄': "'",
  '⠤': '-',
  '⠴': '"',
};
const PUNCT2_OF: Record<string, string> = {
  '⠐⠣': '(',
  '⠐⠜': ')',
  '⠸⠌': '/',
};

/** Text → braille. Unsupported characters are kept as-is. */
export function textToBraille(input: string): {
  output: string;
  unsupported: string[];
} {
  const unsupported = new Set<string>();
  let out = '';
  let inNumber = false;
  let quoteOpen = false;
  for (const ch of input) {
    const lower = ch.toLowerCase();
    if (/\d/.test(ch)) {
      if (!inNumber) out += NUMBER;
      inNumber = true;
      out += BRAILLE_DIGITS[ch];
      continue;
    }
    // A decimal point or comma inside a number keeps the number mode.
    if (inNumber && (ch === '.' || ch === ',')) {
      out += ch === '.' ? '⠲' : '⠂';
      continue;
    }
    const wasNumber = inNumber;
    inNumber = false;
    if (BRAILLE_LETTERS[lower]) {
      // After a number, a–j would read as digits without the letter sign.
      // (A capital sign already ends number mode, so capitals don't need it.)
      if (wasNumber && ch === lower && 'abcdefghij'.includes(lower))
        out += LETTER_SIGN;
      if (ch !== lower) out += CAPITAL;
      out += BRAILLE_LETTERS[lower];
    } else if (ch === ' ' || ch === '\n' || ch === '\t') {
      out += ch === ' ' ? '⠀' : ch;
    } else if (ch === '"') {
      // Opening and closing double quotes are different cells.
      out += quoteOpen ? '⠴' : '⠦';
      quoteOpen = !quoteOpen;
    } else if (BRAILLE_PUNCTUATION[ch]) {
      out += BRAILLE_PUNCTUATION[ch];
    } else if (/[⠀-⣿]/.test(ch)) {
      out += ch;
    } else {
      unsupported.add(ch);
      out += ch;
    }
  }
  return { output: out, unsupported: [...unsupported] };
}

/** Braille → text, honouring the capital, number and letter signs. */
export function brailleToText(input: string): string {
  const cells = [...input];
  let out = '';
  let inNumber = false;
  let capNext = false;
  let capsWord = false;
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    const pair = c + (cells[i + 1] ?? '');
    if (PUNCT2_OF[pair]) {
      out += PUNCT2_OF[pair];
      i++;
      inNumber = false;
      continue;
    }
    if (c === CAPITAL) {
      inNumber = false;
      if (cells[i + 1] === CAPITAL) {
        capsWord = true;
        i++;
      } else capNext = true;
      continue;
    }
    if (c === NUMBER) {
      inNumber = true;
      continue;
    }
    if (c === LETTER_SIGN) {
      inNumber = false;
      continue;
    }
    if (c === '⠀' || c === ' ' || c === '\n') {
      out += c === '\n' ? '\n' : ' ';
      inNumber = false;
      capsWord = false;
      continue;
    }
    if (inNumber && DIGIT_OF[c]) {
      out += DIGIT_OF[c];
      continue;
    }
    if (inNumber && (c === '⠲' || c === '⠂')) {
      out += c === '⠲' ? '.' : ',';
      continue;
    }
    inNumber = false;
    if (LETTER_OF[c]) {
      out += capNext || capsWord ? LETTER_OF[c].toUpperCase() : LETTER_OF[c];
      capNext = false;
      continue;
    }
    // ⠦ is both “?” and an opening double quote: it opens a quote at the
    // start of a word when more text follows, otherwise it is a question mark.
    if (c === '⠦') {
      const next = cells[i + 1];
      const atWordStart = !out || /[\s(“"]$/.test(out);
      out += atWordStart && next && !/[\s\u2800]/.test(next) ? '"' : '?';
      continue;
    }
    out += PUNCT_OF[c] ?? c;
  }
  return out;
}

export const isBraille = (s: string) => /[⠀-⣿]/.test(s);

/** Raised dots (1–8) of a braille cell, for the visual chart. */
export function dotsOf(cell: string): number[] {
  const bits = cell.codePointAt(0)! - 0x2800;
  return [1, 2, 3, 4, 5, 6, 7, 8].filter((d) => bits & (1 << (d - 1)));
}
