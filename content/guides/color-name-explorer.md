---
slug: how-to-find-the-name-of-a-color-from-its-hex-code
tool: color-name-explorer
title: How to Find the Name of a Color From Its HEX Code
description: Why most colors have no exact name, how CIEDE2000 picks the closest one, and what the distance number tells you about how good the match really is.
tags: [Color, CSS, Design, Color Science]
---

To find the name of a color, convert its HEX, RGB or HSL value into a perceptual color space and look for the named color that sits nearest to it. Almost no color you pick will have an exact name, because there are about 16.7 million RGB values and only around a thousand common names. So the useful answer is two things: the closest name, and a distance number that says how close that name really is.

## Why doesn't every HEX code have a name?

A HEX code like `#3B7DD8` packs three numbers from 0 to 255, for red, green and blue. That gives 256 × 256 × 256 = 16,777,216 possible colors. Names are far rarer. CSS defines 148 color keywords in the CSS Color Module Level 4 specification, and those count aliases such as `gray` and `grey` separately. Even a large crowd-sourced list stays in the hundreds. Most colors therefore fall between names, and any "color name finder" is really a nearest-neighbor search.

The [Color Name Explorer](/online-tool/color-tools/color-name-explorer) searches 1,097 names from two sources. The **CSS named colours (148)** are the keywords you can type straight into a stylesheet, like `steelblue` or `rebeccapurple`. Many go back to the X11 color list used on Unix desktops, which browsers adopted in the 1990s. The **xkcd survey names (949)** come from a 2010 online survey run by Randall Munroe, the author of the xkcd comic, in which visitors typed their own names for random colors. The most agreed-upon names were published under a CC0 public domain dedication. They sound like everyday speech, such as "dusty rose", "sage" or "windows blue". The chips above the results let you search all names together or limit the match to one list.

## How is "closest" measured?

Measuring the straight-line distance between two RGB triples is easy, but it does not match what people see. Equal steps in RGB look large in some regions, like greens, and tiny in others, like dark blues. So the tool takes a few steps that follow standard color science:

1. **Linearize sRGB.** HEX values are gamma-encoded per the sRGB standard, IEC 61966-2-1. The engine undoes that curve to get linear light.
2. **Convert to XYZ and then CIELAB.** Using the D65 white point, the color is turned into CIE 1976 L\*a\*b\*. L\* is lightness from 0 to 100, a\* runs green to red, and b\* runs blue to yellow. LAB was designed so that equal distances look roughly equally different.
3. **Compare with CIEDE2000.** LAB is still uneven in places, so the CIE published a refined difference formula in 2001, CIEDE2000, now also standardized as ISO/CIE 11664-6. It adds weights for lightness, chroma and hue, plus a rotation term that fixes a known problem area in the blues. The result is a single number, ΔE (delta E).

Every one of the 1,097 colors is scored this way against your input, and the nine lowest scores are kept. The first becomes the main answer and the other eight appear under **Visually similar named colours**, each with its own ΔE.

## How should I read the ΔE number?

The page turns the distance into plain words using these bands:

| ΔE        | Label shown                |
| --------- | -------------------------- |
| under 1   | exact or indistinguishable |
| 1 to 3    | very close                 |
| 3 to 6    | close                      |
| 6 to 12   | similar                    |
| 12 and up | only loosely similar       |

A ΔE near 1 is roughly the smallest difference a trained eye notices side by side. Around 2 to 3 most people would call it the same color unless the swatches touch. Past about 10, the name describes the general family more than the specific shade. The label also says whether the match is a CSS keyword, usable directly in stylesheets, or a name from the xkcd colour survey.

## A worked example with #3B7DD8

The tool opens with `#3B7DD8`, a medium blue. Here is what it reports:

- **Closest named colour:** windows blue, `#3778BF`
- **Distance:** ΔE 3.5, labeled "close", from the xkcd colour survey
- **Values:** HEX `#3B7DD8`, RGB `rgb(59, 125, 216)`, HSL `hsl(215, 67%, 54%)`, HSB / HSV `hsv(215, 73%, 85%)`
- **Next nearest:** clear blue (ΔE 3.8) and deep sky blue (ΔE 3.9)

Now switch the chips to **CSS named colours (148)**. The best match becomes `steelblue` (`#4682B4`) at ΔE 4.8, still "close". So if you need a keyword for code, `steelblue` is your nearest option, but a human describing the color would more likely say something like "windows blue" or "clear blue".

For contrast, try `#FF8800`. Its closest name is the CSS keyword `darkorange` (`#FF8C00`) at ΔE 1.3, "very close". The two differ by only four steps of green, which almost nobody can see.

## What can I type into the input?

The **Colour (HEX, RGB, HSL or name)** field accepts forms like `#3B7DD8`, `rgb(59 125 216)`, `rgb(59, 125, 216)` and `hsl(215 67% 54%)`, or a name such as `teal` or "dusty rose". Typing a survey name works too, so you can paste a name you found in the list and see its exact values. Next to the field is a **Picker** that opens your browser's color chooser. If the text cannot be parsed, a message suggests working examples.

Below the result, **Browse named colours** lists every name. Search by name or by the start of a HEX code, then sort by **Hue**, **Brightness**, **Saturation** or **Name**. The hue sort puts greys first. Up to 300 swatches are shown at a time. Clicking any swatch copies its HEX code and loads it into the input above, so you can see its own neighbors.

If you need to convert the HEX code into other formats, the [color converter](/online-tool/color-tools/color-converter) handles more notations, and before using a named color for text, the [contrast checker](/online-tool/color-tools/contrast-checker) tells you whether it is readable on your background.

## FAQ

### Why do some names appear twice?

A few names exist in both lists with different values. CSS `teal` is `#008080`, while the xkcd survey's "teal" is `#029386`. The swatch label marks CSS keywords with "CSS".

### Is the closest name always the "right" name?

It is the nearest name in these two lists by CIEDE2000. Color naming also depends on culture, context and screen calibration, so treat it as a good description rather than an official one.

### Does my color leave my computer?

No. Both name lists ship with the page, and the matching runs in your browser.

Paste a HEX code into the [Color Name Explorer](/online-tool/color-tools/color-name-explorer) to see what it is called.
