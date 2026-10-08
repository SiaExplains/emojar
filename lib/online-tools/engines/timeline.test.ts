import { describe, expect, it } from 'vitest';
import {
  H,
  SAMPLE_TIMELINE,
  canMove,
  escapeXml,
  eventError,
  eventTime,
  formatEventDate,
  isTimelineState,
  layoutHorizontal,
  layoutVertical,
  moveEvent,
  sortEvents,
  timelineSvg,
  wrapText,
  type TLEvent,
  type TLState,
} from './timeline';

const ev = (id: string, date: string, time = '', title = id): TLEvent => ({
  id,
  title,
  date,
  time,
  description: '',
  category: '',
  color: '#6366f1',
});

describe('dates and sorting', () => {
  it('parses dates and times, rejecting impossible ones', () => {
    expect(eventTime('2024-02-29', '')).toBe(Date.UTC(2024, 1, 29));
    expect(eventTime('2024-02-29', '13:05')).toBe(Date.UTC(2024, 1, 29, 13, 5));
    expect(eventTime('2023-02-29', '')).toBeNull();
    expect(eventTime('2024-13-01', '')).toBeNull();
    expect(eventTime('2024-01-01', '25:00')).toBeNull();
    expect(eventTime('', '')).toBeNull();
    // Years below 100 are not shifted into the 1900s.
    expect(new Date(eventTime('0044-03-15', '') ?? 0).getUTCFullYear()).toBe(
      44,
    );
    expect(eventError(ev('x', '2024-02-30'))).toMatch(/valid date/);
    expect(eventError(ev('x', '2024-02-03'))).toBeNull();
  });

  it('sorts by date then time, keeps list order for equal moments, separates invalid', () => {
    const events = [
      ev('c', '2024-05-01'),
      ev('bad', 'not a date'),
      ev('a', '2024-01-01', '12:00'),
      ev('b', '2024-01-01', '09:00'),
      ev('d', '2024-05-01'),
    ];
    const { sorted, invalid } = sortEvents(events);
    expect(sorted.map((e) => e.id)).toEqual(['b', 'a', 'c', 'd']);
    expect(invalid.map((e) => e.id)).toEqual(['bad']);
    expect(sortEvents([])).toEqual({ sorted: [], invalid: [] });
  });

  it('reorders only events at the same moment', () => {
    const events = [
      ev('a', '2024-01-01'),
      ev('b', '2024-01-01'),
      ev('c', '2024-02-01'),
    ];
    expect(canMove(events, 'b', -1)).toBe(true);
    expect(canMove(events, 'b', 1)).toBe(false);
    expect(canMove(events, 'a', -1)).toBe(false);
    expect(
      sortEvents(moveEvent(events, 'b', -1)).sorted.map((e) => e.id),
    ).toEqual(['b', 'a', 'c']);
    expect(moveEvent(events, 'c', -1)).toBe(events);
  });

  it('formats dates in fixed English', () => {
    expect(formatEventDate('2025-03-05', '14:30')).toBe('5 Mar 2025, 14:30');
    expect(formatEventDate('2025-12-31', '')).toBe('31 Dec 2025');
    expect(formatEventDate('oops', '')).toBe('oops');
  });
});

