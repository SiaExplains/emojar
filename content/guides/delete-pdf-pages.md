---
slug: checklist-before-deleting-pages-from-a-pdf
tool: delete-pdf-pages
title: "Deleting PDF Pages: A Checklist for a Clean Result"
description: Remove blank, duplicate or private pages from a PDF without surprises. What to check first, how to select pages fast, and what the new file keeps.
tags: [PDF, Pages, Checklist]
---

To delete pages from a PDF, load it, mark the pages you don't want by clicking their thumbnails or typing numbers like "2, 5-7", and save a new copy without them. The pages you keep aren't re-compressed or altered. A few minutes of checking before and after, though, saves you from sending a file with a missing signature page or a broken form.

Here's the checklist, in the order you'll need it.

## Before you start

**1. Know where the form fields are.** Pages are removed from the original document rather than copied into a new one, so fillable fields on the pages you keep go on working. Fields that sat only on a deleted page are removed with it. If you're trimming a form, delete first and then complete the rest with [Fill PDF Form](/online-tool/pdf-tools/fill-pdf-form).

**2. Remove the password.** An encrypted file can't be opened for editing. If you know the password, take it off with [Unlock PDF](/online-tool/pdf-tools/unlock-pdf) first.

**3. Decide whether you're deleting or keeping.** If you're removing 3 pages from a 40-page report, deleting is quicker. If you only want 3 pages out of 40, [Extract PDF Pages](/online-tool/pdf-tools/extract-pdf-pages) lets you list the keepers instead and saves typing.

**4. Note the page numbers the tool will use.** The tool counts physical pages, starting at 1 for the first page of the file. If the document's printed page numbers start later, for example a cover and contents before "page 1", the numbers won't match. Go by the thumbnails, not the printed numbers.

## Selecting the pages

Open [Delete PDF Pages](/online-tool/pdf-tools/delete-pdf-pages) and choose your file. You get a text box labeled **Pages to delete (or click the pages below)** and a grid of page previews. Both stay in sync: clicking a thumbnail marks it with a red ✕ and updates the text box, and typing updates the grid.

The text box understands this syntax:

| You type | Pages marked (in a 10-page PDF) |
| --- | --- |
| `2, 5-7` | 2, 5, 6, 7 |
| `even` | 2, 4, 6, 8, 10 |
| `odd` | 1, 3, 5, 7, 9 |
| `8-` | 8, 9, 10 (to the end) |
| `-3` | 1, 2, 3 |

Commas, semicolons and spaces all work as separators, so `1;3 4` is fine too. Two behaviors are worth knowing:

- **Clicking rewrites words as numbers.** Type `even` in a 10-page file and click page 3, and the box becomes `2-4, 6, 8, 10`. The selection is the same; it's just written out.
- **The grid shows the first 200 pages.** For longer documents, type the later page numbers.

### Worked example: a duplex scan with blank backs

You scanned 12 single-sided letters on a duplex scanner and got a 24-page PDF in which every even page is a blank back side. Type `even`, look over the grid to confirm that pages 2, 4, 6 and so on really are blank, and click any odd page that also needs to go. Click **Delete pages**. The result note reads "12 deleted · 12 pages left".

## Common errors and what they mean

- **"Page 12 does not exist — this PDF has 10 pages."** A number in the box is higher than the page count. Zero also triggers this, because counting starts at 1.
- **"… is not a valid page or range."** Something other than numbers, ranges, `odd`, `even` or `all` is in the box, such as a letter or `p5`.
- **"You can't delete every page — a PDF needs at least one page."** Every page is marked (typing `all` does the same). Unmark at least one page to keep. While nothing is marked at all, the **Delete pages** button stays greyed out.

## After you download

**5. Check the result page by page.** The file name ends in `-pages-deleted.pdf`, and the original file isn't touched. Flip through the new copy before you send it, especially around signature and appendix pages.

**6. Check bookmarks and internal links.** The document title, author and other properties stay as they were, which you can confirm with [PDF Metadata Viewer](/online-tool/pdf-tools/pdf-metadata-viewer). Page content, including text, images and web links, is untouched. Bookmarks and "go to page" links that pointed at a deleted page have nowhere to go anymore, so click through the table of contents of a long report before you send it.

**7. Don't expect the size to drop in proportion.** Removing half the pages doesn't always halve the file, because fonts and images shared across pages stay in the file as long as one kept page uses them. Scanned pages, each with its own image, shrink the most.

**8. Fix the order separately if needed.** Deleting keeps the remaining pages in their original sequence. To rearrange them, run the new file through [Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages).

The whole process runs in your browser, so a document containing pages you want to remove for privacy reasons isn't uploaded along the way.

## FAQ

### Can I get a deleted page back?

Not from the new file. The removed pages aren't hidden, they're simply not copied into it. Because your original PDF is left unchanged, you can always start again from it.

### Does deleting a page remove its content from the file for good?

Yes. Unlike covering content with a box or cropping it out of view, deleting leaves out the whole page, so its text and images aren't in the new PDF. That makes it a sound way to drop a page with personal details before sharing.

Ready to trim your PDF? Open [Delete PDF Pages](/online-tool/pdf-tools/delete-pdf-pages) and start with the checklist above.
