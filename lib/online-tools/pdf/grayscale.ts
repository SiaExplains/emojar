// Grayscale PDF conversion that keeps text and vectors intact.
//
// Colour operators in page (and Form XObject / annotation) content streams are
// rewritten to DeviceGray, and colour images are converted to gray pixels.
// Anything that can't be converted safely (patterns, shadings, spot colours,
// unusual image encodings) marks the page for rasterisation instead, which the
// caller performs in the browser.

import type {
  PDFName as PDFNameT,
  PDFNumber as PDFNumberT,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFObject,
  PDFRawStream,
  PDFRef,
} from 'pdf-lib';

type Lib = typeof import('pdf-lib');

/* ------------------------------------------------------------------ */
/* Colour maths                                                        */
/* ------------------------------------------------------------------ */

/** Rec. 601 luma, the usual "convert to grayscale" weighting. */
export function rgbToGray(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function cmykToGray(c: number, m: number, y: number, k: number): number {
  return rgbToGray((1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k));
}

const fmt = (n: number) => {
  const v = Math.min(1, Math.max(0, n));
  return String(Math.round(v * 10000) / 10000);
};

/* ------------------------------------------------------------------ */
/* Content-stream tokenizer                                            */
/* ------------------------------------------------------------------ */

const WS = new Set([0, 9, 10, 12, 13, 32]);
const DELIM = new Set('()<>[]{}/%'.split('').map((c) => c.charCodeAt(0)));

export type Token = {
  type: 'num' | 'name' | 'str' | 'arr' | 'dict' | 'op' | 'other';
  text: string;
  start: number;
  end: number;
};

/**
 * Scans a content stream (decoded as latin1 so bytes map 1:1 to chars) and
 * calls `onOperator` with each operator and its operands. Inline image data is
 * skipped as one opaque `BI … EI` operator.
 */
export function scanContent(
  s: string,
  onOperator: (op: Token, operands: Token[]) => void,
): void {
  let i = 0;
  let operands: Token[] = [];
  const n = s.length;
  const code = (k: number) => s.charCodeAt(k);

  const readBalanced = (open: string, close: string, start: number) => {
    // Arrays and dicts may nest and contain strings.
    let depth = 0;
    let k = start;
    while (k < n) {
      const c = s[k];
      if (c === '(') {
        k = readString(k);
        continue;
      }
      if (s.startsWith(open, k)) {
        depth++;
        k += open.length;
        continue;
      }
      if (s.startsWith(close, k)) {
        depth--;
        k += close.length;
        if (depth === 0) return k;
        continue;
      }
      k++;
    }
    return n;
  };

  const readString = (start: number) => {
    let depth = 0;
    let k = start;
    while (k < n) {
      const c = s[k];
      if (c === '\\') {
        k += 2;
        continue;
      }
      if (c === '(') depth++;
      else if (c === ')') {
        depth--;
        if (depth === 0) return k + 1;
      }
      k++;
    }
    return n;
  };

  while (i < n) {
    const c = code(i);
    if (WS.has(c)) {
      i++;
      continue;
    }
    const ch = s[i];
    if (ch === '%') {
      while (i < n && s[i] !== '\n' && s[i] !== '\r') i++;
      continue;
    }
    const start = i;
    if (ch === '(') {
      i = readString(i);
      operands.push({ type: 'str', text: s.slice(start, i), start, end: i });
      continue;
    }
    if (ch === '<' && s[i + 1] === '<') {
      i = readBalanced('<<', '>>', i);
      operands.push({ type: 'dict', text: s.slice(start, i), start, end: i });
      continue;
    }
    if (ch === '<') {
      const close = s.indexOf('>', i);
      i = close < 0 ? n : close + 1;
      operands.push({ type: 'str', text: s.slice(start, i), start, end: i });
      continue;
    }
    if (ch === '[') {
      i = readBalanced('[', ']', i);
      operands.push({ type: 'arr', text: s.slice(start, i), start, end: i });
      continue;
    }
    if (ch === '/') {
      i++;
      while (i < n && !WS.has(code(i)) && !DELIM.has(code(i))) i++;
      operands.push({ type: 'name', text: s.slice(start, i), start, end: i });
      continue;
    }
    if (DELIM.has(c)) {
      // Stray delimiter (e.g. ')' or '{'): keep it as an opaque operand.
      i++;
      operands.push({ type: 'other', text: ch, start, end: i });
      continue;
    }
    while (i < n && !WS.has(code(i)) && !DELIM.has(code(i))) i++;
    const word = s.slice(start, i);
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) {
      operands.push({ type: 'num', text: word, start, end: i });
      continue;
    }
    if (word === 'true' || word === 'false' || word === 'null') {
      operands.push({ type: 'other', text: word, start, end: i });
      continue;
    }
    if (word === 'BI') {
      // Inline image: skip to the EI that follows the binary data.
      const id = s.indexOf('ID', i);
      let k = id < 0 ? n : id + 3;
      let end = n;
      while (k < n) {
        const e = s.indexOf('EI', k);
        if (e < 0) break;
        const before = code(e - 1);
        const after = e + 2 >= n ? 32 : code(e + 2);
        if (WS.has(before) && (WS.has(after) || after === 0)) {
          end = e + 2;
          break;
        }
        k = e + 2;
      }
      onOperator({ type: 'op', text: 'BI', start, end }, [
        { type: 'other', text: s.slice(start, end), start, end },
      ]);
      operands = [];
      i = end;
      continue;
    }
    onOperator({ type: 'op', text: word, start, end: i }, operands);
    operands = [];
  }
}

