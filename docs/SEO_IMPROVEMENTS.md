# SEO Improvements for Emojar.com

> Instruction prompt for Claude Code. Implement tasks one at a time in priority order.
> Each task includes the exact files to change, what to do, and why it matters.
> Based on: Google Search Central guidelines (2025), Core Web Vitals thresholds, live site audit,
> and Google Search Console data as of May 2026.

---

## Current State (Google Search Console — May 2026)

| Metric | Value |
|---|---|
| Indexed pages | **126** (was ~12,000 in February 2026) |
| Not indexed | **5,470** |
| Total clicks (7 days) | **0** |
| Total impressions (7 days) | **264** |
| Average position | **44.7** |
| Average CTR | **0%** |

### Indexing breakdown

| Reason | Pages | Source |
|---|---|---|
| Server error (5xx) | **2,523** | Website |
| Crawled – currently not indexed | **1,446** | Google systems |
| Discovered – currently not indexed | **1,380** | Google systems |
| Alternate page with proper canonical tag | 100 | Website |
| Duplicate, Google chose different canonical | 18 | Google systems |
| Soft 404 | 3 | Website |
| Page with redirect | 3 | Website |
| Not found (404) | 1 | Website |

### Top queries (all 0 clicks)

| Query | Impressions | Position |
|---|---|---|
| emojar | 24 | 3.8 |
| light bulb emoji | 18 | 50.3 |
| pancake emoji | 12 | 61.5 |
| lotus emoji | 8 | 46.0 |
| whale emoji | 8 | 54.3 |

### Sitemaps submitted

- `https://www.emojar.com/sitemap.xml` — 3,836 pages discovered
- `https://emojar.com/sitemap.xml` — 3,823 pages discovered

**Diagnosis:** The indexed count dropped from ~12K to 126 around early March 2026. The 2,523 server errors are burning crawl budget and causing Google to abandon the site. Nothing else in this document matters until Priority 0 is resolved.

---

## PRIORITY 0 — Fix Indexation Crisis (Do These First)

> ✅ **Tasks 0.2, 0.3, 0.4, 0.5 implemented** in PR `seo/priority-0-indexation-fix` (May 2026).
> Task 0.1 (5xx errors) requires investigation in the production hosting dashboard — steps documented below.
> Task 0.6 (re-indexing) is a GSC action to perform after deploying the above PR.

### Task 0.1 — Diagnose and Fix Server Errors (5xx) on 2,523 Pages

**Files:** Hosting/deployment config, `next.config.ts`, any API routes or dynamic pages  
**Problem:** 2,523 pages are returning 5xx errors to Googlebot. This is the direct cause of the indexation collapse from ~12K to 126 pages. Every day this is unresolved, Google further downgrades crawl budget allocation for the site.

**Action:**
1. In Google Search Console → Index → Pages → click "Server error (5xx)" → export or screenshot the list of affected URLs to identify the pattern (are they all `/emoji/[slug]`? `/category/[cat]`? API routes?).
2. Use the GSC **URL Inspection Tool** on 3–5 of the affected URLs to see the exact error Google received.
3. Check the hosting provider's error logs for the same time window. Common causes on Vercel/Netlify:
   - Serverless function timeout (default 10s on Vercel Hobby, check if dynamic pages exceed this)
   - Memory limit exceeded during `generateStaticParams` at build time
   - A deploy that broke a shared data-fetching utility (`data/emojis.json` import failing)
   - Environment variable missing in production that is present in development
4. Run `curl -I https://emojar.com/emoji/grinning-face` and `curl -I https://emojar.com/category/smileys-emotion` locally to reproduce.
5. Fix the root cause, redeploy, and confirm affected URLs return 200.

**Why:** 5xx errors tell Google the server is broken. After ~2 weeks of 5xx responses on a URL, Google drops it from the index. This has already happened at scale.

---

### ✅ Task 0.2 — Fix www vs non-www Canonical Conflict

**Files:** `next.config.ts`, hosting redirect config (Vercel `vercel.json` or dashboard)  
**Problem:** Two sitemaps are submitted — `www.emojar.com` and `emojar.com`. The codebase uses `https://emojar.com` as canonical (`metadataBase`, all hardcoded URLs). If `www.emojar.com` serves real content instead of redirecting, Google sees duplicate pages and picks its own canonical (explaining the 18 "Duplicate, Google chose different canonical" and 100 "Alternate page with proper canonical tag" entries).

