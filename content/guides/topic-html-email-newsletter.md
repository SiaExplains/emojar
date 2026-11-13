---
slug: build-an-html-email-newsletter-links-and-images
title: "Build an HTML Email Newsletter: Filler Text, Links and Images"
description: Mock up a hand-coded newsletter with placeholder text, build tracking links that survive & and é, escape them for HTML and pull out embedded images.
tags: [Email, HTML, Marketing, How-to]
---

Building an HTML email newsletter by hand comes down to four small jobs: placeholder text while the layout is still rough, campaign links with percent-encoded values, those links escaped so they are valid inside `href="…"`, and any images that arrived as Base64 turned back into real files. A free browser tool covers each one. All five tools below run in your browser, so the draft, the links and the images stay on your device.

The example is a small bookshop café sending its monthly newsletter. This month's campaign is called "Autumn Sale & Café Night", and the name has two characters that break links: an ampersand and an accented é.

## How do you fill the layout before the copy is ready?

The template usually exists before the words do: a header, a hero block, two short stories and a footer. To check spacing and line length now, open the [Lorem Ipsum generator](/online-tool/text-tools/lorem-ipsum-generator), set **Amount** to 2, pick **Paragraphs** as the **Unit** and press **Generate**.

**Copy as HTML** wraps each paragraph in `<p>` tags, so you can paste it straight into a table cell of the template. For a headline or a button, switch the unit to **Words** and ask for 5 or 6, which is roughly the length of a subject line or a call to action. Leave **Start with “Lorem ipsum…”** ticked for the classic opening, or untick it so each block starts differently and you can tell them apart in a test send.

Amount accepts anything from 1 to 500. Swap out every placeholder before the real send, because once the email has gone out you can't edit it.

## How do you put "Autumn Sale & Café Night" into a tracking link?

Campaign tags such as `utm_campaign` go in the query string, where a raw `&` starts a new parameter. Paste only the value into the [URL Encoder](/online-tool/developer-tools/url-encoder) with **Mode** set to **Encode everything (encodeURIComponent)**:

```
Autumn%20Sale%20%26%20Caf%C3%A9%20Night
```

The space becomes `%20`, the ampersand becomes `%26` and the é becomes the two bytes `%C3%A9`. Add that to the rest of the link:

```
https://example.com/shop?utm_source=newsletter&utm_medium=email&utm_campaign=Autumn%20Sale%20%26%20Caf%C3%A9%20Night
```

The other mode, **Keep URL structure (encodeURI)**, is for a whole URL whose `:` `/` `?` and `&` must stay as they are. If you run the unencoded full link through it, you get `utm_campaign=Autumn%20Sale%20&%20Caf%C3%A9%20Night`. The ampersand survives, so analytics would record the campaign as "Autumn Sale " followed by a stray parameter. Encode each value on its own with the first mode, then join them.

## Why do the ampersands change inside the HTML?

That link is a correct URL, but it isn't correct HTML yet. Inside an attribute, `&` starts a character reference, and the valid way to write a literal ampersand there is `&amp;`. Paste the finished link into the [HTML Entity Encoder / Decoder](/online-tool/developer-tools/html-entity-encoder) with **Mode** on **Encode** and the default **Only & < > " ' (safe HTML)**:

```
https://example.com/shop?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=Autumn%20Sale%20%26%20Caf%C3%A9%20Night
```

That version goes inside `href="…"`. The `%26` in the campaign value is untouched, since only a literal `&` gets escaped.

The same tool helps with body text if your sending system garbles UTF-8. Here is `Café Night — 20% off & free “gift”` through each setting:

| Encode setting                       | Output                                                             |
| ------------------------------------ | ------------------------------------------------------------------ |
| `Only & < > " ' (safe HTML)`         | `Café Night — 20% off &amp; free “gift”`                           |
| `Also non-ASCII, named (&eacute;)`   | `Caf&eacute; Night &mdash; 20% off &amp; free &ldquo;gift&rdquo;`  |
| `Also non-ASCII, decimal (&#233;)`   | `Caf&#233; Night &#8212; 20% off &amp; free &#8220;gift&#8221;`    |
| `Also non-ASCII, hex (&#xE9;)`       | `Caf&#xE9; Night &#x2014; 20% off &amp; free &#x201C;gift&#x201D;` |

If your template is sent as UTF-8, the first row is enough. Of the other three, the named row is the easiest to read when you come back to edit the HTML. Switch **Mode** to **Decode** to turn a block full of `&nbsp;` and `&#39;` from an old template back into plain text.

## What does a link in the test email actually point to?

Send yourself a test and copy a link from it. Email platforms often wrap links in a redirect and squeeze your original URL into one parameter:

```
https%3A%2F%2Fexample.com%2Fshop%3Futm_source%3Dnewsletter%26utm_campaign%3DAutumn+Sale+%26+Caf%C3%A9+Night
```

Paste that part into the [URL Decoder](/online-tool/developer-tools/url-decoder). With **Treat “+” as space** ticked, which is the default, you get:

```
https://example.com/shop?utm_source=newsletter&utm_campaign=Autumn Sale & Café Night
```

The campaign name arrived whole. Untick the box and the plus signs stay, giving `Autumn+Sale+&+Café+Night`. You'd want that when a value really contains a `+`, such as a phone number. If the decoder reports that a `%` is not followed by two hex digits, the string was cut off or contains plain text like "50%off", so copy it again from the source.

## How do you get an embedded image out of the template?

Templates exported from some design tools carry images inline as data URIs, like `src="data:image/png;base64,iVBORw0KGgo…"`. Many email apps won't display them and they make the message heavier, so you'll want the logo back as a normal file you can host.

Copy everything inside the quotes and paste it into [Base64 to Image](/online-tool/image-tools/base64-to-image). It strips the `data:` prefix and any line breaks, decodes the rest, and reads the first bytes to work out the format, so a bare Base64 string without the prefix works too. You get a preview on a checkerboard, which shows transparency, a line such as **Detected: PNG · 68 B**, and a **Download .png** button. The 68-byte figure is what the 92-character Base64 for a 1×1 transparent PNG decodes to.

It recognises PNG, JPG, GIF, WebP, BMP, ICO and SVG. If it says the data is not an image, the string was probably truncated when you copied it.

## What's a sensible order for the whole job?

1. Lay out the template with placeholder paragraphs and short word runs.
2. Encode each campaign value, then assemble each link.
3. Escape each finished link for HTML and paste it into `href`.
4. Extract any embedded images, host them, and swap the data URIs for normal URLs.
5. Replace the filler text with the real copy.
6. Send a test, then decode a link from it to check the campaign name.

## FAQ

### Which URL Encoder mode should I use for a UTM value?

Encode everything (encodeURIComponent). It turns `&`, `=`, `?` and `/` into percent codes, which a single parameter value needs. Keep URL structure is for a full address you want to stay readable.

### Do I have to escape every & in an href?

Yes, `&amp;` is the correct form in HTML, and browsers and email apps read it back as `&` when someone clicks the link. The HTML Entity Encoder's default setting does this and leaves the rest of the URL alone.

### Is my newsletter draft uploaded anywhere?

No. All five tools here process text and images in your browser.

### Why won't my Base64 string decode?

Usually part of it is missing, or it has characters that aren't Base64. Copy the full value between the quotes, including any `=` padding at the end.

Find more converters and formatters in the [developer tools](/online-tool/developer-tools), [text tools](/online-tool/text-tools) and [image tools](/online-tool/image-tools) collections.
