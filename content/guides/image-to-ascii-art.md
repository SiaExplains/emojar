---
slug: how-image-to-ascii-art-conversion-works
tool: image-to-ascii-art
title: How Image to ASCII Art Works, From Pixels to Characters
description: How a photo becomes a picture made of text. Brightness, cell size, character ramps and why rows are halved, with a worked example you can check yourself.
tags: [ASCII Art, Images, Explainer]
---

An ASCII art converter divides an image into a grid of small cells, measures how bright each cell is, and replaces it with a character whose "ink" matches that brightness: dense characters like `@` and `#` for dark cells, light ones like `.` and a space for bright cells. Because a text character is about twice as tall as it is wide, each cell is twice as tall as it is wide too, which keeps the picture from stretching.

That's the whole idea. The details are where the results get good or bad, so here's each step as the [Image to ASCII Art](/online-tool/image-tools/image-to-ascii-art) converter does it.

## Step 1: shrink the image to a workable size

A 4000 × 3000 phone photo has 12 million pixels, far more than any ASCII picture can use. The converter first scales the image so its longest side is at most 1,200 pixels, so that photo becomes 1200 × 900. Even at the widest setting, each character still averages a block of several pixels, so nothing visible is lost and the preview updates quickly.

## Step 2: lay a grid of cells over it

The **Width** slider sets the number of characters per line, from 20 to 240, starting at 100. The cell width is the image width divided by that number, and the cell height is twice the cell width.

For the 1200 × 900 example at 100 characters:

- Cell width: 1,200 ÷ 100 = **12 pixels**
- Cell height: 12 × 2 = **24 pixels**
- Rows: 900 ÷ 24 = 37.5, rounded to **38 rows**

So you get 100 × 38 characters, and the tool shows that count just above the preview. A square image at the same width gives 50 rows; a portrait one gives more rows than columns. Width can't exceed the image's own pixel width, since a cell can't be smaller than one pixel.

## Step 3: measure each cell's brightness

For each cell, the converter averages the red, green and blue values of all its pixels. Fully or partly transparent pixels are treated as white, like a page behind them, so a logo with a transparent background comes out on blank space instead of a solid block.

The average color becomes a single brightness value using the standard luminance weights:

> brightness = 0.2126 × red + 0.7152 × green + 0.0722 × blue

Green counts most because human eyes are most sensitive to it. A pure green cell reads as fairly bright, while pure blue, despite being a vivid color, reads as dark.

## Step 4: pick a character from the ramp

A character set, often called a ramp, is ordered from darkest to lightest. The brightness, from 0 to 1, picks a position along it. The built-in **Characters** options are:

| Option                | Ramp (dark → light)          | Levels |
| --------------------- | ---------------------------- | ------ |
| Standard              | `@%#*+=-:.` and a space      | 10     |
| Detailed (70 levels)  | from `$@B%8&WM#*` down to `.` and a space | 70 |
| Blocks                | `█▓▒░` and a space           | 5      |
| Two-tone              | `#` and a space              | 2      |
| Custom                | whatever you type            | 2 or more |

More levels mean smoother shading but noisier texture. Standard is easy to read at a glance; Detailed suits large widths and photos; Blocks looks like a low-resolution pixel image; Two-tone works like a stencil.

For **Custom**, type your ramp in the **Dark → light characters** box, starting with the darkest. You need at least two characters.

## A worked example

Here's a tiny test image: a black disc on a white square, 40 × 40 pixels, converted with the Standard ramp at a width of 20. Cells are 2 × 4 pixels, so it comes out 20 × 10 characters:

```text

       :++++:
    .*@@@@@@@@*.
   :@@@@@@@@@@@@:
   @@@@@@@@@@@@@@
   @@@@@@@@@@@@@@
   :@@@@@@@@@@@@:
    .*@@@@@@@@*.
       :++++:

```

Cells fully inside the disc average to black and get `@`. Cells on the edge are part black, part white, so they land in the middle of the ramp: `*`, `+`, `:` and `.`. Those in-between characters are what make the curve look smooth. The disc is exactly round in pixels, but it appears round in text only because the rows were halved: 20 columns but 10 rows.

The empty first and last lines are real rows of white. Spaces at the end of each line are trimmed, so the copied text carries no trailing whitespace.

## What do Invert and Colour change?

**Invert (for dark backgrounds)** flips the ramp, so bright areas get dense characters. Use it when the art will be shown as light text on a dark background, like a terminal. The preview and the PNG switch to a dark background to match.

**Colour** keeps the same characters but paints each one in the average color of its cell. You'll see it in the preview and in the PNG download. Plain text has no way to store color, so **Copy text** and the **.txt** download are always monochrome.

## Getting good results

- **Start with contrast.** A face lit from one side, a silhouette or a logo on a plain background converts well. A busy, evenly lit scene turns into uniform texture.
- **Match width to where it goes.** Around 60 to 80 characters fits a code comment or chat message; 150 or more suits a PNG or a printed poster.
- **Use a monospace font.** Every character has to be the same width. Paste into a code block or a plain-text editor.

The conversion runs in your browser, so the image isn't uploaded.

## FAQ

### Why do lighter areas sometimes look busier than dark ones?

Light characters like `:` and `.` are small and scattered, so the eye notices them as texture. Try a ramp with fewer light characters, or Two-tone for a cleaner, poster-like look.

### Does the PNG download match the preview?

Yes. It uses the same characters and the same light or dark background, drawn in a 14-pixel monospace font with a small margin around the art.

### Can I use emoji or letters in a custom ramp?

Any characters work, but the result only lines up if they're the same width in your font, and emoji usually aren't. Stick to characters that render at the same width, like letters, digits and punctuation.

Try these settings on your own picture with [Image to ASCII Art](/online-tool/image-tools/image-to-ascii-art).
