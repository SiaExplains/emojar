// Local password strength estimate: character-pool entropy, reduced for
// patterns attackers try first (common passwords, words, keyboard runs,
// sequences, repeats, dates, l33t). Nothing leaves the browser except the
// optional, explicit Have I Been Pwned range check (k-anonymity).

import { WORDLIST } from './wordlist';

// A compact list of the most common leaked passwords (lowercase).
const COMMON = new Set(
  `123456 password 123456789 12345678 12345 qwerty 1234567 111111 123123 abc123 1234567890 password1 1234 000000 iloveyou
  qwerty123 dragon 654321 monkey letmein football 123321 666666 sunshine princess 1q2w3e4r 1qaz2wsx welcome admin login
  master shadow baseball superman trustno1 michael hello freedom whatever qazwsx batman starwars passw0rd 121212 donald
  charlie aa123456 zaq12wsx 987654321 lovely 7777777 888888 jordan23 harley ashley mustang access flower hottie loveme
  zxcvbnm asdfghjkl qwertyuiop 112233 159753 secret summer winter spring autumn hunter ranger buster soccer hockey killer
  pepper ginger cookie cheese chocolate computer internet google samsung iphone apple orange banana pokemon minecraft
  liverpool chelsea arsenal barcelona yankees cowboys eagles tigers lakers pass 1111 2000 abcdef abcd1234 a123456
  password123 password12 admin123 root toor test test123 guest default changeme qwerty1 welcome1 hello123 love
  iloveu sweety angel jesus blessed family friends forever money dragon1 monkey1 football1 baseball1 princess1`
    .split(/\s+/)
    .filter(Boolean),
);
const WORDS = new Set(WORDLIST.filter((w) => w.length >= 4));
const KEYBOARD_ROWS = [
  'qwertyuiopasdfghjklzxcvbnm',
  '1234567890',
  'qwertzuiop',
  'azertyuiop',
  '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p',
];
const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i',
};

export type Finding = { label: string; detail: string };

export type Strength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';
  bits: number;
  poolSize: number;
  findings: Finding[];
  tips: string[];
  crack: { scenario: string; seconds: number }[];
};

