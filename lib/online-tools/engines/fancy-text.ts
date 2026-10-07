// Unicode "fonts": maps plain Latin letters and digits onto styled code
// points (Mathematical Alphanumeric Symbols, enclosed alphanumerics, etc.).

export type FancyStyle = {
  id: string;
  name: string;
  /** Converts one character; returns the input unchanged if unsupported. */
  map: (c: string) => string;
  /** Some styles read better reversed (upside down). */
  reverse?: boolean;
};

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';

/** Builds a mapper from consecutive code point ranges, with per-letter exceptions. */
function ranged(
  upper: number | null,
  lower: number | null,
  digits: number | null,
  exceptions: Record<string, string> = {},
) {
  return (c: string) => {
    if (exceptions[c]) return exceptions[c];
    let i = UPPER.indexOf(c);
    if (i >= 0 && upper !== null) return String.fromCodePoint(upper + i);
    i = LOWER.indexOf(c);
    if (i >= 0 && lower !== null) return String.fromCodePoint(lower + i);
    i = DIGITS.indexOf(c);
    if (i >= 0 && digits !== null) return String.fromCodePoint(digits + i);
    return c;
  };
}

function table(from: string, to: string[]) {
  const m = new Map(Array.from(from).map((ch, i) => [ch, to[i]]));
  return (c: string) => m.get(c) ?? c;
}

const combining = (mark: string) => (c: string) =>
  /\s/.test(c) ? c : c + mark;

const SMALL_CAPS = table(
  LOWER + UPPER,
  Array.from('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'.repeat(2)),
);
const UPSIDE_DOWN = table(
  LOWER + UPPER + DIGITS + '.,!?\'"()[]{}<>&_',
  Array.from(
    "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆꓷƎℲ⅁HIſꓘ⅂WNOԀΌꓤS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙'¡¿,„)(][}{><⅋‾",
  ),
);
const FULL_WIDTH = (c: string) => {
  const cp = c.codePointAt(0)!;
  if (cp === 0x20) return '　';
  return cp >= 0x21 && cp <= 0x7e ? String.fromCodePoint(cp + 0xfee0) : c;
};
const SQUARED = ranged(0x1f130, 0x1f130, null);
const NEGATIVE_SQUARED = ranged(0x1f170, 0x1f170, null);
const NEGATIVE_CIRCLED = ranged(0x1f150, 0x1f150, null, {
  '0': '⓿',
  ...Object.fromEntries(
    Array.from('123456789').map((d, i) => [
      d,
      String.fromCodePoint(0x2776 + i),
    ]),
  ),
});

export const FANCY_STYLES: FancyStyle[] = [
  { id: 'bold', name: 'Bold', map: ranged(0x1d400, 0x1d41a, 0x1d7ce) },
  {
    id: 'italic',
    name: 'Italic',
    map: ranged(0x1d434, 0x1d44e, null, { h: 'ℎ' }),
  },
  {
    id: 'bold-italic',
    name: 'Bold italic',
    map: ranged(0x1d468, 0x1d482, null),
  },
  {
    id: 'sans-bold',
    name: 'Sans bold',
    map: ranged(0x1d5d4, 0x1d5ee, 0x1d7ec),
  },
  {
    id: 'sans-italic',
    name: 'Sans italic',
    map: ranged(0x1d608, 0x1d622, null),
  },
  {
    id: 'script',
    name: 'Script',
    map: ranged(0x1d49c, 0x1d4b6, null, {
      B: 'ℬ',
      E: 'ℰ',
      F: 'ℱ',
      H: 'ℋ',
      I: 'ℐ',
      L: 'ℒ',
      M: 'ℳ',
      R: 'ℛ',
      e: 'ℯ',
      g: 'ℊ',
      o: 'ℴ',
    }),
  },
  {
    id: 'bold-script',
    name: 'Bold script',
    map: ranged(0x1d4d0, 0x1d4ea, null),
  },
  {
    id: 'fraktur',
    name: 'Fraktur (gothic)',
    map: ranged(0x1d504, 0x1d51e, null, {
      C: 'ℭ',
      H: 'ℌ',
      I: 'ℑ',
      R: 'ℜ',
      Z: 'ℨ',
    }),
  },
  {
    id: 'bold-fraktur',
    name: 'Bold fraktur',
    map: ranged(0x1d56c, 0x1d586, null),
  },
  {
    id: 'double-struck',
    name: 'Double-struck',
    map: ranged(0x1d538, 0x1d552, 0x1d7d8, {
      C: 'ℂ',
      H: 'ℍ',
      N: 'ℕ',
      P: 'ℙ',
      Q: 'ℚ',
      R: 'ℝ',
      Z: 'ℤ',
    }),
  },
  {
    id: 'monospace',
    name: 'Monospace',
    map: ranged(0x1d670, 0x1d68a, 0x1d7f6),
  },
  {
    id: 'circled',
    name: 'Circled',
    map: ranged(0x24b6, 0x24d0, null, {
      '0': '⓪',
      ...Object.fromEntries(
        Array.from('123456789').map((d, i) => [
          d,
          String.fromCodePoint(0x2460 + i),
        ]),
      ),
    }),
  },
  {
    id: 'negative-circled',
    name: 'Negative circled',
    map: (c) => NEGATIVE_CIRCLED(c.toUpperCase()),
  },
  { id: 'squared', name: 'Squared', map: (c) => SQUARED(c.toUpperCase()) },
  {
    id: 'negative-squared',
    name: 'Negative squared',
    map: (c) => NEGATIVE_SQUARED(c.toUpperCase()),
  },
  { id: 'full-width', name: 'Full width (vaporwave)', map: FULL_WIDTH },
  { id: 'small-caps', name: 'Small caps', map: SMALL_CAPS },
  { id: 'upside-down', name: 'Upside down', map: UPSIDE_DOWN, reverse: true },
  { id: 'strikethrough', name: 'Strikethrough', map: combining('̶') },
  { id: 'underline', name: 'Underline', map: combining('̲') },
  { id: 'slash', name: 'Slashed', map: combining('̸') },
];

export function toFancy(text: string, styleId: string): string {
  const style = FANCY_STYLES.find((s) => s.id === styleId);
  if (!style) return text;
  const chars = Array.from(text).map(style.map);
  return (style.reverse ? chars.reverse() : chars).join('');
}
