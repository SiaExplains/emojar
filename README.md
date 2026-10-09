# Emojar

Free, privacy-first **online tools** that run entirely in the browser — plus
3,790 emojis to search and copy, 18 emoji games and 8 emoji tools.
Live at [emojar.com](https://emojar.com).

- **Online tools** (`/online-tool`) — 264 tools in 13 categories: image, PDF,
  developer, text, color, calculators, unit converters, security & generators,
  date & time, audio & video, device tests, reference & learning, and productivity. Each tool has an in-depth guide
  on the blog (`content/guides/`, drip-published on a schedule), and `/faq`
  answers common questions by category. Files and text are processed on the user's device; there are
  no upload APIs and nothing is stored.
  Category pages can also list a few related free tools on other sites (FocusCrew under Date & Time
  and Productivity, MYLPER under Image Tools), from `lib/online-tools/external.ts`. They are marked
  “External site”, open in a new tab and are not counted as Emojar tools.
- **Emoji** (`/emoji`, `/emoji/[slug]`, `/categories`, `/games`,
  `/emoji-tools`) — search, browse and copy emojis, holiday collections, games
  and emoji-specific tools.
- **Blog** (`/blog`) — MDX posts.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Fuse.js ·
MDX · Vitest · ESLint + Prettier · deployed on Vercel.

Browser-side libraries used by the tools (each loaded only on the tool that
needs it): `pdf-lib`, `pdfjs-dist`, `@neslinesli93/qpdf-wasm` (PDF
encryption), `mammoth` + `html-to-pdfmake` + `pdfmake` (Word to PDF),
`heic2any`, `tesseract.js` (OCR), `gifenc`, `@breezystack/lamejs` (MP3),
`fflate` (ZIP), `qrcode`, `jsqr`, `jsbarcode`, `yaml`, `marked`, `turndown`,
`dompurify`, `exifr`, `terser`, `sql-formatter`, `prettier/standalone`,
`svgo` (SVG optimizer), `bcryptjs` (in a worker), `highlight.js` (code to image)
and `mediabunny` (WebCodecs video compression and AAC/Opus audio, MPL-2.0).

Reference data is bundled in `lib/online-tools/data/` (and
`public/data/unicode-names-18.txt`) and generated from open sources: PubChem
periodic table (public domain) with IUPAC/CIAAW standard atomic weights,
the Unicode Character Database (Unicode License v3), the WHATWG HTML entity
list, GeoNames country and city data (CC BY 4.0), Natural Earth (public
domain), the IANA time-zone database (public domain), CSS named colours and
the xkcd colour survey (CC0). Regenerate it with `npm run data:reference`
(see `scripts/reference-data/README.md`).

Braille Grade 2 uses liblouis 3.39 (LGPL-2.1+) compiled to WebAssembly in
`public/vendor/liblouis/`; rebuild it with `npm run build:liblouis` (needs
Emscripten).

## Getting started

Requires Node.js 20+ and npm.

```bash
npm ci
npx next dev
```

Then open http://localhost:3000.

> `npm run dev` uses Turbopack, which currently fails to start because the MDX
> remark plugin options can't be serialised for Turbopack on Next 15. Use
> `npx next dev` (webpack) until that is fixed.

## Scripts

| Command            | What it does                           |
| ------------------ | -------------------------------------- |
| `npx next dev`     | Development server (webpack)           |
| `npm run build`    | Production build (also runs ESLint)    |
| `npm start`        | Serve the production build             |
| `npm run lint`     | ESLint (must be clean, zero warnings)  |
| `npx tsc --noEmit` | Type check                             |
| `npm test`         | Vitest unit tests (`lib/**/*.test.ts`) |
| `npm run format`   | Prettier                               |

## Project structure

```
app/
  page.tsx                       Homepage (tools-first)
  online-tool/                   Online tools hub, category, tool and variant routes
  emoji/page.tsx                 Emoji search hub (former homepage)
  emoji/[slug]/                  Emoji detail pages (one per emoji)
  games/, emoji-*/, blog/        Emoji games, emoji tools, blog
  sitemap.ts, robots.txt/, llms.txt/, manifest.ts, api/og/
components/
  online-tools/                  ToolPage, ToolCard, ToolSearch, shared UI, tool components
  ui/styles.ts                   Shared button, input, card and link class names
  MainMenu/                      Header navigation (routes in Menu.routes.ts)
  EmojiHub.tsx, …                Emoji UI and site chrome
lib/
  online-tools/                  Tool registry, categories, SEO helpers
    tools/                       One data file per category (copy, FAQ, metadata)
    engines/                     Pure, unit-tested logic (text, data formats, units, …)
    image/, pdf/                 Browser image pipeline (Web Worker) and PDF helpers
data/                            Emoji dataset and static page content
public/                          Logo, favicons and app icons
tailwind.config.ts               Design tokens: `brand` accent (logo magenta), gray neutrals
```

**Design tokens.** Use `brand-*` for the accent (links, active states, focus
rings), `gray-*` for neutrals and emerald / amber / red for success / warning /
danger. Buttons and inputs use the classes in `components/ui/styles.ts`. Keep
text at 12 px (`text-xs`) or larger, and give every interactive element a
visible `focus-visible` style.

## Adding an online tool

The registry in `lib/online-tools/` is the single source of truth: routes,
titles, meta descriptions, canonical URLs, JSON-LD, related-tool links, the
sitemap, search and `llms.txt` are all generated from it.

1. Add an entry to the right file in `lib/online-tools/tools/` (`slug`,
   `name`, `title`, `metaDescription`, `description`, `howTo`, `about`, `faqs`,
   `relatedTools`, `component`, optional `config` and `variants`).
2. If an existing generic component fits, point `component` at it and pass
   `config`:
   - `text-transform` + a transform id from `engines/transforms.ts` (text
     tools added in v0.7.0 live in `engines/transforms-text.ts`)
   - `form-calculator` + a calculator id from `engines/calculators.ts`
   - `unit-converter` + a quantity from `engines/units.ts`
   - `color-convert`, `hash-generator`, `image-converter`, `pdf-pages`, …
3. Otherwise add a component in `components/online-tools/tools/` and register
   its key in `components/online-tools/ToolRenderer.tsx` and
   `lib/online-tools/types.ts`.
4. Put the logic in `lib/online-tools/engines/` and cover it with tests;
   `lib/online-tools/registry.test.ts` checks slugs, titles, related links and
   engine references for every tool.
5. Variant landing pages share the tool's UI; `form-calculator` and
   `text-transform` variants can preset fields with `init_<field>` config keys
   (e.g. `{ calculator: 'margin', init_mode: 'cost-markup' }`).
6. Write the tool's guide in `content/guides/<tool-slug>.md` and give it a
   publish date in `lib/blog/guide-schedule.ts` — `lib/blog/guides.test.ts`
   fails for a tool without one.
7. Optional: `alsoIn: ['other-category']` lists the tool in more categories
   (its URL stays under `category`); `popular: true` raises its sitemap
   priority; adding its slug to `FEATURED_TOOLS` in
   `lib/online-tools/registry.ts` puts it in the "Start here" picks on the
   homepage and the tools hub (keep that list short — it is labelled as our
   picks, not a usage ranking).

Rules for tools: process data in the browser, never upload or store user
files, show friendly error messages (`ToolInputError`), and release object
URLs.

## SEO

Every tool, category and variant page gets a unique title and description, a
canonical URL, Open Graph/Twitter tags with an image from `/api/og?type=tool`,
and `WebApplication`, `FAQPage`, `HowTo` and `BreadcrumbList` JSON-LD. Renamed
routes must get a permanent redirect in `next.config.ts`.

## Docs

- `CHANGELOG.md` — release notes
- `docs/current-features.md` — full feature reference
- `docs/desired-features.md` — backlog
- `docs/qa/device-checklist.md` — manual checks on real devices (camera, mic,
  recorders, timers, flags)
- `docs/seo-improvements-2026-07-21.md`, `docs/adsense-tasks.md` — SEO and
  AdSense work

## Monetization notes

- `public/ads.txt` holds the AdSense publisher ID.
- `components/AdSlot.tsx` contains placeholder ad slot IDs — replace them only
  after AdSense approval.
