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
  'heic-to-jpg': load(() => import('./tools/HeicToJpgTool')),
  'image-to-text': load(() => import('./tools/ImageToTextTool')),
  'compress-to-size': load(() => import('./tools/CompressToSizeTool')),
  'meme-generator': load(() => import('./tools/MemeGeneratorTool')),
  'passport-photo': load(() => import('./tools/PassportPhotoTool')),
  'profile-picture': load(() => import('./tools/ProfilePictureTool')),
  'image-watermark': load(() => import('./tools/WatermarkImageTool')),
  'blur-image': load(() => import('./tools/BlurImageTool')),
  'photo-collage': load(() => import('./tools/CollageMakerTool')),
  'grid-splitter': load(() => import('./tools/GridSplitterTool')),
  'gif-maker': load(() => import('./tools/GifMakerTool')),
  'favicon-generator': load(() => import('./tools/FaviconGeneratorTool')),
  'social-resizer': load(() => import('./tools/SocialResizerTool')),
  'ascii-art': load(() => import('./tools/AsciiArtTool')),
  'pdf-crop': load(() => import('./tools/PdfCropTool')),
  'pdf-edit': load(() => import('./tools/PdfEditTool')),
  'pdf-form': load(() => import('./tools/PdfFormTool')),
  'pdf-grayscale': load(() => import('./tools/PdfGrayscaleTool')),
  'word-to-pdf': load(() => import('./tools/WordToPdfTool')),
  'pdf-sign': load(() => import('./tools/PdfSignTool')),
  'pdf-page-numbers': load(() => import('./tools/PdfStampTool')),
  'pdf-watermark': load(() => import('./tools/PdfWatermarkTool')),
  'pdf-protect': load(() => import('./tools/PdfProtectTool')),
  'fancy-text': load(() => import('./tools/FancyTextTool')),
  'text-to-speech': load(() => import('./tools/TextToSpeechTool')),
  'scientific-calculator': load(
    () => import('./tools/ScientificCalculatorTool'),
  ),
  'gpa-calculator': load(() => import('./tools/GradeTools')),
  'grade-calculator': load(() => import('./tools/GradeCalculatorTool')),
  'number-to-words': load(() => import('./tools/NumberToolsUI')),
  'roman-numerals': load(() => import('./tools/RomanNumeralTool')),
  'wheel-spinner': load(() => import('./tools/RandomGamesTools')),
  'dice-roller': load(() => import('./tools/DiceRollerTool')),
  'coin-flip': load(() => import('./tools/CoinFlipTool')),
  stopwatch: load(() => import('./tools/TimeTools')),
  timer: load(() => import('./tools/TimerTool')),
  'mp4-to-mp3': load(() => import('./tools/MediaTools')),
  'video-to-gif': load(() => import('./tools/VideoToGifTool')),
  'webcam-test': load(() => import('./tools/DeviceTests')),
  'microphone-test': load(() => import('./tools/MicrophoneTestTool')),
  readability: load(() => import('./tools/ReadabilityTool')),
  'invisible-text': load(() => import('./tools/InvisibleTextTool')),
  'symbol-picker': load(() => import('./tools/SymbolPickerTool')),
  'keyboard-tester': load(() => import('./tools/KeyboardTesterTool')),
  'screen-info': load(() => import('./tools/ScreenInfoTool')),
  'dead-pixel': load(() => import('./tools/DeadPixelTool')),
  'browser-info': load(() => import('./tools/BrowserInfoTool')),
  'svg-optimizer': load(() => import('./tools/SvgOptimizerTool')),
  bcrypt: load(() => import('./tools/BcryptTool')),
  'json-diff': load(() => import('./tools/JsonDiffTool')),
  'url-parser': load(() => import('./tools/UrlParserTool')),
  'ua-parser': load(() => import('./tools/UserAgentParserTool')),
  'subnet-calculator': load(() => import('./tools/SubnetCalculatorTool')),
  'chmod-calculator': load(() => import('./tools/ChmodCalculatorTool')),
  'meta-tag-generator': load(() => import('./tools/MetaTagGeneratorTool')),
  'robots-txt': load(() => import('./tools/RobotsTxtTool')),
  'http-status': load(() => import('./tools/HttpStatusTool')),
  'code-to-image': load(() => import('./tools/CodeToImageTool')),
  totp: load(() => import('./tools/TotpTool')),
  'cooking-converter': load(() => import('./tools/CookingConverterTool')),
  'size-converter': load(() => import('./tools/SizeConverterTool')),
  'alarm-clock': load(() => import('./tools/AlarmClockTool')),
  'calendar-maker': load(() => import('./tools/CalendarMakerTool')),
  'time-card': load(() => import('./tools/TimeCardTool')),
  'team-generator': load(() =>
    import('./tools/GeneratorTools').then((m) => ({
      default: m.TeamGeneratorTool,
    })),
  ),
  'username-generator': load(() =>
    import('./tools/GeneratorTools').then((m) => ({
      default: m.UsernameGeneratorTool,
    })),
  ),
  'fake-data': load(() =>
    import('./tools/GeneratorTools').then((m) => ({ default: m.FakeDataTool })),
  ),
  'random-color': load(() =>
    import('./tools/GeneratorTools').then((m) => ({
      default: m.RandomColorTool,
    })),
  ),
  'invoice-generator': load(() => import('./tools/InvoiceTool')),
  'email-signature': load(() => import('./tools/EmailSignatureTool')),
  'password-strength': load(() => import('./tools/PasswordStrengthTool')),
  'audio-trimmer': load(() =>
    import('./tools/AudioTools').then((m) => ({ default: m.AudioTrimmerTool })),
  ),
  'audio-converter': load(() =>
    import('./tools/AudioTools').then((m) => ({
      default: m.AudioConverterTool,
    })),
  ),
  'video-compressor': load(() =>
    import('./tools/RecorderTools').then((m) => ({
      default: m.VideoCompressorTool,
    })),
  ),
  'voice-recorder': load(() =>
    import('./tools/RecorderTools').then((m) => ({
      default: m.VoiceRecorderTool,
    })),
  ),
  'screen-recorder': load(() =>
    import('./tools/RecorderTools').then((m) => ({
      default: m.ScreenRecorderTool,
    })),
  ),
  'periodic-table': load(() => import('./tools/PeriodicTableTool')),
  'world-time-map': load(() => import('./tools/WorldTimeMapTool')),
  'country-explorer': load(() =>
    import('./tools/CountryTools').then((m) => ({
      default: m.CountryExplorerTool,
    })),
  ),
  'flag-explorer': load(() =>
    import('./tools/CountryTools').then((m) => ({
      default: m.FlagExplorerTool,
    })),
  ),
  'color-names': load(() => import('./tools/ColorNameTool')),
  'css-units': load(() => import('./tools/CssUnitTool')),
  'flexbox-playground': load(() =>
    import('./tools/CssPlaygroundTools').then((m) => ({
      default: m.FlexboxPlaygroundTool,
    })),
  ),
  'grid-playground': load(() =>
    import('./tools/CssPlaygroundTools').then((m) => ({
      default: m.GridPlaygroundTool,
    })),
  ),
  'box-shadow': load(() => import('./tools/BoxShadowTool')),
  'border-radius': load(() => import('./tools/BorderRadiusTool')),
  'clip-path': load(() => import('./tools/ClipPathTool')),
  'css-transform': load(() => import('./tools/CssTransformTool')),
  'css-specificity': load(() => import('./tools/CssSpecificityTool')),
  typography: load(() => import('./tools/TypographyTool')),
  'svg-path': load(() => import('./tools/SvgPathTool')),
  'bezier-curve': load(() => import('./tools/BezierCurveTool')),
  'gradient-mesh': load(() => import('./tools/GradientMeshTool')),
  'color-blindness': load(() => import('./tools/ColorBlindnessTool')),
  'pixel-art': load(() => import('./tools/PixelArtTool')),
  'json-viewer': load(() => import('./tools/JsonViewerTool')),
  'http-request': load(() => import('./tools/HttpRequestTool')),
  'fen-chessboard': load(() => import('./tools/FenChessboardTool')),
  'decision-matrix': load(() => import('./tools/DecisionMatrixTool')),
  'eisenhower-matrix': load(() => import('./tools/EisenhowerMatrixTool')),
  'kanban-board': load(() => import('./tools/KanbanBoardTool')),
  'timeline-maker': load(() => import('./tools/TimelineMakerTool')),
  'typing-test': load(() => import('./tools/TypingTestTool')),
  'resume-builder': load(() => import('./tools/ResumeBuilderTool')),
  'online-notepad': load(() => import('./tools/NotepadTool')),
  flashcards: load(() => import('./tools/FlashcardsTool')),
  'utm-builder': load(() =>
    import('./tools/MarketingTools').then((m) => ({
      default: m.UtmBuilderTool,
    })),
  ),
  'faq-schema': load(() =>
    import('./tools/MarketingTools').then((m) => ({
      default: m.FaqSchemaTool,
    })),
  ),
  'article-schema': load(() =>
    import('./tools/MarketingTools').then((m) => ({
      default: m.ArticleSchemaTool,
    })),
  ),
  'social-preview': load(() =>
    import('./tools/MarketingTools').then((m) => ({
      default: m.SocialPreviewTool,
    })),
  ),
  'reading-time': load(() =>
    import('./tools/WritingTools').then((m) => ({
      default: m.ReadingTimeTool,
    })),
  ),
  'keyword-density': load(() =>
    import('./tools/WritingTools').then((m) => ({
      default: m.KeywordDensityTool,
    })),
  ),
  'duplicate-words': load(() =>
    import('./tools/WritingTools').then((m) => ({
      default: m.DuplicateWordTool,
    })),
  ),
  'sentence-length': load(() =>
    import('./tools/WritingTools').then((m) => ({
      default: m.SentenceLengthTool,
    })),
  ),
  'palette-extractor': load(() =>
    import('./tools/ImageColorTools').then((m) => ({
      default: m.PaletteExtractorTool,
    })),
  ),
  'image-color-picker': load(() =>
    import('./tools/ImageColorTools').then((m) => ({
      default: m.ImageColorPickerTool,
    })),
  ),
  'json-schema': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.JsonSchemaTool,
    })),
  ),
  'html-to-jsx': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.HtmlToJsxTool,
    })),
  ),
  'json-to-toml': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.JsonToTomlTool,
    })),
  ),
  'json-ld-validator': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.JsonLdValidatorTool,
    })),
  ),
  'markdown-table': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.MarkdownTableTool,
    })),
  ),
  'csv-to-markdown': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.CsvToMarkdownTool,
    })),
  ),
  'csv-viewer': load(() =>
    import('./tools/DataFormatTools').then((m) => ({
      default: m.CsvViewerTool,
    })),
  ),
  'date-format': load(() => import('./tools/DateFormatTool')),
  'keyboard-shortcuts': load(() => import('./tools/KeyboardShortcutsTool')),
  'unicode-explorer': load(() => import('./tools/UnicodeExplorerTool')),
  'math-symbols': load(() => import('./tools/MathSymbolsTool')),
  'html-entity-reference': load(() => import('./tools/HtmlEntityTool')),
  'ascii-table': load(() => import('./tools/AsciiTableTool')),
  'molar-mass': load(() => import('./tools/MolarMassTool')),
  'number-system': load(() => import('./tools/NumberSystemTool')),
  'morse-code': load(() => import('./tools/MorseCodeTool')),
  braille: load(() => import('./tools/BrailleTool')),
  'video-trimmer': load(() => import('./tools/VideoTrimmerTool')),
  'measurement-reference': load(
    () => import('./tools/MeasurementReferenceTool'),
  ),
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
