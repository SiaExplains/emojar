'use client';

import { useState, useCallback, useEffect } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

type EmojiEvent = {
  id: string;
  name: string;
  icon: string;
  month: number;
  day: number;
  emojis: string[];
  description: string;
  accentColor: string;
};

const EVENTS: EmojiEvent[] = [
  {
    id: 'new-years-day',
    name: "New Year's Day",
    icon: '🎆',
    month: 1,
    day: 1,
    emojis: ['🎆', '🎉', '🥂', '🎊', '✨', '🕛', '🍾', '🪅', '🌟', '🎇'],
    description:
      'Kick off the new year with fireworks, champagne, and confetti.',
    accentColor: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'lunar-new-year',
    name: 'Lunar New Year',
    icon: '🧧',
    month: 1,
    day: 29,
    emojis: ['🧧', '🐉', '🏮', '🎆', '🎊', '🥟', '🍜', '🌸', '🎑', '🦁'],
    description:
      'Celebrate the lunar calendar new year with red envelopes, lanterns, dragon dances, and feasts.',
    accentColor: 'bg-red-50 border-red-200',
  },
  {
    id: 'valentines-day',
    name: "Valentine's Day",
    icon: '💝',
    month: 2,
    day: 14,
    emojis: ['💝', '❤️', '🌹', '💕', '💌', '💐', '🍫', '💑', '😍', '🫶'],
    description:
      'Share love and affection with hearts, roses, chocolates, and sweet messages.',
    accentColor: 'bg-pink-50 border-pink-200',
  },
  {
    id: 'st-patricks-day',
    name: "St. Patrick's Day",
    icon: '☘️',
    month: 3,
    day: 17,
    emojis: ['☘️', '🍀', '🌈', '🍺', '🎩', '🪄', '🟢', '🐍', '🎶', '🏴󠁧󠁢󠁩󠁥󠁿'],
    description:
      'Go green for St. Patrick with shamrocks, rainbows, and a pint of something cold.',
    accentColor: 'bg-green-50 border-green-200',
  },
  {
    id: 'easter',
    name: 'Easter',
    icon: '🐣',
    month: 4,
    day: 5,
    emojis: ['🐣', '🐰', '🥚', '🌸', '🐤', '🌷', '🍫', '🧺', '🦋', '🌼'],
    description:
      'Celebrate spring with Easter eggs, baby chicks, flowers, and chocolate bunnies.',
    accentColor: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    icon: '💐',
    month: 5,
    day: 10,
    emojis: ['💐', '👩‍👧‍👦', '🌷', '💝', '🫶', '🍰', '❤️', '🌸', '🎁', '☕'],
    description:
      'Honour the mums with flowers, hugs, breakfast in bed, and heartfelt messages.',
    accentColor: 'bg-rose-50 border-rose-200',
  },
  {
    id: 'fathers-day',
    name: "Father's Day",
    icon: '👨‍👧‍👦',
    month: 6,
    day: 21,
    emojis: ['👨‍👧‍👦', '🏆', '💪', '🎁', '⚽', '🍖', '🔧', '🎣', '🪚', '👔'],
    description:
      'Celebrate dads with BBQs, trophies, tools, and a round of their favourite sport.',
    accentColor: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    icon: '🇺🇸',
    month: 7,
    day: 4,
    emojis: ['🇺🇸', '🎆', '🎇', '🦅', '🌟', '🔴', '⚪', '🔵', '🧨', '🍔'],
    description:
      'Stars, stripes, and fireworks — the Fourth of July in emoji form.',
    accentColor: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'back-to-school',
    name: 'Back to School',
    icon: '🎒',
    month: 9,
    day: 1,
    emojis: ['🎒', '📚', '✏️', '📐', '🏫', '📏', '🖊️', '📓', '🔬', '🖥️'],
    description:
      'New notebooks, sharpened pencils, and full backpacks — the school year begins.',
    accentColor: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    icon: '🪔',
    month: 10,
    day: 20,
    emojis: ['🪔', '✨', '🎆', '💡', '🎊', '🌸', '🍬', '🎇', '🌟', '🎁'],
    description:
      'The festival of lights — celebrate with diyas, fireworks, sweets, and colours.',
    accentColor: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    icon: '🎃',
    month: 10,
    day: 31,
    emojis: ['🎃', '👻', '🕷️', '🦇', '🕸️', '🍬', '🔮', '💀', '🧙', '🌙'],
    description:
      'Trick or treat — jack-o-lanterns, ghosts, spiders, and candy galore.',
    accentColor: 'bg-orange-50 border-orange-200',
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    icon: '🦃',
    month: 11,
    day: 26,
    emojis: ['🦃', '🍂', '🍁', '🌽', '🥧', '🥗', '🍠', '🫕', '🙏', '🏡'],
    description:
      'Gratitude, family, and a table full of autumn harvest dishes.',
    accentColor: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'hanukkah',
    name: 'Hanukkah',
    icon: '🕎',
    month: 12,
    day: 4,
    emojis: ['🕎', '✡️', '🕯️', '🪔', '🌟', '🍩', '🎁', '💛', '🔵', '⚪'],
    description:
      'Eight nights of candles, latkes, dreidels, and gifts for the festival of lights.',
    accentColor: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    icon: '🎄',
    month: 12,
    day: 25,
    emojis: ['🎄', '🎅', '🦌', '⭐', '🎁', '❄️', '⛄', '🔔', '🕯️', '🦌'],
    description:
      'Twinkling trees, Santa, reindeer, presents, and festive cheer around the world.',
    accentColor: 'bg-green-50 border-green-200',
  },
  {
    id: 'new-years-eve',
    name: "New Year's Eve",
    icon: '🥂',
    month: 12,
    day: 31,
    emojis: ['🥂', '🎆', '🎉', '🎊', '✨', '🕛', '🌃', '🎇', '🍾', '🥳'],
    description:
      'Count down to midnight with champagne, fireworks, and friends.',
    accentColor: 'bg-yellow-50 border-yellow-200',
  },
];

