'use client';

import { useState } from 'react';
import { outputName } from '@/lib/online-tools/image/core';
import type { ToolProps } from '../ToolRenderer';
import { OutputList, type OutputItem } from '../image-results';
import {
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  btnPrimary,
  btnSecondary,
} from '../ui';

type PageSize = 'A4' | 'LETTER';
type Margin = 'normal' | 'narrow' | 'wide';

const MARGINS_PT: Record<Margin, number> = {
  normal: 72,
  narrow: 36,
  wide: 108,
};
const MARGINS_CSS: Record<Margin, string> = {
  normal: '25.4mm',
  narrow: '12.7mm',
  wide: '38.1mm',
};

/** Images pdfmake can embed; others are converted to PNG or dropped. */
async function toEmbeddable(
  contentType: string,
  base64: string,
): Promise<string> {
  if (/^image\/(png|jpe?g)$/i.test(contentType))
    return `data:${contentType};base64,${base64}`;
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(
      new Blob([bytes], { type: contentType }),
    );
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext('2d')!.drawImage(bmp, 0, 0);
    bmp.close();
    return c.toDataURL('image/png');
  } catch {
    return ''; // e.g. EMF/WMF drawings, which browsers can't decode
  }
}

async function docxToHtml(
  buf: ArrayBuffer,
): Promise<{ html: string; warnings: string[] }> {
  const mammoth = (await import('mammoth')).default;
  let dropped = 0;
  const result = await mammoth.convertToHtml(
    { arrayBuffer: buf },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const src = await toEmbeddable(
          image.contentType,
          await image.readAsBase64String(),
        );
        if (!src) dropped++;
        return { src };
      }),
    },
  );
  const { default: DOMPurify } = await import('dompurify');
  // Word documents can carry javascript: links; sanitise before display or printing.
  const html = DOMPurify.sanitize(result.value).replace(/<img src="">/g, '');
  const warnings: string[] = [];
  if (dropped)
    warnings.push(
      `${dropped} drawing${dropped === 1 ? '' : 's'} in a format browsers can’t display (such as EMF) ${dropped === 1 ? 'was' : 'were'} left out.`,
    );
  return { html, warnings };
}

export default function WordToPdfTool(_: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [html, setHtml] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [margin, setMargin] = useState<Margin>('normal');
  const [results, setResults] = useState<OutputItem[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async (f: File) => {
    setError('');
    setResults([]);
    if (/\.doc$/i.test(f.name) && !/\.docx$/i.test(f.name)) {
      setError(
        'Old .doc files aren’t supported. Open the file in Word, LibreOffice or Google Docs and save it as .docx first.',
      );
      return;
    }
    setBusy(true);
    try {
      const r = await docxToHtml(await f.arrayBuffer());
      if (!r.html.trim()) throw new Error('empty');
      setFile(f);
      setHtml(r.html);
      setWarnings(r.warnings);
    } catch {
      setError(
        'This file could not be read. Please make sure it is a Word document (.docx) and not password-protected.',
      );
    } finally {
      setBusy(false);
    }
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    setResults([]);
    try {
      const [
        { default: pdfMake },
        { default: vfs },
        { default: htmlToPdfmake },
      ] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts'),
        import('html-to-pdfmake'),
      ]);
      pdfMake.addVirtualFileSystem(vfs);
      const content = htmlToPdfmake(html, {
        window,
        tableAutoSize: true,
        removeExtraBlanks: true,
      });
      const m = MARGINS_PT[margin];
      const pdf = pdfMake.createPdf({
        content,
        pageSize,
        pageMargins: [m, m, m, m],
        defaultStyle: { font: 'Roboto', fontSize: 11, lineHeight: 1.25 },
        info: {
          title: file.name.replace(/\.docx$/i, ''),
          creator: 'Emojar Word to PDF',
        },
      });
      const blob = await pdf.getBlob();
      setResults([
        {
          name: outputName(file.name, 'pdf'),
          blob,
          note: `${pageSize === 'A4' ? 'A4' : 'US Letter'} · selectable text`,
        },
      ]);
    } catch {
      setError(
        'The PDF could not be created. Try “Print / Save as PDF” instead.',
      );
    } finally {
      setBusy(false);
    }
  };

  /** Uses the browser's own print engine: best layout fidelity, any language. */
  const print = () => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    iframe.setAttribute('sandbox', 'allow-modals allow-same-origin');
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) return;
    const title = (file?.name ?? 'document')
      .replace(/\.docx$/i, '')
      .replace(/[<>&"]/g, '');
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
@page { size: ${pageSize === 'A4' ? 'A4' : 'letter'}; margin: ${MARGINS_CSS[margin]}; }
body { font-family: Calibri, Carlito, Arial, sans-serif; font-size: 11pt; line-height: 1.35; color: #000; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
td, th { border: 1px solid #999; padding: 4pt 6pt; vertical-align: top; }
h1, h2, h3 { page-break-after: avoid; }
</style></head><body>${html}</body></html>`,
    );
    doc.close();
    const w = iframe.contentWindow;
    setTimeout(() => {
      w?.focus();
      w?.print();
      setTimeout(() => iframe.remove(), 1000);
    }, 300);
  };

  if (!file)
    return (
      <div className="space-y-3">
        <FileDropzone
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onFiles={(f) => load(f[0])}
          label={
            busy
              ? 'Reading document…'
              : 'Choose a Word document (.docx) or drop it here'
          }
          hint="Converted in your browser — the document is never uploaded"
        />
        <ErrorMessage>{error}</ErrorMessage>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-700">
          📝 <strong>{file.name}</strong>
        </p>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setFile(null);
            setHtml('');
            setResults([]);
          }}
        >
          Choose another document
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Page size"
          value={pageSize}
          onChange={(v) => setPageSize(v as PageSize)}
          options={[
            { value: 'A4', label: 'A4 (210 × 297 mm)' },
            { value: 'LETTER', label: 'US Letter (8.5 × 11 in)' },
          ]}
        />
        <SelectField
          label="Margins"
          value={margin}
          onChange={(v) => setMargin(v as Margin)}
          options={[
            { value: 'normal', label: 'Normal (2.54 cm / 1 in)' },
            { value: 'narrow', label: 'Narrow (1.27 cm / 0.5 in)' },
            { value: 'wide', label: 'Wide (3.81 cm / 1.5 in)' },
          ]}
        />
      </div>
      {warnings.map((w) => (
        <Notice key={w} tone="amber">
          {w}
        </Notice>
      ))}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={convert}
          disabled={busy}
        >
          {busy ? 'Converting…' : 'Convert to PDF'}
        </button>
        <button type="button" className={btnSecondary} onClick={print}>
          🖨 Print / Save as PDF
        </button>
      </div>
      <OutputList items={results} />
      <ErrorMessage>{error}</ErrorMessage>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Preview of the document content
        </p>
        <div
          className="prose prose-sm max-h-[520px] max-w-none overflow-auto rounded-xl border border-gray-200 bg-white p-6 [&_table]:border-collapse [&_td]:border [&_td]:border-gray-300 [&_td]:p-1.5"
          // Sanitised with DOMPurify in docxToHtml.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <Notice>
        “Convert to PDF” creates a PDF with selectable text in the Roboto font,
        which covers Latin, Greek and Cyrillic. Complex layouts — text boxes,
        columns, headers and footers, exact Word fonts — are simplified. For
        other languages or the closest look, use “Print / Save as PDF” and
        choose “Save as PDF” as the printer.
      </Notice>
    </div>
  );
}
