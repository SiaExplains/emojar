'use client';

// Webcam and microphone tests. Streams stay in the page; nothing is uploaded.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  Notice,
  ResultRow,
  SelectField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  useObjectUrl,
} from '../ui';

function mediaError(e: unknown, kind: 'camera' | 'microphone'): string {
  const name = (e as { name?: string })?.name;
  if (name === 'NotAllowedError')
    return `${kind === 'camera' ? 'Camera' : 'Microphone'} access was blocked. Click the icon in the address bar, allow access, then try again.`;
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return `No ${kind} was found. Check that it is connected and enabled.`;
  if (name === 'NotReadableError')
    return `The ${kind} is in use by another app (e.g. Zoom, Teams or OBS) or blocked by the operating system.`;
  return `The ${kind} could not be started.`;
}

function useDevices(kind: MediaDeviceKind, active: boolean) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  useEffect(() => {
    if (!active || !navigator.mediaDevices?.enumerateDevices) return;
    const load = () =>
      navigator.mediaDevices
        .enumerateDevices()
        .then((d) => setDevices(d.filter((x) => x.kind === kind)));
    void load();
    navigator.mediaDevices.addEventListener('devicechange', load);
    return () =>
      navigator.mediaDevices.removeEventListener('devicechange', load);
  }, [kind, active]);
  return devices;
}

export function WebcamTestTool(_: ToolProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [deviceId, setDeviceId] = useState('');
  const [mirror, setMirror] = useState(true);
  const [fps, setFps] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [snapshot, setSnapshot] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const devices = useDevices('videoinput', !!stream);
  const snapUrl = useObjectUrl(snapshot);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setFps(null);
  }, [stream]);
  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  const start = async (id = deviceId) => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia)
      return setError(
        'Camera access is not available. Use a recent browser over HTTPS.',
      );
    try {
      stream?.getTracks().forEach((t) => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: id
          ? {
              deviceId: { exact: id },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            }
          : { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(s);
      setDeviceId(s.getVideoTracks()[0]?.getSettings().deviceId ?? id);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (e) {
      setError(mediaError(e, 'camera'));
    }
  };

  // Measure real frame rate from presented frames when supported.
  useEffect(() => {
    const v = videoRef.current as
      | (HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
          cancelVideoFrameCallback?: (h: number) => void;
        })
      | null;
    if (!stream || !v?.requestVideoFrameCallback) return;
    let frames = 0;
    let t0 = performance.now();
    let handle = 0;
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - t0 >= 1000) {
        setFps(Math.round((frames * 1000) / (now - t0)));
        frames = 0;
        t0 = now;
      }
      handle = v.requestVideoFrameCallback!(tick);
    };
    handle = v.requestVideoFrameCallback(tick);
    return () => v.cancelVideoFrameCallback?.(handle);
  }, [stream]);

  const takeSnapshot = () => {
    const v = videoRef.current;
    if (!v) return;
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext('2d')!;
    if (mirror) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    c.toBlob((b) => b && setSnapshot(b), 'image/png');
  };

  const track = stream?.getVideoTracks()[0];
  const settings = track?.getSettings();

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`aspect-video w-full object-contain ${mirror ? '-scale-x-100' : ''} ${stream ? '' : 'opacity-0'}`}
          aria-label="Live camera preview"
        />
        {!stream && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            Camera is off
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        {!stream ? (
          <button type="button" className={btnPrimary} onClick={() => start()}>
            📷 Start camera
          </button>
        ) : (
          <>
            <button type="button" className={btnSecondary} onClick={stop}>
              Stop camera
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={takeSnapshot}
            >
              Take snapshot
            </button>
          </>
        )}
        {devices.length > 1 && (
          <SelectField
            label="Camera"
            value={deviceId}
            onChange={(id) => void start(id)}
            options={devices.map((d, i) => ({
              value: d.deviceId,
              label: d.label || `Camera ${i + 1}`,
            }))}
          />
        )}
        <div className="pb-2">
          <Checkbox label="Mirror view" checked={mirror} onChange={setMirror} />
        </div>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {stream && settings && (
        <div
          className="rounded-2xl border border-gray-100 px-4"
          aria-live="polite"
        >
          <ResultRow label="Camera" value={track?.label || 'Unknown camera'} />
          <ResultRow
            label="Resolution"
            value={`${settings.width ?? '?'} × ${settings.height ?? '?'} px`}
          />
          <ResultRow
            label="Frame rate (measured)"
            value={
              fps
                ? `${fps} fps`
                : settings.frameRate
                  ? `${Math.round(settings.frameRate)} fps (reported)`
                  : 'measuring…'
            }
          />
          <ResultRow
            label="Aspect ratio"
            value={
              settings.width && settings.height
                ? (settings.width / settings.height).toFixed(2)
                : '—'
            }
          />
        </div>
      )}
      {stream && fps !== null && fps < 15 && (
        <Notice tone="amber">
          The frame rate is low. Better lighting often helps — many webcams
          lower their frame rate in dim light.
        </Notice>
      )}
      {snapUrl && (
        <div className="space-y-2">
          <img
            src={snapUrl}
            alt="Snapshot from your camera"
            className="max-h-56 rounded-xl border border-gray-100"
          />
          <button
            type="button"
            className={btnSecondary}
            onClick={() =>
              snapshot && downloadBlob(snapshot, 'webcam-snapshot.png')
            }
          >
            ⬇ Download snapshot
          </button>
        </div>
      )}
    </div>
  );
}