/* ------------------------------------------------------------------ */
/* Colour-space resolution                                             */
/* ------------------------------------------------------------------ */

/** How many components a colour space has, or why it isn't supported. */
export type SpaceKind =
  | { ok: true; kind: 'gray' | 'rgb' | 'cmyk' | 'lab' }
  | { ok: false; reason: string };

const GRAY: SpaceKind = { ok: true, kind: 'gray' };

export function rewriteContent(
  content: string,
  resolveSpace: (name: string) => SpaceKind,
  onInlineImage: (bi: string) => boolean,
): { text: string; problems: string[] } {
  const problems = new Set<string>();
  const out: string[] = [];
  let last = 0;
  type State = { fill: SpaceKind; stroke: SpaceKind };
  let state: State = { fill: GRAY, stroke: GRAY };
  const stack: State[] = [];

  const replace = (from: number, to: number, text: string) => {
    out.push(content.slice(last, from), text);
    last = to;
  };
  const nums = (ops: Token[]) => ops.map((t) => Number(t.text));
  const toGray = (space: SpaceKind, v: number[]): number | null => {
    if (!space.ok) return null;
    if (space.kind === 'gray' && v.length === 1) return v[0];
    if (space.kind === 'rgb' && v.length === 3)
      return rgbToGray(v[0], v[1], v[2]);
    if (space.kind === 'cmyk' && v.length === 4)
      return cmykToGray(v[0], v[1], v[2], v[3]);
    if (space.kind === 'lab' && v.length === 3) return v[0] / 100;
    return null;
  };

  scanContent(content, (op, operands) => {
    const from = operands.length ? operands[0].start : op.start;
    const allNums = operands.every((t) => t.type === 'num');
    switch (op.text) {
      case 'q':
        stack.push({ ...state });
        return;
      case 'Q':
        state = stack.pop() ?? state;
        return;
      case 'g':
      case 'G':
        if (op.text === 'g') state.fill = GRAY;
        else state.stroke = GRAY;
        return;
      case 'rg':
      case 'RG':
      case 'k':
      case 'K': {
        const want = op.text.toLowerCase() === 'rg' ? 3 : 4;
        if (operands.length !== want || !allNums) return;
        const v = nums(operands);
        const gray =
          want === 3
            ? rgbToGray(v[0], v[1], v[2])
            : cmykToGray(v[0], v[1], v[2], v[3]);
        const fill = op.text === op.text.toLowerCase();
        if (fill) state.fill = GRAY;
        else state.stroke = GRAY;
        replace(from, op.end, `${fmt(gray)} ${fill ? 'g' : 'G'}`);
        return;
      }
      case 'cs':
      case 'CS': {
        const name =
          operands[0]?.type === 'name' ? operands[0].text.slice(1) : '';
        const space = resolveSpace(name);
        const fill = op.text === 'cs';
        if (fill) state.fill = space;
        else state.stroke = space;
        if (!space.ok) {
          problems.add(space.reason);
          return;
        }
        replace(from, op.end, `/DeviceGray ${op.text}`);
        return;
      }
      case 'sc':
      case 'scn':
      case 'SC':
      case 'SCN': {
        const fill = op.text === op.text.toLowerCase();
        const space = fill ? state.fill : state.stroke;
        if (!space.ok) return; // already reported at cs/CS
        if (!allNums) {
          problems.add('pattern fill');
          return;
        }
        const gray = toGray(space, nums(operands));
        if (gray == null) {
          problems.add('unexpected colour values');
          return;
        }
        replace(from, op.end, `${fmt(gray)} ${op.text}`);
        return;
      }
      case 'sh':
        problems.add('gradient (shading)');
        return;
      case 'BI':
        if (!onInlineImage(operands[0]?.text ?? ''))
          problems.add('inline colour image');
        return;
      default:
        return;
    }
  });
  out.push(content.slice(last));
  return { text: out.join(''), problems: [...problems] };
}

