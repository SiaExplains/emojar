---
slug: photo-collage-problems-cropped-faces-and-blurry-exports
tool: photo-collage-maker
title: "Photo Collage Problems: Cropped Heads, Repeats and Soft Exports"
description: Why collage cells cut off heads, why one photo shows up twice, and how to get a sharp export for a feed or for print. Fixes for common collage snags.
tags: [Images, Collage, Troubleshooting]
---

Most collage problems come from one rule: every photo is cropped to fill its cell completely. When a photo's shape doesn't match the cell's shape, something gets cut, usually the top of a head or the edge of a group. The fixes are to drag the photo inside its cell, pick a layout whose cells match your photos, and export at a width that suits where the collage is going.

Here are the snags people hit most often in Emojar's Photo Collage Maker, and how to solve each one.

## Why is the top of someone's head cut off?

Because the cell and the photo have different proportions. Take the **2 side by side** layout on a **Square 1:1** collage. Each cell is roughly twice as tall as it is wide, an aspect of about 0.5. A typical landscape photo is 3:2, an aspect of 1.5. To fill that narrow cell, the tool can show only 0.5 ÷ 1.5 ≈ **33%** of the photo's width.

Three ways to fix it:

1. **Drag inside the cell.** Press and drag on the photo in the preview to choose which part stays visible.
2. **Change the layout.** For two landscape photos, **2 stacked** gives wide cells. Each one shows 75% of the photo's height instead of a third of its width.
3. **Change the shape.** Switching the same side-by-side layout to **Landscape 16:9** makes each cell about 0.89 wide per unit of height, so about 59% of a 3:2 photo's width shows.

The **Zoom** slider for the selected cell runs from 100% to 400%, but 100% is the widest view. A cell always stays filled, so you can't zoom out past it.

## Why does the same photo appear twice?

You have fewer photos than cells. When that happens, the tool fills the remaining cells by reusing your photos in order, so nothing is left blank. Choose a layout with the same number of cells as you have photos, or click the repeated cell and choose a different picture under **Photo for cell N**. When you first add photos, the tool automatically picks a layout that matches how many you added, if one exists.

## Which layout fits my number of photos?

There is at least one layout for every count from 2 to 9:

| Photos | Layouts                                         |
| ------ | ----------------------------------------------- |
| 2      | 2 side by side, 2 stacked                       |
| 3      | 3 columns, 1 large + 2, 1 wide + 2              |
| 4      | 2 × 2 grid, 1 large + 3                         |
| 5      | 2 + 3                                           |
| 6      | 3 × 2 grid                                      |
| 7      | 3 + 4                                           |
| 8      | 4 × 2 grid                                      |
| 9      | 3 × 3 grid                                      |

The 7- and 8-photo layouts have small cells, so they suit a wide shape such as **Landscape 16:9** better than a tall story. If one picture in a big set is clearly your best, a 6-photo layout with a featured cell often looks calmer than squeezing in everything.

## Why can't I add a tenth photo?

The limit is 9 photos. Extra files beyond that are ignored, and the **+** tile disappears once you reach nine. To swap one out, click the small **×** on its thumbnail to remove it, then add the replacement with **+**.

## My photo jumped back to the center. Why?

Choosing a new photo for a cell resets that cell's position and zoom, since the old framing was for a different picture. Pick the photo first, then fine-tune it.

## Why does my collage look soft or blurry?

Check two things.

**Export width.** The **Export width** menu offers 1080 px (social media), 2048 px and 4096 px (print). The height follows from the shape, so 4:5 at 1080 px gives 1080 × 1350 and 9:16 gives 1080 × 1920. A 1080 px collage is right for a feed but will look soft if printed large.

**Source size and zoom.** In a 3 × 3 grid exported at 1080 px, each cell is only about 330 px wide. That's fine. But at 4096 px each cell is about 1,250 px wide, and a small photo zoomed to 300% simply doesn't have the pixels to fill it sharply.

For printing, think in inches. At 300 DPI, a 6 × 4 in print needs 1800 × 1200 px, so a **Photo print 3:2** collage at 2048 px (2048 × 1365) is already enough. At 4096 px, a 3:2 collage is 4096 × 2731, about 13.6 × 9.1 in at 300 DPI.

## What are the white lines between photos?

That's the spacing. **Spacing** runs from 0% to 8% of the collage width and starts at 2%. It's filled with the **Background** color, which is white by default. Set spacing to 0% for a seamless grid, or pick a dark background for a gallery look. **Rounded corners** (0–10%) also reveal the background at each cell's corners.

## How to make a collage that works first time

1. Open the [Photo Collage Maker](/online-tool/image-tools/photo-collage-maker) and choose 2–9 photos.
2. Pick a **Layout** (each option shows its photo count) and a **Shape**: Square 1:1, Portrait 4:5 (Instagram), Story 9:16, Landscape 16:9 or Photo print 3:2.
3. Click each cell, choose its photo, drag to frame it, and adjust **Zoom (cell N)**.
4. Set **Spacing**, **Rounded corners** and **Background**.
5. Choose an **Export width** and click **Download collage**.

The file is a JPG named after the layout and size, such as `collage-4g-2048x2048.jpg`. Everything is assembled in your browser, so your photos aren't uploaded.

## FAQ

### Can I add a caption to the collage?

Not inside the collage maker. Download the collage first, then open it in [Add Text to Image](/online-tool/image-tools/add-text-to-image) to place a title or date on top.

### Can I download it as a PNG?

No. Collages are exported as JPG at 92% quality, which keeps photo collages much smaller than PNG with no visible difference.

### Does the upload order matter?

Only as a starting point. Cells are filled in the order you added the photos, and you can reassign any cell afterward.

Fix your layout and download a sharp result with the [Photo Collage Maker](/online-tool/image-tools/photo-collage-maker).
