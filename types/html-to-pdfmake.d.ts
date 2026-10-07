// Minimal typings for html-to-pdfmake (the package ships none).
declare module 'html-to-pdfmake' {
  import type { Content } from 'pdfmake/interfaces';
  export default function htmlToPdfmake(
    html: string,
    options?: {
      window?: Window;
      tableAutoSize?: boolean;
      removeExtraBlanks?: boolean;
      defaultStyles?: Record<string, Record<string, unknown>>;
      ignoreStyles?: string[];
    },
  ): Content;
}
