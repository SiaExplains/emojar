---
slug: fix-black-bars-and-stretching-with-aspect-ratio-math
tool: aspect-ratio-calculator
title: Black Bars, Stretched Faces and Odd Pixel Sizes, Fixed
description: Letterboxing, squashed exports and blurry thumbnails usually come from one mismatched number. Learn to spot it and work out the size that keeps proportions.
tags: [Images, Video, Troubleshooting]
---

Black bars, stretched faces and slightly blurry exports almost always have the same cause: the width and height you are using don't share the shape of the source or the screen. Work out the source's aspect ratio, compare it with the target, and then calculate the missing side instead of guessing. Once both sides follow the same ratio, the image fits without bars or distortion.

Here are the most common symptoms, what causes each one, and the numbers that fix them, all checked with the [Aspect Ratio Calculator](/online-tool/calculators/aspect-ratio-calculator).

## Why does my video have black bars?

Bars appear when a player keeps the picture's proportions inside a frame of a different shape. Bars at the top and bottom (letterboxing) mean the content is wider than the screen. Bars on the sides (pillarboxing) mean it's narrower.

A common case: an ultrawide monitor clip at 2560 × 1080 played on a 16:9 TV. The calculator gives **64:27** with a decimal of **2.37037 : 1** and names the closest standard as **21:9 (ultrawide)**. A 16:9 screen is 1.77778 : 1, so the clip is much wider and gets bars above and below. That isn't a fault. The only ways to remove those bars are to crop the sides or to stretch the picture.

The reverse happens with phone footage. Enter 1080 × 1920 and you get **9:16**, orientation **Portrait**. On a landscape screen that means wide side bars, unless you edit for a vertical format.

## Why do faces look stretched or squashed?

Distortion happens when width and height are scaled by different amounts. Typing a new width into an export dialog while also typing a "standard" height is the usual culprit.

Say a 3:2 camera photo is 6000 × 4000 and you need it 1920 px wide. Many people type 1920 × 1080 out of habit. Enter 6000, 4000 and a **New width (optional)** of 1920, and the calculator returns **Height for 1,920 wide: 1,280 px (exact 1,280)**. Forcing it to 1080 squashes everything vertically by about 16 %. Either export 1920 × 1280, or crop to 16:9 first and then resize.

## Why isn't my screen resolution a clean ratio?

Some sizes that are sold as 16:9 aren't quite. The popular laptop resolution 1366 × 768 simplifies to **683:384**, with a decimal of **1.77865 : 1**. It's close enough that the calculator still lists **16:9 (widescreen)** as the closest standard, but the **Common sizes at this ratio** table marks every row as **Rounded**, because no common width scales to a whole number of pixels.

Similarly, 3440 × 1440 ultrawides are **43:18** (2.38889 : 1), and the nearest standard shown is **2.39:1 (anamorphic)**, not 21:9. When a size is clearly between standards, the result says how far off the nearest one is. A 1000 × 700 image is **10:7**, and the closest standard reads **3:2 (5 % off)**.

## Why is my resized image slightly blurry?

Scaling to a size that needs a fractional pixel forces the software to round and resample. For a 1920 × 1080 source, entering a **New width (optional)** of 1000 gives **563 px (exact 562.5)**. That half pixel has to go somewhere.

The **Common sizes at this ratio** table helps you avoid this. For 16:9 it lists widths from 320 to 3840, and every row is marked **Yes** (exact) except 854, which needs 480.375 px and is marked **Rounded**. Picking 1280 × 720 or 640 × 360 keeps the scaling clean.

For a 4:3 photo at 4000 × 3000 that needs to be 1080 px high, entering 1080 as **New height (optional)** returns **Width for 1,080 high: 1,440 px (exact 1,440)**, a perfect fit.

## Step by step

1. Enter the source **Width** and **Height**. The fields are labeled in px, but any unit works because only the proportion matters.
2. Read **Aspect ratio**, **Decimal**, **Closest standard** and **Orientation**. Results update as you type.
3. To resize, fill in either **New width (optional)** or **New height (optional)**. If both are filled, only the new width is used, so clear one before switching direction.
4. Open **Common sizes at this ratio** to find widths that scale exactly.

Everything is calculated in the browser. When you have the numbers, the [Image Resizer](/online-tool/image-tools/image-resizer) can apply them, and the [Image Cropper](/online-tool/image-tools/image-cropper) handles a change of shape.

## A quick diagnostic table

| Symptom                     | Likely cause                         | Fix                                   |
| --------------------------- | ------------------------------------ | ------------------------------------- |
| Bars top and bottom         | Content wider than screen            | Accept, or crop the sides             |
| Bars left and right         | Content narrower than screen         | Accept, or crop top and bottom        |
| Stretched or squashed       | Width and height set independently   | Calculate the second side             |
| Soft edges after resize     | Fractional target pixels             | Pick a size marked Yes                |

## FAQ

### Can I use it for print sizes in inches?

Yes. Enter 8 and 10 for an 8 × 10 in print and you get 4:5. The px label is only a label.

### Why does the ratio show huge numbers like 683:384?

The calculator reduces the two sides by their greatest common divisor and shows the exact result. When the sides share only a small factor, the reduced ratio stays large. The decimal and closest standard are easier to read in that case.

### Does the calculator change my image?

No. It only does the math. Use the numbers in an editor or resizer.

Find the exact size for your next export with the [Aspect Ratio Calculator](/online-tool/calculators/aspect-ratio-calculator).
