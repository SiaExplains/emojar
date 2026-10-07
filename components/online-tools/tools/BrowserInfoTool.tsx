'use client';

import { useEffect, useState } from 'react';
import {
  brandFromHints,
  parseUserAgent,
  windowsFromPlatformVersion,
} from '@/lib/online-tools/engines/device';
import type { ToolProps } from '../ToolRenderer';
import { CopyButton } from '../ui';

type UAData = {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{
    platformVersion?: string;
    architecture?: string;
    bitness?: string;
    model?: string;
    fullVersionList?: { brand: string; version: string }[];
  }>;
};

type Row = [string, string];

function gpuRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return 'WebGL not available';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext
      ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return String(r || 'Hidden by the browser');
  } catch {
    return 'Unknown';
  }
}

function features(): [string, boolean][] {
  const w = window as unknown as Record<string, unknown>;
  const n = navigator as unknown as Record<string, unknown>;
  let webgl2 = false;
  try {
    webgl2 = !!document.createElement('canvas').getContext('webgl2');
  } catch {
    /* unsupported */
  }
  return [
    ['Cookies', navigator.cookieEnabled],
    [
      'Local storage',
      (() => {
        try {
          return !!window.localStorage;
        } catch {
          return false;
        }
      })(),
    ],
    ['IndexedDB', 'indexedDB' in window],
    ['Service workers (offline apps)', 'serviceWorker' in navigator],
    ['WebAssembly', typeof WebAssembly === 'object'],
    ['WebGL 2', webgl2],
    ['WebGPU', 'gpu' in navigator],
    ['WebRTC (video calls)', 'RTCPeerConnection' in window],
    ['Camera & microphone access', !!navigator.mediaDevices?.getUserMedia],
    ['Clipboard API', !!navigator.clipboard],
    ['Web Share', 'share' in navigator],
    ['Notifications', 'Notification' in window],
    ['Geolocation', 'geolocation' in navigator],
    ['Bluetooth', 'bluetooth' in n],
    ['USB', 'usb' in n],
    ['Web Speech (text to speech)', 'speechSynthesis' in window],
    ['Fullscreen', !!document.documentElement.requestFullscreen],
    ['Picture-in-Picture', 'pictureInPictureEnabled' in document],
    ['Payment Request', 'PaymentRequest' in w],
    ['Web Workers', 'Worker' in window],
  ];
}