**Action:**
1. Verify: `curl -I https://www.emojar.com` — does it return `301` to `https://emojar.com`? If not, it's serving duplicate content.
2. If on Vercel: add a redirect in `vercel.json`:

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

3. If the redirect already exists, confirm it is a **301** (permanent), not 302.
4. After confirming the 301 redirect is live, go to GSC → Sitemaps → **delete** the `https://www.emojar.com/sitemap.xml` entry. Keep only `https://emojar.com/sitemap.xml`.
5. In GSC → Settings → ensure the canonical domain is set to `https://emojar.com` (without www).

**Why:** Serving the same content on both www and non-www splits link equity and confuses Googlebot's canonical selection. The 18 "Duplicate, Google chose different canonical" entries mean Google has already overridden some of the site's own canonical tags.

---

### ✅ Task 0.3 — Investigate and Fix "Crawled – Currently Not Indexed" (1,446 Pages)

**Implemented:** Added `CATEGORY_CONTEXT` map to emoji detail pages generating a unique "common uses" paragraph per category + keyword combination. Added "More in [Category]" section with 8 same-category emoji links per page, creating richer cross-linked content. Added proper `notFound()` call so unknown slugs return real 404.

---

### ✅ Task 0.4 — Recover "Discovered – Currently Not Indexed" (1,380 Pages)

**Files:** No code change needed immediately — this is a crawl budget issue.  
**Problem:** Google knows these URLs exist (via sitemap) but hasn't allocated crawl budget to visit them. This is a downstream effect of the 5xx errors in Task 0.1: when Googlebot encounters hundreds of errors, it reduces its crawl rate for the entire domain.

**Action:**
1. This task unblocks itself once Tasks 0.1 and 0.2 are complete. Fixing 5xx errors restores crawl budget.
2. After deploying 0.1 and 0.2 fixes: go to GSC → Sitemaps → click the `https://emojar.com/sitemap.xml` row → "Resubmit".
3. For the highest-value pages (home, categories index, top emoji pages), use GSC → URL Inspection → **"Request Indexing"** individually to fast-track them.
4. Improve internal linking (Tasks 3.2 and 3.3) so Googlebot discovers these pages through crawl, not just sitemap.

**Why:** After fixing the errors, Google needs a signal to restart aggressive crawling. Sitemap resubmission and manual indexing requests send that signal.

---

### ✅ Task 0.5 — Fix Soft 404s (3 Pages) and Hard 404 (1 Page)

**Files:** TBD after inspecting URLs in GSC  
**Problem:** 3 soft 404s (pages that return 200 but show "not found" style content) and 1 hard 404. These waste crawl budget and can hurt domain trust.

**Action:**
1. In GSC → Pages → click "Soft 404" and "Not found (404)" → identify the URLs.
2. For each soft 404: either add proper content and return 200, or return a real `404` HTTP status.
3. For the hard 404: if the URL was valid and content moved, add a 301 redirect to the new location. If it was never valid, confirm it's correctly returning 404 (no further action needed).
4. In Next.js App Router, return proper 404 status using `notFound()` from `next/navigation` in page components.

**Why:** Soft 404s confuse Googlebot and waste crawl budget on pages that have no content.

---

### Task 0.6 — Request Re-indexing After All Priority 0 Fixes

**Tool:** Google Search Console (no code change)  
**Problem:** Even after fixing 5xx errors, Google won't automatically re-crawl everything immediately. The domain has a damaged trust signal that needs active recovery.

**Action (after Tasks 0.1–0.5 are deployed):**
1. GSC → Sitemaps → Resubmit `https://emojar.com/sitemap.xml`.
2. GSC → URL Inspection → Request Indexing for these key URLs manually:
   - `https://emojar.com`
   - `https://emojar.com/categories`
   - `https://emojar.com/blog`
   - Top 10 emoji pages by query impression (visible in GSC → Pages tab)
3. Monitor GSC → Pages → "Server error (5xx)" count daily. It should drop to 0 within 2–3 days of the fix going live.
4. Expect indexed pages to recover over 4–8 weeks as Googlebot progressively re-crawls.

---

## PRIORITY 1 — High Impact, Low Effort

