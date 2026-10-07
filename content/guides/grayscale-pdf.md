---
slug: how-pdf-grayscale-conversion-works-three-modes
tool: grayscale-pdf
title: How PDF Grayscale Conversion Works, and Which Mode to Pick
description: Grayscale, black & white or scanned look? What each mode does to text, colors and file size, with the math that turns red, orange and yellow into gray.
tags: [PDF, Grayscale, Printing, Explainer]
---

There are two fundamentally different ways to take the color out of a PDF. One rewrites the color values stored inside the file, so text stays sharp, selectable and searchable. The other draws every page as a picture and processes the pixels, which gives you pure black and white or a scanned appearance but turns text into an image. Emojar's Grayscale mode does the first; Black & white and Scanned look do the second.

## How does a PDF store color in the first place?

Each page holds a content stream, a list of drawing instructions, and color is set by short commands placed before the text or shape they apply to. For example, `1 0 0 rg` means "fill with red" (red, green and blue values from 0 to 1), and `0 0 0 1 k` means "fill with 100% black ink" in CMYK. Photos and logos are stored separately as image objects, each with its own color space.

So color can change without touching the text: swap the command in front of the letters and they're drawn in gray.

## What exactly does Grayscale mode change?

It replaces every color command with a gray one, using the standard luma weighting:

gray = 0.299 × red + 0.587 × green + 0.114 × blue

CMYK colors are converted to RGB first, then weighted the same way. Here's what that does to common colors, where 0 is black and 1 is white:

| Original color          | Gray value | Prints as              |
| ----------------------- | ---------- | ---------------------- |
| Pure blue (0, 0, 1)     | 0.114      | Nearly black           |
| Pure red (1, 0, 0)      | 0.299      | Dark gray              |
| Pure green (0, 1, 0)    | 0.587      | Mid gray               |
| Orange (1, 0.5, 0)      | 0.594      | Mid gray, same as green |
| Yellow (1, 1, 0)        | 0.886      | Very pale gray         |

Two lessons follow. **Different colors can collide**: an orange and a green chart line end up within 1% of each other, so a color-coded legend stops working. And **yellow highlighting almost disappears** on paper. Check such pages before printing.

Images are converted too: JPEG photos are decoded, grayed and re-encoded by your browser, losslessly compressed images are converted pixel by pixel, and palette images get a gray palette. Form fields, stamps and highlights are included.

## Why are some pages flattened anyway?

A few PDF features can't be rewritten exactly: color gradients (shadings), spot colors (named inks such as a Pantone brand color), pattern fills, CMYK JPEGs and some unusual image encodings. Rather than guess, the tool flattens only the affected pages: it renders that page at 200 DPI, grays the pixels and swaps it in as an image, at the same page size.

The result names them, for example "Text kept on 11 of 12 pages · page 1 flattened (gradient (shading))", typical for a glossy cover. Every other page keeps its selectable text.

## How do Black & white and Scanned look work?

Both render each page as an image at the **Resolution** you choose: 150 DPI (smaller file), 200 DPI (recommended, fine for body text) or 300 DPI (sharpest, for small print). Then they process the pixels:

- **Black & white** grays every pixel and sets each one to pure black or pure white. With **Automatic threshold** on, the cutoff is chosen per page by Otsu's method, which picks the brightness that best separates "ink" from "paper" on that page. Turn it off to set **Threshold (higher = darker)** yourself, from 40 to 240. Pages are stored as PNG, so edges stay clean.
- **Scanned look** adds a touch of contrast, a faint warm paper tone and grain (the **Grain** slider, 0–100%). **Slightly tilted pages** rotates each page by up to about 1.2 degrees, with a little softening, and the same page always gets the same tilt. **Black & white scan** combines the effect with a black-and-white threshold, like an office copier. Pages are stored as JPEG.

A simplified example of the threshold at work: a page with white paper, black text and a gray "RECEIVED" stamp at brightness 150 out of 255. The automatic threshold lands at 150, so the stamp turns solid black. To drop the stamp instead, set a manual threshold of 120: anything brighter, stamp included, becomes white.

## Which mode should you use?

| Goal                                              | Mode                    |
| ------------------------------------------------- | ----------------------- |
| Save color ink, keep the file searchable          | Grayscale               |
| A portal says "black and white only"              | Grayscale, or Black & white if it rejects gray |
| Fax, photocopy or the smallest legible scan       | Black & white           |
| A document that should look printed and scanned   | Scanned look            |

Use the scanned look only for documents you're entitled to submit. It changes how a file looks, not what it says or who signed it.

## Step by step

1. Open [Grayscale PDF](/online-tool/pdf-tools/grayscale-pdf) and choose a PDF.
2. Pick **Grayscale**, **Black & white** or **Scanned look**.
3. For the image-based modes, choose a resolution and the threshold or effect options.
4. Click **Convert to grayscale**, **Convert to black & white** or **Make it look scanned**, then download. Everything runs in your browser.

Password-protected files need the password removed first, for example with [Unlock PDF](/online-tool/pdf-tools/unlock-pdf).

## FAQ

### Does Grayscale mode make the file smaller?

Sometimes slightly, because gray images need one color channel instead of three, but text-heavy files barely change. For real savings on scans, use [Compress PDF](/online-tool/pdf-tools/compress-pdf).

### Why does my black text look dark gray instead of black?

Many templates set body text in a very dark color rather than pure black. A dark slate such as #1F2937 converts to a gray value of about 0.15, which prints noticeably lighter than true black. If you need solid black, use Black & white mode.

See which pages keep their text in [Grayscale PDF](/online-tool/pdf-tools/grayscale-pdf).
