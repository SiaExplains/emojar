---
slug: prepare-visa-application-documents-for-online-upload
title: 'Prepare Visa Documents for Upload: Photo, Scans and PDF Pages'
description: 'Make a 35 × 45 mm visa photo, crop a scanned passport page, drop blank and terms pages from a bank statement and split a mixed scan into one PDF per document.'
tags: [PDF, Travel, Images, How-to]
---

To get visa documents ready for an online application, make the photo at the exact size the form names, crop each scan down to the document, remove pages the consulate doesn't need, and give every document its own file. Four Emojar tools cover this. The [Passport Photo Maker](/online-tool/image-tools/passport-photo-maker) sizes the photo, [Crop PDF](/online-tool/pdf-tools/crop-pdf) trims the scans, [Delete PDF Pages](/online-tool/pdf-tools/delete-pdf-pages) removes the extra pages and [Split PDF](/online-tool/pdf-tools/split-pdf) cuts a combined scan into separate files. They all run in your browser, so your passport, bank statements and photo stay on your device.

The example is a Schengen visa application made online. The form has separate upload fields for the photo, the passport bio page, three months of bank statements, an employer's letter, a hotel booking and travel insurance. You have a phone photo taken against a white wall, a flatbed scan of the passport, a 12-page statement PDF from your bank, and a 9-page scan from a copy shop with the last three documents in it.

## How do you make a visa photo at the right size?

Open the Passport Photo Maker and set **Document** to **EU / Schengen — passport, ID & visa (35 × 45 mm)**. Add your photo, then drag it and use the **Zoom** slider until your face sits inside the dashed oval: chin at the bottom of the oval, top of the head at the top, eyes level and centred.

The note under the editor gives the numbers for this preset: 35 × 45 mm, 413 × 531 px at 300 DPI, with a head height of 32 to 36 mm. Click **⬇ Download photo (JPG)** to save the file for the upload field.

Some consulates also want printed copies. Pick a **Print sheet** and click **⬇ Download print sheet (JPG)**. At 35 × 45 mm, a **4 × 6 in photo print** holds 8 photos and **A4 paper** holds 36, each with a thin grey cut line. Print it at 100 % or "actual size". "Fit to page" shrinks the photos and they will be the wrong size.

The tool only crops and scales. It doesn't whiten the background or check rules about expression, glasses or lighting, so compare the result with the consulate's current photo requirements. If the form limits the photo's file size, run the JPG through [Compress Image to Exact Size](/online-tool/image-tools/compress-image-to-size).

## How do you crop a scanned passport page down to the document?

A flatbed scan saves the whole A4 glass, so the passport sits in one corner surrounded by white. Load the scan into Crop PDF and click **✂ Trim white margins (this page)**. The tool looks for anything darker than near-white on the page you are viewing and sets the crop box around it, with a little padding. Text stays selectable and nothing is re-compressed.

Auto-trim works when the background is clean white. A grey shadow along the edge of the scanner lid counts as content, so the box will stretch out to include it. In that case drag the box or its handles on the preview, or type values under **Margins to remove (mm)**. On a 210 × 297 mm A4 scan, a top margin of 15, a bottom margin of 15 and 12 on the left and right leave the 186 × 267 mm shown in the **Result** line under the fields. Set **Apply to** to **All pages**, **This page only**, **Odd pages**, **Even pages** or **Custom pages…**, then click **Crop PDF**. The file comes back with `-cropped` added to its name.

Cropping hides the trimmed area but doesn't delete it. The cut-off content is still inside the file, and the tool warns you about this above the **Crop PDF** button. Don't use a crop to hide an account number or another person's details. To remove them for good, the tool suggests turning the pages into images with PDF to JPG and making a new PDF from those.

## How do you remove pages the consulate doesn't need?

Bank statements often carry pages that have nothing to do with your balance. Say the 12-page PDF has a blank page 2 and two pages of terms at the end. Open it in Delete PDF Pages and either click those thumbnails, which turns them red with a ✕, or type `2, 11-12` into **Pages to delete (or click the pages below)**. The typed list and the clicked pages stay in sync, so you can start with one and finish with the other.

Click **Delete pages**. The note under the file reads "3 deleted · 9 pages left", and the download is named `statement-pages-deleted.pdf` if the original was `statement.pdf`. The pages you keep are copied as they are, in their original order and quality, with no re-compression. Links and form fields on them survive too. The tool won't let you delete every page, because a PDF needs at least one.

Previews show the first 200 pages. For a longer file, type the later page numbers.

## How do you split one scan into a file per document?

The copy shop gave you one 9-page PDF: the employer's letter on pages 1 and 2, the hotel booking on pages 3 to 5 and the travel insurance on pages 6 to 9. The form wants each one in its own field. Open the scan in Split PDF and set **Split** to **By custom ranges**. In **Ranges (separate files with ;)** type:

```
1-2; 3-5; 6-
```

A range that ends in a dash, like `6-`, runs to the last page. Click **Split PDF** and you get three files:

| Range | File name | Pages |
| --- | --- | --- |
| `1-2` | `scan-pages-1-2.pdf` | 2 |
| `3-5` | `scan-pages-3-5.pdf` | 3 |
| `6-` | `scan-pages-6-9.pdf` | 4 |

Each file has its own download button. **🗜️ Download ZIP** saves all three in one go. Rename them before you upload, for example `employer-letter.pdf`, so you can tell which goes in which field.

## What if a file is still too big for the upload field?

Bank PDFs are usually small. Phone and copy-shop scans can be large, though, because every page is a picture. [Compress PDF](/online-tool/pdf-tools/compress-pdf) has two settings under **Compression**. **Lossless — keeps text selectable** rewrites the file more compactly and leaves everything else alone. **Strong — converts pages to images (best for scans)** renders every page as a JPG at a **Resolution** you pick, from **72 DPI — smallest** to **200 DPI — print**. Strong mode makes text unselectable, which doesn't matter much for something that was already a scan. The tool shows the sizes so you can compare them before you download.

Leave compression until the end and run it on the cropped, trimmed and split files, since those are the ones that go into the form.

## FAQ

### Does cropping a PDF make the file smaller?

Usually not. The hidden part of the page stays in the file, so the size barely changes. Use Compress PDF afterwards if you need a smaller file.

### Can the Passport Photo Maker do other countries?

Yes. Besides EU / Schengen it has presets for the United States (2 × 2 in), the United Kingdom, Canada (50 × 70 mm), India passport and visa, China (33 × 48 mm), Australia and Japan. There is also **Custom size (mm)** for any width and height from 10 to 100 mm.

### What is the difference between Split PDF and Delete PDF Pages?

Split PDF makes several new files from parts of one PDF. Delete PDF Pages makes one new PDF without the pages you picked. Neither changes the file you opened.

### Can I delete pages from a password-protected bank statement?

Remove the password first with Unlock PDF. You need to know the password to do that. Then delete the pages.

More document tools are in [PDF Tools](/online-tool/pdf-tools), and the photo tools are in [Image Tools](/online-tool/image-tools).
