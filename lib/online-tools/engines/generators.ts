// Engines for the v0.11.0 generators: teams, usernames, fake test data,
// random colours, invoice totals and e-mail signatures.

import { ToolInputError } from './data';
import { hslToRgb, rgbToHex, type RGB } from './color';
import { randomBelow, shuffle, type RandomSource } from './random';
import { WORDLIST as WORDS } from './wordlist';

/* ------------------------------------------------------------------ */
/* Seedable randomness                                                  */
/* ------------------------------------------------------------------ */

/** Deterministic source (mulberry32) for reproducible test data. */
export function seededSource(seed: string): RandomSource {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return (buf) => {
    for (let i = 0; i < buf.length; i++) {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      buf[i] = (t ^ (t >>> 14)) >>> 0;
    }
    return buf;
  };
}

const pick = <T>(list: readonly T[], src?: RandomSource): T =>
  list[randomBelow(list.length, src)];

/* ------------------------------------------------------------------ */
/* Teams                                                                */
/* ------------------------------------------------------------------ */

export function parseNames(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Splits names into teams as evenly as possible. Captains (if given) are
 * spread one per team first.
 */
export function makeTeams(
  names: string[],
  opts: { teams?: number; perTeam?: number; captains?: string[] },
  src?: RandomSource,
): string[][] {
  if (names.length < 2) throw new ToolInputError('Enter at least two names.');
  if (opts.teams !== undefined && !(opts.teams >= 2))
    throw new ToolInputError('Choose at least two teams.');
  if (opts.teams === undefined && !(Number(opts.perTeam) >= 1))
    throw new ToolInputError('Choose at least one person per team.');
  const n =
    opts.teams !== undefined
      ? Math.floor(opts.teams)
      : Math.ceil(names.length / Math.floor(opts.perTeam ?? 2));
  if (!Number.isFinite(n) || n < 2)
    throw new ToolInputError(
      opts.teams !== undefined
        ? 'Choose at least two teams.'
        : `With ${names.length} names that makes only one team — choose fewer people per team.`,
    );
  if (n > names.length)
    throw new ToolInputError(
      `You can’t make ${n} teams from ${names.length} names.`,
    );
  const captains = (opts.captains ?? []).filter((c) => names.includes(c));
  if (captains.length > n)
    throw new ToolInputError(`There are more captains than teams (${n}).`);
  const teams: string[][] = Array.from({ length: n }, () => []);
  shuffle(captains, src).forEach((c, i) => teams[i].push(c));
  // Remove one copy per captain so duplicate names (two “Alex”es) survive.
  const pool = [...names];
  for (const c of captains) pool.splice(pool.indexOf(c), 1);
  const rest = shuffle(pool, src);
  for (const name of rest) {
    // Fill the smallest team; ties broken randomly so team 1 isn't favoured.
    const min = Math.min(...teams.map((t) => t.length));
    const candidates = teams.filter((t) => t.length === min);
    pick(candidates, src).push(name);
  }
  return teams;
}

/* ------------------------------------------------------------------ */
/* Usernames                                                            */
/* ------------------------------------------------------------------ */

const ADJECTIVES =
  'brave calm clever cosmic crisp daring eager epic fancy fierce fluffy frosty gentle giant golden happy hidden jolly lucky mellow mighty misty neon noble quick quiet rapid royal rusty shiny silent silver sleepy sly snowy solar sonic spicy stellar stormy sunny swift tiny turbo velvet vivid wild witty zesty'.split(
    ' ',
  );
const ANIMALS =
  'badger bear bee bison cat cobra crow deer dingo dolphin dragon eagle falcon ferret fox frog gecko goose hawk hedgehog heron ibis jaguar koala lemur lion lynx moose newt octopus orca otter owl panda panther parrot penguin puma quokka rabbit raven seal shark sloth sparrow squid tiger toucan turtle viper walrus wolf yak zebra'.split(
    ' ',
  );
const GAMER_PARTS = [
  'Shadow',
  'Pixel',
  'Nova',
  'Blaze',
  'Frost',
  'Venom',
  'Rogue',
  'Ghost',
  'Storm',
  'Echo',
  'Ninja',
  'Viper',
  'Titan',
  'Byte',
  'Glitch',
  'Zero',
  'Hex',
  'Rift',
  'Volt',
  'Onyx',
];
const CUTE_PARTS = [
  'bubble',
  'honey',
  'muffin',
  'peach',
  'cloud',
  'cookie',
  'berry',
  'bunny',
  'daisy',
  'mochi',
  'pudding',
  'sprinkle',
  'sugar',
  'tulip',
  'button',
];

export type UsernameStyle =
  | 'adjective-animal'
  | 'word-word'
  | 'gamer'
  | 'cute'
  | 'professional';

export type UsernameOptions = {
  style: UsernameStyle;
  separator: '' | '_' | '.' | '-';
  numbers: boolean;
  capitalize: boolean;
  keyword?: string;
  firstName?: string;
  lastName?: string;
  maxLength?: number;
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clean = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toLowerCase();

export function generateUsername(
  o: UsernameOptions,
  src?: RandomSource,
): string {
  const kw = o.keyword && o.style !== 'professional' ? clean(o.keyword) : '';
  let parts: string[];
  switch (o.style) {
    case 'word-word':
      parts = [pick(WORDS, src), pick(WORDS, src)];
      break;
    case 'gamer':
      parts = [
        pick(GAMER_PARTS, src).toLowerCase(),
        pick(GAMER_PARTS, src).toLowerCase(),
      ];
      break;
    case 'cute':
      parts = [pick(CUTE_PARTS, src), pick(ANIMALS, src)];
      break;
    case 'professional': {
      const f =
        clean(o.firstName ?? '') ||
        pick(['alex', 'sam', 'jordan', 'taylor', 'casey'], src);
      const l =
        clean(o.lastName ?? '') ||
        pick(['smith', 'lee', 'garcia', 'martin', 'brown'], src);
      const forms = [
        [f, l],
        [f[0], l],
        [f, l[0]],
        [l, f],
      ];
      parts = pick(forms, src);
      break;
    }
    default:
      parts = [pick(ADJECTIVES, src), pick(ANIMALS, src)];
  }
  if (kw) parts.splice(randomBelow(parts.length + 1, src), 0, kw);
  if (o.capitalize || o.style === 'gamer') parts = parts.map(cap);
  let name = parts.join(o.separator);
  if (o.numbers) {
    const num =
      o.style === 'gamer'
        ? pick(['', 'X', 'Pro', '99', '007', '420', '1337'], src) ||
          String(randomBelow(1000, src))
        : String(randomBelow(o.style === 'professional' ? 100 : 1000, src));
    name += (o.style === 'professional' ? o.separator : '') + num;
  }
  if (o.maxLength && name.length > o.maxLength)
    name = name.slice(0, o.maxLength);
  return name;
}

/* ------------------------------------------------------------------ */
/* Fake test data                                                       */
/* ------------------------------------------------------------------ */

const FIRST =
  'Ada Alan Amara Ana Ben Carlos Chen Chloe Dana David Elena Emma Ethan Fatima Grace Hana Hugo Ivan Jamal Julia Kai Kenji Laura Leo Lina Lucas Maya Mia Noah Nora Olga Omar Priya Rafael Rosa Sara Sofia Tom Uma Viktor Yara Zoe'.split(
    ' ',
  );
const LAST =
  'Adams Baker Chen Costa Diaz Evans Fischer Garcia Hansen Ito Johnson Kim Kowalski Lopez Martin Meyer Nguyen Novak Okafor Patel Petrov Quinn Rossi Santos Schmidt Silva Smith Tanaka Taylor Walker Weber Wilson Yilmaz Zhang'.split(
    ' ',
  );
const CITIES: [string, string][] = [
  ['Springfield', 'United States'],
  ['Riverton', 'United States'],
  ['Lakewood', 'Canada'],
  ['Maplewood', 'United Kingdom'],
  ['Brookfield', 'Australia'],
  ['Fairview', 'Ireland'],
  ['Greenville', 'New Zealand'],
  ['Hillcrest', 'South Africa'],
  ['Kingsport', 'United States'],
  ['Oakridge', 'Canada'],
  ['Westbury', 'United Kingdom'],
  ['Ashford', 'Australia'],
];
const STREETS =
  'Main Oak Pine Maple Cedar Elm Lake Hill Park River Sunset Mill Church Garden Station'.split(
    ' ',
  );
const STREET_TYPES = ['St', 'Ave', 'Rd', 'Lane', 'Way', 'Blvd'];
const COMPANY_A =
  'Acme Blue Bright Clear Delta Echo Global Green Nova Peak Prime Silver Summit True Vertex'.split(
    ' ',
  );
const COMPANY_B =
  'Labs Systems Works Solutions Partners Digital Logistics Foods Media Health'.split(
    ' ',
  );
const JOBS =
  'Software Engineer|Product Manager|Designer|Data Analyst|Accountant|Nurse|Teacher|Sales Manager|Support Specialist|Marketing Lead|HR Coordinator|Project Manager'.split(
    '|',
  );
const LOREM =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(
    ' ',
  );
// RFC 2606 reserved domains — they can never belong to a real person.
const DOMAINS = ['example.com', 'example.org', 'example.net'];

export const FAKE_FIELDS = {
  id: 'ID (1, 2, 3…)',
  uuid: 'UUID',
  firstName: 'First name',
  lastName: 'Last name',
  fullName: 'Full name',
  email: 'Email (example.com)',
  phone: 'Phone (555 test range)',
  street: 'Street address',
  city: 'City',
  country: 'Country',
  zip: 'Postal code',
  company: 'Company',
  job: 'Job title',
  birthdate: 'Birth date',
  date: 'Date (last 2 years)',
  number: 'Number (0–1000)',
  price: 'Price',
  boolean: 'Boolean',
  ip: 'IP address (documentation range)',
  url: 'URL',
  color: 'Colour (hex)',
  sentence: 'Sentence',
} as const;
export type FakeField = keyof typeof FAKE_FIELDS;

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function fakeRow(
  fields: FakeField[],
  index: number,
  src: RandomSource,
  now = new Date(),
): Record<string, string | number | boolean> {
  const first = pick(FIRST, src);
  const last = pick(LAST, src);
  const [city, country] = pick(CITIES, src);
  const out: Record<string, string | number | boolean> = {};
  const hex4 = () => randomBelow(0x10000, src).toString(16).padStart(4, '0');
  for (const f of fields) {
    switch (f) {
      case 'id':
        out.id = index + 1;
        break;
      case 'uuid': {
        const h = Array.from({ length: 8 }, hex4).join('');
        out.uuid = `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${'89ab'[randomBelow(4, src)]}${h.slice(17, 20)}-${h.slice(20, 32)}`;
        break;
      }
      case 'firstName':
        out.firstName = first;
        break;
      case 'lastName':
        out.lastName = last;
        break;
      case 'fullName':
        out.fullName = `${first} ${last}`;
        break;
      case 'email':
        out.email = `${clean(first)}.${clean(last)}${randomBelow(100, src)}@${pick(DOMAINS, src)}`;
        break;
      // 555-0100 to 555-0199 is reserved for fiction in North America.
      case 'phone':
        out.phone = `+1-${200 + randomBelow(800, src)}-555-01${pad(randomBelow(100, src))}`;
        break;
      case 'street':
        out.street = `${1 + randomBelow(999, src)} ${pick(STREETS, src)} ${pick(STREET_TYPES, src)}`;
        break;
      case 'city':
        out.city = city;
        break;
      case 'country':
        out.country = country;
        break;
      case 'zip':
        out.zip = pad(randomBelow(100000, src), 5);
        break;
      case 'company':
        out.company = `${pick(COMPANY_A, src)} ${pick(COMPANY_B, src)}`;
        break;
      case 'job':
        out.job = pick(JOBS, src);
        break;
      case 'birthdate': {
        const y = now.getUTCFullYear() - 18 - randomBelow(60, src);
        out.birthdate = `${y}-${pad(1 + randomBelow(12, src))}-${pad(1 + randomBelow(28, src))}`;
        break;
      }
      case 'date': {
        const d = new Date(now.getTime() - randomBelow(730, src) * 86400000);
        out.date = d.toISOString().slice(0, 10);
        break;
      }
      case 'number':
        out.number = randomBelow(1001, src);
        break;
      case 'price':
        out.price = Math.round(randomBelow(100000, src)) / 100;
        break;
      case 'boolean':
        out.boolean = randomBelow(2, src) === 1;
        break;
      // RFC 5737 documentation ranges.
      case 'ip':
        out.ip = `${pick(['192.0.2', '198.51.100', '203.0.113'], src)}.${1 + randomBelow(254, src)}`;
        break;
      case 'url':
        out.url = `https://${pick(DOMAINS, src)}/${pick(LOREM, src)}/${randomBelow(1000, src)}`;
        break;
      case 'color':
        out.color = `#${randomBelow(0x1000000, src).toString(16).padStart(6, '0')}`;
        break;
      case 'sentence': {
        const words = Array.from({ length: 6 + randomBelow(6, src) }, () =>
          pick(LOREM, src),
        );
        out.sentence = cap(words.join(' ')) + '.';
        break;
      }
    }
  }
  return out;
}

export const MAX_FAKE_ROWS = 1000;

export function generateFakeData(
  fields: FakeField[],
  rows: number,
  format: 'csv' | 'json' | 'sql',
  opts: { seed?: string; table?: string } = {},
): string {
  if (!fields.length) throw new ToolInputError('Choose at least one field.');
  const n = Math.floor(rows);
  if (!Number.isFinite(n) || n < 1 || n > MAX_FAKE_ROWS)
    throw new ToolInputError(`Choose between 1 and ${MAX_FAKE_ROWS} rows.`);
  const src = opts.seed ? seededSource(opts.seed) : undefined;
  const cryptoSrc: RandomSource = (b) => crypto.getRandomValues(b);
  const data = Array.from({ length: n }, (_, i) =>
    fakeRow(fields, i, src ?? cryptoSrc),
  );
  if (format === 'json') return JSON.stringify(data, null, 2);
  if (format === 'csv') {
    const esc = (v: unknown) => {
      const s = String(v);
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [
      fields.join(','),
      ...data.map((r) => fields.map((f) => esc(r[f])).join(',')),
    ].join('\n');
  }
  const table = (opts.table || 'test_data').replace(/[^A-Za-z0-9_]/g, '_');
  const sqlVal = (v: unknown) =>
    typeof v === 'number'
      ? String(v)
      : typeof v === 'boolean'
        ? v
          ? 'TRUE'
          : 'FALSE'
        : `'${String(v).replace(/'/g, "''")}'`;
  return data
    .map(
      (r) =>
        `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${fields.map((f) => sqlVal(r[f])).join(', ')});`,
    )
    .join('\n');
}

/* ------------------------------------------------------------------ */
/* Random colours                                                       */
/* ------------------------------------------------------------------ */

export type ColorMode = 'any' | 'pastel' | 'vivid' | 'dark' | 'light' | 'hue';

const RANGES: Record<
  Exclude<ColorMode, 'hue'>,
  { s: [number, number]; l: [number, number] }
> = {
  any: { s: [0, 100], l: [5, 95] },
  pastel: { s: [45, 80], l: [78, 90] },
  vivid: { s: [80, 100], l: [45, 58] },
  dark: { s: [30, 80], l: [12, 30] },
  light: { s: [20, 70], l: [85, 96] },
};

const between = ([a, b]: [number, number], src?: RandomSource) =>
  a + randomBelow(b - a + 1, src);

export function randomColor(
  mode: ColorMode,
  hue = 210,
  src?: RandomSource,
): { hex: string; rgb: RGB; h: number; s: number; l: number } {
  const r =
    mode === 'hue'
      ? { s: [55, 95] as [number, number], l: [30, 75] as [number, number] }
      : RANGES[mode];
  const h =
    mode === 'hue'
      ? (hue + randomBelow(31, src) - 15 + 360) % 360
      : randomBelow(360, src);
  const s = between(r.s, src);
  const l = between(r.l, src);
  const rgb = hslToRgb({ h, s, l });
  return { hex: rgbToHex(rgb), rgb, h, s, l };
}

/** WCAG relative luminance → best text colour for a swatch. */
export function textOn(rgb: RGB): '#000000' | '#ffffff' {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
  return L > 0.179 ? '#000000' : '#ffffff';
}

/* ------------------------------------------------------------------ */
/* Invoice                                                              */
/* ------------------------------------------------------------------ */

export type InvoiceItem = {
  description: string;
  quantity: string;
  price: string;
};

/**
 * Lenient amount parser: "1,200", "1.200,50", "1 200", "20%" and "€19.99"
 * all work. The last of “.” / “,” is the decimal mark when both appear; a
 * lone “,” followed by 1–2 digits is a decimal comma.
 */
export function parseAmount(input: string): number {
  let s = String(input)
    .trim()
    .replace(/[\s%\u00a0']/g, '')
    .replace(/[^\d.,-]/g, '');
  if (!s) return 0;
  const dot = s.lastIndexOf('.');
  const comma = s.lastIndexOf(',');
  if (dot >= 0 && comma >= 0) {
    const dec = dot > comma ? '.' : ',';
    s = s
      .split(dec === '.' ? ',' : '.')
      .join('')
      .replace(',', '.');
  } else if (comma >= 0) {
    s =
      /,\d{1,2}$/.test(s) && s.indexOf(',') === comma
        ? s.replace(',', '.')
        : s.replace(/,/g, '');
  } else if (dot >= 0 && s.indexOf('.') !== dot) {
    s = s.replace(/\./g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function invoiceTotals(
  items: InvoiceItem[],
  taxPct: string,
  discount: string,
  discountType: 'percent' | 'amount',
) {
  const round = (n: number) => Math.round(n * 100) / 100;
  const lines = items.map((it) => {
    const q = parseAmount(it.quantity);
    const p = parseAmount(it.price);
    return round(q * p);
  });
  const subtotal = round(lines.reduce((a, b) => a + b, 0));
  const d = Math.max(0, parseAmount(discount));
  const discountAmount = round(
    Math.min(
      subtotal,
      discountType === 'percent' ? (subtotal * Math.min(d, 100)) / 100 : d,
    ),
  );
  const taxable = round(subtotal - discountAmount);
  const tax = round((taxable * Math.max(0, parseAmount(taxPct))) / 100);
  return {
    lines,
    subtotal,
    discountAmount,
    taxable,
    tax,
    total: round(taxable + tax),
  };
}

export function formatMoney(
  n: number,
  currency: string,
  locale = 'en-US',
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

/* ------------------------------------------------------------------ */
/* E-mail signature                                                     */
/* ------------------------------------------------------------------ */

export type SignatureInput = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  imageUrl: string;
  color: string;
  linkedin: string;
  x: string;
  github: string;
  template: 'classic' | 'side' | 'compact';
};

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Only http(s) links and safe hex colours make it into the signature. */
export function safeUrl(u: string): string {
  const t = u.trim();
  if (!t) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : '';
  } catch {
    return '';
  }
}
const safeColor = (c: string) =>
  /^#[0-9a-f]{3,8}$/i.test(c.trim()) ? c.trim() : '#4f46e5';

export function buildSignature(s: SignatureInput): string {
  const color = safeColor(s.color);
  const font = 'font-family:Arial,Helvetica,sans-serif;';
  const link = (href: string, text: string) =>
    href
      ? `<a href="${esc(href)}" style="color:${color};text-decoration:none;">${esc(text)}</a>`
      : '';
  const email = s.email.trim();
  // Drop extensions (“ext. 12”, “x12”) — tel: links can’t dial them reliably.
  const phoneHref = s.phone
    .split(/\s*(?:ext\.?|x|#)\s*\d+$/i)[0]
    .replace(/[^+\d]/g, '');
  const contact = [
    s.phone.trim()
      ? `<a href="tel:${esc(phoneHref)}" style="color:#333333;text-decoration:none;">${esc(s.phone.trim())}</a>`
      : '',
    email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
      ? `<a href="mailto:${esc(email)}" style="color:#333333;text-decoration:none;">${esc(email)}</a>`
      : '',
    safeUrl(s.website)
      ? link(
          safeUrl(s.website),
          s.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        )
      : '',
  ].filter(Boolean);
  const socials = [
    ['LinkedIn', safeUrl(s.linkedin)],
    ['X', safeUrl(s.x)],
    ['GitHub', safeUrl(s.github)],
  ]
    .filter(([, u]) => u)
    .map(([label, u]) => link(u, label));
  const img = safeUrl(s.imageUrl)
    ? `<img src="${esc(safeUrl(s.imageUrl))}" alt="${esc(s.name || 'Photo')}" width="80" height="80" style="display:block;border-radius:8px;width:80px;height:80px;object-fit:cover;" />`
    : '';
  const nameLine = `<div style="${font}font-size:16px;font-weight:bold;color:#111111;">${esc(s.name || 'Your Name')}</div>`;
  const roleLine =
    s.title || s.company
      ? `<div style="${font}font-size:13px;color:${color};">${esc([s.title, s.company].filter(Boolean).join(' · '))}</div>`
      : '';
  const details = `<div style="${font}font-size:12px;color:#333333;line-height:1.6;margin-top:6px;">${contact.join(' &nbsp;|&nbsp; ')}${s.address.trim() ? `<br />${esc(s.address.trim())}` : ''}${socials.length ? `<br />${socials.join(' &nbsp;·&nbsp; ')}` : ''}</div>`;

  if (s.template === 'compact')
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="${font}">${nameLine}${roleLine}${details}</td></tr></table>`;
  if (s.template === 'side')
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${img ? `<td style="padding-right:14px;vertical-align:top;">${img}</td>` : ''}<td style="border-left:3px solid ${color};padding-left:14px;vertical-align:top;">${nameLine}${roleLine}${details}</td></tr></table>`;
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="vertical-align:top;">${img ? `<div style="margin-bottom:10px;">${img}</div>` : ''}${nameLine}${roleLine}<div style="width:40px;height:3px;background:${color};margin:8px 0;"></div>${details}</td></tr></table>`;
}