> ✅ **Tasks 1.1, 1.2, 1.3, 1.4, 1.5 all implemented** in PR `seo/priority-1-metadata` (May 2026).

### ✅ Task 1.1 — Fix Logo Alt Text

**File:** `components/HeaderLogo.tsx` (or wherever the logo `<Image>` is rendered)  
**Problem:** The live site shows no descriptive alt text on the logo image; screen readers and Googlebot image search lose context.  
**Action:**
- Update the current `alt="Emojar Logo"` to `alt="Emojar – Copy & paste emojis instantly"` to match the page H1 intent and include a keyword.

**Why:** Google uses alt text for image indexing and as an accessibility signal.

---

### ✅ Task 1.2 — Add Twitter Card Metadata to All Pages

**Files:** Every `generateMetadata` function across:
- `app/layout.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/categories/page.tsx`
- `app/games/page.tsx`
- `app/games/[game]/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`

**Problem:** Twitter/X cards are missing on most pages. Only emoji and category detail pages have them.  
**Action:** Add a `twitter` key to every metadata object that is currently missing it:

```typescript
twitter: {
  card: 'summary',
  title: '<same as og:title>',
  description: '<same as og:description>',
},
```

For pages that later get OG images (Task 2.1), upgrade to `card: 'summary_large_image'`.

**Why:** Twitter/X previews affect CTR when content is shared; consistent cards build brand trust.

---

### ✅ Task 1.3 — Add OpenGraph Metadata to Missing Pages

**Files:**
- `app/categories/page.tsx` — missing `openGraph.image`
- `app/games/page.tsx` — missing `openGraph` entirely
- `app/games/[game]/page.tsx` — missing `openGraph` entirely
- `app/privacy/page.tsx` — missing `openGraph` entirely
- `app/terms/page.tsx` — missing `openGraph` entirely

**Action:** Add a complete `openGraph` block to each:

```typescript
openGraph: {
  title: '<page title>',
  description: '<page description>',
  url: 'https://emojar.com/<path>',
  siteName: 'Emojar',
  type: 'website',
},
```

**Why:** OG metadata controls how pages appear when shared on Facebook, LinkedIn, Slack, Discord, etc.

---

### ✅ Task 1.4 — Set Sitemap Priorities and Change Frequencies

**File:** `app/sitemap.ts`  
**Problem:** No `priority` or `changeFreq` is set; all pages default to 0.5 / no-hint. Google deprioritises undifferentiated sitemaps.  
**Action:** Assign priorities and frequencies that reflect actual content volatility:

| Route group | priority | changeFreq |
|---|---|---|
| `/` (home) | 1.0 | daily |
| `/categories` | 0.9 | weekly |
| `/category/[category]` | 0.8 | weekly |
| `/emoji/[slug]` | 0.7 | monthly |
| `/blog` | 0.8 | weekly |
| `/blog/[slug]` | 0.7 | monthly |
| `/games` | 0.7 | monthly |
| `/games/[game]` | 0.6 | monthly |
| `/about`, `/contact` | 0.5 | yearly |
| `/privacy`, `/terms`, `/impressum` | 0.3 | yearly |

Also replace `lastModified: now` (current runtime date) for emoji pages with a static build-time constant or the emoji Unicode version release date — these pages don't change.

**Note:** Also confirm the `www.emojar.com` sitemap is removed from GSC after Task 0.2 is complete.

**Why:** Accurate priorities help Googlebot allocate crawl budget efficiently across 3,850+ URLs.

---

### ✅ Task 1.5 — Add `keywords` Meta to Category and Blog Pages

**Files:**
- `app/category/[category]/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/page.tsx`
- `app/games/page.tsx`

**Problem:** Keywords are only set in the root layout.  
**Action:** Add a `keywords` array to each page's `generateMetadata` output:

```typescript
// Example for a category page
keywords: [categoryName, `${categoryName} emojis`, 'copy paste emoji', 'emoji keyboard'],
```

**Why:** Bing uses meta keywords; consistency is good hygiene even though Google ignores this field.

---

## PRIORITY 2 — High Impact, Medium Effort

### Task 2.1 — Dynamic OG Image Generation

