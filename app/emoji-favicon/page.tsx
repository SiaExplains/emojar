'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import data from '@/data/emojis.json';

type Emoji = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
};

const FAVICON_SIZES = [16, 32, 48, 64] as const;
type FaviconSize = (typeof FAVICON_SIZES)[number];

function renderFavicon(
  canvas: HTMLCanvasElement,
  emoji: string,
  size: FaviconSize,
): void {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  const fontSize = Math.round(size * 0.8);
  ctx.font = `${fontSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.02);
}

function downloadCanvas(canvas: HTMLCanvasElement, name: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function EmojiFaviconPage() {
  const [query, setQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>({
    slug: 'star',
    char: '⭐',
    name: 'Star',
    category: 'Travel & Places',
    keywords: ['star', 'yellow'],
  });
  const [size, setSize] = useState<FaviconSize>(32);
  const [downloaded, setDownloaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(data as Emoji[], {
        keys: ['name', 'keywords', 'char'],
        threshold: 0.3,
      }),
    [],
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return (data as Emoji[]).slice(0, 48);
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse]);

  const redraw = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;
    // Display preview at 128px for visibility
    preview.width = 128;
    preview.height = 128;
    const ctx = preview.getContext('2d')!;
    ctx.clearRect(0, 0, 128, 128);
    const fontSize = Math.round(128 * 0.8);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedEmoji.char, 64, 64 + 128 * 0.02);

    const full = canvasRef.current;
    if (!full) return;
    renderFavicon(full, selectedEmoji.char, size);
  }, [selectedEmoji, size]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderFavicon(canvas, selectedEmoji.char, size);
    downloadCanvas(canvas, `favicon-${selectedEmoji.slug}-${size}.png`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Favicon Generator</h1>
        <p className="text-gray-500">
          Turn any emoji into a favicon PNG. Pick a size, preview it, and
          download in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Left — picker + size */}
        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Search emoji
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emojis… e.g. star, heart, rocket"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div
              className="grid gap-1.5 max-h-56 overflow-y-auto rounded-xl border bg-gray-50 p-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
              }}
            >
              {searchResults.slice(0, 96).map((e) => (
                <button
                  key={e.slug}
                  title={e.name}
                  onClick={() => setSelectedEmoji(e)}
                  className={[
                    'flex items-center justify-center rounded-lg text-2xl h-11 w-11 transition-all',
                    selectedEmoji.slug === e.slug
                      ? 'bg-gray-900 shadow-md scale-110'
                      : 'hover:bg-white hover:shadow-sm',
                  ].join(' ')}
                >
                  {e.char}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Selected:{' '}
              <span className="font-medium text-gray-700">
                {selectedEmoji.char} {selectedEmoji.name}
              </span>
            </p>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Favicon size
            </label>
            <div className="flex flex-wrap gap-2">
              {FAVICON_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={[
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                    size === s
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {s}×{s}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              32×32 is the most common favicon size. Use 16×16 for legacy
              browsers.
            </p>
          </div>
        </div>

        {/* Right — preview + download */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <p className="text-sm font-semibold text-gray-700">
              Preview{' '}
              <span className="font-normal text-gray-400">
                (shown at 128px)
              </span>
            </p>

            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 p-6">
              <div
                className="rounded-xl overflow-hidden shadow-sm"
                style={{
                  backgroundImage:
                    'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 16px 16px',
                }}
              >
                <canvas
                  ref={previewRef}
                  width={128}
                  height={128}
                  className="block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            <div className="rounded-xl border bg-gray-50 px-4 py-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Export size</span>
                <span className="font-medium">
                  {size}×{size} px
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Format</span>
                <span className="font-medium">PNG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Background</span>
                <span className="font-medium">Transparent</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className={[
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-sm',
                downloaded
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95',
              ].join(' ')}
            >
              {downloaded ? '✅ Downloaded!' : `⬇️ Download Favicon PNG`}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free · No watermark · Transparent background
            </p>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">
          How to use the Emoji Favicon Generator
        </h2>
        <ol className="space-y-4">
          {[
            [
              '🔍 Choose an emoji',
              'Search the emoji library or scroll to find the icon that represents your site. Click it to select.',
            ],
            [
              '📐 Pick a size',
              '32×32 pixels is the standard favicon size supported by all modern browsers. Use 16×16 for the classic tiny icon, or 48×64 for high-DPI displays and bookmarks.',
            ],
            [
              '👀 Preview',
              'The live preview shows your emoji at 128px display size so you can see how it looks before downloading.',
            ],
            [
              '⬇️ Download and add to your site',
              'Click Download. Place the PNG in your public folder and add <link rel="icon" href="/favicon-emoji.png"> to your HTML head.',
            ],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex gap-4">
              <span className="text-lg">{(title as string).split(' ')[0]}</span>
              <div>
                <p className="font-semibold text-sm">
                  {(title as string).split(' ').slice(1).join(' ')}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">{desc as string}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="space-y-3 mt-6">
          <h2 className="text-xl font-semibold">
            Why use an emoji as your favicon?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Emoji favicons have become a popular trend in indie web development
            and startups because they are instantly recognisable, load in
            milliseconds, and require zero design skills. Tools like Notion,
            Linear, and hundreds of personal sites already use them. An emoji
            favicon communicates personality and purpose in a single character —
            a rocket for a launch page, a leaf for an eco brand, or a lightning
            bolt for a speed-focused app.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Unlike SVG favicons, a plain PNG works in every browser going back
            to IE6. And because the emoji is rendered directly on a canvas at
            the exact pixel dimensions you need, there is no blurry scaling or
            font loading — just a crisp, transparent icon ready to drop into any
            project.
          </p>
        </div>
      </div>
    </div>
  );
}
