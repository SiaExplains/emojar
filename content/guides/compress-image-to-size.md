---
slug: how-compressing-an-image-to-an-exact-kb-size-works
tool: compress-image-to-size
title: How Compressing a Photo to an Exact KB Size Actually Works
description: 'What happens when you shrink an image to 20, 50 or 100 KB: the quality search, when the photo gets resized, and how to keep more detail under a tight limit.'
tags: [Images, Compression, Forms, How it works]
---

To get a photo under an exact size such as 50 KB, a compressor has two levers: **JPG quality** (how aggressively detail is discarded) and **dimensions** (how many pixels there are). A good tool tries quality first, because lowering quality slightly is usually invisible, and only reduces the width and height when even low quality can't fit. That's exactly how Emojar's compressor works, and knowing the order helps you get a sharper result.

Here's what happens under the hood, with the numbers.

## What does "50 KB" mean to an upload form?

Most portals define 1 KB as 1,024 bytes, so a 50 KB limit means **51,200 bytes**. The tool uses the same definition, so a file it reports as fitting under 50 KB will pass a form that counts the same way. You can type a custom limit, such as `75`, `100k` or `1.5 MB` (1,572,864 bytes). The minimum is 1 KB.

## Step 1: Can the original be returned as is?

If your file is already a JPG or WebP and already under the limit, the tool hands it back unchanged and tells you so. There's no point re-encoding something that already passes. PNG, HEIC (in Safari) and other formats are always re-encoded, since the output must be JPG or WebP.

## Step 2: The quality search

Quality is searched between 30% and 95%. The tool:

1. Encodes at 30%, the lowest quality it allows. If even that is too large, it skips to step 3.
2. Runs a **binary search**: try the midpoint, keep the upper half if it fits or the lower half if it doesn't. Seven rounds narrow a 65-point range to about half a percentage point.
3. Makes one final check at 95%, in case the photo is small enough to fit at near-maximum quality.

Every attempt is a real encode, and the button shows the attempt count as **Finding the best quality… (try N)**. The result is the highest quality found that is **at or under** the limit, never over, because forms reject files that are even one byte too large.

## Step 3: Shrinking the dimensions

If the 30% version is still too big, the image has too many pixels for the budget. File size roughly tracks pixel area, and area grows with the square of the width, so the tool scales by the **square root** of how far over budget it is, with a 5% safety margin.

**Worked example.** Say a 4000 × 3000 photo is 640 KB at 30% quality and your limit is 50 KB:

- Over-budget ratio: 50 ÷ 640 = 0.078
- Square root: √0.078 ≈ 0.280
- With the safety margin: 0.280 × 0.95 ≈ 0.266
- New size: about **1062 × 797 pixels**

Then it runs the quality search again at that size. If it still doesn't fit, it shrinks again (each round by at least 10%), all the way down to 5% of the original width if necessary. When resizing happens, a note tells you the before and after dimensions.

## What does this mean for your photo?

Because the resize step aims for the size where low quality _just_ fits, a resized result tends to land at a fairly modest quality. The bytes are spread over every pixel in the frame, including background you don't need. That leads to the most useful tip in this guide:

**Crop first.** If a passport-style photo is 70% wall and 30% face, cropping to the head and shoulders with the [Image Cropper](/online-tool/image-tools/image-cropper) means the same 20 KB is spent on the face. You get more pixels and higher quality where it counts.

Other tips:

- **Pick JPG for forms.** The **Output format** offers JPG (accepted by every form) and WebP (smaller, less widely accepted). WebP fits more detail into the same bytes, but many portals reject it.
- **Transparent PNGs get a white background** when saved as JPG, since JPG has no transparency. Signatures on transparent backgrounds end up black on white, which is usually what forms want.
- **Metadata is dropped** whenever the image is re-encoded, including GPS location. (A JPG returned unchanged in step 1 keeps its metadata.)

## How to compress to an exact size

1. Open [Compress Image to Exact Size](/online-tool/image-tools/compress-image-to-size) and choose a photo, signature or document scan.
2. Under **Target size**, click a preset (20, 30, 50, 100, 200 or 500 KB) or type your own in **Custom size**.
3. Choose the **Output format**.
4. Click **Compress**.
5. Check the result's size, dimensions and quality, then download it. The file name records the target, so `photo.jpg` becomes `photo-50kb.jpg`.

If you always need the same limit, the [compress to 50 KB](/online-tool/image-tools/compress-image-to-size/compress-image-to-50kb) page starts with that target preselected. Everything runs in your browser, so ID scans and signatures aren't uploaded anywhere.

## FAQ

### Why did I get an error saying even the smallest version is too big?

The tool couldn't fit the image even at 5% of its original width. That happens with extremely low limits, such as a few KB. Use a higher target or crop the image down to the essential area.

### Why did the tool give me back my original file?

Your image was already a JPG or WebP under the limit, so re-encoding it would only lose quality. The note under the button confirms this, and the file is passed through untouched.

### Is a 100 KB image always sharper than a 50 KB one?

At the same dimensions, yes. Across different photos, no: a busy, detailed photo needs more bytes than a plain one to look clean.

Try it now with [Compress Image to Exact Size](/online-tool/image-tools/compress-image-to-size).
