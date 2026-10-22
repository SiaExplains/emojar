# AdSense Rejection — Root Cause Analysis & Optimization Tasks

**Current status (2026-10-20):** **Getting ready** — review requested on 2026-10-18; Google says this usually takes a few days and sometimes 2–4 weeks.  
**Ads.txt status in AdSense dashboard:** **Authorized** (2026-10-20). It showed "Not found" for a few days after the site was re-added, although the live file was correct — the crawler just hadn't re-checked.  
**Earlier rejection:** Needs attention — Low value content (reviewed 2026-06-24) · **Status re-checked against the code and live site:** 2026-10-09 (v0.15.2)  
**Also done (2026-10-20):** `www.emojar.com` redirects permanently (308) to `emojar.com` (Vercel domain setting), and the contact address `hi@emojar.com` (Contact, Privacy, Terms, Impressum) receives mail.

> **Since the review:** Emojar became a tools site (288 browser tools as of v0.24.0), and every tool has its own in-depth guide (600+ words, Person author, visible date, FAQ, related guides), published from 2026-10-07, with every remaining guide made live on 2026-10-17 (v0.25.0); 17 topic posts cover multi-tool workflows and the emoji features (eight added on 2026-10-22 in v0.26.0). All 339 blog posts are in the sitemap and in `llms.txt`. The privacy policy, About and Terms were corrected in v0.15.2. The site-wide audit with the next steps is `emojar-docs/audit-2026-10/stage-a-audit.md`.

---

## Root Cause Analysis

Google's "Low value content" rejection is a catch-all signal that covers several overlapping problems. Based on auditing emojar.com against the [AdSense Program Policies](https://support.google.com/adsense/answer/48182) and [Google Publisher Policies](https://support.google.com/adsense/answer/10502938), the likely root causes in priority order are:

### 1. ads.txt Not Found (CRITICAL — breaks monetisation entirely)

The AdSense dashboard shows **Ads.txt status: Not found**. The file exists in `public/Ads.txt` (capital A) but AdSense crawls for the lowercase `ads.txt`. On case-sensitive servers this file is invisible to the crawler. Until this is resolved, no ads can be served even after approval.

### 2. Blog content is thin by AdSense standards

All 17 blog posts were published within a 6-week window (May–June 2026). Word counts (including MDX metadata and JSX) range from ~449 to ~1,190 words. Actual prose content per post is significantly lower — most game guides are ~300–450 words of real text. Google's threshold for substantial content is 800–1,500+ words of original, substantive prose per article.

### 3. All blog content is self-referential

16 of 17 blog posts are about Emojar's own features: game guides, platform updates, tool announcements. Google reads this as a marketing/promotional site, not an informational resource. There is no educational, topical, or evergreen content about emojis, Unicode, digital communication, or adjacent subjects.

### 4. No author identity or E-E-A-T signals

Blog posts have no author bylines. The About page describes "a single developer based in Berlin" with no name, no social profiles, no professional bio. Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) framework requires human identity signals to establish editorial credibility.

### 5. Tool/utility site bias

The vast majority of emojar.com's 3,800+ indexed pages are tool or utility pages (individual emoji pages, game pages, category pages) with minimal editorial text. Google applies extra scrutiny to utility-heavy sites because thin-content clones are common in this pattern. Without a strong editorial layer, the site reads as thin even if the tools themselves are high quality.

### 6. Missing structured data

No JSON-LD structured data is implemented anywhere on the site. Article schema on blog posts, BreadcrumbList on category/emoji pages, and WebSite schema with SearchAction on the homepage are all missing. These signals help Google understand what each page is and improve trust scores in automated review.

### 7. Site age

All editorial content was published between May–June 2026. AdSense reviewers and Google's automated systems prefer sites with at least 3–6 months of consistent publishing history before approval.

### 8. About page declares AdSense funding pre-approval

The About page currently says "Emojar is funded through display advertising (Google AdSense)". Declaring a monetisation relationship that hasn't been approved can raise a policy flag during review.

---

## Tasks

Tasks are ordered by impact × effort. Fix in this sequence before re-submitting.

---

### CRITICAL — Fix before anything else

- [x] **Rename `public/Ads.txt` → `public/ads.txt`** (all lowercase)  
       ✅ _Done — `public/ads.txt` is lowercase and `https://emojar.com/ads.txt` returns the publisher line (checked 2026-10-09)._  
       The AdSense dashboard shows "Not found". AdSense crawls `yourdomain.com/ads.txt` in lowercase. The current file is `Ads.txt` with a capital A. Rename the file and verify it is reachable at `https://emojar.com/ads.txt` before resubmitting.  
       _File: `public/Ads.txt`_

