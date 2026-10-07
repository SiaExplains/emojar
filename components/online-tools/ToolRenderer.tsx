'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ToolComponentKey, ToolConfig } from '@/lib/online-tools/types';

export type ToolProps = { config: ToolConfig; toolName: string };

function Loading() {
  return (
    <div
      className="flex min-h-[220px] items-center justify-center text-sm text-gray-400"
      role="status"
    >
      Loading tool…
    </div>
  );
}

// Each tool is its own chunk and renders client-side only: tool UIs depend on
// browser APIs (File, Canvas, crypto, Intl time zones) and the current time.
const load = (loader: () => Promise<{ default: ComponentType<ToolProps> }>) =>
  dynamic(loader, { ssr: false, loading: Loading });

const COMPONENTS: Record<ToolComponentKey, ComponentType<ToolProps>> = {
  'text-transform': load(() => import('./tools/TextTransformTool')),
  'text-stats': load(() => import('./tools/TextStatsTool')),
  'text-case': load(() => import('./tools/TextCaseTool')),
  'text-diff': load(() => import('./tools/TextDiffTool')),
  'find-replace': load(() => import('./tools/FindReplaceTool')),
  'lorem-ipsum': load(() => import('./tools/LoremIpsumTool')),
  'markdown-previewer': load(() => import('./tools/MarkdownPreviewerTool')),
  'regex-tester': load(() => import('./tools/RegexTesterTool')),
  'jwt-decoder': load(() => import('./tools/JwtDecoderTool')),
  'cron-generator': load(() => import('./tools/CronGeneratorTool')),
  'uuid-generator': load(() => import('./tools/UuidGeneratorTool')),
  'hash-generator': load(() => import('./tools/HashGeneratorTool')),
  timestamp: load(() => import('./tools/TimestampTool')),
  'form-calculator': load(() => import('./tools/FormCalculatorTool')),
  'unit-converter': load(() => import('./tools/UnitConverterTool')),
  'color-convert': load(() => import('./tools/ColorConvertTool')),
  'color-picker': load(() => import('./tools/ColorPickerTool')),
  'color-palette': load(() => import('./tools/ColorPaletteTool')),
  'gradient-generator': load(() => import('./tools/GradientGeneratorTool')),
  'contrast-checker': load(() => import('./tools/ContrastCheckerTool')),
  'password-generator': load(() => import('./tools/PasswordGeneratorTool')),
  'passphrase-generator': load(() => import('./tools/PassphraseGeneratorTool')),
  'random-number': load(() => import('./tools/RandomNumberTool')),
  'random-string': load(() => import('./tools/RandomStringTool')),
  'qr-generator': load(() => import('./tools/QrGeneratorTool')),
  'qr-scanner': load(() => import('./tools/QrScannerTool')),
  'barcode-generator': load(() => import('./tools/BarcodeGeneratorTool')),
  'timezone-converter': load(() => import('./tools/TimezoneConverterTool')),
  'world-clock': load(() => import('./tools/WorldClockTool')),
  countdown: load(() => import('./tools/CountdownTool')),
  'image-converter': load(() => import('./tools/ImageConverterTool')),
  'image-compressor': load(() => import('./tools/ImageCompressorTool')),
  'image-resizer': load(() => import('./tools/ImageResizerTool')),
  'image-cropper': load(() => import('./tools/ImageCropperTool')),
  'image-transform': load(() => import('./tools/ImageTransformTool')),
  'background-remover': load(() => import('./tools/BackgroundRemoverTool')),
  'exif-viewer': load(() => import('./tools/ExifViewerTool')),
  'image-to-base64': load(() => import('./tools/ImageToBase64Tool')),
  'base64-to-image': load(() => import('./tools/Base64ToImageTool')),
  'pdf-merge': load(() => import('./tools/PdfMergeTool')),
  'pdf-pages': load(() => import('./tools/PdfPagesTool')),
  'pdf-compress': load(() => import('./tools/PdfCompressTool')),
  'pdf-to-image': load(() => import('./tools/PdfToImageTool')),
  'pdf-to-text': load(() => import('./tools/PdfToTextTool')),
  'pdf-metadata': load(() => import('./tools/PdfMetadataTool')),
};

export function ToolRenderer({
  component,
  config,
  toolName,
}: {
  component: ToolComponentKey;
  config: ToolConfig;
  toolName: string;
}) {
  const Component = COMPONENTS[component];
  return <Component config={config} toolName={toolName} />;
}
