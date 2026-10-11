# Changelog

All notable changes to Emojar are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [0.20.1] — 2026-10-11

### Changed

- Docs refreshed after the 0.20.0 release: the README explains how to give
  new pages share images and titles, the AdSense checklist marks blog share
  images and pagination canonicals as done, and the backlog tracks the
  title change in Search Console.

## [0.20.0] — 2026-10-11

### Added

- Every page now has its own share image for links posted on social media
  and chat apps, including games, the older blog posts and the info pages.
- The emoji A–Z list, the detailed emoji list, the letter-shaped emoji table
  and the holiday collections have their own titles, descriptions and
  canonical links instead of the site-wide defaults.

### Changed

- Shorter page titles in search results: emoji pages read "🍕 Pizza Emoji —
  Meaning & Copy", and the "| Emojar" suffix is only added when the title
  still fits.
- Blog pages 2 and up are now treated as their own pages by search engines,
  and filtered tag views are no longer indexed (their links still are).
- The letter table links straight to the A–Z list instead of going through
  a redirect.

### Changed

- Docs refreshed after the 0.19.0 release: the backlog lists the open
  full-width decisions (game boards, number of "Start here" picks).

## [0.19.0] — 2026-10-11

### Changed

- Every page now uses the full width of the window instead of a centred
  1,024 px column: the header, content, text and footer stretch to the
  edges (with side padding), and tool, category and emoji grids show more
  columns on wide screens. Game boards stay centred so they play the same.
- Tool heights were re-measured for the wider layout (now also at 1,920 px),
  so tool pages still don't jump while loading.

### Fixed

- Game pages, the detailed emoji list and the holiday collections showed
  "Home › Home" in their breadcrumb (and in the breadcrumb data search
  engines read); Home now appears once.

### Changed

- Docs refreshed after the 0.18.0 release: adding a tool now includes
  re-measuring tool heights, and the AdSense checklist explains how to switch
  on the ad slot after approval.

## [0.18.0] — 2026-10-09

### Changed

- Tool pages no longer jump when the tool finishes loading: each tool's
  starting height is measured (phone, tablet and desktop) and reserved in
  advance. On the measured pages layout shift dropped to about zero (the
  Pixel Art Editor went from 0.14 to 0.02, the JSON Formatter from 0.07 to 0).
- Tool pages end with "Keep exploring" links to the category, all tools and
  the guides.

### Added

- A single ad space below the tool, labelled "Advertisement", kept 40 px
  away from the tool and with its space reserved. It stays switched off
  until an AdSense ad unit is configured (`NEXT_PUBLIC_ADSENSE_SLOT_TOOL`).
- `npm run measure:tool-heights` re-measures the tools after changes.

### Changed

- Docs refreshed after the 0.17.0 release: the README's "Adding an online
  tool" steps explain cross-listing, the sitemap priority flag and the
  "Start here" picks.

## [0.17.0] — 2026-10-09

### Added

- The homepage now has "Start here" (12 tools we recommend, labelled as our
  picks), an "Emoji, games & collections" section and the latest guides.
- The tool search shows how many tools match, has a Clear button (or press
  Esc), and when nothing matches it suggests other words, all tools or an
  emoji search.
- Category chips on the tools page show how many tools each category has.

### Changed

- The homepage and the tools page lead with 12 picks instead of a long list
  of 77 "popular" tools; every tool is still listed by category.
- Category cards share one calm style instead of 13 different colours.
- The tools page FAQ no longer says every tool works offline: most do once
  loaded, but OCR downloads its engine first.

### Changed

- Docs refreshed after the 0.16.0 release: the README's project map lists the
  shared styles and navigation, and explains the design tokens to use for new
  pages and tools.

## [0.16.0] — 2026-10-09

### Added

- A clearer menu: Tools, Emoji, Games, Guides and Help, on desktop and
  phones. Every section is a normal link, with a separate button to show its
  links; Esc closes the menu and puts you back where you were.
- A fuller footer with every tool category, emoji and games, guides and
  help, and the legal pages.
- A "Skip to content" link for keyboard and screen-reader users.

### Changed

- One accent colour across the site: the magenta from the Emojar logo
  (replacing indigo in the tools).
