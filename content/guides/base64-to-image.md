---
slug: base64-to-image-not-working-common-fixes
tool: base64-to-image
title: Base64 String Won't Turn Into an Image? Common Causes and Fixes
description: Pasted a Base64 string and got an error or a broken preview? Learn how to spot the image type from the first characters and fix the usual copy-paste mistakes.
tags: [Base64, Images, Troubleshooting]
---

When a Base64 string won't decode into an image, the cause is almost always the text around it, not the image: stray quotes, JSON escape characters, a `url(...)` wrapper, or a string that was cut off when copying. Strip everything except the Base64 characters (with or without the `data:image/...;base64,` prefix), make sure you copied the whole thing, and the decoder can identify the image from its first few bytes. If it still fails, the data may not be an image at all.

Here's how to diagnose it quickly.

## How can you tell what the string contains?

Every image format starts with a fixed "signature" of bytes, and those bytes always produce the same opening characters in Base64. You can often identify a string just by reading its beginning:

| Starts with   | Decodes to                    | Format            |
| ------------- | ----------------------------- | ----------------- |
| `iVBORw0KGgo` | `‰PNG` plus line-ending bytes | PNG               |
| `/9j/`        | `FF D8 FF`                    | JPG               |
| `R0lGOD`      | `GIF8`                        | GIF               |
| `UklGR`       | `RIFF` (WebP container)       | WebP              |
| `Qk`          | `BM`                          | BMP               |
| `AAABAA`      | `00 00 01 00`                 | ICO               |
| `PHN2Z`       | `<svg`                        | SVG               |
| `PD94bWw`     | `<?xml`                       | XML, often an SVG |

The Emojar decoder does the same thing in code: it decodes the text and checks the first bytes, so it works even when the `data:` prefix is missing or wrong. If your string starts with `JVBERi0` (`%PDF-`), it's a PDF; with `UEsDB` (`PK`), a ZIP-based file such as a .docx. Neither is an image, which explains the error.

## Error: "the input contains characters that are not part of Base64"

Valid Base64 uses only `A–Z`, `a–z`, `0–9`, `+`, `/` and `=` padding at the end. The decoder already tolerates a few common variations:

- Line breaks and spaces (common in emails and PEM-style blocks) are removed.
- The URL-safe alphabet, which uses `-` and `_` instead of `+` and `/`, is converted automatically.
- Missing `=` padding is added back.
- A leading `data:...;base64,` prefix is stripped.

What it can't guess is extra text you copied along with the string. Look for:

- **Quotes**: `"iVBORw0..."` copied from JSON or code. Remove the quotes.
- **JSON escapes**: `\/9j\/4AAQ...`. Some JSON encoders write `/` as `\/`. Replace `\/` with `/`.
- **CSS wrappers**: `url("data:image/png;base64,...")`. Remove `url("` and `")`.
- **Trailing punctuation**: a comma or semicolon from the end of a line of code.
- **Non-Base64 data URIs**: `data:image/svg+xml;utf8,<svg ...>` isn't Base64 at all; it's plain or URL-encoded SVG text. Save it directly as an `.svg` file instead.

## Error: "The decoded data is not a recognised image"

The text was valid Base64, but the bytes don't start with any known image signature. Usual causes:

1. **The start is missing.** If you copied from the middle of a long string, the signature is gone. Copy again from the very first character.
2. **It's a different file type.** Check the first characters against the table above.
3. **It was encoded twice.** If the string decodes to text that itself looks like Base64 (for example, it starts with `aVZCT1J3` which is `iVBORw` encoded again), decode it once with the [Base64 Decoder](/online-tool/developer-tools/base64-decoder) and paste the result here.
4. **It's encrypted or compressed.** Some APIs gzip or encrypt payloads before encoding. You'll need to reverse that step first.

## The preview is broken, but there's no error

The signature matched, so the format was detected, but the image data is incomplete. This nearly always means the string was **truncated**: a log line cut at a maximum length, a database column too short, or a chat app that clipped a long message. Compare lengths: a 30 KB image needs about 40,000 Base64 characters. If yours is much shorter, get the full value from the source.

## How to decode Base64 to an image

1. Open [Base64 to Image](/online-tool/image-tools/base64-to-image).
2. Paste the string or full data URI into the **Base64 string or data URI** box. Decoding happens as you paste.
3. Check the preview, shown on a checkerboard so transparency is visible, and the line **Detected: PNG · 24 KB** (or similar).
4. Click the download button, for example **Download .png**. The file is named `image.png`, `image.jpg` and so on, based on the detected format.

Decoding runs in your browser; the data you paste isn't sent anywhere, which matters when the string came from a private API response.

## FAQ

### Can I decode several images at once?

One string at a time. If you have many, decode them one by one, or script it in your own environment.

### Why does the downloaded file have a different extension than I expected?

The extension comes from the actual bytes, not from the `data:` prefix. If a prefix says `image/png` but the bytes are a JPG, you'll get a `.jpg`, which is the correct extension for that data.

### How do I go the other way?

Use [Image to Base64](/online-tool/image-tools/image-to-base64) to turn an image file into a string or data URI with ready-made HTML and CSS snippets.

Paste your string into [Base64 to Image](/online-tool/image-tools/base64-to-image) and let the signature check tell you what's inside.
