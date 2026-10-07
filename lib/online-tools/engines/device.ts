// Device-test helpers: the on-screen keyboard layout, a user-agent parser,
// refresh-rate snapping and the dead-pixel colour cycle. Pure functions, so
// they can be unit-tested without a browser.

/* ------------------------------------------------------------------ */
/* Keyboard layout (keyed by KeyboardEvent.code, US ANSI labels)        */
/* ------------------------------------------------------------------ */

export type KeyDef = { code: string; label: string; w?: number };
/** A gap in a row, in key widths. */
export type KeyGap = { gap: number };
export type KeyRow = (KeyDef | KeyGap)[];

const k = (code: string, label: string, w?: number): KeyDef => ({
  code,
  label,
  w,
});
const gap = (n: number): KeyGap => ({ gap: n });

const letters = (codes: string) =>
  Array.from(codes).map((c) => k(`Key${c}`, c));

export const MAIN_KEYS: KeyRow[] = [
  [
    k('Escape', 'Esc'),
    gap(1),
    ...[1, 2, 3, 4].map((n) => k(`F${n}`, `F${n}`)),
    gap(0.5),
    ...[5, 6, 7, 8].map((n) => k(`F${n}`, `F${n}`)),
    gap(0.5),
    ...[9, 10, 11, 12].map((n) => k(`F${n}`, `F${n}`)),
  ],
  [
    k('Backquote', '`'),
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => k(`Digit${n}`, String(n))),
    k('Minus', '-'),
    k('Equal', '='),
    k('Backspace', 'Backspace', 2),
  ],
  [
    k('Tab', 'Tab', 1.5),
    ...letters('QWERTYUIOP'),
    k('BracketLeft', '['),
    k('BracketRight', ']'),
    k('Backslash', '\\', 1.5),
  ],
  [
    k('CapsLock', 'Caps Lock', 1.75),
    ...letters('ASDFGHJKL'),
    k('Semicolon', ';'),
    k('Quote', "'"),
    k('Enter', 'Enter', 2.25),
  ],
  [
    k('ShiftLeft', 'Shift', 2.25),
    ...letters('ZXCVBNM'),
    k('Comma', ','),
    k('Period', '.'),
    k('Slash', '/'),
    k('ShiftRight', 'Shift', 2.75),
  ],
  [
    k('ControlLeft', 'Ctrl', 1.25),
    k('MetaLeft', 'Win / ⌘', 1.25),
    k('AltLeft', 'Alt', 1.25),
    k('Space', 'Space', 6.25),
    k('AltRight', 'Alt', 1.25),
    k('MetaRight', 'Win / ⌘', 1.25),
    k('ContextMenu', 'Menu', 1.25),
    k('ControlRight', 'Ctrl', 1.25),
  ],
];

export const NAV_KEYS: KeyRow[] = [
  [k('PrintScreen', 'PrtSc'), k('ScrollLock', 'ScrLk'), k('Pause', 'Pause')],
  [k('Insert', 'Ins'), k('Home', 'Home'), k('PageUp', 'PgUp')],
  [k('Delete', 'Del'), k('End', 'End'), k('PageDown', 'PgDn')],
  [gap(3)],
  [gap(1), k('ArrowUp', '↑')],
  [k('ArrowLeft', '←'), k('ArrowDown', '↓'), k('ArrowRight', '→')],
];

export const NUMPAD_KEYS: KeyRow[] = [
  [gap(4)],
  [
    k('NumLock', 'Num'),
    k('NumpadDivide', '/'),
    k('NumpadMultiply', '*'),
    k('NumpadSubtract', '-'),
  ],
  [
    k('Numpad7', '7'),
    k('Numpad8', '8'),
    k('Numpad9', '9'),
    k('NumpadAdd', '+'),
  ],
  [k('Numpad4', '4'), k('Numpad5', '5'), k('Numpad6', '6'), gap(1)],
  [
    k('Numpad1', '1'),
    k('Numpad2', '2'),
    k('Numpad3', '3'),
    k('NumpadEnter', 'Enter'),
  ],
  [k('Numpad0', '0', 2), k('NumpadDecimal', '.'), gap(1)],
];

