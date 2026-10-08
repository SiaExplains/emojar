// Browser re-encoding with mediabunny (WebCodecs): video compression and
// audio conversion to AAC/Opus. Loaded only on the pages that use it.

import { ToolInputError } from '../engines/data';

export type VideoQuality = 'high' | 'balanced' | 'small';

export async function compressVideo(
  file: File,
  opts: {
    container: 'mp4' | 'webm';
    quality: VideoQuality;
    maxHeight: number | null;
    removeAudio: boolean;
    onProgress: (p: number) => void;
    signal: { cancel?: () => void };
  },
): Promise<Blob> {
  const mb = await import('mediabunny');
  const videoCodec = opts.container === 'mp4' ? 'avc' : 'vp9';
  const audioCodec = opts.container === 'mp4' ? 'aac' : 'opus';
  if (!(await mb.canEncodeVideo(videoCodec)))
    throw new ToolInputError(
      `Your browser can’t encode ${opts.container === 'mp4' ? 'H.264 (MP4)' : 'VP9 (WebM)'} video. Try the other format, or a recent Chrome, Edge or Safari.`,
    );
  if (!opts.removeAudio && !(await mb.canEncodeAudio(audioCodec)))
    throw new ToolInputError(
      `Your browser can’t encode ${audioCodec === 'aac' ? 'AAC' : 'Opus'} audio for ${opts.container.toUpperCase()}. Tick “Remove audio”, or try the other format.`,
    );
  const quality =
    opts.quality === 'high'
      ? mb.QUALITY_HIGH
      : opts.quality === 'balanced'
        ? mb.QUALITY_MEDIUM
        : mb.QUALITY_LOW;
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const output = new mb.Output({
    format:
      opts.container === 'mp4'
        ? new mb.Mp4OutputFormat({ fastStart: 'in-memory' })
        : new mb.WebMOutputFormat(),
    target: new mb.BufferTarget(),
  });
  const track = await input.getPrimaryVideoTrack();
  if (!track)
    throw new ToolInputError('No video track was found in this file.');
  const h = track.displayHeight;
  // “720p” caps the shorter side, so portrait phone videos become 720×1280.
  const short = Math.min(track.displayWidth, h);
  const scale =
    opts.maxHeight && short > opts.maxHeight ? opts.maxHeight / short : 1;
  const conversion = await mb.Conversion.init({
    input,
    output,
    video: {
      codec: videoCodec,
      bitrate: quality,
      ...(scale < 1
        ? {
            height: Math.round((h * scale) / 2) * 2,
            width: Math.round((track.displayWidth * scale) / 2) * 2,
            fit: 'contain' as const,
          }
        : {}),
      forceTranscode: true,
    },
    audio: opts.removeAudio
      ? { discard: true }
      : { codec: audioCodec, bitrate: mb.QUALITY_MEDIUM },
  });
  if (!conversion.isValid)
    throw new ToolInputError(
      `This file can’t be converted here (${conversion.discardedTracks.map((d) => d.reason).join(', ') || 'unsupported codec'}).`,
    );
  conversion.onProgress = (p) => opts.onProgress(p);
  opts.signal.cancel = () => void conversion.cancel();
  await conversion.execute();
  const buf = (output.target as InstanceType<typeof mb.BufferTarget>).buffer;
  if (!buf) throw new ToolInputError('The conversion produced no data.');
  return new Blob([buf], {
    type: opts.container === 'mp4' ? 'video/mp4' : 'video/webm',
  });
}

export async function convertAudioWebCodecs(
  file: File,
  format: 'm4a' | 'ogg',
  kbps: number,
  onProgress: (p: number) => void,
): Promise<Blob> {
  const mb = await import('mediabunny');
  const codec = format === 'm4a' ? 'aac' : 'opus';
  if (!(await mb.canEncodeAudio(codec)))
    throw new ToolInputError(
      `Your browser can’t encode ${format === 'm4a' ? 'AAC (M4A)' : 'Opus (OGG)'}. Choose MP3 or WAV instead.`,
    );
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const output = new mb.Output({
    format:
      format === 'm4a' ? new mb.Mp4OutputFormat() : new mb.OggOutputFormat(),
    target: new mb.BufferTarget(),
  });
  const conversion = await mb.Conversion.init({
    input,
    output,
    video: { discard: true },
    audio: { codec, bitrate: kbps * 1000, forceTranscode: true },
  });
  if (!conversion.isValid)
    throw new ToolInputError(
      'No convertible audio track was found in this file.',
    );
  conversion.onProgress = (p) => onProgress(p);
  await conversion.execute();
  const buf = (output.target as InstanceType<typeof mb.BufferTarget>).buffer;
  if (!buf) throw new ToolInputError('The conversion produced no data.');
  return new Blob([buf], {
    type: format === 'm4a' ? 'audio/mp4' : 'audio/ogg',
  });
}

/** Output container for a trimmed copy: WebM stays WebM, everything else becomes MP4. */
export const trimContainer = (file: File): 'mp4' | 'webm' =>
  /webm/i.test(file.type) || /\.webm$/i.test(file.name) ? 'webm' : 'mp4';

/**
 * Cuts [start, end] seconds out of a video. “fast” copies the encoded media
 * (no quality loss, seconds even for long files) and may start at the
 * keyframe just before `start`; “precise” re-encodes for frame-exact cuts.
 */
export async function trimVideo(
  file: File,
  opts: {
    start: number;
    end: number;
    precise: boolean;
    onProgress: (p: number) => void;
    signal: { cancel?: () => void };
  },
): Promise<{ blob: Blob; container: 'mp4' | 'webm'; duration: number }> {
  if (!(opts.end > opts.start))
    throw new ToolInputError('The end must be after the start.');
  const mb = await import('mediabunny');
  const container = trimContainer(file);
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const output = new mb.Output({
    format:
      container === 'mp4'
        ? new mb.Mp4OutputFormat({ fastStart: 'in-memory' })
        : new mb.WebMOutputFormat(),
    target: new mb.BufferTarget(),
  });
  const conversion = await mb.Conversion.init({
    input,
    output,
    trim: { start: opts.start, end: opts.end },
    // Copying keeps quality and speed; it may begin at the previous keyframe.
    copy: opts.precise
      ? false
      : { boundaryPolicy: 'expand', shiftTolerance: Infinity },
  });
  if (!conversion.isValid)
    throw new ToolInputError(
      `This video can’t be trimmed in your browser (${conversion.discardedTracks.map((d) => d.reason).join(', ') || 'unsupported codec'}). Try Chrome or Edge, or convert it first.`,
    );
  conversion.onProgress = (p) => opts.onProgress(p);
  opts.signal.cancel = () => void conversion.cancel();
  await conversion.execute();
  const buf = (output.target as InstanceType<typeof mb.BufferTarget>).buffer;
  if (!buf) throw new ToolInputError('The trim produced no data.');
  const blob = new Blob([buf], {
    type: container === 'mp4' ? 'video/mp4' : 'video/webm',
  });
  // Report the real length: a fast cut can start well before `start` when
  // the video has few keyframes (common in browser recordings).
  const duration = await new mb.Input({
    source: new mb.BlobSource(blob),
    formats: mb.ALL_FORMATS,
  })
    .computeDuration()
    .catch(() => opts.end - opts.start);
  return { blob, container, duration };
}

/**
 * Duration in seconds read from the container itself. MediaRecorder WebM
 * files (including our own recordings) report Infinity to <video>, so the
 * trimmer can't rely on the element's duration.
 */
export async function mediaDuration(file: File): Promise<number> {
  const mb = await import('mediabunny');
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  return input.computeDuration();
}
