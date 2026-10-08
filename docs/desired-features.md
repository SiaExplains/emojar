# Emojar Feature Implementation Task List

> This document is a structured task list for AI-assisted implementation.
> Each feature includes a description, implementation notes, and acceptance criteria.

---

## 🌐 Site & Navigation

### [ ] Social Media Links

**Description:** Add links to Emojar's official social media profiles in the site header or footer.
**Implementation:**

- Add social media icon links (Instagram, X/Twitter, TikTok, Facebook, etc.) to the global layout component
- Icons should open in a new tab (`target="_blank"`)
- Use SVG icons for each platform for crisp rendering at all sizes
  **Acceptance Criteria:**
- Links are visible on every page (header or footer)
- All links open in a new tab
- Icons are accessible with `aria-label` attributes

---

### [ ] Multi-Language Support (i18n)

**Description:** Make the app available in multiple languages so users worldwide can use Emojar in their native language.
**Implementation:**

- Integrate an i18n library (e.g., `next-intl` or `i18next` depending on the stack)
- Extract all UI strings into locale files (e.g., `en.json`, `de.json`, `fr.json`, `es.json`, `ja.json`, `ar.json`)
- Add a language switcher in the header/navigation
- Set the `lang` attribute on the `<html>` element dynamically
- Support RTL languages (Arabic, Hebrew) with layout mirroring
  **Acceptance Criteria:**
- At least 5 languages supported at launch
- Language preference is persisted (localStorage or URL prefix like `/de/...`)
- All visible UI text is translatable (no hardcoded strings in components)

---

## ⌨️ Emoji Tools

### [ ] Skin Tone / Color Changer

**Reference:** https://emojicopy.com/
**Description:** Let users select a skin tone or color variant for emojis that support it (faces, hand gestures, people). The modified emoji is then available to copy.
**Implementation:**

- Detect emojis that support Unicode skin tone modifiers (Fitzpatrick scale: 🏻🏼🏽🏾🏿)
- On emoji detail page and emoji card hover/click, show a color swatch picker
- Applying a skin tone modifier appends the correct Unicode modifier codepoint
- Show the modified emoji preview before copying
  **Acceptance Criteria:**
- Skin tone picker appears only for supported emojis
- Selecting a tone immediately updates the displayed emoji
- The modified emoji copies correctly to clipboard

---

### [ ] Emoji Image Combinator (Emoji Mashup)

**Reference:** https://emojipedia.org/emoji-mashup/twitter/twemoji-14.0 | https://github.com/twitter/twemoji
**Description:** A feature that visually merges two emojis into a single combined image, similar to Google's Emoji Kitchen. Users pick two emojis and get a blended/mashup image.
**Implementation:**

- Integrate with an existing emoji mashup API or dataset (e.g., Google Emoji Kitchen API or Twemoji-based mashup dataset)
- Build a two-slot picker UI: user selects Emoji A and Emoji B
- Display the generated mashup image
- Allow the user to download or copy the mashup image
  **Note:** This requires either a third-party API or a pre-generated mashup image dataset. Evaluate API availability and licensing before implementing.
  **Acceptance Criteria:**
- User can pick two emojis from a searchable selector
- A mashup/combined image is displayed
- User can download the result as PNG

---

## 📖 Emoji Information Pages

### [ ] Emoji in Other Languages Table

**Description:** On each emoji's detail page, show what the emoji is called in popular languages (e.g., Spanish, French, German, Japanese, Arabic).
**Implementation:**

