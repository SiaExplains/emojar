import { describe, expect, it } from 'vitest';
import {
  ALL_KEY_CODES,
  PIXEL_TEST_COLORS,
  brandFromHints,
  fpsFromFrameTimes,
  keyLocationName,
  parseUserAgent,
  snapRefreshRate,
  windowsFromPlatformVersion,
} from './device';

const UA = {
  chromeWin:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.2849.56',
  firefoxMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:131.0) Gecko/20100101 Firefox/131.0',
  safariMac:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  chromeIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1',
  samsung:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
  opera:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 OPR/115.0.0.0',
  webview:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.70 Mobile Safari/537.36',
  androidTablet:
    'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
};

describe('parseUserAgent', () => {
  it.each([
    ['chromeWin', 'Chrome', '130.0.0.0', 'Blink', 'Windows', 'Desktop'],
    ['edge', 'Microsoft Edge', '130.0.2849.56', 'Blink', 'Windows', 'Desktop'],
    ['firefoxMac', 'Firefox', '131.0', 'Gecko', 'macOS', 'Desktop'],
    ['safariMac', 'Safari', '18.0', 'WebKit', 'macOS', 'Desktop'],
    ['safariIphone', 'Safari', '18.0', 'WebKit', 'iOS', 'Mobile'],
    ['chromeIos', 'Chrome', '129.0.6668.69', 'WebKit', 'iOS', 'Mobile'],
    ['samsung', 'Samsung Internet', '26.0', 'Blink', 'Android', 'Mobile'],
    ['opera', 'Opera', '115.0.0.0', 'Blink', 'Windows', 'Desktop'],
    [
      'webview',
      'Android WebView',
      '129.0.6668.70',
      'Blink',
      'Android',
      'Mobile',
    ],
    ['androidTablet', 'Chrome', '129.0.0.0', 'Blink', 'Android', 'Tablet'],
  ] as const)('%s', (key, browser, version, engine, os, device) => {
    const p = parseUserAgent(UA[key]);
    expect(p).toMatchObject({
      browser,
      browserVersion: version,
      engine,
      os,
      device,
    });
  });

  it('reads OS versions', () => {
    expect(parseUserAgent(UA.safariIphone).osVersion).toBe('18.0');
    expect(parseUserAgent(UA.safariMac).osVersion).toBe('10.15.7');
    expect(parseUserAgent(UA.chromeWin).osVersion).toBe('10 or 11');
    expect(parseUserAgent(UA.samsung).osVersion).toBe('14');
    expect(parseUserAgent('curl/8.0').browser).toBe('Unknown browser');
  });
});

describe('client hints', () => {
  it('picks the real brand and ignores GREASE', () => {
    expect(
      brandFromHints([
        { brand: 'Not)A;Brand', version: '99' },
        { brand: 'Google Chrome', version: '130' },
        { brand: 'Chromium', version: '130' },
      ]),
    ).toEqual({ browser: 'Chrome', version: '130' });
    expect(
      brandFromHints([
        { brand: 'Chromium', version: '130' },
        { brand: 'Microsoft Edge', version: '130' },
        { brand: 'Not?A_Brand', version: '99' },
      ]),
    ).toEqual({ browser: 'Microsoft Edge', version: '130' });
    expect(brandFromHints([])).toBeNull();
  });

  it('tells Windows 11 from 10', () => {
    expect(windowsFromPlatformVersion('15.0.0')).toBe('11');
    expect(windowsFromPlatformVersion('10.0.0')).toBe('10');
  });
});

describe('screen helpers', () => {
  it('snaps measured fps to common refresh rates', () => {
    expect(snapRefreshRate(59.7)).toBe(60);
    expect(snapRefreshRate(143.2)).toBe(144);
    expect(snapRefreshRate(119.4)).toBe(120);
    expect(snapRefreshRate(0)).toBe(0);
    expect(fpsFromFrameTimes([0, 16.7, 33.3, 50, 100, 116.7])).toBeCloseTo(
      59.9,
      0,
    );
    expect(fpsFromFrameTimes([1])).toBe(0);
  });
});

describe('keyboard and pixel data', () => {
  it('has unique key codes and all test colours', () => {
    expect(new Set(ALL_KEY_CODES).size).toBe(ALL_KEY_CODES.length);
    expect(ALL_KEY_CODES.length).toBeGreaterThan(100);
    expect(ALL_KEY_CODES).toContain('NumpadEnter');
    expect(keyLocationName(1)).toBe('Left');
    expect(PIXEL_TEST_COLORS.map((c) => c.name)).toContain('Black');
  });
});
