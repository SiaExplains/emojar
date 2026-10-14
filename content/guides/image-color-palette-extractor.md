---
slug: extract-a-color-palette-from-a-photo-or-logo
tool: image-color-palette-extractor
title: 'How to Extract a Color Palette From a Photo or Logo'
description: Turn any photo, logo or screenshot into 3 to 12 ready-to-use colour codes, with coverage percentages, CSS variables and JSON. No upload needed.
tags: [Color, Design, Images]
---

To pull a colour palette out of an image, drop it into a palette extractor, choose how many colours you want (six is a good start) and copy the swatches as HEX codes, CSS variables or JSON. Each swatch is the average colour of one group of similar pixels, and the percentage beside it tells you roughly how much of the picture it covers. If a colour you can clearly see is missing, raise the number of colours rather than starting over.

## When a palette beats picking colours one by one

Picking single pixels is perfect when you know exactly which spot you want, like the blue in a logo. A palette is better when you want the overall feel of an image: the colours of a holiday photo for a blog theme, or the main shades of a mood board. The tool looks at the whole image and summarises it for you.

## Step by step

1. Open the [Image Color Palette Extractor](/online-tool/color-tools/image-color-palette-extractor) and drop in a JPG, PNG, WebP, GIF or AVIF file (up to 40 MB). The file is read by your browser and never sent anywhere.
2. Use the **Number of colours** menu to choose 3, 4, 5, 6, 8, 10 or 12 swatches. The palette updates as soon as you change it.
3. Look at the bar across the top. Each colour's width matches its share of the image, so you can see at a glance which tones dominate.
4. Copy what you need. Every swatch has HEX, RGB and HSL rows with their own copy buttons, and below the swatches there are three bulk options: **Copy HEX list**, **Copy CSS variables** and **Copy JSON**.

For a three-colour palette, the CSS option gives you a block like this, most common colour first:

```css
:root {
  --color-1: #2F4A5C;
  --color-2: #D9C7A8;
  --color-3: #8A6B4E;
}
```

The JSON version lists each colour's HEX code, its RGB values and its share as a decimal (for example `0.412`), handy for scripts or design token files.

## What the tool actually does with your image

First, the image is shrunk so its longest side is at most 400 pixels, which is plenty for colour statistics and keeps things fast even on a phone. Pixels that are mostly transparent are skipped, so a logo on a transparent background is judged on the logo alone.

Then the remaining pixels are grouped with k-means clustering. The tool picks starting colours that are far apart from each other (a method called k-means++), assigns every pixel to its nearest starting colour, moves each starting point to the average of the pixels it collected, and repeats until the groups stop changing. Each final group becomes one swatch, sorted from largest to smallest.

The process is deterministic: the same image with the same number of colours always gives the identical palette.

## A worked example: a two-colour logo

Imagine a flat logo that is exactly half dark blue and half white, saved as a PNG with no smoothing. Ask for six colours and you'll get only two swatches, each at 50%. The tool can't invent colours that aren't there, so when an image has fewer distinct colours than you asked for, the palette is simply shorter.

The same logo as it usually appears online has soft anti-aliased edges, blends of blue and white. With six colours you'll likely see a few light blue in-between swatches with small percentages. Those are blending artefacts, not brand colours; drop to three and they merge back into the main groups.

## Why the swatches can look a little dull

Because each swatch is an average, it rarely matches any single pixel exactly. In a sunset photo, the orange group might span bright gold to dusky red, and its average lands in the middle, slightly greyer than the most vivid parts. A few other things shift the results:

- **Small accents disappear.** A red umbrella covering 1% of a beach photo gets merged into a bigger neighbouring group. Raise the count to 10 or 12 to give it room to appear.
- **JPEG compression adds noise.** Flat areas pick up faint blocky variations, which nudges the averages. A PNG export of the original artwork gives cleaner results.
- **Percentages are approximate.** They come from a sample of the reduced image, not a count of every original pixel, so treat 41% as "about two fifths", not a precise measurement.

If you need one specific, exact colour from the image, the [Image Color Picker](/online-tool/image-tools/image-color-picker) reads individual pixels at full resolution instead of averaging.

## Turning the palette into something usable

An extracted palette is a starting point, not a finished design system. Next steps that work well:

- Check text readability before using a swatch for buttons or headings. Paste the HEX codes into the [Contrast Checker](/online-tool/color-tools/contrast-checker) against white and black.
- Build lighter and darker variants or matching schemes from your favourite swatch with the [Color Palette Generator](/online-tool/color-tools/color-palette-generator).
- Need a value in another notation later, such as HSL for a theme file? The [Color Converter](/online-tool/color-tools/color-converter) handles it.

## FAQ

### How many colours should I choose?

Five or six covers most photos. Use three for a minimal theme, and 10 or 12 to find a small accent or summarise a busy illustration.

### Why did I get fewer swatches than I asked for?

The image doesn't contain that many distinct colours. Flat graphics with only a handful of colours produce a shorter palette.

Try it on your next mood board with the [Image Color Palette Extractor](/online-tool/color-tools/image-color-palette-extractor).
