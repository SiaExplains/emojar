---
slug: how-pdf-page-rotation-works-and-saves
tool: rotate-pdf
title: How PDF Page Rotation Works (and Why It Sometimes Won't Save)
description: You rotated a PDF in your viewer, reopened it, and it's sideways again. Here's how PDF rotation really works and how to make it stick, page by page.
tags: [PDF, Rotate, Explainer]
---

Every PDF page has a rotation setting, a number that tells viewers to display the page turned by 0°, 90°, 180° or 270°. Most PDF viewers' "rotate" buttons only change _your current view_ and don't save that setting into the file, which is why the page is sideways again when you reopen or share it. To fix it permanently, change the page's rotation value in the file itself and save a new copy. Because the page content isn't touched, this is completely lossless.

Let's look under the hood, then at the common fixes.

## What is actually stored in the file?

Each page in a PDF has a size (its "media box") and, optionally, a **Rotate** entry. The page's content, meaning the text, images and drawings, is laid out in the page's own coordinate system. The Rotate value says how to turn that whole page when displaying or printing it. It must be a multiple of 90.

So a scanned landscape table that came out sideways doesn't need its pixels redrawn. You just change its Rotate value from 0 to 90 (or 270), and every viewer will show it upright. Text stays selectable, images keep their full resolution, and file size barely changes.

## Why doesn't my viewer's rotate button save?

Many viewers treat rotation as a _view_ setting, like zoom. It changes what you see in that window, and closing the file throws it away. Some apps do save it, but only if you explicitly save or export afterwards, and some browser viewers can't save at all. When a colleague says "it's still sideways," that's almost always why.

## Rotation adds up

The new rotation is **added** to what the page already has. That matters with PDFs that have been through several tools:

| Page's current Rotate | You apply             | New Rotate | What you see           |
| --------------------- | --------------------- | ---------- | ---------------------- |
| 0°                    | 90° clockwise         | 90°        | Turned a quarter right |
| 90°                   | 90° clockwise         | 180°       | Upside down            |
| 90°                   | 90° counter-clockwise | 0°         | Back to the original   |
| 270°                  | 180°                  | 90°        | Turned a quarter right |

In practice you don't need to know the current value. Look at the page as it appears now, and choose the turn that makes it upright.

## Common fixes and what to enter

**A single sideways landscape page in a portrait report.** Say page 7 is a wide table that displays sideways.
Pages to rotate: `7` · Rotation: 90° clockwise or 90° counter-clockwise, depending on which way it faces.

**Every other page upside down.** This happens when a double-sided document is scanned with the back sides fed in reversed: pages 2, 4, 6… are upside down.
Pages to rotate: `even` · Rotation: 180°.

**A whole scan came out sideways.**
Pages to rotate: `all` · Rotation: 90° clockwise or counter-clockwise.

**A few scattered pages.**
Pages to rotate: `3, 8-10, 15` · Rotation as needed.

If different pages need _different_ rotations, run the tool once per angle: rotate the first group, download, load the result, and rotate the next group.

## How to rotate PDF pages step by step

1. Open [Rotate PDF](/online-tool/pdf-tools/rotate-pdf) and choose the file. The page count is shown next to its name.
2. In **Pages to rotate**, leave `all` or enter pages: single numbers (`5`), ranges (`2-4`), open ranges (`10-` for "to the end"), or the keywords `odd` and `even`.
3. Choose **Rotation**: 90° clockwise, 180°, or 90° counter-clockwise.
4. Click **Rotate pages** and download the file, which is saved with `-rotated` in its name and a note of how many pages were changed.
5. Open it in any viewer to confirm. The new orientation is now part of the file.

The PDF is processed in your browser; nothing is uploaded.

## Rotate vs. re-render: why it matters

Some tools "rotate" a PDF by converting each page to an image, turning the image and rebuilding the PDF. That works visually, but text stops being selectable, the file often gets bigger and quality drops. Changing the Rotate value avoids all of that, which is why it's the right approach for orientation problems.

If the page is fine but its _content_ is crooked, like a scan fed in at a slight angle, that's a different problem. A page can only rotate in 90° steps. For small tilts, convert the page to an image, straighten it with the [Image Rotator](/online-tool/image-tools/image-rotator), and rebuild it, accepting the trade-offs above.

## FAQ

### Will rotating change the page size?

The page keeps its dimensions; it's simply displayed turned. A portrait A4 page rotated 90° displays and prints as landscape A4.

### Can I rotate a password-protected PDF?

No. Encrypted PDFs need to be unlocked with their password first.

### My pages are in the wrong order, too. Can I fix both?

Yes, in two passes. Rotate first, then rearrange the result with [Reorder PDF Pages](/online-tool/pdf-tools/reorder-pdf-pages).

Make the fix permanent: open [Rotate PDF](/online-tool/pdf-tools/rotate-pdf), pick your pages and choose the turn.
