'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import data from '@/data/emojis.json';
import { btnSecondary } from '@/components/ui/styles';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

type Emoji = {
  slug: string;
  char: string;
  name: string;
  category: string;
  keywords: string[];
};

const SIZES = [64, 128, 256, 512, 1024] as const;
type Size = (typeof SIZES)[number];

const PADDING_MAP: Record<string, number> = {
  none: 0,
  small: 0.08,
  medium: 0.14,
  large: 0.22,
};

const BG_PRESETS = [
  { label: 'Transparent', value: 'transparent', preview: 'checkerboard' },
  { label: 'White', value: '#ffffff', preview: '#ffffff' },
  { label: 'Black', value: '#000000', preview: '#000000' },
  { label: 'Yellow', value: '#FFE066', preview: '#FFE066' },
  { label: 'Sky', value: '#E0F2FE', preview: '#E0F2FE' },
  { label: 'Lavender', value: '#EDE9FE', preview: '#EDE9FE' },
  { label: 'Mint', value: '#D1FAE5', preview: '#D1FAE5' },
  { label: 'Rose', value: '#FFE4E6', preview: '#FFE4E6' },
  { label: 'Custom', value: 'custom', preview: 'custom' },
] as const;

// ---------------------------------------------------------------------------
// Canvas renderer
// ---------------------------------------------------------------------------

