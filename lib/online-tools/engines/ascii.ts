// The 128 ASCII characters with control-code abbreviations and names.

const CONTROL: [string, string][] = [
  ['NUL', 'Null'],
  ['SOH', 'Start of heading'],
  ['STX', 'Start of text'],
  ['ETX', 'End of text'],
  ['EOT', 'End of transmission'],
  ['ENQ', 'Enquiry'],
  ['ACK', 'Acknowledge'],
  ['BEL', 'Bell'],
  ['BS', 'Backspace'],
  ['TAB', 'Horizontal tab (HT)'],
  ['LF', 'Line feed (new line)'],
  ['VT', 'Vertical tab'],
  ['FF', 'Form feed'],
  ['CR', 'Carriage return'],
  ['SO', 'Shift out'],
  ['SI', 'Shift in'],
  ['DLE', 'Data link escape'],
  ['DC1', 'Device control 1 (XON)'],
  ['DC2', 'Device control 2'],
  ['DC3', 'Device control 3 (XOFF)'],
  ['DC4', 'Device control 4'],
  ['NAK', 'Negative acknowledge'],
  ['SYN', 'Synchronous idle'],
  ['ETB', 'End of transmission block'],
  ['CAN', 'Cancel'],
  ['EM', 'End of medium'],
  ['SUB', 'Substitute'],
  ['ESC', 'Escape'],
  ['FS', 'File separator'],
  ['GS', 'Group separator'],
  ['RS', 'Record separator'],
  ['US', 'Unit separator'],
];

const PRINTABLE_NAMES: Record<number, string> = {
  32: 'Space',
  33: 'Exclamation mark',
  34: 'Double quote',
  35: 'Number sign (hash)',
  36: 'Dollar sign',
  37: 'Percent sign',
  38: 'Ampersand',
  39: 'Apostrophe (single quote)',
  40: 'Left parenthesis',
  41: 'Right parenthesis',
  42: 'Asterisk',
  43: 'Plus sign',
  44: 'Comma',
  45: 'Hyphen-minus',
  46: 'Full stop (period)',
  47: 'Slash',
  58: 'Colon',
  59: 'Semicolon',
  60: 'Less-than sign',
  61: 'Equals sign',
  62: 'Greater-than sign',
  63: 'Question mark',
  64: 'At sign',
  91: 'Left square bracket',
  92: 'Backslash',
  93: 'Right square bracket',
  94: 'Caret',
  95: 'Underscore',
  96: 'Grave accent (backtick)',
  123: 'Left curly brace',
  124: 'Vertical bar (pipe)',
  125: 'Right curly brace',
  126: 'Tilde',
};

/** Keyboard or escape notation commonly used for a control code. */
const ESCAPES: Record<number, string> = {
  0: '\\0',
  7: '\\a',
  8: '\\b',
  9: '\\t',
  10: '\\n',
  11: '\\v',
  12: '\\f',
  13: '\\r',
  27: '\\e',
};

export type AsciiRow = {
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  char: string;
  /** Short label: NUL, LF, SP, A, … */
  abbr: string;
  name: string;
  control: boolean;
  htmlDec: string;
  htmlHex: string;
  escape?: string;
  caret?: string;
};

export const ASCII: AsciiRow[] = Array.from({ length: 128 }, (_, dec) => {
  const control = dec < 32 || dec === 127;
  const char = String.fromCharCode(dec);
  const [abbr, name] =
    dec < 32
      ? CONTROL[dec]
      : dec === 127
        ? ['DEL', 'Delete']
        : dec === 32
          ? ['SP', 'Space']
          : [
              char,
              PRINTABLE_NAMES[dec] ??
                (/[0-9]/.test(char)
                  ? `Digit ${char}`
                  : /[A-Z]/.test(char)
                    ? `Capital letter ${char}`
                    : `Small letter ${char}`),
            ];
  return {
    dec,
    hex: dec.toString(16).toUpperCase().padStart(2, '0'),
    oct: dec.toString(8).padStart(3, '0'),
    bin: dec.toString(2).padStart(7, '0'),
    char,
    abbr,
    name,
    control,
    htmlDec: `&#${dec};`,
    htmlHex: `&#x${dec.toString(16).toUpperCase()};`,
    escape: ESCAPES[dec],
    caret:
      dec < 32
        ? `^${String.fromCharCode(dec + 64)}`
        : dec === 127
          ? '^?'
          : undefined,
  };
});

/** Search by character, decimal, hex (0x41 / 41h), abbreviation or name. */
export function searchAscii(
  q: string,
  section: 'all' | 'control' | 'printable' = 'all',
) {
  const raw = q.trim();
  const s = raw.toLowerCase();
  const inSection = (r: AsciiRow) =>
    section === 'all' || (section === 'control' ? r.control : !r.control);
  if (!s) return ASCII.filter(inSection);
  const hexM = /^(?:0x|\\x|&#x)?([0-9a-f]{1,2})h?;?$/i.exec(raw);
  const exact = (r: AsciiRow) =>
    r.abbr.toLowerCase() === s || r.char === raw ? 0 : 1;
  return ASCII.filter((r) => {
    if (!inSection(r)) return false;
    if (raw.length === 1 && r.char === raw) return true;
    if (/^\d{1,3}$/.test(s) && r.dec === Number(s)) return true;
    if (
      hexM &&
      /^(0x|\\x|&#x)|h$/i.test(raw) &&
      r.dec === parseInt(hexM[1], 16)
    )
      return true;
    if (r.abbr.toLowerCase() === s) return true;
    if (s.length > 1 && r.name.toLowerCase().includes(s)) return true;
    return false;
  }).sort((a, b) => exact(a) - exact(b));
}
