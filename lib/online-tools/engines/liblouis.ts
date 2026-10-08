// Thin wrapper around the liblouis WebAssembly build in public/vendor/liblouis
// (LGPL-2.1+, see NOTICE.md there). Loaded on demand from this site only.

const TABLES = {
  g1: '/tables/unicode.dis,/tables/en-ueb-g1.ctb',
  g2: '/tables/unicode.dis,/tables/en-ueb-g2.ctb',
} as const;
export type UebGrade = keyof typeof TABLES;

type LouModule = {
  _malloc(n: number): number;
  _free(p: number): void;
  _lou_version(): number;
  _lou_translateString(...args: number[]): number;
  _lou_backTranslateString(...args: number[]): number;
  UTF8ToString(p: number): string;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAP32: Int32Array;
};

let modulePromise: Promise<LouModule> | null = null;

/** Loads the module once. `url` is overridable for tests (a file path). */
export function loadLiblouis(
  url = '/vendor/liblouis/liblouis.mjs',
): Promise<LouModule> {
  if (!modulePromise) {
    modulePromise = (
      import(/* webpackIgnore: true */ url) as Promise<{
        default: () => Promise<LouModule>;
      }>
    )
      .then((m) => m.default())
      .catch((e) => {
        modulePromise = null;
        throw e;
      });
  }
  return modulePromise;
}

function run(
  M: LouModule,
  fn: (...args: number[]) => number,
  tables: string,
  text: string,
): string {
  if (!text) return '';
  const enc = new TextEncoder().encode(`${tables}\0`);
  const t = M._malloc(enc.length);
  M.HEAPU8.set(enc, t);
  // liblouis uses 16-bit widechars (UTF-16 code units).
  const n = text.length;
  const cap = n * 4 + 64;
  const inp = M._malloc(n * 2);
  const out = M._malloc(cap * 2);
  const inLen = M._malloc(4);
  const outLen = M._malloc(4);
  try {
    for (let i = 0; i < n; i++) M.HEAPU16[(inp >> 1) + i] = text.charCodeAt(i);
    M.HEAP32[inLen >> 2] = n;
    M.HEAP32[outLen >> 2] = cap;
    if (!fn(t, inp, inLen, out, outLen, 0, 0, 0))
      throw new Error('liblouis could not translate this text.');
    const len = M.HEAP32[outLen >> 2];
    let s = '';
    for (let i = 0; i < len; i++)
      s += String.fromCharCode(M.HEAPU16[(out >> 1) + i]);
    return s;
  } finally {
    [t, inp, out, inLen, outLen].forEach((p) => M._free(p));
  }
}

/** Translates line by line so line breaks survive. */
const byLine = (text: string, f: (line: string) => string) =>
  text.split('\n').map(f).join('\n');

export async function uebTranslate(text: string, grade: UebGrade = 'g2') {
  const M = await loadLiblouis();
  return byLine(text, (l) => run(M, M._lou_translateString, TABLES[grade], l));
}

export async function uebBackTranslate(text: string, grade: UebGrade = 'g2') {
  const M = await loadLiblouis();
  return byLine(text, (l) =>
    run(M, M._lou_backTranslateString, TABLES[grade], l),
  );
}

export async function liblouisVersion() {
  const M = await loadLiblouis();
  return M.UTF8ToString(M._lou_version());
}
