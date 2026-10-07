export type CategorySlug =
  | 'image-tools'
  | 'pdf-tools'
  | 'developer-tools'
  | 'text-tools'
  | 'color-tools'
  | 'calculators'
  | 'unit-converters'
  | 'security-generators'
  | 'date-time-tools'
  | 'audio-video-tools'
  | 'device-tests';

export type FAQItem = { q: string; a: string };

/**
 * Keys of the client components that render a tool's interactive UI. The
 * mapping from key → lazily loaded component lives in
 * components/online-tools/tool-components.tsx.
 */
export type ToolComponentKey =
  | 'text-transform'
  | 'text-stats'
  | 'text-case'
  | 'text-diff'
  | 'find-replace'
  | 'lorem-ipsum'
  | 'markdown-previewer'
  | 'regex-tester'
  | 'jwt-decoder'
  | 'cron-generator'
  | 'uuid-generator'
  | 'hash-generator'
  | 'timestamp'
  | 'form-calculator'
  | 'unit-converter'
  | 'color-convert'
  | 'color-picker'
  | 'color-palette'
  | 'gradient-generator'
  | 'contrast-checker'
  | 'password-generator'
  | 'passphrase-generator'
  | 'random-number'
  | 'random-string'
  | 'qr-generator'
  | 'qr-scanner'
  | 'barcode-generator'
  | 'timezone-converter'
  | 'world-clock'
  | 'countdown'
  | 'image-converter'
  | 'image-compressor'
  | 'image-resizer'
  | 'image-cropper'
  | 'image-transform'
  | 'background-remover'
  | 'exif-viewer'
  | 'image-to-base64'
  | 'base64-to-image'
  | 'pdf-merge'
  | 'pdf-pages'
  | 'pdf-compress'
  | 'pdf-to-image'
  | 'pdf-to-text'
  | 'pdf-metadata'
  | 'heic-to-jpg'
  | 'image-to-text'
  | 'compress-to-size'
  | 'meme-generator'
  | 'pdf-sign'
  | 'pdf-page-numbers'
  | 'pdf-watermark'
  | 'pdf-protect'
  | 'fancy-text'
  | 'text-to-speech'
  | 'scientific-calculator'
  | 'gpa-calculator'
  | 'grade-calculator'
  | 'number-to-words'
  | 'roman-numerals'
  | 'wheel-spinner'
  | 'dice-roller'
  | 'coin-flip'
  | 'stopwatch'
  | 'timer'
  | 'mp4-to-mp3'
  | 'video-to-gif'
  | 'webcam-test'
  | 'microphone-test';

/** Serializable settings handed from the server page to the tool component. */
export type ToolConfig = Record<string, string | number | boolean>;

/**
 * A preset landing page of a tool (e.g. "JPG to PNG Converter" under the
 * Image Converter). Shares the tool's UI, gets its own URL, H1 and metadata.
 */
export type ToolVariant = {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  description: string;
  config: ToolConfig;
  keywords?: string[];
};

export type ToolDefinition = {
  slug: string;
  category: CategorySlug;
  /** Extra categories this tool is listed in. The URL stays under `category`. */
  alsoIn?: CategorySlug[];
  name: string;
  shortDescription: string;
  /** Answer-first intro paragraph shown directly under the H1. */
  description: string;
  title: string;
  metaDescription: string;
  icon: string;
  keywords: string[];
  relatedTools: string[];
  component: ToolComponentKey;
  config?: ToolConfig;
  howTo: string[];
  /** Paragraphs for the "What is …?" section. */
  about: string[];
  faqs: FAQItem[];
  /** True when the tool reads files — drives the privacy wording. */
  handlesFiles?: boolean;
  /** Honest note about a technical limitation, shown next to the tool. */
  limitation?: string;
  variants?: ToolVariant[];
  popular?: boolean;
};

export type CategoryDefinition = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  icon: string;
  title: string;
  metaDescription: string;
  intro: string;
  /** Tailwind classes for the category accent, matching the site palette. */
  accent: string;
};
