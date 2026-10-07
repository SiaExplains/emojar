'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BACKGROUNDS,
  LANGUAGES,
  THEMES,
  colorFor,
  htmlToLines,
  loadHighlighter,
  type Token,
} from '@/lib/online-tools/engines/code-image';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  RangeField,
  SelectField,
  TextField,
  ToolInput,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';

const SAMPLE = `// Debounce: run fn only after calls stop for \`wait\` ms
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 200,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`;

const FONT =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const MAX_LINES = 300;

export default function CodeToImageTool(_: ToolProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState(SAMPLE);
  const [language, setLanguage] = useState('typescript');
  const [detected, setDetected] = useState('');
  const [theme, setTheme] = useState('dark');
  const [bg, setBg] = useState('Ocean');
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(15);
  const [scale, setScale] = useState(2);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [title, setTitle] = useState('debounce.ts');
  const [lines, setLines] = useState<Token[][]>([]);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState('');

  // Highlight (lazy-loads highlight.js the first time).
  useEffect(() => {
    let cancelled = false;
    const text = code.replace(/\t/g, '  ').replace(/\s+$/, '');
    const t = window.setTimeout(async () => {
      try {
        const hljs = await loadHighlighter();
        const res =
          language === 'auto'
            ? hljs.highlightAuto(text)
            : hljs.highlight(text, { language, ignoreIllegals: true });
        if (cancelled) return;
        setDetected(language === 'auto' ? (res.language ?? 'plaintext') : '');
        setLines(htmlToLines(res.value).slice(0, MAX_LINES));
        setError(
          text.split('\n').length > MAX_LINES
            ? `Only the first ${MAX_LINES} lines are drawn.`
            : '',
        );
      } catch {
        if (!cancelled) setError('Could not highlight this code.');
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [code, language]);

  // Draw.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const th = THEMES[theme];
    const font = `${fontSize}px ${FONT}`;
    ctx.font = font;
    const charW = ctx.measureText('M').width;
    const lineH = Math.round(fontSize * 1.6);
    const gutter = lineNumbers ? (String(lines.length).length + 2) * charW : 0;
    const longest = Math.max(
      20,
      ...lines.map((l) => l.reduce((n, t) => n + t.text.length, 0)),
    );
    const innerPad = Math.round(fontSize * 1.4);
    const bar = chrome ? 40 : 0;
    const winW = Math.ceil(gutter + longest * charW + innerPad * 2);
    const winH = Math.ceil(
      bar + Math.max(1, lines.length) * lineH + innerPad * 2 - (chrome ? 8 : 0),
    );
    const pad = BACKGROUNDS[bg] ? padding : 0;
    const W = winW + pad * 2;
    const H = winH + pad * 2;
    c.width = Math.round(W * scale);
    c.height = Math.round(H * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const stops = BACKGROUNDS[bg];
    if (stops) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, stops[0]);
      g.addColorStop(1, stops[1]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    } else ctx.clearRect(0, 0, W, H);

    const r = stops ? 12 : 0;
    ctx.save();
    if (stops) {
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 16;
    }
    ctx.fillStyle = th.bg;
    ctx.beginPath();
    ctx.roundRect(pad, pad, winW, winH, r);
    ctx.fill();
    ctx.restore();

    if (chrome) {
      ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(pad + 20 + i * 20, pad + 20, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      if (title.trim()) {
        ctx.font = `${Math.round(fontSize * 0.85)}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillStyle = th.lineNo;
        ctx.textAlign = 'center';
        ctx.fillText(title.trim().slice(0, 60), pad + winW / 2, pad + 24);
        ctx.textAlign = 'left';
      }
    }

    ctx.font = font;
    ctx.textBaseline = 'alphabetic';
    const x0 = pad + innerPad + gutter;
    let y = pad + bar + innerPad + fontSize - (chrome ? 8 : 0);
    lines.forEach((line, i) => {
      if (lineNumbers) {
        ctx.fillStyle = th.lineNo;
        ctx.textAlign = 'right';
        ctx.fillText(String(i + 1), x0 - charW * 1.5, y);
        ctx.textAlign = 'left';
      }
      let x = x0;
      for (const t of line) {
        ctx.fillStyle = colorFor(th, t.scope);
        ctx.fillText(t.text, x, y);
        x += t.text.length * charW;
      }
      y += lineH;
    });
  }, [lines, theme, bg, padding, fontSize, scale, lineNumbers, chrome, title]);

  const toBlob = () =>
    new Promise<Blob>((resolve, reject) =>
      canvas.current?.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('empty'))),
        'image/png',
      ),
    );

  const copy = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': toBlob() }),
      ]);
      setCopyState('✓ Copied');
    } catch {
      setCopyState('Copy not supported — use Download');
    }
    window.setTimeout(() => setCopyState(''), 2000);
  };

  return (
    <div className="space-y-5">
      <ToolInput
        label="Code"
        value={code}
        onChange={setCode}
        rows={10}
        actions={
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setCode('')}
            disabled={!code}
          >
            Clear
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField
          label="Language"
          value={language}
          onChange={setLanguage}
          options={LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
        />
        <SelectField
          label="Theme"
          value={theme}
          onChange={setTheme}
          options={Object.entries(THEMES).map(([value, t]) => ({
            value,
            label: t.name,
          }))}
        />
        <SelectField
          label="Background"
          value={bg}
          onChange={setBg}
          options={Object.keys(BACKGROUNDS).map((v) => ({
            value: v,
            label: v === 'None' ? 'None (transparent)' : v,
          }))}
        />
        <SelectField
          label="Export size"
          value={String(scale)}
          onChange={(v) => setScale(Number(v))}
          options={[
            { value: '1', label: '1× (small)' },
            { value: '2', label: '2× (sharp, recommended)' },
            { value: '3', label: '3× (print)' },
          ]}
        />
        <RangeField
          label="Padding"
          value={padding}
          onChange={setPadding}
          min={16}
          max={128}
          step={8}
          display={`${padding}px`}
        />
        <RangeField
          label="Font size"
          value={fontSize}
          onChange={setFontSize}
          min={11}
          max={24}
          display={`${fontSize}px`}
        />
        <TextField
          label="Window title"
          value={title}
          onChange={setTitle}
          placeholder="file name (optional)"
        />
        <div className="flex flex-col justify-end gap-2">
          <Checkbox
            label="Window buttons"
            checked={chrome}
            onChange={setChrome}
          />
          <Checkbox
            label="Line numbers"
            checked={lineNumbers}
            onChange={setLineNumbers}
          />
        </div>
      </div>
      {detected && (
        <p className="text-xs text-gray-500">Detected language: {detected}</p>
      )}
      <ErrorMessage>{error}</ErrorMessage>

      <div className="overflow-auto rounded-2xl border border-gray-100 bg-[conic-gradient(#f3f4f6_25%,#fff_0_50%,#f3f4f6_0_75%,#fff_0)] bg-[length:16px_16px] p-3">
        <canvas
          ref={canvas}
          role="img"
          aria-label="Code image preview"
          className="mx-auto block h-auto max-w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={!lines.length}
          onClick={async () =>
            downloadBlob(
              await toBlob(),
              `${(title.trim() || 'code').replace(/[^\w.-]+/g, '-')}.png`,
            )
          }
        >
          Download PNG
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => void copy()}
          disabled={!lines.length}
        >
          {copyState || 'Copy image'}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        The image is drawn in your browser with your system’s monospace font, so
        it can look slightly different on another computer. Your code is never
        uploaded.
      </p>
    </div>
  );
}
