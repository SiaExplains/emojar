---
slug: hex-to-hsl-build-color-shades-for-themes
tool: hex-to-hsl
title: 'HEX to HSL: Build Shades, Hover States and Themes'
description: Convert a brand HEX code to HSL and you can create lighter, darker and hover variants by changing one number. A practical guide with a full shade scale.
tags: [Color, CSS, Theming]
---

Converting a HEX color to HSL turns an opaque code like `#3b82f6` into three numbers you can reason about: hue 217°, saturation 91%, lightness 60%. Once you have those, making a lighter tint, a darker hover state or a full shade scale is a matter of changing the lightness value and leaving the other two alone. That's why HSL is the format of choice for theming.

## What do the three HSL numbers mean?

- **Hue (0–360°)** is the position on the color wheel: 0 is red, 120 green, 240 blue. Our blue sits at 217.
- **Saturation (0–100%)** is how intense the color is. 0% is gray; 91% is vivid.
- **Lightness (0–100%)** runs from black (0%) through the pure color (50%) to white (100%).

Compare that with HEX, where making `#3b82f6` "a bit darker" means changing all three pairs in coordinated ways that nobody can do in their head.

## Step 1: Convert your brand HEX

Paste your color into the [HEX to HSL converter](/online-tool/color-tools/hex-to-hsl). For `#3b82f6`, the **HSL (result)** row shows `hsl(217, 91%, 60%)`. The other rows give you RGB, HSV and CMYK for the same color.

## Step 2: Build a shade scale by changing lightness

Keep hue and saturation fixed and step the lightness up and down. Here's a scale from that blue:

| Use                      | HSL                | HEX       |
| ------------------------ | ------------------ | --------- |
| Subtle background        | hsl(217, 91%, 95%) | `#e7f0fe` |
| Border, selected row     | hsl(217, 91%, 85%) | `#b6d1fc` |
| Disabled or decorative   | hsl(217, 91%, 70%) | `#6da2f8` |
| Base brand color         | hsl(217, 91%, 60%) | `#3c83f6` |
| Hover or pressed         | hsl(217, 91%, 45%) | `#0a5adb` |
| Text on light background | hsl(217, 91%, 30%) | `#073c92` |
| Dark mode surface        | hsl(217, 91%, 15%) | `#031e49` |

You can check each row by pasting its HSL value into the [HSL to RGB](/online-tool/color-tools/hsl-to-rgb) tool, which shows the HEX too. Notice the base row: `hsl(217, 91%, 60%)` converts back to `#3c83f6`, not the original `#3b82f6`. HSL values are shown as whole numbers, and that rounding can shift a channel by one step on the way back. The difference is invisible, but keep your original HEX as the source of truth for the base color.

If you'd rather generate the scale automatically, the "Tints & shades" option in the [Color Palette Generator](/online-tool/color-tools/color-palette-generator) builds a similar seven-step scale in one click.

## Step 3: Put it in CSS

Modern CSS lets you split HSL into variables and compute variants:

```css
:root {
  --brand-h: 217;
  --brand-s: 91%;
  --brand: hsl(var(--brand-h) var(--brand-s) 60%);
  --brand-hover: hsl(var(--brand-h) var(--brand-s) 45%);
  --brand-soft: hsl(var(--brand-h) var(--brand-s) 95%);
}
```

Rebranding to green? Change `--brand-h` to around 160 and the whole scale follows, with the same relative lightness steps.

## Three theming patterns that rely on HSL

**Hover and active states.** Drop lightness by 8–15 points for hover and a little more for pressed. It's consistent across every color in your system.

**Dark mode.** Light themes use high-lightness backgrounds and low-lightness text; dark themes flip them. Starting from the same hue and saturation keeps the brand recognizable in both.

**Muted variants.** Lower saturation instead of lightness for disabled buttons or secondary tags: `hsl(217, 30%, 60%)` is a calmer, grayer cousin of the brand blue.

## Where HSL falls short

HSL lightness is a mathematical value, not perceived brightness. A yellow and a blue at the same 50% lightness look very different in brightness, and their contrast with white text differs enormously. So:

- Equal lightness steps can look uneven, especially for yellows and greens.
- Very high saturation at very low or high lightness can look harsh.
- Always test text colors with the [Contrast Checker](/online-tool/color-tools/contrast-checker) rather than assuming "45% lightness is dark enough".

## How to convert HEX to HSL step by step

1. Enter a HEX code in **HEX color** (with or without `#`; 3-digit shorthand works), or choose one with the **Picker**.
2. Read the **HSL (result)** row; it updates as you type.
3. Click **Copy** next to HSL or any other format.

Conversion runs in your browser.

## FAQ

### Should I store colors as HEX or HSL in my codebase?

Many teams store the source brand color as HEX for exactness and generate variants in HSL. Either works in CSS; pick what makes your variants easiest to maintain.

### What's the difference between HSL and HSV?

Both use hue and saturation, but HSV's third value, "value", treats the pure color as 100%, while HSL puts it at 50% lightness. Design apps' color pickers often use HSV; CSS uses HSL.

Start your theme from your brand color with the [HEX to HSL converter](/online-tool/color-tools/hex-to-hsl).