const isKey = (x: KeyDef | KeyGap): x is KeyDef => 'code' in x;

export const ALL_KEY_CODES: string[] = [
  ...MAIN_KEYS,
  ...NAV_KEYS,
  ...NUMPAD_KEYS,
]
  .flat()
  .filter(isKey)
  .map((x) => x.code);

export function keyLocationName(location: number): string {
  return (
    ['Standard', 'Left', 'Right', 'Numpad'][location] ?? `Other (${location})`
  );
}

/* ------------------------------------------------------------------ */
/* User-agent parsing                                                   */
/* ------------------------------------------------------------------ */

export type ParsedUA = {
  browser: string;
  browserVersion: string;
  engine: string;
  os: string;
  osVersion: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
};

const first = (ua: string, re: RegExp) => re.exec(ua)?.[1] ?? '';

/** Best-effort parse of a user-agent string (order of checks matters). */
export function parseUserAgent(ua: string): ParsedUA {
  let browser = 'Unknown browser';
  let browserVersion = '';
  const rules: [string, RegExp][] = [
    ['Microsoft Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/],
    ['Opera', /(?:OPR|OPiOS)\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Vivaldi', /Vivaldi\/([\d.]+)/],
    ['Yandex Browser', /YaBrowser\/([\d.]+)/],
    ['UC Browser', /UCBrowser\/([\d.]+)/],
    ['Firefox', /(?:Firefox|FxiOS)\/([\d.]+)/],
    ['Chrome', /(?:CriOS)\/([\d.]+)/],
  ];
  for (const [name, re] of rules) {
    const v = first(ua, re);
    if (v) {
      browser = name;
      browserVersion = v;
      break;
    }
  }
  if (browser === 'Unknown browser') {
    if (/; wv\)/.test(ua) && /Chrome\/([\d.]+)/.test(ua)) {
      browser = 'Android WebView';
      browserVersion = first(ua, /Chrome\/([\d.]+)/);
    } else if (/Chrome\/([\d.]+)/.test(ua) || /Chromium\/([\d.]+)/.test(ua)) {
      browser = /Chromium\//.test(ua) ? 'Chromium' : 'Chrome';
      browserVersion = first(ua, /(?:Chrome|Chromium)\/([\d.]+)/);
    } else if (/Safari\//.test(ua) && /Version\/([\d.]+)/.test(ua)) {
      browser = 'Safari';
      browserVersion = first(ua, /Version\/([\d.]+)/);
    }
  }

  // On iOS every browser uses Apple's WebKit engine.
  const ios = /iPhone|iPad|iPod/.test(ua);
  const engine = ios
    ? 'WebKit'
    : /Gecko\/\d/.test(ua) && /Firefox\//.test(ua)
      ? 'Gecko'
      : /Chrome\/|Chromium\/|Edg\/|OPR\//.test(ua)
        ? 'Blink'
        : /AppleWebKit\//.test(ua)
          ? 'WebKit'
          : 'Unknown';

  let os = 'Unknown OS';
  let osVersion = '';
  if (ios) {
    os = /iPad/.test(ua) ? 'iPadOS' : 'iOS';
    osVersion = first(ua, /OS (\d+[_\d]*) like Mac/).replace(/_/g, '.');
  } else if (/Android/.test(ua)) {
    os = 'Android';
    osVersion = first(ua, /Android ([\d.]+)/);
  } else if (/Windows NT/.test(ua)) {
    os = 'Windows';
    const nt = first(ua, /Windows NT ([\d.]+)/);
    // "NT 10.0" is sent by both Windows 10 and 11; only Client Hints tell them apart.
    osVersion =
      { '10.0': '10 or 11', '6.3': '8.1', '6.2': '8', '6.1': '7' }[nt] ?? nt;
  } else if (/CrOS/.test(ua)) {
    os = 'ChromeOS';
  } else if (/Mac OS X/.test(ua)) {
    os = 'macOS';
    osVersion = first(ua, /Mac OS X (\d+[_.\d]*)/).replace(/_/g, '.');
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  }

  const device: ParsedUA['device'] =
    /iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))
      ? 'Tablet'
      : /Mobi|iPhone|iPod|Android/.test(ua)
        ? 'Mobile'
        : 'Desktop';

  return { browser, browserVersion, engine, os, osVersion, device };
}

