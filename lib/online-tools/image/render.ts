// Drawing step shared by the worker (OffscreenCanvas) and the main-thread
// fallback (HTMLCanvasElement). Order: crop → resize → rotate/flip.

import {
  computeSize,
  rotatedSize,
  type ImageFormat,
  type ResizeSpec,
} from './core';

export type CropRect = { x: number; y: number; width: number; height: number };

export type RenderOptions = {
  format: ImageFormat;
  /** 0–1, used by JPG and WebP. */
  quality?: number;
  resize?: ResizeSpec;
  rotate?: number;
  flipH?: boolean;
  flipV?: boolean;
  crop?: CropRect;
  /** Fill for transparent areas; JPG always gets one (default white). */
  background?: string;
};

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export function plan(srcW: number, srcH: number, o: RenderOptions) {
  const crop = o.crop
    ? {
        x: Math.max(0, Math.min(srcW - 1, Math.round(o.crop.x))),
        y: Math.max(0, Math.min(srcH - 1, Math.round(o.crop.y))),
        width: Math.max(1, Math.round(o.crop.width)),
        height: Math.max(1, Math.round(o.crop.height)),
      }
    : { x: 0, y: 0, width: srcW, height: srcH };
  crop.width = Math.min(crop.width, srcW - crop.x);
  crop.height = Math.min(crop.height, srcH - crop.y);
  const scaled = o.resize
    ? computeSize(crop.width, crop.height, o.resize)
    : { width: crop.width, height: crop.height };
  const canvas = rotatedSize(scaled.width, scaled.height, o.rotate ?? 0);
  return { crop, scaled, canvas };
}

export function draw(
  ctx: Ctx,
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  o: RenderOptions,
) {
  const { crop, scaled, canvas } = plan(srcW, srcH, o);
  const fill = o.background ?? (o.format === 'jpg' ? '#ffffff' : undefined);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(((o.rotate ?? 0) * Math.PI) / 180);
  ctx.scale(o.flipH ? -1 : 1, o.flipV ? -1 : 1);
  ctx.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    -scaled.width / 2,
    -scaled.height / 2,
    scaled.width,
    scaled.height,
  );
  ctx.restore();
  return canvas;
}
