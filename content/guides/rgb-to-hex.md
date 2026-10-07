---
slug: convert-rgb-to-hex-for-design-handoff
tool: rgb-to-hex
title: 'RGB to HEX for Design Handoff: Getting Colors Into Code'
description: Turning a designer's RGB values into HEX codes for CSS and style guides, with the conversion math, a handoff checklist and the rounding issues to watch for.
tags: [Color, Design Handoff, CSS]
---

To convert RGB to HEX, turn each of the three channel values (0–255) into a two-digit hexadecimal number and join them after a `#`: `rgb(59, 130, 246)` becomes `3b`, `82`, `f6`, so `#3b82f6`. It's a lossless change of notation, so the color looks identical. The conversion itself takes a second; most handoff problems come from inconsistent inputs, rounding and missing transparency.

## Why handoff so often starts with RGB

Colors arrive from many places in RGB form: a color dialog in presentation or office software, a slider panel in an image editor, a brand PDF listing "R 16 G 185 B 129", or a client's email. Meanwhile, CSS, design tokens, style guides and most front-end codebases standardize on HEX because it's compact and easy to search for. Someone has to translate, and it's usually whoever is writing the code.

## How does the conversion work?

Divide each channel by 16. The whole number is the first hex digit and the remainder is the second, using a–f for 10–15:

| Channel | ÷ 16   | Remainder | Hex |
| ------- | ------ | --------- | --- |
| 59      | 3      | 11 (b)    | 3b  |
| 130     | 8      | 2         | 82  |
| 246     | 15 (f) | 6         | f6  |

Values below 16 need a leading zero: 9 becomes `09`, never just `9`. Forgetting that zero is the most common hand-conversion mistake, and it silently produces a different color.

## A worked handoff example

A designer sends three brand colors from a brand PDF:

- Primary: R 59, G 130, B 246
- Success: R 16, G 185, B 129
- Text: R 17, G 24, B 39

Pasting each into the [RGB to HEX converter](/online-tool/color-tools/rgb-to-hex) gives:

| Token             | RGB               | HEX       |
| ----------------- | ----------------- | --------- |
| `--color-primary` | rgb(59, 130, 246) | `#3b82f6` |
| `--color-success` | rgb(16, 185, 129) | `#10b981` |
| `--color-text`    | rgb(17, 24, 39)   | `#111827` |

You can paste values in whatever shape you received them. The input accepts `rgb(59, 130, 246)`, plain `59, 130, 246`, space-separated `59 130 246`, and percentages like `rgb(23%, 51%, 96%)`.

## The handoff checklist

1. **Confirm the source is RGB for screens.** If the brand guide lists CMYK or Pantone for print, ask for the digital values instead of converting those; print colors don't map cleanly to screens.
2. **Watch for decimals.** Some tools export channels like 59.6. The converter rounds each channel to the nearest whole number, so 59.6 becomes 60 and the HEX changes from `3b` to `3c`. Ask which value is canonical.
3. **Check percentages.** `rgb(23%, 51%, 96%)` converts to `#3b82f5`, one step off `#3b82f6`, because percentages are rounded to whole channel values. If you have both forms, trust the 0–255 numbers.
4. **Keep transparency.** If the designer specifies an opacity, include it: `rgba(59, 130, 246, 0.5)` converts to the 8-digit code `#3b82f680`. Or keep the solid HEX and apply opacity separately in CSS.
5. **Pick a case convention.** `#3B82F6` and `#3b82f6` are identical; choose one for the style guide so searches across the codebase find every use.
6. **Record both values.** In the style guide, list HEX and RGB side by side. The tool shows HSL, HSV and CMYK too, each with a Copy button, so you can fill in a full color spec in one pass.
7. **Check contrast before signing off.** A color that looked fine in a mock-up may fail accessibility as text. Run text and background pairs through the [Contrast Checker](/online-tool/color-tools/contrast-checker).

## How to convert RGB to HEX step by step

1. Enter the color in **RGB color**, for example `rgb(59, 130, 246)` or `59, 130, 246`. Or use the **Picker**.
2. Read the **HEX (result)** row at the top, next to a preview swatch.
3. Click **Copy** next to the value.

Values outside 0–255 (like 300) are rejected with an example of a valid input. Everything is calculated in your browser.

Need the reverse? [HEX to RGB](/online-tool/color-tools/hex-to-rgb) splits a code back into channels.

## FAQ

### Is HEX more accurate than RGB?

No. They hold exactly the same information: three channels with 256 levels each. HEX is just shorter to write.

### Can I shorten a HEX code to three digits?

Only when each pair repeats a digit: `#ffaa00` can be written `#fa0`, but `#3b82f6` has no shorthand. The converter always outputs the full six digits, which are safest for style guides.

### Why does my design tool show a slightly different HEX for the same RGB?

Usually rounding: the tool may store fractional channel values or apply a color profile to its display. When in doubt, re-enter the exact 0–255 integers and use the resulting code.

Convert your team's palette in one sitting with the [RGB to HEX converter](/online-tool/color-tools/rgb-to-hex).
