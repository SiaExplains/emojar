'use client';

// Audio trimmer (waveform + handles) and audio converter (MP3/WAV/M4A/OGG).

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  encodeWav,
  formatTime,
  peaks,
  processChannels,
} from '@/lib/online-tools/media/pcm';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  NumberField,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  friendlyError,
  useObjectUrl,
} from '../ui';

const baseName = (n: string) => n.replace(/\.[^.]+$/, '') || 'audio';
const kb = (n: number) =>
  n < 1048576
    ? `${(n / 1024).toFixed(0)} KB`
    : `${(n / 1048576).toFixed(1)} MB`;

async function encode(
  buffer: AudioBuffer,
  format: 'mp3' | 'wav',
  opts: {
    start: number;
    end: number;
    fadeIn: number;
    fadeOut: number;
    mono: boolean;
    kbps: number;
    onProgress?: (p: number) => void;
  },
): Promise<Blob> {
  const audio = await import('@/lib/online-tools/media/audio');
  const ch = processChannels(audio.channelsOf(buffer), buffer.sampleRate, opts);
  if (!ch[0] || ch[0].length < buffer.sampleRate * 0.05)
    throw Object.assign(new Error('The selected part is too short.'), {
      name: 'ToolInputError',
    });
  if (format === 'wav')
    return new Blob([encodeWav(ch, buffer.sampleRate) as BlobPart], {
      type: 'audio/wav',
    });
  // LAME supports up to 48 kHz; higher-rate sources are resampled first.
  let mp3Src = audio.toAudioBuffer(ch, buffer.sampleRate);
  if (mp3Src.sampleRate > 48000) mp3Src = await audio.resample(mp3Src, 48000);
  return audio.encodeMp3(mp3Src, {
    kbps: opts.kbps,
    onProgress: opts.onProgress,
  });
}

function Waveform({
  buffer,
  start,
  end,
  onChange,
  playhead,
}: {
  buffer: AudioBuffer;
  start: number;
  end: number;
  onChange: (s: number, e: number) => void;
  playhead: number | null;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drag = useRef<'start' | 'end' | null>(null);
  const data = useMemo(() => peaks(buffer.getChannelData(0), 600), [buffer]);
  const dur = buffer.duration;

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const w = (c.width = c.clientWidth * devicePixelRatio);
    const h = (c.height = 120 * devicePixelRatio);
    ctx.clearRect(0, 0, w, h);
    const bw = w / data.length;
    data.forEach((p, i) => {
      const t = (i / data.length) * dur;
      ctx.fillStyle = t >= start && t <= end ? '#4f46e5' : '#cbd5e1';
      const bh = Math.max(1, p * h * 0.9);
      ctx.fillRect(i * bw, (h - bh) / 2, Math.max(1, bw - 0.5), bh);
    });
    ctx.fillStyle = 'rgba(15,23,42,0.06)';
    ctx.fillRect(0, 0, (start / dur) * w, h);
    ctx.fillRect((end / dur) * w, 0, w - (end / dur) * w, h);
    if (playhead !== null) {
      ctx.fillStyle = '#e11d48';
      ctx.fillRect((playhead / dur) * w - 1, 0, 2 * devicePixelRatio, h);
    }
  }, [data, start, end, dur, playhead]);

  const timeAt = (clientX: number) => {
    const r = canvas.current!.getBoundingClientRect();
    return Math.min(dur, Math.max(0, ((clientX - r.left) / r.width) * dur));
  };

  return (
    <canvas
      ref={canvas}
      className="h-[120px] w-full cursor-ew-resize touch-none rounded-xl border border-gray-100 bg-white"
      role="img"
      aria-label={`Waveform, selection ${formatTime(start)} to ${formatTime(end)}`}
      onPointerDown={(e) => {
        const t = timeAt(e.clientX);
        drag.current =
          Math.abs(t - start) < Math.abs(t - end) ? 'start' : 'end';
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        if (drag.current === 'start') onChange(Math.min(t, end - 0.1), end);
        else onChange(start, Math.max(t, start + 0.1));
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const t = timeAt(e.clientX);
        if (drag.current === 'start') onChange(Math.min(t, end - 0.1), end);
        else onChange(start, Math.max(t, start + 0.1));
      }}
      onPointerUp={() => (drag.current = null)}
    />
  );
}

