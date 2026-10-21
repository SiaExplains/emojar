---
slug: seo-checklist-before-you-publish-a-page-or-blog-post
title: 'SEO Checklist Before You Publish a Page or Blog Post'
description: Check the slug, title, meta and share tags, robots.txt, UTM links and JSON-LD, then the keyword use, reading time and long sentences before going live.
tags: [SEO, Checklist, Blogging, Web Development]
---

Before a new page or blog post goes live, check four things: the URL and head tags, whether crawlers are allowed to reach it, the structured data, and the text itself. Each check takes a minute in a browser tool, and none needs the page to be online. No checklist can promise a ranking, but this one removes avoidable mistakes like a staging `noindex`, a broken date in the markup or a title that gets cut off.

The example below is a coffee roaster's new post, "The Best Way to Store Coffee Beans at Home", published on October 21, 2026.

## Step 1: Fix the URL before anything links to it

The slug is the one part you shouldn't change after launch, because every share, backlink and analytics report points at it. Paste the headline into the [slug generator](/online-tool/text-tools/slug-generator). By default it gives `the-best-way-to-store-coffee-beans-at-home`. Tick **Remove stop words (a, the, and…)** and it becomes `best-way-store-coffee-beans-home`. The post lives at `/blog/best-way-store-coffee-beans-home`. A max length of 20 would cut it to `best-way-store`, which is too vague, so leave it empty.

## Step 2: Write the title, description and share tags

Open the [meta tag generator](/online-tool/developer-tools/meta-tag-generator) and fill in the title, description, page URL and share image. A first try, `The Best Way to Store Coffee Beans at Home | Example Roasters`, is 61 characters, and the counter warns it may be cut off. `How to Store Coffee Beans at Home | Example Roasters` is 52 and keeps the brand. The 149-character description fits under the 155 guide.

Leave **Search engines (robots)** on index and tick the canonical link so the clean URL is the main version. The output includes Open Graph and X card tags too.

Then check the link card in the [social share preview](/online-tool/developer-tools/social-share-preview). Choose the image from your device and pick the large 1.91:1 layout. If the photo is 1600 × 1200 pixels, the hint says it will be cropped. Re-export it at 1200 × 630 and the hint turns green. The preview simulates what you type rather than reading the live page, and each platform crops a little differently.

## Step 3: Make sure crawlers can reach the page

Paste your rules into the [robots.txt generator](/online-tool/developer-tools/robots-txt-generator) and test the new path with the crawler set to Googlebot. Two real cases:

```text
User-agent: *
Disallow: /
```

This staging file, copied to production, gives "Blocked for Googlebot, matched Disallow: /". A subtler one is `Disallow: /blog`, written to hide a `/blog-drafts` folder. Rules match by prefix, so it blocks `/blog/best-way-store-coffee-beans-home` too. Use `Disallow: /blog-drafts` instead and the tester reports the post as allowed. robots.txt is only a request; to keep a page out of results, use `noindex`.

## Step 4: Tag the links you'll share

Tag the newsletter and social links that announce the article. In the [UTM builder](/online-tool/developer-tools/utm-builder), source `newsletter`, medium `email` and campaign `october_beans` produce:

```text
https://example.com/blog/best-way-store-coffee-beans-home?utm_source=newsletter&utm_medium=email&utm_campaign=october_beans
```

Type `Newsletter` or `october beans` and the builder warns you: mixed case splits one campaign into two report rows, and the space becomes `+`.

## Step 5: Add structured data, then check it

For a blog post, use the [article schema generator](/online-tool/developer-tools/article-schema-generator) and choose BlogPosting. Enter the headline as it appears on the page, a full https image URL, the author and publisher, and ISO 8601 dates. Our first draft had a modified date of `2026-10-20`, a day before publishing, and the generator flagged it.

If the post ends with a visible Q&A section, the [FAQ schema generator](/online-tool/developer-tools/faq-schema-generator) turns those pairs into FAQPage markup. Be realistic: since August 2023, Google shows FAQ rich results only for well-known government and health sites, so a coffee blog's markup won't add expandable questions to search results.

Before pasting either block into the template, check it in the [JSON-LD validator](/online-tool/developer-tools/json-ld-validator). A hand-edited version of our markup produced four findings:

- `http://schema.org` should be `https://schema.org`
- `@Type` is not a JSON-LD keyword (it's case-sensitive)
- `21/10/2026` is not an ISO 8601 date
- the author Person is missing `name`

The validator works locally. It never fetches remote contexts and it isn't Google's Rich Results Test, so do that official check once the page is live.

## Step 6: Read the text the way a visitor will

Paste the article into the [keyword density checker](/online-tool/text-tools/keyword-density-checker) with two-word phrases selected. Our 1,200-word draft used "coffee beans" 18 times, which is 36 of 1,200 words, or 3%. No density is a target, but one phrase far above the rest reads as repetitive, so swap a few for "beans" or "your roast".

The [reading time calculator](/online-tool/text-tools/reading-time-calculator) gives 5 min 3 sec at the default 238 words per minute, so "5 min read" is an honest label. Finally, the [sentence length checker](/online-tool/text-tools/sentence-length-checker) with its default limit of 25 words found a 52-word sentence about buying in bulk. Splitting it into three made it easier to skim.

## Common mistakes

- Changing the slug after launch without a 301 redirect.
- Shipping the staging `noindex` meta tag or `Disallow: /`.
- Dates like `21/10/2026` in JSON-LD, or a modified date before the published one.
- Marking up FAQs that aren't visible on the page.
- UTM tags on internal links, which overwrite the visitor's real source.

## Quick checklist

1. Slug short, lowercase and final.
2. Title under about 60 characters, description under about 155, canonical set.
3. Share image 1200 × 630 and previewed.
4. Path allowed in robots.txt, no stray `noindex`.
5. Campaign links tagged in lowercase.
6. Article (and FAQ, if visible) JSON-LD validated.
7. Keyword use natural, reading time labelled, long sentences split.

For more site helpers, browse the [developer tools](/online-tool/developer-tools) and [text tools](/online-tool/text-tools).
