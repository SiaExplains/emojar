'use client';

import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';
import COUNTRIES from '@/lib/online-tools/data/countries.json';
import type { ToolProps } from '../ToolRenderer';
import { btnPrimary, btnSecondary } from '../ui';
import {
  Chips,
  CopyChip,
  DetailDialog,
  EmptyState,
  Fact,
  SearchBox,
  SelectChip,
} from './ReferenceUI';

export type Country = {
  a2: string;
  a3: string;
  num: string;
  n: string;
  cap: string;
  ct: string;
  rg: string;
  cur: string;
  curN: string;
  lang: string[];
  tel: string;
  tld: string;
  tz: string[];
  drive: 'left' | 'right';
  pop: number;
  area: number;
  lat: number | null;
  lon: number | null;
};

export const ALL_COUNTRIES = (COUNTRIES as Country[])
  .slice()
  .sort((a, b) => a.n.localeCompare(b.n));

/**
 * True when this device draws flag emoji. Windows has no flag glyphs and
 * shows the two regional-indicator letters in plain text colour instead, so
 * we draw one flag and look for coloured pixels.
 */
export function supportsFlagEmoji(): boolean {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return true;
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.font = '28px sans-serif';
    ctx.fillText('\u{1F1E9}\u{1F1EA}', 0, 0);
    const d = ctx.getImageData(0, 0, 32, 32).data;
    for (let i = 0; i < d.length; i += 4)
      if (
        d[i + 3] > 0 &&
        (Math.abs(d[i] - d[i + 1]) > 30 || Math.abs(d[i + 1] - d[i + 2]) > 30)
      )
        return true;
    return false;
  } catch {
    return true;
  }
}

/** Flag emoji from regional-indicator letters (shows as letters on Windows). */
export const flagOf = (a2: string) =>
  String.fromCodePoint(
    ...[...a2.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );

const uniq = (xs: string[]) =>
  [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b));
const CONTINENTS = uniq(ALL_COUNTRIES.map((c) => c.ct));
const REGIONS = uniq(ALL_COUNTRIES.map((c) => c.rg));
const CURRENCIES = uniq(ALL_COUNTRIES.map((c) => c.cur));
const LANGUAGES = uniq(ALL_COUNTRIES.flatMap((c) => c.lang));

function coords(c: Country) {
  if (c.lat === null || c.lon === null) return '';
  const ns = c.lat >= 0 ? 'N' : 'S';
  const ew = c.lon >= 0 ? 'E' : 'W';
  return `${Math.abs(c.lat).toFixed(2)}° ${ns}, ${Math.abs(c.lon).toFixed(2)}° ${ew}`;
}

function searchCountries(q: string, list: Country[]) {
  const s = q.trim().toLowerCase();
  if (!s) return list;
  const digits = s.replace(/[^\d]/g, '');
  return list.filter(
    (c) =>
      c.n.toLowerCase().includes(s) ||
      c.cap.toLowerCase().includes(s) ||
      c.a2.toLowerCase() === s ||
      c.a3.toLowerCase() === s ||
      c.cur.toLowerCase() === s ||
      c.curN.toLowerCase().includes(s) ||
      c.tld === (s.startsWith('.') ? s : `.${s}`) ||
      (/^\+?\d[\d\s]*$/.test(s) && c.tel.replace(/\D/g, '') === digits),
  );
}