export function MicrophoneTestTool(_: ToolProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [deviceId, setDeviceId] = useState('');
  const [level, setLevel] = useState(0);
  const [peak, setPeak] = useState(0);
  const [processing, setProcessing] = useState(true);
  const [recording, setRecording] = useState(false);
  const [clip, setClip] = useState<Blob | null>(null);
  const [error, setError] = useState('');
  const devices = useDevices('audioinput', !!stream);
  const clipUrl = useObjectUrl(clip);
  const recRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!stream) return;
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    src.connect(analyser);
    const data = new Float32Array(analyser.fftSize);
    let raf = 0;
    const loop = () => {
      analyser.getFloatTimeDomainData(data);
      let sum = 0;
      let max = 0;
      for (const v of data) {
        sum += v * v;
        max = Math.max(max, Math.abs(v));
      }
      const rms = Math.sqrt(sum / data.length);
      // Map −60…0 dBFS to 0…1.
      const db = 20 * Math.log10(rms || 1e-8);
      setLevel(Math.max(0, Math.min(1, (db + 60) / 60)));
      // Same −60…0 dBFS scale as the bar, so the marker lines up with it.
      const peakDb = 20 * Math.log10(max || 1e-8);
      const peakPos = Math.max(0, Math.min(1, (peakDb + 60) / 60));
      setPeak((p) => Math.max(p - 0.003, peakPos));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      void ctx.close();
      stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const start = async (id = deviceId, proc = processing) => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia)
      return setError(
        'Microphone access is not available. Use a recent browser over HTTPS.',
      );
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...(id ? { deviceId: { exact: id } } : {}),
          echoCancellation: proc,
          noiseSuppression: proc,
          autoGainControl: proc,
        },
        video: false,
      });
      setStream(s);
      setDeviceId(s.getAudioTracks()[0]?.getSettings().deviceId ?? id);
    } catch (e) {
      setError(mediaError(e, 'microphone'));
    }
  };

  const record = () => {
    if (!stream || typeof MediaRecorder === 'undefined')
      return setError('Recording is not supported in this browser.');
    const chunks: Blob[] = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      setClip(new Blob(chunks, { type: rec.mimeType }));
      setRecording(false);
    };
    recRef.current = rec;
    rec.start();
    setRecording(true);
    window.setTimeout(() => rec.state === 'recording' && rec.stop(), 5000);
  };

  const pct = Math.round(level * 100);
  const zone =
    level > 0.92
      ? 'Too loud (clipping)'
      : level > 0.45
        ? 'Good level'
        : level > 0.15
          ? 'Quiet'
          : 'Silent / very quiet';

  return (
    <div className="space-y-5">
      {!stream ? (
        <button type="button" className={btnPrimary} onClick={() => start()}>
          🎙️ Start test
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className="space-y-1"
            role="meter"
            aria-label="Microphone input level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div className="flex justify-between text-xs text-gray-600">
              <span>Input level</span>
              <span>{zone}</span>
            </div>
            <div className="relative h-6 overflow-hidden rounded-full bg-gradient-to-r from-gray-200 via-emerald-200 to-red-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-red-500 transition-[width] duration-75"
                style={{ width: `${pct}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-gray-900"
                style={{ left: `${Math.min(100, Math.round(peak * 100))}%` }}
                aria-hidden
              />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {devices.length > 1 && (
              <SelectField
                label="Microphone"
                value={deviceId}
                onChange={(id) => {
                  setStream(null);
                  void start(id);
                }}
                options={devices.map((d, i) => ({
                  value: d.deviceId,
                  label: d.label || `Microphone ${i + 1}`,
                }))}
              />
            )}
            <button
              type="button"
              className={btnSecondary}
              onClick={record}
              disabled={recording}
            >
              {recording ? '● Recording 5 s…' : '⏺ Record 5 seconds'}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setStream(null)}
            >
              Stop
            </button>
          </div>
          <Checkbox
            label="Echo cancellation & noise suppression (like video calls)"
            checked={processing}
            onChange={(v) => {
              setProcessing(v);
              setStream(null);
              void start(deviceId, v);
            }}
          />
          <p className="text-xs text-gray-500">
            Device: {stream.getAudioTracks()[0]?.label || 'Unknown microphone'}
          </p>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {clipUrl && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            Your recording (stays on this device)
          </p>
          <audio controls src={clipUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}

export default WebcamTestTool;
