---
slug: a4-vs-letter-paper-sizes-pixels-and-ratios
tool: measurement-reference
title: 'A4 vs Letter, in Pixels and Points: A Practical Size Guide'
description: Why A4 halves into A5, how to turn paper sizes into pixels at 300 dpi, and which aspect ratios, resolutions and type sizes designers reuse most.
tags: [Paper Sizes, Design, Printing, Typography]
---

A4 paper is 210 × 297 mm, or 8.27 × 11.69 inches. US Letter is 8.5 × 11 inches, or 215.9 × 279.4 mm. So Letter is slightly wider and noticeably shorter than A4. To turn either size into pixels for print, multiply the inches by the print resolution. At 300 dpi, A4 is 2480 × 3508 px and Letter is 2550 × 3300 px.

Those few numbers cover most everyday jobs, but designers keep looking up the rest: A3, 1440p, 12 pt in pixels, a YouTube thumbnail. This guide explains the systems behind them and shows how the [measurement reference](/online-tool/reference-tools/measurement-reference) lays them out.

## Why does A4 have such an odd shape?

The A series is defined by ISO 216, which grew out of the German DIN 476 standard from 1922. It rests on two rules. First, A0 has an area of one square meter. Second, every sheet has sides in the ratio 1 : √2, about 1 : 1.414.

That ratio has a useful property. Fold a sheet in half so that its long side is halved, and the two halves have exactly the same shape as the original. So A0 halves into two A1 sheets, A1 into two A2 sheets, and so on down to A6, postcard size. Rounded to whole millimeters, A0 is 841 × 1189 mm and A4 is 210 × 297 mm.

Because the shape never changes, you can scale an A4 page to A3 or A5 on a copier with no cropping or white margins. A copier's 141% and 71% presets exist for exactly this reason.

North American sizes don't follow this pattern. Letter has a ratio of 1 : 1.294, Legal is 8.5 × 14 inches, and Tabloid (also called Ledger) is 11 × 17 inches. Tabloid is two Letter sheets side by side, but its shape is different from Letter's, so scaling between them leaves gaps.

## Worked example: preparing an A4 flyer for print

Open the **📄 Paper sizes** section and click A4, either in the drawing or in the table. A4 lights up inside the nested A-series outlines, with US sizes drawn alongside at the same scale. The side panel lists:

| Format          | A4 value                 |
| --------------- | ------------------------ |
| Millimeters     | 210 × 297 mm             |
| Centimeters     | 21 × 29.7 cm             |
| Inches          | 8.27 × 11.69 in          |
| Points          | 595 × 842 pt             |
| Pixels, 300 dpi | 2480 × 3508 px @ 300 dpi |
| Pixels, 96 dpi  | 794 × 1123 px @ 96 dpi   |

Below the list, the ratio reads 1 : 1.414, with a note that halving keeps the shape.

Each figure comes from the same chain. Divide millimeters by 25.4 to get inches. Then multiply by 72 for points, or by the pixel density for pixels: 210 ÷ 25.4 × 300 = 2480.3, rounded to 2480. A print shop asking for "A4 at 300 dpi" wants a canvas of 2480 × 3508 pixels. The 96 dpi figure is the size of an A4 page in CSS pixels, which is useful when you build a printable web page.

Click any value to copy it exactly as shown. Now click Letter and compare: 612 × 792 pt and 2550 × 3300 px at 300 dpi. A layout made for A4 loses about 18 mm of height on Letter, which is why page footers sometimes spill onto a second page.

## How do aspect ratios and resolutions fit together?

An aspect ratio is width divided by height, written as two whole numbers. The **▭ Aspect ratios** section draws eight common ones to scale. They include 16:9 (1.778 : 1) for HD video and most monitors, 16:10 for many laptops, 4:3 for older screens and iPads, 21:9 for ultrawide monitors, and 9:16 for phone Stories and Shorts.

The **🖥️ Screen & image sizes** section nests seven resolutions, from QVGA (320×240) to 8K UHD (7680×4320), all drawn from the same corner. The table reduces each one to its simplest ratio and gives the megapixel count. Full HD is 1920×1080, 16:9, 2.1 MP. 4K UHD is exactly four Full HD frames, 8.3 MP. 8K quadruples that again to 33.2 MP. Notice that VGA is 4:3 while everything from 720p up is 16:9, a record of the move to widescreen.

## What is the difference between px, pt and rem?

Points come from print. One point is 1/72 of an inch. CSS fixes 1 inch at 96 pixels, so 1 pt is 1.333 px and 1 px is 0.75 pt. This holds no matter how dense the physical screen is.

The **🔤 Typography units** section lists 13 common sizes from 10 px to 64 px, each with its point size, its rem value and a live preview. A **Base font size** menu offers 14, 15, 16, 18 and 20 px and recalculates the rem column. At the default 16 px base, 12 px is 9 pt or 0.75 rem, and 24 px is 18 pt or 1.5 rem. Change the base to 20 px and the same 24 px becomes 1.2 rem.

The **📱 Social media sizes** section lists recommended image sizes for Instagram, Facebook, X (Twitter), LinkedIn, YouTube and Pinterest. For example, an Instagram portrait post is 1080×1350 and a YouTube thumbnail is 1280×720. Platforms do revise these from time to time.

## Related tools

To find a missing width or height for any ratio, use the [aspect ratio calculator](/online-tool/calculators/aspect-ratio-calculator). To crop a photo to one of the social sizes, the [social media image resizer](/online-tool/image-tools/social-media-image-resizer) uses the same presets. For every CSS unit side by side, try the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer).

## FAQ

### Is A4 the same as 8.5 × 11?

No. 8.5 × 11 inches is Letter. A4 is about 6 mm narrower and 18 mm taller.

### What dpi should I use for print?

300 dpi is the common standard for photos and flyers viewed up close. Large posters seen from a distance often print fine at 150 dpi.

### Why does 12 pt text look like 16 px?

Because they are the same size in CSS: 12 × 96 ÷ 72 = 16.

Find the size you need in the [measurement reference](/online-tool/reference-tools/measurement-reference).