function useDecoded() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const load = async (f: File) => {
    setFile(f);
    setBuffer(null);
    setError('');
    setLoading(true);
    try {
      const { decodeAudio } = await import('@/lib/online-tools/media/audio');
      setBuffer(await decodeAudio(f));
    } catch (e) {
      setError(friendlyError(e, 'This file could not be decoded.'));
    } finally {
      setLoading(false);
    }
  };
  return { file, buffer, error, setError, loading, load };
}

/* ------------------------------------------------------------------ */

export function AudioTrimmerTool(_: ToolProps) {
  const { file, buffer, error, setError, loading, load } = useDecoded();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [fadeIn, setFadeIn] = useState('0');
  const [fadeOut, setFadeOut] = useState('0');
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playhead, setPlayhead] = useState<number | null>(null);
  const player = useRef<{
    ctx: AudioContext;
    src: AudioBufferSourceNode;
    t0: number;
    raf: number;
  } | null>(null);

  useEffect(() => {
    if (buffer) {
      setStart(0);
      setEnd(buffer.duration);
    }
  }, [buffer]);

  const stop = () => {
    const p = player.current;
    if (!p) return;
    cancelAnimationFrame(p.raf);
    try {
      p.src.stop();
    } catch {
      /* already stopped */
    }
    void p.ctx.close();
    player.current = null;
    setPlayhead(null);
  };
  useEffect(() => stop, []);

  const play = () => {
    if (!buffer) return;
    stop();
    const ctx = new AudioContext();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0, start, end - start);
    const t0 = ctx.currentTime;
    const tick = () => {
      if (!player.current) return;
      const t = start + (ctx.currentTime - t0);
      setPlayhead(t);
      if (t < end) player.current.raf = requestAnimationFrame(tick);
    };
    src.onended = stop;
    player.current = { ctx, src, t0, raf: requestAnimationFrame(tick) };
  };

  const save = async () => {
    if (!buffer || !file) return;
    setBusy(true);
    setError('');
    try {
      const blob = await encode(buffer, format, {
        start,
        end,
        fadeIn: Number(fadeIn) || 0,
        fadeOut: Number(fadeOut) || 0,
        mono: false,
        kbps: 192,
        onProgress: setProgress,
      });
      downloadBlob(blob, `${baseName(file.name)}-trimmed.${format}`);
    } catch (e) {
      setError(friendlyError(e, 'The audio could not be exported.'));
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="audio/*,video/*"
        onFiles={(f) => f[0] && void load(f[0])}
        label="Drop an audio or video file (MP3, WAV, M4A, OGG, MP4…)"
      />
      {loading && <p className="text-sm text-gray-500">Decoding audio…</p>}
      <ErrorMessage>{error}</ErrorMessage>
      {buffer && (
        <>
          <Waveform
            buffer={buffer}
            start={start}
            end={end}
            playhead={playhead}
            onChange={(s, e) => {
              setStart(s);
              setEnd(e);
            }}
          />
          <p className="text-xs text-gray-500">
            Drag on the waveform to move the start or end — the nearest handle
            follows.
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <NumberField
              label="Start (s)"
              value={start.toFixed(2)}
              onChange={(v) =>
                setStart(Math.min(Math.max(0, Number(v) || 0), end - 0.1))
              }
              min={0}
              step={0.1}
            />
            <NumberField
              label="End (s)"
              value={end.toFixed(2)}
              onChange={(v) =>
                setEnd(
                  Math.max(
                    Math.min(buffer.duration, Number(v) || 0),
                    start + 0.1,
                  ),
                )
              }
              min={0}
              step={0.1}
            />
            <NumberField
              label="Fade in (s)"
              value={fadeIn}
              onChange={setFadeIn}
              min={0}
              step={0.5}
            />
            <NumberField
              label="Fade out (s)"
              value={fadeOut}
              onChange={setFadeOut}
              min={0}
              step={0.5}
            />
          </div>
          <p className="text-sm text-gray-700">
            Selection: {formatTime(start)} → {formatTime(end)} (
            {(end - start).toFixed(1)} s of {buffer.duration.toFixed(1)} s)
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <button
              type="button"
              className={btnSecondary}
              onClick={playhead === null ? play : stop}
            >
              {playhead === null ? '▶ Play selection' : '■ Stop'}
            </button>
            <SelectField
              label="Save as"
              value={format}
              onChange={(v) => setFormat(v as 'mp3' | 'wav')}
              options={[
                { value: 'mp3', label: 'MP3 (192 kbps)' },
                { value: 'wav', label: 'WAV (lossless)' },
              ]}
            />
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void save()}
              disabled={busy}
            >
              {busy
                ? progress
                  ? `Encoding ${Math.round(progress * 100)} %…`
                  : 'Encoding…'
                : 'Download trimmed audio'}
            </button>
          </div>
        </>
      )}
      <p className="text-xs text-gray-500">
        Audio is decoded and cut in your browser — the file is never uploaded.
        Any format your browser can play works as input.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type OutFormat = 'mp3' | 'wav' | 'm4a' | 'ogg';

export function AudioConverterTool(_: ToolProps) {
  const { file, buffer, error, setError, loading, load } = useDecoded();
  const [format, setFormat] = useState<OutFormat>('mp3');
  const [kbps, setKbps] = useState('192');
  const [mono, setMono] = useState(false);
  const [rate, setRate] = useState('keep');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(
    null,
  );
  const url = useObjectUrl(result?.blob);

  const convert = async () => {
    if (!file || !buffer) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      let blob: Blob;
      if (format === 'm4a' || format === 'ogg') {
        const { convertAudioWebCodecs } = await import(
          '@/lib/online-tools/media/convert'
        );
        blob = await convertAudioWebCodecs(
          file,
          format,
          Number(kbps),
          setProgress,
        );
      } else {
        const audio = await import('@/lib/online-tools/media/audio');
        const src =
          rate === 'keep' ? buffer : await audio.resample(buffer, Number(rate));
        blob = await encode(src, format, {
          start: 0,
          end: src.duration,
          fadeIn: 0,
          fadeOut: 0,
          mono,
          kbps: Number(kbps),
          onProgress: setProgress,
        });
      }
      setResult({ blob, name: `${baseName(file.name)}.${format}` });
    } catch (e) {
      setError(friendlyError(e, 'The audio could not be converted.'));
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="audio/*,video/*"
        onFiles={(f) => f[0] && void load(f[0])}
        label="Drop an audio or video file to convert"
      />
      {loading && <p className="text-sm text-gray-500">Decoding audio…</p>}
      <ErrorMessage>{error}</ErrorMessage>
      {buffer && file && (
        <>
          <p className="text-sm text-gray-700">
            {file.name} · {kb(file.size)} · {buffer.duration.toFixed(1)} s ·{' '}
            {buffer.numberOfChannels === 1 ? 'mono' : 'stereo'} ·{' '}
            {buffer.sampleRate.toLocaleString('en-US')} Hz (as decoded by your
            browser)
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <SelectField
              label="Convert to"
              value={format}
              onChange={(v) => setFormat(v as OutFormat)}
              options={[
                { value: 'mp3', label: 'MP3' },
                { value: 'wav', label: 'WAV (16-bit, lossless)' },
                { value: 'm4a', label: 'M4A (AAC)' },
                { value: 'ogg', label: 'OGG (Opus)' },
              ]}
            />
            {format !== 'wav' && (
              <SelectField
                label="Bitrate"
                value={kbps}
                onChange={setKbps}
                options={['64', '96', '128', '160', '192', '256', '320'].map(
                  (k) => ({ value: k, label: `${k} kbps` }),
                )}
              />
            )}
            {(format === 'mp3' || format === 'wav') && (
              <SelectField
                label="Sample rate"
                value={rate}
                onChange={setRate}
                options={[
                  { value: 'keep', label: 'Keep original' },
                  { value: '48000', label: '48,000 Hz' },
                  { value: '44100', label: '44,100 Hz' },
                  { value: '22050', label: '22,050 Hz' },
                ]}
              />
            )}
            {(format === 'mp3' || format === 'wav') && (
              <div className="flex items-end pb-2">
                <Checkbox label="Mono" checked={mono} onChange={setMono} />
              </div>
            )}
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void convert()}
            disabled={busy}
          >
            {busy
              ? `Converting${progress ? ` ${Math.round(progress * 100)} %` : ''}…`
              : 'Convert'}
          </button>
        </>
      )}
      {result && url && (
        <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <audio controls src={url} className="w-full" />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => downloadBlob(result.blob, result.name)}
            >
              Download {result.name}
            </button>
            <span className="text-sm text-gray-700">
              {kb(result.blob.size)}
            </span>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Input can be any format your browser plays (MP3, WAV, M4A, AAC, OGG,
        FLAC in most browsers, and the sound of MP4/WebM videos). M4A and OGG
        output use your browser’s built-in encoders and aren’t available
        everywhere; MP3 and WAV always work.
      </p>
    </div>
  );
}
