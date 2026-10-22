'use client';

import { useEffect, useState } from 'react';
import {
  SONY_RAW_EXT,
  formatShutter,
  isTiffBased,
  largestPreview,
  outputName,
} from '@/lib/online-tools/engines/arw';
import {
  decodeRaw,
  decodeUnavailableReason,
  type RawMetadata,
} from '@/lib/online-tools/engines/raw-decoder';
import { canvasToBlob } from '@/lib/online-tools/image/process';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, SelectedFiles, type OutputItem } from '../image-results';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  Notice,
  RangeField,
  SelectField,
  btnPrimary,
} from '../ui';

type Format = 'jpg' | 'png';

// The decoder needs a cross-origin-isolated page, and the COOP/COEP headers
// (next.config.ts) only apply to a full page load. When the tool is reached by
// an in-site link, reload once; the flag stops a loop if isolation still
// isn't available (old browser, privacy extension, embedded view).
const RELOAD_FLAG = 'emojar-arw-reloaded';
const ISOLATED_PREFIX = '/online-tool/image-tools/arw-converter';

function useIsolation(): void {
  useEffect(() => {
    if (window.crossOriginIsolated) {
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        // Storage blocked: nothing to clean up.
      }
      return;
    }
    try {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      return;
    }
    window.location.reload();
  }, []);

  // The isolated document blocks cross-origin embeds (ads) that other pages
  // use, so leave it with a full page load instead of a client-side one.
  useEffect(() => {
    if (!window.crossOriginIsolated) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || a.target === '_blank') return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith(ISOLATED_PREFIX)) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(url.href);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}

function describe(meta: RawMetadata): string {
  const parts = [
    [meta.camera_make, meta.camera_model].filter(Boolean).join(' '),
    meta.iso_speed ? `ISO ${meta.iso_speed}` : '',
    meta.shutter ? formatShutter(meta.shutter) : '',
    meta.aperture ? `f/${Math.round(meta.aperture * 10) / 10}` : '',
    meta.focal_len ? `${Math.round(meta.focal_len)} mm` : '',
  ];
  return parts.filter(Boolean).join(' · ');
}

async function encode(
  image: ImageData,
  format: Format,
  quality: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new Error(
      'The photo is too large for this browser. Turn on “Half size” and try again.',
    );
  ctx.putImageData(image, 0, 0);
  try {
    return await canvasToBlob(
      canvas,
      format,
      format === 'jpg' ? quality / 100 : undefined,
    );
  } finally {
    canvas.width = canvas.height = 0;
  }
}

