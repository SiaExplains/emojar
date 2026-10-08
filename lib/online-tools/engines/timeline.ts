// Timeline maker: sorting, layout and SVG rendering. The on-screen view and
// the SVG/PNG exports all use the string built by `timelineSvg`, so what you
// see is exactly what you download.

import {
  isArrayOf,
  isId,
  isIsoDate,
  isObj,
  isStr,
  uniqueIds,
} from './local-data';

export type TLEvent = {
  id: string;
  title: string;
  /** YYYY-MM-DD. Kept even when invalid so imported data isn't lost. */
  date: string;
  /** HH:MM or ''. */
  time: string;
  description: string;
  category: string;
  /** #rrggbb */
  color: string;
};
export type TLView = 'horizontal' | 'vertical';
export type TLSpacing = 'proportional' | 'even';
export type TLState = {
  version: 1;
  title: string;
  view: TLView;
  spacing: TLSpacing;
  events: TLEvent[];
};

export const TL_LIMITS = {
  events: 300,
  title: 120,
  description: 1000,
  category: 40,
};
export const DEFAULT_COLOR = '#6366f1';
export const TL_COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#64748b',
];

const isHex = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s);
export const safeColor = (s: string) => (isHex(s) ? s : DEFAULT_COLOR);

const isTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/** Milliseconds (UTC, so no DST jumps) for a valid date + optional time, else null. */
export function eventTime(date: string, time: string): number | null {
  if (!isIsoDate(date)) return null;
  if (time !== '' && !isTime(time)) return null;
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time ? time.split(':').map(Number) : [0, 0];
  const dt = new Date(0);
  // setUTCFullYear, unlike Date.UTC, doesn't map years 0–99 to 1900–1999.
  dt.setUTCFullYear(y, m - 1, d);
  dt.setUTCHours(hh, mm, 0, 0);
  return dt.getTime();
}

export function eventError(e: TLEvent): string | null {
  if (!isIsoDate(e.date))
    return e.date ? `“${e.date}” isn’t a valid date.` : 'Add a date.';
  if (e.time !== '' && !isTime(e.time))
    return `“${e.time}” isn’t a valid time (use HH:MM).`;
  return null;
}

/**
 * Valid events by date and time; events at the same moment keep their
 * order in the list, which is how manual reordering works. Invalid ones are
 * returned separately so they can be shown with an error.
 */
export function sortEvents(events: TLEvent[]): {
  sorted: TLEvent[];
  invalid: TLEvent[];
} {
  const withT = events.map((e, i) => ({ e, i, t: eventTime(e.date, e.time) }));
  const valid = withT.filter(
    (x): x is { e: TLEvent; i: number; t: number } => x.t !== null,
  );
  valid.sort((a, b) => a.t - b.t || a.i - b.i);
  return {
    sorted: valid.map((x) => x.e),
    invalid: withT.filter((x) => x.t === null).map((x) => x.e),
  };
}

/** Neighbour at the same date and time in sorted order, if any. */
function sameMomentNeighbour(events: TLEvent[], id: string, delta: number) {
  const { sorted } = sortEvents(events);
  const i = sorted.findIndex((e) => e.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= sorted.length) return null;
  const a = sorted[i];
  const b = sorted[j];
  return eventTime(a.date, a.time) === eventTime(b.date, b.time) ? b : null;
}

export const canMove = (events: TLEvent[], id: string, delta: number) =>
  sameMomentNeighbour(events, id, delta) !== null;