export function CountryDetails({ c }: { c: Country }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <CopyChip label="ISO alpha-2" value={c.a2} />
        <CopyChip label="ISO alpha-3" value={c.a3} />
        <CopyChip label="Calling code" value={c.tel} />
        <CopyChip label="Currency code" value={c.cur} />
        <CopyChip label="Internet TLD" value={c.tld} />
        <CopyChip label="Flag emoji" value={flagOf(c.a2)} mono={false} />
      </div>
      <dl>
        <Fact label="Capital" value={c.cap || '—'} />
        <Fact label="Continent" value={c.ct} />
        <Fact label="Region" value={c.rg} />
        <Fact label="ISO 3166-1 numeric" value={c.num} />
        <Fact label="Currency" value={c.cur ? `${c.curN} (${c.cur})` : '—'} />
        <Fact label="Languages" value={c.lang.join(', ') || '—'} />
        <Fact label="Calling code" value={c.tel || '—'} />
        <Fact label="Internet TLD" value={c.tld || '—'} />
        <Fact label="Drives on the" value={`${c.drive} side`} />
        <Fact
          label="Population (approx.)"
          value={
            c.pop ? c.pop.toLocaleString('en-US') : 'Uninhabited or unknown'
          }
        />
        <Fact
          label="Area"
          value={c.area ? `${c.area.toLocaleString('en-US')} km²` : '—'}
        />
        <Fact label="Coordinates (centre)" value={coords(c)} />
        <Fact
          label={`Time zone${c.tz.length === 1 ? '' : 's'}`}
          value={
            c.tz.length > 6
              ? `${c.tz.slice(0, 6).join(', ')} and ${c.tz.length - 6} more`
              : c.tz.join(', ') || '—'
          }
        />
      </dl>
      <p className="text-xs text-gray-500">
        See the time there on the{' '}
        <Link
          className="text-indigo-600 underline underline-offset-2"
          href="/online-tool/date-time-tools/world-time-zone-map"
        >
          world time zone map
        </Link>
        . Data: GeoNames (CC BY 4.0), Natural Earth and the IANA time zone
        database.
      </p>
    </div>
  );
}

function DialogTitle({ c }: { c: Country }) {
  return (
    <span className="flex items-center gap-3">
      <span className="text-4xl leading-none" aria-hidden>
        {flagOf(c.a2)}
      </span>
      <span>
        {c.n}
        <span className="block text-sm font-normal text-gray-500">
          {c.a2} · {c.ct}
        </span>
      </span>
    </span>
  );
}

// ── Country explorer ───────────────────────────────────────────────────────

