'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  nearestNamedRatio,
  simplifyRatio,
} from '@/lib/online-tools/engines/calculators-more';
import {
  fpsFromFrameTimes,
  snapRefreshRate,
} from '@/lib/online-tools/engines/device';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton, btnSecondary } from '../ui';

type Info = {
  screenW: number;
  screenH: number;
  dpr: number;
  availW: number;
  availH: number;
  viewW: number;
  viewH: number;
  colorDepth: number;
  orientation: string;
  touchPoints: number;
  hdr: boolean;
  gamut: string;
  scheme: string;
};

const mq = (q: string) => window.matchMedia(q).matches;

function readInfo(): Info {
  const s = window.screen;
  return {
    screenW: s.width,
    screenH: s.height,
    dpr: window.devicePixelRatio || 1,
    availW: s.availWidth,
    availH: s.availHeight,
    viewW: window.innerWidth,
    viewH: window.innerHeight,
    colorDepth: s.colorDepth,
    orientation:
      s.orientation?.type
        ?.replace('-primary', '')
        .replace('-secondary', ' (flipped)') ??
      (s.width >= s.height ? 'landscape' : 'portrait'),
    touchPoints: navigator.maxTouchPoints || 0,
    hdr: mq('(dynamic-range: high)'),
    gamut: mq('(color-gamut: rec2020)')
      ? 'Rec. 2020'
      : mq('(color-gamut: p3)')
        ? 'Display P3'
        : 'sRGB',
    scheme: mq('(prefers-color-scheme: dark)') ? 'Dark' : 'Light',
  };
}

function ratioText(w: number, h: number) {
  if (!w || !h) return '—';
  const [a, b] = simplifyRatio(w, h);
  const r = w / h;
  const exact = a <= 64 && b <= 64 ? `${a}:${b}` : r.toFixed(2) + ':1';
  // Monitors sold as "21:9" range from 2.33 to 2.40 (2560×1080, 3440×1440).
  if (r >= 2.3 && r <= 2.42 && exact !== '21:9')
    return `${exact} (≈ 21:9 ultrawide)`;
  const named = nearestNamedRatio(r);
  return named.diff < 0.02 && !named.name.startsWith(exact)
    ? `${exact} (≈ ${named.name})`
    : exact;
}

const fmt = (n: number) => n.toLocaleString('en-US');

export default function ScreenInfoTool(_: ToolProps) {
  const [info, setInfo] = useState<Info | null>(null);
  const [hz, setHz] = useState<{ raw: number; snapped: number } | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const update = () => setInfo(readInfo());
    update();
    window.addEventListener('resize', update);
    screen.orientation?.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('resize', update);
      screen.orientation?.removeEventListener?.('change', update);
    };
  }, []);

  const stop = useRef<() => void>(() => {});
  const measure = useCallback(() => {
    stop.current();
    // Hidden tabs get no animation frames; measure once the tab is visible.
    if (document.hidden) {
      setMeasuring(false);
      setPaused(true);
      return;
    }
    setPaused(false);
    setMeasuring(true);
    const times: number[] = [];
    let id = 0;
    const finish = () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timeout);
      const fps = fpsFromFrameTimes(times);
      setHz(fps ? { raw: fps, snapped: snapRefreshRate(fps) } : null);
      setMeasuring(false);
    };
    const tick = (t: number) => {
      times.push(t);
      if (times.length < 121) id = requestAnimationFrame(tick);
      else finish();
    };
    const timeout = window.setTimeout(finish, 4000);
    id = requestAnimationFrame(tick);
    stop.current = () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    measure();
    const onVisible = () => {
      if (!document.hidden) measure();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      stop.current();
    };
  }, [measure]);

  if (!info)
    return <p className="text-sm text-gray-500">Reading your screen…</p>;

  const physW = Math.round(info.screenW * info.dpr);
  const physH = Math.round(info.screenH * info.dpr);
  const rows: [string, string, string?][] = [
    [
      'Screen resolution',
      `${fmt(info.screenW)} × ${fmt(info.screenH)}`,
      'in CSS pixels, as websites see it',
    ],
    [
      'Physical pixels (estimate)',
      `${fmt(physW)} × ${fmt(physH)}`,
      'screen × pixel ratio — usually the native resolution',
    ],
    ['Device pixel ratio', `${+info.dpr.toFixed(3)}`, 'includes browser zoom'],
    ['Aspect ratio', ratioText(info.screenW, info.screenH)],
    [
      'Browser window (viewport)',
      `${fmt(info.viewW)} × ${fmt(info.viewH)}`,
      'updates as you resize',
    ],
    [
      'Available screen area',
      `${fmt(info.availW)} × ${fmt(info.availH)}`,
      'minus taskbar / dock',
    ],
    [
      'Refresh rate (estimate)',
      measuring
        ? 'Measuring…'
        : paused
          ? 'Waiting — keep this tab visible'
          : hz
            ? `${hz.snapped} Hz`
            : 'Could not measure',
      hz && !measuring ? `measured ${hz.raw.toFixed(1)} fps` : undefined,
    ],
    ['Colour depth', `${info.colorDepth}-bit`],
    ['Colour gamut', info.gamut],
    ['HDR', info.hdr ? 'Supported' : 'Not reported'],
    ['Orientation', info.orientation],
    [
      'Touch',
      info.touchPoints ? `Yes, ${info.touchPoints} touch points` : 'No touch',
    ],
    ['Colour scheme', info.scheme],
  ];

  const report = rows
    .map(([k, v, note]) => `${k}: ${v}${note ? ` (${note})` : ''}`)
    .join('\n');

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
          Your screen resolution
        </p>
        <p className="mt-1 text-4xl font-semibold tabular-nums text-gray-900">
          {fmt(info.screenW)} × {fmt(info.screenH)}
        </p>
        {info.dpr !== 1 && (
          <p className="mt-1 text-sm text-gray-700">
            ≈ {fmt(physW)} × {fmt(physH)} physical pixels at{' '}
            {+info.dpr.toFixed(2)}× scaling
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Screen details</caption>
          <tbody className="divide-y divide-gray-100">
            {rows.map(([k, v, note]) => (
              <tr key={k}>
                <th
                  scope="row"
                  className="w-1/2 px-4 py-2 font-normal text-gray-600"
                >
                  {k}
                </th>
                <td className="px-4 py-2">
                  <span className="font-semibold tabular-nums text-gray-900">
                    {v}
                  </span>
                  {note && (
                    <span className="block text-xs text-gray-400">{note}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton text={report} label="Copy all details" />
        <button
          type="button"
          className={btnSecondary}
          onClick={measure}
          disabled={measuring}
        >
          Measure refresh rate again
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Browsers report sizes in CSS pixels, scaled by your operating system and
        browser zoom (Ctrl/⌘ + 0 resets zoom). The refresh rate is measured from
        animation frames: keep this tab in front and plugged in, because battery
        saver and background tabs slow animations down.
      </p>
    </div>
  );
}
