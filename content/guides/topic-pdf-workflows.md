---
slug: fix-sign-and-shrink-a-pdf-without-uploading-it
title: Fix, Sign and Shrink a PDF Without Uploading It
description: A step-by-step PDF workflow in your browser. Unlock, rotate, delete and crop pages, fill and sign, add numbers and a watermark, then compress before sending.
tags: [PDF, Privacy, How-to, Workflow]
---

You can take a messy PDF from "just arrived" to "ready to send" without installing anything or uploading it: unlock it, fix the pages, fill and sign it, stamp it, shrink it and check its hidden details. Each step is a separate tool on Emojar, and every one of them works on the file inside your browser. The trick is doing the steps in the right order, because some of them can't be undone later in the chain.

Here's the whole flow, using one realistic document from start to finish.

## What's the example document?

Your landlord emails a lease renewal as a 14-page scanned PDF. It's protected with a password that arrived in a separate text message. Page 4 and page 9 were scanned sideways. Pages 7 and 12 are blank backs of single-sided sheets. The appendix with the house rules ended up before the signature page, and every page has a gray scanner border. You need to fill in your details, sign, number the pages, mark it as a copy and email it back. The landlord's inbox rejects attachments over a few megabytes.

That's most of what goes wrong with real PDFs, in one file.

## Step 1: Remove the password you already have

Most PDF tools can't work on an encrypted file, so start with [Unlock PDF](/online-tool/pdf-tools/unlock-pdf). Choose the file, type the password from the text message and press **Unlock PDF**. You get a copy that opens without a prompt.

This only works when you know the password. The tool doesn't guess or crack anything. A file that has only printing or copying restrictions, with no open password, usually unlocks without typing anything at all.

Keep the protected original somewhere safe. If you need to send the finished file with a password again, add it back at the very end, after compressing, because compression also needs an unencrypted file.

## Step 2: Fix the pages before touching the content

Page fixes come first because everything after them, especially page numbers, depends on the final page order.

**Turn the sideways pages.** In [Rotate PDF](/online-tool/pdf-tools/rotate-pdf), type `4, 9` under **Pages to rotate**, pick **90° clockwise** (or **90° counter-clockwise**, depending on which way they lean) and click **Rotate pages**. Only the orientation setting of those pages changes, so nothing gets blurrier.

**Drop the blank pages.** Open the rotated copy in [Delete PDF Pages](/online-tool/pdf-tools/delete-pdf-pages) and either click the thumbnails of pages 7 and 12 or type `7, 12`. The typed list and the clicked thumbnails stay in sync, so you can mix both. If a duplex scanner left a blank back after every sheet, typing `even` selects them all at once.

**Put the appendix after the signature page.** With 12 pages left, use [Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages). Each thumbnail has buttons to move it earlier, move it later or remove it. If you get lost, **Reset** brings back the original order before you click **Save new order**.

**Trim the scanner border.** In [Crop PDF](/online-tool/pdf-tools/crop-pdf), go to a typical page and click **Trim white margins**, or drag the crop box yourself, then apply it to **All pages**. One thing to know: cropping hides the edges rather than deleting them. The hidden strip is still inside the file. That's fine for a gray border, but it's the wrong tool for hiding anything private.

Each tool adds a suffix to the file name, so after this step you might have `lease-rotated-pages-deleted-reordered.pdf`. Rename it whenever you like.

## Step 3: Fill in the blanks and sign

How you fill a form depends on whether it has real form fields.

If the PDF was made in an office app with fillable boxes, [Fill PDF Form](/online-tool/pdf-tools/fill-pdf-form) lists every text box, checkbox, radio button and drop-down next to the preview, with required ones marked by an asterisk. Tick **Flatten the form** if the answers shouldn't be editable after you send it, then **Save filled PDF**.

A scan like our lease has no fields, so the form filler finds nothing. Use [Edit PDF](/online-tool/pdf-tools/edit-pdf) instead: pick **Add text**, click on the dotted line, type your name and address, and adjust the font (Helvetica, Times or Courier) and size. To correct a printed mistake, draw a white-out box over it and type on top. The covered words are hidden, not removed, just like a cropped edge.