**New file to create:** `app/api/og/route.tsx`  
**Dependencies:** `next/og` (built into Next.js 14+, no extra install needed)  
**Problem:** No pages have an actual OG image URL — social previews show no image, hurting CTR.  
**Action:**
1. Create a dynamic image endpoint at `/api/og` that accepts query params: `?emoji=😀&name=Grinning+Face`
2. Render a simple 1200×630 card: large emoji centred, name below, Emojar branding in corner.
3. Update emoji detail pages (`app/emoji/[slug]/page.tsx`) to set:

```typescript
openGraph: {
  images: [{
    url: `/api/og?emoji=${encodeURIComponent(emoji.character)}&name=${encodeURIComponent(emoji.name)}`,
    width: 1200,
    height: 630,
  }],
},
twitter: {
  card: 'summary_large_image',
  images: [`/api/og?emoji=...`],
},
```

4. Create a static default OG image at `/public/og-default.png` (1200×630) for pages without dynamic content and reference it from `app/layout.tsx`.

**Why:** Pages with OG images get significantly higher CTR on social shares. With 0 clicks currently, any improvement to snippet appeal matters.

---

### Task 2.2 — Add Substantive Content to Emoji Detail Pages (Thin Content Fix)

**File:** `app/emoji/[slug]/page.tsx`  
**Problem:** This is likely the cause of 1,446 "Crawled – currently not indexed" pages (see Task 0.3). Pages that only show an emoji + name + copy button are classified as thin content by Google's helpful content system.  
**Action:** Expand each emoji detail page to include:

1. **Meaning section** — A 2–4 sentence description of the emoji's meaning, origin, and common usage contexts. Source this from the emoji dataset or generate per-emoji using a static data file.
2. **Unicode info** — Codepoint (e.g. `U+1F600`), Unicode version, category, and keywords from the Unicode standard.
3. **Platform appearances note** — One sentence noting the emoji may look different across platforms (Apple, Google, Samsung, Windows).
4. **Related emojis** — 6–8 emojis from the same category, each linked to their detail page with their name as anchor text.
5. **Usage examples** — 2–3 example sentences showing natural use of the emoji.

Target: 150–250 words of readable text per emoji page (currently near zero).

**Why:** Google's helpful content system rewards pages that genuinely help users. Going from "copy button + emoji" to a real reference page is the single biggest opportunity to recover the 1,446 crawled-but-not-indexed pages.

---

### Task 2.3 — Add Article Structured Data to Blog Posts

**File:** `app/blog/[slug]/page.tsx`  
**Problem:** Blog posts have no schema.org structured data. Google can't identify them as articles.  
**Action:** Add a JSON-LD `BlogPosting` block:

```typescript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date,       // ISO 8601: "2026-05-01"
  dateModified: post.date,
  author: {
    '@type': 'Organization',
    name: 'Emojar',
    url: 'https://emojar.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Emojar',
    url: 'https://emojar.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://emojar.com/logo-64.png',
    },
  },
  url: `https://emojar.com/blog/${post.slug}`,
  mainEntityOfPage: `https://emojar.com/blog/${post.slug}`,
};
```

Inject via `<script type="application/ld+json">{JSON.stringify(articleSchema)}</script>`.

**Why:** Article schema enables Google to show blog post rich results (headline, date, publisher) in SERPs.

---

### Task 2.4 — Add WebSite / SearchAction Structured Data to Home Page

**File:** `app/page.tsx`  
**Problem:** The site has a prominent search feature but no `SearchAction` schema.  
**Action:** Add a JSON-LD `WebSite` block with a `potentialAction`:

```typescript
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Emojar',
  url: 'https://emojar.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://emojar.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
