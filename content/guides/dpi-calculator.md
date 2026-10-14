---
slug: dpi-explained-how-big-can-you-print-a-photo
tool: dpi-calculator
title: 'DPI Explained: How Big Can You Print Your Photo?'
description: How pixels, DPI and print size fit together, with worked examples for A4, 10 × 15 cm and phone photos, and why changing the DPI setting adds no detail.
tags: [Images, Printing, Calculators]
---

To find out how big a photo will print, divide its pixel dimensions by the DPI you want to print at: a 3000 × 2000 pixel image at 300 DPI comes out at 10 × 6.67 inches, or 25.4 × 16.93 cm. To work backwards, multiply the print size in inches by the DPI to get the pixels you need. 300 DPI is the usual target for photos you hold in your hand, while posters viewed from a few steps away look fine at 150 to 200.

## Pixels, DPI and inches: the one relationship to remember

An image file has a fixed number of pixels. DPI (dots per inch) decides how tightly they're packed on paper. Strictly, for digital images it's PPI, pixels per inch, but print shops and most software say DPI.

- **Print size in inches = pixels ÷ DPI**
- **Pixels needed = inches × DPI**
- **Effective DPI = pixels ÷ inches**

One inch is exactly 2.54 cm (25.4 mm). The [DPI Calculator](/online-tool/image-tools/dpi-calculator) handles that for you: pick inches, centimetres or millimetres and it converts to inches before applying the formula.

## Mode 1: How big will my image print?

Choose **Print size from pixels and DPI** and enter the image's pixel dimensions and the resolution you'll print at.

Using the default example of 3000 × 2000 pixels:

| DPI | Print size (in) | Print size (cm) | Quality guide        |
| --- | --------------- | --------------- | -------------------- |
| 300 | 10 × 6.67       | 25.4 × 16.93    | Photo quality        |
| 150 | 20 × 13.33      | 50.8 × 33.87    | Fine for posters     |
| 72  | 41.67 × 27.78   | 105.83 × 70.56  | Low, blocky up close |

The pixels never change. Halving the DPI doubles the print width and height, but each pixel is twice as big on paper, so the print is less sharp.

It's also a reality check for images taken from websites: a 1200 × 800 pixel image at 300 DPI prints at only 4 × 2.67 inches, about 10.16 × 6.77 cm.

## Mode 2: How many pixels do I need?

Choose **Pixels needed for a print size** and enter the print size, unit and DPI. The result is rounded up, since rounding down would leave you just short.

Three common targets at 300 DPI:

- **A4 (210 × 297 mm):** 2,481 × 3,508 pixels, about 8.7 megapixels. The calculator shows its working: 210 mm is 8.268 inches, and 8.268 × 300 rounds up to 2,481.
- **10 × 15 cm photo print:** 1,182 × 1,772 pixels, about 2.1 megapixels.
- **6 × 4 inch print:** 1,800 × 1,200 pixels, about 2.2 megapixels.

That's why almost any modern phone photo is enough for standard prints. The challenge starts with large formats.

## Mode 3: Is my photo good enough for this print size?

Choose **DPI from pixels and print size** when you have an image and a print size in mind. The calculator reports the effective DPI and a quality verdict:

- **300 DPI or more:** photo quality, sharp even up close
- **200 to 299:** good for most prints held in the hand
- **150 to 199:** acceptable for posters and prints seen from a distance
- **72 to 149:** low; pixels may show up close, but large banners viewed from far away can work
- **Below 72:** very low; the print will look blocky

Here's a typical 12-megapixel phone photo, 4032 × 3024 pixels, printed landscape on A-series paper:

| Paper | Size (mm) | Effective DPI | Verdict       |
| ----- | --------- | ------------- | ------------- |
| A4    | 297 × 210 | 345           | Photo quality |
| A3    | 420 × 297 | 244           | Good          |
| A2    | 594 × 420 | 172           | Poster grade  |

It works out the horizontal and vertical resolution separately (for A4, 344.8 × 365.8) and reports the lower one, because that limits quality. It also warns you when the shapes differ: a phone photo is 4:3 while A-series paper is about 1.41:1, so the print will be cropped or have borders.

The same warning appears if you try 3000 × 2000 pixels on a 10 × 8 inch print: 300 DPI across, but only 250 DPI down, so the effective figure is 250. If you need to fix the shape before printing, the [Aspect Ratio Calculator](/online-tool/calculators/aspect-ratio-calculator) helps you find a crop that matches the paper.

## The DPI myth: changing the number doesn't add detail

Image files carry a DPI value in their metadata, often 72 or 300. Changing it from 72 to 300 doesn't make the image "high resolution". The pixels stay exactly the same; only the default print size changes. A 3000 × 2000 image labelled 72 DPI holds identical detail to the same image labelled 300 DPI.

Upscaling doesn't create detail either. Enlarging a small image in the [Image Resizer](/online-tool/image-tools/image-resizer) adds pixels filled in from their neighbours, so the result is bigger and softer, not sharper. If a print shop says your file is too small, the real fix is a larger original.

## Related tools

- Making ID photos at an exact printed size? Try the [Passport Photo Maker](/online-tool/image-tools/passport-photo-maker).
- Convert print sizes between inches, centimetres and millimetres with the [Length Converter](/online-tool/unit-converters/length-converter).

## FAQ

### Should I ask the print shop what DPI they want?

Yes. Most want 300 DPI at the final size. Enter their size and 300 DPI in the "pixels needed" mode and compare the result with your image.

Check your next print before you pay for it with the [DPI Calculator](/online-tool/image-tools/dpi-calculator).
