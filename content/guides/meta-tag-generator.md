---
slug: meta-tags-and-open-graph-checklist-for-new-pages
tool: meta-tag-generator
title: Meta Tag and Open Graph Checklist for Every New Page
description: "A ten-point checklist for titles, descriptions, canonical links, robots, Open Graph and X cards, with sample HTML and the mistakes that break link previews."
tags: [SEO, Open Graph, HTML]
---

Every new page needs a handful of tags in its `<head>`: a title and meta description for search results, a canonical link, a robots directive if the page shouldn't be indexed, and Open Graph plus X card tags so shared links show a proper preview. Get those right and most search and sharing problems never appear. Use the checklist below before you publish, and generate the HTML rather than typing it by hand.

## The ten-point checklist

### 1. Is the title specific and short enough?

Aim for about 60 characters. Search engines truncate by pixel width rather than a fixed character count, so treat that number as a guide, not a law. In the [meta tag generator](/online-tool/developer-tools/meta-tag-generator) the counter under **Page title** stays green up to 60 characters, turns amber with "may be cut off" up to 70, and turns red with "will be cut off" beyond that. Put the distinctive words first and the brand last.

### 2. Does the description sell the click?

The **Description** counter uses 155 as the ideal and 170 as the hard limit. Write it for a person scanning results: what the page offers and why it's worth opening.

### 3. Is there exactly one canonical URL?

Tick **Add a canonical link for the page URL** and the generator outputs `<link rel="canonical">` using your **Page URL**. This tells search engines which version is the main one when the same content is reachable through tracking parameters, `www` and non-`www`, or trailing-slash variants. Use the absolute, final URL, not a staging address.

### 4. Should this page be indexed at all?

The **Search engines (robots)** menu offers four choices: "Index and follow (default)", "Don’t index, follow links", "Don’t index or follow", and "Index, allow large image previews". The default adds no robots tag, because indexing is what crawlers do anyway. Thank-you pages, internal search results and thin duplicates are good `noindex` candidates. For a thank-you page with only a title and URL filled in, the output starts with:

```html
<title>Thank you</title>
<meta name="robots" content="noindex, nofollow" />
```

Keep in mind that `noindex` only works if crawlers can fetch the page. If robots.txt blocks it, they never see the tag. The [robots.txt generator](/online-tool/developer-tools/robots-txt-generator) helps you keep the two consistent.

### 5. Is the share image the right size and absolute?

Use 1200 × 630 pixels (1.91:1), the size noted next to the **Image URL** field, and an absolute `https://` URL. Relative paths like `/img/og.png` don't work for scrapers. The previews only load images from http or https URLs, so an empty preview box is a quick hint that the URL is wrong. If you need to crop an existing photo to that ratio, the [social media image resizer](/online-tool/image-tools/social-media-image-resizer) can do it.

### 6. Does the image have alt text?

**Image description (alt)** fills both `og:image:alt` and `twitter:image:alt`. Screen-reader users on social platforms hear this instead of seeing the image, so describe what's in it.

### 7. Is og:type correct?

**Content type (og:type)** offers website, article, product, profile, video.other and book. Use `website` for home and landing pages and `article` for blog posts and news.

### 8. Which X card layout do you want?

**X / Twitter card** has two options: "Large image" (`summary_large_image`) and "Small square image" (`summary`). The X preview switches between a wide 2:1 image and a square thumbnail beside the text, so you can see the difference before you choose. Add your handle in **X / Twitter @username (optional)**; the generator adds the `@` if you leave it out.

### 9. Are special characters safe?

Titles often contain ampersands and quotes, and a raw `"` inside a `content="…"` attribute ends the attribute early. The generator escapes every value. A title like `Soups & Stews: 12 "Freezer-Friendly" Recipes` becomes:

```html
<title>Soups &amp; Stews: 12 &quot;Freezer-Friendly&quot; Recipes</title>
<meta property="og:title" content="Soups &amp; Stews: 12 &quot;Freezer-Friendly&quot; Recipes" />
```

### 10. Did you refresh cached previews?

Facebook, LinkedIn and X cache link previews. After changing tags on a page that's already been shared, run the URL through each platform's sharing debugger so it re-scrapes the page.

## What does the full output look like?

For a recipe article with site name, locale `en_US`, a share image and a large X card, the generated block is grouped into three parts: the basic SEO tags (title, description, canonical), an Open Graph section (`og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:image`, `og:image:alt`) and an X section (`twitter:card`, `twitter:site`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`). Empty fields are skipped, so you never ship tags with blank content. You can copy or download the result as `meta-tags.html`. The full property list is documented in the [Open Graph protocol](https://ogp.me/).

## Common mistakes the checklist catches

- **Overestimating the theme color.** **Theme colour (mobile browser bar)** only tints the browser UI on supporting mobile browsers; it has no effect on search rankings.
- **Keyword stuffing.** The generator doesn't output a meta keywords tag at all, since major search engines ignore it.
- **Trusting the preview blindly.** The Google, Facebook / LinkedIn and X previews are approximations. Platforms change their layouts, so the real card can differ slightly.

Everything is generated in your browser from what you type. The only network request is the preview loading the image from the URL you entered.

## FAQ

### Do I need both og:title and a title tag?

Yes. The `<title>` tag is used by browsers and search engines, while `og:title` is read by social platforms. The generator fills both from the same field, so they stay in sync.

### Where exactly do these tags go?

Inside `<head>`, before any scripts that might fail. In frameworks such as Next.js or Nuxt, map each value to the framework's metadata API instead of pasting raw HTML.

Run through the list for your next page with the [Meta Tag & Open Graph Generator](/online-tool/developer-tools/meta-tag-generator).
