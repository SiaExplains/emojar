---
slug: why-colors-fail-wcag-contrast-and-how-to-fix
tool: contrast-checker
title: Why Your Colors Fail WCAG Contrast (and How to Fix Them)
description: 'Gray text that looks fine, a brand blue that fails, white on yellow: the most common WCAG contrast failures, what causes them, and how to fix each one.'
tags: [Accessibility, Color, Troubleshooting]
---

Colors fail WCAG contrast when the text and background are too close in luminance, meaning perceived brightness, not hue. WCAG 2.2 level AA requires a ratio of at least 4.5:1 for normal text and 3:1 for large text and UI components. The usual fix is to darken the text (or lighten the background) in small steps until the ratio clears the threshold, while keeping the same hue.

Below are the failures designers run into most, with real numbers.

## How is the contrast ratio calculated?

Each color's relative luminance is computed from its RGB values, weighting green most heavily, then red, then blue, because that's how sensitive our eyes are to each. The ratio is (lighter + 0.05) ÷ (darker + 0.05). It runs from 1:1 (identical colors) to 21:1 (black on white).

The thresholds, from the [WCAG 2.2 contrast criterion](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html):

| Check                                   | AA    | AAA   |
| --------------------------------------- | ----- | ----- |
| Normal text                             | 4.5:1 | 7:1   |
| Large text (24px, or about 18.7px bold) | 3:1   | 4.5:1 |
| UI components and icons                 | 3:1   | –     |

## Failure 1: The "almost passing" gray

`#777777` on white looks perfectly readable to most people and scores **4.48:1**, which fails AA for normal text. One step darker, `#767676`, scores **4.54:1** and passes. There's no rounding up: 4.48 is a fail.

**Fix:** darken gray text a notch or two. If you're using a ready-made gray scale, `#6b7280` scores 4.83:1 and passes, while `#9ca3af` scores only 2.54:1 and is fine for disabled states or decoration only.

## Failure 2: The brand blue on white

Mid-tone brand colors are the most common failure. A popular UI blue, `#3b82f6`, scores **3.68:1** on white. That passes for large text and for UI components like button borders and icons, but fails for body text and normal-size links. One shade darker, `#2563eb`, scores **5.17:1** and passes for everything at AA.

**Fix:** keep the bright blue for big headings, icons and filled buttons with large labels, and use a darker shade for text links.

## Failure 3: White text on yellow, orange or light green

White on `#ffcc00` scores **1.51:1**: a clear fail at every level. Black on the same yellow scores **13.89:1**. Yellows, oranges, light greens and cyans are bright by nature, so white text on them almost never works.

**Fix:** use dark text on bright backgrounds. If the design demands white text, darken the background substantially, for example to a deep amber or forest green, and recheck.

## Failure 4: Placeholder text and disabled-looking labels

Placeholder text in form fields is often a light gray around 2.5:1. WCAG doesn't exempt placeholders that convey information. **Fix:** darken the placeholder or, better, use a visible label above the field.

## Failure 5: Semi-transparent text

Text set at, say, 60% opacity blends with the background, so its real color isn't the one in your CSS. The checker works with solid colors and ignores alpha. **Fix:** find the color the text actually appears as on screen, for example with a color picker on a screenshot, and test that.

## Failure 6: Text over images and gradients

A single ratio can't describe text over a photo or gradient. **Fix:** test against the lightest area behind the text, add a solid or semi-opaque overlay, or put the text on a solid panel.

## How to fix a failing pair, step by step

1. Enter both colors in **Text color** and **Background color** in the [Contrast Checker](/online-tool/color-tools/contrast-checker). HEX, `rgb()`, `hsl()` and common color names all work, or use the pickers.
2. Read the **Contrast ratio** and the five pass/fail checks: AA normal, AA large, AAA normal, AAA large, and UI components & icons.
3. Look at the live preview, which shows a large bold line at 24px and a normal-size sentence in your colors.
4. Adjust the text color's lightness a few points at a time. An easy method is entering it as `hsl()` and lowering only the last number.
5. Use **⇄** to swap text and background if you're testing an inverted style, such as dark mode buttons.

The calculation runs in your browser.

To build a set of shades to choose from, the [HEX to HSL converter](/online-tool/color-tools/hex-to-hsl) shows how to step lightness without changing hue.

## FAQ

### Does passing contrast mean my site is accessible?

It means one important criterion is met. Accessibility also covers keyboard navigation, alt text, focus indicators, form labels and more. Contrast is necessary but not sufficient.

### Do logos and brand names need to pass?

No. WCAG exempts text that's part of a logo or brand name, as well as purely decorative text. Everything else that conveys information should pass.

### Why does the ratio change when I swap the colors?

It shouldn't, and it doesn't: the ratio is the same either way. Only the preview changes, which is useful to see how an inverted style looks.

Check your palette's text and background pairs in the [Contrast Checker](/online-tool/color-tools/contrast-checker) before you ship.
