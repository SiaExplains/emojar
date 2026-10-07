---
slug: html-entities-named-vs-decimal-vs-hex-which-to-use
tool: html-entity-encoder
title: "Named, Decimal or Hex HTML Entities: Which Should You Use?"
description: Most pages only need five characters escaped. Here's when named, decimal or hex entities are worth it, with side-by-side output for the same text.
tags: [HTML, Encoding, Web Development]
---

For almost every modern web page, you only need to encode five characters: `&`, `<`, `>`, `"` and `'`. Everything else, including accented letters, curly quotes and emoji, can stay as-is on a page served as UTF-8. Named, decimal and hex entities are for the cases where the text has to survive a system that doesn't handle UTF-8 reliably, and between those three, the choice mostly comes down to coverage and readability.

## What does each option actually produce?

The HTML Entity Encoder has a **Mode** setting (Encode or Decode) and, for encoding, an **Encode** setting with four choices. Here's the tool's sample text run through each:

Input: `<p>Café “Crème” & Co. — 5 > 3 ©</p>`

| Encode option | Output |
| --- | --- |
| `Only & < > " ' (safe HTML)` | `&lt;p&gt;Café “Crème” &amp; Co. — 5 &gt; 3 ©&lt;/p&gt;` |
| `Also non-ASCII, named (&eacute;)` | `&lt;p&gt;Caf&eacute; &ldquo;Cr&egrave;me&rdquo; &amp; Co. &mdash; 5 &gt; 3 &copy;&lt;/p&gt;` |
| `Also non-ASCII, decimal (&#233;)` | `&lt;p&gt;Caf&#233; &#8220;Cr&#232;me&#8221; &amp; Co. &#8212; 5 &gt; 3 &#169;&lt;/p&gt;` |
| `Also non-ASCII, hex (&#xE9;)` | `&lt;p&gt;Caf&#xE9; &#x201C;Cr&#xE8;me&#x201D; &amp; Co. &#x2014; 5 &gt; 3 &#xA9;&lt;/p&gt;` |

All four render identically in a browser; only the raw source differs.

## Which option should you pick?

| Situation | Best choice | Why |
| --- | --- | --- |
| Showing user text or a code sample on a UTF-8 page | Minimal | Escapes what can break markup, keeps everything else readable |
| Putting text inside a quoted attribute | Minimal | Quotes are escaped, so the value can't end early |
| Email templates or legacy systems that mangle UTF-8 | Named | Pure ASCII output that's still fairly readable |
| Characters with no entity name, like emoji | Decimal or hex | Every Unicode character has a number |
| Matching code points in docs or specs | Hex | `&#xE9;` lines up with the U+00E9 notation |

**Minimal is the default for a reason.** The five characters it touches are the only ones that change how HTML is parsed: `&` starts an entity, `<` and `>` open and close tags, and the two quotes end attribute values. Encoding them is what stops a comment like `<b>hi</b>` from turning bold, or a name like `Tom's` from cutting an attribute short. The single quote becomes `&#39;` rather than `&apos;`, which is the safer form for older HTML parsers.

**Named entities** are the most readable ASCII option, but only a limited set of characters have names. When a character has none (an emoji, for example), the tool falls back to a decimal reference. Encoding `20 € — naïve 😀` in named mode gives `20 &euro; &mdash; na&iuml;ve &#128512;`.

**Decimal and hex** cover every Unicode character, so they're the safe choice when the input is unpredictable. They're equivalent; the same grinning face is `&#128512;` in decimal and `&#x1F600;` in hex. Pick hex if you're cross-referencing a Unicode chart, which lists code points in hexadecimal.

## How do you use the encoder?

1. Open the [HTML Entity Encoder / Decoder](/online-tool/developer-tools/html-entity-encoder) and paste your text into **Text or HTML**.
2. Leave **Mode** on Encode, then choose an option in the **Encode** dropdown.
3. The **Result** updates as you type. Copy it, or download it as a text file.

To go the other way, switch **Mode** to Decode. Decoding understands named, decimal and hex references, so `&eacute;`, `&#233;` and `&#xE9;` all become `é`. Markup in the input stays as literal text; decoding `a &lt;script&gt; b` gives you the characters `a <script> b`, and nothing is rendered or run.

## Why do I see `&amp;amp;` in my output?

Double encoding is the most common entity bug. It happens when text that's already encoded gets encoded a second time: `&amp;` becomes `&amp;amp;`, and the page shows the literal text `&amp;` instead of `&`.

The usual causes:

- A template engine auto-escapes output, and the data was also escaped before it was saved.
- Text was copied from a page's source view rather than from the rendered page.
- A CMS field encodes input, and a theme encodes it again on display.

To repair a string, decode it once and check the result. Decode works one layer at a time, so `AT&amp;amp;T` decodes to `AT&amp;T`, and a second pass gives `AT&T`. Then fix the pipeline so escaping happens in one place only, ideally at output time in your template.

## When is entity encoding not enough?

Entity encoding protects text placed between tags and inside quoted attribute values. It does not make a value safe in every context:

- **URLs in `href` or `src`.** A value like `javascript:alert(1)` contains none of the five characters, so encoding leaves it untouched. Validate the scheme and use URL encoding for parameters.
- **Inline JavaScript.** Inside a `<script>` block, entities aren't decoded, so you need JavaScript string escaping instead.

For JavaScript, JSON and other string literals, the [String Escape / Unescape](/online-tool/developer-tools/string-escape) tool handles each language's rules. And wherever your framework offers built-in escaping (React, Django, Rails and most template engines do), prefer it over hand-encoding.

## FAQ

### Is `&nbsp;` the same as a normal space?

No. It decodes to a non-breaking space (U+00A0), which looks like a space but prevents a line break and isn't collapsed with neighboring spaces. Searching or comparing text that contains it can fail in surprising ways.

### Do I need the semicolon at the end of an entity?

Always include it. Browsers forgive a missing semicolon on a handful of legacy names like `&amp`, but numeric and most named references need it to be read reliably.

Try the four styles side by side with the [HTML Entity Encoder / Decoder](/online-tool/developer-tools/html-entity-encoder).
