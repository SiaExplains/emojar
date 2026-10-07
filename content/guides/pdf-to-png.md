---
slug: pdf-to-png-myths-dpi-quality-file-size
tool: pdf-to-png
title: PDF to PNG – 5 Myths About DPI, Quality and File Size
description: Is 300 DPI always better? Is PNG always bigger than JPG? Is a lossless PNG identical to the PDF? Five common myths about converting PDF pages to PNG.
tags: [PDF, PNG, Myths]
---

Converting a PDF page to PNG draws the page at a fixed resolution and saves it with lossless compression, so text, lines and charts stay sharp with no compression artifacts. The resolution (DPI) you choose decides the pixel size, and therefore both the sharpness and the file size. Pick 150 DPI for most screen uses and 300 DPI for print, and expect PNG to shine on text and diagrams but produce larger files than JPG on photo-heavy pages.

A lot of advice about this is half true. Here are five myths worth correcting.

## Myth 1: "300 DPI is always better"

More DPI means more pixels, and more pixels only help if someone will actually see them. Here's what one A4 page becomes at each setting:

| Resolution | A4 page in pixels | Megapixels |
| ---------- | ----------------- | ---------- |
| 72 DPI     | 595 × 841         | 0.5        |
| 96 DPI     | 793 × 1122        | 0.9        |
| 150 DPI    | 1240 × 1753       | 2.2        |
| 300 DPI    | 2480 × 3507       | 8.7        |

A typical laptop screen is under 2000 pixels tall. A 300 DPI page shown on it is scaled down by more than half, so you pay for 8.7 megapixels and see about two. For slides, chat and web, 150 DPI is usually indistinguishable and a fraction of the size. Save 300 DPI for printing, for fine print you'll zoom into, and for OCR.

## Myth 2: "The DPI number is what makes an image 'web' or 'print' quality"

DPI is only a conversion factor between inches and pixels. Once the PNG exists, what matters is its pixel dimensions. A 1240 × 1753 image looks the same on screen whether you call it "150 DPI" or not. The DPI choice matters at conversion time because it sets how many pixels each inch of the page gets; after that, think in pixels.

So the right question isn't "web or print DPI?" but "how many pixels wide will this be displayed or printed?" Printing at 6 inches wide and 300 pixels per inch needs 1800 pixels; showing it 900 pixels wide on a website needs 900, or 1800 for sharpness on high-density screens.

## Myth 3: "PNG files are always bigger than JPGs"

It depends entirely on the page. PNG compresses by finding repetition, so a page that's mostly white background with black text, simple shapes and flat-colored charts compresses very well, often competitive with a high-quality JPG of the same page, and without JPG's faint smudges around letters.

Pages full of photographs are the opposite: endless subtle color variation that lossless compression can't shrink much. There, PNG files can be several times larger than JPG.

| Page type                                 | Better format                          |
| ----------------------------------------- | -------------------------------------- |
| Text, forms, spreadsheets                 | PNG                                    |
| Diagrams, charts, slides with flat colors | PNG                                    |
| Brochure pages with large photos          | JPG                                    |
| Scanned paper documents                   | JPG usually; scans are photos of paper |

For photo-heavy pages, [PDF to JPG](/online-tool/pdf-tools/pdf-to-jpg) is the better fit.

## Myth 4: "A lossless PNG is identical to the PDF"

Lossless describes how the PNG stores _its_ pixels, not how faithful it is to the PDF. The conversion step itself, turning vector text and shapes into a pixel grid, is where detail is fixed in place. Zoom into a PDF and text stays razor sharp at any magnification; zoom into the PNG and you'll eventually see the pixels.

Also gone: selectable text, search, links and form fields. The PNG is a picture of the page. If you need the words themselves, use [PDF to Text](/online-tool/pdf-tools/pdf-to-text).

## Myth 5: "You have to convert the whole document"

You don't. Converting only the pages you need is faster and saves cleanup. The **Pages** field accepts `all`, single pages (`4`), ranges (`2-6`), open ranges (`10-`) and combinations (`1-3, 7`), plus `odd` and `even`.

## How to convert PDF pages to PNG

1. Open [PDF to PNG](/online-tool/pdf-tools/pdf-to-png) and choose a PDF. Its page count is shown next to the name.
2. In **Pages**, keep `all` or enter the pages you want.
3. Choose a **Resolution**: 72, 96, 150 (recommended) or 300 DPI (print).
4. Click **Convert to PNG**. A progress bar shows each page being rendered.
5. Download the images, named like `slides-page-3.png`, individually or with "Download all".

Rendering uses pdf.js, the PDF engine built into Firefox, running in your browser, so the document stays on your device.

## FAQ

### Why isn't there a quality slider like for JPG?

PNG has no quality setting; it's always lossless. The only lever is resolution, which controls pixel count.

### Which DPI should I use for a slide deck exported as PDF?

Slides are usually 13.33 × 7.5 inches. At 150 DPI that's about 2000 × 1125 pixels, comfortably sharp on most screens.

### Can I convert a scanned PDF?

Yes. A scan renders like any other page. Since it's essentially a photo, JPG will usually give much smaller files with no visible difference.

Choose your pages and resolution in [PDF to PNG](/online-tool/pdf-tools/pdf-to-png) and see the difference for yourself.
