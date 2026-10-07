'use client';

// MP4 → MP3 and video → GIF, using native decoding (no FFmpeg).

import { useEffect, useRef, useState } from 'react';
import { formatBytes, outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  Checkbox,
  ConversionProgress,
  ErrorMessage,
  FileDropzone,
  NumberField,
  RangeField,
  SelectField,
  btnPrimary,
  btnSecondary,
  friendlyError,
  useObjectUrl,
} from '../ui';

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function FileHeader({ file, onReset }: { file: File; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-gray-700">
        🎬 <strong>{file.name}</strong> · {formatBytes(file.size)}
      </p>
      <button type="button" className={btnSecondary} onClick={onReset}>
        Choose another video
      </button>
    </div>
  );
}

export function Mp4ToMp3Tool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [kbps, setKbps] = useState('192');
  const [start, setStart] = useState('0');
  const [end, setEnd] = useState('');
  const [mono, setMono] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const url = useObjectUrl(file);
  const mp3Url = useObjectUrl(results[0]?.blob ?? null);

  const convert = async () => {
    if (!file) return;
    setError('');
    setResults([]);
    try {
      setStage('Decoding audio…');
      setProgress(0);
      const { decodeAudio, encodeMp3 } = await import(
        '@/lib/online-tools/media/audio'
      );
      const buffer = await decodeAudio(file);
      setStage('Encoding MP3…');
      const blob = await encodeMp3(buffer, {
        kbps: Number(kbps),
        start: Number(start) || 0,
        end: end ? Number(end) : undefined,
        mono,
        onProgress: setProgress,
      });
      setResults([
        {
          name: outputName(file.name, 'mp3'),
          blob,
          originalSize: file.size,
          note: `${kbps} kbps`,
        },
      ]);
    } catch (e) {
      setError(friendlyError(e, 'The audio could not be extracted.'));
    } finally {
      setStage('');
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="video/*,audio/*,.mp4,.mov,.m4v,.webm,.mkv"
        onFiles={(f) => setFile(f[0])}
        label="Choose a video (MP4, MOV, WebM)"
        hint="Audio files (M4A, WAV, OGG) work too"
      />
    );

  return (
    <div className="space-y-5">
      <FileHeader file={file} onReset={() => (setFile(null), setResults([]))} />
      {url && (
        <video
          src={url}
          controls
          className="max-h-56 w-full rounded-xl bg-black"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <SelectField
          label="Bitrate"
          value={kbps}
          onChange={setKbps}
          options={[
            { value: '96', label: '96 kbps — speech, smallest' },
            { value: '128', label: '128 kbps — podcasts' },
            { value: '192', label: '192 kbps — music (recommended)' },
            { value: '256', label: '256 kbps — high quality' },
            { value: '320', label: '320 kbps — maximum' },
          ]}
        />
        <NumberField
          label="Start at (seconds)"
          value={start}
          onChange={setStart}
          min={0}
          step="any"
        />
        <NumberField
          label={`End at (seconds${duration ? `, max ${duration.toFixed(1)}` : ''})`}
          value={end}
          onChange={setEnd}
          min={0}
          step="any"
        />
      </div>
      <Checkbox
        label="Mono (one channel, fine for speech)"
        checked={mono}
        onChange={setMono}
      />
      {duration > 0 && (
        <p className="text-xs text-gray-500">
          Estimated size: ~
          {formatBytes(
            (((end ? Number(end) : duration) - (Number(start) || 0)) *
              Number(kbps) *
              1000) /
              8,
          )}{' '}
          for {fmt((end ? Number(end) : duration) - (Number(start) || 0))}
        </p>
      )}
      <button
        type="button"
        className={btnPrimary}
        onClick={convert}
        disabled={!!stage}
      >
        {stage || 'Convert to MP3'}
      </button>
      {stage === 'Encoding MP3…' && (
        <ConversionProgress
          done={Math.round(progress * 100)}
          total={100}
          label="Encoding"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      <OutputList items={results} />
      {mp3Url && <audio controls src={mp3Url} className="w-full" />}
    </div>
  );
}

const MAX_FRAMES = 400;

export function VideoToGifTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState('0');
  const [length, setLength] = useState('4');
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState('480');
  const [loop, setLoop] = useState(true);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const url = useObjectUrl(file);
  const cancelRef = useRef(false);
  const gifUrl = useObjectUrl(results[0]?.blob ?? null);

  useEffect(() => () => void (cancelRef.current = true), []);

  const make = async () => {
    if (!file || !url) return;
    const s = Math.max(0, Number(start) || 0);
    const len = Math.max(
      0.2,
      Math.min(Number(length) || 1, duration ? duration - s : 60),
    );
    const frames = Math.min(MAX_FRAMES, Math.max(1, Math.round(len * fps)));
    if (len * fps > MAX_FRAMES)
      setError(
        `Limited to ${MAX_FRAMES} frames — lower the frame rate or shorten the clip for the full length.`,
      );
    else setError('');
    setBusy(true);
    setResults([]);
    cancelRef.current = false;
    try {
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = url;
      await new Promise<void>((res, rej) => {
        video.onloadeddata = () => res();
        video.onerror = () => rej(new Error('load'));
      });
      const w = Math.min(video.videoWidth, Math.max(32, Number(width) || 480));
      const h = Math.round((video.videoHeight * w) / video.videoWidth);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const gif = GIFEncoder();
      const delay = Math.round(1000 / fps);
      setProgress({ done: 0, total: frames });
      for (let i = 0; i < frames; i++) {
        if (cancelRef.current) return;
        const t = s + i / fps;
        await new Promise<void>((res) => {
          video.onseeked = () => res();
          video.currentTime = Math.min(t, video.duration - 0.01);
        });
        ctx.drawImage(video, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        const palette = quantize(data, 256);
        gif.writeFrame(applyPalette(data, palette), w, h, {
          palette,
          delay,
          repeat: loop ? 0 : -1,
        });
        setProgress({ done: i + 1, total: frames });
        // Yield so the progress bar paints.
        await new Promise((r) => setTimeout(r, 0));
      }
      gif.finish();
      const blob = new Blob([gif.bytes() as BlobPart], { type: 'image/gif' });
      setResults([
        {
          name: outputName(file.name, 'gif'),
          blob,
          width: w,
          height: h,
          note: `${frames} frames · ${fps} fps`,
        },
      ]);
      video.removeAttribute('src');
    } catch {
      setError(
        'This video could not be read. Your browser may not support its codec — try MP4 (H.264) or WebM.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (!file)
    return (
      <FileDropzone
        accept="video/*,.mp4,.mov,.m4v,.webm"
        onFiles={(f) => setFile(f[0])}
        label="Choose a video (MP4, WebM, MOV)"
        hint="Short clips work best"
      />
    );

  return (
    <div className="space-y-5">
      <FileHeader file={file} onReset={() => (setFile(null), setResults([]))} />
      {url && (
        <video
          src={url}
          controls
          muted
          className="max-h-56 w-full rounded-xl bg-black"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <NumberField
          label={`Start (s${duration ? ` of ${duration.toFixed(1)}` : ''})`}
          value={start}
          onChange={setStart}
          min={0}
          step="any"
        />
        <NumberField
          label="Length (seconds)"
          value={length}
          onChange={setLength}
          min={0.2}
          step="any"
        />
        <NumberField
          label="Width (px)"
          value={width}
          onChange={setWidth}
          min={32}
          max={1280}
        />
      </div>
      <RangeField
        label="Frame rate"
        value={fps}
        onChange={setFps}
        min={2}
        max={30}
        display={`${fps} fps`}
      />
      <Checkbox label="Loop forever" checked={loop} onChange={setLoop} />
      <button
        type="button"
        className={btnPrimary}
        onClick={make}
        disabled={busy}
      >
        {busy ? 'Creating GIF…' : 'Create GIF'}
      </button>
      {busy && (
        <ConversionProgress
          done={progress.done}
          total={progress.total}
          label="Frames"
        />
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {gifUrl && (
        <img
          src={gifUrl}
          alt="GIF preview"
          className="max-h-72 rounded-xl border border-gray-100"
        />
      )}
      <OutputList items={results} />
    </div>
  );
}

export default Mp4ToMp3Tool;
