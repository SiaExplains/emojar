'use client';

import type { ToolProps } from '../ToolRenderer';
import { PdfStampTool } from './PdfStampTool';

export default function PdfWatermarkTool(_: ToolProps) {
  return <PdfStampTool kind="watermark" />;
}
