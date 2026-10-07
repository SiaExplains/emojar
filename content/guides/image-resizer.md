---
slug: resize-photos-for-upload-limits-forms-and-marketplaces
tool: image-resizer
title: Resizing Photos for Upload Limits, Forms and Marketplaces
description: A form says "max 1200 px" or "under 2 MB" and your phone photo is far bigger. Here's how to resize it correctly, with real numbers and no stretching.
tags: [Images, Resize, How-to]
---

To make a photo fit an upload requirement, resize it by pixels with the aspect ratio locked: type the maximum width the site allows and let the height follow automatically. If the site gives a box (say "no larger than 1200 × 1200"), enter both numbers and the image will be scaled to fit inside that box without stretching. Smaller pixel dimensions also shrink the file size, which often solves "file too large" errors on its own.

Let's walk through a typical situation from start to finish.

## The scenario: listing items on a marketplace

You've photographed five items for an online listing. Your phone saves each picture at 4032 × 3024 pixels, roughly 3–5 MB each. The listing form says images should be at most 1600 pixels on the longest side, and uploads keep timing out on your mobile connection.

You don't need an editor for this. You need every photo scaled down by the same rule.

## Step 1: Work out the numbers before you click

With the aspect ratio locked, the resizer computes the missing side for you, but it helps to know what to expect:

- **Width 1600, height blank:** 1600 × 1200. The height is 3024 × 1600 ÷ 4032 = 1200.
- **Width 1600 and height 1600 ("fit inside a box"):** the image is scaled by whichever factor is smaller. 1600 ÷ 4032 ≈ 0.397 and 1600 ÷ 3024 ≈ 0.529, so 0.397 wins and the result is again 1600 × 1200. A _portrait_ photo (3024 × 4032) in the same box becomes 1200 × 1600, so the long side always ends up at 1600.
- **By percentage, 40%:** 1613 × 1210. Percentages are handy when you don't care about an exact number.

The "fit inside a box" approach is the one to use for mixed portrait and landscape batches, because a single width value would make portrait shots taller than allowed.

## Step 2: Resize the batch

1. Open the [Image Resizer](/online-tool/image-tools/image-resizer) and add all five photos at once.
2. Leave the mode on **By pixels**. Enter `1600` for Width and `1600` for Height.
3. Keep **Lock aspect ratio (fit inside width × height)** checked. The line under the settings shows the first image's size before and after, for example 4032×3024 → **1600×1200** px.
4. Leave **Output format** on "Keep original format", or choose JPG, PNG or WebP.
5. Click **Resize** and use "Download all". Each file is named with its new size, like `chair-1600x1200.jpg`, so you can tell it apart from the original.

The resizing happens in your browser, so there's no uploading of five large files just to get five small ones back.

## Step 3: Check the file size

Going from 12.2 to 1.9 megapixels removes about 84% of the pixels, and the file size drops along with it. If a site _also_ has a strict megabyte limit and you're still over it, run the resized images through the [Image Compressor](/online-tool/image-tools/image-compressor) at around 75–80% quality.

## When should you unlock the aspect ratio?

Almost never for photos. Unlocking it and entering both a width and a height forces the image to those exact dimensions, which stretches or squashes it if the proportions differ. A 4:3 photo forced into 1080 × 1080 makes faces look wider.

If a site needs an exact shape (a square avatar, a 16:9 banner), **crop first, then resize**. The [Image Cropper](/online-tool/image-tools/image-cropper) has 1:1, 16:9 and other presets; once the proportions match, resizing won't distort anything.

## Common requirements and what to enter

| Requirement                  | Mode                              | Values                  | Aspect lock |
| ---------------------------- | --------------------------------- | ----------------------- | ----------- |
| "Max width 1200 px"          | By pixels                         | Width 1200              | On          |
| "Longest side 2000 px"       | By pixels                         | Width 2000, Height 2000 | On          |
| "Exactly 600 × 600" (square) | Crop to 1:1 first, then By pixels | Width 600, Height 600   | On          |
| "Make it half the size"      | By percentage                     | 50%                     | —           |
| Thumbnail for a document     | By pixels                         | Width 400               | On          |

## What about making images bigger?

You can scale up to 400% or type a width up to 16,384 pixels, but enlarging doesn't add real detail. The browser has to invent the new pixels by blending neighbors, so the result looks softer. It's fine for nudging a slightly-too-small image over a minimum size requirement; it won't turn a thumbnail into a print-quality photo.

## FAQ

### Does resizing change the file's quality setting?

When the output is JPG or WebP, the image is re-encoded at a high quality (92%), so there's no noticeable extra loss. PNG output stays lossless.

### Why do my resized images all have slightly different heights?

With the aspect ratio locked, each photo keeps its own proportions. Photos from different cameras or crops will end up the same width but different heights, which is exactly what prevents distortion.

### Can I resize a GIF or BMP?

Yes. They're accepted as input; with "Keep original format" they're saved as JPG, or you can choose PNG or WebP. Animated GIFs become a still image of the first frame.

Have a stack of photos to prepare? Drop them into the [Image Resizer](/online-tool/image-tools/image-resizer) and set the size once for all of them.
