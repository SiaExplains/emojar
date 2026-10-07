---
slug: hex-to-rgb-for-css-transparency
tool: hex-to-rgb
title: 'HEX to RGB in CSS: Adding Transparency to Brand Colors'
description: Why developers convert HEX to RGB, how to add transparency with rgb() and 8-digit HEX, and a reusable CSS variable pattern for see-through brand colors.
tags: [CSS, Color, Web Development]
---

To convert HEX to RGB, split the code into three pairs and convert each pair from hexadecimal to a number between 0 and 255: `#3b82f6` becomes `3b`, `82`, `f6`, which is `rgb(59, 130, 246)`. In CSS, the main reason to make this conversion is transparency: once you have the three channel numbers, you can add an alpha value and get a see-through version of the same color.

This guide shows the conversion, then the CSS patterns that make it worth doing.

## How does the conversion work?

Each HEX pair is a base-16 number. The first digit is worth 16 times its value, and the second is worth its face value, where a = 10, b = 11 … f = 15:

| Pair | Calculation | Value |
| ---- | ----------- | ----- |
| 3b   | 3 × 16 + 11 | 59    |
| 82   | 8 × 16 + 2  | 130   |
| f6   | 15 × 16 + 6 | 246   |

So `#3b82f6` is `rgb(59, 130, 246)`. Three-digit shorthand doubles each digit first: `#fa0` is `#ffaa00`, which is `rgb(255, 170, 0)`.

The [HEX to RGB converter](/online-tool/color-tools/hex-to-rgb) does this as you type. The `#` is optional, shorthand is expanded automatically, and you also get HSL, HSV and CMYK for the same color.

## Why convert at all? Transparency

A plain HEX code has no slot for opacity. If your design calls for "brand blue at 10% opacity" for a hover background, you need a format with an alpha channel. You have three options in CSS.

**1. rgba() or the modern rgb() syntax**

```css
.card:hover {
  background: rgba(59, 130, 246, 0.1); /* classic */
  background: rgb(59 130 246 / 10%); /* modern, same result */
}
```

Both are supported in all current browsers.

**2. Eight-digit HEX**

You can add a fourth pair to a HEX code for alpha: `#3b82f61a` is the same blue at about 10%. It's compact, but the alpha is in base 16, which makes it hard to read:

| Opacity | Alpha pair |
| ------- | ---------- |
| 100%    | ff         |
| 75%     | bf         |
| 50%     | 80         |
| 25%     | 40         |
| 10%     | 1a         |

The converter understands 8-digit HEX and shows the alpha as a decimal: `#3b82f680` comes out as `rgba(59, 130, 246, 0.502)`, because 80 in hex is 128, and 128 ÷ 255 ≈ 0.502.

**3. A CSS variable with the channels**

This is the pattern design systems use. Store the three RGB numbers once, then apply any opacity where you need it:

```css
:root {
  --brand-rgb: 59 130 246;
}

.button {
  background: rgb(var(--brand-rgb));
}
.button:hover {
  background: rgb(var(--brand-rgb) / 90%);
}
.badge {
  background: rgb(var(--brand-rgb) / 12%);
}
.focus-ring {
  box-shadow: 0 0 0 3px rgb(var(--brand-rgb) / 40%);
}
```

Change the brand color once and every tint follows. You can't do this with a HEX variable, because CSS can't split `#3b82f6` into channels on its own. That's where a HEX to RGB conversion comes in.

## Other places that expect RGB

- **JavaScript canvas and WebGL** code often works with separate red, green and blue numbers.
- **Presentation and office software** color dialogs usually ask for R, G and B values rather than a HEX code.
- **Image processing scripts** read pixels as RGB triplets.

## How to convert HEX to RGB step by step

1. Type or paste a code into **HEX color**, for example `#3b82f6`, `3b82f6` or `#fa0`. Or use the **Picker** to choose a color visually.
2. Read the **RGB (result)** row at the top of the list, and check the swatch on the left.
3. Click **Copy** next to RGB, or next to any other format you need.

If the code is invalid, for example 5 digits or a letter like "g", you'll see a message with an example of the expected format. Conversion happens in your browser.

Going the other direction, the [RGB to HEX](/online-tool/color-tools/rgb-to-hex) tool turns channel values back into a code. And before you ship a semi-transparent text color, check the final on-screen color in the [Contrast Checker](/online-tool/color-tools/contrast-checker).

## FAQ

### Does converting HEX to RGB change the color?

No. Both are notations for the same sRGB color, so `#3b82f6` and `rgb(59, 130, 246)` render identically.

### Is rgba() deprecated?

No. Modern CSS lets `rgb()` take an alpha value too, so `rgba()` is just an alias today. Both work everywhere.

### Uppercase or lowercase HEX?

It doesn't matter: `#3B82F6` and `#3b82f6` are the same color. Pick one style for your codebase and stick to it.

Convert your brand colors with the [HEX to RGB converter](/online-tool/color-tools/hex-to-rgb) and set up your CSS variables.