- Every focusable control shows a visible focus ring, and the site respects
  your device's "reduce motion" setting, including the back-to-top button.
- Small 10–11 px labels are now at least 12 px, except inside dense grids
  such as periodic-table tiles and map labels.
- Buttons on the emoji tool pages share the tools' button styles.
- Pages no longer nest a second main landmark, and the holiday collections
  card on the emoji page no longer overflows on phones.

### Changed

- Docs refreshed after the 0.15.2 release: the AdSense task list now shows
  what is done and what is still open, checked against the code and the live
  site, and the desired-features list carries the staged SEO, design and ads
  plan from the October audit.

## [0.15.2] — 2026-10-09

### Fixed

- The privacy policy now matches how the site works: analytics is Vercel
  Web Analytics (cookieless), not Google Analytics; visitors in the EEA, UK
  and Switzerland see Google's consent message before personalised ads; the
  optional features that contact another service (OCR engine download,
  breach check, Emoji Kitchen images, online speech voices) are listed; and
  data saved in your browser is explained.
- About, Terms, FAQ and the emoji page no longer claim "no ads on tools" or
  name Google Analytics; ad wording now says ads are never placed inside a
  tool or made to look like part of it.
- Emoji counts come from the data (3,789) instead of a hard-coded 3,790, the
  homepage headline reads "264 free online tools" instead of "+264", and the
  share image shows the tool count first.

### Changed

- Docs refreshed after the 0.15.0 release: the README and feature reference
  describe the external tool links (FocusCrew, MYLPER), and the background
  removal backlog item points to MYLPER for manual cut-outs in the meantime.

## [0.15.0] — 2026-10-08

### Added

- MYLPER (mylper.com), a free online image editor with layers, masks and
  adjustment layers, is listed under Image Tools as an external link that
  opens in a new tab.

## [0.14.1] — 2026-10-08

### Changed

- Docs refreshed after the 0.14.0 release: the device checklist now covers
  touch dragging and downloads in the new interactive tools.

## [0.14.0] — 2026-10-08

### Added

- 18 interactive tools, all running in the browser with nothing uploaded:
  - Developer: SVG Path Editor, CSS Specificity Calculator, Box Shadow
    Generator, Border Radius Generator, Clip-Path Generator, CSS Transform
    Playground, Typography Playground, JSON Viewer & Tree Explorer and HTTP
    Request Builder (writes cURL, fetch, Axios, Python, Node, HTTPie and
    PowerShell code; it never sends the request).
  - Color: Mesh Gradient Generator and Color Blindness Simulator.
  - Reference: Bézier Curve Visualizer and Chess Board Editor (FEN).
  - Image: Pixel Art Editor with frames and animated GIF export.
- A new Productivity category with a Decision Matrix, Eisenhower Matrix,
  Kanban Board and Timeline Maker. Your data stays in this browser and can be
  exported and imported as JSON. Pomodoro, the printable calendar, other
  planners and FocusCrew (a shared Pomodoro timer) are listed there too.
- An in-depth guide for each new tool, published one a day from 18 January 2027.
- Productivity questions on the FAQ page.

### Changed

- Regex Tester explains your pattern piece by piece and lists every match
  with its position and groups.
- Dice Roller shows the lowest, highest and average die, the possible range
  and the expected total, plus session stats, and rolls any die from d2 to
  d1000.

## [0.13.1] — 2026-10-08

### Changed

- Docs refreshed after the 0.13.0 release: the device checklist covers the
  Video Trimmer and the new Flag Explorer behaviour, and its notes reflect
  the fixes; backlog items for guides in the header search and Video Trimmer
  checks on Safari and Firefox.

## [0.13.0] — 2026-10-08

### Added

- Video Trimmer: cut a clip out of a video in the browser, either fast with
  no quality loss (cuts at keyframes) or frame-exact (re-encodes).
- PDF to Text can now read scanned pages with OCR, in 14 languages.
- Braille Translator: contracted Grade 2 (UEB) in both directions, powered by
  liblouis.
- Readability Score checks German, Spanish and French text with formulas made
  for each language.
- “Download ZIP” on every tool that produces several files, including Image
  Converter, Compressor, Resizer and Split PDF.
