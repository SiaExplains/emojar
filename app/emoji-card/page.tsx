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

const CARD_SIZE = 1080;
const DISPLAY_SIZE = 400;

const BG_PRESETS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#0a0a0a' },
  { label: 'Indigo', value: '#4338ca' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Sky', value: '#0284c7' },
  { label: 'Custom', value: 'custom' },
] as const;

const TEXT_PRESETS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#0a0a0a' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'Custom', value: 'custom' },
] as const;

const FONT_SIZES: { label: string; value: number }[] = [
  { label: 'Small', value: 48 },
  { label: 'Medium', value: 64 },
  { label: 'Large', value: 80 },
];

function renderCard(
  canvas: HTMLCanvasElement,
  lines: string[],
  emoji: string,
  bgColor: string,
  textColor: string,
  fontSize: number,
  scale: number = 1,
): void {
  const S = CARD_SIZE * scale;
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, S, S);

  // Tiled emoji pattern at 20% opacity
  const patternSize = Math.round(96 * scale);
  ctx.globalAlpha = 0.2;
  ctx.font = `${patternSize}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const step = Math.round(130 * scale);
  for (let y = step / 2; y < S; y += step) {
    for (let x = step / 2; x < S; x += step) {
      ctx.fillText(emoji, x, y);
    }
  }
  ctx.globalAlpha = 1;

  // Text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const scaledFont = Math.round(fontSize * scale);
  ctx.font = `bold ${scaledFont}px system-ui, sans-serif`;

  const lineHeight = scaledFont * 1.35;
  const totalHeight = lines.length * lineHeight;
  const startY = (S - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, S / 2, startY + i * lineHeight);
  });
}

function downloadCanvas(canvas: HTMLCanvasElement, name: string): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

export default function EmojiCardPage() {
  const [query, setQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>({
    slug: 'sparkles',
    char: '✨',
    name: 'Sparkles',
    category: 'Activities',
    keywords: ['sparkle', 'shine', 'star'],
  });
  const [textInput, setTextInput] = useState('Hello, World!');
  const [bgPreset, setBgPreset] = useState('#4338ca');
  const [customBg, setCustomBg] = useState('#4338ca');
  const [textPreset, setTextPreset] = useState('#ffffff');
  const [customText, setCustomText] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(64);
  const [downloaded, setDownloaded] = useState(false);

  const previewRef = useRef<HTMLCanvasElement>(null);
  const exportRef = useRef<HTMLCanvasElement>(null);

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

  const activeBg = bgPreset === 'custom' ? customBg : bgPreset;
  const activeText = textPreset === 'custom' ? customText : textPreset;
  const lines = textInput
    .split('\n')
    .slice(0, 3)
    .filter((l) => l.length > 0);

  const redraw = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const scale = DISPLAY_SIZE / CARD_SIZE;
    renderCard(
      preview,
      lines,
      selectedEmoji.char,
      activeBg,
      activeText,
      fontSize,
      scale,
    );
  }, [lines, selectedEmoji, activeBg, activeText, fontSize]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const handleDownload = () => {
    const canvas = exportRef.current;
    if (!canvas) return;
    renderCard(
      canvas,
      lines,
      selectedEmoji.char,
      activeBg,
      activeText,
      fontSize,
      1,
    );
    downloadCanvas(canvas, `emoji-card-${selectedEmoji.slug}.png`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-3xl font-bold">Emoji Social Card Generator</h1>
        <p className="text-gray-500">
          Create a 1080×1080 social media card with an emoji background pattern
          and your own text.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Left — controls */}
        <div className="space-y-6">
          {/* Text */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Card text (up to 3 lines)
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={3}
              placeholder="Your message here"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
            <p className="text-xs text-gray-400">
              Press Enter to add a new line. Maximum 3 lines.
            </p>
          </div>

          {/* Emoji search */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Background pattern emoji
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emojis… e.g. sparkle, star, heart"
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
          </div>

          {/* Background color */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Background color
            </label>
            <div className="flex flex-wrap gap-2">
              {BG_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setBgPreset(p.value)}
                  title={p.label}
                  className={[
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                    bgPreset === p.value
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p.value === 'custom' ? (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{
                        background:
                          'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                      }}
                    />
                  ) : (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{ background: p.value }}
                    />
                  )}
                  <span className="text-gray-600">{p.label}</span>
                </button>
              ))}
            </div>
            {bgPreset === 'custom' && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => setCustomBg(e.target.value)}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-600">
                  {customBg}
                </span>
              </div>
            )}
          </div>

          {/* Text color */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Text color
            </label>
            <div className="flex flex-wrap gap-2">
              {TEXT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setTextPreset(p.value)}
                  title={p.label}
                  className={[
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                    textPreset === p.value
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {p.value === 'custom' ? (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{
                        background:
                          'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                      }}
                    />
                  ) : (
                    <span
                      className="w-6 h-6 rounded-md border"
                      style={{ background: p.value }}
                    />
                  )}
                  <span className="text-gray-600">{p.label}</span>
                </button>
              ))}
            </div>
            {textPreset === 'custom' && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="color"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <span className="text-sm font-mono text-gray-600">
                  {customText}
                </span>
              </div>
            )}
          </div>

          {/* Font size */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Font size
            </label>
            <div className="flex gap-2">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFontSize(f.value)}
                  className={[
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                    fontSize === f.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  {f.label}
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
                (exports at 1080×1080)
              </span>
            </p>

            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 p-4">
              <canvas
                ref={previewRef}
                width={DISPLAY_SIZE}
                height={DISPLAY_SIZE}
                className="block rounded-xl shadow-lg"
                style={{ imageRendering: 'auto' }}
              />
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
              {downloaded ? '✅ Downloaded!' : '⬇️ Download 1080×1080 PNG'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free · Full resolution · No watermark
            </p>

            <canvas ref={exportRef} className="hidden" />
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="mt-14 pt-10 border-t space-y-6">
        <h2 className="text-xl font-semibold">
          How to use the Social Card Generator
        </h2>
        <ol className="space-y-4">
          {[
            [
              '✍️ Write your text',
              'Type up to 3 lines of text. Use it for a quote, an announcement, a product tagline, or a personal message.',
            ],
            [
              '✨ Choose a pattern emoji',
              'Pick an emoji that matches your vibe. It will tile subtly behind your text at 20% opacity, adding texture without overwhelming the message.',
            ],
            [
              '🎨 Pick your colors',
              'Choose a background from 8 presets or a custom color picker. Then choose a text color that contrasts well — white on dark, black on light.',
            ],
            [
              '⬇️ Download',
              'Click Download to get a full 1080×1080 PNG — the standard size for Instagram posts, Twitter cards, and LinkedIn shares.',
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
            Why use emoji-patterned social cards?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Social media algorithms favor visual content, and a well-designed
            1080×1080 image outperforms plain text posts on every major
            platform. Emoji-patterned backgrounds offer a fast,
            no-design-skills-needed way to make your posts stand out in a feed.
            The subtle tiled pattern adds depth and personality without
            distracting from the message — it is the visual equivalent of
            branded stationery.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Everything runs entirely in your browser using the HTML Canvas API.
            The card is rendered at full 1080×1080 resolution behind the scenes
            before download, so the output is always crisp regardless of your
            screen resolution or device.
          </p>
        </div>
      </div>
    </div>
  );
}