/** Inline images are fine when they are already gray, 1-bit masks or stencils. */
export function inlineImageIsGray(bi: string): boolean {
  const head = bi.slice(0, bi.indexOf('ID') > 0 ? bi.indexOf('ID') : bi.length);
  if (/\/(IM|ImageMask)\s+true/.test(head)) return true;
  const cs = /\/(CS|ColorSpace)\s*\/(\w+)/.exec(head);
  return !!cs && /^(G|DeviceGray|CalGray)$/.test(cs[2]);
}

/* ------------------------------------------------------------------ */
/* Document conversion                                                 */
/* ------------------------------------------------------------------ */

export type GrayscaleHooks = {
  /** Converts a colour JPEG to a gray JPEG (browser canvas). */
  convertJpeg?: (jpeg: Uint8Array) => Promise<Uint8Array | null>;
};

export type GrayscaleReport = {
  /** Zero-based indexes of pages that need rasterising, with the reasons. */
  unsupported: { page: number; reasons: string[] }[];
  imagesConverted: number;
};

const toLatin1 = (b: Uint8Array) => {
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000)
    s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return s;
};
const fromLatin1 = (s: string) => {
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff;
  return b;
};

/** Undoes PNG row predictors (Predictor 10–15) for 8-bit samples. */
export function unpredictPng(
  data: Uint8Array,
  colors: number,
  columns: number,
): Uint8Array {
  const bpp = colors;
  const row = colors * columns;
  const rows = Math.floor(data.length / (row + 1));
  const out = new Uint8Array(rows * row);
  for (let r = 0; r < rows; r++) {
    const type = data[r * (row + 1)];
    const src = r * (row + 1) + 1;
    const dst = r * row;
    for (let x = 0; x < row; x++) {
      const raw = data[src + x];
      const left = x >= bpp ? out[dst + x - bpp] : 0;
      const up = r > 0 ? out[dst - row + x] : 0;
      const ul = r > 0 && x >= bpp ? out[dst - row + x - bpp] : 0;
      let v = raw;
      if (type === 1) v = raw + left;
      else if (type === 2) v = raw + up;
      else if (type === 3) v = raw + ((left + up) >> 1);
      else if (type === 4) {
        const p = left + up - ul;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - ul);
        v = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : ul);
      }
      out[dst + x] = v & 0xff;
    }
  }
  return out;
}