/** Swaps an event with its same-moment neighbour (dates decide everything else). */
export function moveEvent(
  events: TLEvent[],
  id: string,
  delta: number,
): TLEvent[] {
  const other = sameMomentNeighbour(events, id, delta);
  if (!other) return events;
  const i = events.findIndex((e) => e.id === id);
  const j = events.findIndex((e) => e.id === other.id);
  const next = [...events];
  next[i] = events[j];
  next[j] = events[i];
  return next;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** “5 Mar 2024, 14:30” — fixed English so exports look the same everywhere. */
export function formatEventDate(date: string, time: string): string {
  if (!isIsoDate(date)) return date || 'No date';
  const [y, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}${time && isTime(time) ? `, ${time}` : ''}`;
}

/** Escapes text for SVG/XML content and attribute values. */
export function escapeXml(s: string): string {
  let out = '';
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    // Control characters are not allowed in XML 1.0 and would break the
    // PNG export, so they are dropped (tab and newlines are kept).
    if (c < 32 && c !== 9 && c !== 10 && c !== 13) continue;
    out +=
      ch === '&'
        ? '&amp;'
        : ch === '<'
          ? '&lt;'
          : ch === '>'
            ? '&gt;'
            : ch === '"'
              ? '&quot;'
              : ch === "'"
                ? '&apos;'
                : ch;
  }
  return out;
}

/**
 * Greedy word wrap by character count (SVG has no automatic wrapping).
 * Overlong words are cut, and the last line gets an ellipsis when text is
 * left over.
 */
export function wrapText(
  text: string,
  maxChars: number,
  maxLines: number,
): string[] {
  const width = Math.max(2, Math.floor(maxChars));
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines: string[] = [];
  let line = '';
  let i = 0;
  while (i < words.length && lines.length < maxLines) {
    const w = words[i];
    if (w.length > width) {
      if (line) {
        lines.push(line);
        line = '';
        continue;
      }
      lines.push(w.slice(0, width));
      words[i] = w.slice(width);
      continue;
    }
    const next = line ? `${line} ${w}` : w;
    if (next.length > width) {
      lines.push(line);
      line = '';
      continue;
    }
    line = next;
    i++;
  }
  let truncated = i < words.length;
  if (line) {
    if (lines.length < maxLines) lines.push(line);
    else truncated = true;
  }
  if (truncated && lines.length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] =
      (last.length >= width ? last.slice(0, width - 1) : last) + '…';
  }
  return lines;
}

// --------------------------------------------------------------- layout

export const H = {
  cardW: 180,
  cardH: 112,
  laneGap: 16,
  stem: 28,
  header: 64,
  minAxis: 640,
  gap: 20,
  margin: 24,
};

export type PlacedEvent = {
  event: TLEvent;
  /** Position of the dot on the axis. */
  x: number;
  y: number;
  side: 'above' | 'below';
  lane: number;
  cardX: number;
  cardY: number;
  cardW: number;
  cardH: number;
};

export type TimelineLayout = {
  width: number;
  height: number;
  axis: { x1: number; y1: number; x2: number; y2: number };
  items: PlacedEvent[];
};

/**
 * Horizontal layout. Even spacing alternates cards above and below the
 * axis; proportional spacing places dots by date and stacks cards into
 * extra lanes when they would overlap.
 */
export function layoutHorizontal(
  sorted: TLEvent[],
  spacing: TLSpacing,
): TimelineLayout {
  const n = sorted.length;
  const pad = H.margin + H.cardW / 2;
  const step = H.cardW / 2 + H.gap;
  const axisLen = Math.max(H.minAxis - 2 * pad, (n - 1) * step);
  const times = sorted.map((e) => eventTime(e.date, e.time) ?? 0);
  const t0 = times[0] ?? 0;
  const span = (times[n - 1] ?? 0) - t0;

  const xs = sorted.map((_, i) => {
    if (spacing === 'even' || span === 0)
      return n === 1 ? pad + axisLen / 2 : pad + (axisLen * i) / (n - 1 || 1);
    return pad + ((times[i] - t0) / span) * axisLen;
  });

  // Lane assignment: each side keeps the right edge of its last card per
  // lane; a card goes in the lowest lane where it fits, preferring the
  // alternating side so neighbours don't collide.
  const ends: Record<'above' | 'below', number[]> = { above: [], below: [] };
  const fit = (side: 'above' | 'below', x: number) => {
    const lanes = ends[side];
    const k = lanes.findIndex((end) => end + H.gap <= x - H.cardW / 2);
    return k < 0 ? lanes.length : k;
  };
  const placed = sorted.map((event, i) => {
    const x = xs[i];
    const pref: 'above' | 'below' = i % 2 === 0 ? 'above' : 'below';
    const other = pref === 'above' ? 'below' : 'above';
    const a = fit(pref, x);
    const b = fit(other, x);
    const side = b < a ? other : pref;
    const lane = b < a ? b : a;
    ends[side][lane] = x + H.cardW / 2;
    return { event, x, side, lane };
  });

  const lanesAbove = Math.max(1, ends.above.length);
  const lanesBelow = Math.max(1, ends.below.length);
  const laneH = H.cardH + H.laneGap;
  const axisY = H.header + lanesAbove * laneH + H.stem - H.laneGap;
  const width = Math.ceil(axisLen + 2 * pad);
  const height = Math.ceil(axisY + H.stem + lanesBelow * laneH + H.margin);

  return {
    width,
    height,
    axis: { x1: H.margin, y1: axisY, x2: width - H.margin, y2: axisY },
    items: placed.map((p) => ({
      ...p,
      y: axisY,
      cardX: p.x - H.cardW / 2,
      cardY:
        p.side === 'above'
          ? axisY - H.stem - H.cardH - p.lane * laneH
          : axisY + H.stem + p.lane * laneH,
      cardW: H.cardW,
      cardH: H.cardH,
    })),
  };
}

export const V = { width: 640, axisX: 150, rowH: 104, cardH: 88 };

/** Vertical layout: one row per event, dates left of the axis, cards right. */
export function layoutVertical(sorted: TLEvent[]): TimelineLayout {
  const top = H.header + 8;
  const cardX = V.axisX + 24;
  const cardW = V.width - cardX - H.margin;
  const height = top + Math.max(1, sorted.length) * V.rowH + H.margin;
  return {
    width: V.width,
    height,
    axis: { x1: V.axisX, y1: top - 8, x2: V.axisX, y2: height - H.margin },
    items: sorted.map((event, i) => {
      const cardY = top + i * V.rowH;
      return {
        event,
        x: V.axisX,
        y: cardY + 20,
        side: 'below' as const,
        lane: 0,
        cardX,
        cardY,
        cardW,
        cardH: V.cardH,
      };
    }),
  };
}

// ------------------------------------------------------------------ SVG

const FONT =
  "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const text = (x: number, y: number, s: string, attrs: string) =>
  `<text x="${x}" y="${y}" ${attrs}>${escapeXml(s)}</text>`;

function card(p: PlacedEvent, vertical: boolean): string {
  const e = p.event;
  const color = safeColor(e.color);
  const charW = 6.6;
  const cols = Math.floor((p.cardW - 24) / charW);
  const out: string[] = [];
  out.push(
    `<rect x="${p.cardX}" y="${p.cardY}" width="${p.cardW}" height="${p.cardH}" rx="10" fill="#ffffff" stroke="${color}" stroke-width="1.5"/>`,
    `<rect x="${p.cardX}" y="${p.cardY}" width="5" height="${p.cardH}" rx="2" fill="${color}"/>`,
  );
  const x = p.cardX + 14;
  let y = p.cardY + 22;
  const titleLines = wrapText(
    e.title || 'Untitled',
    cols - 2,
    vertical ? 1 : 2,
  );
  for (const l of titleLines) {
    out.push(text(x, y, l, 'font-size="13" font-weight="700" fill="#111827"'));
    y += 16;
  }
  const meta = [vertical ? '' : formatEventDate(e.date, e.time), e.category]
    .filter(Boolean)
    .join(' · ');
  if (meta) {
    out.push(
      text(
        x,
        y,
        wrapText(meta, cols, 1)[0] ?? '',
        'font-size="11" fill="#4b5563"',
      ),
    );
    y += 15;
  }
  const room = Math.max(0, Math.floor((p.cardY + p.cardH - 8 - (y - 11)) / 14));
  for (const l of wrapText(e.description, cols, room)) {
    out.push(text(x, y, l, 'font-size="11" fill="#374151"'));
    y += 14;
  }
  return out.join('');
}

/** Complete standalone SVG document for the timeline. */
export const timelineSvg = (state: TLState): string =>
  renderTimeline(state).svg;

/** The SVG plus its pixel size (needed to rasterise it for PNG export). */
export function renderTimeline(state: TLState): {
  svg: string;
  width: number;
  height: number;
} {
  const { sorted } = sortEvents(state.events);
  const vertical = state.view === 'vertical';
  const L = vertical
    ? layoutVertical(sorted)
    : layoutHorizontal(sorted, state.spacing);
  const title = state.title.trim() || 'Timeline';
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" font-family="${escapeXml(FONT)}" role="img" aria-label="${escapeXml(`${title}: ${sorted.length} event${sorted.length === 1 ? '' : 's'}`)}">`,
    `<title>${escapeXml(title)}</title>`,
    `<rect width="${L.width}" height="${L.height}" fill="#ffffff"/>`,
    text(
      H.margin,
      38,
      wrapText(title, Math.floor((L.width - 2 * H.margin) / 11), 1)[0] ?? '',
      'font-size="20" font-weight="700" fill="#111827"',
    ),
    `<line x1="${L.axis.x1}" y1="${L.axis.y1}" x2="${L.axis.x2}" y2="${L.axis.y2}" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>`,
  ];
  if (!sorted.length)
    parts.push(
      text(
        L.width / 2,
        L.axis.y1 + (vertical ? 50 : -16),
        'No events with a valid date yet',
        'font-size="13" fill="#6b7280" text-anchor="middle"',
      ),
    );
  for (const p of L.items) {
    const color = safeColor(p.event.color);
    if (vertical) {
      parts.push(
        `<line x1="${p.x}" y1="${p.y}" x2="${p.cardX}" y2="${p.y}" stroke="${color}" stroke-width="1.5"/>`,
        text(
          p.x - 16,
          p.y + 4,
          formatEventDate(p.event.date, p.event.time),
          'font-size="12" font-weight="600" fill="#374151" text-anchor="end"',
        ),
      );
    } else {
      const edge = p.side === 'above' ? p.cardY + p.cardH : p.cardY;
      parts.push(
        `<line x1="${p.x}" y1="${p.y}" x2="${p.x}" y2="${edge}" stroke="${color}" stroke-width="1.5"/>`,
      );
    }
  }
  // Cards after stems so stems of outer lanes pass behind inner cards.
  for (const p of L.items) parts.push(card(p, vertical));
  for (const p of L.items)
    parts.push(
      `<circle cx="${p.x}" cy="${p.y}" r="6" fill="${safeColor(p.event.color)}" stroke="#ffffff" stroke-width="2"/>`,
    );
  parts.push('</svg>');
  return { svg: parts.join(''), width: L.width, height: L.height };
}

