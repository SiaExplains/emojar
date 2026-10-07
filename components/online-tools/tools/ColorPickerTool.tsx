'use client';

import { useEffect, useRef, useState } from 'react';
import {
  parseColor,
  rgbToHex,
  type RGB,
} from '@/lib/online-tools/engines/color';
import type { ToolProps } from '../ToolRenderer';
import { ErrorMessage, FileDropzone, btnSecondary, useObjectUrl } from '../ui';
import { ColorFormats } from './ColorConvertTool';

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> };

export default function ColorPickerTool(_: ToolProps) {
  const [color, setColor] = useState<RGB>({ r: 99, g: 102, b: 241 });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [hasEyeDropper, setHasEyeDropper] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const url = useObjectUrl(file);

  useEffect(() => setHasEyeDropper('EyeDropper' in window), []);

  useEffect(() => {
    if (!url || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      const max = 800;
      const f = Math.min(1, max / img.width);
      c.width = Math.round(img.width * f);
      c.height = Math.round(img.height * f);
      c.getContext('2d', { willReadFrequently: true })!.drawImage(
        img,
        0,
        0,
        c.width,
        c.height,
      );
    };
    img.onerror = () => setError('This image could not be loaded.');
    img.src = url;
  }, [url]);

  const pickScreen = async () => {
    try {
      const Ctor = (window as unknown as { EyeDropper: EyeDropperCtor })
        .EyeDropper;
      const res = await new Ctor().open();
      const c = parseColor(res.sRGBHex);
      if (c) setColor(c);
    } catch {
      // User cancelled the eyedropper.
    }
  };

  const pickFromCanvas = (clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * c.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * c.height);
    const [r, g, b] = c.getContext('2d')!.getImageData(x, y, 1, 1).data;
    setColor({ r, g, b });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="cp-input"
            className="block text-sm font-medium text-gray-700"
          >
            Choose a color
          </label>
          <input
            id="cp-input"
            type="color"
            value={rgbToHex(color)}
            onChange={(e) => setColor(parseColor(e.target.value)!)}
            className="h-12 w-24 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
          />
        </div>
        {hasEyeDropper && (
          <button type="button" className={btnSecondary} onClick={pickScreen}>
            💧 Pick from screen
          </button>
        )}
      </div>

      <ColorFormats color={color} />

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Pick a color from an image
        </h3>
        {!file ? (
          <FileDropzone
            accept="image/*"
            onFiles={(f) => (setError(''), setFile(f[0]))}
            hint="JPG, PNG, WebP, GIF…"
          />
        ) : (
          <div className="space-y-2">
            <canvas
              ref={canvasRef}
              onClick={(e) => pickFromCanvas(e.clientX, e.clientY)}
              className="max-h-[420px] max-w-full cursor-crosshair rounded-xl border border-gray-200"
              role="img"
              aria-label="Uploaded image — click to pick a color"
            />
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setFile(null)}
            >
              Use another image
            </button>
          </div>
        )}
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    </div>
  );
}
