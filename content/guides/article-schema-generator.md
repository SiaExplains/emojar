---
slug: article-structured-data-blogposting-json-ld-guide
tool: article-schema-generator
title: 'Article Structured Data: Writing BlogPosting JSON-LD Step by Step'
description: Which properties Article and BlogPosting markup should include, how to format dates and images, and a worked example of a blog post's JSON-LD.
tags: [SEO, Structured Data, Blogging]
---

Article structured data is a JSON-LD block that tells search engines the headline, author, images and dates of a piece of writing. Google's documentation lists no strictly required properties for Article markup, but it recommends five: `headline`, `image`, `datePublished`, `dateModified` and `author`. Fill those in accurately, use ISO 8601 dates and full image URLs, and you have solid markup. The [Article Schema Generator](/online-tool/developer-tools/article-schema-generator) builds it from a simple form and only includes the fields you actually fill in.

## Article, BlogPosting or NewsArticle?

All three are Schema.org types, and the last two are more specific kinds of Article. Pick the one that matches the content honestly:

- **BlogPosting** for posts on a blog. This is the generator's default.
- **NewsArticle** for news reporting.
- **Article** for everything else: guides, essays, documentation pages.

Search engines treat the three much alike, so getting the values right matters more. Choose with the **Type** menu.

## Which properties are worth filling in?

Here's what each field in the generator produces and why it's there:

| Field | JSON-LD property | Notes |
| --- | --- | --- |
| Headline | `headline` | The only field the tool requires. Match the visible title. |
| Description | `description` | A one-sentence summary. |
| Page URL | `mainEntityOfPage` | Written as a WebPage with this URL as its `@id`. |
| Image URLs | `image` | One per line. A single URL is a string, several become an array. |
| Author name, type, URL | `author` | A Person or an Organization, with an optional profile link. |
| Publisher name, logo | `publisher` | An Organization, with the logo as an ImageObject. |
| Date published, modified | `datePublished`, `dateModified` | ISO 8601 only. |

The headline is the only field you can't leave empty, because markup without it doesn't describe an article at all. Everything else is optional, and empty fields are simply left out rather than written as empty strings, which validators would complain about.

## Getting dates and images right

Dates are where most hand-written Article markup goes wrong. JSON-LD expects ISO 8601, which means one of these shapes:

- A plain date: `2026-10-14`
- A date and time with a time zone: `2026-10-14T09:30:00+02:00`, or with `Z` for UTC

Formats such as `14/10/2026` or `Oct 14, 2026` are ambiguous, and the generator rejects them with a clear error. It also checks that the date exists, so `2026-02-30` fails. **Date published** starts out filled with today's date, which is handy when you mark up a post on the day it goes live, but change it if you're tagging an older article. If the modified date is earlier than the published date, you'll get a warning, since that's almost always a typo.

Images must be full `http` or `https` URLs, not relative paths like `/images/cover.jpg`. Google suggests offering large images in several aspect ratios (16:9, 4:3 and 1:1), so if you have three crops of the same cover, paste all three on separate lines.

## A worked example: marking up a coffee blog post

Say you published a post called "How to Brew Better Coffee at Home" on 2 October and updated it on 14 October. Fill in the form like this:

- **Type:** BlogPosting
- **Headline:** How to Brew Better Coffee at Home
- **Page URL:** `https://example.com/blog/better-coffee`
- **Image URLs:** `https://example.com/img/coffee-16x9.jpg` and `https://example.com/img/coffee-1x1.jpg`
- **Author name:** Sam Rivera, **Author is a:** Person, **Author URL:** `https://example.com/about/sam`
- **Publisher name:** Example Coffee Co.
- **Date published:** `2026-10-02`, **Date modified:** `2026-10-14T08:00:00+01:00`

The output box shows a BlogPosting object with `mainEntityOfPage`, an `image` array of two URLs, an `author` Person with a `url`, and a `publisher` Organization. The URL path itself, `better-coffee`, is the kind of short slug you can create with the [Slug Generator](/online-tool/text-tools/slug-generator).

With **Wrap in a &lt;script&gt; tag** ticked, the result is ready to paste into your page template. Untick it for raw JSON. **Copy** and **Download** sit above the output; the file is `article-schema.html` or `article-schema.json` depending on the checkbox.

## What the generator checks for you

Errors stop the output until you fix them:

- A missing headline.
- A page, author, logo or image URL that isn't a full http(s) address.
- A date that isn't valid ISO 8601.

Warnings still produce output but point at likely gaps:

- No image URL, because article results use one.
- No author name, or no publication date.
- A headline over 110 characters, which is probably not the short visible title.
- A modified date before the published date.

## Common mistakes

**Marking up a different headline from the one readers see.** The `headline` should match the title on the page, not a keyword-stuffed variant.

**Forgetting dateModified after an update.** If you rewrite a post, update the modified date in the markup too. Don't bump it for trivial edits just to look fresh.

**Putting the author in as a plain string.** The generator always writes `author` as a Person or Organization object with a `name`, which is the form Google's documentation describes.

**Assuming markup brings special results.** Valid Article data helps search engines understand the page, but it doesn't guarantee rankings or any particular display.

## FAQ

### Do I also need Open Graph tags?

They do a different job. JSON-LD is for search engines; Open Graph tags control link cards on social platforms. The [Meta Tag Generator](/online-tool/developer-tools/meta-tag-generator) writes those.

### How can I double-check the output?

Paste it into the [JSON-LD Validator](/online-tool/developer-tools/json-ld-validator). It confirms the syntax, flags dates that aren't ISO 8601 and lists the types it found.

Open the [Article Schema Generator](/online-tool/developer-tools/article-schema-generator) next time you publish, and add the markup while the details are fresh.
