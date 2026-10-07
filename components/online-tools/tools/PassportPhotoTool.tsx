'use client';

import { useMemo, useState } from 'react';
import {
  PASSPORT_PRESETS,
  SHEETS,
  mmToPx,
  sheetLayout,
} from '@/lib/online-tools/image/passport';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  NumberField,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
} from '../ui';
import {
  CENTERED,
  CoverEditor,
  IMAGE_ACCEPT,
  baseName,
  drawCover,
  makeCanvas,
  useImageFile,
  type CoverView,
} from './image-shared';

const DPI = 300;

export default function PassportPhotoTool(_: ToolProps) {
  const { image, error, setError, load, clear } = useImageFile();
  const [presetId, setPresetId] = useState('us');
  const [customW, setCustomW] = useState('35');
  const [customH, setCustomH] = useState('45');
  const [view, setView] = useState<CoverView>(CENTERED);
  const [sheetId, setSheetId] = useState('4x6');
  const [busy, setBusy] = useState(false);

  const preset = PASSPORT_PRESETS.find((p) => p.id === presetId);
  const size = useMemo(() => {
    if (preset)
      return { w: preset.widthMm, h: preset.heightMm, head: preset.head };
    const w = Number(customW);
    const h = Number(customH);
    return {
      w: w >= 10 && w <= 100 ? w : 35,
      h: h >= 10 && h <= 100 ? h : 45,
      head: [0.6, 0.75] as [number, number],
    };
  }, [preset, customW, customH]);

  const customInvalid =
    presetId === 'custom' &&
    !(
      Number(customW) >= 10 &&
      Number(customW) <= 100 &&
      Number(customH) >= 10 &&
      Number(customH) <= 100
    );
  const pxW = mmToPx(size.w, DPI);
  const pxH = mmToPx(size.h, DPI);

  const renderPhoto = () => {
    if (!image) throw new Error('No image');
    const [canvas, ctx] = makeCanvas(pxW, pxH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pxW, pxH);
    drawCover(ctx, image.bitmap, 0, 0, pxW, pxH, view);
    return canvas;
  };

  const downloadSingle = async () => {
    setBusy(true);
    try {
      const blob = await canvasToBlob(renderPhoto(), 'jpg', 0.95);
      downloadBlob(
        blob,
        `${baseName(image?.name ?? 'photo')}-passport-${Math.round(size.w)}x${Math.round(size.h)}mm.jpg`,
      );
    } catch {
      setError('The photo could not be created. Try a smaller image.');
    } finally {
      setBusy(false);
    }
  };

  const downloadSheet = async () => {
    setBusy(true);
    try {
      const photo = renderPhoto();
      const sheet = SHEETS.find((s) => s.id === sheetId) ?? SHEETS[0];
      const layout = sheetLayout(size.w, size.h, sheet, DPI);
      if (!layout.photos.length) {
        setError('This photo size does not fit on the chosen paper.');
        return;
      }
      const [canvas, ctx] = makeCanvas(layout.width, layout.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, layout.width, layout.height);
      for (const p of layout.photos) ctx.drawImage(photo, p.x, p.y, p.w, p.h);
      // Thin grey cut lines around every photo.
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      for (const p of layout.photos) ctx.strokeRect(p.x, p.y, p.w, p.h);
      const blob = await canvasToBlob(canvas, 'jpg', 0.95);
      downloadBlob(
        blob,
        `${baseName(image?.name ?? 'photo')}-passport-sheet-${sheet.id}-${layout.photos.length}x.jpg`,
      );
    } catch {
      setError('The print sheet could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const sheetCount = useMemo(() => {
    const sheet = SHEETS.find((s) => s.id === sheetId) ?? SHEETS[0];
    return sheetLayout(size.w, size.h, sheet, DPI).photos.length;
  }, [size, sheetId]);

  // Head guide: an oval whose height is the middle of the allowed range, with
  // the crown about 8–10 % below the top edge.
  const headH = ((size.head[0] + size.head[1]) / 2) * 100;
  const top = Math.max(4, (100 - headH) * 0.45);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Document"
          value={presetId}
          onChange={(v) => {
            setPresetId(v);
            setView(CENTERED);
          }}
          options={[
            ...PASSPORT_PRESETS.map((p) => ({ value: p.id, label: p.label })),
            { value: 'custom', label: 'Custom size (mm)' },
          ]}
        />
        {presetId === 'custom' && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Width"
              value={customW}
              onChange={setCustomW}
              min={10}
              max={100}
              suffix="mm"
            />
            <NumberField
              label="Height"
              value={customH}
              onChange={setCustomH}
              min={10}
              max={100}
              suffix="mm"
            />
          </div>
        )}
      </div>

      {customInvalid && (
        <p className="text-sm text-amber-800">
          Enter a width and height between 10 and 100 mm. Until then 35 × 45 mm
          is used.
        </p>
      )}
      {!image ? (
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose a portrait photo or drop it here"
          hint="Face the camera, plain light background, even lighting"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-[minmax(0,420px)_1fr]">
          <div className="space-y-3">
            <CoverEditor
              bitmap={image.bitmap}
              aspect={size.w / size.h}
              view={view}
              onChange={setView}
              background="#ffffff"
              overlay={
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <ellipse
                    cx="50"
                    cy={top + headH / 2}
                    rx={headH * 0.36 * (size.h / size.w)}
                    ry={headH / 2}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="0.6"
                    strokeDasharray="2 1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="#4f46e5"
                    strokeOpacity="0.35"
                    strokeWidth="0.3"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              }
            />
            <RangeField
              label="Zoom"
              value={view.zoom}
              onChange={(z) => setView({ ...view, zoom: z })}
              min={1}
              max={5}
              step={0.01}
              display={`${Math.round(view.zoom * 100)}%`}
            />
            <p className="text-xs text-gray-500">
              Drag the photo so the face fits the dashed oval: chin at the
              bottom of the oval, top of the head at the top, eyes level and
              centred.
            </p>
          </div>
          <div className="space-y-4">
            <Notice>
              Output: {Math.round(size.w * 10) / 10} ×{' '}
              {Math.round(size.h * 10) / 10} mm — {pxW} × {pxH} px at {DPI} DPI.
              Head height should be {Math.round(size.head[0] * size.h)}–
              {Math.round(size.head[1] * size.h)} mm.
            </Notice>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnPrimary}
                disabled={busy}
                onClick={downloadSingle}
              >
                ⬇ Download photo (JPG)
              </button>
              <button type="button" className={btnSecondary} onClick={clear}>
                Choose another photo
              </button>
            </div>
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <SelectField
                label="Print sheet"
                value={sheetId}
                onChange={setSheetId}
                options={SHEETS.map((s) => ({ value: s.id, label: s.label }))}
              />
              <p className="text-xs text-gray-500">
                {sheetCount} photos per sheet, with cut lines. Print at 100 % /
                “actual size” — not “fit to page”.
              </p>
              <button
                type="button"
                className={btnSecondary}
                disabled={busy}
                onClick={downloadSheet}
              >
                ⬇ Download print sheet (JPG)
              </button>
            </div>
          </div>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <Notice tone="amber">
        This tool sizes and crops your photo; it does not change the background
        or check every official rule (expression, glasses, lighting, photo age).
        Always compare with your government’s current photo requirements before
        submitting.
      </Notice>
    </div>
  );
}