function poolSize(pw: string): number {
  let n = 0;
  if (/[a-z]/.test(pw)) n += 26;
  if (/[A-Z]/.test(pw)) n += 26;
  if (/\d/.test(pw)) n += 10;
  if (/[!-/:-@[-`{-~]/.test(pw)) n += 33;
  if (/\s/.test(pw)) n += 1;
  if (/[^\x00-\x7f]/.test(pw)) n += 100;
  return n;
}

const unleet = (s: string) => s.replace(/[013457@$!]/g, (c) => LEET[c] ?? c);

/** Length of the longest run that follows a keyboard row or alphabet in order. */
function longestRun(pw: string): number {
  const s = pw.toLowerCase();
  let best = 1;
  for (const row of [...KEYBOARD_ROWS, 'abcdefghijklmnopqrstuvwxyz']) {
    for (const r of [row, [...row].reverse().join('')]) {
      let run = 1;
      for (let i = 1; i < s.length; i++) {
        const a = r.indexOf(s[i - 1]);
        run = a >= 0 && r[a + 1] === s[i] ? run + 1 : 1;
        best = Math.max(best, run);
      }
    }
  }
  return best;
}

export function checkStrength(pw: string): Strength {
  const findings: Finding[] = [];
  const tips: string[] = [];
  const lower = pw.toLowerCase();
  const pool = poolSize(pw);
  let bits = pw.length ? Math.log2(Math.max(pool, 1)) * [...pw].length : 0;

  // Strip padding like “123” or “!” first, then undo l33t: P@ssw0rd! → password.
  const base = unleet(
    lower.replace(/[\d\W_]+$/g, '').replace(/^[\d\W_]+/g, ''),
  );
  const isCommon =
    COMMON.has(lower) ||
    COMMON.has(unleet(lower)) ||
    (base.length >= 4 && COMMON.has(base));
  if (isCommon) {
    findings.push({
      label: 'Common password',
      detail:
        'This is on lists of the most-used leaked passwords — it is guessed in seconds.',
    });
    bits = Math.min(bits, 10);
  }
  const words = [...WORDS].filter((w) => unleet(lower).includes(w));
  const longWords = words.filter(
    (w) => !words.some((o) => o !== w && o.includes(w)),
  );
  if (longWords.length) {
    findings.push({
      label: 'Dictionary words',
      detail: `Contains ${longWords
        .slice(0, 3)
        .map((w) => `“${w}”`)
        .join(', ')} — attackers try word lists before random characters.`,
    });
    // Each word costs roughly log2(list size) bits instead of per-letter entropy.
    const covered = longWords.reduce((n, w) => n + w.length, 0);
    const rest = Math.max(0, [...pw].length - covered);
    bits = Math.min(
      bits,
      longWords.length * Math.log2(WORDLIST.length) +
        rest * Math.log2(Math.max(pool, 1)),
    );
  }
  const core = lower.replace(/[\d\W_]+$/g, '').replace(/^[\d\W_]+/g, '');
  if (core !== unleet(core) && (longWords.length || isCommon))
    findings.push({
      label: 'Predictable substitutions',
      detail:
        'Swaps like 0→o and 3→e are the first variations cracking tools try.',
    });
  const run = longestRun(pw);
  if (run >= 4) {
    findings.push({
      label: 'Keyboard or alphabet run',
      detail: `Has a ${run}-character run such as “qwer”, “asdf”, “1234” or “abcd”.`,
    });
    bits -= (run - 2) * Math.log2(Math.max(pool, 1)) * 0.8;
  }
  const repeat = /(.)\1{2,}/.exec(pw);
  if (repeat) {
    findings.push({
      label: 'Repeated characters',
      detail: `“${repeat[0]}” repeats the same character.`,
    });
    bits -= (repeat[0].length - 1) * Math.log2(Math.max(pool, 1)) * 0.8;
  }
  if (
    /(19[5-9]\d|20[0-3]\d)/.test(pw) ||
    /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/.test(pw)
  ) {
    findings.push({
      label: 'Looks like a year or date',
      detail: 'Birthdays and years are easy to guess from public information.',
    });
    bits -= 6;
  }
  if (/^[A-Z][a-z]+\d{1,4}[!?.]?$/.test(pw)) {
    findings.push({
      label: 'Common shape',
      detail:
        'Capital letter + word + digits (+ “!”) is the most common password pattern.',
    });
    // Cracking rules try exactly this shape early, so it’s worth far less.
    bits = Math.min(bits, 45);
  }

  bits = Math.max(0, Math.round(bits * 10) / 10);
  if (pw.length < 12)
    tips.push('Use at least 12 characters — length matters more than symbols.');
  if (findings.length)
    tips.push(
      'Avoid words, names, dates and keyboard patterns, or use 4+ random words together.',
    );
  if (!/[^A-Za-z]/.test(pw) && pw.length < 16)
    tips.push('Add digits or symbols, or make it longer.');
  tips.push(
    'Use a different password for every site, ideally stored in a password manager.',
  );

  const score: Strength['score'] =
    bits < 28 ? 0 : bits < 36 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  const label = (
    ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'] as const
  )[score];
  const guesses = 2 ** Math.max(0, bits - 1); // on average half the space
  const crack = [
    {
      scenario: 'Online attack (100 guesses/hour, rate-limited)',
      seconds: guesses / (100 / 3600),
    },
    { scenario: 'Online attack (10 guesses/second)', seconds: guesses / 10 },
    {
      scenario: 'Offline, slow hash like bcrypt (10,000 guesses/second)',
      seconds: guesses / 1e4,
    },
    {
      scenario: 'Offline, fast hash (10 billion guesses/second)',
      seconds: guesses / 1e10,
    },
  ];
  return { score, label, bits, poolSize: pool, findings, tips, crack };
}

export function humanDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds > 1e18 * 3.15e7)
    return 'longer than the age of the universe';
  if (seconds < 1) return 'instantly';
  const units: [number, string][] = [
    [3.15576e9, 'century'],
    [3.15576e7, 'year'],
    [2.6298e6, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  for (const [size, name] of units)
    if (seconds >= size) {
      const n = seconds / size;
      if (name === 'century' && n >= 1e6)
        return `${Math.round(n / 1e6).toLocaleString('en-US')} million centuries`;
      const r = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
      const plural = name === 'century' ? 'centuries' : `${name}s`;
      return `${r.toLocaleString('en-US')} ${r === 1 ? name : plural}`;
    }
  return 'instantly';
}

/** SHA-1 → { prefix (sent to HIBP), suffix (kept local) }. */
export async function hibpParts(
  pw: string,
): Promise<{ prefix: string; suffix: string }> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(pw));
  const hex = Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, '0'),
  )
    .join('')
    .toUpperCase();
  return { prefix: hex.slice(0, 5), suffix: hex.slice(5) };
}

/** Finds the suffix in a HIBP range response ("SUFFIX:COUNT" lines). */
export function hibpCount(body: string, suffix: string): number {
  for (const line of body.split(/\r?\n/)) {
    const [s, c] = line.trim().split(':');
    if (s === suffix) return Number(c) || 0;
  }
  return 0;
}