Then open [Sign PDF](/online-tool/pdf-tools/sign-pdf), draw your signature with a mouse or finger or type your name in one of the handwriting styles, choose the page, and click where the signature belongs. **Add today's date** puts the date under it. This is a visible signature image, which works for most everyday paperwork. It isn't a certificate-based digital signature, which some formal processes require.

## Step 4: Number the pages and mark the copy

Now that the page count is final, add numbers. In [Add Page Numbers to PDF](/online-tool/pdf-tools/add-page-numbers-to-pdf), our lease has 12 pages and page 1 is a cover letter. Choose the format **Page 1 of 10**, set **Start at** to 1 and tick **Skip the first page (cover)**. The cover gets no number, and the remaining pages read "Page 1 of 11" through "Page 11 of 11". The total counts only the numbered pages, which is usually what readers expect. Positions include bottom and top, each in left, centre or right.

To mark the document, open [Watermark PDF](/online-tool/pdf-tools/watermark-pdf). It starts with **CONFIDENTIAL** in red at 25% opacity and a 45° angle. Change the text to something like `TENANT COPY`, and choose **Once, centred** or **Repeated across the page**. The watermark sits on top, so the text underneath stays selectable. The font covers Latin letters with accents, but not Cyrillic, Greek, Asian scripts or emoji. A watermark also isn't protection: anyone with a PDF editor can remove it.

## Step 5: Make it small enough to email

Compression goes last on purpose. In [Compress PDF](/online-tool/pdf-tools/compress-pdf), there are two modes:

- **Lossless** rewrites the file structure more compactly and keeps everything as it is. It helps some office exports a lot and scans very little.
- **Strong** redraws every page as a JPG. You choose a resolution (72, 110, 150 or 200 DPI) and an image quality between 20% and 90%. The defaults are 110 DPI and 60%.

For a sense of scale, an A4 page rendered at 110 DPI becomes an image of roughly 909 × 1286 pixels, enough for comfortable reading on screen. At 200 DPI the same page is about 1654 × 2339 pixels, which suits printing but makes a heavier file. Since our lease is a scan, Strong mode at 110 DPI is a good first try.

The catch: after Strong mode, the text can't be selected or searched, and form fields stop being fields. That's why it's the final step, after filling, signing and numbering. If compression can't beat the original size, the tool tells you the file could not be made smaller and keeps the original.

## Step 6: Check what the file says about you

Before you hit send, open the result in [PDF Metadata Viewer](/online-tool/pdf-tools/pdf-metadata-viewer). It shows the title, author, creator app, producer, dates, page count and page sizes. Scanner software and office apps often fill in a name or a device model you didn't know was there. You can edit the title, author, subject and keywords, or clear the author field, and download an updated copy.

## Why does the order matter so much?

A few steps change the file in ways that later steps can't reverse:

- **Page numbers** are drawn onto the pages. Delete or move a page afterwards and the numbers are wrong.
- **Flattening** a form and **Strong** compression turn live content into fixed page content.
- **Encryption** blocks the other tools, so a password goes on last, never first.

A safe order is: unlock, rotate, delete, reorder, crop, fill, sign, number, watermark, compress, check metadata. Skip whatever your document doesn't need.

## Is any of this uploaded?

No. All of the tools in this walkthrough read and write the PDF inside your browser, including password removal, which runs through a WebAssembly build of qpdf. The file never goes to a server, so there's nothing to delete afterwards. That matters for leases, payslips and anything with an ID number on it.

## FAQ

### Can I do several steps in one tool?

Mostly no. Each tool does one job and gives you a new file, which you then open in the next tool. Reorder PDF Pages is the exception, since it can also remove pages.

### Will rotating, deleting or reordering pages lower the quality?

No. Those tools copy pages as they are. Only Strong compression and image-based conversions re-render pages.

### How do I really remove text I covered with white-out?

Covering or cropping only hides content. If it must be gone, convert the pages to images and turn them back into a PDF, so only what's visible survives.

### What if Fill PDF Form shows no fields?

The PDF is a scan or was already flattened. Type onto it with Edit PDF instead.

Browse every page, form and conversion tool in [PDF tools](/online-tool/pdf-tools).
