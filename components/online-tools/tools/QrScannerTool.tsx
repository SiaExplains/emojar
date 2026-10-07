'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  FileDropzone,
  Notice,
  btnPrimary,
  btnSecondary,
} from '../ui';

type Detector = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};
type DetectorCtor = {
  new (opts: { formats: string[] }): Detector;
  getSupportedFormats?: () => Promise<string[]>;
};

async function nativeDetector(): Promise<Detector | null> {
  const Ctor = (globalThis as unknown as { BarcodeDetector?: DetectorCtor })
    .BarcodeDetector;
  if (!Ctor) return null;
  try {
    const formats = (await Ctor.getSupportedFormats?.()) ?? ['qr_code'];
    return formats.includes('qr_code')
      ? new Ctor({ formats: ['qr_code'] })
      : null;
  } catch {
    return null;
  }
}

/** Decodes a QR code from a canvas: native BarcodeDetector first, jsQR as fallback. */
async function decodeCanvas(
  canvas: HTMLCanvasElement,
  native: Detector | null,
): Promise<string | null> {
  if (native) {
    try {
      const found = await native.detect(canvas);
      if (found[0]) return found[0].rawValue;
    } catch {
      // Fall through to jsQR.
    }
  }
  const { default: jsQR } = await import('jsqr');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return (
    jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' })
      ?.data ?? null
  );
}

const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

export default function QrScannerTool(_: ToolProps) {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<Detector | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    setError('');
    setResult('');
    if (!navigator.mediaDevices?.getUserMedia)
      return setError(
        'Your browser does not support camera access. Upload an image instead.',
      );
    try {
      detectorRef.current = await nativeDetector();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setScanning(true);
      const canvas = document.createElement('canvas');
      let busy = false;
      const tick = async () => {
        if (!streamRef.current) return;
        if (!busy && video.readyState >= 2) {
          busy = true;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0);
          const text = await decodeCanvas(canvas, detectorRef.current);
          busy = false;
          if (text) {
            setResult(text);
            stop();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      stop();
      const name = (e as { name?: string })?.name;
      setError(
        name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow camera access in your browser settings, or upload an image instead.'
          : name === 'NotFoundError'
            ? 'No camera was found on this device. Upload an image instead.'
            : 'The camera could not be started. Upload an image instead.',
      );
    }
  };

  const scanFile = async (file: File) => {
    stop();
    setError('');
    setResult('');
    try {
      const bmp = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      // Downscale very large photos; QR detection does not need more than ~2000px.
      const f = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
      canvas.width = Math.round(bmp.width * f);
      canvas.height = Math.round(bmp.height * f);
      canvas
        .getContext('2d')
        ?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
      bmp.close();
      const text = await decodeCanvas(canvas, await nativeDetector());
      if (text) setResult(text);
      else
        setError(
          'No QR code was found in this image. Make sure the whole code is visible and in focus.',
        );
    } catch {
      setError('This file could not be read as an image.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {!scanning ? (
          <button type="button" className={btnPrimary} onClick={start}>
            📷 Start camera
          </button>
        ) : (
          <button type="button" className={btnSecondary} onClick={stop}>
            Stop camera
          </button>
        )}
      </div>
      <video
        ref={videoRef}
        playsInline
        muted
        className={`w-full max-w-md rounded-2xl border border-gray-200 bg-black ${scanning ? '' : 'hidden'}`}
        aria-label="Camera preview"
      />
      {scanning && (
        <p className="text-sm text-gray-500" role="status">
          Point the camera at a QR code…
        </p>
      )}
      <FileDropzone
        accept="image/*"
        onFiles={(f) => scanFile(f[0])}
        label="Or choose an image / screenshot with a QR code"
        hint="PNG, JPG, WebP…"
      />
      <ErrorMessage>{error}</ErrorMessage>
      {result && (
        <div className="space-y-2" aria-live="polite">
          <Notice tone="green">QR code found:</Notice>
          <pre className="whitespace-pre-wrap break-all rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-sm">
            {result}
          </pre>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={result} />
            {isUrl(result) && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={btnSecondary}
              >
                Open link ↗
              </a>
            )}
          </div>
          {isUrl(result) && (
            <p className="text-xs text-amber-800">
              Check the address carefully before opening — QR codes are often
              used for phishing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
