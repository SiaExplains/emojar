// Pure PCM helpers (no browser APIs) for the audio trimmer, converter and
// recorder: cutting, fades, mono mixdown, waveform peaks and WAV encoding.

/** Cuts [start, end) seconds out of each channel and applies linear fades. */
export function processChannels(
  channels: Float32Array[],
  sampleRate: number,
  opts: {
    start?: number;
    end?: number;
    fadeIn?: number;
    fadeOut?: number;
    mono?: boolean;
  } = {},
): Float32Array[] {
  const len = channels[0]?.length ?? 0;
  const from = Math.max(0, Math.floor((opts.start ?? 0) * sampleRate));
  const to = Math.min(
    len,
    Math.ceil((opts.end ?? len / sampleRate) * sampleRate),
  );
  let out = channels.map((c) => c.slice(from, Math.max(from, to)));
  if (opts.mono && out.length > 1) {
    const m = new Float32Array(out[0].length);
    for (const c of out)
      for (let i = 0; i < m.length; i++) m[i] += c[i] / out.length;
    out = [m];
  }
  const n = out[0]?.length ?? 0;
  const fi = Math.min(n, Math.floor((opts.fadeIn ?? 0) * sampleRate));
  const fo = Math.min(n, Math.floor((opts.fadeOut ?? 0) * sampleRate));
  for (const c of out) {
    for (let i = 0; i < fi; i++) c[i] *= i / fi;
    for (let i = 0; i < fo; i++) c[n - 1 - i] *= i / fo;
  }
  return out;
}

/** Interleaved 16-bit PCM WAV file. */
export function encodeWav(
  channels: Float32Array[],
  sampleRate: number,
): Uint8Array {
  const ch = Math.max(1, channels.length);
  const frames = channels[0]?.length ?? 0;
  const dataLen = frames * ch * 2;
  const buf = new ArrayBuffer(44 + dataLen);
  const v = new DataView(buf);
  const str = (o: number, s: string) =>
    [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + dataLen, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, ch, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * ch * 2, true);
  v.setUint16(32, ch * 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, dataLen, true);
  let o = 44;
  for (let i = 0; i < frames; i++)
    for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      o += 2;
    }
  return new Uint8Array(buf);
}

/** Max absolute amplitude per bucket, for drawing a waveform. */
export function peaks(channel: Float32Array, buckets: number): Float32Array {
  const out = new Float32Array(buckets);
  const size = channel.length / buckets;
  for (let b = 0; b < buckets; b++) {
    let max = 0;
    const end = Math.min(channel.length, Math.floor((b + 1) * size));
    for (let i = Math.floor(b * size); i < end; i++) {
      const a = Math.abs(channel[i]);
      if (a > max) max = a;
    }
    out[b] = max;
  }
  return out;
}

export const formatTime = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, '0')}`;
};
