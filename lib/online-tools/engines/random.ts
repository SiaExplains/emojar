// Cryptographically secure generators. Everything draws from
// crypto.getRandomValues; rejection sampling keeps the output unbiased.

import { WORDLIST } from './wordlist';

export type RandomSource = (buf: Uint32Array) => Uint32Array;

const defaultSource: RandomSource = (buf) => crypto.getRandomValues(buf);

/** Uniform integer in [0, n) without modulo bias. */
export function randomBelow(
  n: number,
  source: RandomSource = defaultSource,
): number {
  if (n <= 0 || !Number.isInteger(n))
    throw new Error('n must be a positive integer');
  if (n === 1) return 0;
  const max = 0x1_0000_0000;
  const limit = max - (max % n);
  const buf = new Uint32Array(1);
  for (;;) {
    source(buf);
    if (buf[0] < limit) return buf[0] % n;
  }
}

export function randomInt(
  min: number,
  max: number,
  source?: RandomSource,
): number {
  const lo = Math.ceil(Math.min(min, max));
  const hi = Math.floor(Math.max(min, max));
  const span = hi - lo + 1;
  if (span <= 0x1_0000_0000) return lo + randomBelow(span, source);
  if (span > Number.MAX_SAFE_INTEGER)
    throw new Error('The range is too large.');
  // 53-bit draws with rejection for ranges beyond 32 bits.
  const TWO53 = 2 ** 53;
  const limit = TWO53 - (TWO53 % span);
  const buf = new Uint32Array(2);
  const draw = source ?? defaultSource;
  for (;;) {
    draw(buf);
    const v = (buf[0] >>> 11) * 0x1_0000_0000 + buf[1];
    if (v < limit) return lo + (v % span);
  }
}

export function shuffle<T>(arr: T[], source?: RandomSource): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1, source);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>/?~',
  hex: '0123456789abcdef',
};

const AMBIGUOUS = /[Il1O0o|`'"]/g;

export type PasswordOptions = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous?: boolean;
};

export function passwordCharset(o: PasswordOptions): string[] {
  const sets = (['upper', 'lower', 'digits', 'symbols'] as const)
    .filter((k) => o[k])
    .map((k) =>
      o.excludeAmbiguous ? CHARSETS[k].replace(AMBIGUOUS, '') : CHARSETS[k],
    );
  return sets;
}

/** Generates a password containing at least one character from each chosen set. */
export function generatePassword(
  o: PasswordOptions,
  source?: RandomSource,
): string {
  const sets = passwordCharset(o);
  if (!sets.length) throw new Error('Choose at least one character type.');
  const length = Math.max(sets.length, Math.min(256, Math.floor(o.length)));
  const all = sets.join('');
  const chars = sets.map((s) => s[randomBelow(s.length, source)]);
  while (chars.length < length)
    chars.push(all[randomBelow(all.length, source)]);
  return shuffle(chars, source).join('');
}

export function entropyBits(poolSize: number, length: number): number {
  return poolSize > 1 ? length * Math.log2(poolSize) : 0;
}

export function strengthLabel(bits: number): {
  label: string;
  level: 0 | 1 | 2 | 3 | 4;
} {
  if (bits < 28) return { label: 'Very weak', level: 0 };
  if (bits < 36) return { label: 'Weak', level: 1 };
  if (bits < 60) return { label: 'Fair', level: 2 };
  if (bits < 100) return { label: 'Strong', level: 3 };
  return { label: 'Very strong', level: 4 };
}

export type PassphraseOptions = {
  words: number;
  separator: string;
  capitalize: boolean;
  addNumber: boolean;
};

export function generatePassphrase(
  o: PassphraseOptions,
  source?: RandomSource,
): string {
  const count = Math.max(2, Math.min(20, Math.floor(o.words)));
  const words = Array.from({ length: count }, () => {
    const w = WORDLIST[randomBelow(WORDLIST.length, source)];
    return o.capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  if (o.addNumber) {
    const i = randomBelow(words.length, source);
    words[i] = `${words[i]}${randomBelow(10, source)}`;
  }
  return words.join(o.separator);
}

export function passphraseEntropy(o: PassphraseOptions): number {
  return (
    o.words * Math.log2(WORDLIST.length) +
    (o.addNumber ? Math.log2(10 * o.words) : 0)
  );
}

export function generateRandomString(
  length: number,
  charset: string,
  source?: RandomSource,
): string {
  const chars = Array.from(new Set(Array.from(charset)));
  if (!chars.length) throw new Error('The character set is empty.');
  return Array.from(
    { length: Math.max(1, Math.min(4096, Math.floor(length))) },
    () => chars[randomBelow(chars.length, source)],
  ).join('');
}

export function generateRandomNumbers(
  o: {
    min: number;
    max: number;
    count: number;
    unique: boolean;
    decimals: number;
  },
  source?: RandomSource,
): number[] {
  const { min, max, unique } = o;
  const count = Math.max(1, Math.min(10_000, Math.floor(o.count)));
  const decimals = Math.max(0, Math.min(10, Math.floor(o.decimals)));
  const scale = 10 ** decimals;
  const lo = Math.ceil(Math.min(min, max) * scale);
  const hi = Math.floor(Math.max(min, max) * scale);
  const span = hi - lo + 1;
  if (span <= 0) throw new Error('The range is empty.');
  if (unique && count > span)
    throw new Error(`Only ${span} unique numbers exist in this range.`);
  const out: number[] = [];
  const seen = new Set<number>();
  while (out.length < count) {
    const v = randomInt(lo, hi, source);
    if (unique) {
      if (seen.has(v)) continue;
      seen.add(v);
    }
    out.push(v / scale);
  }
  return out;
}

// ── UUID ───────────────────────────────────────────────────────────────────

function bytesToUuid(b: Uint8Array): string {
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function uuidV4(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return bytesToUuid(b);
}

/** RFC 9562 UUIDv7: 48-bit Unix ms timestamp + random bits, sortable by time. */
export function uuidV7(now = Date.now()): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  let ts = now;
  for (let i = 5; i >= 0; i--) {
    b[i] = ts % 256;
    ts = Math.floor(ts / 256);
  }
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  return bytesToUuid(b);
}

export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export function uuidVersion(uuid: string): number | null {
  const m =
    /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(
      uuid.trim(),
    );
  return m ? parseInt(m[1], 16) : null;
}
