---
slug: aspect-ratio-cheat-sheet-for-cropping-images
tool: image-cropper
title: 'Aspect Ratio Cheat Sheet: Cropping Images the Right Way'
description: '1:1, 4:5, 16:9 or 9:16? A practical cheat sheet for choosing an aspect ratio, cropping with exact pixels, and avoiding the classic framing mistakes.'
tags: [Images, Crop, Cheat Sheet]
---

Pick the aspect ratio from where the image will be shown: **1:1** for profile pictures and square posts, **4:5** for portrait feed posts, **9:16** for stories and vertical video covers, **16:9** for video thumbnails, slides and banners, and **4:3 or 3:2** to keep a photo's natural camera shape. Crop to that ratio first, then resize if a specific pixel size is required. Cropping in the right order avoids stretched faces and awkward automatic crops.

Below is a cheat sheet you can come back to, plus a checklist for better framing.

## What is an aspect ratio, exactly?

It's the relationship between width and height, written as width:height. A 1600 × 900 image and a 3840 × 2160 image are both 16:9, because 1600 ÷ 900 and 3840 ÷ 2160 both equal 1.78. The ratio describes the _shape_; the pixel count describes the _size_. Cropping changes the shape, and resizing changes the size.

## The cheat sheet

| Ratio | Shape         | Typical uses                                           | Decimal (width ÷ height) |
| ----- | ------------- | ------------------------------------------------------ | ------------------------ |
| 1:1   | Square        | Avatars, profile photos, square posts, product grids   | 1.00                     |
| 4:5   | Slightly tall | Portrait feed posts                                    | 0.80                     |
| 9:16  | Tall          | Stories, vertical video covers, phone wallpapers       | 0.56                     |
| 16:9  | Wide          | Video thumbnails, presentation slides, website banners | 1.78                     |
| 4:3   | Classic       | Most phone camera photos, tablets, older slides        | 1.33                     |
| 3:2   | Classic wide  | Most DSLR and mirrorless photos, standard prints       | 1.50                     |

Platforms change their exact pixel recommendations from time to time, but these shapes have been stable for years. If you match the shape, the platform's own resizing won't chop off anything important.

## How do you calculate an exact crop?

The math is simple: **height = width ÷ ratio** (or width = height × ratio).

Example: you have a 4032 × 3024 photo and need a 16:9 banner as wide as possible.

- Width stays 4032.
- Height = 4032 ÷ (16 ÷ 9) = 4032 × 9 ÷ 16 = **2268**.
- 3024 − 2268 = 756 pixels must go. To keep the crop centered, start it at Y = 378.

So the crop is X 0, Y 378, width 4032, height 2268. You can type exactly those numbers into the cropper's fields, or pick the 16:9 preset and drag.

## A framing checklist before you crop

- **Leave headroom.** For portraits, keep a little space above the head; cutting at the forehead looks accidental.
- **Don't crop at joints.** Cutting at the knees, elbows or wrists looks odd; crop mid-thigh or mid-forearm instead.
- **Use the rule of thirds loosely.** Placing the subject's eyes or the horizon about a third of the way in usually looks more natural than dead center.
- **Mind the safe zone.** Stories and thumbnails often get buttons, timestamps or titles overlaid near the edges. Keep text and faces away from the outer edge.
- **Crop before you resize, and resize before you compress.** That order keeps the most detail at every step.
- **Keep the original.** Cropping deletes pixels; you can't uncrop a saved file.

## How to crop an image step by step

1. Open the [Image Cropper](/online-tool/image-tools/image-cropper) and choose an image (JPG, PNG, WebP, GIF or BMP). A crop box covering the central 80% appears automatically.
2. **Pick an Aspect ratio**: Free, 1:1 (square), 4:3, 3:2, 16:9, 9:16 (story) or 4:5 (portrait post). The selection snaps to that shape and stays locked while you drag.
3. **Drag on the image** to draw a new crop area, or type exact **X**, **Y**, **Width** and **Height** values in pixels. With a preset active, changing the width updates the height to match, and vice versa.
4. **Choose a Format**: PNG, JPG or WebP. It matches the original for JPG and WebP files and defaults to PNG for everything else.
5. Click **Crop image** and download the result, which is saved with `-cropped` in the file name.

If the numbers you typed would push the crop outside the image, the tool shows the image's real dimensions so you can correct them. Everything runs in your browser, so the image isn't uploaded anywhere.

## When cropping isn't the answer

- **The subject fills the whole frame.** Forcing a wide photo into 9:16 will cut people in half. Consider placing it on a background in a design app instead.
- **You only need a smaller file.** Use the [Image Resizer](/online-tool/image-tools/image-resizer) to reduce dimensions without changing the composition.
- **The photo is sideways.** Fix orientation first with the [Image Rotator](/online-tool/image-tools/image-rotator); then crop.

## FAQ

### Does the 1:1 crop make my image a specific size, like 1080 × 1080?

No. It makes the image square at whatever size your selection is. If you need exactly 1080 × 1080, crop to 1:1 first, then resize to a width of 1080.

### Can I crop several images at once?

The cropper works on one image at a time, because each picture usually needs its own framing. Choose "Choose another image" to move on to the next.

### Will cropping a JPG make it blurrier?

The pixels you keep aren't changed, but saving as JPG or WebP re-encodes the image at a high quality setting. Choose PNG if you want the cropped area stored without any further compression.

Pick a ratio from the table and frame your shot in the [Image Cropper](/online-tool/image-tools/image-cropper).
