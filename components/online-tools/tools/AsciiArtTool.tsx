'use client';

import { useMemo, useState } from 'react';
import { ASCII_CHARSETS, imageToAscii } from '@/lib/online-tools/image/ascii';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  CopyButton,
  ErrorMessage,
  FileDropzone,
  RangeField,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  IMAGE_ACCEPT,
  baseName,
  makeCanvas,
  useImageFile,
} from './image-shared';

const MONO = 'ui-monospace, Menlo, Consolas, "Courier New", monospace';

export default function AsciiArtTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [cols, setCols] = useState(100);
  const [charset, setCharset] = useState('standard');
  const [custom, setCustom] = useState('@#=-. ');
  const [invert, setInvert] = useState(false);
  const [color, setColor] = useState(false);

  // Downscale once per image; ASCII never needs more than ~4 px per character.
  const pixels = useMemo(() => {
    if (!image) return null;
    const scale = Math.min(
      1,
      1200 / Math.max(image.bitmap.width, image.bitmap.height),
    );
    const [, ctx] = makeCanvas(
      image.bitmap.width * scale,
      image.bitmap.height * scale,
    );
    ctx.drawImage(image.bitmap, 0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, [image]);

  const chars = charset === 'custom' ? custom : ASCII_CHARSETS[charset].chars;
  const result = useMemo(() => {
    if (!pixels || Array.from(chars).length < 2) return null;
    return imageToAscii(pixels, { cols, chars, invert, color });
  }, [pixels, cols, chars, invert, color]);

  const lines = result?.text.split('\n') ?? [];

  const downloadPng = async () => {
    if (!result) return;
    try {
      const fs = 14;

      const [probe] = makeCanvas(1, 1);
      const pctx = probe.getContext('2d')!;
      pctx.font = `${fs}px ${MONO}`;
      const cw = pctx.measureText('M').width;
      // Cells are sampled twice as tall as wide, so lines must be 2× the character width.
      const lh = Math.round(cw * 2);
      const [canvas, ctx] = makeCanvas(
        Math.ceil(cw * result.cols) + 32,
        lh * result.rows + 32,
      );
      ctx.fillStyle = invert ? '#111827' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fs}px ${MONO}`;
      ctx.textBaseline = 'top';
      const all = result.text.split('\n');
      for (let r = 0; r < result.rows; r++) {
        const line = all[r] ?? '';
        if (color && result.colors) {
          Array.from(line).forEach((ch, c) => {
            const [R, G, B] = result.colors![r * result.cols + c];
            ctx.fillStyle = `rgb(${R},${G},${B})`;
            ctx.fillText(ch, 16 + c * cw, 16 + r * lh);
          });
        } else {
          ctx.fillStyle = invert ? '#f9fafb' : '#111827';
          ctx.fillText(line, 16, 16 + r * lh);
        }
      }
      downloadBlob(
        await canvasToBlob(canvas, 'png'),
        `${baseName(image?.name ?? 'image')}-ascii.png`,
      );
    } catch {
      setError('The PNG could not be created. Try fewer columns.');
    }
  };

  if (!image)
    return (
      <div className="space-y-3">
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose an image or drop it here"
          hint="High-contrast images and portraits with a plain background work best"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RangeField
          label="Width"
          value={cols}
          onChange={setCols}
          min={20}
          max={240}
          display={`${cols} characters`}
        />
        <SelectField
          label="Characters"
          value={charset}
          onChange={setCharset}
          options={[
            ...Object.entries(ASCII_CHARSETS).map(([k, v]) => ({
              value: k,
              label: v.label,
            })),
            { value: 'custom', label: 'Custom' },
          ]}
        />
        {charset === 'custom' && (
          <TextField
            label="Dark → light characters"
            value={custom}
            onChange={setCustom}
            mono
          />
        )}
        <div className="space-y-2">
          <Checkbox
            label="Invert (for dark backgrounds)"
            checked={invert}
            onChange={setInvert}
          />
          <Checkbox label="Colour" checked={color} onChange={setColor} />
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              {result.cols} × {result.rows} characters
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={result.text} label="Copy text" />
              <button
                type="button"
                className={btnSecondary}
                onClick={() =>
                  downloadBlob(result.text, `${baseName(image.name)}-ascii.txt`)
                }
              >
                ⬇ .txt
              </button>
              <button
                type="button"
                className={btnPrimary}
                onClick={downloadPng}
              >
                ⬇ PNG
              </button>
            </div>
          </div>
          <pre
            aria-label="ASCII art"
            className={`max-h-[640px] overflow-auto rounded-xl p-4  ${invert ? 'bg-gray-900 text-gray-50' : 'bg-white text-gray-900'} border border-gray-200`}
            style={{
              fontFamily: MONO,
              lineHeight: 1.2,
              fontSize: `${Math.max(4, Math.min(12, 900 / cols))}px`,
            }}
          >
            {color && result.colors
              ? lines.map((line, r) => (
                  <div key={r}>
                    {Array.from(line).map((ch, c) => {
                      const [R, G, B] = result.colors![r * result.cols + c];
                      return (
                        <span key={c} style={{ color: `rgb(${R},${G},${B})` }}>
                          {ch}
                        </span>
                      );
                    })}
                  </div>
                ))
              : result.text}
          </pre>
        </div>
      )}
      <button type="button" className={btnSecondary} onClick={clear}>
        Choose another image
      </button>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
