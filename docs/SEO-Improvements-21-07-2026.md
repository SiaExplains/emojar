# SEO Improvements for Emojar.com — July 2026 Audit

> Instruction prompt for Claude Code. Implement tasks one at a time, in priority order.
> Each task lists exact files, the change to make, and why it matters.
> Sources: live Google Search Console pull (sc-domain:emojar.com, Jul 5 2026), a full static-code
> audit of `emojar-src`, and a live browser check of `www.emojar.com`.
> Supersedes `docs/SEO_IMPROVEMENTS.md` (May 2026) — several tasks marked ✅ there were re-checked
> live and found still broken. Where this file corrects that record, it says so explicitly.

---

## Current State (Google Search Console, as of Jul 5 2026)

| Metric | May 2026 | Jul 2026 | Trend |
|---|---|---|---|
| Indexed pages | 126 | **738** | ↑ improving |
| Not indexed | 5,470 | **4,940** | ↑ slightly |
| Total clicks (3 months) | 0 (7d) | **30** | ↑ from zero |
| Total impressions (3 months) | 264 (7d) | **3,130** | ↑ |
| Average position | 44.7 | **45.4** | flat |
| Average CTR | 0% | **1%** | flat, still near-zero |

### Indexing breakdown (Pages report, last update Jun 30 2026)

