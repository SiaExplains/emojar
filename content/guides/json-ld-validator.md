---
slug: how-to-validate-json-ld-structured-data
tool: json-ld-validator
title: 'How to Validate JSON-LD Structured Data and Fix Common Errors'
description: What a JSON-LD check looks for, how to read errors and warnings by JSON path, and a worked example of fixing broken Article markup step by step.
tags: [SEO, Structured Data, JSON-LD]
---

To validate JSON-LD, check three layers in order: is it valid JSON, does it use the JSON-LD keywords correctly, and does each Schema.org type include the properties it needs? Paste your markup, or a page's HTML, into the [JSON-LD Validator](/online-tool/developer-tools/json-ld-validator) and it runs all three checks in your browser, listing every problem with the exact path where it happens. It's a fast local check, not Google's Rich Results Test, so use it while you write markup and confirm with Google's tool once the page is live.

## What can go wrong in JSON-LD?

Small slips go unnoticed easily. The usual problems fall into three groups.

**Broken JSON.** A trailing comma, a missing quotation mark or a curly quote pasted from a word processor stops the whole block from parsing, and search engines ignore it.

**Misused keywords.** JSON-LD keywords start with `@` and are case-sensitive. `@Type` or `@context ` with a trailing space aren't keywords at all, so the data loses its meaning without any visible error on the page.

**Missing or badly formatted values.** A date like `14/10/2026` isn't ISO 8601, a logo given as `/logo.png` isn't an absolute URL, and a Question without an `acceptedAnswer` doesn't describe a complete FAQ entry.

## What the validator checks

When the JSON parses, a summary line shows whether it's valid, how many typed entities were found, and how many errors and warnings there are. If you pasted HTML with several script blocks, it tells you how many it read. The **Found** panel lists each `@context` and every `@type` found anywhere in the data.

Below that, each issue is labelled **Error**, **Warning** or **Info** and shows a JSON path such as `$.author.name` or `$[1].mainEntity[0]`, so you know exactly where to look. The checks include:

- JSON syntax, with the line and column of the first problem.
- `@context` that isn't a string, an object or an array of them, and a note if you use `http://schema.org` instead of `https://schema.org`.
- `@type` values that contain spaces, and any `@` word that isn't a real JSON-LD keyword.
- Common date properties, such as `datePublished`, `dateModified`, `startDate` and `endDate`, that aren't ISO 8601.
- URL properties such as `url`, `logo` and `sameAs` that aren't absolute http(s) addresses.
- Empty strings, nested objects with no `@type`, and one `@id` described twice.
- Properties Google's documentation lists as required for common types, for example `headline` for Article, `price` and `priceCurrency` for Offer, and `name`, `startDate` and `location` for Event.

## A worked example: fixing a broken Article block

Here's markup copied from a CMS template, with four problems in it:

```json
{
  "@context": "http://schema.org",
  "@Type": "Article",
  "headline": "Ten Houseplants That Survive Neglect",
  "datePublished": "14/10/2026",
  "publisher": { "@type": "Organization", "name": "Green Corner", "logo": "/img/logo.png" },
}
```

Paste it in and the first thing you see is an "Invalid JSON" error ending in "(line 7, column 1)". The exact wording varies by browser, but the position points at the closing brace, because after the comma it expected another property. Delete the comma after the publisher object and the markup parses. Now the issue list shows:

1. **Info** at `$["@context"]`: use https://schema.org rather than http://schema.org.
2. **Warning** at `$["@Type"]`: "@Type" is not a JSON-LD keyword. Because of the capital T, the Article has no type at all, so the **Found** panel lists only Organization.
3. **Warning** at `$.datePublished`: "14/10/2026" is not an ISO 8601 date.
4. **Warning** at `$.publisher.logo`: "/img/logo.png" is not an absolute http(s) URL.

Fix each one: switch to `https://schema.org`, write `@type` in lowercase, change the date to `2026-10-14`, and give the logo a full address like `https://example.com/img/logo.png`. The summary now reports two typed entities (the Article and the Organization) and no errors or warnings.

If you'd rather not write Article markup by hand at all, the [Article Schema Generator](/online-tool/developer-tools/article-schema-generator) produces it with ISO dates and URL checks built in, and the [FAQ Schema Generator](/online-tool/developer-tools/faq-schema-generator) does the same for FAQ pages.

## How to use the validator

1. Paste JSON-LD directly, or paste HTML. If the input starts with `<`, every `<script type="application/ld+json">` block is extracted and checked, and the rest of the HTML is ignored.
2. Read the summary, then work through the issues from top to bottom. Errors first, then warnings.
3. Use the **Structure** tree on the right to expand nested objects and see how the entities fit together.
4. Press **Copy formatted JSON** to take a neatly indented copy back to your template.

The box starts with a short Article example. Press **Clear** to empty it and paste your own.

## What this validator doesn't do

Know its limits before you rely on it:

- **It doesn't fetch remote contexts.** A `@context` URL is recorded but never downloaded, so terms aren't expanded the way a full JSON-LD processor would expand them.
- **It doesn't check every Schema.org property.** A misspelled property like `headlin` is just an unknown key, not an error.
- **It isn't Google's Rich Results Test.** It can't tell you whether a page is eligible for a search feature, and it doesn't render your live page. Valid markup never guarantees rich results or rankings.

## FAQ

### My markup is plain JSON. Is that enough?

Valid JSON is the first step, and the [JSON Validator](/online-tool/developer-tools/json-validator) checks just that. JSON-LD adds rules on top, which is what this tool covers.

### How do I explore a very large block?

Collapse branches in the Structure tree, or open it in the [JSON Viewer](/online-tool/developer-tools/json-viewer).

Paste your next block of structured data into the [JSON-LD Validator](/online-tool/developer-tools/json-ld-validator) before it reaches production.
