// html-entities.json (WHATWG HTML standard), css-colors.json (CSS Color 4
// keywords via the color-name package) and xkcd-colors.json (xkcd colour
// survey, CC0).
import { createRequire } from 'node:module';
import { read, source, write } from './sources.mjs';

const require = createRequire(import.meta.url);

function category(ch) {
  const cp = ch.codePointAt(0);
  const r = (a, b) => cp >= a && cp <= b;
  const combining = [...ch].slice(1).every((c) => {
    const x = c.codePointAt(0);
    return (
      (x >= 0x300 && x <= 0x36f) ||
      [0xfe00, 0x20d2, 0x20e5, 0x338, 0x200a, 0x2005].includes(x)
    );
  });
  if ([...ch].length > 1 && !combining) return 'symbols';
  if ('$¢£¤¥₠'.includes(ch) || r(0x20a0, 0x20cf)) return 'currency';
  if (
    r(0x2190, 0x21ff) ||
    r(0x27f0, 0x27ff) ||
    r(0x2900, 0x297f) ||
    r(0x2b00, 0x2bff)
  )
    return 'arrows';
  if (r(0x370, 0x3ff) || r(0x1f00, 0x1fff) || 'ϵϕϖϰϱ'.includes(ch))
    return 'greek';
  if (r(0x400, 0x4ff)) return 'cyrillic';
  if (r(0xc0, 0x24f) || r(0x1e00, 0x1eff) || 'ªº'.includes(ch)) return 'latin';
  if (
    r(0x2200, 0x22ff) ||
    r(0x2a00, 0x2aff) ||
    r(0x27c0, 0x27ef) ||
    r(0x2980, 0x29ff) ||
    r(0x1d400, 0x1d7ff) ||
    r(0x2100, 0x214f) ||
    r(0x2150, 0x218f) ||
    '±×÷¬°µ¹²³¼½¾+<=>|^~%'.includes(ch)
  )
    return 'math';
  if (r(0x2000, 0x206f) || r(0x20, 0x7f) || '¡¿«»§¶·¦¨¯´¸ ­'.includes(ch))
    return 'punctuation';
  return 'symbols';
}

export async function buildEntitiesAndColors() {
  const ent = JSON.parse(read(await source('entities')));
  const byChar = new Map();
  for (const [k, v] of Object.entries(ent)) {
    if (!k.endsWith(';')) continue;
    const names = byChar.get(v.characters) ?? [];
    names.push(k.slice(1, -1));
    byChar.set(v.characters, names);
  }
  // Lower-case names first (&copy; before &COPY;), then shortest.
  const items = [...byChar].map(([ch, names]) => [
    ch,
    [...new Set(names)].sort(
      (a, b) =>
        Number(a !== a.toLowerCase()) - Number(b !== b.toLowerCase()) ||
        a.length - b.length ||
        (a < b ? -1 : 1),
    ),
    category(ch),
  ]);
  const key = (s) => [...s].map((c) => c.codePointAt(0));
  items.sort((a, b) => {
    const x = key(a[0]);
    const y = key(b[0]);
    for (let i = 0; i < Math.max(x.length, y.length); i++)
      if ((x[i] ?? -1) !== (y[i] ?? -1)) return (x[i] ?? -1) - (y[i] ?? -1);
    return 0;
  });
  write('html-entities.json', JSON.stringify(items));

  const names = require('color-name');
  const hex = (v) =>
    '#' +
    v
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  write(
    'css-colors.json',
    JSON.stringify(Object.entries(names).map(([k, v]) => [k, hex(v)])),
  );

  const xkcd = read(await source('xkcd'))
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const [name, h] = l.split('\t');
      return [name.trim(), h.trim().toUpperCase()];
    });
  write('xkcd-colors.json', JSON.stringify(xkcd));
}