export function CountryExplorerTool(_: ToolProps) {
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState('');
  const [region, setRegion] = useState('');
  const [currency, setCurrency] = useState('');
  const [language, setLanguage] = useState('');
  const [drive, setDrive] = useState('');
  const [selected, setSelected] = useState<Country | null>(null);
  const q = useDeferredValue(query);

  const list = useMemo(
    () =>
      searchCountries(
        q,
        ALL_COUNTRIES.filter(
          (c) =>
            (!continent || c.ct === continent) &&
            (!region || c.rg === region) &&
            (!currency || c.cur === currency) &&
            (!language || c.lang.includes(language)) &&
            (!drive || c.drive === drive),
        ),
      ),
    [q, continent, region, currency, language, drive],
  );
  const filtered =
    continent || region || currency || language || drive || q.trim();
  const opts = (xs: string[]) => [
    { value: '', label: 'All' },
    ...xs.map((x) => ({ value: x, label: x })),
  ];

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search countries"
        value={query}
        onChange={setQuery}
        placeholder="Name, capital, ISO code, currency or calling code — e.g. Japan, Paris, DE, EUR, +44"
        count={list.length}
        noun="country"
        plural="countries"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <SelectChip
          label="Continent"
          value={continent}
          onChange={setContinent}
          options={opts(CONTINENTS)}
        />
        <SelectChip
          label="Region"
          value={region}
          onChange={setRegion}
          options={opts(REGIONS)}
        />
        <SelectChip
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={[
            { value: '', label: 'All' },
            ...CURRENCIES.map((x) => ({ value: x, label: x })),
          ]}
        />
        <SelectChip
          label="Language"
          value={language}
          onChange={setLanguage}
          options={opts(LANGUAGES)}
        />
        <SelectChip
          label="Driving side"
          value={drive}
          onChange={setDrive}
          options={[
            { value: '', label: 'Both' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </div>
      {filtered && (
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setQuery('');
            setContinent('');
            setRegion('');
            setCurrency('');
            setLanguage('');
            setDrive('');
          }}
        >
          Reset filters
        </button>
      )}
      {list.length === 0 ? (
        <EmptyState>No country matches these filters.</EmptyState>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.a2}>
              <button
                type="button"
                onClick={() => setSelected(c)}
                className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {flagOf(c.a2)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-gray-900">
                    {c.n}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {c.a2} · {c.cap || 'No capital'} · {c.cur || '—'} ·{' '}
                    {c.tel || '—'}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected && <DialogTitle c={selected} />}
      >
        {selected && <CountryDetails c={selected} />}
      </DetailDialog>
    </div>
  );
}

// ── Flag explorer ──────────────────────────────────────────────────────────

type Quiz = {
  order: Country[];
  i: number;
  score: number;
  options: Country[];
  picked: string | null;
};

function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function optionsFor(answer: Country, pool: Country[]) {
  const others = shuffle(pool.filter((c) => c.a2 !== answer.a2)).slice(0, 3);
  return shuffle([answer, ...others]);
}

export function FlagExplorerTool(_: ToolProps) {
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState('');
  const [region, setRegion] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Country | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [flags] = useState(supportsFlagEmoji);
  const q = useDeferredValue(query);

  const pool = useMemo(
    () =>
      ALL_COUNTRIES.filter(
        (c) =>
          (!continent || c.ct === continent) && (!region || c.rg === region),
      ),
    [continent, region],
  );
  const list = useMemo(() => searchCountries(q, pool), [q, pool]);
  const regionOptions = uniq(
    ALL_COUNTRIES.filter((c) => !continent || c.ct === continent).map(
      (c) => c.rg,
    ),
  );

  const startQuiz = () => {
    const quizPool = pool.length >= 4 ? pool : ALL_COUNTRIES;
    const order = shuffle(quizPool).slice(0, 10);
    setQuiz({
      order,
      i: 0,
      score: 0,
      options: optionsFor(order[0], quizPool),
      picked: null,
    });
  };

  if (quiz) {
    const quizPool = pool.length >= 4 ? pool : ALL_COUNTRIES;
    const done = quiz.i >= quiz.order.length;
    const answer = quiz.order[quiz.i];
    return (
      <div className="mx-auto max-w-md space-y-5 text-center">
        <p className="text-sm text-gray-500" aria-live="polite">
          {done
            ? 'Finished!'
            : `Question ${quiz.i + 1} of ${quiz.order.length}`}{' '}
          · Score {quiz.score}
        </p>
        {done ? (
          <div className="space-y-4">
            <p className="text-2xl font-semibold text-gray-900">
              {quiz.score} / {quiz.order.length} correct
            </p>
            <div className="flex justify-center gap-2">
              <button type="button" className={btnPrimary} onClick={startQuiz}>
                Play again
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setQuiz(null)}
              >
                Back to the flags
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Want more? Try the{' '}
              <Link
                className="text-indigo-600 underline underline-offset-2"
                href="/games/guess-the-flag"
              >
                Guess the Flag game
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div
              className="text-8xl leading-none"
              role="img"
              aria-label="Flag to identify"
            >
              {flagOf(answer.a2)}
            </div>
            <ul className="grid gap-2">
              {quiz.options.map((o) => {
                const state =
                  quiz.picked === null
                    ? ''
                    : o.a2 === answer.a2
                      ? 'border-emerald-400 bg-emerald-50'
                      : o.a2 === quiz.picked
                        ? 'border-red-300 bg-red-50'
                        : 'opacity-60';
                return (
                  <li key={o.a2}>
                    <button
                      type="button"
                      disabled={quiz.picked !== null}
                      onClick={() =>
                        setQuiz({
                          ...quiz,
                          picked: o.a2,
                          score: quiz.score + (o.a2 === answer.a2 ? 1 : 0),
                        })
                      }
                      className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${state}`}
                    >
                      {o.n}
                      {quiz.picked !== null && o.a2 === answer.a2 && ' ✓'}
                      {quiz.picked === o.a2 && o.a2 !== answer.a2 && ' ✗'}
                    </button>
                  </li>
                );
              })}
            </ul>
            {quiz.picked !== null && (
              <div className="space-y-2">
                <p className="text-sm text-gray-700" aria-live="polite">
                  {quiz.picked === answer.a2 ? 'Correct!' : `It’s ${answer.n}.`}{' '}
                  Capital: {answer.cap || '—'}.
                </p>
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => {
                    const i = quiz.i + 1;
                    setQuiz({
                      ...quiz,
                      i,
                      picked: null,
                      options:
                        i < quiz.order.length
                          ? optionsFor(quiz.order[i], quizPool)
                          : [],
                    });
                  }}
                >
                  {quiz.i + 1 < quiz.order.length ? 'Next flag →' : 'See score'}
                </button>
              </div>
            )}
            <button
              type="button"
              className="text-xs text-gray-500 underline"
              onClick={() => setQuiz(null)}
            >
              Quit quiz
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchBox
        label="Search flags"
        value={query}
        onChange={setQuery}
        placeholder="Country, capital or ISO code — e.g. Brazil, Oslo, KR"
        count={list.length}
        noun="flag"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <SelectChip
          label="Continent"
          value={continent}
          onChange={(v) => {
            setContinent(v);
            setRegion('');
          }}
          options={[
            { value: '', label: 'All' },
            ...CONTINENTS.map((x) => ({ value: x, label: x })),
          ]}
        />
        <SelectChip
          label="Region"
          value={region}
          onChange={setRegion}
          options={[
            { value: '', label: 'All' },
            ...regionOptions.map((x) => ({ value: x, label: x })),
          ]}
        />
        <Chips
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: 'grid', label: '▦ Grid' },
            { value: 'list', label: '☰ Compact list' },
          ]}
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={startQuiz}
          disabled={!flags}
          title={flags ? undefined : 'Your system can’t display flag emoji'}
        >
          🎯 Quiz me
        </button>
      </div>
      {!flags && (
        <p className="text-sm text-amber-800">
          Your system shows flag emoji as two letters (Windows does this), so
          the quiz is turned off — the letters would give the answers away. The
          ISO codes are shown below instead.
        </p>
      )}
      {list.length === 0 ? (
        <EmptyState>No flag matches “{q}”.</EmptyState>
      ) : view === 'grid' ? (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
          {list.map((c) => (
            <li key={c.a2}>
              <button
                type="button"
                onClick={() => setSelected(c)}
                className="flex w-full flex-col items-center gap-1 rounded-2xl border border-gray-100 p-3 text-center transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {flags ? (
                  <span className="text-5xl leading-none" aria-hidden>
                    {flagOf(c.a2)}
                  </span>
                ) : (
                  <span
                    className="flex h-12 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 font-mono text-lg font-semibold text-gray-700"
                    aria-hidden
                  >
                    {c.a2}
                  </span>
                )}
                <span className="line-clamp-2 text-xs font-medium text-gray-900">
                  {c.n}
                </span>
                {flags && (
                  <span className="font-mono text-[10px] text-gray-500">
                    {c.a2}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">
              Flags with capitals, ISO codes and calling codes
            </caption>
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {[
                  'Flag',
                  'Country',
                  'Capital',
                  'ISO-2',
                  'ISO-3',
                  'Calling',
                  'Continent',
                ].map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.a2} className="border-t border-gray-100">
                  <td className="px-3 py-1.5 text-2xl" aria-hidden>
                    {flagOf(c.a2)}
                  </td>
                  <td className="px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="text-left font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      {c.n}
                    </button>
                  </td>
                  <td className="px-3 py-1.5 text-gray-700">{c.cap || '—'}</td>
                  <td className="px-3 py-1.5 font-mono">{c.a2}</td>
                  <td className="px-3 py-1.5 font-mono">{c.a3}</td>
                  <td className="px-3 py-1.5 tabular-nums">{c.tel || '—'}</td>
                  <td className="px-3 py-1.5 text-gray-700">{c.ct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Flags are shown as emoji. Windows doesn’t draw flag emoji and shows the
        two-letter country code instead — the ISO code is always listed too.
      </p>
      <DetailDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected && <DialogTitle c={selected} />}
      >
        {selected && <CountryDetails c={selected} />}
      </DetailDialog>
    </div>
  );
}