- Landing pages: AVIF to JPG, GIF to PNG, km to miles, kg to lbs and Celsius
  to Fahrenheit.
- A search box in the header on every page except the homepage: find any
  tool from anywhere (press / to focus), or jump to the emoji search.
- A device checklist for testing the camera, microphone, recorders, timers
  and flag display on real phones and computers.

### Changed

- Timers and the Pomodoro timer finish on time in background tabs, and their
  beep plays on iPhone and Safari.
- World Time Zone Map labels no longer overlap; Unicode search ranks whole
  words first (“latin small e acute” finds é first).
- Flag Explorer shows ISO codes and turns the quiz off on systems that can't
  display flag emoji (Windows), instead of giving the answers away.
- Reference data can be regenerated with `npm run data:reference`; element
  discovery years were corrected, and one Edge keyboard shortcut was fixed.
- `npm run dev` (Turbopack) works again: `@next/mdx` now matches Next 15.5,
  and Node built-ins used by the PDF password tool are stubbed for Turbopack.
- Docs use kebab-case file names (`docs/current-features.md`,
  `docs/desired-features.md`, …), and ten emoji ideas were dropped from the
  backlog.

### Fixed

- Screen Recorder: the microphone could record as silence in Safari, the
  “recording without microphone” message disappeared, and stopping sharing
  during the countdown left the capture running.
- Voice Recorder level meter moved while paused; Alarm Clock notifications
  could fail on Android and the repeat days were re-sorted on every render.

## [0.12.1] — 2026-10-08

### Changed

- Docs refreshed after the 0.12.0 release: backlog items for real-device
  checks of the reference tools, overlapping map labels, whole-word Unicode
  search, contracted braille and yearly data refreshes.

## [0.12.0] — 2026-10-08

### Added

- A new **Reference & Learning** category with an Interactive Periodic Table
  (all 118 elements with properties and filters), Country Explorer (capitals,
  ISO codes, currencies, calling codes, time zones), Flag Explorer with a
  quiz, Keyboard Shortcut Reference for Windows, macOS, Linux and the major
  browsers, Unicode Character Explorer, Math Symbols with LaTeX, and a
  Measurement Reference for paper sizes, aspect ratios and resolutions.
- Developer tools: CSS Unit Visualizer, HTML Entity Reference, CSS Flexbox
  Playground, CSS Grid Playground and an ASCII Table.
- Color Name Explorer, Molar Mass Calculator, Braille Translator and a live
  World Time Zone Map with day and night shading.
- Four landing pages (Greek Letters, A4 Paper Size, HTML Arrow Entities, ASCII
  Control Characters), 16 scheduled guides and a reference FAQ section.

### Changed

- Number Base Converter now explains each digit's place value, shows every
  base at once and swaps bases in one click (batch conversion is still there).
- Morse Code Translator can play Morse as sound at adjustable speed and has a
  clickable Morse alphabet.
- HTTP Status Codes marks the codes you commonly see, explains typical usage
  and links related codes; Roman Numeral Converter shows a full reference.

## [0.11.1] — 2026-10-08

### Changed

- Docs refreshed after the 0.11.0 release: backlog notes on real-device
  checks for the new recorders and on reusing the alarm clock's timing for
  the timers.

## [0.11.0] — 2026-10-08

### Added

- Four date and time tools: Online Alarm Clock (sounds, repeat days,
  snooze, notifications), Day of the Week Calculator, Printable Calendar
  Generator (monthly or yearly PDF, 12 languages) and Time Card Calculator
  (breaks, overnight shifts, overtime and pay).
- Seven generators: Random Team Generator, Username Generator, Fake Test
  Data Generator (CSV, JSON or SQL with safe example data), Random Color
  Generator, Invoice Generator (PDF), Email Signature Generator and Password
  Strength Checker (with an optional private breach check).
- Five audio and video tools: Video Compressor, Audio Trimmer, Audio
  Converter (MP3, WAV, M4A, OGG), Voice Recorder and Screen Recorder.
- A guide on the blog for each, published one per day from 16 to 31
  December, and four new FAQ answers.

## [0.10.0] — 2026-10-08

### Added

