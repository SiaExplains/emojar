# Emojar Feature Implementation Task List

> This document is a structured task list for AI-assisted implementation.
> Each feature includes a description, implementation notes, and acceptance criteria.
> Features marked **⚠️ NEEDS CLARIFICATION** are placed at the bottom — review and fill in details before implementing.

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

### [ ] Emoji Virtual Keyboard
**Reference:** https://emojiterra.com/keyboard/
**Description:** An interactive virtual keyboard that displays all available emojis. Users can click emojis to build up text in an input box, then copy the full string at once.
**Implementation:**
- Build a keyboard UI component with emoji grid grouped by category
- Include a text input/area at the top where clicked emojis are appended
- Add a "Copy All" button that copies the full input content to the clipboard
- Support backspace/clear button
- Include a search bar within the keyboard to filter emojis
- Make the keyboard accessible via a floating toggle button or dedicated `/keyboard` page
**Acceptance Criteria:**
- Clicking an emoji appends it to the input
- "Copy All" copies the full composed string
- Keyboard is usable on both desktop and mobile

---

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

### [ ] Cross-Platform Emoji Appearance
**Description:** Show how the same emoji is rendered differently across platforms and operating systems (Apple, Google, Microsoft, Samsung, WhatsApp, Twitter/X, Facebook).
**Implementation:**
- Source platform-specific emoji images from a dataset like Emojipedia's or use the `emoji-datasource` npm package which includes per-vendor images
- On each emoji detail page, show a grid: Platform Name | Emoji Image
- Clearly label each platform
**Acceptance Criteria:**
- At least 6 major platforms shown (Apple, Google/Android, Microsoft, Samsung, WhatsApp, Twitter)
- Images clearly labeled with platform names

---

### [ ] Chat Usage Examples
**Description:** Show real-world example sentences or chat messages demonstrating how an emoji is commonly used in conversation.
**Implementation:**
- Add a "Chat Examples" section to each emoji detail page
- Include 3–5 example chat messages or captions using the emoji in context
- Content can be hand-curated for popular emojis and AI-generated for the rest
- Display examples in a chat-bubble UI style
**Acceptance Criteria:**
- At least 3 examples per emoji
- Examples are displayed in a readable, chat-like format

---

## 📊 Emoji Collections & Categories

### [ ] Top 100 Most Used Emojis
**Description:** A dedicated page listing the 100 most frequently used emojis globally, ranked by popularity.
**Implementation:**
- Source popularity data from a reliable dataset (e.g., Unicode consortium reports, Twitter/X emoji usage data, or a third-party API)
- Build a `/top-100` page with ranked list
- Show rank number, emoji, name, and a copy button
- Update the list periodically (consider a scheduled data refresh)
**Acceptance Criteria:**
- 100 emojis displayed with rank and name
- Each emoji is copyable
- Data source is credited

---

### [ ] Platform-Specific Emoji Sets
**Reference:** Microsoft, Apple, Android/Google, Samsung, etc.
**Description:** Browse emojis as they appear specifically on a given platform. Users can filter the emoji library by platform to see that platform's exact visual style.
**Implementation:**
- Add a platform filter/toggle to the main emoji browser
- Source per-platform emoji images from `emoji-datasource` or equivalent
- When a platform is selected, swap out the default emoji images for that platform's versions
**Acceptance Criteria:**
- At least 4 platforms supported (Apple, Google, Microsoft, Samsung)
- Filtering by platform updates all emoji images on the page

---

### [ ] Color-Based Emoji Categories
**Reference:** https://emojiterra.com/emojis-in-different-colors/
**Description:** Browse emojis filtered by their dominant color. Useful for designers or users looking for a specific color theme.
**Implementation:**
- Tag each emoji in the dataset with its dominant color(s) (red, blue, green, yellow, purple, black, white, etc.)
- Build a `/emojis/by-color` page with color swatches as filters
- Clicking a color shows all emojis with that dominant color
**Acceptance Criteria:**
- At least 8 color categories
- Color filter updates the emoji grid in real-time

