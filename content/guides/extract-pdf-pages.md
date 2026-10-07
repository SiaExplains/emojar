---
slug: pdf-page-range-syntax-explained
tool: extract-pdf-pages
title: 'PDF Page Ranges Explained: 1-3, 7, 10- and Other Tricks'
description: Learn the page range syntax for pulling pages out of a PDF, including open ranges, reverse order, duplicates and odd/even, with ready-to-copy examples.
tags: [PDF, Pages, Reference]
---

A page range is a short list that tells a tool which pages to take and in what order: `5` means page 5, `2-4` means pages 2 through 4, `10-` means page 10 to the end, and commas join them, so `1-3, 7, 10-` keeps pages 1, 2, 3, 7 and everything from 10 on. When extracting pages, those pages become a new PDF in exactly the order you typed, and the original file isn't changed.

That syntax is more powerful than it looks. Here's the full reference with worked examples.

## The building blocks

| You type | Meaning                  |
| -------- | ------------------------ |
| `5`      | Page 5                   |
| `2-4`    | Pages 2, 3, 4            |
| `10-`    | Page 10 to the last page |
| `-3`     | Page 1 to page 3         |
| `1-3, 7` | Pages 1, 2, 3 and 7      |
| `odd`    | Pages 1, 3, 5, …         |
| `even`   | Pages 2, 4, 6, …         |
| `all`    | Every page               |

Separate items with commas, spaces or semicolons; `1-3, 7`, `1-3 7` and `1-3;7` are equivalent. The keywords `odd`, `even` and `all` work on their own, not mixed with numbers.

## Order is what you type

This is the feature most people miss. Pages are added to the new PDF in the order they appear in your list, not sorted. So:

- `3, 1, 2` gives a PDF that starts with page 3.
- `10-12, 1-9` moves the last three pages of a 12-page document to the front.

### Reverse ranges

A range can run backwards. `5-1` gives pages 5, 4, 3, 2, 1. To reverse an entire 24-page document, type `24-1`. That's useful when a scanner fed a stack in reverse order.

### Repeating a page

When extracting, the same page can appear more than once. `1, 2-8, 1` puts the cover page at both the start and the end, and `4, 4, 4` makes three copies of a form page to fill in by hand.

## Worked examples

Assume a 20-page PDF.

| Goal                             | Type          | Resulting pages        |
| -------------------------------- | ------------- | ---------------------- |
| Just the signature page          | `20`          | 20                     |
| Drop the cover and the last page | `2-19`        | 2–19 (18 pages)        |
| First three pages                | `-3` or `1-3` | 1, 2, 3                |
| Summary first, then the rest     | `18-20, 1-17` | 18, 19, 20, 1, 2, … 17 |
| Pages 1–5 and 11–15 only         | `1-5, 11-15`  | 10 pages               |
| Every right-hand (odd) page      | `odd`         | 1, 3, 5, … 19          |
| Whole document backwards         | `20-1`        | 20, 19, … 1            |

## What happens with mistakes?

The tool checks every item before creating anything:

- `25` in a 20-page PDF: "Page 25 does not exist — this PDF has 20 pages."
- `3-x` or `p5`: "“3-x” is not a valid page or range. Use numbers like 1-3, 5, 8-."

Fix the item mentioned and run it again.

## How to extract pages step by step

1. Open [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages) and choose a PDF. The page count appears next to the file name.
2. In **Pages to keep**, type your range. It starts pre-filled with `1-3` as an example.
3. Click **Extract pages**.
4. Download the new PDF. It's named with `-extracted` and shows how many pages it contains.

Pages are copied as they are, so text stays searchable and images keep their quality. Everything happens in your browser; the PDF isn't uploaded.

## Extract, split or reorder?

These three tools overlap, so here's the quick distinction:

- **Extract** makes **one** new PDF from the pages you list, in your order.
- **[Split PDF](/online-tool/pdf-tools/split-pdf)** makes **several** PDFs at once, for example one per chapter.
- **[Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages)** shows thumbnails so you can move and remove pages visually. It's better when you can't remember which page is which.

If you know the page numbers, Extract with a typed range is usually the fastest of the three. It can even reorder a whole document in one line.

## FAQ

### Does extracting delete pages from my original file?

No. The original stays as it is on your device; you get a separate new PDF.

### Can I extract pages from several PDFs into one?

Extract from each file separately, then combine the results with Merge PDF.

### Where do I find the right page numbers?

Use the page numbers your PDF viewer shows in its toolbar, not the numbers printed on the pages. A report whose first printed "page 1" comes after a cover and a table of contents might really be page 3 of the file.

Copy a range from the tables above and try it in [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages).
