// Measures how tall each online tool is when it first renders, at phone
// (375 px), tablet (800 px) and desktop (1280 px) widths, and writes
// lib/online-tools/data/tool-heights.json. ToolPage reserves that height so
// the page doesn't jump when the client-side tool appears (layout shift).
//
// Usage: build and start the site (`npm run build && npm start`), then
//   npm run measure:tool-heights            # uses http://localhost:3000
//   npm run measure:tool-heights -- http://localhost:3100
// Needs a local Chrome or Chromium (set CHROME=/path/to/chrome if it isn't
// in the default macOS location). Uses Chrome's DevTools protocol over
// Node's built-in WebSocket — no extra dependencies.
//
// Re-run it after adding tools or changing a tool's first screen; tools
// missing from the file fall back to a generic reserved height.

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const CHROME =
  process.env.CHROME ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTHS = [375, 800, 1280];
const PARALLEL = 4;
const PORT = 9333;
const OUT = new URL(
  '../lib/online-tools/data/tool-heights.json',
  import.meta.url,
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return;
    } catch {
      // not up yet
    }
    await sleep(200);
  }
  throw new Error('Chrome did not start');
}

/** Minimal DevTools-protocol client for one page target. */
async function openPage() {
  const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, {
    method: 'PUT',
  });
  const { webSocketDebuggerUrl } = await r.json();
  const ws = new WebSocket(webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method && listeners.has(msg.method)) {
      listeners.get(msg.method)();
      listeners.delete(msg.method);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      id += 1;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params }));
    });
  const once = (method) => new Promise((res) => listeners.set(method, res));
  await send('Page.enable');
  return { send, once, close: () => ws.close() };
}

// Height of the tool card once the lazy tool has replaced "Loading tool…".
const PROBE = `(() => {
  const s = document.querySelector('section[aria-label$=" tool"]');
  if (!s || s.textContent.includes('Loading tool…')) return 0;
  // Measure the tool's own height, not the space ToolPage already reserves.
  s.style.minHeight = '0px';
  return Math.round(s.getBoundingClientRect().height);
})()`;

async function measure(page, url, width) {
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 640,
  });
  const loaded = page.once('Page.loadEventFired');
  await page.send('Page.navigate', { url });
  await Promise.race([loaded, sleep(20000)]);
  for (let i = 0; i < 60; i++) {
    await sleep(200);
    const r = await page.send('Runtime.evaluate', {
      expression: PROBE,
      returnByValue: true,
    });
    if (r.result?.result?.value > 0) {
      // Let fonts, images and effects settle, then read the final value.
      await sleep(800);
      const final = await page.send('Runtime.evaluate', {
        expression: PROBE,
        returnByValue: true,
      });
      return final.result?.result?.value ?? 0;
    }
  }
  return 0;
}

const profile = mkdtempSync(join(tmpdir(), 'emojar-measure-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--disable-extensions',
  ],
  { stdio: 'ignore' },
);

try {
  await waitForChrome();
  const index = await (await fetch(`${BASE}/search-index.json`)).json();
  // Tool pages are /online-tool/<category>/<slug> (variants are one deeper).
  const tools = [
    ...new Set(
      index.map((e) => e.href).filter((h) => h.split('/').length === 4),
    ),
  ];
  const heights = Object.fromEntries(
    tools.map((t) => [t.split('/').pop(), []]),
  );
  const pages = await Promise.all(Array.from({ length: PARALLEL }, openPage));
  for (const [w, width] of WIDTHS.entries()) {
    let next = 0;
    await Promise.all(
      pages.map(async (page) => {
        while (next < tools.length) {
          const url = tools[next++];
          const h = await measure(page, `${BASE}${url}`, width);
          // Round down so a slightly shorter render never leaves a gap.
          heights[url.split('/').pop()][w] = Math.floor(h / 4) * 4;
        }
      }),
    );
    console.log(`width ${width}: done`);
  }
  pages.forEach((p) => p.close());
  const complete = Object.fromEntries(
    Object.entries(heights)
      .filter(([, h]) => h.length === WIDTHS.length && h.every((v) => v > 0))
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  const missing = tools.length - Object.keys(complete).length;
  writeFileSync(OUT, `${JSON.stringify(complete, null, 0)}\n`);
  console.log(
    `${Object.keys(complete).length} tools measured${missing ? `, ${missing} skipped (no height)` : ''} → lib/online-tools/data/tool-heights.json`,
  );
} finally {
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
}
