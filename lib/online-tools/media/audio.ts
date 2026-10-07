// Browser-side audio extraction: decode with Web Audio, encode MP3 in a worker.

import { ToolInputError } from '../engines/data';

export async function decodeAudio(file: Blob): Promise<AudioBuffer> {
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AC();
  try {
    return await ctx.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new ToolInputError(
      'No audio track could be decoded. The video may have no sound, or use a codec your browser cannot play (try Chrome or Safari for MOV/HEVC files).',
    );
  } finally {
    void ctx.close();
  }
}

export function encodeMp3(
  buffer: AudioBuffer,
  opts: {
    kbps: number;
    start?: number;
    end?: number;
    mono?: boolean;
    onProgress?: (p: number) => void;
  },
): Promise<Blob> {
  const sr = buffer.sampleRate;
  const from = Math.max(0, Math.floor((opts.start ?? 0) * sr));
  const to = Math.min(
    buffer.length,
    Math.ceil((opts.end ?? buffer.duration) * sr),
  );
  if (to - from < sr * 0.1)
    return Promise.reject(
      new ToolInputError('The selected part is too short.'),
    );
  const left = buffer.getChannelData(0).slice(from, to);
  const right =
    !opts.mono && buffer.numberOfChannels > 1
      ? buffer.getChannelData(1).slice(from, to)
      : undefined;
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./mp3.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (
      e: MessageEvent<{
        progress?: number;
        done?: boolean;
        blob?: Blob;
        error?: boolean;
      }>,
    ) => {
      if (e.data.progress !== undefined) opts.onProgress?.(e.data.progress);
      if (e.data.done && e.data.blob) {
        worker.terminate();
        resolve(e.data.blob);
      }
      if (e.data.error) {
        worker.terminate();
        reject(new ToolInputError('The MP3 could not be encoded.'));
      }
    };
    worker.onerror = () => {
      worker.terminate();
      reject(
        new ToolInputError(
          'The MP3 encoder could not be started in this browser.',
        ),
      );
    };
    worker.postMessage({ left, right, sampleRate: sr, kbps: opts.kbps }, [
      left.buffer,
      ...(right ? [right.buffer] : []),
    ]);
  });
}
