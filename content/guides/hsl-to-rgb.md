---
slug: hsl-to-rgb-lightness-vs-accessible-contrast
tool: hsl-to-rgb
title: "HSL to RGB: Why Same Lightness Doesn't Mean Same Contrast"
description: Pure yellow and pure blue share 50% HSL lightness yet differ eightfold in contrast with white. Why converting HSL to RGB matters for accessible colors.
tags: [Color, Accessibility, CSS]
---

Converting HSL to RGB matters for accessibility because contrast is calculated from RGB values, not from HSL lightness. Two colors with the same HSL lightness can have wildly different contrast against white: pure yellow `hsl(60, 100%, 50%)` scores 1.07:1, while pure blue `hsl(240, 100%, 50%)` scores 8.59:1. If you design with HSL, convert to RGB and check contrast before you trust a color for text.

## The experiment: six colors, one lightness

Here are the six primary and secondary hues at full saturation and 50% lightness, converted to RGB, with their contrast ratio against a white background:

| HSL                 | RGB              | Contrast with white |
| ------------------- | ---------------- | ------------------- |
| hsl(0, 100%, 50%)   | rgb(255, 0, 0)   | 4.00:1              |
| hsl(60, 100%, 50%)  | rgb(255, 255, 0) | 1.07:1              |
| hsl(120, 100%, 50%) | rgb(0, 255, 0)   | 1.37:1              |
| hsl(180, 100%, 50%) | rgb(0, 255, 255) | 1.25:1              |
| hsl(240, 100%, 50%) | rgb(0, 0, 255)   | 8.59:1              |
| hsl(300, 100%, 50%) | rgb(255, 0, 255) | 3.14:1              |

Every row has identical "lightness", yet yellow text on white is practically invisible while blue text easily passes the strictest accessibility level. WCAG asks for at least 4.5:1 for normal body text, and only blue clears it here.

## Why does this happen?

HSL lightness is simple geometry: the average of the strongest and weakest RGB channel. It gives the green channel no special treatment.

Human eyes, however, are far more sensitive to green light than to red, and much more than to blue. The relative luminance formula used by WCAG reflects that. After converting each channel to linear light, it weights them roughly:

- **Green: 72%**
- **Red: 21%**
- **Blue: 7%**

So `rgb(255, 255, 0)` (lots of red and green) has very high luminance and looks almost as bright as white, while `rgb(0, 0, 255)` has very little. The same 50% HSL lightness hides that difference completely. This is the core reason you need the RGB values: they're the input to every contrast calculation.

## What lightness does each hue need to pass?

Say you're building a set of text colors for a design system: a blue for links, a green for success messages, an orange for warnings. Using the same lightness for all three would be tidy, but it doesn't work. Here's roughly where each one first passes 4.5:1 on white, keeping saturation steady:

| Color role     | HSL                | RGB               | Contrast |
| -------------- | ------------------ | ----------------- | -------- |
| Link blue      | hsl(220, 90%, 56%) | rgb(42, 109, 244) | 4.57:1   |
| Success green  | hsl(140, 70%, 30%) | rgb(23, 130, 59)  | 4.89:1   |
| Warning orange | hsl(30, 100%, 35%) | rgb(179, 89, 0)   | 4.83:1   |

Blue passes at 56% lightness; green and orange need to drop to around 30–35%. At 40% lightness, the green is only 2.94:1 and the orange only 3.84:1.

## A workflow for accessible HSL palettes

1. **Design in HSL.** It's still the easiest way to reason about hue and create variations.
2. **Convert each candidate to RGB** with the [HSL to RGB converter](/online-tool/color-tools/hsl-to-rgb).
3. **Check contrast** for every text and background pair in the [Contrast Checker](/online-tool/color-tools/contrast-checker). It accepts `hsl()`, `rgb()` and HEX values directly.
4. **Adjust lightness per hue**, not globally. Yellows, greens and cyans need much lower lightness than blues and purples to reach the same contrast.
5. **Record the final RGB or HEX** in your design tokens, so the tested value is exactly what ships.

## How to convert HSL to RGB step by step

1. Enter a value in **HSL color**: `hsl(217, 91%, 60%)`, `217, 91%, 60%` and even `217 91 60` are all accepted. Or use the **Picker**.
2. Read **RGB (result)** at the top of the list, with HEX, HSL, HSV and CMYK below and a swatch on the left.
3. Click **Copy** next to the format you need.

Hue wraps around the wheel, so 400° is treated as 40°. Saturation or lightness above 100% is rejected as invalid. Alpha is kept: `hsla(217, 91%, 60%, 0.5)` becomes `rgba(60, 131, 246, 0.5)`. All calculations run in your browser.

One more detail: HSL values with whole numbers can't represent every RGB color exactly, so `hsl(217, 91%, 60%)` gives `rgb(60, 131, 246)` rather than the `rgb(59, 130, 246)` it was originally measured from. For contrast purposes, a one-step difference is negligible, but use the RGB result as your final value.

## FAQ

### Is there an HSL alternative that matches perceived brightness?

Yes. Newer CSS color spaces such as OKLCH are designed so that equal lightness values look roughly equally bright across hues. They're supported in modern browsers, but HSL remains far more common in existing codebases and tools.

### Does a transparent color change the contrast?

Yes. Semi-transparent text blends with whatever is behind it, so its effective color depends on the background. Check the blended solid color rather than the HSLA value.

### Is this the formula browsers use to display hsl()?

Yes. CSS converts `hsl()` to RGB with the same standard algorithm before drawing, so the RGB values here are what your screen actually shows.

Convert your palette and check every hue separately with the [HSL to RGB converter](/online-tool/color-tools/hsl-to-rgb).