- Source multilingual emoji names from Unicode CLDR data (https://github.com/unicode-org/cldr)
- Display a table on each emoji detail page: Language | Native Name
- Support at least 10 major languages
  **Acceptance Criteria:**
- Language table is shown on every emoji detail page
- Data sourced from Unicode CLDR or equivalent authoritative source

---

## 🧰 Online Tools — Follow-ups

> The Online Tools platform shipped in v0.2.0 (see `current-features.md` §0).
> These are known gaps and natural next steps. Add new tools as registry
> entries in `lib/online-tools/tools/` (see README → “Adding an online tool”).

### [x] Fix `npm run dev` with Turbopack

**Description:** Fixed in v0.13.0: `@next/mdx` was 16.x on Next 15 (its Turbopack rule format didn't match) — pinned to 15.5.9; `remark-gfm` is referenced by name so the options are serialisable; and `fs`/`path` are aliased to an empty module for Turbopack browser bundles (qpdf-wasm), mirroring the webpack fallback. `npm run dev` now serves blog MDX and every tool page.

### [x] “Download all as ZIP” for the remaining batch outputs

**Description:** Shipped in v0.13.0: every multi-file result list (`OutputList` in `components/online-tools/image-results.tsx`) — Image Converter, Compressor, Resizer, Split PDF and the other batch tools — has a **Download ZIP** button (fflate, names de-duplicated); “Download each” is still there.

### [ ] AI background removal (opt-in)

**Description:** The current Background Remover handles plain/solid backgrounds only.
**Implementation:** optional in-browser segmentation model (permissively licensed, e.g. MediaPipe), downloaded only when the user opts in; keep the current fast mode as default.
**Acceptance Criteria:** people/objects can be cut out of photos without uploading them; page states the model download size.

### [x] OCR for scanned PDFs

**Description:** Shipped in v0.13.0: PDF to Text renders pages without a text layer and reads them with Tesseract.js (shared setup in `components/online-tools/tools/ocr-shared.ts`), with a language picker, an “OCR every page” option and a 60-page cap per run.

### [ ] More audio & video tools

**Description:** Shipped: MP4 to MP3 and Video to GIF (v0.3.0); Video Compressor, Audio Trimmer/Converter and Voice/Screen Recorders (v0.11.0); **Video Trimmer** with fast (stream copy) and precise (re-encode) cuts (v0.13.0). Still missing: formats the browser can't decode (some MOV/HEVC, AVI, WMV) — FFmpeg.wasm was considered and skipped for now (GPL, ~32 MB).

### [x] More conversion landing pages

**Description:** Shipped in v0.13.0: AVIF to JPG, GIF to PNG, km to miles, kg to lbs and Celsius to Fahrenheit.

### [x] Blog post announcing the Online Tools platform

**Description:** Shipped in v0.3.0 as the guide `emojar-free-online-tools-that-run-in-your-browser` (published 2026-10-07).

### [x] Readability scores for other languages

**Description:** Shipped in v0.13.0: German (Flesch-Amstad, 1st Wiener Sachtextformel), Spanish (Fernández Huerta, corrected; Szigriszt-Pazos/INFLESZ) and French (Kandel–Moles), each with its own syllable heuristic. English stays the default.

### [x] Timer alarms in background tabs

**Description:** Shipped in v0.13.0: Timer and Pomodoro schedule a single timeout for the exact end time and re-check on `visibilitychange`; the beep's AudioContext is unlocked on the Start click so Safari/iOS can play it later.

### [ ] Mic/webcam tests and recorders: verify on real devices

**Description:** Needs a person with the devices: run [`docs/qa/device-checklist.md`](qa/device-checklist.md) on macOS, Windows, Android and iOS and record the results there. Bugs found while writing the checklist (Safari mic mixing, stopped-sharing during the countdown, the voice meter while paused, alarm notifications on Android, timer beeps on iOS) were fixed in v0.13.0.

### [ ] Reference tools: checks on real devices

**Description:** Data checks are done (v0.13.0: every keyboard shortcut checked against official docs, one Edge-on-macOS key fixed; element discovery years corrected). Still to do by hand with the checklist in `docs/qa/device-checklist.md`: listen to the Morse audio and check the Flag Explorer on Windows (it now detects missing flag emoji, shows ISO codes and turns the quiz off).

### [x] World Time Zone Map: avoid overlapping city labels

**Description:** Shipped in v0.13.0: greedy label placement (`placeLabels` in `engines/timezones.ts`) tries right, left, above and below each dot and hides labels that fit nowhere; the focused city always gets one.

### [x] Unicode explorer: whole-word name search

**Description:** Shipped in v0.13.0: whole-word matches rank first and single letters must be whole words, so “latin small e acute” returns é first.

### [x] Braille: contracted (Grade 2 / UEB) mode and quotes

**Description:** Shipped in v0.13.0: Grade 2 (contracted UEB) both ways via liblouis 3.39 compiled to WebAssembly (`public/vendor/liblouis/`, LGPL-2.1+, rebuild with `npm run build:liblouis`); Grade 1 decoding now reads ⠦ at the start of a word as an opening quote.

### [ ] Refresh bundled reference data

**Description:** Generators now live in `scripts/reference-data/` (see its README). Run `npm run data:reference` once a year and when Unicode ships a new major version, then review the diff and run the tests. Last run: October 2026 (discovery years corrected).

---