function getDayOfYear(month: number, day: number): number {
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let d = day;
  for (let m = 1; m < month; m++) {
    d += daysInMonth[m];
    if (m === 2 && isLeap(new Date().getFullYear())) d += 1;
  }
  return d;
}

function classifyEvents() {
  const now = new Date();
  const todayDoy = getDayOfYear(now.getMonth() + 1, now.getDate());

  const withDoy = EVENTS.map((e) => ({
    ...e,
    doy: getDayOfYear(e.month, e.day),
  }));

  let currentEvent: (typeof withDoy)[0] | null = null;
  let nextEvent: (typeof withDoy)[0] | null = null;

  for (const e of withDoy) {
    if (Math.abs(e.doy - todayDoy) <= 7) {
      currentEvent = e;
      break;
    }
  }

  for (const e of withDoy) {
    if (e.doy > todayDoy) {
      nextEvent = e;
      break;
    }
  }

  if (!nextEvent) {
    nextEvent = withDoy[0];
  }

  return { currentEvent, nextEvent };
}

function formatEventDate(month: number, day: number): string {
  return new Date(2026, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
}

export default function EmojiEventsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isCurrentEvent, setIsCurrentEvent] = useState(false);

  useEffect(() => {
    const { currentEvent, nextEvent } = classifyEvents();
    setHighlightId(currentEvent?.id ?? nextEvent?.id ?? null);
    setIsCurrentEvent(!!currentEvent);
  }, []);

  const copyEmoji = useCallback((char: string) => {
    navigator.clipboard.writeText(char).then(() => {
      setCopied(char);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  const copyAll = useCallback((event: EmojiEvent) => {
    const str = event.emojis.join(' ');
    navigator.clipboard.writeText(str).then(() => {
      setCopiedAll(event.id);
      setTimeout(() => setCopiedAll(null), 1500);
    });
  }, []);

  const highlightedEvent = EVENTS.find((e) => e.id === highlightId);
  const highlightLabel = isCurrentEvent
    ? '🎉 Happening Now'
    : '📅 Coming Up Next';

  return (
    <div className="space-y-10 py-6">
      <Breadcrumb
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Emoji Events', href: '/emoji-collections/events' },
        ]}
      />

      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Emoji Collections: Events &amp; Holidays
        </h1>
        <p className="text-gray-500">
          Themed emoji packs for every major holiday and event. Click any emoji
          to copy it, or grab the whole pack at once.
        </p>
      </div>

      {/* Highlighted event banner */}
      {highlightedEvent && (
        <div
          className={`rounded-2xl border-2 p-6 ${highlightedEvent.accentColor}`}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
            {highlightLabel}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <span className="text-5xl">{highlightedEvent.icon}</span>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{highlightedEvent.name}</h2>
                <p className="text-sm text-gray-500">
                  {formatEventDate(
                    highlightedEvent.month,
                    highlightedEvent.day,
                  )}
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                {highlightedEvent.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {highlightedEvent.emojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => copyEmoji(emoji)}
                    title={`Copy ${emoji}`}
                    className="text-3xl rounded-xl bg-white border border-gray-200 p-2 hover:scale-110 hover:shadow-md transition-all active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => copyAll(highlightedEvent)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                {copiedAll === highlightedEvent.id
                  ? '✅ Copied!'
                  : '📋 Copy All Emojis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All events grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EVENTS.map((event) => {
            const isHighlighted = event.id === highlightId;
            return (
              <div
                key={event.id}
                id={event.id}
                className={`rounded-xl border p-5 space-y-3 transition-shadow hover:shadow-md ${
                  isHighlighted
                    ? `${event.accentColor} border-2`
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{event.icon}</span>
                  <div>
                    <h3 className="font-semibold leading-tight">
                      {event.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatEventDate(event.month, event.day)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {event.emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => copyEmoji(emoji)}
                      title={`Copy ${emoji}`}
                      className="text-2xl rounded-lg bg-gray-50 border border-gray-100 p-1.5 hover:scale-110 hover:shadow-sm transition-all active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => copyAll(event)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {copiedAll === event.id ? '✅ Copied!' : '📋 Copy all'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-lg text-sm z-50">
          Copied {copied}!
        </div>
      )}
    </div>
  );
}