---

### [ ] Emoji Phrase Combinations
**Reference:** https://emojiterra.com/emoji-combinations/
**Description:** Showcase popular multi-emoji combinations that are commonly used together to convey a meaning or mood (e.g., 😊🙏 = grateful, 🔥💯 = amazing).
**Implementation:**
- Curate a dataset of popular emoji pair/phrase combinations with their meaning
- Build an `/emoji-combinations` page displaying each combination
- Include the meaning and a "Copy combo" button for each
- Optionally allow users to submit their own combinations
**Acceptance Criteria:**
- At least 50 curated combinations at launch
- Each combination is copyable as a single string
- Each combination has a brief meaning/label

---

## 📅 Emoji History & Standards

### [ ] Emoji Version Timeline
**Reference:** https://emojipedia.org/emoji-versions
**Description:** A visual timeline showing all major emoji versions (Unicode releases) and which emojis were introduced in each version.
**Implementation:**
- Source emoji version data from Unicode's emoji changelog or `emoji-data` package (each emoji has a `added_in` version field)
- Build an `/emoji-versions` page with a timeline UI
- Each version entry shows: version number, release year, count of new emojis, and the new emojis themselves
**Acceptance Criteria:**
- All official Unicode emoji versions represented
- New emojis per version are listed and copyable
- Timeline is visually clear (chronological, scrollable)

---

### [ ] Emoji Proposals Page
**Reference:** https://emojipedia.org/proposals | https://unicode.org/emoji/proposals.html
**Description:** A page tracking emoji proposals currently under review by the Unicode Consortium — upcoming emojis that may be added in future versions.
**Implementation:**
- Regularly fetch or scrape proposal data from Unicode's official proposals page
- Display proposals with: proposed emoji image/concept, name, status (draft/approved/rejected), expected version
- Consider a "Notify me" or "Vote" mechanism for user engagement
**Acceptance Criteria:**
- Proposals page lists current active proposals with status
- Data is kept up to date (manual or automated sync)
- Clear distinction between approved, pending, and rejected proposals

---

## ✨ AI Features

### [ ] AI Sticker Maker
**Description:** Users describe a sticker idea in text (prompt), and AI generates a custom sticker-style image based on the prompt, inspired by emoji aesthetics.
**Implementation:**
- Integrate an image generation API (e.g., OpenAI DALL·E, Stability AI, or Replicate)
- Build a `/sticker-maker` page with a prompt input and generate button
- Style the generated output as a sticker (transparent background, bold outline if possible)
- Allow users to download the generated sticker as PNG
- Add rate limiting or credit system to prevent abuse
**Note:** Requires API key management and cost budgeting. Evaluate which image generation API fits the use case and budget.
**Acceptance Criteria:**
- User can enter a prompt and generate an image
- Generated image is downloadable
- Rate limiting is in place to control API costs

---

---

## ⚠️ NEEDS CLARIFICATION

> The following features need more detail before implementation can begin. Please review and clarify.

---

### [ ] ⚠️ Emoji Phrase Combinator vs. Emoji Image Combinator — Clarification Needed
**What's in the doc:**
- "Emoji Phrase Combinator" — described as "just 2 emojis together like: 😊🚣🏻‍♀️"
- "Emoji Image Combinator" — references Twemoji mashup (visual merging of two emojis into a new image)

**Questions:**
1. Is the "Emoji Phrase Combinator" simply a curated list of popular 2-emoji combinations (like 😊🙏, 🔥💯) that users can copy? Or is it something else?
2. Is the "Emoji Image Combinator" the same as Google's Emoji Kitchen (two emojis fused into one new image), or something different?
3. Are these two separate features or one feature with two modes?

**Currently implemented above as:** Phrase Combinator = curated emoji pairs, Image Combinator = mashup/fusion tool. Please confirm or correct.

---

*Last updated: 2026-05-13*
*Source: Desired-Emojar-feature-list.docx*
