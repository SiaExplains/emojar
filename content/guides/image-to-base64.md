---
slug: when-to-inline-images-as-base64-data-uris
tool: image-to-base64
title: When Should You Inline an Image as Base64? A Decision Guide
description: Base64 data URIs save an HTTP request but add a third to the file size and can't be cached separately. When inlining images helps, and when it hurts.
tags: [Web Development, Images, Base64]
---

Inline an image as a Base64 data URI when it's small (a few kilobytes), used in one place, and needs to be available immediately or travel inside a single file, such as an icon in a CSS file, an image in an HTML email template, or a picture embedded in JSON. Don't inline large photos or images reused across many pages: Base64 makes the data about 33% larger and stops the browser from caching the image on its own.

Here's how to make that call with numbers instead of gut feeling.

## What is a data URI?

A data URI puts the file's bytes directly into a URL, defined in [RFC 2397](https://www.rfc-editor.org/rfc/rfc2397). For images it looks like this:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...
```

The part after `base64,` is the image encoded as text. Anywhere you could put an image URL, such as an `<img src>`, a CSS `url()` or a JSON field, you can put this instead, and the browser decodes it without making a network request.

## How much bigger does Base64 make an image?

Base64 turns every 3 bytes into 4 text characters, so the encoded length is 4 × (bytes ÷ 3), rounded up to a multiple of 4.

| Original file | Base64 length  | Added weight |
| ------------- | -------------- | ------------ |
| 600-byte icon | 800 characters | +200 bytes   |
| 6 KB logo     | 8 KB           | +2 KB        |
| 90 KB photo   | 120 KB         | +30 KB       |
| 1.5 MB photo  | 2 MB           | +500 KB      |

For the icon, 200 extra bytes is less than the overhead of a separate request in many setups. For the photo, half a megabyte of extra text in your HTML or CSS is a real cost, and it blocks rendering of everything after it.

## The decision guide

Inline it if **most** of these are true:

- The image is **under roughly 5–10 KB**.
- It's used **on one page or in one component**, not repeated site-wide.
- It must appear **instantly**, with no flash of a missing icon (spinners, critical UI icons).
- It has to live **inside a single file**: a standalone HTML report, an email template, a JSON payload, a test fixture or a CSS file that ships alone.

Keep it as a separate file if **any** of these are true:

- It's a **photo** or anything over about 100 KB. The tool warns you at that size for a reason.
- It's **reused across many pages**. A separate file is downloaded once and cached; an inlined copy is re-downloaded inside every page or stylesheet that contains it.
- It **changes often**. Updating an inlined image means changing and redeploying the code that contains it.
- You need it **lazy-loaded**. Inlined images arrive with the HTML whether or not they're ever scrolled into view.

## Common use cases

- **CSS icons and backgrounds**: a small arrow or checkmark used by one component.
- **HTML email**: some email clients handle embedded images better than remote ones, which may be blocked by default.
- **Single-file deliverables**: an HTML report you'll email to someone, with charts and logos that must not break offline.
- **APIs and JSON**: sending a small avatar or signature as a string field.
- **Tests and demos**: fixtures that don't depend on external files.

## How to convert an image to Base64

1. Open the [Image to Base64](/online-tool/image-tools/image-to-base64) converter and choose an image (PNG, JPG, GIF, WebP, SVG or ICO, up to 20 MB).
2. Check the size line, which shows the original size and the Base64 size side by side, for example `logo.png · 6.0 KB → 8.0 KB as Base64`.
3. Copy the snippet you need:
   - **Data URI**: the full `data:image/...;base64,...` string.
   - **Base64 only**: just the encoded text, for APIs that expect raw Base64.
   - **HTML `<img>`**: a ready-to-paste tag. Fill in a meaningful `alt` text.
   - **CSS background**: a `background-image: url("...")` declaration.

The file is read locally by your browser, so nothing is uploaded.

## Tips before you inline

- **Shrink first.** Every byte you save before encoding saves a third more after it. Run icons and logos through the [Image Compressor](/online-tool/image-tools/image-compressor) or reduce their dimensions first.
- **Consider SVG.** For simple icons, an SVG is often smaller than a PNG and stays sharp at any size.
- **Keep the source file in your repository.** A wall of Base64 is impossible to review or edit; keep the original next to it.
- **Mind the alt text.** Inlining changes where the image comes from, not its accessibility needs.

## FAQ

### Does Base64 make an image load faster?

It removes a network request, which can help for tiny critical images. For anything larger it usually makes pages slower, because the bigger HTML or CSS has to download before the browser can render it.

### Can I turn the Base64 back into an image file?

Yes. Paste it into [Base64 to Image](/online-tool/image-tools/base64-to-image), which detects the format and lets you download the file.

### Is Base64 a form of encryption?

No. It's an encoding anyone can reverse instantly. Don't use it to hide anything.

Have a small icon to inline? Get the data URI and snippets from the [Image to Base64](/online-tool/image-tools/image-to-base64) converter.