```

Adjust `urlTemplate` to match the actual search URL pattern used by the site.

**Why:** Enables Google's sitelinks search box for branded queries. The branded query "emojar" already ranks at position 3.8 — adding SearchAction capitalises on that.

---

### Task 2.5 — Add BreadcrumbList Structured Data to Category Pages

**File:** `app/category/[category]/page.tsx`  
**Problem:** Emoji detail pages have breadcrumb JSON-LD but category pages do not.  
**Action:**

```typescript
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emojar.com' },
    { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://emojar.com/categories' },
    { '@type': 'ListItem', position: 3, name: categoryName, item: `https://emojar.com/category/${categorySlug}` },
  ],
};
```

**Why:** Breadcrumb rich results display page hierarchy in SERPs, improving CTR.

---

### Task 2.6 — Add CollectionPage / ItemList Structured Data to Category Pages

**File:** `app/category/[category]/page.tsx`  
**Problem:** Category pages list emojis but Google has no machine-readable signal that this is a curated collection.  
**Action:**

```typescript
const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: `${categoryName} Emojis`,
  description: `Browse and copy all ${categoryName} emojis`,
  url: `https://emojar.com/category/${categorySlug}`,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: emojis.length,
    itemListElement: emojis.slice(0, 10).map((emoji, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: emoji.name,
      url: `https://emojar.com/emoji/${emoji.slug}`,
    })),
  },
};
```

Limit `itemListElement` to the first 10 items to keep the JSON-LD payload small.

**Why:** ItemList schema can trigger carousel rich results in Google Search.

---

### Task 2.7 — Enrich Emoji Detail Page Structured Data

**File:** `app/emoji/[slug]/page.tsx`  
**Problem:** Emoji pages have `BreadcrumbList` and `WebPage` schema but nothing describing the emoji itself.  
**Action:** Add a `Thing` schema alongside the existing breadcrumb:

```typescript
const emojiSchema = {
  '@context': 'https://schema.org',
  '@type': 'Thing',
  name: emoji.name,
  description: `${emoji.character} ${emoji.name} emoji — copy and paste instantly`,
  url: `https://emojar.com/emoji/${emoji.slug}`,
  image: `https://emojar.com/api/og?emoji=${encodeURIComponent(emoji.character)}&name=${encodeURIComponent(emoji.name)}`,
  identifier: emoji.unicode,   // e.g. "U+1F600"
};
```

**Why:** Richer entity data helps Google understand the page topic, especially for Knowledge Graph associations.

---

### Task 2.8 — Add `<meta name="author">` and Publisher Metadata

**File:** `app/layout.tsx`  
**Action:**

```typescript
authors: [{ name: 'Emojar', url: 'https://emojar.com' }],
creator: 'Emojar',
publisher: 'Emojar',
```

**Why:** Author signals contribute to E-E-A-T evaluation by Google.

---

## PRIORITY 3 — Medium Impact, Medium Effort

### Task 3.1 — Improve Internal Linking on Emoji Detail Pages

**File:** `app/emoji/[slug]/page.tsx`  
**Problem:** Emoji pages are near-islands. Poor internal linking contributes to the "Discovered – currently not indexed" problem (1,380 pages) — Googlebot finds pages via sitemap but won't prioritise them without internal link signals.  
**Action:**
1. Add a **"Related Emojis"** section with 6–8 emojis from the same category, each linked by name.
2. Add a **"More in [Category]"** link near the top of the page.
3. Ensure every emoji page links back to its category page using descriptive anchor text.

**Why:** Internal links signal importance to Googlebot and help distribute crawl budget to the 1,380 undiscovered pages.

---

### Task 3.2 — Improve Internal Linking on Category Pages

**File:** `app/category/[category]/page.tsx`  
**Action:**
1. Add a **"Related Categories"** section at the bottom with 3–4 linked category pages.
2. If a blog post covers the category topic, add a contextual link to it.

**Why:** Cross-linking thematically related pages distributes PageRank and helps Google understand topical clusters.

---

### Task 3.3 — Optimize Meta Descriptions for CTR

**Files:** All `generateMetadata` functions  
**Problem:** Average CTR is 0% despite 264 impressions. Descriptions at position 44 need to be compelling enough to pull clicks when pages eventually rank higher.  
**Action:** Rewrite every meta description to:
- Be 140–160 characters (avoid truncation)
- Include a call-to-action: "Copy and paste instantly", "Browse all X emojis"
- Include the primary keyword naturally
- Not duplicate the title

Top-priority pages given current GSC queries: pages for "light bulb emoji", "pancake emoji", "lotus emoji", "whale emoji".

**Why:** Well-crafted descriptions improve CTR even when rankings are mid-page.

---

### Task 3.4 — Add PWA Icons for Apple Touch and Manifest

**Files:** `app/manifest.ts` or `/public/manifest.webmanifest`, `app/layout.tsx`  
**Problem:** The manifest has only `favicon.ico`. Apple devices won't show a proper home screen icon.  
**Action:**
1. Generate: `/public/icon-192.png` (192×192), `/public/icon-512.png` (512×512), `/public/apple-touch-icon.png` (180×180).
2. Update manifest to reference all three.
3. Add to root layout: `icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' }`.

