---
slug: find-the-color-and-coordinates-of-any-pixel-in-an-image
tool: image-color-picker
title: 'How to Find the Color and Position of Any Pixel in an Image'
description: Get the exact HEX, RGB and HSL value of one pixel, plus its x and y coordinates in the original image, with a magnifier and arrow-key nudging.
tags: [Color, Images, How-to]
---

To find the colour of a specific pixel, open the image in a pixel colour picker, hover until the magnifier shows the pixel you want inside its outlined square, and click. You get the HEX, RGB and HSL codes along with the pixel's x and y position in the original image, counted from 0,0 at the top-left corner. If your click lands one pixel off, use the arrow keys to nudge the selection one pixel at a time.

## Why clicking a pixel isn't as simple as it sounds

Most images are far bigger than the space they're shown in. A 6000-pixel-wide photo displayed at about 1000 pixels means each screen pixel covers roughly six image pixels, so a plain click can only hit about every sixth one.

The [Image Color Picker](/online-tool/image-tools/image-color-picker) converts your pointer position into the image's own pixel grid, so the coordinates belong to the original file rather than the shrunken preview, and it lets you reach the pixels in between with the keyboard.

## Step by step

1. Open the [Image Color Picker](/online-tool/image-tools/image-color-picker) and drop in an image, or click to choose one. JPG, PNG, WebP, GIF and AVIF files up to 40 MB work, and nothing is uploaded.
2. The file name and dimensions appear above the image, for example `product.jpg · 6000 × 4000 px`. Then move the pointer over the image. The magnifier on the side shows an 11 × 11 pixel area around the pointer, enlarged without smoothing, with the centre pixel outlined. The panel below it reads "Under the pointer" and updates live.
3. Click or tap to pick. The panel switches to "Picked" and shows the swatch, the coordinates (such as `x 2417, y 1302`) and copy buttons for HEX, RGB and HSL.
4. To fine-tune, click the image once so it has keyboard focus, then press an arrow key to move the selection by one pixel, or hold **Shift** to move by ten. If you haven't picked anything yet, the arrows start from the centre of the image.

## A worked example: checking a button colour in a screenshot

Say a designer sends you a 2880 × 1800 screenshot from a high-density laptop screen, and you want the exact green of a "Buy now" button so you can match it in CSS.

Hover over the middle of the button, away from its rounded corners and text, and check that the magnifier shows one even shade. Click and copy the HEX code, then press the right arrow a few times and watch the values. If the code stays the same, you're on a flat area and can trust it. If it changes with every step, you're on a gradient, a shadow or compression noise.

The coordinates help too: a bug report can say exactly where the wrong green is, such as x 1640, y 1122 in the original screenshot.

## Keeping track of several colours

Every click adds the pick to **Recent picks**, a row of swatches that appears once you've picked two different colours. It keeps up to eight distinct colours, newest first. Click a swatch to bring its values back, or press **Copy all HEX** for a comma-separated list of all of them.

## Rotation, huge images and other details

**Phone photos are turned the right way first.** Cameras often save a photo sideways and store the rotation in EXIF metadata. The picker applies it before reading anything, so coordinates match the image as you see it. The [Image EXIF Viewer](/online-tool/image-tools/image-exif-viewer) shows that metadata if you're curious.

**Very large images are reduced.** To stay within browser memory limits, anything longer than 8,192 pixels on its longest side is scaled down. A 12,000 × 8,000 panorama, for example, becomes 8,192 × 5,461. The page shows an amber notice when this happens, and the coordinates then refer to the reduced size.

**HEIC photos may not open.** If your browser can't read an iPhone HEIC file, convert it first with [HEIC to JPG](/online-tool/image-tools/heic-to-jpg).

## Why the value might differ from the design file

The picker reports exactly what's stored in the pixel you chose. That stored value can still differ from the "official" colour:

- **JPEG compression** changes flat colours slightly and adds faint blocks, so neighbouring pixels may disagree by a few units.
- **Anti-aliased edges** blend shapes into their background to look smooth.
- **Colour profiles and screenshots** can shift values, especially with night-mode filters.

For brand work, use a lossless PNG or the original design file where you can.

## Related tools

- Want the overall colour scheme of an image rather than one pixel? Use the [Image Color Palette Extractor](/online-tool/color-tools/image-color-palette-extractor).
- Need to sample a colour from anything on your screen, not just an image file? The [Color Picker](/online-tool/color-tools/color-picker) has a screen eyedropper in Chrome and Edge.

## FAQ

### Do the coordinates start at 0 or 1?

At 0. The top-left pixel is x 0, y 0, and in a 6000-pixel-wide image the right-most column is x 5999.

### Does it work on a touchscreen?

Yes. Tap to pick, then check the magnifier and coordinates. For tiny details, a keyboard and the arrow keys are more precise than a finger.

### Can I pick from a transparent area?

You can, but a fully transparent pixel has no meaningful colour, so pick from opaque parts.

Find your next exact pixel with the [Image Color Picker](/online-tool/image-tools/image-color-picker).
