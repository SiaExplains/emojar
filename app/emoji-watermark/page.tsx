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

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'tiled';

const POSITIONS: { value: Position; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center', label: 'Center' },
  { value: 'tiled', label: 'Tiled' },
];

function drawWatermark(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  emojiChar: string,
  position: Position,
  sizePct: number,
  opacity: number,
): void {
  const W = image.naturalWidth;
  const H = image.naturalHeight;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, W, H);

  const emojiSize = Math.round(W * (sizePct / 100));
  ctx.globalAlpha = opacity / 100;
  ctx.font = `${emojiSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const pad = emojiSize * 0.5;

  if (position === 'tiled') {
    const stepX = emojiSize * 2;
    const stepY = emojiSize * 2;
    for (let y = pad; y < H; y += stepY) {
      for (let x = pad; x < W; x += stepX) {
        ctx.fillText(emojiChar, x, y);
      }
    }
  } else {
    let x = W / 2;
    let y = H / 2;
    if (position === 'top-left') {
      x = pad;
      y = pad;
    }
    if (position === 'top-right') {
      x = W - pad;
      y = pad;
    }
    if (position === 'bottom-left') {
      x = pad;
      y = H - pad;
    }
    if (position === 'bottom-right') {
      x = W - pad;
      y = H - pad;
    }
    ctx.fillText(emojiChar, x, y);
  }

  ctx.globalAlpha = 1;
}

function downloadCanvas(canvas: HTMLCanvasElement, name: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function EmojiWatermarkPage() {
  const [query, setQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>({
    slug: 'copyright',
    char: '©️',
    name: 'Copyright',
    category: 'Symbols',
    keywords: ['copyright', 'symbol'],
  });
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState('image');
  const [position, setPosition] = useState<Position>('bottom-right');
  const [sizePct, setSizePct] = useState(15);
  const [opacity, setOpacity] = useState(80);
  const [downloaded, setDownloaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const canvas = canvasRef.current;
    if (!canvas || !imageEl) return;
    drawWatermark(
      canvas,
      imageEl,
      selectedEmoji.char,
      position,
      sizePct,
      opacity,
    );
  }, [imageEl, selectedEmoji, position, sizePct, opacity]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name.replace(/\.[^.]+$/, ''));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImageEl(img);
    img.src = url;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageEl) return;
    drawWatermark(
      canvas,
      imageEl,
      selectedEmoji.char,
      position,
      sizePct,
      opacity,
    );
    downloadCanvas(canvas, `${imageName}-watermarked.png`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Watermark Tool</h1>
        <p className="text-gray-500">
          Upload a photo, pick an emoji, and add a watermark overlay. All
          processing happens in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Left — controls */}
        <div className="space-y-6">
          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Upload image
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageEl ? (
                <p className="text-sm text-gray-600">
                  ✅ <span className="font-medium">{imageName}</span> — click to
                  replace
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-3xl">🖼️</p>
                  <p className="text-sm text-gray-500">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF, WebP supported
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Emoji search */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Watermark emoji
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emojis… e.g. star, lock, fire"
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div
              className="grid gap-1.5 max-h-48 overflow-y-auto rounded-xl border bg-gray-50 p-2"
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

          {/* Position */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Position
            </label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={[
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                    position === p.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Emoji size —{' '}
              <span className="font-normal text-gray-500">
                {sizePct}% of image width
              </span>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              value={sizePct}
              onChange={(e) => setSizePct(Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Opacity —{' '}
              <span className="font-normal text-gray-500">{opacity}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-gray-900"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Right — preview + download */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <p className="text-sm font-semibold text-gray-700">Preview</p>

            <div className="rounded-2xl border bg-gray-50 overflow-hidden flex items-center justify-center min-h-48">
              {imageEl ? (
                <canvas
                  ref={canvasRef}
                  className="block w-full h-auto max-h-96 object-contain"
                  style={{ imageRendering: 'auto' }}
                />
              ) : (
                <div className="py-16 text-center text-sm text-gray-400">
                  <p className="text-3xl mb-2">📷</p>
                  <p>Upload an image to preview</p>
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!imageEl}
              className={[
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-sm',
                !imageEl
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : downloaded
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95',
              ].join(' ')}
            >
              {downloaded ? '✅ Downloaded!' : '⬇️ Download PNG'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free · No server upload · Your image stays private
            </p>
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">
          How to use the Emoji Watermark Tool
        </h2>
        <ol className="space-y-4">
          {[
            [
              '🖼️ Upload your image',
              'Click the upload area and choose any photo or graphic from your device. PNG, JPG, WebP and GIF are all supported.',
            ],
            [
              '😀 Pick your emoji',
              'Search for any emoji to use as the watermark. A © copyright symbol, a brand logo emoji, or a fun decorative element — the choice is yours.',
            ],
            [
              '⚙️ Adjust settings',
              'Set the position (corner, center, or tiled across the whole image), scale the emoji from 5% to 30% of the image width, and control opacity for a subtle or bold effect.',
            ],
            [
              '⬇️ Download',
              'Click Download PNG to save the composite image. Processing is fully in-browser — your photo is never sent to any server.',
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
          <h2 className="text-xl font-semibold">Why add emoji watermarks?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Emoji watermarks are a fun, modern alternative to traditional
            text-based copyright marks. They work great for social media content
            creators who want to protect their photos while keeping them
            visually engaging. The tiled mode creates a subtle all-over pattern
            that makes images hard to crop without attribution, while still
            looking intentional and creative rather than defensive.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Because all compositing happens on an HTML Canvas in your browser,
            your images are completely private. No file is ever uploaded to a
            server — the tool reads the image locally, draws it with the emoji
            overlay, and offers the result directly as a download. This makes it
            safe to use even with sensitive or personal photos.
          </p>
        </div>
      </div>
    </div>
  );
}