/** Client Hints brand names → display names; ignores GREASE brands. */
export function brandFromHints(
  brands: { brand: string; version: string }[],
): { browser: string; version: string } | null {
  const real = brands.filter((b) => !/Not.?A.?Brand|Chromium/i.test(b.brand));
  const pick =
    real.find((b) => !/Google Chrome/.test(b.brand)) ??
    real[0] ??
    brands.find((b) => b.brand === 'Chromium');
  if (!pick) return null;
  const names: Record<string, string> = {
    'Google Chrome': 'Chrome',
    'Microsoft Edge': 'Microsoft Edge',
    Opera: 'Opera',
    'Samsung Internet': 'Samsung Internet',
    Brave: 'Brave',
  };
  return { browser: names[pick.brand] ?? pick.brand, version: pick.version };
}

/** Windows 11 reports platformVersion 13.0.0 or higher via Client Hints. */
export function windowsFromPlatformVersion(v: string): string {
  const major = Number(v.split('.')[0]);
  if (!Number.isFinite(major)) return '';
  if (major >= 13) return '11';
  if (major > 0) return '10';
  return '7, 8 or 8.1';
}

/* ------------------------------------------------------------------ */
/* Screen                                                               */
/* ------------------------------------------------------------------ */

export const COMMON_REFRESH_RATES = [
  24, 30, 48, 50, 60, 72, 75, 85, 90, 100, 120, 144, 165, 170, 180, 200, 240,
  280, 300, 360, 480, 500,
];

/** Snaps a measured frame rate to the nearest common refresh rate (±4 %). */
export function snapRefreshRate(fps: number): number {
  if (!Number.isFinite(fps) || fps <= 0) return 0;
  let best = COMMON_REFRESH_RATES[0];
  for (const r of COMMON_REFRESH_RATES)
    if (Math.abs(r - fps) < Math.abs(best - fps)) best = r;
  return Math.abs(best - fps) / best <= 0.04 ? best : Math.round(fps);
}

/** Median frame interval → frames per second; robust to a few slow frames. */
export function fpsFromFrameTimes(times: number[]): number {
  if (times.length < 3) return 0;
  const deltas = times
    .slice(1)
    .map((t, i) => t - times[i])
    .filter((d) => d > 0)
    .sort((a, b) => a - b);
  if (!deltas.length) return 0;
  const mid = deltas[Math.floor(deltas.length / 2)];
  return 1000 / mid;
}

/* ------------------------------------------------------------------ */
/* Dead pixel test                                                      */
/* ------------------------------------------------------------------ */

export const PIXEL_TEST_COLORS: { name: string; hex: string; finds: string }[] =
  [
    {
      name: 'Black',
      hex: '#000000',
      finds: 'Stuck or “hot” pixels show as bright dots.',
    },
    {
      name: 'White',
      hex: '#ffffff',
      finds: 'Dead pixels show as black dots; also check for dust.',
    },
    {
      name: 'Red',
      hex: '#ff0000',
      finds: 'Pixels whose red sub-pixel is dead look dark here.',
    },
    {
      name: 'Green',
      hex: '#00ff00',
      finds: 'Pixels whose green sub-pixel is dead look dark here.',
    },
    {
      name: 'Blue',
      hex: '#0000ff',
      finds: 'Pixels whose blue sub-pixel is dead look dark here.',
    },
    {
      name: 'Cyan',
      hex: '#00ffff',
      finds: 'A stuck red sub-pixel stands out.',
    },
    {
      name: 'Magenta',
      hex: '#ff00ff',
      finds: 'A stuck green sub-pixel stands out.',
    },
    {
      name: 'Yellow',
      hex: '#ffff00',
      finds: 'A stuck blue sub-pixel stands out.',
    },
    {
      name: 'Gray 50 %',
      hex: '#808080',
      finds: 'Uneven backlight, clouding and banding are easiest to see.',
    },
  ];
