---
slug: why-photos-show-up-sideways-and-how-to-fix-them
tool: image-rotator
title: Why Photos Show Up Sideways (and How to Fix Them for Good)
description: Your photo looks fine on your phone but sideways once uploaded or emailed. Here's what causes it, how to fix it permanently, and how to straighten tilted shots.
tags: [Images, Rotate, Troubleshooting]
---

Photos turn sideways after uploading because most phones don't actually rotate the pixels when you hold the camera vertically. They save the image in the sensor's landscape orientation and add a small metadata note, the EXIF Orientation tag, that says "display this rotated 90°." Apps that read the tag show it upright; apps that ignore it show it sideways. The permanent fix is to rotate the pixels themselves and save a new file, so the image is upright no matter what reads it.

Here's how to diagnose which problem you have and fix each one.

## Symptom 1: Upright on your phone, sideways somewhere else

This is the classic EXIF Orientation problem. The tag can hold one of eight values. Value 1 means "as stored," value 6 means "rotate 90° clockwise to display," value 8 means "rotate 90° counter-clockwise," and value 3 means "rotate 180°." The other four values add a mirror flip.

Modern browsers and phone galleries honor the tag. Many older programs, some content management systems, printers, e-commerce back ends and scripts that strip metadata do not. When metadata is removed _without_ applying the rotation first, the image loses its instructions and falls back to the raw sideways pixels.

**Fix:** re-save the photo so the orientation is baked into the pixels. When you load a photo into the Emojar rotator, the browser applies the EXIF orientation while decoding it, and the saved result contains upright pixels with no orientation tag left to misread.

A handy trick: if the photo already _looks_ right in the tool's preview and you only need to make that permanent, type `0` in **Custom angle** and process it. Nothing turns, but the output is upright everywhere.

## Symptom 2: Sideways everywhere, including your phone

Then the pixels really are sideways, and usually the camera's orientation sensor guessed wrong (common when shooting straight down at a table or document). Rotate by a quarter turn:

- Sideways with the top pointing **left**: rotate **90° right** (clockwise).
- Sideways with the top pointing **right**: rotate **90° left** (counter-clockwise).
- Upside down: rotate **180°**.

## Symptom 3: The horizon is slightly tilted

A beach photo with a horizon tilted by 2–3° needs a small custom angle, not a quarter turn. Enter a value like `-2` or `3` in Custom angle and check the preview.

Here's what to expect: rotating by an angle that isn't a multiple of 90° makes the canvas bigger so no corner is cut off. A 4000 × 3000 photo rotated by 3° becomes about 4152 × 3205 pixels, because the rotated rectangle needs a larger bounding box (4000 × cos 3° + 3000 × sin 3° ≈ 4152). The new corner areas are transparent for PNG and WebP, and white for JPG. Follow up with the [Image Cropper](/online-tool/image-tools/image-cropper) to trim those corners away.

## Symptom 4: It's mirrored, not rotated

If text in the photo reads backwards, rotating won't help; no amount of turning un-mirrors an image. That's a flip. The rotator has "Flip horizontal (mirror)" and "Flip vertical" checkboxes for exactly this, or see the dedicated [Image Flipper](/online-tool/image-tools/image-flipper).

## How to rotate images step by step

1. Open the [Image Rotator](/online-tool/image-tools/image-rotator) and add one or more images (JPG, PNG, WebP, GIF or BMP).
2. Use **↺ 90° left**, **↻ 90° right** or **180°**. The buttons add up: pressing 90° right twice gives 180°. The current total is shown in **Custom angle**, where you can also type any value from −360 to 360.
3. Tick a flip checkbox if the image is also mirrored.
4. Check the preview of the first image, then click **Rotate** (the button shows how many images will be processed).
5. Download each file, or use "Download all". Files are named like `photo-rotated-90.jpg`.

The same angle is applied to every image in the batch, so group photos that need the same correction. JPG and WebP files stay in their format at high quality; other formats are saved as PNG. Everything is processed in your browser.

## Is rotating lossless?

Quarter turns move pixels without inventing new ones, so the picture content is unchanged. The file is still re-encoded, though, so a JPG goes through one more high-quality (95%) save. Arbitrary angles require resampling, which softens the image very slightly; avoid rotating the same file back and forth repeatedly.

## FAQ

### Does rotating remove the photo's location data?

Yes. The image is re-encoded by your browser, which drops EXIF metadata, including GPS coordinates and the orientation tag.

### Why does my rotated PDF scan still look sideways?

If the "photo" is actually a page inside a PDF, rotate the page instead with [Rotate PDF](/online-tool/pdf-tools/rotate-pdf), which changes the page's orientation without re-rendering it.

### Can I rotate by 45° to make a diamond shape?

Yes. Enter 45 as the custom angle. The output keeps the input's format, so start from a PNG or WebP if you want the new corners transparent; a JPG gets white corners. Converting a JPG to PNG first solves that.

Got a stubborn sideways photo? Straighten it in the [Image Rotator](/online-tool/image-tools/image-rotator).
