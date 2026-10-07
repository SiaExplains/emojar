---
slug: fix-scanned-pdf-pages-in-the-wrong-order
tool: reorder-pdf-pages
title: Fixing a Scanned PDF With Pages in the Wrong Order
description: Scanned a double-sided document and got pages 1, 3, 5, then 10, 8, 6? Here's how to put a PDF back in order with thumbnails or a single typed sequence.
tags: [PDF, Scanning, How-to]
---

To fix a PDF whose pages are out of order, open it in a page reorder tool, move each page to its correct position using the thumbnails, remove any blank or duplicate pages, and save a new copy. For short documents that's a minute of clicking. For predictable scanning mix-ups, like a double-sided document scanned one side at a time, you can also type the correct sequence in one go, which is faster for long files.

Let's walk through the most common case: a double-sided paper document and a scanner that only scans one side.

## The scenario: a 10-page contract, scanned front then back

You have five sheets printed on both sides. Your scanner's feeder scans one side at a time, so you:

1. Scan the stack: you get the fronts, pages 1, 3, 5, 7 and 9.
2. Flip the stack over and scan again. Because the stack is flipped, the backs come out **in reverse**: 10, 8, 6, 4, 2.

You combine both scans into one PDF (the [Merge PDF](/online-tool/pdf-tools/merge-pdf) tool does that), and the file now runs:

| Position in file | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  |
| ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Actual page      | 1   | 3   | 5   | 7   | 9   | 10  | 8   | 6   | 4   | 2   |

You need it to read 1 through 10.

## Option A: Fix it visually with thumbnails

1. Open [Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages) and choose the PDF. A thumbnail grid of every page appears.
2. Each thumbnail is labeled with its new position and its original page number, for example "2. page 10". The labels update as you move things, so you always know where each page came from.
3. Use **←** to move a page one place earlier and **→** to move it one place later. In our example, you'd move the last page (actual page 2) to position 2, then actual page 4 to position 4, and so on.
4. Remove blank pages or accidental double scans with **✕**.
5. Made a mess? **Reset** restores the original order and every removed page.
6. Click **Save new order** and download the result, saved with `-reordered` in the name.

Because you can see each page, this is the best option when the order is irregular, for example after merging several files and realizing an appendix ended up in the middle.

## Option B: Type the order in one line

When the mix-up follows a pattern, typing is faster than clicking. Work out which _file position_ holds each actual page:

- Actual page 1 is at position 1
- Actual page 2 is at position 10
- Actual page 3 is at position 2
- Actual page 4 is at position 9
- …and so on, alternating from the front and the back.

That gives the sequence:

```
1, 10, 2, 9, 3, 8, 4, 7, 5, 6
```

Paste it into **Pages to keep** in [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages), which adds pages in exactly the order you type. For any double-sided stack of _n_ pages scanned this way, the pattern is the same: 1, _n_, 2, *n*−1, 3, *n*−2, … until you meet in the middle.

## Other ordering problems and quick fixes

| Problem                                          | Quickest fix                                            |
| ------------------------------------------------ | ------------------------------------------------------- |
| Whole document backwards (stack fed upside down) | Type a reverse range like `24-1` in Extract PDF Pages   |
| One page in the wrong place                      | Thumbnails: a few clicks of ← or →                      |
| Blank separator pages from the scanner           | Thumbnails: ✕ on each blank page                        |
| Appendix in the middle after a merge             | Thumbnails, or a typed order such as `1-8, 13-20, 9-12` |
| Pages in order but upside down                   | Not an ordering issue: use Rotate PDF                   |

## A few practical tips

- **Check orientation first.** If the back sides are also upside down, rotate them before reordering (in our example, pages `6-10` by 180° with Rotate PDF) so the thumbnails are easier to read.
- **Very long files**: thumbnails are generated for up to the first 200 pages. Beyond that, the typed approach in Extract PDF Pages is more practical.
- **Keep the original scan** until you've checked the reordered file page by page.

Pages are copied rather than re-rendered, so text, links and image quality are preserved. The work happens in your browser, so the contract doesn't get uploaded anywhere.

## FAQ

### Can I drag and drop thumbnails?

Pages are moved with the arrow buttons, one position per click. That also works well with a keyboard and on touch screens. For big jumps, a typed order in Extract PDF Pages is faster.

### Can I delete every page except a few?

Yes, but if you only want a handful of pages, typing them in Extract PDF Pages is quicker. The reorder tool always keeps at least one page.

### Will reordering change the page numbers printed on the pages?

No. Printed numbers are part of each page's content. Reordering changes the sequence, not what's printed on them.

Got a scan in the wrong order? Open it in [Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages) and put it right.
