'use client';

// Video trimmer: cut a clip out of a video with mediabunny (WebCodecs).
// Fast mode copies the encoded media; precise mode re-encodes the cut.

import { useEffect, useRef, useState } from 'react';
import { fmtTime, parseTime } from '@/lib/online-tools/media/time';
import type { ToolProps } from '../ToolRenderer';
import {
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

const size = (n: number) =>
  n < 1048576
    ? `${(n / 1024).toFixed(0)} KB`
    : `${(n / 1048576).toFixed(1)} MB`;

function TimeInput({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (s: number) => void;
  max: number;
}) {
  const [text, setText] = useState(fmtTime(value));
  useEffect(() => setText(fmtTime(value)), [value]);
  return (
    <label className="block space-y-1 text-sm font-medium text-gray-700">
      {label}
      <input
        value={text}
        inputMode="decimal"
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const s = parseTime(text);
          if (Number.isFinite(s)) onChange(Math.min(max, s));
          else setText(fmtTime(value));
        }}
        className="block w-28 rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}

export default function VideoTrimmerTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [mode, setMode] = useState<'fast' | 'precise'>('fast');
  const [progress, setProgress] = useState<number | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    ext: string;
    duration: number;
    requested: number;
  } | null>(null);
  const [error, setError] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const signal = useRef<{ cancel?: () => void }>({});
  const srcUrl = useObjectUrl(file);
  const outUrl = useObjectUrl(result?.blob ?? null);
  const supported = typeof window !== 'undefined' && 'VideoDecoder' in window;

  const pick = (f: File) => {
    setFile(f);
    setResult(null);
    setError('');
    setDuration(0);
  };

  const run = async () => {
    if (!file) return;
    setError('');
    setResult(null);
    setProgress(0);
    signal.current = {};
    try {
      const { trimVideo } = await import('@/lib/online-tools/media/convert');
      const {
        blob,
        container,
        duration: got,
      } = await trimVideo(file, {
        start,
        end,
        precise: mode === 'precise',
        onProgress: setProgress,
        signal: signal.current,
      });
      setResult({
        blob,
        ext: container,
        duration: got,
        requested: end - start,
      });
    } catch (e) {
      if ((e as Error)?.name !== 'ConversionCanceledError')
        setError(
          friendlyError(
            e,
            'This video could not be trimmed. Your browser may not support its format — try Chrome or Edge, or an MP4 or WebM file.',
          ),
        );
    } finally {
      setProgress(null);
    }
  };

  const nowAt = () => video.current?.currentTime ?? 0;
  const clip = Math.max(0, end - start);
  const base = (file?.name ?? 'video').replace(/\.[^.]+$/, '');

  return (
    <div className="space-y-5">
      {!supported && (
        <Notice tone="amber">
          Your browser doesn’t support WebCodecs, which trimming needs. Use a
          recent Chrome, Edge or Safari (17+), or Firefox 130+.
        </Notice>
      )}
      {!file ? (
        <FileDropzone
          accept="video/*,.mp4,.webm,.mov,.m4v,.mkv"
          onFiles={(f) => pick(f[0])}
          label="Choose a video or drop it here"
          hint="MP4, WebM, MOV or MKV — the video stays on your device"
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 truncate text-sm text-gray-700">
            🎬 <strong>{file.name}</strong> · {size(file.size)}
          </p>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setFile(null)}
            disabled={progress !== null}
          >
            Choose another video
          </button>
        </div>
      )}

      {file && srcUrl && (
        <div className="space-y-4">
          <video
            ref={video}
            src={srcUrl}
            controls
            playsInline
            preload="metadata"
            className="max-h-80 w-full rounded-2xl bg-black"
            onLoadedMetadata={(e) => {
              const d = e.currentTarget.duration;
              const use = (sec: number) => {
                setDuration(sec);
                setStart(0);
                setEnd(sec);
              };
              if (Number.isFinite(d) && d > 0) use(d);
              else if (file)
                // Recorded WebM files often report Infinity; read the file.
                void import('@/lib/online-tools/media/convert')
                  .then((m) => m.mediaDuration(file))
                  .then((sec) =>
                    sec > 0
                      ? use(sec)
                      : setError('The length of this video could not be read.'),
                  )
                  .catch(() =>
                    setError(
                      'This video’s format can’t be read in your browser. Try an MP4 (H.264) or WebM file.',
                    ),
                  );
            }}
            onError={() =>
              setError(
                'Your browser can’t play this video, so it probably can’t trim it either. Try an MP4 (H.264) or WebM file.',
              )
            }
          />
          {duration > 0 && (
            <section aria-labelledby="trim-range" className="space-y-3">
              <h2 id="trim-range" className="sr-only">
                Trim range
              </h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-12">Start</span>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={start}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), end - 0.1);
                      setStart(v);
                      if (video.current) video.current.currentTime = v;
                    }}
                    className="flex-1 accent-indigo-600"
                    aria-valuetext={fmtTime(start)}
                  />
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-12">End</span>
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={end}
                    onChange={(e) => {
                      const v = Math.max(Number(e.target.value), start + 0.1);
                      setEnd(v);
                      if (video.current) video.current.currentTime = v;
                    }}
                    className="flex-1 accent-indigo-600"
                    aria-valuetext={fmtTime(end)}
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <TimeInput
                  label="Start"
                  value={start}
                  max={duration}
                  onChange={(s) => setStart(Math.min(s, end - 0.1))}
                />
                <TimeInput
                  label="End"
                  value={end}
                  max={duration}
                  onChange={(s) => setEnd(Math.max(s, start + 0.1))}
                />
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setStart(Math.min(nowAt(), end - 0.1))}
                >
                  Start = current frame
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setEnd(Math.max(nowAt(), start + 0.1))}
                >
                  End = current frame
                </button>
              </div>
              <p className="text-sm text-gray-600" aria-live="polite">
                Clip: {fmtTime(start)} → {fmtTime(end)} ({clip.toFixed(1)} s of{' '}
                {fmtTime(duration)})
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <SelectField
                  label="Cut mode"
                  value={mode}
                  onChange={(v) => setMode(v as 'fast' | 'precise')}
                  options={[
                    {
                      value: 'fast',
                      label: 'Fast — no quality loss (cuts at keyframes)',
                    },
                    {
                      value: 'precise',
                      label: 'Precise — exact frames (re-encodes)',
                    },
                  ]}
                />
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => void run()}
                  disabled={progress !== null || !supported || clip <= 0}
                >
                  {progress !== null ? 'Trimming…' : '✂️ Trim video'}
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
              {mode === 'fast' && (
                <p className="text-xs text-gray-500">
                  Fast mode copies the video as it is, so the clip may start a
                  little before your start time — at the previous keyframe
                  (often under 2 seconds, more for videos recorded in a
                  browser). Choose Precise for an exact cut.
                </p>
              )}
            </section>
          )}
        </div>
      )}

      {progress !== null && (
        <div className="space-y-1" role="status" aria-live="polite">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Trimming…</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>

      {result && outUrl && (
        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-900">
            Trimmed clip ready · {size(result.blob.size)} ·{' '}
            {result.ext.toUpperCase()} · {result.duration.toFixed(1)} s
          </p>
          {result.duration - result.requested > 0.5 && (
            <Notice tone="amber">
              This video has few keyframes, so the fast cut starts{' '}
              {(result.duration - result.requested).toFixed(1)} s before your
              start time. Choose Precise and trim again for an exact cut.
            </Notice>
          )}
          <video
            src={outUrl}
            controls
            playsInline
            className="max-h-72 w-full rounded-xl bg-black"
          />
          <button
            type="button"
            className={btnPrimary}
            onClick={() =>
              downloadBlob(result.blob, `${base}-trimmed.${result.ext}`)
            }
          >
            ⬇ Download clip
          </button>
        </div>
      )}
    </div>
  );
}
