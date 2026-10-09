'use client';

import { useEffect, useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  FileDropzone,
  SelectField,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  useObjectUrl,
} from '../ui';
import { OCR_LANGUAGES } from './ocr-shared';

const LANGUAGES = OCR_LANGUAGES;

export default function ImageToTextTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState('eng');
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const url = useObjectUrl(file);

  // Paste an image from the clipboard (screenshots).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith('image/'),
      );
      if (item) {
        setFile(item);
        setText('');
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, []);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setText('');
    setProgress(0);
    setStatus('Loading OCR engine…');
    let worker: import('tesseract.js').Worker | null = null;
    try {
      const { createWorker } = await import('tesseract.js');
      worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          setStatus(
            m.status === 'recognizing text'
              ? 'Recognising text…'
              : m.status.charAt(0).toUpperCase() + m.status.slice(1),
          );
          setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      setText(data.text.trim());
      setConfidence(Math.round(data.confidence));
      if (!data.text.trim())
        setError(
          'No text was found. Try a sharper image, crop to the text, or pick the right language.',
        );
    } catch {
      setError(
        'The text could not be recognised. Check your internet connection (the OCR engine downloads on first use) and that the file is a valid image.',
      );
    } finally {
      await worker?.terminate();
      setBusy(false);
      setStatus('');
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFiles={(f) => (setFile(f[0]), setText(''))}
          label="Choose an image, or paste a screenshot (Ctrl/⌘ + V)"
          hint="JPG, PNG, WebP, BMP — sharp, straight text works best"
        />
      ) : (
        <div className="flex flex-wrap items-start gap-4">
          {url && (
            <img
              src={url}
              alt="Image to read"
              className="max-h-48 max-w-full rounded-xl border border-gray-100 object-contain"
            />
          )}
          <button
            type="button"
            className={btnSecondary}
            onClick={() => (setFile(null), setText(''), setConfidence(null))}
          >
            Choose another image
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <SelectField
          label="Text language"
          value={lang}
          onChange={setLang}
          options={LANGUAGES}
        />
        <button
          type="button"
          className={btnPrimary}
          onClick={run}
          disabled={!file || busy}
        >
          {busy ? 'Working…' : 'Extract text'}
        </button>
      </div>
      {busy && (
        <div className="space-y-1" role="status" aria-live="polite">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{status}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <ErrorMessage>{error}</ErrorMessage>
      {text && (
        <ToolOutput
          label="Extracted text"
          value={text}
          rows={12}
          mono={false}
          filename={outputName(file?.name ?? 'image', 'txt')}
          status={
            confidence !== null ? (
              <p className="text-xs text-gray-500">
                Average confidence: {confidence}%
              </p>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
