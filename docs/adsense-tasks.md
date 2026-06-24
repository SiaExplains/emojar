# AdSense Rejection — Root Cause Analysis & Optimization Tasks

**Rejection status:** Needs attention — Low value content  
**Ads.txt status in AdSense dashboard:** Not found  
**Reviewed:** 2026-06-24

---

## What Emojar Actually Is (and Why That Matters)

Emojar is **not a blog**. The core product is a multi-feature emoji platform:

| Feature | What it does |
|---|---|
| Emoji search & copy | Instant fuzzy-search across 3,790 Unicode emojis, copy with one tap |
| 10 emoji-based games | XO, Snake, Minesweeper, Hangman, Bubble Shooter, Guess the Flag, Emoji Puzzle, Older or Newer, Guess the Animal, Odd One Out |
| Emoji to PNG | Convert any emoji to a high-quality PNG (64–1024px), pick background and padding, download in-browser |
| Emoji Personality Quiz | 12-question Big Five OCEAN quiz, cosine-similarity matching to 5 emojis, shareable result card |
| Emoji learning pages | Individual pages for all 3,790 emojis with Unicode data, category, keywords, version |

**Future roadmap:** Emoji-only social network (users communicate via emojis instead of text), Emopet (virtual digital pet based on emojis).

The problem: **Google's crawler cannot experience any of this**. Every feature that makes Emojar genuinely valuable is JavaScript-driven. What the AdSense reviewer (human or automated) actually sees is a search bar, an emoji grid, and some game pages with near-zero crawlable text.

---

## Root Cause Analysis

### 1. ads.txt Not Found (CRITICAL — breaks monetisation entirely)

The AdSense dashboard shows **Ads.txt status: Not found**. The file exists in `public/Ads.txt` (capital A) but AdSense crawls for the lowercase `ads.txt`. On case-sensitive servers this file is invisible to the crawler. Until this is resolved, no ads can be served even after approval.

### 2. The site's real value is invisible to crawlers

This is the core structural problem. Every high-value feature on Emojar is interactive JavaScript:

- **Games** — 10 game pages have minimal crawlable HTML text. A crawler landing on `/games/snake` sees almost nothing beyond a heading and a canvas element.
- **Emoji to PNG tool** — The tool page has a search input, a canvas, and download controls. Almost no prose text for a crawler to evaluate.
- **Personality Quiz** — 12 questions rendered in React state. The crawled HTML is essentially a skeleton.
- **Emoji pages (3,790 of them)** — Each page has the emoji character, its Unicode name, category, and a small data table. These are the majority of indexed URLs and they look like thin, auto-generated content at scale.

Google's quality scorer sees: thousands of minimal data pages + a few tool pages with no prose + a blog. It cannot see that the games are polished, that the PNG tool works brilliantly, or that the quiz is psychologically grounded.

### 3. Blog content is thin and entirely self-referential

All 17 blog posts were published within a 6-week window (May–June 2026). Actual prose content per post ranges from ~300 to ~500 words — well below the 800–1,500+ word threshold for substantive editorial content.

More critically: 16 of 17 posts are about Emojar's own features (game guides, platform updates, tool announcements). Google reads this as a marketing/promotional site, not an informational resource.

### 4. No author identity or E-E-A-T signals

Blog posts have no author bylines. The About page describes "a single developer based in Berlin" with no name. Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) framework requires human identity signals.

### 5. Missing structured data

No JSON-LD structured data anywhere: no Article schema on blog posts, no SoftwareApplication or WebApplication schema on tool/game pages, no WebSite schema with SearchAction on the homepage. This is a missed opportunity to explicitly communicate to Google what each page's purpose and value is.

### 6. About page declares AdSense funding pre-approval

The About page currently says "Emojar is funded through display advertising (Google AdSense)". Declaring an unapproved monetisation partner can raise a policy flag during review.

### 7. Site age

All editorial content published May–June 2026. AdSense prefers 3–6 months of consistent publishing history.

---

## Strategy

The core challenge is making Emojar's genuine value legible to Google. This requires two parallel tracks:

**Track A — Make the tools and games text-rich for crawlers**  
Add substantial prose content to game pages, tool pages, and emoji pages without changing the user experience. Think of it as giving each page a "guidebook" — the tool or game above the fold, a detailed written explanation and guide below it.

**Track B — Build topical authority with educational content**  
Publish long-form articles about emojis, Unicode, digital communication, and adjacent topics. These posts establish that Emojar is a genuine subject-matter resource, not a thin utility site.

---

## Tasks

### CRITICAL

