---
slug: remove-white-background-from-logo-or-signature
tool: image-background-remover
title: Remove a White Background From a Logo or Signature
description: Turn a logo, scanned signature or product shot on white into a transparent PNG. A walkthrough of tolerance, edge softness and the two removal modes.
tags: [Images, Transparent PNG, How-to]
---

To remove a white or solid-color background, load the image, let the tool detect the background color from the border, then raise the tolerance until the background disappears while the subject stays intact, and save it as a transparent PNG. This color-based approach works best for logos, signatures, scanned drawings, screenshots and product shots on plain backdrops. It isn't designed to cut a person out of a busy street photo.

Let's walk through two real jobs: a scanned signature and a company logo.

## Job 1: A scanned signature for documents

You signed a sheet of white paper, photographed it, and want to place the signature on a PDF or in an email footer without a white box around it.

**Before you start:** crop tightly around the signature and make sure the photo is evenly lit. A shadow from your phone across half the page is the most common reason this fails, because the "white" on one side is really light gray.

1. Open the [Background Remover](/online-tool/image-tools/image-background-remover) and choose the image.
2. The tool averages the colors along the image's border and uses that as the background color, shown as a swatch with its RGB value, for example `rgb(246, 244, 240)` for slightly warm paper.
3. The preview updates immediately on a checkerboard, where checkerboard = transparent.
4. If gray paper speckles remain, raise **Tolerance**. If the thin ends of pen strokes start vanishing, lower it.
5. Click **Create transparent PNG** and download the file, which is saved with `-no-bg` in its name.

## What does "tolerance" actually measure?

Every pixel's color is compared with the background color as a distance in RGB space. Tolerance is that distance as a percentage of the largest possible distance (pure black to pure white). Pixels within the tolerance become fully transparent.

A worked example with a white background, `rgb(255, 255, 255)`:

| Pixel                   | Color              | Distance from white | At 12% (default) | At 25%  |
| ----------------------- | ------------------ | ------------------- | ---------------- | ------- |
| Faint shadow            | rgb(235, 235, 235) | about 8%            | Removed          | Removed |
| Pale yellow in the logo | rgb(245, 225, 170) | about 21%           | Kept             | Removed |
| Dark blue ink           | rgb(20, 40, 120)   | about 78%           | Kept             | Kept    |

The default of 12% removes paper and faint shadows but keeps that pale yellow. Push it to 25% and the yellow disappears along with the background. That's the whole tuning game: find the value that sits between your background and the lightest part of your subject.

**Edge softness** handles the in-between pixels. Colors just beyond the tolerance (between 12% and 16% with the default settings) are made partially transparent instead of staying fully opaque, so anti-aliased edges blend smoothly instead of leaving a jagged white fringe. The default is 4%; raise it if you see a light halo when the PNG is placed on a dark background.

## Job 2: A logo with holes in the letters

Your logo has the letters "OBA" in navy on white. After removal, the outside is transparent, but the inside of the O, B and A is still white. Why?

The default mode, **Connected background only**, removes background pixels connected to the corners of the image, spreading outward from all four corners. That's deliberate: it protects white details _inside_ your subject, like the whites of eyes in a mascot or a white highlight on a product. The enclosed counters of letters aren't connected to the corners, so they're kept.

For a logo, switch **Remove** to **All matching pixels**. Now every pixel close to the background color is removed, wherever it is, and the holes in the letters become transparent too.

| Mode                      | Removes                                 | Best for                                                    |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Connected background only | Background touching the image's corners | Product photos, mascots, anything with white details inside |
| All matching pixels       | Every pixel near the background color   | Logos, text, signatures, line art                           |

## Troubleshooting

- **Nothing is removed in connected mode.** The flood starts at the four corners, so if a corner contains part of the subject or a different color (a dark vignette, a scanner edge), it can't spread. Crop off the edges first with the [Image Cropper](/online-tool/image-tools/image-cropper).
- **The wrong color was detected.** Click directly on a background area in the preview to set the color manually.
- **The background has a gradient.** Increase tolerance gradually; if the subject starts disappearing before the gradient does, this tool isn't the right fit for that image.
- **"This image is very large."** Images over 16 megapixels are refused to keep the live preview smooth. Shrink them first with the [Image Resizer](/online-tool/image-tools/image-resizer).

All the pixel work happens in your browser, so a scanned signature never leaves your device, which is exactly where it should stay.

## FAQ

### Can I get a JPG with a transparent background?

No. JPG has no transparency channel, which is why the output is always PNG. If you open it somewhere that doesn't support transparency, the transparent areas will usually appear white or black.

### How do I check the result before using it?

Insert the PNG on a dark slide or page. Any leftover white fringe or speckles show up immediately against a dark background.

### Does it work on photos of people?

Only if they're against a genuinely plain, evenly lit backdrop such as a studio wall. Separating a person from a busy scene requires a much larger AI segmentation model, which this tool deliberately doesn't load.

Have a logo or signature on white? Make it transparent with the [Background Remover](/online-tool/image-tools/image-background-remover).
