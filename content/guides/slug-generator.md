---
slug: url-slug-checklist-length-stop-words-and-accents
tool: slug-generator
title: "URL Slug Checklist: Length, Stop Words, Accents and Redirects"
description: A practical checklist for writing URL slugs that read well and stay stable, with real before-and-after examples for accents, symbols, stop words and length.
tags: [SEO, URLs, Checklist]
---

A good URL slug is short, lowercase, made of plain letters and numbers, uses hyphens between words, and describes the page in a few keywords. Generate it from the page title, trim words that add nothing, and then leave it alone once the page is live. The checklist below walks through each decision with real inputs and the slugs they produce.

The slug is the readable end of a URL, the `make-bread` in `example.com/blog/make-bread`, and it appears everywhere the link is shared.

## 1. Is it lowercase?

Most web servers treat paths as case-sensitive, so `/Blog/Bread` and `/blog/bread` can be two different addresses. Mixing cases invites broken links and duplicate pages. Keep slugs lowercase unless your platform has a specific reason not to. The [Slug Generator](/online-tool/text-tools/slug-generator) lowercases by default; untick **Lowercase** only when you need to keep the original capitals, for example for a file name.

## 2. Are words separated by hyphens?

Use hyphens for web pages. Google's own [URL structure guidance](https://developers.google.com/search/docs/crawling-indexing/url-structure) recommends hyphens over underscores, because a hyphen is read as a word separator. Underscores are fine for file names, database keys and code identifiers, which is why the tool offers both under **Separator**.

With the hyphen separator, underscores in your input count as punctuation: `hello_world test` becomes `hello-world-test`.

## 3. Have accents and special letters been converted?

Plain ASCII slugs are the easiest to type, share and read in every app. Accented letters are reduced to their base letter, and letters that have no accent to strip are spelled out:

| Title | Slug |
| --- | --- |
| 10 Tips for Crème Brûlée & Straße Food! | `10-tips-for-creme-brulee-strasse-food` |
| Ærøskøbing: A Weekend in Łódź | `aeroskobing-a-weekend-in-lodz` |
| São Paulo – Guia Rápido | `sao-paulo-guia-rapido` |

Letters from other scripts, such as Cyrillic or Chinese, are kept as they are: `Привет мир` becomes `привет-мир`. Browsers display them fine, but some apps show them percent-encoded as long `%D0%BF…` strings, so consider a transliterated slug if links get shared in plain text.

## 4. Did punctuation disappear cleanly?

Punctuation, symbols and emoji are dropped, and runs of them collapse into a single separator, so `50% Off — Today Only!!!` gives `50-off-today-only`. Apostrophes are removed rather than replaced, so `Why Don't Cats Like Water?` becomes `why-dont-cats-like-water` instead of the awkward `why-don-t-cats…`.

Watch for titles where the symbols carry the meaning:

- `C++ vs C#: Which Should You Learn?` becomes `c-vs-c-which-should-you-learn`. Rewrite it as `cpp-vs-csharp-which-to-learn` by hand.
- `Q&A: Rock & Roll` becomes `q-a-rock-roll`. Spelling out "and" in the title first gives a clearer result.

## 5. Is it short enough?

There's no hard limit, but shorter slugs are easier to read in a search result and less likely to be cut off in a preview. A common target is three to six meaningful words, and many sites cap slugs at 50–60 characters.

Take `How to Make Sourdough Bread at Home in 2026 Without a Mixer`:

| Settings | Slug | Length |
| --- | --- | --- |
| Defaults | `how-to-make-sourdough-bread-at-home-in-2026-without-a-mixer` | 59 |
| Max length 40 | `how-to-make-sourdough-bread-at-home-in` | 38 |
| Remove stop words | `how-make-sourdough-bread-home-2026-without-mixer` | 48 |
| Both | `how-make-sourdough-bread-home-2026` | 34 |

**Max length (optional)** cuts at the last whole word that fits, so you never get a half word at the end. The exception is a single word longer than the limit, which is cut mid-word. Notice that a length cap alone dropped the most specific words ("2026", "without", "mixer") and kept the filler. Removing stop words first usually gives a better short slug.

## 6. Did removing stop words change the meaning?

**Remove stop words (a, the, and…)** drops a fixed list of common English words: a, an, and, are, as, at, be, but, by, for, from, has, have, in, into, is, it, its, of, on, or, that, the, this, to, was, were, will and with. That usually helps, but read the result:

- `The Lord of the Rings` becomes `lord-rings`.
- `To Be or Not to Be` becomes just `not`.

When the small words are part of a name or phrase, keep them. If every word in a title is a stop word, the tool keeps the original words instead of returning nothing.

## 7. Will it ever need to change?

Once a page is published and linked, changing its slug breaks every bookmark, backlink and shared post unless you add a 301 redirect from the old URL to the new one. Get the slug right before launch, and if you must change it later, set up the redirect the same day.

## How do I generate slugs for many titles at once?

1. Paste your titles into **Titles (one per line)**. Use **Load sample** to see an example.
2. Choose a **Separator**, set an optional **Max length**, and tick **Remove stop words** if you want shorter slugs.
3. The **URL slugs** box fills in line by line as you type. A blank line stays blank, and a line that is only punctuation produces an empty slug, so the output lines up with your input. That makes it easy to paste the result back into a spreadsheet column.
4. Copy or download the list, then review the slugs that flagged items on this checklist.

The conversion happens in your browser, so unpublished titles stay on your device. If you also need to encode a full URL with query parameters, use the [URL Encoder](/online-tool/developer-tools/url-encoder); a slug is only the path segment.

## FAQ

### Should the slug match the page title exactly?

No. The title can be long and descriptive, while the slug should keep only the words that identify the topic. "The Complete Beginner's Guide to Growing Tomatoes on a Balcony" can live happily at `growing-tomatoes-on-a-balcony`.

### Do numbers belong in slugs?

They're fine when they're part of the topic, like `iso-8601` or `ipv6-basics`. Avoid list counts such as `10-tips` if you might later add an eleventh tip, since the slug then stops matching the content.

Got a batch of titles to convert? Paste them into the [Slug Generator](/online-tool/text-tools/slug-generator) and run through the checklist.
