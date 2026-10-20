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

## 🔎 SEO, design & ads plan (from the October 2026 audit)

> Full findings and measurements: `emojar-docs/audit-2026-10/stage-a-audit.md` (outside the repo). Each stage is its own PR.

### [x] B0 — Trust fixes

**Description:** Shipped in v0.15.2: privacy policy, About, Terms and FAQ match real behaviour (Vercel Web Analytics, Google's consent message, optional third-party features, local storage); counts come from the data.

### [x] B — Design foundation

**Description:** Shipped in v0.16.0 (game buttons left for a later pass). Tailwind tokens (one accent, neutrals, semantic colours, radii, type scale), global focus ring, skip link, reduced-motion rule, no text under 12 px, shared Button/Card/Input beyond the tools, header nav (Tools · Emoji · Games · Guides · Help), accessible mobile menu, footer `<nav>`, fix nested `<main>`.

### [x] C — Homepage and tools directory

**Description:** Shipped in v0.17.0. Calmer homepage hierarchy (search → editorial picks labelled as such → categories → emoji/games/collections → guides → trust strip); hub category chips with counts and an empty-search reset; every tool stays a crawlable link.

### [x] D — Tool-page shell

**Description:** Shipped in v0.18.0 (CLS ≈ 0 on measured tools; ad slot off until a real slot id is set). Back-links to category and directory, guide link, reserved space for one ad below the tool, fix the Word Counter layout shift (CLS 0.053).

### [ ] Full-width follow-ups (from v0.19.0)

**Description:** Pages are full width since v0.19.0. Two small decisions are open: (1) game boards still play in a centred area — stretch them only if a game benefits (e.g. Minesweeper's grid), never by default; (2) the 12 "Popular tools" picks (homepage and `/online-tool` since v0.22.0) leave 2 tiles on the last row at 5 columns — use 10 or 15 picks (`FEATURED_TOOLS` in `lib/online-tools/registry.ts`).

### [x] iLovePDF-style redesign

**Description:** Shipped in v0.22.0: grey page with white tiles and category-tinted icon squares, every tool on the homepage under filter pills, uppercase header nav with a Tools mega-menu, centred tool headers, card surfaces for how-to/about/FAQ, restyled blog, games and footer.

### [ ] Lighter homepage after the redesign

**Description:** Since v0.22.0 the homepage HTML is ~86 KB gzipped (was ~40 KB) because it lists all tools. The hero `ToolSearch` also inlines the whole search index (~100 KB raw) — load it on first focus from `/search-index.json` like `HeaderSearch` does, on the homepage and `/online-tool`. Optionally wrap the plain-text info pages (about, privacy, terms, contact) in a white `card`.

### [ ] Pre-existing hydration errors

**Description:** Found during the v0.22.0 sweep: Emoji 2048 builds its random start board during render (server and client differ); 28 MDX posts in `app/blog/*/page.mdx` wrap text in a styled `<p>` that MDX wraps in another `<p>`. Fix by hand — never run prettier on the MDX files.

### [x] E — Technical SEO

**Description:** Shipped in v0.20.0; the Vercel www → apex redirect is permanent (308) since 2026-10-20. Metadata and canonicals for `/emoji-collections/events`, `/collection/alphabet`, `/collection/detail` and `/table/emoji-alphabet-shaped`; self-canonical blog pages 2+ and `noindex,follow` tag views; shorter title templates (no slug changes); OG images for blog, games and info pages; fix the `/sorted/alphabet` link. Manual step done 2026-10-20: www → apex is a 308.

### [ ] Watch the v0.20.0 title change in Search Console

**Description:** v0.20.0 shortened the titles of all 3,789 emoji pages ("🍕 Pizza Emoji — Meaning & Copy | Emojar") and ~35 tool/blog titles. Compare impressions, clicks and CTR for `/emoji/*` for four weeks before and after the release; revert the template in `app/emoji/[slug]/page.tsx` if CTR drops noticeably. Vercel www → apex is a permanent 308 since 2026-10-20.

### [ ] F — Performance and ads

**Description:** Move the emoji dataset out of client bundles (emoji hub, emoji tools and 10 games are ~340 kB first load vs ~110 kB elsewhere); split or stream `/collection/alphabet` (3.5 MB HTML) and the largest emoji category pages; `AdSlot` with reserved height and placement rules; PageSpeed Insights before/after.

### [ ] G — Content and AdSense resubmission

**Description:** Visible guide bylines and Person author on the older posts, an RSS feed; improve the highest-traffic pages using Search Console data; then resubmit (see `docs/adsense-tasks.md`). Done in v0.25.0: every guide is published, the sitemap lists all 331 blog posts and `llms.txt` covers the emoji pages and older posts. Watch Search Console coverage for the ~200 guides published at once on 2026-10-17.

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
**Meanwhile:** for manual cut-outs with layers and masks, Image Tools links to MYLPER (external, browser-based) since v0.15.0.

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

### [ ] Header search: guides and emojis in the results

**Description:** The header search (v0.13.0) matches tools and landing pages only, and links out to the tools hub and the emoji search for more.
**Implementation:** add the published guides (title, description, `/blog/<slug>`) to `searchIndex()` with a “Guide” label, and optionally the top emoji matches from a small name index, keeping everything lazy-loaded.
**Acceptance Criteria:** typing “merge pdf” also shows the Merge PDF guide; the index stays under ~100 KB gzipped and still loads only on first use.

### [ ] Video Trimmer: check on Safari and Firefox

**Description:** Trimming was verified in Chromium (MP4 and recorded WebM). Safari 17+ and Firefox 130+ have WebCodecs but haven't been tried with real phone videos (HEVC MOV from iPhone, long 4K clips).
**Acceptance Criteria:** run §10 of `docs/qa/device-checklist.md` on those browsers and record the results; unsupported formats show the friendly error, never a blank result.

### [ ] Interactive tools (v0.14.0): checks on real touch devices

**Description:** The 18 tools from v0.14.0 were checked at 375 px in a desktop browser, with keyboard alternatives to every drag. Still to do on real phones and tablets: dragging cards in the Kanban Board and Eisenhower Matrix, drawing in the Pixel Art Editor, dragging points in the SVG Path Editor, Clip-Path Generator and Mesh Gradient Generator, and the PNG/GIF/SVG downloads on iOS Safari.
**Acceptance Criteria:** run §11 of [`docs/qa/device-checklist.md`](qa/device-checklist.md) on those devices and record the results there.

### [ ] Color Blindness Simulator: exact anomaly severities

**Description:** Protanomaly, deuteranomaly and tritanomaly currently interpolate linearly between normal vision and the full Machado 2009 matrix. Machado publishes a matrix for each severity step (0.1–1.0).
**Implementation:** add the published tables to `lib/online-tools/engines/color-blindness.ts` and interpolate between neighbouring steps.

### [ ] Shared drag helper for HTML elements

**Description:** `useSvgDrag` (in `components/online-tools/tools/playground-shared.tsx`) covers SVG handles; the Kanban/Eisenhower card drag (`productivity-shared.tsx`), the transform box and the chess board each have their own pointer code for HTML elements.
**Implementation:** one `usePointerDrag` hook for HTML elements with drop targets, used by all four; no behaviour change.

### [ ] Refresh bundled reference data

**Description:** Generators now live in `scripts/reference-data/` (see its README). Run `npm run data:reference` once a year and when Unicode ships a new major version, then review the diff and run the tests. Last run: October 2026 (discovery years corrected).

### [ ] New tools (v0.23.0): checks on real devices

**Description:** Typing Speed Test, Resume Builder, Online Notepad and Flashcard Maker were tested in a desktop browser at 1280 and 375 px. Still to do on real phones: typing with on-screen keyboards and autocorrect (iOS Safari, Android Chrome), the resume's Print → Save as PDF on iOS, and localStorage persistence in Safari after a week without visits (Safari can evict site data).

### [ ] Batch of 20 tools (v0.24.0): follow-ups

**Description:** Checked in a desktop browser at 1280 and 375 px. Still to do: tap-to-pick in the Image Color Picker and the magnifier on real phones (iOS Safari, Android Chrome); a 20 MB CSV in the CSV Viewer on a mid-range phone; Social Share Preview PNG export in Safari. Known heuristics to revisit if users report issues: sentence splitting (`splitSentences` in `engines/text-analysis.ts`), the HTML→JSX tokenizer (`engines/html-jsx.ts`), and `jsonErrorOffset` reporting column 1 for a truncated literal such as `tru`. The TOML converter intentionally supports a subset (no null; nulls in arrays refused).

### [ ] Resume PDF: fonts for non-Latin scripts

**Description:** `resumePdf()` uses pdf-lib's standard Helvetica (WinAnsi), so Cyrillic, Greek, Arabic, Persian and CJK resumes get an error that points to Print → Save as PDF. Option: lazy-load a subset font (e.g. Noto Sans, OFL) with `@pdf-lib/fontkit` only when the text needs it, so Latin users don't pay the ~200 KB+ download.

---
