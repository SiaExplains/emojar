---
slug: word-to-pdf-convert-or-print-which-option-to-use
tool: word-to-pdf
title: "Word to PDF in Your Browser: Convert or Print to PDF?"
description: Two ways to turn a .docx into a PDF without uploading it, and what each keeps or drops. A guide to choosing between Convert to PDF and Print / Save as PDF.
tags: [PDF, Word, Decision guide]
---

If your Word document is mostly text, headings, lists, simple tables and photos in English or another Latin, Greek or Cyrillic script, use **Convert to PDF**: it builds a clean PDF with selectable text in one click. If the document is in another script, or you want your own fonts and a layout closer to what you typed, use **Print / Save as PDF**, which hands the document to your browser's print engine. And if the layout has to match Word exactly (letterheads, columns, page headers), export from Word itself.

## What happens to a .docx when it's converted in the browser?

A .docx file is a zipped bundle of XML. The converter reads the *structure* of the content (this is a heading, this is a list, this cell belongs to row two) and rebuilds it as a fresh document, without copying Word's page layout. That explains what does and doesn't survive:

| In your Word file                   | In the PDF                                                          |
| ----------------------------------- | ------------------------------------------------------------------- |
| Headings, bold, italic, lists, tables, links | Kept                                                       |
| PNG and JPG pictures                | Kept; other formats the browser can decode are converted to PNG     |
| EMF/WMF drawings                    | Left out, with a warning showing how many                           |
| Headers and footers                 | Not included                                                        |
| Manual page breaks                  | Ignored; text flows onto new pages as needed                        |
| Text boxes and multiple columns     | Simplified; the text flows into the body                            |
| Footnotes                           | Moved to a numbered list at the end                                 |
| Tracked changes                     | Shown as if accepted: insertions appear, deletions don't            |
| Word fonts, sizes, colors           | Replaced by a uniform style                                         |

## How do the two buttons differ?

**Convert to PDF** creates the file itself. Every page uses the Roboto font at 11 pt, with the page size and margins you picked. Roboto covers Latin, Greek and Cyrillic; characters from other scripts, such as Chinese, Arabic or Hindi, have no glyphs in it and won't come out right.

**Print / Save as PDF** opens your browser's print dialog with the same content laid out for printing. It asks for Calibri, then Carlito, then Arial, so it uses whichever of those your system has, plus any system font that covers your language. Tables get thin borders, and the main headings are kept together with the text that follows them. Choose "Save as PDF" as the printer and pick where to save the file.

| Your situation                                  | Best choice                  |
| ----------------------------------------------- | ---------------------------- |
| CV, essay or report in a Latin-script language  | Convert to PDF               |
| Document in Japanese, Arabic, Hebrew, Thai…     | Print / Save as PDF          |
| You want a font closer to Word's default        | Print / Save as PDF          |
| Letterhead, page headers, two-column newsletter | Export from Word itself      |
| Older .doc file                                 | Save it as .docx first       |

## What do the page size and margin options mean in practice?

Margins decide how wide your lines of text are. On A4 (210 mm wide), **Normal** margins of 2.54 cm on each side leave a text column of 159.2 mm. **Narrow** (1.27 cm) widens it to 184.6 mm, enough to pull a slightly long table back inside the page. **Wide** (3.81 cm) narrows it to 133.8 mm, handy for printing documents you plan to annotate by hand. On US Letter (8.5 in wide) the same options give 6.5, 7.5 and 5.5 inches.

## A worked example: a cover letter with a letterhead

Say your cover letter has your contact details in the Word header, a bold subject line, three paragraphs and a PNG signature. Convert to PDF and you get the subject line, paragraphs and signature in Roboto, but **not** the header, because headers aren't read. The fix: move your contact details into the first lines of the body before converting. If you need page numbers, add them afterwards with [Add Page Numbers to PDF](/online-tool/pdf-tools/add-page-numbers-to-pdf), since Word's footer numbering won't carry over.

## How to convert step by step

1. Open [Word to PDF](/online-tool/pdf-tools/word-to-pdf) and choose a .docx file, or drop it on the box. The file is read in your browser and never uploaded.
2. Pick a **Page size** (A4 or US Letter) and **Margins** (Normal, Narrow or Wide).
3. Scroll through **Preview of the document content**. If something is missing there, it will be missing from the PDF too. Watch for an amber notice about drawings that were left out.
4. Click **Convert to PDF** and download the file, or click **Print / Save as PDF** and save from the print dialog.
5. Open the PDF and check page breaks, especially around tables and images.

## Pitfalls worth knowing

- **Old .doc files are refused.** Open the file in Word, LibreOffice or Google Docs, save as .docx, then try again.
- **Password-protected documents can't be read.** Remove the password in Word first.
- **Drawings left out?** Re-insert them in Word as PNG or JPG pictures and convert again.
- **Need one file for an upload?** Combine the result with other documents in [Merge PDF](/online-tool/pdf-tools/merge-pdf).

## FAQ

### Why does my PDF have more pages than the Word file?

The text column and font differ from Word's, so lines break in different places, and Word's manual page breaks are ignored. Narrow margins can bring the page count back down.

### Are comments from reviewers included?

No. Review comments are skipped, so the PDF shows only the document text. That suits a final version, but you can't use it to share a draft with its comments visible.

### Can I edit the text after converting?

The text is real, selectable text, so you can copy it or search it in any PDF viewer. For actual rewording, change the .docx and convert again; it takes seconds.

Pick the button that fits your document and try it in [Word to PDF](/online-tool/pdf-tools/word-to-pdf).
