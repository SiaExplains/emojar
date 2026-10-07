---
slug: color-harmony-rules-how-to-choose-a-palette
tool: color-palette-generator
title: 'Complementary, Analogous or Triadic? Choosing a Color Scheme'
description: A decision guide to the seven color harmony rules, what each one produces from a single base color, and which to pick for websites, brands and slides.
tags: [Color, Design, Decision Guide]
---

Pick an analogous or monochromatic scheme when you want something calm and cohesive, complementary when you need one strong accent that pops, and triadic or tetradic when you want variety and can manage several bold colors. For most websites and apps, the safest start is a monochromatic or analogous base plus a single complementary accent for buttons and highlights.

Every harmony rule works the same way: it takes your base color's position on the color wheel and picks other hues at fixed angles from it. Here's what each rule produces and when it's the right call.

## The seven harmony rules at a glance

These are the rules in the [Color Palette Generator](/online-tool/color-tools/color-palette-generator), with exactly what each one generates from your base color:

| Harmony             | What you get                                                                             | Feel                                    | Good for                                  |
| ------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| Analogous           | 5 neighboring hues: −60°, −30°, base, +30°, +60°                                         | Harmonious, natural                     | Illustrations, backgrounds, calm brands   |
| Complementary       | Base, a lighter base, the opposite hue (180°), plus a lighter and a darker version of it | High contrast, energetic                | A main color plus a call-to-action accent |
| Triadic             | Three hues 120° apart, plus lighter versions of the first two                            | Vibrant, playful                        | Kids' products, data visualization, games |
| Tetradic (square)   | Four hues 90° apart, plus a lighter base                                                 | Rich, busy                              | Complex dashboards, editorial graphics    |
| Split complementary | Base, two hues at 150° and 210°, plus a lighter and darker base                          | Contrasty but softer than complementary | Marketing pages, posters                  |
| Monochromatic       | One hue at five lightness levels (15–75%), slightly less saturated as it gets lighter    | Clean, elegant                          | UI themes, minimal brands                 |
| Tints & shades      | One hue at seven lightness levels, from 95% down to 18%                                  | Systematic                              | Design-system color scales                |

## A worked example

With the tool's default base color, indigo `#6366f1`, here's what three of the rules produce:

- **Complementary:** `#6467f2` `#c2c3fa` `#f2ef64` `#faf9c2` `#ddd913`. Indigo paired with a strong yellow: perfect if you want one unmistakable "Buy now" button.
- **Analogous:** `#64f2ef` `#64adf2` `#6467f2` `#a864f2` `#ef64f2`. A cool sweep from cyan through blue and violet to magenta.
- **Monochromatic:** `#060746` `#0f118a` `#1c1eca` `#5052e2` `#9495eb`. Five indigos, from near-navy to a soft lavender.

You may notice the base appears as `#6467f2` rather than `#6366f1`. The generator works in HSL with whole-number values, and converting back can shift a channel by one step. The difference is invisible, but if you need your exact brand HEX in the output, paste it over the base swatch's value in your CSS.

## How to choose: a short decision guide

**You have a brand color and need a website palette.**
Use **Tints & shades** for backgrounds, borders and text, then switch to **Complementary** and borrow just the opposite hue as your accent.

**You want a calm, cohesive look.**
**Analogous** or **Monochromatic**. Both are hard to get wrong. Watch out for low contrast between neighboring colors; they're too similar for text on background.

**You need clearly distinct colors for a chart.**
**Triadic** or **Tetradic**. Hues 90–120° apart are easy to tell apart in a legend. Check that they also differ in lightness so the chart still works for color-blind readers and in grayscale printouts.

**You want energy without clashing.**
**Split complementary** gives contrast like complementary, but the two accent hues sit either side of the opposite, which is usually easier to balance.

## Don't use every color equally

A palette is a set of options, not a rule to use all five colors in equal amounts. The classic 60-30-10 guideline works well:

- **60%** dominant color, usually a light tint or neutral for backgrounds
- **30%** secondary color, for sections, cards and navigation
- **10%** accent, for buttons, links and highlights

In a complementary scheme, the complement is almost always the 10%.

## How to generate a palette step by step

1. Choose a **Base color** with the color input, or press **🎲 Random** for a random starting point with moderate saturation and lightness.
2. Pick a rule from the **Harmony** dropdown. The swatches update instantly.
3. Click any swatch to copy its HEX code (it briefly shows "Copied!").
4. Under **CSS variables**, click **Copy** to grab all colors as custom properties (`--color-1`, `--color-2` and so on) in a `:root` block.

Everything runs in your browser.

Before shipping, test text and background pairs in the [Contrast Checker](/online-tool/color-tools/contrast-checker); harmonious doesn't mean readable. And if you want to blend two palette colors into a background, try the [CSS Gradient Generator](/online-tool/color-tools/gradient-generator).

## FAQ

### Can I enter an exact HEX code as the base color?

The base color is chosen with your browser's color input, which on most systems includes a field for typing a HEX value. Paste your brand code there.

### Why do some generated colors look too bright or neon?

Harmony rules keep your base color's saturation and lightness and only rotate the hue. A saturation that looks fine for indigo can look neon for yellow or green. Lower the base saturation, or adjust individual colors afterward.

### How many colors should a brand palette have?

Typically one or two primary colors, one accent, and a set of neutrals for text and backgrounds. More than that gets hard to apply consistently.

Find your scheme in a few clicks with the [Color Palette Generator](/online-tool/color-tools/color-palette-generator).
