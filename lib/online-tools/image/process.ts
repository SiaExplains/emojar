// Browser-side image pipeline: decode → (worker) draw + encode → Blob.
// Files never leave the device; nothing here talks to the network.

import { ToolInputError } from '../engines/data';
import { MIME, type ImageFormat } from './core';
import { draw, plan, type RenderOptions } from './render';

export type ProcessedImage = { blob: Blob; width: number; height: number };

let worker: Worker | null = null;
let workerBroken = false;
let nextId = 1;
const pending = new Map<
  number,
  { resolve: (v: ProcessedImage) => void; reject: (e: Error) => void }
>();

function getWorker(): Worker | null {
  if (
    workerBroken ||
    typeof Worker === 'undefined' ||
    typeof OffscreenCanvas === 'undefined'
  )
    return null;
  if (!('convertToBlob' in OffscreenCanvas.prototype)) return null;
  if (!worker) {
    try {
      worker = new Worker(new URL('./image.worker.ts', import.meta.url), {
        type: 'module',
      });
      worker.onmessage = (
        e: MessageEvent<{
          id: number;
          blob?: Blob;
          width: number;
          height: number;
          error?: string;
        }>,
      ) => {
        const p = pending.get(e.data.id);
        if (!p) return;
        pending.delete(e.data.id);
        if (e.data.blob)
          p.resolve({
            blob: e.data.blob,
            width: e.data.width,
            height: e.data.height,
          });
        else p.reject(new Error(e.data.error ?? 'failed'));
      };
      worker.onerror = () => {
        workerBroken = true;
        pending.forEach((p) => p.reject(new Error('worker-failed')));
        pending.clear();
        worker?.terminate();
        worker = null;
      };
    } catch {
      workerBroken = true;
      return null;
    }
  }
  return worker;
}

const UNREADABLE =
  'This file could not be read as an image. Please make sure it is a valid JPG, PNG, WebP, GIF, BMP or SVG file.';

async function decodeSvg(
  file: Blob,
  targetWidth?: number,
): Promise<ImageBitmap> {
  const text = await file.text();
  // Give size-less SVGs an intrinsic size so they rasterize predictably.
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.documentElement;
  if (svg.nodeName.toLowerCase() !== 'svg' || doc.querySelector('parsererror'))
    throw new ToolInputError(
      'This SVG file could not be read. Please check that it is valid SVG markup.',
    );
  const vb = svg
    .getAttribute('viewBox')
    ?.split(/[\s,]+/)
    .map(Number);
  let w = parseFloat(svg.getAttribute('width') ?? '') || (vb && vb[2]) || 512;
  let h = parseFloat(svg.getAttribute('height') ?? '') || (vb && vb[3]) || 512;
  if (targetWidth) {
    h = (h * targetWidth) / w;
    w = targetWidth;
  }
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(h));
  const url = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(doc)], {
      type: 'image/svg+xml',
    }),
  );
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return await createImageBitmap(img, {
      resizeWidth: Math.round(w),
      resizeHeight: Math.round(h),
    });
  } catch {
    throw new ToolInputError(
      'This SVG could not be rendered. External images or fonts inside SVGs are not supported.',
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function decodeImage(
  file: Blob,
  opts: { svgWidth?: number } = {},
): Promise<ImageBitmap> {
  if (
    file.type === 'image/svg+xml' ||
    (file instanceof File && /\.svg$/i.test(file.name))
  ) {
    return decodeSvg(file, opts.svgWidth);
  }
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Some browsers can decode formats (e.g. BMP/ICO) via <img> but not createImageBitmap.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return await createImageBitmap(img);
    } catch {
      throw new ToolInputError(UNREADABLE);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

function renderOnMainThread(
  bitmap: ImageBitmap,
  options: RenderOptions,
): Promise<ProcessedImage> {
  const { canvas: size } = plan(bitmap.width, bitmap.height, options);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    throw new ToolInputError('Your browser could not create an image canvas.');
  draw(ctx, bitmap, bitmap.width, bitmap.height, options);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve({ blob, width: size.width, height: size.height })
          : reject(new ToolInputError('The image could not be encoded.')),
      MIME[options.format],
      options.quality,
    ),
  );
}

export async function renderBitmap(
  bitmap: ImageBitmap,
  options: RenderOptions,
): Promise<ProcessedImage> {
  const { canvas } = plan(bitmap.width, bitmap.height, options);
  if (canvas.width * canvas.height > 268_435_456) {
    bitmap.close();
    throw new ToolInputError(
      'The output image is too large. Please choose a smaller size.',
    );
  }
  const w = getWorker();
  let result: ProcessedImage;
  if (w) {
    const id = nextId++;
    try {
      result = await new Promise<ProcessedImage>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        w.postMessage({ id, bitmap, options }, [bitmap]);
      });
    } catch {
      throw new ToolInputError(
        'The image could not be processed. It may be too large for your device’s memory.',
      );
    }
  } else {
    result = await renderOnMainThread(bitmap, options);
  }
  if (result.blob.type !== MIME[options.format]) {
    throw new ToolInputError(
      `Your browser cannot create ${options.format.toUpperCase()} files. Try another format or a different browser (Chrome, Edge and Firefox support WebP export).`,
    );
  }
  return result;
}

export async function processImage(
  file: Blob,
  options: RenderOptions & { svgWidth?: number },
): Promise<ProcessedImage> {
  const bitmap = await decodeImage(file, { svgWidth: options.svgWidth });
  return renderBitmap(bitmap, options);
}

export async function imageSize(
  file: Blob,
): Promise<{ width: number; height: number }> {
  const bmp = await decodeImage(file);
  const size = { width: bmp.width, height: bmp.height };
  bmp.close();
  return size;
}

/** Reads raw pixels on the main thread (for pixel tools like background removal). */
export async function readPixels(file: Blob): Promise<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageData: ImageData;
}> {
  const bmp = await decodeImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx)
    throw new ToolInputError('Your browser could not create an image canvas.');
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  return {
    canvas,
    ctx,
    imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
  };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(new ToolInputError('The image could not be encoded.')),
      MIME[format],
      quality,
    ),
  );
}