- Seven new converters: Cooking Measurement Converter (cups, spoons, ml,
  grams and ounces by ingredient, with a Cups to Grams page and an oven
  temperature chart), Shoe Size Converter (US, UK, EU, cm and Mondopoint
  for men, women and kids, or by foot length), Clothing Size Converter
  (women’s dresses, men’s jackets, shirts and trousers), Fuel Economy
  Converter (mpg ↔ L/100 km, with an MPG to L/100 km page), Power Converter
  (with a Watts to Horsepower page), Torque Converter and Text to Binary
  (with a Binary to Text page).
- A guide on the blog for each, published one per day from 9 to 15
  December, and three new converter questions on the FAQ page.
- FocusCrew (focus-crew.com), a shared Pomodoro timer, is listed under Date &
  Time Tools as an external link that opens in a new tab.

### Changed

- The homepage headline now shows the live tool count (“+213 Free online
  tools that run in your browser”).

## [0.9.0] — 2026-10-08

### Added

- Sixteen new developer tools: HTML Entity Encoder / Decoder, Number Base
  Converter (with Binary to Decimal, Hex to Decimal and Decimal to Binary
  pages), JSON to XML (with an XML to JSON page), JSON Diff, String Escape /
  Unescape, URL Parser & Query String Builder, User Agent Parser (with bot
  detection), Subnet Calculator (IPv4 and IPv6, with a CIDR Calculator
  page), Chmod Calculator, SVG Optimizer (SVGO), Meta Tag & Open Graph
  Generator with previews, Robots.txt Generator with a URL tester and an
  AI-crawler preset, HTTP Status Code Lookup, Code to Image, Bcrypt Hash
  Generator and TOTP / 2FA Code Generator.
- A guide on the blog for each, published one per day from 23 November to
  8 December, and four new developer questions on the FAQ page.

## [0.8.0] — 2026-10-07

### Added

- Four new device tests: Keyboard Tester (full on-screen keyboard, key
  codes, rollover and ghosting check), Screen Resolution Checker (physical
  pixels, pixel ratio, viewport, aspect ratio, estimated refresh rate, HDR
  and colour gamut), Dead Pixel Test (full-screen colours plus an opt-in
  stuck-pixel fixer with a photosensitivity warning) and What Is My Browser
  (browser, OS, device, GPU and feature support, with a What Is My User
  Agent page).
- A guide on the blog for each, published one per day from 19 to 22
  November, and three new device-test questions on the FAQ page.

## [0.7.0] — 2026-10-07

### Added

- Ten new text tools: Upside Down Text (with a Mirror Text page),
  Strikethrough Text (with an Underline Text page — strike, slash, underline,
  double underline, overline, or remove the marks), Reverse Text, Text
  Repeater, Remove Line Breaks (keeps paragraphs and rejoins hyphenated
  words from PDFs), Add Prefix / Suffix to Lines (with `{n}` line numbers),
  Readability Score (Flesch Reading Ease, Flesch–Kincaid, Gunning Fog, SMOG,
  Coleman–Liau, ARI and the longest sentences), Invisible Character (blank
  characters to copy, a Blank Text Generator page, and a detector that finds
  and removes hidden characters), Special Characters & Symbols (about 590
  symbols with search, plus Arrow, Check Mark and Currency pages) and Slug
  Generator.
- A guide on the blog for each, published one per day from 9 to 18
  November, and three new text-tool questions on the FAQ page.

### Changed

- Docs refreshed: feature reference, README, backlog and project context now
  match the current tool count, libraries and release history.

## [0.6.0] — 2026-10-07

### Added

- Fifteen new calculators: Mortgage (taxes, insurance, PMI, HOA, extra
  payments), Salary to Hourly, Fraction (mixed numbers, step-by-step),
  Ratio, Aspect Ratio, Body Fat (U.S. Navy method), Ideal Weight, Profit
  Margin (with a Markup Calculator page), ROI with annualized return,
  Savings Goal, Retirement, Unit Price comparison, Probability (events,
  binomial, nCr/nPr), Square Root (simplified radicals) and Exponent.
- A guide on the blog for each, published one per day from 25 October to
  8 November, and new calculator questions on the FAQ page.

### Changed

- The Loan Calculator now points to the Mortgage Calculator for home loans.

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
