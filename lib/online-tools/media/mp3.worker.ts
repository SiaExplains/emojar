// Encodes PCM audio to MP3 off the main thread with a LAME-based encoder.

import { Mp3Encoder } from '@breezystack/lamejs';

type Request = {
  left: Float32Array;
  right?: Float32Array;
  sampleRate: number;
  kbps: number;
};

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

function toInt16(f: Float32Array): Int16Array {
  const out = new Int16Array(f.length);
  for (let i = 0; i < f.length; i++) {
    const s = Math.max(-1, Math.min(1, f[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

scope.onmessage = (e) => {
  try {
    const { left, right, sampleRate, kbps } = e.data;
    const encoder = new Mp3Encoder(right ? 2 : 1, sampleRate, kbps);
    const l = toInt16(left);
    const r = right ? toInt16(right) : undefined;
    const chunks: Uint8Array[] = [];
    const block = 1152 * 20;
    for (let i = 0; i < l.length; i += block) {
      const buf = encoder.encodeBuffer(
        l.subarray(i, i + block),
        r?.subarray(i, i + block),
      );
      if (buf.length) chunks.push(new Uint8Array(buf));
      if ((i / block) % 20 === 0) scope.postMessage({ progress: i / l.length });
    }
    const end = encoder.flush();
    if (end.length) chunks.push(new Uint8Array(end));
    scope.postMessage({
      done: true,
      blob: new Blob(chunks as BlobPart[], { type: 'audio/mpeg' }),
    });
  } catch {
    scope.postMessage({ error: true });
  }
};
