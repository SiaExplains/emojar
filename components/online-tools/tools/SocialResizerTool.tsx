'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SOCIAL_PLATFORMS,
  containDest,
  type SocialPreset,
} from '@/lib/online-tools/image/layout';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
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
  keepFormat,
  makeCanvas,
  useImageFile,
  zipFiles,
  type CoverView,
} from './image-shared';

type Mode = 'crop' | 'fit-blur' | 'fit-color';

function render(
  bitmap: ImageBitmap,
  p: SocialPreset,
  mode: Mode,
  view: CoverView,
  bg: string,
) {
  const [canvas, ctx] = makeCanvas(p.w, p.h);
  if (mode === 'crop') {
    drawCover(ctx, bitmap, 0, 0, p.w, p.h, view);
    return canvas;
  }
  if (mode === 'fit-blur') {
    // Cheap, cross-browser blur: draw tiny, then scale up with smoothing.
    const sw = Math.max(8, Math.round(p.w / 24));
    const sh = Math.max(8, Math.round(p.h / 24));
    const [small, sctx] = makeCanvas(sw, sh);
    drawCover(sctx, bitmap, 0, 0, sw, sh);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(small, 0, 0, p.w, p.h);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, p.w, p.h);
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, p.w, p.h);
  }
  const d = containDest(bitmap.width, bitmap.height, p.w, p.h);
  ctx.drawImage(bitmap, d.x, d.y, d.w, d.h);
  return canvas;
}

export default function SocialResizerTool({ config }: ToolProps) {
  const fixed =
    typeof config.platform === 'string' && config.platform in SOCIAL_PLATFORMS
      ? config.platform
      : null;
  const { image, error, setError, load, clear } = useImageFile();
  const [platform, setPlatform] = useState(fixed ?? 'instagram');
  const [presetId, setPresetId] = useState(
    SOCIAL_PLATFORMS[fixed ?? 'instagram'].presets[0].id,
  );
  const [mode, setMode] = useState<Mode>('crop');
  const [view, setView] = useState<CoverView>(CENTERED);
  const [bg, setBg] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  const presets = SOCIAL_PLATFORMS[platform].presets;
  const preset = useMemo(
    () => presets.find((p) => p.id === presetId) ?? presets[0],
    [presets, presetId],
  );

  useEffect(() => {
    const c = previewRef.current;
    if (!c || !image || mode === 'crop') return;
    const scale = Math.min(1, 480 / Math.max(preset.w, preset.h));
    const small = {
      ...preset,
      w: Math.round(preset.w * scale),
      h: Math.round(preset.h * scale),
    };
    const r = render(image.bitmap, small, mode, view, bg);
    c.width = r.width;
    c.height = r.height;
    c.getContext('2d')?.drawImage(r, 0, 0);
  }, [image, preset, mode, view, bg]);

  const ext = image ? keepFormat(image.type) : 'jpg';
  const fileFor = (p: SocialPreset) =>
    `${baseName(image?.name ?? 'image')}-${SOCIAL_PLATFORMS[platform].name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-$/, '')}-${p.id}-${p.w}x${p.h}.${ext}`;

  const downloadOne = async () => {
    if (!image) return;
    try {
      downloadBlob(
        await canvasToBlob(
          render(image.bitmap, preset, mode, view, bg),
          ext,
          0.92,
        ),
        fileFor(preset),
      );
    } catch {
      setError('The image could not be exported.');
    }
  };

  const downloadAll = async () => {
    if (!image) return;
    setBusy(true);
    try {
      const files = [];
      for (const p of presets)
        files.push({
          name: fileFor(p),
          data: await canvasToBlob(
            render(image.bitmap, p, mode, view, bg),
            ext,
            0.92,
          ),
        });
      downloadBlob(
        await zipFiles(files),
        `${baseName(image.name)}-${platform}-all-sizes.zip`,
      );
    } catch {
      setError('The images could not be exported.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {!fixed && (
          <SelectField
            label="Platform"
            value={platform}
            onChange={(v) => {
              setPlatform(v);
              setPresetId(SOCIAL_PLATFORMS[v].presets[0].id);
              setView(CENTERED);
            }}
            options={Object.entries(SOCIAL_PLATFORMS).map(([k, v]) => ({
              value: k,
              label: v.name,
            }))}
          />
        )}
        <SelectField
          label="Size"
          value={preset.id}
          onChange={(v) => {
            setPresetId(v);
            setView(CENTERED);
          }}
          options={presets.map((p) => ({
            value: p.id,
            label: `${p.label} — ${p.w} × ${p.h}`,
          }))}
        />
        <SelectField
          label="How to fit"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: 'crop', label: 'Crop to fill (drag to position)' },
            { value: 'fit-blur', label: 'Fit whole image, blurred background' },
            { value: 'fit-color', label: 'Fit whole image, solid background' },
          ]}
        />
      </div>

      {!image ? (
        <FileDropzone
          onFiles={(f) => f[0] && load(f[0])}
          accept={IMAGE_ACCEPT}
          label="Choose an image or drop it here"
          hint={`Resize for ${SOCIAL_PLATFORMS[platform].name} without uploading it`}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-[minmax(0,480px)_1fr]">
          <div className="space-y-3">
            {mode === 'crop' ? (
              <>
                <CoverEditor
                  bitmap={image.bitmap}
                  aspect={preset.w / preset.h}
                  view={view}
                  onChange={setView}
                  maxWidth={480}
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
              </>
            ) : (
              <canvas
                ref={previewRef}
                aria-label="Preview"
                className="block h-auto max-w-full rounded-xl border border-gray-200"
              />
            )}
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              <strong>
                {SOCIAL_PLATFORMS[platform].name} · {preset.label}
              </strong>
              <br />
              {preset.w} × {preset.h} px · aspect{' '}
              {(preset.w / preset.h).toFixed(2)}:1
            </p>
            {(image.bitmap.width < preset.w ||
              image.bitmap.height < preset.h) && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Your image ({image.bitmap.width} × {image.bitmap.height} px) is
                smaller than this size, so it will be enlarged and may look
                soft.
              </p>
            )}
            {mode === 'fit-color' && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                Background
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-8 w-14 cursor-pointer rounded border border-gray-200"
                />
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={btnPrimary}
                onClick={downloadOne}
              >
                ⬇ Download {preset.w} × {preset.h}
              </button>
              <button
                type="button"
                className={btnSecondary}
                disabled={busy}
                onClick={downloadAll}
              >
                ⬇ All {SOCIAL_PLATFORMS[platform].name} sizes (ZIP)
              </button>
              <button type="button" className={btnSecondary} onClick={clear}>
                Choose another image
              </button>
            </div>
            {mode === 'crop' && (
              <p className="text-xs text-gray-500">
                “All sizes” keeps the same focus point for every size.
              </p>
            )}
          </div>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