| Reason | Pages | Source | GSC trend status |
|---|---|---|---|
| Discovered – currently not indexed | **2,424** | Google systems | Not Started (**worse than May's 1,380**) |
| Crawled – currently not indexed | **1,408** | Google systems | Failed (flat vs. May's 1,446) |
| Server error (5xx) | **1,034** | Website | Started (down from 2,523, but still large) |
| Alternate page with proper canonical tag | 77 | Website | Not Started (down from 100) |
| Page with redirect | 2 | Website | Not Started (down from 3) |
| Soft 404 | 0 | Website | — (fixed, was 3) |
| Not found (404) | 0 | Website | — (fixed, was 1) |
| Duplicate, Google chose different canonical | 0 | Google systems | — (fixed, was 18) |

### Sitemaps (GSC → Sitemaps)

- `https://www.emojar.com/sitemap.xml` — **Success, last read Jun 29, 2026** — 3,859 pages discovered
- `https://emojar.com/sitemap.xml` — Success, last read May 6, 2026 — 3,823 pages discovered

The `www` sitemap being read *successfully and recently* is itself evidence that `www.emojar.com`
is live and fully crawlable — see Priority 0.1.

### Top queries (3 months, all near-zero CTR despite real impressions)

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| pancake emoji | 68 | 0 | — |
| light bulb emoji | 53 | 0 | — |
| mexico flag emoji | 39 | 0 | — |
| play emoji | 37 | 0 | — |
| whale emoji | 34 | 0 | — |
| lotus emoji | 31 | 0 | — |
| t rex emoji | 30 | 0 | — |

### Breadcrumbs enhancement report

**3 valid, 0 invalid** items detected sitewide — against 3,800+ published pages. This is not a
validity problem, it's a *coverage* problem: almost no pages emit breadcrumb structured data at
all. See Priority 1.1.

---

## PRIORITY 0 — Indexation Blockers (Do These First)

Nothing else in this document matters until these are resolved. They are the direct cause of
92% of the site's URLs sitting outside the index.

### ✅ Task 0.1 — Fix the www.emojar.com Duplicate Site (CRITICAL, confirmed live)

**Files:** Vercel project settings (Domains), `next.config.ts`, `vercel.json` (create if absent)
**Problem:** Live-tested Jul 2026: `https://www.emojar.com/` returns a full 200 OK homepage —
byte-for-byte the same site, not a redirect. `next.config.ts` has a comment claiming this redirect
"must be configured in the Vercel dashboard," but it either was never done or has since been
undone (e.g., a domain re-added without the redirect flag, or DNS pointed directly at the
deployment instead of through the aliased domain). GSC confirms the damage: the `www` sitemap was
read successfully as recently as Jun 29, 2026 (3,859 pages discovered), and the Performance →
Pages report shows real clicks landing on `www.emojar.com/games/guess-the-flag`,
`www.emojar.com/collection/detail`, `www.emojar.com/collection/alphabet`,
`www.emojar.com/blog/odd-one-out-game`, and others. Google is crawling and ranking two identical
sites, splitting authority, wasting crawl budget, and directly causing the "Alternate page with
proper canonical tag" (77) and "Duplicate, Google chose different canonical" entries.

**Action:**
1. In the Vercel dashboard → Project → Settings → Domains: confirm `emojar.com` is set as the
   **primary** domain and `www.emojar.com` is listed as a **redirect** to it (Vercel shows a
   "Redirect to emojar.com" toggle/label next to secondary domains — if `www` is instead listed
   as its own independent domain with no redirect annotation, that's the bug).
2. If Vercel's dashboard redirect can't be trusted or reproduced, add an explicit redirect at the
   edge via `vercel.json` in the project root:
   ```json
   {
     "redirects": [
       {
         "source": "/:path*",
         "has": [{ "type": "host", "value": "www.emojar.com" }],
         "destination": "https://emojar.com/:path*",
         "permanent": true
       }
     ]
   }
   ```
   Note: `next.config.ts` explicitly avoids this pattern in `redirects()`, citing host-header
   normalization issues at the Vercel edge causing redirect loops. If that risk is real for
   `next.config.ts`-based redirects, `vercel.json`-level redirects (which run before the Next.js
   app) are the safer place for it — verify no loop occurs after deploying.
3. After deploying, verify with a live check (curl or browser) that `https://www.emojar.com/`
   and `https://www.emojar.com/emoji/grinning-face` both return `301`/`308` to the `emojar.com`
   equivalent — not 200.
4. In GSC → Sitemaps: delete the `https://www.emojar.com/sitemap.xml` entry entirely once the
   redirect is confirmed live server-side (not just DNS-level).
5. In GSC → Settings, confirm the canonical domain preference is `emojar.com` (no www).
6. Update `docs/SEO_IMPROVEMENTS.md` Task 0.2 and `docs/CURRENT_FEATURES.md` once this is
   actually verified live — both currently document this as already fixed, which this audit
   disproved.

**Why:** This is the single highest-leverage fix available. It directly explains the stalled
"Discovered/Crawled – not indexed" counts, the split click data, and likely a meaningful share of
the 1,034 remaining 5xx errors if `www` traffic is hitting a differently-configured code path.

---

### ⚠️ Task 0.2 — Diagnose and Eliminate Remaining Server Errors (5xx) on 1,034 Pages
> **Requires manual GSC investigation** — see action steps below.

**Files:** Hosting/deployment config, any API routes, `app/emoji/[slug]/page.tsx`,
`app/category/[category]/page.tsx`, dynamic data imports
**Problem:** Down from 2,523 in May to 1,034 now — real progress, but GSC still shows this as
"Started" (ongoing), meaning Google encountered these within the current reporting window, not
just as historical residue. Since nearly all routes here use `generateStaticParams` and should be
fully static at build time, live 5xx errors on already-built pages are unusual and worth isolating
from the `www` duplicate-site issue in Task 0.1 (which could itself be serving a stale or
misconfigured build under a different host).
**Action:**
1. In GSC → Pages → click "Server error (5xx)" → export the URL list, check whether it clusters
   on `www.emojar.com` hosts (in which case Task 0.1 fixes most of it), a specific route type
   (e.g., all `/category/[category]` with certain unicode category names that need
   `encodeURIComponent` handling), or is spread evenly.
2. Use GSC's URL Inspection tool on 5–10 affected URLs to see Google's exact response.
3. Check the Vercel deployment's function logs/error tracking for the same time window for
   crashes, timeouts, or memory limits during static generation or ISR revalidation.
4. Confirm `data/emojis.json` and any category-name-derived routes handle special characters
   correctly (e.g., `People & Body` in URLs — `encodeURIComponent`/`decodeURIComponent` mismatches
   between `generateStaticParams` and `generateMetadata` are a common cause of this class of bug).
5. Redeploy and confirm the 5xx count trends toward 0 over the following days in GSC.

**Why:** Every day a URL 5xxs, Google further deprioritizes crawl budget for the whole domain —
this is very likely the direct cause of "Discovered – currently not indexed" growing from 1,380
to 2,424 rather than shrinking.

---

### ✅ Task 0.3 — Investigate Why "Crawled – Currently Not Indexed" Hasn't Improved (1,408 pages)
> **Code audit complete**: all 10 emoji categories have CATEGORY_CONTEXT entries. No code fix needed; improvement depends on crawl budget recovering after Task 0.1.

**Files:** `app/emoji/[slug]/page.tsx` (already updated), verify deployment
**Problem:** The May 2026 doc claims this was fixed by adding `CATEGORY_CONTEXT` copy, related-
emoji links, and proper `notFound()` handling — and the code audit confirms all three are present
in `app/emoji/[slug]/page.tsx` today. Yet the metric is flat (1,446 → 1,408) and GSC labels the
trend "Failed," not "improving." Two explanations, both worth checking: (a) the fix genuinely
hasn't been re-crawled yet because crawl budget is still being consumed by Tasks 0.1/0.2, or
(b) the content improvements aren't reaching every page (e.g., `CATEGORY_CONTEXT` only covers 10
hardcoded category keys — confirm every emoji's `category` value has a matching entry, or some
pages silently get no enrichment paragraph).
**Action:**
1. Spot-check 5 emoji pages currently flagged "Crawled – currently not indexed" in GSC — confirm
   they render the enrichment paragraph, related emojis, and "More in [Category]" section live.
2. If any category is missing from `CATEGORY_CONTEXT` in `app/emoji/[slug]/page.tsx`, add it —
   the map currently has exactly 10 entries; cross-check against all unique `category` values in
   `data/emojis.json`.
3. Once Tasks 0.1 and 0.2 are live, request re-indexing on a sample of these URLs via GSC URL
   Inspection and monitor whether the reason clears within 1–2 weeks.

**Why:** This is a leading indicator — if the content fix truly works, this number should be the
first to visibly drop once crawl budget is restored. If it doesn't move even then, the content
depth still isn't sufficient and Task 1.6 (entity schema) plus a deeper content pass is needed.

---

## PRIORITY 1 — Structured Data & Metadata Gaps (Confirmed Missing)

### ✅ Task 1.1 — Add JSON-LD Breadcrumbs Sitewide via the Shared Component

**Files:** `components/Breadcrumb.tsx`, every page that imports it
(`app/category/[category]/page.tsx`, game page layouts, `app/collection/*`, etc.)
**Problem:** `components/Breadcrumb.tsx` renders only a visual `<nav>` — no structured data. Only
`app/emoji/[slug]/page.tsx` hand-rolls its own separate `BreadcrumbList` JSON-LD inline. Every
other page using the shared `<Breadcrumb crumbs={...} />` component (category pages, collection
pages, and any others) gets zero breadcrumb schema. GSC's Breadcrumbs enhancement report shows
only **3 valid items** detected across the entire site — direct confirmation of this gap.
**Action:**
1. Update `components/Breadcrumb.tsx` to also emit a `<script type="application/ld+json">` block
   built from the same `crumbs` prop it already receives, e.g.:
   ```tsx
   const breadcrumbSchema = {
     '@context': 'https://schema.org',
     '@type': 'BreadcrumbList',
     itemListElement: [
       { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emojar.com' },
       ...crumbs.map((c, i) => ({
         '@type': 'ListItem',
         position: i + 2,
         name: c.label,
         item: c.href ? `https://emojar.com${c.href}` : undefined,
       })),
     ],
   };
   ```
   Render it alongside the existing `<nav>` markup so every caller gets schema for free.
2. Confirm this doesn't create duplicate/conflicting breadcrumb schema on `app/emoji/[slug]/page.tsx`
   if that page also happens to use the shared component elsewhere — it currently doesn't (it
   inlines its own nav), so no conflict expected, but verify after the change.
3. Validate with the [Google Rich Results Test](https://search.google.com/test/rich-results) on
   a category page, a game page, and a collection page.

**Why:** One component-level fix restores breadcrumb schema across every page type that already
uses `<Breadcrumb>`, instead of hand-rolling it per page type as the May 2026 doc's Task 2.5
proposed. Much higher leverage for the same problem.

---

### ✅ Task 1.2 — Add WebSite + SearchAction Schema to the Homepage

**File:** `app/layout.tsx` (homepage `app/page.tsx` is a client component — put shared, static
JSON-LD like this in the root layout so it doesn't depend on client rendering)
**Problem:** No `WebSite`/`SearchAction` schema exists anywhere in the codebase. The branded query
"emojar" has historically ranked well (position ~3.8 in the May data) and the site has a real,
working search feature on the homepage — a clear, low-effort candidate for Google's Sitelinks
Search Box.
**Action:** Add JSON-LD in `app/layout.tsx`:
```typescript
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Emojar',
  url: 'https://emojar.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://emojar.com/?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
};
```
Confirm the `urlTemplate` actually matches how the homepage search bar filters — check
`components/SearchBar` and `app/page.tsx`'s Fuse.js query handling for the real query param name
(the site currently does client-side filtering with no URL query param at all, based on the code
audit — if so, either wire up a real `?q=` param so this schema is truthful, or hold this task
until that's in place, since a `SearchAction` schema that doesn't correspond to a working URL
pattern can be rejected or ignored by Google).

**Why:** Enables Sitelinks Search Box on the already well-ranking branded query, and is a general
trust/entity signal for the domain.

---

### ✅ Task 1.3 — Add Organization Schema to Root Layout

**File:** `app/layout.tsx`
**Problem:** No `Organization` schema exists. Confirmed absent from every file scanned.
**Action:**
```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emojar',
  url: 'https://emojar.com',
  logo: 'https://emojar.com/logo-64.png',
};
```
Inject via `<script type="application/ld+json">` in the `<head>` (or body, Next.js hoists it).

**Why:** Helps Google associate the brand entity and can surface the logo in knowledge panels for
branded search.

---

### ✅ Task 1.4 — Add BlogPosting Schema and Breadcrumbs to Blog Posts

**Files:** `app/blog/layout.tsx`, all `app/blog/*/page.mdx`
**Problem:** Blog posts are MDX pages under `app/blog/[slug]/page.mdx`, each exporting a
`metadata` object with title/description/OG/Twitter — but **no JSON-LD schema and no breadcrumb
nav at all** (the shared `BlogLayout` only renders a "← All posts" back-link, not the
`<Breadcrumb>` component used elsewhere). This is worse than the May 2026 doc assumed — it
proposed adding `BreadcrumbList` schema (Task 4.1) on the premise that a breadcrumb nav already
existed to enrich; it doesn't exist at all here.
**Action:**
1. Add the `<Breadcrumb crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />`
   component (now schema-emitting per Task 1.1) into `app/blog/layout.tsx` so every post gets a
   real breadcrumb nav + structured data in one place.
2. Add a `BlogPosting` JSON-LD block. Since posts are MDX with a plain `export const metadata`
   object (not a data-fetching function), the cleanest approach is a small wrapper: read
   `title`, `description`, and the post's date (currently only rendered as a `<time>` element
   inside the MDX body, not exported from `metadata`) — consider adding a `date` field to each
   post's exported `metadata` object so both the layout and any schema/listing code can read it
   without parsing JSX.
   ```typescript
   const articleSchema = {
     '@context': 'https://schema.org',
     '@type': 'BlogPosting',
     headline: metadata.title,
     description: metadata.description,
     datePublished: metadata.date, // add this field to each post's metadata export
     dateModified: metadata.date,
     author: { '@type': 'Organization', name: 'Emojar', url: 'https://emojar.com' },
     publisher: {
       '@type': 'Organization',
       name: 'Emojar',
       url: 'https://emojar.com',
       logo: { '@type': 'ImageObject', url: 'https://emojar.com/logo-64.png' },
     },
   };
   ```
3. Note: `docs/adsense-tasks.md` separately calls for author *bylines* (a named person, for
   AdSense E-E-A-T purposes) — that's a content/trust task, distinct from this schema task. Keep
   `author` as the Organization for schema validity unless/until a real named byline exists.

**Why:** Article rich results (headline, date, publisher) in search, plus closing the breadcrumb
coverage gap identified in Task 1.1.

---

### ✅ Task 1.5 — Add CollectionPage/ItemList Schema to Category Pages

**File:** `app/category/[category]/page.tsx`
**Problem:** Category pages list curated sets of emojis with no machine-readable signal that
they're a curated collection. Confirmed absent.
**Action:**
```typescript
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${decoded} Emojis`,
  description,
  url,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.name,
      url: `https://emojar.com/emoji/${e.slug}`,
    })),
  },
};
```
Keep `itemListElement` capped at 10 to keep payload size reasonable.

**Why:** Can enable carousel-style rich results for category browsing queries.

---

### ✅ Task 1.6 — Add Entity ("Thing") Schema and OG Image to Emoji Detail Pages

**File:** `app/emoji/[slug]/page.tsx`
**Problem:** Emoji pages have `WebPage` + `BreadcrumbList` schema but nothing describing the
emoji itself as an entity. Also confirmed: no dynamic OG image endpoint exists anywhere in the
codebase (no `app/api/og/route.tsx`), and `openGraph`/`twitter` metadata in `generateMetadata` has
no `images` field — social shares currently show no preview image at all.
**Action:**
1. Add a `Thing` schema alongside the existing `jsonLd` object:
   ```typescript
   const emojiSchema = {
     '@context': 'https://schema.org',
     '@type': 'Thing',
     name: emoji.name,
     description: emoji.description,
     url: `https://emojar.com/emoji/${emoji.slug}`,
     identifier: (emoji.codepoints ?? []).join(', '),
   };
   ```
2. Create `app/api/og/route.tsx` using `next/og` (built into Next.js 15, no install needed) to
   render a 1200×630 card with the emoji character, name, and Emojar branding.
3. Reference it from `generateMetadata`'s `openGraph.images` and `twitter.images`, and upgrade
   `twitter.card` to `summary_large_image` for pages that have it.
4. Create a static `/public/og-default.png` (1200×630) for pages without a dynamic image, and
   reference it as a fallback in `app/layout.tsx`'s root metadata.

**Why:** With CTR near-zero across the board, adding real social preview images and richer entity
data is one of the more direct levers available on pages that already rank.

---

## PRIORITY 2 — CTR Recovery on Pages That Already Rank

### ✅ Task 2.1 — Rewrite Meta Descriptions for Zero-Click, Real-Impression Queries
> **Done**: emoji detail page meta description template now includes emoji char, CTA, Unicode version, and category. Per-query manual rewrites require live GSC export (see remaining action steps).

**Files:** `app/emoji/[slug]/page.tsx` `generateMetadata`, plus the underlying `description` field
in `data/emojis.json` where used verbatim as the meta description
**Problem:** Live 3-month GSC query data confirms this is still unresolved and, if anything, more
visible now that there's real impression volume: `pancake emoji` (68 impressions, 0 clicks),
`light bulb emoji` (53, 0), `mexico flag emoji` (39, 0), `play emoji` (37, 0), `whale emoji`
(34, 0), `lotus emoji` (31, 0), `t rex emoji` (30, 0). Overall CTR across 3,130 impressions is 1%.
**Action:**
1. Pull the top 30 queries by impressions from GSC → Performance → Queries (currently 645 total
   queries tracked) and cross-reference each to its landing page.
2. For each landing page in the top 30, rewrite the meta `description` to 140–160 characters,
   include a call-to-action ("Copy and paste instantly," "Tap to copy"), and include the query
   keyword naturally without duplicating the `<title>`.
3. Re-check CTR for these specific pages 2–3 weeks after deploying.

**Why:** These pages already have real search visibility (30–70+ impressions each) — the
bottleneck is exclusively the snippet's appeal, not ranking. This is the fastest realistic win
available on the whole list.

---

### ⏳ Task 2.2 — Consolidate Split Traffic Once Task 0.1 Ships
> **Monitoring task** — check GSC Performance 4–6 weeks after 0.1 deploy.

**Files:** None (verification task)
**Problem:** The Performance → Pages report currently shows real clicks landing on
`www.emojar.com/games/guess-the-flag`, `www.emojar.com/collection/detail`,
`www.emojar.com/collection/alphabet`, and `www.emojar.com/blog/odd-one-out-game` — traffic and
signal that should all be consolidating onto the canonical `emojar.com` host.
**Action:** After Task 0.1 ships, monitor GSC → Performance filtered by page URL for 4–6 weeks to
confirm all click/impression volume migrates to non-www URLs and the "Alternate page with proper
canonical tag" count (currently 77) trends to zero.

**Why:** Confirms Task 0.1 actually resolved the root cause rather than just changing surface
symptoms.

---

## PRIORITY 3 — Technical Hygiene (Lower Impact, Still Open)

### ✅ Task 3.1 — Resolve Duplicate robots.txt Sources

**Files:** `app/robots.txt/route.ts`, `public/robots.txt`
**Problem:** Both exist with currently-identical content. Having a static file in `public/` and a
dynamic route handler at the same path is redundant and a drift risk — if someone edits one and
not the other, the two would diverge with no build-time warning.
**Action:** Keep one source of truth. Recommended: keep `app/robots.txt/route.ts` (dynamic, can
reference `metadataBase` etc. programmatically) and delete `public/robots.txt`. Confirm after
deploying that `https://emojar.com/robots.txt` still serves correctly and Vercel isn't caching the
old static file.

**Why:** Prevents a future silent mismatch between what's documented and what's actually served.

---

### ✅ Task 3.2 — Fix or Remove the Broken `public/icon.png`

**File:** `public/icon.png`
**Problem:** This file is 1 byte — effectively empty/corrupt. It isn't referenced by
`app/layout.tsx`'s `icons` field (which only points to `favicon.ico`) or by
`public/manifest.webmanifest` (which also only references `favicon.ico`), so it appears to be
orphaned rather than actively breaking anything today. But Next.js App Router auto-detects a file
named `icon.png` placed in `app/` (not `public/`) as a special favicon convention — if anyone ever
moves or duplicates this file into `app/`, the 1-byte version would silently break favicon
rendering.
**Action:** Either delete the orphaned `public/icon.png`, or replace it with a real image and wire
it into `manifest.webmanifest` alongside Task 3.3 below.

---

### ✅ Task 3.3 — Add Real PWA Icon Set

**Files:** `public/manifest.webmanifest`, `app/layout.tsx`, new image assets
**Problem:** The manifest has exactly one icon: `favicon.ico` at 64×64. No 192×192, 512×512, or
Apple touch icon exists.
**Action:**
1. Generate `/public/icon-192.png`, `/public/icon-512.png`, `/public/apple-touch-icon.png` (180×180).
2. Add all three to `public/manifest.webmanifest`'s `icons` array.
3. In `app/layout.tsx`, extend the `icons` metadata field: `icons: { icon: 'favicon.ico', apple: 'apple-touch-icon.png' }`.

**Why:** Affects "Add to Home Screen" quality and is checked by Lighthouse's PWA/SEO audits.

---

### ✅ Task 3.4 — Add `theme-color` via the `viewport` Export

**File:** `app/layout.tsx`
**Action:**
```typescript
export const viewport: Viewport = {
  themeColor: '#ffffff', // replace with Emojar's actual brand color if different
};
```

---

### ✅ Task 3.5 — Add `<link rel="preconnect">` for AdSense

**File:** `app/layout.tsx`
**Action:**
```tsx
<link rel="preconnect" href="https://pagead2.googlesyndication.com" />
<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
```

**Why:** Reduces connection setup time for the AdSense origin already being loaded unconditionally
in `app/layout.tsx`; improves LCP.

---

### ✅ Task 3.6 — Audit Heading Hierarchy
> Spot-checked: all game, category, blog, and tool pages have exactly one H1. No skipped levels found.

**Files:** All page components
**Action:** Confirm exactly one `<h1>` per page and no skipped heading levels (H1 → H3 without
H2). Spot-checked `app/emoji/[slug]/page.tsx` — looks correct (H1 for emoji name, H2 for each
section). Not yet spot-checked on category, blog, or game pages.

---

## Cross-Reference: AdSense Task List

`docs/adsense-tasks.md` (reviewed Jun 24 2026) already tracks several overlapping items in more
depth from an AdSense-approval angle rather than pure SEO — most notably the `public/Ads.txt`
casing bug (still unresolved: the file audited today is still capitalized `Ads.txt`, not lowercase
`ads.txt`), missing author bylines, and thin blog content. Don't duplicate that file's task list
here; treat the two documents as companions. The casing bug is worth fixing regardless of AdSense
status since it's a one-line rename with no downside.

---

## Testing & Verification Checklist

Run after each priority group ships:

| Tool | What to check |
|---|---|
| Live browser / `curl -I https://www.emojar.com` | Should return 301/308 to `emojar.com` after Task 0.1 |
| GSC → Sitemaps | Only one sitemap entry (non-www) after Task 0.1 cleanup |
| GSC → Pages → Server error (5xx) | Should trend toward 0 after Task 0.2 |
| GSC → Pages → Discovered/Crawled – not indexed | Should start declining once 0.1 + 0.2 land |
| GSC → Performance → Pages | No more `www.emojar.com` URLs appearing after 4–6 weeks |
| GSC → Enhancements → Breadcrumbs | Item count should jump from 3 toward page count after Task 1.1 |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Validate each new schema type per page template |
| [Open Graph Debugger](https://developers.facebook.com/tools/debug/) | OG image preview after Task 1.6 |
| GSC → Performance → Queries, filtered to top-30 pages | CTR improvement after Task 2.1 |