- [ ] **Rename `public/Ads.txt` → `public/ads.txt`** (all lowercase)  
  The AdSense dashboard shows "Not found". AdSense crawls for the exact path `/ads.txt` in lowercase. Rename the file and verify at `https://emojar.com/ads.txt` before resubmitting.  
  _File: `public/Ads.txt`_

- [ ] **Update About page — remove pre-approval AdSense claim**  
  Change "funded through display advertising (Google AdSense)" to "funded through display advertising". Claiming an unapproved partner is an avoidable policy red flag.  
  _File: `app/about/page.tsx`_

---

### HIGH — Make features visible to crawlers (Track A)

- [ ] **Add dedicated landing page copy to each game page**  
  Below each game canvas, add a prose section (300–500 words) covering: what the game is, how to play (rules), tips and strategy, why it's emoji-themed, and what makes the Emojar version distinctive. This text is invisible during play but highly visible to crawlers.  
  _Files: all `app/games/*/page.tsx`_  
  Games to update: `/games/xo`, `/games/snake`, `/games/minesweeper`, `/games/hangman`, `/games/bubble-shooter`, `/games/guess-the-flag`, `/games/emoji-puzzle`, `/games/older-or-newer`, `/games/guess-the-animal`, `/games/odd-one-out`

- [ ] **Add rich landing copy to `/emoji-to-png`**  
  Below the tool, add a 400–600 word section covering: what the tool does and why it's useful, step-by-step usage guide, supported sizes and backgrounds, use cases (presentations, stickers, thumbnails, social media), comparison to platform-rendered vs downloaded PNG, and FAQ (5 questions).  
  _File: `app/emoji-to-png/page.tsx`_

- [ ] **Add rich landing copy to `/personality`**  
  Below the quiz interface, add a 400–600 word explanation: the Big Five OCEAN psychology model, why emojis map to personality traits, how the cosine similarity scoring works at a high level, what the shareable card shows, and FAQ.  
  _File: `app/personality/page.tsx`_

- [ ] **Enrich individual emoji pages with more prose**  
  Each emoji page currently shows a data table. Add 2–3 sentences of context per emoji: what it represents, common uses, platform rendering differences, and which Unicode version introduced it. This transforms 3,790 thin pages into genuinely useful reference pages.  
  _File: `app/emoji/[slug]/page.tsx`_

- [ ] **Add `SoftwareApplication` or `WebApplication` JSON-LD to game and tool pages**  
  Use the `SoftwareApplication` schema with `applicationCategory: "GameApplication"` or `"UtilitiesApplication"`, `operatingSystem: "Web Browser"`, `offers` (free), and a meaningful `description`. This explicitly tells Google these are legitimate interactive applications, not thin pages.

---

### HIGH — E-E-A-T and trust signals

- [ ] **Add author identity to About page**  
  Replace "a single developer based in Berlin" with the developer's real name, a 2–3 sentence bio, and at least one external profile link (GitHub, LinkedIn, or Twitter/X). Google reviewers explicitly look for a named human behind the site.  
  _File: `app/about/page.tsx`_

- [ ] **Add author bylines to all blog posts**  
  Every post needs an author line below the `<h1>`. Add a reusable `<PostAuthor name="…" date="…" />` component.  
  _Component to create: `components/PostAuthor.tsx`_  
  _Files to update: all `app/blog/*/page.mdx`_

- [ ] **Expand the About page content (target: 700–900 words)**  
  Cover: who built it and why, the Unicode CLDR data source in detail, how emoji pages are generated, what makes the games original, the editorial approach, and contact information. The About page is the first page a human reviewer reads.

---

### HIGH — Content depth and topical authority (Track B)

- [ ] **Expand thin blog posts to 800+ words of prose**  
  Thinnest posts (under 500 total words including metadata):
  - `emojar-games-launched` (~449 words) — add launch story, what was built, technical choices
  - `emojar-may-2026-updates` (~487 words) — expand each update with context and rationale
  - `emoji-snake-game-guide` (~508 words) — add scoring, levels, mobile tips, common mistakes
  - `guess-the-animal-game` (~534 words) — add 130-animal category breakdown, difficulty tiers, fun facts
  - `guess-the-flag-game` (~537 words) — add regional groupings, hardest flags, memorisation tips
  - `older-or-newer-game` (~568 words) — add Unicode version history table, notable additions per version
  - `emoji-minesweeper-game-guide` (~570 words) — add opening theory, probability-based flagging, pattern analysis
  - `emoji-hangman-game-guide` (~591 words) — add letter frequency analysis, common emoji name patterns

