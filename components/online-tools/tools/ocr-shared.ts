// Shared Tesseract.js setup for Image to Text and PDF to Text. The engine and
// language data download on first use; recognition runs in a Web Worker.

export const OCR_LANGUAGES = [
  { value: 'eng', label: 'English' },
  { value: 'deu', label: 'German' },
  { value: 'fra', label: 'French' },
  { value: 'spa', label: 'Spanish' },
  { value: 'ita', label: 'Italian' },
  { value: 'por', label: 'Portuguese' },
  { value: 'nld', label: 'Dutch' },
  { value: 'tur', label: 'Turkish' },
  { value: 'fas', label: 'Persian' },
  { value: 'ara', label: 'Arabic' },
  { value: 'rus', label: 'Russian' },
  { value: 'chi_sim', label: 'Chinese (simplified)' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'hin', label: 'Hindi' },
];

export type OcrStatus = { status: string; progress: number };

/** Friendly label for Tesseract's logger statuses. */
export const ocrStatusLabel = (s: string) =>
  s === 'recognizing text'
    ? 'Recognising text…'
    : s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Recognises several images with one worker (loaded once) and reports
 * per-image progress. The worker is always terminated.
 */
export async function recognizeAll(
  images: Blob[],
  lang: string,
  onStatus: (s: OcrStatus & { index: number }) => void,
  signal?: { cancelled: boolean },
): Promise<{ text: string; confidence: number }[]> {
  const { createWorker } = await import('tesseract.js');
  let index = 0;
  const worker = await createWorker(lang, 1, {
    logger: (m: { status: string; progress: number }) =>
      onStatus({ status: m.status, progress: m.progress, index }),
  });
  const out: { text: string; confidence: number }[] = [];
  try {
    for (index = 0; index < images.length; index++) {
      if (signal?.cancelled) break;
      const { data } = await worker.recognize(images[index]);
      out.push({ text: data.text.trim(), confidence: data.confidence });
    }
  } finally {
    await worker.terminate();
  }
  return out;
}
