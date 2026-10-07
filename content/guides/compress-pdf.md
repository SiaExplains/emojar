---
slug: lossless-vs-strong-pdf-compression
tool: compress-pdf
title: Lossless vs Strong PDF Compression – Which One Do You Need?
description: Lossless keeps text searchable; Strong turns pages into images and can shrink scans dramatically. How to choose a mode, DPI and quality for your PDF.
tags: [PDF, Compression, Guide]
---

Use **Lossless** compression for PDFs created on a computer (exported from Word, Google Docs or design software) when you need text to stay selectable, searchable and sharp. Use **Strong** compression for **scanned documents and photo-heavy PDFs** where file size matters more than selectable text: it redraws each page as a JPG image at the resolution and quality you choose, which can cut scans down dramatically. If you're unsure, try Lossless first; it can't hurt the document.

Here's how to decide, with the numbers behind it.

## Where does a PDF's size actually come from?

A PDF is a container. Text is stored as characters plus font data, which is compact. Vector graphics (charts, lines, logos) are stored as drawing instructions, also compact. **Images** are stored as image data, and that's where megabytes come from. A 40-page text report might be a few hundred kilobytes; a 10-page scan, where every page _is_ an image, can easily be many megabytes.

That's why the two modes behave so differently.

## What does Lossless mode do?

It rewrites the PDF's internal structure more efficiently, packing many small internal objects into compressed "object streams." Nothing you can see changes: text, fonts, links, images and page sizes are all kept as they are.

The savings depend on how the file was made. PDFs from some office tools have a loose structure and shrink noticeably; PDFs that were already optimized barely change. Lossless mode doesn't recompress the images inside, so it won't do much for a scan.

## What does Strong mode do?

It renders every page to a picture at the resolution you choose, saves it as a JPG at the quality you choose, and builds a new PDF from those images at the original page size. The output looks like the original but is now made of images.

The trade-off is significant:

- **Text is no longer selectable or searchable.** You can't copy from it, and search inside it won't work.
- **Links and form fields stop working**, since they're no longer part of the page.
- **Vector sharpness becomes resolution-dependent.** Zoom in far enough and you'll see pixels.

For a scan, none of that matters: it was already images. For a digital report, it usually matters a lot.

## How do DPI and quality affect the result?

Resolution sets how many pixels each page gets. For a US Letter page (8.5 × 11 inches):

| Resolution        | Page in pixels | Pixels vs. 110 DPI | Good for                         |
| ----------------- | -------------- | ------------------ | -------------------------------- |
| 72 DPI            | 612 × 792      | about 0.4×         | Smallest file, quick previews    |
| 110 DPI (default) | 935 × 1210     | 1×                 | Reading on screen                |
| 150 DPI           | 1275 × 1650    | about 1.9×         | Comfortable zooming, small print |
| 200 DPI           | 1700 × 2200    | about 3.3×         | Printing                         |

Image quality (20–90%, default 60%) controls JPG compression on top of that. For text scans, 50–70% is usually clean; drop lower and letters get fuzzy halos.

Rule of thumb: **lower the DPI before you lower the quality.** Fewer pixels at decent quality look better than many pixels at poor quality.

## Decision table

| Your PDF                                            | Mode                                        | Suggested settings              |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------- |
| Exported from a word processor, mostly text         | Lossless                                    | —                               |
| Contract you or others need to search or copy from  | Lossless                                    | —                               |
| Phone or scanner scan of paper documents            | Strong                                      | 110–150 DPI, 60%                |
| Scan that will be printed again                     | Strong                                      | 200 DPI, 70%                    |
| Brochure with big photos, text must stay selectable | Lossless, or rebuild it with smaller images | —                               |
| Fillable form                                       | Lossless                                    | Strong would flatten the fields |

## How to compress a PDF step by step

1. Open [Compress PDF](/online-tool/pdf-tools/compress-pdf) and choose a file. Its current size is shown next to the name.
2. Under **Compression**, choose **Lossless — keeps text selectable** or **Strong — converts pages to images (best for scans)**.
3. For Strong, pick a **Resolution** (72, 110, 150 or 200 DPI) and set **Image quality**.
4. Click **Compress PDF**. In Strong mode, a progress bar shows pages being rendered.
5. Compare the original and new sizes in the result, then download.

If the result wouldn't be smaller, for example a text-only PDF in Strong mode, where crisp vector text is far more compact than a picture of it, the tool keeps your original and says so. The PDF is processed entirely in your browser.

## Tips

- **Keep the original.** Especially after Strong mode, since you can't get the text layer back.
- **Compress parts, then merge.** In a bundle with both a typed letter and scans, compress only the scans in Strong mode, then combine everything with [Merge PDF](/online-tool/pdf-tools/merge-pdf). The letter stays searchable.
- **Shrink photos before they go into a PDF.** If you're building a PDF from photos, run them through the [Image Compressor](/online-tool/image-tools/image-compressor) first.

## FAQ

### Why is the Strong result still large?

Probably a high DPI on many pages. Each step up multiplies the pixel count; try 110 DPI before lowering quality.

### Can I make a scanned PDF searchable again after Strong mode?

Not with this tool. Searchable scans need OCR (optical character recognition), which recognizes letters in images. Run OCR on the original, not the compressed copy.

### Does Lossless mode change how the PDF prints?

No. It reorganizes how the file is stored, not what's on the pages.

Pick your mode from the table and try it in [Compress PDF](/online-tool/pdf-tools/compress-pdf).