export async function grayscalePdfDocument(
  doc: PDFDocument,
  lib: Lib,
  hooks: GrayscaleHooks = {},
): Promise<GrayscaleReport> {
  const {
    PDFName,
    PDFDict,
    PDFArray,
    PDFRawStream,
    PDFNumber,
    PDFRef,
    PDFString,
    PDFHexString,
    decodePDFRawStream,
  } = lib;
  const ctx = doc.context;
  const N = (s: string) => PDFName.of(s);
  const report: GrayscaleReport = { unsupported: [], imagesConverted: 0 };
  const doneStreams = new Set<string>();
  const doneImages = new Map<string, boolean>();

  const lookup = (o: PDFObject | undefined) =>
    o instanceof PDFRef ? ctx.lookup(o) : o;

  /** Classifies a colour-space object (name or array). */
  const classify = (obj: PDFObject | undefined): SpaceKind => {
    const o = lookup(obj);
    if (o instanceof PDFName) {
      const n = o.decodeText();
      if (n === 'DeviceGray' || n === 'G' || n === 'CalGray') return GRAY;
      if (n === 'DeviceRGB' || n === 'RGB') return { ok: true, kind: 'rgb' };
      if (n === 'DeviceCMYK' || n === 'CMYK') return { ok: true, kind: 'cmyk' };
      if (n === 'Pattern') return { ok: false, reason: 'pattern fill' };
      return { ok: false, reason: `colour space ${n}` };
    }
    if (o instanceof PDFArray) {
      const family = lookup(o.get(0));
      const fam = family instanceof PDFName ? family.decodeText() : '';
      if (fam === 'CalGray') return GRAY;
      if (fam === 'CalRGB') return { ok: true, kind: 'rgb' };
      if (fam === 'Lab') return { ok: true, kind: 'lab' };
      if (fam === 'ICCBased') {
        const s = lookup(o.get(1));
        const nComp =
          s && 'dict' in s
            ? (s as PDFRawStream).dict.lookup(N('N'))
            : undefined;
        const count = nComp instanceof PDFNumber ? nComp.asNumber() : 0;
        if (count === 1) return GRAY;
        if (count === 3) return { ok: true, kind: 'rgb' };
        if (count === 4) return { ok: true, kind: 'cmyk' };
        return { ok: false, reason: 'unusual ICC colour profile' };
      }
      if (fam === 'Pattern') return { ok: false, reason: 'pattern fill' };
      if (fam === 'Separation' || fam === 'DeviceN')
        return { ok: false, reason: 'spot colour' };
      if (fam === 'Indexed') return { ok: false, reason: 'indexed colour' };
      return { ok: false, reason: `colour space ${fam || 'unknown'}` };
    }
    return { ok: false, reason: 'unknown colour space' };
  };

  const decode = (stream: PDFRawStream): Uint8Array | null => {
    try {
      return decodePDFRawStream(stream).decode();
    } catch {
      return null;
    }
  };

  /** Replaces a stream object, keeping its dictionary minus encoding keys. */
  const replaceStream = (
    ref: PDFRef,
    old: PDFRawStream,
    contents: Uint8Array,
    extra: Record<string, PDFObject | string | number> = {},
    flate = true,
  ) => {
    const entries: Record<string, PDFObject | string | number> = {};
    for (const [k, v] of old.dict.entries()) {
      const key = k.decodeText();
      if (key === 'Length' || key === 'Filter' || key === 'DecodeParms')
        continue;
      entries[key] = v;
    }
    Object.assign(entries, extra);
    const next = flate
      ? ctx.flateStream(contents, entries as never)
      : ctx.stream(contents, entries as never);
    ctx.assign(ref, next);
  };

  /** Converts one image XObject in place. Returns false if it can't. */
  const convertImage = async (
    ref: PDFRef,
    img: PDFRawStream,
  ): Promise<boolean> => {
    const key = ref.toString();
    if (doneImages.has(key)) return doneImages.get(key)!;
    const d = img.dict;
    const result = await (async () => {
      if (d.lookup(N('ImageMask'))?.toString() === 'true') return true;
      const space = classify(d.get(N('ColorSpace')));
      const bpc = (
        d.lookup(N('BitsPerComponent')) as PDFNumberT | undefined
      )?.asNumber();
      const filterObj = lookup(d.get(N('Filter')));
      const filters =
        filterObj instanceof PDFName
          ? [filterObj.decodeText()]
          : filterObj instanceof PDFArray
            ? filterObj
                .asArray()
                .map((f) => (lookup(f) as PDFNameT).decodeText())
            : [];
      if (space.ok && space.kind === 'gray') return true;
      if (!space.ok) {
        // Indexed images: convert the palette, keep the pixel indexes.
        const cs = lookup(d.get(N('ColorSpace')));
        if (
          cs instanceof PDFArray &&
          (lookup(cs.get(0)) as PDFNameT)?.decodeText?.() === 'Indexed'
        ) {
          const base = classify(cs.get(1));
          const hival = (lookup(cs.get(2)) as PDFNumberT).asNumber();
          const lut = lookup(cs.get(3));
          let bytes: Uint8Array | null = null;
          if (lut instanceof PDFHexString || lut instanceof PDFString)
            bytes = lut.asBytes();
          else if (lut && 'dict' in lut) bytes = decode(lut as PDFRawStream);
          if (!base.ok || !bytes || base.kind === 'lab') return false;
          const comps = base.kind === 'gray' ? 1 : base.kind === 'rgb' ? 3 : 4;
          const out = new Uint8Array(hival + 1);
          for (let i = 0; i <= hival; i++) {
            const v = Array.from(
              bytes.subarray(i * comps, i * comps + comps),
              (x) => x / 255,
            );
            out[i] = Math.round(
              255 *
                (comps === 1
                  ? v[0]
                  : comps === 3
                    ? rgbToGray(v[0], v[1], v[2])
                    : cmykToGray(v[0], v[1], v[2], v[3])),
            );
          }
          d.set(
            N('ColorSpace'),
            ctx.obj([
              N('Indexed'),
              N('DeviceGray'),
              hival,
              PDFHexString.of(
                Array.from(out, (b) => b.toString(16).padStart(2, '0')).join(
                  '',
                ),
              ),
            ]),
          );
          return true;
        }
        return false;
      }
      if (d.has(N('Decode'))) return false;
      if (filters.length === 1 && filters[0] === 'DCTDecode') {
        if (space.kind === 'cmyk' || !hooks.convertJpeg) return false;
        const gray = await hooks.convertJpeg(img.contents);
        if (!gray) return false;
        replaceStream(
          ref,
          img,
          gray,
          {
            ColorSpace: 'DeviceGray',
            BitsPerComponent: 8,
            Filter: 'DCTDecode',
          },
          false,
        );
        return true;
      }
      if (bpc !== 8 || filters.some((f) => f !== 'FlateDecode')) return false;
      let raw = decode(img);
      if (!raw) return false;
      const parms = lookup(d.get(N('DecodeParms')));
      const predictor =
        parms instanceof PDFDict
          ? ((
              parms.lookup(N('Predictor')) as PDFNumberT | undefined
            )?.asNumber() ?? 1)
          : 1;
      const w = (d.lookup(N('Width')) as PDFNumberT).asNumber();
      const h = (d.lookup(N('Height')) as PDFNumberT).asNumber();
      const comps = space.kind === 'cmyk' ? 4 : 3;
      if (predictor >= 10) raw = unpredictPng(raw, comps, w);
      else if (predictor !== 1) return false;
      if (raw.length < w * h * comps) return false;
      const out = new Uint8Array(w * h);
      for (let p = 0; p < w * h; p++) {
        const o = p * comps;
        const g =
          comps === 3
            ? rgbToGray(raw[o] / 255, raw[o + 1] / 255, raw[o + 2] / 255)
            : space.kind === 'lab'
              ? raw[o] / 255
              : cmykToGray(
                  raw[o] / 255,
                  raw[o + 1] / 255,
                  raw[o + 2] / 255,
                  raw[o + 3] / 255,
                );
        out[p] = Math.round(g * 255);
      }
      replaceStream(ref, img, out, {
        ColorSpace: 'DeviceGray',
        BitsPerComponent: 8,
      });
      return true;
    })();
    if (result) report.imagesConverted++;
    doneImages.set(key, result);
    return result;
  };

  /** Rewrites a content stream plus everything its resources reference. */
  const processContent = async (
    text: string,
    resources: PDFDict | undefined,
    problems: Set<string>,
  ): Promise<string> => {
    const spaces = resources?.lookupMaybe(N('ColorSpace'), PDFDict);
    const resolveSpace = (name: string): SpaceKind => {
      if (['DeviceGray', 'DeviceRGB', 'DeviceCMYK', 'Pattern'].includes(name))
        return classify(N(name));
      const entry = spaces?.get(N(name));
      return entry
        ? classify(entry)
        : { ok: false, reason: `colour space ${name}` };
    };
    const r = rewriteContent(text, resolveSpace, inlineImageIsGray);
    r.problems.forEach((p) => problems.add(p));
    const xobjects = resources?.lookupMaybe(N('XObject'), PDFDict);
    if (xobjects) {
      for (const [, value] of xobjects.entries()) {
        if (!(value instanceof PDFRef)) continue;
        const x = ctx.lookup(value);
        if (!x || !('dict' in x)) continue;
        const stream = x as PDFRawStream;
        const subtype = stream.dict.lookup(N('Subtype'));
        if (subtype === N('Image')) {
          if (!(await convertImage(value, stream)))
            problems.add('colour image in an unsupported format');
        } else if (subtype === N('Form'))
          await processForm(value, stream, resources, problems);
      }
    }
    return r.text;
  };

  const processForm = async (
    ref: PDFRef,
    stream: PDFRawStream,
    parentRes: PDFDict | undefined,
    problems: Set<string>,
  ) => {
    const key = ref.toString();
    if (doneStreams.has(key)) return;
    doneStreams.add(key);
    const bytes = decode(stream);
    if (!bytes) {
      problems.add('unreadable drawing');
      return;
    }
    const res = stream.dict.lookupMaybe(N('Resources'), PDFDict) ?? parentRes;
    const text = await processContent(toLatin1(bytes), res, problems);
    // Transparency groups may declare a colour blending space; make it gray too.
    const group = stream.dict.lookupMaybe(N('Group'), PDFDict);
    if (group?.has(N('CS'))) group.set(N('CS'), N('DeviceGray'));
    replaceStream(ref, stream, fromLatin1(text));
  };

  const grayColorArray = (dict: PDFDict, key: string) => {
    const arr = dict.lookupMaybe(N(key), PDFArray);
    if (!arr) return;
    const v = arr
      .asArray()
      .map((x) => (lookup(x) as PDFNumberT).asNumber?.() ?? 0);
    const g =
      v.length === 3
        ? rgbToGray(v[0], v[1], v[2])
        : v.length === 4
          ? cmykToGray(v[0], v[1], v[2], v[3])
          : null;
    if (g != null) dict.set(N(key), ctx.obj([Math.round(g * 1000) / 1000]));
  };

  const pages = doc.getPages();
  // Content streams shared between pages must not be deleted after rewriting.
  const contentRefs = (node: (typeof pages)[number]['node']): PDFRef[] => {
    const raw = node.get(N('Contents'));
    const refs: PDFRef[] = raw instanceof PDFRef ? [raw] : [];
    const arr = lookup(raw);
    if (arr instanceof PDFArray)
      for (const c of arr.asArray()) if (c instanceof PDFRef) refs.push(c);
    return refs;
  };
  const useCount = new Map<string, number>();
  for (const p of pages)
    for (const r of contentRefs(p.node))
      useCount.set(r.toString(), (useCount.get(r.toString()) ?? 0) + 1);

  for (let i = 0; i < pages.length; i++) {
    const node = pages[i].node;
    const problems = new Set<string>();
    const resources = node.Resources();
    const contents = node.Contents();
    const parts: PDFRawStream[] = [];
    if (contents instanceof PDFArray)
      for (const c of contents.asArray()) {
        const s = lookup(c);
        if (s && 'dict' in s) parts.push(s as PDFRawStream);
      }
    else if (contents && 'dict' in contents)
      parts.push(contents as unknown as PDFRawStream);
    const decoded = parts.map(decode);
    if (decoded.some((b) => !b)) problems.add('unreadable page content');
    else if (parts.length) {
      const text = await processContent(
        decoded.map((b) => toLatin1(b!)).join('\n'),
        resources,
        problems,
      );
      const old = contentRefs(node);
      node.set(N('Contents'), ctx.register(ctx.flateStream(fromLatin1(text))));
      for (const r of old) if (useCount.get(r.toString()) === 1) ctx.delete(r);
    }
    const group = node.lookupMaybe(N('Group'), PDFDict);
    if (group?.has(N('CS'))) group.set(N('CS'), N('DeviceGray'));
    // Annotation appearances (form fields, stamps, highlights) and their colours.
    const annots = node.Annots();
    for (const a of annots?.asArray() ?? []) {
      const annot = lookup(a);
      if (!(annot instanceof PDFDict)) continue;
      grayColorArray(annot, 'C');
      grayColorArray(annot, 'IC');
      const ap = annot.lookupMaybe(N('AP'), PDFDict);
      for (const [, v] of ap?.entries() ?? []) {
        const target = lookup(v);
        const refs: PDFRef[] = [];
        if (v instanceof PDFRef && target && 'dict' in target) refs.push(v);
        else if (target instanceof PDFDict)
          for (const [, s] of target.entries())
            if (s instanceof PDFRef) refs.push(s);
        for (const ref of refs) {
          const s = ctx.lookup(ref);
          if (s && 'dict' in s)
            await processForm(ref, s as PDFRawStream, resources, problems);
        }
      }
    }
    if (problems.size)
      report.unsupported.push({ page: i, reasons: [...problems] });
  }
  return report;
}

/** Replaces page `index` with a full-page JPEG, keeping its visual size. */
export async function replacePageWithImage(
  doc: PDFDocument,
  index: number,
  jpeg: Uint8Array,
  widthPt: number,
  heightPt: number,
): Promise<void> {
  const img = await doc.embedJpg(jpeg);
  const page = doc.insertPage(index, [widthPt, heightPt]);
  page.drawImage(img, { x: 0, y: 0, width: widthPt, height: heightPt });
  doc.removePage(index + 1);
}
