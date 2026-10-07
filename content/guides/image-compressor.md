---
slug: how-image-compression-works-quality-slider-explained
tool: image-compressor
title: How Image Compression Works (and What the Quality Slider Does)
description: Why does a 75% quality JPG look identical to the original at a fraction of the size? Learn what compression throws away and how to pick settings.
tags: [Images, Compression, Explainer]
---

Image compression makes a file smaller by storing the picture more efficiently, and, with lossy formats like JPG and WebP, by discarding detail your eyes are unlikely to notice. The quality slider controls how much is discarded: lower numbers mean smaller files and more visible artifacts. For most photos, a setting around 70–80% cuts the file size dramatically while looking the same at normal viewing size.

Understanding _why_ that works makes it much easier to choose settings instead of guessing.

## Why are photos so big in the first place?

Start with the raw numbers. A typical 12-megapixel phone photo is 4032 × 3024 pixels. Each pixel has red, green and blue values of one byte each, so the uncompressed picture is:

4032 × 3024 × 3 bytes ≈ **36.6 MB**

Nobody stores photos that way. Your phone already compresses them, which is why the file is a few megabytes rather than 36. Compressing again for the web or email is about choosing a different balance between size and fidelity than your camera did.

## What does lossy compression actually throw away?

JPG and WebP exploit two facts about human vision:

1. **We notice brightness more than color.** The encoder can store color information at lower precision than brightness with little visible change.
2. **We notice broad shapes more than fine texture.** The image is split into small blocks, and each block is described as a mix of smooth gradients and finer patterns. Lower quality settings round off the fine patterns more aggressively.

At high quality, the rounding is invisible. Push the slider down and you start to see the side effects: blocky patches in smooth skies, "mosquito noise" around sharp edges, and smeared fine texture like hair or grass.

## Why does PNG barely shrink?

PNG is lossless. It finds repeated patterns and stores them compactly, but it never discards information. That works brilliantly for screenshots and flat graphics with large areas of one color, and poorly for photos, which are full of tiny random variations.

So "compressing a PNG" usually means one of two things:

- **Converting it** to WebP or JPG (lossy), or
- **Making it smaller in pixels**, which reduces the amount of data no matter the format.

That's why, in the Emojar compressor, choosing PNG as the output format disables the effect of the quality slider. The tool tells you so, and suggests WebP, JPG or a max width instead.

## The biggest lever most people ignore: pixel dimensions

File size scales roughly with the number of pixels. Halving the width (and height, with the aspect ratio kept) leaves a quarter of the pixels.

A worked example with that 4032 × 3024 photo:

| Max width | Resulting size | Pixels  | Share of original pixels |
| --------- | -------------- | ------- | ------------------------ |
| none      | 4032 × 3024    | 12.2 MP | 100%                     |
| 2000 px   | 2000 × 1500    | 3.0 MP  | about 25%                |
| 1200 px   | 1200 × 900     | 1.1 MP  | about 9%                 |

If the image will be shown in a blog post 800 pixels wide, sending 12 megapixels is pure waste. Setting a max width of 1600 (enough for high-density screens) often saves more than any quality tweak.

## Choosing settings: a cheat sheet

| Situation                     | Format                            | Quality | Max width            |
| ----------------------------- | --------------------------------- | ------- | -------------------- |
| Photo for email or a chat app | JPG                               | 75–80%  | 1600–2000 px         |
| Photo for your own website    | WebP                              | 70–80%  | 2× the display width |
| Product shot on white         | JPG or WebP                       | 80–85%  | as needed            |
| Screenshot with text          | Keep PNG, or WebP at high quality | 85%+    | leave blank          |
| Already-optimized image       | Keep original format              | —       | —                    |

## How to compress images with the tool

1. Open the [Image Compressor](/online-tool/image-tools/image-compressor) and add one or more images (JPG, PNG and WebP are the main targets).
2. Choose an **Output format**: "Keep original format", JPG, WebP (smallest) or PNG (lossless).
3. Set **Quality** (10–95%, default 75%) and, optionally, **Max width** in pixels. Wider images are scaled down to that width with their aspect ratio kept; images that are already narrower keep their size.
4. Click **Compress**. Each result shows its new size, and a summary line shows the total before and after with the percentage saved.
5. Download individual files or use "Download all".

Compression runs in your browser, so the photos stay on your device. As a side effect, re-encoding strips EXIF metadata such as GPS location, which is usually what you want before sharing.

## What if the "compressed" file is bigger?

That happens with images that were already well optimized. If the result in the same format, at the same size, would be larger than the original, the tool keeps the original and labels it "already optimised — original kept". Try WebP or a max width if you still need it smaller.

## FAQ

### Does compressing the same JPG twice keep shrinking it?

Only a little, and each pass adds artifacts. Compress once from the best original you have, with the setting you actually need.

### Is a lower quality number always a smaller file?

Almost always, but the gains flatten out. Going from 95% to 80% often saves a lot; going from 50% to 40% saves little while visibly hurting the image.

### Should I compress images before putting them in a PDF?

Yes, if size matters. Images usually dominate a PDF's size, so shrinking them first keeps the final document small without touching its text.

Try a couple of quality settings side by side in the [Image Compressor](/online-tool/image-tools/image-compressor) and keep the smallest one that still looks right to you.
