---
slug: print-a-long-pdf-at-home-in-grayscale-and-double-sided
title: Print a Long PDF at Home in Grayscale and on Both Sides
description: Check a PDF's paper size, turn it grayscale to save colour ink, pull out only the pages you need and print odd then even pages on a printer without duplex.
tags: [PDF, Printing, How-to]
---

To print a long PDF at home without wasting ink or paper, check its page size first, convert it to grayscale, and then print only the pages you need, on both sides of the sheet. If your printer can't print double-sided by itself, make two files, one with the odd pages and one with the even pages, and run the stack through twice. The [Grayscale PDF](/online-tool/pdf-tools/grayscale-pdf) tool removes the colour, [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages) builds the odd and even files, and [Split PDF](/online-tool/pdf-tools/split-pdf) cuts the rest into sections you can staple or take to a copy shop.

The example here is a 90-page course reader that a lecturer shared as a colour PDF. It has blue headings, coloured charts and a photo on most chapter openers. You need the first 40 pages for the next four weeks, your printer is a basic inkjet loaded with A4 paper, and it has no automatic duplex.

## What paper size is the PDF?

Find out what size the pages are before you print anything. A file made in the US is often Letter, while your printer probably holds A4, and the two don't have the same shape. Open the file in the [PDF Metadata Viewer](/online-tool/pdf-tools/pdf-metadata-viewer). The **Page size** row lists each size the document uses in millimetres. For this course reader it reads 216 × 279 mm, which is Letter. An A4 file would show 210 × 297 mm.

To see what that difference means on paper, open the [Measurement Reference](/online-tool/reference-tools/measurement-reference) on **📄 Paper sizes** and click **A4**, then **Letter**. Each one is drawn to scale next to the A sizes and the US sizes, with its measurements in mm, cm, inches, points and pixels at 300 and 96 dpi. Letter is 215.9 × 279.4 mm (612 × 792 pt) and A4 is 210 × 297 mm (595 × 842 pt). According to the reference's FAQ, Letter is about 6 mm wider and 18 mm shorter than A4, so pages can shift when printed on the other size. Use your print dialog's fit-to-page option, or check that nothing important sits close to the left and right edges.

## How do you turn a colour PDF into grayscale?

Load the course reader into Grayscale PDF and leave the mode on **Grayscale**, which is described as "Keeps text selectable and the file small". Click **Convert to grayscale**. The tool rewrites the colours inside the PDF, including text, shapes and images, as shades of gray. Text stays sharp and you can still select it and search it. The download is named after the original with `-grayscale` added, for example `course-reader-grayscale.pdf`.

Under the result there's a short note. When every page converted cleanly it says something like "Text and vectors kept on all 90 pages", followed by how many images were converted. Some content can't be converted exactly, such as a colour gradient, a pattern, a spot colour or a CMYK photo. When a page has one of those, only that page is flattened into a 200 DPI gray image, and the note lists which pages that happened to. Links on those pages stop working.

The other two modes are **Black & white** and **Scanned look**. Both turn every page into an image at 150, 200 or 300 DPI, so text can no longer be selected. Black & white is useful when a form or portal only accepts black and white. For printing a reader at home, Grayscale is the one to pick.

## How do you print only the pages you need?

You'll only read 40 of the 90 pages this month, so print those. Open `course-reader-grayscale.pdf` in Extract PDF Pages, type `1-40` into **Pages to keep** and click **Extract pages**. You get one new PDF, with a note under it saying "40 pages". The file you loaded isn't changed.

The page box accepts single pages (`5`), ranges (`2-4`), open ranges such as `41-` that run to the last page, and the keywords `odd` and `even`. Pages are added in the order you type them, so `3, 1, 2` would put page 3 first. If you need the glossary at the back as well, `1-40, 88-90` gives you both in one file.

## How do you print double-sided without a duplex printer?

Load the 40-page file into Extract PDF Pages twice. The first time, type `odd` and click **Extract pages**. That gives you a 20-page file with pages 1, 3, 5 and so on up to 39. The second time, type `even` to get pages 2, 4, 6 and so on up to 40, also 20 pages.

Print the odd file first. Put the printed stack back into the paper tray so that the blank side will be printed next. Which way round it goes depends on your printer, so test with the first two or three pages of each file before you print the whole set. Then print the even file. Page 2 lands on the back of page 1, page 4 on the back of page 3, and so on.

If your page count is odd, the odd file ends up with one page more than the even file. Take the last sheet off the stack before you put it back in the tray, because nothing gets printed on its back.

## How do you break the rest into stapled sections?

The remaining 50 pages can wait, but you'll probably want them as separate booklets later, or as files you can send to a copy shop. Open `course-reader-grayscale.pdf` in Split PDF and pick one of two modes under **Split**.

**Every N pages** cuts the document into equal parts. With 30 in **Pages per file**, the 90 pages become three files named `course-reader-grayscale-pages-1-30.pdf`, `-pages-31-60.pdf` and `-pages-61-90.pdf`. **By custom ranges** lets you follow the chapters instead. Separate each file with a semicolon, for example `41-58; 59-74; 75-`, and an open range like `75-` runs to the last page. Click **Split PDF**, then save each part on its own or click **🗜️ Download ZIP** to get them all in one archive.

Split always gives you several files. When you want just one file made of selected pages, use Extract PDF Pages instead.

The four PDF tools in this post run in your browser. The PDF stays on your device and isn't uploaded anywhere, which matters when a course reader or a work document isn't meant to be shared.

## FAQ

### Will grayscale make the text blurry?

No. In **Grayscale** mode the text and vector shapes are kept as they are, so they stay sharp and selectable. Only pages with content that can't be converted exactly are flattened, at 200 DPI, and the result note tells you which pages.

### Why is my PDF a different shape from my paper?

It's probably Letter (216 × 279 mm in the PDF Metadata Viewer) and you're printing on A4 (210 × 297 mm), or the other way round. Letter is a little wider and shorter, so use fit-to-page when you print.

### Can I pick odd pages from just part of a document?

Not in one step. The `odd` and `even` keywords cover the whole file, so extract the range you need first, for example `1-40`, and then run `odd` and `even` on that new file.

### What is the difference between Split PDF and Extract PDF Pages?

Split PDF makes several files, either every N pages or one file per range. Extract PDF Pages makes one new PDF from the pages you list, in the order you type them.

The other PDF tools are in [PDF Tools](/online-tool/pdf-tools), and more size charts are in [Reference Tools](/online-tool/reference-tools).
