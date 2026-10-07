// Encodes images off the main thread so large files never freeze the page.

import { MIME } from './core';
import { draw, plan, type RenderOptions } from './render';

type Request = { id: number; bitmap: ImageBitmap; options: RenderOptions };

// The project compiles against the DOM lib, so describe the worker scope locally.
const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

scope.onmessage = async (e) => {
  const { id, bitmap, options } = e.data;
  try {
    const { canvas: size } = plan(bitmap.width, bitmap.height, options);
    const canvas = new OffscreenCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no-context');
    draw(ctx, bitmap, bitmap.width, bitmap.height, options);
    bitmap.close();
    const blob = await canvas.convertToBlob({
      type: MIME[options.format],
      quality: options.quality,
    });
    scope.postMessage({ id, blob, width: size.width, height: size.height });
  } catch (err) {
    scope.postMessage({
      id,
      error: err instanceof Error ? err.message : 'failed',
    });
  }
};
