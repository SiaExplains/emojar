// SVG path data: parse any `d` string into absolute segments, edit them and
// write them back. Shorthand commands (H, V, S, T) are expanded so every
// segment carries explicit coordinates the editor can drag; arcs stay arcs.

export type Pt = { x: number; y: number };

export type Segment =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | { type: 'Q'; x1: number; y1: number; x: number; y: number }
  | {
      type: 'C';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x: number;
      y: number;
    }
  | {
      type: 'A';
      rx: number;
      ry: number;
      rotation: number;
      largeArc: boolean;
      sweep: boolean;
      x: number;
      y: number;
    }
  | { type: 'Z' };

export type SegmentType = Segment['type'];

export type ParseResult =
  | { ok: true; segments: Segment[] }
  | { ok: false; error: string };

const ARG_COUNT: Record<string, number> = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

type Token =
  | { kind: 'cmd'; value: string; pos: number }
  | { kind: 'num'; value: number; pos: number };

const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;

function tokenize(d: string): Token[] | string {
  const tokens: Token[] = [];
  let i = 0;
  while (i < d.length) {
    const ch = d[i];
    if (/[\s,]/.test(ch)) {
      i++;
    } else if (/[MLHVCSQTAZmlhvcsqtaz]/.test(ch)) {
      tokens.push({ kind: 'cmd', value: ch, pos: i });
      i++;
    } else {
      const m = NUMBER.exec(d.slice(i));
      if (!m) return `Unexpected “${ch}” at position ${i + 1}.`;
      tokens.push({ kind: 'num', value: Number(m[0]), pos: i });
      i += m[0].length;
    }
  }
  return tokens;
}

/**
 * Arc flags may be written without separators ("a1 1 0 01 5 5"), so a
 * number token like "01" that sits in a flag position is split into
 * single-digit flags.
 */
function splitFlags(d: string, tokens: Token[]): Token[] {
  const out: Token[] = [];
  let cmd = '';
  let argIndex = 0;
  for (const t of tokens) {
    if (t.kind === 'cmd') {
      cmd = t.value.toUpperCase();
      argIndex = 0;
      out.push(t);
      continue;
    }
    if (cmd === 'A') {
      const slot = argIndex % 7;
      if (slot === 3 || slot === 4) {
        const raw = NUMBER.exec(d.slice(t.pos))?.[0] ?? '';
        if (/^[01]{2,}/.test(raw)) {
          // e.g. "01" or "015" → flags 0, 1 then the rest as a number.
          let rest = raw;
          let pos = t.pos;
          while (
            (argIndex % 7 === 3 || argIndex % 7 === 4) &&
            /^[01]/.test(rest)
          ) {
            out.push({ kind: 'num', value: Number(rest[0]), pos });
            rest = rest.slice(1);
            pos++;
            argIndex++;
          }
          if (rest) {
            out.push({ kind: 'num', value: Number(rest), pos });
            argIndex++;
          }
          continue;
        }
      }
    }
    out.push(t);
    argIndex++;
  }
  return out;
}

