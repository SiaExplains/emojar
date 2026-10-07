---
slug: pdf-page-numbering-cover-pages-start-numbers-and-totals
tool: add-page-numbers-to-pdf
title: PDF Page Numbering Explained – Covers, Start Numbers, Totals
description: How to skip a cover page, continue numbering from a previous file, and avoid a wrong "of 10" total when adding page numbers to a PDF.
tags: [PDF, Page numbers, Guide]
---

To number a PDF, pick a position and format, and the numbers are stamped onto every page. The two settings that trip people up are **Skip the first page**, which leaves the cover unnumbered and starts counting on page 2, and **Start at**, which lets numbering begin at any value, such as continuing from a previous document. Both affect what the "of" total shows, so it's worth understanding how they interact before you print 200 copies.

Below are the rules, with real outputs from the tool.

## What formats and positions can you choose?

| Format                 | Page 3 of a 10-page PDF shows |
| ---------------------- | ----------------------------- |
| 1                      | 3                             |
| Page 1                 | Page 3                        |
| 1 of 10                | 3 of 10                       |
| Page 1 of 10 (default) | Page 3 of 10                  |

Numbers can go at the top or bottom, each left, center or right, for six positions in total. The default is bottom center. They're drawn in Helvetica, in dark gray, at a font size from 7 to 24 points (11 by default), with a margin of 28 points (about 10 mm) from the page edge.

### Which format should you use?

- **"1"** is the least intrusive. It's good for books, reports and anything that will be bound or read in order.
- **"Page 1 of 10"** helps when pages might get separated, like faxes, printed handouts and legal or HR forms, because a reader can tell immediately if one is missing.
- **Corner positions** (right, or alternating in printed books) are easiest to spot when flipping through paper. A single PDF can't alternate left and right, so for double-sided printing, bottom center is the safe choice.

## How does "Skip the first page" work?

It leaves page 1 blank and starts numbering on page 2 with your **Start at** value. The total counts only the numbered pages.

Here's a 10-page PDF with a cover, format "Page 1 of 10", starting at 1:

| Physical page | Label       |
| ------------- | ----------- |
| 1 (cover)     | —           |
| 2             | Page 1 of 9 |
| 3             | Page 2 of 9 |
| …             | …           |
| 10            | Page 9 of 9 |

That's usually what you want: the cover doesn't count, so the first content page is page 1. If you'd rather keep the physical numbering, so that the second sheet says "Page 2", set **Start at** to 2: the second sheet then reads "Page 2 of 10" and the last one "Page 10 of 10", with the cover still blank.

## How does "Start at" change the total?

The "of" number is the **last page number printed**, not the number of pages in the file. That's deliberate: it makes continued numbering read correctly.

For example, say chapter 2 of a report is a separate 10-page PDF that should continue from chapter 1, which ended on page 4. Set **Start at** to 5 with the "1 of 10" format:

| Physical page | Label    |
| ------------- | -------- |
| 1             | 5 of 14  |
| 2             | 6 of 14  |
| …             | …        |
| 10            | 14 of 14 |

This is correct only if chapter 2 is the end of the whole document. If more chapters follow, the "of 14" will be wrong, because the tool only knows about this file. In that case, use a format without a total, or merge everything first.

**Rule of thumb:** for multi-file documents, [merge the PDFs](/online-tool/pdf-tools/merge-pdf) first and number the combined file once. Totals then come out right automatically.

## Can you number only part of a document?

The tool numbers every page, optionally skipping the first. To number just a section, such as the appendix:

1. Pull the section out with [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages).
2. Number it here, using **Start at** to pick up where the main text ends.
3. Merge the pieces back together in order.

Roman numerals for front matter (i, ii, iii) aren't available, so use plain numbers or leave those pages unnumbered.

## How to add page numbers step by step

1. Open [Add Page Numbers to PDF](/online-tool/pdf-tools/add-page-numbers-to-pdf) and choose a file. The page count appears next to the name.
2. Choose the **Position** and **Format**.
3. Set **Start at** and the **Font size**.
4. Tick **Skip the first page (cover)** if needed.
5. Click **Add page numbers** and download the file, which ends in `-numbered.pdf`.

The numbering runs in your browser, so the document isn't uploaded.

## Common problems

- **Numbers overlap existing footers.** Many PDFs already have text near the bottom edge. Move the numbers to the top or a different corner, or reduce the font size.
- **Landscape or rotated pages.** These are handled automatically: numbers are placed and oriented as you see the page, not as it's stored internally.
- **"This PDF is password-protected."** Remove the password with Unlock PDF first, then add numbers.

## FAQ

### Do the numbers become part of the page text?

Yes. They're real text, not an image, so they print sharply and show up if someone searches or copies text from the PDF.

### Can I remove page numbers later?

Not with this tool. Keep the original file and add numbers to a copy.

### What font size is best for printing?

The default 11 pt reads comfortably on paper. Go down to 9 pt for discreet numbering, and up to 14 pt or more for documents viewed on screens or projectors.

Number your document with [Add Page Numbers to PDF](/online-tool/pdf-tools/add-page-numbers-to-pdf).
