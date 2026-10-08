---
slug: how-color-blindness-simulation-works-machado-model
tool: color-blindness-simulator
title: How Color Blindness Simulation Works and How to Check a Palette
description: What protanopia, deuteranopia and tritanopia do to colors, how the Machado 2009 model simulates them, and how to find palette pairs that collide.
tags: [Color Blindness, Accessibility, Data Visualization]
---

A color blindness simulator converts each pixel of an image into the color a person with a specific color vision deficiency would roughly perceive. It does that with a small piece of linear algebra: a 3×3 matrix applied to the red, green and blue values. The result is a useful design check for charts and interfaces, but it is an approximation of typical vision, not a diagnosis of anyone's eyes.

This guide explains what the [color blindness simulator](/online-tool/color-tools/color-blindness-simulator) actually computes, walks through a real palette check, and shows how to read the numbers it gives you.

## What are the main types of color vision deficiency?

Human color vision relies on three kinds of cone cells, often called L (long wavelength, roughly "red"), M (medium, "green") and S (short, "blue"). A deficiency happens when one cone type is missing or its sensitivity is shifted.

- **Protanopia and protanomaly** affect the L cones. Reds look darker and drift toward greens and browns.
- **Deuteranopia and deuteranomaly** affect the M cones. This is the most common group. Deuteranomaly alone affects around 5% of men.
- **Tritanopia and tritanomaly** affect the S cones. They are rare and cause blue versus green and yellow versus pink confusion.
- **Achromatopsia** means almost no color vision at all, only lightness.

The "-opia" forms mean the cone type is effectively absent (dichromacy). The "-anomaly" forms mean it is present but shifted (anomalous trichromacy), which is much more common and milder. Overall, about 1 in 12 men and 1 in 200 women have some form of color vision deficiency, mostly red–green.

## How does the simulator change the colors?

The tool uses the dichromacy matrices published by Machado, Oliveira and Fernandes in 2009, at their full severity of 1.0. Those matrices were derived from a physiological model of how cone responses shift, and they are defined for **linear RGB**, not for the gamma-encoded sRGB values stored in image files. So each pixel goes through three steps:

1. **Decode.** Every 0–255 channel is converted to linear light with the standard sRGB transfer curve (the piecewise curve from IEC 61966-2-1, linear below 0.04045 and a 2.4 power above).
2. **Multiply.** The linear (R, G, B) vector is multiplied by the protan, deutan or tritan matrix.
3. **Encode.** The result is clamped to 0–1 and converted back to sRGB.

Skipping the decode step is a common mistake in simpler simulators. It makes dark colors shift too much and light colors too little.

For **achromatopsia**, the tool doesn't use a Machado matrix. It computes relative luminance in linear light, Y = 0.2126 R + 0.7152 G + 0.0722 B (the Rec. 709 weights), and shows that as a gray.

## How are the milder "-anomaly" types simulated?

When you pick **Protanomaly**, **Deuteranomaly** or **Tritanomaly**, a **Severity** slider appears (0–100% in steps of 5, starting at 60%). The tool then blends linearly between the identity matrix (normal vision) and the full dichromat matrix:

M = I + severity × (M_full − I)

At 60% deuteranomaly, for example, the first row of the matrix becomes 0.620, 0.516, −0.137, partway between normal (1, 0, 0) and full deuteranopia (0.367, 0.861, −0.228). This linear interpolation is a simplification. Machado's paper publishes separate matrices for each severity step, and the curve between them isn't perfectly straight. The blend is close enough to see how a design degrades, but it's one more reason to treat the output as an estimate.

## Worked example: checking a chart palette

The palette checker starts with six classic chart colors: `#d62728 #2ca02c #1f77b4 #ff7f0e #9467bd #8c564b`. You can type or paste your own hex colors, separated by spaces, commas or new lines. Anything that isn't a 3- or 6-digit hex value is reported as "Not a hex colour".

The table shows each color as it appears with Protanopia, Deuteranopia, Tritanopia and Achromatopsia. Under deuteranopia, the red `#d62728` becomes `#8b7c1f` and the green `#2ca02c` becomes `#968838`. Both turn into a similar olive.

Below the table, with **Deuteranopia** selected, the tool flags two pairs:

| Pair                    | ΔE original | ΔE simulated |
| ----------------------- | ----------- | ------------ |
| `#d62728` and `#2ca02c` | 72          | 4.8          |
| `#1f77b4` and `#9467bd` | 26          | 6.1          |

The red and green that were extremely different (72) become almost identical (4.8). The blue and purple pair also falls below the threshold. Switch to **Protanopia** and three pairs appear, including green versus orange, which drops from 55 to 1.4. **Tritanopia** flags none of these six colors. **Deuteranomaly** at 60% doesn't flag any either, which shows how much milder the anomalous form is.

## What does the ΔE number mean?

ΔE is the CIEDE2000 color difference, the CIE formula that measures how different two colors look to a typical observer. The tool converts both colors to CIELAB with a D65 white point and compares them. A ΔE around 2 is barely noticeable. Below about 10, two colors used side by side in a chart are easy to mix up at a glance.

The checker only reports pairs that were 10 or more apart originally and fall below 10 after simulation. Pairs that already look alike for everyone are a general contrast problem, not a color blindness one. For text and background contrast, use the [contrast checker](/online-tool/color-tools/contrast-checker) instead.

## How do I test my own image?

Drop a screenshot or photo into **Choose an image or drop it here**. It's decoded on a canvas in your browser and never uploaded. Images larger than 1,600 pixels on the long side are scaled down so the preview stays fast. Then:

- Switch between **Original**, **Simulated** and **Side by side** views.
- Press **Turn simulation off** and on again to flip quickly between the two.
- Press **Download simulated PNG** to save the result, named after your file and the mode.

Without an image, you get a built-in demo dashboard with a bar chart, a line chart, buttons and "Payment failed" and "Payment received" messages, which shows how red and green status colors can collapse.

## FAQ

### Can this tell me whether I am color blind?

No. It shows how colors may look to people with a deficiency, based on a model of average vision. For your own eyes, see an optometrist for a clinical test such as Ishihara plates.

### Which mode should I check first?

Start with Deuteranopia and Protanopia. The red–green types are by far the most common, and a palette that survives the full dichromat versions will also survive the milder forms.

### How do I fix a flagged pair?

Change the lightness of one color, not just its hue, and add labels, patterns or icons so the meaning never depends on color alone. The [color palette generator](/online-tool/color-tools/color-palette-generator) can help you try alternatives.

Paste your brand or chart colors into the [color blindness simulator](/online-tool/color-tools/color-blindness-simulator) and see which pairs need a second look.
