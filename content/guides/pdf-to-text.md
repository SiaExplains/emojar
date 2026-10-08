---
slug: pdf-text-extraction-problems-and-fixes
tool: pdf-to-text
title: Why PDF Text Extraction Comes Out Empty or Jumbled (and Fixes)
description: Extracted text from a PDF and got nothing, mixed-up columns or gibberish? Here's what causes each problem and how to clean up the result quickly.
tags: [PDF, Text, Troubleshooting]
---

If extracting text from a PDF gives you nothing, the PDF is almost certainly a scan: a picture of text with no actual characters inside. Plain extraction can't read it, but OCR can, and PDF to Text now offers OCR for those pages right in your browser. If you get text but it's jumbled, the cause is usually layout: PDFs store words at positions on a page, not as flowing paragraphs, so columns, tables and headers can come out in an unexpected order. Both are properties of the file, not errors in the tool, and most can be worked around.

Here's a symptom-by-symptom guide.

## How does PDF text extraction work?

A PDF with real text contains instructions like "draw these characters, in this font, at this position." An extractor reads those characters back out, page by page, and adds a line break wherever the PDF marks the end of a line. It doesn't see the page the way you do; it only sees the stored text and its order.

That explains nearly every problem below.

## Symptom: The result is empty

No **Extracted text** box appears. Instead, a **Scanned pages (OCR)** panel tells you the PDF has no text layer and is probably a scan.

**Cause:** the pages are images, from a scanner, a phone scanning app, or a "print to PDF" of a photo. There are no stored characters to read back out.

**Quick check:** open the PDF in any viewer and try to select a word. If you can only draw a box around the whole page, it's an image.

**Fix:** pick the document's language under **Text language** and press the **Read N pages with OCR** button in that panel. Optical character recognition looks at the page image and works out which letters are drawn on it. The next section explains how that works and how to get cleaner results.

**Partial version:** if only _some_ pages come out empty, the PDF mixes typed pages with scanned ones, common in signed contracts where the signature page was scanned back in. The panel then says something like "2 of 9 pages have no text layer," and the OCR button reads only those pages, leaving the typed pages as they were.

## Symptom: Two columns are mixed together

**Cause:** the text was stored in drawing order, which doesn't always match reading order. In a two-column article, you may get line 1 of the left column, then line 1 of the right column, and so on.

**Fix:** for short passages, copy the text and fix it by hand. For longer documents, check whether the publisher offers a single-column or HTML version. Extraction can't reliably reconstruct reading order that the file doesn't store.

## Symptom: Lines break in the middle of sentences

**Cause:** every visual line in the PDF ends with a line break, so a paragraph becomes a stack of short lines. Hyphenated words may also be split, like `extrac-` / `tion`.

**Fix:** paste the text into the [Find and Replace](/online-tool/text-tools/find-and-replace) tool and tick **Regular expression**. First find `-\n` and replace it with nothing to rejoin hyphenated words. Then find `\n` and replace it with a single space to turn the stack of lines into running text. That second step also joins separate paragraphs, so do it on one passage at a time if paragraph breaks matter.

## Symptom: Text comes out as gibberish symbols

**Cause:** some PDFs use fonts whose characters aren't mapped back to standard Unicode letters. The page _displays_ correctly because the font draws the right shapes, but the stored codes are meaningless outside that font. This is common in older PDFs and some print-oriented exports.

**Fix:** treat it like a scan. Tick **OCR every page** in the OCR panel, so the tool reads the page images instead of the broken text layer. No text extractor can recover meaning that isn't in the file, but OCR doesn't need it: it reads the shapes you see.

## Symptom: Words run together or letters are spaced out

**Cause:** PDFs often position words, or even individual letters, separately, without storing an actual space character. Extractors infer spacing, and tightly kerned or justified text can confuse them, giving `thequickbrown` or `t h e`.

**Fix:** usually only a few spots are affected; fix them by hand.

## Symptom: Tables lose their structure

**Cause:** a PDF table is just text placed in a grid. There are no stored rows and columns. Cells come out separated by spaces and line breaks.

**Fix:** for a small table, retype it. For data you need regularly, ask for the source spreadsheet.

## Symptom: The same header appears on every page

**Cause:** running headers, footers and page numbers are real text on each page, so they're extracted too.

**Fix:** use Find and Replace to remove the repeated line in one go.

## How does OCR read a scanned page?

When you start OCR, the tool first renders each target page to an image at 200 DPI, a good balance between accuracy and speed. It then hands the images to Tesseract, an open-source OCR engine originally developed at HP and later maintained by Google. Modern Tesseract uses an LSTM neural network that reads a whole line of text at once, rather than guessing one isolated letter at a time, which helps with joined or slightly damaged characters.

The engine needs a trained model for each language, so the language you pick matters. The list covers English, German, French, Spanish, Italian, Portuguese, Dutch, Turkish, Persian, Arabic, Russian, Chinese (simplified), Japanese and Hindi. On first use, the browser downloads the engine and that language's data, a few MB, so you need an internet connection the first time. The PDF itself is never sent anywhere; rendering and recognition both happen on your device.

OCR takes seconds per page, so a single run reads at most 60 pages. For a longer scan, split the PDF and run the parts one after another. You can also press **Stop after this page** to end a run early and keep what has been read so far.

### Tips for better OCR accuracy

- **Choose the right language.** An English model reading German text will mangle umlauts and ß. Mixed-language documents work best with the main language selected.
- **Start from a clean scan.** Straight, high-contrast pages at 300 DPI or more give far better results than a tilted phone photo in dim light. If the source is poor, rescanning beats any cleanup afterward.
- **Expect to proofread.** Even good OCR swaps look-alike characters, such as `l`, `1` and `I`, or `rn` and `m`. Numbers in invoices and contracts deserve a second look.
- **Tables and handwriting are hard.** Tesseract is built for printed text. Handwriting, stamps and dense tables often come out incomplete.

If a page produces nothing at all, the tool says "OCR found no text," and the usual fixes are the right language and a sharper scan. For a single photo or screenshot rather than a PDF, [Image to Text](/online-tool/image-tools/image-to-text) uses the same engine.

## How to extract text from a PDF

1. Open [PDF to Text](/online-tool/pdf-tools/pdf-to-text) and choose a PDF. Extraction starts immediately, with a progress bar while each page is read.
2. Review the text in the **Extracted text** box. Each page starts with a marker like `--- Page 3 ---`, which makes it easy to find where something came from.
3. If some or all pages are scanned, use the **Scanned pages (OCR)** panel: choose the language and press the OCR button. Pages read this way get a marker like `--- Page 3 (OCR) ---`, and the green summary line counts how many were read with OCR.
4. Use the copy button, or download the text as a `.txt` file named after your PDF.

The text is read in your browser and the PDF never leaves your device, which matters for contracts, statements and medical letters.

## FAQ

### Can I extract text from a password-protected PDF?

No. You'll be asked to remove the password first: open the file with it and save an unprotected copy.

### Why are the page markers there, and can I remove them?

They help you trace text back to its page, and the `(OCR)` tag shows which pages were recognized rather than extracted. To remove them all at once, use Find and Replace with **Regular expression** ticked: find `--- Page \d+( \(OCR\))? ---` and replace it with nothing.

### Can I read a scanned PDF offline?

After the first OCR run, the engine and language data are usually cached by your browser, but the very first run for each language needs an internet connection to download them.

### Will extraction keep bold, italics or headings?

No. The output is plain text. Formatting, images and layout aren't included.

Have a PDF, typed or scanned? Pull the words out with [PDF to Text](/online-tool/pdf-tools/pdf-to-text).
