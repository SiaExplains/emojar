---
slug: how-to-find-the-exact-color-from-an-image-or-logo
tool: color-picker
title: How to Get the Exact Color Code From a Logo or Screenshot
description: Need the HEX code of a brand color you only have as an image? A walkthrough of picking it accurately, and why your first click is often slightly off.
tags: [Color, Design, How-to]
---

To get the exact color code from a logo or screenshot, open the image in a color picker, click the middle of a large, flat area of that color, and copy the HEX or RGB value it reports. Avoid edges, shadows and gradients, and click two or three spots to make sure you get the same value each time. If the color still varies, the image itself is the problem, and an official brand guide is the only truly exact source.

Here's the full walkthrough, including the reasons a pick can come out slightly wrong.

## The scenario: matching a client's brand color

You're building a slide deck or web page for a client, and all you have is their logo as a PNG from their website. You need its blue as a HEX code for your design tool and as RGB for a presentation template.

## Step 1: Load the image

Open the [Color Picker](/online-tool/color-tools/color-picker). Under **Pick a color from an image**, drop the logo file into the upload area or click to choose it. JPG, PNG, WebP and GIF all work. The image is drawn on the page and never uploaded, so this is fine for unreleased designs and client files.

Large images are scaled down to a maximum width of 800 pixels for display. That doesn't change flat colors, but it does matter for the tips below.

## Step 2: Click a solid area

Your cursor becomes a crosshair over the image. Click near the center of the thickest part of the colored shape, not on an edge or a thin line. The swatch and all five codes update immediately:

- **HEX**, e.g. `#1d4ed8`
- **RGB**, e.g. `rgb(29, 78, 216)`
- **HSL**, e.g. `hsl(224, 76%, 48%)`
- **HSV** and **CMYK** for reference

## Step 3: Verify with a second and third click

Click two other points inside the same solid area. If all three give the same HEX code, you've got it. If they differ by a digit or two, see the troubleshooting section below.

## Step 4: Copy the format you need

Each row has its own **Copy** button. Use HEX for design tools and CSS, RGB for presentation software and many office apps, and HSL if you plan to build lighter and darker variants.

## Why is my picked color slightly off?

A picker reports exactly the pixel you clicked. The pixel just might not be the "true" color.

| Cause                 | What happens                                                                         | Fix                                                               |
| --------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Anti-aliasing         | Edge pixels are blended with the background to look smooth                           | Click well inside the shape                                       |
| JPEG compression      | Flat areas get faint blocky noise, so neighboring pixels differ slightly             | Use a PNG or SVG source if possible                               |
| Downscaling           | Thin lines and small text blend with their surroundings when an image is shrunk      | Pick from a large solid area, not a hairline                      |
| Shadows and gradients | The color genuinely changes across the shape                                         | Decide which point represents the brand color                     |
| Screenshots           | Color management, night-mode filters or display settings can shift what was captured | Turn off color filters before capturing, or use the original file |
| Transparency          | Semi-transparent pixels are picked as they appear over the page background           | Pick from fully opaque areas                                      |

## Other ways to pick a color

**Pick from screen.** In Chrome and Edge, a **💧 Pick from screen** button appears next to the color input. Click it, then click anywhere on your screen, including other windows and apps, to sample a pixel. It's the fastest way to grab a color from a website or design tool you have open. Firefox and Safari don't support this browser feature yet, so the button doesn't appear there; use the image upload instead.

**Choose a color.** The color input opens your system's color chooser if you want to pick or adjust a color by hand.

## What to do with the color next

- Check it's readable: run the color against white and black text in the [Contrast Checker](/online-tool/color-tools/contrast-checker) before using it for buttons or text.
- Build a scheme around it with the [Color Palette Generator](/online-tool/color-tools/color-palette-generator).
- Need it in another format later? The [Color Converter](/online-tool/color-tools/color-converter) takes any HEX, RGB or HSL value.

## FAQ

### Can I pick a color from a PDF?

Not directly. Take a screenshot of the page or export it as an image, then load that. Expect small shifts if the PDF uses print (CMYK) colors.

### Why does the picked CMYK value differ from the brand's print spec?

The CMYK shown is a simple mathematical conversion from screen colors. Real print values depend on paper, ink and printer profiles, so always use the CMYK numbers from the brand's style guide for printing.

### Can I pick several colors from the same image?

Yes. Click as many points as you like; the codes update with each click. Copy each one before moving on, because only the latest pick is shown.

Grab your next color in seconds with the [Color Picker](/online-tool/color-tools/color-picker).