export default function BrowserInfoTool({ config }: ToolProps) {
  const uaFirst = config.init_focus === 'user-agent';
  const [ua, setUa] = useState('');
  const [main, setMain] = useState<Row[]>([]);
  const [more, setMore] = useState<Row[]>([]);
  const [feats, setFeats] = useState<[string, boolean][]>([]);
  const [hintsUsed, setHintsUsed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const uaString = navigator.userAgent;
    const p = parseUserAgent(uaString);
    // iPad Safari asks for desktop sites and sends a Mac user agent; Macs
    // have no touch screen, so touch points give the iPad away.
    if (p.os === 'macOS' && navigator.maxTouchPoints > 1) {
      p.os = 'iPadOS';
      p.osVersion = '';
      p.device = 'Tablet';
      p.engine = 'WebKit';
    }
    const data = (navigator as unknown as { userAgentData?: UAData })
      .userAgentData;

    const build = (extra: {
      browser?: string;
      version?: string;
      osVersion?: string;
      arch?: string;
      model?: string;
    }) => {
      const os = data?.platform && data.platform !== '' ? data.platform : p.os;
      const osName = os === 'macOS' || os === 'Windows' ? os : p.os;
      const nav = navigator as unknown as {
        deviceMemory?: number;
        globalPrivacyControl?: boolean;
      };
      const mainRows: Row[] = [
        [
          'Browser',
          `${extra.browser ?? p.browser} ${extra.version ?? p.browserVersion}`.trim(),
        ],
        ['Rendering engine', p.engine],
        [
          'Operating system',
          `${osName} ${extra.osVersion ?? p.osVersion}`.trim(),
        ],
        [
          'Device type',
          data
            ? data.mobile
              ? 'Mobile'
              : p.device === 'Tablet'
                ? 'Tablet'
                : 'Desktop'
            : p.device,
        ],
      ];
      if (extra.model) mainRows.push(['Device model', extra.model]);
      if (extra.arch) mainRows.push(['CPU architecture', extra.arch]);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const moreRows: Row[] = [
        ['Languages', navigator.languages?.join(', ') || navigator.language],
        ['Time zone', tz],
        [
          'Screen',
          `${screen.width} × ${screen.height} at ${+(window.devicePixelRatio || 1).toFixed(2)}×`,
        ],
        ['Window (viewport)', `${window.innerWidth} × ${window.innerHeight}`],
        [
          'CPU threads',
          navigator.hardwareConcurrency
            ? String(navigator.hardwareConcurrency)
            : 'Not reported',
        ],
        [
          'Device memory',
          nav.deviceMemory
            ? `≈ ${nav.deviceMemory} GB (rounded)`
            : 'Not reported',
        ],
        ['Graphics (GPU)', gpuRenderer()],
        ['Online', navigator.onLine ? 'Yes' : 'No'],
        ['JavaScript', 'Enabled'],
        ['Do Not Track', navigator.doNotTrack === '1' ? 'On' : 'Off'],
        ['Global Privacy Control', nav.globalPrivacyControl ? 'On' : 'Off'],
      ];
      if (cancelled) return;
      setUa(uaString);
      setMain(mainRows);
      setMore(moreRows);
      setFeats(features());
    };

    build({});
    if (data?.getHighEntropyValues) {
      data
        .getHighEntropyValues([
          'platformVersion',
          'architecture',
          'bitness',
          'model',
          'fullVersionList',
        ])
        .then((h) => {
          const brand = brandFromHints(h.fullVersionList ?? data.brands);
          const osVersion =
            data.platform === 'Windows' && h.platformVersion
              ? windowsFromPlatformVersion(h.platformVersion)
              : h.platformVersion || undefined;
          setHintsUsed(true);
          build({
            browser: brand?.browser,
            version: brand?.version,
            osVersion,
            arch: h.architecture
              ? `${h.architecture}${h.bitness ? ` ${h.bitness}-bit` : ''}`
              : undefined,
            model: h.model || undefined,
          });
        })
        .catch(() => {
          /* hints are optional */
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  if (!main.length)
    return <p className="text-sm text-gray-500">Reading your browser…</p>;

  const report = [
    ...main,
    ['User agent', ua] as Row,
    ...more,
    ...feats.map(([k, v]) => [k, v ? 'Yes' : 'No'] as Row),
  ]
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const uaBlock = (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Your user agent string
        </h2>
        <CopyButton text={ua} label="Copy user agent" />
      </div>
      <p className="break-all rounded-xl border border-gray-100 bg-gray-50 p-3 font-mono text-xs text-gray-800">
        {ua}
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      {uaFirst && uaBlock}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">
          You are using
        </p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">
          {main[0][1]} on {main[2][1]}
        </p>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {main.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gray-100 p-3">
            <dt className="text-xs text-gray-500">{k}</dt>
            <dd className="text-sm font-semibold text-gray-900">{v}</dd>
          </div>
        ))}
      </dl>
      {!uaFirst && uaBlock}
      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Browser and device details</caption>
          <tbody className="divide-y divide-gray-100">
            {more.map(([k, v]) => (
              <tr key={k}>
                <th
                  scope="row"
                  className="w-2/5 px-4 py-2 font-normal text-gray-600"
                >
                  {k}
                </th>
                <td className="break-words px-4 py-2 font-medium text-gray-900">
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-800">
          Supported features
        </h2>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {feats.map(([k, v]) => (
            <li
              key={k}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span
                aria-hidden
                className={v ? 'text-emerald-600' : 'text-gray-400'}
              >
                {v ? '✓' : '✗'}
              </span>
              {k}
              <span className="sr-only">
                {v ? 'supported' : 'not supported'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton text={report} label="Copy full report" />
        <span className="text-xs text-gray-500">
          Paste it into a support ticket. Nothing is sent from this page.
        </span>
      </div>
      <p className="text-xs text-gray-500">
        {hintsUsed
          ? 'Version and operating-system details come from your browser’s User-Agent Client Hints, which are more accurate than the user agent string.'
          : 'Details come from your browser’s user agent string. Some browsers simplify it on purpose (for example, Windows 11 reports itself as Windows 10, and Safari freezes the macOS version), so very exact versions can’t always be shown.'}
      </p>
    </div>
  );
}