- [ ] **Write 5–8 new long-form topical posts (800–1,500+ words each)**  
  These should be genuinely useful standalone articles about emojis, not Emojar announcements:
  - *What is Unicode? How emojis actually work under the hood* — code points, CLDR, platform rendering, version history
  - *The history of the emoji: from Japan's 176 original characters to 3,790+ today* — evergreen timeline
  - *Why the same emoji looks different on iPhone, Android, and Windows* — comparison with examples, rendering differences
  - *How to use emojis professionally without looking unprofessional* — workplace and business communication guide
  - *The most misused emojis and what they actually mean according to Unicode* — high-traffic listicle
  - *Emoji and accessibility: what screen readers say when they encounter 😀* — unique educational angle
  - *How to type any emoji on Windows, Mac, iPhone, and Android without copy-pasting* — high-search-volume practical guide
  - *The psychology of emojis: what your favourite emoji says about your personality* — links naturally to the Personality Quiz

---

### MEDIUM — Structured data

- [ ] **Add Article JSON-LD to all blog posts**  
  Include `headline`, `author` (with name + URL), `datePublished`, `dateModified`, `publisher` (Emojar + logo), and `url`.  
  _Best placed in `app/blog/layout.tsx` as a layout-level script tag._

- [ ] **Add WebSite JSON-LD with SearchAction to homepage**  
  `WebSite` schema with `SearchAction` pointing to `https://emojar.com/?q={search_term_string}`. Signals this is a legitimate search tool and enables Sitelinks Search Box in results.

- [ ] **Add BreadcrumbList JSON-LD to emoji, category, and blog pages**  
  Example for emoji pages: `Home > Smileys & Emotion > 😀 Grinning Face`. Confirms each page belongs to a structured hierarchy.

---

### MEDIUM — Technical hygiene

- [ ] **Audit robots.txt**  
  Verify `/blog`, emoji pages, and sitemap are not blocked. Confirm sitemap URL in robots.txt matches the actual URL.  
  _File: `public/robots.txt`_

- [ ] **Submit updated sitemap to Google Search Console after content changes**  
  After publishing new posts and expanding existing ones, request a sitemap re-crawl. Check Coverage for "Discovered — currently not indexed" and "Crawled — currently not indexed" pages.

- [ ] **Verify all canonical URLs in blog posts are correct**  
  Each `app/blog/*/page.mdx` must export a `canonical` URL that exactly matches the live URL.

---

### MEDIUM — User experience signals

- [ ] **Add FAQ sections to top 5 blog posts**  
  3–5 questions with 50–100 word answers each. Supports `FAQPage` JSON-LD and adds meaningful word count.

- [ ] **Add internal links between related blog posts and feature pages**  
  Game guides → link to `/games` hub and to each other. Tool posts → link to topical articles. Personality quiz post → link to the psychology article (once written). Builds topical clusters.

- [ ] **Add a visible "Last updated" date to all blog posts**  
  Show `Published: X · Updated: Y` to signal ongoing editorial care.

---

### LOW — Polish

- [ ] **Add Open Graph images to blog posts**  
  No `og:image` on any post. Even a simple static image per post improves link previews, which signals real social engagement.

- [ ] **Add a Privacy Policy last-reviewed date**  
  Important for GDPR compliance visibility (site is based in Berlin, Germany).

- [ ] **Add RSS feed**  
  A visible RSS link signals an active publishing operation to both Google and human reviewers.

---

## Re-submission Checklist

Before clicking "Request review" in AdSense:

- [ ] `ads.txt` accessible at `https://emojar.com/ads.txt` (verify with `curl -I https://emojar.com/ads.txt`)
- [ ] Game pages and tool pages each have 300+ words of prose below the interactive element
- [ ] At least 5 blog posts are 800+ words of actual prose
- [ ] At least 3 new topical/educational posts published
- [ ] Author name and bio visible on About page
- [ ] Author bylines on all blog posts
- [ ] Article JSON-LD on all blog posts
- [ ] SoftwareApplication JSON-LD on all game and tool pages
- [ ] Updated sitemap submitted to Google Search Console
- [ ] Wait 2–4 weeks after last content update before resubmitting

---

## References

- [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [AdSense Site Approvals video series](https://www.youtube.com/playlist?list=PLbAFD4oU9Ycr4j1pViNjkS82rhbF293H8)
- [How to address insufficient content disapprovals — Google Blog](https://blog.google/products/adsense/how-to-address-insufficient-content/)
- [AdSense low value content community guide](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge)
- [E-E-A-T guidelines — Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