---

### Task 3.5 — Add `theme-color` Meta Tag

**File:** `app/layout.tsx`  
**Action:** Use the Next.js `viewport` export:

```typescript
export const viewport: Viewport = {
  themeColor: '#ffffff', // replace with Emojar's primary brand colour
};
```

**Why:** Checked by Lighthouse for PWA compliance; affects mobile browser UI chrome.

---

### Task 3.6 — Add `next/font` for Future Font Safety

**File:** `app/layout.tsx`  
**Problem:** Currently using system fonts (fast). If a Google Font is added later without `next/font`, it will cause CLS regressions.  
**Action:** If a custom font is introduced, use `next/font/google` instead of a `<link>` tag.

```typescript
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

**Why:** Core Web Vital CLS threshold is ≤0.1; font-swap without proper handling is a common CLS cause.

---

## PRIORITY 4 — Low Impact, Low Effort (Polish)

### Task 4.1 — Add BreadcrumbList Structured Data to Blog Post Pages

**File:** `app/blog/[slug]/page.tsx`

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://emojar.com' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://emojar.com/blog' },
    { '@type': 'ListItem', position: 3, name: post.title, item: `https://emojar.com/blog/${post.slug}` },
  ],
}
```

---

### Task 4.2 — Add Organization Structured Data to Root Layout

**File:** `app/layout.tsx`

```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Emojar',
  url: 'https://emojar.com',
  logo: 'https://emojar.com/logo-64.png',
  sameAs: [], // add social profile URLs when available
};
```

**Why:** Organization schema helps Google associate the brand and surfaces the logo in the Knowledge Panel.

---

### Task 4.3 — Add `security.txt` File

**File:** Create `/public/.well-known/security.txt`

```
Contact: mailto:contact@emojar.com
Expires: 2027-01-01T00:00:00.000Z
Preferred-Languages: en
```

---

### Task 4.4 — Verify Canonical Tags Are Absolute URLs

**Files:** All pages that set `alternates.canonical`  
**Action:** Confirm that `metadataBase: new URL('https://emojar.com')` is correctly resolving relative canonicals to absolute URLs by inspecting the rendered HTML source of a few pages. If any page overrides `metadataBase` or sets a hardcoded relative canonical, fix it.

---

### Task 4.5 — Add `<link rel="preconnect">` for AdSense

**File:** `app/layout.tsx`

```tsx
<link rel="preconnect" href="https://pagead2.googlesyndication.com" />
<link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
```

**Why:** Reduces DNS + TCP + TLS handshake time for the AdSense origin; improves LCP.

---

### Task 4.6 — Confirm Hero Image Has `priority` Flag

**File:** `components/HeaderLogo.tsx` and the home page hero  
**Action:** Confirm the logo `<Image>` still has `priority` prop. If a hero image was added after the initial build, add `priority` to it too.  
**Target:** LCP ≤ 2.5 seconds.

---

### Task 4.7 — Audit and Fix Heading Hierarchy

**Files:** All page components  
**Action:**
1. Confirm exactly one `<h1>` per page.
2. Ensure heading levels don't skip (no H1 → H3 without H2).
3. On emoji detail pages, confirm the emoji name is the H1.

---

## Testing & Verification Checklist

Run after each priority group is complete:

| Tool | What to check |
|---|---|
| GSC → Pages → Server error (5xx) | Should drop to 0 after Task 0.1 |
| `curl -I https://www.emojar.com` | Should return 301 to emojar.com after Task 0.2 |
| GSC → Pages → Indexed count | Should recover toward ~3,800+ over 4–8 weeks |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Structured data validity per page type |
| [PageSpeed Insights](https://pagespeed.web.dev/) | LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 |
| [Open Graph Debugger](https://developers.facebook.com/tools/debug/) | OG image and metadata preview |
| [Twitter Card Validator](https://cards-dev.twitter.com/validator) | Twitter card preview |
| Chrome DevTools → Lighthouse | Full SEO + Performance + Accessibility audit |
| `curl -s https://emojar.com/sitemap.xml \| head -50` | Sitemap accessible and well-formed |