// ------------------------------------------------------------- validate

const isEvent = (v: unknown): v is TLEvent =>
  isObj(v) &&
  isId(v.id) &&
  isStr(v.title, TL_LIMITS.title) &&
  isStr(v.date, 20) &&
  isStr(v.time, 10) &&
  isStr(v.description, TL_LIMITS.description) &&
  isStr(v.category, TL_LIMITS.category) &&
  isStr(v.color, 7) &&
  isHex(v.color);

export function isTimelineState(v: unknown): v is TLState {
  return (
    isObj(v) &&
    v.version === 1 &&
    isStr(v.title, TL_LIMITS.title) &&
    (v.view === 'horizontal' || v.view === 'vertical') &&
    (v.spacing === 'proportional' || v.spacing === 'even') &&
    isArrayOf(v.events, isEvent, TL_LIMITS.events) &&
    uniqueIds(v.events)
  );
}

export const SAMPLE_TIMELINE: TLState = {
  version: 1,
  title: 'Product launch 2025',
  view: 'horizontal',
  spacing: 'proportional',
  events: [
    {
      id: 's1',
      title: 'Kick-off',
      date: '2025-01-13',
      time: '',
      description: 'Team agrees on scope, goals and the launch date.',
      category: 'Planning',
      color: '#6366f1',
    },
    {
      id: 's2',
      title: 'Design sign-off',
      date: '2025-02-28',
      time: '',
      description: 'Final screens approved after two rounds of user tests.',
      category: 'Design',
      color: '#ec4899',
    },
    {
      id: 's3',
      title: 'Beta release',
      date: '2025-04-07',
      time: '09:00',
      description: 'First 200 testers get access & send feedback.',
      category: 'Engineering',
      color: '#0ea5e9',
    },
    {
      id: 's4',
      title: 'Press briefing',
      date: '2025-05-20',
      time: '',
      description: 'Embargoed demo for journalists.',
      category: 'Marketing',
      color: '#f59e0b',
    },
    {
      id: 's5',
      title: 'Public launch',
      date: '2025-06-02',
      time: '10:00',
      description: 'Available to everyone. Launch post goes live.',
      category: 'Milestone',
      color: '#10b981',
    },
  ],
};

export const emptyTimeline = (): TLState => ({
  version: 1,
  title: 'My timeline',
  view: 'horizontal',
  spacing: 'proportional',
  events: [],
});
