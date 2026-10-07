---
slug: rgb-to-hsl-formula-explained-step-by-step
tool: rgb-to-hsl
title: 'RGB to HSL Formula, Explained Step by Step'
description: How RGB values become hue, saturation and lightness, with two fully worked examples you can check by hand and code-friendly formulas for each step.
tags: [Color, Math, Explainer]
---

To convert RGB to HSL, scale each channel to a 0–1 range, find the largest and smallest of the three, and use them to compute lightness (their average), saturation (how far apart they are, relative to lightness) and hue (which channel is largest, and by how much the other two differ). It's five short steps, and once you've done it by hand, HSL stops feeling like magic.

Here's the full method with two worked examples.

## The five steps

Start with red, green and blue values from 0 to 255.

**Step 1: Normalize.** Divide each channel by 255 to get R, G and B between 0 and 1.

**Step 2: Find max, min and their difference.**
max = the largest of R, G, B
min = the smallest
d = max − min

**Step 3: Lightness.**
L = (max + min) ÷ 2

**Step 4: Saturation.**
If d = 0, the color is a gray and S = 0. Otherwise:

- if L ≤ 0.5: S = d ÷ (max + min)
- if L > 0.5: S = d ÷ (2 − max − min)

**Step 5: Hue.** If d = 0, hue doesn't matter (use 0). Otherwise it depends on which channel is the max:

- R is max: H = (G − B) ÷ d, plus 6 if G < B
- G is max: H = (B − R) ÷ d + 2
- B is max: H = (R − G) ÷ d + 4

Multiply H by 60 to get degrees. Finally, express S and L as percentages.

## Why does the hue formula look like that?

The color wheel is split into six 60° slices, with red at 0°, yellow at 60°, green at 120°, cyan at 180°, blue at 240° and magenta at 300°. Whichever channel is strongest tells you which third of the wheel you're in (red near 0°, green near 120°, blue near 240°, which is where the +0, +2 and +4 come from, in units of 60°). The difference between the other two channels tells you how far you lean toward the neighboring color. The "+6" just keeps red-ish hues positive instead of negative.

## Worked example 1: a warm orange-red

Convert `rgb(255, 87, 51)`.

1. Normalize: R = 1.000, G = 0.341, B = 0.200
2. max = 1.000 (red), min = 0.200, d = 0.800
3. L = (1.000 + 0.200) ÷ 2 = **0.600 → 60%**
4. L > 0.5, so S = 0.800 ÷ (2 − 1.000 − 0.200) = 0.800 ÷ 0.800 = **1.000 → 100%**
5. Red is max: H = (0.341 − 0.200) ÷ 0.800 = 0.176; × 60 = 10.6° → **11°**

Result: **hsl(11, 100%, 60%)**, a fully saturated red pushed slightly toward orange, at a fairly light level.

## Worked example 2: a typical UI blue

Convert `rgb(59, 130, 246)`.

1. Normalize: R = 0.231, G = 0.510, B = 0.965
2. max = 0.965 (blue), min = 0.231, d = 0.733
3. L = (0.965 + 0.231) ÷ 2 = 0.598 → **60%**
4. L > 0.5, so S = 0.733 ÷ (2 − 0.965 − 0.231) = 0.733 ÷ 0.804 = 0.912 → **91%**
5. Blue is max: H = (0.231 − 0.510) ÷ 0.733 + 4 = 3.620; × 60 = 217.2° → **217°**

Result: **hsl(217, 91%, 60%)**.

## A gray: the special case

`rgb(128, 128, 128)` has max = min, so d = 0. Saturation is 0% and hue is meaningless; the converter shows **hsl(0, 0%, 50%)**. Any hue with 0% saturation produces the same gray, which is why you'll sometimes see grays written with odd-looking hues in design files.

## Where rounding comes in

HSL values are rounded to whole numbers for display, as in most design tools. Hue 217.2 becomes 217, saturation 91.2% becomes 91%. That's precise enough to see and use, but it means converting back to RGB can land one step away from where you started: `hsl(217, 91%, 60%)` converts to `rgb(60, 131, 246)`, not `rgb(59, 130, 246)`. If you need an exact round trip, keep the original RGB or HEX value.

## Check your work with the converter

The [RGB to HSL converter](/online-tool/color-tools/rgb-to-hsl) runs the same calculation instantly:

1. Enter a color in **RGB color**: `rgb(255, 87, 51)`, `255, 87, 51` or `255 87 51` all work. You can also use the **Picker**.
2. The **HSL (result)** row appears first, with HEX, RGB, HSV and CMYK below it.
3. Click **Copy** next to any value.

It's a handy way to check a hand calculation or a function you're writing. The conversion runs in your browser, and an RGB value with alpha, like `rgba(255, 87, 51, 0.5)`, keeps its transparency as `hsla()`.

To go the other way, use [HSL to RGB](/online-tool/color-tools/hsl-to-rgb).

## FAQ

### Can lightness be 50% for both a dark and a bright-looking color?

Yes. Pure yellow and pure blue both have 50% lightness in HSL, yet yellow looks far brighter. HSL lightness is a geometric midpoint between the strongest and weakest channel, not a measure of how bright the color appears to the eye.

### Why is saturation 100% for some colors that don't look intense?

Saturation in HSL measures how far apart the channels are relative to lightness. A very light pink like `rgb(255, 230, 230)` has 100% saturation because the red channel is maxed out, even though the color looks pale.

### Is this formula the same one CSS uses?

Yes. It's the standard HSL model used by CSS `hsl()`, so values you calculate this way work directly in a stylesheet.

Try the formula on your own colors, then confirm it with the [RGB to HSL converter](/online-tool/color-tools/rgb-to-hsl).
