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
  | 'device-tests'
  | 'reference-tools'
  | 'productivity-tools';

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
  | 'raw-converter'
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
  | 'microphone-test'
  | 'passport-photo'
  | 'profile-picture'
  | 'image-watermark'
  | 'blur-image'
  | 'photo-collage'
  | 'grid-splitter'
  | 'gif-maker'
  | 'favicon-generator'
  | 'social-resizer'
  | 'ascii-art'
  | 'pdf-crop'
  | 'pdf-edit'
  | 'pdf-form'
  | 'pdf-grayscale'
  | 'word-to-pdf'
  | 'readability'
  | 'invisible-text'
  | 'symbol-picker'
  | 'keyboard-tester'
  | 'screen-info'
  | 'dead-pixel'
  | 'browser-info'
  | 'svg-optimizer'
  | 'bcrypt'
  | 'json-diff'
  | 'url-parser'
  | 'ua-parser'
  | 'subnet-calculator'
  | 'chmod-calculator'
  | 'meta-tag-generator'
  | 'robots-txt'
  | 'http-status'
  | 'code-to-image'
  | 'totp'
  | 'cooking-converter'
  | 'size-converter'
  | 'alarm-clock'
  | 'calendar-maker'
  | 'time-card'
  | 'team-generator'
  | 'username-generator'
  | 'fake-data'
  | 'random-color'
  | 'invoice-generator'
  | 'email-signature'
  | 'password-strength'
  | 'audio-trimmer'
  | 'audio-converter'
  | 'video-compressor'
  | 'voice-recorder'
  | 'screen-recorder'
  | 'periodic-table'
  | 'world-time-map'
  | 'country-explorer'
  | 'flag-explorer'
  | 'color-names'
  | 'css-units'
  | 'flexbox-playground'
  | 'grid-playground'
  | 'box-shadow'
  | 'border-radius'
  | 'clip-path'
  | 'css-transform'
  | 'css-specificity'
  | 'typography'
  | 'svg-path'
  | 'bezier-curve'
  | 'gradient-mesh'
  | 'color-blindness'
  | 'pixel-art'
  | 'json-viewer'
  | 'http-request'
  | 'fen-chessboard'
  | 'decision-matrix'
  | 'eisenhower-matrix'
  | 'kanban-board'
  | 'timeline-maker'
  | 'typing-test'
  | 'resume-builder'
  | 'online-notepad'
  | 'flashcards'
  | 'utm-builder'
  | 'faq-schema'
  | 'article-schema'
  | 'social-preview'
  | 'reading-time'
  | 'keyword-density'
  | 'duplicate-words'
  | 'sentence-length'
  | 'palette-extractor'
  | 'image-color-picker'
  | 'json-schema'
  | 'html-to-jsx'
  | 'json-to-toml'
  | 'json-ld-validator'
  | 'markdown-table'
  | 'csv-to-markdown'
  | 'csv-viewer'
  | 'date-format'
  | 'keyboard-shortcuts'
  | 'unicode-explorer'
  | 'math-symbols'
  | 'html-entity-reference'
  | 'ascii-table'
  | 'molar-mass'
  | 'number-system'
  | 'morse-code'
  | 'braille'
  | 'measurement-reference'
  | 'video-trimmer';

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
  /**
   * No ads on this tool's pages. Needed where the page is cross-origin
   * isolated (COOP/COEP in next.config.ts), which blocks ad iframes.
   */
  noAds?: boolean;
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
};