function renderToCanvas(
  canvas: HTMLCanvasElement,
  emoji: string,
  size: Size,
  bg: string,
  paddingKey: string,
): void {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background
  if (bg === 'transparent') {
    ctx.clearRect(0, 0, size, size);
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
  }

  // Emoji
  const padding = PADDING_MAP[paddingKey] ?? 0.14;
  const fontSize = Math.round(size * (1 - padding * 2));
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EmojiToPngPage() {
  const [query, setQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>({
    slug: 'grinning-face',
    char: '😀',
    name: 'Grinning Face',
    category: 'Smileys & Emotion',
    keywords: ['face', 'smile', 'happy'],
  });
  const [customInput, setCustomInput] = useState('');
  const [size, setSize] = useState<Size>(256);
  const [bgPreset, setBgPreset] = useState<string>('#ffffff');
  const [customColor, setCustomColor] = useState('#a855f7');
  const [padding, setPadding] = useState<string>('medium');
  const [showPicker, setShowPicker] = useState(false);
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

  const activeEmoji = customInput.trim() || selectedEmoji.char;
  const activeBg = bgPreset === 'custom' ? customColor : bgPreset;
  const fileName = `${customInput.trim() ? 'emoji' : selectedEmoji.slug}-${size}px.png`;

  // Redraw preview whenever params change
  const redraw = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;
    renderToCanvas(preview, activeEmoji, 256, activeBg, padding);

    const full = canvasRef.current;
    if (!full) return;
    renderToCanvas(full, activeEmoji, size, activeBg, padding);
  }, [activeEmoji, size, activeBg, padding]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderToCanvas(canvas, activeEmoji, size, activeBg, padding);
    downloadCanvas(canvas, fileName);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji to PNG</h1>
        <p className="text-gray-500">
          Pick any emoji, choose a size and background, and download a crisp PNG
          in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left — emoji picker + options */}
        <div className="space-y-6">
          {/* Custom text override */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Emoji or text
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={`${selectedEmoji.char}  or paste your own text/emoji here`}
                className="flex-1 border rounded-xl px-4 py-3 text-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {customInput && (
                <button
                  onClick={() => setCustomInput('')}
                  className={btnSecondary}
                >
                  Clear
                </button>
              )}
            </div>
            {customInput && (
              <p className="text-xs text-gray-400">
                Custom text overrides the emoji selection below.
              </p>
            )}
          </div>

          {/* Emoji search + grid */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Or search and pick an emoji
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emojis… e.g. heart, fire, rocket"
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
                  onClick={() => {
                    setSelectedEmoji(e);
                    setCustomInput('');
                    setShowPicker(false);
                  }}
                  className={[
                    'flex items-center justify-center rounded-lg text-2xl h-11 w-11 transition-all',
                    selectedEmoji.slug === e.slug && !customInput
                      ? 'bg-gray-900 shadow-md scale-110'
                      : 'hover:bg-white hover:shadow-sm',
                  ].join(' ')}
                >
                  {e.char}
                </button>
              ))}
            </div>
            {!customInput && (
              <p className="text-xs text-gray-400">
                Selected:{' '}
                <span className="font-medium text-gray-700">
                  {selectedEmoji.char} {selectedEmoji.name}
                </span>
              </p>
            )}
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Output size
            </label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
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
          </div>

          {/* Background */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Background
            </label>
            <div className="flex flex-wrap gap-2">
              {BG_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setBgPreset(preset.value);
                    if (preset.value === 'custom') setShowPicker(true);
                  }}
                  title={preset.label}
                  className={[
                    'relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                    bgPreset === preset.value
                      ? 'border-gray-900 shadow-md ring-2 ring-gray-900 ring-offset-1'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {preset.preview === 'checkerboard' ? (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{
                        backgroundImage:
                          'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px',
                      }}
                    />
                  ) : preset.preview === 'custom' ? (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{
                        background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
                      }}
                    />
                  ) : (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{ background: preset.preview }}
                    />
                  )}
                  <span className="text-gray-600">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Custom colour picker */}
            {bgPreset === 'custom' && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-600">
                  {customColor}
                </span>
              </div>
            )}
          </div>

          {/* Padding */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Padding
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PADDING_MAP).map((p) => (
                <button
                  key={p}
                  onClick={() => setPadding(p)}
                  className={[
                    'px-4 py-2 rounded-full border text-sm font-medium capitalize transition-all',
                    padding === p
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — preview + download */}
        <div className="space-y-4">
          <div className="sticky top-24 space-y-4">
            <p className="text-sm font-semibold text-gray-700">
              Preview{' '}
              <span className="font-normal text-gray-400">
                (256×256 preview)
              </span>
            </p>

            {/* Preview canvas */}
            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 p-6">
              <div
                className="rounded-xl overflow-hidden shadow-lg"
                style={{
                  backgroundImage:
                    activeBg === 'transparent'
                      ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 16px 16px'
                      : undefined,
                }}
              >
                <canvas
                  ref={previewRef}
                  width={256}
                  height={256}
                  className="block"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border bg-gray-50 px-4 py-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Output size</span>
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
                <span className="font-medium capitalize">
                  {bgPreset === 'transparent'
                    ? 'Transparent'
                    : bgPreset === 'custom'
                      ? customColor
                      : bgPreset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">File name</span>
                <span className="font-medium font-mono text-xs truncate max-w-[140px]">
                  {fileName}
                </span>
              </div>
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className={[
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-sm',
                downloaded
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-95',
              ].join(' ')}
            >
              {downloaded ? '✅ Downloaded!' : `⬇️ Download PNG`}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free · No account · No watermark
            </p>

            {/* Hidden high-res canvas */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">How to use Emoji to PNG</h2>
        <ol className="space-y-4">
          {[
            [
              '🔍 Search or pick',
              'Type in the search box to filter every emoji and click one to select it. Or paste any emoji or text directly into the top input.',
            ],
            [
              '⚙️ Configure',
              'Choose your output size (64 to 1024 pixels), background colour (including fully transparent for sticker use), and how much padding to add around the emoji.',
            ],
            [
              '👀 Preview',
              'The live preview updates instantly so you can see exactly what the downloaded image will look like before saving it.',
            ],
            [
              '⬇️ Download',
              'Click the Download PNG button. The file saves to your device immediately — no upload, no server, no watermark.',
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
      </div>

      {/* Use cases */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">What can you use it for?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '💬',
              title: 'Stickers & reactions',
              desc: 'Download with a transparent background to create custom stickers for Telegram, Discord, or WhatsApp.',
            },
            {
              icon: '🎨',
              title: 'Design assets',
              desc: 'Get a high-res 1024×1024 emoji for Figma, Canva, or Photoshop mockups without pixelation.',
            },
            {
              icon: '📱',
              title: 'Social media',
              desc: 'Use a white or coloured background for Instagram posts, YouTube thumbnails, or story overlays.',
            },
            {
              icon: '🖨️',
              title: 'Print & merchandise',
              desc: 'Export at 512px or 1024px for high-quality prints, sticker sheets, or merch designs.',
            },
            {
              icon: '💻',
              title: 'Web & app icons',
              desc: 'Use emojis as favicon alternatives, notification icons, or placeholder graphics in prototypes.',
            },
            {
              icon: '🎓',
              title: 'Presentations',
              desc: 'Drop a clean emoji PNG into Google Slides or PowerPoint for visual appeal without blurry text.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-4 space-y-1 hover:shadow-sm transition-shadow"
            >
              <p className="text-2xl">{item.icon}</p>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
