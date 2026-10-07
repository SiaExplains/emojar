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

/** Builds an AudioBuffer from processed channels (for MP3 encoding). */
export function toAudioBuffer(
  channels: Float32Array[],
  sampleRate: number,
): AudioBuffer {
  const buf = new AudioBuffer({
    length: Math.max(1, channels[0]?.length ?? 1),
    numberOfChannels: Math.max(1, channels.length),
    sampleRate,
  });
  channels.forEach((c, i) =>
    buf.copyToChannel(c as Float32Array<ArrayBuffer>, i),
  );
  return buf;
}

export const channelsOf = (buf: AudioBuffer) =>
  Array.from({ length: buf.numberOfChannels }, (_, i) => buf.getChannelData(i));

/** Resamples with an OfflineAudioContext (e.g. 48 kHz → 44.1 kHz). */
export async function resample(
  buf: AudioBuffer,
  rate: number,
): Promise<AudioBuffer> {
  if (buf.sampleRate === rate) return buf;
  const ctx = new OfflineAudioContext(
    buf.numberOfChannels,
    Math.ceil(buf.duration * rate),
    rate,
  );
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
  return ctx.startRendering();
}
