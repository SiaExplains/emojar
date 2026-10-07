'use client';

import { useEffect, useRef, useState } from 'react';
import { buildQrPayload, type QrContent } from '@/lib/online-tools/engines/qr';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  RangeField,
  SelectField,
  TextField,
  ToolInput,
  btnSecondary,
  downloadBlob,
} from '../ui';

type Kind = QrContent['type'];

export default function QrGeneratorTool(_: ToolProps) {
  const [kind, setKind] = useState<Kind>('url');
  const [url, setUrl] = useState('https://emojar.com/online-tool');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState({
    ssid: '',
    password: '',
    security: 'WPA' as 'WPA' | 'WEP' | 'nopass',
    hidden: false,
  });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState('');
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [ecl, setEcl] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dark, setDark] = useState('#111827');
  const [light, setLight] = useState('#ffffff');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const content: QrContent =
    kind === 'url'
      ? { type: 'url', url }
      : kind === 'text'
        ? { type: 'text', text }
        : kind === 'wifi'
          ? { type: 'wifi', ...wifi }
          : kind === 'email'
            ? { type: 'email', ...email }
            : kind === 'phone'
              ? { type: 'phone', phone }
              : { type: 'sms', phone, message: sms };
  const payload = buildQrPayload(content);
  const options = {
    errorCorrectionLevel: ecl,
    margin,
    width: size,
    color: { dark, light },
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!payload) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      try {
        const QRCode = (await import('qrcode')).default;
        if (cancelled) return;
        await QRCode.toCanvas(canvas, payload, options);
        setError('');
      } catch {
        if (!cancelled)
          setError(
            'This content is too long for a QR code. Shorten it or lower the error correction level.',
          );
      }
    })();
    return () => {
      cancelled = true;
    };
    // options is rebuilt each render from the primitive values listed here.
  }, [payload, size, margin, ecl, dark, light]);

  const downloadPng = () =>
    canvasRef.current?.toBlob(
      (b) => b && downloadBlob(b, 'qr-code.png'),
      'image/png',
    );
  const downloadSvg = async () => {
    const QRCode = (await import('qrcode')).default;
    const svg = await QRCode.toString(payload, { ...options, type: 'svg' });
    downloadBlob(svg, 'qr-code.svg', 'image/svg+xml');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <SelectField
          label="Content type"
          value={kind}
          onChange={(v) => setKind(v as Kind)}
          options={[
            { value: 'url', label: '🔗 Website / link' },
            { value: 'text', label: '📝 Plain text' },
            { value: 'wifi', label: '📶 Wi-Fi network' },
            { value: 'email', label: '✉️ Email' },
            { value: 'phone', label: '📞 Phone call' },
            { value: 'sms', label: '💬 SMS' },
          ]}
        />
        {kind === 'url' && (
          <TextField
            label="URL"
            value={url}
            onChange={setUrl}
            placeholder="https://example.com"
            type="url"
          />
        )}
        {kind === 'text' && (
          <ToolInput
            label="Text"
            value={text}
            onChange={setText}
            rows={4}
            mono={false}
          />
        )}
        {kind === 'wifi' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Network name (SSID)"
              value={wifi.ssid}
              onChange={(v) => setWifi({ ...wifi, ssid: v })}
            />
            <TextField
              label="Password"
              value={wifi.password}
              onChange={(v) => setWifi({ ...wifi, password: v })}
            />
            <SelectField
              label="Security"
              value={wifi.security}
              onChange={(v) =>
                setWifi({ ...wifi, security: v as 'WPA' | 'WEP' | 'nopass' })
              }
              options={[
                { value: 'WPA', label: 'WPA/WPA2/WPA3' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: 'None (open)' },
              ]}
            />
            <div className="pt-7">
              <Checkbox
                label="Hidden network"
                checked={wifi.hidden}
                onChange={(v) => setWifi({ ...wifi, hidden: v })}
              />
            </div>
          </div>
        )}
        {kind === 'email' && (
          <div className="space-y-3">
            <TextField
              label="Email address"
              value={email.to}
              onChange={(v) => setEmail({ ...email, to: v })}
              type="email"
            />
            <TextField
              label="Subject"
              value={email.subject}
              onChange={(v) => setEmail({ ...email, subject: v })}
            />
            <ToolInput
              label="Message"
              value={email.body}
              onChange={(v) => setEmail({ ...email, body: v })}
              rows={3}
              mono={false}
            />
          </div>
        )}
        {(kind === 'phone' || kind === 'sms') && (
          <TextField
            label="Phone number"
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder="+49 30 1234567"
          />
        )}
        {kind === 'sms' && (
          <ToolInput
            label="Message"
            value={sms}
            onChange={setSms}
            rows={3}
            mono={false}
          />
        )}

        <details className="rounded-2xl border border-gray-100 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-900">
            Design & size
          </summary>
          <div className="mt-3 space-y-4">
            <RangeField
              label="Size"
              value={size}
              onChange={setSize}
              min={128}
              max={1024}
              step={32}
              display={`${size}px`}
            />
            <RangeField
              label="Quiet zone (margin)"
              value={margin}
              onChange={setMargin}
              min={0}
              max={8}
            />
            <SelectField
              label="Error correction"
              value={ecl}
              onChange={(v) => setEcl(v as 'L' | 'M' | 'Q' | 'H')}
              options={[
                { value: 'L', label: 'Low (7%) — smallest code' },
                { value: 'M', label: 'Medium (15%) — recommended' },
                { value: 'Q', label: 'Quartile (25%)' },
                { value: 'H', label: 'High (30%) — for logos/print' },
              ]}
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="color"
                  value={dark}
                  onChange={(e) => setDark(e.target.value)}
                  className="h-8 w-12 rounded border border-gray-200"
                />{' '}
                Foreground
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="color"
                  value={light}
                  onChange={(e) => setLight(e.target.value)}
                  className="h-8 w-12 rounded border border-gray-200"
                />{' '}
                Background
              </label>
            </div>
          </div>
        </details>
      </div>

      <div className="flex flex-col items-center gap-3">
        <canvas
          ref={canvasRef}
          className="h-auto max-w-full rounded-xl border border-gray-100"
          style={{ width: Math.min(size, 320) }}
          role="img"
          aria-label={payload ? `QR code for ${payload}` : 'QR code preview'}
        />
        {!payload && (
          <p className="text-sm text-gray-400">
            Fill in the details to create your QR code.
          </p>
        )}
        <ErrorMessage>{error}</ErrorMessage>
        <div className="flex gap-2">
          <button
            type="button"
            className={btnSecondary}
            disabled={!payload || !!error}
            onClick={downloadPng}
          >
            ⬇ PNG
          </button>
          <button
            type="button"
            className={btnSecondary}
            disabled={!payload || !!error}
            onClick={downloadSvg}
          >
            ⬇ SVG
          </button>
        </div>
      </div>
    </div>
  );
}
