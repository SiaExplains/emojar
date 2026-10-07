# Emojar — Complete Feature & Capability Reference

> **Live site:** [emojar.com](https://emojar.com)  
> **Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS  
> **Last updated:** 7 October 2026 (v0.10.0 — 213 online tools; platform since v0.2.0)

---

## Table of Contents

0. [Online Tools](#0-online-tools)
1. [Core Emoji Tools](#1-core-emoji-tools)
2. [Emoji Browsing & Organization](#2-emoji-browsing--organization)
3. [Emoji Detail Pages](#3-emoji-detail-pages)
4. [Emoji Collections](#4-emoji-collections)
5. [Emoji Games](#5-emoji-games)
6. [Blog](#6-blog)
7. [Legal & About Pages](#7-legal--about-pages)
8. [SEO & Technical Features](#8-seo--technical-features)
9. [User Experience](#9-user-experience)
10. [Monetization](#10-monetization)

---

## 0. Online Tools

Since v0.2.0 (October 2026) Emojar is positioned as a platform of **free,
privacy-first online tools**. The emoji features below remain, but the
homepage and main navigation lead with the tools.

### Principles
- **Browser-only processing** — files and text never leave the device. No
  upload APIs, nothing stored, no tool input sent to analytics.
- Free, no account, mobile-friendly, keyboard accessible.
- Friendly error messages (e.g. *“Invalid JSON: … (line 1, column 8)”*); no
  stack traces shown to users.
- Heavy work off the main thread: image encoding in a Web Worker, PDF parsing
  in pdf.js's worker, regex testing in a worker with a 1.5 s timeout.

### Routes

| Route | Description |
|---|---|
| `/online-tool` | Hub: search, popular tools, all 11 categories with every tool, FAQ |
| `/online-tool/[category]` | Category page: intro, search, tool grid, popular conversions, other categories |
| `/online-tool/[category]/[tool]` | Tool page (213 tools) |
| `/online-tool/image-tools/image-converter/[pair]-converter` | 11 conversion landing pages |
| `/online-tool/image-tools/compress-image-to-size/compress-image-to-[20,50,100,200]kb` | 4 exact-size landing pages |
| `/online-tool/image-tools/social-media-image-resizer/[platform]-…` | 5 platform landing pages (Instagram, Facebook, X, LinkedIn, YouTube thumbnail) |
| `/online-tool/[category]/[tool]/[variant]` (other) | 19 preset landing pages: Markup Calculator, Mirror Text, Underline Text, Blank Text Generator, Arrow / Check Mark / Currency Symbols, What Is My User Agent, HTML Entity Decoder, Binary to Decimal, Hex to Decimal, Decimal to Binary, XML to JSON, CIDR Calculator, Watts to Horsepower, MPG to L/100 km, Cups to Grams, Binary to Text |
| `/blog/[slug]` | Tool guides from `content/guides/*.md` (one per tool + launch post); 404 until their publish date |
| `/faq` | FAQ grouped by category, `FAQPage` JSON-LD, linked from the footer |

Permanent redirects: `/online-tool/image-convertor`, `/online-tool/image-converter`,
`/online-tool/image-tools/image-convertor` → the image converter;
`…/image-converter/*-convertor` → `*-converter`; `/online-tools/*` → `/online-tool/*`.
Unknown slugs return a real 404.

### Tool page layout
H1 + answer-first intro · privacy badge · the tool · limitation note (where
relevant) · “How to use” steps · “What is …?” · FAQ (plus an automatic
privacy FAQ) · related tools · sibling conversions · “In-depth guide” link once
the tool's blog guide is published (pages revalidate daily).

### Categories and tools (213)

| Category                                       | Tools                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🖼️ Image Tools (26)                            | Image Converter (JPG/PNG/WebP/PDF; input also GIF, BMP, AVIF, SVG, PDF), Image Compressor, Image Resizer, Image Cropper, Image Rotator, Image Flipper, Background Remover (plain/solid backgrounds), EXIF Viewer (+ strip metadata), Image to Base64, Base64 to Image, SVG to PNG, HEIC to JPG (JPG/PNG/WebP), Image to Text (OCR, 14 languages), Compress Image to Exact Size (20/50/100/200 KB pages), Meme Generator, Passport Photo Maker (US/UK/EU/Canada/India/China/Australia/Japan + custom, print sheets), Profile Picture Maker, Add Text to Image, Watermark Image (text/logo, tiled, batch), Blur & Pixelate, Photo Collage Maker, Image Grid Splitter, GIF Maker, Favicon Generator (ICO + app icons + manifest), Social Media Image Resizer (7 platforms, 5 landing pages), Image to ASCII Art |
| 📄 PDF Tools (21)                              | Merge PDF, Split PDF, Compress PDF (lossless or rasterised “strong”), Rotate PDF, Extract Pages, Reorder Pages (thumbnails), PDF to JPG, PDF to PNG, PDF to Text, PDF Metadata Viewer/Editor, Sign PDF (draw/type, click to place), Add Page Numbers, Watermark PDF, Protect PDF (AES-256), Unlock PDF (with the password)                                                                                             , Delete Pages (thumbnail selection), Crop PDF (crop box, trim white margins), Edit PDF (text, images, white-out, highlight, box; Latin fonts), Fill PDF Form (AcroForm fields, flatten), Grayscale PDF (vector grayscale keeping text, black & white, scanned look), Word to PDF (DOCX via mammoth + pdfmake, or browser print) |
| 🧑‍💻 Developer Tools (42 + 4 cross-listed)       | JSON Formatter, JSON Validator, JSON Minifier, JSON↔YAML, JSON↔CSV, XML/HTML/CSS/JavaScript Formatter, JavaScript Minifier, Base64 Encoder/Decoder, URL Encoder/Decoder, JWT Decoder, UUID Generator (v4/v7), Hash Generator (MD5/SHA-1/256/384/512 + HMAC), Regex Tester, Cron Expression Generator, Markdown↔HTML, SQL Formatter (dialects), JSON to TypeScript, HTML Entity Encoder/Decoder, Number Base Converter (2–36, BigInt; 3 landing pages), JSON ↔ XML, JSON Diff (structural, paths), String Escape (JSON/JS/Java/Python/SQL/CSV/regex/shell/XML), URL Parser & Query Builder, User Agent Parser (+ bot detection), Subnet Calculator (IPv4/IPv6; CIDR page), Chmod Calculator, SVG Optimizer (svgo), Meta Tag & Open Graph Generator (previews), Robots.txt Generator + tester, HTTP Status Codes, Code to Image (highlight.js → canvas PNG), Bcrypt (bcryptjs in a worker), TOTP / 2FA (RFC 6238, Web Crypto), Text to Binary (UTF-8; binary/hex/decimal/octal; Binary to Text page; also in Unit Converters and Text Tools)                                                    |
| 📝 Text Tools (27)                             | Word, Character and Sentence Counter, Text Case Converter (12 cases), Uppercase, Lowercase, Title Case, Remove Duplicate Lines, Remove Empty Lines, Sort Lines, Text Diff, Find and Replace (regex), Lorem Ipsum, Markdown Previewer, Morse Code, Fancy Text Generator (20+ Unicode styles), Text to Speech (device voices), Upside Down Text (+ Mirror Text page), Strikethrough Text (+ Underline Text page; 7 combining-mark styles, remove), Reverse Text (characters/words/each word/lines, emoji-safe), Text Repeater (≤ 10,000×, 2 M chars), Remove Line Breaks (keep paragraphs, de-hyphenate), Add Prefix / Suffix to Lines (`{n}` numbering), Readability Score (Flesch, FK, Fog, SMOG, Coleman–Liau, ARI), Invisible Character (copy palette, blank text generator page, hidden-character detector/cleaner), Special Characters & Symbols (~590 symbols in 15 groups, search, tray; arrow/check mark/currency pages), Slug Generator (also in Developer Tools) |
| 🎨 Color Tools (10)                            | Color Picker (eyedropper + pick from image), HEX→RGB, RGB→HEX, HEX→HSL, RGB→HSL, HSL→RGB, Color Converter (HEX/RGB/HSL/HSV/CMYK), Palette Generator, CSS Gradient Generator, WCAG Contrast Checker                                                                                                                                                                                                                      |
| 🧮 Calculators (35)                            | Percentage, Percentage Increase, Age, Date, BMI, BMR/TDEE, Loan (amortisation), EMI (monthly schedule), Tip, Discount, Compound Interest, VAT, Time Duration, Average (mean/median/mode/std dev), Scientific (own parser, no `eval`), GPA, Grade (weighted + final needed), Calorie, Pregnancy Due Date, Ovulation                                                                                                     , Mortgage (tax, insurance, PMI, HOA, extra payments), Salary to Hourly, Fraction, Ratio, Aspect Ratio, Body Fat (U.S. Navy), Ideal Weight, Profit Margin (+ Markup page), ROI (CAGR), Savings Goal, Retirement, Unit Price, Probability (binomial, nCr/nPr), Square Root, Exponent |
| 📏 Unit Converters (20 + 2 cross-listed)                        | Length, Weight, Temperature, Area, Volume, Speed, Time, Data Storage, Energy, Pressure, Frequency, Angle, Number to Words (cardinal/ordinal/cheque), Roman Numerals (1–3999), Power (hp/PS/BTU·h; Watts to Horsepower page), Torque, Fuel Economy (reciprocal units; MPG to L/100 km page), Cooking Measurement (by ingredient density; Cups to Grams page; oven chart), Shoe Size (men/women/kids, foot-length lookup), Clothing Size (4 charts, measurement lookup)                                                                                                                                                                                                                                            |
| 🔐 Security & Generators (12 + 2 cross-listed) | Password, Passphrase, Random Number, Random String, SHA-256, SHA-512, QR Code Generator (URL/text/Wi-Fi/email/phone/SMS, PNG/SVG), QR Code Scanner (camera or image), Barcode Generator, Wheel Spinner, Dice Roller (notation like 4d6kh3), Coin Flip                                                                                                                                                                   |
| 🕒 Date & Time Tools (12)                      | Unix Timestamp Converter, Timestamp Converter, Time Zone Converter, Date Difference, Add/Subtract Days, Working Days (with holidays), Week Number (ISO), Countdown Generator (shareable link), World Clock, Stopwatch (laps, full screen), Online Timer, Pomodoro Timer                                                                                                                                                 |
| 🎬 Audio & Video Tools (2)                     | MP4 to MP3 (WebAudio decode + LAME in a worker), Video to GIF (native `<video>` + gifenc, max 400 frames)                                                                                                                                                                                                                                                                                                               |
| 🎥 Device Tests (6)                            | Webcam Test (resolution, frame rate, snapshot), Microphone Test (level meter, record & play back), Keyboard Tester (full layout by `KeyboardEvent.code`, rollover/ghosting, key codes), Screen Resolution Checker (CSS vs physical pixels, DPR, viewport, aspect ratio, rAF refresh-rate estimate, HDR/gamut), Dead Pixel Test (9 full-screen colours, opt-in flashing stuck-pixel fixer), What Is My Browser (UA parser + Client Hints, GPU, feature checklist; What Is My User Agent page; also in Developer Tools) |

UUID Generator and Hash Generator are also listed under Security & Generators;
Unix Timestamp, Timestamp Converter, Slug Generator and What Is My Browser are also listed under Developer Tools; Number Base Converter under Unit Converters; Bcrypt and TOTP under Security & Generators; SVG Optimizer under Image Tools.
Each tool has one canonical URL.

External links: `lib/online-tools/external.ts` lists third-party tools shown on a category page and the hub (currently FocusCrew under Date & Time). They open in a new tab, are marked “External site”, have no tool page or sitemap entry and are not counted in tool totals. The homepage H1 shows the live count of Emojar tools (`TOOLS.length`).

### Known limitations (stated on the pages)
- Background Remover handles plain and solid-colour backgrounds; AI cut-outs
  of people need a large model that is not loaded.
- Compress PDF “strong” mode turns pages into images (text no longer
  selectable). PDF to Text needs a real text layer (no OCR).
- Formatting TypeScript-only syntax is not supported by the JavaScript formatter.
- OCR downloads the Tesseract engine and language model (~5–15 MB) from a CDN on
  first use; the image itself stays local. Text to Speech “online” voices send
  text to the browser vendor's speech service and are labelled as such.
- Watermark text supports Latin script only (standard PDF font).
- Audio & video use native browser decoding: formats the browser can't play
  (e.g. some MOV/HEVC files) are rejected.

### Tool guides (blog)

- One Markdown guide per tool in `content/guides/<tool-slug>.md` plus a launch
  post (214 total); format documented in `content/guides/README.md`.
- Publish dates live in `lib/blog/guide-schedule.ts` (5 per day from
  2026-10-07 to 2026-11-04, plus one extra guide per day 10-08 → 12-15 for the image, PDF, calculator, text, device, developer and converter tools). Unpublished guides 404 and stay out of the
  sitemap, blog index and `llms.txt`; pages revalidate daily (ISR).
- `lib/blog/guides.test.ts` enforces: one guide per tool, unique slugs and
  titles, title ≤ 70 and description 100–170 characters, ≥ 600 words, no H1,
  only internal links that exist, no repeated paragraphs across posts.
- Each guide renders `BlogPosting` + `FAQPage` JSON-LD and links to its tool.

### FAQ page

- `/faq` — questions grouped by General, Privacy, each tool category, Emoji
  and Support (`lib/faq.ts`), with anchor navigation and `FAQPage` JSON-LD.

### Architecture
- `lib/online-tools/registry.ts` — single source of truth for routes, names,
  metadata, related tools, search, sitemap and `llms.txt`.
- `lib/online-tools/tools/*.ts` — per-category tool data and page copy.
- `lib/online-tools/engines/*` — pure logic, covered by Vitest.
- `components/online-tools/ToolPage.tsx` — shared server-rendered layout;
  `ToolRenderer.tsx` lazy-loads each tool's client component.

---

## 1. Core Emoji Tools

### Emoji Tools Hub (`/emoji-tools`)
- Dedicated hub page listing all 8 tools in a 2×4 card grid
- Each card: gradient color, emoji icon, name, 1-line description
- Linked from the `/emoji` hub and the "Emoji" nav menu

### Emoji to PNG (`/emoji-to-png`)
- Convert any of 3,790 emojis to PNG at 64–1024px
- 8 background presets + custom colour + transparent
- 4 padding levels; live 256px canvas preview
- In-browser download, no server upload

### Emoji Personality Quiz (`/personality`)
- 12-question Big Five OCEAN personality quiz
- Cosine similarity matching to a pool of 30 emojis
- Shareable 1080×1080 Canvas PNG result card

### Emoji Favicon Generator (`/emoji-favicon`)
- Turn any emoji into a favicon PNG at 16/32/48/64px
- Instant download, in-browser Canvas rendering

### Emoji Color Palette Extractor (`/emoji-color-palette`)
- Renders emoji on canvas, samples pixel data, extracts 6 dominant colors
- Displays swatches with hex codes and copy buttons
- Downloadable palette strip as PNG

### Emoji Watermark Tool (`/emoji-watermark`)
- Upload any JPEG/PNG/WebP image
- Overlay any emoji at 4 corners, center, or tiled; control size (5–30%) and opacity (10–100%)
- All in-browser, no server upload; download composite as PNG

### Social Card Generator (`/emoji-card`)
- 1080×1080 canvas social card with custom text + emoji backdrop pattern
- Controls: background color, text color, font size, emoji tiling
- Download full-res PNG in-browser

### Unicode Inspector (`/emoji-inspector`)
- Paste any text; inspect each character's code point (U+XXXX), Unicode name, category, version, and byte length
- Uses `Intl.Segmenter` for correct grapheme cluster handling (ZWJ sequences, skin-tone variants)

### Emoji Kitchen (`/emoji-kitchen`)
- Combine two emojis using Google Emoji Kitchen
- Tries 15 date variants × 2 orderings to find a valid combination image
- Graceful "not found" message for unsupported pairs
- Example combos shown for discovery

---

### Emoji Database
- **3,790 Unicode-standard emojis** with full metadata
- Each emoji record includes: character, name, category, subgroup, keywords, Unicode version, codepoints, shortcode aliases, description, and related emoji slugs
- Data sourced from Unicode CLDR and official Unicode emoji test files — no user-generated content

### Fuzzy Search
- Powered by **Fuse.js** with a 0.3 threshold
- Searches across emoji names, keywords, and characters in real time
- Live filtering as the user types — no page reload required
- Search bar placeholder: *"Search emojis… e.g. heart, smiley, cat"*

### Copy to Clipboard
- One-click copy on every emoji card and detail page
- Toast notification confirms successful copy
- Works across all browse views, search results, and detail pages

---

## 2. Emoji Browsing & Organization

### Routes

| Route | Description |
|---|---|
| `/` | Homepage — leads with online tools (search, popular tools, categories); compact “Looking for emojis?” links |
| `/emoji` | Emoji hub (former homepage): search, popular emojis, category grid, games, emoji tools, collections, blog preview |
| `/categories` | Grid of all 10 categories with sample emojis and counts |
| `/category/[category]` | Full emoji grid for a single category |
| `/collection` | Hub linking to all browse modes |
| `/collection/alphabet` | All 3,790+ emojis listed A–Z by official name |
| `/collection/detail` | Full library with name, category, and metadata visible inline |
| `/table/emoji-alphabet-shaped` | Curated table of emojis that visually resemble letters A–Z |

### The 10 Emoji Categories

| Category | Contents |
|---|---|
| Smileys & Emotion | Faces, gestures, hearts |
| People & Body | Skin-tone variants, family combinations, 2,200+ emojis |
| Animals & Nature | Animals, plants, weather |
| Food & Drink | All food and beverage emojis |
| Travel & Places | Vehicles, buildings, geography |
| Activities | Sports, games, hobbies |
| Objects | Tools, clothing, technology |
| Symbols | Arrows, zodiac, currency, religious |
| Flags | 270+ country and regional flags |
| Component | Skin-tone modifiers and hair components |

### Popular Emojis
- The /emoji hub shows a curated selection of frequently-used emojis
- Covers sports, games, animals, and celebrations

---

## 3. Emoji Detail Pages

Each of the 3,790 emojis has its own page at `/emoji/[slug]` containing:

- **Large character display**
- Official Unicode name and category / subgroup
- Unicode version introduced and codepoint(s)
- Shortcode aliases (Slack, GitHub, Discord formats)
- Keywords for context
- **How-to-use section** — four methods explained:
  - Copy-paste from Emojar
  - Shortcode input (e.g. `:heart:`)
  - Mobile keyboard (emoji keyboard on iOS/Android)
  - System emoji picker (Windows `Win + .` / macOS `Cmd + Ctrl + Space`)
- **Related emojis** — linked tiles to similar emojis
- Breadcrumb navigation
- Structured data (JSON-LD) for SEO

---

## 4. Emoji Collections

### Holiday & Event Collections (`/emoji-collections/events`)

15 themed emoji packs, each with a description, accent color, and 10 curated emojis:

| Collection | Emojis |
|---|---|
| New Year's Day | 🎆🎇✨🥂🍾🎉🎊🕛🌟🎈 |
| Lunar New Year | 🧧🐉🎊🥢🏮🌕🎑🦁🐅🐇 |
| Valentine's Day | ❤️💘💝💖💌🌹🍫🧸💑😍 |
| St. Patrick's Day | 🍀☘️🌈🪄🎩🐍🏺🎶🌿🍺 |
| Easter | 🐣🥚🐇🌷🌸🌼🧺🍬🌞🦋 |
| Mother's Day | 💐🌷🌸🧁💝🫂👩‍👧🎀🌺📝 |
| Father's Day | 👔🏅🎣🔧⚽🍺🛠️👨‍👧‍👦🎮🏕️ |
| Independence Day (US) | 🇺🇸🎆🎇🦅🔔🎉🍔🌭🎠🏈 |
| Pride Month | 🏳️‍🌈❤️🧡💛💚💙💜🌈🤝🎉 |
| Thanksgiving | 🦃🍂🍁🥧🌽🍖🥕🌾🍽️🙏 |
| Halloween | 🎃👻🕷️🦇🕯️🔮🧙‍♀️💀🌙🕸️ |
| Cyber Monday | 💻📱🛒💳🏷️⚡🖥️🖱️🔋📦 |
| Black Friday | 🛍️🏷️💸🤑🛒💥🎯🔖💰⌚ |
| Christmas | 🎄🎅🤶🦌🎁❄️⛄🔔🌟🕯️ |
| Diwali | 🪔✨🎆🌺🎊🙏🪅🍬🌸🎇 |

- **Auto-highlights upcoming events** based on current date
- Each collection links to emoji detail pages

---

## 5. Emoji Games

All 18 games at `/games` are:
- **Browser-based** — no download, no account required
- **Free to play**
- **Locally scored** — scores stored in `localStorage`

### Game Hub (`/games`)
- Colorful compact tile grid with gradient backgrounds
- Each tile shows game name, emoji icon, one-line description, and hover animation

---

### Game 1 — XO (Tic-Tac-Toe) · `/games/xo`
- Play against a **computer AI** or a second human player
- Configurable **board sizes**: 3×3, 4×4, 5×5
- Choose **custom emoji pieces** for X and O
- AI strategy: win → block → center → corner → random
- Tracks: winner, board size, move count, and game duration

### Game 2 — Snake · `/games/snake`
- 20×20 grid
- Guide an emoji snake to eat randomized fruit emojis
- Speed increases as snake grows
- Score = length × base multiplier
- High score history stored locally

### Game 3 — Minesweeper · `/games/minesweeper`
- Uncover emoji tiles; flag hidden bombs
- Number tiles reveal adjacent mine count
- Configurable difficulty (mine density)
- Win/loss tracking

### Game 4 — Hangman · `/games/hangman`
- Guess emoji Unicode names letter by letter
- **SVG hangman drawing** progresses with wrong guesses (6 max)
- On-screen alphabet keyboard
- Word pool: emoji names filtered to 4–16 letters, deduplicated by character
- Tracks: wins/losses, wrong guesses per round, duration

### Game 5 — Bubble Shooter · `/games/bubble-shooter`
- 10×12 grid with colored emoji bubbles (6 colors)
- Match 3+ adjacent bubbles of the same type to pop them
- Floating bubbles (disconnected from top) fall automatically
- New row pushes down every 5 shots
- Win by clearing all; lose if bubbles reach the bottom
- Chain reactions earn bonus points

### Game 6 — Guess the Flag · `/games/guess-the-flag`
- Flag emoji is shown; pick the correct country from **4 multiple-choice options**
- Covers all 270+ flag emojis
- Tracks score (correct/total) and streak

### Game 7 — Emoji Puzzle · `/games/emoji-puzzle`
- Memory match: flip emoji cards, find all pairs
- **Three difficulty levels:**
  - Easy: 4×4 grid (8 pairs)
  - Medium: 6×6 grid (18 pairs)
  - Hard: 8×8 grid (32 pairs)
- Tracks move count and best time

### Game 8 — Older or Newer · `/games/older-or-newer`
- Two emojis shown side by side
- Guess which was **added to Unicode first**
- Spans 16 Unicode versions (2010–2024)
- Tests historical emoji knowledge
- Score tracking

### Game 9 — Guess the Animal · `/games/guess-the-animal`
- 130 animal emojis in quiz format
- Name the animal emoji shown
- Displays a **fun fact** after each correct answer
- Categories: mammals, birds, reptiles, marine life, etc.

### Game 10 — Odd One Out · `/games/odd-one-out`
- 50+ curated rounds
- Five emojis shown; four share a theme, **one doesn't belong**
- Logic/trivia format
- Categories: food, animals, sports, nature, and more

### Game 11 — Emoji Wordle · `/games/emoji-wordle`
- Guess a **5-letter emoji name** in 6 tries
- Letter-level feedback: green (correct position), yellow (wrong position), gray (not in word)
- Colour-coded on-screen keyboard tracks every guessed letter
- Word pool: all single 5-letter words from the 3,700+ Unicode emoji name database
- New random word each game; target emoji revealed on win/loss

### Game 12 — Emoji 2048 · `/games/emoji-2048`
- Classic 2048 sliding-tile game on a 4×4 grid
- Tiles display emoji instead of numbers: 🌱(2) → 🌿 → 🍀 → 🌸 → 🌺 → 🌻 → 🎃 → 🎄 → 🌈 → ⭐ → 🏆(2048)
- Arrow keys (desktop) or swipe (mobile) to slide
- Score = sum of all merged tile values; personal best saved in localStorage
- Win state when 🏆 tile appears (option to keep going); lose state when no moves remain

### Game 13 — Emoji Whack-a-Mole · `/games/whack-a-mole`
- 3×3 grid of holes; random emojis from the dataset pop up
- Visible for 800 ms before hiding; spawn interval shrinks over time (starts 1000 ms, min 400 ms)
- **30-second timer**; score = total hits
- High score stored in localStorage

### Game 14 — Emoji Speed Sort · `/games/speed-sort`
- One emoji shown per round; player presses the correct category button from 4 choices
- Categories: Smileys & Emotion · Animals & Nature · Food & Drink · Travel & Places
- **3-second countdown** per round; wrong answer or timeout reveals the correct category
- **10 rounds** per game; consecutive-correct streak tracked; wrong answer resets streak

### Game 15 — Emoji Timeline Challenge · `/games/emoji-timeline`
- **5 emojis** shown in scrambled order; player reorders them oldest → newest by Unicode version
- Click-to-select + click-to-swap interaction (no external drag-and-drop library)
- Submit reveals how many are in the correct position; correct order with version numbers shown
- **5 rounds**; max score 25 (5 correct positions × 5 rounds)

### Game 16 — Emoji Pictionary · `/games/emoji-pictionary`
- 40 pre-built emoji clues mapped to accepted text answers
- Player types in a text box; correct answers accepted instantly (case insensitive, any valid synonym)
- **60-second timer** — solve as many as possible; skip button available
- Score = number correct out of 40

### Game 17 — Emoji Missing Piece · `/games/missing-piece`
- **3×3 grid** of emojis all from the same category; one cell hidden as ❓
- Pick the correct emoji from **4 multiple-choice options** (1 correct + 3 distractors from same category pool)
- Correct answer always revealed after each pick
- **10 rounds**; score = correct picks

### Game 18 — Emoji Story Builder · `/games/story-builder`
- **6 chapter slots**; each slot offers 4 random emojis from different categories
- Player picks one emoji per chapter sequentially
- After all 6 chosen, app generates a short story sentence per chapter using templates
- **Share Story** button copies the 6-emoji sequence to clipboard
- New Story button re-randomizes all chapter options

---

## 6. Blog

### Blog Index (`/blog`)
- Lists all posts with publication date, title, description, and tags
- Tags system for filtering/grouping posts

### Published Articles (15 posts)

| Post | Type |
|---|---|
| How We Recovered Emojar From a Google Indexation Drop | Technical / SEO |
| What's New on Emojar — May 2026 Updates | Platform update |
| Emoji Collections for Every Holiday & Event | Feature highlight |
| How to Play Odd One Out | Game guide |
| How to Play Guess the Animal | Game guide |
| How to Play Emoji Puzzle | Game guide |
| How to Play Older or Newer | Game guide |
| Emojar Games Is Live | Announcement |
| How to Play Bubble Shooter | Game guide |
| How to Play Hangman | Game guide |
| How to Play Minesweeper | Game guide |
| How to Play Snake | Game guide |
| How to Play XO (Tic-Tac-Toe) | Game guide |
| (Earlier blog posts) | Various |

---

## 7. Legal & About Pages

| Page | Contents |
|---|---|
| `/about` | What Emojar is, core features, creator (Siavash Ghanbari Hamzehkolaei, Berlin), data sources, funding model |
| `/contact` | Three-category contact form (General, Press, Legal/GDPR/DMCA); email: emojar.info@gmail.com |
| `/privacy` | GDPR-compliant privacy policy: data controller, what's collected (server logs, Google Analytics, AdSense cookies), legal basis, user rights |
| `/terms` | Terms of Service: permitted use, IP ownership, ads disclosure, warranty disclaimer, liability limitation |
| `/impressum` | German legal notice (TMG/MStV): owner name and Berlin address, DSA single point of contact, EU dispute resolution |

---

## 8. SEO & Technical Features

### Sitemap & Crawlability
- Dynamic XML sitemap at `/sitemap.xml` covering:
  - All static routes (with `priority` and `changeFrequency` per route type)
  - All 10 category pages (`priority: 0.8`, `changeFrequency: weekly`)
  - All 3,790 emoji detail pages (`priority: 0.7`, `changeFrequency: monthly`, stable `lastModified: 2024-01-01`)
  - All blog posts (with actual publication dates)
- `robots.txt` — allows all major crawlers
- **www → non-www permanent redirect** — `www.emojar.com` redirects to `emojar.com` via the Vercel dashboard (Domains setting)
- **Dead route redirects** — `/collections`, `/collections/alphabet`, `/collections/detail`, `/sorted`, `/sorted/alphabet`, `/sorted/detail` redirect to `/collection/*` via `next.config.ts`

### Structured Data & Social Metadata
- **JSON-LD** breadcrumb lists on category and emoji detail pages
- **OpenGraph metadata** on every page (og:title, og:description, og:url, og:siteName, og:type)
- **Twitter Card metadata** (`summary` card) on every page including all game pages and blog posts
- **Canonical URLs** on all pages
- **meta keywords** on home, categories, category detail pages, blog index, and all 14 blog posts
- **robots directives** per page
- **Online tools SEO** — unique title, meta description, canonical and OG/Twitter image (`/api/og?type=tool`) per tool, category and variant; JSON-LD `WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`, `CollectionPage/ItemList`; WebSite `SearchAction` → `/online-tool?q=`
- **`/llms.txt`** — Markdown index of all tool categories and tools for AI assistants, generated from the registry
- **Logo** — `public/logo.png` in the header (alt: "Emojar – free online tools")

### Emoji Detail Page Content (SEO-enriched)
- Each emoji page generates a unique **"Common uses"** paragraph from the emoji's category and keywords
- **"More in [Category]"** grid — 8 same-category emoji links per page, unique per page
- Proper **`notFound()`** call for unknown slugs (returns real 404, not soft 404)

### Performance & PWA
- Static generation for all emoji, category, and blog pages (pre-rendered at build time)
- Client-side hydration only where needed (games, search)
- `manifest.webmanifest` — generated by `app/manifest.ts` (the old static file conflicted with it and returned 500 until v0.2.0)
- Favicon set: `favicon.ico`, 16/32/96 px PNGs, Apple touch icons, Android icons (36–192 px), 512 px icon, Windows tiles + `browserconfig.xml`
- Development server: `npx next dev` (webpack). `npm run dev` (Turbopack) currently fails because of the MDX remark plugin options

### Routing Summary (4,100+ pages)

| Type | Count |
|---|---|
| Online tools (hub + 11 categories + 213 tools + 38 landing pages) | 263 |
| Static pages (home, emoji hub, legal, about, etc.) | ~11 |
| Category pages | 10 |
| Emoji detail pages | 3,790 |
| Game pages | 18 |
| Blog posts (MDX) + tool guides (`content/guides`, drip-published) | 15+ + 214 |
| Collection / sorted / table pages | ~5 |

---

## 9. User Experience

- **One-click emoji copy** — toast notification confirms
- **Fuzzy search** — results appear instantly as you type
- **Breadcrumb navigation** — clear path from category → emoji detail
- **Related emojis** — cross-linked from every detail page
- **Popular emojis** — curated selection on the /emoji hub
- **Local score history** — all game scores persist in `localStorage`
- **Mobile-first responsive design** — works on all screen sizes
- **Keyboard accessibility** — detail pages explain how to type emojis with Win/Mac/mobile keyboard shortcuts
- **Back-to-top button** — sticky button on long pages
- **Desktop & mobile menus** — separate components for each viewport; two top-level entries: **Online Tools** (all 9 categories) and **Emoji** (search, categories, collections, emoji tools, games)

---

## 10. Monetization

- **Google AdSense** — display advertising via `AdSlot` component placed on pages
- `data-ad-client` configured globally in site layout
- **Future:** potential affiliate links (disclosed in Terms of Service)
- No subscription, no paywall — all features are free

---

*Built with Next.js 15 · React 19 · TypeScript · Tailwind CSS · Fuse.js · pdf-lib · pdf.js · Deployed on Vercel*