describe('layout', () => {
  it('places dots proportionally to time', () => {
    const L = layoutHorizontal(
      [ev('a', '2024-01-01'), ev('b', '2024-01-11'), ev('c', '2024-01-31')],
      'proportional',
    );
    const [a, b, c] = L.items.map((i) => i.x);
    expect((b - a) / (c - a)).toBeCloseTo(10 / 30, 10);
    expect(a).toBe(H.margin + H.cardW / 2);
    expect(L.width).toBe(Math.ceil(c + H.margin + H.cardW / 2));
  });

  it('spaces evenly and alternates sides without overlaps', () => {
    const items = layoutHorizontal(
      ['01', '02', '03', '20'].map((d) => ev(d, `2024-01-${d}`)),
      'even',
    ).items;
    const gaps = items.slice(1).map((p, i) => p.x - items[i].x);
    expect(new Set(gaps.map((g) => g.toFixed(6))).size).toBe(1);
    expect(items.map((p) => p.side)).toEqual([
      'above',
      'below',
      'above',
      'below',
    ]);
    expect(items.every((p) => p.lane === 0)).toBe(true);
  });

  it('stacks crowded proportional events into extra lanes', () => {
    const items = layoutHorizontal(
      [
        ev('a', '2024-01-01'),
        ev('b', '2024-01-01'),
        ev('c', '2024-01-02'),
        ev('z', '2030-01-01'),
      ],
      'proportional',
    ).items;
    expect(items.slice(0, 3).map((p) => [p.side, p.lane])).toEqual([
      ['above', 0],
      ['below', 0],
      ['above', 1],
    ]);
    // No two cards on the same side and lane overlap horizontally.
    for (const p of items)
      for (const q of items)
        if (p !== q && p.side === q.side && p.lane === q.lane)
          expect(Math.abs(p.x - q.x)).toBeGreaterThanOrEqual(H.cardW);
  });

  it('handles one event and the vertical view', () => {
    expect(
      layoutHorizontal([ev('a', '2024-01-01')], 'proportional').items[0].x,
    ).toBeGreaterThan(0);
    const V = layoutVertical([ev('a', '2024-01-01'), ev('b', '2024-02-01')]);
    expect(V.items[1].cardY - V.items[0].cardY).toBeGreaterThan(
      V.items[0].cardH,
    );
  });
});

describe('SVG output', () => {
  it('escapes user text', () => {
    expect(escapeXml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/a&gt;',
    );
    expect(escapeXml('a\u0000b\u0007c')).toBe('abc');
    const state: TLState = {
      ...SAMPLE_TIMELINE,
      title: 'Q1 <script>alert(1)</script> & "co"',
      events: [
        {
          ...ev('x', '2024-01-01', '', '<b>bold</b>'),
          category: 'R&D',
          color: '"/><script>',
        },
      ],
    };
    const svg = timelineSvg(state);
    expect(svg).not.toContain('<script>');
    expect(svg).not.toContain('<b>');
    expect(svg).toContain('&lt;b&gt;bold&lt;/b&gt;');
    expect(svg).toContain('R&amp;D');
    expect(svg).toContain('&quot;co&quot;');
    // An invalid colour falls back to the default instead of being inserted.
    expect(svg).toContain('#6366f1');
  });

  it('produces a standalone SVG for every view and for no events', () => {
    for (const view of ['horizontal', 'vertical'] as const) {
      const svg = timelineSvg({ ...SAMPLE_TIMELINE, view });
      expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(
        true,
      );
      expect(svg.endsWith('</svg>')).toBe(true);
      expect(svg).toContain('Public launch');
    }
    expect(timelineSvg({ ...SAMPLE_TIMELINE, events: [] })).toContain(
      'No events',
    );
  });

  it('wraps text with an ellipsis when it overflows', () => {
    expect(wrapText('one two three four', 9, 2)).toEqual(['one two', 'three…']);
    expect(wrapText('short', 20, 3)).toEqual(['short']);
    expect(wrapText('abcdefghij', 4, 2)).toEqual(['abcd', 'efg…']);
    expect(wrapText('', 10, 2)).toEqual([]);
    expect(wrapText('anything', 10, 0)).toEqual([]);
  });
});

describe('validation', () => {
  it('accepts the sample and keeps invalid dates, but rejects bad shapes', () => {
    expect(isTimelineState(SAMPLE_TIMELINE)).toBe(true);
    expect(
      isTimelineState({ ...SAMPLE_TIMELINE, events: [ev('a', 'garbage')] }),
    ).toBe(true);
    expect(isTimelineState({ ...SAMPLE_TIMELINE, view: 'diagonal' })).toBe(
      false,
    );
    expect(
      isTimelineState({
        ...SAMPLE_TIMELINE,
        events: [{ ...ev('a', '2024-01-01'), color: 'red' }],
      }),
    ).toBe(false);
    expect(
      isTimelineState({
        ...SAMPLE_TIMELINE,
        events: [ev('a', '2024-01-01'), ev('a', '2024-01-02')],
      }),
    ).toBe(false);
    expect(isTimelineState([])).toBe(false);
  });
});
