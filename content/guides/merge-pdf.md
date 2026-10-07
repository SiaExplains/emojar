---
slug: combine-application-documents-into-one-pdf
tool: merge-pdf
title: How to Combine Application Documents Into a Single PDF
description: A job, visa or rental application wants "one PDF"? A walkthrough for turning a CV, certificates, scans and photos into one tidy, correctly ordered file.
tags: [PDF, Merge, How-to]
---

To combine several documents into one PDF, first make sure every piece is a PDF (convert photos and scans if needed), then add them to a PDF merger, arrange them in the order the recipient expects, and merge. The result is a single file containing every page of every document, with text, images and page sizes intact. The whole job takes a few minutes once your files are ready.

Here's a complete walkthrough using a common real-world case.

## The scenario: one upload slot, six documents

You're applying for an apartment. The portal accepts exactly one PDF, and it should contain:

1. A cover letter (exported from a word processor)
2. A copy of your ID (a phone photo, JPG)
3. Three recent pay slips (PDFs downloaded from your employer's portal)
4. A reference letter (a scanned PDF)

That's a mix of formats, and the order matters: whoever reviews it will read from the top.

## Step 1: Turn everything into PDFs

The merger works with PDFs only; other files dropped onto it are skipped with a notice. Convert the photo of your ID first with the [JPG to PDF converter](/online-tool/image-tools/image-converter/jpg-to-pdf-converter). Choose **A4** or **US Letter** as the page size so the photo sits on a normal page with margins instead of a page the exact size of the photo. If your ID has a front and back, add both images in one go and they become a two-page PDF.

**Tip:** if any PDF is password-protected (some pay slip portals do this), open it with the password and save or print an unprotected copy first. Encrypted PDFs can't be merged.

## Step 2: Trim what doesn't belong

Applications go faster when reviewers don't have to wade through irrelevant pages. If a pay slip PDF includes a page of terms and conditions, or a reference letter came with a blank last page, cut those out first with [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages) and merge the trimmed versions.

## Step 3: Merge in the right order

1. Open [Merge PDF](/online-tool/pdf-tools/merge-pdf) and add your files. You can select them all at once or add more at any time; each one appears in a numbered list with its size.
2. Arrange them with the **↑** and **↓** buttons. The number on the left is the position in the final document. A sensible order for our example: cover letter, ID, pay slips (newest first), reference letter.
3. Remove anything added by mistake with **✕**.
4. Click **Merge 6 PDFs** (the button counts your files; it needs at least two).
5. Download the result. It's named `merged.pdf`, so **rename it before uploading** to something descriptive, such as `Jordan-Lee-rental-application.pdf`.

The documents are combined in your browser and never uploaded to a server, which is reassuring when the bundle contains your ID and salary details.

## Step 4: Check before you send

Open the merged file and scroll through it once. Look for:

- **Order**: does it follow the list the recipient asked for?
- **Orientation**: a sideways scan is easy to miss. Fix it with Rotate PDF and re-merge, or rotate just that page in the final file.
- **Size**: many portals cap uploads at a few megabytes. Scans and photos are usually what makes a bundle heavy, so if you're over the limit, compressing the scanned documents before merging works best.

## What exactly is kept when PDFs are merged?

Every page from every file is copied into the new document as it is: text stays selectable and searchable, images keep their resolution, links on the pages keep working, and each page keeps its own size, so an A4 letter and a US Letter pay slip can sit in the same file. Nothing is re-rendered or re-compressed.

Things that belong to a whole document rather than to its pages, such as the original title in the file properties, don't carry over the same way. If the title matters (some portals display it), set it on the merged file afterwards with a metadata editor.

## A quick checklist for any merge

- [ ] Every input is a PDF and none is password-protected
- [ ] Unneeded pages removed beforehand
- [ ] Files ordered as the recipient expects
- [ ] Output renamed descriptively
- [ ] Scrolled through once for order and orientation
- [ ] File size under the upload limit

## FAQ

### Can I merge the same file twice?

Yes. Add it twice and it appears twice in the list. That's handy when, say, a signature page needs to appear at the end of two sections.

### Is there a limit on how many files I can merge?

There's no fixed number. Very large bundles, totaling hundreds of megabytes, depend on how much memory your browser has available.

### Can I put one page from file B in the middle of file A?

Not directly; the merger joins whole files. Merge them first, then move individual pages with Reorder PDF Pages.

Ready to assemble your bundle? Add your files to [Merge PDF](/online-tool/pdf-tools/merge-pdf) and put them in order.
