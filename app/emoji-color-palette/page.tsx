'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import data from '@/data/emojis.json';
import { btnPrimary, btnSecondary } from '@/components/ui/styles';

type Emoji = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
};

function extractColors(canvas: HTMLCanvasElement, count = 6): string[] {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const colorMap: Record<string, number> = {};
  const step = 4;
  for (let i = 0; i < pixels.length; i += 4 * step) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    if (a < 128) continue;
    if (r > 240 && g > 240 && b > 240) continue;
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
    colorMap[key] = (colorMap[key] ?? 0) + 1;
  }
  return Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([k]) => k);
}

function downloadCanvas(canvas: HTMLCanvasElement, name: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function EmojiColorPalettePage() {
  const [query, setQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>({
    slug: 'rainbow',
    char: '🌈',
    name: 'Rainbow',
    category: 'Travel & Places',
    keywords: ['rainbow', 'sky', 'nature'],
  });
  const [colors, setColors] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

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

  const extractFromEmoji = useCallback(() => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size, size);
    const fontSize = Math.round(size * 0.8);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedEmoji.char, size / 2, size / 2 + size * 0.02);
    const extracted = extractColors(canvas, 6);
    setColors(extracted);
  }, [selectedEmoji]);

  useEffect(() => {
    extractFromEmoji();
  }, [extractFromEmoji]);

  const handleCopy = (hex: string, idx: number) => {
    navigator.clipboard.writeText(hex).catch(() => undefined);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleDownloadPalette = () => {
    const paletteCanvas = document.createElement('canvas');
    const swatchW = 80;
    paletteCanvas.width = swatchW * colors.length;
    paletteCanvas.height = 80;
    const ctx = paletteCanvas.getContext('2d')!;
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * swatchW, 0, swatchW, 80);
    });
    downloadCanvas(paletteCanvas, `palette-${selectedEmoji.slug}.png`);
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Color Palette Extractor</h1>
        <p className="text-gray-500">
          Pick any emoji to instantly extract its dominant colors as a
          ready-to-use hex palette.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left — emoji picker */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Search emoji
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emojis… e.g. rainbow, fire, flower"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div
              className="grid gap-1.5 max-h-64 overflow-y-auto rounded-xl border bg-gray-50 p-2"
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
        </div>

        {/* Right — palette */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            {/* Big emoji preview */}
            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 py-8">
              <span className="text-8xl leading-none">
                {selectedEmoji.char}
              </span>
            </div>

            {/* Color swatches */}
            {colors.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  Dominant Colors
                </p>
                <div className="space-y-2">
                  {colors.map((hex, i) => (
                    <div
                      key={hex}
                      className="flex items-center gap-3 rounded-xl border p-3 hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border flex-shrink-0"
                        style={{ background: hex }}
                      />
                      <span className="font-mono text-sm flex-1 text-gray-700">
                        {hex}
                      </span>
                      <button
                        onClick={() => handleCopy(hex, i)}
                        className={`${btnSecondary} px-3 py-1.5 text-xs`}
                      >
                        {copiedIdx === i ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleDownloadPalette}
                  className={`${btnPrimary} mt-2 w-full py-3`}
                >
                  ⬇️ Download Palette PNG
                </button>
              </div>
            ) : (
              <div className="rounded-xl border bg-gray-50 p-6 text-center text-sm text-gray-400">
                Select an emoji to extract colors
              </div>
            )}

            <canvas ref={hiddenCanvasRef} className="hidden" />
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">
          How to use the Color Palette Extractor
        </h2>
        <ol className="space-y-4">
          {[
            [
              '🎨 Pick an emoji',
              'Search or scroll through the emoji grid. Colorful emojis like 🌈, 🦚, 🌺, and 🍕 give the richest palettes.',
            ],
            [
              '🎯 View colors',
              'The tool renders the emoji at 256×256 pixels and samples thousands of pixels to find the most common color groups.',
            ],
            [
              '📋 Copy hex codes',
              'Click the Copy button next to any swatch to copy its hex code to your clipboard, ready to paste into Figma, CSS, or any design tool.',
            ],
            [
              '⬇️ Download',
              'Click Download Palette PNG to get a 480×80 swatch strip you can use as a reference in design projects.',
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
            Why extract colors from emoji?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Emoji are designed by world-class color teams at Apple, Google, and
            Microsoft with carefully chosen harmonious palettes. Extracting
            those colors gives you instant access to professionally curated
            combinations — perfect for branding, UI themes, illustration, or
            social media graphics. A 🌊 ocean emoji can inspire a cool blue
            brand palette. A 🌸 blossom gives you delicate pinks. A 🔥 fire
            yields fiery oranges and yellows.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            The tool works entirely in your browser using the HTML Canvas API —
            your emoji never leaves your device. Colors are quantized into
            perceptual buckets and ranked by frequency, so you always get the
            most visually dominant shades rather than noise from anti-aliasing
            or gradients.
          </p>
        </div>
      </div>
    </div>
  );
}
