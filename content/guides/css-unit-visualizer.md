---
slug: css-units-explained-rem-em-vw-in-pixels
tool: css-unit-visualizer
title: rem, em, vw or px? What Each CSS Unit Is Really Relative To
description: How browsers turn rem, em, %, vw, vh, ch and pt into pixels, with one length converted every way and a box sized in viewport units.
tags: [CSS, Web Design, Front End]
---

Every CSS length ends up as pixels, but each unit measures against something different. `px`, `pt`, `cm` and `in` are fixed. `rem` follows the root font size, and `em` follows the parent's font size. `%` follows the parent element, and `vw` and `vh` follow the browser window. With the default 16 px root font, `1rem` is 16 px, so `10rem` is 160 px.

The confusion starts when those reference sizes change. This guide explains the four families of units, then converts one length through all of them in the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer) so you can see how the context changes the answer.

## Why are there so many units?

CSS units are defined in the W3C's CSS Values and Units module. They exist because a web page has several reference sizes, and different parts of a design should follow different ones. A border should stay one pixel thin. A paragraph's margin should grow when the reader enlarges their text. A hero banner should scale with the window. One unit can't do all three.

The visualizer groups the units the way the specification does and labels each result with its family: Absolute, Font-relative, Viewport and Parent-relative.

## What does "absolute" mean for px and in?

A CSS pixel is not a physical screen pixel. The specification defines a reference pixel and then fixes the other absolute units against it: 1 in = 96 px, 1 cm = 96 ÷ 2.54 px, and 1 pt = 1/72 in = 1.333 px. These ratios hold on every device. On a high-density phone, one CSS pixel may cover three device pixels, but `1in` is still `96px`.

So "absolute" means fixed relative to each other, not true to a ruler. A `1in` line on a monitor rarely measures exactly one inch. The physical units are mostly useful in print stylesheets.

## How do rem and em differ?

`rem` stands for "root em". It always refers to the font size of the `html` element, which browsers set to 16 px by default. If a reader raises their default font size to 20 px in the browser settings, every rem-based size grows by 25%. That is why rem is the usual choice for type and spacing.

`em` refers to the font size of the parent when you use it for `font-size`. Nesting compounds it: a list at `1.2em` inside another list at `1.2em` ends up 1.44 times the base. `ch` is the width of the "0" glyph and `ex` is the height of a lowercase "x". Both depend on the font, so the visualizer measures them in your browser instead of assuming fixed values.

## Worked example: 10rem in every unit

Set the **Context** fields to **Root font (rem)** 16, **Parent font (em)** 20, **Parent width (%)** 800, **Viewport width** 1440 and **Viewport height** 900. The viewport fields start out filled with your own window size, so type these values in to follow along. Under **Convert a length**, enter **Value** 10 and **Unit** rem. The headline reads `10rem = 160px`, and the list below converts those 160 pixels into every other unit:

| Unit | Result     | Why                             |
| ---- | ---------- | ------------------------------- |
| px   | 160px      | 10 × 16 px root font            |
| em   | 8em        | 160 ÷ 20 px parent font         |
| %    | 20%        | 160 ÷ 800 px parent width × 100 |
| vw   | 11.111vw   | 160 ÷ 14.4 px (1% of 1440)      |
| vh   | 17.778vh   | 160 ÷ 9 px (1% of 900)          |
| vmin | 17.778vmin | uses the smaller side, 900 px   |
| vmax | 11.111vmax | uses the larger side, 1440 px   |
| pt   | 120pt      | 160 × 0.75                      |
| mm   | 42.333mm   | 160 ÷ 3.7795 px per mm          |
| in   | 1.667in    | 160 ÷ 96                        |

The key detail is the em row. The same 160 px is 10rem but only 8em, because the parent font here is 20 px, not 16. Change **Parent font (em)** back to 16 and em matches rem again. Results are rounded to three decimals, and each row has a copy button. **Reset** sets the context back to 16 px fonts, an 800 px parent and your current window, and sets the value back to 10 rem.

## How do viewport units behave?

`1vw` is 1% of the viewport width and `1vh` is 1% of its height. `vmin` and `vmax` take the smaller or the larger side, which helps when one layout has to work in both portrait and landscape.

The **Size a box inside the viewport** section makes this visible. It starts with a box of 50 vw by 20 vh. In the 1440 × 900 viewport above, that resolves to 720 × 180 px. The tool draws the viewport at a reduced scale and places the box inside it, with the matching CSS line below, such as `width: 50vw; /* 720px */`. Change the viewport width and the box stretches with it, while a box sized in rem stays put.

On phones, `100vh` can be taller than the visible area, because it counts the space behind the address bar. Newer units such as `dvh` and `svh` solve this. The tool doesn't convert them, but its notes point them out.

The **How big is 1 of each unit?** chart draws one of each unit as a bar, colored by family, so you can see at a glance that 1vw at a desktop width is close to 1rem.

## Related tools

Once you've chosen sizes, try them in a real layout with the [Flexbox playground](/online-tool/developer-tools/flexbox-playground). For paper sizes, screen resolutions and a px-to-pt table, see the [measurement reference](/online-tool/reference-tools/measurement-reference).

## FAQ

### Should I use rem or px for font sizes?

rem, in most cases. It respects the reader's browser font-size setting, while px ignores it. Keep px for hairline details such as borders.

### What does a percentage refer to?

Usually the parent element. A percentage width uses the parent's width. Vertical padding and margin also use the parent's width, which surprises many people.

### Why are my ch and ex numbers different from a colleague's?

They depend on the default font. The visualizer measures the glyphs in your browser, so a different font gives different ratios.

Convert your own values in the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer).