- [x] **Update About page — remove pre-approval AdSense claim**  
       ✅ _Done in v0.15.2 — the About page now says "funded through display advertising"._  
       Change "funded through display advertising (Google AdSense)" to something neutral like "funded through display advertising". Claiming an unapproved monetisation partner is a minor but avoidable policy red flag.  
       _File: `app/about/page.tsx`_

---

### HIGH — E-E-A-T and trust signals

- [x] **Add author identity to About page**  
       ✅ _Done — the About page names Siavash Ghanbari._  
       Replace "a single developer based in Berlin" with the developer's real name, brief bio (2–3 sentences), and at least one external profile link (GitHub, LinkedIn, Twitter/X). Google reviewers explicitly look for a named, identifiable human behind the site.  
       _File: `app/about/page.tsx`_

- [ ] **Add author bylines to all blog posts**  
       ◻ _Still open — guides carry the author only in JSON-LD; no visible byline yet, and older MDX posts use an Organization author._  
       Every blog post needs an author line (name + date). Add a reusable `<PostAuthor name="…" date="…" />` component and place it below the `<h1>` on each post. Without bylines, there are zero authorship signals across the entire blog.  
       _Component to create: `components/PostAuthor.tsx`_  
       _Files to update: all `app/blog/*/page.mdx`_

- [ ] **Expand the About page content**  
       The current About page is ~400 words. Expand to 700–900 words covering: the developer's background and why they built Emojar, a detailed description of the data sources (Unicode CLDR specifics), how emoji pages are generated, the editorial standards for blog content, and the site's stance on accuracy. This is the page Google reviewers read first.

---

### HIGH — Content depth and volume

- [ ] **Expand thin blog posts to 800+ words of prose**  
       The following posts are the thinnest (under 500 total words including metadata):
  - `emojar-games-launched` (~449 words) — expand with launch story, what was built, technical context
  - `emojar-may-2026-updates` (~487 words) — expand each update with more explanation
  - `emoji-snake-game-guide` (~508 words) — add scoring system, level progression, mobile tips, common mistakes
  - `guess-the-animal-game` (~534 words) — add all 130 animal categories breakdown, difficulty tiers, fun facts format
  - `guess-the-flag-game` (~537 words) — add regional groupings, hardest flags, tips for memorising
  - `older-or-newer-game` (~568 words) — add Unicode version history table, which versions added the most emojis
  - `emoji-minesweeper-game-guide` (~570 words) — add opening theory, probability-based flag placement, board pattern analysis
  - `emoji-hangman-game-guide` (~591 words) — add letter frequency analysis, common emoji name patterns, strategy tree

- [x] **Write 5–8 new long-form topical posts (800–1,500+ words each)**  
       ✅ _Done in substance — the tool guides are educational explainers (most 800–1,200 words); 16 are live and one more publishes each day._  
       All existing posts are about Emojar's own features. Google needs to see the site as an informational resource, not a product blog. Suggested topics:
  - _What is Unicode? A plain-English guide to how emojis actually work_ — explains code points, CLDR, platform rendering differences, version history
  - _The history of the emoji: from Japan's first 176 characters to 3,790+ today_ — evergreen timeline with facts
  - _Why emojis look different on every platform (Apple vs Google vs Samsung vs Windows)_ — comparison guide with examples
  - _How to use emojis professionally without looking unprofessional_ — workplace communication guide
  - _The most misunderstood emojis and what they actually mean_ — listicle with Unicode definitions vs common usage
  - _Emoji and accessibility: what screen readers say when they encounter an emoji_ — unique angle, high E-E-A-T value
  - _How to type any emoji on Windows, Mac, iPhone, and Android_ — high-search-volume, practical guide

---

### MEDIUM — Structured data

- [x] **Add Article JSON-LD to all blog posts**  
       ✅ _Done — guides emit `BlogPosting` with a Person author; the older MDX posts emit `BlogPosting` with an Organization author (see the byline task)._  
       Each blog post should include a `<script type="application/ld+json">` block with Article schema: `headline`, `author` (with name and URL), `datePublished`, `dateModified`, `publisher` (Emojar with logo), and `url`. This is a direct E-E-A-T signal.  
       _Best implemented as a layout-level component in `app/blog/[slug]/layout.tsx` or per-post._

- [x] **Add WebSite JSON-LD with SearchAction to homepage**  
       ✅ _Done — `app/layout.tsx`._  
       Add a `WebSite` schema with a `SearchAction` pointing to `https://emojar.com/?q={search_term_string}`. This enables Google Sitelinks Search Box and signals that the site is a legitimate search tool.  
       _File: `app/layout.tsx` or `app/page.tsx`_

- [x] **Add BreadcrumbList JSON-LD to emoji pages, category pages, and blog posts**  
       ✅ _Done — emoji, category, tool and blog pages._  
       Breadcrumb structured data on individual emoji pages (`Home > Smileys & Emotion > 😀 Grinning Face`) and category pages helps Google understand site hierarchy and confirms each page belongs to a structured, purposeful site.

