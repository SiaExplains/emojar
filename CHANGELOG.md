# Changelog

All notable changes to Emojar are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [0.5.0] — 2026-10-07

### Added

- Six more PDF tools, all running in the browser: Delete PDF Pages (click
  thumbnails or type pages), Crop PDF (drag a crop box, trim white margins,
  millimetre margins), Edit PDF (text, images, white-out, highlights and
  boxes), Fill PDF Form (text fields, checkboxes, radio buttons, drop-downs,
  optional flattening), Grayscale PDF (keeps text selectable, plus black &
  white and scanned-look modes) and Word to PDF (DOCX with headings, lists,
  tables and images, or print to PDF).
- A guide on the blog for each new tool, published one per day from
  19 to 24 October, and new PDF questions on the FAQ page.

### Fixed

- Signatures, page numbers and other stamps are now placed correctly on PDFs
  that have a crop box.

## [0.4.0] — 2026-10-07

### Added

- Ten more image tools, all running in the browser: Passport Photo Maker
  (country presets, head guide, 4 × 6 in / A4 / Letter print sheets), Profile
  Picture Maker (circle crop and borders), Add Text to Image and Watermark
  Image (text or logo, tiled, batch up to 50), Blur & Pixelate Image, Photo
  Collage Maker (2–9 photos), Image Grid Splitter (Instagram grid with posting
  order), GIF Maker, Favicon Generator (ICO, Apple and Android icons,
  manifest) and Image to ASCII Art.
- Social Media Image Resizer with exact sizes for Instagram, Facebook, X,
  LinkedIn, YouTube, Pinterest and TikTok, plus dedicated Instagram, Facebook,
  X, LinkedIn and YouTube thumbnail pages.
- A guide on the blog for each new tool, published one per day from
  8 to 18 October.
- New image questions on the FAQ page.

## [0.3.0] — 2026-10-07

### Added

- 31 new browser-only tools (144 in total, 11 categories): HEIC to JPG, Image
  to Text (OCR), Compress Image to Exact Size (with 20/50/100/200 KB pages),
  Meme Generator, Sign PDF, Add Page Numbers, Watermark PDF, Protect PDF and
  Unlock PDF, Fancy Text Generator, Text to Speech, SQL Formatter, JSON to
  TypeScript, Scientific / GPA / Grade / Calorie / Due Date / Ovulation
  calculators, Number to Words, Roman Numeral Converter, Wheel Spinner, Dice
  Roller, Coin Flip, Stopwatch, Online Timer, Pomodoro Timer, MP4 to MP3,
  Video to GIF, Webcam Test and Microphone Test.
- New categories: Audio & Video Tools and Device Tests.
- A practical guide on the blog for every online tool, plus a launch post,
  published on a schedule of five per day. Tool pages link to their guide
  once it is live.
- A categorised FAQ page at `/faq`, linked from the footer.

### Changed

- The blog index includes the tool guides, with pagination.
- Split PDF only starts a new file at semicolons; commas combine pages into
  one file.
- The image compressor's “max width” no longer enlarges smaller images.
- Corrected several tool descriptions to match how the tools behave.
- Stopwatch and timers have a full-screen button.
- Cheque wording writes cents with two digits (07/100); the scientific
  calculator accepts a typed √ (e.g. √16); JSON to TypeScript names array
  items like `addresses` → `Address`.
- Unlocking a PDF with the wrong password now says so instead of reporting an
  invalid file.
- One malformed guide file no longer breaks the pages that list guides.

## [0.2.1] — 2026-10-07

### Changed

- The About, Terms of Service and Privacy pages now describe Emojar as an
  online-tools platform and state that files and text used with the tools are
  processed in the browser and never uploaded.
- Rewrote the README (setup, scripts, project structure, how to add a tool) and
  updated the feature reference and backlog documents.

## [0.2.0] — 2026-10-07

### Added

- **Online Tools** at `/online-tool`: 110+ free tools in nine categories —
  image, PDF, developer, text, color, calculators, unit converters, security &
  generators, and date & time. Every tool runs in the browser; files and text
  are never uploaded.
- An Image Converter with dedicated pages for popular conversions such as
  JPG to PNG, PNG to WebP and PDF to JPG.
- A new `/emoji` page that keeps the full emoji search, categories and
  collections in one place.
- `llms.txt`, plus structured data (WebApplication, FAQ, HowTo, breadcrumbs and
  item lists) on every tool and category page.

### Changed

- The homepage now leads with the online tools; emoji search, games and emoji
  tools are still one click away.
- The main menu is now “Online Tools” and “Emoji”.
- Site title, description and search box schema describe the tools platform.
- New Emojar logo in the header and a new favicon / app icon set (browser,
  Apple touch, Android and Windows tile icons).

### Fixed

- The web app manifest (`/manifest.webmanifest`) returned an error because two
  files claimed the same address; it now loads and lists the new icons.