/** Re-encodes an embedded JPEG preview (only needed for PNG output). */
async function encodePreview(
  jpeg: Uint8Array<ArrayBuffer>,
  format: Format,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const src = new Blob([jpeg], { type: 'image/jpeg' });
  const bmp = await createImageBitmap(src);
  const { width, height } = bmp;
  if (format === 'jpg' && quality >= 95) {
    bmp.close();
    return { blob: src, width, height };
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(bmp, 0, 0);
  bmp.close();
  const blob = await canvasToBlob(
    canvas,
    format,
    format === 'jpg' ? quality / 100 : undefined,
  );
  return { blob, width, height };
}

export default function RawConverterTool({ config }: ToolProps) {
  useIsolation();
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<Format>(
    config.format === 'png' ? 'png' : 'jpg',
  );
  const [quality, setQuality] = useState(92);
  const [autoWb, setAutoWb] = useState(false);
  const [bright, setBright] = useState(1);
  const [halfSize, setHalfSize] = useState(false);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState<string | null>(null);

  useEffect(() => setUnavailable(decodeUnavailableReason()), []);

  const convert = async () => {
    setBusy(true);
    setError('');
    setResults([]);
    const out: OutputItem[] = [];
    const failed: string[] = [];
    const reason = decodeUnavailableReason();
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const bytes = new Uint8Array(await f.arrayBuffer());
        if (!isTiffBased(bytes))
          throw new Error(`${f.name} is not a Sony RAW file.`);
        let item: OutputItem | null = null;
        if (!reason) {
          try {
            const { image, meta } = await decodeRaw(bytes, {
              useCameraWb: !autoWb,
              useAutoWb: autoWb,
              bright,
              halfSize,
            });
            item = {
              name: outputName(f.name, format),
              blob: await encode(image, format, quality),
              width: image.width,
              height: image.height,
              originalSize: f.size,
              note: describe(meta),
            };
          } catch {
            // Fall through to the embedded preview below.
          }
        }
        if (!item) {
          const jpeg = largestPreview(bytes);
          if (!jpeg) throw new Error(`${f.name} could not be decoded.`);
          const r = await encodePreview(jpeg, format, quality);
          item = {
            name: outputName(f.name, format),
            ...r,
            originalSize: f.size,
            note: 'embedded camera preview',
          };
        }
        out.push(item);
      } catch {
        failed.push(f.name);
      }
      setProgress({ done: i + 1, total: files.length });
      setResults([...out]);
    }
    if (failed.length)
      setError(
        `These files could not be converted: ${failed.join(', ')}. Make sure they are Sony .ARW, .SR2 or .SRF files; for very large photos, try “Half size”.`,
      );
    setBusy(false);
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        multiple
        accept=".arw,.sr2,.srf,image/x-sony-arw"
        onFiles={(list) => {
          const raw = list.filter((f) => SONY_RAW_EXT.test(f.name));
          if (raw.length < list.length)
            setError('Only Sony RAW files (.ARW, .SR2, .SRF) were added.');
          else setError('');
          setFiles((cur) => [...cur, ...raw]);
          setResults([]);
        }}
        label="Choose Sony ARW photos or drop them here"
        hint=".ARW, .SR2 or .SRF — decoded on your device, never uploaded"
      />
      {unavailable && (
        <Notice tone="amber">
          {unavailable} Full RAW decoding is off, so each photo is converted
          from the JPEG preview stored inside the ARW file; its size depends on
          the camera.
        </Notice>
      )}
      <SelectedFiles
        files={files}
        onRemove={(i) => setFiles((f) => f.filter((_, k) => k !== i))}
        onClear={() => (setFiles([]), setResults([]))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Convert to"
          value={format}
          onChange={(v) => setFormat(v as Format)}
          options={[
            { value: 'jpg', label: 'JPG — small, works everywhere' },
            { value: 'png', label: 'PNG — lossless, large files' },
          ]}
        />
        {format === 'jpg' ? (
          <RangeField
            label="JPG quality"
            value={quality}
            onChange={setQuality}
            min={60}
            max={100}
            display={`${quality}%`}
          />
        ) : (
          <div />
        )}
        <SelectField
          label="White balance"
          value={autoWb ? 'auto' : 'camera'}
          onChange={(v) => setAutoWb(v === 'auto')}
          options={[
            { value: 'camera', label: 'As shot (camera setting)' },
            { value: 'auto', label: 'Auto (calculated from the photo)' },
          ]}
        />
        <RangeField
          label="Brightness"
          value={bright}
          onChange={setBright}
          min={0.5}
          max={2}
          step={0.1}
          display={`${bright.toFixed(1)}×`}
        />
      </div>
      <div>
        <Checkbox
          label="Half size (4× fewer pixels, faster and lighter on phones)"
          checked={halfSize}
          onChange={setHalfSize}
        />
      </div>
      <button
        type="button"
        className={btnPrimary}
        onClick={convert}
        disabled={!files.length || busy}
      >
        {busy
          ? 'Converting…'
          : `Convert ${files.length || ''} photo${files.length === 1 ? '' : 's'} to ${format.toUpperCase()}`}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Decoding RAW"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} zipName={`arw-to-${format}.zip`} />
    </div>
  );
}