---

### MEDIUM — Technical hygiene

- [x] **Audit and fix robots.txt**  
       ✅ _Done — `Allow: /` plus the sitemap; nothing blocked._  
       Verify `public/robots.txt` does not block the `/blog` directory, individual emoji pages, or the sitemap. Confirm the sitemap URL in robots.txt matches the actual sitemap URL.  
       _File: `public/robots.txt`_

- [ ] **Submit updated sitemap to Google Search Console after content changes**  
       ◻ _Manual — Sia, in Search Console._  
       After adding new blog posts and expanding existing ones, request a sitemap re-crawl in GSC. Also check the Coverage report for any pages marked "Discovered — currently not indexed" or "Crawled — currently not indexed".

- [x] **Verify all blog post canonical URLs are self-referencing and correct**  
       ✅ _Done — posts self-canonical; blog index pages 2+ self-canonical and tag views `noindex, follow` since v0.20.0._  
       Check that every `app/blog/*/page.mdx` exports a `canonical` URL that matches the live URL exactly. Mismatched canonicals can dilute crawl signals.

- [ ] **Add `<link rel="author">` to blog pages**  
       Point to the About page or a dedicated author profile page. This is a lightweight HTML signal of authorship that complements E-E-A-T.

---

### MEDIUM — User experience signals

- [ ] **Add a visible "Last updated" date to all blog posts**  
       ◐ _Partly — guides show their publish date; there is no separate "updated" date yet._  
       Google looks for freshness signals. Posts that show a visible `Last updated: DD Month YYYY` date alongside the published date signal ongoing editorial care.

- [x] **Add FAQ sections to at least the top 5 blog posts**  
       ✅ _Done — every tool guide ends with an FAQ._  
       FAQs add word count, address real user questions, and support `FAQPage` JSON-LD schema. Each FAQ block should have 3–5 questions with 50–100 word answers.

- [x] **Add internal links between related blog posts**  
       ✅ _Done for guides ("Related guides" block); older MDX posts not yet._  
       Game guide posts should link to each other and to the relevant game pages. The emoji tool posts should link to educational posts. Internal linking builds topical clusters and improves crawl depth.

---

### LOW — Polish and signals

- [x] **Add Open Graph images to blog posts**  
       ✅ _Done in v0.20.0 — every post (and every page) has its own share image._  
       Blog posts currently have no `og:image`. A simple static or dynamically generated OG image improves link-preview appearance when shared, which signals real social engagement.

- [x] **Add a Privacy Policy last-reviewed date**  
       ✅ _Done — "Last updated: 9 October 2026"._  
       The Privacy Policy page should show when it was last reviewed. AdSense reviewers check that the policy is current, especially for GDPR (the site is based in Berlin).

- [ ] **Consider adding a newsletter or RSS feed link**  
       ◻ _Still open — no RSS feed._  
       A visible RSS feed link signals that the blog is a real publishing operation, not a thin content farm.

---

## After approval

- [ ] Create a display ad unit in AdSense and set its id as
      `NEXT_PUBLIC_ADSENSE_SLOT_TOOL` in Vercel (Production). The labelled slot
      then appears below the tool on tool pages, 40 px from the tool, with its
      space reserved (`components/AdSlot.tsx`, v0.18.0). Until it is set, no
      manual ad renders.
- [ ] Decide whether Auto Ads stays off: if it is turned on, Google may place
      ads anywhere, including above tools.

## Re-submission Checklist

Before clicking "Request review" in AdSense:

- [x] `ads.txt` accessible at `https://emojar.com/ads.txt` (verify with browser and `curl`) — verified 2026-10-09
- [x] At least 5 blog posts are 800+ words of actual prose — 15 live guides on 2026-10-09
- [x] At least 3 new topical/educational posts published — all 288 tool guides plus 17 topic posts live (latest eight on 2026-10-22)
- [x] Author name and bio visible on About page
- [ ] Author bylines on all blog posts
- [x] Article JSON-LD on all blog posts
- [ ] Updated sitemap submitted to Google Search Console
- [x] Review requested — 2026-10-18 (status: Getting ready). Don't make large content changes until it is decided.

---

## References

- [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [AdSense Site Approvals video series](https://www.youtube.com/playlist?list=PLbAFD4oU9Ycr4j1pViNjkS82rhbF293H8)
- [How to address insufficient content disapprovals — Google Blog](https://blog.google/products/adsense/how-to-address-insufficient-content/)
- [AdSense low value content community guide — Google Support](https://support.google.com/adsense/community-guide/241032356/how-can-you-solve-the-low-value-content-adsense-disapproval-challenge)
- [E-E-A-T guidelines — Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
