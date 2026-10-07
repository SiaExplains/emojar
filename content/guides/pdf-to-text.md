---
slug: pdf-text-extraction-problems-and-fixes
tool: pdf-to-text
title: Why PDF Text Extraction Comes Out Empty or Jumbled (and Fixes)
description: Extracted text from a PDF and got nothing, mixed-up columns or gibberish? Here's what causes each problem and how to clean up the result quickly.
tags: [PDF, Text, Troubleshooting]
---

If extracting text from a PDF gives you nothing, the PDF is almost certainly a scan: a picture of text with no actual characters inside, which needs OCR rather than extraction. If you get text but it's jumbled, the cause is usually layout: PDFs store words at positions on a page, not as flowing paragraphs, so columns, tables and headers can come out in an unexpected order. Both are properties of the file, not errors in the tool, and most can be worked around.

Here's a symptom-by-symptom guide.

## How does PDF text extraction work?

A PDF with real text contains instructions like "draw these characters, in this font, at this position." An extractor reads those characters back out, page by page, and adds a line break wherever the PDF marks the end of a line. It doesn't see the page the way you do; it only sees the stored text and its order.

That explains nearly every problem below.

## Symptom: The result is empty

You'll see the message _"No text was found. This PDF is probably a scanned image."_

**Cause:** the pages are images, from a scanner, a phone scanning app, or a "print to PDF" of a photo. There are no characters to read.

**Quick check:** open the PDF in any viewer and try to select a word. If you can only draw a box around the whole page, it's an image.

**Fix:** use OCR (optical character recognition) software, which recognizes letters in images. For best OCR results, render the pages at high resolution first, for example with [PDF to JPG](/online-tool/pdf-tools/pdf-to-jpg) at 300 DPI.

**Partial version:** if only _some_ pages come out empty, the PDF mixes typed pages with scanned ones, common in signed contracts where the signature page was scanned back in.

## Symptom: Two columns are mixed together

**Cause:** the text was stored in drawing order, which doesn't always match reading order. In a two-column article, you may get line 1 of the left column, then line 1 of the right column, and so on.

**Fix:** for short passages, copy the text and fix it by hand. For longer documents, check whether the publisher offers a single-column or HTML version. Extraction can't reliably reconstruct reading order that the file doesn't store.

## Symptom: Lines break in the middle of sentences

**Cause:** every visual line in the PDF ends with a line break, so a paragraph becomes a stack of short lines. Hyphenated words may also be split, like `extrac-` / `tion`.

**Fix:** paste the text into the [Find and Replace](/online-tool/text-tools/find-and-replace) tool and tick **Regular expression**. First find `-\n` and replace it with nothing to rejoin hyphenated words. Then find `\n` and replace it with a single space to turn the stack of lines into running text. That second step also joins separate paragraphs, so do it on one passage at a time if paragraph breaks matter.

## Symptom: Text comes out as gibberish symbols

**Cause:** some PDFs use fonts whose characters aren't mapped back to standard Unicode letters. The page _displays_ correctly because the font draws the right shapes, but the stored codes are meaningless outside that font. This is common in older PDFs and some print-oriented exports.

**Fix:** treat it like a scan: render the page to an image and use OCR. No text extractor can recover meaning that isn't in the file.

## Symptom: Words run together or letters are spaced out

**Cause:** PDFs often position words, or even individual letters, separately, without storing an actual space character. Extractors infer spacing, and tightly kerned or justified text can confuse them, giving `thequickbrown` or `t h e`.

**Fix:** usually only a few spots are affected; fix them by hand.

## Symptom: Tables lose their structure

**Cause:** a PDF table is just text placed in a grid. There are no stored rows and columns. Cells come out separated by spaces and line breaks.

**Fix:** for a small table, retype it. For data you need regularly, ask for the source spreadsheet.

## Symptom: The same header appears on every page

**Cause:** running headers, footers and page numbers are real text on each page, so they're extracted too.

**Fix:** use Find and Replace to remove the repeated line in one go.

## How to extract text from a PDF

1. Open [PDF to Text](/online-tool/pdf-tools/pdf-to-text) and choose a PDF. Extraction starts immediately, with a progress bar while each page is read.
2. Review the text in the **Extracted text** box. Each page starts with a marker like `--- Page 3 ---`, which makes it easy to find where something came from.
3. Use the copy button, or download the text as a `.txt` file named after your PDF.

The text is read in your browser and the PDF never leaves your device, which matters for contracts, statements and medical letters.

## FAQ

### Can I extract text from a password-protected PDF?

No. You'll be asked to remove the password first: open the file with it and save an unprotected copy.

### Why are the page markers there, and can I remove them?

They help you trace text back to its page. To remove them all at once, use Find and Replace with **Regular expression** ticked: find `--- Page \d+ ---` and replace it with nothing.

### Will extraction keep bold, italics or headings?

No. The output is plain text. Formatting, images and layout aren't included.

Have a PDF with real text in it? Pull the words out with [PDF to Text](/online-tool/pdf-tools/pdf-to-text).
