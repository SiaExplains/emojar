# Emojar — Complete Feature & Capability Reference

> **Live site:** [emojar.com](https://emojar.com)  
> **Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS  
> **Last updated:** May 2026

---

## Table of Contents

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

## 1. Core Emoji Tools

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
| `/` | Homepage with search, popular emojis, category grid, A–Z link, and blog preview |
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
- Homepage shows a curated selection of frequently-used emojis
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

All 10 games at `/games` are:
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

---

## 6. Blog

### Blog Index (`/blog`)
- Lists all posts with publication date, title, description, and tags
- Tags system for filtering/grouping posts

### Published Articles (14 posts)

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
- **Logo alt text** describes the site purpose ("Emojar – Copy & paste emojis instantly") for image SEO

### Emoji Detail Page Content (SEO-enriched)
- Each emoji page generates a unique **"Common uses"** paragraph from the emoji's category and keywords
- **"More in [Category]"** grid — 8 same-category emoji links per page, unique per page
- Proper **`notFound()`** call for unknown slugs (returns real 404, not soft 404)

### Performance & PWA
- Static generation for all emoji, category, and blog pages (pre-rendered at build time)
- Client-side hydration only where needed (games, search)
- `manifest.webmanifest` — PWA-installable
- Favicon and mobile icons included
- **Turbopack** for fast development builds

### Routing Summary (46+ routes)

| Type | Count |
|---|---|
| Static pages (home, legal, about, etc.) | ~10 |
| Category pages | 10 |
| Emoji detail pages | 3,790 |
| Game pages | 10 |
| Blog posts | 14+ |
| Collection / sorted / table pages | ~5 |

---

## 9. User Experience

- **One-click emoji copy** — toast notification confirms
- **Fuzzy search** — results appear instantly as you type
- **Breadcrumb navigation** — clear path from category → emoji detail
- **Related emojis** — cross-linked from every detail page
- **Popular emojis** — curated selection on homepage
- **Local score history** — all game scores persist in `localStorage`
- **Mobile-first responsive design** — works on all screen sizes
- **Keyboard accessibility** — detail pages explain how to type emojis with Win/Mac/mobile keyboard shortcuts
- **Back-to-top button** — sticky button on long pages
- **Desktop & mobile menus** — separate components for each viewport

---

## 10. Monetization

- **Google AdSense** — display advertising via `AdSlot` component placed on pages
- `data-ad-client` configured globally in site layout
- **Future:** potential affiliate links (disclosed in Terms of Service)
- No subscription, no paywall — all features are free

---

*Built with Next.js 15 · React 19 · TypeScript · Tailwind CSS · Fuse.js · Deployed on Node.js*
