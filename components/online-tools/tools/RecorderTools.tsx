'use client';

// Video compressor (WebCodecs via mediabunny), voice recorder and screen
// recorder (MediaRecorder). Everything stays in the browser's memory.

import { useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  friendlyError,
  useObjectUrl,
} from '../ui';

const mb = (n: number) =>
  n < 1048576
    ? `${(n / 1024).toFixed(0)} KB`
    : `${(n / 1048576).toFixed(1)} MB`;
const clock = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const stamp = () => {
  const d = new Date();
  const p2 = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}-${p2(d.getMinutes())}-${p2(d.getSeconds())}`;
};

function pickMime(kind: 'audio' | 'video'): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const list =
    kind === 'audio'
      ? [
          'audio/webm;codecs=opus',
          'audio/mp4',
          'audio/ogg;codecs=opus',
          'audio/webm',
        ]
      : [
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/mp4',
          'video/webm',
        ];
  return list.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
}
const extFor = (mime: string) =>
  mime.includes('mp4')
    ? mime.startsWith('audio')
      ? 'm4a'
      : 'mp4'
    : mime.includes('ogg')
      ? 'ogg'
      : 'webm';

function permissionError(e: unknown, what: string): string {
  const name = (e as { name?: string })?.name;
  if (name === 'NotAllowedError')
    return `Access to the ${what} was blocked. Allow it via the icon in the address bar and try again.`;
  if (name === 'NotFoundError') return `No ${what} was found.`;
  if (name === 'NotReadableError')
    return `The ${what} is busy — close other apps that use it.`;
  return `The ${what} couldn’t be started.`;
}

/* ------------------------------------------------------------------ */

export function VideoCompressorTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [container, setContainer] = useState<'mp4' | 'webm'>('mp4');
  const [quality, setQuality] = useState<'high' | 'balanced' | 'small'>(
    'balanced',
  );
  const [maxHeight, setMaxHeight] = useState('720');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const signal = useRef<{ cancel?: () => void }>({});
  const supported = typeof window !== 'undefined' && 'VideoEncoder' in window;
  const srcUrl = useObjectUrl(file);
  const outUrl = useObjectUrl(result);

  const run = async () => {
    if (!file) return;
    setError('');
    setResult(null);
    setProgress(0);
    signal.current = {};
    try {
      const { compressVideo } = await import(
        '@/lib/online-tools/media/convert'
      );
      setResult(
        await compressVideo(file, {
          container,
          quality,
          maxHeight: maxHeight === 'keep' ? null : Number(maxHeight),
          removeAudio,
          onProgress: setProgress,
          signal: signal.current,
        }),
      );
    } catch (e) {
      if ((e as Error)?.name !== 'ConversionCanceledError')
        setError(
          friendlyError(
            e,
            'This video could not be compressed. Try MP4/H.264 input or a different format.',
          ),
        );
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="space-y-5">
      {!supported && (
        <Notice tone="amber">
          Your browser doesn’t support WebCodecs video encoding, which this tool
          needs. Use a recent Chrome, Edge, Safari (16.4+) or Firefox (130+).
        </Notice>
      )}
      <FileDropzone
        accept="video/*"
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError('');
        }}
        label="Drop a video (MP4, MOV, WebM, MKV…)"
      />
      {file && (
        <>
          <p className="text-sm text-gray-700">
            {file.name} · {mb(file.size)}
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <SelectField
              label="Quality"
              value={quality}
              onChange={(v) => setQuality(v as 'high' | 'balanced' | 'small')}
              options={[
                { value: 'high', label: 'High (larger)' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'small', label: 'Smallest file' },
              ]}
            />
            <SelectField
              label="Max resolution"
              value={maxHeight}
              onChange={setMaxHeight}
              options={[
                { value: 'keep', label: 'Keep original' },
                { value: '1080', label: '1080p' },
                { value: '720', label: '720p' },
                { value: '480', label: '480p' },
                { value: '360', label: '360p' },
              ]}
            />
            <SelectField
              label="Format"
              value={container}
              onChange={(v) => setContainer(v as 'mp4' | 'webm')}
              options={[
                { value: 'mp4', label: 'MP4 (H.264 + AAC) — plays everywhere' },
                { value: 'webm', label: 'WebM (VP9 + Opus)' },
              ]}
            />
            <div className="flex items-end pb-2">
              <Checkbox
                label="Remove audio"
                checked={removeAudio}
                onChange={setRemoveAudio}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void run()}
              disabled={progress !== null || !supported}
            >
              {progress !== null
                ? `Compressing… ${Math.round(progress * 100)} %`
                : 'Compress video'}
            </button>
            {progress !== null && (
              <button
                type="button"
                className={btnSecondary}
                onClick={() => signal.current.cancel?.()}
              >
                Cancel
              </button>
            )}
          </div>
          {progress !== null && (
            <div
              className="h-2 overflow-hidden rounded-full bg-gray-100"
              role="progressbar"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-indigo-600 transition-[width]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {result && outUrl && file && (
        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-900">
            {mb(file.size)} → <strong>{mb(result.size)}</strong>{' '}
            {result.size < file.size
              ? `(${Math.round((1 - result.size / file.size) * 100)} % smaller)`
              : '(not smaller — try a lower quality or resolution)'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {srcUrl && (
              <video
                src={srcUrl}
                controls
                muted
                className="w-full rounded-lg bg-black"
                aria-label="Original"
              />
            )}
            <video
              src={outUrl}
              controls
              className="w-full rounded-lg bg-black"
              aria-label="Compressed"
            />
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              downloadBlob(
                result,
                `${file.name.replace(/\.[^.]+$/, '')}-compressed.${container}`,
              )
            }
          >
            Download compressed video
          </button>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Compression runs on your device using the browser’s hardware video
        encoder — the video is never uploaded. Long or 4K videos take a while
        and need free memory; keep the tab open until it finishes.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function useRecorder(kind: 'audio' | 'video') {
  const rec = useRef<MediaRecorder | null>(null);
  const streams = useRef<MediaStream[]>([]);
  const [state, setState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const timer = useRef<number | null>(null);
  const startedAt = useRef(0);
  const offset = useRef(0);

  const extraCleanup = useRef<(() => void) | null>(null);
  const cleanup = () => {
    extraCleanup.current?.();
    extraCleanup.current = null;
    streams.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streams.current = [];
    if (timer.current) window.clearInterval(timer.current);
  };
  useEffect(() => cleanup, []);

  const start = (
    stream: MediaStream,
    extra: MediaStream[] = [],
    onDone?: () => void,
  ) => {
    const mime = pickMime(kind);
    if (typeof MediaRecorder === 'undefined') {
      [stream, ...extra].forEach((st) =>
        st.getTracks().forEach((t) => t.stop()),
      );
      onDone?.();
      return setError('Recording isn’t supported in this browser.');
    }
    extraCleanup.current = onDone ?? null;
    streams.current = [stream, ...extra];
    const chunks: Blob[] = [];
    const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    r.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    r.onstop = () => {
      setBlob(new Blob(chunks, { type: r.mimeType || mime }));
      setState('idle');
      cleanup();
    };
    // If the user stops sharing from the browser's own bar, finish cleanly.
    stream
      .getTracks()
      .forEach((t) => (t.onended = () => r.state !== 'inactive' && r.stop()));
    rec.current = r;
    r.start(1000);
    setBlob(null);
    setError('');
    setState('recording');
    offset.current = 0;
    startedAt.current = Date.now();
    setElapsed(0);
    timer.current = window.setInterval(
      () =>
        setElapsed(offset.current + (Date.now() - startedAt.current) / 1000),
      250,
    );
  };
  const pause = () => {
    rec.current?.pause();
    offset.current += (Date.now() - startedAt.current) / 1000;
    if (timer.current) window.clearInterval(timer.current);
    setState('paused');
  };
  const resume = () => {
    rec.current?.resume();
    startedAt.current = Date.now();
    timer.current = window.setInterval(
      () =>
        setElapsed(offset.current + (Date.now() - startedAt.current) / 1000),
      250,
    );
    setState('recording');
  };
  const stop = () =>
    rec.current && rec.current.state !== 'inactive' && rec.current.stop();
  return {
    state,
    elapsed,
    blob,
    error,
    setError,
    start,
    pause,
    resume,
    stop,
    streams,
  };
}

export function VoiceRecorderTool(_: ToolProps) {
  const r = useRecorder('audio');
  const [level, setLevel] = useState(0);
  const [busy, setBusy] = useState(false);
  const url = useObjectUrl(r.blob);
  const meter = useRef<{ ctx: AudioContext; raf: number } | null>(null);

  const stopMeter = () => {
    if (meter.current) {
      cancelAnimationFrame(meter.current.raf);
      void meter.current.ctx.close();
      meter.current = null;
    }
    setLevel(0);
  };
  useEffect(() => stopMeter, []);
  useEffect(() => {
    if (r.state === 'idle') stopMeter();
  }, [r.state]);

  const begin = async () => {
    if (!navigator.mediaDevices?.getUserMedia)
      return r.setError(
        'Microphone access isn’t available. Use a recent browser over HTTPS.',
      );
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const data = new Uint8Array(an.fftSize);
      const tick = () => {
        an.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
        setLevel(peak);
        if (meter.current) meter.current.raf = requestAnimationFrame(tick);
      };
      meter.current = { ctx, raf: requestAnimationFrame(tick) };
      r.start(stream);
    } catch (e) {
      r.setError(permissionError(e, 'microphone'));
    }
  };

  const exportAs = async (format: 'mp3' | 'wav') => {
    if (!r.blob) return;
    setBusy(true);
    try {
      const audio = await import('@/lib/online-tools/media/audio');
      const { encodeWav } = await import('@/lib/online-tools/media/pcm');
      const buf = await audio.decodeAudio(r.blob);
      const out =
        format === 'wav'
          ? new Blob(
              [encodeWav(audio.channelsOf(buf), buf.sampleRate) as BlobPart],
              { type: 'audio/wav' },
            )
          : await audio.encodeMp3(
              buf.sampleRate > 48000 ? await audio.resample(buf, 48000) : buf,
              { kbps: 128 },
            );
      downloadBlob(out, `recording-${stamp()}.${format}`);
    } catch (e) {
      r.setError(friendlyError(e, 'The recording could not be converted.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 text-center">
        <p className="font-mono text-5xl tabular-nums text-gray-900">
          {clock(r.elapsed)}
        </p>
        <div
          className="mx-auto mt-4 h-3 max-w-sm overflow-hidden rounded-full bg-gray-200"
          aria-hidden
        >
          <div
            className={`h-full transition-[width] duration-75 ${level > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(100, level * 100)}%` }}
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {r.state === 'idle' ? (
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void begin()}
            >
              ● Start recording
            </button>
          ) : (
            <>
              {r.state === 'recording' ? (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={r.pause}
                >
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={r.resume}
                >
                  Resume
                </button>
              )}
              <button type="button" className={btnPrimary} onClick={r.stop}>
                ■ Stop
              </button>
            </>
          )}
        </div>
      </div>
      <ErrorMessage>{r.error}</ErrorMessage>
      {r.blob && url && (
        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <audio controls src={url} className="w-full" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              onClick={() =>
                downloadBlob(
                  r.blob!,
                  `recording-${stamp()}.${extFor(r.blob!.type)}`,
                )
              }
            >
              Download ({extFor(r.blob.type).toUpperCase()}, {mb(r.blob.size)})
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void exportAs('mp3')}
              disabled={busy}
            >
              Save as MP3
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => void exportAs('wav')}
              disabled={busy}
            >
              Save as WAV
            </button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        The recording stays in this tab’s memory and is never uploaded —
        download it before closing the page.
      </p>
    </div>
  );
}

export function ScreenRecorderTool(_: ToolProps) {
  const r = useRecorder('video');
  const [mic, setMic] = useState(false);
  const [systemAudio, setSystemAudio] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const url = useObjectUrl(r.blob);
  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getDisplayMedia;

  const begin = async () => {
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: systemAudio,
      });
      const extra: MediaStream[] = [];
      let stream = display;
      let mixCtx: AudioContext | null = null;
      if (mic) {
        try {
          const m = await navigator.mediaDevices.getUserMedia({ audio: true });
          extra.push(m);
          // Mix screen audio and microphone into one track.
          const ctx = new AudioContext();
          mixCtx = ctx;
          const dest = ctx.createMediaStreamDestination();
          if (display.getAudioTracks().length)
            ctx.createMediaStreamSource(display).connect(dest);
          ctx.createMediaStreamSource(m).connect(dest);
          stream = new MediaStream([
            ...display.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);
        } catch (e) {
          r.setError(
            permissionError(e, 'microphone') + ' Recording without it.',
          );
        }
      }
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise((res) => setTimeout(res, 1000));
      }
      setCountdown(0);
      r.start(stream, [display, ...extra], () => void mixCtx?.close());
    } catch (e) {
      if ((e as { name?: string })?.name !== 'NotAllowedError')
        r.setError(permissionError(e, 'screen capture'));
    }
  };

  return (
    <div className="space-y-5">
      {!supported && (
        <Notice tone="amber">
          Screen recording isn’t available in this browser. It works in desktop
          Chrome, Edge, Firefox and Safari; most phones don’t allow it from a
          web page — use the phone’s built-in screen recorder instead.
        </Notice>
      )}
      <div className="flex flex-wrap gap-4">
        <Checkbox
          label="Record system / tab audio (when offered)"
          checked={systemAudio}
          onChange={setSystemAudio}
        />
        <Checkbox label="Add my microphone" checked={mic} onChange={setMic} />
      </div>
      <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 text-center">
        <p className="font-mono text-5xl tabular-nums text-gray-900">
          {countdown ? `${countdown}…` : clock(r.elapsed)}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {r.state === 'idle' ? (
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void begin()}
              disabled={!supported || countdown > 0}
            >
              ● Choose screen and record
            </button>
          ) : (
            <>
              {r.state === 'recording' ? (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={r.pause}
                >
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={r.resume}
                >
                  Resume
                </button>
              )}
              <button type="button" className={btnPrimary} onClick={r.stop}>
                ■ Stop
              </button>
            </>
          )}
        </div>
      </div>
      <ErrorMessage>{r.error}</ErrorMessage>
      {r.blob && url && (
        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <video src={url} controls className="w-full rounded-lg bg-black" />
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              downloadBlob(
                r.blob!,
                `screen-recording-${stamp()}.${extFor(r.blob!.type)}`,
              )
            }
          >
            Download ({extFor(r.blob.type).toUpperCase()}, {mb(r.blob.size)})
          </button>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Your browser asks which screen, window or tab to share. The recording
        stays in memory and is never uploaded. WebM files play in browsers and
        VLC; convert to MP4 with the Video Compressor if an app needs it.
      </p>
    </div>
  );
}