/** Parses path data into absolute M/L/Q/C/A/Z segments. */
export function parsePath(d: string): ParseResult {
  const raw = tokenize(d);
  if (typeof raw === 'string') return { ok: false, error: raw };
  const tokens = splitFlags(d, raw);
  if (!tokens.length) return { ok: true, segments: [] };
  if (tokens[0].kind !== 'cmd' || tokens[0].value.toUpperCase() !== 'M')
    return { ok: false, error: 'Path data must start with M (move to).' };

  const segs: Segment[] = [];
  let cur: Pt = { x: 0, y: 0 };
  let start: Pt = { x: 0, y: 0 };
  // Last control point, for reflecting into S and T.
  let lastC: Pt | null = null;
  let lastQ: Pt | null = null;
  let i = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.kind !== 'cmd')
      return {
        ok: false,
        error: `Number without a command at position ${t.pos + 1}.`,
      };
    i++;
    let letter = t.value;
    const upper = letter.toUpperCase();
    const n = ARG_COUNT[upper];

    if (n === 0) {
      segs.push({ type: 'Z' });
      cur = { ...start };
      lastC = lastQ = null;
      continue;
    }

    let first = true;
    while (first || (i < tokens.length && tokens[i].kind === 'num')) {
      const args: number[] = [];
      for (let k = 0; k < n; k++) {
        const a = tokens[i];
        if (!a || a.kind !== 'num') {
          const where = a ? `position ${a.pos + 1}` : 'the end';
          return {
            ok: false,
            error: `${letter} needs ${n} number${n > 1 ? 's' : ''} but got ${k} before ${where}.`,
          };
        }
        if (
          upper === 'A' &&
          (k === 3 || k === 4) &&
          a.value !== 0 &&
          a.value !== 1
        )
          return {
            ok: false,
            error: `Arc flags must be 0 or 1 (position ${a.pos + 1}).`,
          };
        args.push(a.value);
        i++;
      }
      first = false;
      const rel = letter !== letter.toUpperCase();
      const ox = rel ? cur.x : 0;
      const oy = rel ? cur.y : 0;
      const kind = letter.toUpperCase();

      switch (kind) {
        case 'M': {
          cur = { x: ox + args[0], y: oy + args[1] };
          start = { ...cur };
          segs.push({ type: 'M', ...cur });
          lastC = lastQ = null;
          // Extra coordinate pairs after M are implicit line-tos.
          letter = rel ? 'l' : 'L';
          break;
        }
        case 'L':
        case 'H':
        case 'V': {
          const x = kind === 'V' ? cur.x : ox + args[0];
          const y =
            kind === 'H' ? cur.y : kind === 'V' ? oy + args[0] : oy + args[1];
          cur = { x, y };
          segs.push({ type: 'L', x, y });
          lastC = lastQ = null;
          break;
        }
        case 'C':
        case 'S': {
          let c1: Pt;
          let rest: number[];
          if (kind === 'C') {
            c1 = { x: ox + args[0], y: oy + args[1] };
            rest = args.slice(2);
          } else {
            c1 = lastC
              ? { x: 2 * cur.x - lastC.x, y: 2 * cur.y - lastC.y }
              : { ...cur };
            rest = args;
          }
          const c2 = { x: ox + rest[0], y: oy + rest[1] };
          const end = { x: ox + rest[2], y: oy + rest[3] };
          segs.push({
            type: 'C',
            x1: c1.x,
            y1: c1.y,
            x2: c2.x,
            y2: c2.y,
            ...end,
          });
          lastC = c2;
          lastQ = null;
          cur = end;
          break;
        }
        case 'Q':
        case 'T': {
          let c: Pt;
          let rest: number[];
          if (kind === 'Q') {
            c = { x: ox + args[0], y: oy + args[1] };
            rest = args.slice(2);
          } else {
            c = lastQ
              ? { x: 2 * cur.x - lastQ.x, y: 2 * cur.y - lastQ.y }
              : { ...cur };
            rest = args;
          }
          const end = { x: ox + rest[0], y: oy + rest[1] };
          segs.push({ type: 'Q', x1: c.x, y1: c.y, ...end });
          lastQ = c;
          lastC = null;
          cur = end;
          break;
        }
        case 'A': {
          const end = { x: ox + args[5], y: oy + args[6] };
          segs.push({
            type: 'A',
            rx: Math.abs(args[0]),
            ry: Math.abs(args[1]),
            rotation: args[2],
            largeArc: args[3] === 1,
            sweep: args[4] === 1,
            ...end,
          });
          cur = end;
          lastC = lastQ = null;
          break;
        }
      }
    }
  }
  return { ok: true, segments: segs };
}

/** Formats a number with at most `decimals` places and no trailing zeros. */
export function fmt(n: number, decimals = 2): string {
  const f = 10 ** Math.max(0, Math.min(6, Math.round(decimals)));
  const r = Math.round(n * f) / f;
  return String(Object.is(r, -0) ? 0 : r);
}

/** Absolute path data, one command letter per segment. */
export function serializePath(segs: Segment[], decimals = 2): string {
  const f = (n: number) => fmt(n, decimals);
  return segs
    .map((s) => {
      switch (s.type) {
        case 'M':
        case 'L':
          return `${s.type} ${f(s.x)} ${f(s.y)}`;
        case 'Q':
          return `Q ${f(s.x1)} ${f(s.y1)} ${f(s.x)} ${f(s.y)}`;
        case 'C':
          return `C ${f(s.x1)} ${f(s.y1)} ${f(s.x2)} ${f(s.y2)} ${f(s.x)} ${f(s.y)}`;
        case 'A':
          return `A ${f(s.rx)} ${f(s.ry)} ${f(s.rotation)} ${s.largeArc ? 1 : 0} ${s.sweep ? 1 : 0} ${f(s.x)} ${f(s.y)}`;
        case 'Z':
          return 'Z';
      }
    })
    .join(' ');
}

/** The pen position at the start of segment `index`. */
export function startOf(segs: Segment[], index: number): Pt {
  let cur: Pt = { x: 0, y: 0 };
  let start: Pt = { x: 0, y: 0 };
  for (let i = 0; i < index && i < segs.length; i++) {
    const s = segs[i];
    if (s.type === 'Z') cur = { ...start };
    else {
      cur = { x: s.x, y: s.y };
      if (s.type === 'M') start = { ...cur };
    }
  }
  return cur;
}

export type HandleKey = 'end' | 'c1' | 'c2';
export type Handle = { seg: number; key: HandleKey; x: number; y: number };

/** Every draggable point: segment end points and Bézier control points. */
export function handlesOf(segs: Segment[]): Handle[] {
  const out: Handle[] = [];
  segs.forEach((s, seg) => {
    if (s.type === 'Z') return;
    if (s.type === 'Q' || s.type === 'C')
      out.push({ seg, key: 'c1', x: s.x1, y: s.y1 });
    if (s.type === 'C') out.push({ seg, key: 'c2', x: s.x2, y: s.y2 });
    out.push({ seg, key: 'end', x: s.x, y: s.y });
  });
  return out;
}

