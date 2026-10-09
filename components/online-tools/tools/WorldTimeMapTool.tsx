'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LAND_H, LAND_MASK, LAND_W } from '@/lib/online-tools/data/land-mask';
import { formatOffset, timeZoneOffset } from '@/lib/online-tools/engines/dates';
import {
  MAP_CITIES,
  isDst,
  placeLabels,
  observesDst,
  project,
  searchCities,
  subsolarPoint,
} from '@/lib/online-tools/engines/timezones';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, btnSecondary } from '../ui';
import { SearchBox } from './ReferenceUI';

const W = 720;
const H = 360;
const STORAGE_KEY = 'emojar-tzmap-v1';

type Place = {
  label: string;
  tz: string;
  cc?: string;
  lat?: number;
  lon?: number;
};

const DEFAULTS: Place[] = [
  ['London', 'GB'],
  ['New York City', 'US'],
  ['Tokyo', 'JP'],
].flatMap(([n, cc]) => {
  const c = MAP_CITIES.find((x) => x[0] === n && x[1] === cc);
  return c ? [{ label: c[0], cc: c[1], lat: c[2], lon: c[3], tz: c[4] }] : [];
});

// Land cells decoded once.
const LAND: { x: number; y: number; lat: number; lon: number }[] = (() => {
  const bin = typeof atob === 'function' ? atob(LAND_MASK) : '';
  const out: { x: number; y: number; lat: number; lon: number }[] = [];
  for (let i = 0; i < LAND_W * LAND_H; i++) {
    if (!((bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1)) continue;
    const r = Math.floor(i / LAND_W);
    const c = i % LAND_W;
    out.push({
      x: (c + 0.5) * (W / LAND_W),
      y: (r + 0.5) * (H / LAND_H),
      lat: 90 - (r + 0.5) * 2,
      lon: -180 + (c + 0.5) * 2,
    });
  }
  return out;
})();

/** Night-side polygon from the sun's position (terminator line). */
function nightPath(sun: { lat: number; lon: number }): string {
  const r = Math.PI / 180;
  const pts: string[] = [];
  const dec = Math.abs(sun.lat) < 0.01 ? 0.01 : sun.lat;
  for (let lon = -180; lon <= 180; lon += 2) {
    const lat =
      Math.atan(-Math.cos((lon - sun.lon) * r) / Math.tan(dec * r)) / r;
    const p = project(lat, lon, W, H);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  // Close over the pole that is in darkness.
  const edge = sun.lat > 0 ? H : 0;
  return `M0,${edge} L${pts.join(' L')} L${W},${edge} Z`;
}

/** Keeps only saved entries with a time zone this browser recognises. */
function isPlace(p: unknown): p is Place {
  if (!p || typeof p !== 'object') return false;
  const { tz, label } = p as Place;
  if (typeof tz !== 'string' || typeof label !== 'string') return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// Measures label text with the page font so placement uses real widths.
let measureCtx: CanvasRenderingContext2D | null = null;
function textWidth(text: string): number | undefined {
  try {
    measureCtx ??= document.createElement('canvas').getContext('2d');
    if (!measureCtx) return undefined;
    measureCtx.font = `600 11px ${getComputedStyle(document.body).fontFamily}`;
    return measureCtx.measureText(text).width;
  } catch {
    return undefined;
  }
}

const timeIn = (tz: string, at: Date, opts: Intl.DateTimeFormatOptions) =>
  at.toLocaleString('en-GB', { timeZone: tz, ...opts });

export default function WorldTimeMapTool(_: ToolProps) {
  const here = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    [],
  );
  const zones = useMemo(() => {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch {
      return [] as string[];
    }
  }, []);
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved))
        return saved.filter(isPlace).map((p) => ({
          label: p.label.slice(0, 80),
          tz: p.tz,
          cc: typeof p.cc === 'string' ? p.cc.slice(0, 2) : undefined,
          lat: Number.isFinite(p.lat) ? p.lat : undefined,
          lon: Number.isFinite(p.lon) ? p.lon : undefined,
        }));
    } catch {
      // Storage blocked — fall back to the defaults.
    }
    return DEFAULTS;
  });
  const [focus, setFocus] = useState<Place | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch {
      // Not persisted; the list still works for this visit.
    }
  }, [places]);

  // The shading only needs to move once a minute.
  const minute = Math.floor(now.getTime() / 60_000);
  const sun = useMemo(() => subsolarPoint(new Date(minute * 60_000)), [minute]);
  const night = useMemo(() => nightPath(sun), [sun]);

  const cityHits = useMemo(() => searchCities(query, 8), [query]);
  const zoneHits = useMemo(() => {
    const s = query.trim().toLowerCase().replace(/\s+/g, '_');
    if (s.length < 2) return [];
    return zones.filter((z) => z.toLowerCase().includes(s)).slice(0, 6);
  }, [query, zones]);

  const add = (p: Place) => {
    setPlaces((ps) =>
      ps.some((x) => x.tz === p.tz && x.label === p.label) ? ps : [...ps, p],
    );
    setFocus(p);
    setQuery('');
  };
  const remove = (p: Place) => setPlaces((ps) => ps.filter((x) => x !== p));

  const rows = [
    { label: `Your time (${here.replace(/_/g, ' ')})`, tz: here } as Place,
    ...places,
  ];
  const hereOffset = timeZoneOffset(now, here);
  const pins = MAP_CITIES.filter((c) => c[5] === 1).slice(0, 60);
  const table = rows
    .map(
      (p) =>
        `${p.label}\t${timeIn(p.tz, now, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}\t${formatOffset(timeZoneOffset(now, p.tz))}`,
    )
    .join('\n');

  return (
    <div className="space-y-5">
      <figure className="space-y-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-slate-50">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label={`World map with day and night. The sun is overhead near ${sun.lat.toFixed(0)}° latitude, ${sun.lon.toFixed(0)}° longitude.`}
          >
            {/* Nominal zones are centred on multiples of 15°, so UTC spans
                7.5°W–7.5°E and the ±12 bands are half-width at the edges. */}
            {Array.from({ length: 25 }, (_, i) => (
              <rect
                key={i}
                x={Math.max(0, ((i * 15 - 7.5) / 360) * W)}
                y={0}
                width={(i === 0 || i === 24 ? 7.5 / 360 : 15 / 360) * W}
                height={H}
                className={i % 2 ? 'fill-slate-100' : 'fill-white'}
              />
            ))}
            {LAND.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={1.5}
                className="fill-slate-400"
              />
            ))}
            <path d={night} className="fill-slate-900/25" />
            {pins.map((c) => {
              const p = project(c[2], c[3], W, H);
              return (
                <circle
                  key={`${c[0]}-${c[1]}`}
                  cx={p.x}
                  cy={p.y}
                  r={2.5}
                  className="cursor-pointer fill-brand-400 stroke-white"
                  strokeWidth={0.8}
                  onClick={() =>
                    add({
                      label: c[0],
                      cc: c[1],
                      lat: c[2],
                      lon: c[3],
                      tz: c[4],
                    })
                  }
                >
                  <title>{`${c[0]} — ${timeIn(c[4], now, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`}</title>
                </circle>
              );
            })}
            {(() => {
              // Focused city first so it always gets its label.
              const shown = places
                .map((pl, i) => ({ pl, i }))
                .filter(
                  ({ pl }) => pl.lat !== undefined && pl.lon !== undefined,
                )
                .sort(
                  (a, b) => Number(b.pl === focus) - Number(a.pl === focus),
                );
              const pts = shown.map(({ pl }) => {
                const p = project(pl.lat!, pl.lon!, W, H);
                const text = `${pl.label} ${timeIn(pl.tz, now, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`;
                return { ...p, text, width: textWidth(text) };
              });
              const placed = placeLabels(pts, W, H);
              return shown.map(({ pl, i }, k) => {
                const p = pts[k];
                const lab = placed[k];
                return (
                  <g key={`${pl.label}-${i}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={4.5}
                      className={
                        focus === pl ? 'fill-amber-500' : 'fill-brand-700'
                      }
                      stroke="white"
                      strokeWidth={1.5}
                    >
                      <title>{p.text}</title>
                    </circle>
                    {lab && (
                      <text
                        x={lab.x}
                        y={lab.y}
                        textAnchor={lab.anchor}
                        className="fill-gray-900 text-[11px] font-semibold"
                        style={{
                          paintOrder: 'stroke',
                          stroke: 'white',
                          strokeWidth: 3,
                        }}
                      >
                        {p.text}
                      </text>
                    )}
                  </g>
                );
              });
            })()}
            {(() => {
              const p = project(sun.lat, sun.lon, W, H);
              return (
                <text
                  x={p.x}
                  y={p.y + 5}
                  textAnchor="middle"
                  className="text-[14px]"
                  aria-hidden
                >
                  ☀
                </text>
              );
            })()}
            {Array.from({ length: 25 }, (_, i) => {
              const off = i - 12;
              if (off === -12 || off === 12) return null;
              return (
                <text
                  key={i}
                  x={((i * 15) / 360) * W}
                  y={H - 4}
                  textAnchor="middle"
                  className="fill-gray-400 text-[8px]"
                >
                  {off === 0 ? 'UTC' : off > 0 ? `+${off}` : off}
                </text>
              );
            })}
          </svg>
        </div>
        <figcaption className="text-xs text-gray-500">
          Shaded area = night right now. Stripes are the nominal 15° time bands;
          real time-zone borders follow countries. Click a blue dot to add a
          capital.
        </figcaption>
      </figure>

      <div className="relative">
        <SearchBox
          label="Add a city or time zone"
          value={query}
          onChange={setQuery}
          placeholder="Berlin, Sydney, Asia/Kolkata…"
        />
        {(cityHits.length > 0 || zoneHits.length > 0) && (
          <ul
            className="mt-1 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm"
            aria-label="Matching places"
          >
            {cityHits.map((c) => (
              <li key={`${c[0]}-${c[1]}-${c[4]}`}>
                <button
                  type="button"
                  onClick={() =>
                    add({
                      label: c[0],
                      cc: c[1],
                      lat: c[2],
                      lon: c[3],
                      tz: c[4],
                    })
                  }
                  className="flex w-full justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-brand-50 focus:bg-brand-50 focus:outline-none"
                >
                  <span>
                    {c[0]} <span className="text-gray-500">{c[1]}</span>
                  </span>
                  <span className="tabular-nums text-gray-500">
                    {timeIn(c[4], now, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23',
                    })}{' '}
                    · {formatOffset(timeZoneOffset(now, c[4]))}
                  </span>
                </button>
              </li>
            ))}
            {zoneHits.map((z) => (
              <li key={z}>
                <button
                  type="button"
                  onClick={() =>
                    add({
                      label: z.split('/').pop()!.replace(/_/g, ' '),
                      tz: z,
                    })
                  }
                  className="flex w-full justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-brand-50 focus:bg-brand-50 focus:outline-none"
                >
                  <span className="font-mono text-xs">{z}</span>
                  <span className="tabular-nums text-gray-500">
                    {formatOffset(timeZoneOffset(now, z))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full min-w-[38rem] text-left text-sm">
          <caption className="sr-only">Time comparison</caption>
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-3 py-2">
                Location
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                Local time
              </th>
              <th scope="col" className="px-3 py-2">
                Date
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                UTC
              </th>
              <th scope="col" className="px-3 py-2">
                Daylight saving
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                vs. you
              </th>
              <th scope="col" className="px-3 py-2">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const off = timeZoneOffset(now, p.tz);
              const diff = (off - hereOffset) / 60;
              const dst = isDst(p.tz, now);
              const hour = Number(
                timeIn(p.tz, now, { hour: '2-digit', hourCycle: 'h23' }),
              );
              return (
                <tr
                  key={`${p.label}-${i}`}
                  className="border-t border-gray-100"
                >
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium text-gray-900"
                  >
                    <button
                      type="button"
                      onClick={() => setFocus(p)}
                      className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <span aria-hidden>
                        {hour >= 6 && hour < 18 ? '☀️' : '🌙'}{' '}
                      </span>
                      {p.label}
                      {p.cc && (
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          {p.cc}
                        </span>
                      )}
                    </button>
                    <span className="block font-mono text-xs font-normal text-gray-400">
                      {p.tz}
                    </span>
                  </th>
                  <td className="px-3 py-2 text-right font-mono text-lg tabular-nums text-gray-900">
                    {timeIn(p.tz, now, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hourCycle: 'h23',
                    })}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {timeIn(p.tz, now, {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatOffset(off)}
                  </td>
                  <td className="px-3 py-2 text-gray-700">
                    {dst
                      ? 'Active (summer time)'
                      : observesDst(p.tz, now.getUTCFullYear())
                        ? 'Not active'
                        : 'Not observed'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-700">
                    {i === 0
                      ? '—'
                      : diff === 0
                        ? 'same'
                        : `${diff > 0 ? '+' : '−'}${Math.abs(diff)} h`}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        aria-label={`Remove ${p.label}`}
                        className="rounded-md px-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={table} label="Copy comparison" />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setPlaces(DEFAULTS)}
        >
          Reset cities
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Times come from your browser’s time-zone database, so daylight-saving
        changes are applied automatically. Need to convert a meeting time? Use
        the{' '}
        <Link
          className="text-brand-600 underline underline-offset-2"
          href="/online-tool/date-time-tools/timezone-converter"
        >
          time zone converter
        </Link>{' '}
        or the{' '}
        <Link
          className="text-brand-600 underline underline-offset-2"
          href="/online-tool/date-time-tools/world-clock"
        >
          world clock
        </Link>
        . City data: GeoNames (CC BY 4.0); map: Natural Earth.
      </p>
    </div>
  );
}