export function movePoint(
  segs: Segment[],
  seg: number,
  key: HandleKey,
  p: Pt,
): Segment[] {
  return segs.map((s, i) => {
    if (i !== seg || s.type === 'Z') return s;
    if (key === 'end') return { ...s, x: p.x, y: p.y };
    if (key === 'c1' && (s.type === 'Q' || s.type === 'C'))
      return { ...s, x1: p.x, y1: p.y };
    if (key === 'c2' && s.type === 'C') return { ...s, x2: p.x, y2: p.y };
    return s;
  });
}

/** A new segment of `type` from `from` to `to`, with controls at thirds. */
export function makeSegment(type: SegmentType, from: Pt, to: Pt): Segment {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  switch (type) {
    case 'M':
      return { type: 'M', ...to };
    case 'L':
      return { type: 'L', ...to };
    case 'Q':
      // Offset the control sideways so the curve is visibly curved.
      return {
        type: 'Q',
        x1: from.x + dx / 2 - dy / 2,
        y1: from.y + dy / 2 + dx / 2,
        ...to,
      };
    case 'C':
      return {
        type: 'C',
        x1: from.x + dx / 3 - dy / 3,
        y1: from.y + dy / 3 + dx / 3,
        x2: from.x + (2 * dx) / 3 + dy / 3,
        y2: from.y + (2 * dy) / 3 - dx / 3,
        ...to,
      };
    case 'A': {
      const r = Math.max(1, Math.hypot(dx, dy) / 2);
      return {
        type: 'A',
        rx: r,
        ry: r,
        rotation: 0,
        largeArc: false,
        sweep: true,
        ...to,
      };
    }
    case 'Z':
      return { type: 'Z' };
  }
}

/**
 * Inserts a segment after `after` (−1 = at the start). The new end point is
 * halfway to the following segment's end, or a step past the last point.
 */
export function insertSegment(
  segs: Segment[],
  after: number,
  type: SegmentType,
  step = 20,
  bounds?: { w: number; h: number },
): Segment[] {
  if (type === 'Z') return segs;
  const at = Math.min(Math.max(after + 1, 0), segs.length);
  const from = startOf(segs, at);
  const next = segs[at];
  let to: Pt;
  if (next && next.type !== 'Z' && next.type !== 'M')
    to = { x: (from.x + next.x) / 2, y: (from.y + next.y) / 2 };
  else {
    to = { x: from.x + step, y: from.y };
    if (bounds && to.x > bounds.w) to = { x: from.x - step, y: from.y + step };
  }
  const seg: Segment =
    segs.length === 0 ? { type: 'M', ...to } : makeSegment(type, from, to);
  return [...segs.slice(0, at), seg, ...segs.slice(at)];
}

/** Removes a segment; a path must still begin with M. */
export function removeSegment(segs: Segment[], index: number): Segment[] {
  const out = segs.filter((_, i) => i !== index);
  const first = out[0];
  if (first && first.type !== 'M') {
    if (first.type === 'Z') return out.slice(1);
    out[0] = { type: 'M', x: first.x, y: first.y };
  }
  return out;
}

export function isClosed(segs: Segment[]): boolean {
  return segs.length > 0 && segs[segs.length - 1].type === 'Z';
}

export function setClosed(segs: Segment[], closed: boolean): Segment[] {
  if (closed === isClosed(segs) || !segs.length) return segs;
  return closed ? [...segs, { type: 'Z' }] : segs.slice(0, -1);
}

export type SvgStyle = {
  stroke: string;
  fill: string;
  strokeWidth: number;
  linecap: string;
  linejoin: string;
};

export function svgMarkup(
  d: string,
  viewBox: { w: number; h: number },
  style: SvgStyle,
): string {
  const attrs = [
    `d="${d}"`,
    `fill="${style.fill}"`,
    `stroke="${style.stroke}"`,
    `stroke-width="${fmt(style.strokeWidth)}"`,
  ];
  if (style.linecap !== 'butt') attrs.push(`stroke-linecap="${style.linecap}"`);
  if (style.linejoin !== 'miter')
    attrs.push(`stroke-linejoin="${style.linejoin}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(viewBox.w)} ${fmt(viewBox.h)}" width="${fmt(viewBox.w)}" height="${fmt(viewBox.h)}">\n  <path ${attrs.join(' ')} />\n</svg>\n`;
}

export const EXAMPLES: Record<string, string> = {
  heart:
    'M 100 170 C 40 130 10 95 10 60 C 10 30 35 15 58 15 C 78 15 92 27 100 42 C 108 27 122 15 142 15 C 165 15 190 30 190 60 C 190 95 160 130 100 170 Z',
  wave: 'M 10 100 Q 35 40 60 100 T 110 100 T 160 100 T 190 100',
  star: 'M 100 15 L 124 72 L 186 77 L 139 117 L 153 178 L 100 145 L 47 178 L 61 117 L 14 77 L 76 72 Z',
};
